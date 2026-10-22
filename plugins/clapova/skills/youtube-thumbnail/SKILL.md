---
name: youtube-thumbnail
description: Use when a Clapova user wants a YouTube thumbnail, Shorts cover or Instagram video cover ("miniature", "vignette YouTube", "couverture du Reel"), including variant sets, face-referenced thumbnails, logos and headline overlays.
---

# Clapova : miniatures
> Adapté du workflow `higgsfield-youtube-thumbnail` de github.com/higgsfield-ai/skills (MIT, Copyright (c) 2026 Higgsfield AI) — voir `../../THIRD_PARTY_NOTICES.md`. Les appels CLI Higgsfield sont remplacés par les outils Agent de Clapova (modèles fal du catalogue, crédits Clapova).

## Règles

- Français, « vous ». Une question compacte seulement si un choix manquant change le résultat.
- N'inventez rien sur la vidéo (résultat, chiffre, produit, personne). Exagérer oui, mentir non.
- Une miniature de référence sert à l'analyse visuelle seulement ; ne jamais la passer en `imageUrl` ni copier son identité.
- Plafond : 16 générations par demande.

## 1. Entretien

Sujet et promesse honnête · qui apparaît (0–3 personnes ; visage de l'utilisateur → son Personnage) · logo · titre de 2–4 mots (par défaut : image sans texte) · format : 16:9 YouTube, 9:16 Shorts, 4:5 Instagram · une miniature ou une série (~4).

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

Personne : `generate_with_character({type:"image"})` ; sinon `generate_image`. Une génération par concept/émotion (pas de lot identique).

## 4. Contrôle

Identité fidèle, aucun texte parasite, émotion et héros lisibles à 120 px de large, fidèle à la vidéo. Échec net → relancer au plus 2 fois.

## 5. Retouches et titre

Retouche ciblée : `generate_image` avec `imageUrl` = la miniature choisie et « change ONLY <expression | background | rim light color>, keep everything else identical ». Titre exact : `edit_image_precise` avec le modèle `ideogram` (texte net, voir `clapova:image-edit`), ou surimpression déterministe (police grasse, contour épais) plutôt que texte généré dans l'image.

## Livraison

Images + étiquette (« choc / gros plan »), format et présence de texte.
