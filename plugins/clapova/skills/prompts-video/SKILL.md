---
name: prompts-video
description: Use when writing, fixing or tuning the prompt of ONE Clapova generated clip, image, voice or music per model ("mon clip est flou", "le mouvement est raté", "écris le prompt pour Kling / Veo / Seedance / Flux", "pourquoi mon image a du texte bizarre") — image-to-video motion prompts, camera verbs, one action per shot, positive phrasing, native audio, TTS and music prompt rules. Not for choosing what to generate (clapova:generate) nor for copying a reference video (clapova:recreer-depuis-reference).
---

# Clapova : prompts par modèle (vidéo, image, voix, musique)

Les outils `generate_*` réécrivent déjà ton texte en anglais pour le modèle choisi. Ton rôle : donner un brief net. Ce guide dit quoi mettre dans le brief, et comment corriger un défaut.

Relis `get_guide('generation')` quand l'utilisateur change de type de média ou de modèle : il porte les règles de routage et de coût que ce guide suppose connues.

## Méthode

1. **Modèle visé** : appelle `list_models` AVANT de choisir une famille du tableau (un nom absent du catalogue ne se prompte pas), puis `pick_best_model`, ou laisse l'outil choisir. Réglages (durée, format, début de plan) : `list_model_params({endpointId})`.
2. **Type de génération** :
   - texte vers vidéo : sujet + action + décor + lumière + cadrage ;
   - image vers vidéo (`imageUrl`) : **le mouvement seulement** (qui bouge, comment, la caméra). Ne redécris pas l'image de départ.
3. **Un plan = une action = un mouvement de caméra.** Avec `generate_video`, la caméra passe par un preset (`list_video_presets`, `clapova:presets`), pas par la phrase ; `continue_video` n'a pas de preset : un seul mouvement, dit dans la phrase.
4. **Formulation positive** : dis ce qui est là, pas ce qui ne doit pas l'être. Prompt négatif : `generate_video` et `continue_video` n'ont pas de champ dédié. Si `list_model_params({endpointId})` expose un réglage négatif (sa clé exacte est donnée par la liste), passe-le dans `params` ; sinon termine le prompt par « no text, no logo » (surtout pour un clip qui recevra un titre en montage). Cette phrase est réécrite en anglais comme le reste.
5. **Court et concret** : 25 à 60 mots pour un plan ; le prompt d'un plan de storyboard (`clapova:storyboard`) suit ses propres bornes (60 à 110 mots). Plafond absolu 110 mots. Verbes de mouvement précis (lent, rapide, vers la gauche).
6. **Contrôle** : seul `render_preview_frames` renvoie des images (le clip doit être dans un projet : `projectId` à la génération ou `add_media_to_project`) ; `extract_frames` et l'URL du média ne donnent que du texte. Sans planche, dis « non vérifié visuellement », donne l'URL et ne prétends pas avoir contrôlé. Compare à l'intention. Défaut : corrige UNE chose et régénère (ne multiplie pas les essais, chaque essai est facturé ; un lot de plus de 3 passe par `estimate_plan`).

## Par famille de modèle

| Famille | Écris | Évite |
|---|---|---|
| Kling | scène en couches, vocabulaire de plan (dolly, tracking, pan, tilt, push lent), une phrase d'ambiance sonore ; dialogue entre guillemets | plusieurs actions, négations |
| Seedance | sujet + mouvement + caméra, une ligne d'ambiance ou de dialogue | scènes de foule, transformations |
| Veo | scène cinéma, lumière, un geste simple, 8 s | paroles longues |
| MiniMax | caméra + mouvement, sujet, action, décor | plusieurs actions |
| Wan | plan, sujet, action, décor, lumière, style en phrases fluides, une phrase d'ambiance | listes de mots-clés |
| Grok Imagine | phrases descriptives : sujet, décor, lumière, style (bon en animé) | jargon technique |
| FLUX | phrases naturelles, termes d'appareil photo ; couleurs en hex liées à un objet ; texte court entre guillemets | trop de sujets |
| Ideogram | typographie d'abord : contenu clé en premier, texte court entre guillemets, nom du style de police | longues descriptions de scène |
| Nano Banana / GPT Image | brief créatif complet : usage (affiche, packshot, UI), texte exact entre guillemets avec sa place | consignes contradictoires |

Les noms de modèles évoluent : la liste vivante est `list_models`. L'outil réécrit ton brief en anglais pour le modèle : écris-le en français naturel (sujet, action, décor, lumière, cadrage), sans syntaxe spéciale dont tu ne peux pas vérifier la conservation, et contrôle l'image obtenue plutôt que le texte envoyé.

## Audio

- **Voix off** : texte lu mot pour mot, nombres écrits en lettres, phrases courtes (≈ 150 mots par minute, ponctuation pour les pauses). Le ton est un réglage (`list_model_params`), jamais écrit dans le texte. Selon le modèle : pas de MAJUSCULES ni de balises.
- **Musique** : genre, sous-genre, instruments, ambiance, tempo (BPM), « sans paroles » ; durée voulue via `params` si le modèle l'expose.
- **Bruitage** : court et littéral (« clic sec de bouton »).
- **Audio natif d'un clip** : ambiance seulement ; la voix et la musique se posent au montage, `set_volume` du clip à 0 si besoin.

## Symptôme, cause, correction

| Symptôme | Cause probable | Correction (une seule à la fois) |
|---|---|---|
| Clip flou | trop d'éléments, mouvement rapide, image de départ molle | un seul sujet, mouvement lent (« slow »), image de départ nette |
| Mouvement raté ou absent | deux mouvements, caméra décrite en plus du preset, modèle qui ignore le geste | un seul mouvement, preset seul, verbe précis, ou autre modèle |
| Visage qui dérive | personne décrite autrement à chaque plan | `clapova:personnages`, mêmes mots, image de référence |
| Texte déformé | texte généré par le modèle | « no text » puis texte posé au montage ou `edit_image_precise` |

Avant → après : « un plan de la femme qui marche vite et zoome » → « plan moyen, une femme marche lentement vers la caméra dans une rue de nuit, lumière néon douce, suivi stable » (avec `preset:"push-in"`).

## Pièges

- Texte lisible dans le clip : toujours déformé. Titre et logo se posent au montage.
- Écran d'appareil : « écran éteint ou flou », la vraie capture s'incruste ensuite.
- Mains qui tapent, foule, combat : plans courts ou évités.
- Personne récurrente : `clapova:personnages`, pas une description différente à chaque plan.
- Plans illustratifs d'un script entier : `generate_broll` (`dryRun:true` d'abord) plutôt qu'un `generate_video` par phrase.
- « Recopie cette vidéo en prompt » : décrire une vidéo source plan par plan passe par `clapova:recreer-depuis-reference` (`extract_frames` mode `sceneChanges`, puis un prompt de mouvement par plan) ; ne devine pas une vidéo que tu n'as pas vue.

## Critères de fin

Prompt de moins de 110 mots, un mouvement, formulation positive, image de contrôle regardée via `render_preview_frames` (ou « non vérifié » dit clairement), coût de chaque essai annoncé en une ligne (lu dans le retour de l'outil), au plus 2 régénérations par plan avant de proposer une autre approche (image fixe animée, stock, motion).
