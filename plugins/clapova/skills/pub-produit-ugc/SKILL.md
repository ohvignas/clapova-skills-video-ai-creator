---
name: pub-produit-ugc
description: Use when a Clapova user wants a product video ad or UGC-style ad ("fais une pub pour mon produit", "vidéo UGC", "pub TikTok / Reels pour ma boutique", "démo produit en vidéo", "unboxing") from a product photo, page or description — angle, hook, shot list, product-faithful clips, voiceover, captions, music over the whole duration, CTA, export and final link, using the ugc-ad / unboxing / cinematic-product-demo templates. For still images only use clapova-product-photoshoot.
---

# Clapova : publicité produit et UGC

Une pub qui convertit = une promesse claire dans les 3 premières secondes, le produit visible tôt, une preuve, un appel à l'action. Aucune allégation inventée.

## Méthode

0. **Guides** : `get_guide('montage')`, `get_guide('motion')` et `get_guide('storyboard')` lus en entier avant d'agir (le montage et l'export les exigent).
1. **Entrées** : produit (photo nette ou URL de page via `fetch_url`), public, plateforme, offre, durée (15 à 30 s), marque (`get_brand_kit`). Une seule question à la fois, seulement si l'info manque. `get_credits` d'abord, puis `estimate_plan` (ou `estimate_storyboard` une fois le storyboard écrit) sur l'ensemble : 4 à 8 clips vidéo, voix, musique, sous-titres. Annonce le total en une ligne et attends l'accord avant la 1re génération. Budget serré ou solde insuffisant : propose une version économique dans la même annonce (`intent:"cheap"`, 2 à 3 clips, packshot animé en montage au lieu de clips générés, musique de la Bibliothèque `list_library`). Photo ou vidéo du produit jointe par l'utilisateur : `create_upload_link({expectedKind})`, puis `get_upload_status` jusqu'à `done` (une URL https publique : `import_media_from_url`). **Projet** : `create_project({title, aspectRatio, style?})` AVANT toute génération, au format de la plateforme (9:16 pour TikTok, Reels, Shorts ; 1:1 ou 4:5 pour un fil ; le format se fixe ici et `apply_template` exige ce projet vide) ; passe ensuite `projectId` dans chaque `generate_*` pour ranger les clips dedans (sinon `add_media_to_project`). Pub « comme celle-ci » (lien YouTube ou fichier) : `clapova:recreer-depuis-reference`, qui livre la recette (structure et rythme) à suivre ici ; jamais de copie.
2. **Angle** : une phrase « [public] veut [résultat] sans [frein], grâce à [produit] ». Les chiffres, prix et « gratuit » viennent de l'utilisateur ou sont marqués [à confirmer].
3. **Modèle de départ** : `list_templates` puis `get_template_recipe` pour `ugc-ad` (main tenue, nom du créateur, sous-titres pop), `unboxing` ou `cinematic-product-demo`.
4. **Storyboard** (plus d'un plan) : `clapova:storyboard`, arc problème, solution, preuve, appel ; accord avant génération.
5. **Accroche** : plusieurs formules possibles (`get_creative_recipes({topic:"hooks"})`) ; pour comparer, `clapova:test-accroches`.
6. **Plans produit fidèles** : `generate_video` avec `imageUrl` = la photo du produit et un prompt de mouvement seul (`clapova:prompts-video`), un preset par plan (`handheld`, `push-in`, `orbit`). Produit qui dévie : 2 régénérations au plus, puis packshot (`generate_image` avec la photo en référence) animé en montage (`add_effect`). Personne à l'écran : Personnage (`clapova:personnages`, `generate_with_character`) ou plans sans visage (mains, silhouette). Fond du produit à nettoyer : `cutout_subject`. Contrôle de fidélité des clips générés avant le montage : `extract_frames` ne renvoie pas d'images en MCP ; pose chaque clip dans le projet (`projectId` à la génération) et regarde `render_preview_frames` dès qu'ils sont en timeline, sinon dis « non vérifié visuellement ».
7. **Voix et texte** : `generate_voiceover` (phrases courtes, 2,3 mots par seconde de plan au plus ; voix française : `list_model_params({endpointId, language:"fr"})` puis `params.voice`) ou, pour caler une phrase par plan, `generate_voiceover_lines({projectId, script, dryRun:true})` d'abord ; texte à l'écran de 6 mots au plus, jamais la voix mot pour mot.
8. **Montage** : `get_timeline` d'abord, puis tout se règle dans UN `apply_edit_plan` (`set_duck`, `add_effect`, `add_sfx` sont des ops de ce lot, pas des outils séparés) ; `plan_shots` cale les coupes sur la musique. `apply_template({projectId, templateId, mediaIds, voiceoverMediaId, musicMediaId, texts, brand})` dans un projet vide, ou `create_from_template` depuis des URL. Sous-titres : `add_captions` look `pop` (`clapova:sous-titres-styles`). Logo : jamais dans les 3 premières secondes, en signature à la fin.
9. **Son** : musique générée (`generate_music` à la durée totale, sans paroles ; la durée n'est pas garantie, vérifie-la avec `get_media_info` : trop courte, second `add_clip` du même média à la suite (boucle) ou nouveau morceau, `check_composition` signale « musique trop courte ») posée de 0 à la fin (`add_clip`), clip à 0,5, `set_duck` niveau 0,5, `set_fades{fadeOut:1}` sur la dernière seconde ; bruitages légers (`add_sfx` `volume` 0,18, ou `place_sfx_from_events`) : pop ou clic sur les apparitions, whoosh sur les coupes fortes seulement.
10. **Contrôle** : `check_composition`, puis `render_preview_frames` (accroche, produit, preuve, CTA) : regarde CHAQUE image une par une (texte hors des 20 % du bas et des coins, cadre rempli), corrige tant qu'une note est sous 8/10, puis `review_montage` jusqu'à `stop:true` (9/10 ou 3 tours).
11. **Export** : accord sur le coût, `export_video` preset de la plateforme, puis `get_render_status` jusqu'à `done` (c'est lui qui renvoie `videoUrl` et `studioUrl`). Déclinaisons : `clapova:declinaison-formats`.

## Pièges

- Produit qui change de forme ou d'étiquette d'un plan à l'autre.
- Texte, prix ou logo générés par le modèle : à poser en montage.
- Promesse santé, éco ou gain de temps sans source.
- Plus de 60 % de plans générés : mélange avec captures réelles, motion et packshot.

## Critères de fin

Accroche avant 3 s, produit net et identique d'un plan à l'autre, CTA tenu 3 s, musique de la première à la dernière image, planche regardée. Livraison : `videoUrl` et `studioUrl`, message de félicitations original avec un emoji, durée, format, crédits dépensés.
