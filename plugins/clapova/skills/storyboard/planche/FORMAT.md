# Planche croquis : format de storyboard.json

Moteur : `node build.mjs storyboard.json --out <dossier>` produit `planche.html` (autonome : JS et polices embarqués) et, si Playwright + Chromium sont trouvés, `planche.png`. Aucune dépendance npm obligatoire (Node 18+). Exemple complet : `examples/nova.json`.

Options : `--shots 2,3` (planche partielle, pour montrer seulement les plans changés), `--changed 3` (bandeau bleu « modifié » sur la planche complète), `--animatic` (écrit `animatic/index.html`), `--no-png`. Capture seule : `node render.mjs planche.html planche.png`. Playwright est cherché dans `PLAYWRIGHT_MODULE`, puis `playwright` / `playwright-core`, puis `/opt/node-tools/node_modules/playwright` ; Chromium : celui de Playwright, sinon `CHROMIUM_PATH` ou `PUPPETEER_EXECUTABLE_PATH`.

## Racine

| Champ | Type | Rôle |
|---|---|---|
| `title`, `subtitle` | texte | en-tête de la planche (= `title` de `create_storyboard`) |
| `version` | texte | « v1 », « v2 »… : incrémente à chaque tour d'itération |
| `storyboardId` | texte ou null | id Clapova renvoyé par `create_storyboard`, pour garder le lien |
| `style` | texte | ligne d'accroche de l'en-tête (défaut « croquis code, 0 crédit ») |
| `format` | `"9:16"` ou `{ratio, width, height, fps}` | 9:16, 16:9, 1:1, 4:5 ; les cases restent dessinées en 9:16 (limite connue) |
| `shots` | liste | les plans, dans l'ordre |

La durée totale est calculée (somme des plans). Ne la saisis pas.

## Plan (`shots[]`)

| Champ | Type | Rôle |
|---|---|---|
| `id` | nombre | numéro affiché (01, 02…) ; renumérote après insertion |
| `duration` | secondes | durée du plan ; les timecodes se recalculent en cascade (`start`/`end` acceptés mais écrasés) |
| `title` | texte | titre de la ligne |
| `tag` | `Croquis` ou `Motion` | badge (défaut Motion pour `compteur` et `packshot`) |
| `scene` | nom de scène | voir plus bas ; absente ou inconnue : repli `generique` (avertissement) |
| `params` | objet | paramètres de la scène |
| `camera` | `"push-in"` ou `{type, label, zoom, dir}` | mouvement de caméra (flèches rouges) |
| `panels` | 1, 2 ou 3 | cases (défaut 3 : début, milieu, fin) ; 1 pour un plan fixe sans action |
| `action` | texte | note Action |
| `voice` | `"texte"` ou `{value, from}` | voix off ; `from` = moment d'entrée (0 à 1 du plan) |
| `text` | `"texte"` ou `{value, from, inScene}` | texte à l'écran ; `inScene:true` si la scène le dessine déjà (motion) |
| `sound` | texte | note Son |
| `transition` | texte | sous les notes : « Cut sec », « Raccord mouvement », « Fondu au bleu nuit (6 images) »… Un texte contenant fondu/fade/dissolve fait un fondu dans l'animatic |

### Caméra (`camera.type`)

`static` (défaut), `push-in` (`zoom`, ex. 1,45 : cadre d'arrivée en tirets + flèches des coins), `pull-out` (`zoom`), `track` et `pan` (`dir`: `left` | `right`, flèche en bas), `tilt` (`dir`: `up` | `down`, flèche courbe à droite), `orbit` (arc en bas), `handheld` (zigzag). `label` = texte libre de la note Caméra. Étiquette sur la 1re case seulement, flèche répétée tant que le mouvement dure. Rouge = caméra au bord de la case, bleu = sujet dans l'image.

Correspondance avec `cameraMove` de `create_storyboard` : static, pan, tilt, push_in = push-in, pull_out = pull-out, tracking = track, handheld, orbit.

### Contrôles automatiques (encadrés orange sur la planche)

Plan de plus de 5 s ; voix off au-delà de 2,3 mots par seconde ; texte à l'écran de plus de 6 mots ; plan moyen au-delà de 3,5 s en format court ; promesse (premier texte ou voix) après 3 s ; scène ou caméra inconnue. Ce sont des alertes, pas des refus : corrige ou justifie.

## Scènes disponibles

Contrat : `(t de 0 à 1, params) => { art, marks }` ; `art` = SVG plein cadre 360x640 (aussi utilisé par l'animatic), `marks` = annotations de planche (flèches bleues, notes manuscrites).

| Scène | Dessine | `params` |
|---|---|---|
| `cafe-froid` | tasse froide sur table, horloge, fenêtre, push-in intégré | `zoom` |
| `main-sac` | main qui plonge dans un cabas et sort une gourde, travelling avec parallaxe | `trackFrom`, `trackTo` (px) |
| `ouverture-vapeur` | deux mains, bouchon dévissé, vapeur, orbit en contre-plongée | `spinFrom`, `spinTo` (-1 à 1) |
| `compteur` | motion : anneau qui se remplit, chiffre, label, piste de keyframes | `keys` ([[u, valeur]…]), `unit`, `label`, `sub` |
| `packshot` | motion : produit, logo révélé par masque, trait, URL | `logo`, `tagline`, `url` |
| `generique` | repli universel : décor + éléments qui bougent | voir ci-dessous |

### Scène `generique` (n'importe quel brief)

`params` : `decor` (`interieur`, `exterieur`, `studio`, `bureau`, `nuit`, `uni`), `note` (note manuscrite au début), `noteAt` [x,y], `elements` (liste). La caméra du plan (push-in, pull-out, track, pan, tilt, orbit, handheld) bouge vraiment l'image.

Élément : `type` (`personne`, `objet`, `produit`, `ecran`, `texte`, `logo`), `at` ou `from` [x,y] (pied de l'élément, repère 360x640), `to` [x,y] (le sujet se déplace : flèche bleue auto), `scale`, `scaleTo`, `moveStart`/`moveEnd` (0 à 1), `appear` (0 à 1, apparition), `label` (note manuscrite sous l'élément).
- `personne` : `pose` (`debout`, `assis`, `pointe`, `bras-leves`, `marche`), `fill`.
- `objet` / `produit` : `forme` (`boite`, `cylindre`, `sphere`, `telephone`), `w`, `h`, `fill`.
- `ecran` : `label` (nom d'app), `highlight` (ligne en orange), `w`, `h`.
- `texte` / `logo` : `value`, `size`, `color`.

Exemple : `{"scene":"generique","camera":{"type":"track","dir":"right"},"params":{"decor":"exterieur","elements":[{"type":"personne","pose":"marche","from":[90,600],"to":[270,600],"label":"Léa, 30 ans"}]}}`.

## Ajouter une scène ou une primitive

1. Le sujet tient en `generique` (silhouette, boîte, écran, texte) : utilise-le d'abord, c'est le repli normal.
2. Sinon, ajoute une primitive dans `lib/sketch.js` : fonction `(x, y, s, options) => chaîne SVG`, repère 360x640, styles `ST(épaisseur)`, gris `G.g1`…`G.g5`, ombre ellipse floue (`filter="url(#soft)"`), hachures `url(#hatch)`. Exporte-la dans `root.Sketch`.
3. Ajoute la scène dans `lib/scenes.js` (ou un nouveau fichier chargé par `build.mjs`, liste `LIBS`) : `'nom': (t, p = {}) => ({ art: frame(svg, { cam }), marks })`. L'état évolue avec `t` (pose, ouverture, apparition) : les 3 cases sont la même scène à t = 0,03 / 0,5 / 0,97. Ajoute son nom à `SCENE_NAMES` dans `build.mjs`.
4. Règles de dessin : 3 à 5 gris, sujet le plus clair ou le plus contrasté, fond plus sombre ou hachuré, pas de couleur hors rouge caméra, bleu sujet et accent de marque ; flèches bleues fines près de l'objet, jamais au bord.
5. Rends `examples/nova.json` puis ton cas, et regarde le PNG avant de livrer.

## Animatic (optionnel)

`--animatic` écrit `animatic/index.html` : composition 1080x1920 (selon `format`), timeline GSAP en pause exposée dans `window.__timelines.main` et `window.render(T)`, contrat HyperFrames (`data-composition-id`, `data-duration`). Rendu vidéo avec le moteur de rendu Clapova ou HyperFrames (`hyperframes render . -o animatic.mp4`) ; c'est long (environ 4 min pour 20 s en GPU logiciel) : seulement sur demande.
