---
name: generate
description: Use when a Clapova user asks to generate ONE image, video clip, voiceover, music track or sound ("génère une image", "anime cette photo", "fais une vidéo de…", "stylise cette image", "fais une voix off", "fais une musique", "continue la vidéo") through the Clapova MCP or Agent — routing to the right generate_* tool, automatic model choice, references, presets, credit cost, delivery with preview. Not for photoshoots, marketplace cards, thumbnails, explainers, brand systems, precise local retouching, multi-shot videos (use the matching clapova:* skill) nor video prompt tuning per model (clapova:prompts-video).
---

# Clapova : générer un média

Adapté du workflow `higgsfield-generate` (github.com/higgsfield-ai/skills, MIT, Copyright (c) 2026 Higgsfield AI), voir `../../THIRD_PARTY_NOTICES.md`. Les modèles sont ceux du catalogue fal de Clapova, payés en crédits Clapova.

Ce skill est la source unique pour : le routage d'une génération, le choix automatique du modèle, la livraison d'un média.

## Dialogue

- Français, « vous », court. Pas d'identifiant ni de JSON dans le chat : l'aperçu et une ligne (modèle, durée, format).
- Une question à la fois, seulement si l'information manque vraiment (sujet absent, format inconnu pour une vidéo de plateforme).
- Génération unique : annonce le coût en une ligne (description de l'outil ; `get_credits` si le solde est incertain) et lance. Demande l'accord avant de lancer à partir de 2 vidéos, de 20 crédits au total ou d'un modèle premium (`intent:"quality"`), et pour tout lot de plus de 3 générations (`estimate_plan`). Pas de question sur le modèle : les outils `generate_*` prennent le meilleur modèle permis par le plan et le solde (`intent:"value"` par défaut). `intent:"quality"` seulement si l'utilisateur veut du premium ; `"cheap"` ou `"speed"` s'il le demande.

## Routage

1. Skill dédié d'abord : photo produit, pub statique, bannière → `clapova:product-photoshoot` ; fiche marketplace → `clapova:marketplace-cards` ; miniature → `clapova:youtube-thumbnail` ; vidéo explicative → `clapova:video-explainer` ; logo, charte → `clapova:brandkit` ; personne récurrente → `clapova:personnages` ; retouche d'une partie d'image → `clapova:image-edit` ; montage → `clapova:montage` (et lis d'abord `get_guide('montage')`) ; « fais-moi une pub / une vidéo de 30 s » en plusieurs plans → `clapova:storyboard` puis `clapova:montage` ; « fais comme cette vidéo YouTube / TikTok » → `clapova:recreer-depuis-reference` ; talking head → `clapova:talking-head`.
2. Sinon, **fichier ou image joint par l'utilisateur** (« anime cette photo ») : `create_upload_link({expectedKind, fileName})` tout de suite, puis `get_upload_status` jusqu'à `done` ; le média obtenu (mediaId, URL) sert d'`imageUrl` ou de source. Lien https public : `import_media_from_url`. Ne demande jamais de lien Dropbox ou Drive.
   Ensuite :
   - **Image** : `generate_image({prompt, aspectRatio?, imageUrl?, name, projectId?})`. Avec `imageUrl`, un modèle d'édition est choisi (restyle global).
   - **Vidéo** : `generate_video({prompt, aspectRatio?, imageUrl?, preset?, presets?, intensity?, name, projectId?})`. 10 s par défaut (8 s pour Veo). `imageUrl` = première image. Mouvements et VFX : `clapova:presets` (appelle `list_video_presets` pour les ids valides avant de citer un preset).
   - **Suite d'une vidéo** : `continue_video({mediaId, prompt, clipId?, name?, intent?, projectId?})` (dernière image réelle ; placée après le clip source seulement si celui-ci est sur la timeline). Pas de `preset`, `imageUrl` ni `aspectRatio` : pour `continue_video` seulement, le mouvement de caméra se dit dans la phrase du prompt.
   - **3D** : `generate_3d` (objet depuis une image ou un texte) et `turntable_3d` (rotation) ; coût dans la description de l'outil.
   - **B-roll d'un script** : `generate_broll` (`dryRun:true` d'abord), via `clapova:montage`.
   - **Voix off** : `generate_voiceover({text, params?})`, texte lu mot pour mot. Voix française : `list_model_params({endpointId, language:"fr"})` renvoie `voices` (natives d'abord), passe l'id choisi dans `params.voice` et la langue dans le champ langue du modèle.
   - **Musique** : `generate_music({prompt})` : style, tempo, instruments, « sans paroles » si besoin.
3. Comparer ou chiffrer : `list_models`, `pick_best_model`, `estimate_plan` (lot de plus de 3 générations : annoncer le total, puis lancer). Détail des modèles et des plans : `clapova:model-catalog`.
4. Réglages fins (seed, prompt négatif, CFG, format audio, etc.) : seulement si l'utilisateur les demande. `list_model_params({endpointId})` donne les réglages d'un modèle (niveau `base` ou `avance`, bornes, défaut) et ses pré-réglages débutants ; passer les valeurs choisies dans `params` de `generate_image`, `generate_video`, `generate_voiceover` ou `generate_music`. Un réglage inconnu ou hors bornes est refusé avant tout débit ; un modèle sans réglage (`supported:false`) tourne avec ses défauts.

## Prompt (voir aussi `clapova:prompts-video`)

- Sujet, action, lieu, lumière, cadrage, style, en une ou deux phrases concrètes. Texte à afficher entre guillemets, court.
- Gardez le texte de l'utilisateur en français : Clapova le réécrit en anglais pour le modèle. Détails modèle par modèle : `get_guide('generation')`.
- Vidéo : une action par plan. Avec `generate_video`, le mouvement de caméra passe par un preset, pas par la phrase ; avec `continue_video` (pas de preset), il se dit dans la phrase.
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

Le média existe dans la Bibliothèque (ou le projet), l'aperçu est montré, le coût est donné en une ligne, une seule suite est proposée. Contrôle visuel honnête : en MCP seul, seul `render_preview_frames` renvoie des images inline (il exige un projet) ; `extract_frames` et les URL des médias ne donnent que du texte. Si le média est ou peut être posé dans un projet (`add_media_to_project`), regarde la planche `render_preview_frames` avant de présenter. Sinon dis « non vérifié visuellement », donne l'URL à l'utilisateur et ne prétends pas avoir contrôlé sujet, texte ou mains ; une seule régénération en cas de défaut signalé. Voix off : durée comparée au plan visé (`get_media_info`).

## Limites

Pas plus de 10 s en un appel (enchaîner avec `continue_video` ou au montage). La 4K est une option d'export (`export_video`), pas de génération.

## Scénarios attendus (cas pièges)

- Musique de 30 s alors que le modèle plafonne plus bas : `list_model_params` (durée), sinon `generate_music` à la durée max puis boucle ou second morceau au montage ; dis-le.
- « 5 vidéos d'un coup » : `estimate_plan`, total annoncé, accord demandé, jamais 5 appels silencieux.
- Portrait d'une personne réelle ou d'une célébrité : refuse l'identification ; propose un personnage fictif ou `clapova:personnages` avec consentement.
- « Anime cette photo » avec image jointe : `create_upload_link` d'abord, jamais « je ne peux pas recevoir de fichier ».

## Exemples de demandes

- « Anime cette photo avec un crash zoom » → `generate_video({imageUrl, prompt, preset:"crash-zoom"})` (id présent dans `list_video_presets`).
- « Une musique lo-fi de 30 s sans paroles » → `generate_music`.
