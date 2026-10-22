---
name: declinaison-formats
description: Use when a finished Clapova edit must ship in several formats or platforms ("fais la version 9:16", "adapte pour LinkedIn en carré", "version YouTube 16:9", "décline en Reels, Shorts et TikTok") — one project per aspect ratio, reframe on the subject, move titles out of platform UI zones, captions look per format, cover image, check and export with the right preset.
---

# Clapova : déclinaison en plusieurs formats

Le format (16:9, 9:16, 1:1, 4:5) est fixé à la création du projet : décliner = créer un projet par format et y recopier le montage.

## Méthode

1. **Master** : `get_timeline` du projet terminé. `get_credits` et liste des formats voulus.
2. **Specs** : `get_creative_recipes({topic:"platforms"})` (formats, durée idéale, zone basse libre) et `clapova:montage-recipes` (formats réseaux).
3. **Un projet par format** : `create_project({title, aspectRatio})`, puis `apply_edit_plan` en un lot (`add_clip` aux mêmes temps, mêmes voix et musique). Le montage original reste intact.
4. **Recadrer** : `frame_subject` pour garder le sujet plein cadre ; sujet mobile : `track_motion` ; zoom sur la zone utile avec `add_effect` (`params:{zoom, cibleX, cibleY}`). 16:9 vers 9:16 : un cadrage par plan, jamais un simple recadrage central.
5. **Titres et sous-titres** : refais-les pour le nouveau cadre (`set_motion`/`add_text` en zone sûre : rien dans les 20 % du bas ni les coins en vertical) ; `add_captions` look `pop` en vertical, `propre` en 16:9 ou 1:1 (`clapova:sous-titres-styles`).
6. **Durée** : Shorts 20 à 50 s, TikTok 15 à 35 s, Reels 10 à 30 s. Plus long ? Garde l'accroche et le meilleur, coupe le reste (`trim_clip`, `cut_ranges`).
7. **Couverture** : `extract_thumbnail` (gratuit) ou `generate_image` selon `clapova:youtube-thumbnail`.
8. **Contrôle** : `check_composition`, `render_preview_frames` par format (accroche, un titre, CTA), puis `review_montage`.
9. **Export** : `export_video` avec le preset (`tiktok`, `reels`, `shorts`, `youtube`) après accord sur le coût total (annoncé : somme des formats).

## Pièges

- Texte du master resté aux coordonnées de l'ancien format : coupé ou dans l'interface.
- Musique plus longue que la version raccourcie : refaire la fin (fondu 1 s) et le ducking.
- Plans larges illisibles en vertical : remplace-les par un plan serré ou un zoom.
- Exporter tous les formats avant d'avoir vu la planche de chacun.

## Critères de fin

Un projet par format, planche vue pour chacun, musique couvrant toute la durée de chaque version, preset adapté. Livraison : pour chaque format `videoUrl` et `studioUrl`, un message de félicitations original avec un emoji, crédits totaux.
