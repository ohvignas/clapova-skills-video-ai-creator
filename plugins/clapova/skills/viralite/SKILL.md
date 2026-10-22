---
name: viralite
description: Use when a Clapova user wants to know if a video will perform, get a virality score, improve the hook, retention or pacing of a short video before posting.
---

# Clapova : analyse de viralité

Outil MCP : `analyze_virality` (facturé en crédits).

1. `analyze_virality({ videoUrl, platform? })` : score global, scores par catégorie (accroche, rythme, son, texte, appel à l'action), courbe de rétention estimée.
2. Restituez le score, les 2 points forts et les 3 corrections prioritaires, chacune avec l'instant (en secondes) et l'action.
3. Proposez d'appliquer les corrections dans le projet (`clapova:monteur`), puis de relancer l'analyse.
