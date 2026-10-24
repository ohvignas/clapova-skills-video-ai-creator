---
name: motion-direction-artistique
description: Use when a Clapova motion video needs an art direction before building — « quel style », « fais premium », « dans l'esprit de… », « ça fait IA / cheap » — metaphor, style line, motion intensity, BANNED list, adjectives turned into numbers. Not for the full creative brief (clapova:cadrage) nor timing values (clapova:motion-tokens).
---

# Clapova : direction artistique motion

Une idée : avant la première scène, on fixe **une métaphore, un style annoncé en une ligne, trois réglages chiffrés et une liste BANNED**. Sans ça, le motion retombe dans la « bouillie IA ». Phase A (motion design), après la fiche de direction de `clapova:cadrage`, avant `clapova:storyboard`.

## Les 4 décisions (à écrire avant de construire)

1. **Métaphore** : une seule, tirée du monde du public (une appli bancaire → un ticket qui s'imprime ; un coach → un chronomètre). Elle donne les formes et les transitions (JakeB-5, iart ; tiers).
2. **Style** : déduit du sujet, **pas demandé à l'utilisateur**, annoncé en une ligne : « Style : `reel-motion`, parce que… ». Point de départ : la table sujet → style de `references/styles.md` (ids de `cadrage/styles/STYLES.md`). Si `clapova:cadrage` a déjà fixé le style, on le reprend.
3. **Trois réglages**, chacun sur 1–3 : variance (combien chaque scène diffère), intensité du mouvement, densité d'information. Chaque niveau correspond à des valeurs de `references/styles.md` (proposé).
4. **Liste BANNED** : `references/banned.md`, plus les ajouts propres au film. Elle grandit à chaque film et se relit au tour suivant.

## Traduire chaque adjectif en nombre

Aucun adjectif ne part en construction tel quel. Exemples (valeurs de `clapova:motion-tokens` et de la synthèse §3) :
- « premium » → dépassement 0 %, `std`/`enter`, `slow` à `hero`, une phrase par plan, plans 2,5–3,5 s (catalogue `premium-apple`).
- « énergique » → 120–140 BPM, 6 à 8 scènes de 1,5 à 3 s, `expressive`, `spring.pop`, typo sur les 1/8 et 1/16 de temps (Barty, tiers).
- « sobre » → au plus 3 couleurs, une police, au moins 3 moments immobiles (haidrrrry, tiers).
Une demande vague (« fais que ça pète ») : proposer 2 ou 3 choix mesurables (`clapova:revision-retours`).

## Palette et typo (rappels canoniques, synthèse §3.2)

Au plus 3 couleurs par scène hors noir et blanc ; la couleur héros sur un seul élément par image ; au plus 3 familles de police ; un seul mot mis en valeur par titre. La marque prime : `get_brand_kit` d'abord (`clapova:brandkit`).

## Boucle de travail

1. `get_brand_kit` (couleurs, polices, logo) ; références éventuelles lues avec `clapova:toolbox-createur`.
2. Écrire le bloc de direction (6 lignes) : métaphore, style + raison, 3 réglages, palette, typo, BANNED du film. Le montrer, attendre un oui.
3. Si l'outil existe : `list_styles` / `get_style` (plan toolbox, si disponible) pour les valeurs du style.
4. Transmettre le bloc à `clapova:storyboard`, puis construire avec `create_motion_scene` / `add_motion_block`.
5. Après chaque planche `render_preview_frames` : relire la liste BANNED, ajouter tout nouveau défaut vu.

## Interdits

Demander à l'utilisateur de choisir parmi 12 styles sans proposer ; deux styles dominants ; adjectif non traduit en nombre ; fond mesh, glow, particules, dégradé de texte sans charte explicite (synthèse C11) ; reprendre le style du film précédent à l'identique.

## Contrôle

- Le bloc de direction tient en 6 lignes et chaque ligne contient au moins une valeur ou un id.
- Sur la planche : un seul accent par image, aucune entrée de la liste BANNED visible.
- Le style annoncé est celui du storyboard (`direction.style`).

## Renvois

Brief et choix du rendu : `clapova:cadrage`. Valeurs : `clapova:motion-tokens`. Titres : `clapova:motion-titres`. Couleur des plans : `clapova:etalonnage`. Relecture : `clapova:controle-qualite`. Routeur : `clapova:montage`.

Sources : principes reformulés d'après JakeB-5/motion-graphic-skill (MIT, `styles.md`), iart-ai/motion-skills (MIT, art direction), Barty-Bart/motion-graphics (MIT), haidrrrry/claude-remotion-skill (MIT), kylezantos/design-motion-principles (MIT).
