---
name: declinaison-formats
description: Use when a finished Clapova edit must ship in several formats or platforms ("fais la version 9:16", "adapte pour LinkedIn en carré", "version YouTube 16:9", "décline en Reels, Shorts et TikTok") — one project per aspect ratio, reframe on the subject, move titles out of platform UI zones, captions look per format, cover image, check and export with the right preset.
---

# Clapova : déclinaison en plusieurs formats

Le format (16:9, 9:16, 1:1, 4:5) est fixé à la création du projet : décliner = créer un projet par format et y recopier le montage.

## Méthode

0. **Guides** : `get_guide('montage')` puis `get_guide('motion')`.
1. **Master** : `get_timeline` du projet terminé. `get_credits` et liste des formats voulus ; annonce le coût total (somme des `frame_subject` à 1 crédit par plan, jusqu'à 12 plans, et des exports) et attends l'accord avant de commencer.
2. **Specs** : `get_creative_recipes({topic:"platforms"})` (formats, durée idéale, zone basse libre) et `clapova:montage` (formats réseaux).
3. **Un projet par format** : `create_project({title, aspectRatio})`, puis `apply_edit_plan` en un lot. `add_clip` ne copie que les médias : titres, blocs motion, sous-titres, effets et bruitages du master ne se recopient pas tout seuls. Relis chaque élément dans `get_timeline` et recrée-le avec ses ops (`add_text`, `add_block`, `add_effect`, `add_sfx`, `set_duck`) aux bons temps ; les sous-titres se refont avec `add_captions`. Le montage original reste intact (rien à supprimer dans le master). Gabarit : UN seul `apply_edit_plan` par projet (150 ops au plus), avec tous les `add_clip` aux temps du `get_timeline` du master (`ref:` pour les viser), puis les titres, blocs, effets et bruitages dans le même lot ; ne fais pas un appel par élément (5 formats = 5 lots, pas des dizaines d'appels).
4. **Recadrer** : `frame_subject` pour garder le sujet plein cadre ; sujet mobile : `track_motion` ; zoom sur la zone utile avec `add_effect` (`params:{zoom, cibleX, cibleY}`). 16:9 vers 9:16 : un cadrage par plan, jamais un simple recadrage central.
4b. **Son à la recopie** : voix à 1, musique clip à 0,5 avec `set_duck` niveau 0,5, bruitages `volume` 0,18 par défaut (0,12 à 0,25), un par 2 s au plus. Même musique de 0 à la fin de la version ; si la version est plus longue que le morceau, boucle ou `generate_music` à la durée voulue, fondu final 1 s.
5. **Titres et sous-titres** : refais-les pour le nouveau cadre (`set_motion`/`add_text` en zone sûre : rien dans les 20 % du bas ni les coins en vertical) ; `add_captions` look `pop` en vertical, `propre` en 16:9 ou 1:1 (`clapova:motion-sous-titres`).
6. **Durée** : Shorts 20 à 50 s, TikTok 15 à 35 s, Reels 10 à 30 s. Plus long ? Propose à l'utilisateur ce que tu gardes (accroche, meilleurs passages) et attends son accord avant de couper (`trim_clip`, `cut_ranges`) ; recale ensuite la musique (fondu 1 s en fin) et le ducking.
7. **Couverture** : `extract_thumbnail` (gratuit) ou `generate_image` selon `clapova:youtube-thumbnail`.
8. **Contrôle** : `check_composition`, `render_preview_frames` par format (accroche, un titre, CTA), puis `review_montage`.
9. **Export** : `export_video` avec le preset (`tiktok`, `reels`, `shorts`, `youtube` ; LinkedIn 1:1 ou 4:5 : `standard`, il n'y a pas de preset dédié) après accord sur le coût total (annoncé : somme des formats). Un format échoue : dis-le, relance celui-là seul, ne bloque pas les autres.

## Pièges

- Texte du master resté aux coordonnées de l'ancien format : coupé ou dans l'interface.
- Musique plus longue que la version raccourcie : refaire la fin (fondu 1 s) et le ducking.
- Plans larges illisibles en vertical : remplace-les par un plan serré ou un zoom.
- Exporter tous les formats avant d'avoir vu la planche de chacun.
- 16:9 vers 9:16 avec texte incrusté ou blocs motion en coordonnées absolues : ne les copie pas, refais-les dans le nouveau cadre (la zone sûre change). Style par format : `style` de `plan_shots` / `review_montage`.
- Musique du master : `add_clip` de la même musique de 0 à la fin de la version, `set_duck` niveau 0,5, `set_fades{fadeOut:1}`.

## Critères de fin

Un projet par format, planche vue pour chacun, musique couvrant toute la durée de chaque version, preset adapté. Livraison : pour chaque format `videoUrl` et `studioUrl`, un message de félicitations original avec un emoji, crédits totaux.
