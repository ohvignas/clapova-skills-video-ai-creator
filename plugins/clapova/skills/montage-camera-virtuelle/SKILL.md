---
name: montage-camera-virtuelle
description: Use when a Clapova edit needs a virtual camera move — « zoom », « mouvement de caméra », « Ken Burns », « push-in », « parallaxe », « recadre en 9:16 sur mon visage », « la caméra qui suit » — push-in, punch zoom, parallax, camera-led cuts and product demo zooms. Not for transitions between shots (clapova:montage-transitions) nor shot length (clapova:montage-rythme).
---

# Clapova : caméra virtuelle

Une idée : **la caméra bouge pour une raison** (révéler, insister, relier deux éléments), jamais pour « faire vivant ». Phase A (motion design) : on pose et on valide les mouvements avant toute finition. Valeurs de durée et de courbe : `clapova:motion-tokens` (tokens `std`, `inout`, ressorts).

## Règles chiffrées (synthèse §3.8)

- **Push-in lent** sur tout le plan : échelle 1,0 → 1,08 environ, overscan ≥ 1,05, easing `std` ou `sine.inOut` (proposé, d'après des tiers).
- **Coup de zoom** (insister sur un mot) : 1 → 1,12, ressort amortissement 12 / raideur 200 (iart).
- **Caméra qui fait le montage** : poussée ou recul de 0,6 à 1,2 s, ressort critique (w ≈ 6) (Barty).
- **Parallaxe** : fond à 0,7–0,8× la vitesse du premier plan (tiers). Rotation de scène limitée à quelques degrés (Apple HIG, officiel).
- **Démo produit** : écran posé 0,5–1 s ; curseur 0,4–0,8 s en ease-in-out ; clic 0,2–0,3 s ; zoom ×2 en 1–2 s puis tenu 2–4 s (iart).
- **Secousse** : aléatoire, brève, faible amplitude ; jamais de balancement périodique (éviter les oscillations soutenues autour de 0,2 Hz, Apple HIG, officiel).
- **Recadrage 16:9 → 9:16 d'un orateur** (règle Clapova actuelle, skill talking-head) : zoom de départ 1,15 à 1,4 selon la largeur du locuteur, yeux à 35–40 % de la hauteur, visage jamais coupé.
- Aucun mouvement ne pousse un texte hors de la zone vitale (`clapova:montage` pour la zone sûre §3.9).

Table des presets, réglages et recettes : `references/mouvements.md`.

## Boucle de travail

1. `get_guide('motion')` puis `get_timeline` : relis la timeline (l'utilisateur a pu modifier) et repère les plans fixes ou les images.
2. Pour chaque plan, choisis **un** mouvement et sa raison (une ligne). Pas de mouvement sur un plan qui en a déjà un dans l'image filmée.
3. Sujet à viser : `frame_subject({projectId, clipIds})` (crédits, annoncés) donne la cible ; il ne recadre pas seul.
4. Pose l'effet : op `add_effect{clipId, preset, params:{zoom, cibleX, cibleY}}` dans `apply_edit_plan` (un seul lot), ou `add_motion_effect`. Élément mobile à suivre (texte collé à un objet) : `track_motion`.
5. Contrôle visuel : `render_preview_frames` au début, au milieu et à la fin de chaque plan bougé ; texte net, bords jamais visibles.
6. Correction, puis relecture par `clapova:controle-qualite`.

## Interdits

- `will-change` (ou rastérisation) sur ce que la caméra agrandit : le texte devient flou (Barty).
- Oscillation régulière, balancement « respirant », zoom lent qui rampe sur toutes les scènes.
- Toutes les scènes qui entrent avec le même mouvement.
- Bords noirs visibles : overscan sous 1,05.
- Mouvement qui cache le visage ou sort le produit du cadre.

## Contrôle

- [ ] Chaque mouvement a une raison écrite.
- [ ] Overscan ≥ 1,05, aucun bord sur les images de contrôle.
- [ ] Texte net à l'échelle maximale.
- [ ] Aucune oscillation périodique, au plus une secousse brève.
- [ ] Visage ou produit dans le cadre du début à la fin.

Sources : Material 3 / androidx (Apache-2.0), Apple HIG ; Barty-Bart/motion-graphics (MIT © 2026 Bart) ; iart-ai/motion-skills (MIT © 2026 iart.ai). Formulation propre.
