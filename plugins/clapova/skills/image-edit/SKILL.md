---
name: image-edit
description: Use when a Clapova user wants to change PART of an existing image precisely ("retire la tasse", "remplace le ciel", "change la couleur du pull", "ajoute un texte sur la pancarte", "supprime l'objet", "agrandis l'image") with edit_image_precise or the /editeur page — zones in percent, per-zone instructions, reference images, model choice and plan limits, multi-pass, high resolution, credit cost. Not for a global restyle (generate_image with imageUrl, clapova-generate).
---

# Clapova : retouche d'image précise

Outil : `edit_image_precise` (agent et MCP). Page : `/editeur`.

## Modèles

| `model` | Endpoint fal | Crédits | Points forts |
|---|---|---|---|
| `ideogram` (défaut) | `ideogram/v4.5/edit` | 2 | masque natif (noir = modifié), précision « high » forcée, 4 références (3 avec masque), texte net |
| `flux` | `blackforestlabs/flux-3/edit-image` | 2 | jusqu'à 9 références + la source, édition locale qui préserve le reste, 1k forcé |
| `economique` | `xai/grok-imagine-image/edit` | 1 | le moins cher, moins fidèle hors zone |

Ideogram 4.5 et FLUX 3 : plans Créateur et Studio. Gratuit / Découverte : **2 essais à vie**
(crédits débités quand même). Refus `model_requires_plan` → proposer `economique`
ou le passage au plan supérieur, jamais insister. Après les 2 essais offerts, prévenir avant la 3e passe que le plan est requis.

## Bonnes pratiques (doc Ideogram / BFL)

1. **Une consigne courte par zone**, au présent impératif, sur l'objet seulement :
   « remplacer la tasse par une théière en fonte noire ». Pas de description de toute la scène.
2. **Zone un peu plus large que l'objet** (ombre, reflet, bord) : le modèle a besoin de place
   pour raccorder. L'éditeur élargit déjà le masque de 1,5 % du petit côté.
3. **Dire ce qu'on garde** : la consigne finale ajoute toujours « Keep every other pixel
   identical ». Ne pas redemander un cadrage ou un style global dans une retouche locale.
4. **Multipasse** : une modification par passe, en repartant de la meilleure version
   (pleine résolution, jamais une sortie réduite). Trois petites passes valent mieux
   qu'une consigne à cinq changements.
5. **Références** : une référence = un rôle clair (« la théière de l'image 2 »). FLUX 3
   pour plusieurs références (produit, matière, logo), Ideogram pour le texte et les masques fins.
6. **Haute résolution** (> 2 MP, zone locale) : passer par `/editeur`, qui découpe la zone
   avec 35 % de marge, l'édite puis la réinsère au pixel près. L'outil agent, sans canevas,
   envoie l'image entière avec la position des zones dans la consigne. Si l'image dépasse 2 MP et que `/editeur` n'est pas disponible (contexte MCP seul), dis-le : la qualité hors zone peut baisser ; propose de réduire l'image source ou de continuer en connaissance de cause.

**« Agrandis l'image »** : aucun outil d'agrandissement (upscale) n'est exposé ici. Ne promets pas ; propose `/editeur`, ou de régénérer l'image au format voulu (`clapova:generate`).

**Texte sur un objet** : modèle `ideogram`, texte court entre guillemets (3 mots), puis vérifie la lisibilité en ouvrant le résultat.
7. **Couleurs** : nommer la couleur cible et la matière (« pull en laine vert sapin »),
   pas seulement « vert ».
8. **Retirer un objet** : « retirer l'objet et reconstruire l'arrière-plan à l'identique ».

## Zones dans l'outil agent

`edit_image_precise({imageUrl, instruction?, zones?, referenceUrls?, model?, projectId?})`. `imageUrl` doit être un lien https public : une image jointe sans URL passe d'abord par `import_media` ou `create_upload_link` (`clapova:utiliser-clapova`). Avant la 1re passe : `get_credits` si le solde est incertain, et annonce le coût de la série (1 ou 2 crédits par passe).
`zones: [{ x, y, width, height, instruction }]` (8 au plus) en **% de l'image** (0–100, origine en haut
à gauche). `referenceUrls` : 4 au plus pour `ideogram`, 9 pour `flux`. Estimer la boîte à partir de la description de l'utilisateur ; en cas de doute,
la prendre plus large.

## Pièges

- Consigne qui décrit toute la scène : le modèle réécrit tout. Une consigne courte par zone.
- Zone collée à l'objet : pas de place pour l'ombre. Élargis-la.
- Cinq changements en une passe : trois passes valent mieux.
- Retouche de texte : `ideogram` ; plusieurs références : `flux`.

## Critères de fin

La zone est modifiée, le reste est identique (affiche l'URL de l'original et celle du résultat, ou retrouve l'original avec `list_media`, et compare-les), pas de texte parasite, résolution conservée. Montre l'avant/après avec une étiquette courte et le coût (1 ou 2 crédits par passe) ; propose une seule suite.
