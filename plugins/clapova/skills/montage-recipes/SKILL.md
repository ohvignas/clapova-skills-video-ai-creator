---
name: montage-recipes
description: Use when planning, writing the brief of or judging a Clapova edit and you need the craft — hook formulas (first 1.5 s), cut rhythm, montage styles (creator / Apple-like 9:16, hyper-motion, luxe, UGC), b-roll, transitions, caption looks, sound design and mix (music over the whole duration, ducking, light SFX, -14 LUFS), ad / UGC / explainer / listicle structures, platform formats and safe zones (TikTok, Reels, Shorts, YouTube, LinkedIn). Rules and numbers only, no tool loop.
---

# Clapova : recettes de montage

Règles de métier pour un montage qui retient. La boucle d'outils est dans `clapova:monteur`, l'animation dans `clapova:motion-design`. Les données chiffrées sont servies par `get_creative_recipes({topic})` (`platforms`, `hooks`, `rhythm`) et `list_references({format?})`. Attribution : `../../THIRD_PARTY_NOTICES.md`.

Ce skill est la source unique pour : accroche, rythme, styles, b-roll, transitions, sous-titres, son, structures, plateformes.

Arbitrage : toute demande « monte ma vidéo » charge `clapova:monteur` EN PREMIER (boucle et contrôles) ; ce skill ne fournit que les chiffres. « Refais comme cette vidéo » : `clapova:recreer-depuis-reference`.

## 1. Avant de monter

1. Plateforme et format : `get_creative_recipes({topic:"platforms"})`. En 9:16, aucun texte dans les 20 % du bas ni dans les coins.
2. Style brief de 5 lignes : palette, police, rythme de coupe, transitions, ton. Marque : `clapova:brandkit`. Exemple pour une pub UGC 9:16 de 25 s :
   ```
   Palette : blanc cassé, noir, accent orange #FF6B2C
   Police : Montserrat ExtraBold, sous-titres look pop
   Rythme : 1 à 2 s par plan, coupe sur la voix, relance toutes les 3 s
   Transitions : coupes sèches, un seul whip sur la révélation
   Ton : direct, tutoiement, preuve avant l'offre
   ```
3. Liste de 6 à 12 plans avant la timeline. Un plan = une idée.
4. Modèle le plus proche avant de monter à la main (`list_templates`) : `ugc-ad`, `unboxing`, `listicle-top`, `faceless-explainer`, `cinematic-product-demo`, `crash-zoom-teaser`, `before-after`, `event-announcement`.
5. Plusieurs formats demandés (ex. pub UGC 9:16 et LinkedIn 1:1) : monte d'abord le format principal, valide-le, puis décline avec `clapova:declinaison-formats`. Un projet = un format ; ne mélange jamais deux ratios dans une timeline.

## 2. Accroche (0 à 1,5 s)

- Une formule (`topic:"hooks"`) : résultat d'abord, manque d'information, interpellation, rupture visuelle, liste numérotée, contre-pied, avant/après.
- Exemples (FR, ≤ 5 mots à l'écran) : résultat d'abord « -4 kg en 30 jours » ; manque d'information « Personne ne te dit ça » ; interpellation « Toi, créateur, stop » ; liste « 3 erreurs, la 2e coûte cher » ; contre-pied « Arrête de poster tous les jours » ; avant/après « Lundi : 0 vente. Vendredi : 42 ». `get_creative_recipes({topic:"hooks"})` en donne d'autres chiffrés.
- Élément fort visible dès la première image, déjà en mouvement. Texte de 5 mots au plus. La voix arrive avant 0,5 s.
- Jamais de logo ni de « Bonjour » en ouverture. Visuel et texte disent la même chose.

## 3. Rythme et styles

- Plans de 1 à 3 s en 9:16, 2 à 5 s en 16:9. Une image fixe porte toujours un effet caméra.
- Relance (coupe, zoom de 6 à 10 %, mot-clé, transition) toutes les 3 à 5 s en format énergique, 5 à 8 s au plus sinon. Règle unique de plan fixe au montage : aucun plan de plus de 3 s sans effet caméra ou mouvement (`clapova:motion-design` applique la même). Le « 5 s » de `clapova:storyboard` est autre chose : la durée maximale d'un plan GÉNÉRÉ ; à l'assemblage, ce plan reçoit un effet dès 3 s ou est coupé.
- Chaque coupe a une raison : fin de phrase, temps fort de la musique (`snap_cuts_to_beats`), nouvelle idée. Jamais au milieu d'un mot.
- Parole : `analyze_rushes` retire silences et hésitations ; garde environ 0,12 s avant et 0,18 s après chaque phrase.
- Styles (`style` de `apply_edit_plan`, `plan_shots`, `review_montage`) : `standard`, `hyper-motion` (0,6 à 2 s, whip, zoom, flash), `gen-z-edit` (jump cuts, sous-titres pop), `luxe` (2 à 3,5 s, fondus, Ken Burns), `ugc-telephone` (coupes sèches, tremblé).
- **Style créateur / « à la Apple » en 9:16** (le style par défaut des démos Clapova) : fond sombre uni ou produit plein cadre, une police sans empattement grasse, un seul accent de couleur, gros titres centrés, mouvements nets (`expo.out`), beaucoup d'air, aucun effet gratuit (pas de lueur, pas de particules, pas de secousse).

## 4. B-roll

- Illustre le nom ou le verbe de la phrase, pas l'ambiance générale.
- Alterne large, serré, détail. Jamais deux plans de même valeur à la suite.
- Généré : `generate_broll({projectId, animate:"images"|"hook"|"video", dryRun:true})` d'abord ; un mouvement de caméra par plan (`clapova:presets`).

## 5. Transitions

- Coupe sèche par défaut ; transition sur une coupe sur deux au plus ; une seule famille par vidéo.
- Énergie : `transition-whip`, `transition-zoom`, `transition-flash`, `transition-volet`. Ambiance : `transition-fondu` (0,3 à 0,5 s), `transition-flou`, `transition-fondu-noir`.
- Fin : fondu de sortie 0,5 à 1 s sur l'image et la musique.

## 6. Sous-titres

- `add_captions` (six looks : `pop`, `karaoke`, `propre`, `boite`, `rebond`, `halo` ; détail dans `clapova:sous-titres-styles`) : 9:16 look `pop`, 3 mots par page, mot actif surligné, tiers central ; 16:9 / LinkedIn look `propre`, 5 mots par page, bas d'écran au-dessus de la zone sûre.
- Taille ≥ 48 px en 1080p. Contour ou ombre, jamais de bandeau noir, jamais sur un visage.
- Texte fidèle à la voix, chiffres en chiffres. `until` arrête les sous-titres avant le carton CTA.

## 7. Son (le sound design fait la différence)

- **Voix devant** : voix off à 1, jamais plus. Une seule voix à la fois : les blocs de voix off se suivent sans se chevaucher (≥ 0,1 s d'air entre deux blocs).
- **Musique** : sur toute la durée, clip à volume 0,5 avec `set_duck` niveau 0,5 (≈ 0,25 sous la voix, audible, jamais sous 0,15). Le niveau plus fort sans voix vient du seul `set_duck` qui relâche la musique ; ne pose jamais un second volume à la main. Pas de musique en explicatif sobre sans demande.
- **Bruitages calés sur l'image** : le pic du son tombe sur l'événement (la coupe, l'apparition du titre, le clic), pas sur le début du fichier. Whoosh sur les transitions fortes, impact sur l'accroche ou le logo, riser qui finit sur la révélation, pop ou clic sur les apparitions UI. `add_sfx` `volume` 0,18 par défaut (plage 0,12 à 0,25) ; un bruitage par événement, pas un tapis continu.
- **Mix final** : -14 LUFS intégré, -1,5 dBTP (normalisé automatiquement à l'export). Aucune distorsion audible.
- **Pas de bruitages saturés** : `volume` de `add_sfx` raisonnable (0,18 par défaut, 0,25 au plus), jamais plusieurs sons forts superposés ; vitesse de lecture (pitch) de `add_sfx` entre 0,95 et 1,08 seulement, au-delà le son se déforme.

## 8. Structures

- **UGC** : accroche, problème, produit en main, preuve, CTA.
- **Pub** : rupture visuelle, bénéfice, 3 preuves rapides, offre, CTA + logo.
- **Explication** : titre, question, une idée par bloc, récap, CTA (`clapova:video-explainer`).
- **Liste** : promesse chiffrée, du moins fort au plus fort, CTA « enregistrez ».
- **CTA** : 3 s ou plus, action claire en texte animé, dernière image tenue. Format court 9:16 : 15 à 45 s.

## 8b. Imiter un format (vidéo de référence)

Quand l'utilisateur donne une vidéo « à la manière de » : ne copie jamais ses images, sa musique ni sa marque. Tu reprends sa structure.
1. `list_references({format?})` : une référence Clapova du même format existe peut-être déjà ; sinon la vidéo de l'utilisateur : `analyze_reference_video({source})` (lien YouTube, média ou URL https) renvoie plans, rythme, accroche et CTA (voir `clapova:recreer-depuis-reference`).
2. Avec le fichier : `extract_frames({mediaId, mode:"sceneChanges"})` pour vérifier le nombre de plans, leur durée moyenne et le texte à l'écran.
3. Écris la recette : accroche, nombre de plans, durée moyenne, relance, style de sous-titres, CTA, durée.
4. Refais avec TES contenus et ton style, via `clapova:storyboard` puis `clapova:monteur`.
Droit d'auteur : on reprend la structure, pas la musique, les images, la voix ni la marque de la vidéo envoyée. Musique : `generate_music` ou la Bibliothèque ; une musique tendance ou sous licence n'est pas reproduite (propose un morceau généré de même énergie et tempo).

## 9. Leçons du propriétaire (non négociables)

- **Cadre rempli, élément fort dès la 1re image** : jamais d'ouverture vide ou timide.
- **Fil conducteur attaché** : un point, une flèche ou un titre qui suit un élément lui est attaché (`track_motion`, mêmes keyframes de groupe), jamais posé par des coordonnées absolues.
- **Style créateurs / réseaux** : jeune, « à la Apple », vertical 9:16, sobre, net.
- **Son** : voix devant, musique sur TOUTE la durée (bouclée, fondu de sortie 1 s), volume 0,5 et ducking 0,5 (≈ 0,25 sous la voix, audible), bruitages calés sur l'image, -14 LUFS / -1,5 dBTP.
- **Clips IA** : réencodés en GOP 30 avant le rendu (fait par le worker de rendu, ne les remplace pas par des sources brutes).
- **Voir avant de livrer** : une planche d'images (`render_preview_frames`) de l'accroche, des coupes, des titres et du CTA, regardée pour de bon.
- **Contraste** : texte secondaire au moins `#B8B8C4` sur fond sombre.

## 10. Formats réseaux (zones sûres)

| Réseau | Format | Durée idéale | Bas libre | Spécificité |
|---|---|---|---|---|
| TikTok | 9:16 | 15 à 35 s | 20 % | accroche et texte avant 1,5 s, sous-titres mot à mot au tiers central |
| Reels | 9:16 | 10 à 30 s | 20 % | couverture lisible en 4:5 au centre, rendu soigné, boucle propre |
| Shorts | 9:16 | 20 à 50 s | 20 % | dernière image qui s'enchaîne avec la première, pas de « lien en bio » |
| YouTube | 16:9 | 3 à 15 min | 10 % | 30 premières secondes = promesse de la miniature, relance toutes les 45 à 60 s |
| LinkedIn | 1:1 (10 %) ou 4:5 (20 %) | 30 à 90 s | 10 % en 1:1 | look `propre`, sous-titres obligatoires (lecture sans son) |

Une seule zone sûre pour tout le vertical (9:16 et 4:5) : 20 % du bas, sous-titres compris. Les 10 % de la colonne ne valent que pour le 16:9 et le 1:1. Chiffres à jour : `get_creative_recipes({topic:"platforms"})` ; en cas d'écart, c'est lui qui fait foi. Haut 8 à 10 % et côté droit 12 % libres de texte en 9:16.

## 11. Musique et son léger

- **Musique sur toute la durée** : du premier au dernier instant de la vidéo, fondu final d'une seconde. Un morceau plus court est prolongé (second morceau ou boucle propre), jamais laissé en silence.
- **Son léger** : au plus un bruitage tous les 2 s, sur les temps forts seulement ; whoosh réservé aux coupes fortes ; `volume` des bruitages 0,18 par défaut (0,12 à 0,25), moins encore sous la voix. Un silence bref avant la révélation vaut mieux qu'un bruit de plus.
- Tempo de la musique = rythme de coupe : une coupe sur le temps (`snap_cuts_to_beats`), la chute de la musique = l'élément principal.

## 12. Pièges

- Ouverture sur logo, « Bonjour » ou fond vide.
- Sous-titres sur un visage ou dans la zone d'interface de la plateforme.
- Deux transitions de familles différentes dans la même vidéo.
- Musique qui s'arrête avant la fin ; bruitage à chaque coupe ; voix qui chevauche la voix.
- Texte de moins de 48 px en 1080p ou gris sur gris (< `#B8B8C4` sur fond sombre).
- Plan fixe de plus de 3 s sans effet caméra (règle unique, aussi appliquée par `clapova:motion-design`).
- Voix de 40 s, musique de 15 s : boucle le morceau (second `add_clip` du même média) ou `generate_music` à la durée totale, fondu final ; jamais de silence en fin.

## 13. Fini (checklist)

Un montage est fini quand les aperçus (`clapova:monteur`, étapes 5 à 7) montrent : accroche lisible, chaque coupe propre, titres entiers dans la zone sûre, CTA tenu 3 s, musique de la première à la dernière image, et que `review_montage` atteint `stop:true`. Ensuite lien direct et félicitations (`clapova:monteur`, Livraison finale).


