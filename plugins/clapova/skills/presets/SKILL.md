---
name: presets
description: Use when a Clapova user asks for a camera move or visual effect on a generated video clip (crash zoom, drone FPV, orbit, bullet time, dolly zoom, slow motion, explosion, portal, glitch…) or wants a ready-made marketing montage template (UGC ad, cinematic product demo, crash-zoom teaser, before/after, unboxing, event announcement, faceless explainer, listicle) — list_video_presets with generate_video presets, list_templates, get_template_recipe, apply_template, create_from_template.
---

# Clapova : presets vidéo et modèles de montage

Ce skill est la source unique pour : les ids de presets vidéo, leur usage dans `generate_video`, les modèles de montage.

Étape 0 : `get_guide('presets')` pour la partie génération ; pour un modèle de montage, `get_guide('montage')` puis `get_guide('motion')` (l'export refuse sinon), et `get_credits`.

## Presets vidéo (génération)

1. `list_video_presets({kind?:"camera"|"vfx"})` : id, description, durée conseillée, familles de modèles recommandées. (`list_presets` donne la même liste plus les presets conseillés par modèle de montage, `byTemplate`.)
2. `generate_video({prompt, preset:"<id>", intensity?})` ; plusieurs : `presets:[...]` (4 max). **Un seul mouvement de caméra par plan**, les effets s'empilent. `intensity` : `subtle`, `normal` (défaut), `strong`.
3. Décrivez le mouvement par le preset, pas dans le prompt. Clapova formule le preset pour la famille du modèle choisi.

| Type | Ids |
|---|---|
| Caméra | `push-in`, `pull-out`, `crash-zoom`, `orbit`, `tracking`, `fpv-drone`, `drone-dive`, `aerial-reveal`, `whip-pan`, `dolly-zoom`, `oner`, `handheld`, `bullet-time`, `static` |
| Effets | `slow-motion`, `speed-ramp`, `product-glow`, `neon`, `film-grain`, `particles`, `smoke`, `lens-flare`, `explosion`, `disintegration`, `on-fire`, `morph`, `levitation`, `time-freeze`, `portal`, `particle-rain`, `glitch`, `inflate` |

Ces presets agissent sur la génération. Les mouvements caméra et transitions **dans le montage** (`add_effect`, `set_transition`) sont dans `clapova:motion-design`.

## Modèles de montage

| id | Format | Forme | Presets conseillés |
|---|---|---|---|
| `ugc-ad` | 9:16 | accroche, coupes tenues main ~2,2 s, nom du créateur, sous-titres pop | handheld |
| `cinematic-product-demo` | 16:9 / 9:16 | logo, plans lents ~3,2 s, fonctions numérotées | orbit, push-in, product-glow |
| `crash-zoom-teaser` | 9:16 / 16:9 | musique seule, coupes ~0,9 s | crash-zoom, whip-pan, speed-ramp |
| `before-after` | 9:16 / 16:9 | exactement 2 clips, Avant / Après | static |
| `unboxing` | 9:16 | accroche, plans ~2,5 s, nom du produit sur la révélation | handheld, push-in |
| `event-announcement` | 16:9 / 9:16 | carton titre (nom, date, lieu), rappel de date | fpv-drone, aerial-reveal, particles |
| `faceless-explainer` | 16:9 / 9:16 | un bloc par phrase de voix off (`clapova:video-explainer`) | push-in, static |
| `listicle-top` | 9:16 | promesse chiffrée, un plan par point numéroté, CTA | push-in, whip-pan |

- `list_templates`, puis `get_template_recipe({id})` : structure, champs, format, crédits estimés.
- Médias déjà dans la bibliothèque : `apply_template({projectId, templateId, mediaIds, voiceoverMediaId?, musicMediaId?, texts?, brand?, captions?, style?, targetDuration?, brandLock?})` dans un projet vide. `captions` est vrai par défaut et la transcription est facturée (≈ 1 crédit/min) : annonce-le ou mets `false`. `style` (voir `clapova:montage-recipes`) et `targetDuration` (5 à 180 s) se choisissent selon la plateforme ; `texts` porte hook, cta, features, handle. Le kit de marque est appliqué automatiquement (`brandLock`, vrai par défaut) ; `apply_template` n'a pas de `logoUrl`.
- Médias par URL : `create_from_template({templateId, aspect?, media:[{url, kind}], voiceover?, music?, brand:{name, primary, background, text, logoUrl?}, texts?})` crée le projet (seul endroit où `logoUrl` passe).
- Ensuite : contrôle et relecture selon `clapova:monteur`.

Déroulé « fais-moi une pub UGC » : `get_credits` → `create_project({title, aspectRatio:"9:16"})` (projet vide, format fixé ici) → `list_presets` → générer 2 à 4 plans avec les presets de `byTemplate["ugc-ad"]` (`generate_video` avec `projectId`) → voix off `generate_voiceover` (voix française : `list_model_params` avec `language:"fr"`) → musique `generate_music` à la durée totale → `apply_template` → son léger (bruitages `volume` 0,18, `set_duck` niveau 0,5, musique à 0,5 sur toute la durée, `set_fades` de sortie 1 s) → `check_composition` → `render_preview_frames` regardée image par image → `review_montage` jusqu'à `stop:true` → export après accord. Détail de chaque étape : `clapova:monteur`. Générez seulement ce qui est demandé et annonce le coût avant (2 à 4 plans de 10 s + voix + musique : `estimate_plan`). Export : `export_video` est facturé selon durée, résolution et fps ; annonce-le avant.

« Inspire-toi de cette vidéo » (lien YouTube, fichier envoyé) : charge `clapova:recreer-depuis-reference` : `analyze_reference_video` (lien YouTube ou URL https) ou `create_upload_link` (fichier), qui choisit le modèle le plus proche et les presets correspondants à partir de la recette de la référence. On reprend la structure, jamais la musique ni les images.

## Pièges

- Deux mouvements de caméra dans un plan : le deuxième annule le premier. Un mouvement, plusieurs effets.
- Preset décrit aussi dans le prompt : redondance, mouvement confus.
- `before-after` demande exactement 2 clips ; `crash-zoom-teaser` demande une musique.
- Modèle de montage appliqué à un projet non vide : crée un projet vide.
- Preset (ex. `bullet-time`, `fpv-drone`) sur un modèle qui ne le tient pas : le mouvement peut être ignoré. Vérifie sur une planche `render_preview_frames` (clip posé dans un projet ; `extract_frames` ne renvoie pas d'images en MCP) ; si le mouvement n'y est pas, change de preset ou de modèle plutôt que de régénérer à l'identique.

## Critères de fin

Les plans générés portent chacun un seul mouvement de caméra, le modèle de montage est appliqué avec la marque (`brand`), `check_composition` est propre, la planche `render_preview_frames` est regardée, musique sur toute la durée. Musique : `generate_music` à la durée totale si le modèle n'en pose pas. Lien et félicitations à l'export : voir `clapova:monteur` (Livraison finale) ; sans export, termine par le lien du projet.
