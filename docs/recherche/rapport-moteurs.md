# Outillage des skills motion/vidéo : analyse approfondie (24/10/2026)

Clones en lecture seule dans `scratchpad/deep/<repo>` (`--depth 1`, LFS ignoré). Aucun script des dépôts n'a été exécuté. Comparaison faite avec le fork `/home/user/ohvignas/clapova-engine` (commit `21bcfcc`) et les skills `plugins/clapova/skills/{monteur,motion-design}`.

| Projet | Fichiers | Licence |
|---|---|---|
| calesthio/OpenMontage | 2 208 | AGPL-3.0 (`LICENSE`, badge README) |
| heygen-com/hyperframes | 9 114 | Apache-2.0 |
| remotion-dev/skills (dont `remotion-render`) | 293 | **pas de fichier LICENSE dans le clone** (voir §3) |
| haidrrrry/claude-remotion-skill | 33 | MIT (2025 haidrrrry) |
| wilwaldon/Claude-Code-Video-Toolkit | **1 seul fichier : README.md** | MIT d'après le README (pas de fichier LICENSE) |

---

## 1. calesthio/OpenMontage

### Outils
Un registre d'outils Python (`tools/base_tool.py`, `tools/tool_registry.py`). Chaque outil déclare `dependencies`, `determinism`, `cost`, `input_schema`. Dépendances de base (`requirements.txt`) : pyyaml, pydantic, jsonschema, Pillow, numpy, requests, google-genai, openai, fastapi/uvicorn (serveur « Backlot » de storyboard), websockets. GPU à part : torch/torchaudio/torchvision.

| Outil (fichier) | Rôle | Commande ou extrait exact |
|---|---|---|
| `tools/analysis/composition_validator.py` | Contrôle **avant rendu**, sans navigateur : cuts présents, `out_seconds > in_seconds`, assets présents, voix off plus longue que la vidéo (erreur au-delà de 1 s), musique plus courte que la vidéo (avertissement) | `probe_duration()` via ffprobe |
| `tools/analysis/visual_qa.py` | Extrait des images à des instants donnés pour que l'agent les regarde, plus le niveau audio | `ffmpeg -y -ss <t> -i in -frames:v 1 -q:v 2 frame.jpg` ; audio : `ffmpeg -ss <t> -t 3 -i in -vn -af volumedetect -f null /dev/null` (mean/max_volume) |
| `tools/analysis/audio_energy.py` | Profil d'énergie de la musique : premier passage au-dessus d'un seuil en LUFS, fenêtre la plus forte pour une vidéo de N s, faut-il boucler | `-af ebur128` (sonie momentanée toutes les 100 ms, lue dans stderr) |
| `tools/analysis/scene_detect.py` | Détection de plans | PySceneDetect `ContentDetector(threshold=27)`, `ThresholdDetector(12)`, `AdaptiveDetector(3.0)` ; repli ffmpeg `select='gt(scene,0.3)',showinfo` |
| `tools/analysis/transcriber.py` | Transcription mot à mot + diarisation | faster-whisper / WhisperX (`whisperx.align`, `DiarizationPipeline`) |
| `tools/analysis/frame_sampler.py` | Échantillonnage par intervalle, nombre, instants, ou guidé par les scènes | ffmpeg |
| `tools/video/silence_cutter.py` | Coupes sèches | `silencedetect=noise=-35dB:d=<min>` |
| `tools/video/auto_reframe.py` | Recadrage 16:9 vers 9:16 | MediaPipe visages + OpenCV, puis filtre `crop` ; repli centre |
| `tools/audio/audio_mixer.py` | Mixage voix/musique/SFX | ducking `sidechaincompress=threshold=0.02:ratio=9:attack=200:release=500:level_sc=1:mix=0.9` ; `amix=...:normalize=0` ; `loudnorm=I=-16:LRA=11:TP=-1.5,aresample=48000` (-14 pour réseaux sociaux) |
| `tools/audio/audio_enhance.py` | Nettoyage voix | `highpass=f=80,` … `lowpass=f=13000/15000` |
| `tools/video/video_stitch.py` | Enchaînements | `xfade=transition=fade:duration=..:offset=..` + `acrossfade=d=..` |
| `tools/video/hyperframes_compose.py` | Pilote HyperFrames | `npx hyperframes doctor --json`, `lint`, `check`, `render` (`--strict`) |
| `tools/video/video_compose.py` (2 948 lignes) | Rendu + `final_review` automatique | voir boucle |
| `tools/analysis/video_downloader.py` | Téléchargement de références | `yt_dlp.YoutubeDL(ydl_opts)` |
| `tools/capture/*` | Capture d'écran | Playwright (`playwright.sync_api`) |
| `lib/slideshow_risk.py` | Score « effet diaporama » sur le plan de scènes, 6 dimensions notées 0-5 (répétition, visuels décoratifs, mouvement faible, intention de plan faible, trop de typo, « cinématique » non justifié). < 2 fort, < 3 acceptable, < 4 à revoir, ≥ 4 refus de passer au rendu | Python pur |
| `lib/variation_checker.py` | Repère les plans répétitifs et une liste de formulations creuses (« modern », « futuristic », « cutting-edge »…) | Python pur |
| `lib/delivery_promise.py` | Fixe la promesse (motion_led, source_led, data_explainer…) au stade proposition ; interdit de passer en silence d'une vidéo animée à des images fixes | Python pur |
| `lib/verify_scene_pacing.py` | Vérifie que chaque repère de narration a un événement visuel à ± 1 s | Python pur |
| `lib/scoring.py` | Choix de fournisseur par score pondéré (adéquation, qualité, contrôle…), justifiable | Python pur |
| Fournisseurs | ~40 générateurs vidéo/image/TTS/musique (Kling, Veo, Sora, Seedance, ElevenLabs, Suno, Pixabay, Freesound, Pexels…), banques libres (NASA, Wikimedia, archive.org…) | API externes |

Pas de détection de BPM (ni librosa ni aubio dans le dépôt : recherche `librosa|aubio` sans résultat dans `tools/` et `lib/`).

### Boucle
Pipelines YAML (`pipeline_defs/*.yaml`, 13 types) exécutés par des « directors » en Markdown (`skills/pipelines/<type>/{idea,script,scene,asset,edit,compose,publish}-director.md`). Après chaque étape : `skills/meta/reviewer.md`, puis `checkpoint-protocol.md` (écrit un checkpoint, demande l'accord humain si `human_approval_default: true`).

- **Reviewer** : validation du JSON contre `schemas/artifacts/*.schema.json`, puis revue des `review_focus` du manifeste. Règles « CHAI » : chaque critique doit être exacte (pointer un champ ou une image), complète, constructive (un `critical` sans `proposed_fix` est rétrogradé en `investigation`). Décision : 0 critique = PASS ; sinon REVISE, **au plus 2 tours**, puis PASS_WITH_WARNINGS (« never block indefinitely »).
- **Après rendu** (`compose-director.md` §6, obligatoire) : 6a `ffprobe -v quiet -print_format json -show_format -show_streams` (piste audio présente, durée ± 5 %, taille non nulle), 6b images au milieu de chaque cut, 6c **transcription du rendu** (0 mot = son absent ; moins de 80 % des mots du script = coupé), 6d revue visuelle, 6e comparaison transcription/script, 6f rapport à l'utilisateur.
- `video_compose._final_review` automatise une partie : ffprobe, 4 images à 10/35/65/90 %, **image noire si PNG < 2 000 octets** (heuristique), contrôle audio, préservation de la promesse, sous-titres, `transcript_comparison`. Statut `fail` → `re_render`.

### Script ou jugement
Scripté : validation de schéma, durées, présence des assets, ffprobe, image noire, transcription comparée au script, score diaporama, sonie. Laissé au modèle : lecture des images, goût, choix créatifs, application des correctifs.

### Licence
AGPL-3.0. Reprendre du code ou des textes oblige à publier sous AGPL, y compris pour un service en ligne (art. 13). **Ne rien copier.** Les idées (une heuristique, un seuil, l'ordre des contrôles) ne sont pas protégées : on peut les réimplémenter à partir de zéro.

---

## 2. heygen-com/hyperframes (skills/ + CLI) et le fork Clapova

### Outils
CLI TypeScript (`packages/cli/src/commands/*.ts`), Node 22+, FFmpeg, Chromium via Puppeteer (`browser ensure`). Commandes clés :

| Commande | Ce qu'elle fait (d'après `skills/hyperframes-cli/references/lint-validate-inspect.md` et le code) |
|---|---|
| `lint` | Statique : `data-composition-id` manquant, pistes qui se chevauchent, timelines non enregistrées, conflits transform GSAP/CSS |
| `check --json` | **Une seule session Chrome** : lint, puis balayage d'une grille de seek (9 échantillons par défaut, `--samples`, `--at`, `--at-transitions`). Sections : `runtime` (erreurs console, 4xx/5xx), `layout` (texte qui déborde, coupé, chevauchements, occlusion, sortie du cadre, `sweep_static`), `motion` (sidecar), `contrast` (WCAG AA 4,5:1 / 3:1, **chaque échec donne `suggestedColor`**), `craft`, `hdr`, `snapshots` |
| Craft (avertissements, balayage à 8 i/s) | `line_unread` : ligne lisible affichée moins de 0,4 s (1-2 mots) ou ¾·0,5 + 0,3 s par mot, 2 s pour la dernière ligne ; `dead_stretch` : plus de 3 s sans changement ; `text_below_floor` : texte < 2,6 % du petit côté (28 px en 1080) ; `first_frame_empty` : l'image 0 ne montre que le fond ; `film_silent` : plus de 15 s sans son |
| Sidecar `*.motion.json` | Assertions vérifiées sur la timeline seekée : `appearsBy(selector, bySec)`, `before(a,b)`, `staysInFrame`, `keepsMoving(maxStaticSec=2)`. Un sélecteur qui ne trouve rien est une erreur (`motion_selector_missing`) |
| Gravité selon la persistance | Un défaut vu sur un seul échantillon (entrée en cours) devient info ; tenu sur plusieurs échantillons, il bloque |
| Échappatoires | `data-layout-allow-overflow/overlap/occlusion/caption-zone`, `data-layout-ignore`, `data-hold`, `data-no-timeline` |
| `check --caption-zone "x0=0;y0=.82;x1=1;y1=1;severity=error"` | Texte dans la bande des sous-titres ; `--frame-check` : média sorti du cadre au-delà de max(120 px, 6 %) |
| `snapshot` | PNG à des instants ; `--zoom "#cta"` (crop à 3x par deviceScaleFactor) |
| `snapshot --review` (`snapshotReview.ts`) | 3 planches : `review-beats.jpg` (chaque scène à début + 0,3 s et au milieu, chaque `data-beat`), `review-seam-NN.jpg` (−0,2/−0,1/0/+0,1/+0,2 s autour de **chaque coupe**), `review-phone.jpg` (360 px de large) |
| `beats` | Décode la musique (ffmpeg) et suit le rythme en TS natif (`core/src/audioRhythm.ts`, `beats/beatDetection.ts`) : `beatTimes`, `beatStrengths` (RMS ± 50 ms), `bpm`, confiance (`high` si ≥ 0,35) ; échoue sans tempo stable. Pas de librosa/aubio |
| `audio <fichier> --json` | Onsets, beats, downbeats, bpm, sections, sonie, `--place-at 4.2` (où tomberait un SFX), `--read` (voix/effet/musique) |
| `normalize-audio` | Cible par défaut −16 LUFS (`studio-server/src/helpers/loudness.ts`), mesure `ebur128=peak=true`, s'arrête avant −1,5 dBTP ; `--reference` pour caler un clip sur un autre |
| `media-treatment`, `grade-compare` | Étalonnage et LUT au lieu des filtres CSS (règle 11 du contrat) |
| `transcribe` | whisper.cpp / sherpa / parakeet en local (`cli/src/whisper/`) |
| `keyframes`, `compare`, `motionShot` | Trajectoires, comparaison de rendus |
| `timeline move/trim/split/apply/undo` | Éditions avec reçu et annulation ; `history begin/undo/end` |
| `skills/remotion-to-hyperframes/scripts/render_diff.sh` | Compare deux rendus : `-lavfi "[0:v]scale=iw:ih[ref];[1:v]scale=iw:ih[main];[main][ref]ssim=stats_file=ssim.log"`, seuil SSIM moyen 0,85 |
| `.../lint_source.py` | Refuse de traduire un projet Remotion qui utilise `useState`, `useEffect` avec dépendances, `useReducer`, `calculateMetadata` async, une bibliothèque d'UI React |
| `skills/media-use/scripts/audio-duck.mjs` | Piste d'automation de ducking (duck 0,25, attaque 0,15 s, relâche 0,4 s, fusion des trous < 0,6 s) |
| `.../transcript-cut.mjs` | `--remove-fillers`, `--cut-silence` à partir de la transcription |
| `.../extract-audio-data.py` | RMS + bandes de fréquence par image (numpy + ffmpeg) pour visualiseurs |

Producteur : `producer/src/services/render/audioTruePeak.ts` mesure `-af ebur128=peak=true` sur le fichier rendu.

### Boucle (`skills/hyperframes/SKILL.md`, `hyperframes-cli/SKILL.md`, `references/review.md`)
1. Projet existant : `timeline --json`, puis `history --since mine` pour voir ce que la personne a changé.
2. Film de plus de 15 s : 3 trames narratives en mots (`story.md`), la personne choisit ; puis `SPEC.md` : chaque adjectif traduit en nombre, une ligne `BANNED:` (liste par défaut : fond noir ou bleu nuit vide, glow/néon/particules, dégradés violet-bleu, mesh, glass, tout centré, tout qui apparaît en fondu-glissé vers le haut, texte qui bouge pendant la lecture, trois cartes en ligne, logo dans un coin…). La liste grandit à chaque film.
3. `lint` pendant l'écriture, `check --json` comme barrière ; tant qu'une erreur de lint reste, les audits navigateur ne tournent pas (« 0 samples » veut dire rien n'a été vérifié).
4. `snapshot --review` + revue « directeur de motion sévère » : décrire chaque image comme un inconnu (un objet qu'il faut expliquer = P0), comparer au SPEC, nommer chaque défaut par défaut, planche téléphone.
5. Notes au format `t=4.2s · où · problème → changement exact · ce qui reste`, classées **P0/P1/P2**. Corriger tous les P0, les P1 utiles ; re-snapshot de ce qui a changé, une fois ; deuxième passe seulement si un P0 reste. **« Never score the film out of 10: a score finds nothing to fix. »** Option : un sous-agent qui ne reçoit que STORYBOARD.md et les 3 planches.
6. `REVIEW.md` : choix créatifs, ce qui a été mesuré contre ce qui a seulement été regardé (« le son a été mesuré, pas entendu »), plan le plus faible, avertissements gardés exprès.
7. Rendu seulement après accord sur l'aperçu ; ensuite vérifier que le fichier n'est pas vide et que la durée ffprobe égale `data-duration`, puis regarder des images décodées.

Règles son (`references/sound.md`) : chaque SFX a une cause visible (clic = vrai clic, whoosh = coupe ou grande carte rapide, pop = badge ou chiffre qui arrive, riser + impact une seule fois) ; pic du son **une image après** l'image ; 3 à 6 dB au-dessus du lit ; alterner 2-3 prises ; musique sous voix autour de 0,14 ; true peak ≤ −1 dBTP, mix −16 à −14 LUFS.

### Script ou jugement
Scripté : tout ce qui se mesure (débordement, contraste avec couleur proposée, durée de lecture, temps morts, image 0 vide, silence, motion intent, beats, sonie, SSIM). Jugement : lecture des planches, BANNED, histoire, P0/P1.

### Licence
Apache-2.0 : reprise, modification et usage commercial autorisés, à condition de garder la licence, le NOTICE et de signaler les fichiers modifiés. Le fork Clapova a déjà `LICENSE`, `NOTICE`, `PATCHES.md`. Les textes des skills sont aussi sous Apache-2.0 : reformulations possibles avec attribution.

### État du fork Clapova (constaté)
- Le fork contient `check.ts`, `beats.ts`, `audio.ts`, `normalize-audio.ts`, `snapshot.ts`, `keyframes.ts`, `transcribe.ts`. Il n'a **pas** `snapshotReview.ts` (planches beats/coutures/téléphone) : il est en retard sur l'amont.
- `packages/clapova-render/src/check.ts` : `checkComposition` appelle **seulement `lintProject`** (+ preflight optionnel). Les audits navigateur de `check` (layout, contraste, craft, motion) ne sont pas exposés au serveur.
- `previewFrames` rend un brouillon complet puis extrait des images avec ffmpeg (≤ 12 PNG, 540p).
- `feedback`, `publish`, `cloud` désactivés (`commands/disabled.ts`).

---

## 3. remotion-dev/skills (+ remotion-render)

### Outils
Uniquement du Markdown (11 skills, version 4.0.538) et 5 scripts de maintenance (`scripts/validate-links.ts`, `sync-*.ts` : vérification des liens et synchronisation du README, pas d'outil vidéo). Note : `skills/remotion-best-practices/` contient une copie complète des autres skills.

| Fichier | Outil | Extrait |
|---|---|---|
| `remotion-render/SKILL.md` | CLI Remotion | `npx remotion render` ; `npx remotion still` ; **plusieurs images en un appel** : `npx remotion render [id] out/frames --frames=0,30,90 --image-format=png` |
| `remotion-render/transparent-videos.md` | Alpha | ProRes : `--image-format=png --pixel-format=yuva444p10le --codec=prores --prores-profile=4444` ; WebM : `--pixel-format=yuva420p --codec=vp9` |
| `remotion-markup/ffmpeg.md` | ffmpeg embarqué | `npx remotion ffmpeg` / `npx remotion ffprobe` ; découpe préférée par `trimBefore` (sans réencodage), sinon réencoder : `-ss 00:00:05 -i in -to 00:00:10 -c:v libx264 -c:a aac` |
| `remotion-markup/silence-detection.md` | **Silence adaptatif** | 1) `-map 0:a -af loudnorm=print_format=json -f null /dev/null` → lire `input_thresh` ; 2) `-af "silencedetect=noise=${THRESH}dB:d=0.5"` ; silences à moins de 0,2 s l'un de l'autre fusionnés |
| `remotion-captions/transcribe-captions.md` | Whisper local | `@remotion/whisper-webgpu` + `@huggingface/transformers` + `mediabunny` (16 kHz mono) ; GPU requis, ONNX ne marche pas sur Linux arm64 |
| `remotion-multimedia/*` | Métadonnées | Mediabunny `input.computeDuration()`, dimensions |
| `remotion-markup/voiceover.md` | TTS | ElevenLabs `POST /v1/text-to-speech/{voiceId}`, `eleven_multilingual_v2`, puis `calculateMetadata` qui cale la durée sur l'audio |
| `remotion-markup/audio-visualization.md` | Spectre | `useWindowedAudioData`, `visualizeAudio({numberOfSamples: 256})` |
| `remotion-markup/sfx.md` | 32 SFX hébergés sur `remotion.media` (whoosh, whip, click, ding… et des mèmes) | URL |
| `remotion-create/video-layout.md` | Règles de cadre | marge 80 px côtés / 100 px haut-bas en 1080 ; titre ≥ 84 px, texte d'appui ≥ 44 px ; « Decide what the viewer should notice first » |

### Boucle
Routeur (`remotion-best-practices`) → `remotion-create` (scaffold `npx create-video@latest --yes --blank --no-tailwind`) → **ouvrir Studio avant d'écrire** et le garder ouvert pour que l'utilisateur guide → ne **pas** rendre par défaut sauf demande explicite. Aucune boucle d'auto-vérification par images ni score : la vérification est confiée à l'utilisateur dans Studio. Règle forte : « Preserve user changes » (si le code a changé hors conversation, ne pas écraser). Règles techniques : animer avec `useCurrentFrame()` + `interpolate()`, jamais CSS `transition`/`animation`.

### Script ou jugement
Rien n'est scripté côté skill ; tout est jugement + outils du framework.

### Licence
**Aucun fichier LICENSE dans le clone** ; `package.json` est `"private": true` et renvoie au monorepo `remotion-dev/remotion/packages/skills`. **Vérifié (complément)** : `remotion-dev/remotion/LICENSE.md` (clone sparse dans `scratchpad/deep/remotion/`), et `packages/skills/` n'a pas de licence propre, donc c'est elle qui s'applique. C'est la « Remotion License », source disponible, **pas open source** :
- Licence gratuite pour un particulier, une entreprise à but lucratif de **3 salariés au plus**, une association, ou une évaluation. Au-delà, il faut une « Company License » payante (remotion.pro).
- Usage interdit : « copy or modify Remotion code for the purpose of selling, renting, licensing, relicensing, or sublicensing your own derivate of Remotion ».
- Le fichier annonce un changement de licence en Remotion 5.0 (PR #3750, non lue).
- La page docs `packages/docs/docs/license.mdx` ne contient qu'un sommaire (composant `TableOfContents`) : pas de clause en plus. Je n'ai pas récupéré remotion.dev/license en ligne, puisque le LICENSE.md du dépôt fait foi.

Pour Clapova : ne copier aucun texte de skill Remotion dans le plugin, qui est un produit commercial. Reprendre seulement les faits techniques (commandes ffmpeg standard, seuils de mise en page), réécrits.

---

## 4. haidrrrry/claude-remotion-skill

### Outils
- `remotion-motion-graphics/SKILL.md` + `references/{motion-patterns,design-rules}.md` + `assets/theme.ts`.
- `scripts/build-skill.sh` : `zip -r remotion-motion-graphics.skill remotion-motion-graphics -x "*.DS_Store"` (paquet Claude Desktop).
- `examples/scripts/gen-sfx.mjs` : **synthèse de SFX en WAV 16 bits** sans fichier externe (whoosh = bruit filtré passe-bas avec balayage ; pop = sinus 700→320 Hz avec décroissance `exp(-t*9)` ; tick = 1 900 Hz ; bass = 85→60 Hz ; pads).
- `examples/scripts/gen-track.mjs` : lit musical de 20 s à 120 BPM synthétisé (kick, hat, bass, impact, bruit déterministe à graine).
- Rendu : `npx remotion render src/index.ts <Id> out/video.mp4 --codec h264 --crf 17` (16 pour les masters) ; navigateur : `--browser-executable=<path>`, `headless_shell` de Playwright si « Old Headless mode has been removed ».
- Vérification : `npx remotion still ... --frame $f --overwrite` pour f = 15, 45, 90, 150 ; ou `ffmpeg -v error -ss 1.5 -i out/video.mp4 -frames:v 1 check_1.png` (`-ss` préféré à `select=`, dont les guillemets cassent).
- BPM : **pas détecté** ; formule manuelle `framesPerBeat = fps*60/BPM`. Sous-titres : Whisper ou `@remotion/install-whisper-cpp` (cité, pas de script).

### Boucle
Scope → setup (copier `theme.ts`) → build (patterns) → render → **VERIFY obligatoire** : extraire des images, les regarder, corriger dans cet ordre de fréquence : espacements en `em` (relatifs au parent, 16 px), texte au bord (zone utile 75 % au centre en 9:16), éléments visibles avant leur entrée (clamp manquant), contraste et couleur héros sur plus d'un élément, ordre des calques. Corriger → re-rendre → ré-extraire → revoir ; livrer après un passage propre, puis checklist de 12 points (`design-rules.md`). Arrêt : quand la checklist est entièrement cochée.

10 règles non négociables : jamais d'interpolation linéaire, entrées sur 2-3 propriétés, décalage de 3 à 6 images, sorties plus rapides (~10 vs ~20 images), pile de 5 calques (fond mesh, assets, graphisme, étalonnage, grain + vignette), Ken Burns sur chaque image fixe, micro-mouvement des éléments affichés plus de 2 s, timing dérivé de `fps`, un seul objet thème, rendu vérifié. Son : SFX 2 à 3 images **avant** l'impact visuel ; musique 0,2-0,3.

**Contradictions avec HyperFrames** : HyperFrames bannit glow, mesh gradients, fond sombre vide et place le son **une image après** l'image ; haidrrrry impose fond mesh + glow sur le héros et un SFX 2-3 images **avant**. Clapova doit trancher (voir §6).

### Script ou jugement
Scripté : SFX/musique synthétiques, zip. Tout le contrôle qualité repose sur l'œil du modèle et la checklist.

### Licence
MIT : reprise libre avec la mention de copyright et la licence. Déjà prévu dans `THIRD_PARTY_NOTICES.md` selon la veille.

---

## 5. wilwaldon/Claude-Code-Video-Toolkit

Le dépôt ne contient **que `README.md`** : c'est une liste curée (février 2026), sans skill, script ni MCP. Ce qu'elle cite, avec ses extraits :
- Remotion Agent Skills (`npx skills add remotion`).
- digitalsamba/claude-code-video-toolkit (clone présent dans `scratchpad/bb/digitalsamba_claude-code-video-toolkit`, **non analysé ici** car hors liste) : skills Remotion/ElevenLabs/FFmpeg/Playwright, `/video`, `/record-demo`, `/brand`, un `CLAUDE.md` généré par projet pour reprendre entre sessions.
- Manim (Yusuke710/manim-skill, Math-To-Manim, Manim MCP).
- Playwright MCP `--save-video=1920x1080` pour enregistrer des démos.
- op7418/Youtube-clipper-skill : yt-dlp + chapitres sémantiques + ffmpeg (libass) + pysrt.
- Recettes ffmpeg : normalisation `scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30 -c:v libx264 -crf 18 -preset slow -movflags faststart` ; GIF→MP4 `-pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2"`.

Boucle, scripts, vérification : aucun. Licence : MIT annoncée dans le README (pas de fichier). Intérêt pour Clapova : faible, sauf comme carte des projets voisins.

---

## 6. Ce que Clapova devrait adopter

Constat : les skills Clapova font déjà la boucle « vérifier en images » (`render_preview_frames`, `review_montage`, `check_composition`), et le rendu normalise à −14 LUFS / −1,5 dBTP. Les manques sont surtout côté mesures automatiques.

| # | À adopter | Source | Où | Détail |
|---|---|---|---|---|
| 1 | Brancher le **`check` navigateur complet** (layout, contraste avec `suggestedColor`, craft, motion) dans `check_composition` | HyperFrames `check.ts` | **Outil MCP** (via `@clapova/render.checkComposition`) | Aujourd'hui seul `lintProject` tourne. Renvoyer `line_unread`, `dead_stretch`, `text_below_floor`, `first_frame_empty`, `film_silent`, `content_overlap`, `contrast` avec la couleur proposée, chaque défaut avec `clipId` + temps. Respecter la gravité par persistance. Gratuit, déterministe. |
| 2 | **Planches de revue** : début + 0,3 s et milieu de chaque scène, bande −0,2…+0,2 s autour de chaque coupe, planche à 360 px | HyperFrames `snapshotReview.ts` (amont, absent du fork) | **Moteur** (merge amont) puis **outil MCP** (`render_preview_frames({mode:"review"})` ou `review_montage`) | Les coutures attrapent les sauts aux coupes ; la planche téléphone remplace « texte lisible ? » par une preuve. |
| 3 | `--caption-zone` : erreur si un titre ou un motion passe dans la bande des sous-titres | HyperFrames | **Moteur/MCP** (option de `check_composition` quand la piste captions existe) | Bande `y0=.82` pour le 9:16, ajustable par plateforme. |
| 4 | **Contrôle après export** : ffprobe (piste audio présente, durée = durée projet ± 2 %), image noire, puis **transcription du rendu comparée au script** (moins de 80 % des mots = voix coupée ; 0 mot = son absent), sonie intégrée et true peak mesurés par `ebur128=peak=true` | Idée OpenMontage (réécrite, pas copiée), mesure HyperFrames `audioTruePeak.ts` | **Serveur** (job après `export_video`, résultat dans `get_render_status`) | Détecte les sons perdus que les images ne montrent pas. |
| 5 | **Beats réels** : utiliser `analyzeMusicFromSignal` (beatTimes, force, bpm, confiance) dans `plan_shots` et `snap_cuts_to_beats`, refuser le calage si confiance `uncertain` | HyperFrames `core/src/beats` (dans le fork) | **Serveur** | Pas besoin de librosa/aubio. Vérifier ce que `plan_shots` utilise aujourd'hui (non lu ici). |
| 6 | Musique : choisir le **départ** de la musique par la fenêtre la plus forte (sonie momentanée `ebur128`, par seconde) et sauter une intro calme | Idée OpenMontage `audio_energy.py` | **Serveur** (`plan_shots` ou `add_media_to_project` musique) | Complète la règle « musique sur toute la durée ». |
| 7 | Silence adaptatif pour le dérushage : seuil = `input_thresh` de `loudnorm=print_format=json`, puis `silencedetect=noise=<thresh>dB:d=0.5` | remotion-dev `silence-detection.md` (commande ffmpeg standard) | **Serveur** (`analyze_rushes`, `trim_media`) | Plus robuste qu'un −35 dB fixe d'une source à l'autre. |
| 8 | **Assertions de mouvement** (`appearsBy`, `before`, `staysInFrame`, `keepsMoving`) générées par le compositeur Clapova à partir du storyboard | HyperFrames `*.motion.json` | **Moteur/serveur** (écrire le sidecar à `build_from_storyboard`, `check` le lit tout seul) | Vérifie « l'accroche est visible avant 0,5 s », « le CTA arrive après le titre ». |
| 9 | Score « effet diaporama » sur le storyboard **avant** de générer (répétition des mises en page, texte qui domine, mouvement sans but) avec refus au-delà d'un seuil | Idée OpenMontage `slideshow_risk.py` (réécrire) | **Outil MCP** (dans `create_storyboard`/`estimate_storyboard`) ou règle dans `clapova:storyboard` | Évite de dépenser des crédits sur un plan faible. |
| 10 | Revue en **notes actionnables** `t=… · où · problème → changement exact`, classées P0/P1/P2 ; un critique sans correction proposée n'est pas bloquant ; **au plus 2 tours** de correction puis on livre avec réserves | HyperFrames `review.md` + idée CHAI d'OpenMontage | **Skill** `clapova:monteur` et `clapova:motion-design` ; format de sortie de `review_montage` | À arbitrer : HyperFrames dit « ne jamais noter sur 10 ». Garder la note pour le gating d'export, mais exiger que `review.issues` porte des P0/P1 avec la correction exacte, et que la boucle s'arrête quand il n'y a plus de P0 (pas seulement à 9/10). |
| 11 | Liste **BANNED** par vidéo (défauts génériques nommés : fond vide sombre, glow, dégradé violet, tout centré, tout en fondu-glissé, trois cartes en ligne, logo dans un coin) qui grandit à chaque film | HyperFrames `spec.md` (Apache, reformuler + attribution) | **Skill** `clapova:motion-design` | Trancher la contradiction avec haidrrrry (mesh + glow) : suivre HyperFrames par défaut, sauf charte de marque. |
| 12 | Règles son : pic du SFX **une image après** l'image ; 3-6 dB au-dessus du lit ; alterner 2-3 prises d'un même son ; chaque SFX a une cause visible | HyperFrames `sound.md` | **Skill** `clapova:monteur` + **serveur** (`place_sfx_from_events` : décaler selon le pic mesuré du fichier, rotation des prises) | Les skills Clapova disent déjà « son léger » ; ajouter le décalage et la rotation, mesurables via `audio --place-at`. |
| 13 | Règles de cadre chiffrées : marge 80 px côtés / 100 px haut-bas en 1080, titre ≥ 84 px, texte d'appui ≥ 44 px ; durée de lecture minimale (0,4 s pour 1-2 mots, ¾·0,5 + 0,3 s par mot, 2 s pour la dernière ligne) | remotion-dev `video-layout.md` (faits), HyperFrames craft | **Skill** `clapova:motion-design` (« Règles de cadre ») | Valeurs vérifiées automatiquement par le point 1. |
| 14 | Ne pas écraser les modifications faites par l'utilisateur dans l'éditeur entre deux tours : relire la timeline et comparer avant toute édition | remotion-dev « Preserve user changes », HyperFrames `history --since mine` | **Skill** `clapova:monteur` ; à terme **outil MCP** (`get_timeline` qui signale les changements depuis le dernier appel de l'agent) | |
| 15 | Promesse de livraison verrouillée : si la vidéo promise est animée et qu'un plan retombe en image fixe (génération échouée), le dire et demander, jamais en silence | Idée OpenMontage `delivery_promise.py` | **Skill** `clapova:storyboard` / `clapova:monteur` | |
| 16 | Fermer le fork sur l'amont pour récupérer `snapshotReview` et les dernières règles craft | `PATCHES.md` (merge hebdomadaire) | **Moteur** | Le fork n'a pas `snapshotReview.ts`. |

À ne pas reprendre : tout code ou texte d'OpenMontage (AGPL) ; tout texte de remotion-dev/skills tant que la licence n'est pas vérifiée ; les SFX « mèmes » de `remotion.media`.

---

# Complément (2e passe)

## 7. HyperFrames : ce qui manque au fork, fichier par fichier

Comparaison faite par `comm` sur l'arbre des `.ts/.js/.mjs` hors tests, entre l'amont cloné le 24/10 (`0eae494`, CLI `0.8.192`) et le fork (`21bcfcc`, CLI `0.8.177`).

### 7.1 Absents du fork et utiles à Clapova (à porter, par ordre de priorité)

| Priorité | Fichier amont | Fonctions exportées | Ce qu'il apporte | Dépendances à porter avec |
|---|---|---|---|---|
| 1 | `packages/cli/src/utils/craftAudit.ts` (541 l.) | `auditCraft`, `detectFirstFrameEmpty`, `detectFilmSilent`, `detectDeadStretches`, `detectLineUnread`, `detectTextBelowFloor`, `readingWords`, `lineFloorSec`, `typeFloorPx` | Les 5 avertissements craft (`first_frame_empty`, `film_silent`, `dead_stretch`, `line_unread`, `text_below_floor`). Le fork n'en a aucun (0 occurrence de ces codes) | `END_CARD_HOLD_SEC = 3` dans `cli/src/utils/motionAudit.ts` (absent du fork) ; types `CraftFinding`, `CraftFrame`, `CraftResult`, `CheckBbox` dans `cli/src/utils/checkTypes.ts` (absents du fork) ; branchement dans `cli/src/utils/checkPipeline.ts` (amont l. ~1536 : `craftEnabled()` → `auditCraft({frames: collected.craftFrames, duration, canvas, soundSources, stillnessJudgedElsewhere})`), qui demande au driver `collectCraftFrame` et `collectCraftFilm` ; rendu de la section `report.craft` dans `commands/check.ts` (amont l. ~680) |
| 1 | `packages/cli/src/commands/snapshotReview.ts` (320 l.) | `REVIEW_SEAM_OFFSETS = [-0.2,-0.1,0,0.1,0.2]`, `REVIEW_PHONE_WIDTH = 360`, `resolveReviewTimeline`, `planReview`, `seamTimes`, `reviewFrames`, `writeReviewSheets` | Planches beats, coutures et téléphone de `snapshot --review` | `cli/src/timeline/domStructure.ts` (`toDomNode`, 12 l., absent du fork) ; `topLevelElements` et `trackKindOf` de `@hyperframes/parsers` (présents dans le fork) ; `resolveSnapshotCompositionRange` et `snapshotStartResolver` de `snapshotSampling.ts` (le fork n'en a qu'une seule mention : à vérifier) ; `capture/contactSheet.js` (`createContactSheet`) ; flags `--review` dans `commands/snapshot.ts` (amont 1 554 l., fork 1 321) |
| 2 | `snapshot --against <video>` (dans `commands/snapshot.ts`) | – | Image de la référence à côté de l'image rendue au même instant (comparaison avec une vidéo de référence) | même fichier ; absent du fork (`"against"` : 0) |
| 2 | `packages/producer/src/services/render/audioTruePeak.ts` (108 l.) | `measureTruePeakDbfs` | True peak du rendu par `ebur128=peak=true`, mesure en parallèle par tranche | `@hyperframes/engine` (déjà là) |
| 3 | `packages/parsers/src/mediaTiming.ts` (81 l.) | `resolveMediaStartSeconds`, `hostInPointSeconds`, `cutToHostSlots`, `MEDIA_START_BASIS_ATTR` | Temps de départ local ou global des médias dans les sous-compositions | `mediaDuration.js` (présent) |
| 3 | `packages/parsers/src/mediaAlpha.ts`, `referenceResolver.ts` | – | Alpha des vidéos détourées, résolution des références | – |
| 3 | `packages/cli/src/utils/checkMotionBlur.ts`, `core/src/pageMotionBlur.ts`, `core/src/motionBlurSettings.ts`, `core/src/runtime/captureMotionBlur/*` (9 fichiers), `engine/src/services/pageMotionBlur.ts` | `motionBlurDrafts`, `collectMotionBlurDrafts` | Flou de mouvement à la capture, avec son audit | touche `core` et `engine` : ticket « patch amont » obligatoire d'après `PATCHES.md`, donc plutôt via le merge amont |
| 3 | `core/src/htmlInCanvas.ts`, `htmlInCanvasDefects.ts` | – | Rendu HTML-in-canvas et ses défauts | `core` : passer par le merge |
| 3 | `engine/src/services/renderFrameVideoHold.ts`, `softwareEncoderThreads.ts`, `engine/src/utils/renameWithRetry.ts`, `producer/src/services/render/frameCacheBudget.ts`, `producer/src/services/distributed/audioSidecar.ts` | – | Robustesse et performance du rendu ; `audioSidecar` concerne le rendu distribué (utile à `clapova-fly`) | `engine` et `producer` : passer par le merge |
| 4 | `cli/src/warmCheck*.ts`, `cli/src/utils/checkProgress.ts` | – | `check` à chaud (navigateur gardé ouvert) et progression : accélère les vérifications répétées | – |
| – | `cli/src/audio/read/*` (9 fichiers : `read.ts`, `music.ts`, `voice.ts`, `effects.ts`, `pitch.ts`, `stems.ts`…) | `readAudio` | `audio --read` : lecture voix, effet, musique. **`stems.ts` envoie l'audio au cloud HeyGen** (`HyperframesCloudClient`, upload MP3 en 192 kb/s) pour séparer les pistes | À ne pas porter tel quel : contraire à la règle « pas de réseau sortant » du fork (`disabled.ts`). Porter `music.ts`, `voice.ts`, `effects.ts`, `pitch.ts` sans `stems` si besoin |
| – | `cli/src/cloud/offload*.ts`, `commands/lambda/*`, `browser/windowsChromeWatchdog.ts`, `unzipArchive.ts` | – | Cloud HeyGen, Lambda, Windows | Inutile pour Clapova |

**Recommandation** : priorités 1 et 2 d'abord, car elles ne touchent que `cli` et `parsers`, donc pas de ticket « patch amont ». Le plus simple est le merge hebdomadaire de `upstream-mirror` prévu par `PATCHES.md` (0.8.177 → 0.8.192) : la priorité 3 touche `core`, `engine` et `producer`, et un cherry-pick y créerait des écarts. Ensuite, dans `packages/clapova-render`, ajouter une `checkComposition({mode:"full"})` qui appelle le pipeline navigateur de `check` (aujourd'hui `lintProject` seul) et un `reviewSheets()` qui appelle `planReview` et `writeReviewSheets`.

### 7.2 Skills : écart du fork

Les skills du fork viennent de l'ancienne organisation (`hyperframes-core`, `hyperframes-animation`, `hyperframes-audio`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-studio`, `motion-graphics`, `music-to-video`, `pr-to-video`, `product-launch-video`, `talking-head-recut`, `embedded-captions`, `faceless-explainer`, `general-video`). Absents du fork : `hyperframes/references/{review,spec,story,storyboard,sound,motion,captions,overlays,film,format,look,runtimes}.md`, `references/types/{3d,character,data,explainer,launch,music,vertical}.md`, `hyperframes/assets/frame-presets/` (presets de cadre avec `FRAME.md`, `caption-skin.html` et polices OFL), `hyperframes-cli/references/{conventions,feedback}.md`, `hyperframes-registry/references/search.md`, `media-use/references/{local,mixing}.md`, `media-use/audio/scripts/{carve.mjs,extract-audio-data.py}`.

### 7.3 Autres skills HyperFrames lues (`skills/`)

- **figma** : `figma asset|tokens|component` ; `scripts/verify-motion.mjs --reference export.mp4 --render out.mp4 --min-motion-psnr 15` compare le mouvement par PSNR ffmpeg entre l'export Figma et le rendu. Règle : un storyboard Figma, ce sont des **états clés**, pas des slides.
- **hyperframes-registry** : environ 450 blocs ; `catalog --query "<intention en anglais>" --json` puis `add <name>`. Si rien ne convient, `report_gap` avant de construire à la main. Les blocs calés sur le rythme lisent `beats --json` (temps du beat moins `data-start` du montage).
- **media-use** : `media-use resolve --type <type> --intent "…"` choisit HeyGen ou un outil local gratuit (`tts` Kokoro, `transcribe` Parakeet ou whisper, `remove-background`, `media-treatment`). Règle « offer once, never add silently ».
- **slideshow** : texte lu par le public ≥ 40 px en 1920×1080 ; `check` vérifie les `sceneId` et les cibles des hotspots ; `present`.
- **remotion-to-hyperframes** : `lint_source.py` refuse ce qui ne se traduit pas ; `snapshot --at … --against original.mp4` ; `render_diff.sh` (SSIM ≥ 0,85).
- **captions.md** (règles chiffrées) :
  - `transcribe` utilise `small.en` par défaut, qui **traduit** en anglais ce qui n'est pas en anglais : passer `--model small --language fr`.
  - Whisper invente « Thank you. » sur un silence : retirer les mots qui commencent dans un silence final (`silencedetect=noise=-35dB:d=0.6`).
  - Plus de 20 % de jetons `♪` ou `�` signifie que la transcription a échoué.
  - Groupes de 2-3 mots en haute énergie, 3-5 en conversation, 4-6 au calme ; coupure sur une pause de 150 ms ou plus.
  - Position : 80-120 px du bas en paysage, environ 600-700 px du bas en portrait, jamais sur le visage.
  - Faire le fondu sur le groupe **ou** sur les mots, jamais les deux.
- **types/vertical.md** : en 1080×1920, rien dans les 168 px du haut ; tout le texte entre 168 et 1330 px ; rien sous le rail d'actions de droite ; titres environ ×1,35 par rapport au paysage ; rien de lisible sous 28 px ; environ 5 mots par ligne pour une accroche (couper des mots, ne jamais réduire la taille).
- **story.md §6** : 6 mots par ligne au plus, une ligne à l'écran à la fois ; 0,3 s par mot + 0,5 s, et 2 s pour la dernière ligne ; mots interdits (« unlock », « seamless », « supercharge », « game-changer », « revolutionize », « effortless ») ; la première ligne n'est jamais « Introducing » ni le logo ; l'écran ne répète jamais mot pour mot la voix off.
- **motion.md** : « Defaults that look generated » : boucles respirantes ou flottantes sur les titres, titres qui glissent encore après leur arrivée, zoom lent qui rampe, rebond sur l'UI, anneaux de clic, toutes les scènes qui entrent de la même façon. Transitions : 3 à 5 types par film, chacune causée par l'écran, au plus un tiers de coupes sèches entre beats ; recettes chiffrées (« zoom through a button » : bouton de ~8 % à ~250 % en 0,35 s ; morph ~110 → 880 px en 0,2 s `power3.out` avec flou 12 → 0).

## 8. OpenMontage : idées complémentaires (lecture des skills meta, core et creative ; AGPL, idées seulement)

- **`video_analyzer.py`, classement du mouvement d'une référence** : flux optique `cv2.calcOpticalFlowFarneback` à 360p, deux images à 0,4 s d'écart. Magnitude moyenne < 0,5 = `static_image` ; variance < 2,0 = `animated_still` (Ken Burns) ; sinon `motion_clip`. La règle « Never guess whether a reference uses images or video » choisit ensuite la voie : génération vidéo ou image + mouvement. **À reprendre côté serveur** dans `analyze_reference_video` et `recreer-depuis-reference`.
- **`video-reference-analyst.md`** : rapport en 5 aspects par plan (Sujet, Mouvement du sujet, Scène avec les **overlays à part**, Cadrage, Caméra), puis audit des capacités, 2-3 variantes, puis **échantillon obligatoire de 10-15 s** (accroche + une scène du milieu) avant la vidéo complète. Pour Clapova : règle de skill `recreer-depuis-reference`, et un `dryRun`/échantillon avant les générations payantes.
- **`taste-direction.md`** : trois réglages notés avant les concepts (`visual_variance`, `motion_intensity`, `information_density`) qui conditionnent la densité, le rythme et les transitions ; checklist anti-défauts (dégradés violets génériques, même transition partout si la variance est ≥ 4, produit réel jamais montré).
- **`animation-runtime-selector.md`** : présenter les deux moteurs et ne jamais en choisir un en silence ; garder le plus simple.
- **`core/hyperframes.md`, pièges réels** :
  - Une banque gratuite livre souvent du 640×360 : ne pas faire `scale=…:decrease,pad` (petite vidéo dans un cadre noir) mais `scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,unsharp=3:3:0.6`. Vérifier avant avec `ffprobe -select_streams v -show_entries stream=width,height`.
  - Rendre avec `--workers 1` les compositions chargées en vidéo.
  - Densifier les images clés des clips de banque.
  - **À mettre dans le préflight du serveur** : refuser ou recadrer un B-roll sous la résolution de sortie.
- **`creative/short-form.md`, zones sûres 1080×1920** : TikTok 900×1492 (haut 108, bas 320, droite 120 px), Reels 996×1400 (210 / 310 / 84), Shorts 984×1500 (120 / 300 / 96), Facebook 1080×1520 ; zone universelle 900×1400 centrée. Les chiffres sont des données publiques des plateformes, réutilisables (source à citer). HyperFrames donne une autre bande (168-1330 px) : choisir une seule référence pour `check --caption-zone` et les règles de cadre Clapova.
- **`creative/sound-design.md`** :
  - Dialogue −16 à −14 LUFS ; musique 18-20 dB sous la voix ; SFX au moins 6 dB sous la voix ; true peak ≤ −1,5 dBTP.
  - Whoosh 10-20 ms **avant** l'image : cela contredit HyperFrames (une image **après**) et haidrrrry (2-3 images avant). Il faut trancher dans `clapova:monteur`.
  - Sur un même point, Clapova dit aujourd'hui « musique ~0,25 sous la voix », ce qui fait environ −12 dB, loin des 18-20 dB d'OpenMontage et des 0,14 de HyperFrames. Écart à arbitrer.
- **`reviewer.md`** : au plus 2 tours de révision puis PASS_WITH_WARNINGS (déjà au §1).

## 9. digitalsamba/claude-code-video-toolkit (`scratchpad/bb/`, MIT 2024 Digital Samba, dernier commit 22/10/2026)

Espace de travail Remotion + scripts Python `uv` (`pyproject.toml` : elevenlabs, boto3 pour R2, pillow, moviepy, matplotlib ; extras `whisper`, `modal`, `youtube`). Skills dans `.claude/skills/` (acestep, elevenlabs, ffmpeg, frontend-design, ideogram4, ltx2, moviepy, playwright-recording, qwen-edit, remotion, remotion-official, runpod, synthetic-ui-demo) et commandes `.claude/commands/` (`video`, `record-demo`, `scene-review`, `brand`, `generate-voiceover`, `redub`, `thumbnail`, `publish`, `voice-clone`…). Des images Docker GPU (Modal et RunPod : flux2, ltx2, qwen3-tts, sadtalker, propainter, realesrgan, acestep).

| Outil | Rôle | Extrait exact |
|---|---|---|
| `tools/qc.py` (529 l.) | **QC avant rendu** sans rien modifier : assets manquants (un `staticFile` 404 fait échouer Remotion), narration plus longue que la scène (coupée) ou plus courte de 3 s (`DEAD_AIR_SECONDS = 3.0`), débit en mots/min, sonie par scène, et avec `--render` sonie du rendu | `ffmpeg -hide_banner -nostats -i f -vn -af loudnorm=print_format=json -f null -` ; cibles `YOUTUBE_LUFS = -14`, `YOUTUBE_TRUE_PEAK = -1`, `SCENE_LUFS = -16`, écart d'une scène à la médiane > `SCENE_SPREAD_LU = 1.5` = déséquilibre ; mesure ignorée sous 3 s ; `--fix` : 2e passe `loudnorm=I=..:TP=..:LRA=11` puis `-ar 48000`, originaux gardés dans `.qc-backup/` ; code de sortie 1 si erreur, `--strict` |
| `tools/pacing.py` | **Débit de la voix off** : mots/min = mots du script / durée ; « fast » > 170, « slow » < 110, confortable 140-160 ; `clamp_pace()` ralentit sans changer la hauteur avec `atempo`, plancher 0,85 (0,7 avec `--min-tempo`) | « Sampling more takes doesn't fix pace; measuring it and correcting deterministically does » |
| `tools/sync_timing.py` (978 l.) | Recale `durationSeconds` de chaque scène sur la durée réelle du MP3 de voix off (+ 1 s de marge), à blanc par défaut, `--apply` | ffprobe |
| `tools/align_captions.py` | Aligne les sous-titres écrits à la main sur l'audio réel : transcription mot à mot ElevenLabs Scribe, correspondance approximative de chaque phrase, réécriture des `cap(text, fromSec, durSec)` | API ElevenLabs |
| `tools/captions.py` | JSON mot à mot au format `@remotion/captions` ; **aligné sur le script** : les mots du `.txt` prennent les temps de la transcription, pour garder l'orthographe des noms de produits | Scribe ou `openai-whisper` local |
| `tools/addmusic.py` | Musique sous la vidéo | `afade=t=in:d=..`, `afade=t=out:st=..:d=..`, `amix=inputs=2:duration=first:dropout_transition=0` |
| `tools/cutdown.py` | Déclinaisons 9:16, 1:1, 4:5 en ffmpeg pur, modes `blur`, `crop` (`--focus` 0-1), `pad` | flou à ¼ de taille pour aller vite : `split[bgsrc][fgsrc];[bgsrc]scale=..:force_original_aspect_ratio=increase,crop=..,boxblur=12:3,scale=W:H,eq=brightness=-0.12:saturation=1.15[bg];[bg][fg]overlay=(W-w)/2:(H-h)/2` ; avertit qu'en 9:16 une source 1920×1080 tombe à 56 % (sous-titres incrustés trop petits) |
| `tools/sfx.py`, `music.py`, `voiceover.py`, `redub.py`, `dewatermark.py`, `upscale.py`… | Générations via ElevenLabs, ACE-Step, Qwen3-TTS, ProPainter, Real-ESRGAN | API, GPU cloud |
| `playwright/scripts/record-demo.ts` | Enregistrement de démo : viewport 1920×1080, `slowMo: 50`, **curseur injecté en CSS** (`.playwright-cursor`, `.click-ripple`) parce que l'enregistrement Playwright ne montre pas la souris, conversion WebM → MP4 30 i/s | Playwright `recordVideo` |
| `scripts/render-baseline.mjs` | Non-régression visuelle à la montée de version Remotion : rendre la même composition avant et après sur la même machine, comparer les pixels, échec au-dessus de `--threshold` (0 % par défaut) | – |
| `.claude/commands/scene-review.md` | Revue **scène par scène dans Studio, avant la voix off** : Approuver, Ajuster, Affiner, Signaler, Passer, puis on boucle jusqu'à approbation | jugement humain |

Boucle : `/video` (le projet génère son `CLAUDE.md` et son état) → plan → assets → `/scene-review` (humain) → voix off → `sync_timing` / `align_captions` → `qc.py` → rendu → `qc.py --render` (`--fix` pour la sonie). L'arrêt se fait sur l'approbation humaine scène par scène, plus le code de sortie de `qc.py`.

Licence MIT : code et textes réutilisables avec la mention de copyright.

**À adopter pour Clapova** :
1. Le **débit de la voix off** (mots/min, seuils 110/170, ralentissement `atempo` ≥ 0,85) dans `generate_voiceover` et `review_montage`. Côté serveur.
2. La **sonie par scène** et l'écart à la médiane (> 1,5 LU) dans `check_composition`. Côté serveur.
3. Les **sous-titres alignés sur le script** (orthographe du script, temps de la transcription) dans `add_captions` quand le texte de la voix off est connu. Côté serveur.
4. Le **recalage des durées de scène** sur la voix off réelle (comme `sync_timing`) dans `build_from_storyboard`. Côté serveur.
5. Le mode **flou en fond** de `cutdown` pour `declinaison-formats`, s'il n'existe pas déjà (non vérifié). Côté serveur.
6. Le **test de non-régression visuelle** au merge amont du fork. Côté moteur, en CI.

## 10. Projets cités par wilwaldon et réellement outillés

### Playwright MCP (microsoft/playwright-mcp, Apache-2.0, cloné, commit du 22/10/2026)
- Le flag `--save-video=1920x1080` cité par wilwaldon **n'apparaît plus** dans le README actuel (aucune occurrence de `save-video`). L'enregistrement passe par des outils, dans la section « DevTools (opt-in via --caps=devtools) » d'après l'ordre du README :
  - `browser_start_video` (`filename`, `size`, `fps` = 25 par défaut, `cursor` : curseur animé qui se déplace vers chaque action, actions espacées de 800 ms) ;
  - `browser_stop_video` ;
  - `browser_video_chapter` (`title`, `description`, `duration` : carte de chapitre plein écran sur fond flouté) ;
  - `browser_video_show_actions` (`duration` 500 ms, `position` top-right par défaut, `cursor` "pointer"/"none", `style`) et `browser_video_hide_actions`.
- Sortie `video-{timestamp}.webm`. Il existe aussi `browser_start_recording` / `stop_recording`, qui renvoient les actions de l'utilisateur en code Playwright.
- **Pour Clapova** : une démo produit enregistrée par l'agent (skill `video-explainer` / démo SaaS). Côté serveur, il faudrait un outil `record_web_demo` (Playwright, curseur, chapitres) qui dépose le WebM converti dans la médiathèque. Côté skill, décrire ce flux quand l'utilisateur a Playwright MCP en local, puis `create_upload_link`.

### op7418/Youtube-clipper-skill (MIT 2026 op7418, cloné)
- Scripts Python :
  - `download_video.py` : yt-dlp, 1080p max en MP4, sous-titres EN en VTT, automatiques en repli, fichier nommé par l'ID de la vidéo ;
  - `analyze_subtitles.py` : texte horodaté pour le modèle ;
  - `clip_video.py` : `ffmpeg -ss <start> -t <durée> -i … -c copy` ;
  - `translate_subtitles.py` : traduction par lots ;
  - `merge_bilingual_subtitles.py`, `extract_subtitle_clip.py` ;
  - `burn_subtitles.py` : `subtitles=<srt>:force_style='FontSize=..,MarginV=..'` avec `-c:a copy`, et détection de libass par `ffmpeg -filters | grep subtitles` (ffmpeg-full sur macOS) ;
  - `generate_summary.py`.
- Boucle en 6 étapes : vérifier l'environnement (yt-dlp, libass, pysrt) → télécharger → **le modèle découpe en chapitres sémantiques de 2 à 5 min**, en couvrant tout le contenu et en coupant sur les changements de sujet → l'utilisateur choisit → découpe, traduction, incrustation → texte de résumé pour les réseaux.
- **Défaut constaté** : le README parle de découpe « frame-accurate », mais `clip_video.py` fait `-ss` avant `-i` avec `-c copy`. Sans réencodage, la coupe se cale sur l'image clé précédente, donc elle n'est pas exacte à l'image. C'est le même piège que remotion-dev signale (« You MUST re-encode … to avoid frozen frames »).
- **Pour Clapova** (`shorts-depuis-video-longue`) : chapitrage sémantique sur la transcription avec la règle « tout couvrir, 2-5 min, couper sur un changement de sujet », proposé avant de choisir les shorts. Toujours réencoder les extraits. Pour YouTube, Clapova a `import_media_from_url` : ne pas ajouter yt-dlp côté serveur sans vérifier les conditions d'utilisation de YouTube.

### Non clonés (cités seulement)
Manim (Yusuke710/manim-skill, HarleyCoops/Math-To-Manim, Manim MCP) : hors du moteur HTML de Clapova, non analysés.

## 11. Ajouts au tableau du §6

| # | À adopter | Source | Où |
|---|---|---|---|
| 17 | Porter `craftAudit.ts` et `snapshotReview.ts` (+ dépendances du §7.1), ou merger l'amont 0.8.192 | HyperFrames | Moteur, puis `@clapova/render` |
| 18 | Débit de voix off (110-170 mots/min, `atempo` ≥ 0,85) | digitalsamba `pacing.py` (MIT) | Serveur : `generate_voiceover`, `review_montage` |
| 19 | Sonie par scène et écart > 1,5 LU à la médiane | digitalsamba `qc.py` | Serveur : `check_composition` |
| 20 | Sous-titres : orthographe du script, temps de la transcription ; forcer la langue de transcription (`small.en` traduit) ; retirer les mots dans le silence final ; échec au-delà de 20 % de jetons `♪`/`�` | digitalsamba `captions.py`, HyperFrames `captions.md` | Serveur : `add_captions`, `transcribe_media` |
| 21 | Classer une référence en image fixe, Ken Burns ou vrai mouvement par flux optique (seuils 0,5 / 2,0) | Idée OpenMontage | Serveur : `analyze_reference_video` |
| 22 | Échantillon de 10-15 s avant une vidéo générée complète | Idée OpenMontage | Skill `recreer-depuis-reference`, `generate` |
| 23 | Préflight : B-roll sous la résolution de sortie → `scale…increase,crop` + `unsharp`, ou refus | Idée OpenMontage | Serveur : préflight du rendu |
| 24 | Une seule table de zones sûres verticales (OpenMontage par plateforme, ou HyperFrames 168-1330 px) appliquée par `check --caption-zone` | OpenMontage, HyperFrames | Skill `motion-design` + serveur |
| 25 | Trancher le décalage SFX/image (+1 image HyperFrames, −10/20 ms OpenMontage, −2/3 images haidrrrry) et le niveau de la musique sous la voix (0,14 HyperFrames, −18/20 dB OpenMontage, 0,25 Clapova actuel) | Contradictions constatées | Skill `monteur` + `place_sfx_from_events` |
| 26 | Extraits toujours réencodés (jamais `-c copy` pour une coupe précise) | Défaut constaté dans Youtube-clipper, règle remotion-dev | Serveur : `trim_media`, `split_media` |
| 27 | Démo web enregistrée par l'agent (curseur, chapitres) | Playwright MCP | Nouvel outil serveur ou skill |

## Fichiers non lus ou limites
- Lecture complète : SKILL.md et références principales de chaque projet, scripts listés ci-dessus. OpenMontage (2 208 fichiers) et HyperFrames (9 114) n'ont pas été lus fichier par fichier : seuls les outils d'analyse, de mixage, de contrôle et les skills de revue l'ont été.
- Licence du monorepo Remotion : lue en 2e passe (§3).
- 2e passe : écart fork/amont mesuré sur tout l'arbre de code (hors tests), et toutes les skills HyperFrames de `skills/` passées en revue. Les 13 dossiers `frame-presets` et le corpus de test de `remotion-to-hyperframes` n'ont été que listés. OpenMontage : les skills meta, core et creative ont été lues sur leurs parties outillage et règles chiffrées, les directors des 13 pipelines non (ils se répètent d'un pipeline à l'autre).
- Le code du serveur MCP Clapova n'est pas dans ces dépôts : le comportement actuel de `plan_shots`, `review_montage` et `place_sfx_from_events` est déduit des skills, pas du code.
