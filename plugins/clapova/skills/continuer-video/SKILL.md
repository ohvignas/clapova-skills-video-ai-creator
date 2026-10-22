---
name: continuer-video
description: Use when a Clapova user wants to extend, continue or prolong an existing video clip ("continue la vidéo", "la suite du plan", "prolonge ce plan", "fais durer plus longtemps", "plan suivant dans la même scène") with continue_video, which generates the next shot from the real last frame and places it right after the source clip. Not for a first clip from scratch (clapova-generate) nor a change of scene (new generate_video).
---

# Clapova : continuer une vidéo

Outil MCP : `continue_video` (facturé comme une génération vidéo, remboursé en cas d'échec). Un clip dure 10 s au plus : la suite est le moyen d'allonger une scène.

## Méthode

1. **Source** : `mediaId` depuis `list_media` ou `list_library` (URL externe : `import_media_from_url` d'abord). `get_credits` avant, car le coût est celui d'un clip entier.
2. **Regarder la fin** : `extract_frames` (mode `timestamps`, dernières secondes, gratuit) pour voir l'image réelle qui servira de départ. Un flou ou un visage coupé s'y verra.
3. **Prompt** : `continue_video({mediaId, prompt, clipId?, projectId?, name?})`. Le prompt décrit seulement la suite de l'action (même lumière, même cadrage, un seul mouvement). Ne redécris pas l'image de départ. Le mouvement de caméra passe par un preset (`clapova:presets`).
4. **Raccord** : `render_preview_frames` autour de la coupe (1 s avant, 1 s après). Un saut de lumière ou de visage : régénère avec un prompt plus proche de la dernière image.
5. **Son** : l'audio natif sert d'ambiance seulement ; la voix et la musique se posent au montage (`clapova:monteur`).

## Pièges

- Enchaîner plus de 2 continuations : la dérive (visage, décor) s'accumule. Repars d'une image-clé.
- Changer de lieu ou de personnage : c'est un nouveau plan, pas une suite.
- Prompt qui contredit le plan source (autre éclairage, autre costume).

## Critères de fin

Le nouveau clip est placé juste après le source, le raccord est vu sur deux images, le coût est annoncé en une ligne, une seule suite est proposée (monter, continuer encore, ajouter une voix).
