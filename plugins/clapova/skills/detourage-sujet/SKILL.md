---
name: detourage-sujet
description: Use when il faut séparer un sujet du fond d'un plan — « détoure », « texte derrière moi », « isole le produit », « enlève le fond » — avec cutout_subject et contrôle du masque image par image. Not for un texte qui suit un objet (clapova:montage-camera-virtuelle) ni la fidélité d'un produit IA (clapova:produit-coherent).
---

# Clapova : détourage du sujet

Idée unique : **un détourage se vérifie sur chaque image, pas sur la première.** Le serveur segmente (SAM 3 côté Clapova) ; la skill choisit la bonne cible, pose le texte derrière et contrôle les bords. Détails : `references/controle-masque.md`.

## Quand l'utiliser

- Titre « derrière » la personne ou le produit (le sujet est redessiné au-dessus de la piste Motion design).
- Packshot isolé pour la planche produit (`clapova:produit-coherent`).
- Retirer le sujet d'un plan (`remove:true`).

## Règles

- **Désigner la cible** par une seule méthode, dans cet ordre : `prompt` en anglais concret (« person », « coffee cup », « red bottle ») ; sinon `point` sur le sujet (fractions 0–1, première image) ; sinon `box` serrée autour du sujet. Une boîte serrée vaut mieux qu'un prompt vague quand plusieurs objets se ressemblent.
- Choisir la première image du plan où le sujet est **entier et net** ; recouper le plan (`trim_media`) si le sujet entre en cours de plan.
- Texte derrière le sujet : le titre doit déborder du sujet sur au moins un côté, sinon l'effet ne se voit pas (proposé). Il reste dans la zone vitale x 120–900, y 270–1248 (synthèse §3.9) et **jamais sur le visage** (boîte `FACE`, §3.9).
- Points positifs **et négatifs** (« inclure ce point, exclure celui-là ») et lots de 60 images repartant du dernier masque : méthode Barty object-separation, **quand disponible** côté serveur ; aujourd'hui `cutout_subject` prend un seul point ou une boîte.
- Coût : environ 3 crédits par tranche de 10 s, 1 pour une image, remboursé en cas d'échec. Annonce-le avant l'appel.

## Boucle

1. `get_timeline` : repère `clipId` du plan et ses bornes.
2. `render_preview_frames` sur la première image du plan pour choisir point ou boîte.
3. `cutout_subject({projectId, clipId, prompt | point | box})`.
4. Titre : `add_motion_block` / `edit_motion_scene` sur la piste overlay, sur la durée du plan (`clapova:motion-titres`).
5. Contrôle (ci-dessous) ; défaut = relancer avec une boîte plus serrée ou un autre point, **2 essais au plus**, puis renoncer à l'effet et le dire.
6. Retirer : `cutout_subject({..., remove:true})`.

## Contrôle

- `render_preview_frames` au début, au milieu, à la fin du plan et à chaque mouvement rapide : bords nets, pas de morceau du fond collé au sujet, pas de main ou de cheveux coupés, titre bien derrière.
- Rendu de contrôle avec le sujet teinté en vert et masque PNG par image : **quand disponible** (méthode Barty, à exposer par le serveur).
- Relecture d'ensemble : `clapova:controle-qualite`.

## Interdits

Texte sur le visage ; prompt vague (« thing », « it ») ; valider sur la seule première image ; détourer un plan où le sujet sort du cadre sans le recouper ; plus de 2 relances payantes ; CoTracker3 (non commercial) pour suivre des points.

## Renvois

`clapova:montage-camera-virtuelle` (`track_motion`, `frame_subject`), `clapova:produit-coherent`, `clapova:motion-titres`, `clapova:controle-qualite`, routeur `clapova:montage`.

## Sources

Synthèse §3.9, §4 (ligne 17), §6 ; `references/recherche/ (racine du plugin) rapport-ia-produit.md` §0.3 (SAM 2.1, Apache-2.0) ; méthode reformulée de Barty-Bart/motion-graphics `object-separation` (MIT © 2026 Bart), voir `THIRD_PARTY_NOTICES.md`.
