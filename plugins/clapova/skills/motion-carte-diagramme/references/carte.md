# Recette : trajet Paris → Lyon façon Vox (4 s, 1080×1920)

| t (s) | Quoi | Règle |
|---|---|---|
| 0,0 | carte simplifiée déjà visible, point Paris posé | image 0 jamais vide |
| 0,0–0,4 | étiquette « Paris » | `base` |
| 0,5–2,0 | trait du trajet + point qui avance (enfant du trait) | 1,5 s `inout` |
| 0,5–1,7 | caméra pousse 1,0 → 1,08 | §3.8 |
| 2,0–2,4 | étiquette « Lyon » | `base` |
| 2,4–4,0 | tenue | lecture |

Style 12 i/s : `gsap.utils.snap(1/12)` sur le temps de progression, valeur tenue 2 images dans un montage 24 i/s.

```js
const step = gsap.utils.snap(1/12), p = {t:0};
tl.from(".lb-paris", {autoAlpha:0, y:"1vw", duration:0.4, ease:"expo.out"}, 0);
tl.to(p, {t:1, duration:1.5, ease:"power4.inOut", onUpdate:()=>{
  gsap.set(".route", {width: (step(p.t)*100)+"%"}); }}, 0.5);
tl.to(".map", {scale:1.08, duration:1.2, ease:"sine.inOut"}, 0.5);
tl.from(".lb-lyon", {autoAlpha:0, y:"1vw", duration:0.4, ease:"expo.out"}, 2.0);
```
Le point accent est un enfant de `.route` placé en `right:0` : il suit le trait sans coordonnées calculées. Événements : `appear` 0, `whoosh` 500, `appear` 2000, `final` 4000.
