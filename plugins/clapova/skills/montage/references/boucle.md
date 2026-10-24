# Boucle détaillée

Lire avant le premier lot `apply_edit_plan` d'un projet.

1. **Obtenir la matière** si rien n'existe : fichier de l'utilisateur → `create_upload_link`, puis `get_upload_status` jusqu'à `done` ; lien https direct → `import_media_from_url` ; pas de projet → `create_project({title, aspectRatio})` (format de la fiche), puis `add_media_to_project`.
2. **Lire** : `list_projects` → `get_timeline` → `list_media` (`durationSec` avant de poser une durée).
3. **Planifier** : `plan_shots({voiceoverMediaId?, musicMediaId?, totalSec?, aspectRatio, style?})`. Écrire le plan court (structure, durées, médias) et le faire valider.
4. **Construire** :
   - storyboard approuvé → `build_from_storyboard`, puis ses `followUps` ;
   - sinon → `apply_edit_plan({projectId, ops})` en un lot (atomique ; `ref:"x"` puis `"ref:x"` dans le même lot ; sur `failedOp`, corriger cette op et renvoyer tout le lot) ;
   - modèle complet dans un projet vide → `apply_template`.
5. **Contrôler** : `check_composition` → appliquer chaque `fix`, lire chaque `warning`.
6. **Regarder** : `render_preview_frames({projectId, times})`, 12 instants max par appel. `available:false` : le dire.
7. **Relire** : `review_montage`, puis la boucle de correction de `clapova:controle-qualite`.

## Pistes fixes

Une piste par rôle : video, overlay (motion design), captions (phase B), voiceover, music, sfx. Chaque clip va seul sur la sienne ; on ne crée jamais de piste. Effets et transitions sont portés par les clips (`add_effect`, `set_transition`).

## Ops utiles

| Besoin | Op |
|---|---|
| Poser un média | `add_clip{mediaId, start?, duration?, trimIn?, volume?}` |
| Texte motion | `add_text{text, start, duration, lane:"overlay", …}` |
| Couper | `trim_clip`, `split_clip`, `cut_ranges` |
| Déplacer, remplacer, supprimer | `move_clip`, `replace_media`, `delete_clip{removeText:true}` pour un texte |
| Effet, transition | `add_effect`, `set_transition`, `crossfade` |
| Coupes sur la musique | `snap_cuts_to_beats` |
