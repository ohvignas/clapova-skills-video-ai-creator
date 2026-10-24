# Recettes de titres (GSAP, pour create_motion_scene)

Tokens : `plugins/clapova/skills/motion-tokens/references/tokens.md`. Tailles en vw (1080 de large : 1 vw = 10,8 px). Rappels moteur : pas de `setAttribute`, `Math.random`, `document`, `window` ; événement final obligatoire.

## HTML commun : un span par mot, espace réelle

```html
<h1 class="t"><span class="w">Trois</span> <span class="w">erreurs</span> <span class="w hl">à</span> <span class="w">éviter</span></h1>
<style>
.t{font-size:9vw;font-weight:800;letter-spacing:-0.02em;line-height:1.1;max-width:90%;font-kerning:none}
.w{display:inline-block}
</style>
```

`font-kerning: none` et pas de `text-wrap: balance` avec une découpe (gsap-skills, tiers). Polices chargées avant l'animation (`document.fonts.ready` est hors de portée ici : utiliser les polices du moteur, `get_motion_toolkit`).

## `kinetic-words` (défaut, rafales de mots)

```js
tl.from(".t .w", { autoAlpha: 0, y: "3vw", scale: 0.95, duration: 0.4, ease: E.enter, stagger: 0.06 });
// tenue = max(1 ; 0,3 × mots + 0,5) ; ici 4 mots → 1,7 s
tl.to(".t", { autoAlpha: 0, duration: 0.25, ease: E.exit }, "+=1.7");
```
Stagger total = 0,06 × 3 = 0,18 s ≤ 0,5 s. Pour plus de 8 mots, grouper par rafales de 1 à 3 mots (un span par groupe).

## `char-rise` (un seul mot héros, texte court)

Lettre par lettre réservé à un mot de 12 caractères au plus (proposé, d'après iart : par lettre = vif, textes courts). Masque `overflow:hidden` sur le mot, lettres de `y:"100%"` à 0, `base`, `enter`, stagger 0,04.

## `slam` (accroche, impact)

Mot héros 14–16 vw, de `scale: 1.15, autoAlpha: 0` à 1 en `fast` avec `spring.heavy` (`power3.out`) : le gros texte ne rebondit jamais. Un seul slam par vidéo, calé sur un temps fort (`clapova:montage-rythme`).

## Échange de deux textes au même endroit

```js
tl.to(".a", { filter: "blur(1vw)", autoAlpha: 0, duration: 0.12 })
  .from(".b", { autoAlpha: 0, duration: 0.26, ease: E.std }, "+=0.07");
```
Flou toujours sous 20 px (≈ 1,8 vw) (Emil, tiers).

Sources : greensock/gsap-skills (MIT), Barty-Bart/motion-graphics (MIT), iart-ai/motion-skills (MIT), emilkowalski/skills (MIT) ; formulation propre.
