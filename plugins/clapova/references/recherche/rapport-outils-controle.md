# Outils open source pour l'autocontrôle d'une vidéo de motion design

Vidéo de test : `scratchpad/nova-hyper/nova-hyper.mp4` (1080x1920, 30 i/s, 15,02 s, avec audio).
Environnement : `scratchpad/deep/tools/venv` (scenedetect 0.7.2, opencv-headless, rapidocr-onnxruntime, librosa, pyloudnorm).
Recherche web non lancée : licences et cibles tirées de la documentation connue des projets, à revérifier avant publication commerciale.

## 1. Résultats des tests réels

| Outil | Résultat sur nova-hyper | Temps |
|---|---|---|
| ffmpeg ebur128 (peak=true) | I = **-14,1 LUFS**, LRA 0,9 LU, true peak **-3,8 dBTP** | 1,8 s |
| pyloudnorm (stéréo 48 kHz) | -14,1 LUFS (identique à ffmpeg). En mono 22 kHz : -17,4 (piège : mesurer en stéréo) | <1 s |
| ffmpeg blackdetect + freezedetect | aucun écran noir (>=0,1 s), aucune image figée (>=0,5 s) | 2,1 s |
| ffmpeg scene > 0,3 | 19 images au-dessus du seuil, en grappes (0,47-0,57 ; 2,37-2,47 ; 3,87-3,97 ; 6,6 ; 7,27 ; 8,7-10 ; 10,87-10,97) : il faut regrouper sur 0,2 s, et les flashs/zooms donnent des faux positifs | 1,6 s |
| PySceneDetect detect-content | 10 plans : 0-1,70 / 2,47 / 3,13 / 5,40 / 6,60 / 7,27 / 10,97 / 12,90 / 14,50 / 15,00, plan moyen 1,5 s. Dernier plan de 0,5 s à vérifier | 2,2 s (203 i/s) |
| librosa beat_track | 136 BPM, 28 temps de 0,39 à 12,03 s (aucun temps après 12 s : la musique s'arrête ou faiblit, à vérifier) | 11 s |
| Coupes alignées sur un temps (tolérance 2 images = 67 ms) | 3 sur 9 (écarts en ms : 30, 63, 183, 130, 210, 27, 153, 870, 2470) | calcul instantané |
| RapidOCR (moteur PaddleOCR en ONNX) | 1 s : « FROID » conf 0,77, hauteur 269 px ; 13 s : « 12 H DE CHAUD » 0,82 (67 px) + « Commande sur nova.fr » 0,91 (41 px = 2,1 % de la hauteur, petit) ; 5 s et 9 s : rien | 0,5-1,2 s par image, CPU |

Non testés (trop lourds ou pas nécessaires ici) : TransNetV2, VMAF, CLIP, Tesseract, EasyOCR, essentia, madmom.

## 2. Audio

| Outil | Mesure | Commande | Licence | Fiabilité |
|---|---|---|---|---|
| ffmpeg `ebur128` | LUFS intégré, court terme, LRA, true peak | `ffmpeg -nostats -i v.mp4 -af ebur128=peak=true -f null -` (lire le résumé sur stderr) | LGPL/GPL | référence EBU R128 / BS.1770, ~0,1 s par minute de vidéo |
| ffmpeg `loudnorm` | mesure puis normalise (deux passes) | passe 1 : `-af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null -`, passe 2 : on réinjecte les `measured_*` avec `linear=true` | idem | fiable ; une seule passe = normalisation dynamique qui écrase les transitoires |
| pyloudnorm | LUFS intégré (BS.1770-4) | `pyln.Meter(sr).integrated_loudness(data)` | MIT | même valeur que ffmpeg en stéréo ; pas de true peak |
| librosa | BPM, temps (beats), onsets | `librosa.beat.beat_track`, `librosa.onset.onset_detect` | ISC | bon sur la musique électro et pop, peut doubler ou diviser le tempo ; 11 s pour 15 s ici (temps surtout pris par le chargement à froid) |
| aubio | tempo et onsets, très rapide, CLI `aubio beat f.wav` | | GPL-3 | correct, temps réel |
| madmom | temps et mesures (RNN+DBN), le plus précis | `DBNBeatTrackingProcessor` | code BSD, **modèles CC BY-NC-SA** (pas d'usage commercial) | état de l'art, mais licence bloquante |
| essentia | `RhythmExtractor2013`, tonalité, mood | | **AGPL-3** | très complet ; AGPL gênant derrière un service |

Cibles de loudness (2026, usage courant) : YouTube, Spotify, TikTok, Instagram : **-14 LUFS** intégré (les plateformes ne font que baisser le son, une vidéo à -10 sera ramenée à -14). Apple : -16. Télé EBU R128 : -23 ±1. True peak <= **-1 dBTP** (-2 si le fichier sera recompressé en AAC à bas débit). Pour la voix : dialogue au-dessus de la musique d'au moins 6 à 10 LU.

Ducking automatique : `[music][voice]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=300[m];[m][voice]amix=inputs=2:normalize=0` (on duplique la voix avec `asplit` pour qu'elle serve à la fois de clé et de signal). Contrôle : comparer le LUFS court terme de la musique seule pendant et hors des passages de voix (`ebur128` sur chaque piste).

Alignement des coupes : pour chaque coupe (PySceneDetect), distance au temps le plus proche (librosa). Seuil : <= 2 images (67 ms à 30 i/s). Objectif : au moins 60 % des coupes sur un temps, les autres de façon assumée (contre-temps). Résultat nova-hyper : 33 %.

### Banques de SFX libres

| Banque | Licence | Points d'attention |
|---|---|---|
| Freesound | par son : CC0, CC BY, CC BY-NC | filtrer `license:"Creative Commons 0"` dans l'API ; CC BY = crédit obligatoire ; NC = interdit en pub |
| Sonniss GDC Bundle | licence libre de droits propre à Sonniss, usage commercial, sans crédit | interdit de redistribuer les fichiers seuls ; vérifier la clause sur l'entraînement d'IA |
| Pixabay (sons) | Pixabay Content License | commercial OK sans crédit ; interdit de revendre le son tel quel ; quelques signalements Content ID |
| Mixkit | Mixkit Free License | commercial OK ; interdit de redistribuer en banque |

Garder un `sfx_manifest.json` (fichier, source, URL, licence) et le vérifier dans le contrôle.

## 3. Image

| Outil | Mesure | Commande | Temps | Licence | Fiabilité |
|---|---|---|---|---|---|
| ffmpeg `blackdetect` | écrans noirs | `-vf blackdetect=d=0.1:pix_th=0.10 -an -f null -` | ~1x la durée/7 | LGPL | très fiable ; un fond sombre volontaire peut déclencher |
| ffmpeg `freezedetect` | images figées | `freezedetect=n=0.003:d=0.5` | idem | LGPL | fiable ; un aplat de motion design sans mouvement est détecté (c'est voulu : signal d'un plan mort) |
| ffmpeg `scene` | score de changement par image | `-vf "select='gt(scene,0.3)',showinfo"` | 1,6 s / 15 s | LGPL | bruité en motion design (flashs, zooms) ; regrouper les détections proches de moins de 0,2 s |
| PySceneDetect | liste des plans | `scenedetect -i v.mp4 -o out detect-content list-scenes` (ou `detect-adaptive`) | 200 i/s CPU | BSD-3 | bon ; `detect-adaptive` résiste mieux aux mouvements rapides |
| TransNetV2 | coupes et fondus (réseau de neurones) | `pip install transnetv2-pytorch` | GPU conseillé, quelques s/min | MIT | le meilleur sur fondus et transitions progressives |
| RapidOCR / PaddleOCR | texte, boîte, confiance | voir `ocr.py` | 0,5-1,2 s / image CPU | Apache-2 | bon sur les gros titres ; les petits textes stylisés ont une confiance plus basse |
| Tesseract | texte | `tesseract f.png - --psm 11` | 0,3 s | Apache-2 | faible sur le texte sur fond animé ou détouré |
| EasyOCR | texte | `easyocr.Reader(['fr','en'])` | 1-3 s CPU | Apache-2 | correct, lourd (PyTorch) |
| Contraste WCAG | rapport de luminance texte/fond dans la boîte OCR | k-moyennes à 2 couleurs dans la boîte, `(L1+0.05)/(L2+0.05)` | instantané | — | approximation ; seuil 4,5:1 (3:1 pour un texte de grande taille) |
| VMAF | qualité de l'export par rapport au master | `ffmpeg -i export.mp4 -i master.mov -lavfi libvmaf -f null -` | ~0,5x temps réel | BSD-2-Patent | référence ; exige un master et un ffmpeg compilé avec libvmaf |
| Flux optique (OpenCV Farneback) | quantité de mouvement par plan | `cv2.calcOpticalFlowFarneback` sur 1 image sur 3, réduite à 270 px | ~1 s / 15 s | Apache-2 | détecte les plans morts et les mouvements trop violents |
| SSIM (`skimage` ou ffmpeg `ssim`) | ressemblance d'un recadrage produit entre deux plans | `structural_similarity(a,b)` | ms | BSD | sensible au cadrage : comparer des recadrages alignés, sinon préférer CLIP |
| CLIP / open_clip | contenu attendu (« bouteille isotherme bleue ») ; ressemblance produit entre plans (cosinus des vecteurs d'image) | `open_clip` ViT-B-32 | ~0,1 s/image CPU | MIT | bon pour dire « présent ou absent » ; seuils à calibrer (similarité texte-image > 0,25, image-image > 0,85) |

Zones sûres en 9:16 (TikTok, Reels, Shorts) : marge haute 220 px, basse 420 px, droite 140 px (colonne d'icônes), gauche 60 px, pour 1080x1920. Texte minimum : 3 % de la hauteur (58 px) pour un texte secondaire, 5 % pour un titre. Durée de lecture : au moins 0,3 s par mot + 0,5 s, et au moins 1 s par carton.

## 4. Proposition : script `controle_video.py`

Entrées : `video` (obligatoire), `platform` (tiktok, reels, shorts, youtube : choisit la cible LUFS et les zones sûres), `expected` (facultatif : liste de prompts CLIP, textes attendus), `product_ref` (facultatif : image du produit), `sfx_manifest` (facultatif), `master` (facultatif, pour VMAF), `fast` (sans CLIP ni VMAF).

Étapes (environ 10 à 20 s pour 15 s de vidéo en mode rapide, sur CPU) :
1. `ffprobe` : résolution, i/s, durée, présence d'audio.
2. `ebur128` + `blackdetect` + `freezedetect` en un seul passage ffmpeg.
3. PySceneDetect `detect-adaptive` : plans.
4. librosa : BPM, temps, écart de chaque coupe au temps le plus proche ; vérifier que la musique couvre toute la vidéo (RMS par seconde de la piste).
5. OCR sur 2 images par seconde (sans recherche de texte les mêmes images de suite) : textes, taille, durée à l'écran, position par rapport aux zones sûres, contraste.
6. Facultatif : flux optique par plan, CLIP, SSIM ou CLIP image-image sur le produit, VMAF.

Seuils (statut `ok` / `warn` / `fail`) :

| Contrôle | ok | warn | fail |
|---|---|---|---|
| LUFS intégré | cible ±1 | ±2 | au-delà |
| True peak | <= -1 dBTP | -1 à 0 | > 0 |
| Écran noir | aucun | <= 0,2 s en transition | > 0,2 s ou en début/fin |
| Image figée | aucune | 0,5 à 1 s | > 1 s |
| Durée d'un plan | 0,4 à 4 s | < 0,4 ou 4 à 6 s | > 6 s |
| Coupes sur un temps (±67 ms) | >= 60 % | 30 à 60 % | < 30 % |
| Musique couvre la vidéo | jusqu'à la fin -0,5 s | — | silence > 1 s |
| Texte : hauteur | >= 3 % | 2 à 3 % | < 2 % |
| Texte : durée | >= 0,3 s/mot + 0,5 s | -20 % | moins |
| Texte : zone sûre | dedans | déborde < 20 px | au-delà |
| Contraste | >= 4,5 | 3 à 4,5 | < 3 |
| Accroche (0-1 s) | un plan ou un texte change avant 1 s | — | rien de net |
| Produit (CLIP image-image) | >= 0,85 | 0,75-0,85 | < 0,75 |
| SFX | tout est dans le manifeste en CC0 ou licence commerciale | CC BY sans crédit | NC ou inconnue |

Sortie JSON :

```json
{
  "video": "nova-hyper.mp4", "platform": "tiktok",
  "meta": {"w":1080,"h":1920,"fps":30,"duration":15.02,"audio":true},
  "score": 7.4,
  "checks": [
    {"id":"loudness","status":"ok","value":-14.1,"target":-14,"unit":"LUFS"},
    {"id":"true_peak","status":"ok","value":-3.8,"unit":"dBTP"},
    {"id":"black","status":"ok","events":[]},
    {"id":"freeze","status":"ok","events":[]},
    {"id":"shots","status":"warn","count":10,"bounds":[0,1.7,2.467,3.133,5.4,6.6,7.267,10.967,12.9,14.5,15.02],"issues":[{"t":14.5,"msg":"dernier plan de 0,52 s"}]},
    {"id":"beat_sync","status":"warn","bpm":136,"on_beat_ratio":0.33,"offsets_ms":[30,63,183,130,210,27,153,870,2470]},
    {"id":"music_coverage","status":"warn","last_beat":12.03,"msg":"aucun temps détecté après 12 s"},
    {"id":"text","status":"warn","items":[
      {"t":[0.5,2.0],"text":"FROID","h_pct":14.0,"conf":0.77,"safe":true,"contrast":null},
      {"t":[12.9,15.0],"text":"Commande sur nova.fr","h_pct":2.1,"conf":0.91,"safe":true,"issue":"texte trop petit"}]}
  ],
  "fixes": ["Agrandir « Commande sur nova.fr » à au moins 58 px",
            "Caler les coupes 3,13, 5,40, 6,60 et 10,97 s sur le temps le plus proche",
            "Prolonger la musique jusqu'à 15 s avec un fondu final"]
}
```

Score : 10 moins 1,5 par `fail` et 0,5 par `warn`, plafonné à 5 si un `fail` porte sur le son, un écran noir ou une zone sûre. Les valeurs de text (`t`, `h_pct`) ci-dessus sont reconstruites à partir des tests sur 4 images ; le script réel les mesure sur 2 images par seconde.

Où le placer :
- Skill `controle-qualite` : `scripts/controle_video.py` + `requirements.txt` (scenedetect, opencv-python-headless, rapidocr-onnxruntime, librosa, pyloudnorm, soundfile ; options : open_clip_torch, scikit-image). Il ne dépend que de logiciels sous licences permissives, ffmpeg système. Exclure madmom (modèles NC) et essentia (AGPL).
- Outil MCP `analyze_edit` (côté Clapova, sur le rendu) : mêmes entrées (`mediaId` ou `projectId` + `platform`), renvoie ce JSON. `review_montage` peut le prendre en compte pour sa note /10 et pour la liste de corrections, et `place_sfx_from_events` peut réutiliser `beats`.
