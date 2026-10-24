---
name: montage-transitions
description: Use when choosing or fixing transitions in a Clapova edit — « transition », « raccord », « enchaînement », « match cut », « fondu », « whip », « trop d'effets entre les plans ». Hard cut by default, fades, match cuts, whip/flash/glitch limits, placement, cut checks. Not for camera moves (clapova:montage-camera-virtuelle) nor cut timing (clapova:montage-rythme).
---

# Clapova : transitions

Phase A. Règles reprises de la synthèse §3.7 ; la boucle d'outils est celle de `clapova:montage`. Les transitions sont portées par les clips (`set_transition`, `crossfade`), jamais par un clip à part.

## Règles

- **Coupe franche par défaut.**
- **Changement de sujet** : fondu ou fondu enchaîné de 0,25 à 0,4 s.
- **Transition marquante** : raccord par élément continu (match cut, container transform) en 0,5 à 0,8 s avec la courbe `inout` (courbes : `clapova:motion-tokens`). Durées **proposées**, principes Fluent et Carbon (officiel).
- **Variété causée** : 3 à 5 types de transition par film, chacun causé par ce qui est à l'écran ; au plus un tiers de coupes sèches entre beats.
- **Diaporama photo** : une seule transition, fondu de 0,4 à 0,6 s.
- **Whip, flash, glitch** : au plus un par vidéo, jamais en série. Le flash est déconseillé par les sources officielles (risque photosensible) : le proposer seulement si la fiche le demande.
- **Placement** : `start = coupe − durée/2` (**proposé**).
- **Flou de masquage** d'un fondu imparfait : toujours sous 20 px.
- **Recettes** (zoom à travers un bouton, morph) et table preset → usage : `references/familles.md`, à lire avant de poser une transition autre qu'une coupe ou un fondu.
- La fiche de direction (ligne Caméra / Interdits) prime : un style « calme premium » n'a ni whip ni glitch.

## Boucle

1. Fiche (`clapova:cadrage`) : Énergie, Caméra, Interdits.
2. `get_timeline` : lister chaque coupe (temps, plan sortant, plan entrant, transition actuelle).
3. Pour chaque coupe, écrire sa cause en une ligne (« même objet → match cut », « nouveau sujet → fondu 0,3 s », « rien → coupe »). Pas de cause = coupe franche.
4. Compter : types utilisés (3 à 5), whip/flash/glitch (≤ 1), coupes sèches entre beats (≤ un tiers).
5. `apply_edit_plan` en un lot : `set_transition{clipId|at, edge, transition:{preset}|null}`, `crossfade{clipA, clipB, duration}`.
6. `check_composition`, puis Contrôle.

## Interdits

- Transition sans cause visible ; transition à chaque coupe « pour faire dynamique ».
- Deux whip, flash ou glitch dans la même vidéo, ou en série.
- Fondu depuis le noir à l'ouverture (règle d'accroche : `clapova:montage-accroche`).
- Transition posée comme clip séparé ou sur une piste créée.
- Flou de masquage de 20 px ou plus.

## Contrôle

- Tableau des coupes rendu à l'utilisateur : temps · transition · cause. Types comptés, plafonds respectés.
- Pour chaque transition non franche : `render_preview_frames` autour de la coupe (coupe − 0,2 s, coupe, coupe + 0,2 s ; `mode:"cuts"` si disponible), 12 instants max par appel. Regarder : pas d'image noire, pas de texte coupé en deux, élément du raccord bien continu.
- Vérifier sur la timeline que chaque fondu commence à `coupe − durée/2`.
- `review_montage` sans défaut de transition restant (`clapova:controle-qualite`).
