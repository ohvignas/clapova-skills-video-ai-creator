---
name: utiliser-clapova
description: Use at the start of any Clapova task from Claude: overview of the Clapova MCP tools, workspace, credits and which clapova skill to load (generate, montage, publish, stats, veille, brand).
---

# Clapova depuis Claude

Le serveur MCP `clapova` agit dans le compte de l'utilisateur, avec son plan et ses crédits, dans l'espace choisi à la connexion.

## Avant d'agir
- `get_guide({topic})` : lis la méthode du sujet (montage, motion, storyboard, generation, sous-titres, marque, personnages, viralite, publication, demarrage) AVANT d'agir et suis-la. Sans `topic`, il renvoie l'index.
- `list_workspaces` : espace actif. Pour en changer : reconnecter Clapova et choisir l'espace.
- `get_credits` avant toute action facturée. Si le solde est insuffisant, dites-le et proposez la page Crédits de Clapova.
- Chaque description d'outil indique son coût (« Coût : … »). Les échecs sont remboursés.

## Quel skill
| Demande | Skill |
|---|---|
| Une image, vidéo, voix, musique | `clapova:generate` |
| Retouche d'une partie d'image | `clapova:image-edit` |
| Choix de modèle, prix | `clapova:model-catalog` |
| Mouvement de caméra, VFX, modèle de montage | `clapova:presets` |
| Vidéo de plusieurs plans (storyboard d'abord) | `clapova:storyboard` |
| Shorts depuis une vidéo longue | `clapova:shorts-depuis-video-longue` |
| Monter une vidéo, dérusher, exporter | `clapova:monteur` + `clapova:montage-recipes` |
| Animer, titres, blocs motion, étalonnage | `clapova:motion-design` |
| Continuer un clip | `clapova:continuer-video` |
| Personnage récurrent, swap | `clapova:personnages` |
| Photo produit, fiche marketplace, miniature, explainer | `clapova:product-photoshoot`, `clapova:marketplace-cards`, `clapova:youtube-thumbnail`, `clapova:video-explainer` |
| Logo, charte, import depuis un site | `clapova:brandkit`, `clapova:marque-depuis-site` |
| Publier, planifier, calendrier | `clapova:publication-calendrier` |
| Statistiques | `clapova:statistiques` |
| Viralité | `clapova:viralite` |
| Veille, concurrent | `clapova:veille-concurrence` |

## Règles
- Français, vouvoiement, réponses courtes, pas de JSON brut : lien ou aperçu du média et une ligne de résumé.
- Ne générez que ce qui est demandé, jamais en boucle. Demandez avant `export_video`, `publish_post`, `apply_brand_import`. Avant de livrer un montage : `check_composition` puis `render_preview_frames`, et regardez les images.
- Les médias créés sont dans la Bibliothèque Clapova ; `import_media_from_url` y ajoute un média https public. Fichier local volumineux (vidéo jointe au chat, non transmissible) : appelez `create_upload_link` tout de suite (jamais de lien Dropbox/Drive). Si vous avez accès à un shell/à l'exécution de code et au fichier, envoyez-le vous-même avec la commande `curl` renvoyée (`uploadUrl`, usage unique, 30 min, pas de MKV ; réponse JSON avec `mediaId`) ; sinon donnez à l'utilisateur le lien de la page (`url`) à ouvrir. Puis `get_upload_status` jusqu'à `done` (mediaId).
