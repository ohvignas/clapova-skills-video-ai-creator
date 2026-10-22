---
name: youtube-thumbnail
description: Use when a Clapova user wants a YouTube thumbnail, Shorts cover or Instagram Reel cover ("miniature", "vignette YouTube", "couverture du Reel", "thumbnail"), including variant sets, face-referenced thumbnails with a Personnage, logos and headline overlays, via generate_image, generate_with_character and edit_image_precise. To pick a cover from an existing video use extract_thumbnail.
---

# Clapova : miniatures
> Adapté du workflow `higgsfield-youtube-thumbnail` de github.com/higgsfield-ai/skills (MIT, Copyright (c) 2026 Higgsfield AI) — voir `../../THIRD_PARTY_NOTICES.md`. Les appels CLI Higgsfield sont remplacés par les outils Agent de Clapova (modèles fal du catalogue, crédits Clapova).

## Règles

- Français, « vous ». Une question compacte seulement si un choix manquant change le résultat.
- N'inventez rien sur la vidéo (résultat, chiffre, produit, personne). Exagérer oui, mentir non.
- Une miniature de référence sert à l'analyse visuelle seulement ; ne jamais la passer en `imageUrl` ni copier son identité.
- Plafond : 16 générations par demande.

## 1. Entretien

Sujet et promesse honnête · qui apparaît (0–3 personnes ; visage de l'utilisateur → son Personnage) · logo · titre de 2–4 mots (par défaut : image sans texte) · format : 16:9 YouTube, 9:16 Shorts ; 4:5 Instagram n'est pas un format de génération (`generate_image` accepte 16:9, 9:16, 1:1) : génère en 1:1 ou 9:16 puis recadre · une miniature ou une série (~4).

Coût : `get_credits`, puis annonce en une ligne le coût de la série (4 variantes dépassent 3 générations : `estimate_plan` et accord avant de lancer, plafond de 16 générations).

## 2. Concept

`get_creative_recipes({topic:"thumbnails"})`. Imaginez au moins 5 concepts en interne sur plusieurs cadres (portrait expressif, avant/après, action figée, produit héros, écart d'échelle…), gardez celui qui ouvre le plus fort manque d'information avec un seul sujet focal.

## 3. Prompt (ordre fixe)

1. Cadre : « bold, punchy YouTube thumbnail, photoreal, high impact, <ratio>, single unified frame ».
2. Scène exacte de la vidéo.
3. Texte : « No text, no watermark » (par défaut).
4. Sujets : grands, premier plan, 40–60 % du cadre, visages nets.
5. Éléments clés du manque d'information seulement.
6. Logo intact, loin des visages.
7. Lieu, 8. composition (un héros sur un tiers, profondeur), 9. fond vif contrasté avec vignettage.
10. Lumière : key forte, fill doux, contre-jour. 11. Étalonnage : vif, brillant, noirs profonds.

Personne : `generate_with_character({type:"image"})` ; sinon `generate_image` (photoréel : `pick_best_model`). `generate_image` n'accepte qu'UNE image de référence (`imageUrl`) : visage via le Personnage, puis pose le logo en second temps avec `edit_image_precise` (références multiples, jusqu'à 9 avec `flux`). Une génération par concept/émotion (pas de lot identique). Garde l'URL de chaque image générée pour la livraison.

## 4. Contrôle

Identité fidèle, aucun texte parasite, émotion et héros lisibles à 120 px de large (juge-le en regardant l'image réduite, p. ex. à l'ouverture dans la vue miniature ; aucun outil ne la redimensionne), fidèle à la vidéo. Échec net → relancer au plus 2 fois.

## 5. Retouches et titre

Retouche ciblée : `generate_image` avec `imageUrl` = la miniature choisie et « change ONLY <expression | background | rim light color>, keep everything else identical ». Titre exact : `edit_image_precise` avec le modèle `ideogram` (texte net, voir `clapova:image-edit` ; réservé aux plans Créateur et Studio après 2 essais offerts : sinon `model:"economique"`), ou surimpression déterministe (police grasse, contour épais) plutôt que texte généré dans l'image.

## Pièges

- Texte cuit dans l'image par le modèle : déformé, surimpose-le.
- « Refais cette miniature YouTube » avec une URL de vidéo : les outils ne téléchargent pas YouTube. Demande l'image de la miniature en fichier (`create_upload_link`) ou sa description, et n'en tire que l'analyse visuelle (composition, émotion, couleurs) ; jamais en `imageUrl`.
- Plus de trois visages ou deux idées : un seul sujet focal.
- Promesse que la vidéo ne tient pas : exagérer oui, mentir non.
- Couverture de Reel : image de la vidéo elle-même d'abord (`extract_thumbnail`, gratuit), génération seulement si rien ne convient.

## Livraison

Images (liens) + étiquette (« choc / gros plan »), format, présence de texte, coût total en une ligne, puis un court message de félicitations original avec un emoji.
