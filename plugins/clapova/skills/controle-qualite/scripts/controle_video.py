#!/usr/bin/env python3
"""controle_video.py : mesures objectives d'une vidéo exportée (son, noir, figé, plans,
temps musicaux, texte à l'écran, zones sûres) et sortie JSON avec statut ok/warn/fail.

Usage :
  python3 controle_video.py video.mp4 [--platform tiktok|reels|shorts|pinterest|youtube]
                            [--fast] [--ocr-fps 2] [--out rapport.json]

Dépendances : ffmpeg/ffprobe (obligatoires). Optionnelles, détectées au démarrage :
  scenedetect (BSD-3, plans), librosa (ISC, BPM et temps), rapidocr_onnxruntime +
  opencv-python-headless (Apache-2.0, texte). Sans elles : mode dégradé (plans par le
  filtre ffmpeg `scene`, pas de temps musicaux, pas d'OCR), signalé dans `mode`.
Jamais : madmom (modèles NC), essentia (AGPL), aubio (GPL).

Seuils : `references/synthese-motion-design.md` (racine du plugin) §3 et rapport-outils-controle.md §4.
Les valeurs marquées « proposé » attendent la validation de l'utilisateur.
"""
import argparse, json, math, os, re, shutil, subprocess, sys, tempfile, time

def have(mod):
    try:
        __import__(mod); return True
    except Exception:
        return False

OPT = {"scenedetect": have("scenedetect"), "librosa": have("librosa"),
       "ocr": have("rapidocr_onnxruntime") and have("cv2"), "numpy": have("numpy")}

# Cibles (synthèse §3.9, §3.10, C7 ; proposé, à confirmer)
LUFS_TARGET, TP_MAX = -14.0, -1.5
SAFE = {  # zone vitale en 1080x1920 : x0, y0, x1, y1
    "vertical": (120, 270, 900, 1248),
    "pinterest": (65, 270, 885, 1130),
}
TEXT_OK_PX, TEXT_FAIL_PX = 58, 44  # en hauteur 1920 (proposé)

def run(cmd, timeout=600):
    p = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    return p.returncode, p.stdout, p.stderr

def probe(path):
    _, out, _ = run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", path])
    d = json.loads(out or "{}")
    v = next((s for s in d.get("streams", []) if s.get("codec_type") == "video"), {})
    a = any(s.get("codec_type") == "audio" for s in d.get("streams", []))
    num, den = (v.get("r_frame_rate", "30/1").split("/") + ["1"])[:2]
    fps = float(num) / float(den or 1) if float(den or 1) else 30.0
    return {"w": int(v.get("width", 0)), "h": int(v.get("height", 0)), "fps": round(fps, 3),
            "duration": round(float(d.get("format", {}).get("duration", 0)), 3), "audio": a}

def ffmpeg_pass(path, has_audio):
    """Un seul passage : ebur128 + blackdetect + freezedetect + score de scène."""
    vf = "blackdetect=d=0.1:pix_th=0.10,freezedetect=n=0.003:d=0.5,select='gt(scene,0.3)',metadata=print"
    cmd = ["ffmpeg", "-nostats", "-hide_banner", "-i", path, "-vf", vf]
    cmd += ["-af", "ebur128=peak=true"] if has_audio else ["-an"]
    cmd += ["-f", "null", "-"]
    _, _, err = run(cmd)
    res = {"lufs": None, "lra": None, "tp": None, "black": [], "freeze": [], "scene": []}
    m = re.search(r"Integrated loudness:\s*I:\s*(-?[\d.]+|-inf)\s*LUFS", err)
    if m and m.group(1) != "-inf": res["lufs"] = float(m.group(1))
    m = re.search(r"Loudness range:\s*LRA:\s*([\d.]+)", err)
    if m: res["lra"] = float(m.group(1))
    m = re.search(r"True peak:\s*Peak:\s*(-?[\d.]+|-inf)", err)
    if m and m.group(1) != "-inf": res["tp"] = float(m.group(1))
    for s, e in re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", err):
        res["black"].append([float(s), float(e)])
    fs = [float(x) for x in re.findall(r"freeze_start: ([\d.]+)", err)]
    fe = [float(x) for x in re.findall(r"freeze_end: ([\d.]+)", err)]
    for i, s in enumerate(fs):
        res["freeze"].append([s, fe[i] if i < len(fe) else None])
    res["scene"] = [float(x) for x in re.findall(r"pts_time:([\d.]+)", err)]
    return res

def shots_scenedetect(path):
    from scenedetect import detect, AdaptiveDetector
    sl = detect(path, AdaptiveDetector())
    return [round(s[0].seconds if hasattr(s[0], 'seconds') else s[0].get_seconds(), 3) for s in sl[1:]]

def shots_from_scene(times):
    """Mode dégradé : regroupe les détections ffmpeg proches de moins de 0,2 s."""
    cuts, last = [], -1.0
    for t in sorted(times):
        if t - last > 0.2: cuts.append(round(t, 3))
        last = t
    return cuts

def beats_librosa(path, tmp):
    import librosa, numpy as np
    wav = os.path.join(tmp, "a.wav")
    run(["ffmpeg", "-v", "error", "-y", "-i", path, "-vn", "-ac", "1", "-ar", "22050", wav])
    y, sr = librosa.load(wav, sr=22050)
    tempo, frames = librosa.beat.beat_track(y=y, sr=sr)
    bt = librosa.frames_to_time(frames, sr=sr).tolist()
    rms = librosa.feature.rms(y=y, frame_length=sr, hop_length=sr)[0]
    return float(np.atleast_1d(tempo)[0]), [round(b, 3) for b in bt], [float(r) for r in rms]

def rms_per_second(path, tmp):
    """Couverture du son sans librosa : niveau RMS par seconde via ffmpeg astats."""
    _, _, err = run(["ffmpeg", "-nostats", "-hide_banner", "-i", path, "-vn", "-af",
                     "asetnsamples=n=48000,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level",
                     "-f", "null", "-"])
    out = []
    for v in re.findall(r"lavfi\.astats\.Overall\.RMS_level=(-?[\d.]+|-inf)", err):
        out.append(-120.0 if v == "-inf" else float(v))
    return out

def ocr_pass(path, meta, fps_s, tmp):
    import cv2
    from rapidocr_onnxruntime import RapidOCR
    eng = RapidOCR()
    d = os.path.join(tmp, "f"); os.makedirs(d, exist_ok=True)
    run(["ffmpeg", "-v", "error", "-y", "-i", path, "-vf", f"fps={fps_s}", os.path.join(d, "%05d.png")])
    files = sorted(os.listdir(d)); found = []
    for i, f in enumerate(files):
        t = round(i / fps_s, 3)
        img = cv2.imread(os.path.join(d, f))
        r, _ = eng(img)
        for box, txt, conf in (r or []):
            if float(conf) < 0.6 or not txt.strip(): continue
            xs = [float(p[0]) for p in box]; ys = [float(p[1]) for p in box]
            found.append({"t": t, "text": txt.strip(), "conf": round(float(conf), 2),
                          "box": [int(min(xs)), int(min(ys)), int(max(xs)), int(max(ys))],
                          "contrast": contrast(img, box)})
    items, last = [], {}
    for f in found:  # regroupe le même texte (espaces et ponctuation ignorés) sur des échantillons consécutifs
        k = re.sub(r"[^0-9a-zà-ÿ]", "", f["text"].lower())
        it = last.get(k)
        if it and f["t"] - it["t"][1] <= 1.0 / fps_s + 0.01:
            if f["t"] > it["t"][1]: it["t"][1] = f["t"]
            it["h_px"] = max(it["h_px"], f["box"][3] - f["box"][1])
            it["box"] = [min(it["box"][0], f["box"][0]), min(it["box"][1], f["box"][1]),
                         max(it["box"][2], f["box"][2]), max(it["box"][3], f["box"][3])]
            if f["contrast"] is not None:
                it["contrast"] = min(x for x in [it["contrast"], f["contrast"]] if x is not None)
        else:
            it = {"text": f["text"], "t": [f["t"], f["t"]], "conf": f["conf"],
                  "h_px": f["box"][3] - f["box"][1], "box": f["box"], "contrast": f["contrast"]}
            items.append(it); last[k] = it
    return items, len(files)

def lum(c):
    def ch(x):
        x = x / 255.0
        return x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4
    b, g, r = c
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)

def contrast(img, box):
    """Approximation WCAG : 2 couleurs dominantes (k-moyennes) dans la boîte OCR."""
    try:
        import cv2, numpy as np
        xs = [int(p[0]) for p in box]; ys = [int(p[1]) for p in box]
        roi = img[max(0, min(ys)):max(ys), max(0, min(xs)):max(xs)].reshape(-1, 3).astype("float32")
        if len(roi) < 20: return None
        _, _, centers = cv2.kmeans(roi, 2, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0), 2, cv2.KMEANS_PP_CENTERS)
        l1, l2 = sorted([lum(centers[0]), lum(centers[1])], reverse=True)
        return round(float((l1 + 0.05) / (l2 + 0.05)), 2)
    except Exception:
        return None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video"); ap.add_argument("--platform", default="tiktok")
    ap.add_argument("--fast", action="store_true", help="sans OCR ni librosa")
    ap.add_argument("--ocr-fps", type=float, default=2.0); ap.add_argument("--out")
    a = ap.parse_args()
    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        sys.exit("ffmpeg et ffprobe sont obligatoires")
    t0 = time.time(); tmp = tempfile.mkdtemp(prefix="cv_")
    meta = probe(a.video); dur = meta["duration"]; fps = meta["fps"] or 30
    tol = 2.0 / fps  # ±2 images
    checks, fixes, mode = [], [], []

    def add(c, fix=None):
        checks.append(c)
        if fix and c["status"] != "ok": fixes.append(fix)

    ff = ffmpeg_pass(a.video, meta["audio"])
    # Son
    if not meta["audio"]:
        add({"id": "audio_track", "status": "fail", "msg": "aucune piste audio"}, "Ajouter la piste son (voix, musique) puis réexporter")
    else:
        L = ff["lufs"]
        st = "fail" if L is None else ("ok" if abs(L - LUFS_TARGET) <= 1 else "warn" if abs(L - LUFS_TARGET) <= 2 else "fail")
        add({"id": "loudness", "status": st, "value": L, "target": LUFS_TARGET, "unit": "LUFS", "lra": ff["lra"]},
            f"Normaliser à {LUFS_TARGET} LUFS (loudnorm en deux passes, linear=true)")
        T = ff["tp"]
        st = "fail" if T is None or T > 0 else ("ok" if T <= TP_MAX else "warn")
        add({"id": "true_peak", "status": st, "value": T, "max": TP_MAX, "unit": "dBTP"},
            f"Limiter la crête vraie à {TP_MAX} dBTP")
    # Noir et figé
    bad_black = [b for b in ff["black"] if (b[1] - b[0]) > 0.2 or b[0] < 0.05 or b[1] > dur - 0.1]
    st = "ok" if not ff["black"] else ("fail" if bad_black else "warn")
    add({"id": "black", "status": st, "events": ff["black"]}, "Supprimer l'écran noir (trou de timeline ou fondu depuis le noir)")
    fr = [[s, e if e is not None else dur] for s, e in ff["freeze"]]
    st = "ok" if not fr else ("fail" if any(e - s > 1 for s, e in fr) else "warn")
    add({"id": "freeze", "status": st, "events": fr}, "Remplacer l'image figée par du mouvement ou couper le plan")
    # Plans
    cuts = None
    if OPT["scenedetect"]:
        try: cuts = shots_scenedetect(a.video); mode.append("scenedetect")
        except Exception as e: mode.append(f"scenedetect_erreur:{e}")
    if cuts is None:
        cuts = shots_from_scene(ff["scene"]); mode.append("ffmpeg_scene(dégradé)")
    bounds = [0.0] + cuts + [dur]
    lens = [round(bounds[i + 1] - bounds[i], 3) for i in range(len(bounds) - 1)]
    issues = []
    for i, l in enumerate(lens):
        if l > 6: issues.append({"t": bounds[i], "level": "fail", "msg": f"plan de {l:.2f} s (> 6 s)"})
        elif l > 4 or l < 0.4: issues.append({"t": bounds[i], "level": "warn", "msg": f"plan de {l:.2f} s"})
    st = "fail" if any(x["level"] == "fail" for x in issues) else ("warn" if issues else "ok")
    add({"id": "shots", "status": st, "count": len(lens), "bounds": [round(b, 3) for b in bounds],
         "mean": round(dur / max(1, len(lens)), 2), "issues": issues}, "Raccourcir ou redécouper les plans signalés (1,5 à 2,5 s)")
    first_cut = cuts[0] if cuts else dur
    # Temps musicaux et couverture
    if meta["audio"]:
        bpm, beats, rms = None, [], None
        if OPT["librosa"] and not a.fast:
            try: bpm, beats, rms = beats_librosa(a.video, tmp); mode.append("librosa")
            except Exception as e: mode.append(f"librosa_erreur:{e}")
        if beats and cuts:
            offs = [round(min(abs(c - b) for b in beats) * 1000) for c in cuts]
            ratio = sum(o <= tol * 1000 + 0.5 for o in offs) / len(offs)
            st = "ok" if ratio >= 0.6 else ("warn" if ratio >= 0.3 else "fail")
            add({"id": "beat_sync", "status": st, "bpm": round(bpm, 1), "tolerance_ms": round(tol * 1000),
                 "on_beat_ratio": round(ratio, 2), "offsets_ms": offs},
                "Caler les coupes sur le temps le plus proche (snap_cuts_to_beats)")
        elif not beats:
            add({"id": "beat_sync", "status": "skipped", "msg": "librosa absent ou --fast"})
        lvl = rms_per_second(a.video, tmp)
        silent_tail = 0
        for v in reversed(lvl):
            if v < -50: silent_tail += 1
            else: break
        longest, cur = 0, 0
        for v in lvl:
            cur = cur + 1 if v < -50 else 0; longest = max(longest, cur)
        st = "fail" if silent_tail > 1 or longest > 1 else "ok"
        c = {"id": "audio_coverage", "status": st, "silent_tail_s": silent_tail, "longest_silence_s": longest}
        if beats:
            c["last_beat"] = beats[-1]
            if dur - beats[-1] > 2 and st == "ok":
                c["status"] = "warn"; c["msg"] = f"aucun temps détecté après {beats[-1]:.1f} s"
        add(c, "Prolonger la musique jusqu'à la fin avec un fondu de sortie d'environ 1 s")
    # Texte
    if OPT["ocr"] and not a.fast:
        try:
            items, n = ocr_pass(a.video, meta, a.ocr_fps, tmp); mode.append(f"ocr({n} images)")
            sx, sy = meta["w"] / 1080.0, meta["h"] / 1920.0
            prof = "pinterest" if a.platform == "pinterest" else "vertical"
            z = SAFE[prof]; zone = (z[0] * sx, z[1] * sy, z[2] * sx, z[3] * sy)
            ok_px, fail_px = TEXT_OK_PX * sy, TEXT_FAIL_PX * sy
            worst = "ok"; out = []
            vertical = meta["h"] > meta["w"]
            for it in items:
                iss = []
                if it["h_px"] < fail_px: iss.append(("fail", f"texte trop petit ({it['h_px']} px < {fail_px:.0f})"))
                elif it["h_px"] < ok_px: iss.append(("warn", f"texte petit ({it['h_px']} px < {ok_px:.0f})"))
                shown = it["t"][1] - it["t"][0] + 1.0 / a.ocr_fps
                need = max(1.0, 0.3 * len(it["text"].split()) + 0.5)
                if shown < need * 0.8: iss.append(("fail", f"lu {shown:.1f} s < {need:.1f} s"))
                elif shown < need: iss.append(("warn", f"lu {shown:.1f} s < {need:.1f} s"))
                if vertical:
                    b = it["box"]; over = max(zone[0] - b[0], zone[1] - b[1], b[2] - zone[2], b[3] - zone[3], 0)
                    if over > 20: iss.append(("fail", f"hors zone sûre de {over:.0f} px"))
                    elif over > 0: iss.append(("warn", f"déborde de {over:.0f} px"))
                cr = it["contrast"]
                if cr is not None and cr < 3: iss.append(("fail", f"contraste {cr}:1"))
                elif cr is not None and cr < 4.5: iss.append(("warn", f"contraste {cr}:1"))
                lv = "fail" if any(x[0] == "fail" for x in iss) else ("warn" if iss else "ok")
                worst = "fail" if "fail" in (worst, lv) else ("warn" if "warn" in (worst, lv) else "ok")
                out.append({**it, "h_pct": round(100 * it["h_px"] / meta["h"], 1), "status": lv, "issues": [x[1] for x in iss]})
                for l, m in iss:
                    fixes.append(f"« {it['text']} » à {it['t'][0]:.1f} s : {m}")
            add({"id": "text", "status": worst, "profile": prof, "items": out})
            hook = any(i["t"][0] <= 1.0 for i in items) or first_cut <= 1.0
        except Exception as e:
            mode.append(f"ocr_erreur:{e}"); hook = first_cut <= 1.0
    else:
        add({"id": "text", "status": "skipped", "msg": "rapidocr absent ou --fast : texte à vérifier sur les images"})
        hook = first_cut <= 1.0 or None
    if hook is None:
        add({"id": "hook", "status": "warn", "msg": "pas de coupe avant 1 s et texte non mesuré : regarder 0-2,2 s"})
    else:
        add({"id": "hook", "status": "ok" if hook else "fail", "first_cut": first_cut},
            "Accroche : faire changer un plan ou apparaître un texte avant 1 s")
    # Score (synthèse §5.2 S1)
    nf = sum(c["status"] == "fail" for c in checks); nw = sum(c["status"] == "warn" for c in checks)
    score = 10 - 1.5 * nf - 0.5 * nw
    if any(c["status"] == "fail" and c["id"] in ("loudness", "true_peak", "audio_track", "audio_coverage", "black", "text") and
           (c["id"] != "text" or any("zone" in s for i in c.get("items", []) for s in i["issues"])) for c in checks):
        score = min(score, 5)
    rep = {"video": os.path.basename(a.video), "platform": a.platform, "meta": meta,
           "mode": mode or ["ffmpeg"], "deps": OPT, "score": round(max(0, score), 1),
           "checks": checks, "fixes": fixes, "elapsed_s": round(time.time() - t0, 1)}
    js = json.dumps(rep, ensure_ascii=False, indent=2, default=float)
    if a.out:
        open(a.out, "w", encoding="utf-8").write(js)
    print(js)
    shutil.rmtree(tmp, ignore_errors=True)

if __name__ == "__main__":
    main()
