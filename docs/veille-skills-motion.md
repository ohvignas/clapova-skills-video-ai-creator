# Veille complète : skills, plugins et MCP pour le motion design (24 oct. 2026)

Suite de `veille-skills-motion.md`. Recherche en lecture seule : aucun outil Clapova payant, aucun dépôt modifié.

## Méthode et blocages
- **Étoiles vérifiées** : lues le 24/10/2026 sur la page HTML GitHub via WebFetch (sigle **GH**). C'est la seule source directe disponible.
- **Fichiers lus en entier** : les dépôts ci-dessous ont été clonés avec `git clone --depth 1` dans `scratchpad/bb/`, puis lus sans exécuter aucun script. Le clonage passe par le proxy, contrairement à l'API GitHub.
  - Barty-Bart/motion-graphics
  - emilkowalski/skills
  - lottiefiles/motion-design-skill
  - kylezantos/design-motion-principles
  - haidrrrry/claude-remotion-skill
  - digitalsamba/claude-code-video-toolkit
- **Bloqués** (DNS ENOTFOUND) : skillselion.com, autoae.online, awesomeclaude.ai.
- **Introuvable** : Brandkick/after-effects-mcp renvoie une 404 (renommé ou privé).
- **Chiffres d'agrégateurs** : les installations skills.sh viennent de citations Skillselion relayées par WebSearch, avec leur date. Ils sont marqués « agrégateur ».
- **Non vérifié** : tout chiffre absent est noté « n.v. ». Aucun chiffre n'a été inventé.

## 1. Tableau classé par popularité vérifiée

| # | Entrée | Auteur | Lien | Popularité (source, date) | Outil / approche | Couvre | Structure | Licence |
|---|---|---|---|---|---|---|---|---|
| 1 | OpenMontage (skills `motion-graphics`, `hyperframes`…) | calesthio | github.com/calesthio/OpenMontage | 71,4k ★, 9,2k forks (GH 24/10) | Système vidéo agentique : Remotion, HyperFrames et modèles génératifs (Kling, Veo…) | Typo cinétique, compteurs, logo stings, lower thirds, pipelines cinematic et documentaire | `skills/` + `.agents/skills/` (packs de connaissances) | AGPL-3.0 |
| 2 | HyperFrames (`motion-graphics`, `hyperframes-animation`, `gsap`, `remotion-to-hyperframes`…) | HeyGen | github.com/heygen-com/hyperframes | 71,1k ★, 6,4k forks (GH 24/10). hyperframes-animation : environ 1M installations (agrégateur Skillselion, oct. 2026) | HTML + GSAP vers MP4 | Routeur d'intention, 10 catégories (kinetic-type, stat, charts, logo-reveal, lower-thirds, maps, news, tweet, webpage, asset-fusion) | Index + `agents/` (director, builder, finalize) + `categories/<id>/module.md` + `references/` + `phases/` | Apache-2.0 |
| 3 | emilkowalski/skills (emil-design-eng, animate, review-animations, improve-animations, animation-vocabulary, animation-performance, apple-design…) | Emil Kowalski | github.com/emilkowalski/skills | 49,2k ★, 2,9k forks (GH 24/10). emil-design-eng : 250 523 installations, review-animations : 140 187 (agrégateur, oct. 2026) | Animation d'interface (CSS, React, Motion) | Easings personnalisés, durées, règle des 300 ms, `scale(0.95)` plutôt que `scale(0)`, revue d'animations | 15 skills, une par dossier | MIT |
| 4 | claude-code-templates (skill `motion-canvas`) | davila7 | github.com/davila7/claude-code-templates | 32,9k ★ pour tout le dépôt (GH 24/10) | Motion Canvas (TypeScript) | Mise en place, piège ESM/CJS du plugin vite | Fichier unique | MIT |
| 5 | blender-mcp | ahujasid | github.com/ahujasid/blender-mcp | 32,2k ★, 2,9k forks (GH 24/10) | MCP Blender (Python) | Scènes 3D, objets, matériaux | Serveur + addon | MIT |
| 6 | mcp-for-blender | ahujasid | star-history.com/ahujasid/mcp-for-blender | 29,1k ★ (Star History, 20/09/2026, agrégateur) | MCP Blender | idem | n.v. | n.v. |
| 7 | gsap-skills (8 skills : core, timeline, scrolltrigger, plugins, utils, react, performance, frameworks) | GreenSock (officiel) | github.com/greensock/gsap-skills | 17,0k ★, 1,0k forks (GH 24/10) | GSAP | API, timelines, easing, stagger, performance, nettoyage | Une skill par dossier + `llms.txt` + AGENTS/CLAUDE/GEMINI.md + plugins Claude et Cursor + exemples | MIT |
| 8 | remotion-dev/skills (best-practices, create, render, captions, maps, saas, multimedia…) | Remotion (officiel) | github.com/remotion-dev/skills | 5,6k ★, 622 forks (GH 24/10). best-practices : 382 543 installations (agrégateur, 05/07/2026) | Remotion (React) | Règles par sujet : animation, séquences, captions, lottie… | Index + `rules/*.md` | Licence non affichée sur la page (licence Remotion) |
| 9 | davinci-resolve-mcp | samuelgursky | github.com/samuelgursky/davinci-resolve-mcp | 3,7k ★, 429 forks (GH 24/10), badge v4.15.3 | MCP DaVinci Resolve | Timeline, médias, étalonnage | Serveur | MIT |
| 10 | designer-skills (plugin design-systems, motion compris) | owl-listener | github.com/owl-listener/designer-skills | 3,1k ★ (GH 24/10). motion-system : 1 763 installations (agrégateur, 15/10/2026) | Tokens de design | Tokens motion (durées et easings nommés) | Plugins découpés en skills | MIT |
| 11 | motion-design-skill | LottieFiles | github.com/lottiefiles/motion-design-skill | 2,5k ★, 162 forks (GH 24/10). 18 630 installations (agrégateur, 15/10/2026) | Principes, quel que soit l'outil | Timing, easing, chorégraphie, 12 principes Disney, personnalités, émotions | `SKILL.md` (moins de 500 lignes) + `director/` (8) + `patterns/` (4) + `reference/` (4) | MIT |
| 12 | claude-code-video-toolkit | digitalsamba | github.com/digitalsamba/claude-code-video-toolkit | 2,3k ★, 394 forks (GH 24/10) | Remotion, FFmpeg, ElevenLabs, Playwright, LTX2… | Template projet complet, profils de marque (`brands/`) | 13 skills `.claude/skills` + templates + outils | MIT |
| 13 | design-motion-principles | kylezantos | github.com/kylezantos/design-motion-principles | 1,4k ★, 106 forks (GH 24/10). 12 305 installations (agrégateur, 15/10/2026) | Principes d'interface (3 approches : Emil, Jakub, Jhey) | Modes Create et Audit, anti-checklist « AI slop », rapport HTML | Routeur + `workflows/` (create, audit) + `references/` (12 fichiers) | MIT |
| 14 | motion-skills (18 packs, 50 à 55 skills) | iart-ai | github.com/iart-ai/motion-skills | 984 ★, 83 forks (GH 24/10) | Multi-outils (Remotion, GSAP, Manim, WebGL, Lottie) | TikTok, pub, data, explainer, cartes, typo cinétique, lower thirds, b-roll | Skill = `SKILL.md` + `references/` + `scripts/` ; un dépôt par pack | MIT |
| 15 | **motion-graphics** (6 skills) | **Barty-Bart** | github.com/Barty-Bart/motion-graphics | 823 ★, 126 forks (GH 24/10). Dernier commit le 13/10/2026 (git log) | HTML piloté par `seek(t)`, Playwright et ffmpeg ; SAM 2 en local ; Python et librosa pour le son | B-roll sur transcript, 3 explainers, détourage, passe son mesurée | Une skill par dossier : `SKILL.md` + `reference/` + `engine/` + `scripts/` + `examples/` + `sfx/manifest.json` | MIT (Geist en OFL, Lucide en ISC, SFX en CC0) |
| 16 | claude-remotion-skill (`remotion-motion-graphics`) | haidrrrry | github.com/haidrrrry/claude-remotion-skill | 609 ★, 78 forks (GH 24/10) | Remotion | 10 règles, palettes, typo, structure d'un Reel de 30 s, son, checklist | `SKILL.md` + `references/` (motion-patterns, design-rules) + `assets/theme.ts` + exemples + fichier `.skill` | MIT |
| 17 | claude-skills (`animate`) | OneWave-AI | github.com/OneWave-AI/claude-skills | 372 ★ (GH 24/10) | Vite, React, Framer Motion, p5, Three | Projet animé généré | Fichier unique | MIT |
| 18 | animate-skill | delphi-ai | github.com/delphi-ai/animate-skill | 129 ★ (GH 24/10) | Next.js, Motion (d'après le cours d'Emil Kowalski) | Easing, timing, 8 exemples | `SKILL.md` + `examples/` + `references/` | non affichée |
| 19 | Claude-Code-Video-Toolkit (liste) | wilwaldon | github.com/wilwaldon/Claude-Code-Video-Toolkit | 101 ★ (GH 24/10) | Liste curée | Remotion, Manim, FFmpeg | README | MIT |
| 20 | motion-graphics-skills (53 skills) | imMamdouhaboammar | github.com/imMamdouhaboammar/motion-graphics-skills | 33 ★, 14 forks (GH 24/10) | HyperFrames | brand-intake (écrit `brand.md` + `MOTION.md`), motion-director, sfx-picker, video-review-loop, journal d'échecs | 53 dossiers + `Failure-lessons/` + `validate-skills.sh` | **Propriétaire** (réutilisation interdite) |
| 21 | Cavalry-mcp (21 outils) | kacperchlebowicz | github.com/kacperchlebowicz/Cavalry-mcp | 31 ★ (GH 24/10) | Cavalry via Stallion (HTTP local) | Calques, keyframes, magic easing, rendu PNG | Serveur | MIT |
| 22 | motion-graphic-skill | JakeB-5 | github.com/JakeB-5/motion-graphic-skill | 6 ★ (GH 24/10) | Canvas HTML, Web Audio | Film calé sur les temps, `facts.md`, contrôle automatique | `SKILL.md` + `assets/engine.html` + `references/` (story, styles, scene patterns, critique) + `scripts/check.js`, `record.js` | MIT |
| 23 | ae-motion (77 à 78 outils) | dha-aa | github.com/dha-aa/ae-motion | 5 ★ (GH 24/10) | MCP After Effects (CEP + ExtendScript) | Comps, calques, keyframes, expressions, masques, caméra 3D, rendu | Serveur + panneau CEP | MIT |
| 24 | motion-canvas-skills | apoorvlathey | github.com/apoorvlathey/motion-canvas-skills | 2 ★ (GH 24/10) | Motion Canvas | API et patterns | `SKILL.md` + `references/` | MIT |
| 25 | agent-skills (`theatre-js`, `gsap`) | noklip-io | github.com/noklip-io/agent-skills | 1 ★ (GH 24/10) | Theatre.js, R3F | Studio, timeline | Fichier par skill | MIT |
| 26 | Lottie Creator MCP | LottieFiles (officiel) | docs.lottiefiles.com/en/creator/13_ai-tools/lottie-creator-mcp | n.v. (billet de blog du 15/04/2026) | Lottie via un pont local npx | Générer ou éditer du Lottie, variantes, contrôle de marque | MCP | n.v. |
| 27 | Motion+ AI Kit (`/motion` + MCP) | Motion (motion.dev) | motion.dev/ai-kit | n.v. | Motion, CSS `linear()` | Ressenti traduit en ressort, audit MotionScore | Skill + MCP | **Payant** (Motion+) |
| 28 | Rive MCP officiel (Editor Early Access) + rivemcp (139 outils) | Rive / paradoxsyn | glama.ai/mcp/servers/paradoxsyn/rivemcp-releases | n.v. | Rive | State machines, animations | MCP | n.v. |
| 29 | ae-mcp | p10q | mcpservers.org/servers/p10q/ae-mcp | n.v. | After Effects (pont par fichiers) | Projets, comps, calques | MCP | n.v. |
| 30 | motion-framer | freshtechbro | github.com/freshtechbro/claudedesignskills | n.v. | Framer Motion | Gestes, layout, ressorts | Fichier unique | n.v. |
| 31 | theatrejs | fandhe-ai | skillselion.com/skills/fandhe-ai/agent-reference-skills/theatrejs | n.v. | Theatre.js | core, studio, r3f | Index + un fichier par API | n.v. |
| 32 | motion-canvas (VideoZero, udnisap) | divers | skills.sh/udnisap/skills/motion-canvas | n.v. | Motion Canvas | Scènes, générateurs, transitions | Fichier unique | n.v. |
| 33 | motion-graphics (Grade A) | jagz999 | skillsdirectory.com/skills/jagz999-motion-graphics | n.v. | n.v. | n.v. | n.v. | n.v. |
| 34 | Polymation | n.v. | (listing glama) | n.v. | Conversion Rive, Spline, Lottie, Figma, AE (avec pertes) | Spline 3D | MCP | n.v. |
| 35 | Claude Motion (produit, pas une skill) | Anthropic | eesel.ai/blog/claude-motion | Bêta Team et Enterprise (guides tiers, oct. 2026) | Animation de texte, graphiques et formes, sans modèle vidéo ; export MP4 vers Adobe, HeyGen, Runway… | — | — | — |

Outils déjà connectés à cette session (pas des skills publiques) : Figma MCP `get_motion_context` (import Figma Motion) et Canva `import-claude-motion-from-url`. Aucune skill ni aucun MCP n'a été trouvé pour Jitter, Revideo, Premiere Pro ou Canva motion.

## 2. Analyse approfondie des 8 meilleurs

### 2.1 Barty-Bart/motion-graphics (823 ★, MIT, dernier commit le 13/10/2026)

**Structure.** Six skills qui font chacune une seule chose, entre 133 et 260 lignes par `SKILL.md` :
- `motion-broll` est la plus outillée :
  - `engine/` : `motion.js`, `build.py`, `render.js` (motion blur sur 4 sous-images), `beats.js` (planches de contrôle), polices Geist intégrées ;
  - `scripts/` : `inspect_video.py` (détecte les mises en page full / pip / black), `words.py`, `composite.py`, `make_pages.py` ;
  - `reference/engine-api.md`, à lire avant le premier clip ;
  - `examples/opus-aoe2/` : 6 clips réels qui servent de barre de qualité.
- `explainer-high-energy` (12 à 20 s), `explainer-default` (45 à 90 s) et `explainer-engaging` (10 à 30 s, plan-séquence en boucle) : un seul fichier HTML chacun, avec le moteur de rendu `render.mjs` intégré au SKILL.md.
- `sound-effects` : `scripts/sound_pass.py` et `report.py`, `sfx/manifest.json` (catégories, `default_kit`, `category_map`, `alt_categories`, `source_url`, licence), sons CC0, `MUSIC.md`, `TOP-PICKS.md`, `LICENSES.md`.
- `object-separation` : SAM 2 en local, avec un choix de modèle selon la machine.

**Ce qui le rend bon.**
1. **Une idée visuelle forte et unique par skill.**
   - motion-broll : « une forme qui ne coupe jamais », qui change de taille, d'arrondi et de couleur ; le contenu s'échange avec un court flou ; un curseur provoque les changements.
   - high-energy : « les transitions sont des objets, pas des coupes » (une étincelle devient une ligne, qui inonde l'écran ; le point final devient la balle de la scène suivante).
   - engaging : un seul héros traverse des stations, puis la caméra recule pour montrer tout le parcours.
2. **Un contrat de rendu déterministe** : `window.seek(t)` est une fonction pure du temps. Pas de transition CSS ni de `setTimeout`, un aléatoire à graine, la physique précalculée au chargement à 1/240 s, les polices intégrées en base64, `white-space: nowrap`.
3. **Des fonctions d'aide numériques prêtes à coller** :
   - `spring(t, w, z)` avec w = 8 (lent), 14 (normal) ou 22 (vif) ;
   - `track()` (cibles successives atteintes par ressort) et `kf()` (keyframes avec easing, pour la caméra) ;
   - `seg()`, et `rng` à graine.
4. **Une direction créative chiffrée.**
   - Cutaway : 3 à 10 s, jamais dans la première seconde de l'accroche ni sur une phrase émotionnelle, au moins 2 s de visage entre deux.
   - Un changement par temps de parole, toutes les 0,4 à 1,2 s.
   - Densité : 2 à 4 clips par minute (léger), 4 à 7 (moyen).
   - Grille de 120 à 140 BPM, gros changements sur les temps, typo sur les 1/8 et 1/16, dépassement z ≈ 0,6 à 0,7 sur les impacts.
   - Au plus deux coupes franches, toujours sur un temps fort.
   - Cadre HUD à 12-14 px et 50 % d'opacité.
5. **Des listes d'interdits explicites**, propres à chaque style : easing qui rebondit, particules, lueurs, dégradés sur l'interface, icônes de traits différents, temps mort, look de template, données inventées.
6. **Ne jamais inventer de faits** : barres relatives et lignes de squelette à la place des chiffres, liste de ce qui est illustratif, logos tiers seulement s'ils sont fournis.
7. **Une boucle de contrôle** : plan validé avant tout code, planche d'images aux temps clés, brouillon à 30 fps sans flou, puis rendu final à 60 fps avec 8 sous-images. Le délai est annoncé avant de lancer.
8. **Une passe son mesurée, pas jugée à l'oreille** (« Claude ne peut pas entendre ») :
   - grille de temps librosa vérifiée sur les kicks (filtre passe-bas à 120 Hz, décalage par la médiane si l'outil s'est calé sur le contretemps), erreur coupe/temps donnée en ms ;
   - un son réel par évènement, jamais de synthèse ; whoosh 2 images en avance, riser qui *finit* sur l'impact ;
   - priorité voix > SFX > musique, musique environ 12 dB sous les SFX, baisse de 8 à 12 dB sous la voix ;
   - −16 LUFS et true peak sous −4 dBFS mesurés sur le MP4 exporté, avec un contrôle mono ;
   - 5 instants risqués donnés à l'utilisateur pour une écoute au casque ;
   - vérification des licences à chaque export, `CREDITS.txt`, page d'échange des sons ;
   - crédit : méthode de Vox (@Voxyz_ai).

**À reprendre pour Clapova.** La forme continue et le curseur comme recette de b-roll ; les transitions-objets ; le contrat `seek(t)`, que HyperFrames et GSAP respectent déjà avec des timelines en pause ; le cue-list typé (movement, scene_cut, appear, click, typing, build_up, reveal, success, error_or_tech) relié à `place_sfx_from_events` ; les cibles LUFS et true peak ; les 5 instants à écouter.

### 2.2 heygen-com/hyperframes, skill `motion-graphics` (71,1k ★, Apache-2.0)
- **Routeur d'intention.** `/hyperframes` est la porte d'entrée. Une pièce courte, sans voix et de moins de 10 s va vers motion-graphics. Une pièce narrée va vers general-video.
- **Approche « asset-first ».** La première décision est : faut-il chercher du contenu ? Si oui, la catégorie dépend du type de contenu trouvé (webpage, news, tweet, asset-fusion). Si non, ce sont les catégories de forme : kinetic-type, stat, charts, logo-reveal, lower-thirds, maps.
- **Organisation.** Un fichier `categories/<id>/module.md` par catégorie, des sous-agents director, builder et finalize, et `shot-plan.json` comme artefact central.
- **Contrôles.** lint, check, planche de contrôle, puis question canonique « rendre maintenant ou modifier ? ».
- **Pour Clapova.** C'est déjà le moteur. Il faut reprendre ce découpage par catégorie dans la skill Clapova, avec les blocs `get_motion_catalog` à la place des blocs du registre.

### 2.3 emilkowalski/skills (49,2k ★, MIT)
- **Contenu.** Règles d'interface précises, et le trio animate / review-animations / improve-animations (écrire, auditer, plan de correction).
- **Règles notables.**
  - Animations d'interface de moins de 300 ms.
  - Jamais `ease-in` pour l'interface.
  - Courbes : ease-out `cubic-bezier(0.23,1,0.32,1)`, ease-in-out `(0.77,0,0.175,1)`, drawer `(0.32,0.72,0,1)`.
  - Jamais `scale(0)` : partir de `scale(0.95)` avec opacité 0.
  - Animer des propriétés précises, jamais `transition: all`.
  - Ne pas animer les actions répétées au clavier.
  - `animation-vocabulary` traduit un ressenti en termes techniques.
- **Pour Clapova.** Le principe « rien n'apparaît à partir de rien » et une skill de revue séparée de la skill de création.

### 2.4 greensock/gsap-skills (17,0k ★, MIT)
- **Contenu.** 8 skills ciblées : timeline (paramètre de position, labels, imbrication), performance (transforms, `will-change`), utils (`mapRange`, `snap`).
- **Distribution multi-agents.** `llms.txt`, AGENTS.md, GEMINI.md, instructions Copilot, plugins Claude et Cursor.
- **Pour Clapova.** C'est la référence technique du moteur. Il suffit d'y renvoyer pour les détails d'API au lieu de les recopier.

### 2.5 lottiefiles/motion-design-skill (2,5k ★, MIT)
- **Architecture.** `SKILL.md` court (moins de 500 lignes), avec trois dossiers :
  - `director/` : philosophie, cadre de décision, Disney, personnalité, émotion, chorégraphie, narration, contexte ;
  - `patterns/` : entrée et sortie, retour d'état, ambiant, multi-éléments ;
  - `reference/` : tables timing-easing, choix des propriétés, checklist, dépannage.
- **Tables chiffrées** (lues dans `reference/timing-easing-tables.md`) :
  - durée par élément : carte 200-350 ms, modal 300-400 ms, transition de page 400-600 ms, révélation 600-1200 ms ;
  - durée selon la distance : 50 px = 0,8×, 100 px = 1×, 200 px = 1,3×, 300 px = 1,5×, plein écran = 1,8 à 2× ;
  - la sortie dure 65 à 75 % de l'entrée ;
  - personnalités : Premium 350/500/800 ms, Energetic 100/180/300 ms ;
  - matériaux (rigide, élastique, fluide, papier…) ;
  - ressorts (Standard : raideur 250-350, amortissement 18-24) ;
  - stagger total sous 500 ms ;
  - budget de dépassement : Premium 0 %, Succès 5-10 %, Célébration 15-25 %.
- **Pour Clapova.** Copier la forme, pas le texte (licence MIT, attribution) : des tables par personnalité de marque.

### 2.6 kylezantos/design-motion-principles (1,4k ★, MIT)
- **Fonctionnement.** Le routeur choisit entre les modes Create et Audit, et pondère trois approches de designers (principale, secondaire, ponctuelle).
- **Anti-checklist « AI slop ».** Elle signale les indicateurs qui pulsent, le flou sur toutes les entrées, le zoom au survol partout, l'abus de stagger. Une heuristique de fréquence évite de signaler un usage unique et voulu (par exemple : signaler si au moins 3 composants partagent le même flou d'entrée).
- **Sortie.** Un rapport HTML avec une démo à côté de chaque défaut.
- **Pour Clapova.** Un fichier `anti-patterns.md` avec des seuils de fréquence, branché sur `review_montage`.

### 2.7 haidrrrry/claude-remotion-skill (609 ★, MIT)
- **Dix règles concrètes** :
  - pas de linéaire, `interpolate` toujours borné ;
  - entrées sur 2 à 3 propriétés à la fois, avec stagger ;
  - sorties plus rapides que les entrées ;
  - pile de 5 couches (fond, assets, graphismes, étalonnage, grain et vignette) ;
  - Ken Burns sur chaque image fixe ;
  - légère oscillation sinusoïdale sur les éléments au repos ;
  - un seul fichier `theme.ts`.
- **Design rules.**
  - Couleurs 60/30/10 ; la couleur héro sur au plus un élément par image.
  - Titres héro de 80 à 140 px en Reel (1080 de large), poids 600 à 800, interlettrage −0,03 em.
  - Structure d'un Reel de 30 s : accroche 0-1,5 s, contexte jusqu'à 3 s, 3 ou 4 temps « impact, pause de 15 à 20 images, montée », payoff de 22 à 27 s, CTA de 27 à 30 s.
  - « Les pauses sont un outil » : au moins 3 moments immobiles.
  - Logo sting de 5 s : marque 0-0,8 s, wordmark 0,6-1,8 s, tagline 2-3,5 s, sortie sur la dernière demi-seconde.
  - SFX 2 à 3 images avant l'élément visuel.
  - Revoir les mouvements suspects à 0,25× de vitesse.

### 2.8 iart-ai/motion-skills (984 ★, MIT) et JakeB-5/motion-graphic-skill (6 ★, MIT)
- **iart-ai.** Un catalogue par public, en 18 packs (TikTok, pub, data, explainer, cartes, lower thirds, b-roll…). Chaque skill contient `SKILL.md`, `references/` et `scripts/`. Bon modèle pour une recette par usage.
- **JakeB-5.**
  - Faits tracés : chaque chiffre affiché vient de `facts.md`.
  - Planches de contrôle en taille téléphone, contrôle de déterminisme et de texte coupé.
  - Critique en 7 axes par un relecteur séparé, qui corrige les 3 pires défauts par tour.
  - Livraison quand chaque axe atteint 8 après au moins 2 tours, sinon au bout de 3 tours avec un `review_log.md`. C'est très proche de la règle « 8/10 » de Clapova, mais formalisé.

(Mention : `imMamdouhaboammar/motion-graphics-skills` a des idées fortes — `brand-intake` qui écrit `MOTION.md`, et `Failure-lessons/` — mais sa licence est propriétaire. On peut s'inspirer des concepts, pas copier.)

## 3. Synthèse des meilleures règles (avec source)

### Principes
- Un message ou une idée par plan ou par scène. Sources : Barty-Bart (high-energy, motion-broll), Clapova.
- Les transitions sont des objets : une forme ou un élément porte l'œil d'une scène à l'autre. Au plus 2 coupes franches, sur un temps fort. Source : Barty-Bart explainer-high-energy.
- Un fil continu : une forme qui se transforme, ou un héros qui ne disparaît jamais. Sources : Barty-Bart motion-broll et explainer-engaging.
- La caméra fait le montage : pas de coupe, poussée ou recul de 0,6 à 1,2 s, ou ressort avec z ≥ 0,95. Source : Barty-Bart explainer-default.
- Rien n'apparaît à partir de rien : `scale(0.95)` plutôt que `scale(0)`. Source : emil-design-eng.
- Les pauses sont un outil : au moins 3 moments immobiles ; un mouvement constant fait amateur. Source : haidrrrry design-rules.
- Ne jamais inventer de chiffres, citations ou logos : faits tracés dans `facts.md`. Sources : Barty-Bart, JakeB-5.

### Durées
- Entrée : base. Sortie : 65 à 75 % de l'entrée. Sources : LottieFiles, haidrrrry (« exits faster »).
- Durée selon la distance : 50 px = 0,8×, plein écran = 1,8 à 2×. Source : LottieFiles.
- Interface : moins de 300 ms. Source : Emil. Vidéo : entrée de 0,4 à 0,7 s (Clapova actuel ; cohérent avec la ligne « Premium » de LottieFiles, 350-800 ms).
- Stagger : 50 à 100 ms par élément, budget total sous 500 ms. Source : LottieFiles.
- Un changement par temps de parole, toutes les 0,4 à 1,2 s. Source : Barty-Bart motion-broll.
- Cutaway de 3 à 10 s, au moins 2 s de visage entre deux, jamais dans la première seconde. Source : Barty-Bart.
- Logo sting de 5 s : marque 0-0,8 s, wordmark 0,6-1,8 s, tagline 2-3,5 s. Source : haidrrrry.
- Hype de 15 s : 128 BPM, 8 mesures, 6 à 8 scènes de 1,5 à 3 s. Source : Barty-Bart.

### Easings et ressorts
- Entrée en ease-out, sortie en ease-in, mouvement à l'écran en ease-in-out, boucle en sinus, rotation ou progression en linéaire. Source : LottieFiles.
- Courbes : `cubic-bezier(0.23,1,0.32,1)` (ease-out) et `(0.77,0,0.175,1)` (ease-in-out). Source : Emil.
- Ressort `spring(t,w,z)` : w = 8, 14 ou 22 ; z = 0,82 par défaut ; impacts à z ≈ 0,6-0,7 ; la caméra suit un ressort à amortissement critique (w ≈ 6). Source : Barty-Bart.
- Dépassement : Premium 0 %, succès 5-10 %, célébration 15-25 %. Source : LottieFiles.
- Jamais linéaire, toujours borné (clamp). Source : haidrrrry. Jamais le `ease` par défaut. Source : kylezantos creation-gotchas.

### Typographie et hiérarchie
- Trois familles de police au plus : une grotesque grasse pour les titres choc, une serif italique pour la ligne humaine, une mono pour le HUD et les légendes. Source : Barty-Bart high-energy.
- Titres héro de 80 à 140 px en 1080 vertical, poids 600 à 800, interlettrage −0,03 em, interligne 1,05 ; un seul mot mis en valeur par titre. Source : haidrrrry. Clapova : 140 à 180 px.
- Au plus 3 couleurs par scène (hors noir et blanc) ; couleur héro à 10 %, sur un élément par image. Sources : Barty-Bart, haidrrrry.
- Une ligne de texte et un élément d'interface au plus à l'écran ; texte et interface presque jamais ensemble. Source : Barty-Bart explainer-default.
- Polices intégrées en base64, pour qu'aucune police de secours n'apparaisse en silence. Source : Barty-Bart.

### Rythme et son
- Gros changements sur les temps, typo sur les 1/8 et 1/16. Source : Barty-Bart.
- Grille de temps vérifiée sur les kicks ; erreur coupe/temps en ms. Source : Barty-Bart sound-effects.
- SFX 2 à 3 images avant l'élément visuel ; le riser finit sur l'impact ; l'impact est le son le plus fort. Sources : Barty-Bart, haidrrrry.
- Voix > SFX > musique, musique −12 dB sous les SFX, baisse de 8 à 12 dB sous la voix, −16 LUFS, true peak sous −4 dBFS, contrôle mono. Source : Barty-Bart. Clapova vise −14 LUFS : à arbitrer.

### Anti-patterns
- Indicateurs qui pulsent, flou sur toutes les entrées, zoom au survol partout, abus de stagger, avec un seuil de fréquence (au moins 3). Source : kylezantos.
- Particules, lueurs, dégradés sur l'interface, easing qui rebondit, look de template, emoji, glassmorphism partout. Source : Barty-Bart.
- Machine à écrire, lueur, rebond, dégradés de texte, fond violet-bleu. Source : imMamdouh (concepts seulement).
- `will-change` sur un élément zoomé par la caméra (texte flou) ; textes qui se chevauchent pendant un fondu. Source : Barty-Bart gotchas.
- `transition: all`, `scale(0)`, `ease-in` dans l'interface. Source : Emil.

## 4. Plan de refonte de `plugins/clapova/skills/motion-design`

**Objectif.** Passer d'un fichier unique de 128 lignes à un index court (environ 120 lignes) avec des références chargées à la demande. On reprend la forme de LottieFiles (director / patterns / reference), Remotion (rules) et HyperFrames (categories). La structure ci-dessous est une proposition à valider par l'utilisateur.

```
motion-design/
  SKILL.md                    index : routeur + méthode en 5 blocs + boucle de contrôle + liens
  references/
    principles.md             principes (une idée par plan, transitions-objets, fil continu, pauses, rien n'apparaît de rien)
    timing-easing.md          tables : durées par élément, distance, entrée/sortie, stagger, ressorts, dépassement, personnalités
    motion-tokens.md          tokens nommés (enter.fast / enter.base / exit / emphasis / stagger / camera) dérivés du brand kit
    typography-hierarchy.md   tailles, poids, 3 couleurs, mot héro, zones sûres par format
    rhythm-beat.md            grille BPM, 1/8 et 1/16, coupes sur les temps, un changement par temps de parole
    sound-pass.md             types de cue → place_sfx_from_events, avance de 2 images, LUFS/true peak, 5 instants à écouter
    anti-patterns.md          liste + seuils de fréquence + l'outil qui détecte chaque défaut (review_montage / check_composition)
    facts-and-assets.md       ne rien inventer, barres relatives, logos tiers, ce qui est illustratif
    qa-loop.md                planches, note 8/10 sur 7 axes, 3 pires défauts par tour, 2 à 3 tours au plus
    toolkit-ops.md            tableau actuel « Contrôle libre » (ops apply_edit_plan, effets, transitions, LUT)
  recipes/                    une recette par usage : intention, quand l'utiliser ou non, timeline chiffrée, ops exactes, contrôle
    kinetic-title.md          titre par mots ou par lettres (title-kinetic-words, title-char-rise)
    stat-countup.md           compteur 1,4 s + pulsation 1,06 + 3 ticks (counter-*)
    logo-sting.md             5 s : marque 0-0,8 / wordmark 0,6-1,8 / tagline 2-3,5 / sortie 0,5 (logo-*)
    lower-third.md            0,5 + 2,5 + 0,3 s (lt-*)
    hype-promo-15s.md         128 BPM, 6 à 8 scènes, transitions-objets, cadre HUD optionnel
    one-shape-broll.md        b-roll « forme continue + curseur » calé sur les mots (create_motion_scene)
    one-take-explainer.md     héros unique, stations, recul de caméra
    product-ui-demo.md        mockup / interface refaite, caméra qui fait le montage
    data-chart.md             barres, ligne, anneau, chiffres réels seulement
    endcard-cta.md            carte finale qui reprend la première image
    transitions.md            familles, start = coupe − durée/2, une famille par vidéo
```

**Contenu de `SKILL.md` (index).**
1. Première action : `get_guide('motion')`.
2. Routeur, sur le modèle HyperFrames. Moins de 10 s sans voix : recette de `recipes/`. Narré ou multi-scènes : `clapova:montage-recipes` et `clapova:monteur`. Une seule question au plus, puis on avance.
3. Méthode en 5 blocs, inchangée, avec un champ « faits » ajouté.
4. Six règles d'or, en une ligne chacune, avec un lien vers la référence.
5. Boucle de contrôle : `render_preview_frames`, puis note d'au moins 8 sur 10, puis correction des 3 pires défauts, puis nouveau contrôle.
6. Tableau des familles de blocs (actuel).
7. Liens vers les références et les recettes.

**Contenu des références.**
- **timing-easing.md** : la table Clapova actuelle (power3.out, expo.out…), complétée par :
  - le ratio sortie = 0,7 × entrée ;
  - la durée selon la distance ;
  - le budget de stagger total sous 0,5 s ;
  - la correspondance entre ressort et `back.out` (`back.out(1.4)` pour un dépassement de 5 à 10 %) ;
  - une colonne par personnalité de marque (sobre / premium / énergique), en valeurs GSAP.
- **motion-tokens.md** : cinq tokens qui alimentent storyboard, recettes et review.
- **anti-patterns.md** : chaque entrée reçoit un id stable (`AP-01 linear`, `AP-02 glow`, `AP-03 stagger > 0,5 s`, `AP-04 texte qui se chevauche`, `AP-05 scale(0)`, `AP-06 plus de 3 couleurs`, `AP-07 transition différente à chaque coupe`, `AP-08 chiffre inventé`…), réutilisable dans `review.issues`.
- **sound-pass.md** : la table des types de cue de Barty-Bart, traduite vers les catégories de `place_sfx_from_events`, en gardant l'avance de 2 images, le riser qui finit sur l'impact, et l'impact comme son le plus fort.
  - Arbitrage LUFS : −14 (Clapova actuel) ou −16 avec true peak sous −4 dBFS (Barty-Bart). À trancher avec l'utilisateur.
  - Clapova ne mesure peut-être pas le true peak. Ne pas promettre un contrôle que l'outil ne fait pas.
- **qa-loop.md** : les 7 axes (cadre, lisibilité, hiérarchie, rythme, cohérence de style, faits, son), le nombre de tours (JakeB-5) et les 5 instants à écouter.

**Gabarit d'une recette** (environ 40 lignes chacune) :
- Quand l'utiliser / quand ne pas l'utiliser
- Entrées requises
- Timeline chiffrée en secondes
- Ops JSON exactes (`add_block` / `set_motion`)
- Son (cues)
- Points de contrôle (temps à passer dans `render_preview_frames`)
- Pièges

**Côté montage-recipes.** Ne rien dupliquer : renvoyer vers `motion-design/references/rhythm-beat.md` et `sound-pass.md`. montage-recipes garde l'accroche, les styles, les plateformes et les sous-titres.

**Attribution.** Ajouter dans `THIRD_PARTY_NOTICES.md` les sources MIT dont on reprend des formulations ou des tables : LottieFiles, Barty-Bart, haidrrrry, Emil Kowalski, kylezantos. Ne rien reprendre d'imMamdouh (propriétaire) ni d'OpenMontage (AGPL).

## Sources principales
- https://github.com/Barty-Bart/motion-graphics
- https://github.com/heygen-com/hyperframes
- https://github.com/calesthio/OpenMontage
- https://github.com/emilkowalski/skills
- https://github.com/greensock/gsap-skills
- https://github.com/remotion-dev/skills
- https://github.com/lottiefiles/motion-design-skill
- https://github.com/kylezantos/design-motion-principles
- https://github.com/iart-ai/motion-skills
- https://github.com/haidrrrry/claude-remotion-skill
- https://github.com/JakeB-5/motion-graphic-skill
- https://github.com/imMamdouhaboammar/motion-graphics-skills
- https://github.com/digitalsamba/claude-code-video-toolkit
- https://github.com/owl-listener/designer-skills
- https://github.com/ahujasid/blender-mcp
- https://github.com/samuelgursky/davinci-resolve-mcp
- https://github.com/dha-aa/ae-motion
- https://github.com/kacperchlebowicz/Cavalry-mcp
- https://docs.lottiefiles.com/en/creator/13_ai-tools/lottie-creator-mcp
- https://motion.dev/ai-kit
- https://www.star-history.com/ahujasid/mcp-for-blender
- https://eesel.ai/blog/claude-motion
