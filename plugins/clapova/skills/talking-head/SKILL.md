---
name: talking-head
description: Use when a Clapova user wants a video of a person talking to the camera ("talking head", "vidéo où je parle", "présentateur", "témoignage", "mon avatar présente le produit", "monte ma vidéo face caméra") — script written for speech, recut of the user's own footage (silences, fillers, captions, reframe, b-roll every 4 to 6 s) or a generated presenter with a Personnage and a voice, with a face and lip check on real frames.
---

# Clapova : vidéo face caméra (talking head)

Deux voies. **A : les rushes de l'utilisateur** (recommandé, rendu le plus authentique). **B : un présentateur généré** avec un Personnage (`clapova:personnages`), voix et vidéo générées ; la synchronisation des lèvres dépend du modèle : le catalogue contient un modèle de lipsync (sync.so, qui recale la bouche d'une vidéo sur un audio) mais il n'est pas choisi automatiquement ; vérifie `list_models` / `list_model_params`, et si aucun modèle listé ne l'annonce pour ton cas, dis clairement que la synchro labiale n'est pas garantie et propose la voie A.

## Méthode commune

0. **Guides** : `get_guide('montage')` puis `get_guide('motion')`. Vidéo « dans le style de » une autre : `clapova:recreer-depuis-reference`.
1. **Brief** : sujet, public, plateforme, durée (20 à 60 s en vertical), promesse. `get_credits`, puis `estimate_plan` et total annoncé en une ligne avant toute voie B (voix, clips, personnage entraîné) ou tout `analyze_rushes`.
2. **Script oral** : phrases courtes, 150 mots par minute au plus, une idée par phrase, accroche en première phrase, chute et appel à l'action. N'allonge pas pour remplir : le débit s'accélère sinon. Pas de « Bonjour » en ouverture.

## Voie A : rushes existants

3. **Importer** : `list_media` ou `create_upload_link` (`clapova:utiliser-clapova`).
4. **Dérusher** : `analyze_rushes({projectId, minSilence?, keepSilence?, cutFillers:true, cutRepetitions:true})` (≈ 1 crédit/min), puis l'op `cut_ranges` ; garde 0,12 s avant et 0,18 s après chaque phrase.
5. **Cadrer** : `frame_subject` détecte le visage et sert d'ancre au zoom (il ne recadre pas un rush 16:9 en 9:16 tout seul : ancre-le puis `add_effect` avec `params:{zoom, cibleX, cibleY}`, ou `set_subject`). Cible : visage dans le tiers supérieur, yeux à 35 à 40 % de la hauteur, vérifié sur `render_preview_frames` (regarde l'image, pas de mesure automatique). Plan large puis serré toutes les 4 à 6 s pour relancer (`add_effect` `camera-zoom-punch` de 6 à 10 %).
6. **B-roll** : une image de couverture toutes les 4 à 6 s sur le nom ou le verbe de la phrase (`generate_broll` avec `dryRun:true`, ou la Bibliothèque), la voix reste celle du locuteur.
7. **Sous-titres** : `add_captions` look `pop` ou `propre`, hors du visage (`clapova:sous-titres-styles`).

## Voie B : présentateur généré

3. **Identité** : `list_characters` puis `create_character` (lien de confirmation, consentement) ; jamais une personne réelle autre que l'utilisateur ni une célébrité.
4. **Voix** : `generate_voice_with_character` ou `generate_voiceover` (nombres en lettres). Une voix, un script, aucun chevauchement.
5. **Plan test** : un seul plan (`generate_with_character`, `type:"video"`), extrais une image, vérifie visage et bouche ; fidèle, alors la série (jamais plus de 10 s par clip, `continue_video` pour prolonger).
6. Assemble voix et clips sur la timeline (`clapova:monteur`), `set_volume` du son natif à 0 si la voix de Clapova prime.

## Son, contrôle, livraison

- Voix à 1 ; musique facultative mais recommandée : si présente, posée de 0 à la dernière image (`add_clip{start:0, duration:<durée totale>}`), clip à 0,5, `set_duck` niveau 0,5, fondu final ; bruitages rares.
- `check_composition`, `render_preview_frames` (1re image, un plan serré, un b-roll, le CTA), `review_montage` jusqu'à `stop:true` (9/10 ou 3 tours).
- Export après accord ; `videoUrl`, `studioUrl`, message de félicitations original avec un emoji, crédits.

## Pièges

- Yeux ou bouche déformés sur un plan généré : régénère ce plan seul.
- Coupe au milieu d'un mot ; jump cut sans respiration.
- Sous-titres sur le menton ou le front.
- Script lu trop vite : raccourcis le texte au lieu d'accélérer.
- Demande d'avatar d'une célébrité ou d'une personne réelle autre que l'utilisateur : refuse en une phrase (« Je ne peux pas recréer une personne réelle sans son accord, mais je peux créer un présentateur original ou utiliser ton propre visage. ») et propose un Personnage original.
- Voix clonée de l'utilisateur : `generate_voice_with_character` est une voix synthétique, pas un clone ; dis-le.

## Critères de fin

Script court validé, coupes propres, relance visuelle toutes les 4 à 6 s, visage net sur la planche, sous-titres fidèles, son contrôlé, `review_montage` à `stop:true`, lien final selon `clapova:monteur` (Livraison finale).
