---
name: shorts-depuis-video-longue
description: Use when a Clapova user wants Shorts, Reels or TikToks cut from a long video (podcast, interview, webinar, YouTube video, live replay) — "sors-moi des shorts de cette vidéo", "trouve les meilleurs moments" — picking the best moments, one 9:16 project per short, subject framing, styled captions, animated title, music, check and export with the platform preset.
---

# Clapova : Shorts depuis une vidéo longue

## Méthode

1. **Source** : `list_media` / `list_projects` ; fichier local volumineux : `create_upload_link` puis `get_upload_status` (voir `clapova:utiliser-clapova`). `get_credits` d'abord.
2. **Moments** : transcris avec `analyze_rushes` (≈ 1 crédit/min ; la transcription est conservée, donc gratuite ensuite pour les sous-titres). Repère 3 à 6 moments autonomes de 15 à 45 s : une idée complète, une accroche dans les 3 premières secondes, une fin nette (opinion tranchée, histoire, chiffre, révélation). `analyze_virality` peut classer des candidats déjà exportés. Présente la liste (début, fin, accroche, pourquoi) et attends l'accord avant de couper.
3. **Un projet 9:16 par short** : `create_project` (9:16), source posée avec `add_clip{mediaId, trimIn, duration}` aux temps exacts. Coupe à la fin de phrase : 0,3 s d'air avant et après, jamais au milieu d'un mot.
4. **Cadrer** : `frame_subject` pour garder le locuteur rempli dans le cadre vertical, élément fort dès la 1re image ; plusieurs locuteurs : un cadrage par prise de parole.
5. **Accroche** : reformule les 3 premières secondes (texte de 5 mots au plus, `add_text` ou `add_motion_block`) sans trahir le sens ; formules : `get_creative_recipes({topic:"hooks"})`.
6. **Sous-titres** : `add_captions` look `pop`, 3 mots par page, tiers central (`clapova:sous-titres-styles`).
7. **Titre animé** : un bloc motion court (`add_motion_block`), contraste du texte secondaire au moins `#B8B8C4`.
8. **Son** : voix à 1 ; musique facultative mais, si présente, sur toute la durée du short, clip à 0,5, `set_duck` niveau 0,5, fondu de sortie ; bruitages légers (un par 2 s au plus).
9. **Contrôle** : `check_composition`, puis `render_preview_frames` (accroche, coupes, titre, dernière image) et regarde la planche.
10. **Export** : `export_video` avec le preset de la plateforme (`tiktok`, `reels`, `shorts`), seulement après accord sur le coût ; lance les shorts à la suite sans attendre chaque export.

## Pièges

- Moment qui dépend d'un contexte absent (« comme je disais ») : écarte-le.
- Reframe qui coupe le front ou les mains qui parlent : revérifie sur une image.
- Sous-titres qui se chevauchent avec un titre : `until` ou titre en zone haute.
- Une phrase coupée net à l'export : vérifie la dernière image et le dernier mot.

## Critères de fin

Chaque short a : accroche lisible, sujet cadré, sous-titres fidèles, musique/son contrôlés, planche regardée. Livraison : pour chaque short `videoUrl` et `studioUrl`, un message de félicitations original avec un emoji (🎉, 🔥), puis trois lignes : exportés, échoués, crédits dépensés.
