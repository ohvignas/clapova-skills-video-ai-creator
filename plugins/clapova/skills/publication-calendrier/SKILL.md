---
name: publication-calendrier
description: Use when a Clapova user wants to publish, schedule or plan social posts (TikTok, Instagram, Facebook, YouTube, LinkedIn, X), see the editorial calendar, write captions and hashtags, set up a recurring series, or prepare a week of content — with list_social_accounts, get_calendar, generate_social_post, publish_post, create_automation. Posts always wait for the user's validation in Clapova.
---

# Clapova : publication et calendrier

Outils MCP : `list_social_accounts`, `get_calendar`, `get_brand_kit`, `generate_social_post`, `publish_post`, `create_automation`, `get_post_stats`.

## Méthode

1. `list_social_accounts` : réseaux connectés. Compte `reconnect` ou absent : l'utilisateur le connecte dans Clapova (page Connecteurs). Sans compte, le post reste publiable à la main (bouton Publier).
2. `get_calendar` (62 jours au plus) : posts planifiés, publiés, exécutions d'agents récurrents. Pas deux posts au même créneau sur le même réseau.
3. **Média** : une vidéo exportée (lien `videoUrl` ou `mediaId`). Pas encore montée : `clapova:monteur`. `analyze_virality` (`clapova:viralite`) est payant : annonce le coût, laisse l'utilisateur choisir (planifier 10 posts = 10 analyses) ; sous 70/100, propose les corrections et attends son accord avant de les appliquer.
4. **Texte** : `generate_social_post({platform, title, description})` (facturé), dans le ton de `get_brand_kit`. Accroche dans les 80 premiers caractères, CTA clair, hashtags sans `#` (3 à 5 pertinents, pas 30), `firstComment` pour un lien ou des hashtags secondaires. La mention « Créé avec l'IA » est ajoutée automatiquement par `publish_post` : ne l'écris pas dans la légende.
5. **Plan à montrer** : tableau (réseau, date et heure de Paris, visuel, texte, hashtags). Attends l'accord.
6. `publish_post({network, mediaId | videoUrl, caption, title?, hashtags, scheduledAt:"AAAA-MM-JJTHH:MM"})`, heure de Paris.
7. Série récurrente (action persistante qui dépense des crédits à chaque passage : demande une confirmation explicite avant de la créer) (« chaque lundi ») : `create_automation({name, brief, editorialLine, everyDays, hourParis, monthlyCreditBudget?})` ; chaque exécution consomme des crédits : annonce le budget.

## Règles

- Le post attend TOUJOURS la validation de l'utilisateur dans Clapova. Ne dis jamais qu'il est en ligne.
- Publication directe : 1 crédit au départ. Plan Gratuit : filigrane Clapova sur les exports (vérifie le plan avec `get_credits` avant de l'affirmer).
- Meilleurs créneaux : appuie-toi sur `get_statistics` (`clapova:statistiques`) ; sans historique, utilise `get_creative_recipes({topic:"platforms"})` (`clapova:montage-recipes`).
- Formats et zones sûres par réseau : `clapova:montage-recipes`.

## Pièges

- Fuseau : toujours l'heure de Paris dans `scheduledAt`.
- Légende copiée d'un réseau à l'autre : adapte longueur et ton (LinkedIn plus posé, TikTok plus direct).
- Lien externe dans une légende Shorts ou Reels : peu utile, privilégie la bio.

## Critères de fin

Plan validé, posts créés en attente de validation, rappel en une phrase « validez dans Clapova », crédits engagés annoncés. Pour une campagne : tableau récapitulatif des dates.
