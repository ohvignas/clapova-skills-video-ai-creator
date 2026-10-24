# Synthèse critique : motion design pour Clapova

Date : 2026-10-24. Sources : les 7 rapports de `docs/recherche/` (moteurs, skills-motion, mcp-pro, guidelines-pros, performance-pubs, outils-controle, ia-produit), la veille complète (`veille-skills-motion-complete.md`, scratchpad), la mesure de la banque SFX (`sfx-audit.tsv`, scratchpad), `docs/plan-toolbox-createur.md` et `docs/message-wideo.md`.

Légende des niveaux :
- **officiel** : page ou fichier de l'éditeur lu directement (design system, plateforme, code du moteur).
- **tiers** : blog, skill open source, étude commanditée (System1, Kantar), donnée d'un outil (Motion).
- **proposé** : déduction ou arbitrage de cette synthèse. Les valeurs marquées « **proposé, à confirmer** » attendent l'accord de l'utilisateur.

Décisions de l'utilisateur appliquées partout :
- **Pas de sous-titres par défaut.** Ils relèvent de la finition, seulement sur demande.
- **D'abord le motion design, ensuite la vidéo finie.** Phase A : animations, titres, transitions, rythme, son provisoire, validés par l'utilisateur. Phase B, sur demande : sous-titres, voix off finale, mixage, export.

---

## 1. Résumé exécutif

1. Les 7 rapports convergent : un bon motion design se mesure. Les meilleurs projets (HyperFrames, Barty-Bart, JakeB-5) mesurent le son, le texte, les coupes et le cadre au lieu de « regarder ». Clapova a la boucle visuelle, pas les mesures.
2. Le plus gros gain est côté moteur : le fork `clapova-engine` a 15 versions de retard (0.8.177 contre 0.8.192). Il lui manque `craftAudit.ts`, `snapshotReview.ts` et `audioTruePeak.ts`, et `checkComposition` n'appelle que `lintProject`.
3. Les tokens motion sont désormais sourcés officiellement : durées Material 3, courbes M3, Carbon et Uber, ressorts androidx. Les équivalences GSAP restent à valider à l'œil.
4. La zone sûre verticale est tranchée sur Meta (14/35/6 %, officiel). La zone vitale retenue est x 120–900, y 270–1248 ; Pinterest se gère par un profil plus strict.
5. La marque doit être reconnue avant 2 s par des signaux intégrés (logo dans la scène, nom dit, son), jamais par un logo plaqué en ouverture (System1, tiers).
6. Il n'existe aucune norme officielle de coupes par seconde ni de durée TikTok. Défaut retenu : 6 à 15 s, plans de 1,5 à 2,5 s, accroche plus rapide.
7. Son, **proposé, à confirmer** : −14 LUFS intégrés, true peak ≤ −1,5 dBTP, voix devant la musique. Sons de synthèse interdits ; sons CC0 réencodés à −3 dBTP.
8. Relecture, **proposé, à confirmer** : liste de défauts P0/P1/P2, chacun avec son correctif. Livraison si 0 P0 et note ≥ 8/10, au plus 3 tours.
9. La famille de skills compte 24 skills à plat, préfixées `montage-`, `motion-`, plus un routeur unique `montage`. Elle remplace `monteur`, `motion-design`, `montage-recipes` et `sous-titres-styles`.
10. Dix skills manquaient. Les plus utiles : `montage-broll`, `motion-scene-ui`, `motion-direction-artistique` et `produit-coherent`.
11. Côté serveur : `controle_video`/`analyze_edit` (mesures testées sur la pub Nova, 10 à 20 s de calcul) ; `refine_product_label` ; les Elements Kling dans `generate_video` ; une enveloppe de résultat vérifiée ; des erreurs typées ; un `batch` ; la relance sans refacturation.
12. Licences : on peut reprendre HyperFrames (Apache-2.0) et les skills MIT, avec attribution. OpenMontage (AGPL) et Remotion ne fournissent que des idées. madmom, essentia, CoTracker3, imMamdouh et les stems HeyGen sont interdits.
13. Contre-vérification : 6 affirmations des rapports relues dans leur source, 6 confirmées (annexe A).
14. Restent non vérifiés : les pixels des zones sûres TikTok et YouTube (gabarits ZIP et PNG), les équivalences ressort ↔ `back.out`, le comportement réel de `plan_shots`, `review_montage` et `place_sfx_from_events` dans wideo.
15. Plan : 7 lots ordonnés (§7), du merge amont du moteur à la réécriture des skills. Les skills peuvent démarrer en parallèle du lot 1.

---

## 2. Contradictions entre sources, tranchées

| # | Sujet | Ce que disent les sources | Retenu | Pourquoi |
|---|---|---|---|---|
| C1 | Zone sûre Meta Reels | Rapport guidelines : page d'aide Meta vide, chiffres 14/35/6 % lus sur un blog (tiers). Rapport performance : mêmes chiffres lus dans le **guide des pubs Meta** (officiel). | **14 % haut (269 px), 35 % bas (672 px), 6 % côtés (65 px)** | Le guide des pubs Meta est une source officielle qui confirme le blog. |
| C2 | Zone sûre commune | Performance : Meta ∩ Pinterest, soit (65,270)–(885,1130). Guidelines : TikTok mis à l'échelle ∩ Meta, soit x 120–900, y 270–1250. OpenMontage, iart, HyperFrames : d'autres jeux (168–1330, 900×1400…). | **Profil « réseaux verticaux » : x 120–900, y 270–1248.** Profil « Pinterest » à part : x 65–885, y 270–1130. | Pinterest (790 px en bas) pénaliserait toutes les vidéos TikTok, Reels et Shorts. Les chiffres TikTok sont tiers : à valider sur le gabarit ZIP. |
| C3 | Décalage SFX / image | HyperFrames : pic **1 image après** l'image. Barty, haidrrrry : **2 à 3 images avant**. OpenMontage : whoosh 10 à 20 ms avant. | **Le pic du transitoire tombe sur l'image de l'événement, à 0 / +1 image près. Le départ d'un son long (whoosh, riser) est avancé d'autant que son temps de montée.** | Les sources mesurent deux choses différentes : le départ du fichier (Barty) et son pic (HyperFrames). Caler le pic est mesurable avec `audio --place-at` de HyperFrames. Source retenue : HyperFrames (officiel moteur). |
| C4 | Musique sous la voix | Clapova actuel : 0,25 (≈ −12 dB). HyperFrames : 0,14 (≈ −17 dB). OpenMontage : −18 à −20 dB. Barty : baisse de 8 à 12 dB. Outils-contrôle : voix au moins 6 à 10 LU au-dessus. | **Pendant la voix, la musique est 15 à 18 LU sous la voix, mesurés en sonie court terme. Gain de départ 0,18. Jamais sous 0,15 (règle actuelle du serveur).** Proposé, à confirmer. | Compromis entre HyperFrames et la règle « musique audible » de Clapova. On décide sur la mesure, pas sur le gain. |
| C5 | Durée TikTok | « 21–34 s » et « 9–15 s » : tiers. TikTok officiel : « sans restriction ». Pinterest officiel : 6–15 s. iart : boucle de 7 à 15 s. | **6 à 15 s par défaut**, plus une version longue en test A/B | Seule recommandation officielle chiffrée (Pinterest), cohérente avec le format boucle. |
| C6 | Texte à l'écran | TikTok et Lumen : le texte à lire aide la mémorisation. Motion 2026 : « Text only » en tête des gagnants Meta, sur une période de promos. System1 2026 : beaucoup de mots ou de chiffres font −7 à −12 % d'émotion. | **Selon l'objectif.** Conversion : accroche écrite courte, prix, CTA. Notoriété : au plus une ligne à l'écran, pas de mur de chiffres. | Les deux sources ne mesurent pas la même chose (gagnants en dépense contre émotion et mémorisation). |
| C7 | Taille de police minimale | Aucune source officielle. HyperFrames : plancher 2,6 % du petit côté, soit 28 px. Outils-contrôle : 3 % de la hauteur (58 px) pour le secondaire, 5 % (96 px) pour un titre. Remotion : titre ≥ 84 px, appui ≥ 44 px. haidrrrry : héros 80–140 px. Clapova actuel : héros 140–180 px, alerte sous 120 px. | **Texte lu ≥ 58 px. Titre ≥ 96 px. Héros 140–180 px. Échec sous 44 px.** Proposé, à tester sur la planche téléphone (360 px de large). | Le plancher de 28 px de HyperFrames convient à du 16:9 regardé sur grand écran. En 9:16 sur téléphone, on prend la valeur la plus prudente. |
| C8 | Cible de sonie | Serveur Clapova : −14 LUFS / −1,5 dBTP. Barty : −16 LUFS / < −4 dBFS. HyperFrames `normalize-audio` : −16 LUFS / −1,5 dBTP. Plateformes : −14. | **−14 LUFS ±1, true peak ≤ −1,5 dBTP, contrôle mono.** Proposé, à confirmer. | Les plateformes baissent le son au-dessus de −14 sans jamais le remonter. Avec −1,5 dBTP, on garde de la marge pour la recompression AAC. |
| C9 | Synthèse des sons | JakeB-5, haidrrrry et les explainers de Barty synthétisent musique et SFX. Barty `sound-effects` : « Never synthesize ». | **Synthèse interdite. Sons CC0 réencodés avec une crête vraie ≤ −3 dBTP.** Proposé, à confirmer. | Les sons de synthèse font « bips bon marché ». La banque CC0 existe et est mesurée (66 fichiers sur 109 dépassent −1 dBTP, donc il faut réencoder). |
| C10 | Noter sur 10 | HyperFrames : « Never score the film out of 10 », seulement des notes P0/P1/P2. JakeB-5 : 7 axes notés, ≥ 8 avec preuve. Clapova : 8/10. | **Liste P0/P1/P2, chaque défaut avec son correctif exact. Livraison si 0 P0 et note ≥ 8/10. Au plus 3 tours, puis livraison avec `Non résolu :`.** Proposé, à confirmer. | La note sert de barrière d'export, la liste fait corriger. Une note qui monte sans correction consignée est ramenée à la note précédente (JakeB-5). |
| C11 | Fond mesh, glow, particules | haidrrrry : fond mesh et glow sur le héros. Lottie : « trois couches dont l'ambiance ». HyperFrames, Barty, JakeB-5, kylezantos : interdits. | **Interdits par défaut** (liste BANNED), sauf charte de marque explicite | Majorité des sources outillées. Ce sont les marqueurs de « bouillie IA ». |
| C12 | Règle des 300 ms (Emil) | Interface < 300 ms. Titres vidéo tenus 2 s (Lottie, Barty). | **300 ms pour les micro-éléments seulement** (puce, coche, clic). Entrée d'un titre 0,4 s, tenue selon le temps de lecture. | Les règles d'interface ne s'appliquent pas telles quelles à la vidéo. |
| C13 | Temps de lecture | HyperFrames : 0,3 s/mot + 0,5 s, 2 s pour la dernière ligne. JakeB-5 : 0,3 s/mot + 1 s. BBC : 160–180 mots/min. Netflix (tiers) : ≤ 20 car./s. | **max(1 s ; 0,3 s × mots + 0,5 s), 2 s pour la dernière ligne** | C'est ce que le `craftAudit` de HyperFrames mesure (`line_unread`) : une règle unique, vérifiée par l'outil. |
| C14 | Ressort par défaut M3E | Package tiers : 0,73. Source androidx : 0,8. | **0,8 / 380** | Source officielle. |
| C15 | Voix off / sous-titres « 88 % » | Blogs : « 88 % regardent avec le son ». TikTok/Kantar : 88 % disent que le son est vital. | **C'est une opinion, pas un taux de visionnage avec le son.** Ne pas citer comme taux. | Lecture de la source primaire. |
| C16 | Coupe précise | Youtube-clipper : `-ss` avant `-i` + `-c copy`, présenté comme « frame-accurate ». Remotion : réencoder obligatoirement. | **Toujours réencoder un extrait** | Sans réencodage, la coupe se cale sur l'image clé précédente. |

---

## 3. Règles canoniques chiffrées

Chaque règle n'apparaît qu'ici. Les skills y renvoient au lieu de la recopier.

### 3.1 Tokens motion

| Token | Valeur | GSAP | Source (niveau) |
|---|---|---|---|
| `micro` | 0,15 s | `duration: 0.15` | M3 short3 (officiel) |
| `fast` | 0,25 s | 0.25 | M3 medium1 (officiel) |
| `base` | 0,4 s | 0.4 | M3 medium4 (officiel) |
| `slow` | 0,6 s | 0.6 | M3 long4 (officiel) |
| `hero` | 0,8 à 1,0 s | 0.8–1 | M3 extra-long2–4 (officiel) |
| > 1 s | mouvements continus seulement (caméra, compteurs) | — | proposé |
| sortie | 65 à 70 % de l'entrée, toujours plus courte | — | Atlassian (officiel, principe) ; Lottie 65–75 % (tiers) |
| distance | ×0,8 à 50 px ; ×1 à 100 px ; ×1,3 à 200 px ; ×1,8–2 en plein écran | — | Lottie (tiers) ; Carbon (officiel, principe) |
| stagger | 40 à 80 ms par élément, total ≤ 0,5 s | `stagger: 0.06` | Emil 30–80 ms, Lottie (tiers) ; Fluent « offsets courts » (officiel) |
| départ d'échelle | jamais `scale(0)` : de 0,9–0,97 avec opacité 0 | `from {scale: 0.95, autoAlpha: 0}` | Emil (tiers) |

| Easing | cubic-bezier | GSAP | Usage | Source |
|---|---|---|---|---|
| `enter` | 0.05, 0.7, 0.1, 1 | `CustomEase.create("enter","0.05,0.7,0.1,1")`, proche de `expo.out` | entrées | M3 emphasized-decelerate (officiel) |
| `exit` | 0.3, 0, 0.8, 0.15 | `CustomEase "exit"`, proche de `power3.in` | sorties définitives | M3 emphasized-accelerate (officiel) |
| `std` | 0.2, 0, 0, 1 | `CustomEase "std"`, proche de `power3.out` | défaut, opacité, couleur | M3 standard (officiel) |
| `expressive` | 0.4, 0.14, 0.3, 1 | `CustomEase "expressive"` | moments forts, CTA | Carbon expressive (officiel) |
| `inout` | 0.83, 0, 0.17, 1 | `CustomEase "inout"`, proche de `power4.inOut` | déplacement A → B, caméra | Uber accelerateDecelerate (officiel) |
| `linear` | 0, 0, 1, 1 | `none` | rotation continue, opacité de boucle | Fluent, Uber (officiel) |

Les équivalences « proche de `power*` » sont **proposées** : CustomEase reste la valeur de référence. Tous les plugins GSAP, CustomEase compris, sont gratuits en usage commercial (gsap-skills, tiers).

| Ressort | Valeur | GSAP approché | Usage | Source |
|---|---|---|---|---|
| `spring.default` | M3E default spatial : amortissement 0,8 / raideur 380 | `back.out(1.2)` | cartes, barres | androidx (officiel) ; équivalence proposée |
| `spring.pop` | M3E fast spatial 0,6 / 800 | `back.out(1.7)` | logo, badge | androidx (officiel) ; équivalence proposée |
| `spring.heavy` | k 90 / d 19, sans dépassement, ~0,7 s | `power3.out` 0.7 | gros texte (« le texte ne rebondit jamais ») | JakeB-5 (tiers) |
| `spring.snappy` | k 320 / d 28, ~2 %, 0,35 s | `back.out(1.1)` 0.35 | puces, chips | JakeB-5 (tiers) |
| effets | amortissement 1,0 : jamais de dépassement sur l'opacité ou la couleur | `std` | — | androidx effects (officiel) |
| dépassement | premium 0 % ; succès 5–10 % ; célébration 15–25 % | — | — | Lottie (tiers) |

Les couleurs s'interpolent en OKLCH, jamais en sRGB brut (iart, tiers). Les particules et tout aléa utilisent une graine fixe (iart, Barty, tiers).

### 3.2 Typo cinétique

- Tailles en 1080×1920 (proposé, à tester, voir C7) : texte lu ≥ 58 px ; titre ≥ 96 px ; héros 140–180 px ; échec sous 44 px.
- Au plus 25 caractères par ligne et 3 lignes, dans 90 % de la largeur, soit 972 px (BBC, officiel). Accroche : environ 5 mots par ligne. Si une ligne est trop longue, on coupe le texte, jamais la taille (HyperFrames, officiel moteur).
- Tenue : voir C13. Stagger par mot de 40 à 80 ms (proposé, d'après le principe Fluent).
- Graisse 600–800. Approche −0,02 à −0,03 em en affichage, interlignage 1,05–1,2. L'interlignage diminue quand la taille augmente (Emil apple-design, haidrrrry, iart ; tiers).
- Un seul mot mis en valeur par titre. Au plus 3 couleurs par scène hors noir et blanc. La couleur héros n'occupe qu'un élément par image (haidrrrry, Barty, JakeB-5 ; tiers).
- Au plus 3 familles de police : grotesque grasse, serif italique, mono (Barty, tiers). Polices embarquées avec leur `OFL.txt`, aucune police de secours silencieuse.
- SplitText : découper après `document.fonts.ready`, avec `font-kerning: none` et sans `text-wrap: balance` (gsap-skills, tiers). Une espace réelle entre les `<span>` de mots corrige le bug « VoiciNova ».
- Échange de texte sans chevauchement : la sortie se floute en 0,12 s, l'entrée attend 0,07 s puis apparaît en 0,26 s (Barty `M.vis`, tiers).
- Le mouvement d'un titre fait au moins 10 % de sa taille : un mouvement subtil se perd sur mobile (Carbon, officiel).
- Interdits : texte qui bouge encore pendant la lecture, machine à écrire par défaut, glow, dégradé de texte (HyperFrames, officiel moteur).

### 3.3 Rythme, coupes, BPM

- Structure : accroche, corps, conclusion (TikTok, officiel).
- Plans de 1,5 à 2,5 s ; 1 à 1,5 s dans l'accroche (proposé, d'après des tiers et deux études arXiv). Un plan qui porte du texte dure au moins son temps de lecture.
- Quelque chose de nouveau toutes les 2 à 4 s, à intervalles irréguliers. Plus de 3 s sans changement = `dead_stretch` (JakeB-5, iart ; HyperFrames officiel moteur).
- BPM : `frames_per_beat = 60/BPM × fps`. On arrondit le cumul, pas chaque pas, et on tient compte du décalage du premier temps (iart, tiers). La grille est vérifiée sur les grosses caisses sous 120 Hz et recalée si l'écart médian dépasse 30 ms (Barty, tiers).
- Coupes sur le temps à ±2 images (67 ms à 30 i/s). Viser ≥ 60 % des coupes sur un temps, les autres en contre-temps assumé (outils-contrôle, testé). Gros changements sur la mesure (tous les 4 temps), typo sur les 1/8 et 1/16 (Barty, JakeB-5).
- Pub énergique : 120–140 BPM, 6 à 8 scènes de 1,5 à 3 s, au plus 2 coupes sèches et seulement sur un temps fort (Barty, tiers).
- Voix off : 2,3 mots/s (140 mots/min), 2,0 mots/s en technique. Durée de scène = mots ÷ 2,3 + 0,4 s. Débit hors plage si < 110 ou > 170 mots/min ; correction par `atempo` ≥ 0,85 (iart, digitalsamba ; tiers).
- Au moins 3 moments immobiles : un mouvement constant fait amateur (haidrrrry, tiers).
- Les durées des scènes se recalent sur la voix réelle, plus 1 s de marge (digitalsamba `sync_timing`, tiers).

### 3.4 Accroche et marque

- Image 0 : un élément fort déjà en action, cadrage serré, jamais un fondu depuis le noir (`first_frame_empty`, HyperFrames officiel moteur ; Google Shorts officiel).
- L'accroche se lit à 2 s. La proposition de valeur est bouclée avant 6 s (TikTok : 90 % de l'effet sur la mémorisation dans les 6 premières secondes, officiel).
- 2 à 4 signaux de marque intégrés dans les 2 premières secondes, dont au moins un sonore ou verbal (System1 2026, tiers).
- Jamais de logo plaqué ni de plan produit statique en ouverture : « un logo n'est pas une accroche » (System1, tiers). La première ligne n'est jamais « Introducing » ni le logo (HyperFrames).
- Angles d'accroche : conversion (nouveauté, offre, prix de référence, urgence) ; haut de l'entonnoir (confession, contre-pied, curiosité) (Motion 2026, tiers).
- L'écran ne répète jamais mot pour mot la voix off. Mots interdits : « révolutionnaire », « sans effort », « game-changer »… (HyperFrames story.md).

### 3.5 Compteurs et données

- Durée : 1,2 s jusqu'à 3 chiffres ; 2 s de 4 à 6 chiffres ; 2,5 à 3 s au-delà. Easing `enter` ou Polaris ease-out (0.19, 0.91, 0.38, 1). Valeur finale tenue ≥ 0,83 s (proposé, d'après Carbon, Fluent et des tiers).
- `tabular-nums` obligatoire. Format selon la langue (1 284 en fr, 1,284 en en). Cas limites : 0 et 1 (pluriel), valeurs négatives, > 100 %, forme compacte 1 M, jamais `NaN` ni `null` affiché (Emil break-ui, tiers).
- Compte à rebours : `ceil(durée − N/fps)` (iart, tiers).
- Chaque chiffre à l'écran vient de `facts` (source et ligne), avec une seule écriture. Une mesure compagnon honnête, des échelles communes, ni axe tronqué ni échelle logarithmique. Jamais de chiffre inventé : barres relatives à la place (JakeB-5, Barty ; tiers).
- Diagramme : nœuds, puis liens, puis libellés ; chaque étape tenue 0,5 à 1,5 s ; ce qui n'est pas actif passe à une opacité de 0,35 (iart, tiers).

### 3.6 Logo et CTA

- Logo : une seule technique (tracé, construction ou morphing), révélation de 0,8 à 2,5 s, un seul pop expressif par vidéo. Dépassement 1,04 → 1,00 en 0,15 s, ou keyframes Polaris 0,85 → 1,05 → 1. L'image d'arrivée tombe sur le pic du logo sonore. Ne jamais déformer le logo, respecter sa marge de protection (iart, tiers ; Polaris officiel).
- Logo sting de 5 s : marque 0–0,8 s, wordmark 0,6–1,8 s, tagline 2–3,5 s, sortie sur la dernière demi-seconde (haidrrrry, tiers).
- CTA : anticipation à 0,95, puis pop en `base`. Il est le seul élément en mouvement pendant son entrée (Atlassian, officiel). Carte CTA (+45 % de mémorisation, TikTok officiel) et CTA dit à la voix (Google, officiel). En conversion, il arrive après le contexte.
- Le CTA reste dans la zone vitale, jamais dans le bas réservé. La carte finale peut reprendre la première image (boucle).
- Aucun CTA inventé : seulement celui que donne l'utilisateur ou le site.

### 3.7 Transitions

- Coupe franche par défaut. Fondu ou fondu enchaîné de 0,25 à 0,4 s quand on change de sujet. Raccord par élément continu (match cut, container transform) en 0,5 à 0,8 s avec `inout` pour les transitions marquantes (Fluent, Carbon, officiel ; proposé pour les durées).
- 3 à 5 types de transition par film, chacun causé par l'écran ; au plus un tiers de coupes sèches entre beats (HyperFrames motion.md). Diaporama photo : une seule transition, fondu de 0,4 à 0,6 s (iart).
- Placement : `start = coupe − durée/2` (proposé).
- Whip, flash, glitch : au plus un par vidéo, jamais en série. Les sources officielles déconseillent le flash (risque photosensible).
- Recette « zoom à travers un bouton » : le bouton passe d'environ 8 % à 250 % en 0,35 s. Morph 110 → 880 px en 0,2 s `power3.out`, flou 12 → 0 (HyperFrames).
- Flou de masquage d'un fondu imparfait : toujours sous 20 px (Emil).

### 3.8 Caméra virtuelle

- Push-in lent sur tout le plan : échelle 1,0 → 1,08 environ, overscan ≥ 1,05, easing `std` ou `sine.inOut` (proposé, d'après des tiers). Coup de zoom 1 → 1,12, ressort amortissement 12 / raideur 200 (iart).
- Jamais de balancement périodique : éviter les oscillations soutenues autour de 0,2 Hz (Apple HIG, officiel). Une secousse est aléatoire, brève et de faible amplitude.
- Parallaxe : fond à 0,7–0,8× la vitesse du premier plan (tiers). Pas de rotation de scène au-delà de quelques degrés (Apple, officiel).
- Caméra qui fait le montage : poussée ou recul de 0,6 à 1,2 s. Caméra en ressort critique (w ≈ 6) (Barty).
- Démo produit : écran posé 0,5–1 s ; curseur 0,4–0,8 s en ease-in-out ; clic 0,2–0,3 s ; zoom ×2 en 1–2 s puis tenu 2–4 s (iart).
- Jamais de `will-change` sur ce que la caméra agrandit : le texte deviendrait flou (Barty).

### 3.9 Zones sûres (1080×1920)

| Profil | Zone vitale (texte, logo, CTA) | Source |
|---|---|---|
| **Réseaux verticaux** (TikTok, Reels, Shorts), défaut | x 120–900, y 270–1248 | Meta 14/35/6 % (officiel) ∩ TikTok 240/660/120 + colonne droite 180 (tiers, gabarit mis à l'échelle) |
| Pinterest | x 65–885, y 270–1130 | aide Pinterest (officiel) |
| Bande des sous-titres (finition) | y 1100–1248 ; les titres motion n'y entrent pas (`--caption-zone`) | proposé |
| Organique seul, sans pub | bas jusqu'à y ≈ 1440 | proposé |
| Visage | rien sur la boîte `FACE` | iart, Barty |

Master 1080×1920 (Meta recommande 1440×2560 si possible), 720×1280 au minimum (officiel).

### 3.10 Son

- Cible, **proposé, à confirmer** : −14 LUFS intégrés ±1 ; true peak ≤ −1,5 dBTP ; mesure en stéréo, plus un contrôle mono. Mesurer avec `ebur128=peak=true` sur le fichier exporté (Barty, HyperFrames, outils-contrôle). Piège : pyloudnorm en mono 22 kHz donne −17,4 au lieu de −14,1.
- Hiérarchie voix > SFX > musique. Musique sous la voix : voir C4. Ducking automatique `sidechaincompress` ; HyperFrames : duck 0,25, attaque 0,15 s, relâche 0,4 s.
- La musique couvre toute la durée, avec un fondu de sortie d'environ 1 s (règle serveur existante). Son départ est choisi sur la fenêtre la plus forte (idée OpenMontage `audio_energy`).
- SFX : chacun a une cause visible. Placement selon C3. 3 à 6 dB au-dessus du lit musical. Alterner 2 à 3 prises du même son. `impact` au plus 2 fois par film et seul son le plus fort. Le riser finit sur l'impact (HyperFrames, Barty, JakeB-5).
- Sons de synthèse interdits. Sons CC0 seulement, réencodés avec une crête vraie ≤ −3 dBTP (**proposé, à confirmer**). Écarter ou renormaliser `pop/kenney-interface-maximize-002.ogg` (+10,7 dBTP) et `transition/kenney-interface-scroll-001.ogg` (+1,1). Un manifeste par son : source, licence, crête, sonie si mesurable, mono ou stéréo. Les sons de moins de 0,4 s se classent par crête et RMS, pas par LUFS.
- Contrôles : OFF-BEAT si l'écart dépasse ±100 ms ; STARTLE si le son saute de plus de 6 dB par rapport à la seconde d'avant (iart). Sonie par scène : écart à la médiane > 1,5 LU = déséquilibre (digitalsamba). Plus de 15 s sans son = `film_silent` (HyperFrames).
- Claude n'entend pas : il mesure, puis donne les **5 instants les plus risqués** à écouter au casque (Barty).
- Mixkit n'est jamais embarqué ni versionné (licence). Freesound : filtrer CC0 ; CC BY demande un crédit ; NC est interdit.

### 3.11 Produit IA cohérent

- Composer le **vrai packshot** plutôt que le faire générer. L'IA produit décor et mouvement. Mouvement de caméra plutôt que mouvement de l'objet, et loin de la zone du logo (tiers, ProductLabelRefinement).
- Références : Kling 3.0 Pro I2V `elements[]` = 1 vue de face + 1 à 3 angles par élément (officiel, schéma fal). Veo 3.1 : jusqu'à 3 images (officiel), mais la Preview est arrêtée dans l'API Gemini : passer par Gemini Omni Flash 1.1. Seedance 2.0 I2V sur fal : première et dernière image seulement (officiel). Le chiffre « 50 références Seedance » n'est pas confirmé.
- Planche : 4 à 6 angles (face, 3/4, profil, dos) plus un gros plan net de l'étiquette, sur fond neutre. FLUX.2 accepte jusqu'à 8 références par l'API (officiel). Rotations limitées à ±35° : les faces jamais photographiées sont inventées (WorkflowProduct).
- Première image imposée, générée par un modèle à texte lisible ou, mieux, avec le packshot recollé. Pas de texte vers vidéo pour un produit à étiquette.
- Contrôle : plusieurs prises, on garde la meilleure ; similarité CLIP image-image ≥ 0,85 avec la planche (0,75–0,85 = avertissement) ; logo et étiquette vérifiés image par image (outils-contrôle, seuils à calibrer).
- Motion design par-dessus (prix, bénéfices, CTA) sur la piste overlay, logo vectoriel tracké avec `track_motion`.

---

## 4. La famille de skills finale

Contrainte Claude Code : chaque skill est un dossier à plat dans `plugins/clapova/skills/`, sans sous-dossier de skill. Les `references/` sont autorisées dans le dossier de la skill. Le regroupement se fait par préfixe : `montage-*` (assemblage), `motion-*` (animation), plus quatre skills transverses. **Un seul routeur : `montage`.**

Toutes les descriptions suivent le gabarit owl-listener : ce que la skill produit, « Use when… » avec des phrases d'utilisateur, « For X use `autre-skill` ». Moins de 400 caractères, et le `name` égal au dossier.

Phases : **A = motion design** (validé par l'utilisateur), **B = vidéo finie** (sur demande).

| # | Skill | Phase | Rôle en 1 ligne | Déclencheurs | Contenu (règles, recettes, interdits) | `references/` | Outils MCP | Remplace |
|---|---|---|---|---|---|---|---|---|
| 1 | **montage** (routeur) | A/B | Routeur unique + boucle de travail du montage et du motion | « monte », « fais une vidéo », « anime », toute demande vidéo multi-plans | Étape 0 : table des intentions vers la bonne skill (modèle kylezantos), avec « ne pas utiliser si… ». Séparation des phases A/B. Plan validé avant de construire. Ne jamais relancer un build expiré sans `list_media`/`get_timeline`. Relire la timeline avant d'éditer (changements de l'utilisateur). `lockedDecisions`. Promesse de livraison : prévenir si un plan animé retombe en image fixe. Pas de sous-titres par défaut. | `routeur.md`, `boucle.md`, `phases.md`, `pieges-mcp.md` | `get_guide`, `list_projects`, `get_timeline`, `plan_shots`, `apply_edit_plan`, `check_composition`, `render_preview_frames`, `review_montage` | `monteur` |
| 2 | **montage-accroche** | A | Les 2 premières secondes et la marque | « accroche », « hook », « début plus fort » | §3.4 ; bande d'images 0–2,2 s ; angles d'accroche ; interdits (logo en ouverture, fondu depuis le noir) | `angles.md` | `render_preview_frames` (bande), `review_montage` | `montage-recipes` (partie accroche), complète `test-accroches` |
| 3 | **montage-rythme** | A | Durée des plans, BPM, coupes, débit de la voix off | « plus rythmé », « sur la musique », « trop lent » | §3.3, y compris le débit de la voix off et la durée des scènes tirée du script | `bpm.md`, `voix-off-debit.md` | `plan_shots`, `analyze_music_beats` (nouveau), `apply_edit_plan` | `montage-recipes` (rythme) ; absorbe **motion-voix-off-rythme** |
| 4 | **montage-transitions** | A | Choisir et poser les transitions | « transition », « raccord », « enchaînement » | §3.7 ; une famille par vidéo ; bande autour de chaque coupe | `familles.md` | `apply_edit_plan` (`set_transition`), `render_preview_frames` (mode coupes) | `motion-design` (partie transitions) |
| 5 | **montage-camera-virtuelle** | A | Push-in, parallaxe, caméra qui fait le montage | « zoom », « mouvement de caméra », « Ken Burns » | §3.8 ; interdits (oscillation, `will-change`) | `mouvements.md` | `add_motion_effect`, `frame_subject`, `track_motion` | `presets` (partie caméra du montage) |
| 6 | **montage-derush** | A | Dérushage d'un face caméra ou d'un rush long | « nettoie », « enlève les blancs », « garde les meilleurs passages » | Silence adaptatif (seuil `loudnorm`), coupe entre deux mots, retrait des tics, extraits toujours réencodés | `silences.md` | `analyze_rushes`, `transcribe_media`, `trim_media`, `split_media` | partie de `monteur` |
| 7 | **montage-broll** (manquante) | A | B-roll sur un face caméra : A orateur / B incrustation / C cache | « ajoute du b-roll », « illustre ce que je dis » | Ouvrir et fermer sur A ; A ≤ 8 s ; C de 3 à 10 s ; pas dans la 1re seconde ni sur une phrase émotionnelle ; ≥ 2 s de visage entre deux C ; structure 6 images d'avance, fait calé sur son mot ; cache opaque ; rien sur le visage ; densité 2–4 ou 4–7 par minute | `traitements.md`, `forme-continue.md` | `generate_broll`, `create_motion_scene`, `frame_subject`, `check_composition` | — |
| 8 | **montage-boucle** (manquante) | A | Formats courts en boucle parfaite | « boucle », « loop », « Reel qui tourne » | Dernière image = première ; 7 à 15 s ; ressort de boucle (`track` avec période) | — | `render_preview_frames` (0 et fin) | — |
| 9 | **montage-recettes** | A | Recettes chiffrées par format | « promo », « diaporama photo », « conversation SMS », « intro YouTube », « Wrapped », « hype 15 s » | Promo 6–15 s à prix barré ; diaporama ; bulles de messagerie ; intro 3–5 s / outro ≥ 20 s ; Wrapped 5–7 scènes de 2,5–4 s ; hype 128 BPM | une fiche par recette | `apply_template`, `get_creative_recipes`, `apply_recipe` | `montage-recipes` (recettes) |
| 10 | **motion-direction-artistique** (manquante) | A | Style, métaphore et liste BANNED avant de construire | « quel style », « fais premium », « dans l'esprit de… » | Une métaphore tirée du monde du public ; style déduit du sujet et annoncé en une ligne ; 3 réglages (variance, intensité du mouvement, densité d'information) ; chaque adjectif traduit en nombre ; liste BANNED qui grandit à chaque film | `styles.md`, `banned.md` | `get_brand_kit`, `list_styles`/`get_style` (plan toolbox) | `motion-design` (direction) ; s'appuie sur `cadrage` |
| 11 | **motion-tokens** | A | Valeurs de durée, de courbe et de ressort | appelée par les autres skills `motion-*` | §3.1 ; tokens dérivés du brand kit ; anti-patterns AP-01… à identifiant stable | `tokens.json`, `anti-patterns.md` | `get_motion_toolkit` | `motion-design` (table timing) |
| 12 | **motion-titres** | A | Typographie cinétique | « titre animé », « texte qui claque » | §3.2 ; recettes `kinetic-words`, `char-rise`, `slam` | `recettes-titres.md` | `add_motion_block`, `edit_motion_scene` | `motion-design` (titres) |
| 13 | **motion-compteurs-data** | A | Compteurs, graphiques, chiffres | « compteur », « chiffre clé », « graphique » | §3.5 | `facts.md` (gabarit), `cas-limites.md` | `add_motion_block` (counter-*, chart) | `motion-design` (compteurs) |
| 14 | **motion-carte-diagramme** (manquante) | A | Carte animée façon Vox et schéma explicatif | « carte », « itinéraire », « schéma », « comment ça marche » | Diagramme nœuds → liens → libellés ; carte à 12 i/s dans un montage à 24 i/s | `carte.md`, `diagramme.md` | `create_motion_scene` | — |
| 15 | **motion-logo-cta** | A | Révélation de logo, carte de fin, CTA | « logo animé », « fin avec CTA » | §3.6 | `logo-sting.md`, `endcard.md` | `add_motion_block` (logo-*, cta), `generate_vector_logo`, `vectorize_logo` | `motion-design` (logo et CTA) |
| 16 | **motion-scene-ui** (manquante) | A | Interface ou produit numérique reconstruit et filmé | « démo de mon app », « montre l'interface », « mockup animé » | Démo §3.8 ; frappe à 25 car./s ; forme continue ; une ligne de texte et un élément d'interface à la fois ; illustrations IA en petits éléments séparés, jamais une grande image animée | `demo-produit.md`, `curseur.md` | `create_motion_scene`, `edit_motion_scene`, `record_web_demo` (nouveau) | — |
| 17 | **detourage-sujet** (manquante) | A | Détourage SAM 2, texte derrière le sujet | « détoure », « texte derrière moi », « isole le produit » | Points positifs et négatifs, contrôle teinté en vert, masque par image, lots de 60 images | — | `cutout_subject`, `track_motion` | — |
| 18 | **son-design** | A (provisoire) / B (mix final) | SFX, musique, mixage, sonie | « bruitages », « le son fait cheap », « musique » | §3.10 ; catégories de repères ; 5 instants à écouter ; crédits | `categories-sfx.md`, `mixage.md`, `licences-son.md` | `place_sfx_from_events`, `generate_music`, `measure_audio` (nouveau), `check_audio_sync` (nouveau) | `monteur` (son) |
| 19 | **etalonnage** | A/B | LUT, grade, cohérence de couleur entre plans | « couleurs », « look ciné », « harmonise » | OKLCH ; LUT plutôt que filtres CSS ; contrôle du décalage de gamma | — | `apply_lut`, `create_lut` | `motion-design` (LUT, partie) |
| 20 | **produit-coherent** (manquante) | A | Vidéo produit IA sans déformation | « pub de mon produit », « le logo se déforme » | §3.11 | `planche-produit.md`, `modeles.md` | `cutout_subject`, `edit_image_precise`, `mark_as_reference`, `generate_video` (`elements`), `refine_product_label` (nouveau), `extract_frames`, `track_motion` | complète `pub-produit-ugc`, `product-photoshoot` |
| 21 | **controle-qualite** | A/B | Relecture avant de livrer | appelée par `montage` à chaque tour ; « vérifie », « c'est bon ? » | Liste P0/P1/P2 au format `t=… · où · problème → correctif · reste` ; table de défauts D1–D11 avec preuve ; relecteur au contexte neuf ; seuil « 0 P0 et ≥ 8/10 » (proposé, à confirmer) ; 3 tours au plus ; `Non résolu :` ; ce qui a été mesuré contre ce qui a été seulement regardé | `defauts.md`, `seuils.md` | `check_composition` (mode complet), `render_preview_frames` (review), `review_montage`, `analyze_edit` | `monteur` (boucle de contrôle) |
| 22 | **revision-retours** (manquante) | A/B | Traduire un retour vague en choix précis | « fais que ça pète », « j'aime pas trop », retour client | Toujours demander un horodatage ; proposer 2 ou 3 choix mesurables ; ne corriger que ce qui a été tranché | `traducteur.md` | `get_timeline`, `apply_edit_plan` | — |
| 23 | **motion-sous-titres** (manquante) | **B, sur demande** | Sous-titres stylés mot à mot | seulement « ajoute des sous-titres » | 1 à 4 mots ; groupes de 2–3 (énergique), 3–5 (conversation) ; coupure sur une pause ≥ 150 ms ; fondu sur le groupe **ou** sur le mot ; bande §3.9 ; orthographe du script, temps de la transcription ; langue forcée | `styles.md` | `add_captions`, `transcribe_media` | `sous-titres-styles` |
| 24 | **finition** | **B, sur demande** | Vidéo finie et livraison | « exporte », « version finale », « livre » | Voix off finale, mix, sonie §3.10, ffprobe (résolution, i/s, durée ±0,5 s, piste audio), première et dernière image propres, orthographe des noms, prix et URL, nommage `client_projet_livrable_ratio_durée_vNN_date`, `CREDITS.txt`, lien de livraison | `specs-plateformes.md`, `checklist-livraison.md` | `export_video`, `get_render_status`, `analyze_edit` | absorbe **livraison-specs** |

Hors famille, sans changement : `cadrage`, `storyboard`, `toolbox-createur`, `declinaison-formats`, `presets`, `generate`, `prompts-video`, etc. `motion-design` disparaît, découpée entre 4, 10, 11, 12, 13, 15 et 19. `montage-recipes` est éclatée entre 2, 3 et 9.

Outillage du dépôt, pas une skill : `lint-skills` (CI), qui vérifie le frontmatter, le nom égal au dossier, la description de moins de 400 caractères avec « Use when », et que les liens entre skills existent.

---

## 5. Outils serveur MCP et moteur : ajouts et modifications

N'apparaît ici que ce qui manque dans `docs/plan-toolbox-createur.md` ou ce qui le modifie. Le contrat async, les crédits, `preview`, les erreurs normalisées de base, `analyze_image`, `import_social_video`, la transcription v2, `make_moodboard`, `list_styles`, `media_preview_url` et `grant_budget` sont déjà décrits là-bas.

### 5.1 Moteur `clapova-engine`

| # | Quoi | Détail | Critère |
|---|---|---|---|
| M1 | Merge amont 0.8.177 → 0.8.192 (procédure `PATCHES.md`) | Apporte `craftAudit.ts` (+ `checkTypes.ts`, `END_CARD_HOLD_SEC`, branchement dans `checkPipeline.ts`), `snapshotReview.ts` (+ `domStructure.ts`, `snapshot --review`, `--against`), `audioTruePeak.ts`, `mediaTiming.ts`, `mediaAlpha.ts`, le flou de mouvement, `warmCheck`. **Exclure** `audio/read/stems.ts` (envoie l'audio au cloud HeyGen), `cloud/offload*`, `lambda`. | Tests verts ; `check --json` renvoie la section `craft` ; `snapshot --review` produit 3 planches |
| M2 | `checkComposition({mode:"full"})` dans `@clapova/render` | Appelle le pipeline navigateur de `check` (layout, contraste avec `suggestedColor`, craft, motion), pas seulement `lintProject`. Chaque défaut porte `clipId`, le temps et la gravité par persistance. Options `captionZone` et profil de zone sûre §3.9. | Un projet test avec un texte de 30 px, un écran vide à 0 s et un chevauchement renvoie les 3 codes |
| M3 | `reviewSheets()` dans `@clapova/render` | `planReview` + `writeReviewSheets` : planche des scènes, coutures −0,2 à +0,2 s, planche téléphone à 360 px | 3 PNG |
| M4 | Sidecar `*.motion.json` généré au build | `appearsBy`, `before`, `staysInFrame`, `keepsMoving` d'après le storyboard (accroche visible avant 0,5 s, CTA après le titre) | `check` échoue si le CTA arrive avant le titre |
| M5 | Correctif `textAnim by:"word"` | Espace en nœud texte entre les `<span>`, `white-space: pre-wrap`, test snapshot (P1-7 du plan, déjà listé : à faire dans le moteur) | « Voici Nova » rendu avec l'espace |
| M6 | Presets de tokens | `CustomEase` enter/exit/std/expressive/inout et ressorts nommés exposés au runtime | Disponibles via `get_motion_toolkit` |
| M7 | Hygiène de rendu | Polices embarquées avec `OFL.txt`, chargées sur les caractères affichés avec un délai maximal ; audit « aucune requête réseau au rendu » ; graine fixe pour l'aléa ; `try/catch` par scène ; test de déterminisme avant/arrière par hachage | Test CI |
| M8 | Non-régression visuelle au merge amont | Même composition rendue avant et après, comparaison SSIM ≥ 0,85 | Job CI |

### 5.2 Serveur MCP (dépôt wideo)

| # | Outil | Ajout ou modification |
|---|---|---|
| S1 | **`analyze_edit` = `controle_video`** (modifie le §6 du plan) | Reprendre le JSON et les seuils testés (rapport outils-contrôle §4). Une passe ffmpeg `ebur128=peak=true` + `blackdetect` + `freezedetect` ; PySceneDetect `detect-adaptive` ; beats ; OCR RapidOCR 2 images/s (taille, durée, zone sûre, contraste) ; option CLIP produit. **BPM par `core/src/beats` de HyperFrames ou librosa (ISC), jamais aubio (GPL), essentia (AGPL) ou madmom (NC), contrairement au plan qui citait aubio/essentia.** Score : 10 − 1,5 par `fail` − 0,5 par `warn`, plafonné à 5 si un `fail` porte sur le son, le noir ou la zone sûre. ~10 à 20 s pour 15 s de vidéo. |
| S2 | `check_composition` | Branche M2 ; ajoute la sonie par scène (écart > 1,5 LU) et le débit de voix off (110–170 mots/min) ; retourne la liste P0/P1/P2 avec `fix` par clip |
| S3 | `render_preview_frames` | `mode: "review"` (M3), `mode: "cuts"` (bande de 12 images par coupe), `mode: "hook"` (0–2,2 s), `width` réglable (768 px par défaut), scène identifiée par image |
| S4 | `review_montage` | Sort une liste `issues[]` P0/P1/P2 `{t, ou, probleme, correctif, reste}` en plus de la note ; corrige le faux positif « voix coupée » (voix en plusieurs clips) et « logo ouvre la vidéo » ; renvoie les 5 instants à écouter |
| S5 | Contrôle après export | Job automatique après `export_video`, résultat dans `get_render_status` : ffprobe (piste audio, durée projet ±2 %), image noire, transcription du rendu comparée au script (0 mot = son absent ; < 80 % = voix coupée), I/TP/LRA stéréo et mono (`audioTruePeak`) |
| S6 | `analyze_music_beats` (nouveau, gratuit) | BPM, décalage, grille, confiance ; refuse le calage si la confiance est `uncertain`. Réutilisé par `plan_shots` et `place_sfx_from_events` |
| S7 | `place_sfx_from_events` | Banque CC0 de Barty importée et réencodée à −3 dBTP (**proposé, à confirmer**), manifeste enrichi ; `category_map` ; pic calé selon C3 ; rotation de 2–3 prises ; écart en ms renvoyé ; `impact` ≤ 2 ; aucun son de synthèse |
| S8 | `measure_audio` / `check_audio_sync` (nouveau, ou dans S1) | OFF-BEAT ±100 ms, STARTLE +6 dB |
| S9 | **`refine_product_label`** (nouveau) | Recolle le vrai packshot sur l'image ou la vidéo générée : homographie ou cylindre, report de la lumière, masque SAM 2.1 (Apache-2.0), propagation sur le clip depuis une image clé corrigée, planche de contrôle et score de fidélité. **Réimplémentation : licence de ProductLabelRefinement à vérifier avant toute reprise de code. Pas de CoTracker3.** Suivi de points par une alternative à licence commerciale (AllTracker, licence à vérifier). |
| S10 | **`generate_video` : références produit** | Exposer `elements[{frontal_image_url, reference_image_urls[1..3]}]`, `end_image_url`, `multi_prompt`, `negative_prompt` de Kling 3.0 Pro I2V ; `referenceImages[]` générique pour les autres modèles ; durée validée contre le modèle **avant** facturation (bug des clips de 10 s payés pour 2–4 s utilisés) |
| S11 | **Enveloppe de résultat vérifiée** sur tout outil qui écrit | `_operation {status success|partial|blocked|failed, verification (relecture après écriture, avec "contradiction"), changes (delta), warnings, executionId}`. « Non vérifié » veut dire « pas de preuve » (modèle davinci-resolve-mcp). |
| S12 | **Erreurs typées** (complète le §0.5 du plan) | Codes fermés NOT_FOUND, BAD_ARGS, TIMEOUT, RATE_LIMITED, INSUFFICIENT_CREDITS, MEDIA_MISSING… ; `retryable` dit si un nouvel essai risque de refacturer ; arguments inconnus refusés avec une suggestion (« vouliez-vous dire … ? ») ; réponses plafonnées à 25 000 caractères avec pagination |
| S13 | **`batch`** (nouveau) | Jusqu'à 50 appels, références `$N.path`, une étape d'annulation par appel ; annotations MCP readOnly, destructive, idempotent, openWorld sur chaque outil |
| S14 | **Relance sans refacturation** (chantier 1 du message wideo, généralisé) | Clé d'idempotence `(outil, projet, assetKey, hash des paramètres)` sur toute génération ; relancer une génération non terminée la reprend ; test « relance après timeout = 0 génération en plus » |
| S15 | `dryRun` / échantillon | Échantillon de 10–15 s (accroche + une scène du milieu) avant une génération complète ; score « effet diaporama » sur le storyboard avant de générer (idée OpenMontage, réimplémentée) |
| S16 | `analyze_reference_video` | Une image par plan ; classement image fixe / Ken Burns / vrai mouvement par flux optique (magnitude < 0,5 ; variance < 2,0, idée OpenMontage) |
| S17 | `add_captions` (phase B) | Orthographe du script et temps de la transcription ; langue forcée (`small.en` traduit en anglais) ; retrait des mots dans le silence final ; échec au-delà de 20 % de jetons `♪`/`�` ; **jamais appelé par `build_from_storyboard`** |
| S18 | Préflight du rendu | B-roll sous la résolution de sortie : `scale…increase,crop` + `unsharp`, ou refus ; extraits toujours réencodés dans `trim_media` et `split_media` |
| S19 | `get_timeline` | Signale les changements faits par l'utilisateur depuis le dernier appel de l'agent ; champ `lockedDecisions` du projet |
| S20 | `record_web_demo` (nouveau, lot tardif) | Playwright, curseur, chapitres, WebM converti déposé dans la médiathèque |

---

## 6. Licences

| Catégorie | Projets | Règle |
|---|---|---|
| **Reprise de code et de texte avec attribution** | HyperFrames (Apache-2.0 : garder LICENSE et NOTICE, signaler les fichiers modifiés dans `PATCHES.md`) ; Barty-Bart (MIT, sons CC0, Geist en OFL avec `OFL-Geist.txt`, crédit méthode Vox @Voxyz_ai) ; JakeB-5 (MIT) ; emilkowalski (MIT, citer animations.dev) ; lottiefiles (MIT) ; kylezantos (MIT) ; iart-ai, 18 packs (MIT) ; owl-listener (MIT, linter) ; greensock/gsap-skills (MIT) ; haidrrrry (MIT) ; digitalsamba (MIT) ; dha-aa/ae-motion (MIT) ; davinci-resolve-mcp (MIT) ; blender-mcp (MIT) ; Playwright MCP (Apache-2.0) ; SAM 2.1 (Apache-2.0) ; PySceneDetect (BSD-3) ; RapidOCR (Apache-2.0) ; librosa (ISC) ; pyloudnorm (MIT) ; open_clip (MIT) ; TransNetV2 (MIT) | Reprise possible. Notice ajoutée à chaque emprunt. |
| **Idées seulement** | OpenMontage (AGPL-3.0 : rien copier, même pour un service) ; remotion-dev/skills (Remotion License, source disponible, payante au-delà de 3 salariés) ; ComfyUI-ProductLabelRefinement et ComfyUI-productfix (licences non lues) | Réimplémenter à partir de zéro, sans texte ni code repris |
| **Interdits** | madmom (modèles CC BY-NC-SA) ; essentia (AGPL-3) ; CoTracker3 (CC-BY-NC) ; imMamdouhaboammar/motion-graphics-skills (propriétaire) ; `stems.ts` HeyGen (envoi au cloud) ; fichiers Mixkit embarqués ; aubio (GPL-3) derrière le service, à éviter ; IC-Light V2 (poids non commerciaux) ; FLUX.1 Kontext dev (poids non commerciaux) | Ne pas utiliser |
| À vérifier | GSAP lui-même (licence propre, gratuite en commercial selon gsap-skills) ; Sonniss (clause sur l'entraînement d'IA) ; Pixabay (signalements Content ID) | Avant mise en production |

**Attributions à ajouter dans `plugins/clapova/THIRD_PARTY_NOTICES.md`** (dès qu'un texte, une table ou un fichier est repris) :
1. heygen-com/hyperframes, Apache-2.0 : formulations des règles craft, review, sound, captions, vertical, motion.
2. Barty-Bart/motion-graphics, MIT © 2026 Bart : règles b-roll, passe son, interdits ; sons CC0 (Freesound, Kenney) avec leur `source_url` ; Geist OFL ; crédit Vox (@Voxyz_ai).
3. JakeB-5/motion-graphic-skill, MIT © 2026 motion-graphic-skill contributors : format de critique D1–D11, ressorts nommés, `facts`.
4. emilkowalski/skills, MIT © 2026 Emil Kowalski (animations.dev) : courbes, `scale(0.95)`, format Before/After/Why, cas limites des compteurs.
5. lottiefiles/motion-design-skill, MIT © 2025 LottieFiles : tables de durée et de distance.
6. kylezantos/design-motion-principles, MIT © 2026 Kyle Zantos : routeur, anti-checklist.
7. iart-ai/motion-skills (packs), MIT © 2026 iart.ai : b-roll A/B/C, beat-sync, logo, démo produit, livraison, sync-check.
8. owl-listener/designer-skills, MIT © 2026 MC Dean : gabarit et linter de frontmatter.
9. greensock/gsap-skills, MIT © 2026 GreenSock : bonnes pratiques SplitText et timeline.
10. haidrrrry/claude-remotion-skill, MIT © 2025 haidrrrry : logo sting, typographie héros.
11. digitalsamba/claude-code-video-toolkit, MIT © 2024 Digital Samba : débit de voix off, sonie par scène.
12. Données publiques : Material 3 / androidx (Apache-2.0), IBM Carbon (Apache-2.0), Fluent 2 (MIT), Shopify Polaris (MIT), Uber baseweb (MIT) pour les tokens.

---

## 7. Plan d'exécution en lots ordonnés

| Lot | Quoi | Où | Critère de fin |
|---|---|---|---|
| **0. Décisions** | L'utilisateur confirme les 4 valeurs « proposé » : −14 LUFS / −1,5 dBTP ; sons CC0 à −3 dBTP sans synthèse ; P0/P1/P2 + « 0 P0 et ≥ 8/10 » ; musique 15–18 LU sous la voix (gain 0,18) ; tailles de police §3.2 | conversation | Réponse écrite de l'utilisateur |
| **1. Moteur** | M1 merge amont, M5 bug des mots collés, M2 `checkComposition` complet, M3 `reviewSheets`, M7 hygiène, M8 CI | clapova-engine | Tests verts ; projet test qui déclenche `text_below_floor`, `first_frame_empty`, `line_unread` ; 3 planches de revue ; « Voici Nova » correct |
| **2. Serveur, fiabilité** | S14 relance sans refacturation, S11 enveloppe, S12 erreurs typées, S13 batch (+ chantiers 1 à 4 de `message-wideo.md`, déjà envoyés) | wideo | Relance après timeout = 0 génération en plus ; chaque outil d'écriture renvoie `_operation` ; argument inconnu → suggestion |
| **3. Serveur, contrôle** | S1 `analyze_edit`, S2, S3, S4, S5, S6, S8 | wideo (+ `@clapova/render`) | Sur `nova-hyper.mp4`, le JSON reproduit les mesures du rapport (−14,1 LUFS, −3,8 dBTP, 10 plans, 136 BPM, 33 % de coupes sur le temps, « Commande sur nova.fr » à 41 px signalé) ; `review_montage` renvoie des P0/P1/P2 |
| **4. Skills, famille motion (phase A)** | Créer `montage` (routeur), `montage-accroche`, `-rythme`, `-transitions`, `-camera-virtuelle`, `-derush`, `-broll`, `-boucle`, `-recettes`, `motion-direction-artistique`, `-tokens`, `-titres`, `-compteurs-data`, `-carte-diagramme`, `-logo-cta`, `-scene-ui`, `detourage-sujet`, `etalonnage`, `controle-qualite`, `revision-retours` ; retirer `monteur`, `motion-design`, `montage-recipes` ; ajouter les attributions §6 ; lint CI | plugin (puis report dans wideo, source de vérité, chantier 6) | `lint-skills` vert ; chaque règle de §3 présente une seule fois (dans `motion-tokens` ou la skill propriétaire) ; aucun lien vers une skill disparue ; THIRD_PARTY_NOTICES complété |
| **5. Son** | S7 import et réencodage de la banque CC0 + manifeste ; skill `son-design` | wideo + plugin | 0 fichier au-dessus de −3 dBTP (`ebur128`) ; manifeste avec licence pour 100 % des sons ; les 2 fichiers aberrants traités |
| **6. Produit** | S10 Elements Kling + validation de durée, S9 `refine_product_label` (après vérification de licence), skill `produit-coherent` | wideo + plugin | Une pub produit test : étiquette lisible sur toutes les images de contrôle, CLIP ≥ 0,85 ; aucun clip payé plus long que demandé |
| **7. Finition (phase B)** | S17 sous-titres alignés sur le script, S18 préflight, skills `motion-sous-titres` et `finition` (+ suppression de `sous-titres-styles`) ; S15, S16, S19, S20 ensuite | wideo + plugin | `build_from_storyboard` ne pose jamais de sous-titres ; export conforme (ffprobe, sonie, première et dernière image) ; nommage appliqué |

Le lot 4 peut démarrer en parallèle des lots 1 à 3. Les skills décrivent alors les outils à venir avec la mention « si disponible », pour ne jamais promettre un contrôle que l'outil ne fait pas encore.

---

## 8. Ce qui reste non vérifié

- **Zones sûres TikTok et YouTube en pixels** : gabarits ZIP (TikTok) et PNG (YouTube) non ouverts. Les 240/660/120/180 viennent de tiers.
- **Équivalences GSAP** (ressort ↔ `back.out`, cubic ↔ `power*`) : à valider à l'œil sur une planche.
- **Tailles de police §3.2** : aucune source officielle ; à tester sur la planche téléphone.
- **Comportement réel du serveur wideo** : `plan_shots`, `review_montage`, `place_sfx_from_events`, `add_captions` et la normalisation à −14 LUFS sont déduits des skills et des messages, pas du code.
- **Exposition actuelle des Elements Kling** dans `generate_video` : à vérifier avec `list_model_params`.
- **Licences** : ProductLabelRefinement, productfix, AllTracker, GSAP lui-même, Sonniss (clause IA), Rive et Lottie Creator MCP.
- **Chiffres d'audience** : « accroche de 1,7 s », « proposition avant 3 s », « 21–34 s », « 80–85 % sans son », « +191 % signal sonore », « UGC 7,56 % contre animation 4,57 % », « 50 références Seedance », « 7 références Kling » : sans source primaire.
- **Aucune comparaison primaire** du CTR ou du ROAS entre motion design pur et UGC (Motion 2026 classe l'animation 14e sur 15 en taux de gagnants, sans ROAS).
- **Étoiles GitHub** : non revérifiées par l'API (bloquée) ; lues sur les pages HTML le 24/10.
- **Packs iart** : `timing.test.mjs` et la référence `color-management.md` non lus en détail. `index.html` des exemples JakeB-5 non lus.
- **Planche de revue** : `snapshotSampling.ts` existe dans le fork mais n'a pas été comparé ligne à ligne avec l'amont (une seule mention de `resolveSnapshotCompositionRange`).
- **p10q/ae-mcp, Rive MCP, Lottie Creator MCP, Motion+** : décrits d'après des résumés de recherche, pages non lues.

---

## Annexe A. Contre-vérification de 6 affirmations

Relues dans la source citée par le rapport, le 2026-10-24.

| # | Affirmation (rapport) | Source relue | Résultat |
|---|---|---|---|
| 1 | La passe son de Barty s'arrête à −16 LUFS ±0,5 et à une crête vraie < −4 (skills-motion §1.1) | `Barty-Bart_motion-graphics/skills/sound-effects/scripts/sound_pass.py` l. 119 : `if abs(I+16)<=0.5 and P< -4: break` | **Confirmé** |
| 2 | Le plancher typographique de HyperFrames est 2,6 % du petit côté, soit 28 px en 1080 (moteurs §2) | `hyperframes/packages/cli/src/utils/craftAudit.ts` l. 20 `typeFloorFraction: 0.026` et l. 438 « 28 px on 1080 » | **Confirmé** |
| 3 | `checkComposition` du fork n'appelle que `lintProject` (moteurs §2) | `clapova-engine/packages/clapova-render/src/check.ts` : seul appel moteur `lint.lintProject(` (l. 64), aucun import du pipeline `check` | **Confirmé** |
| 4 | Ressorts JakeB-5 : snappy 320/28, heavy 90/19, playful 220/16 (skills-motion §2.1) | `JakeB-5_motion-graphic-skill/skills/motion-graphic/assets/engine.html` l. 239–242 | **Confirmé** |
| 5 | `normalize-audio` de HyperFrames vise −16 LUFS et s'arrête avant −1,5 dBTP (moteurs §2) | `hyperframes/packages/studio-server/src/helpers/loudness.ts` l. 489–490 : `DEFAULT_TARGET_LUFS = -16`, `NORMALIZE_TRUE_PEAK_CEILING_DBFS = -1.5` | **Confirmé** |
| 6 (bonus) | `snapshotReview.ts` amont : coutures −0,2…+0,2 s, planche à 360 px, absent du fork ; `pop/kenney-interface-maximize-002.ogg` à +10,7 dBTP | `hyperframes/packages/cli/src/commands/snapshotReview.ts` l. 14 et 16 ; aucun `snapshotReview*` dans `clapova-engine/packages/cli/src/commands/` ; `sfx-audit.tsv` : TP 10.7 | **Confirmé** |

Aucune erreur trouvée sur cet échantillon. Le rapport skills-motion avait déjà corrigé lui-même une erreur de comptage (109 sons et non 136).
