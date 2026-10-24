---
name: etalonnage
description: Use when a Clapova video's colours need work — « look ciné », « harmonise les couleurs », « les clips IA n'ont pas la même couleur », « applique une LUT », fichier .cube, plan terne ou trop saturé — with create_lut / apply_lut, one look per film. Not for palette or style choice (clapova:motion-direction-artistique) nor the final export (clapova:finition).
---

# Clapova : étalonnage et cohérence couleur

Une idée : **un film = un look**. Les clips IA sortent chacun avec sa propre balance ; on les ramène tous sur un même plan de référence, puis on pose une seule LUT de look. Phase A (look provisoire validé avec le motion) ; phase B (contrôle final avant export, sur demande).

## Règles

- **LUT plutôt que filtres CSS** : le grade passe par `create_lut` / `apply_lut` sur les clips, pas par des `filter:` dans une scène motion (synthèse §4 n°19).
- **Ordre** (proposé, d'après iart `color-motion`) : 1) corriger chaque clip vers le plan de référence (balance, exposition, saturation) ; 2) un look commun ; 3) le motion design par-dessus, non étalonné, aux couleurs de la marque.
- **Interpolation en OKLCH**, jamais en sRGB brut, pour tout fondu de couleur dans une scène (iart, tiers).
- **Couleurs de marque intouchables** : logo, packshot et textes motion gardent les valeurs de `get_brand_kit` ; la LUT ne s'applique pas à la piste overlay.
- **Intensité** : commencer bas et monter (proposé : `intensity` 0,5 puis ajuster à l'œil sur la planche), plutôt qu'une LUT forte qui écrase les peaux.
- **Contrôle du décalage de gamma** hors du logiciel de montage : regarder le rendu exporté, pas seulement l'aperçu (freelance-motion-skills, tiers).
- Au plus 3 couleurs par scène hors noir et blanc pour le motion (synthèse §3.2).

## Boucle de travail

1. `get_timeline` puis `extract_frames` (ou `render_preview_frames`) : une image du milieu de chaque clip, posées côte à côte.
2. Choisir le **plan de référence** (le plus juste en peau et en produit) ; écrire en une ligne ce qui dérive (ex. « clip 3 plus froid, clip 5 trop saturé »).
3. Correction par clip : `create_lut({name, grade:{contrast, saturation, temperature, shadows, highlights}})` puis `apply_lut({projectId, clipId, lutMediaId, intensity})` ; ou `set_motion{clipId, grade:{…}}` dans `apply_edit_plan` pour un réglage simple.
4. Look commun : une seule LUT (`create_lut` avec `toning`, `fade`, ou un `.cube` fourni via `cubeUrl` / `preset`) appliquée à **tous** les clips vidéo avec la même intensité.
5. `render_preview_frames` sur une image par clip ; comparer à la référence ; corriger les écarts restants.
6. Phase B : après `export_video`, revoir la première et la dernière image du fichier rendu (gamma) avec `clapova:finition`.

## Interdits

Une LUT différente par clip pour le look final ; filtres CSS de couleur sur des plans filmés ; étalonner le logo ou les couleurs de marque ; dégradé gratuit ou « look » ajouté sans demande ; pousser la saturation jusqu'à écrêter les peaux ; régénérer un clip IA (payant) avant d'avoir essayé une correction LUT gratuite.

## Contrôle

- Planche d'une image par clip : même blanc, même noir, peaux cohérentes ; aucun clip qui « saute » à la coupe.
- Les couleurs du logo et du packshot sont celles du kit de marque.
- Le rendu exporté ne montre pas de décalage de gamma par rapport à l'aperçu (phase B).

## Renvois

Palette et look voulu : `clapova:motion-direction-artistique`. Marque : `clapova:brandkit`. Produit IA fidèle : `clapova:produit-coherent`. Relecture : `clapova:controle-qualite`. Export : `clapova:finition`.

Sources : principes reformulés d'après iart-ai/motion-skills (MIT, `color-motion`) et freelance-motion-skills (contrôle de gamma) ; outils Clapova `create_lut`, `apply_lut` (gratuits).
