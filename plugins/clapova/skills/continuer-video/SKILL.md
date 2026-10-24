---
name: continuer-video
description: Use when a Clapova user wants to extend, continue or prolong an existing video clip ("continue la vidéo", "la suite du plan", "prolonge ce plan", "fais durer plus longtemps", "plan suivant dans la même scène") with continue_video, which generates the next shot from the real last frame and places it right after the source clip. Not for a first clip from scratch (clapova:generate) nor a change of scene (new generate_video).
---

# Clapova : continuer une vidéo

Outil MCP : `continue_video({mediaId, prompt, clipId?, name?, intent?, projectId?})` (pas de `preset`, d'`imageUrl` ni d'`aspectRatio`) (facturé comme une génération vidéo, remboursé en cas d'échec). Un clip dure 10 s au plus : la suite est le moyen d'allonger une scène.

## Méthode

1. **Source** : `mediaId` depuis `list_media` ou `list_library` (fichier de l'utilisateur sur son ordinateur : `create_upload_link({expectedKind:"video"})` puis `get_upload_status` jusqu'à `done` ; fichier https direct : `import_media_from_url`, après vérification que l'utilisateur a les droits). Un lien YouTube ne s'importe pas : « continue cette vidéo YouTube » → demande le fichier qu'il possède, ou s'il veut s'en inspirer, `clapova:recreer-depuis-reference`. `get_media_info` donne la durée. `get_credits` avant, puis annonce le coût d'un clip entier en une ligne AVANT de lancer (coût lu dans la description de l'outil) ; pour une chaîne de 2 continuations, annonce le total et demande l'accord.
2. **Regarder la fin** : pose le clip source dans un projet (`add_media_to_project`, ou `create_project` d'abord) et regarde `render_preview_frames` sur les 1,0 s et 0,2 s avant la fin (durée via `get_media_info`) : c'est la seule voie qui renvoie des images (`extract_frames` ne renvoie que du texte en MCP). Un flou ou un visage coupé s'y verra. Sans projet, dis que la fin n'a pas été vue.
3. **Prompt** : `continue_video({mediaId, prompt, clipId?, projectId?, name?})`. Le prompt décrit seulement la suite de l'action (même lumière, même cadrage, un seul mouvement). Ne redécris pas l'image de départ. `continue_video` n'a pas de champ preset : le mouvement de caméra se dit dans la phrase du prompt (un seul, ex. « slow push-in »).
4. **Raccord** : le clip suivant doit être dans le même projet (`projectId` à la génération, sinon `add_media_to_project`) ; `render_preview_frames` autour de la coupe (1 s avant, 1 s après). Un saut de lumière ou de visage : régénère avec un prompt plus proche de la dernière image ; sur la timeline, adoucis la coupe : `get_timeline`, puis un `apply_edit_plan` avec `{"op":"set_transition","clipId":"<clip suivant>","edge":"in","transition":{"preset":"transition-fondu"}}`, et `check_composition`.
5. **Son** : l'audio natif sert d'ambiance seulement et peut différer entre la source et la suite ; `set_volume` du clip à 0 si ça gêne, la voix et la musique se posent au montage (`clapova:monteur`, après `get_guide('montage')`) ; la musique doit couvrir toute la scène une fois les clips enchaînés (boucle ou `generate_music` à la durée totale).

## Pièges

- Enchaîner plus de 2 continuations : la dérive (visage, décor) s'accumule. Repars d'une image-clé.
- « Prolonge de 30 s » : 3 × 10 s en chaîne dérive. Mieux : une image-clé par plan (`generate_image`) puis `generate_video` depuis chacune (`imageUrl`), 3 plans de 10 s montés ensemble ; `estimate_plan` et total annoncé avant, accord avant de lancer. (`plan_shots` calcule des coupes sur une voix, il ne découpe pas une vidéo.)
- Changer de lieu ou de personnage : c'est un nouveau plan, pas une suite.
- Prompt qui contredit le plan source (autre éclairage, autre costume).

## Critères de fin

Le nouveau clip est placé juste après le source si celui-ci est sur la timeline (sinon il est seulement ajouté à la bibliothèque : dis-le), le raccord est vu sur deux images, le coût est annoncé en une ligne, une seule suite est proposée (monter, continuer encore, ajouter une voix).
