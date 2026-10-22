---
name: monteur
description: Use when Claude must assemble, edit or finish a video IN Clapova (MCP server or in-app Agent) — "monte mes rushes", "monte cette vidéo", "assemble ces clips", "ajoute voix off, musique, titres, sous-titres", "dérushe", "vérifie et exporte" — with the full tool loop (get_timeline, apply_edit_plan, analyze_rushes, check_composition, render_preview_frames, review_montage, export_video). Loaded FIRST for any montage request; owns tracks, budget, verification, music over the whole duration and the final link.
---

# Clapova : Claude monteur

Tu montes la vidéo dans Clapova avec les outils MCP `clapova`. La timeline est un modèle de données (pistes, clips, temps en secondes) compilé en HyperFrames puis rendu. Tu n'écris jamais de HTML : tu envoies des opérations typées.

Ce skill est chargé EN PREMIER pour toute demande de montage : `clapova:montage-recipes` ne donne que les chiffres du métier, `clapova:motion-design` que l'animation. Il est la source unique pour : la boucle d'outils, les pistes, le budget, la vérification et l'export. Le métier (accroche, rythme, sous-titres, son, plateformes, styles) est dans `clapova:montage-recipes`. L'animation (blocs, keyframes, cadre, méthode en 5 blocs) est dans `clapova:motion-design`.

## Boucle obligatoire

0. **Solde et guides** : `get_credits` avant tout coût. `get_guide('montage')` puis `get_guide('motion')`, lus en entier avant la première op (l'export refuse sans le guide motion). Si l'utilisateur donne une vidéo ou un lien « à imiter » : `clapova:recreer-depuis-reference` d'abord, puis reviens ici au montage. Annonce le coût total en une ligne avant de lancer un outil payant (étapes 2, 7, captions, génération), même sous 3 générations. Si `estimate_plan` dépasse le solde : ne lance rien, propose la version économique (moins de plans générés, médias existants de `list_library`, `vision:false`, 720p) ou la page Crédits, et attends le choix.
0b. **Obtenir les rushes** (si rien n'existe encore) : fichier joint ou envoyé : `create_upload_link({projectId?, expectedKind:'video', fileName})` tout de suite, puis `get_upload_status` jusqu'à `done` (mediaId). Lien https direct vers un fichier : `import_media_from_url`. Lien YouTube/TikTok/Instagram : il ne s'importe pas ; pour s'en inspirer, `clapova:recreer-depuis-reference`, pour monter un fichier que l'utilisateur possède, `create_upload_link`. Pas de projet : `create_project({title, aspectRatio, style?})` (le format est fixé là : 9:16 pour TikTok/Reels/Shorts, 16:9 YouTube, 1:1 ou 4:5 posts), puis `add_media_to_project`.
1. **Lire** : `list_projects` puis `get_timeline({projectId})` avant toute édition. `list_media({projectId?, mediaType?})` donne les sources et leur `durationSec`.
2. **Dérusher** (rushes parlés) : `analyze_rushes({projectId, clipIds?, minSilence?, keepSilence?, cutFillers?, cutRepetitions?})` propose des plages (silences, « euh », faux départs). Rien n'est modifié : applique-les avec l'op `cut_ranges{clipId, ranges:[{from,to}], ripple?}`. Transcription ≈ 1 crédit/min, gratuite si déjà faite. Vidéo muette ou sans voix : saute cette étape et `add_captions` (rien à transcrire) ; propose des textes `add_text` à la place, ou une voix off `generate_voiceover`.
3. **Planifier** : `plan_shots({voiceoverMediaId?, musicMediaId?, totalSec?, aspectRatio, style?})` donne le nombre de plans et les coupes calées sur les beats. Écris le plan court (structure, durée, médias) avant la timeline.
3b. **Musique sur toute la durée** : décide la musique dès le plan (`generate_music` ou un média de la Bibliothèque via `list_library`, sauf explicatif sobre sans demande). Elle est posée de 0 à la fin exacte de la vidéo (`add_clip{mediaId, start:0, duration:<durée totale>}`). Musique plus courte que la vidéo : un second `add_clip` du même média à la suite (boucle), ou `generate_music` à la durée totale, puis `set_fades{fadeOut:1}` sur sa dernière seconde ; `set_duck{level:0.5}` avec le clip à volume 0,5 (≈ 0,25 sous la voix, jamais sous 0,15 : valeur unique, aussi dans `clapova:montage-recipes`). Une musique qui s'arrête avant la fin est un défaut bloquant.
4. **Monter en un seul lot** : `apply_edit_plan({projectId, ops, style?})`, 150 ops max. `ref:"x"` sur un élément créé, puis `"ref:x"` pour le viser dans le même lot. Le lot est atomique : si `failedOp` revient, corrige cette op et renvoie tout le lot. Lis les `warning` (rythme, audio, CTA) et corrige-les. `snapshotId` permet à l'utilisateur d'annuler.
5. **Contrôler sans rendre** : `check_composition({projectId})` (gratuit) renvoie au plus 20 problèmes `{clipId, fix}` triés par gravité. Applique les `fix`. Une erreur restante bloque l'export.
6. **Voir avant de livrer** : `render_preview_frames({projectId, times})`, 12 instants max par appel (gratuit, limité en fréquence) : accroche, chaque changement de plan, chaque titre, CTA. Regarde vraiment les images. Si l'outil renvoie `available:false`, dis-le à l'utilisateur.
7. **Relecture notée** : `review_montage({projectId, round:1, platform?, vision?})` (1 crédit avec vision). `platform` : `tiktok` (défaut), `reels` ou `shorts` seulement ; pour YouTube ou LinkedIn garde `tiktok` pour le score et dis que le score de viralité est celui du vertical court. Corrige tout en un `apply_edit_plan`, relance `round:2` puis `3`, arrête dès `stop:true` (note visée 9/10, ou 3 tours). Si les 3 tours finissent sous 8/10 : ne marque pas de référence, ne dis pas « terminé » ; donne la note, les défauts restants et demande si l'utilisateur corrige, accepte ou exporte quand même. Entre 8 et 9 : livrable, dis la note. Montage noté ≥ 9 : `mark_as_reference({projectId, format})`, `format` parmi `pub-ugc`, `lancement-produit`, `face-camera`, `listicle`, `broll-storytelling`, `hyper-motion`.
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

Autres outils : `add_captions({projectId, look?:"pop"|"karaoke"|"propre"|"boite"|"rebond"|"halo", maxWordsPerPage?, keywords?, position?:"haut"|"centre"|"bas", highlight?, until?})` (≈ 1 crédit/min ; looks et réglages : `clapova:sous-titres-styles`), `frame_subject({projectId, clipIds?, prompt?})` (1 crédit/plan), `add_motion_effect`, `add_motion_block`, `get_motion_catalog`, `get_motion_toolkit`, `generate_broll`, `continue_video`, `list_references`.

Scènes motion (UI animée, mockups, compteurs) : `create_motion_scene({projectId, brief, ...})` et `edit_motion_scene` (note visuelle 1 crédit). Bruitages calés sur leurs évènements : `place_sfx_from_events({projectId, sceneClipIds?})` (gratuit). Voix off découpée en phrases, un clip par phrase : `generate_voiceover_lines({projectId, script, anchorToSceneEvents?, dryRun?})` (facturé par phrase).

## Pistes fixes

- Une piste par rôle : Vidéo (un plan à la fois), Motion design (`overlay`, superposable), Sous-titres (`captions`), Voix off, Musique, Bruitages. Chaque clip rejoint seul sa piste : **ne crée jamais de piste**.
- Les effets et transitions sont portés par les clips (icône sur le bloc), jamais par des clips séparés.
- Ne modifie jamais une piste verrouillée. Ne supprime pas le travail de l'utilisateur sans demande.

## Budget

- `generate_*`, `generate_broll`, `add_captions`, `analyze_rushes`, `frame_subject`, `track_motion`, `cutout_subject`, `review_montage` (vision) et `export_video` coûtent des crédits. Chaque description d'outil donne son coût.
- Réutilise d'abord `list_media` / `list_library`. Génère seulement ce que l'utilisateur a demandé ou accepté, une fois par besoin, jamais en boucle « pour essayer ».
- Avant tout lot payant : annonce le total en une ligne (`estimate_plan` au-delà de 3 générations). `analyze_rushes`, `add_captions` et `review_montage` avec vision sont payants : même règle, même pour un seul appel. `generate_broll` : `dryRun:true` d'abord.
- Ne demande pas de choisir un modèle : les outils prennent le meilleur permis par le plan et le solde (voir `clapova:generate`).

## Export

`export_video({projectId, resolution?, fps?, preset?})`, facturé selon durée, résolution et fps. Prérequis : étape 0 faite (`get_guide('motion')` lu), sinon refus. Une scène motion notée sous 8/10 bloque l'export (sauf `forcer:true` à la demande de l'utilisateur).
- Le format (16:9, 9:16, 1:1, 4:5) est celui du projet, fixé à `create_project`.
- `resolution` : `720p`, `1080p` (défaut), `1440p`, `2160p` (4K). `fps` : 24, 25, 30 (défaut), 60. 1440p, 4K et 60 fps : plans payants ; 60 fps double le prix.
- `preset` : `standard`, `tiktok` (1080p max), `reels` (1080p 30 fps max), `shorts`, `youtube`.
- Contrôle préalable automatique (médias accessibles, pistes son, trims) : un refus renvoie `issues` avec `fix` par clip. Le son est normalisé au rendu à -14 LUFS / -1,5 dBTP.
- Suivi : `get_render_status({renderId, projectId})` jusqu'à `done`, puis suis « Livraison finale ». Fichier pro : `export_project_file({projectId, format:"aep_jsx"|"premiere_xml"|"fcpxml"})` (gratuit).

## Checklist de fin (critères de fin)

Coche chaque ligne avant de dire « terminé » :
- [ ] `check_composition` : zéro erreur ; chaque `warning` lu et traité.
- [ ] Planche `render_preview_frames` regardée : 1re image pleine, chaque coupe, chaque titre entier, CTA lisible (pas de noir, pas de texte coupé, pas de sous-titre sur un visage).
- [ ] Musique présente de 0 à la dernière image, clip à 0,5, `set_duck` niveau 0,5, fondu final.
- [ ] Son léger : un bruitage tous les 2 s au plus, `volume` 0,18 par défaut (0,12 à 0,25), pitch 0,95 à 1,08, jamais un whoosh à chaque coupe.
- [ ] `review_montage` à `stop:true` (9/10 ou 3 tours), note ≥ 8 pour dire « terminé ».
- [ ] Export seulement après accord, puis « Livraison finale » (une seule fois, en bas).

## Pièges

- Lot refusé : lis `failedOp`, corrige cette seule op, renvoie tout le lot (atomique).
- `delete_clip` sur un texte sans `removeText:true` : refusé.
- Médias de durées inconnues : `list_media` avant de poser `duration`.
- Sous-titres et titre motion au même endroit : `add_captions` avec `until`, ou titre en zone haute.
- Générer « pour essayer » : jamais. Une génération par besoin, `estimate_plan` au-delà de 3.
- « Monte cette vidéo » sans projet ni fichier : ne bloque pas à `list_projects`, passe par l'étape 0b.
- Contrôle visuel : seul `render_preview_frames` renvoie des images ; `extract_frames` et les URL de médias n'en renvoient pas.

## Interdits

- Déclarer fini sans avoir vu les aperçus des moments clés ; laisser un écran noir, un texte coupé ou un sous-titre sur un visage.
- Exporter sans demande explicite, ou avec une erreur de `check_composition`.
- Créer une piste ; mettre un effet dans un clip séparé ; écrire du HTML.
- Ignorer un `warning` ; dépasser le budget ou le solde.
- Livrer sans planche d'images (`render_preview_frames`) ni respecter les leçons de `clapova:montage-recipes` § 9 (cadre rempli, musique sur toute la durée, bruitages sans saturation).
- Narrer chaque étape : l'interface montre déjà les créations.

## Fin de tâche

En quelques lignes : structure avec les temps (accroche, corps, CTA), ce qui a été vu sur les aperçus, note de `review_montage`, reste à faire (export, média manquant).

## Exemples de demandes

- « Monte mes 4 rushes en un Reel de 30 s avec sous-titres » → `analyze_rushes`, `cut_ranges`, `add_captions`, boucle 5 à 7.
- « Refais cette vidéo YouTube / ce TikTok » → `clapova:recreer-depuis-reference` (`analyze_reference_video` pour YouTube, fichier envoyé pour TikTok), puis cette boucle.
- « Fais une pub UGC avec ces vidéos » → `apply_template` `ugc-ad`, puis contrôle.
- « Exporte en 4K 60 fps pour YouTube » → `export_video({resolution:"2160p", fps:60, preset:"youtube"})` après confirmation du coût.

## Livraison finale (obligatoire)

Une fois `get_render_status` à `done` : donne `videoUrl` (lien direct) et `studioUrl`, avec un court message de félicitations original et un emoji (🎉, 🎬, 🚀), puis une ligne : durée, format, crédits dépensés. Ne dis jamais seulement « c'est dans l'app ».
