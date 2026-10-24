# Contrôle d'un masque de détourage

Sources : Barty-Bart/motion-graphics `object-separation` (MIT © 2026 Bart, méthode reformulée) ; synthèse §3.9.

## Images à regarder
1. Première image du plan.
2. Milieu.
3. Dernière image.
4. Chaque instant de mouvement rapide (geste, rotation du produit, entrée d'un objet devant le sujet).

## Défauts et correctif
| Défaut | Correctif |
|---|---|
| Fond collé au sujet | boîte plus serrée |
| Mauvais objet choisi | `prompt` plus précis (couleur, matière) ou `point` au centre du bon objet |
| Main, cheveux, anse coupés | point sur la partie manquante, ou plan recoupé |
| Masque qui saute d'une image à l'autre | recouper le plan au moment où le sujet est entier |
| Titre visible devant le sujet | le titre n'est pas sur la piste overlay, ou il ne chevauche pas le sujet |

## Méthode cible (quand disponible côté serveur)
- Points positifs et négatifs sur l'image de départ, choisis sur une grille de coordonnées.
- Lots de 60 images, chaque lot repartant du dernier masque.
- Rendu de contrôle avec le sujet teinté en vert, un masque PNG par image.

Après 2 essais ratés : renoncer à l'effet, le dire, proposer un titre devant le sujet.
