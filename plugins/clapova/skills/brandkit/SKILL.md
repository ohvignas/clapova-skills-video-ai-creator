---
name: brandkit
description: Use when a Clapova user wants a brand applied consistently to videos and visuals — palette, logo, typography, "Brand Lock" for templates (brand colors, logo, fonts), branded social graphics, posters, mockups — or a new identity when explicitly asked ("charte", "kit de marque", "mes couleurs", "crée un logo").
---

# Clapova : kit de marque
> Adapté du workflow `higgsfield-brandkit` de github.com/higgsfield-ai/skills (MIT, Copyright (c) 2026 Higgsfield AI) — voir `../../THIRD_PARTY_NOTICES.md`. Les appels CLI Higgsfield sont remplacés par les outils Agent de Clapova (modèles fal du catalogue, crédits Clapova).

## Règles

- Français, « vous ». Une seule série de questions bloquantes, jamais un questionnaire complet.
- Après chaque proposition (palette, logo, typographie) : stop, attendre un choix explicite. Le silence n'est pas une validation.
- Conserver mot pour mot le texte de l'utilisateur. N'inventer aucun positionnement, chiffre, certification.

## 1. Classer la demande

Commencez par `get_brand_kit` (kit existant). Marque à importer depuis un site : `import_brand_from_website({url})` puis `apply_brand_import` après accord explicite (skill `marque-depuis-site` du plugin).


- `appliquer` : l'utilisateur a déjà logo/couleurs → ne rien redessiner.
- `compléter` : créer seulement les éléments manquants requis par le livrable.
- `créer` : nouvelle identité, seulement si demandée.

## 2. Brand Lock (la fiche qui fait foi)

Notez : nom exact, logo officiel (URL), couleurs hex (`primary`, `background`, `text`), polices (titre / texte), formes, interdits. Cette fiche alimente **telle quelle** le champ `brand` de `apply_template` / `create_from_template` (`name`, `primary`, `background`, `text`, `logoUrl`) et chaque prompt d'image (« exact hex #… », polices nommées). C'est la source unique des couleurs et polices pour les autres skills.

## 3. Éléments requis selon le livrable

- vidéo par modèle de montage → palette + logo (optionnel) ;
- visuel avec texte (post, affiche) → logo + palette + typographie ;
- maquette sans texte → logo seul.

## 4. Créer ce qui manque

1. **Palette** : proposer 2–3 palettes de 4–5 hex, rendues en HTML (pastilles + exemple de titre) ; contraste texte/fond ≥ 4,5:1.
2. **Logo** : proposer 3 concepts de symbole distincts via `generate_image` (fond uni, couleurs de la palette validée, « flat vector style, no text unless the brand name is requested »). Changer la palette invalide le logo généré avec elle.
3. **Typographie** : 2–3 paires Google Fonts (titre / texte) rendues avec le vrai nom de marque.

## 5. Produire

Réutiliser partout la même source de logo (jamais redessiné). Visuels photo : `generate_image` avec le Brand Lock copié dans le prompt. Vidéos : modèles de montage avec `brand` (`clapova:presets`). Contrôler chaque rendu ; ne réparer que ce qui échoue.

## Écarts

Logo vectoriel SVG : `generate_vector_logo` (Recraft V3, style vectoriel) ou `vectorize_logo` (PNG/JPG vers SVG), SVG nettoyé. Charte PDF : `export_brand_guidelines` (lien de téléchargement) ou bouton « Télécharger la charte (PDF) » sur /app/marque. Pas de PPTX. Les scripts Python de Higgsfield ne sont pas repris.
