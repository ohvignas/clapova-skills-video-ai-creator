---
name: pub-produit-ugc
description: Use when a Clapova user wants a product video ad or UGC-style ad ("fais une pub pour mon produit", "vidéo UGC", "pub TikTok / Reels pour ma boutique", "démo produit en vidéo", "unboxing") from a product photo, page or description — angle, hook, shot list, product-faithful clips, voiceover, captions, music over the whole duration, CTA, export and final link, using the ugc-ad / unboxing / cinematic-product-demo templates. For still images only use clapova-product-photoshoot.
---

# Clapova : publicité produit et UGC

Une pub qui convertit = une promesse claire dans les 3 premières secondes, le produit visible tôt, une preuve, un appel à l'action. Aucune allégation inventée.

## Méthode

1. **Entrées** : produit (photo nette ou URL de page via `fetch_url`), public, plateforme, offre, durée (15 à 30 s), marque (`get_brand_kit`). Une seule question à la fois, seulement si l'info manque. `get_credits` d'abord.
2. **Angle** : une phrase « [public] veut [résultat] sans [frein], grâce à [produit] ». Les chiffres, prix et « gratuit » viennent de l'utilisateur ou sont marqués [à confirmer].
3. **Modèle de départ** : `list_templates` puis `get_template_recipe` pour `ugc-ad` (main tenue, nom du créateur, sous-titres pop), `unboxing` ou `cinematic-product-demo`.
4. **Storyboard** (plus d'un plan) : `clapova:storyboard`, arc problème, solution, preuve, appel ; accord avant génération.
5. **Accroche** : plusieurs formules possibles (`get_creative_recipes({topic:"hooks"})`) ; pour comparer, `clapova:test-accroches`.
6. **Plans produit fidèles** : `generate_video` avec `imageUrl` = la photo du produit et un prompt de mouvement seul (`clapova:prompts-video`), un preset par plan (`handheld`, `push-in`, `orbit`). Produit qui dévie : 2 régénérations au plus, puis packshot (`generate_image` avec la photo en référence) animé en montage (`add_effect`). Personne à l'écran : Personnage (`clapova:personnages`) ou plans sans visage (mains, silhouette).
7. **Voix et texte** : `generate_voiceover` (phrases courtes, 2,3 mots par seconde de plan au plus) ; texte à l'écran de 6 mots au plus, jamais la voix mot pour mot.
8. **Montage** : `apply_template({projectId, templateId, mediaIds, voiceoverMediaId, musicMediaId, texts, brand})` dans un projet vide, ou `create_from_template` depuis des URL. Sous-titres : `add_captions` look `pop` (`clapova:sous-titres-styles`). Logo : jamais dans les 3 premières secondes, en signature à la fin.
9. **Son** : musique générée (`generate_music`, sans paroles) sur toute la durée, clip à 0,5, `set_duck` niveau 0,5, fondu final ; bruitages légers : pop ou clic sur les apparitions, whoosh sur les coupes fortes seulement.
10. **Contrôle** : `check_composition`, `render_preview_frames` (accroche, produit, preuve, CTA), `review_montage` jusqu'à `stop:true`.
11. **Export** : accord sur le coût, `export_video` preset de la plateforme, suivi `get_render_status`. Déclinaisons : `clapova:declinaison-formats`.

## Pièges

- Produit qui change de forme ou d'étiquette d'un plan à l'autre.
- Texte, prix ou logo générés par le modèle : à poser en montage.
- Promesse santé, éco ou gain de temps sans source.
- Plus de 60 % de plans générés : mélange avec captures réelles, motion et packshot.

## Critères de fin

Accroche avant 3 s, produit net et identique d'un plan à l'autre, CTA tenu 3 s, musique de la première à la dernière image, planche regardée. Livraison : `videoUrl` et `studioUrl`, message de félicitations original avec un emoji, durée, format, crédits dépensés.
