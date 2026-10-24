---
name: montage-broll
description: Use when a Clapova user wants b-roll over a talking-head video — « ajoute du b-roll », « illustre ce que je dis », « mets des images pendant que je parle », « incrustation », « cache plein écran » — three treatments: A speaker, B overlay, C full-frame cover, timed on words. Not for cleaning silences (clapova:montage-derush) nor camera moves (clapova:montage-camera-virtuelle).
---

# Clapova : b-roll sur un face caméra

Une idée : **le b-roll montre ce que la phrase dit, au moment où elle le dit**, sans voler la parole ni le visage. Trois traitements : **A** orateur seul, **B** incrustation (le visage reste visible), **C** cache plein cadre. Phase A : plan des b-rolls validé, puis pose ; aucun sous-titre par défaut.

## Règles chiffrées (synthèse §4, d'après Barty et iart)

- **Ouvrir et fermer sur A.** Un A dure 8 s au plus.
- **C dure 3 à 10 s.** Jamais dans la première seconde de l'accroche, ni sur une phrase personnelle ou émotionnelle.
- **Au moins environ 2 s de visage** entre deux C.
- **Densité** : légère 2–4 b-rolls par minute, moyenne 4–7 (à demander).
- **Minutage** : la structure (axes, cartes, cadre) prend 6 images d'avance sur le mot ; un **fait se cale sur son mot** ; une chute attend le mot qui la révèle. Un changement d'état par temps parlé, espacés de 0,4 à 1,2 s. Les sous-titres dérivent : poser les changements importants sur le premier ou le dernier mot d'une réplique.
- **Cache opaque** : un C couvre tout le cadre (≥ 98,5 % des pixels à alpha ≥ 250, iart).
- **Rien sur la boîte du visage** en B (incrustation hors de `FACE`).
- Surfaces claires par défaut : le néon sur noir est le cliché des vidéos IA (iart).
- **Ne jamais inventer** chiffre, citation, prix ou résultat : ce qui est illustratif est listé comme tel. Compteurs et chiffres : `clapova:motion-compteurs-data`.

Choix A/B/C, gabarit du plan, forme continue : `references/traitements.md`, `references/forme-continue.md`.

## Boucle de travail

1. `get_guide('montage')` puis `get_guide('motion')`. Rushes dérushés d'abord (`clapova:montage-derush`).
2. Une seule série de questions : densité (légère / moyenne), look, matière disponible (bibliothèque, captures, rien).
3. Transcription avec temps par mot (déjà faite par `analyze_rushes`, sinon `transcribe_media`) ; `frame_subject` pour la boîte du visage.
4. **Tableau de plan validé avant toute pose** : temps, mot ancre, traitement A/B/C, contenu, source (bibliothèque, `generate_broll`, scène `create_motion_scene`).
5. Coût : `generate_broll({projectId, …, dryRun:true})`, annonce, accord ; puis génération.
6. Pose en un lot `apply_edit_plan` : B et C sur la piste overlay, la voix reste celle du locuteur.
7. Contrôle : `check_composition`, puis `render_preview_frames` **aux mots clés**, regardées, corrigées, regardées une fois de plus ; relecture `clapova:controle-qualite`.

## Interdits

- C dans la première seconde, sur une phrase émotionnelle, ou deux C collés (< 2 s de visage).
- Incrustation sur le visage ; cache semi-transparent.
- Rebond, particules, lueurs, dégradés sur l'interface, icônes de traits différents, temps mort, look de modèle tout fait (Barty).
- Chiffre, prix ou citation inventés.
- B-roll générique sans lien avec le mot.

## Contrôle

- [ ] Ouverture et fermeture sur A ; aucun A de plus de 8 s.
- [ ] Chaque C entre 3 et 10 s, ≥ 2 s de visage entre deux C.
- [ ] Chaque fait apparaît sur son mot (planche au mot clé).
- [ ] Aucun élément sur la boîte du visage ; caches opaques.
- [ ] Densité conforme au choix de l'utilisateur.

Sources : Barty-Bart/motion-graphics (MIT © 2026 Bart, crédit méthode Vox @Voxyz_ai) ; iart-ai/motion-skills, pack talking-head-b-roll (MIT © 2026 iart.ai). Formulation propre.
