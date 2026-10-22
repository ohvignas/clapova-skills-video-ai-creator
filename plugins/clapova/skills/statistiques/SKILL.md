---
name: statistiques
description: Use when a Clapova user asks how their posts perform, what works, views, engagement, best network or best posting time, or wants learnings and a plan for the next content ("mes stats", "qu'est-ce qui marche", "pourquoi cette vidéo a flop") with get_statistics, get_post_stats and get_calendar. Never invents numbers.
---

# Clapova : statistiques et apprentissages

Outils MCP : `get_statistics`, `get_post_stats`, `get_calendar`, `list_social_accounts`.

## Méthode

1. `get_statistics({fromDay, toDay, network?})` (défaut 28 jours) : totaux, période précédente, par réseau, par post, vues par jour.
2. `get_post_stats({postId})` pour le détail d'un post (le meilleur et le pire) : prends le `postId` dans la réponse de `get_statistics` ou de `get_calendar`, jamais un identifiant inventé. Statut `pending` : les stats se mettent à jour toutes les 6 h, dis-le. Aucun réseau connecté : `list_social_accounts`.
3. Restitue : 3 chiffres clés avec l'évolution en %, le top 3 des posts et ce qu'ils ont en commun (accroche, durée, format, heure, sujet), le réseau qui porte la croissance.
4. Compare le pire post au meilleur : une hypothèse précise (accroche, durée, créneau) plutôt qu'un jugement. « Pourquoi cette vidéo a flop » : pour diagnostiquer le contenu, propose `analyze_virality` ou `review_montage` sur cette vidéo en annonçant le coût ; sinon reste sur la comparaison.
5. Termine par 2 ou 3 apprentissages actionnables, puis fixe les dates des actions avec `get_calendar`, puis propose d'en faire le prochain contenu (`clapova:publication-calendrier`) ou de tester plusieurs accroches (`clapova:test-accroches`).

## Pièges

- `posts` vide : dis qu'il n'y a pas encore de données et propose de connecter un réseau ; n'invente jamais un chiffre.
- Échantillon de moins de 5 posts : écris « tendance à confirmer ». Compare par abonnés et par durée plutôt qu'en vues brutes.
- Corrélation ≠ cause : formule une hypothèse à tester, pas une certitude.

## Critères de fin

Trois chiffres exacts avec leur période, un top 3, deux ou trois actions datées, une proposition de contenu suivante.
