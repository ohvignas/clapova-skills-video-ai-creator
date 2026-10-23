<p align="center"><img src="assets/icon-512.png" alt="Clapova" width="96"></p>

# Plugin Clapova pour Claude

Créez, montez et publiez avec Clapova depuis Claude Code : images, vidéos, voix, musiques, montage, export, publication, statistiques et veille. Tout passe par votre compte Clapova : votre plan, vos crédits, votre espace.

## Prérequis

- Un compte Clapova ([clapova.com](https://clapova.com)).
- Des crédits pour les actions facturées (génération, export, analyse). Le plan Gratuit fonctionne, avec filigrane sur les exports et publications.
- Claude Code récent (plugins et serveurs MCP HTTP avec OAuth).

## Installation

```text
/plugin marketplace add ohvignas/clapova-skills-video-ai-creator
/plugin install clapova@clapova
```

Puis lancez `/mcp`, choisissez **clapova** et connectez-vous : Clapova s'ouvre, vous choisissez l'espace et vous autorisez l'accès. Révocable dans Mon compte, Jetons API.

En développement local, pointez le plugin sur votre serveur avant de lancer Claude Code :

```bash
export CLAPOVA_MCP_URL=http://localhost:3002/api/mcp
```

Sans le plugin, le connecteur seul s'ajoute ainsi :

```bash
claude mcp add --transport http clapova https://clapova.com/api/mcp
```

Pour claude.ai, Claude Desktop, ChatGPT et Cursor : page **Connecteurs, Clapova dans votre IA** de l'application (`/app/connecteurs/mcp`).

Les mêmes outils existent en ligne de commande, avec un jeton `clp_` (voir `packages/cli/README.md`) :

```bash
CLAPOVA_TOKEN=clp_… node packages/cli/bin/clapova.mjs tools
```

## Contenu

- **Commandes** : `/clapova:generer`, `/clapova:monter`, `/clapova:publier`, `/clapova:credits`, `/clapova:veille`.
- **Agents** : `monteur-clapova`, `community-manager-clapova`.
- **Skills** : `utiliser-clapova` (point d'entrée), `generate`, `prompts-video`, `image-edit`, `model-catalog`, `presets`, `monteur`, `motion-design`, `montage-recipes`, `sous-titres-styles`, `declinaison-formats`, `test-accroches`, `talking-head`, `pub-produit-ugc`, `storyboard`, `shorts-depuis-video-longue`, `continuer-video`, `personnages`, `product-photoshoot`, `marketplace-cards`, `youtube-thumbnail`, `video-explainer`, `brandkit`, `marque-depuis-site`, `publication-calendrier`, `statistiques`, `viralite`, `veille-concurrence`.
- **Serveur MCP** : `clapova` (Streamable HTTP, OAuth 2.1). Ressources `clapova://models/catalog`, `clapova://recipes`, `clapova://brand-kit` ; prompts `monter_video`, `campagne_reseaux`, `photoshoot_produit`.

## Outils MCP

Chaque outil indique son coût dans sa description. Les générations qui échouent sont remboursées.

| Outil | Rôle | Type |
|---|---|---|
| `list_workspaces` | Lister mes espaces | lecture |
| `get_credits` | Solde de crédits et plan | lecture |
| `get_referral_link` | Lien de parrainage | lecture |
| `list_models` | Catalogue de modèles | lecture |
| `list_model_params` | Réglages et pré-réglages d'un modèle | lecture |
| `pick_best_model` | Choisir le meilleur modèle | lecture |
| `estimate_plan` | Estimer le coût d'un plan | lecture |
| `generate_image` | Générer une image | crédits |
| `generate_video` | Générer une vidéo | crédits |
| `continue_video` | Continuer une vidéo | crédits |
| `generate_broll` | B-roll IA depuis le script ou la voix off | crédits |
| `generate_voiceover` | Générer une voix off | crédits |
| `generate_music` | Générer une musique | crédits |
| `edit_image_precise` | Retoucher une image | crédits |
| `generate_3d` | Générer un objet 3D | crédits |
| `turntable_3d` | Vidéo 360° d'un objet 3D | crédits |
| `create_character` | Créer un personnage | écriture |
| `list_characters` | Lister les personnages | lecture |
| `generate_with_character` | Image avec un personnage | crédits |
| `generate_voice_with_character` | Voix d'un personnage | crédits |
| `train_character` | Entraîner un personnage (LoRA) | crédits |
| `swap_character_in_video` | Remplacer un personnage dans une vidéo | crédits |
| `list_video_presets` | Presets vidéo | lecture |
| `list_presets` | Presets caméra et VFX | lecture |
| `get_creative_recipes` | Recettes de création | lecture |
| `get_template_recipe` | Recette d'un modèle de montage | lecture |
| `list_templates` | Modèles de montage | lecture |
| `create_from_template` | Créer depuis un modèle | écriture |
| `list_library` | Bibliothèque | lecture |
| `import_media_from_url` | Importer un média par URL | écriture |
| `create_upload_link` | Lien d'envoi d'un gros fichier local | écriture |
| `get_upload_status` | État d'un envoi | lecture |
| `list_projects` | Lister les projets | lecture |
| `create_project` | Créer un projet | écriture |
| `add_media_to_project` | Ajouter un média à la timeline | écriture |
| `get_timeline` | Lire la timeline | lecture |
| `list_media` | Médias du projet | lecture |
| `apply_edit_plan` | Appliquer un plan de montage | modifie / remplace |
| `add_motion_effect` | Ajouter un effet animé | écriture |
| `get_motion_toolkit` | Boîte à outils motion design | lecture |
| `frame_subject` | Cadrer les zooms sur le sujet | crédits |
| `list_references` | Références de bons montages | lecture |
| `mark_as_reference` | Marquer un montage comme référence | écriture |
| `track_motion` | Suivi de mouvement | crédits |
| `cutout_subject` | Détourage (texte derrière le sujet) | crédits |
| `create_lut` | Créer une LUT `.cube` | écriture |
| `apply_lut` | Appliquer une LUT à un plan | écriture |
| `plan_shots` | Planifier les plans (rythme) | lecture |
| `add_captions` | Sous-titres mot à mot | crédits |
| `review_montage` | Boucle de qualité : note /10, vision, accroche, viralité, référence | 1 crédit (vision) |
| `apply_template` | Monter un modèle dans un projet | écriture |
| `render_preview_frames` | Aperçu image par image | lecture |
| `export_video` | Exporter la vidéo (MP4) | crédits |
| `export_project_file` | Exporter le fichier de projet | écriture |
| `get_render_status` | Statut d'un rendu | lecture |
| `get_brand_kit` | Lire le kit de marque | lecture |
| `import_brand_from_website` | Importer une marque depuis un site | crédits |
| `apply_brand_import` | Appliquer la marque importée | modifie / remplace |
| `generate_vector_logo` | Générer un logo vectoriel | crédits |
| `vectorize_logo` | Vectoriser un logo | crédits |
| `export_brand_guidelines` | Charte graphique (PDF) | lecture |
| `analyze_virality` | Analyser la viralité | crédits |
| `analyze_competitor` | Analyser un concurrent | crédits |
| `web_search` | Recherche web | lecture |
| `fetch_url` | Lire une page web | lecture |
| `generate_social_post` | Rédiger un post | crédits |
| `publish_post` | Préparer ou planifier un post | écriture |
| `get_calendar` | Calendrier éditorial | lecture |
| `get_post_stats` | Statistiques d'un post | lecture |
| `get_statistics` | Statistiques de l'espace | lecture |
| `list_social_accounts` | Comptes sociaux connectés | lecture |
| `create_automation` | Créer un agent récurrent | écriture |

## Sécurité

- Chaque appel agit dans l'espace choisi à la connexion ; aucun outil n'accepte d'autre espace.
- 60 requêtes par minute par connexion. Les limites et contrôles de l'application s'appliquent (plan, crédits, propriété des projets).
- Les posts préparés par `publish_post` attendent toujours votre validation dans Clapova.

Certaines skills adaptent des workflows publiés par Higgsfield AI (MIT) : voir `THIRD_PARTY_NOTICES.md`.
