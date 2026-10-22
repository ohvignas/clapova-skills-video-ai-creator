---
name: product-photoshoot
description: Use when a Clapova user wants brand-quality product visuals from a product photo or description — packshot, lifestyle scene, hands close-up, Pinterest pin, hero banner, carousel, ad pack, virtual try-on, conceptual / levitating product, restyle of an existing image ("photo produit", "visuels pub", "bannière", "carrousel", "shooting produit") with generate_image and the product-shots recipes. Images only; for a product video ad use clapova-pub-produit-ugc.
---

# Clapova : shooting produit
> Adapté du workflow `higgsfield-product-photoshoot` de github.com/higgsfield-ai/skills (MIT, Copyright (c) 2026 Higgsfield AI) — voir `../../THIRD_PARTY_NOTICES.md`. Les appels CLI Higgsfield sont remplacés par les outils Agent de Clapova (modèles fal du catalogue, crédits Clapova).

## Règles

- Français, « vous ». Au plus 4 questions courtes avant de lancer, toujours avec options proposées. Ne posez pas une question dont la réponse est évidente.
- Livraison : les images seules, avec une étiquette courte chacune.
- Une photo du produit est fortement préférée : elle part en `imageUrl` de chaque génération (fidélité).

## 1. Choisir le mode

Lisez `get_creative_recipes({topic:"product-shots"})`. Choisissez par intention ; le plus spécifique gagne :
- fond neutre / catalogue → `product_shot` ; en situation → `lifestyle_scene` ; mains, application → `closeup_with_person` ;
- Pinterest → `moodboard_pin` ; bannière de site → `hero_banner` ; série → `social_carousel` ; pubs → `ad_creative_pack` ;
- porté par un modèle → `virtual_tryon` ; lévitation, éclaboussure → `conceptual` ; changer l'ambiance d'une image → `restyle`.

## 2. Entretien (sauter ce qui est connu)

- Photo fournie, demande vague : combien ? `[1 / 3 / 5]` · ambiance ? `[Studio / Situation / Conceptuel / Avec modèle]` · usage ? `[Boutique / Instagram / Pinterest / Pub / Site]` · couleurs de marque ?
- Pas de photo : demandez-en une ; sinon catégorie, emballage, couleur, signe distinctif.
- Restyle : esthétique ? saison ? quoi garder ?
- Essayage : type de modèle, décor, cadrage.

## 3. Générer

Pour chaque visuel, un appel `generate_image` :
- `imageUrl` = photo produit (ou image à restyler) ;
- `aspectRatio` = celui du mode (fiche recette) ;
- `prompt` = consigne du mode (champ `prompt` de la recette) + intention de l'utilisateur + couleurs de marque + « keep the exact product shape, label and colors ».

Série (carrousel, pack pub) : même lumière et même palette, varier un seul paramètre par image (angle, décor, offre). Plus de 3 images : `estimate_plan` d'abord.

## 4. Contrôle

Regardez chaque image : produit identique (forme, étiquette), pas de texte parasite, marque correcte. Défaut net → relancer une fois avec la consigne corrigée.

## Pièges

- Produit déformé (étiquette, forme) : repars de la photo en `imageUrl`, jamais d'un prompt seul.
- Texte ou logo généré : à poser ensuite avec `edit_image_precise`.
- Série hétérogène : une seule lumière et une seule palette, un seul paramètre varie.

## Critères de fin

Chaque image montrée avec son étiquette, produit identique à la photo, coût total donné en une ligne. Une seule suite proposée : animer les deux meilleures images en vidéo (`clapova:pub-produit-ugc`) ou décliner en carrousel.

## Écart

Higgsfield assemble le prompt côté serveur (vocabulaire privé). Ici le prompt est construit par l'agent à partir des recettes Clapova ; aucun prompt Higgsfield n'est repris.
