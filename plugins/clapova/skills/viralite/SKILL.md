---
name: viralite
description: Use when a Clapova user wants to know if a short video will perform, get a virality score, improve the hook, retention or pacing of a video before posting ("est-ce que ça va marcher", "note ma vidéo", "améliore mon accroche") with analyze_virality on TikTok, Reels or Shorts, then apply the corrections in the edit and re-analyze. Billed in credits.
---

# Clapova : analyse de viralité

Outil MCP : `analyze_virality({videoUrl, platform?})` avec `platform` parmi `tiktok`, `reels`, `shorts` (facturé en crédits). Il faut un lien https de la vidéo exportée (`videoUrl` de `get_render_status`).

## Méthode

1. Vidéo exportée ? Sinon `clapova:monteur` d'abord. `get_credits`, puis `analyze_virality`.
2. Restitue le score, les 2 points forts et les 3 corrections prioritaires, chacune avec l'instant (en secondes) et l'action concrète.
3. Corrige dans le projet (`clapova:monteur`) : une seule passe `apply_edit_plan` ; l'accroche (0 à 1,5 s) d'abord (`clapova:montage-recipes`), puis rythme, sous-titres, son.
4. Contrôle gratuit avant de ré-analyser : `check_composition` et `render_preview_frames`. Réexporte, relance `analyze_virality` une seule fois pour confirmer le gain.
5. Sous 70/100 après correction : dis-le franchement et propose des variantes d'accroche (`clapova:test-accroches`).

## Pièges

- Le score est une estimation, pas une promesse : ne garantis jamais des vues.
- Analyser un brouillon : analyse le rendu final, sinon la note ne vaut rien.
- Corriger tout en même temps sans relire la planche d'images.

## Critères de fin

Score avant et après, 3 corrections appliquées avec leur instant, crédits dépensés, lien de la vidéo corrigée avec un mot de félicitations si elle est prête à publier (`clapova:publication-calendrier`).
