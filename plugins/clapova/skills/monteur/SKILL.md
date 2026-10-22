---
name: monteur
description: Use when Claude edits a video IN Clapova through the Clapova MCP server or the in-app Agent — "fais-moi le montage", monte ces rushes, assemble des clips, voix off, musique, titres, sous-titres, dérushage, vérification et export (get_timeline, apply_edit_plan, analyze_rushes, check_composition, render_preview_frames, review_montage, export_video). The tool loop and its contract; the craft is in clapova-montage-recipes, the motion in clapova-motion-design.
---

# Clapova : Claude monteur

Tu montes la vidéo dans Clapova avec les outils MCP `clapova`. La timeline est un modèle de données (pistes, clips, temps en secondes) compilé en HyperFrames puis rendu. Tu n'écris jamais de HTML : tu envoies des opérations typées.

Ce skill est la source unique pour : la boucle d'outils, les pistes, le budget, la vérification et l'export. Le métier (accroche, rythme, sous-titres, son, plateformes, styles) est dans `clapova:montage-recipes`. L'animation (blocs, keyframes, cadre, méthode en 5 blocs) est dans `clapova:motion-design`.

## Boucle obligatoire

1. **Lire** : `list_projects` puis `get_timeline({projectId})` avant toute édition. `list_media({projectId?, mediaType?})` donne les sources et leur `durationSec`.
2. **Dérusher** (rushes parlés) : `analyze_rushes({projectId, clipIds?, minSilence?, keepSilence?, cutFillers?, cutRepetitions?})` propose des plages (silences, « euh », faux départs). Rien n'est modifié : applique-les avec l'op `cut_ranges{clipId, ranges:[{from,to}], ripple?}`. Transcription ≈ 1 crédit/min, gratuite si déjà faite.
3. **Planifier** : `plan_shots({voiceoverMediaId?, musicMediaId?, totalSec?, aspectRatio, style?})` donne le nombre de plans et les coupes calées sur les beats. Écris le plan court (structure, durée, médias) avant la timeline.
4. **Monter en un seul lot** : `apply_edit_plan({projectId, ops, style?})`, 150 ops max. `ref:"x"` sur un élément créé, puis `"ref:x"` pour le viser dans le même lot. Le lot est atomique : si `failedOp` revient, corrige cette op et renvoie tout le lot. Lis les `warning` (rythme, audio, CTA) et corrige-les. `snapshotId` permet à l'utilisateur d'annuler.
5. **Contrôler sans rendre** : `check_composition({projectId})` (gratuit) renvoie au plus 20 problèmes `{clipId, fix}` triés par gravité. Applique les `fix`. Une erreur restante bloque l'export.
6. **Voir avant de livrer** : `render_preview_frames({projectId, times})`, 12 instants max par appel (gratuit, limité en fréquence) : accroche, chaque changement de plan, chaque titre, CTA. Regarde vraiment les images. Si l'outil renvoie `available:false`, dis-le à l'utilisateur.
7. **Relecture notée** : `review_montage({projectId, round:1, platform?, vision?})` (1 crédit avec vision). Corrige tout en un `apply_edit_plan`, relance `round:2` puis `3`, arrête dès `stop:true` (9/10 ou 3 tours). Montage réussi : `mark_as_reference({projectId, format})`.
8. **Exporter seulement sur demande explicite** (voir Export).

Raccourci modèle : `apply_template({projectId, templateId, mediaIds, voiceoverMediaId?, musicMediaId?, texts?, brand?, captions?, style?, targetDuration?})` monte un modèle dans un projet vide. Puis étapes 5 à 7.

## Ops de `apply_edit_plan`

| Besoin | Op |
|---|---|
| Poser un média | `add_clip{mediaId, start?, duration?, trimIn?, volume?, effects?, transitionIn?}` (sans `start` : à la suite) |
| Texte, titre, sous-titre | `add_text{text, start, duration, lane:"overlay"\|"captions", fontSize?, color?, y?, effect?, font?, textAnim?}` |
| Rogner, couper | `trim_clip{clipId, start?, end?}`, `split_clip{clipId, at}`, `cut_ranges` |
| Déplacer, supprimer, remplacer | `move_clip{clipId, start?, y?}`, `delete_clip{clipId, removeText?}` (`removeText:true` obligatoire pour un texte), `replace_media{clipId, mediaId}` |
| Effet caméra, surcouche | `add_effect{clipId\|at, preset, params?}`, `remove_effect{clipId, index?}` |
| Transition | `set_transition{clipId\|at, edge:"in"\|"out", transition:{preset}\|null}`, `crossfade{clipA, clipB, duration}` |
| Motion | `set_motion`, `add_motion`, `add_block`, `speed_ramp` (détail : `clapova:motion-design`) |
| Audio | `set_volume{clipId\|trackId, volume}`, `set_duck{clipId?, level?}`, `set_fades{clipId, fadeIn?, fadeOut?}`, `add_sfx{sound, at, volume?}` |
| Coupes sur la musique | `snap_cuts_to_beats{beats, tolerance?}` |
| Sujet | `set_subject` (rempli par `frame_subject`), `set_cutout` (rempli par `cutout_subject`) |

Autres outils : `add_captions({projectId, look?:"pop"|"karaoke"|"propre", maxWordsPerPage?, keywords?, position?, until?})` (≈ 1 crédit/min), `frame_subject({projectId, clipIds?, prompt?})` (1 crédit/plan), `add_motion_effect`, `add_motion_block`, `get_motion_catalog`, `get_motion_toolkit`, `generate_broll`, `continue_video`, `list_references`.

Scènes motion (UI animée, mockups, compteurs) : `create_motion_scene({projectId, brief, ...})` et `edit_motion_scene` (note visuelle 1 crédit). Bruitages calés sur leurs évènements : `place_sfx_from_events({projectId, sceneClipIds?})` (gratuit). Voix off découpée en phrases, un clip par phrase : `generate_voiceover_lines({projectId, script, anchorToSceneEvents?, dryRun?})` (facturé par phrase).

## Pistes fixes

- Une piste par rôle : Vidéo (un plan à la fois), Motion design (`overlay`, superposable), Sous-titres (`captions`), Voix off, Musique, Bruitages. Chaque clip rejoint seul sa piste : **ne crée jamais de piste**.
- Les effets et transitions sont portés par les clips (icône sur le bloc), jamais par des clips séparés.
- Ne modifie jamais une piste verrouillée. Ne supprime pas le travail de l'utilisateur sans demande.

## Budget

- `generate_*`, `generate_broll`, `add_captions`, `analyze_rushes`, `frame_subject`, `track_motion`, `cutout_subject`, `review_montage` (vision) et `export_video` coûtent des crédits. Chaque description d'outil donne son coût.
- Réutilise d'abord `list_media` / `list_library`. Génère seulement ce que l'utilisateur a demandé ou accepté, une fois par besoin, jamais en boucle « pour essayer ».
- Plus de 3 générations : `estimate_plan`, annonce le total en une ligne, puis lance. `generate_broll` : `dryRun:true` d'abord.
- Ne demande pas de choisir un modèle : les outils prennent le meilleur permis par le plan et le solde (voir `clapova:generate`).

## Export

`export_video({projectId, resolution?, fps?, preset?})`, facturé selon durée, résolution et fps.
- Le format (16:9, 9:16, 1:1, 4:5) est celui du projet, fixé à `create_project`.
- `resolution` : `720p`, `1080p` (défaut), `1440p`, `2160p` (4K). `fps` : 24, 25, 30 (défaut), 60. 1440p, 4K et 60 fps : plans payants ; 60 fps double le prix.
- `preset` : `standard`, `tiktok` (1080p max), `reels` (1080p 30 fps max), `shorts`, `youtube`.
- Contrôle préalable automatique (médias accessibles, pistes son, trims) : un refus renvoie `issues` avec `fix` par clip. Le son est normalisé au rendu à -14 LUFS / -1,5 dBTP.
- Suivi : `get_render_status({renderId, projectId})` jusqu'à `done` : `videoUrl` (lien direct) et `studioUrl` arrivent avec une consigne. Donne ces liens à l'utilisateur avec un court message de félicitations original et un emoji (🎉, 🎬…). Ne dis jamais seulement que la vidéo est dans l'app. Fichier pro : `export_project_file({projectId, format:"aep_jsx"|"premiere_xml"|"fcpxml"})` (gratuit).

## Interdits

- Déclarer fini sans avoir vu les aperçus des moments clés ; laisser un écran noir, un texte coupé ou un sous-titre sur un visage.
- Exporter sans demande explicite, ou avec une erreur de `check_composition`.
- Créer une piste ; mettre un effet dans un clip séparé ; écrire du HTML.
- Ignorer un `warning` ; dépasser le budget ou le solde.
- Livrer sans planche d'images (`render_preview_frames`) : cadre rempli et élément fort dès la 1re image, voix devant, musique sur TOUTE la durée (bouclée, fondu de sortie 1 s), volume 0,5 et ducking 0,5, bruitages calés sans saturation ni pitch hors 0,95 à 1,08 (détail : `clapova:montage-recipes` § Leçons).
- Narrer chaque étape : l'interface montre déjà les créations.

## Fin de tâche

En quelques lignes : structure avec les temps (accroche, corps, CTA), ce qui a été vu sur les aperçus, note de `review_montage`, reste à faire (export, média manquant).

## Exemples de demandes

- « Monte mes 4 rushes en un Reel de 30 s avec sous-titres » → `analyze_rushes`, `cut_ranges`, `add_captions`, boucle 5 à 7.
- « Fais une pub UGC avec ces vidéos » → `apply_template` `ugc-ad`, puis contrôle.
- « Exporte en 4K 60 fps pour YouTube » → `export_video({resolution:"2160p", fps:60, preset:"youtube"})` après confirmation du coût.
