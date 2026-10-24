# Cas limites des compteurs

| Entrée | Affichage fr attendu | Piège |
|---|---|---|
| 0 | « 0 client » | en fr, 0 et 1 prennent le singulier (en anglais : « 0 customers ») |
| 1 | « 1 client » | pluriel automatique |
| 1284 | « 1 284 » (espace fine insécable U+202F) | `toLocaleString` absent : formate à la main |
| 1284 (en) | « 1,284 » | séparateur de la mauvaise langue |
| 1000000 | « 1 M » | 7 chiffres qui débordent la ligne |
| -42.5 | « −42,5 » (signe moins U+2212, virgule) | tiret court, point décimal |
| 0.1 + 0.2 | « 0,3 » | 0,30000000000000004 : arrondir avant d'afficher |
| 1.37 (137 %) | « 137 % » | barre plafonnée à 100 % sans le dire |
| null / NaN | ne pas afficher la scène | « NaN » à l'écran |

Formatage déterministe dans la timeline (sans `toLocaleString` si le rendu n'a pas la locale) :

```js
const fr = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
```

Largeur fixe : `.n{font-variant-numeric:tabular-nums;font-feature-settings:"tnum"}` et une largeur réservée en `ch` égale au nombre de caractères de la valeur finale.

Source : emilkowalski/skills `break-ui/CATALOG.md` (MIT), reformulé.
