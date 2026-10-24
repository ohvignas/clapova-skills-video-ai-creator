# Message de la session « Cartographie des skills et MCP » pour Wideo

Feu vert de l'utilisateur pour tout ce qui suit. Un sous-agent par chantier, chacun dans son propre worktree et sa propre branche créée depuis la branche par défaut à jour (ne pas toucher à feat/elite-media-credits-saas-hardening). Vérifier dans le code de wideo chaque hypothèse d'architecture avant d'implémenter. Tests du dépôt avant chaque push. Pas de PR ni de merge sans accord de l'utilisateur.

Contexte : 3 pubs « Nova » (15 s, 9:16) faites via build_from_storyboard, projets px76rp9he8nve782x1q11e5brs8gwq3r (reel-motion), px7dwsjjdhr3f813ezemxgbyjx8gwj5z (premium-apple), px7ee03wc1fq62jwjcmmbqj08h8gxgjg (hyper-motion). Notes 5,5 à 6,5/10, non livrables ; ~600 crédits dépensés au lieu de ~105 estimés (solde 1184,02 → 585,22).

Ordre : 1, 2, 3, 4, 6, 5.

## Chantier 1 — P0 : build_from_storyboard refacture après expiration
Le build dépasse le délai MCP de 60 s ; chaque relance régénère et REFACTURE tous les médias. Preuves : reel-motion 9 vidéos / 3 voix / 3 images au lieu de 4/1/1 ; premium-apple 6 vidéos / 4 images / 2 voix / 2 musiques au lieu de 3/1/1/1 ; hyper-motion 10 vidéos au lieu de 4 (doublons inutilisés : p17fnj8mpdaj, p17b84yxgpp9, p17dqwxjapgn, p17115zvztvr, p172xe2v0nrs, p1799zm5aw51). Les appels qui aboutissent disent « alreadyBuilt, creditsSpent 0 » : l'idempotence annoncée est fausse.
À faire : idempotence réelle par (storyboardId, version, assetKey) avec verrou et réservation atomique ; contrat async (jobId + get_job_status) ; test de non-régression (relance après timeout = 0 génération en plus) ; script de remboursement des doublons de ces 3 projets en DRY-RUN d'abord, résultat montré à l'utilisateur, exécution réelle seulement après son accord.

## Chantier 2 — P0 : export bloqué par les scènes motion
Sur les 3 projets, export_video refuse « media_missing » sur des scènes create_motion_scene visibles en aperçu, et refuse les scènes notées < 8. Les agents ont dû les remplacer par des blocs plus pauvres (titres, compteur, CTA ratés). À faire : pré-contrôle via checkComposition de @clapova/render, assets motion matérialisés dans R2, erreur avec clipId/src/hint.

## Chantier 3 — P1 : aperçus et relecture en panne
review_montage « rendu des images clés indisponible » presque à chaque appel ; render_preview_frames en RATE_LIMITED ; export_video renvoie TOO_MANY_EXPORTS. Exports faits sans vérification visuelle. À faire : file prioritaire previewFrames, cache par hash, contrat hybride.

## Chantier 4 — autres bugs
- textAnim by:"word" colle les mots (« VoiciNova ») ; « TOUTE LA JOURNÉE » s'affiche dans le désordre.
- create_storyboard / update_storyboard débitent 1 crédit alors qu'annoncés gratuits.
- qualityIssues faux positif « Le logo ouvre la vidéo » (logo à 10-13 s ; probablement le négatif « no logo » des prompts).
- estimate_storyboard ne compte ni les scènes motion ni l'export.
- review_montage pénalise une voix off découpée en plusieurs clips (« voix coupée »).
- Transcription : « chaud » lu « show » (glossaire).
- generate_video : certains modèles refusent la durée → clips de 10 s payés pour 2-4 s utilisés.
- analyze_reference_video peu fiable (langue fausse, plans de 1,0 s pile, format faux), sans image par plan ; import_media_from_url et transcribe_media échouent sur un lien YouTube.
- PAS de sous-titres par défaut : build_from_storyboard n'en pose pas, add_captions seulement sur demande de l'utilisateur.

## Chantier 5 — toolbox créateur
Plan complet : https://github.com/ohvignas/clapova-skills-video-ai-creator/blob/claude/sweet-darwin-jrtg6b/docs/plan-toolbox-createur.md (analyze_image, import_social_video, transcription v2, make_moodboard, list_styles/get_style, analyze_edit, media_preview_url, grant_budget).

## Chantier 6 — skills (source de vérité = wideo, la synchro écrase le dépôt plugin)
Reporter dans wideo les skills de la branche claude/sweet-darwin-jrtg6b de ohvignas/clapova-skills-video-ai-creator : cadrage (fiche de direction obligatoire + catalogue de 12 styles, cadrage/styles/), toolbox-createur, storyboard (planche de croquis en code, itération conversationnelle).
Ajouter les leçons :
- ne jamais relancer un build expiré sans list_media / get_timeline d'abord ;
- ne jamais exporter sans avoir regardé les images ;
- poser soi-même les plans qui réutilisent un clip ;
- pas de sous-titres par défaut ; séparer les phases : d'abord le MOTION DESIGN (animations, titres, transitions, rythme) validé par l'utilisateur, ensuite seulement la vidéo finie (sous-titres, voix off finale, mix, export) sur demande.
Refondre la skill motion-design : index court + references/*.md à la demande (modèle rules/ de Remotion) ; section anti-patterns liée à review_montage / check_composition (texte < 120 px, mots collés, chevauchements, CTA dans les 20 % du bas) ; tokens motion nommés (enter, exit, emphasis, stagger) dérivés du brand kit ; routeur avec « ne pas utiliser si… » ; recettes chiffrées (compteur, titre cinétique, carte, CTA). Une veille exhaustive des skills motion du marché (dont github.com/Barty-Bart/motion-graphics) suivra.

Envoyer un point d'avancement par chantier à la session session_01JBhjHPN2ePxRKEkJMM7Csq et résumer à l'utilisateur ce qui est fait, ce qui bloque et ce qui attend sa décision.
