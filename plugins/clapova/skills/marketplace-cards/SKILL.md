---
name: marketplace-cards
description: Use when a Clapova user wants marketplace listing visuals — main image on white, secondary images (infographic, angles, detail, lifestyle, what's in the box), A+ content modules, or a full listing set ("fiche Amazon", "visuels marketplace", "images de fiche produit").
---

# Clapova : visuels marketplace
> Adapté du workflow `higgsfield-marketplace-cards` de github.com/higgsfield-ai/skills (MIT, Copyright (c) 2026 Higgsfield AI) — voir `../../THIRD_PARTY_NOTICES.md`. Les appels CLI Higgsfield sont remplacés par les outils Agent de Clapova (modèles fal du catalogue, crédits Clapova).

## Règles

- Français, « vous ». Une seule question de confirmation au plus avant de lancer.
- Photo produit fortement préférée ; sans photo, continuer seulement si le produit est décrit clairement.
- N'inventez aucune allégation (certifications, chiffres, ingrédients) : seuls les faits donnés par l'utilisateur vont dans les textes.

## 1. Périmètre

`get_creative_recipes({topic:"marketplace-cards"})` donne les visuels et les lots :
- `main` = image principale seule ;
- `product-images` = principale + 5 secondaires ;
- `aplus` = principale + modules A+ ;
- sur mesure : liste d'ids d'assets.

## 2. Générer dans l'ordre

1. **Image principale d'abord** : `generate_image({imageUrl: photo, aspectRatio:"1:1", prompt: "pure white background #FFFFFF, product fills ~85% of frame, no added text, no logo, no props, true colors"})`.
2. Puis chaque visuel secondaire avec `imageUrl` = **l'image principale validée** (cohérence), prompt = brief du visuel + catégorie + univers de marque.
3. Textes d'infographie et modules A+ : 3–4 mots par bénéfice. Si un texte doit être exact, générez le visuel sans texte puis ajoutez-le avec `edit_image_precise` (modèle `ideogram`, voir `clapova:image-edit`) plutôt que de compter sur le modèle.

## 3. Livraison

Liste étiquetée : « Image principale », « Infographie », « En situation »… Pas d'identifiants.

## Écart

Les règles de conformité marketplace de Higgsfield sont privées : celles-ci sont les règles publiques générales (fond blanc, produit seul, pas de texte sur l'image principale). Vérifiez les exigences à jour de la plateforme visée.
