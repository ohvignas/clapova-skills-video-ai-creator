# Vidéo produit IA sans déformation, et combinaison avec le motion design
Recherche du 2026-10-24, lecture seule, en deux passes :
- **Passe 1** : 5 recherches WebSearch en mode extended, aucune page lue. Ses sections 1 à 5 reposent sur des blogs d'éditeurs.
- **Passe 2 (section 0)** : 19 pages primaires lues avec `mcp__CLAPOVA__fetch_url`. WebFetch échouait (DNS) et la recherche GitHub par `gh` est bloquée (403) ; les dépôts ont donc été trouvés par WebSearch.

**La section 0 prime en cas de contradiction.** Une source sans date lisible porte la mention « consultée le 2026-10-24 ».


## 0. Sources primaires (passe 2, toutes consultées le 2026-10-24)

### 0.1 Référence produit, durées, prix
| Modèle | Référence produit (nombre, format) | Durée / résolution | Prix | Source |
|---|---|---|---|---|
| **Kling 3.0 Pro I2V** | `elements[]` : chaque élément = 1 `frontal_image_url` + 1 à 3 `reference_image_urls` (autres angles), ou 1 vidéo (3 à 10 s, 720 à 2160 px, une seule par requête). Appel dans le prompt par `@Element1`. Images : 50 Mo max, côté ≥ 300 px, ratio 0,4 à 2,5. `end_image_url` (dernière image), `multi_prompt` (multi-plans), `negative_prompt`. | 3 à 15 s | Runway Dev : 12 cr/s sans audio, 17 cr/s avec (1 cr = 0,01 $) | schéma OpenAPI fal : https://fal.ai/api/openapi/queue/openapi.json?endpoint_id=fal-ai/kling-video/v3/pro/image-to-video ; tarifs : https://docs.dev.runwayml.com/guides/pricing/ |
| **Kling O3 Pro / 4K** | Texte, image ou vidéo vers vidéo, avec images de référence et multi-plans | 1080p / 4K | 17 / 43 cr/s | https://docs.dev.runwayml.com/guides/models/ (fiche du 2026-10-13) |
| **Veo 3.1** | « Jusqu'à trois images de référence », première et dernière image, extension | Clips de 8 s ; 720p, 1080p ou 4K ; 16:9 ou 9:16 | 40 cr/s avec audio, 20 sans ; Fast : 15 / 10 | https://ai.google.dev/gemini-api/docs/veo ; tarifs Runway Dev |
| **Veo 3.1 Preview dans l'API Gemini** | **Arrêtée** : Google renvoie vers Gemini Omni Flash | — | — | https://ai.google.dev/gemini-api/docs/video (mise à jour du 2026-10-22) |
| **Gemini Omni Flash 1.1** | Entrées multimodales (texte, images, audio, vidéo) ; retouche conversationnelle multi-tours qui préserve le reste | 360p à 4K (1080p et 4K obtenus par upscale) | 3,4 à 30 cr/s, plus 1 cr par image de référence | https://ai.google.dev/gemini-api/docs/omni ; tarifs Runway Dev |
| **Seedance 2.0 I2V (fal)** | `image_url` + `end_image_url` (JPEG, PNG, WebP…, 30 Mo max). **Pas de champ multi-référence sur cet endpoint fal.** | 4 à 15 s ou « auto » ; 480p à 4K | Runway Dev : 36 cr/s (720p), 40 (1080p), 150 (4K) | https://fal.ai/api/openapi/queue/openapi.json?endpoint_id=bytedance/seedance-2.0/image-to-video |
| **Seedance 2.5** | « Large budget de références » : images, vidéos, audio. Images et audio de référence gratuits. | Jusqu'à 30 s ; 480p à 1080p ; mode brouillon | 20 / 30 / 68 cr/s, plus la vidéo de référence ; minimum 80 cr | https://docs.dev.runwayml.com/guides/models/ (fiche du 2026-08-07) ; tarifs Runway Dev |
| **MiniMax Hailuo S2V-01** | 1 seule `subject_reference_image_url` (pensée pour les personnages) | — | — | https://fal.ai/api/openapi/queue/openapi.json?endpoint_id=fal-ai/minimax/video-01-subject-reference |
| **MiniMax H3 / H3 Max** | H3 : références texte, image, vidéo et audio. H3 Max : première et dernière image. | H3 Max : 480p ou 768p | H3 : 10 cr/s, plus 2 cr par référence. H3 Max : 5 à 8 cr/s. | Runway Dev, modèles et tarifs |
| **Wan 3.0** | Références image, vidéo et audio | 2 à 30 s ; 480p à 1080p | 5 à 20 cr/s | idem |
| **Pika 2.2 Pikascenes** | `image_urls[]` (nombre non borné dans le schéma), `ingredients_mode` « precise » ou « creative » | 5 ou 10 s ; 720p ou 1080p ; 7 formats | non trouvé | https://fal.ai/api/openapi/queue/openapi.json?endpoint_id=fal-ai/pika/v2.2/pikascenes |
| **Luma Ray 2** | Pas de référence sujet. `keyframes` frame0 / frame1 (image ou génération), `concepts` (ex. dolly_zoom), extension, interpolation, boucle, mouvements de caméra listés par l'API | 5 s ; 540p à 4K | non trouvé | https://docs.lumalabs.ai/docs/video-generation (mise à jour « il y a 4 mois ») |
| **Runway Gen-4.5 / Aleph 2.0 / Act-Two** | Gen-4.5 : texte ou image vers vidéo. Aleph 2.0 : retouche vidéo en contexte, guidée par keyframes. Act-Two : capture de mouvement (personnage), donc **pas pour un produit**. | — | 12 / 28 (minimum 56) / 5 cr/s | Runway Dev, modèles (Gen-4.5 du 2026-02-10, Aleph 2 du 2026-06-02, Act-Two du 2025-07-21) |
| **Higgsfield** | La page produit annonce photo, lien boutique ou prompt, puis vidéo : 360°, lifestyle, fond, porte-parole. Modèles proposés : Kling 3.0, Seedance 2.5 / 2.0, Veo 3.1, Wan 2.7. Conseil de la page : utiliser Nano Banana Pro pour une **première image à étiquette lisible**, puis l'animer. Aucun nombre de références n'est publié. | — | non publié | https://higgsfield.ai/ai-product-video-generator |

La page d'aide « Gen-4 References » de Runway répond 403 : elle n'a pas pu être lue.

### 0.2 Image : planche produit multi-angles
- **FLUX.2 (BFL)** : multi-référence jusqu'à **8 images via l'API, 10 dans le playground**, sortie jusqu'à 4 MP, variantes max, pro, flex et klein. https://docs.bfl.ai/flux_2/flux2_image_editing
- **FLUX.1 Kontext** : présenté par BFL comme « previous-generation », BFL recommande FLUX.2. Retouche de texte avec la syntaxe `Replace 'old' with 'new'`. La version dev a des poids non commerciaux. https://docs.bfl.ai/kontext/kontext_overview
- **IP-Adapter (ComfyUI_IPAdapter_plus)** : « think of it as a 1-image lora », poids conseillé ≤ 0,8. Le dépôt est **en maintenance seule depuis le 2025-04-14**. https://github.com/cubiq/ComfyUI_IPAdapter_plus

### 0.3 Rotoscopie et tracking
- **SAM 2 / 2.1 (Meta)** : segmentation et suivi d'objet en vidéo par clic ou boîte, multi-objets (mise à jour du 2024-12-11). Licence Apache 2.0, de 39 à 91 FPS sur A100. C'est la base pour un matte du produit plan par plan. https://github.com/facebookresearch/sam2
- **CoTracker3 (Meta)** : suivi de n'importe quel point (mise à jour du 2024-10-15), jusqu'à 265×265 points, modes hors ligne et en ligne. Sert à caler un logo ou un packshot sur une surface. **Licence CC-BY-NC, donc non commerciale.** https://github.com/facebookresearch/co-tracker
- La page Adobe sur Roto Brush répond 403 : elle n'a pas pu être lue, After Effects n'est donc pas sourcé ici.

### 0.4 Pipelines produit réels sur GitHub (3 dépôts lus)
1. **ComfyUI-ProductLabelRefinement** (renommé le 2026-10-16) : remplace le produit ou l'étiquette halluciné par le **vrai packshot**. Il déforme le packshot à la bonne perspective (homographie ou cylindre pour une bouteille) et reporte la lumière, les ombres, le reflet et le grain de la scène. Il replace le produit derrière les objets au premier plan, puis livre une planche de contrôle et un PSD en calques. Déterministe et sans modèle, piloté par un `job.json`, donc **pilotable par un agent**. Le nœud « Refine (Video) » propage une image clé corrigée sur tout un clip (tracking AllTracker, masque SAM 3). https://github.com/nastyakolykhan-sudo/ComfyUI-ProductLabelRefinement
2. **ComfyUI-productfix** : « Latent Injection » combinée à IC-Light, IP-Adapter et ControlNet depth, plus un masque de texte OCR (EasyOCR) pour transférer le détail. Objectif : garder textes et logos pendant la génération. https://github.com/MiddleKD/ComfyUI-productfix
3. **WorkflowProduct** : pipeline local en nœuds natifs (Qwen-Image-Edit 2511, jusqu'à 3 images d'entrée, jugé « le meilleur libre pour logo et texte » ; FLUX.2 klein ; BiRefNet ; SeedVR2). Il produit un packshot, une scène lifestyle et **3 vues** (3/4 gauche, 3/4 droite, plongée), avec une branche « proteger la etiqueta » qui recolle les pixels d'origine. Mise en garde du dépôt : les faces jamais photographiées sont **inventées**, donc rotations limitées à ±35°. https://github.com/didaco555/WorkflowProduct

### 0.5 Ce que la passe 2 change
- Kling Elements prend **1 vue de face + 1 à 3 angles par élément**. Le chiffre « 7 références » de la passe 1 n'est pas confirmé.
- Veo 3.1 Preview est arrêtée dans l'API Gemini : passer par Gemini Omni Flash 1.1, présent dans le catalogue Clapova.
- Le chiffre « 50 références Seedance » reste non confirmé. Seedance 2.5 a bien un « large budget » de références, et l'endpoint fal de Seedance 2.0 I2V n'expose que première et dernière image.
- Runway Act-Two est inutile pour un produit ; c'est Aleph 2.0 qui sert à retoucher.
- Une brique déterministe « vrai packshot recollé » existe déjà en open source (ProductLabelRefinement) : la recommandation « compositer le vrai packshot » repose désormais sur un outil concret.

## 1. Fonctions de référence produit, outil par outil (passe 1, blogs)
| Outil | Fonction | Ce qui est rapporté | Source |
|---|---|---|---|
| Veo 3.1 | Ingredients to Video | Jusqu'à 3 images de référence, première et dernière image imposées, extension par pas de 7 s. Une mise à jour de janvier 2026 ajoute la cohérence d'identité, le format vertical et l'export 4K. Une autre source y voit surtout une référence de style. | https://ocdevel.com/mlg/mla-26 ; https://app.cinevva.com/guides/long-reference-video-models (consultés le 2026-10-24) |
| Kling 3.0 Omni | Elements 3.0 | Plusieurs images en référence, jusqu'à 7 selon un comparatif. Kling est jugé le plus précis pour la cohérence par éléments. | https://kling.ai/blog/best-ai-video-generator-2026-kling-ai (blog de l'éditeur) ; https://app.cinevva.com/guides/long-reference-video-models |
| Runway Gen-4.5 | References, motion brush | Contrôle caméra jugé « best-in-class ». Le nombre de références reste flou (une seule selon un tableau). | https://guptadeepak.com/tools/top-5-ai-video-generation-tools-2026/ |
| Seedance 2.x / 2.5 | Multi-référence | Jusqu'à 50 références (images ou clips courts), chiffre non confirmé par une seconde source. | https://app.cinevva.com/guides/long-reference-video-models ; https://higgsfield.ai/blog/5-Best-AI-Video-Models-2026-Tested-Compared |
| Higgsfield | Product placement, Draw-to-Video, Ads 2.0, Cinema Studio 4.0 | Place le produit dans la scène avec lumière et reflets accordés. Une API donne accès à plus de 50 modèles. | https://www.layer3labs.io/guides/higgsfield-ai-for-business ; https://higgsfield.ai/blog/automate-ai-video-n8n-make |
| MiniMax Hailuo 2.3 / H3 | Référence de sujet | Tient le mieux le style dans un test (anime). Aucune donnée propre aux produits trouvée. | https://higgsfield.ai/blog/5-Best-AI-Video-Models-2026-Tested-Compared |
| Pika, Luma | — | Pas de source fiable trouvée pendant cette passe : non documenté ici. | — |

Prix et durées changent vite. Les coûts en crédits Clapova sont en section 5.

## 2. ComfyUI et retouche d'image : fabriquer la planche produit
- **FLUX.2 Dev** : la doc officielle ComfyUI indique une cohérence multi-référence jusqu'à 10 images (géométrie, textures, matériaux) et des workflows de mockup produit. C'est la meilleure base pour une planche multi-angles. https://docs.comfy.org/tutorials/flux/flux-2-dev
- **Flux Kontext** : garde l'identité et la mise en page stables d'une retouche à l'autre. Méthode conseillée : lister les invariants (forme, position du logo, texte de l'étiquette, matière, proportions, angle) et ne modifier que l'environnement. https://docs.comfy.org/tutorials/flux/flux-1-kontext-dev ; https://eastondev.com/blog/en/posts/ai/20260821-comfyui-flux-kontext-character-consistency/ (2026-08-21)
- **IC-Light** : rééclaire le produit détouré pour l'accorder au nouveau fond. Les poids V1 autorisent l'usage commercial, pas la V2. https://medium.com/@oguzs/comfyui-transforming-products-with-ic-light-59d2800ae933 ; https://www.stablediffusiontutorials.com/2024/07/ic-light.html (2024-07)
- **Planche puis LoRA** : la méthode documentée vient des personnages (une planche multi-angles sert à entraîner une LoRA). Aucune version produit publiée n'a été trouvée, il faut l'adapter. https://www.runflow.io/blog/comfyui-consistent-characters-flux

## 3. Skills, agents et pipelines existants
- Le blog Higgsfield décrit un nœud HTTP n8n vers son API (Seedance, Kling…). https://higgsfield.ai/blog/automate-ai-video-n8n-make
- Le tutoriel Novapixel décrit un pipeline n8n : une nouvelle ligne déclenche un LLM qui écrit 7 scripts, puis des générations en parallèle. Aucun template téléchargeable. https://novapixeldev.com/blog/cinematic-ai-video-ad-pipeline-tracking-automation
- Le dépôt GitHub n8n-ai-catalogue ne contient que des fiches d'outils, sans workflow. https://github.com/robertkotsch/n8n-ai-catalogue/issues/105
- Aucune skill Claude « vidéo produit cohérente » publique n'a été trouvée : la place est libre.

## 4. Bonnes pratiques
1. **Composer le vrai packshot** plutôt que le faire générer. L'IA produit le décor et le mouvement autour. Imposer la première et la dernière image (keyframes) et éloigner le mouvement de la zone du logo, car même un composite bave sur le texte si le mouvement est fort. Les produits transparents ou réfléchissants sont les plus durs. https://primores.org/wiki/marketing/ai-product-video-fidelity/
2. **Étiquettes** : le modèle réécrit le texte avec des fautes. Ajouter un gros plan net de l'étiquette en référence. https://www.blendnow.com/blog/top-10-tools-for-product-photography
3. **Références** : de 3 (Veo) à 7 (Kling) selon le modèle. Fond neutre, angles face, 3/4, profil et dos, plus le gros plan d'étiquette (synthèse des sources 1 et 2).
4. **Générer plusieurs prises et garder la meilleure** : la dérive d'identité reste le premier mode d'échec. https://ocdevel.com/mlg/mla-26
5. **Passer par la 3D (Blender/Spline)** quand la géométrie, le texte ou le packaging doivent être exacts. Un animatique Blender sert alors de guide caméra et de mise en place, et l'IA ajoute matières et lumière (vidéo à vidéo). https://fal.ai/h3-max-3d-to-video ; https://maxvideoai.com/blog/blender-animatic-ai-product-reveal-source-vs-reference
6. **Rotoscopie et tracking** : masque du produit avec SAM 2 (Apache 2.0), suivi de points avec CoTracker3 (non commercial) ou AllTracker, puis reprojection de l'étiquette réelle sur chaque image, comme le fait le nœud vidéo de ProductLabelRefinement (section 0.3-0.4).

## 5. Ce que Clapova doit faire
**Nouvelle skill `produit-coherent`**
1. Prise du produit : `create_upload_link`, puis `cutout_subject` pour le détourage.
2. Planche produit (4 à 6 angles et gros plan d'étiquette) avec `edit_image_precise` / `generate_image`, invariants listés à la manière de Kontext. Marquer la planche avec `mark_as_reference`. Option : `generate_3d` puis `turntable_3d` pour avoir de vrais angles.
3. Plans en image vers vidéo avec première image imposée (le packshot) et mouvement de caméra plutôt que de l'objet.
4. Contrôle des déformations : `extract_frames`, puis comparaison avec la planche (logo, forme), puis nouvelle prise au besoin.
5. Composite final : `track_motion` pour caler le vrai packshot ou le logo vectoriel sur la piste overlay, puis `add_motion_block` pour le motion design (prix, bénéfices, CTA) par-dessus les plans IA.

**Outils MCP manquants**
- **Elements Kling dans `generate_video`** : `elements[{frontal, refs[1-3]}]` et `end_image_url` existent dans le schéma fal de Kling 3.0 Pro, que Clapova appelle déjà. À vérifier avec `list_model_params` : si Clapova ne les expose pas, ce sont les premiers champs à ajouter.
- **`refine_product_label`** : recoller le vrai packshot sur l'image ou la vidéo générée, sur le modèle de ProductLabelRefinement (homographie ou cylindre, report de la lumière, matte SAM 2), avec un rapport de contrôle.
- Génération multi-référence pour les autres modèles (Ingredients, références Seedance 2.5), via un paramètre `referenceImages[]` dans `generate_video`.
- Première et dernière image imposées, exposées clairement.
- Rééclairage (de type IC-Light).
- Score de fidélité produit, en comparant les plans à la planche.
- Composite tracké automatique (« pin packshot »).
- Entraînement d'une LoRA produit, sur le modèle de `train_character` pour les personnages.

**Modèles à privilégier (list_models, offre studio, 2026-10-24)**
- Plans héros : **Kling 3.0 Pro I2V (58 cr)**, seul modèle du catalogue dont le schéma confirme des Elements produit multi-angles. Seedance 2.5 (95 cr) pour les scènes riches en références.
- Gemini Omni Flash 1.1 I2V (42 cr) pour des retouches itératives qui préservent le reste. Seedance 2.0 I2V (59 cr) seulement avec première et dernière image.
- Première image : la générer avec un modèle d'image à texte lisible (Nano Banana Pro, recommandé par Higgsfield), ou mieux, recoller le vrai packshot.
- Mouvement imposé depuis un animatique : Kling 3.0 Pro motion-control (70 cr).
- Retouche vidéo : Kling O1 edit (70 cr).
- Brouillons pas chers : MiniMax H3 Max Turbo I2V (7 cr) et Wan 3.0 I2V (16 cr).
- À éviter pour un produit à étiquette : le texte vers vidéo.
