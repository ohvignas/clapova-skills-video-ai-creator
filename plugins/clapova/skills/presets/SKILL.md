---
name: presets
description: Use when a Clapova user asks for a camera move or visual effect on a generated video (crash zoom, drone FPV, orbit, bullet time, dolly zoom, slow motion, explosion, portal, glitch…) or a marketing montage template (UGC ad, cinematic product demo, crash-zoom teaser, before/after, unboxing, event, faceless explainer, listicle) — list_video_presets / generate_video presets, list_templates / apply_template / create_from_template; also when adding a preset or wiring presets into a new video model.
---

# Clapova : presets vidéo et modèles de montage

Ce skill est la source unique pour : les ids de presets vidéo, leur usage dans `generate_video`, les modèles de montage.

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
- Médias déjà dans la bibliothèque : `apply_template({projectId, templateId, mediaIds, voiceoverMediaId?, musicMediaId?, texts?, brand?})` dans un projet vide.
- Médias par URL : `create_from_template({templateId, aspect?, media:[{url, kind}], voiceover?, music?, brand:{name, primary, background, text, logoUrl?}, texts?})` crée le projet.
- Ensuite : contrôle et relecture selon `clapova:monteur`.

Déroulé « fais-moi une pub UGC » : `list_presets` → générer 2 à 4 plans avec les presets de `byTemplate["ugc-ad"]` → voix off → `apply_template`. Générez seulement ce qui est demandé.

## Pour les développeurs

- Presets : `src/lib/presets/video-presets.ts` (`VIDEO_PRESETS` : `label`/`description` en français, `phrase` + `short` en anglais, `cameraControl` Kling optionnel). Formulations positives seulement (test). Puis `npx vitest run src/lib/presets`.
- Formulation par modèle : `applyVideoPresets` / `presetStyleFor` (`lead` pour le texte vers vidéo riche, `concise` pour l'image vers vidéo, `instruction` pour les endpoints `*edit*`).
- Modèles : `src/lib/templates/scene-pack.ts` (`buildScenePack`), tests `npx vitest run src/lib/templates`.
