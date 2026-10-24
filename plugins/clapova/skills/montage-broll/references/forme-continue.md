# Forme continue

Principe (Barty, iart ; formulation propre) : quand plusieurs b-rolls se suivent sur un même sujet, ils partagent une **forme qui continue** d'un plan à l'autre (même carte, même cadre, même couleur héros) au lieu de repartir de zéro à chaque phrase. Le spectateur suit un objet, pas une suite d'images.

## Mise en œuvre

- Un élément porteur par séquence (carte, cadre d'écran, ligne) ; il change d'état sur les mots ancres, un changement par temps parlé, espacés de 0,4 à 1,2 s.
- Entre deux états, la structure prend 6 images d'avance sur le mot ; le fait arrive sur son mot.
- Le passage de B (incrustation) à C (plein cadre) se fait par agrandissement de l'élément porteur plutôt que par une coupe ; durée et courbe : `clapova:montage-transitions` et `clapova:motion-tokens`.
- Retour à A : l'élément sort, le visage reste au moins environ 2 s.

## Garde-fous

- Surfaces claires par défaut ; au plus 3 couleurs par scène (`clapova:motion-titres` pour la typo).
- Rien sur la boîte du visage ; un C reste opaque.
- Pas de rebond, de particules ni de lueur sur l'élément porteur.
