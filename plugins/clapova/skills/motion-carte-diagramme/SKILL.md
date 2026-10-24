---
name: motion-carte-diagramme
description: Use when a Clapova video needs an animated map or an explanatory diagram ("carte animée", "itinéraire", "trajet sur la carte", "schéma", "comment ça marche", "étapes du process", "organigramme", "façon Vox"). Nodes then links then labels, focus and context. Not for counters and charts (clapova:motion-compteurs-data) nor app demos (clapova:motion-scene-ui).
---

# Clapova : carte animée et schéma explicatif

Une idée : **on construit l'explication sous les yeux du spectateur, une étape à la fois, et le reste s'efface.** Durées et courbes : `clapova:motion-tokens`. Style : `clapova:motion-direction-artistique`.

## Règles chiffrées

Schéma (§3.5, iart, tiers) :
- Ordre fixe : **nœuds, puis liens, puis libellés**.
- Chaque étape tenue **0,5 à 1,5 s** ; un libellé lu tient max(1 s ; 0,3 s × mots + 0,5 s) (C13).
- Ce qui n'est pas actif passe à **opacité 0,35** (focus et contexte).
- Nœuds en stagger 40–80 ms, total ≤ 0,5 s ; entrée `base` 0,4 s `enter`, jamais `scale(0)` mais 0,95 → 1 (§3.1).
- Un lien se trace en `slow` 0,6 s ; déplacement A → B en `inout` (§3.1).
- Le visuel de structure prend environ 6 images d'avance sur le mot dit ; un fait se cale sur son mot (Barty, tiers).

Carte (map-animation, iart, tiers) :
- Style « Vox » : graphismes animés à **12 i/s dans un montage à 24 i/s** (chaque valeur tenue 2 images). Option de style, pas un défaut.
- Trajet en `inout`, caméra qui suit en poussée de 0,6 à 1,2 s (§3.8) ; pas de rotation de scène au-delà de quelques degrés (Apple, officiel).
- Fond de carte dessiné en formes simples (pays, routes, points) dans la scène : pas de tuile ni d'URL externe (refusées par `create_motion_scene`).

Commun : au plus 3 couleurs par scène hors noir et blanc, couleur héros sur un seul élément (§3.2) ; texte dans la zone vitale x 120–900, y 270–1248 (§3.9) ; quelque chose de nouveau toutes les 2 à 4 s (§3.3).

## Boucle

1. `get_guide('motion')` lu en entier. Liste les étapes (3 à 6 nœuds) et les noms de lieux ; un lieu, une date ou un chiffre non confirmé est marqué [à confirmer] et montré à l'utilisateur.
2. `create_motion_scene({projectId, brief, startMs, durationMs, fragment})` avec la recette `references/diagramme.md` ou `references/carte.md`. Un événement par étape (`appear`, `whoosh` pour un trajet, `final`).
3. Note < 8 : `edit_motion_scene({projectId, sceneId, patch})`, 2 reprises au plus par tour.
4. Repli si `export_video` refuse la scène (« media_missing ») : une suite de `add_motion_block` (`callout-arrow-label`, `callout-highlight-box`, `title-split-lines`) aux mêmes temps, en prévenant l'utilisateur de la perte.
5. `render_preview_frames({projectId, times})` : une image par fin d'étape. Puis `place_sfx_from_events({projectId})`.

## Interdits

Tout afficher d'un coup ; libellés avant les liens ; flèches qui tremblent ; plus de 2 mouvements simultanés ; fond mesh, glow, particules (C11) ; vraie carte ou logo de service cartographique reconnaissable ; carte à 12 i/s mélangée à du 30 i/s fluide dans la même scène.

## Contrôle

- Sur la planche, chaque étape a sa propre image où l'élément actif est seul à pleine opacité.
- Aucun libellé coupé, aucun texte hors zone vitale, texte lu ≥ 58 px (§3.2, proposé).
- Note ≥ 8/10 ; défauts au format de `clapova:controle-qualite`.

## Sources

Synthèse §3.1, §3.3, §3.5, §3.8, C13. iart-ai explainer-video-skills (diagram) et map-animation-skills (MIT) ; Barty-Bart/motion-graphics (MIT). Formulations propres, voir `../../THIRD_PARTY_NOTICES.md`.
