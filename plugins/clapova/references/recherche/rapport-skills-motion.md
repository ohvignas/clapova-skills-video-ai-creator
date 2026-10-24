# Analyse approfondie de l'outillage des skills motion design (24/10/2026)

Clones en lecture seule dans `scratchpad/deep/` (`GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1`). Aucun script n'a été exécuté. Tout ce qui suit vient des fichiers lus. Quand je n'ai pas lu un fichier, je le dis.

| Projet | Dossier local | Fichiers | Licence |
|---|---|---|---|
| Barty-Bart/motion-graphics | `deep/Barty-Bart_motion-graphics` | 160 (dont 109 sons .ogg, 7 GIF de démo) | MIT (© 2026 Bart). Geist en OFL, sons en CC0 |
| emilkowalski/skills | `deep/emilkowalski_skills` | 29, que du Markdown | MIT (© 2026 Emil Kowalski) |
| greensock/gsap-skills | `deep/greensock_gsap-skills` | 42 (8 skills + exemples + manifestes de plugin) | MIT (© 2026 GreenSock) |
| lottiefiles/motion-design-skill | `deep/lottiefiles_motion-design-skill` | 20, que du Markdown | MIT (© 2025 LottieFiles) |
| kylezantos/design-motion-principles | `deep/kylezantos_design-motion-principles` | 18 (Markdown + 2 gabarits HTML) | MIT (© 2026 Kyle Zantos) |
| iart-ai/motion-skills | `deep/iart-ai_motion-skills` + 7 packs dans `deep/iart-packs/` | 9 dans le dépôt index ; les skills sont dans 18 dépôts séparés | MIT (© 2026 iart.ai), dans chaque pack |
| **JakeB-5/motion-graphic-skill** (le dépôt exact cité dans la veille, ligne 44) | `deep/JakeB-5_motion-graphic-skill` | 216 (dont 4 films d'exemple avec leurs journaux de revue) | MIT (© 2026 motion-graphic-skill contributors) |
| owl-listener/designer-skills (skill `motion-system`) | `deep/owl-listener_designer-skills` | 205 (111 skills) | MIT (© 2026 MC Dean) |

Limites de lecture :
- Les fichiers binaires (sons, polices, GIF, MP4) ont été listés, pas écoutés ni regardés.
- iart-ai : le dépôt `motion-skills` n'est qu'un index (README, vitrine, `tools/verify/`). J'ai cloné et lu 7 des 18 packs (tiktok-video, b-roll, lower-thirds, kinetic-typography, data-animation, ad-video, motion-design). Les 11 autres (text-message, youtube, ecommerce, explainer, map, web-animation, freelance, webgl, manim, generative-illustration, javascript-animation) n'ont pas été lus.
- emilkowalski : `write-swift`, `ask-sonner`, `mobile-native`, `break-ui`, `prototype` et `pick-ui-library` n'ont été vus que par leur frontmatter. Ils sont hors sujet pour la vidéo.
- JakeB-5 : `assets/engine.html` (55 Ko) n'a été lu que sur la fonction `spring` et la table `SPRING`. Les `index.html` des exemples n'ont pas été lus.
- owl-listener : seule la skill `motion-system` a été lue en entier, avec `SKILL_TEMPLATE.md`, `scripts/lint-frontmatter.py` (début et constantes) et `scripts/check-runtimes.py` (en-tête).

---

## 1. Barty-Bart/motion-graphics : le plus outillé, et il mesure vraiment

Dépôt : `skills/` contient 6 skills, une par dossier : `motion-broll`, `object-separation`, `explainer-default`, `explainer-engaging`, `explainer-high-energy`, `sound-effects`.

### 1.1 Outils et scripts

**Moteur de rendu déterministe (`motion-broll/engine/motion.js`, 8,7 Ko).** Tout l'état d'une image est une fonction pure du temps :
```js
/* Every style is a pure function of time inside seek(t). No CSS transitions, no timers. */
const S = M.S = (tau,w,z)=>{ ... }   // réponse indicielle d'un ressort amorti, forme fermée (sous-amorti, critique, sur-amorti)
M.MORPH=[15,0.84]; M.FAST=[27,0.86]; M.SLOW=[12.5,0.9]; M.SOFT=[10,0.95]; M.CAM=[7.5,1]; M.INSTANT=[Infinity,1];
M.track = (v0,keys,def=M.MORPH,period=0)=>...   // une valeur qui change de cible plusieurs fois = la somme d'un ressort par changement ; en boucle, ajoute le reste du cycle précédent pour que t=period == t=0
```
Autres outils du moteur :
- `M.ctrack` : le même ressort, appliqué aux couleurs canal par canal.
- `M.vis(t,tin,tout)` : échange de contenu. La sortie se floute vite (`lout` 0,12 s) ; l'entrée attend `din` 0,07 s puis apparaît sur `lin` 0,26 s, flou de 12 px. Les deux textes ne se chevauchent donc jamais.
- `M.path` : trajet du curseur, avec un léger arc « humain » (`arc=sin(πu)*0.06`).
- `M.presses` : petit enfoncement à chaque clic.
- `M.crossTimes` : moment où une valeur franchit un seuil, calculé au pas de 1 ms.
- `M.icon` : jeu d'icônes Lucide dont l'épaisseur de trait est normalisée.
- `M.scene(cfg)` : enchaîne les états d'une forme unique qui se transforme sans coupe.

En mode aperçu, la page boucle en direct. Avec `?render`, elle s'affiche à la taille exacte de l'image.

**`engine/build.py`** : assemble un fragment de clip, le moteur et les polices (en base64) en un HTML autonome. La police ne peut donc pas être remplacée en silence par une autre au rendu.

**`engine/render.js`** (Playwright + ffmpeg) : rendu image par image avec flou de mouvement réel.
```js
// 4 subframes per frame across a 180° shutter, blended with ffmpeg tmix. Alpha clips -> ProRes 4444 .mov
const vf=`format=gbrap,tmix=frames=4:weights='1 1 1 1',select='eq(mod(n\\,4)\\,3)',...`
```
Il échoue (code 1) si ffmpeg meurt ou si la page lève une erreur.

**`engine/beats.js`** : planche d'images de contrôle aux instants demandés (`seek(t)`, puis capture, puis `ffmpeg tile`). Un clip transparent est posé sur fond noir pour pouvoir le juger.

**`scripts/inspect_video.py`** (ffprobe + numpy) :
- lit la résolution, les images par seconde et la durée ;
- fait une planche 4×4 de la vidéo source ;
- découpe la vidéo en sections `full` (le sujet remplit le cadre), `pip` (sujet en incrustation, une bande de colonnes presque noire) ou `black` (image entièrement noire, max ≤ 20) ;
- suit la boîte du sujet et prévient si elle bouge de plus de 2/96 de la largeur.

**`scripts/words.py`** : SRT ou VTT vers des horodatages estimés mot par mot. Le temps d'une réplique est réparti au prorata des caractères, précision d'environ 0,2 s. Si `faster-whisper` est installé, les vrais temps de mots sont préférés.

**`scripts/composite.py`** : aperçu final avec ffmpeg (`overlay=enable='between(t,in,out)'`, `tpad` qui fige la dernière image, son d'origine).

**`scripts/make_pages.py`** :
- `viewer.html` : passer d'un clip à l'autre ;
- `compare.html` : original et aperçu côte à côte, empilés ou en volet ;
- `TIMING.md` : la feuille de montage pour l'éditeur.

**`sound-effects/scripts/sound_pass.py`** (librosa, scipy, ffmpeg), le plus précieux :
1. **Grille de tempo vérifiée** :
   - `librosa.beat.beat_track` ;
   - passe-bas à 120 Hz, puis détection des grosses caisses (`find_peaks`, hauteur ≥ 50 % du max, distance de 0,6 temps) ;
   - écart médian des grosses caisses à la grille. S'il dépasse 30 ms, toute la grille est décalée (`if abs(med)>0.03: grid=beats+med`) ;
   - le contrôle est tracé dans `beatgrid.png` (4 premières mesures).
2. **Coupes calées sur le temps** : si l'animation ne peut pas bouger, le script cherche le décalage de départ de la musique (pas de 5 ms, sur 8 temps) qui minimise l'erreur coupe-temps des `scene_cut` et `reveal`. Il donne l'erreur en ms par coupe.
3. **Un son réel par repère** :
   - `category_map`, par exemple movement ou scene_cut → whoosh 2 images en avance à -4 dB ; appear, click ou hover → -6 dB ; typing bouclé à -8 dB avec fondu de 50 ms ; build_up → riser qui **se termine** sur le coup suivant, à -6 dB ;
   - graine aléatoire fixe (`--seed 7`) ;
   - échanges possibles via `--swaps swaps.json`.
4. **Mesure sur le MP4 exporté**, en boucle d'au plus 10 passes :
```python
cmd=['ffmpeg','-nostats','-i',p]+(['-ac','1'] if mono else [])+['-af','ebur128=peak=true','-f','null','-']
if abs(I+16)<=0.5 and P< -4: break      # cible -16 LUFS intégrés ±0,5, crête vraie < -4 dBFS
if P>=-4: lim=round((lim or 0.6)*0.9,3) # resserre l'alimiter
```
   Il fait aussi une mesure en mono. La musique est posée à -12 dB par défaut (`--music-db`), avec un fondu de sortie de 0,6 s.
5. **Preuves** : pour chaque repère, une image juste avant (-0,1 s), une juste après (+0,15 s) et la forme d'onde autour (-0,5 à +0,8 s), dans `checks/cue-XX.png`.
6. **5 instants à écouter au casque** : ce sont les plus risqués (erreur de temps × 10, puis typing, riser, reveal, scene_cut).
7. **Licences** : seules « CC0 » et « Mixkit Free License » comptent comme libres. Tout autre son est nommé « LICENCE UNKNOWN, check before publishing ». La musique sans `--music-license` est marquée « LICENCE NOT CONFIRMED ». L'usage prévu (`--use-case`) est confronté aux interdits connus, par exemple Mixkit musique hors TV, radio et jeux.
8. Il écrit `SOUND.md`, `CREDITS.txt` et `report.html` : lecteur, boutons d'écoute, alternatives par catégorie, « let model decide », bouton « Download swaps.json ».

**`sound-effects/sfx/manifest.json`** (68 Ko) avec 109 fichiers OGG (2,7 Mo) :
- `default_kit` de 6 sons CC0 choisis à l'oreille (whoosh, click, pop, riser, impact, tick) ;
- un son de frappe Mixkit **téléchargé à l'exécution**, jamais versionné ;
- `alt_categories` ;
- normalisation documentée : silence de tête retiré, 4 s max (risers 6 s), crête à -3 dBFS, ambiances 20 s à -35 LUFS ;
- `source_url` et attribution pour chaque fichier.

`LICENSES.md` : Freesound vérifié son par son (CC0, 12/10/2026) et packs Kenney (CC0). `MUSIC.md` : 13 morceaux Mixkit classés par ambiance, téléchargés à l'exécution.

**`object-separation`** (pas de script, du Python à coller) :
- SAM 2 en local, avec un balayage de la machine pour choisir le modèle : GPU ≥ 12 Go → large, 898 Mo ; GPU plus petit ou Apple Silicon → base-plus, 323 Mo ; CPU → tiny, 156 Mo, environ 5 s par image ;
- découpage par lots de 60 images, chaque lot repartant du dernier masque ;
- grille de coordonnées sur l'image de départ pour choisir les points de clic ;
- rendu de contrôle avec le sujet teinté en vert, et un masque PNG par image.

**`render.mjs` embarqué dans les 3 skills explainer** (à copier depuis le SKILL.md) :
- `--stills` : planche à taille lisible ;
- brouillon `30 1 4` (30 i/s, sans flou, 4 workers) ;
- final `60 4 8` ;
- polices vérifiées (`fonts did not load (fallback in use)`) ;
- son rendu par `OfflineAudioContext` puis normalisé avec `loudnorm=I=-16:TP=-1.5:LRA=11`.

### 1.2 Structure des skills
- Frontmatter minimal : `name` et `description`. La description fait 3 à 5 lignes : ce que la skill produit, des chiffres (« -16 LUFS », « true peaks below -4 dBFS »), puis « Use when… » avec des formulations d'utilisateur (« says their AI video sounds like cheap beeps »).
- Tailles : explainers 21 à 24 Ko (gros, `render.mjs` est collé dedans) ; motion-broll 9 Ko ; sound-effects 14 Ko ; object-separation 9 Ko.
- Organisation type de motion-broll :
  - `SKILL.md` : les étapes numérotées 1 à 8 ;
  - `reference/engine-api.md` : à lire avant d'écrire le premier clip ;
  - `engine/` ;
  - `scripts/` ;
  - `templates/` ;
  - `examples/opus-aoe2/` : 6 clips réels et un `plan.json`, « the quality bar ».
- Chaque skill a un `README.md` pour les humains, séparé du SKILL.md.

### 1.3 Boucle de travail
motion-broll :
1. installation ;
2. entretien en une seule série de questions (`AskUserQuestion`) : vidéo, transcript, densité (léger 2–4 clips par minute, moyen 4–7, dense) et look ;
3. inspection : `contact.png` regardé par l'agent ;
4. **tableau de plan validé avant tout code** ;
5. build ;
6. **planches aux mots clés**, regardées, corrigées, regardées « once more » ;
7. rendu ;
8. livraison, en précisant que l'aperçu sert à la relecture et que le montage final se fait dans l'éditeur.

Explainers :
1. brief en un seul message ;
2. script et feuille de temps d'abord, le total confronté au budget par durée ;
3. planche d'images, puis brouillon envoyé à l'utilisateur, puis final.

sound-effects : « Claude can't hear… never says "it sounds good" ». Il mesure, prouve, puis donne 5 instants à vérifier par un humain.

### 1.4 Règles chiffrées et interdits utiles
- B-roll :
  - une coupure plein cadre dure 3 à 10 s ;
  - jamais dans la première seconde de l'accroche, ni sur une phrase personnelle ou émotionnelle ;
  - au moins environ 2 s de visage entre deux coupures ;
  - un changement d'état par temps parlé, espacés de 0,4 à 1,2 s ;
  - les SRT dérivent : poser les changements importants sur le premier ou le dernier mot d'une réplique.
- **Ne jamais inventer** chiffres, citations, prix ou résultats ; lister ce qui est illustratif.
- Interdits motion-broll : rebond, particules, lueurs, dégradés sur l'interface, icônes de traits différents, temps mort, look de modèle tout fait. Ne jamais mettre `will-change` sur ce que la caméra agrandit (texte flou).
- Explainer par défaut :
  - un seul élément texte et un seul élément d'interface à l'écran ;
  - pas de coupe sèche ; mouvements de caméra de 0,6 à 1,2 s ou ressort `z` ≥ 0,95 ;
  - titre à 28 px, poussé par la caméra jusqu'à 75 % de la largeur ;
  - frappe à 25 caractères par seconde ; pause de 0,5 s après chaque résultat ; tenue de 2 s ;
  - budget de durée : 45 s → 2–3 fonctions ; 60 s → 3–4 ; 90 s → 4–5.
- High energy :
  - 120 à 140 BPM, 6 à 8 scènes de 1,5 à 3 s ;
  - typographie sur les 1/8 ou 1/16 de temps ;
  - coupe sèche seulement sur un temps fort, 2 fois au plus ;
  - pas plus de 3 couleurs par scène ; dépassement `z` ≈ 0,6–0,7 sur les impacts.
- Engaging :
  - le héros mesure 50 à 70 px à l'écran ;
  - ressort critique de la caméra `w` ≈ 6 ;
  - pondération vers l'ancre : 0,7 pendant une interaction, 0,15 en chute, 0,85 sur le résultat ;
  - vue d'ensemble à environ 0,3× avec inclinaison `rotateX` de 15 à 25° ;
  - boucle parfaite (`seek(duration)` = `seek(0)`).
- Son : voix > SFX > musique ; musique environ -12 dB sous les SFX, avec retrait de 8 à 12 dB sous la voix.
- Le contrat de page (`window.seek(t)` pur, aléa à graine, simulations précalculées au pas de 1/240 s, polices en base64, pas de gros `filter: blur` qui ralentit les captures) est le même principe qu'HyperFrames.

**Contradiction interne à signaler.** Les 3 explainers synthétisent la musique en Web Audio par défaut (« let you synthesise one. Default: synthesise »). `sound-effects/SKILL.md` dit au contraire « Never synthesize music or sound effects in code ». Pour Clapova, c'est la règle de sound-effects qu'il faut suivre.

### 1.5 Ce qu'on peut reprendre
- Le code et les textes sont sous MIT : copie et adaptation possibles en gardant la notice MIT de Bart.
- Les 109 sons de `sfx/` sont en CC0 : réutilisables et redistribuables. Crédit facultatif, mais à donner.
- Geist est en OFL : redistribuable en gardant `OFL-Geist.txt`.
- L'approche de la passe son vient de Vox (@Voxyz_ai) ; le dépôt demande de garder ce crédit.
- Interdit : versionner ou embarquer les fichiers Mixkit (son de frappe, musiques). Leur licence interdit de les redistribuer « in a tool or template ».

---

## 2. JakeB-5/motion-graphic-skill : la meilleure boucle d'autocontrôle

Dépôt : `skills/motion-graphic/` avec :
- `SKILL.md` (17,5 Ko) ;
- `assets/engine.html` (moteur de 700 lignes environ) ;
- 4 références : `story.md`, `styles.md`, `scene-patterns.md`, `critique.md` ;
- 3 scripts : `assemble.py`, `check.js`, `record.js` ;
- `agents/openai.yaml` pour Codex.

À la racine : plugin Claude (`.claude-plugin/`), CHANGELOG, README en anglais et en coréen. `samples/` contient 4 films, chacun en version Opus et Sonnet, avec `facts.md`, `storyboard.md`, `review_log.md` et `verification/round-N/`.

### 2.1 Outils
- **`scripts/assemble.py split|build`** : découpe le moteur en 8 parties éditables (`head.html`, `config.js`, `copy.js`, `style.js`, `geometry.js`, `scenes.js`, `plan.js`, `ready.js`), puis les réassemble avec une vérification de syntaxe. L'agent ne touche jamais au lecteur, à l'audio ni aux fonctions utilitaires.
- **Ressorts nommés** (`engine.html`) : `spring(t,k,d)` en forme fermée.

  | Préréglage | k, d | Dépassement et durée | Usage |
  |---|---|---|---|
  | `snappy` | 320, 28 | environ 2 %, 0,35 s | interface, éléments de liste |
  | `default` | 170, 26 | aucun, 0,5 s | cartes, barres, caméra |
  | `heavy` | 90, 19 | aucun, 0,7 s | gros texte, logos (« type never bounces ») |
  | `playful` | 220, 16 | environ 13 % | autocollants, mascottes |

  `track()` gère une valeur à plusieurs cibles.
- **`scripts/check.js`** (puppeteer-core) produit :
  - `sheet-<lang>.png` : 2 images par scène et la dernière ;
  - `sheet-<lang>-phone.png` : les mêmes réduites à 360 px de large ;
  - `strip-<lang>-00.png` : 12 images de 0 à 2,2 s, pour vérifier l'accroche ;
  - `strip-<lang>-<n>.png` : 12 images consécutives autour de chaque coupe (de -0,13 à +0,23 s) ;
  - des captures de la page sur 7 tailles d'écran ;
  - `report.json`.

  **Échecs bloquants** :
  - erreurs de page ;
  - texte qui sort du canevas 1920×1080 ;
  - **non-déterminisme** : les mêmes instants rendus en avant puis en arrière doivent donner un hachage FNV identique du PNG, sur un canevas calculé par le processeur, sur deux essais ;
  - **audio** : scène presque silencieuse (RMS < 0,02) ou écrêtage (crête ≥ 0,99) ;
  - éléments qui débordent sur l'un des 7 écrans ;
  - libellé coupé par des points de suspension ;
  - lecture tactile cassée.

  **Avertissements** : texte non mono de moins de 26 px, coréen composé dans la police mono.
  ```js
  const shot = t => { __motion.render(t); return h(cv.toDataURL('image/png')); };
  const fwd = ts.map(shot), back = ts.slice().reverse().map(shot).reverse();
  ```
- **`scripts/record.js`** :
  - rendu image par image en 1080p30, CRF 18 ;
  - son issu du rendu audio hors ligne du moteur (`?audiotest`), rééchantillonné à 48 kHz ;
  - écrit d'abord dans `<out>.part.mp4`, **vérifie avec ffprobe** que le fichier se lit et dure le bon temps (±0,5 s), puis seulement le renomme et affiche `verified:` ;
  - `--verify-only` revérifie un fichier existant.
- **Paramètres d'URL de contrôle** : `?t=12.3` fige une image, `?lang=xx` change de langue, `?audiotest` donne le RMS par scène (0,04 à 0,15 est typique).

### 2.2 Structure
SKILL.md en 6 étapes :
1. prise de brief ;
2. concept (une métaphore) ;
3. storyboard, qui est **le point de validation** ;
4. build ;
5. vérification ;
6. livraison.

S'y ajoutent une section « When the user asks for changes » et une table « Bundled files : quand lire quoi ». Les références sont chargées au besoin, une par étape. Frontmatter : `name` et `description`, avec des exclusions explicites (« Not for editing existing video files, After Effects, simple CSS effects, or slide decks »).

### 2.3 Boucle d'autocontrôle (`references/critique.md`)
- Le relecteur est **un agent séparé, au contexte neuf, nouveau à chaque tour**. On ne lui donne que `critique.md`, les sorties de check.js, `cue-check.md`, le brief et `facts.md`. Il ne reçoit ni le code, ni les notes du constructeur, ni les notes du tour précédent.
- **D'abord la table de défauts D1 à D11**, chacun noté PASS ou FAIL avec la preuve (fichier et instant). Une ligne sans preuve compte comme FAIL. Un FAIL plafonne les axes concernés à 6.

  | Défaut | Ce qui est vérifié |
  |---|---|
  | D1 | texte sur texte |
  | D2 | ligne illisible sur la planche téléphone |
  | D3 | rien de frappant à 2 s |
  | D4 | rien de nouveau pendant plus de 4 s |
  | D5 | image vide ou saccade à une coupe |
  | D6 | élément qui surgit tout formé, ou glissement à vitesse constante |
  | D7 | défaut interdit (titre centré sur dégradé, tout en fondu, lueur sur l'interface, particules) |
  | D8 | texte masqué |
  | D9 | texte flou (réduit par `fit` sous environ 60 %) |
  | D10 | chiffre différent de `facts.md`, ou écrit de deux façons |
  | D11 | son : scène muette, écrêtage, repère hors temps, plus de 2 `impact` |

- **Puis 7 axes notés de 1 à 10** : accroche à 2 s, lisibilité sur téléphone, qualité du mouvement, variété, composition, fidélité à la marque, synchro son. Une note de 8 ou plus doit citer le fichier et dire pourquoi aucun défaut ne s'applique ; sinon elle est limitée à 7.
- **`cue-check.md`** écrit par le constructeur : chaque repère son et son temps de mouvement, PASS ou FAIL, et le nombre d'`impact`.
- Livraison quand aucun FAIL, tous les axes à 8 ou plus, **au moins 2 tours** et check.js à 0 échec. **Arrêt après 3 tours**, avec une section `Unresolved:`.
- Anti-complaisance : une note qui monte sans correction consignée est ramenée à la note inférieure (`Builder adjustment: Motion 8 → 7 (no fix logged)`).
- `facts.md` : chaque chiffre à l'écran avec sa source (fichier et ligne, ou URL). Arrondi selon la notation publique de la source. Une barre et son libellé utilisent la même chaîne.
- `HANDOFF.md` : liste des choix « à ne pas changer », pour qu'une session suivante ne les défasse pas.

### 2.4 Règles chiffrées utiles
- L'accroche se lit à 2 s.
- Quelque chose de nouveau toutes les 2 à 4 s.
- Changements sur le temps, grands moments sur la barre de mesure (tous les 4 temps).
- À 140 BPM, un temps vaut environ 0,43 s : 8 temps ≈ 3,4 s, 12 ≈ 5,1 s, 16 ≈ 6,9 s.
- Structures types : 45–60 s → 10–12 scènes ; 30 s → environ 7 scènes, 74 temps ; 15 s → 4 scènes, 34 temps.
- Temps de lecture : mots × 0,3 s + 1 s (écritures latines) ; caractères × 0,08 s + 1 s (CJK). Titre d'un seul souffle, 6 à 8 mots.
- Zone sûre : 110 px à gauche et à droite, en dessous de 150 px en haut, au-dessus de 950 px en bas.
- Corps de texte ≥ 32 px et titres ≥ 80 px en 1920. Moins de 26 px est illisible sur un téléphone (1920 → 390 px, environ 1/5).
- Un chiffre fort s'accompagne d'une mesure compagnon honnête. Échelles communes, pas d'échelle logarithmique ni d'axe tronqué.
- Palette : 1 fond, 2 encres, 3 accents. Une police d'affichage et une police de texte. Un seul accent travaille dans une image donnée.
- `impact` au plus 2 fois par film.
- Interdits (`styles.md` §5) : titre centré sur dégradé, tout en fondu, cadres ou libellés de coin hors sujet technique, lueur sur l'interface, explosions de particules génériques.
- Choix du style d'après le sujet (table sujet → point de départ, `styles.md` §2), annoncé en une ligne (« Style: … because … »). Ne pas demander à l'utilisateur de choisir.

### 2.5 Licence
MIT : tout est reprenable, y compris le format de `critique.md` et `check.js`, en gardant la notice. Le son est synthétisé (Web Audio) : aucun fichier son à gérer, mais c'est contraire à la règle de Barty-Bart.

---

## 3. emilkowalski/skills : des règles d'animation d'interface, sans outillage

15 skills, une par dossier. **Aucun script** : seulement des fichiers Markdown compagnons (`STANDARDS.md`, `RECIPES.md`, `AUDIT.md`, `PLAN-TEMPLATE.md`, `CATALOG.md`, `PICKER.md`, `API.md`).

### 3.1 Structure (modèle à copier)
- Frontmatter `name` et `description`. Les skills `review-animations`, `prototype` et `pick-ui-library` ont `disable-model-invocation: true` : elles ne se lancent que sur demande explicite.
- Les descriptions renvoient vers les skills voisines (« For critiquing existing motion use review-animations; for auditing a whole codebase use improve-animations »).
- Même plan dans chaque skill : `Initial Response` (phrase d'accueil imposée), `Operating Posture`, `Hard Rules`, séquence numérotée, `Never Ship`, `Output`, `Tone`.
- `review-animations` impose une **sortie fixe** : un tableau `Before | After | Why`, puis un verdict par niveau d'impact, puis **Block** ou **Approve** explicite.
- `improve-animations` est en lecture seule et procède en 4 phases : reconnaissance, audit en parallèle, tri avec confirmation, plans. Elle écrit des plans autonomes (`PLAN-TEMPLATE.md` : Problem, Target, Repo conventions, Steps, Boundaries, Verification) que d'autres agents ou des modèles moins chers exécutent.

### 3.2 Règles chiffrées (`review-animations/STANDARDS.md`)
- Fréquence : action répétée plus de 100 fois par jour ou lancée au clavier → aucune animation.
- Courbes :
  - `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` ;
  - `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` ;
  - `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)` ;
  - **jamais `ease-in`** sur une interface.
- Durées :

  | Élément | Durée |
  |---|---|
  | appui de bouton | 100–160 ms |
  | info-bulle | 125–200 ms |
  | menu déroulant | 150–250 ms |
  | fenêtre, tiroir | 200–500 ms |

  Une interface reste sous 300 ms.
- Jamais `scale(0)` : partir de 0,9–0,97 avec opacité 0. Appui : `scale(0.97)` sur 160 ms.
- Ressort `{duration: 0.5, bounce: 0.2}`, rebond limité à 0,1–0,3.
- Décalage entre éléments d'un groupe : 30 à 80 ms.
- Flou de 2 px pour masquer un fondu enchaîné imparfait, toujours sous 20 px.
- Balayage rapide pour fermer : vitesse > environ 0,11 (px/ms).
- N'animer que `transform` et `opacity`.
- Ordre de correction : supprimer, réduire, corriger la courbe, l'origine, l'interruptibilité, le GPU, l'asymétrie, puis les finitions.

### 3.3 Pour la vidéo
Ces règles visent l'interface. Ce qui se transpose aux blocs motion de Clapova :
- les courbes nommées ;
- jamais `scale(0)` ;
- entrée et sortie asymétriques ;
- décalage de 30 à 80 ms ;
- flou de masquage ;
- le format de revue Before/After/Why avec verdict Block/Approve.

La règle des 300 ms, elle, ne s'applique pas à un titre vidéo : Lottie et Barty tiennent les titres 2 s.

### 3.4 Licence
MIT. Le texte peut être repris ou paraphrasé avec la notice. Le README demande de citer animations.dev comme source.

---

## 4. greensock/gsap-skills : la référence officielle pour notre moteur

8 skills : core, timeline, scrolltrigger, plugins, utils, react, frameworks, performance (4 à 22 Ko chacune). À côté :
- `skills/llms.txt` : un index avec une liste « Triggers: » par skill ;
- `AGENTS.md` et `.github/copilot-instructions.md` ;
- des manifestes de plugin Claude et Cursor ;
- `examples/` : vanilla, React, Vue, Nuxt.

**Aucun script de contrôle.**

### 4.1 Structure (le modèle le plus propre)
Règles de `AGENTS.md` :
- `name` en minuscules et tirets, 64 caractères au plus, identique au nom du dossier ;
- `description` à la troisième personne, 1024 caractères au plus, avec les mots déclencheurs ;
- `license: MIT` ;
- corps de moins de 500 lignes environ, le reste dans `references/` ou `scripts/`.

Plan de chaque skill : `When to Use This Skill` (avec les **skills liées**), l'API, `Official GSAP Best practices` (✅), puis `Do Not` (❌).

### 4.2 Points utiles pour HyperFrames
- Préférer une timeline aux enchaînements de `delay`.
- Paramètre de position (`"<"`, `">"`, `"-=0.2"`, étiquettes).
- `defaults: { duration: 0.5, ease: "power2.out" }` sur la timeline.
- Pilotage par `tl.time(2)` ou `tl.progress(0.5)` : c'est la base d'un rendu frame = f(t).
- `immediateRender: false` sur un second `from()` qui vise la même propriété.
- `autoAlpha` plutôt que `opacity`.
- `gsap.matchMedia()` pour `prefers-reduced-motion`.
- SplitText : découper **après** `document.fonts.ready`, `font-kerning: none` pour éviter que les lettres bougent, pas de `text-wrap: balance`.
- **Tous les plugins sont gratuits**, y compris en commercial, depuis le rachat par Webflow : SplitText, MorphSVG, DrawSVG, CustomEase…
- La technique de iart-ai `showcase-to-gif.mjs` (`gsap.globalTimeline.pause()` puis `.time(t)`) confirme qu'on peut piloter toute une page GSAP au temps près.

### 4.3 Licence
MIT pour les skills. GSAP lui-même relève de sa propre licence, qui n'est pas dans ce dépôt ; le dépôt affirme seulement que tous les plugins sont gratuits.

---

## 5. lottiefiles/motion-design-skill : des tables de principes, sans outillage

Organisation :
- `skills/motion-design/SKILL.md` : 315 lignes, frontmatter `name`, `description` (bloc `>`), `license: MIT`, `metadata: {author, version: "1.0.0"}` ;
- `director/` : 8 fichiers ;
- `patterns/` : 4 fichiers ;
- `reference/` : 4 fichiers, de 53 à 106 lignes chacun.

Le SKILL.md donne une table résumée par sujet, terminée par « > Deep dive: [fichier] », et un index des fichiers à la fin. **Aucun script.**

### 5.1 Règles chiffrées
- 4 personnalités : Playful 150–300 ms avec 10–20 % de dépassement ; Premium 350–600 ms, `(0.4,0,0.2,1)`, 0 % ; Corporate 200–400 ms ; Energetic 100–250 ms, 15–30 %.
- Durées par élément : micro-retour 80–120 ms ; fenêtre 300–400 ms ; page 400–600 ms ; révélation spectaculaire 600–1200 ms.
- La durée croît avec la distance : 200 px → ×1,3 ; 400 px → ×1,6.
- Une entrée dure 30 à 50 % de plus qu'une sortie.
- **Règle du 1/3** : jamais plus d'un tiers de l'écran parcouru sans image clé intermédiaire, jamais plus d'un tiers des éléments en mouvement à la fois.
- Décalage total d'un groupe < 500 ms.
- Moins de 20 éléments animés par écran.
- Éléments animés > 40 px, détails > 100 px.
- Les éléments suivent avec 50 à 150 ms de retard.
- Structure en 4 actes : anticipation 10–20 %, action 30–50 %, réaction 10–20 %, résolution 20–30 %.
- Tables par émotion et par matière : rigide ×1,2, élastique ×0,8 avec 15–25 %, gaz ×2.
- `reference/quality-checklist.md` : liste à cocher en 5 blocs (visuel, technique, émotion, performance, accessibilité) et niveaux CRITICAL, HIGH, MEDIUM.

### 5.2 À noter
La règle « Always three motion layers (primary + secondary + ambient) » et l'exemple de succès avec « Subtle particle burst » contredisent nos interdits (particules, mouvement de fond permanent). À reprendre avec un filtre.

### 5.3 Licence
MIT.

---

## 6. kylezantos/design-motion-principles : routeur et rapport d'audit

Organisation :
- `SKILL.md` : 122 lignes, c'est un routeur ;
- `workflows/create.md` et `workflows/audit.md` ;
- `references/` : 12 fichiers, dont `anti-checklist.md` (274 lignes), `motion-cookbook.md` (529), `report-template.html` (1006), `demo-shell.html`.

**Aucun script exécutable** : le rapport HTML est rédigé par l'agent à partir du gabarit.

### 6.1 Structure (le modèle de routeur)
- « STEP 0: Detect Mode » : table des signaux (« build », « animate » → Create ; « audit », « review » → Audit ; ambigu → question).
- Puis « read the matching workflow file and follow it exactly ».
- Une **table de l'index des références avec une colonne « Load When »**, qui dit quel fichier lire dans quel mode.
- Pondération des trois points de vue par type de projet (Emil, Jakub, Jhey : principal, secondaire, ponctuel).
- Barrière d'attente : confirmer le contexte avant de générer, sauf pour une petite demande bien définie.
- `creation-gotchas.md` : ce que Claude rate quand il écrit de l'animation, à vérifier avant de présenter.
- Liste « Success Criteria » à cocher.

### 6.2 Interdits utiles (`anti-checklist.md`, motifs de « bouillie IA »)
- indicateurs qui pulsent ;
- entrées floutées partout ;
- agrandissement au survol sur tout ;
- décalage systématique sur chaque liste ;
- ressorts qui rebondissent sur les actions utilitaires ;
- fondu identique sur chaque élément ;
- animation au montage d'un contenu statique ;
- appel à l'attention en boucle (« No pulsing dots, glowing status rings, breathing CTAs »).

### 6.3 Licence
MIT. Le README précise que les trois approches sont une interprétation, ni écrite ni validée par les designers.

---

## 7. iart-ai/motion-skills : un index, des packs, une boucle « livrer puis vérifier »

L'index sert de vitrine ; les 18 packs sont des dépôts séparés. Chaque pack contient :
- `.claude-plugin/` ;
- `scripts/` : les **3 mêmes scripts** que `tools/verify/` ;
- `showcase.html` ;
- `skills/<nom>/SKILL.md` + `references/` (et `templates/`, `scripts/` dans b-roll et lower-thirds) ;
- `README.md` de skill, souvent vides (0 octet).

### 7.1 Outils communs
- **`seek-shot.sh`** : `npx playwright screenshot "file://…?t=${t}"`, une image figée à chaque instant demandé (par défaut 0, 1,5 et 3 s).
- **`contact-sheet.sh`** : `ffmpeg … hstack=inputs=$#`, les images en bande (début, milieu, fin).
- **`probe-mp4.sh`** : « Renders lie; the file doesn't. » Vérifie la largeur et la hauteur exactes et les images par seconde (±0,5), signale un codec autre que h264.
  ```bash
  scripts/probe-mp4.sh out/short.mp4 1080x1920 30
  ```
- `tools/showcase-to-gif.mjs` : met en pause la timeline globale de GSAP, la positionne image par image, puis assemble un GIF avec palettegen.

### 7.2 Outils propres au pack b-roll (`talking-head-b-roll`), les plus riches
- **`transcribe.mjs`** : transcript avec un temps par mot. ElevenLabs Scribe v2 si une clé est fournie, sinon whisper.cpp en local. Lit la rotation des vidéos de téléphone. Coupe aux fins de phrase.
- **`render.mjs --check`** vérifie que :
  - chaque **cache** est opaque (≥ 98,5 % des pixels à alpha ≥ 250) ;
  - aucune incrustation n'entre dans la boîte `FACE` ;
  - chaque ancre de parole tombe entre deux mots ;
  - rien n'est dessiné hors d'une scène ;
  - aucun texte ne sort du cadre ni ne chevauche un autre texte ;
  - les scènes ne se chevauchent pas ;
  - le rendu sort avec du son si la source en a, et avec un canal alpha si demandé.

  Il avertit pour un texte à moins de 3 % du bord et pour les polices de repli.

  Autres sorties : `--sheet 1` (une image par seconde sur la vidéo), `--stills`, `--face` (dessine la boîte du visage), `film.mp4`, `b-roll.mov` en ProRes 4444, `b-roll.webm` en VP9 avec alpha.
- **`compare-timing.py`** : compare deux versions (sans avance et avec 6 images d'avance) et contrôle par hachage SHA-256 que le son n'a pas changé. Le SKILL.md précise que c'est un ancien test, qui ne valide pas les choix élément par élément.
- **`timing.test.mjs`** : test du minutage (non lu en détail).

### 7.3 Règles chiffrées (packs lus)
- **b-roll** : trois traitements (A orateur seul, B incrustation, C cache plein cadre).
  - Ouvrir et fermer sur A ; A dure 8 s au plus ; un C dure 3 à 8 s.
  - **Le visuel prend 6 images d'avance** sur le mot pour la structure (axes, cartes) ; un **fait se cale sur son mot** (`s.audioNow`) ; une **chute attend le mot** qui la révèle.
  - Surfaces **claires par défaut** (« Neon-on-black is the cliché default of every AI video »).
- **short-form-video** :
  - Accroche de 0 à 1 s, déjà écrite à l'écran dès la première image, jamais en fondu depuis le noir.
  - Rupture visuelle toutes les 2 à 4 s, **à intervalles irréguliers**.
  - Coup de zoom de 1 à 1,12, ressort `damping 12, stiffness 200`.
  - Boucle : dernière image identique à la première ; longueur idéale 7 à 15 s.
  - Zone sûre 9:16 : centre de 900×1400, avec en haut 120 px, en bas 320 px (370 px pour les pubs TikTok) et à droite 120 px laissés libres.
  - Les statistiques citées (« ~87% decide in 3 s », « 70%+ view-through ») **n'ont pas de source dans le dépôt** : à ne pas reprendre comme des faits.
- **caption-animation** : 1 à 4 mots à la fois ; `combineTokensWithinMilliseconds` de 200 à 500 ms (mot à mot) ou de 1000 à 1500 ms (groupes) ; bas laissé libre sur 280 px ou 15 %.
- **beat-sync-editing** :
  - `frames_per_beat = (60/BPM)*fps` ;
  - couper par phrase musicale (2, 4 ou 8 temps) ;
  - **arrondir le cumul**, pas chaque pas, sinon la dérive s'accumule ;
  - tenir compte du décalage du premier temps ;
  - livrable : un plan de coupes en numéros d'image absolus, avec les décalages J-cut et L-cut en images.
- **logo-animation** : une seule technique par logo (tracé, construction ou morphing) ; révélation de 0,8 à 2,5 s ; ne jamais déformer le logo ; respecter sa marge de protection ; **l'image d'arrivée tombe sur le pic du logo sonore** ; léger dépassement 1,04 → 1,00 sur 0,15 s.
- **countdown** : valeur affichée = `ceil(durée - N/fps)`.
- **color-motion** : interpoler en OKLCH ou Lab, jamais en sRGB brut.
- **kinetic-typography** : interlignage 1,1–1,2 pour un titre ; approche de -1 à -3 % ; `aria-label` sur le conteneur ; découpe par ligne (sobre) ou par lettre (vif, réservée aux textes courts).

### 7.4 Licence
MIT pour chaque pack. Les skills renvoient vers iart.ai (lien de suivi `utm_*` dans les README) ; c'est de la promotion, sans obligation.

---

## 8. owl-listener/designer-skills, skill `motion-system` : des tokens et un linter

La skill motion-system fait 50 lignes environ, sans fichier compagnon. Le dépôt compte 111 skills réparties dans 8 plugins, avec un dossier `commands/` par plugin (par exemple `design-systems/commands/tokenize.md`).

### 8.1 Contenu
- Tokens de durée : `instant` 50 ms, `fast` 100, `normal` 200, `moderate` 300, `slow` 400, `deliberate` 600. « 4 à 6 valeurs suffisent. »
- Tokens de courbe :
  - `ease-standard` `(0.2,0,0,1)` ;
  - `ease-decelerate` `(0,0,0.2,1)` ;
  - `ease-accelerate` `(0.3,0,1,0.3)` ;
  - `ease-spring` `(0.34,1.56,0.64,1)` ;
  - `ease-linear`, réservé aux boucles.
- Chorégraphie : décalage de 30 à 50 ms, total de 500 ms au plus, direction cohérente.
- Mouvement réduit géré au niveau `:root`.
- « Document what should NOT animate. »

### 8.2 Outillage du dépôt (le vrai intérêt)
- **`scripts/lint-frontmatter.py`** (PyYAML, comme les outils qui lisent les skills) :
  - frontmatter présent ;
  - `name` identique au dossier, en kebab-case ;
  - `description` non vide, **moins de 400 caractères** (`MAX_DESC = 400`), avec une **phrase « Use when … »** ;
  - un H1 et au moins un H2 ;
  - pas de référence vers une skill qui n'existe pas ;
  - pour les commandes, `argument-hint` entre crochets **et entre guillemets** (un `[x]` nu devient une liste YAML, ce qui a fait disparaître 4 skills dans Copilot CLI, issue #27).
- `scripts/check-runtimes.py` : vérifie que chaque fichier est chargé par chaque outil (Claude Code, Copilot CLI, VS Code).
- `generate-index.py`, `generate-readmes.py`, `check-marketplace.py`.
- `SKILL_TEMPLATE.md` : description en 3 parties (ce que la skill produit, « Use when … », puis « For <cas voisin>, use `<autre-skill>` ») et plan de 2 à 4 H2 qui donnent chacun un jugement applicable.

### 8.3 Licence
MIT : le linter et le gabarit sont reprenables.

---

## 9. Synthèse transversale

### 9.1 Les outils qui reviennent partout
| Outil | Barty | JakeB-5 | iart | Ce qu'il vérifie |
|---|---|---|---|---|
| Rendu déterministe `seek(t)` ou `?t=` | oui | oui (avec test avant/arrière) | oui | une image ne dépend que de t |
| Planche d'images aux instants clés | `beats.js` | `sheet`, `phone`, `strip` | `seek-shot` + `contact-sheet` | cadre, texte coupé, chevauchements |
| Bande autour des coupes | non | 12 images de -0,13 à +0,23 s | non | saut, flash de l'ancienne scène, apparition brutale |
| Vérification du fichier exporté | ffmpeg (code de sortie) | ffprobe, durée ±0,5 s | `probe-mp4` (résolution, i/s, codec) | le fichier livré est conforme |
| Mesure du son | `ebur128`, -16 LUFS, crête < -4 dBFS, test mono | RMS par scène, crête < 0,99 | non | niveau, écrêtage, scène muette |
| Grille de tempo | librosa, contrôle par grosses caisses sous 120 Hz | temps fixés par le BPM du moteur | formule `(60/BPM)*fps` | coupes sur le temps |
| Banque de sons CC0 | 109 OGG + manifeste | aucune (synthèse) | non | — |
| Temps par mot | `words.py`, faster-whisper | non | `transcribe.mjs` (whisper.cpp, Scribe) | synchro avec la parole |
| Visage et zones libres | `inspect_video.py` (incrustation, boîte du sujet) | non | `FACE` + `--check` | jamais de graphisme sur le visage |
| Relecture notée par un agent neuf | non | `critique.md` D1–D11 et 7 axes | non | qualité perçue, pas seulement « rien de cassé » |
| Lint des skills | non | non | non | owl-listener seulement |

### 9.2 Le modèle de structure de skill qui ressort
1. Frontmatter `name` (identique au dossier, kebab-case) et `description` en 3 parties : ce que la skill produit, avec un chiffre ; « Use when … » avec des formulations d'utilisateur ; « For X use `autre-skill` ». Moins de 400 caractères (owl) ou 1024 (GSAP), `license`.
2. SKILL.md de 100 à 300 lignes : étapes numérotées, **point de validation** (le plan) avant de construire, contrôle chiffré, livraison.
3. Une table « Fichiers fournis / quand les lire » (JakeB-5, kylezantos).
4. `references/` chargées étape par étape, `scripts/` exécutables au contrat d'entrée et de sortie documenté en tête de fichier, `examples/` qui servent de barre de qualité, `templates/`.
5. Des sections fixes : Interdits et Pièges (`Do Not`, `Never Ship`, `Gotchas`), Format de sortie, Rapport à l'utilisateur.

---

## 10. Pour Clapova : quoi adopter, où, et dans quelle skill

État actuel lu dans `plugins/clapova/skills` :
- 31 skills, presque toutes en un seul `SKILL.md` de 26 à 130 lignes. Seules `cadrage/` et `storyboard/` ont des fichiers compagnons.
- `monteur` décrit déjà la boucle `check_composition` → `render_preview_frames` (12 instants au plus) → `review_montage` (3 tours, 8/10 pour livrer, 9 pour arrêter).
- Le serveur **normalise le son à -14 LUFS et -1,5 dBTP** (`monteur/SKILL.md` l. 66). C'est différent de la cible de Barty (-16 LUFS, crête < -4 dBFS) : il faut trancher.

### 10.1 Tableau d'adoption

| # | Idée reprise (source) | Où | Future skill |
|---|---|---|---|
| 1 | Mesure `ebur128` sur le **fichier exporté**, boucle gain/limiteur, test mono, LUFS et crête dans le rapport (Barty `sound_pass.py`) | **Outil MCP serveur** (dans `export_video` ou un nouvel outil `measure_audio`) : renvoyer I, TP, LRA en stéréo et en mono | son-design, controle-qualite |
| 2 | Grille de tempo vérifiée par les grosses caisses sous 120 Hz, décalage si l'écart dépasse 30 ms, erreur coupe-temps en ms par coupe (Barty) ; arrondi du cumul, décalage du premier temps (iart beat-sync) | **Outil MCP serveur** `analyze_music_beats` (BPM, décalage, grille, image de contrôle), utilisé par `plan_shots` et `apply_edit_plan` | montage-rythme |
| 3 | Banque de 109 sons CC0 avec `manifest.json` (catégorie, durée, source, licence) et une catégorie par type de repère (Barty) | **Serveur** : intégrer les sons CC0 à la bibliothèque SFX de `place_sfx_from_events`, avec `category_map` (whoosh 2 images en avance à -4 dB, pop et click à -6 dB, riser qui finit sur le coup) | son-design |
| 4 | Rapport de licences : seules CC0 et licence connue sont « libres », le reste est signalé par son nom ; `CREDITS.txt` prêt à coller ; Mixkit jamais embarqué (Barty) | **Serveur** (métadonnées de licence par son et par musique) + règle dans la skill | son-design, finition |
| 5 | « 5 instants à écouter au casque », les plus risqués (Barty) | **Serveur** (`review_montage` les renvoie) + règle de livraison | son-design, controle-qualite |
| 6 | Test de déterminisme avant/arrière par hachage (JakeB-5 `check.js`) | **Serveur** : test interne de `create_motion_scene` et `edit_motion_scene` (HyperFrames) | controle-qualite (côté moteur) |
| 7 | Bandes de 12 images autour de **chaque coupe** et bande de 0 à 2,2 s pour l'accroche (JakeB-5) | **Outil MCP serveur** : option `strip` dans `render_preview_frames`, par exemple `{times, mode:'cuts'}` | controle-qualite, montage-transitions, montage-accroche |
| 8 | Planche réduite à 360 px pour la lisibilité sur téléphone (JakeB-5), alerte sous 26 px sur une base de 1920 | **Serveur** : variante `phone` de la planche + alerte de taille de texte dans `check_composition` | controle-qualite, motion-titres |
| 9 | Table de défauts D1–D11 avec preuve, plafond à 6 en cas de FAIL, 7 axes, 8 ou plus seulement avec preuve, relecteur neuf à chaque tour, au moins 2 tours et 3 au plus, `Unresolved:`, une note qui monte sans correction est ramenée (JakeB-5 `critique.md`) | **Skill** (`references/critique.md` adapté) + **serveur** : `review_montage` renvoie la table D1–Dn | controle-qualite |
| 10 | `cue-check.md` : chaque bruitage sur le temps de son mouvement, `impact` 2 fois au plus (JakeB-5) | **Serveur** (`place_sfx_from_events` renvoie l'écart en ms) + règle | son-design |
| 11 | `facts.md` : chaque chiffre à l'écran avec sa source, une seule écriture par chiffre, mesure compagnon (JakeB-5, Barty « never invent ») | **Skill** + `facts` stocké dans le storyboard côté serveur | motion-compteurs-data |
| 12 | `HANDOFF.md`, la liste des choix « à ne pas changer » (JakeB-5) | **Serveur** (champ `lockedDecisions` du projet) + règle | montage, finition |
| 13 | Traitements A/B/C, avance de 6 images pour la structure et calage sur le mot pour les faits, A de 8 s au plus, C de 3 à 8 s (iart b-roll) ; coupure plein cadre de 3 à 10 s, pas dans la première seconde, 2 s de visage entre deux coupures (Barty) | **Skill** + contrôles serveur (`check_composition` : incrustation dans `FACE`, cache non opaque, ancre au milieu d'un mot) | montage-derush, montage (b-roll) |
| 14 | Détection des zones libres et de l'incrustation, suivi de la boîte du sujet (Barty `inspect_video.py`) | **Serveur** (`analyze_rushes` ou `frame_subject` renvoie les sections et `subject_box`) | montage-camera-virtuelle, motion-titres |
| 15 | Ressorts nommés en forme fermée (`snappy` 320/28, `default` 170/26, `heavy` 90/19, `playful` 220/16) ; `M.vis` pour échanger un texte sans chevauchement ; courbes nommées d'Emil et d'owl | **Serveur** (presets dans `get_motion_toolkit`) + **skill** de tokens | motion-tokens |
| 16 | Tokens : 4 à 6 durées, 5 courbes, décalage de 30 à 80 ms et total de 500 ms au plus, jamais `scale(0)` (0,9–0,97), entrée 30 à 50 % plus longue que la sortie, règle du 1/3 (owl, Emil, Lottie) | **Skill** (`motion-tokens/references/tokens.json`) | motion-tokens |
| 17 | Logo : une seule technique, 0,8 à 2,5 s, l'image d'arrivée sur le pic du logo sonore, 1,04 → 1,00 sur 0,15 s (iart logo-animation) | **Skill** + contrôle serveur (écart entre l'arrivée et le pic audio) | motion-logo-cta |
| 18 | Zone sûre 9:16 (centre de 900×1400, haut 120, bas 320 et 370 pour une pub, droite 120) ; zone sûre de JakeB-5 en 16:9 (110 px sur les côtés, 150 px en haut, 950 px en bas) | **Serveur** (`check_composition` par plateforme) + skill | finition, controle-qualite |
| 19 | Accroche lisible à 2 s (texte présent dès la première image, pas de fondu depuis le noir) ; quelque chose de nouveau toutes les 2 à 4 s, à intervalles irréguliers ; boucle dernière image = première | **Skill** + contrôles serveur (D3, D4) | montage-accroche, montage-rythme |
| 20 | Temps de lecture : mots × 0,3 s + 1 s (JakeB-5) ; titre de 6 à 8 mots ; corps de texte ≥ 32 px et titres ≥ 80 px en 1920 | **Serveur** (`check_composition` : durée d'affichage < temps de lecture) + skill | motion-titres |
| 21 | Interdits de « bouillie IA » : titre centré sur dégradé, tout en fondu, lueur sur l'interface, particules, impulsions en boucle, néon sur noir par défaut (JakeB-5, kylezantos, iart) | **Skill** (une liste commune à toute la famille) | motion-tokens (référence partagée) |
| 22 | Interpolation des couleurs en OKLCH, jamais en sRGB (iart color-motion) | **Serveur** (moteur HyperFrames) | etalonnage, motion-tokens |
| 23 | Rendu final vérifié par ffprobe avant d'annoncer `verified:` (JakeB-5), contrat résolution, i/s et codec (iart `probe-mp4.sh`) | **Serveur** (`get_render_status` renvoie la vérification) | finition |
| 24 | Plan validé **avant** de construire (tableau des clips : temps, phrase, ce qui se passe, traitement, pourquoi) (Barty, JakeB-5) | **Skill** | montage, storyboard (existe déjà) |
| 25 | Format de revue `Before | After | Why`, puis verdict Block ou Approve, puis ordre des corrections (supprimer, réduire, courbe…) (Emil) | **Skill** | controle-qualite |
| 26 | `lint-frontmatter.py` (description < 400 caractères, « Use when », nom = dossier, H1/H2, références existantes, YAML parsé) | **Script du dépôt de skills** (CI de `clapova-skills-video-ai-creator`), pas dans une skill | (outillage de la famille) |
| 27 | Détourage SAM 2 avec points positifs et négatifs, contrôle teinté en vert, masques par image, lots de 60 images (Barty) | Côté serveur, `cutout_subject` existe déjà : reprendre le **contrôle visuel en vert** et la règle des points à exclure | montage-camera-virtuelle (texte derrière le sujet) |
| 28 | Pages de comparaison `compare.html` avant/après synchronisées (Barty) | **Serveur** (lien d'aperçu avant/après) | controle-qualite, finition |

### 10.2 Script embarqué dans une skill, ou outil serveur ?
- Les agents de Clapova passent par le MCP, souvent sans shell. Tout ce qui **mesure** (LUFS, tempo, opacité des caches, déterminisme, ffprobe) doit donc vivre **côté serveur** et revenir dans la réponse des outils, comme `check_composition` aujourd'hui.
- Un script embarqué n'a de sens que pour ce qui reste local :
  - le linter des skills (CI du dépôt) ;
  - les générateurs de planches déjà présents (`storyboard/planche/build.mjs`, `cadrage/styles/build.mjs`).

### 10.3 Correspondance avec la famille proposée
- **montage** : routeur (comme le STEP 0 de kylezantos), plan validé avant de construire, traitements A/B/C, `lockedDecisions`. Reprend `monteur`.
- **montage-derush** : temps par mot, coupe entre deux mots, sections d'incrustation et zones libres (Barty `inspect_video`, iart `transcribe`).
- **montage-rythme** : grille de tempo vérifiée, `frames_per_beat`, cumul arrondi, phrases de 2, 4 ou 8 temps, changement toutes les 2 à 4 s à intervalles irréguliers.
- **montage-accroche** : lisible à 2 s, pas de fondu depuis le noir, bande d'images de 0 à 2,2 s, une seule boucle ouverte.
- **montage-transitions** : bandes de 12 images par coupe, transitions faites par un objet (Barty high-energy), coupe sèche sur le temps fort, flou de masquage sous 20 px.
- **montage-camera-virtuelle** : ressort critique `w` ≈ 6, avance sur la vitesse de 0,15 s, pondération vers l'ancre, coup de zoom 1 → 1,12, `subject_box`.
- **motion-titres** : temps de lecture, tailles minimales, `fit` jamais sous 60 %, découpe après le chargement des polices, échange de texte sans chevauchement.
- **motion-compteurs-data** : `facts.md`, une seule écriture par chiffre, mesure compagnon, échelle commune, `ceil` pour un compte à rebours.
- **motion-logo-cta** : une technique, 0,8 à 2,5 s, arrivée sur le pic sonore, marge de protection, CTA seulement si l'utilisateur ou le site en fournit un.
- **motion-tokens** : durées, courbes, ressorts nommés, décalages, interdits communs, OKLCH.
- **son-design** : banque CC0 et manifeste, une catégorie par type de repère, priorité voix > SFX > musique, retrait de 8 à 12 dB, mesure sur l'export, 5 instants au casque, licences et `CREDITS.txt`.
- **etalonnage** : OKLCH, ordre d'étalonnage (iart `color-motion`, référence `color-management.md` non lue en détail), LUT existantes.
- **controle-qualite** : table D1–Dn, 7 axes, preuve exigée pour 8 ou plus, relecteur neuf, 2 à 3 tours, `Unresolved:`, format Before/After/Why.
- **finition** : zones sûres par plateforme, ffprobe et contrat de format, normalisation son, crédits, lien de livraison.

### 10.4 Les skills qui MANQUENT à la liste
1. **montage-broll** (b-roll sur un face caméra, avec les traitements A orateur / B incrustation / C cache) : c'est le cœur de Barty `motion-broll` et d'iart `talking-head-b-roll`. Ni montage-derush ni motion-titres ne le couvrent.
2. **motion-sous-titres** ou rattachement explicite de `sous-titres-styles` à la famille : 1 à 4 mots, mot actif, zone sûre basse de 280 à 320 px, chaque mot qui apparaît compte comme une rupture visuelle (iart caption-animation).
3. **motion-scene-ui** (interface et produit reconstruits et filmés de près : curseur, frappe à 25 caractères par seconde, une forme qui se transforme sans coupe) : explainer-default et motion-broll de Barty ; `create_motion_scene` existe côté serveur mais aucune skill de la famille ne le couvre.
4. **montage-boucle / formats courts** (boucle parfaite, dernière image = première, 7 à 15 s) : seulement en partie dans montage-accroche.
5. **detourage-sujet** (SAM 2, points positifs et négatifs, masques, texte derrière le sujet) : peut aller dans montage-camera-virtuelle, mais c'est un savoir-faire à part (Barty object-separation).
6. **motion-direction-artistique** (une métaphore tirée du monde du public, style déduit du sujet et annoncé en une ligne, table sujet → style) : JakeB-5 `styles.md` et iart `motion-art-direction`. Pas couvert par motion-tokens, qui fixe des valeurs et non une direction.
7. **lint-skills** (outil du dépôt plutôt que skill) : linter de frontmatter et vérification de chargement par chaque outil, pour garder la famille cohérente (owl-listener).
8. Facultatif : **motion-habillage-live** (bandeaux nominatifs, logos d'angle, exports transparents WebM et ProRes 4444 pour OBS, Premiere, Resolve), si Clapova vise les éditeurs externes (iart lower-thirds, Barty panels `.mov`).

### 10.5 Points à trancher
- **Cible son** : -14 LUFS / -1,5 dBTP (le serveur aujourd'hui) contre -16 LUFS / crête < -4 dBFS (Barty, avec la raison : « so nothing clips after AAC compression or on a phone speaker »). Les explainers de Barty utilisent eux-mêmes `loudnorm=I=-16:TP=-1.5`.
- **Son de synthèse** : à interdire, comme Barty sound-effects. JakeB-5 et les explainers de Barty synthétisent la musique.
- **Règles d'interface ou de vidéo** : la règle des 300 ms (Emil) et les « trois couches dont l'ambiance » (Lottie) ne doivent pas être appliquées telles quelles aux titres vidéo.

---

## 11. Compléments (deuxième passe)

Cette passe corrige la limite de lecture du début du rapport : les 11 packs iart restants sont clonés dans `deep/iart-packs/` et lus, les skills Emil qui touchent à la vidéo ou à la typographie aussi, et le moteur JakeB-5 en entier. Les fichiers binaires utiles ont été mesurés avec ffprobe et ffmpeg `ebur128`, c'est-à-dire décodés, pas écoutés à l'oreille. Mesures brutes : `scratchpad/sfx-audit.tsv`.

**Correction** : la banque de Barty contient **109 fichiers OGG** (et non 136 comme écrit dans la première version, erreur de comptage) ; le manifeste a 110 entrées `"file"`. Elle se répartit en 53 sons Kenney, 50 Freesound et 6 sons du kit.

### 11.1 Mesure des sons CC0 de Barty

| Catégorie | Nb | Durée | Mono | Sonie intégrée | Crête vraie |
|---|---|---|---|---|---|
| ambience | 3 | 17,3–20 s | 3 | -38,3 à -34,8 LUFS (conforme aux -35 LUFS annoncés) | -19,8 à -10,5 dBFS |
| click | 8 | 0,01–0,21 s | 8 | non mesurable (moins de 0,4 s) | -1,0 à +0,5 |
| ding | 9 | 0,06–3,54 s | 7 | -26,6 à -12,3 (3 mesurables) | -3,9 à +0,3 |
| glitch | 7 | 0,03–4 s | 5 | -29,4 à -6,4 | -3,1 à 0,0 |
| impact | 11 | 0,26–4 s | 7 | -20,3 à -13,5 | -3,6 à +0,2 |
| pop | 15 | 0,08–3,79 s | 12 | -18,0 (1 mesurable) | -3,2 à **+10,7** |
| riser | 12 | 0,18–6 s | 3 | -22,6 à -11,1 | -3,4 à +0,3 |
| tick | 3 | 0,02–0,08 s | 2 | non mesurable | -3,0 à -0,2 |
| transition | 12 | 0,25–3,67 s | 8 | -23,8 à -13,2 | -3,1 à +1,1 |
| typing | 5 | 1–4 s | 2 | -27,7 à -9,3 | -3,4 à -0,8 |
| ui-blip | 11 | 0,05–0,57 s | 7 | -10,8 à -8,6 | -4,3 à +0,3 |
| whoosh | 7 | 0,17–4 s | 3 | -24,0 à -14,0 | -3,2 à +0,1 |
| kit (6) | 6 | 0,02–2,01 s | 4 | riser -17,1, whoosh -17,5 ; les autres sont trop courts | click -2,9, impact 0,0, pop +0,2, tick +0,4, riser -0,6, whoosh -3,1 |

Ce que montrent les mesures :
- Le manifeste annonce des crêtes normalisées à -3 dBFS. En **crête vraie**, mesurée après décodage OGG, **66 fichiers sur 109 dépassent -1 dBFS**. La valeur de -3 dBFS est donc une crête d'échantillon, mesurée avant l'encodage en Vorbis.
- Deux cas sont aberrants : `pop/kenney-interface-maximize-002.ogg` à **+10,7 dBTP** et `transition/kenney-interface-scroll-001.ogg` à +1,1. À écarter ou à renormaliser avant de les embarquer.
- La sonie intégrée EBU R128 n'est pas mesurable sous 0,4 s (fenêtre de mesure). Pour les clics et les ticks, il faut classer par crête et par RMS, pas par LUFS.
- **Pour Clapova** : en important cette banque, ré-encoder chaque fichier avec une crête vraie de -3 dBTP au plus (`loudnorm`, ou limiteur puis vérification `ebur128=peak=true`), et stocker dans le manifeste la crête, la sonie quand elle est mesurable, et le mono ou stéréo.

### 11.2 Polices et licences
- **Embarquées** : seulement chez Barty. `Geist-Variable.woff2` et `GeistMono-Medium.woff2`, © 2023 Vercel avec basement.studio, **SIL OFL 1.1** (`OFL-Geist.txt` présent). On peut les redistribuer en gardant le fichier de licence ; il est interdit de les vendre seules.
- **Chargées depuis Google Fonts** sans être embarquées :
  - JakeB-5 : Big Shoulders Display 700/900, JetBrains Mono 400/700, Noto Sans KR 500/700/900 ;
  - iart (exemples) : Inter (5 fois), Space Grotesk, Orbitron, Newsreader, Lora, Jost, Fraunces, Chakra Petch.

  Toutes ces familles sont publiées par Google Fonts sous OFL. C'est une connaissance générale : leurs fichiers de licence ne sont pas dans les dépôts. Pour Clapova, il faut les embarquer (comme Barty) pour un rendu déterministe, avec chaque `OFL.txt`.
- Aucun autre dépôt ne contient de police.

### 11.3 Moteur JakeB-5 (`assets/engine.html`, 697 lignes) en entier
- **CFG** :
  - `bpm` : 140 par défaut, et tous les temps sont écrits en temps musicaux `B = 60/BPM` ;
  - `colors` : bg, panel, line, ink, dim, grid, acc, accHi, alt, bad ;
  - `fonts` : sans, display, mono ;
  - `textSplit` : décalage RGB de `slam` ;
  - `hudTitle` et `hudMeta(t)` ;
  - `cta`, `endCta` (zone en pixels du canevas qui devient le lien) et `endCtaBeat` ;
  - `posterT` ;
  - `watchKey` : le CTA de fin ne s'active qu'après un visionnage complet, mémorisé dans `localStorage` ;
  - `music` : `groove`, `liteScenes`, `arpScenes`, `tailBeats`, et en option `roots` et `chords`.
- **Fonctions** :
  - courbes `eO` (cubique sortante), `eIO` et `eBack` (c = 1,9) ;
  - `hash(i)` en sinus et `rng(seed)` mulberry32 ;
  - `beatPulse` : impulsion qui décroît sur chaque temps ;
  - `T(s,x,y,{fit})` : réduit une ligne trop longue à sa boîte ;
  - `typeOn` : texte qui s'écrit lettre par lettre ;
  - **`slam`** : échelle 1,32 → 1 en `eBack` sur 0,2 s, avec décalage RGB de 16 px qui disparaît en 0,16 s ;
  - **`rise`** : fondu et montée de 28 px sur 0,5 s ;
  - `kicker` : texte mono qui s'écrit en 0,32 s ;
  - `swapAlpha` : entrée 0,08 s après `tIn` sur 0,12 s, sortie sur les 0,1 s avant `tOut` ;
  - `polyPartial` : tracé progressif ;
  - `glow` : dégradé radial en mode `lighter`.
- **Transitions par défaut** (0,28 s) :
  - scènes impaires : dissolution en grille de tuiles 16×9, délai aléatoire par tuile jusqu'à 0,15 s ;
  - scènes paires : balayage lumineux vertical en `eIO` sur 0,26 s.

  Un `whoosh` automatique part 0,12 s avant chaque coupe.
- **Ordre de rendu** : `render(t)` dessine dans l'ordre drawBg, la scène (avec `try/catch` : une scène en erreur reste vide sans casser le reste), overlay, transition, hud, puis la barre de progression.
- **Son, entièrement en Web Audio** :
  - fonctions de base : `osc`, `nz` (bruit filtré à partir d'un tampon généré avec une graine fixe, `rng(11)`), `swell`, et `duck` (la musique tombe à 0,28 puis remonte à 1 en 0,17 s sur chaque grosse caisse) ;
  - environ 25 sons dans `SYN` : kick, clap, hat, bass, arp, pad, blip, tick, hit, slam, impact, glitch, stamp, scan, riser, whoosh, down, error, correct, power, laser, roll, chord, bell ;
  - 4 grooves joués à la double croche : electro, soft, pulse, none ;
  - grille d'accords sur 4 mesures, Am–F–C–G par défaut.
- **Chaîne de sortie** (`masterChain`) : gain 0,5, saturation douce `tanh(1,6x)`, compresseur (seuil -14 dB, ratio 4, attaque 4 ms, relâchement 120 ms). **Le moteur ne mesure pas de LUFS.** `?audiotest` rend le son hors ligne à 22 050 Hz, donne la crête et le RMS par scène, échantillonné un point sur 5.
- **Lecteur** :
  - glisser sur la barre pour se déplacer, plein écran ;
  - interface tactile repérée par `(pointer:coarse)` ;
  - `?t=` ou `#t12.3` pour figer une image ;
  - langue par `?lang=` ;
  - couleur de la page choisie selon la luminance du fond (`lum`) ;
  - `fontsReady()` charge 6 graisses sur exactement les caractères affichés (`ALL` = les textes + `0123456789.,×/−%←→↺`), avec un délai maximal de 4,5 s, puis pose `data-ready=1` ;
  - `window.__motion = {render, DUR, SC, B, W, H, LANG, LANGS, groove}` est le point d'entrée des contrôles automatiques.
- **À reprendre pour HyperFrames** :
  - écrire tous les temps en temps musicaux, à partir d'un BPM unique ;
  - un point d'entrée `__motion` unique pour les contrôles ;
  - le `try/catch` par scène ;
  - le chargement des polices limité aux caractères affichés, avec un délai maximal ;
  - le `duck` sur chaque grosse caisse, à appliquer côté mixage serveur ;
  - le CTA de fin activé seulement après visionnage complet, pour une sortie web interactive.
- Le son synthétisé reste à proscrire pour nos montages (voir 10.5).

### 11.4 Les 11 packs iart restants
Tous sous MIT, chacun avec les 3 scripts de vérification communs. Il y a 2 nouveaux scripts propres à un pack, en plus de b-roll et lower-thirds.

**javascript-animation-skills**, le plus outillé :
- `scripts/render.mjs` : `draw(frame)`, `FRAMES`, `FPS`, `CUES` (temps des coupes, écrits dans `<out>.cues.json`) et `SCORE`. Le son est rendu hors ligne en `.wav`, puis intégré au MP4.
- **`scripts/layout-check.mjs`** : la page déclare ses boîtes par image (`claim(id,'text'|'keep',x,y,w,h)`). Le script échoue si deux textes se chevauchent, ou si un texte chevauche **en partie** un objet clé. Un texte entièrement à l'intérieur de l'objet est accepté. Options `--every 0.1 --min 4`.
- **`scripts/asset-audit.mjs`** : prouve qu'une page ne charge rien. Il scanne le HTML puis enregistre toutes les requêtes réseau. Code 1 si quelque chose est chargé.
- **`soundtrack/scripts/sync-check.mjs`** :
  - repère les coupes dans le MP4 (images 64×64 en gris, creux proches de l'image la plus vide) ou prend les `CUES` déclarés ;
  - calcule les attaques audio sur une énergie à 10 ms, une seule par groupe de 120 ms ;
  - échoue en **OFF-BEAT** si l'écart dépasse ±100 ms (environ 3 images) ;
  - échoue en **STARTLE** si le son saute de plus de +6 dB par rapport à la seconde d'avant ;
  - ignore la première seconde et le fondu final.
- Règles mesurées par l'auteur : un accent fort sur une coupe donne +7 à +10 dB, perçu comme un sursaut ; un changement d'accord donne +3 à +5 dB et passe pour un montage propre. Faire entrer kick et basse ensemble donne +11 dB ; les décaler d'une mesure donne +3,5 dB.
- `references/qc.md` : liste de contrôle avant livraison :
  - aucune image vide hors creux voulus ;
  - chaque scène se lit en une seconde ;
  - « endings hold » ;
  - un trait dessiné à la main « bout » à environ 7,5 changements par seconde (toutes les 4 images) ;
  - chaque action visible a son son ;
  - cadrages variés, avec au moins un rapproché ou un recul ;
  - « It doesn't look or sound like your previous piece ».
- `soundtrack` synthétise la musique, comme JakeB-5.

**freelance-motion-skills** :
- `video-delivery-specs/references/qc-checklist.md` :
  - première et dernière image propres, sans flash noir ;
  - aucune image perdue ou doublée ;
  - son en 48 kHz ; en diffusion TV, R128 -23 LUFS ou A85 -24 LKFS ;
  - orthographe vérifiée sur les noms, prix et URL ;
  - mentions légales tenues assez longtemps pour être lues ;
  - **contrôle du décalage de gamma** hors du logiciel de montage ;
  - convention de nommage `[client]_[projet]_[livrable]_[ratio]_[durée]_v[NN]_[AAAAMMJJ].ext`, avec CAPTIONED, TEXTLESS ou BROADCAST si besoin ;
  - dossier de livraison : `01_Final_Exports` … `04_Stills` et un `README.txt` qui liste polices et licences.
- `platform-specs.md` : 9:16 en 1080×1920, H.264 à 8–12 Mbps ; flux Instagram en 4:5 (1080×1350) ; Story : 250 px réservés en haut et en bas.
- `client-revisions/feedback-translator.md` : transforme un retour vague en question à laquelle on peut répondre. Par exemple « Make it pop » → « saturation, coupes plus rapides, plus gros ou son plus fort ? Montre-moi une seconde qui claque déjà ». Il demande toujours un horodatage.
- `brand-motion-guidelines` : tokens de durée 100, 150, 250, 400 et 600 ms.
- `creative-brief` : livrables comptés (1 × 30 s, 3 × 6 s, une image de fin), et la question « qu'est-ce que ça ne doit PAS évoquer ? ».
- `motion-pricing` : hors sujet pour la vidéo, lu en surface.

**explainer-video-skills** :
- explainer : voix off à environ **2,3 mots par seconde (140 mots/min)**, 2,0 pour un contenu technique ; durée d'une scène = mots ÷ 2,3 + 0,4 s ; 60 s ≈ 138 mots ; structure problème → solution → comment → bénéfice.
- whiteboard : la durée du tracé suit la phrase dite ; pause de 0,4 à 1 s quand l'élément est fini.
- diagram : ordre nœuds → liens → libellés ; chaque étape tenue 0,5 à 1,5 s ; ce qui n'est pas actif passe à `opacity .35`.
- isometric : décalage de 0,12 à 0,15 s en `back.out`.
- wrapped (récapitulatif façon « Wrapped ») : 5 à 7 scènes de 2,5 à 4 s ; texte dans les 80 % centraux de la hauteur, avec 12 % libres en haut et 18 % en bas ; chaque scène se lit en moins de 2 s et tient en capture d'écran ; l'image finale est conçue pour être partagée.

**ecommerce-video-skills** :
- promo (6 à 15 s) : accroche 0–1,5 s, remise 1,5–4 s, prix barré puis nouveau prix 4–7 s, CTA à la fin.
- product-demo :

  | Étape | Durée |
  |---|---|
  | écran posé avant tout mouvement | 0,5–1 s |
  | trajet du curseur, en ease-in-out | 0,4–0,8 s |
  | clic | 0,2–0,3 s |
  | zoom ×2 | 1–2 s, puis tenu 2–4 s |

- photo-slideshow : **une seule transition** (fondu de 0,4 à 0,6 s) ; carte d'intro de 1,5 à 2 s ; carte de fin de 2 à 3 s ; légendes 0,3 s après que la photo est en place.

**youtube-video-skills** :
- intro de 3 à 5 s, logo de 1 à 2 s ;
- outro d'au moins 20 s, posée et calme, pour les écrans de fin YouTube, sur une vidéo d'au moins 25 s ;
- audiogramme : extrait de 90 s au plus ; en 9:16, sous-titres au-dessus des 18 % du bas.

**text-message-video-skills** : bulles conformes à la vraie application :
- envoyé à droite en bleu ou vert, reçu à gauche en gris, coins de 18 à 22 px ;
- police 34 px pour une largeur de 1080 ;
- « Read » 300 ms après la bulle ;
- réaction 400 ms après la bulle, ancrée sur cette bulle.

**map-animation-skills** : le style « Vox » anime les graphismes à **12 i/s dans un montage à 24 i/s** (une valeur tenue 2 images ; `posterizeTime(12)`).

**manim-skills** : `run_time` à 1 s par défaut ; pas de règle nouvelle utile pour Clapova.

**generative-illustration-skills** :
- règle principale : ne jamais animer une seule grande illustration générée par IA ; générer **beaucoup de petits éléments indépendants** que le code anime chacun d'un bloc. Sinon on obtient soit un diaporama, soit un tremblement « uncanny ».
- le rendu se fait par un harnais déterministe `seek` ;
- la musique passe par une clé OpenRouter (Lyria).

**web-animation-skills** (9 skills) :
- chaque skill a un « Output contract » et un harnais de capture déterministe (`?t=N` ou `?state=open`) ;
- `accessible-animation` : 3 niveaux. À supprimer : parallaxe, grands déplacements, zoom, rotation 3D. À adoucir : un fondu de 200 ms au plus. À garder : fondus et indicateurs. Renvoie au critère WCAG 2.3.3 ;
- `svg-animation` : MorphSVG gratuit ;
- `glassmorphism` : fond transparent à 0,08–0,18 ;
- `60fps-animation` : propriétés traitées sans recalcul de mise en page.

**webgl-animation-skills** :
- particules : **graine fixe obligatoire** (mulberry32) ; rafale ou flux continu ;
- shaders : `smoothstep` et `mix`, formes SDF, déformation de domaine ;
- three.js : libérer la mémoire GPU des ressources créées en code.

### 11.5 Emil, hors animation, ce qui touche la vidéo ou la typographie
- **`apple-design`** :
  - ressorts d'Apple en amortissement / réponse : déplacement 1,0 / 0,4 ; rotation 0,8 / 0,4 ; tiroir 0,8 / 0,3 ;
  - amortissement de 1,0 par défaut ; rebond seulement si un geste a donné de l'élan ;
  - un léger flou de mouvement ou un étirement pour encoder la vitesse ;
  - §15 Typographie : l'approche dépend de la taille (négative pour l'affichage, par exemple `-0.02em` et interlignage 1,05 ; légèrement positive pour le petit texte) ; l'interlignage diminue quand la taille augmente ; hiérarchie par graisse, taille et interlignage ensemble ; sur fond flou, un texte plus contrasté, plus gras et un peu plus espacé.
- **`break-ui/CATALOG.md`** : jeux de données pires cas. Utiles pour les compteurs et les titres vidéo :
  - `0` et `1` (pluriels) ;
  - séparateurs de milliers et formats régionaux (`1.284` en de-DE contre `1,284` en en-US) ;
  - `1000000` en forme compacte `1M` ;
  - `-42.5` ;
  - `0.1+0.2` ;
  - valeurs au-delà de 100 % ;
  - `null` ou `NaN` affiché tel quel ;
  - **`tabular-nums`**, sinon un compteur qui change (99 → 100) saute en largeur ;
  - noms très longs, texte non latin, emojis.
- **`animation-vocabulary`** : glossaire inverse (description vague → terme exact), par familles : entrées et sorties, enchaînements, transformations, transitions, défilement, retours, courbes, ressorts, boucles, finitions, performance, principes. Utile pour traduire les demandes des utilisateurs.
- `prototype` et `pick-ui-library` : rien pour la vidéo. `write-swift`, `ask-sonner` et `mobile-native` : hors sujet, lus en surface.

### 11.6 Ajouts au tableau d'adoptions (suite du §10.1)

| # | Idée reprise (source) | Où | Future skill |
|---|---|---|---|
| 29 | **Contrôle sync son-image** : OFF-BEAT au-delà de ±100 ms, STARTLE au-delà de +6 dB par rapport à la seconde d'avant (iart `sync-check.mjs`) | **Outil MCP serveur** : dans `review_montage` ou nouvel outil `check_audio_sync`, sur le MP4 rendu | son-design, controle-qualite |
| 30 | Règles de mixage sans sursaut : faire entrer les couches une ou deux par mesure ; marquer une coupe par un changement d'accord (+3 à +5 dB), pas par le volume | **Skill** | son-design |
| 31 | **Collision des textes** : boîtes déclarées par image, texte sur texte ou texte à cheval sur un objet clé (iart `layout-check.mjs`) | **Serveur** : `check_composition` sur les boîtes des blocs motion, échantillonné toutes les 0,1 s | controle-qualite, motion-titres |
| 32 | **Audit des ressources** : la page ne charge rien de l'extérieur (iart `asset-audit.mjs`) | **Serveur** : test interne des scènes HyperFrames (polices embarquées, aucune requête réseau au rendu) | controle-qualite (moteur) |
| 33 | Banque SFX ré-encodée avec crête vraie ≤ -3 dBTP, fichiers aberrants écartés ; manifeste enrichi (crête, sonie, mono/stéréo) (mesure §11.1) | **Serveur**, à l'import de la banque | son-design |
| 34 | Polices embarquées avec leur `OFL.txt` (Geist ; Google Fonts en OFL), chargées sur les caractères affichés seulement, avec délai maximal (JakeB-5 `fontsReady`) | **Serveur** (moteur) | motion-tokens, finition |
| 35 | Tous les temps en temps musicaux à partir d'un BPM ; `duck` de la musique sur chaque grosse caisse ; `try/catch` par scène (moteur JakeB-5) | **Serveur** (HyperFrames) | montage-rythme |
| 36 | Voix off à 2,3 mots/s (2,0 en technique) ; durée de scène = mots ÷ 2,3 + 0,4 s (iart explainer) | **Serveur** (`plan_shots`, `generate_voiceover_lines` en estimation) + skill | montage, motion-titres |
| 37 | Démo produit : écran posé 0,5–1 s, curseur 0,4–0,8 s, clic 0,2–0,3 s, zoom ×2 en 1–2 s puis tenu 2–4 s (iart product-demo) | **Skill** | motion-scene-ui (manquante) |
| 38 | Une seule transition par film de type diaporama, fondu de 0,4 à 0,6 s (iart photo-slideshow) | **Skill** | montage-transitions |
| 39 | Intro YouTube de 3 à 5 s ; outro d'au moins 20 s sur une vidéo d'au moins 25 s (iart youtube) | **Skill** | motion-logo-cta, declinaison-formats |
| 40 | Graphismes animés à 12 i/s dans un montage à 24 i/s (style Vox) | **Serveur** (option `posterize` d'un bloc) + skill | motion-tokens (style) |
| 41 | Illustrations IA : générer de petits éléments séparés, jamais animer une seule image (iart generative-illustration) | **Skill** | motion-scene-ui, generate |
| 42 | Particules et aléa toujours avec une graine fixe (iart webgl) | **Serveur** (moteur) | controle-qualite |
| 43 | Contrôle qualité de livraison : première et dernière image propres, sans image perdue, 48 kHz, orthographe des noms, prix et URL, décalage de gamma, nommage `client_projet_livrable_ratio_durée_vNN_date`, dossier de livraison avec un README des polices et licences (iart freelance) | **Serveur** (contrôles automatiques à l'export) + skill | finition |
| 44 | Traduire les retours vagues en choix précis, avec horodatage (iart client-revisions) | **Skill** | (manquante) revision-retours |
| 45 | Données pires cas pour les compteurs : 0 et 1, séparateurs régionaux, `tabular-nums`, NaN, valeurs > 100 %, forme compacte (Emil break-ui) | **Serveur** (formatage des compteurs selon la langue) + skill | motion-compteurs-data |
| 46 | Typographie : approche selon la taille (-0,02 em en affichage), interlignage inverse à la taille, hiérarchie graisse + taille + interlignage (Emil apple-design §15) | **Skill** + presets serveur | motion-titres, motion-tokens |
| 47 | Ressorts d'Apple (amortissement / réponse : 1,0/0,4, 0,8/0,4, 0,8/0,3), amortissement de 1,0 par défaut | **Serveur** (presets) | motion-tokens |
| 48 | Mouvement réduit en 3 niveaux (supprimer, adoucir à 200 ms au plus, garder), utile pour l'export web interactif | **Skill** | finition (sortie web) |
| 49 | Récapitulatif façon Wrapped : 5 à 7 scènes de 2,5 à 4 s, image finale à partager, lisible en moins de 2 s | **Skill** (recette) | montage-recipes ou motion-compteurs-data |
| 50 | Bulles de messagerie conformes à l'application (côtés, couleurs, coins de 18 à 22 px, « Read » à 300 ms, réaction à 400 ms) | **Skill** (recette) + bloc motion serveur | motion-scene-ui |

### 11.7 Skills manquantes, liste complétée
Aux 8 du §10.4 s'ajoutent :

9. **revision-retours** : traduire un retour client ou utilisateur vague en choix précis avec horodatage, puis corriger seulement ce qui a été tranché.
10. **livraison-specs** (ou à fusionner dans finition) : formats par plateforme, débits, nommage, dossier de livraison, contrôles de première et dernière image, de gamma et d'orthographe.
11. **motion-voix-off-rythme** (ou à fusionner dans montage-rythme) : débit de 2,3 mots par seconde, durée des scènes déduite du script, tracé et révélation calés sur la phrase.
12. **motion-carte** (Vox) et **motion-diagramme** (nœuds → liens → libellés, focus et contexte) : aucune skill de la famille ne couvre la carte animée ni le schéma explicatif.
13. **recettes-formats** courtes ou à fusionner dans `montage-recipes` : promo à prix barré, diaporama photo, conversation par messages, intro et outro YouTube, Wrapped. Ce sont des recettes chiffrées, pas des skills de technique.
