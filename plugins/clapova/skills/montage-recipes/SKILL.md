---
name: montage-recipes
description: Use when planning or judging a Clapova edit and you need the craft — hook formulas, cut rhythm, montage styles (creator / Apple-like 9:16, hyper-motion, luxe, UGC), b-roll, transitions, captions, sound design and mix (ducking, SFX on the event, -14 LUFS, voice-over without overlap), ad / UGC / explainer / listicle structures, platform specs (TikTok, Reels, Shorts, YouTube, LinkedIn). Complements clapova-monteur (tool loop) and clapova-motion-design (animation).
---

# Clapova : recettes de montage

Règles de métier pour un montage qui retient. La boucle d'outils est dans `clapova:monteur`, l'animation dans `clapova:motion-design`. Les données chiffrées sont servies par `get_creative_recipes({topic})` (`platforms`, `hooks`, `rhythm`) et `list_references({format?})`. Attribution : `../../THIRD_PARTY_NOTICES.md`.

Ce skill est la source unique pour : accroche, rythme, styles, b-roll, transitions, sous-titres, son, structures, plateformes.

## 1. Avant de monter

1. Plateforme et format : `get_creative_recipes({topic:"platforms"})`. En 9:16, aucun texte dans les 20 % du bas ni dans les coins.
2. Style brief de 5 lignes : palette, police, rythme de coupe, transitions, ton. Marque : `clapova:brandkit`.
3. Liste de 6 à 12 plans avant la timeline. Un plan = une idée.
4. Modèle le plus proche avant de monter à la main (`list_templates`) : `ugc-ad`, `unboxing`, `listicle-top`, `faceless-explainer`, `cinematic-product-demo`, `crash-zoom-teaser`, `before-after`, `event-announcement`.

## 2. Accroche (0 à 1,5 s)

- Une formule (`topic:"hooks"`) : résultat d'abord, manque d'information, interpellation, rupture visuelle, liste numérotée, contre-pied, avant/après.
- Élément fort visible dès la première image, déjà en mouvement. Texte de 5 mots au plus. La voix arrive avant 0,5 s.
- Jamais de logo ni de « Bonjour » en ouverture. Visuel et texte disent la même chose.

## 3. Rythme et styles

- Plans de 1 à 3 s en 9:16, 2 à 5 s en 16:9. Une image fixe porte toujours un effet caméra.
- Relance (coupe, zoom de 6 à 10 %, mot-clé, transition) toutes les 3 à 5 s en format énergique, 5 à 8 s au plus sinon.
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

- `add_captions` : 9:16 look `pop`, 3 mots par page, mot actif surligné, tiers central ; 16:9 / LinkedIn look `propre`, 5 à 6 mots, bas d'écran au-dessus de la zone sûre.
- Taille ≥ 48 px en 1080p. Contour ou ombre, jamais de bandeau noir, jamais sur un visage.
- Texte fidèle à la voix, chiffres en chiffres. `until` arrête les sous-titres avant le carton CTA.

## 7. Son (le sound design fait la différence)

- **Voix devant** : voix off à 1, jamais plus. Une seule voix à la fois : les blocs de voix off se suivent sans se chevaucher (≥ 0,1 s d'air entre deux blocs).
- **Musique** : sur toute la durée, `set_duck` (≈ 0,25 à 0,35 sous la voix), 0,6 à 0,8 sans voix. Pas de musique en explicatif sobre sans demande.
- **Bruitages calés sur l'image** : le pic du son tombe sur l'événement (la coupe, l'apparition du titre, le clic), pas sur le début du fichier. Whoosh sur les transitions fortes, impact sur l'accroche ou le logo, riser qui finit sur la révélation, pop ou clic sur les apparitions UI. `add_sfx` à 0,35 par défaut ; un bruitage par événement, pas un tapis continu.
- **Mix final** : -14 LUFS intégré, -1,5 dBTP (normalisé automatiquement à l'export). Aucune distorsion audible.
- **Pas de bruitages saturés** : volume de `add_sfx` raisonnable (≈ 0,35), jamais plusieurs sons forts superposés ; vitesse de lecture (pitch) de `add_sfx` entre 0,95 et 1,08 seulement, au-delà le son se déforme.

## 8. Structures

- **UGC** : accroche, problème, produit en main, preuve, CTA.
- **Pub** : rupture visuelle, bénéfice, 3 preuves rapides, offre, CTA + logo.
- **Explication** : titre, question, une idée par bloc, récap, CTA (`clapova:video-explainer`).
- **Liste** : promesse chiffrée, du moins fort au plus fort, CTA « enregistrez ».
- **CTA** : 3 s ou plus, action claire en texte animé, dernière image tenue. Format court 9:16 : 15 à 45 s.

## 9. Leçons du propriétaire (non négociables)

- **Cadre rempli, élément fort dès la 1re image** : jamais d'ouverture vide ou timide.
- **Fil conducteur attaché** : un point, une flèche ou un titre qui suit un élément lui est attaché (`track_motion`, mêmes keyframes de groupe), jamais posé par des coordonnées absolues.
- **Style créateurs / réseaux** : jeune, « à la Apple », vertical 9:16, sobre, net.
- **Son** : voix devant, musique sur TOUTE la durée (bouclée, fondu de sortie 1 s), volume 0,5 et ducking 0,5 (≈ 0,25 sous la voix, audible), bruitages calés sur l'image, -14 LUFS / -1,5 dBTP.
- **Clips IA** : réencodés en GOP 30 avant le rendu (fait par le worker de rendu, ne les remplace pas par des sources brutes).
- **Voir avant de livrer** : une planche d'images (`render_preview_frames`) de l'accroche, des coupes, des titres et du CTA, regardée pour de bon.
- **Contraste** : texte secondaire au moins `#B8B8C4` sur fond sombre.

## 10. Fini

Un montage est fini quand les aperçus (`clapova:monteur`, étapes 5 à 7) montrent : accroche lisible, chaque coupe propre, titres entiers dans la zone sûre, CTA, et que `review_montage` atteint `stop:true`.
