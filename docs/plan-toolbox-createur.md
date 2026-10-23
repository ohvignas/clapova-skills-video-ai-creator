# Plan de développement : toolbox de créateur du serveur MCP Clapova

Date : 2026-10-23. Déduit des schémas MCP existants et des README de `clapova-engine/packages/clapova-render` et `clapova-engine/packages/clapova-fly`. Le code de l'app Clapova n'était pas accessible : les noms de modules côté app (Convex, workers Fly/SRV2, R2, fal.ai, Gemini) sont des hypothèses à confirmer.

## 0. Principes transverses

### 0.1 Contrat asynchrone unique (plafond MCP de 60 s)
- Tout outil qui peut dépasser 25 s crée un job (table Convex `toolJobs` : `id, workspaceId, tool, status queued|running|done|failed|cancelled, progress, result, error, creditsReserved, creditsCharged, expiresAt`) et répond en moins de 5 s avec `{ jobId, status, etaSec, pollAfterSec }`.
- Nouvel outil générique `get_job_status({ jobId, wait?: 0..45 })` en long-polling.
- Mode hybride recommandé : l'outil attend jusqu'à 40 s ; fini, il renvoie le résultat ; sinon le `jobId`.
- Corrige `generate_video` et `render_preview_frames`.

### 0.2 Crédits
Réservés au lancement, débités à la réussite, remboursés à l'échec. Chaque réponse expose `creditsCharged` et `creditsBalance`. Un outil annoncé « Gratuit » ne touche jamais au ledger (test d'invariant en CI).

### 0.3 Montrer à l'agent : champ `preview`
Toute sortie qui produit un média contient `preview: { url, expiresAt, mime, width?, height?, bytes }` : URL R2 présignée (15 min) sur un dérivé léger (image 1024 px, vidéo 540p < 8 Mo, planche PNG). Jamais d'URL fal.media brute : tout est rapatrié dans R2 (les liens R2 signés passent côté agent, fal.media et clapova.com/api/media peuvent être bloqués).

### 0.4 Stockage R2
| Préfixe | Contenu | Rétention |
|---|---|---|
| `ws/{wsId}/media/` | bibliothèque | permanente |
| `ws/{wsId}/analysis/social/` | vidéos importées pour analyse | 7 jours |
| `ws/{wsId}/derived/preview/` | aperçus | 3 jours |
| `ws/{wsId}/derived/boards/` | moodboards | 30 jours (ou bibliothèque) |
| `cache/transcripts/`, `cache/vision/` | résultats JSON, clé sha256 + params | 90 jours |
| `global/styles/` | catalogue de styles | permanent, versionné |

Un appel servi par le cache coûte 0 crédit.

### 0.5 Erreurs normalisées
`{ code, owner: "user"|"system", retryable, message_fr, hint_fr, details? }`, sur le modèle de `ClapovaRenderError`.

### 0.6 Conventions
JSON Schema draft-07, `additionalProperties:false`, descriptions en français, ligne finale `Coût : …`.

## 1. `analyze_image` : vision sur une ou plusieurs images

But : style, palette, cadrage, typo, texte (OCR) et « ce qui marche » d'une image fixe ; batch pour comparer des références.

Entrée : `images[1..12]` (`mediaId` | `url` https | `frameOf {mediaId, timeSec}`, `label`), `focus[]` (style, palette, cadrage, typo, texte, sujet, marque, accroche, conformite), `question`, `compare`, `platform`, `detail` (rapide 512 px / standard / fin 2048 px + OCR).

Sortie par image : `ratio`, `preview`, `style {tags, styleMatches[{styleId, score}], mood}`, `palette[{hex, share, role}]`, `cadrage {plan, angle, sujet {bbox, regleDesTiers}, safeZone}`, `typo[{texte, famille, fontGuess[], poids, casse, couleur, contour, taillePctHauteur}]`, `texte {ocr, langue, lisibilite}`, `ceQuiMarche[]`, `aAmeliorer[]`, `scores`. Plus `synthese {pointsCommuns, paletteCommune, styleDominant, recommandations}`, `creditsCharged`, `cached`.

Coût : 1 crédit pour 1 à 4 images, puis 1 par tranche de 4 ; `fin` double ; cache gratuit.
Dépendances : Gemini 2.5 Flash (JSON via `responseSchema`), Pro pour `fin` ; palette calculée localement (sharp + k-means Lab, déterministe) ; `styleMatches` par embedding (CLIP ou Gemini multimodal) contre les vignettes du catalogue.
Architecture : synchrone jusqu'à 4 images, hybride au-delà ; 4 appels Gemini en parallèle ; 32 Mo max.
Sécurité : anti-SSRF partagé avec `fetch_url` ; pas d'identification de personnes ; texte OCR traité comme donnée (anti-injection).
Erreurs : `IMAGE_TOO_LARGE`, `UNSUPPORTED_MIME`, `URL_UNREACHABLE`, `MEDIA_NOT_FOUND`, `VISION_PROVIDER_FAILED`, `INSUFFICIENT_CREDITS`.
Tests : fixtures validées par Zod, palette déterministe, batch async, cache à 0 crédit, refus `169.254.169.254`.
Effort : M.

## 2. `import_social_video` : lien social vers fichier d'analyse

But : récupérer une vidéo publique YouTube (dont Shorts), TikTok, Instagram ou X **uniquement pour l'analyser**.

Entrée : `url` (requis), `quality` (analyse-360p par défaut / standard-720p / max-1080p), `maxDurationSec` (180 par défaut, 1200 max), `audioOnly`, `then[]` (analyze_reference_video, transcribe, extract_frames, analyze_edit), `projectId`, `purposeAck: "analyse"` (requis).

Sortie (hybride) : `jobId`, `status`, `media {analysisMediaId, kind: "analysis-only", durationSec, width, height, fps, hasAudio, expiresAt, preview}`, `source {platform, videoId, auteur, titre, publieLe, vues, likes, canonicalUrl}`, résultats `then`, `creditsCharged`, `cached`, `avertissement`.

Coût : 1 crédit (0 en cache) ; analyses enchaînées à leur tarif.
Dépendances : `yt-dlp` épinglé, mis à jour chaque semaine avec test de fumée par plateforme ; ffmpeg ; proxys résidentiels pour TikTok/Instagram, ou fournisseur tiers derrière une interface `SocialFetcher` ; aucun cookie utilisateur.
Architecture : toujours async ; worker Fly dédié `clapova-fetch` (gardes `decideMachineBudget`) ; `yt-dlp --dump-json` et refus de durée AVANT téléchargement ; téléchargement `-f "bv*[height<=720]+ba/b"` ; remux ; upload R2 ; analyses `then` ; timeout 5 min.
Cache par espace (plateforme, videoId, qualité), 7 jours. Purge : lifecycle R2 + cron Convex.
Légal et sécurité (validation juridique avant ouverture) :
- type `analysis-only` impossible à ajouter à une timeline, exporter ou publier (`ANALYSIS_ONLY_MEDIA`) ;
- `purposeAck` obligatoire et mention CGU (analyse et courte citation, CPI L122-5) ; les CGU des plateformes interdisent le téléchargement non autorisé : périmètre limité, rétention 7 jours, journal, retrait sur demande ;
- contenus publics uniquement, pas de DRM ;
- quotas : 20 imports/jour/espace (100 en pro), 3 en parallèle ;
- journal d'audit 12 mois, endpoint de retrait ;
- allowlist : youtube.com, youtu.be, tiktok.com, vm.tiktok.com, instagram.com, x.com, twitter.com.
Erreurs : `UNSUPPORTED_PLATFORM`, `CONTENT_NOT_PUBLIC`, `TOO_LONG`, `FETCH_BLOCKED`, `QUOTA_EXCEEDED`, `EXTRACTOR_OUTDATED`, `ANALYSIS_ONLY_MEDIA`, `DRM_PROTECTED`.
Tests : fumée quotidienne par plateforme, refus de durée, purge J+7, refus timeline, quota, cache.
Effort : L.

## 3. `transcribe_media` v2

But : précision (« chaud » transcrit « show »), glossaire, diarisation, plus de 10 min, formats multiples. Rétrocompatible.

Entrée (ajouts) : `analysisMediaId`, `durationSec` jusqu'à 7200, `language` conseillé, `glossary[≤200]`, `diarization`, `maxSpeakers`, `quality` (rapide / precis = Whisper large-v3 par défaut), `formats[]` (json, srt, vtt, txt, words), `srtMaxChars` (42).
Sortie : `language`, `durationSec`, `text`, `segments[{start, end, speaker, text, confidence}]`, `words[{w, start, end, speaker, p, glossaryFix}]`, `speakers[]`, `files {srt, vtt}` (R2 présigné), `lowConfidence[{start, w, alternatives}]`, `creditsCharged`, `cached`.

Coût : ~1 crédit/min ; +0,5/min avec diarisation ; cache gratuit.
Dépendances : fal-ai/whisper (large-v3) ou fal-ai/wizper ; à benchmarker : Deepgram nova-3, ElevenLabs Scribe. Glossaire en 2 couches : `initial_prompt` Whisper, puis correction phonétique (Double Metaphone FR + Levenshtein) des mots à faible confiance, marquée `glossaryFix`. Glossaire de marque fusionné depuis `get_brand_kit`.
Architecture : synchrone sous 2 min, async au-delà ; audio mono 16 kHz FLAC ; découpage sur silences en tranches ≤ 8 min avec 2 s de recouvrement, 4 en parallèle, recollage par alignement ; plafond 2 h.
Erreurs : `NO_AUDIO_TRACK`, `TOO_LONG`, `LANGUAGE_UNSUPPORTED`, `ASR_PROVIDER_FAILED`, `INSUFFICIENT_CREDITS`.
Tests : corpus FR de 30 clips (WER < 8 %, glossaire 100 %), non-régression « chaud », 25 min sans doublon, SRT valide, dialogue à 2 voix.
Effort : M (L avec diarisation multi-tranches).

## 4. `make_moodboard` : planche de styles PNG

Entrée : `sources[1..8]` (`mediaId` | `analysisMediaId` | `url`, `frames` 1..6, `times[]`), `styleId`, `title`, `layout` (grille, mosaique, bandeau-9x16), `format`, `include[]` (palette, typo, mots-cles, notes, style-proche), `saveToLibrary`, `projectId`.
Sortie : `board {mediaId?, preview}`, `palette[]`, `typo[]`, `motsCles[]`, `styleProche`, `frames[]`, `creditsCharged`.
Coût : 1 crédit (vision interne), rendu gratuit, 0 en cache.
Dépendances : extract_frames, analyze_image, sharp ; rendu recommandé avec **satori + resvg-js** (< 2 s, sans navigateur) ; alternative : `previewFrames` de `@clapova/render` avec une option `width`/`renderStill`.
Sécurité : une planche contenant des frames `analysis-only` est elle-même `analysis-only`.
Effort : M.

## 5. `list_styles` / `get_style` : catalogue de styles côté serveur

But : une seule source de vérité pour les styles (enums actuels : standard, hyper-motion, gen-z-edit, luxe, ugc-telephone, creator_vertical, apple_clean), partagée avec le plugin.
`list_styles` : filtres `format`, `platform`, `tags`, `query`, `similarToMediaId` ; sortie `catalogVersion`, `styles[{styleId, nom, resume, tags, formats, platforms, thumbnail, score}]`.
`get_style` : `styleId`, `include[]` ; sortie versionnée : `rythme`, `palette`, `typo`, `motion`, `sousTitres`, `musique`, `interdits`, `exemples`, `editPlanOps`, `reviewGrid`.
Coût : gratuit. Stockage : dépôt `clapova-styles` (JSON/YAML validés par Zod), publié vers une table Convex et R2 ; embeddings précalculés ; le plugin appelle l'outil avec un `styles.snapshot.json` de secours généré par la CI. Les enums `style` deviennent des `string` validées contre le catalogue (rétrocompatible). Styles de marque privés au lot 3.
Effort : M.

## 6. `analyze_edit` : mesures objectives d'un montage exporté

Entrée : `mediaId` | `analysisMediaId` | `renderId`, `compareTo {styleId | mediaId | analysisMediaId}`, `metrics[]` (coupes, rythme, texte, mouvement, audio, noir, accroche, safezone), `ocr`.
Sortie : `coupes {count, timecodes, moyenneSec, medianeSec, p90Sec, premieres3s}`, `rythme {courbe, calageBeat, bpmMusique}`, `texte {couverturePct, motsParSec, maxMotsEcran, horsSafeZone}`, `mouvement`, `audio {lufsIntegre, truePeak, silences, voixVsMusiqueDb}`, `noir[]`, `accroche`, `comparaison {cible, ecarts}`, `planche`, `recommandations[{fr, editPlanOps}]`.
Coût : gratuit sans OCR, 1 crédit avec.
Dépendances : PySceneDetect (recommandé) ou ffmpeg `select=gt(scene,0.3)` ; ffmpeg `ebur128`, `silencedetect`, `blackdetect` ; aubio ou essentia pour le BPM.
Architecture : async hybride, ~0,3× le temps réel, timeout 10 min.
Tests : vidéos synthétiques à coupes connues (±1 frame), F1 coupes > 0,95.
Effort : M.

## 7. `media_preview_url` : lien direct court terme

Entrée : `mediaId` | `renderId` | `analysisMediaId` | `generationId`, `variant` (apercu, original, poster, gif, planche), `ttlSec` (60..3600, 900 par défaut), `atSec`.
Sortie : `url` R2 présignée, `expiresAt`, `mime`, dimensions, `bytes`, `markdown`, `fallback {projectUrl}`.
Coût : gratuit. Synchrone si le dérivé existe, sinon généré à la volée. Les générations fal.ai sont rapatriées dans R2 à la complétion (webhook) : corrige le blocage fal.media à la racine.
Sécurité : contrôle d'espace, TTL ≤ 1 h, `inline`.
Effort : S (M avec rapatriement fal et `preview` partout).

## 8. Budget pré-autorisé pour `approve_storyboard` en délégation

Problème : approve_storyboard exige les mots de l'utilisateur dans son dernier message ; un sous-agent n'en a pas.
- `grant_budget({ userConfirmation, maxCredits, scope {projectIds, tools}, expiresInMin (120), label })` appelé par l'agent principal avec les mots exacts → `{ grantId, maxCredits, remaining, expiresAt, scope }`.
- `approve_storyboard` accepte `userConfirmation` OU `grantId` : vérifie validité, périmètre, estimation ≤ restant, et réserve le montant.
- Chaque débit décrémente `remaining` ; dépassement → `BUDGET_EXCEEDED`.
- `get_budget`, `revoke_budget`, révocation dans l'UI, notification à 80 %.
- Traçabilité `grantId`, `toolCallId`, `agentKind` ; un grant actif par projet ; `export_video` et `publish_post` exclus par défaut.
Coût : gratuit. Effort : M.

## 9. Corrections de bugs

| Priorité | Bug | Correctif | Effort |
|---|---|---|---|
| P0-1 | create/update_storyboard débitent 1 crédit annoncés gratuits | Rendre gratuit, test d'invariant CI, rembourser les débits passés | S |
| P0-2 | generate_video dépasse 60 s | Contrat hybride + webhook fal + rapatriement R2 | M |
| P0-3 | approve_storyboard bloque la délégation | §8 | M |
| P0-4 | export_video « media_missing » sur une scène motion visible | Pré-contrôle via `checkComposition` de `@clapova/render` ; matérialiser les assets motion dans R2 ; erreur avec `clipId`, `src`, `hint` | M |
| P1-5 | render_preview_frames expire | `previewFrames` sur file prioritaire, cache par hash, contrat hybride, retour partiel | M |
| P1-6 | estimate_storyboard ignore les scènes motion | Ajouter le barème motion ; écart estimation/réel < 10 % | S |
| P1-7 | textAnim by:"word" colle les mots | Espace en nœud texte entre les `<span>`, `white-space: pre-wrap` ; test snapshot dans clapova-engine | S |
| P2-8 | transcribe_media plafonné à 10 min, sans glossaire | §3 | M |
| P2-9 | Pas d'import social, vision image, moodboard, catalogue | §1, §2, §4, §5 | — |

## 10. Ordre de livraison

**Lot 1, quick wins (2 à 3 semaines)** : P0-1 ; P1-7 ; P1-6 ; contrat async générique appliqué à generate_video et render_preview_frames ; media_preview_url + rapatriement fal + champ `preview` ; list_styles/get_style avec les 7 styles existants ; analyze_image synchrone (≤ 4 images).

**Lot 2, cœur (4 à 6 semaines)** : P0-4 ; grant_budget ; transcription v2 (glossaire, langue, SRT/VTT, > 10 min) ; analyze_edit sans OCR ; make_moodboard ; analyze_image batch + styleMatches.

**Lot 3, avancé (après validation juridique)** : import_social_video ; diarisation multi-tranches ; analyze_edit avec OCR et comparaison à une référence importée ; styles de marque privés ; chaînage `then`.

## 11. Usage par les skills du plugin

- **toolbox-createur** : lien social → `import_social_video` (`then: analyze_reference_video, transcribe`) ; fichier → `create_upload_link` ; image → `analyze_image` ; `make_moodboard` montré via `preview.url` ; `list_styles({similarToMediaId})` puis `get_style` ; après export `analyze_edit({compareTo:{styleId}})`. Jamais de média `analysis-only` dans un montage.
- **cadrage** : styles via `list_styles` (snapshot en secours) ; palette et typo depuis analyze_image / make_moodboard ; glossaire de marque passé à la transcription ; pour un travail délégué, accord explicite sur un montant puis `grant_budget` et `grantId` transmis au sous-agent.
- **storyboard** : `get_style` pour contraindre durées et typo ; `estimate_storyboard` motion compris ; validation par `userConfirmation` ou `grantId` ; contrôle `render_preview_frames` → `media_preview_url` → `review_montage` ; après export `analyze_edit`.
- Mettre à jour `get_guide` (reference, veille, storyboard, visuels) et ajouter un sujet `toolbox`.

## 12. Métriques de réussite

| Domaine | Métrique | Cible |
|---|---|---|
| Fiabilité MCP | Timeouts 60 s (generate_video, render_preview_frames) | < 0,5 % |
| Crédits | Incidents « gratuit » débité ; écart estimation/réel | 0 ; < 10 % |
| Export | Échecs `media_missing` avec motion | < 0,5 % |
| Affichage | Médias montrés avec succès dans la conversation | > 98 % |
| Transcription | WER FR / rappel glossaire / > 10 min réussies | < 8 % / 100 % / > 97 % |
| Import social | Succès par plateforme | YT > 98 %, TikTok > 90 %, IG > 85 %, X > 90 % |
| Vision | Accord humain palette, typo, style | > 85 % |
| analyze_edit | F1 coupes | > 0,95 |
| Délégation | Flux sous-agent jusqu'au build sans retour imprévu ; dépassements | > 80 % ; 0 |
| Produit | Projets démarrés avec moodboard ou analyze_image | > 30 % à 3 mois |
| Légal | Retraits traités < 48 h ; médias analysis-only > 7 jours | 100 % ; 0 |

## 13. Récapitulatif

| Outil | Coût | Mode | Effort | Lot |
|---|---|---|---|---|
| get_job_status | 0 | long-poll ≤ 45 s | S | 1 |
| media_preview_url + `preview` | 0 | sync / hybride | S-M | 1 |
| list_styles / get_style | 0 | sync | M | 1 |
| analyze_image | 1 / 4 images | sync ≤ 4, sinon hybride | M | 1-2 |
| transcribe_media v2 | ~1/min (+0,5 diarisation) | sync < 2 min, sinon async | M-L | 2 |
| make_moodboard | 1 | hybride | M | 2 |
| analyze_edit | 0 (1 avec OCR) | async hybride | M | 2-3 |
| grant_budget / get_budget / revoke_budget | 0 | sync | M | 2 |
| import_social_video | 1 | async hybride | L | 3 |

Fichiers utiles : `clapova-engine/packages/clapova-render/README.md` (`checkComposition`, `previewFrames`), `clapova-engine/packages/clapova-fly/README.md` (worker `clapova-fetch`), composition `textAnim` dans clapova-engine (P1-7, fichier à localiser), skills du plugin (toolbox-createur, cadrage, storyboard). Côté app : définitions des outils MCP, middleware de crédits, table des jobs, pré-contrôle d'export.
