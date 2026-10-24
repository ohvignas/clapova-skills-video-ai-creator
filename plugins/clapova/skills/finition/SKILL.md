---
name: finition
description: Use when a validated Clapova motion edit must become the finished video (phase B, on request) — « voix off finale », « version finale », « exporte », « livre », « mix final », « fichier pour TikTok / YouTube ». Final voice-over, mix via clapova:son-design, export per platform, delivery checks. Not for multi-format versions (clapova:declinaison-formats) nor captions (clapova:motion-sous-titres).
---

# Clapova : finition et livraison (phase B, sur demande)

Une idée : **on ne finit qu'un motion design validé.** La phase A (animation, titres, rythme, son provisoire) est approuvée par l'utilisateur ; la finition ajoute voix off finale, mix, export et livraison, seulement à sa demande. Absorbe `livraison-specs`.

## Boucle

1. **Valider l'entrée** : phase A approuvée par un oui ; `get_timeline` relu (changements de l'utilisateur intacts) ; `clapova:controle-qualite` à 0 P0.
2. **Voix off finale** (si prévue) : script validé, débit **2,3 mots/s** (2,0 en technique), hors plage sous 110 ou au-dessus de 170 mots/min ; durée de scène = mots ÷ 2,3 + 0,4 s (synthèse §3.3). `generate_voiceover` ou `generate_voiceover_lines({projectId, script, anchorToSceneEvents, dryRun:true})` d'abord ; coût annoncé. Puis recaler les scènes sur la voix réelle + 1 s de marge.
3. **Sous-titres** : seulement si demandés, via `clapova:motion-sous-titres`.
4. **Mix final** : via `clapova:son-design` (voix > SFX > musique, musique 15 à 18 LU sous la voix, cible −14 LUFS ±1, true peak ≤ −1,5 dBTP : §3.10, C4, C8, proposés).
5. **Contrôle avant export** : `check_composition` 0 erreur, `render_preview_frames` sur la première et la dernière image, chaque nom, prix et URL vérifié lettre à lettre contre la source.
6. **Export sur accord** : coût annoncé (`get_credits`), puis `export_video({projectId, resolution, fps, preset})` ; preset par plateforme dans `references/specs-plateformes.md`. Suivi : `get_render_status` jusqu'à `done`.
7. **Contrôle du fichier** : `get_media_info` (ou `ffprobe`) : résolution, i/s, durée du projet ±0,5 s, piste audio présente. Mesures du rendu : `analyze_edit` **quand disponible** (S1) et contrôle automatique après export **quand disponible** (S5) ; sinon `clapova:controle-qualite`, script `controle_video.py`.
8. **Livrer** (`references/checklist-livraison.md`) : nommage, `CREDITS.txt`, lien `videoUrl` et `studioUrl`, durée, format, crédits dépensés.

## Règles chiffrées

- Master 9:16 en **1080×1920** (Meta recommande 1440×2560 si possible), **720×1280 au minimum** (§3.9, officiel).
- Durée par défaut **6 à 15 s**, plus une version longue en test A/B (C5).
- CTA dans la zone vitale (x 120–900, y 270–1248), jamais dans le bas réservé (§3.6, §3.9).
- Première image : élément fort, pas de noir ; dernière image propre, carte CTA tenue (§3.4, §3.6).
- Musique de 0 à la dernière image, fondu de sortie d'environ 1 s (§3.10).
- Nommage : `client_projet_livrable_ratio_durée_vNN_date` (ex. `nova_isotherme_pub_9x16_15s_v03_2026-10-24.mp4`).
- Plusieurs formats : un projet par format, méthode dans `clapova:declinaison-formats` (pas dupliquée ici).

## Interdits

- Exporter sans demande explicite, sans coût annoncé, ou avec un P0 ouvert.
- Finir un motion design non validé ; reprendre la phase A ici.
- Poser des sous-titres par défaut.
- Dire « publié » : `publish_post` prépare seulement, l'utilisateur valide (`clapova:publication-calendrier`).
- Embarquer un son Mixkit, NC ou sans licence ; livrer sans `CREDITS.txt` quand un son ou une police exige un crédit.

## Contrôle

- [ ] Phase A validée, 0 P0, voix au bon débit.
- [ ] Sonie et crête mesurées sur le fichier exporté (pas seulement estimées).
- [ ] ffprobe conforme : résolution, i/s, durée ±0,5 s, audio.
- [ ] Première et dernière image vues ; noms, prix, URL relus.
- [ ] Fichier nommé, crédits listés, lien donné une seule fois en bas.

## Renvois

Son : `clapova:son-design`. Sous-titres : `clapova:motion-sous-titres`. Formats multiples : `clapova:declinaison-formats`. Contrôle : `clapova:controle-qualite`. Retours après livraison : `clapova:revision-retours`. Boucle : `clapova:montage`.

## Sources

Débit de voix off : digitalsamba/claude-code-video-toolkit et iart-ai/motion-skills (MIT). Checklist de livraison : iart-ai (MIT). Reformulés.
