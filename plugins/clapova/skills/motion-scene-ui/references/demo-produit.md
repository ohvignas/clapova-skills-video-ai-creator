# Recette : recherche dans une app (6 s, 1080×1920)

Texte tapé (fourni) : « robe lin » = 9 caractères → 0,36 s à 25 car./s.

| t (s) | Quoi | Règle |
|---|---|---|
| 0,0–0,8 | écran posé (barre de recherche, déjà visible) | 0,5–1 s |
| 0,8–1,4 | curseur vers la barre, ease-in-out | 0,4–0,8 s |
| 1,4–1,65 | clic (scale 0,92 → 1) | 0,2–0,3 s |
| 1,7–2,06 | frappe « robe lin » | 25 car./s |
| 2,06–2,56 | pause | 0,5 s |
| 2,56–2,96 | carte résultat entre | `base` |
| 3,0–4,5 | zoom ×2 sur la carte | 1–2 s |
| 4,5–6,0 | tenue | 2–4 s (ici 1,5 s + `final`) |

```html
<div class="cam"><div class="app">
  <div class="bar"><span class="q"></span><div class="cur"></div></div>
  <div class="card"><span>Robe</span> <span>en</span> <span>lin</span> <span>—</span> <span>49 €</span></div>
</div></div>
```
```css
.cam{position:absolute;inset:0;transform-origin:50% 55%}
.app{position:absolute;left:11.1%;width:77.8%;top:14%;height:50%;border-radius:4vw;background:#F4F4F6}
.bar{position:absolute;left:6%;right:6%;top:6%;height:12%;border-radius:3vw;background:#fff}
.q{position:absolute;left:5%;top:25%;font:600 5.4vw/1.2 Inter;color:#111}
.cur{position:absolute;left:60%;top:180%;width:4vw;height:4vw;border-radius:50%;background:#111}
.card{position:absolute;left:6%;right:6%;top:30%;padding:4vw;border-radius:3vw;background:#fff;font:700 5.4vw/1.2 Inter;opacity:0}
```
```js
const txt = "robe lin", q = $(".q")[0], o = {n:0};
tl.to(".cur", {left:"40%", top:"30%", duration:0.6, ease:"power2.inOut"}, 0.8);
tl.to(".cur", {scale:0.92, duration:0.1, ease:"power3.out"}, 1.4);
tl.to(".cur", {scale:1, duration:0.15, ease:"power3.out"}, 1.5);
tl.to(o, {n:txt.length, duration:txt.length/25, ease:"none", onUpdate:()=>{ q.textContent = txt.slice(0, Math.round(o.n)); }}, 1.7);
tl.fromTo(".card", {autoAlpha:0, scale:0.95}, {autoAlpha:1, scale:1, duration:0.4, ease:"expo.out"}, 2.56);
tl.to(".cam", {scale:2, duration:1.5, ease:"power4.inOut"}, 3.0);
```
Événements : `tap` 1400, `type` 1700, `appear` 2560, `whoosh` 3000, `final` 6000.

`linear` (`none`) n'est permis que pour la frappe, mouvement continu (§3.1). Le prix « 49 € » doit venir de l'utilisateur (`clapova:motion-compteurs-data`, table `facts`). Si `textContent` est refusé, révéler des `<span>` par lettre avec `stagger: 0.04` (= 25 car./s).
