# Catalogue de styles (vidéo courte marketing, 2026)

12 styles qui marchent sur TikTok, Reels et Shorts. Chaque style a un **id stable** : c'est lui qu'on écrit dans les réponses de `ask_storyboard_questions`, dans la fiche de direction (`Références`) et dans `storyboard.json` (`direction.style`). Planche visuelle : `planche-styles.png` ; sous-ensemble (les 3 directions proposées) : `node build.mjs --ids a,b,c --out <dossier>`. Les données des vignettes sont dans `styles.json` (ajouter un style = une entrée + une fonction `ART` dans `build.mjs`).

Coût Clapova : **code** = motion et dessin en code, 0 crédit ; **rushes** = vidéos de l'utilisateur ; **IA** = génération (image → vidéo, 3D, voix) facturée ; **mixte** = un peu de tout. Constats communs 2026 : l'accroche se joue dans les 3 premières secondes, le contenu « fait au téléphone » bat souvent le très léché sur TikTok, le léché garde sa place sur Reels et pour le premium (sources en bas).

| id | Rendu | Plan moyen | Caméra | Motion / typo | Son | Quand l'utiliser | Fabrication Clapova | Modèle |
|---|---|---|---|---|---|---|---|---|
| `ugc-face-cam` | une personne parle au téléphone, lumière naturelle | 2–3 s, jump cuts | tenu main, face caméra | sous-titres mot à mot pop, 1 sticker | voix directe, musique basse | conversion, preuve sociale, TikTok | rushes de l'utilisateur, sinon personnage (`clapova:talking-head`) ; rushes | `ugc-ad` |
| `reel-motion` | plans réels courts + graphismes marketing par-dessus | 1–2 s | push-in, macro, speed ramp | titres cinétiques gras, compteurs, soulignés, badges | musique 110–125 BPM, impacts légers | lancement, promo, chiffres à montrer | rushes ou image → vidéo depuis photo produit + motion code ; mixte | — (`montage-recipes`) |
| `kinetic-type` | mots plein écran sur aplats, aucun plan filmé | 0,5–1,5 s | fausse caméra (zoom, slide) | typo grasse géante, 2–3 couleurs, coupe au temps | musique rythmée, voix optionnelle | message fort, manifeste, budget nul | 100 % `clapova:motion-design` ; code | — |
| `hyper-motion` | plans spectaculaires, flashs, lignes de vitesse | 0,4–1 s | crash zoom, whip pan, FPV | textes très courts, glitch, flashs | musique seule, montée + drop | teaser, sortie, sport, tech | `generate_video` + presets `crash-zoom`, `whip-pan`, `speed-ramp` ; IA | `crash-zoom-teaser` |
| `premium-apple` | produit seul sur fond uni, lumière douce | 2,5–3,5 s | push-in lent, orbit lent | une phrase sobre, typo fine, beaucoup de vide | piano / ambiant, peu de bruitages | produit haut de gamme, marque | image → vidéo depuis photo produit (`product-glow`, `push-in`) + code ; IA | `cinematic-product-demo` |
| `produit-3d` | objet en 3D, matières, rotation | 2–3 s | orbit 360°, éclaté | étiquettes de fonctions, chiffres | électro propre | tech, cosmétique, objet à détailler | `generate_3d` / `turntable_3d` + code ; IA | `cinematic-product-demo` |
| `unboxing-asmr` | mains, carton, macro, sons nets | 1,5–2,5 s | macro fixe, plongée | nom du produit sur la révélation | sons du produit au premier plan, musique très basse | e-commerce, cadeau, packaging soigné | rushes (le son compte) ; image → vidéo en secours ; rushes | `unboxing` |
| `avant-apres` | deux états côte à côte ou en volet | 2 plans tenus | fixe, même cadre | AVANT / APRÈS, jour 1 → jour 30 | whoosh sur la bascule | beauté, rénovation, logiciel, transformation | 2 rushes ou 2 images + code ; mixte | `before-after` |
| `listicle` | promesse chiffrée puis un point par plan | 2–3 s | push-in, whip pan entre points | gros numéros, titres 5 mots | voix off rythmée | éducation, conseils, SEO social | code + b-roll (stock ou rushes) ; mixte | `listicle-top` |
| `demo-app` | capture réelle de l'app dans un téléphone | 2–3 s | zooms sur l'écran, suivi du curseur | bulles, cercle de clic, 1 bénéfice par écran | voix off, clics discrets | SaaS, appli, fonctionnalité | captures de l'utilisateur (jamais générées) + code ; code | — |
| `faceless-explainer` | icônes, schémas, voix off, pas de visage | 2–4 s | fausse caméra douce | un bloc visuel par phrase | voix off claire, musique douce | expliquer, former, B2B | voix IA (`generate_voiceover`) + motion code ; code (voix ≈ IA) | `faceless-explainer` |
| `pov-green-screen` | personne détourée devant une page, un post, un prix | 2–3 s | face caméra, fixe | « POV : … » en haut, texte natif | voix directe, son tendance | réaction, humour, comparatif, actu | rushes + `cutout_subject` + capture en fond ; rushes | — |

Combinaisons fréquentes : `reel-motion` + `listicle` ; `ugc-face-cam` + `demo-app` ; `premium-apple` + `produit-3d`. On choisit **un** style dominant, le second ne sert qu'aux transitions ou à un beat.

Hors catalogue (sur demande) : stop motion (photos + code à 12 i/s), animation 2D illustrée (dessin en code, `clapova:motion-design`), live action tourné.

## Sources

- Kapwing, *Short-Form Video Statistics 2026* : https://www.kapwing.com/resources/short-form-video-statistics-tiktok-reels-and-shorts-by-the-numbers-in-2026/
- Jetfuel, *Short-Form Video Ads for DTC Brands 2026* : https://jetfuel.agency/short-form-video-ads-for-dtc-brands-tiktok-reels-and-shorts-strategy-that-drives-revenue-in-2026/
- Jetfuel, *Short-Form Video Optimization 2026* : https://jetfuel.agency/short-form-video-optimization-2026/
- Tiger Pistol, *Reels vs TikTok vs Shorts 2026* : https://tigerpistol.com/?p=27559
- eMarketer, *FAQ on short-form video advertising* : https://www.emarketer.com/content/faq-on-short-form-video-advertising--new-formats--measurement-standards--creative-guidelines
- Stackmatix, *TikTok Creative Best Practices: Hook-First 3 Seconds* : https://stackmatix.com/blog/tiktok-creative-best-practices-2026
- Tlinky, *TikTok Ad Creative Best Practices 2026* : https://tlinky.com/tiktok-ad-creative-best-practices/
- Admetrics, *TikTok advertising trends* : https://www.admetrics.io/en/post/tiktok-advertising-trends

Ces sources sont surtout des blogs d'agences : tendances, pas lois. Chiffres de rythme et zones sûres à jour : `get_creative_recipes`, `list_references` (`hyper-motion`, `pub-ugc`, `listicle`…).
