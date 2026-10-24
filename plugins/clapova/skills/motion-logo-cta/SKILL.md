---
name: motion-logo-cta
description: Use when a Clapova video needs a logo reveal, brand signals, an end card or a call to action ("logo animé", "révélation du logo", "fin avec CTA", "carte de fin", "bouton commander", "outro", "mets mon logo"). Logo integrated in the scene, pixel safe zones, CTA held. Not for the opening hook (clapova:montage-accroche) nor creating a logo (clapova:brandkit).
---

# Clapova : logo et CTA

Une idée : **la marque se reconnaît par des signaux intégrés à la scène ; le CTA arrive seul, dans la zone vitale, et il est tenu.** Règles canoniques : `docs/synthese-motion-design.md` §3.4, §3.6, §3.9. Courbes : `clapova:motion-tokens`.

## Logo

- Intégré à la scène (sur le produit, dans le décor, animé avec l'action), jamais plaqué dans un coin dès 0 s ni en ouverture : « un logo n'est pas une accroche » (System1, tiers). Rappels pendant le corps.
- 2 à 4 signaux de marque dans les 2 premières secondes, dont au moins un sonore ou verbal (System1 2026, tiers) : voir `clapova:montage-accroche`.
- Une seule technique (tracé, construction ou morphing) ; révélation **0,8 à 2,5 s** ; **un seul pop expressif par vidéo** : 1,04 → 1,00 en 0,15 s, ou Polaris 0,85 → 1,05 → 1 (`spring.pop` ≈ `back.out(1.7)`, équivalence proposée).
- L'image d'arrivée tombe sur le pic du logo sonore (événement `impact` ou `pop`).
- Ne jamais déformer le logo (échelle uniforme seulement), respecter sa marge de protection, logo vectoriel du kit (`get_brand_kit` ; sinon `vectorize_logo`, payant).
- Logo sting de 5 s : marque 0–0,8 s, wordmark 0,6–1,8 s, tagline 2–3,5 s, sortie sur la dernière demi-seconde (haidrrrry, tiers).

## CTA

- Anticipation à scale 0,95, puis pop en `base` 0,4 s, courbe `expressive` (Carbon, officiel). **Seul élément en mouvement pendant son entrée** (Atlassian, officiel).
- En conversion, il arrive après le contexte ; carte CTA à l'écran (+45 % de mémorisation, TikTok officiel) **et** dite à la voix (Google, officiel).
- Carte finale tenue **≥ 1,2 s** (contrat de `create_motion_scene`, événement `final`), et au moins le temps de lecture max(1 s ; 0,3 s × mots + 0,5 s), 2 s pour la dernière ligne (C13). Outro YouTube : ≥ 20 s sur une vidéo ≥ 25 s (iart, tiers).
- Peut reprendre la première image (boucle, `clapova:montage-boucle`).
- **Aucun CTA inventé** : seulement le texte et l'URL donnés par l'utilisateur ou lus sur son site. Pas de CTA « qui respire » en boucle.

## Zones sûres en pixels (1080×1920, §3.9)

| Profil | Logo, CTA, texte |
|---|---|
| Réseaux verticaux (défaut) | x 120–900, y 270–1248 |
| Pinterest | x 65–885, y 270–1130 |
| Réservé Meta (officiel) | haut 269 px, bas 672 px, côtés 65 px : rien d'important |

Le CTA n'entre jamais dans le bas réservé (y > 1248) ni dans la bande des sous-titres y 1100–1248.

## Boucle

1. `get_guide('motion')`, `get_brand_kit` (logo, couleurs, police), CTA exact confirmé par l'utilisateur.
2. Bloc prêt (premier choix, gratuit) : `get_motion_catalog({category:"Logo"})` puis `add_motion_block` (`logo-scale-in`, `logo-mask-wipe`, `logo-line-frame`, `logo-endcard`, `cta-button`, `cta-subscribe`).
3. Sur mesure : `create_motion_scene` avec `references/endcard.md` (logo du projet référencé par `asset:CLÉ`, jamais d'URL). Repli si l'export refuse « media_missing » : `logo-endcard` + `cta-button` aux mêmes temps, en le signalant.
4. `render_preview_frames` : arrivée du logo, entrée du CTA, dernière image. `place_sfx_from_events` : le pic sonore sur l'arrivée.

## Interdits

Logo en image 0 ou plaqué en coin ; logo étiré, recoloré hors charte, pivoté ; deux pops expressifs ; CTA qui bouge avec d'autres éléments ; CTA hors zone vitale ; CTA, prix ou URL inventés ; glow, particules (C11).

## Contrôle

Sur la planche : logo net et entier, marge respectée ; CTA lisible (titre ≥ 96 px, §3.2, proposé), dans x 120–900 / y 270–1248 ; texte du CTA identique à celui de l'utilisateur au caractère près ; carte tenue ≥ 1,2 s. Note ≥ 8/10 (`clapova:controle-qualite`).

## Sources

Synthèse §3.4, §3.6, §3.9, C13. iart-ai logo-animation et youtube (MIT), haidrrrry/claude-remotion-skill (MIT), Shopify Polaris (MIT), IBM Carbon (Apache-2.0). Formulations propres, voir `../../THIRD_PARTY_NOTICES.md`.
