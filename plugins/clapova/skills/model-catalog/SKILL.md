---
name: model-catalog
description: Use when a Clapova user asks which AI model to use, what a generation costs in credits, which models their plan allows, or to compare image, video, voice and music models before generating ("quel modèle", "combien ça coûte", "le moins cher", "le meilleur pour…") with get_credits, list_models, list_model_params, pick_best_model, estimate_plan. Not to generate (clapova-generate).
---

# Clapova : catalogue de modèles et coûts

Outils MCP : `get_credits`, `list_models`, `list_model_params`, `pick_best_model`, `estimate_plan`. Ressource : `clapova://models/catalog`.

## Méthode

1. `get_credits` : solde (gratuit du jour, mensuel, acheté) et plan (`free`, `decouverte`, `createur`, `studio`).
2. `list_models` avec le type (image, vidéo, voix, musique) : modèles permis par le plan, prix en crédits, points forts.
3. `pick_best_model` pour un brief précis ; `list_model_params` pour les réglages d'un modèle (durées, formats, bornes) ; `estimate_plan` pour un lot (plus de 3 générations) avant de lancer.
4. Les outils `generate_*` choisissent déjà le meilleur modèle abordable : ne force un modèle que si l'utilisateur le demande.
5. `intent` : `value` (défaut), `quality` seulement si l'utilisateur veut du premium, `cheap`, `speed`.
6. Prompt adapté au modèle retenu : `clapova:prompts-video`.

## Réponse

Un tableau court (modèle, crédits, durée ou format, pour quoi), puis une recommandation en une phrase. Un modèle hors plan : dis quel plan le débloque, sans insister, et propose l'alternative la plus proche.

## Pièges

- Les prix sont ceux de l'outil, jamais ceux de ta mémoire : relis `list_models` à chaque demande.
- Une vidéo de 10 s coûte bien plus qu'une image : propose de valider l'idée en image d'abord.
- Résolution 1440p, 4K et 60 fps : options d'export de plans payants, pas de génération.

## Critères de fin

Solde annoncé, coût du besoin chiffré en crédits (total pour un lot), modèle recommandé avec sa raison, aucune génération lancée sans demande.
