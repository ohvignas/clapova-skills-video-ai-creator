---
name: viralite
description: Use when a Clapova user wants to know if a short video will perform, get a virality score, improve the hook, retention or pacing of a video before posting ("est-ce que ça va marcher", "note ma vidéo", "améliore mon accroche") with analyze_virality on TikTok, Reels or Shorts, then apply the corrections in the edit and re-analyze. Billed in credits.
---

# Clapova : analyse de viralité

Outil MCP : `analyze_virality({videoUrl, platform?})` avec `platform` parmi `tiktok`, `reels`, `shorts` (facturé en crédits). Il faut un lien https de la vidéo exportée (`videoUrl` de `get_render_status`). Vidéo externe (fichier envoyé, pas un lien YouTube/TikTok qui ne s'importe pas) : `create_upload_link` ou `import_media_from_url` (fichier https direct), puis le lien du média. Lis `get_guide('viralite')` avant d'agir. Le coût n'est pas chiffrable par `estimate_plan` : lis-le dans la description de l'outil et annonce-le tel quel. Moins cher avant d'exporter : `review_montage` sur le projet (1 crédit, `vision:false` gratuit) renvoie déjà un score de viralité /100 avec corrections prêtes et le score d'accroche des 3 premières secondes.

## Méthode

1. Vidéo exportée ? Sinon `clapova:montage` d'abord. Lien YouTube/TikTok d'une vidéo publiée : il ne s'importe pas ; propose `analyze_reference_video` (lecture structurelle : plans, accroche, rythme, CTA) ou demande le fichier. `get_credits`, puis annonce le total en une ligne (première analyse + réexport + seconde analyse, trois postes facturés) et attends l'accord, surtout au premier export. Puis `analyze_virality`.
2. Restitue le score, les 2 points forts et les 3 corrections prioritaires, chacune avec l'instant (en secondes) et l'action concrète. La réponse peut être plus pauvre (score et peu de corrections) : rapporte ce qui est renvoyé, n'invente ni sous-score ni seconde.
3. Corrige dans le projet (`clapova:montage`, qui impose `get_guide('montage')` puis `get_guide('motion')` lus avant le réexport : sinon `export_video` est refusé) : une seule passe `apply_edit_plan` (`get_timeline` avant ; musique sur toute la durée, son léger et contrôle image par image restent obligatoires : règles de `clapova:montage`) ; l'accroche (0 à 1,5 s) d'abord (`clapova:montage`), puis rythme, sous-titres, son.
4. Contrôle gratuit avant de ré-analyser : `check_composition`, `render_preview_frames` et `review_montage`. Réexporte, relance `analyze_virality` une seule fois pour confirmer le gain.
5. Seuil 70/100 (le même que celui des automatisations de Clapova) : sous ce seuil après correction, dis-le franchement et propose des variantes d'accroche (`clapova:test-accroches`). Si le score baisse après correction, aucun outil MCP ne restaure un état : donne à l'utilisateur le `snapshotId` du lot (annuler dans l'éditeur) et réexporte la version précédente, dis-le franchement.

## Pièges

- Le score est une estimation, pas une promesse : ne garantis jamais des vues.
- Analyser un brouillon : analyse le rendu final, sinon la note ne vaut rien.
- Corriger tout en même temps sans relire la planche d'images.

## Critères de fin

Score avant et après, 3 corrections appliquées avec leur instant, crédits dépensés, lien de la vidéo corrigée avec un mot de félicitations si elle est prête à publier (`clapova:publication-calendrier`).
