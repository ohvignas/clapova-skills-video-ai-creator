---
description: Monter une vidéo dans un projet Clapova à partir d'un brief
argument-hint: "<brief : sujet, durée, format, plateforme>"
---

Monte cette vidéo dans Clapova : $ARGUMENTS

Suis les skills `clapova:monteur` et `clapova:montage-recipes`. Utilise l'agent `monteur-clapova` si la tâche est longue.
1. `get_guide('montage')` puis `get_credits`, puis `list_projects` ou `create_project` (ou `create_from_template`).
2. `list_media` / `list_library` ; génère seulement les médias manquants.
3. `apply_edit_plan` en un seul lot, musique sur toute la durée, son léger ; puis `check_composition`, `render_preview_frames` (regarde les images) et `review_montage` ; corrige.
4. Demande-moi avant `export_video` (facturé). Suis avec `get_render_status` ; une fois `done`, donne `videoUrl` et `studioUrl` avec un message de félicitations et un emoji.
