---
name: motion-tokens
description: Use when a Clapova motion piece needs timing values — « c'est trop lent », « ça rebondit trop », « mets des easings pro », durée d'entrée, stagger — or when a clapova:motion-* skill or create_motion_scene needs the shared durations, cubic-bezier, GSAP CustomEase and springs. Not for style (clapova:motion-direction-artistique) nor cut rhythm (clapova:montage-rythme).
---

# Clapova : tokens motion (durées, courbes, ressorts)

Une idée : toutes les animations Clapova piochent dans **une seule table de valeurs nommées**. On n'invente pas une durée ni une courbe ; on cite un token. Source canonique : `docs/synthese-motion-design.md` §3.1. Phase A (motion design).

Tableau prêt à coller dans `create_motion_scene` : `references/tokens.md`. Anti-patterns à identifiant stable : `references/anti-patterns.md`.

## Les valeurs (résumé)

| Token | Valeur | Source |
|---|---|---|
| `micro` | 0,15 s | Material 3 (officiel) |
| `fast` | 0,25 s | M3 (officiel) |
| `base` | 0,4 s | M3 (officiel) |
| `slow` | 0,6 s | M3 (officiel) |
| `hero` | 0,8 à 1,0 s | M3 (officiel) |
| > 1 s | mouvements continus seulement (caméra, compteurs) | proposé |
| sortie | 65 à 70 % de l'entrée, toujours plus courte | Atlassian (principe officiel) ; ratio tiers |
| stagger | 40 à 80 ms par élément, total ≤ 0,5 s | tiers + Fluent (officiel, principe) |
| départ d'échelle | jamais `scale(0)` : de 0,9–0,97 avec opacité 0 | Emil (tiers) |

Courbes : `enter` (0.05, 0.7, 0.1, 1), `exit` (0.3, 0, 0.8, 0.15), `std` (0.2, 0, 0, 1), `expressive` (0.4, 0.14, 0.3, 1), `inout` (0.83, 0, 0.17, 1), `linear`. Ressorts : `spring.default` 0,8/380, `spring.pop` 0,6/800 (androidx, officiel), `spring.heavy`, `spring.snappy` (JakeB-5, tiers). Détail et équivalents GSAP : `references/tokens.md`.

## Règles d'usage

- Entrée = `enter` ; sortie définitive = `exit` ; opacité et couleur = `std` ou `linear`, **jamais de dépassement** (ressorts « effects » M3, amortissement 1,0).
- Distance : ×0,8 à 50 px, ×1 à 100 px, ×1,3 à 200 px, ×1,8–2 en plein écran (Lottie, tiers ; Carbon, principe officiel).
- Dépassement : premium 0 % ; succès 5–10 % ; célébration 15–25 % (Lottie, tiers). Le gros texte ne rebondit jamais (`spring.heavy`).
- 300 ms ne vaut que pour les micro-éléments (puce, coche, clic) ; un titre entre en `base` et tient selon son temps de lecture (`clapova:motion-titres`).
- Couleurs interpolées en OKLCH, jamais en sRGB brut ; tout aléa avec une graine fixe (iart, Barty, tiers). Dans `create_motion_scene`, `Math.random` est refusé : utilise une suite pseudo-aléatoire à graine écrite en dur.
- Tokens dérivés de la marque : `get_brand_kit` peut imposer un caractère (sobre → `std`, 0 % de dépassement ; énergique → `expressive`, `spring.pop`), jamais des valeurs hors table.

## Boucle de travail

1. `get_motion_toolkit` : vérifier les easings et limites réellement exposés par le moteur (presets CustomEase nommés : si disponibles ; sinon déclarer les CustomEase dans la scène, ou l'approximation `power*` de la table, marquée proposée).
2. Écrire la timeline de la pièce avec des noms de tokens (`titre: base/enter, stagger 0.06`), pas des nombres libres.
3. Construire : `create_motion_scene` ou `edit_motion_scene` (HTML/CSS/GSAP, tailles en % ou vw, événement final obligatoire), ou `add_motion_block` / `apply_edit_plan` (`set_motion` keyframes avec `ease`).
4. `render_preview_frames` sur les instants d'entrée et de sortie ; corriger.

## Interdits

`scale(0)` au départ ; sortie plus longue que l'entrée ; ease par défaut ou `linear` sur un déplacement ; dépassement sur une opacité ou une couleur ; durée > 1 s pour une entrée d'élément ; stagger total > 0,5 s ; balancement périodique (voir `clapova:montage-camera-virtuelle`).

## Contrôle

- Chaque `duration` et `ease` de la scène correspond à un token nommé (relire le code avant l'envoi).
- Planche `render_preview_frames` : aucune image où un élément surgit tout formé ou glisse à vitesse constante (défaut D6, JakeB-5).
- Les équivalences ressort ↔ `back.out` et cubic ↔ `power*` sont **proposées, à valider à l'œil** : le signaler si on s'en sert.

## Renvois

Style et intensité : `clapova:motion-direction-artistique`. Titres : `clapova:motion-titres`. Transitions : `clapova:montage-transitions`. Caméra : `clapova:montage-camera-virtuelle`. Relecture : `clapova:controle-qualite`.

Sources : Material 3 et androidx (Apache-2.0), IBM Carbon (Apache-2.0), Fluent 2 (MIT), Polaris (MIT), Uber baseweb (MIT), Atlassian ; principes reformulés d'après lottiefiles/motion-design-skill (MIT), emilkowalski/skills (MIT), JakeB-5/motion-graphic-skill (MIT), greensock/gsap-skills (MIT).
