# Mouvements de caméra : presets et recettes

Valeurs reprises de `references/synthese-motion-design.md` (racine du plugin) §3.8, sauf mention « Clapova actuel » (règles déjà présentes dans les skills `talking-head` et `motion-design`).

## Presets disponibles (`add_effect{clipId|at, preset, params?}`)

| Preset | Usage | Réglage de départ |
|---|---|---|
| `camera-ken-burns` | push-in lent, recadrage visé | `zoom` 1,08 sur un plan ; 1,15–1,4 pour un recadrage 16:9 → 9:16 (Clapova actuel) ; `cibleX`, `cibleY` de 0 à 1 |
| `camera-zoom-punch` | insister sur un mot | 1 → 1,12 (iart) |
| `camera-zoom-out` | révéler le contexte | recul de 0,6 à 1,2 s (Barty) |
| `camera-pan` | relier deux éléments | easing `inout` (`clapova:motion-tokens`) |
| `camera-handheld` | secousse | brève, faible, aléatoire ; jamais en continu |
| `camera-rotate` | rare | quelques degrés au plus (Apple HIG) |

`camera-bounce` et toute oscillation régulière : à éviter (oscillation autour de 0,2 Hz, Apple HIG).

## Recettes

**Push-in sur image fixe** : `camera-ken-burns`, 1,0 → 1,08, overscan ≥ 1,05, `std` ou `sine.inOut`, sur toute la durée du plan.

**Orateur recadré en vertical** : `frame_subject`, puis `camera-ken-burns` avec `cibleX` = position horizontale du visage, `cibleY` 0,4 ; yeux à 35–40 % de la hauteur ; ajuster sur la planche (Clapova actuel).

**Caméra qui fait le montage** (pas de coupe) : le plan suivant est atteint par une poussée de 0,6 à 1,2 s, ressort critique w ≈ 6 (Barty).

**Parallaxe** : deux couches (fond, premier plan) ; fond à 0,7–0,8× la vitesse du premier plan (tiers). Détourage du premier plan : `clapova:detourage-sujet`.

**Démo produit** (iart) :

| Temps | Durée |
|---|---|
| Écran posé | 0,5–1 s |
| Curseur | 0,4–0,8 s, ease-in-out |
| Clic | 0,2–0,3 s |
| Zoom ×2 | 1–2 s, puis tenu 2–4 s |

Démo d'interface reconstruite : `clapova:motion-scene-ui`.
