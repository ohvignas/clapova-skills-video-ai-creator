# Recette : carte de fin logo + CTA (3,5 s, 1080×1920)

CTA fourni par l'utilisateur : « Commandez sur nova.fr ». Logo du projet : `asset:logo`.

| t (s) | Quoi | Règle |
|---|---|---|
| 0,0–1,0 | logo révélé par masque (une technique), échelle 1,04 | 0,8–2,5 s |
| 1,0–1,15 | logo 1,04 → 1,00, pic sonore à 1,0 s | seul pop |
| 1,3–1,5 | CTA anticipation 1 → 0,95 (déjà visible à 0 d'opacité → 1) | — |
| 1,5–1,9 | CTA pop 0,95 → 1, seul élément en mouvement | `base`, `expressive` |
| 1,9–3,5 | tenue (≥ 1,2 s ; 4 mots → 1,7 s) | `final` à 3 500 ms |

Placement : logo centre y ≈ 640 px (33 %), CTA y 900–1060 px (47–55 %), largeur 120–900 px (11,1 %–83,3 %).

```html
<div class="logo"><img src="asset:logo" alt=""></div>
<div class="cta"><span>Commandez</span> <span>sur</span> <span>nova.fr</span></div>
```
```css
.logo{position:absolute;left:30%;width:40%;top:28%;clip-path:inset(0 100% 0 0)}
.logo img{width:100%;height:auto}
.cta{position:absolute;left:11.1%;width:77.8%;top:47%;padding:2.4vw 0;border-radius:4vw;background:#FF5A1F;color:#fff;text-align:center;font:800 8.9vw/1.1 Inter;opacity:0}
```
```js
tl.fromTo(".logo", {clipPath:"inset(0 100% 0 0)", scale:1.04}, {clipPath:"inset(0 0% 0 0)", duration:1, ease:"expo.out"}, 0);
tl.to(".logo", {scale:1, duration:0.15, ease:"power3.out"}, 1.0);
tl.fromTo(".cta", {opacity:0, scale:1}, {opacity:1, scale:0.95, duration:0.2, ease:"power3.out"}, 1.3);
tl.to(".cta", {scale:1, duration:0.4, ease:"back.out(1.7)"}, 1.5);
```
Événements : `[{tMs:1000,kind:"impact",weight:0.9},{tMs:1500,kind:"pop",weight:0.7},{tMs:3500,kind:"final"}]`.

8,9vw ≈ 96 px (titre, §3.2). `back.out(1.7)` ≈ `spring.pop` (proposé). Si le sanitiseur refuse `asset:logo` dans la scène, repli `add_motion_block` `logo-endcard` puis `cta-button`.
