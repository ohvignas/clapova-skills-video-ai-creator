# Recette : schéma 3 étapes « Commande → Atelier → Livraison » (6 s, 1080×1920)

| t (s) | Quoi | Règle |
|---|---|---|
| 0,0–0,52 | 3 nœuds entrent (stagger 0,06), de 0,95 / opacité 0 | `base` `enter`, total ≤ 0,5 s |
| 0,6–1,2 | lien 1 → 2 tracé | `slow` |
| 1,2–1,8 | lien 2 → 3 tracé | `slow` |
| 1,9–2,3 | libellés entrent | `base` |
| 2,4–3,6 | focus nœud 1, autres à 0,35 | étape 1,2 s |
| 3,6–4,8 | focus nœud 2 | 1,2 s |
| 4,8–6,0 | focus nœud 3 | 1,2 s, `final` à 6 000 ms |

```html
<div class="d"><div class="nd n1"><span class="lb">Commande</span></div><div class="ln l1"></div><div class="nd n2"><span class="lb">Atelier</span></div><div class="ln l2"></div><div class="nd n3"><span class="lb">Livraison</span></div></div>
```
```css
.d{position:absolute;left:11.1%;top:20%;width:77.8%;height:45%}
.nd{position:absolute;left:30%;width:40%;height:18%;border-radius:2.2vw;background:#fff}
.n1{top:0}.n2{top:41%}.n3{top:82%}
.ln{position:absolute;left:49.5%;width:1%;height:0;background:#fff}
.l1{top:18%}.l2{top:59%}
.lb{position:absolute;left:0;right:0;top:30%;text-align:center;font:700 5.4vw/1.1 Inter;color:#111;opacity:0}
```
```js
tl.from(".nd", {scale:0.95, autoAlpha:0, duration:0.4, ease:"expo.out", stagger:0.06}, 0);
tl.to(".l1", {height:"23%", duration:0.6, ease:"power4.inOut"}, 0.6);
tl.to(".l2", {height:"23%", duration:0.6, ease:"power4.inOut"}, 1.2);
tl.to(".lb", {opacity:1, duration:0.4, ease:"power3.out", stagger:0.06}, 1.9);
[".n1",".n2",".n3"].forEach((f,i)=>{ const t=2.4+i*1.2;
  tl.to(".nd,.ln", {opacity:0.35, duration:0.25, ease:"power3.out"}, t);
  tl.to(f, {opacity:1, duration:0.25, ease:"power3.out"}, t); });
```
Événements : `appear` 0, `whoosh` 600 et 1200, `appear` 2400, 3600, 4800, `final` 6000.

5,4vw ≈ 58 px (texte lu, §3.2). `power4.inOut` approche `inout` (proposé, §3.1).
