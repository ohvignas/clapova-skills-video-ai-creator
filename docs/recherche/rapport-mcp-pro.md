# Serveurs MCP et skills qui pilotent des logiciels de motion et de vidéo pro : analyse détaillée

Date : 24/10/2026. Méthode : clones `--depth 1` en lecture seule dans `scratchpad/deep/` (rien n'a été exécuté), plus des recherches web. Étoiles : chiffres de la note de veille (GitHub, 24/10). L'API GitHub n'était pas accessible depuis cette session, donc ces chiffres n'ont pas été revérifiés. « Dernier commit » = date du HEAD cloné.

Accès impossibles :
- p10q/ae-mcp : le clone a échoué (dépôt privé, supprimé ou nom différent).
- Pages officielles rive.app, docs.lottiefiles.com et motion.dev : le DNS ne les résolvait pas (ENOTFOUND). Ces trois projets ne sont donc décrits que d'après les résumés de recherche web, ce qui est indiqué à chaque fois.

---

## 1. ahujasid/blender-mcp (dossier `ahujasid_blender-mcp`)

- **Pilotage.** Un addon Blender (`addon.py`) ouvre un serveur socket TCP sur le port 9876. Le serveur MCP Python (FastMCP, `src/blender_mcp/server.py`, 2 273 lignes) lui envoie des commandes JSON. Un verrou sérialise envoi et réception sur le socket, et les réponses arrivent par morceaux.
- **Outils** (lus dans le code) :
  - `get_addon_status` : version de Blender, bibliothèques et générateurs actifs.
  - `get_scene_info(query, root, fields[], limit=20)` : texte compact, une ligne par objet. Champs au choix : placement, contenu, *health* (topologie, poids), *settings*. Pagination avec la mention « N more, narrow with query ».
  - `execute_blender_code(code)` : du Python bpy arbitraire, l'outil central.
  - `look(mode=viewport|camera|angles|frames, target[], views[], distance, shading, frames[], frame_count, view, image, max_size=768)`.
  - `generate_3d(prompt|image, provider, quality, bbox_condition, pose_mode, job, wait_seconds)`.
  - `search_assets`, `import_asset` (Poly Haven, Sketchfab, Poly Pizza).
  - `record_trajectory_feedback`, `disable_telemetry`.
  - Outils réservés à l'app MCP (viewport intégré) : `open_viewport`, `viewport_latest(since)`, `viewport_capture(max_size, auto)`, `viewport_pick(seq, x, y)` (lance un rayon depuis un clic sur une capture).
  - Presque tous les outils prennent un paramètre `user_prompt` : la demande de l'utilisateur, citée mot pour mot.
- **Boucle de vérification.** `look` renvoie une seule image : vue de la caméra, planche multi-angles, ou bande de frames d'une animation. Tous les réglages modifiés pour la capture sont restaurés ensuite. Les instructions serveur répètent « look is how you see your work » et conseillent un `max_size` réduit pour limiter le coût en contexte. Les faits chiffrés passent par `get_scene_info` en texte, les images par `look` : deux outils séparés.
- **Idées à reprendre.**
  - Séparer « faits en texte » et « image ». Une seule image composite par appel (multi-angles ou bande temporelle).
  - Restaurer l'état après une capture.
  - Laisser l'agent régler la taille d'image.
  - Pour les tâches longues : attendre au maximum 45 s, puis rendre un *job handle* à repasser au même outil. Répéter une génération non terminée la reprend au lieu de la payer deux fois (idempotence liée au coût).
  - Garder les instructions serveur courtes, avec des pièges concrets.
- **Licence et maturité.** MIT. Dernier commit le 24/10/2026. Les étoiles ne sont pas relevées dans la note (projet très connu, chiffre non vérifié ici). `TERMS_AND_CONDITIONS.md` (août 2026) décrit une télémétrie anonyme, avec collecte de contenu sur consentement explicite (*opt-in*). Le code mentionne des générateurs « Premium ».
- **Limites.** Repose sur l'exécution de code arbitraire (risque de sécurité). Exige un Blender ouvert avec l'addon. Une partie des générateurs est payante.

## 2. samuelgursky/davinci-resolve-mcp (dossier `samuelgursky_davinci-resolve-mcp`)

- **Pilotage.** API officielle de scripting de Resolve (`scriptapp("Resolve")`, réservée à la version Studio). Pour la version gratuite jusqu'à 21.0.x : un *bridge* lancé depuis Workspace > Scripts, sur la boucle locale (*loopback*), avec requêtes signées HMAC et nonces à usage unique. Resolve 21.1 a fermé cette voie (le README le documente).
- **Outils.**
  - Mode compound (défaut) : 37 outils de la forme `tool(action, params)`. Parmi eux : `timeline`, `timeline_item`, `timeline_frame`, `timeline_markers`, `timeline_ai`, `media_pool`, `media_analysis`, `render`, `render_presets`, `fusion_comp`, `gallery`, `lut`, `dctl`, `color_group`, `project_manager*`, `resolve_control`, `knowledge`, `setup`.
  - Mode `--full` : 390 outils, un par méthode de l'API.
  - Serveur Node « advanced » : 18 outils hors ligne.
- **Boucle de vérification.**
  - `timeline_frame(action="capture", timecode, max_width, quality)` renvoie l'image rendue par Resolve et restaure la page, la tête de lecture et la timeline.
  - `timeline(action="thumbnail_contact_sheet")` donne une planche de vignettes.
  - Le *prompt* de workflow demande de vérifier image par image (trous, chevauchements, vignettes aux marqueurs et aux points de coupe) et de comparer l'intention des marqueurs à ce que Resolve affiche.
  - `media_analysis` en deux temps : l'outil renvoie des `frame_paths` ; l'agent regarde les images puis appelle `commit_vision`. Ne pas finaliser compte comme un échec explicite.
- **Idées à reprendre.**
  - **Enveloppe d'opération** commune à toutes les réponses : `_operation{status success|partial|blocked|failed, verification (avec "contradiction" quand l'app dit OK mais que la relecture dit autre chose), changes (delta sémantique), warnings, execution_id}`. Règle : « unverified » veut dire « pas de preuve », pas « tout va bien ».
  - Les actions `probe_*`, `boundary_report`, `safe_*`, `dry_run`, et des jetons de confirmation (`confirm_tokens`) avant les actions destructives.
  - `inspect_operation` : évaluation du risque et du rayon d'impact (item, piste, timeline, projet) avant d'agir.
  - Tâches longues : `params.background=true` renvoie un `job_id`, suivi avec `resolve_control(action='job_status')`.
  - Traces d'exécution et rapport exportable (« pourquoi l'agent a fait ça »).
  - Mode compound pour économiser le contexte.
- **Licence et maturité.** MIT. 3,7k étoiles et 429 forks (note, 24/10). v4.15.3. Dernier commit le 23/10/2026. Couverture d'API annoncée à 100 %, « Live Tested 93.6 % » (badge du README).
- **Limites.** Resolve Studio nécessaire en pratique. Fichiers très volumineux (`server.py` dépasse 34 000 lignes). Une offre gérée (« Bradford Post Assistant ») en bêta fermée.

## 3. kacperchlebowicz/Cavalry-mcp (dossier `kacperchlebowicz_Cavalry-mcp`)

- **Pilotage.** Requêtes HTTP POST `{type, code}` vers Stallion (`127.0.0.1:8080/post`), un pont qui tourne dans Cavalry et y exécute du JavaScript. Deux fichiers seulement (`index.ts`, `stallion.ts`).
- **Outils (21).**
  - Connexion et script : `cavalry_ping`, `cavalry_run_script`.
  - Calques : `create_layer`, `set_attribute`, `get_attribute`, `connect`, `get_scene_layers`, `get_selected_layers`, `select_layers`, `delete_layers`, `duplicate_layer`, `get_bounding_box`, `set_generator`, `add_dynamic_attribute`.
  - Animation : `keyframe`, `magic_easing`.
  - Composition et fichiers : `get_composition_info`, `set_current_frame`, `render_png(filePath, scale)`, `save_scene`, `open_scene`.
- **Boucle de vérification.** `render_png` écrit un PNG mais ne renvoie qu'un texte (« Rendered to … »). L'agent ne voit pas l'image, sauf à relire le fichier par d'autres moyens.
- **Idée à reprendre.** Des outils atomiques nommés d'après le modèle de l'app (calque, attribut, keyframe, easing), plus une échappatoire de script. À l'inverse, à ne pas reproduire : un rendu qui ne renvoie pas l'image.
- **Licence et maturité.** MIT d'après le README et `package.json` (pas de fichier LICENSE). 31 étoiles (note). v1.0.0. Dernier commit le 19/02/2026.
- **Limites.** Aucun schéma d'erreur. Les chemins de fichiers sont injectés dans le code avec un échappement minimal.

## 4. dha-aa/ae-motion (dossier `dha-aa_ae-motion`) — le plus abouti pour Clapova

- **Pilotage.** Serveur Node/TypeScript qui envoie `POST 127.0.0.1:<port>/cmd` avec l'en-tête `x-ae-token` à un panneau CEP, qui exécute de l'ExtendScript (`host/*.jsx`). Les rendus passent par `aerender` en arrière-plan (`src/render/manager.ts`).
- **Outils** (environ 77, dans `docs/tools.md`) :
  - Inspection : `get_project`, `get_comp`, `get_layer`, `list_properties`, `get_keyframes`, `find_effects`.
  - Projet : `open_project`, `save_project(snapshot)`, `create_comp`, `set_comp`, `import_footage`, `set_item`, `delete_item`.
  - Calques : `add_layer`, `set_layer`, `replace_source`, `link_layers`, `duplicate_layer`, `reorder_layer`, `precompose`.
  - Timeline : `split_layer`, `delete_range`, `insert_time`, `shift_layers`, `sequence_layers`, `align_to_markers`, `trim_comp`, `set_playhead`, `*_marker`.
  - Masques : `add_mask`, `set_track_matte`.
  - Design : `align_layers`, `set_anchor`, `add_shape`, `add_layer_style`, `text_to_shapes`.
  - Animation : `set_property`, `set_keyframes` (interpolations *spring* et *bounce*), `edit_keyframes`, `copy_animation`, `set_expression`, `apply_effect`, `apply_preset`, `set_text`, `find_fonts`, `stagger`.
  - Motion de haut niveau : `animate` (fade, pop, slide…, avec un style snappy, smooth, spring ou bounce), `text_reveal`, `transition` (wipe, bars, iris), `review_motion`.
  - 3D : `camera_move`, `camera_shake`, `camera_rig`, `set_3d`, `set_light`.
  - Aperçu et rendu : `preview_frame`, `render_start`, `render_status`, `render_cancel`.
  - Audio : `beat_markers`, `audio_react`, `find_sound_cues`, `duck_music`, `add_sfx`.
  - Serveur : `run_jsx` (désactivé par défaut), `batch`, `load_tools`, `check_for_updates`.
  - Ressources : `ae://project`, `ae://selection`. Prompt : `motion-guide`.
- **Boucle de vérification.**
  - `preview_frame` rend une image, ou jusqu'à 9 frames en planche contact, réduite à 768 px (1 152 px pour une planche). Le résultat indique quelle scène montre chaque frame. Le serveur attend la fin d'écriture du PNG (lecture du chunk IEND).
  - `review_motion` critique l'animation sans rendu, donc sans coût d'image : keyframes linéaires, temps morts au-delà de 1 s, départs simultanés, calques sans entrée, texte trop petit, calage sur les beats.
  - `render_status` renvoie pourcentage, `eta_s` et `poll_after_s`. Il détecte aussi les faux succès d'aerender (sortie 0 après un manque de mémoire GPU).
- **Idées à reprendre.**
  - Un modèle d'erreur unique `{code, message, hint}` avec les codes NOT_FOUND, BAD_ARGS, AE_ERROR, BRIDGE_DOWN, TIMEOUT, FORBIDDEN, UNSUPPORTED, EXISTS. TIMEOUT précise si un nouvel essai risque d'exécuter la commande deux fois.
  - Les arguments inconnus sont rejetés, avec une suggestion (« did you mean stagger -> stagger_seconds ? »).
  - Réponses compactes, plafonnées à 25 000 caractères ; au-delà, un message explique comment demander moins.
  - Les quatre annotations MCP (readOnly, destructive, idempotent, openWorld) sur chaque outil.
  - Une opération = une étape d'annulation (*undo*).
  - `batch` jusqu'à 50 appels, avec références `$N.path` et `$nom.id` d'une étape à l'autre.
  - Groupes d'outils chargés à la demande (`load_tools`, `tools/list_changed`) selon le client.
  - Instructions serveur sous 4 096 caractères (vérifié par un test).
  - Une boucle documentée : get → create → keyframes → preview (plusieurs frames en un appel) → ajuster → render_start → poll.
- **Licence et maturité.** MIT. 5 étoiles (note). v2.24.0 du 23/10/2026. CHANGELOG de 397 lignes. Très actif.
- **Limites.** After Effects 2022 ou plus récent, sur poste local. Pas d'usage serveur ou cloud.

## 5. p10q/ae-mcp

- Non lisible : le clone GitHub a échoué et mcpservers.org était injoignable. D'après les résumés de recherche (mcpservers.org, LobeHub) : pont par fichiers avec After Effects, AE 2022+, Node 16+, TypeScript, licence MIT, construit à partir d'un BRD rédigé avec Claude Code. Liste d'outils et étoiles inconnues.

## 6. Rive MCP (officiel, Early Access)

- Source : résumés de recherche (rive.app/docs/editor/ai/mcp) ; la page elle-même était injoignable.
- Serveur HTTP local `127.0.0.1:9791/mcp`, servi par l'app de bureau Rive Early Access, qui doit rester ouverte. Une ancienne page parlait de SSE et d'un support Mac uniquement.
- Familles d'outils : fichiers et artboards, inspection et édition de scène, formes et mises en page, animations et state machines, data binding (view models), scripts Luau et shaders WGSL.
- Statut : Early Access, « pas pour la production ». Licence non précisée.
- Ne pas confondre avec « rivemcp » de paradoxsyn (139 outils, glama), qui n'est pas officiel et n'a pas été lu.
- Idée : piloter un éditeur via un endpoint HTTP MCP local exposé par l'app elle-même.

## 7. Lottie Creator MCP (LottieFiles, officiel)

- Source : résumés de recherche ; la page de documentation était injoignable.
- `npx -y @lottiefiles/creator-mcp@latest` (Node 18+). L'app web Creator doit rester ouverte dans un onglet : le MCP pilote le navigateur. Clients cités : Claude Code, Cursor, Codex, Copilot, Amp, Cline, Antigravity.
- Fonctions (d'après un annuaire tiers) : créer, éditer (couleurs, timing, easing, noms de calques), générer des variantes en lot (thèmes clair et sombre). Recommande d'y associer le skill `lottiefiles/motion-design-skill`.
- Noms exacts des outils, licence et étoiles : non vérifiés. Billet de lancement daté du 15/04/2026 (note).
- Idée : variantes en lot depuis une même source, et association serveur + skill de principes.

## 8. Motion+ AI Kit (motion.dev, documentation publique)

- Source : résumés de recherche (motion.dev/docs/ai-kit, ai-kit-install, motionscore-code-audit) ; le site était injoignable.
- Contenu : un MCP via npx (version gratuite : recherche dans la doc et génération de ressorts CSS ; le token Motion+ débloque le code des exemples premium et les transitions sauvegardées) et des skills (`/motion`, audit `/motion-audit`, nom variable selon les pages). L'audit note chaque animation de S à F selon son coût de rendu, avec un rapport et des corrections.
- MotionScore : mesure en navigateur réel, suivi des régressions, blocage possible en CI.
- Prix : Motion+ payant ; sources contradictoires sur achat unique ou abonnement.
- Idée : un audit noté par animation, avec les corrections associées, comme `review_montage`.

## 9. Skills Motion Canvas

- **davila7/claude-code-templates** (`cli-tool/components/skills/video/motion-canvas`) : `SKILL.md` de 360 lignes, références `animations.md`, `generators.md`, `signals.md`, licence MIT, v2.0.0. Contenu : installation et contournement ESM/CommonJS du plugin Vite. Aucun outil : la vérification se fait dans l'éditeur Vite en temps réel (« Preview frequently »). Dépôt à 32,9k étoiles au total ; dernier commit le 24/10/2026.
- **apoorvlathey/motion-canvas-skills** (le nom de la note, `motion-canvas-skills`, est le bon) : `SKILL.md` + `references/api-reference.md` et `patterns.md`, licence MIT, 2 étoiles, dernier commit le 26/01/2026. Pour le rendu : « Click RENDER in editor UI », plugin ffmpeg facultatif. Aucune vérification par l'agent.
- Idée : la séparation index + références à la demande. Rien à reprendre côté MCP.

## 10. Skills Theatre.js

- **noklip-io/agent-skills** (`skills/theatre-js`) : `SKILL.md` de 240 lignes + 6 références (core, prop-types, studio, react, r3f, production), MIT, 1 étoile, dernier commit le 31/01/2026. Une table d'aide-mémoire (`getProject`, `sheet.sequence.position = 1.5` pour se positionner dans le temps). Aucune boucle visuelle.
- **fandhe-ai/agent-reference-skills** (`skills/theatrejs`) : 67 fichiers .md (concepts, core, studio, r3f, manual), un fichier par API. Aucun fichier LICENSE trouvé à la racine (licence inconnue). Dernier commit le 24/10/2026.
- Idée : se positionner dans la timeline par code (`sequence.position`), ce qui permet de capturer une frame à un instant donné ; un modèle pour l'outil `render_preview_frames(times[])`.

---

## Synthèse pour le serveur MCP Clapova

1. **Voir son travail.** Un outil d'aperçu qui renvoie UNE image (frame seule, ou planche de plusieurs instants) avec une taille réglable par défaut à 768 px et la scène identifiée par frame (ae-motion, blender `look`, Resolve `capture`). Restaurer l'état après capture.
2. **Critique sans image.** Une analyse textuelle peu coûteuse (`review_motion`) avant l'aperçu en images.
3. **Enveloppe de résultat** : statut, vérification par relecture (avec « contradiction »), delta des changements, avertissements, identifiant d'exécution (Resolve).
4. **Erreurs typées** `{code, message, hint}`, arguments inconnus refusés avec suggestion, TIMEOUT qui dit si un nouvel essai est sûr (ae-motion).
5. **Tâches longues** : attente bornée puis handle de job ; `status` renvoie `poll_after_s` et `eta_s` ; relancer reprend sans refacturer (blender `generate_3d`, ae-motion `render_status`).
6. **Sécurité** : `dry_run` / `safe_*` / jetons de confirmation pour le destructif ou le facturé ; annotations MCP readOnly, destructive, idempotent ; une étape d'undo par appel.
7. **Économie de contexte** : outils compound `tool(action, params)` ou groupes chargés à la demande, `batch` avec références `$N`, réponses plafonnées et paginées, instructions serveur courtes.
8. **Outils de haut niveau métier** (`animate`, `text_reveal`, `transition`, `duck_music`, `find_sound_cues`, `beat_markers`) en plus des primitives.
