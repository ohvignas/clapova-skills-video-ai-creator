# Pièges MCP et anti-refacturation

Lire au premier refus, timeout ou résultat inattendu d'un outil.

| Situation | À faire | À ne pas faire |
|---|---|---|
| `build_from_storyboard` expire | `list_media({projectId})` puis `get_timeline` : repérer ce qui est déjà généré et posé ; relancer seulement si des plans manquent, même version (renvoie `built` sans refaire) | relancer avec `rebuild:true`, ou relancer sans regarder |
| Génération (`generate_*`) en timeout | `list_media` / `list_library` : le média existe souvent | régénérer |
| `apply_edit_plan` renvoie `failedOp` | corriger cette op, renvoyer tout le lot | envoyer les ops une par une |
| `check_composition` signale une erreur | appliquer son `fix` | exporter quand même |
| `render_preview_frames` renvoie `available:false` | le dire à l'utilisateur ; ne pas prétendre avoir vu | décrire des images non vues |
| `review_montage` signale « voix coupée » alors que la voix est en plusieurs clips, ou « logo ouvre la vidéo » à tort | vérifier sur les images et la timeline, le noter comme faux positif | corriger à l'aveugle |
| Un contrôle annoncé par la synthèse n'existe pas encore (`analyze_edit`, `analyze_music_beats`, modes de `render_preview_frames`) | écrire « si disponible » et faire le contrôle à l'œil | promettre une mesure |
| `delete_clip` sur un texte refusé | ajouter `removeText:true` | — |
| Export demandé | aperçus de l'état final regardés, coût annoncé, accord | exporter « pour voir » |
