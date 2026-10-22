---
name: model-catalog
description: Use when a Clapova user asks which AI model to use, what a generation costs in credits, which models their plan allows, or to compare image, video, voice and music models before generating ("quel modèle", "combien ça coûte", "le moins cher", "le meilleur pour…") with get_credits, list_models, list_model_params, pick_best_model, estimate_plan. Not to generate (clapova:generate).
---

# Clapova : catalogue de modèles et coûts

Première ligne : `get_guide({topic:'generation'})` (le guide qui porte ce catalogue).

Outils MCP : `get_credits`, `list_models`, `list_model_params`, `pick_best_model`, `estimate_plan`. Ressource : `clapova://models/catalog`.

## Méthode

1. `get_credits` : solde (gratuit du jour, mensuel, acheté) et plan (`free`, `decouverte`, `createur`, `studio`).
2. `list_models` avec le type (image, vidéo, voix, musique) : modèles permis par le plan, prix en crédits, points forts.
3. `pick_best_model` pour un brief précis ; `list_model_params` pour les réglages d'un modèle (durées, formats, bornes) ; `estimate_plan({steps:[{mediaType:"image"|"video"|"music"|"voiceover", count?, intent?, needsImageInput?, aspectRatio?}]})` (12 étapes au plus) pour un lot de plus de 3 générations avant de lancer. Pour un lot mixte, ajoute une étape par type : 3 clips vidéo, 1 voix, 1 musique = 3 étapes. Il ne chiffre que la génération.
4. Les outils `generate_*` choisissent déjà le meilleur modèle abordable : ne force un modèle que si l'utilisateur le demande.
5. `intent` : `value` (défaut), `quality` seulement si l'utilisateur veut du premium, `cheap`, `speed`.
6. Prompt adapté au modèle retenu : `clapova:prompts-video`.

## Total d'un montage complet

Somme honnête : clips générés (`estimate_plan`) + voix (`estimate_plan` type voiceover) + musique (`estimate_plan` type music) + sous-titres (≈ 1 crédit/min) + analyse des rushes éventuelle + `review_montage` avec vision (1 crédit) + export (durée, résolution, fps : description de `export_video`). Le moins cher : médias existants de la Bibliothèque, peu de clips, `intent:"cheap"`, 720p, `vision:false`. Avant de monter : `get_guide('montage')`.

## Réponse

Un tableau court (modèle, crédits, durée ou format, pour quoi), puis une recommandation en une phrase. Les prix sont en crédits Clapova, jamais en euros ; la part « gratuite du jour » de `get_credits` s'ajoute au solde mais ne s'utilise que sur les modèles permis par le plan. Un modèle hors plan : lis `requiredPlan` dans la réponse de `list_models` pour dire quel plan le débloque (n'en devine pas), sans insister, et propose l'alternative la plus proche.

## Pièges

- Les prix sont ceux de l'outil, jamais ceux de ta mémoire : relis `list_models` à chaque demande.
- Une vidéo de 10 s coûte bien plus qu'une image : propose de valider l'idée en image d'abord.
- Un montage entier coûte plus que ses clips : sous-titres (transcription ≈ 1 crédit/min), modèles de montage (`captions` vrai par défaut), analyse des rushes et export (durée, résolution, fps) se facturent en plus ; vérifie la description de chaque outil et annonce un total honnête (`estimate_plan` ne couvre que la génération).
- Résolution 1440p, 4K et 60 fps : options d'export (voir la description de `export_video`), pas de génération.

## Critères de fin

Solde annoncé, coût du besoin chiffré en crédits (total pour un lot), modèle recommandé avec sa raison, aucune génération lancée sans demande.
