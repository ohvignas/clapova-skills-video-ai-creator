---
name: motion-scene-ui
description: Use when a Clapova video shows a software interface or digital product rebuilt in code and filmed up close ("démo de mon app", "montre l'interface", "mockup animé", "écran de téléphone", "notification", "tutoriel produit", "on voit le clic"). Cursor, typing, zoom, one UI element at a time. Not for physical product ads (clapova:produit-coherent) nor diagrams (clapova:motion-carte-diagramme).
---

# Clapova : scène d'interface (démo app)

Une idée : **on reconstruit l'interface en HTML/CSS et on la filme comme une caméra : un geste, un résultat, une tenue.** Courbes : `clapova:motion-tokens`. Caméra : `clapova:montage-camera-virtuelle`.

## Règles chiffrées

Démo produit (§3.8, iart product-demo, tiers) :
| Étape | Durée |
|---|---|
| écran posé avant tout mouvement | 0,5–1 s |
| trajet du curseur, ease-in-out | 0,4–0,8 s |
| clic | 0,2–0,3 s |
| zoom ×2 | 1–2 s, puis tenu 2–4 s |

Explainer d'interface (Barty, tiers) :
- **Un seul élément de texte et un seul élément d'interface à l'écran** à la fois.
- Frappe à **25 caractères par seconde** ; pause de 0,5 s après chaque résultat ; tenue de 2 s.
- Pas de coupe sèche : forme continue (l'élément se transforme sans couper), mouvements de caméra de 0,6 à 1,2 s.
- Budget : 45 s → 2–3 fonctions ; 60 s → 3–4 ; 90 s → 4–5.
- Micro-éléments (coche, puce, clic) sous 300 ms (C12) ; chips en `spring.snappy` ≈ `back.out(1.1)` 0,35 s (proposé).

Commun : texte lu ≥ 58 px une fois zoomé (§3.2, proposé) ; zone vitale x 120–900, y 270–1248 (§3.9) ; jamais `will-change` sur ce que la caméra agrandit (texte flou).

## Contraintes du moteur (`create_motion_scene`)

- UI **générique** dessinée en CSS : aucune interface, logo ou marque reconnaissable d'un tiers. L'UI de l'utilisateur : reconstruite d'après ses captures, ses propres assets par `asset:CLÉ`.
- Timeline déterministe : seulement `tl`, `gsap.utils` et `$` ; `Math.random`, `Date`, `window`, `document`, `setTimeout` et `setAttribute` refusés. Temps absolus (`tl.to(x, {...}, 1.2)`).
- Tailles en % ou `vw` ; un `<span>` par mot avec une vraie espace entre les spans (bug « VoiciNova »).
- Le curseur est un enfant DOM de l'élément visé quand il le suit ; une barre qui grandit anime `width`, pas `scaleX`.
- Événements : `type` (frappe), `tap` (clic), `notif`, `appear`, et un `final` obligatoire.
- Illustrations IA : en petits éléments séparés animés chacun, jamais une grande image animée (iart, tiers).

## Boucle

1. `get_guide('motion')`. Liste les 2 à 5 fonctions à montrer et le texte exact tapé (fourni par l'utilisateur).
2. `create_motion_scene({projectId, brief, startMs, durationMs, fragment})` d'après `references/demo-produit.md` ; `edit_motion_scene` si note < 8 (2 reprises par tour).
3. Repli si `export_video` refuse « media_missing » : capture d'écran réelle de l'utilisateur (`create_upload_link`) + `add_motion_effect` (zoom) + `callout-highlight-box`, en prévenant.
4. `render_preview_frames` : écran posé, chaque clic, fin de chaque frappe, zoom tenu, `final`. Puis `place_sfx_from_events`.

## Interdits

Copier l'interface d'une vraie marque ; texte qui défile pendant qu'un autre est lu ; deux éléments d'interface animés ensemble ; frappe plus rapide que 25 car./s ; curseur qui saute sans trajet ; glow ou dégradé sur l'interface, rebond, particules (Barty, tiers ; C11).

## Contrôle

Chaque fonction a son image clic + résultat ; texte tapé identique au texte fourni ; rien de coupé au zoom ×2 ; note ≥ 8/10 (`clapova:controle-qualite`).

## Sources

Synthèse §3.2, §3.8, §3.9, C12. Barty-Bart/motion-graphics explainer-default et motion-broll (MIT) ; iart-ai ecommerce product-demo et generative-illustration (MIT). Formulations propres, voir `../../THIRD_PARTY_NOTICES.md`.
