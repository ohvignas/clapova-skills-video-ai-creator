---
name: publication-calendrier
description: Use when a Clapova user wants to publish, schedule or plan social posts (TikTok, Instagram, Facebook, YouTube, LinkedIn, X), see the editorial calendar, or prepare a week of content.
---

# Clapova : publication et calendrier

Outils MCP : `get_calendar`, `list_social_accounts`, `generate_social_post`, `publish_post`, `create_automation`, `get_brand_kit`.

1. `list_social_accounts` : réseaux connectés. Un compte `reconnect` ou absent : l'utilisateur le connecte dans Clapova, page Connecteurs. Sans compte, le post reste publiable à la main (bouton Publier).
2. `get_calendar` (62 jours au plus) : posts planifiés, publiés, exécutions d'agents récurrents. Évitez deux posts au même créneau sur le même réseau.
3. Texte : `generate_social_post({ platform, title, description })` (facturé), dans le ton de `get_brand_kit`.
4. `publish_post({ network, mediaId | videoUrl, caption, hashtags, scheduledAt: "AAAA-MM-JJTHH:MM" })`, heure de Paris. Hashtags sans `#`.
5. Le post attend TOUJOURS la validation de l'utilisateur dans Clapova. Ne dites jamais qu'il est en ligne. Publication directe : 1 crédit au départ. Plan Gratuit : filigrane Clapova.
6. Série récurrente (« chaque lundi ») : `create_automation`, chaque exécution consomme des crédits.

Toujours montrer le plan (date, réseau, visuel, texte) et attendre l'accord avant `publish_post`.
