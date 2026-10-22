---
name: generate
description: Use when a Clapova user asks to generate ONE image, video clip, voiceover, music track or sound ("génère une image", "anime cette photo", "fais une vidéo de…", "stylise cette image", "fais une voix off", "fais une musique", "continue la vidéo") through the Clapova MCP or Agent — routing to the right generate_* tool, automatic model choice, references, presets, credit cost, delivery with preview. Not for photoshoots, marketplace cards, thumbnails, explainers, brand systems, precise local retouching, multi-shot videos (use the matching clapova-* skill) nor video prompt tuning per model (clapova-prompts-video).
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

## Prompt (voir aussi `clapova:prompts-video`)

- Sujet, action, lieu, lumière, cadrage, style, en une ou deux phrases concrètes. Texte à afficher entre guillemets, court.
- Gardez le texte de l'utilisateur en français : Clapova le réécrit en anglais pour le modèle.
- Vidéo : une action par plan ; le mouvement de caméra passe par un preset, pas par la phrase.
- Jamais de personne réelle identifiable ni de marque tierce sans demande explicite.
- `name` : titre court en français, toujours renseigné.

## Livraison

1. `projectId` connu : passez-le pour ranger le média dans le projet.
2. Montrez le résultat, puis proposez une seule suite utile (animer l'image, l'ajouter au montage, une variante).

## Coûts

Chaque description d'outil donne son coût ; les échecs sont remboursés. `get_credits` avant un lot, `estimate_plan` au-delà de 3 générations. Une vidéo coûte bien plus qu'une image : essaie l'idée en image d'abord si l'utilisateur hésite. Jamais de génération « pour essayer » en boucle.

## Pièges

- Voix off : texte lu mot pour mot, nombres écrits en lettres, aucune consigne de ton dans le texte (le ton est un réglage, `list_model_params`).
- Musique : « sans paroles » sauf demande ; la durée voulue passe par `params` si le modèle l'expose (`list_model_params`), sinon note-la dans le prompt et ajuste au montage.
- Image vers vidéo : le prompt décrit le mouvement, pas l'image de départ.
- Texte lisible dans une image : guillemets, 3 mots au plus, sinon surimpression au montage.
- Audio natif d'un clip vidéo : de l'ambiance seulement ; au montage, la voix de Clapova prime (`set_volume` du clip à 0 si le son gêne).

## Critères de fin

Le média existe dans la Bibliothèque (ou le projet), l'aperçu est montré, le coût est donné en une ligne, une seule suite est proposée. Pour une vidéo : regarde une image extraite (`extract_frames`, gratuit) avant de la présenter, pour vérifier cadre rempli et absence de déformation.

## Limites

Pas de 3D (GLB), pas plus de 10 s en un appel (enchaîner avec `continue_video` ou au montage). La 4K est une option d'export (`export_video`), pas de génération.

## Exemples de demandes

- « Anime cette photo avec un crash zoom » → `generate_video({imageUrl, prompt, preset:"crash-zoom"})`.
- « Une musique lo-fi de 30 s sans paroles » → `generate_music`.
