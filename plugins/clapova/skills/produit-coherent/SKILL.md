---
name: produit-coherent
description: Use when un produit doit rester identique d'un plan IA à l'autre — « pub de mon produit », « le logo se déforme », « l'étiquette change » : planche produit, image→vidéo avec première image imposée, vrai packshot recollé, contrôle image par image. Not for le script de la pub (clapova:pub-produit-ugc) ni les images seules (clapova:product-photoshoot).
---

# Clapova : produit cohérent d'un plan à l'autre

Idée unique : **le vrai packshot fait foi, l'IA ne fabrique que le décor et le mouvement.** Règles chiffrées : synthèse §3.11. Détails : `references/planche-produit.md`, `references/modeles.md`.

## Règles chiffrées

- **Planche** : 4 à 6 angles (face, 3/4, profil, dos) + 1 gros plan net de l'étiquette, fond neutre. Rotations limitées à ±35° autour des vues photographiées : au-delà, les faces sont inventées (tiers, WorkflowProduct).
- **Références Kling 3.0 Pro I2V** : par élément, 1 vue de face + 1 à 3 autres angles (officiel, schéma fal). Images ≤ 50 Mo, côté ≥ 300 px, ratio 0,4 à 2,5. Veo 3.1 : 3 images au plus. Seedance 2.0 I2V : première et dernière image seulement.
- **Première image imposée** (le packshot, ou une image à étiquette lisible). Dernière image imposée si le plan finit sur le produit. **Jamais de texte → vidéo pour un produit à étiquette.**
- **Mouvement de caméra plutôt que de l'objet**, loin de la zone du logo.
- **Modèles** (proposé, d'après `list_models` du 2026-10-24) : plans finaux en Kling 3.0 Pro I2V (58 cr) ; brouillons en MiniMax H3 Max Turbo I2V (7 cr) ou Wan 3.0 I2V (16 cr). Vérifier au moment voulu avec `list_models` / `estimate_plan`.
- **Plusieurs prises, on garde la meilleure** ; 2 régénérations au plus par plan, puis repli sur le packshot animé en montage.
- **Seuils de contrôle** (à calibrer) : similarité CLIP image-image ≥ 0,85 avec la planche ; 0,75–0,85 = avertissement ; < 0,75 = rejet.

## Boucle

1. **Prise du produit** : `create_upload_link` → `get_upload_status` (ou `import_media_from_url`). `get_credits`, puis `estimate_plan` sur tout le lot ; annonce le total, attends l'accord.
2. **Détourage du packshot** : `cutout_subject` (voir `clapova:detourage-sujet`).
3. **Planche** : `edit_image_precise` / `generate_image` avec la photo en référence ; liste les invariants (forme, position du logo, texte exact de l'étiquette, matière, proportions) et ne change que l'environnement. Option vraie 3D : `generate_3d` puis `turntable_3d` pour de vrais angles.
4. **Réglages du modèle** : `list_model_params(endpointId)` pour savoir si `elements`, `end_image_url`, `negative_prompt` sont exposés. S'ils ne le sont pas : `imageUrl` = packshot seul (première image) et dis-le. Elements Kling dans `generate_video` : **quand disponible** (S10).
5. **Brouillon** : `generate_video` en `intent:"cheap"` ou modèle Turbo, `imageUrl` = première image, prompt de mouvement seul (`clapova:prompts-video`), un preset caméra (`push-in`, `orbit`, `handheld`), `projectId` renseigné.
6. **Final** validé sur brouillon : même prompt en Kling 3.0 Pro I2V.
7. **Packshot recollé** : `refine_product_label` (**quand disponible**, S9). En attendant : packshot détouré posé sur la piste overlay et calé avec `track_motion` (`targetClipId` = le packshot ou le logo vectoriel).
8. **Motion design par-dessus** (prix, bénéfices, CTA) sur la piste overlay : `clapova:motion-logo-cta`, `clapova:motion-titres`.

## Contrôle

- `extract_frames({mediaId, mode:"everySeconds", everySeconds:0.5})` sur chaque clip : les images arrivent en médias de la bibliothèque ; compare chacune à la planche (logo, texte, forme). En MCP elles ne sont pas toujours visibles : pose le clip en timeline et regarde `render_preview_frames`. Pas vu = « non vérifié visuellement ».
- Score CLIP produit dans `analyze_edit` : **quand disponible** (S1).
- Montage réussi : `mark_as_reference({format:"lancement-produit"})`.
- Relecture finale : `clapova:controle-qualite`.

## Interdits

Texte → vidéo pour un produit de marque ; faire générer l'étiquette ou le logo sans référence ; mouvement fort sur la zone du logo ; rotation au-delà de ±35° des vues réelles ; plus de 2 régénérations d'un même plan ; livrer un plan dont l'étiquette n'a pas été vérifiée image par image ; CoTracker3 (non commercial).

## Renvois

`clapova:pub-produit-ugc` (angle, script, CTA), `clapova:product-photoshoot` (images), `clapova:detourage-sujet`, `clapova:montage-camera-virtuelle`, `clapova:controle-qualite`, routeur `clapova:montage`.

## Sources

Synthèse §3.11, §5.2 (S1, S9, S10) ; `references/recherche/ (racine du plugin) rapport-ia-produit.md` §0 et §5 ; `rapport-outils-controle.md` (seuils CLIP). Idées reformulées de ComfyUI-ProductLabelRefinement et WorkflowProduct (licences non lues : aucune reprise de texte ni de code).
