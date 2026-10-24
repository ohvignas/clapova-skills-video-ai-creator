# Recette : chiffre clé 4 chiffres (scène 3,2 s, 1080×1920)

Chiffre `facts` f1 = « 12 400 ». 5 chiffres → 2 s de comptage (§3.5).

| t (s) | Quoi | Token |
|---|---|---|
| 0,0 | libellé déjà visible (pas de fondu depuis le noir) | — |
| 0,0–0,4 | chiffre entre, de scale 0,95 / opacité 0 | `base`, `enter` |
| 0,2–2,2 | comptage 0 → 12 400 | 2 s, `enter` |
| 2,2 | événement `counter_end` | — |
| 2,2–3,2 | valeur tenue (≥ 0,83 s) ; mesure compagnon apparaît à 2,3 s | `fast` |
| 3,2 | `final` si dernière scène | — |

```html
<div class="wrap"><div class="n">0</div><div class="lbl">clients servis</div><div class="src">sur 12 mois</div></div>
```
```css
.wrap{position:absolute;left:11.1%;top:30%;width:77.8%;text-align:center;color:#fff}
.n{font:800 15vw/1.05 Inter;font-variant-numeric:tabular-nums;letter-spacing:-0.02em}
.lbl{font:600 5.4vw/1.2 Inter}
.src{font:600 3.2vw/1.2 Inter;color:#B8B8C4;opacity:0}
```
```js
const fr = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const o = {v:0}, el = $(".n")[0];
tl.from(".n", {scale:0.95, autoAlpha:0, duration:0.4, ease:"expo.out"}, 0);
tl.to(o, {v:12400, duration:2, ease:"expo.out", onUpdate:()=>{ el.textContent = fr(o.v); }}, 0.2);
tl.to(".src", {autoAlpha:1, duration:0.25, ease:"power3.out"}, 2.3);
```
Événements : `[{tMs:200,kind:"counter_tick"},{tMs:2200,kind:"counter_end",weight:0.8},{tMs:3200,kind:"final"}]`.

Taille : 15vw ≈ 162 px (héros 140–180 px, §3.2). `expo.out` est l'approximation proposée de `enter` (§3.1). Si `textContent` est refusé par le sanitiseur, repli `add_motion_block` `counter-big-number`.
