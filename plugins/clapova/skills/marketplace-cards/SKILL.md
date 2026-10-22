---
name: marketplace-cards
description: Use when a Clapova user wants e-commerce marketplace listing visuals — main image on white, secondary images (infographic, angles, detail, lifestyle, what's in the box), A+ content modules, or a full listing set ("fiche Amazon", "visuels marketplace", "images de fiche produit", "fiche Etsy / Shopify") with generate_image, edit_image_precise and the marketplace-cards recipes. Not for ad creatives or hero banners (clapova-product-photoshoot).
---

# Clapova : visuels marketplace
> Adapté du workflow `higgsfield-marketplace-cards` de github.com/higgsfield-ai/skills (MIT, Copyright (c) 2026 Higgsfield AI) — voir `../../THIRD_PARTY_NOTICES.md`. Les appels CLI Higgsfield sont remplacés par les outils Agent de Clapova (modèles fal du catalogue, crédits Clapova).

## Règles

- Français, « vous ». Une seule question de confirmation au plus avant de lancer : plateforme (Amazon, Etsy, Shopify…), catégorie du produit, langue des textes.
- Coût : `get_credits` puis `estimate_plan` ; un lot de 6 à 7 images dépasse 3 générations, annonce le total et attends l'accord avant de lancer.
- Photo produit fortement préférée ; sans photo, continuer seulement si le produit est décrit clairement.
- N'inventez aucune allégation (certifications, chiffres, ingrédients) : seuls les faits donnés par l'utilisateur vont dans les textes.

## 1. Périmètre

`get_creative_recipes({topic:"marketplace-cards"})` donne les visuels et les lots :
- `main` = image principale seule ;
- `product-images` = principale + 5 secondaires ;
- `aplus` = principale + modules A+ ;
- sur mesure : liste d'ids d'assets.

Entrées : photo floue, avec un fond chargé, ou lien de fiche concurrente : n'utilise jamais l'image d'un concurrent. Photo reçue en fichier : `create_upload_link` / `import_media` ; fond à nettoyer : `cutout_subject`, plus fiable qu'un prompt pour obtenir un vrai fond blanc #FFFFFF. Contraintes courantes : image principale d'au moins 1000 px de côté, produit sur environ 85 % du cadre (vérifie la plateforme visée).

## 2. Générer dans l'ordre

1. **Image principale d'abord** : `generate_image({imageUrl: photo, aspectRatio:"1:1", prompt: "pure white background #FFFFFF, product fills ~85% of frame, no added text, no logo, no props, true colors"})`.
2. Puis chaque visuel secondaire avec `imageUrl` = **l'image principale validée** (cohérence), prompt = brief du visuel + catégorie + univers de marque. `generate_image` n'accepte qu'UNE référence : pour « contenu de la boîte » ou plusieurs produits, passe par `edit_image_precise` (références multiples). Ouvre chaque image pour vérifier que le produit est identique (forme, étiquette) avant de passer à la suivante.
3. Textes d'infographie et modules A+ : 3–4 mots par bénéfice. Si un texte doit être exact, générez le visuel sans texte puis ajoutez-le avec `edit_image_precise` (modèle `ideogram`, voir `clapova:image-edit`) plutôt que de compter sur le modèle.

## 3. Livraison

Liste étiquetée avec le lien de chaque image : « Image principale », « Infographie », « En situation »… Pas d'identifiants. Coût total en une ligne.

## Pièges

- Allégations inventées (certification, chiffre, ingrédient) : seulement les faits fournis.
- Image principale avec texte, accessoire ou ombre dure : refus fréquent des plateformes.
- Cohérence perdue : chaque secondaire part de l'image principale validée.

## Critères de fin

Lot complet selon le périmètre choisi, chaque visuel étiqueté, produit identique d'une image à l'autre, textes exacts, coût total annoncé. Une seule suite proposée.

Règles publiques générales (fond blanc, produit seul, pas de texte sur l'image principale) : vérifie les exigences à jour de la plateforme visée.
