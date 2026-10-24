---
name: controle-qualite
description: Use when a Clapova edit must be checked before showing or delivering it — « vérifie », « c'est bon ? », « relis le montage », « contrôle avant export », or called by clapova:montage at each round. Lists P0/P1/P2 defects with stable ids and fixes, frame-by-frame review, measures (sound, text, cuts, safe zones). Not for client feedback (clapova:revision-retours) nor export (clapova:finition).
---

# Clapova : contrôle qualité avant de livrer

Une idée : **on ne livre que ce qu'on a mesuré et regardé.** Chaque défaut a un identifiant stable, une gravité et un correctif par défaut. On sépare toujours ce qui a été **mesuré** de ce qui a été seulement **regardé**.

## Seuil de livraison (proposé, à confirmer, synthèse C10)

- Livrable si **0 P0 et note ≥ 8/10**. Au plus **3 tours** de correction ; ensuite livraison avec une section `Non résolu :`.
- La note sert de barrière, la liste fait corriger. Une note qui monte sans correction consignée est ramenée à la note précédente (anti-complaisance).
- Une note ≥ 8 doit citer sa preuve (instant, image, mesure) ; sans preuve, elle est limitée à 7.

## Boucle (un tour)

1. **Lire** : `get_timeline` (ce qui est censé être là, changements de l'utilisateur).
2. **Mesurer sans rendre** : `check_composition({projectId})` (gratuit). Mode complet, contraste avec couleur proposée, `line_unread`, `dead_stretch`, `text_below_floor`, `first_frame_empty`, `film_silent` : **quand disponible** (moteur M2).
3. **Regarder image par image** : `render_preview_frames({projectId, times})`, 12 instants au plus : 0 s, bande 0–2,2 s, chaque coupe (−0,2 / 0 / +0,2 s), chaque titre entier, CTA, dernière image. Modes `review`, `cuts`, `hook` : **quand disponibles** (S3). Décris chaque image comme un inconnu : un objet qu'il faut expliquer = P0.
4. **Relecture notée** : `review_montage({projectId, round})` (1 crédit avec vision, annonce-le). Liste `issues[]` P0/P1/P2 et 5 instants à écouter : **quand disponible** (S4).
5. **Mesurer le fichier exporté** (si un rendu existe) : `analyze_edit` **quand disponible** (S1) ; sinon le script `scripts/controle_video.py` sur le MP4 (son, noir, figé, plans, temps, texte, zones sûres). `extract_frames` (`sceneChanges`) sur le média rendu pour vérifier un plan précis.
6. **Écrire la liste** au format `t=4,2 s · où · problème → correctif · reste`, triée P0, P1, P2 ; corriger tous les P0 et les P1 utiles en **un** `apply_edit_plan` ; re-contrôler seulement ce qui a changé.

Relecteur au contexte neuf : si possible un sous-agent qui ne reçoit que le brief, les planches et les mesures, jamais les notes du constructeur ni du tour précédent.

## Gravités (détail et correctifs : `references/defauts.md`)

- **P0, bloque** : écran noir, texte coupé ou masqué, texte sur texte, image 0 vide, musique absente ou qui s'arrête avant la fin, sous-titre ou texte sur un visage, chiffre différent de la source, texte hors zone vitale, son écrêté (true peak > 0 dBTP), sonie hors ±2 LU.
- **P1, à corriger** : texte sous 58 px, tenue sous le temps de lecture, plus de 3 s sans changement, coupes < 30 % sur le temps, plan > 6 s, contraste < 4,5:1, élément interdit (BANNED), plus de 2 `impact`.
- **P2, finition** : coupes 30–60 % sur le temps, plan de 4–6 s, sortie plus longue que l'entrée, transition non causée.

## Mesures clés (sources et tolérances : `references/seuils.md`)

| Mesure | Cible | Source |
|---|---|---|
| Sonie intégrée | −14 LUFS ±1, true peak ≤ −1,5 dBTP | synthèse §3.10 (proposé) |
| Texte | lu ≥ 58 px, titre ≥ 96 px, échec < 44 px (en 1920) | §3.2, C7 (proposé) |
| Tenue | max(1 s ; 0,3 s × mots + 0,5 s), 2 s dernière ligne | C13 |
| Zone vitale 9:16 | x 120–900, y 270–1248 ; Pinterest x 65–885, y 270–1130 | §3.9 |
| Coupes | ≥ 60 % à ±2 images d'un temps | §3.3 |
| Rythme | rien de nouveau > 3 s = `dead_stretch` | §3.3 |
| Accroche | élément fort dès l'image 0, lisible à 2 s | §3.4 |

## Interdits

- Dire « c'est bon » sans avoir regardé les images ni lu les mesures ; noter sur 10 sans liste de défauts.
- Faire passer une impression pour une mesure : écrire « regardé, non mesuré » quand c'est le cas.
- Claude n'entend pas : jamais « le son est bien » sans mesure ; donner les 5 instants à écouter au casque.
- Relancer un 4e tour ; corriger ce qui n'est pas dans la liste ; écraser une modification de l'utilisateur (`clapova:revision-retours`).
- Exporter pour contrôler sans accord (facturé) : l'export relève de `clapova:finition`.

## Contrôle de fin de tour

- [ ] Liste P0/P1/P2 écrite, chaque ligne avec instant et preuve (mesure ou image).
- [ ] 0 P0 et note ≥ 8, ou 3 tours faits et `Non résolu :` rempli.
- [ ] Section « Mesuré » / « Regardé seulement » dans le compte rendu.

## Renvois

Boucle de montage : `clapova:montage`. Son : `clapova:son-design`. Accroche : `clapova:montage-accroche`. Rythme : `clapova:montage-rythme`. Tailles et tenue : `clapova:motion-titres`. BANNED : `clapova:motion-direction-artistique`. Retours client : `clapova:revision-retours`. Export : `clapova:finition`.

## Sources

Format P0/P1/P2 et codes craft : HyperFrames (Apache-2.0). Table D1–D11, relecteur neuf, anti-complaisance : JakeB-5/motion-graphic-skill (MIT). Interdits « bouillie IA » : kylezantos/design-motion-principles (MIT). Reformulés ; voir `plugins/clapova/THIRD_PARTY_NOTICES.md`.
