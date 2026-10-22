---
name: continuer-video
description: Use when a Clapova user wants to extend, continue or prolong an existing video clip (« continue la vidéo », « la suite », « prolonge ce plan »).
---

# Clapova : continuer une vidéo

Outil MCP : `continue_video` (facturé comme une génération vidéo, remboursé en cas d'échec).

1. Identifiez la vidéo : `mediaId` depuis `list_media` ou `list_library` (une URL externe s'importe d'abord avec `import_media_from_url`).
2. `continue_video({ mediaId, prompt, clipId?, name? })` : Clapova extrait la dernière image et génère la suite en image vers vidéo, puis place le clip juste après le clip source dans la timeline.
3. Le prompt décrit seulement la suite de l'action (même lumière, même cadrage) ; un mouvement de caméra passe par un preset (`clapova:presets`).
4. Vérifiez le raccord avec `render_preview_frames` autour de la coupe.
