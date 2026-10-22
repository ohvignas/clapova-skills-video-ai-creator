---
name: model-catalog
description: Use when a Clapova user asks which AI model to use, what a generation costs, which models their plan allows, or to compare image, video, voice and music models before generating.
---

# Clapova : catalogue de modèles

Outils MCP : `list_models`, `pick_best_model`, `estimate_plan`, `get_credits`. Ressource : `clapova://models/catalog`.

1. `get_credits` : solde (gratuit du jour, mensuel, acheté) et plan (`free`, `decouverte`, `createur`, `studio`).
2. `list_models` avec le type (image, vidéo, voix, musique) : modèles permis par le plan, prix en crédits, points forts.
3. `pick_best_model` pour un brief précis ; `estimate_plan` pour un lot (plus de 3 générations) avant de lancer.
4. Les outils `generate_*` choisissent déjà le meilleur modèle abordable : ne forcez un modèle que si l'utilisateur le demande.
5. `intent` : `value` (défaut), `quality` seulement si l'utilisateur veut du premium, `cheap`, `speed`.

Réponse : un tableau court (modèle, crédits, pour quoi), puis une recommandation. Un modèle hors plan : dites quel plan le débloque, sans insister.
