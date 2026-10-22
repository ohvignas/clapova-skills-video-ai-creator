---
name: prompts-video
description: Use when writing, fixing or tuning the prompt of a Clapova generated clip, image, voice or music per model ("mon clip est flou", "le mouvement est raté", "écris le prompt pour Kling / Veo / Seedance / Flux", "pourquoi mon image a du texte bizarre") — image-to-video motion prompts, camera verbs and presets, one action per shot, positive phrasing, native audio, TTS and music prompt rules, with list_models, list_model_params, generate_video, generate_broll, generate_image and render_preview_frames.
---

# Clapova : prompts par modèle (vidéo, image, voix, musique)

Les outils `generate_*` réécrivent déjà ton texte en anglais pour le modèle choisi. Ton rôle : donner un brief net. Ce guide dit quoi mettre dans le brief, et comment corriger un défaut.

## Méthode

1. **Modèle visé** : `list_models` / `pick_best_model`, ou laisse l'outil choisir. Réglages (durée, format, début de plan) : `list_model_params({endpointId})`.
2. **Type de génération** :
   - texte vers vidéo : sujet + action + décor + lumière + cadrage ;
   - image vers vidéo (`imageUrl`) : **le mouvement seulement** (qui bouge, comment, la caméra). Ne redécris pas l'image de départ.
3. **Un plan = une action = un mouvement de caméra.** La caméra passe par un preset (`list_video_presets`, `clapova:presets`), pas par la phrase.
4. **Formulation positive** : dis ce qui est là, pas ce qui ne doit pas l'être. Exception : « no text, no logo » en négatif final pour un clip destiné à recevoir un titre en montage.
5. **Court et concret** : 25 à 60 mots pour un plan, 60 à 110 pour un plan de storyboard riche. Verbes de mouvement précis (lent, rapide, vers la gauche).
6. **Contrôle** : `extract_frames` (gratuit) ou `render_preview_frames` ; compare à l'intention. Défaut : corrige UNE chose et régénère (ne multiplie pas les essais, chaque essai est facturé ; un lot de plus de 3 passe par `estimate_plan`).

## Par famille de modèle

| Famille | Écris | Évite |
|---|---|---|
| Kling | scène en couches, vocabulaire de plan (dolly, tracking, pan, tilt, push lent), une phrase d'ambiance sonore ; dialogue entre guillemets, en minuscules | plusieurs actions, négations |
| Seedance | sujet + mouvement + caméra, repères de multi-plans (« cut to »), une ligne d'ambiance ou de dialogue | scènes de foule, transformations |
| Veo | scène cinéma, lumière, un geste simple, 8 s | paroles longues |
| MiniMax | caméra + mouvement, sujet, action, décor ; enchaîne les temps avec « then » | prompt négatif (il n'existe pas) |
| Wan | plan, sujet, action, décor, lumière, style en phrases fluides, une phrase d'ambiance | listes de mots-clés |
| Grok Imagine | phrases descriptives : sujet, décor, lumière, style (bon en animé) | jargon technique |
| FLUX | phrases naturelles, termes d'appareil photo ; couleurs en hex liées à un objet ; texte court entre guillemets | prompt négatif, trop de sujets |
| Ideogram | typographie d'abord : contenu clé en premier, texte court entre guillemets, nom du style de police | longues descriptions de scène |
| Nano Banana / GPT Image | brief créatif complet : usage (affiche, packshot, UI), texte exact entre guillemets avec sa place | consignes contradictoires |

Les noms de modèles évoluent : la liste vivante est `list_models`.

## Audio

- **Voix off** : texte lu mot pour mot, nombres écrits en lettres, phrases courtes (≈ 150 mots par minute, ponctuation pour les pauses). Le ton est un réglage (`list_model_params`), jamais écrit dans le texte. Selon le modèle : pas de MAJUSCULES ni de balises.
- **Musique** : genre, sous-genre, instruments, ambiance, tempo (BPM), « sans paroles » ; durée voulue via `params` si le modèle l'expose.
- **Bruitage** : court et littéral (« clic sec de bouton »).
- **Audio natif d'un clip** : ambiance seulement ; la voix et la musique se posent au montage, `set_volume` du clip à 0 si besoin.

## Pièges

- Texte lisible dans le clip : toujours déformé. Titre et logo se posent au montage.
- Écran d'appareil : « écran éteint ou flou », la vraie capture s'incruste ensuite.
- Mains qui tapent, foule, combat : plans courts ou évités.
- Personne récurrente : `clapova:personnages`, pas une description différente à chaque plan.

## Critères de fin

Prompt de moins de 110 mots, un mouvement, formulation positive, image de contrôle regardée, coût de chaque essai annoncé, au plus 2 régénérations par plan avant de proposer une autre approche (image fixe animée, stock, motion).
