---
name: motion-design
description: Use when Claude animates or styles a Clapova video like a motion designer — premium motion blocks (titles, lower thirds, counters, logo reveals, CTA, shader transitions), keyframes and easing, kinetic typography, shapes and nested layers, masks, colour grading and .cube LUTs, speed ramps, camera moves, motion tracking, text behind the subject, 3D text — via get_motion_catalog / add_motion_block, apply_edit_plan (set_motion, add_motion, add_block, add_effect, set_transition, speed_ramp), track_motion, cutout_subject, create_lut, apply_lut, frame_subject. Also the 5-block motion plan and framing rules.
---

# Clapova : motion design

Même boîte à outils pour l'Agent intégré et le serveur MCP. Commence par `get_motion_catalog` (blocs prêts) ; `get_motion_toolkit` liste tous les réglages bruts (effets, transitions, looks, polices, fusions, easings, limites). Boucle, pistes et vérification : `clapova:monteur`. Rythme, son et styles : `clapova:montage-recipes`.

Ce skill est la source unique pour : méthode en 5 blocs, règles de cadre, point attaché, timings et easings, blocs motion.

## Méthode en 5 blocs (avant toute pièce motion)

Écris ce plan, avec une timeline chiffrée, avant la première op :
1. **Entrées** : durée, format, marque, musique (sinon valeurs par défaut annoncées).
2. **Direction** : une police sans empattement, un accent, un fond ; trois niveaux de texte.
3. **Structure** : scènes avec temps de début et de fin, calées sur la musique (1 mesure = 4 temps, la chute = la coupe principale) ; sans musique, grille de 0,25 s.
4. **Build** : les ops exactes (blocs, keyframes, effets) par scène.
5. **Pièges** : ce qui peut casser (texte trop long, sujet coupé, contraste) et le contrôle prévu.

## Règles de cadre

- Remplir le cadre : en 1080 de large, titres 140 à 180 px, sous-textes ≥ 34 px, élément principal sur au moins 60 % de la largeur.
- Composition centrée verticalement dans la zone sûre, jamais collée en haut. Rien dans les coins ni dans les 20 % du bas en 9:16.
- Un élément fort visible dès la première image ; le cadre est rempli, pas de vide.
- Style créateurs / réseaux : jeune, « à la Apple », vertical 9:16.
- Contraste : texte secondaire au moins `#B8B8C4` sur fond sombre ; éléments inactifs à 60 % d'opacité minimum.
- Un message fort par plan. Aucun plan statique de plus de 0,5 s : quelque chose bouge toujours.

## Point attaché (fil conducteur)

Un élément qui suit un autre (point d'accent sur une barre, flèche sur un bouton, titre sur un visage) doit être **attaché**, jamais placé par des coordonnées absolues calculées à la main :
- dans une même composition : calques du même `add_motion` animés par les mêmes keyframes de groupe (ou même `motionPath`) ;
- sur un objet filmé : `track_motion({projectId, clipId, targetClipId|text, prompt|point|box, offsetX?, offsetY?, followScale?})` (≈ 3 crédits / 10 s).

## Timings et easings

- Entrée 0,4 à 0,7 s `power3.out` ou `expo.out` ; sortie 0,2 à 0,35 s `power2.in` ; transformation 0,5 à 0,9 s `power3.inOut` ; dépassement discret `back.out(1.4)` ; décalage entre éléments 0,04 à 0,08 s.
- Jamais `linear` ni l'ease par défaut. Entre en décélérant, sors en accélérant.
- Repères : titre par mots 0,9 s (stagger 0,08) ; titre par lettres 1 s, un seul mot héros ; logo 1,2 s (échelle 0,6 à 1) ; lower third 0,5 + 2,5 + 0,3 s ; compteur 1,4 s puis pulsation 1,06 ; wipe 0,5 s ; push zoom 0,45 s ; zoom caméra 1 à 1,2 sur 1,2 s, jamais continu ; carte finale 1,5 s qui reprend la première image.
- Interdits par défaut : lueur sur texte, burst de particules, RGB split, secousse, crossfade, dégradé gratuit. Glitch : 0,3 s, une fois par vidéo, ton tech seulement.

## Blocs motion premium (premier choix)

`get_motion_catalog({query?, category?})` (gratuit) renvoie 30 blocs avec `useWhen`/`avoidWhen`, durées et variables typées. Pose-en un avec `add_motion_block({projectId, block, start, duration?, variables?})`, plusieurs avec l'op `add_block{block, start, duration?, variables?}`.

Pour une scène sur mesure (interface animée, mockup iPhone, feed, notifications, compteur, carte de fin) : `create_motion_scene({projectId, brief, ...})` puis `edit_motion_scene({projectId, sceneId, patch})` (note visuelle 1 crédit). Les évènements de la scène servent ensuite à `place_sfx_from_events({projectId})` pour caler les bruitages.

| Famille | Ids |
|---|---|
| Titres | `title-kinetic-words`, `title-char-rise`, `title-mask-reveal`, `title-split-lines`, `title-stack-bold`, `title-underline-sweep`, `title-quote` |
| Lower thirds | `lt-bar-slide`, `lt-box-stack`, `lt-minimal-line`, `lt-social-handle`, `lt-tag-pill` |
| Chiffres | `counter-count-up`, `counter-big-number`, `counter-progress-bar`, `counter-stat-ring` |
| Logo | `logo-scale-in`, `logo-mask-wipe`, `logo-line-frame`, `logo-endcard` |
| Mise en avant | `callout-arrow-label`, `callout-highlight-box` |
| CTA | `cta-button`, `cta-subscribe` |
| Transitions | `tr-wipe`, `tr-iris`, `tr-split-doors`, `tr-stripes`, `tr-chevron`, `tr-flash-white` (start = instant de la coupe - durée/2) |

## Contrôle libre (ops de `apply_edit_plan`)

Temps en secondes depuis le début du clip ; `x`, `y` en % du cadre ; boîtes de calques en fractions 0 à 1.

| Besoin | Op ou outil |
|---|---|
| Animer un clip | `set_motion{clipId, keyframes:[{t, x, y, scale, rotation, opacity, blur, ease}]}` ; 3D : `rotationX`, `rotationY`, `z` |
| Trajectoire | `set_motion{clipId, motionPath:{points, type, duration, ease, autoRotate}}` |
| Étalonnage | `set_motion{clipId, grade:{brightness, contrast, saturation, hue, temperature, vignette, grain, look}}` |
| Masque, fusion | `set_motion{clipId, mask:{shape, x, y, w, h, feather?, invert?, reveal?}}`, `set_motion{clipId, blend}` |
| Typo cinétique | `textAnim:{by:"char"\|"word"\|"line", from, stagger, duration, ease, out}` sur `add_text` ou `set_motion` |
| Calques, formes, 3D | `add_motion{start, duration, layers:[{type:"text"\|"rect"\|"ellipse"\|"line"\|"image"\|"text3d"\|"model3d", ...}], keyframes?}` |
| Effet caméra, surcouche | `add_effect{clipId\|at, preset}` : `camera-ken-burns`, `camera-zoom-punch`, `camera-zoom-out`, `camera-pan`, `camera-rotate`, `camera-handheld`, `camera-bounce`, `camera-blur-in`, `camera-glitch`, `camera-shake`, `camera-flash`, `overlay-light-leak`, `overlay-grain`, `overlay-letterbox`, `overlay-scanlines`, `overlay-progress`, `particules` |
| Zoom qui vise le sujet | `frame_subject({projectId, clipIds?, prompt?})` puis `add_effect{..., params:{zoom, cibleX, cibleY}}` |
| Transition | `set_transition{clipId\|at, edge, transition:{preset}}` : `transition-fondu`, `transition-fondu-noir`, `transition-zoom`, `transition-glisse`, `transition-whip`, `transition-flou`, `transition-rotation`, `transition-glitch`, `transition-flash`, `transition-volet` |
| Rampe de vitesse | `speed_ramp{clipId, from, to, segments?}` |
| Texte prêt à l'emploi | `add_text{..., effect:{preset}}` : `titre-cinetique`, `bandeau-titre`, `compteur`, `glitch`, `machine-a-ecrire`, `zoom-punch` |
| Texte derrière le sujet | `cutout_subject({projectId, clipId, prompt|point|box})` (≈ 3 crédits / 10 s) |
| LUT | `create_lut({name, from?, grade?:{contrast, saturation, temperature, shadows, highlights, toning, fade}})` puis `apply_lut({projectId, clipId, preset|lutMediaId|cubeUrl, intensity?})` (gratuits) |

## Exemple

Accroche « punch » puis titre par mots :

```json
{"op":"set_motion","clipId":"ref:hook","keyframes":[{"t":0,"scale":1.6,"blur":12},{"t":0.35,"scale":1,"blur":0,"ease":"expo.out"}]}
{"op":"add_block","block":"title-kinetic-words","start":0.2,"variables":{"text":"3 ERREURS À ÉVITER"}}
```

Vérifie les variables réelles d'un bloc avec `get_motion_catalog` avant de l'utiliser.

## Limites

Un sujet par suivi ou détourage, plans de 3 min au plus. 3D : textes extrudés et modèles `.glb`, pas de scène complète. Toujours vérifier avec `render_preview_frames` (voir `clapova:monteur`).

## Qualité motion : grille de contrôle

Une scène ou un bloc n'est livrable qu'à 8/10 ou plus sur : cadre, lisibilité, point attaché, rythme, rien de coupé, contraste, hiérarchie (un seul élément dominant, titres 120 px et plus), remplissage (70 % de la hauteur utile), mouvement continu (jamais d'image identique à la précédente), cohérence de style (une police, 3 couleurs, mêmes rayons) et aucun texte superposé. Une scène minimale (« Bonjour » seul) ne dépasse pas 4.

## Contrôle image par image (obligatoire)

Après create_motion_scene, edit_motion_scene, add_motion_block, apply_edit_plan avec blocs motion et build_from_storyboard : regarde CHAQUE image de contrôle (une par temps fort), liste les défauts, corrige, re-vérifie sur de nouvelles images. Pas de livraison ni d'export_video tant qu'une note est sous 8 ou qu'une image n'a pas été vue. export_video refuse une scène notée sous 8 (sauf forcer: true à la demande de l'utilisateur).

## Son léger

Au plus un bruitage par 2 s, seulement sur les temps forts (poids 0,6 et plus), whoosh réservé aux coupes de poids 0,85 et plus, jamais un whoosh à chaque coupe. Volume des bruitages autour de -20 dB (gain 0,12 à 0,24), -6 dB de plus sous la voix ; musique en ducking (0,35) sous la voix ; compteurs : 3 ticks par compteur. Hauteur 0,95-1,08.

## Autres guides à lire

Avant de monter ou de planifier : get_guide('montage') (boucle, pistes, rythme) et get_guide('storyboard') (brief, accord avant génération). Ce guide-ci se lit en entier : il conditionne create_motion_scene, edit_motion_scene, add_motion_block, apply_edit_plan (blocs motion), create_storyboard, build_from_storyboard et export_video.
