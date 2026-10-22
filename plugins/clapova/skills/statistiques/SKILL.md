---
name: statistiques
description: Use when a Clapova user asks how their posts perform, what works, views, engagement, best network or best posting time, or wants learnings and a plan for the next content ("mes stats", "qu'est-ce qui marche", "pourquoi cette vidéo a flop") with get_statistics, get_post_stats and get_calendar. Never invents numbers.
---

# Clapova : statistiques et apprentissages

Outils MCP : `get_statistics`, `get_post_stats`, `get_calendar`, `list_social_accounts`.

## Méthode

1. `get_statistics({fromDay, toDay, network?})` (défaut 28 jours) : totaux, période précédente, par réseau, par post, vues par jour.
2. `get_post_stats` pour le détail d'un post (le meilleur et le pire).
3. Restitue : 3 chiffres clés avec l'évolution en %, le top 3 des posts et ce qu'ils ont en commun (accroche, durée, format, heure, sujet), le réseau qui porte la croissance.
4. Compare le pire post au meilleur : une hypothèse précise (accroche, durée, créneau) plutôt qu'un jugement.
5. Termine par 2 ou 3 apprentissages actionnables, puis propose d'en faire le prochain contenu (`clapova:publication-calendrier`) ou de tester plusieurs accroches (`clapova:test-accroches`).

## Pièges

- `posts` vide : dis qu'il n'y a pas encore de données et propose de connecter un réseau ; n'invente jamais un chiffre.
- Échantillon de moins de 5 posts : écris « tendance à confirmer ».
- Corrélation ≠ cause : formule une hypothèse à tester, pas une certitude.

## Critères de fin

Trois chiffres exacts avec leur période, un top 3, deux ou trois actions datées, une proposition de contenu suivante.
