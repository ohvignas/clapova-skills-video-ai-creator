# Grille BPM et coupes sur le temps

Lire avant de caler des coupes sur une musique.

## Calcul

- `frames_per_beat = 60 / BPM × fps`. Exemple : 120 BPM à 30 i/s = 15 images par temps ; 128 BPM à 30 i/s = 14,0625 images.
- **Arrondir le cumul, pas chaque pas** : temps n à l'image `round(offset + n × frames_per_beat)`. Arrondir chaque pas fait dériver la grille (à 128 BPM, 14 images par pas perdent une image tous les 16 temps).
- **Décalage du premier temps** (`offset`) : la musique ne commence pas toujours sur un temps ; le premier temps fort sert d'origine.
- Mesure = 4 temps : gros changements (nouvelle scène, révélation) sur le temps 1 de la mesure ; apparitions de typo sur les 1/8 et 1/16.

## Vérification de la grille

- Vérifier la grille sur les grosses caisses (sous 120 Hz) ; la recaler si l'écart médian dépasse 30 ms.
- Source des temps : `analyze_music_beats` (si disponible : BPM, décalage, grille, confiance) ; sinon les beats renvoyés par `plan_shots`. Confiance `uncertain` : ne pas caler, couper sur la voix et le sens.

## Tolérance des coupes

- Coupe « sur le temps » si elle tombe à ±2 images (67 ms à 30 i/s).
- Objectif : ≥ 60 % des coupes sur un temps ; les autres en contre-temps assumé (sur une syllabe, un geste).
- `snap_cuts_to_beats{beats, tolerance}` : tolérance d'environ 2 images (0,067 s à 30 i/s).

## Pub énergique

120–140 BPM ; 6 à 8 scènes de 1,5 à 3 s ; au plus 2 coupes sèches, chacune sur un temps fort.

Sources : calcul de grille et arrondi du cumul d'après iart-ai/motion-skills (MIT © 2026 iart.ai) ; vérification sous 120 Hz et seuil de 30 ms, pub énergique et répartition mesure / 1/8 d'après Barty-Bart/motion-graphics (MIT © 2026 Bart) et JakeB-5/motion-graphic-skill (MIT) ; seuil de 60 % d'après le rapport outils-contrôle (test sur la pub Nova). Formulations reprises et adaptées.
