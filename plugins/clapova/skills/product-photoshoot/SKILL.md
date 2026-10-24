---
name: product-photoshoot
description: Use when a Clapova user wants brand-quality product visuals from a product photo or description — packshot, lifestyle scene, hands close-up, Pinterest pin, hero banner, carousel, ad pack, virtual try-on, conceptual / levitating product, restyle of an existing image ("photo produit", "visuels pub", "bannière", "carrousel", "shooting produit") with generate_image and the product-shots recipes. Images only; for a product video ad use clapova:pub-produit-ugc.
---

# Clapova : shooting produit
> Adapté du workflow `higgsfield-product-photoshoot` de github.com/higgsfield-ai/skills (MIT, Copyright (c) 2026 Higgsfield AI) — voir `../../THIRD_PARTY_NOTICES.md`. Les appels CLI Higgsfield sont remplacés par les outils Agent de Clapova (modèles fal du catalogue, crédits Clapova).

## Règles

- Français, « vous ». Au plus 2 questions courtes à la fois (jamais un questionnaire de 4), toujours avec options proposées. Ne posez pas une question dont la réponse est évidente.
- Livraison : les images seules, avec une étiquette courte chacune.
- Une photo du produit est fortement préférée : elle part en `imageUrl` de chaque génération (fidélité). Photo ou fichier joint : `create_upload_link({expectedKind:"image", fileName})` tout de suite, puis `get_upload_status` jusqu'à `done` ; l'URL https du média obtenu (`get_media_info`) sert d'`imageUrl`. Lien https public : `import_media_from_url`. Ne dis jamais que tu ne peux pas recevoir le fichier.
- Solde : `get_credits` avant la première génération, surtout pour une série (« 5 carrousels » = 5 × N images : chiffre le total avec `estimate_plan`, propose une version réduite si le solde ne suffit pas).

## 1. Choisir le mode

Lisez `get_creative_recipes({topic:"product-shots"})` et prenez les identifiants de mode dans sa réponse : la liste ci-dessous est indicative, la recette fait foi si elle diffère. Choisissez par intention ; le plus spécifique gagne :
- fond neutre / catalogue → `product_shot` ; en situation → `lifestyle_scene` ; mains, application → `closeup_with_person` ;
- Pinterest → `moodboard_pin` ; bannière de site → `hero_banner` ; série → `social_carousel` ; pubs → `ad_creative_pack` ;
- porté par un modèle → `virtual_tryon` ; lévitation, éclaboussure → `conceptual` ; changer l'ambiance d'une image → `restyle`.

## 2. Entretien (sauter ce qui est connu)

- Photo fournie, demande vague, en deux tours de 2 questions au plus : tour 1 : combien ? `[1 / 3 / 5]` · ambiance ? `[Studio / Situation / Conceptuel / Avec modèle]` ; tour 2 : usage ? `[Boutique / Instagram / Pinterest / Pub / Site]` · couleurs de marque ? (sinon `get_brand_kit` ; pas de kit et un site : `import_brand_from_website`, voir `clapova:marque-depuis-site`)
- Pas de photo : demandez-en une (voir « Règles » pour la recevoir) ; sinon catégorie, emballage, couleur, signe distinctif.
- Restyle : esthétique ? saison ? quoi garder ?
- Essayage : type de modèle, décor, cadrage. Photo d'une personne réelle fournie : seulement la sienne, avec son accord ; jamais celle d'un tiers ni d'une célébrité (refus type : « Je ne peux pas utiliser le visage d'une personne réelle autre que toi, ni d'une célébrité ; je peux créer un modèle fictif ou utiliser tes propres photos », puis `clapova:personnages`).

## 3. Générer

Pour chaque visuel, un appel `generate_image` :
- `imageUrl` = photo produit (ou image à restyler) ;
- `aspectRatio` = celui du mode (fiche recette), parmi `16:9`, `9:16`, `1:1` seulement (4:5 n'est pas une taille de génération) : si la fiche donne une autre valeur, retombe sur la plus proche ;
- `prompt` = consigne du mode (champ `prompt` de la recette) + intention de l'utilisateur + couleurs de marque + « keep the exact product shape, label and colors ».

Série (carrousel, pack pub) : même lumière et même palette, varier un seul paramètre par image (angle, décor, offre). Annonce le coût avant de lancer, même pour 1 à 3 images (`estimate_plan` ; au-delà de 3 images au total, ou dès 2 visuels d'une série, attends l'accord).

## 4. Contrôle

Une URL de média ne se voit pas en MCP seul : seul `render_preview_frames` renvoie des images. Pose les images dans un projet (`add_media_to_project`) et regarde la planche ; sinon dis « non vérifié visuellement », donne les URL et fais valider par l'utilisateur (la lui montrer ne vérifie rien). À vérifier : produit identique à la photo (forme, étiquette), pas de texte parasite, marque correcte. Défaut net → relancer une fois avec la consigne corrigée.

## Pièges

- Produit déformé (étiquette, forme) : repars de la photo en `imageUrl`, jamais d'un prompt seul.
- Texte ou logo généré : à poser ensuite avec `edit_image_precise` (`model:"ideogram"` pour le texte, `flux` pour un logo en référence). Fidélité du produit : `cutout_subject` pour un fond propre, `vectorize_logo` pour un logo net.
- Série hétérogène : une seule lumière et une seule palette, un seul paramètre varie.

## Critères de fin

Chaque image montrée avec son étiquette, produit identique à la photo, coût total donné en une ligne. Une seule suite proposée : animer les deux meilleures images en vidéo (`clapova:pub-produit-ugc`) ou décliner en carrousel.
