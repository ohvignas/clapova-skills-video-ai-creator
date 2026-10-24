# Planche produit

Sources : synthèse §3.11 ; rapport-ia-produit §0.2, §2, §4.

## Contenu
| Case | Vue | Remarque |
|---|---|---|
| 1 | Face | Sert de `frontal_image_url` (Kling) et de première image |
| 2 | 3/4 gauche | ±35° max autour d'une vue réelle |
| 3 | 3/4 droite | idem |
| 4 | Profil | |
| 5 | Dos | seulement si photographié, sinon inventé |
| 6 | Gros plan étiquette | net, lisible, texte exact |

Fond neutre, même lumière sur toutes les cases.

## Invariants à écrire dans chaque prompt de retouche
Forme, proportions, position du logo, texte exact de l'étiquette (entre guillemets), matière, couleur. Ne modifier que l'environnement (méthode décrite pour Flux Kontext, reformulée).

## Fabrication
- `edit_image_precise` ou `generate_image` avec la photo réelle en référence. FLUX.2 accepte jusqu'à 8 références par l'API (officiel BFL).
- Vrais angles : `generate_3d` puis `turntable_3d`, puis `extract_frames` aux angles voulus.
- Produits transparents ou réfléchissants : les plus difficiles ; privilégier le packshot recollé.

## Interdits
FLUX.1 Kontext dev et IC-Light V2 (poids non commerciaux).
