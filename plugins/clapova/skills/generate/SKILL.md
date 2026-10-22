---
name: generate
description: Use when a Clapova user asks to generate one image, video, voiceover, music or sound ("génère une image", "anime cette photo", "fais une vidéo de…", "stylise cette image", "fais une musique", "continue la vidéo") through the Clapova Agent or MCP — routing to the right tool, automatic model choice, references, presets, delivery. Not for photoshoots, marketplace cards, thumbnails, explainers, brand systems or precise local retouching (use the matching clapova-* skill).
---

# Clapova : générer un média

Adapté du workflow `higgsfield-generate` (github.com/higgsfield-ai/skills, MIT, Copyright (c) 2026 Higgsfield AI), voir `../../THIRD_PARTY_NOTICES.md`. Les modèles sont ceux du catalogue fal de Clapova, payés en crédits Clapova.

Ce skill est la source unique pour : le routage d'une génération, le choix automatique du modèle, la livraison d'un média.

## Dialogue

- Français, « vous », court. Pas d'identifiant ni de JSON dans le chat : l'aperçu et une ligne (modèle, durée, format).
- Une question à la fois, seulement si l'information manque vraiment (sujet absent, format inconnu pour une vidéo de plateforme).
- Pas de confirmation de coût pour une génération unique, pas de question sur le modèle : les outils `generate_*` prennent le meilleur modèle permis par le plan et le solde (`intent:"value"` par défaut). `intent:"quality"` seulement si l'utilisateur veut du premium ; `"cheap"` ou `"speed"` s'il le demande.

## Routage

1. Skill dédié d'abord : photo produit, pub statique, bannière → `clapova:product-photoshoot` ; fiche marketplace → `clapova:marketplace-cards` ; miniature → `clapova:youtube-thumbnail` ; vidéo explicative → `clapova:video-explainer` ; logo, charte → `clapova:brandkit` ; personne récurrente → `clapova:personnages` ; retouche d'une partie d'image → `clapova:image-edit` ; montage → `clapova:monteur`.
2. Sinon :
   - **Image** : `generate_image({prompt, aspectRatio?, imageUrl?, name, projectId?})`. Avec `imageUrl`, un modèle d'édition est choisi (restyle global).
   - **Vidéo** : `generate_video({prompt, aspectRatio?, imageUrl?, preset?, presets?, intensity?, name, projectId?})`. 10 s par défaut (8 s pour Veo). `imageUrl` = première image. Mouvements et VFX : `clapova:presets`.
   - **Suite d'une vidéo** : `continue_video({mediaId, prompt, clipId?, projectId?})` (dernière image réelle, placée après le clip source).
   - **Voix off** : `generate_voiceover({text})`, texte lu mot pour mot.
   - **Musique** : `generate_music({prompt})` : style, tempo, instruments, « sans paroles » si besoin.
3. Comparer ou chiffrer : `list_models`, `pick_best_model`, `estimate_plan` (lot de plus de 3 générations : annoncer le total, puis lancer). Détail des modèles et des plans : `clapova:model-catalog`.
4. Réglages fins (seed, prompt négatif, CFG, format audio, etc.) : seulement si l'utilisateur les demande. `list_model_params({endpointId})` donne les réglages d'un modèle (niveau `base` ou `avance`, bornes, défaut) et ses pré-réglages débutants ; passer les valeurs choisies dans `params` de `generate_image`, `generate_video`, `generate_voiceover` ou `generate_music`. Un réglage inconnu ou hors bornes est refusé avant tout débit ; un modèle sans réglage (`supported:false`) tourne avec ses défauts.

## Prompt

- Sujet, action, lieu, lumière, cadrage, style, en une ou deux phrases concrètes. Texte à afficher entre guillemets, court.
- Gardez le texte de l'utilisateur en français : Clapova le réécrit en anglais pour le modèle.
- Vidéo : une action par plan ; le mouvement de caméra passe par un preset, pas par la phrase.
- Jamais de personne réelle identifiable ni de marque tierce sans demande explicite.
- `name` : titre court en français, toujours renseigné.

## Livraison

1. `projectId` connu : passez-le pour ranger le média dans le projet.
2. Montrez le résultat, puis proposez une seule suite utile (animer l'image, l'ajouter au montage, une variante).

## Limites

Pas de 3D (GLB), pas plus de 10 s en un appel (enchaîner avec `continue_video` ou au montage). La 4K est une option d'export (`export_video`), pas de génération.

## Exemples de demandes

- « Anime cette photo avec un crash zoom » → `generate_video({imageUrl, prompt, preset:"crash-zoom"})`.
- « Une musique lo-fi de 30 s sans paroles » → `generate_music`.
