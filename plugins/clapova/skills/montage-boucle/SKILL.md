---
name: montage-boucle
description: Use when a Clapova user wants a short vertical video that loops seamlessly — « boucle », « loop », « Reel qui tourne en boucle », « qu'on ne voie pas la fin », « TikTok qui recommence tout seul » — last frame equals first, 7 to 15 s, looping springs and motion. Not for the hook itself (clapova:montage-accroche) nor shot rhythm (clapova:montage-rythme).
---

# Clapova : formats courts qui bouclent

Une idée : **la fin rejoint le début sans couture**, pour que la vidéo reparte sans que l'œil voie le retour. Phase A : la boucle se construit et se valide pendant le motion design ; aucun sous-titre par défaut.

## Règles chiffrées

- **Dernière image identique à la première** (iart). En code, l'état à `t = durée` égale l'état à `t = 0` (Barty).
- **Durée 7 à 15 s** pour une boucle (iart), dans le défaut 6 à 15 s des formats verticaux (synthèse C5).
- **Ressort de boucle** : une valeur qui change plusieurs fois de cible ajoute le reste du cycle précédent, pour que la période se referme (`track` avec période, Barty).
- **Mouvement continu** (rotation, opacité de boucle) en easing `linear` (synthèse §3.1, `clapova:motion-tokens`).
- **Aléa à graine fixe** : particules ou bruit identiques à chaque tour (synthèse §3.1).
- La carte finale peut reprendre la première image (synthèse §3.6) ; le CTA reste dans la zone vitale (`clapova:motion-logo-cta`).
- L'image 0 reste un élément fort déjà en action, jamais un fondu depuis le noir : la boucle ne dispense pas de l'accroche (`clapova:montage-accroche`).
- Son : la musique couvre toute la durée (`clapova:son-design`). Pour une boucle, finir sur une fin de mesure qui rejoint le début plutôt que sur un fondu (**proposé, à confirmer**).

## Trois façons de boucler

1. **Retour au point de départ** : les éléments animés reviennent à leur état initial sur la dernière seconde.
2. **Phrase qui se complète** : la dernière ligne se termine par le début de la première (le texte d'ouverture complète la phrase de fin).
3. **Mouvement cyclique** : rotation ou défilement dont la période divise la durée.

## Boucle de travail

1. `get_guide('motion')`, `get_timeline` ; durée cible entre 7 et 15 s, notée.
2. Choisis une des trois façons et écris-la en une ligne (ce qui revient, à quel instant).
3. Construis : scène `create_motion_scene` / `edit_motion_scene`, ou montage `apply_edit_plan` (un seul lot). Le dernier plan se termine dans l'état exact du premier.
4. Contrôle : `render_preview_frames` à `t = 0` et sur la dernière image, comparées côte à côte ; puis quelques images de part et d'autre de la couture (bande autour de la coupe, si disponible).
5. Relecture `clapova:controle-qualite`.

## Interdits

- Fondu au noir ou carte de fin figée qui casse la boucle.
- Aléa sans graine (la boucle « saute » au retour).
- Mouvement continu avec une courbe qui ralentit à la couture.
- Boucle plus longue que 15 s sans accord.

## Contrôle

- [ ] Première et dernière image identiques à l'œil sur la planche.
- [ ] Durée entre 7 et 15 s.
- [ ] Aucun saut de mouvement, de couleur ou de son à la couture.
- [ ] Image 0 forte, lisible sans contexte.

Sources : iart-ai/motion-skills, pack short-form-video (MIT © 2026 iart.ai) ; Barty-Bart/motion-graphics, moteur `M.track` (MIT © 2026 Bart). Formulation propre.
