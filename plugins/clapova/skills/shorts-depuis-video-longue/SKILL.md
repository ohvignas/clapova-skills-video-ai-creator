---
name: shorts-depuis-video-longue
description: Use when a Clapova user wants Shorts, Reels or TikToks cut from a long video (podcast, interview, webinar, YouTube video) — pick the best moments, one 9:16 project per short, subject framing, captions, animated title, export with the platform preset.
---

# Clapova : Shorts depuis une vidéo longue

## Méthode

1. **Source** : `list_media` / `list_projects` ; fichier local volumineux : `create_upload_link` puis `get_upload_status` (voir `clapova:utiliser-clapova`).
2. **Moments** : transcris avec `analyze_rushes` (≈ 1 crédit/min, puis la transcription est conservée donc gratuite pour les sous-titres), repère 3 à 6 moments autonomes de 15 à 45 s : une idée complète, une accroche dans les 3 premières secondes, une fin nette. `analyze_virality` peut classer les candidats. Présente la liste (début, fin, accroche) et attends l'accord avant de couper.
3. **Un projet 9:16 par short** : `create_project` (9:16), source posée avec `add_clip{mediaId, trimIn, duration}` aux temps exacts du moment.
4. **Cadrer** : `frame_subject` pour garder le sujet rempli dans le cadre vertical, élément fort dès la 1re image.
5. **Sous-titres** : `add_captions` look `pop`, 3 mots par page, tiers central.
6. **Titre animé** : un bloc motion court (`add_motion_block`), contraste du texte secondaire au moins `#B8B8C4`.
7. **Contrôle** : `check_composition`, puis `render_preview_frames` et regarde la planche (accroche, coupes, titre, fin).
8. **Export** : `export_video` avec le preset de la plateforme (`tiktok`, `reels`, `shorts`), seulement après accord sur le coût ; les shorts à la suite, sans attendre chaque export. Conclus en trois lignes (exportés, échoués, crédits).

## Règles

- Voix devant ; musique absente ou ≈ 0,35 en ducking ; -14 LUFS / -1,5 dBTP (automatique à l'export).
- Pas de storyboard pour ce flux : les moments choisis en tiennent lieu.
- Ne jamais couper au milieu d'une phrase ; laisser 0,3 s d'air avant et après.
