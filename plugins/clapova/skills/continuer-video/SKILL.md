---
name: continuer-video
description: Use when a Clapova user wants to extend, continue or prolong an existing video clip ("continue la vidéo", "la suite du plan", "prolonge ce plan", "fais durer plus longtemps", "plan suivant dans la même scène") with continue_video, which generates the next shot from the real last frame and places it right after the source clip. Not for a first clip from scratch (clapova-generate) nor a change of scene (new generate_video).
---

# Clapova : continuer une vidéo

Outil MCP : `continue_video({mediaId, prompt, clipId?, name?, intent?, projectId?})` (pas de `preset`, d'`imageUrl` ni d'`aspectRatio`) (facturé comme une génération vidéo, remboursé en cas d'échec). Un clip dure 10 s au plus : la suite est le moyen d'allonger une scène.

## Méthode

1. **Source** : `mediaId` depuis `list_media` ou `list_library` (fichier https direct hébergé : `import_media_from_url` d'abord, après vérification que l'utilisateur a les droits ; un lien YouTube ne s'importe pas). `get_media_info` donne la durée. `get_credits` avant, puis annonce le coût d'un clip entier en une ligne AVANT de lancer.
2. **Regarder la fin** : `extract_frames` (mode `timestamps`, p. ex. durée − 1 s et durée − 0,2 s calculés avec `get_media_info`, gratuit) pour voir l'image réelle qui servira de départ. Un flou ou un visage coupé s'y verra.
3. **Prompt** : `continue_video({mediaId, prompt, clipId?, projectId?, name?})`. Le prompt décrit seulement la suite de l'action (même lumière, même cadrage, un seul mouvement). Ne redécris pas l'image de départ. `continue_video` n'a pas de champ preset : le mouvement de caméra se dit dans la phrase du prompt (un seul, ex. « slow push-in »).
4. **Raccord** : `render_preview_frames` autour de la coupe (1 s avant, 1 s après). Un saut de lumière ou de visage : régénère avec un prompt plus proche de la dernière image ; sur la timeline, adoucis la coupe avec `set_transition` (`transition-fondu`, 0,3 s) et passe `check_composition`.
5. **Son** : l'audio natif sert d'ambiance seulement et peut différer entre la source et la suite ; `set_volume` du clip à 0 si ça gêne, la voix et la musique se posent au montage (`clapova:monteur`).

## Pièges

- Enchaîner plus de 2 continuations : la dérive (visage, décor) s'accumule. Repars d'une image-clé.
- « Prolonge de 30 s » : 3 × 10 s en chaîne dérive. Mieux : une image-clé (`generate_image`, ou une image extraite) puis `generate_video` par plan, ou `plan_shots` pour découper ; annonce le total avant.
- Changer de lieu ou de personnage : c'est un nouveau plan, pas une suite.
- Prompt qui contredit le plan source (autre éclairage, autre costume).

## Critères de fin

Le nouveau clip est placé juste après le source si celui-ci est sur la timeline (sinon il est seulement ajouté à la bibliothèque : dis-le), le raccord est vu sur deux images, le coût est annoncé en une ligne, une seule suite est proposée (monter, continuer encore, ajouter une voix).
