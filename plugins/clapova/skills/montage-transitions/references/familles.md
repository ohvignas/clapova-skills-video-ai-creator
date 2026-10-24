# Familles de transitions et recettes

Lire avant de poser autre chose qu'une coupe franche ou un fondu.

## Quand utiliser quoi

| Cause à l'écran | Transition | Durée | Preset Clapova (`set_transition`) |
|---|---|---|---|
| Rien ne relie les plans | coupe franche | 0 | `null` |
| Changement de sujet, de lieu, de temps | fondu / fondu enchaîné | 0,25–0,4 s | `transition-fondu`, ou `crossfade{duration}` |
| Diaporama photo | fondu unique pour tout le film | 0,4–0,6 s | `transition-fondu` |
| Même forme ou même objet d'un plan à l'autre | match cut / container transform | 0,5–0,8 s, courbe `inout` | `transition-zoom`, `transition-glisse` ou bloc motion |
| Mouvement de caméra rapide déjà dans le plan | whip (≤ 1 par vidéo) | — | `transition-whip` |
| Fin de film | fondu de sortie | — | `transition-fondu-noir` |
| Rupture voulue (fiche nerveuse seulement) | glitch ou flash (≤ 1 par vidéo, flash déconseillé) | — | `transition-glitch`, `transition-flash` |

Autres presets disponibles : `transition-flou`, `transition-rotation`, `transition-volet` ; blocs motion `tr-wipe`, `tr-iris`, `tr-split-doors`, `tr-stripes`, `tr-chevron`, `tr-flash-white` (`get_motion_catalog`). Liste à jour : `get_motion_toolkit`.

## Recettes

**Zoom à travers un bouton** : le bouton passe d'environ 8 % à 250 % de sa taille en 0,35 s ; le plan suivant apparaît dans le bouton agrandi.

**Morph** : élément de 110 → 880 px en 0,2 s, `power3.out`, flou de 12 → 0.

## Placement

`start = coupe − durée/2` (proposé) : la transition est centrée sur la coupe.

Sources : principes de durée Fluent 2 (MIT) et IBM Carbon (Apache-2.0) ; variété causée, un tiers de coupes sèches, recettes zoom et morph d'après heygen-com/hyperframes `motion.md` (Apache-2.0) ; diaporama d'après iart-ai/motion-skills (MIT © 2026 iart.ai) ; flou sous 20 px d'après emilkowalski/skills (MIT © 2026 Emil Kowalski, animations.dev). Formulations propres.
