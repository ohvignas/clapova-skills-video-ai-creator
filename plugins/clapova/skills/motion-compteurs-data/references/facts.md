# Gabarit `facts`

Une ligne par chiffre affiché. La colonne « écriture » est copiée telle quelle dans la scène (libellé ET valeur finale).

| id | écriture à l'écran | valeur brute | unité | source (URL, fichier:ligne, ou « utilisateur ») | date de la source | arrondi |
|---|---|---|---|---|---|---|
| f1 | 12 400 | 12400 | clients | utilisateur, message du 2026-10-24 | 2026-10 | centaine |
| f2 | 98 % | 0.98 | satisfaction | https://exemple.fr/etude p. 4 (« 98 % ») | 2026-06 | entier |

Règles :
- Pas de source = pas de ligne = pas de chiffre. Repli : barre relative sans valeur.
- Mesure compagnon obligatoire pour un pourcentage (« sur 1 200 répondants »).
- Montrer la table à l'utilisateur ; un seul « oui » vaut validation des chiffres.
