---
name: motion-titres
description: Use when a Clapova video needs kinetic typography — « titre animé », « texte qui claque », « mots un par un », accroche écrite, texte trop petit ou illisible — sizes, reading time, hierarchy, word bursts via add_motion_block or create_motion_scene. Not for subtitles (clapova:motion-sous-titres, phase B) nor counters (clapova:motion-compteurs-data).
---

# Clapova : titres et typographie cinétique

Une idée : un titre animé doit **se lire en entier sur un téléphone** avant de bouger à nouveau. Taille, longueur de ligne et temps de tenue passent avant l'effet. Phase A (motion design). Les sous-titres mot à mot sont de la phase B, sur demande seulement.

## Règles chiffrées (synthèse §3.2, en 1080×1920)

- **Tailles (proposé, à tester sur la planche téléphone)** : texte lu ≥ 58 px ; titre ≥ 96 px ; héros 140–180 px ; échec sous 44 px. En vw (1080 de large) : 5,4 vw ; 8,9 vw ; 13–16,7 vw ; 4,1 vw.
- **Ligne** : au plus 25 caractères et 3 lignes, dans 90 % de la largeur (972 px) (BBC, officiel). Accroche : environ 5 mots par ligne. Ligne trop longue : on coupe le texte, jamais la taille (HyperFrames).
- **Tenue** : max(1 s ; 0,3 s × mots + 0,5 s), 2 s pour la dernière ligne (HyperFrames `line_unread`, synthèse C13).
- **Entrée / sortie** : entrée en `base` + `enter`, sortie en `fast` + `exit` ; stagger par mot 40–80 ms (proposé, principe Fluent). Tokens : `clapova:motion-tokens`.
- **Mots par rafales** de 1 à 3 (tiers) ; le mouvement d'un titre fait au moins 10 % de sa taille (Carbon, officiel).
- **Hiérarchie** : un seul mot mis en valeur par titre ; l'élément important a plus d'ampleur et une durée plus longue, le secondaire est groupé (Fluent, officiel). Graisse 600–800, approche −0,02 à −0,03 em, interlignage 1,05–1,2, plus serré quand la taille monte (tiers).
- **Familles** : au plus 3 (grotesque grasse, serif italique, mono), polices embarquées, aucune police de secours silencieuse (Barty, tiers).
- **Échange de texte** sans chevauchement : sortie floutée en 0,12 s, entrée après 0,07 s, apparition en 0,26 s (Barty, tiers).
- **Placement** : dans la zone vitale x 120–900, y 270–1248 ; jamais dans la bande des sous-titres y 1100–1248 (synthèse §3.9).

Recettes `kinetic-words`, `char-rise`, `slam` et code GSAP : `references/recettes-titres.md`.

## Boucle de travail

1. Compter : mots, caractères par ligne, temps de tenue. Couper le texte si une ligne dépasse 25 caractères.
2. Bloc prêt : `get_motion_catalog({category})` puis `add_motion_block` (`title-kinetic-words`, `title-char-rise`, `title-stack-bold`…) en lisant ses variables. Sur mesure : `create_motion_scene` (HTML/CSS/GSAP, tailles en vw, événement final obligatoire) puis `edit_motion_scene`.
3. Découpe par mot : **un `<span>` par mot avec une espace réelle entre eux**. Ne pas se fier à `textAnim by:"word"`, qui colle les mots (« VoiciNova ») tant que le correctif moteur n'est pas livré.
4. `render_preview_frames` à l'instant où le titre est complet et pendant sa tenue ; regarder chaque image en largeur téléphone.

## Interdits

Texte qui bouge encore pendant la lecture ; machine à écrire par défaut ; glow ; dégradé de texte (HyperFrames) ; lettre par lettre sur une phrase longue ; deux mots mis en valeur ; rétrécir la police pour faire tenir ; texte sur texte.

## Contrôle

- Aucun texte sous 58 px (sous 44 px = échec) ; titre ≥ 96 px ; ≤ 25 caractères par ligne, ≤ 3 lignes.
- Tenue mesurée ≥ la formule ; dernière ligne ≥ 2 s.
- Espaces présentes entre les mots sur l'image ; aucun texte hors zone vitale.
- Défauts D1 (texte sur texte), D2 (illisible sur téléphone), D9 (texte flou) de `clapova:controle-qualite`.

## Renvois

Direction et palette : `clapova:motion-direction-artistique`. Accroche : `clapova:montage-accroche`. Logo et CTA : `clapova:motion-logo-cta`. Sous-titres (phase B) : `clapova:motion-sous-titres`.

Sources : BBC subtitle guidelines (officiel), IBM Carbon, Fluent 2 ; formulations propres d'après heygen-com/hyperframes (Apache-2.0), Barty-Bart/motion-graphics (MIT), greensock/gsap-skills (MIT), emilkowalski/skills (MIT).
