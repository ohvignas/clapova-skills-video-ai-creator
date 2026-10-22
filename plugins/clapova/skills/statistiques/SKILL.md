---
name: statistiques
description: Use when a Clapova user asks how their posts perform, what works, views, engagement, best network or best time, or wants learnings for the next content.
---

# Clapova : statistiques et apprentissages

Outils MCP : `get_statistics`, `get_post_stats`, `get_calendar`.

1. `get_statistics({ fromDay, toDay, network? })` (défaut 28 jours) : totaux, période précédente, par réseau, par post, vues par jour.
2. `get_post_stats` pour le détail d'un post.
3. Restituez : 3 chiffres clés avec l'évolution (en %), le top 3 des posts et ce qu'ils ont en commun (accroche, durée, format, heure), le réseau qui porte la croissance.
4. Terminez par 2 ou 3 apprentissages actionnables, puis proposez d'en faire le prochain contenu (`clapova:publication-calendrier`).

Ne pas inventer de chiffres : si `posts` est vide, dites qu'il n'y a pas encore de données et proposez de connecter un réseau.
