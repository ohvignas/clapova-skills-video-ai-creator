# Guidelines motion des pros : règles chiffrées pour Clapova (HyperFrames + GSAP, vertical 9:16)

**Version 2 (2026-10-24).** Cette seconde passe lit les sources directement : avec `mcp__CLAPOVA__fetch_url` pour les pages web, et dans le code source des tokens officiels (GitHub de Google, Microsoft, Shopify, Uber, androidx).

Niveaux de confiance :
- **[OFF]** : page ou fichier officiel lu directement.
- **[OFF-src]** : fichier de tokens officiel, dans le dépôt de l'éditeur.
- **[TIERS]** : blog ou outil tiers.
- **[NV]** : non vérifié.

Date des sources : date de lecture, 2026-10-24, sauf mention contraire.

**Pages officielles illisibles (rendu JavaScript ou 404)** :
- m3.material.io : remplacé par le code source officiel.
- Uber Base (base.uber.com) : remplacé par baseweb.
- Salesforce Lightning motion : 404. Aucun token de motion trouvé dans la page des tokens SLDS v1.
- Page d'aide Meta sur la zone de sécurité : vide.
- Page TikTok de la zone de sécurité : les gabarits sont des fichiers .zip, donc illisibles.
- School of Motion, article tutoriel de typo cinétique : erreur réseau.

**Pas de règle chiffrée trouvée** chez Buck, ManvsMachine, Animade, Mograph Mentor, Motion Design School (une seule citation indirecte), Ben Marriott et Jake Bartlett (seulement des principes qualitatifs).

---

## 1. motion-tokens

### 1.1 Durées (toutes [OFF] ou [OFF-src])
| Système | Tokens | Source |
|---|---|---|
| **Material 3** | short1–4 = 50 / 100 / 150 / 200 ms ; medium1–4 = 250 / 300 / 350 / 400 ; long1–4 = 450 / 500 / 550 / 600 ; **extra-long1–4 = 700 / 800 / 900 / 1000 ms** | https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-motion.scss (tokens générés, Material 3 v0.192) |
| **IBM Carbon** | fast-01 = 70 ms (bouton, toggle), fast-02 = 110 (fondu), moderate-01 = 150 (petite expansion, déplacement court), moderate-02 = 240 (expansion, toast), slow-01 = 400 (grande expansion, notification importante), **slow-02 = 700 (assombrissement du fond)**. Micro-interactions : plage statique de 90 à 120 ms, en ease-out sur une action de l'utilisateur. La durée grandit avec la distance ou la taille du changement, selon une échelle non linéaire. | https://carbondesignsystem.com/elements/motion/overview/ |
| **Fluent 2** | ultraFast 50, faster 100, fast 150, normal 200, gentle 250, slow 300, slower 400, ultraSlow 500 ms | https://github.com/microsoft/fluentui/blob/master/packages/tokens/src/global/durations.ts |
| **Shopify Polaris** | motion-duration-0 / 50 / 100 / 150 / 200 / 250 / 300 / 350 / 400 / 450 / 500 / 5000 ms | https://github.com/Shopify/polaris/blob/main/polaris-tokens/src/themes/base/motion.ts |
| **Uber Base (baseweb)** | timing100 à timing1000 par pas de 100 ms (sans 350), plus 1500 / 3000 / 5000 / 7000 ms | https://github.com/uber/baseweb/blob/main/src/themes/shared/animation.ts |
| **Atlassian** (accès anticipé) | hover d'un élément de liste : 50 ms. Interaction fréquente : moins de 150 ms. Sortie plus rapide que l'entrée. Les grands éléments ont des durées plus longues. | https://atlassian.design/foundations/motion |
| **Apple** | spring(duration: **0.5** s par défaut, bounce **0**) ; snappy(duration 0.5, bounce de base **0.15**) | https://developer.apple.com/documentation/swiftui/animation/spring(duration:bounce:blendduration:) ; https://developer.apple.com/documentation/swiftui/animation/snappy(duration:extrabounce:) |

### 1.2 Easings (cubic-bezier)
| Système / nom | Valeur | Usage | Statut |
|---|---|---|---|
| M3 emphasized = standard | 0.2, 0, 0, 1 | défaut | [OFF-src] |
| M3 emphasized-decelerate | 0.05, 0.7, 0.1, 1 | entrée | [OFF-src] |
| M3 emphasized-accelerate | 0.3, 0, 0.8, 0.15 | sortie | [OFF-src] |
| M3 standard-decelerate / accelerate | 0, 0, 0, 1 / 0.3, 0, 1, 1 | petites entrées et sorties | [OFF-src] |
| M3 legacy (M2) | 0.4, 0, 0.2, 1 ; decel 0, 0, 0.2, 1 ; accel 0.4, 0, 1, 1 | ancien système | [OFF-src] |
| Carbon productive : standard / entrée / sortie | 0.2, 0, 0.38, 0.9 / **0, 0, 0.38, 0.9** / 0.2, 0, 1, 0.9 | UI de tâche | [OFF] |
| Carbon expressive : standard / entrée / sortie | 0.4, 0.14, 0.3, 1 / **0, 0, 0.3, 1** / 0.4, 0.14, 1, 1 | moments importants, CTA principal | [OFF] |
| Fluent decelerateMax / Mid / Min | 0.1, 0.9, 0.2, 1 / 0, 0, 0, 1 / 0.33, 0, 0.1, 1 | entrées | [OFF-src] |
| Fluent accelerateMax / Mid / Min | 0.9, 0.1, 1, 0.2 / 1, 0, 1, 1 / 0.8, 0, 0.78, 1 | sorties | [OFF-src] |
| Fluent easyEase / easyEaseMax | 0.33, 0, 0.67, 1 / 0.8, 0, 0.2, 1 | in-out | [OFF-src] |
| Atlassian ease-out bold | 0, 0.4, 0, 1 | panneau qui entre | [OFF] |
| Atlassian ease-in-out bold | 0.4, 0, 0, 1 | mise à l'échelle d'un modal, repositionnement | [OFF] |
| Atlassian ease-in practical | 0.6, 0, 0.8, 0.6 | sortie | [OFF] |
| Atlassian ease-out practical | 0.4, 1, 0.6, 1 | popup, fondus | [OFF] |
| Polaris ease / in / out / in-out | 0.25, 0.1, 0.25, 1 / 0.42, 0, 1, 1 / **0.19, 0.91, 0.38, 1** / 0.42, 0, 0.58, 1 | ease = « défaut pour toute interaction » ; in et out « avec parcimonie » | [OFF-src] |
| Polaris keyframes bounce | scale 1 → 0.85 (75 %) → 1.05 (82.5 %) → 1 | rebond | [OFF-src] |
| Uber decelerate (entrée) | 0.22, 1, 0.36, 1 | entrée | [OFF-src] |
| Uber accelerate (sortie) | 0.64, 0, 0.78, 0 | sortie | [OFF-src] |
| Uber accelerateDecelerate | 0.83, 0, 0.17, 1 | « bon défaut pour la plupart des mouvements » | [OFF-src] |
| Fluent / Polaris / Uber linear | 0, 0, 1, 1 | rotations, opacité, couleur uniquement | [OFF] |

### 1.3 Ressorts (désormais [OFF-src])
Source : androidx, ExpressiveMotionTokens.kt et StandardMotionTokens.kt, v0_14_0.
https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt

| Jeu | Fast spatial | Default spatial | Slow spatial | Effects (fast / default / slow) |
|---|---|---|---|---|
| **Expressive** | 0.6 / 800 | 0.8 / 380 | 0.8 / 200 | damping 1.0 ; stiffness 3800 / 1600 / 800 |
| **Standard** | 0.9 / 1400 | 0.9 / 700 | 0.9 / 300 | idem |

Les ressorts « spatial » portent la position, l'échelle et la rotation, avec un dépassement possible. Les ressorts « effects » portent la couleur et l'opacité, sans dépassement (damping 1). Cette répartition est lue d'après les noms des tokens et le blog M3 : https://m3.material.io/blog/m3-expressive-motion-theming

Apple [OFF] :
- bounce = 0 : ressort critique, sans rebond.
- bounce > 0 : rebond croissant, jusqu'à 1 (oscillation non amortie).
- bounce < 0 : ressort sur-amorti, jusqu'à -1.

**Contradictions résolues**
- M3E default spatial : le source officiel donne **0.8**. La valeur 0.73 du package tiers material_expressive est fausse.
- Carbon : il existe une courbe *d'entrée* officielle distincte (0, 0, 0.38, 0.9 et 0, 0, 0.3, 1), absente de la v1 du rapport.
- Fluent : les valeurs « tiers » de la v1 sont confirmées par le source officiel.
- Apple : l'ancien `.spring` (response 0.55) est remplacé par `spring(duration: 0.5, bounce: 0)`.

### 1.4 Recommandation Clapova
- **Échelle de durées** alignée sur M3, qui est la seule échelle officielle à monter jusqu'à 1 s :
  - `micro` 0.15 s (short3)
  - `fast` 0.25 s (medium1)
  - `base` 0.4 s (medium4)
  - `slow` 0.6 s (long4)
  - `hero` 0.8 à 1.0 s (extra-long2–4)
  - Au-delà de 1 s : réservé aux mouvements continus (caméra, compteurs).
- **Easings GSAP** :
  - `CustomEase.create("enter","0.05,0.7,0.1,1")`
  - `CustomEase.create("exit","0.3,0,0.8,0.15")`
  - `CustomEase.create("std","0.2,0,0,1")`
  - `CustomEase.create("expressive","0.4,0.14,0.3,1")` (Carbon, pour les moments forts)
  - `CustomEase.create("inout","0.83,0,0.17,1")` (Uber, pour les déplacements de A à B)
- **Ressorts** : 0.8/380 par défaut, 0.6/800 pour un pop. GSAP n'a pas de ressort natif ; les approximations sont `back.out(1.2)` pour 0.8 et `back.out(1.7)` pour 0.6. Ces équivalences ne sont pas sourcées et doivent être validées visuellement.
- **Opacité et couleur** : jamais d'overshoot. Utiliser std ou linear, comme les ressorts « effects » de M3 (damping 1) et la règle Uber « linear pour opacité et couleur ».
- **Sortie** : toujours plus courte que l'entrée (Atlassian [OFF]). Valeur pratique : 60 à 70 % de la durée d'entrée. Ce ratio est une déduction, pas une règle publiée.

## 2. motion-titres (typographie cinétique)

| Règle | Contexte | Source |
|---|---|---|
| Vertical 9:16 : ligne de sous-titre ≤ **90 % de la largeur** ; au plus **3 lignes** (contre 2 en 16:9) | sous-titres BBC [OFF] | https://www.bbc.co.uk/accessibility/forproducts/guides/subtitles/ |
| Équivalence : 37 caractères dans 75 % d'une vidéo 16:9 correspondent à **environ 25 caractères** dans 90 % d'une vidéo 9:16 | BBC [OFF] | idem |
| Une phrase complète par sous-titre, en règle générale | BBC [OFF] | idem |
| Débit de 160 à 180 mots/min (relevé depuis 130–150 en direct) | BBC [OFF] | idem |
| Au plus 20 caractères/s (adultes), 17 cps (enfants) ; durée minimale 5/6 s | Netflix, cité par un tiers [TIERS] | https://www.closedcaptioncreator.com/blog/articles/subtitle-reading-speed.html |
| Mots en rafales de 1 à 3 | vendeur [TIERS] | https://kreateflo.com/blog/why-kinetic-typography-keeps-viewers-engaged-on-short-form-video |
| Taille minimale de police (px) | **aucune source officielle**. La BBC renvoie à une section dédiée aux polices que je n'ai pas pu lire en entier. La valeur de « 7 à 10 % de la hauteur » est une source de blog [NV]. | - |
| Sur mobile, les mouvements subtils passent facilement inaperçus | Carbon [OFF] | page Carbon |
| Hiérarchie : les éléments importants ont plus d'ampleur et des durées plus longues ; les éléments secondaires sont groupés et synchronisés | Fluent [OFF] | https://fluent2.microsoft.design/motion |
| Stagger préféré dans la plupart des cas, avec des offsets courts | Fluent [OFF] | idem |

**Recommandation Clapova** :
- Au plus 25 caractères par ligne et au plus 3 lignes, dans 90 % de la largeur (972 px sur 1080).
- Tenue à l'écran ≥ max(0.83 s ; nombre de mots ÷ 2.8). La valeur 2.8 mots/s correspond à 170 mots/min (BBC).
- Entrée en `base` + enter, sortie en `fast` + exit. Stagger par mot de 40 à 80 ms : déduction de la consigne « offsets courts » de Fluent, valeur non sourcée.
- Mouvement d'au moins une dizaine de pourcents de la taille : les mouvements subtils se perdent sur mobile (Carbon).

## 3. motion-compteurs-data

Aucune source de design system ne donne de règle pour les compteurs. Sources [TIERS] :
- CountUp.js : 2 s par défaut. https://www.cssscript.com/customizable-count-updown-animations-pure-javascript-countup-js/
- Recommandations de 1 à 2 s : https://www.pravinkumar.co/blog/webflow-animated-number-counter-design-2026
- Recommandations de 2 à 5 s : https://help.vev.design/en/articles/6046883-number-counter
- Environ 4 s pour 7 chiffres : https://www.videocaptions.ai/motion-elements/number-counter-animation
- Saccade si le comptage est trop rapide : https://olafmotion.com/tutorials/how-to-animate-number-counters-in-after-effects/

Principe officiel transposable : la durée grandit avec l'ampleur du changement (Carbon [OFF], Fluent [OFF]).

→ **Clapova** : 1.2 s jusqu'à 3 chiffres, 2 s pour 4 à 6 chiffres, 2.5 à 3 s au-delà. Easing de décélération (`enter`, ou Polaris ease-out 0.19, 0.91, 0.38, 1). Tenue ≥ 0.83 s sur la valeur finale. Barres et graphiques en stagger (Fluent).

## 4. motion-logo-cta

| Règle | Source |
|---|---|
| Le mouvement expressif est réservé aux moments importants, peu fréquents, par exemple un clic sur le bouton d'action principal | Carbon [OFF] |
| Exprimer plus quand le mouvement est vu rarement, une fois par session par exemple | Atlassian [OFF] |
| Un seul point focal : un mouvement mène, les autres l'accompagnent. Pas d'animations simultanées qui tirent l'attention dans plusieurs directions. | Atlassian [OFF] |
| Rebond Polaris : 1 → 0.85 → 1.05 → 1 | Polaris [OFF-src] |
| Animations de feedback brèves et précises | Apple HIG [OFF] https://developer.apple.com/design/human-interface-guidelines/motion |
| Anticipation : petit mouvement préparatoire | [TIERS] https://motioncircles.com/knowledge/the-12-principles-of-animation-applied-to-motion-design/ |

→ **Clapova** :
- Logo : un seul pop expressif par vidéo, avec le ressort 0.6/800 ou les keyframes Polaris adaptées (0.85 → 1.05 → 1), en 0.6 à 0.8 s.
- CTA : anticipation à scale 0.95, puis pop, en `base`.
- Le CTA est le seul élément en mouvement à l'écran pendant son entrée (règle du point focal unique).

## 5. montage-transitions (section comblée)

| Règle | Source |
|---|---|
| Quatre familles : enter/exit, elevation, top level, container transform | Fluent [OFF] |
| **Changement de niveau (pleine page) : fondu rapide plutôt que glisser de gros éléments**, pour éviter la désorientation | Fluent [OFF] |
| Entrée : décélération. Sortie : accélération, ce qui signifie que l'élément part pour de bon. Exception : un élément qui reste juste hors champ, prêt à revenir, sort en easing standard. | Carbon [OFF] |
| Grandes transitions : garder des éléments continus pour guider l'œil | Carbon [OFF] (checklist) |
| Pour déplacer un objet sans que le trajet ait de sens : fondu sortant, déplacement, fondu entrant | Apple HIG [OFF] (visionOS) |
| Éviter les flashs, les oscillations rapides, les balayages de grandes zones | Atlassian [OFF] ; Fluent [OFF] (risque de crise d'épilepsie) |
| Durées de grandes transitions : long 450 à 600 ms, extra-long jusqu'à 1000 ms | M3 [OFF-src] |

→ **Clapova** :
- Coupe franche par défaut.
- Fondu ou fondu enchaîné de 0.25 à 0.4 s quand on change de scène ou de sujet.
- Raccord par élément continu (match cut, container transform) pour les transitions marquantes, en 0.5 à 0.8 s avec ease inout (0.83, 0, 0.17, 1).
- Whip, flash, glitch : au plus un par vidéo et jamais en série, car les sources officielles déconseillent le flash. C'est une tension avec l'esthétique TikTok, assumée avec modération.

## 6. montage-camera-virtuelle (section comblée)

| Règle | Source |
|---|---|
| Éviter une oscillation soutenue autour de **0.2 Hz** (sensibilité forte) ; garder l'amplitude faible | Apple HIG [OFF] |
| Éviter de faire tourner le monde virtuel : préférer un changement instantané pendant un court fondu | Apple HIG [OFF] (visionOS) |
| Garder un cadre de référence fixe : un mouvement de tout l'environnement met mal à l'aise | Apple HIG [OFF] |
| Linear uniquement pour une vitesse constante, par exemple une rotation | Fluent [OFF] |
| Parallaxe : le fond va environ 20 à 30 % moins vite que le premier plan | [TIERS] citation indirecte de Motion Design School : http://agentpulse.ai/blog/parallax-effect-tutorial |
| Agrandir l'image à environ 105–110 % pour pouvoir bouger sans montrer les bords | [TIERS] https://cgi.tutsplus.com/create-a-realistic-camera-move-with-parallax--ae-453t |
| De petits mouvements valent mieux que de grands balayages ; éviter les clés linéaires | [TIERS] idem |
| School of Motion, typo cinétique partie 1 : précompositions, synchronisation audio, marqueurs, mouvements de caméra complexes. Aucun chiffre. | https://schoolofmotion.com/blog/kinetic-typography-after-effects-part-1 (non lisible directement) |

→ **Clapova** :
- Push-in lent continu sur tout le plan : scale de 1.0 à 1.08 environ, avec un overscan de base ≥ 1.05. Easing `std` ou `sine.inOut`.
- Jamais de balancement périodique visible : la secousse doit être aléatoire, de faible amplitude et brève.
- Parallaxe : fond à environ 0.7–0.8× la vitesse du premier plan.
- Pas de rotation de scène au-delà de quelques degrés.

## 7. montage-rythme

| Règle | Source |
|---|---|
| Coupe toutes les 1 à 2 s | [TIERS] https://vidpros.com/video-clip-length/ |
| Coupe toutes les 1.5 à 3 s | [TIERS] https://shortzly.com/blog/short-form-video-pacing-editing-guide |
| Plans majoritairement < 5 s | [étude] https://arxiv.org/pdf/2304.06116 |
| Plan moyen de 1.2 s dans des pubs IA, contre environ 4 s au cinéma | [étude] https://arxiv.org/pdf/2608.24329 |
| « 2.5 s Cornell » | [NV], ne pas citer |
| Ne pas faire attendre sans raison ; supprimer un mouvement qui ralentit sans rien apporter | Atlassian [OFF], Apple HIG [OFF] |

→ **Clapova** : 1.5 à 2.5 s par plan ; 1 à 1.5 s dans l'accroche ; plan avec texte ≥ temps de lecture (section 2).

## 8. Zones de sécurité (1080×1920)

| Plateforme | Règle | Source |
|---|---|---|
| TikTok Ads [OFF] | La zone dépend du format, de la longueur de la légende (jusqu'à 4 lignes) et des formats ajoutés. Gabarits officiels .zip : « In-Feed Standard » et « with Anchor ». Vertical ≥ 540×960. | https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads |
| TikTok, chiffres issus du gabarit 720×1280 [TIERS] | haut 160, bas 440, côtés 80, colonne droite de 120 à partir de 560. Mis à l'échelle 1080×1920 : **haut 240, bas 660, côtés 120, colonne droite 180**. | https://admanage.ai/blog/tiktok-ad-specs ; https://blog.adnabu.com/tiktok/tiktok-ad-specs/ |
| Meta Reels [TIERS, page officielle illisible] | haut 14 % (269 px), bas 35 % (672 px), côtés 6 % (65 px) ; bas 40 % s'il y a un disclaimer | https://blog.adnabu.com/meta-ads/meta-safe-zones/ |
| YouTube Shorts [TIERS] | pas de zone officielle en pixels pour l'organique ; estimations : haut 120–200, bas 300–450, droite 96–120 | https://zeely.ai/blog/youtube-safe-zones/ |

Changement par rapport à la v1 : la boîte de la v1 (y 250–1440) est **trop basse** pour les pubs TikTok (bas 660, donc y ≤ 1260) et pour Meta Reels (bas 672, donc y ≤ 1248).

→ **Clapova** :
- **Texte vital** dans la zone x 120–900, y 270–1250. C'est l'intersection des zones TikTok ads (gabarit mis à l'échelle) et Meta Reels, la plus contraignante.
- **Sous-titres** : remontés vers y ≈ 1100–1250.
- **Organique seul** : on peut descendre jusqu'à y ≈ 1440.
