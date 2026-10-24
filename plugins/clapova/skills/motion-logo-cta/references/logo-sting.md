# Recette : logo sting 5 s (haidrrrry, tiers ; reformulé)

| t (s) | Élément | Token |
|---|---|---|
| 0,0–0,8 | marque (symbole) construite, scale 0,95 → 1 | `hero` 0,8 s `enter` |
| 0,6–1,8 | wordmark, mots en stagger 0,06 | `base` |
| 2,0–3,5 | tagline (fournie par l'utilisateur) | `base`, tenue |
| 4,5–5,0 | sortie, plus courte que l'entrée (65–70 %) | `exit` |

```js
tl.from(".mark", {scale:0.95, autoAlpha:0, duration:0.8, ease:"expo.out"}, 0);
tl.from(".word span", {y:"3vw", autoAlpha:0, duration:0.4, ease:"expo.out", stagger:0.06}, 0.6);
tl.from(".tag", {autoAlpha:0, duration:0.4, ease:"power3.out"}, 2.0);
tl.to(".mark,.word,.tag", {autoAlpha:0, duration:0.5, ease:"power3.in"}, 4.5);
```
Événements : `impact` 800 (pic du son), `appear` 2000, `final` 5000.
