---
name: montage-recettes
description: Use when a Clapova user asks for a known full format — « promo », « prix barré », « pub 15 s », « top 3 », « avant/après », « diaporama », « conversation SMS », « Wrapped », « teaser », « démo app », « explainer 30 s », « intro YouTube ». Beat timeline in seconds, skill per beat. Not for a single technique (clapova:montage routes it).
---

# Clapova : recettes de formats

Une idée : **une recette = une timeline chiffrée en beats, et pour chaque beat la skill qui porte la règle.** Cette skill ne fixe aucune règle elle-même : durées et courbes → `clapova:motion-tokens` ; tailles et tenue du texte → `clapova:motion-titres` ; zones sûres → `clapova:montage` (`references/zones-sures.md`) ; rythme et BPM → `clapova:montage-rythme`. Chiffres : `references/synthese-motion-design.md` (racine du plugin), §3 et §4 ligne 9.

Phase A (motion design) par défaut : **aucun sous-titre, pas de voix off finale, pas d'export**. Phase B seulement sur demande (`clapova:motion-sous-titres`, `clapova:finition`).

## Catalogue

| Format | Durée | Fiche |
|---|---|---|
| Pub produit reel-motion | 15 s | `references/pub-promo.md` |
| Promo prix barré | 6–15 s | `references/pub-promo.md` |
| Teaser de lancement / hype | 15 s | `references/pub-promo.md` |
| Listicle / top 3 | 15–30 s | `references/contenu.md` |
| Avant / après | 6–15 s | `references/contenu.md` |
| Démo app | 20 s | `references/contenu.md` |
| Explainer | 30 s | `references/contenu.md` |
| Diaporama photo | libre | `references/social.md` |
| Conversation SMS | 10–20 s | `references/social.md` |
| Récap « Wrapped » | 5–7 scènes | `references/social.md` |
| Intro / outro YouTube | 3–5 s / ≥ 20 s | `references/social.md` |

Les durées marquées « proposé » dans les fiches sont des arbitrages de cette skill à partir des règles canoniques, pas des chiffres sourcés.

## Méthode

1. Prérequis de `clapova:montage` (fiche de direction `clapova:cadrage`, guides, crédits). Le format n'est pas dans le catalogue : retour au routeur.
2. Ouvre la fiche, recopie sa timeline dans le plan court (beat, début–fin, contenu, skill) et fais-le **valider** avant de construire.
3. Modèle prêt d'abord, gratuit : `list_templates` / `get_template_recipe` (`ugc-ad`, `listicle-top`, `before-after`, `crash-zoom-teaser`, `cinematic-product-demo`, `faceless-explainer`, `event-announcement`) ; recettes serveur : `list_recipes`, `get_creative_recipes`, `apply_recipe`. `apply_template` exige un projet vide au bon format.
4. Construis beat par beat en appelant la skill indiquée ; un seul `apply_edit_plan` par lot (boucle de `clapova:montage`).
5. Recale la timeline sur la vraie voix ou la vraie musique (`clapova:montage-rythme`) : les secondes d'une fiche sont une cible, pas une contrainte qui coupe un mot.
6. Contrôle (ci-dessous), puis livraison de la phase A.

## Interdits (communs à toutes les recettes)

- Prix, remise, chiffre, avis, résultat ou CTA inventés : seulement ceux de l'utilisateur ou de son site, sinon `[à confirmer]`.
- Logo plaqué ou fondu depuis le noir en image 0 (`clapova:montage-accroche`).
- Sous-titres en phase A ; changer de recette en cours de montage sans le dire.
- Recopier une règle chiffrée d'une skill voisine dans le plan au lieu de la citer.
- Rien d'OpenMontage, de Remotion ni d'imMamdouh (licences, synthèse §6).

## Contrôle

- Chaque beat du plan validé existe dans `get_timeline`, à ±0,5 s de sa cible (proposé), et cite sa skill.
- `check_composition` sans erreur ; `render_preview_frames` sur la première image, chaque changement de beat et la dernière image, regardées une par une.
- Interdits propres de la fiche vérifiés un par un ; verdict `clapova:controle-qualite` (0 P0 et ≥ 8/10, proposé, à confirmer).
- Message de livraison : recette utilisée, phase A, écarts à la fiche et pourquoi.

## Sources

Synthèse §3, §4 (ligne 9), §6 ; `rapport-skills-motion.md` : iart-ai/motion-skills packs ecommerce, explainer, youtube, text-message (MIT © 2026 iart.ai), Barty-Bart/motion-graphics high-energy (MIT © 2026 Bart), JakeB-5/motion-graphic-skill structures (MIT) ; `rapport-performance-pubs.md` (TikTok, Pinterest, Motion 2026, System1). Formulations propres, voir `../../THIRD_PARTY_NOTICES.md`.
