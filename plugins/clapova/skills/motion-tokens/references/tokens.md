# Tokens motion Clapova : valeurs à coller

Source canonique : `references/synthese-motion-design.md` (racine du plugin) §3.1. Ne pas modifier une valeur ici sans modifier la synthèse.

## Durées (secondes)

| Token | GSAP `duration` | Usage | Source |
|---|---|---|---|
| `micro` | 0.15 | puce, coche, clic | M3 short3 (officiel) |
| `fast` | 0.25 | sortie d'un titre, petit élément | M3 medium1 (officiel) |
| `base` | 0.4 | entrée d'un titre, carte, CTA | M3 medium4 (officiel) |
| `slow` | 0.6 | grand élément, plein écran | M3 long4 (officiel) |
| `hero` | 0.8 – 1.0 | logo, moment héros | M3 extra-long2–4 (officiel) |
| sortie | 0.65 – 0.7 × entrée | toujours plus courte | Atlassian (officiel, principe) |
| `stagger` | 0.04 – 0.08 (défaut 0.06), total ≤ 0.5 | listes, mots | tiers ; Fluent (officiel, principe) |

## Courbes

| Token | cubic-bezier (CSS) | GSAP CustomEase | Approximation native (proposée) |
|---|---|---|---|
| `enter` | `cubic-bezier(0.05,0.7,0.1,1)` | `CustomEase.create("enter","0.05,0.7,0.1,1")` | `expo.out` |
| `exit` | `cubic-bezier(0.3,0,0.8,0.15)` | `CustomEase.create("exit","0.3,0,0.8,0.15")` | `power3.in` |
| `std` | `cubic-bezier(0.2,0,0,1)` | `CustomEase.create("std","0.2,0,0,1")` | `power3.out` |
| `expressive` | `cubic-bezier(0.4,0.14,0.3,1)` | `CustomEase.create("expressive","0.4,0.14,0.3,1")` | — |
| `inout` | `cubic-bezier(0.83,0,0.17,1)` | `CustomEase.create("inout","0.83,0,0.17,1")` | `power4.inOut` |
| `linear` | `linear` | `"none"` | — |
| compteur (option) | `cubic-bezier(0.19,0.91,0.38,1)` | `CustomEase.create("count","0.19,0.91,0.38,1")` | — (Polaris ease-out, officiel) |

CustomEase est la valeur de référence ; tous les plugins GSAP sont gratuits en usage commercial (gsap-skills, tiers). Si le moteur n'expose pas CustomEase (vérifier `get_motion_toolkit`), utiliser l'approximation native et le dire.

## Ressorts

| Token | Valeur | GSAP approché (proposé) | Usage | Source |
|---|---|---|---|---|
| `spring.default` | amortissement 0,8 / raideur 380 | `back.out(1.2)`, `base` | cartes, barres | androidx M3E (officiel) |
| `spring.pop` | 0,6 / 800 | `back.out(1.7)`, `base` | logo, badge | androidx M3E (officiel) |
| `spring.heavy` | k 90 / d 19, sans dépassement, ~0,7 s | `power3.out`, 0.7 | gros texte | JakeB-5 (tiers) |
| `spring.snappy` | k 320 / d 28, ~2 %, 0,35 s | `back.out(1.1)`, 0.35 | puces, chips | JakeB-5 (tiers) |
| effets | amortissement 1,0 | `std` | opacité, couleur | androidx (officiel) |

## Bloc prêt à coller (script d'une scène `create_motion_scene`)

```js
// Tokens Clapova (`references/synthese-motion-design.md` (racine du plugin) §3.1)
gsap.registerPlugin(CustomEase); // seulement si le moteur charge CustomEase
const T = { micro: 0.15, fast: 0.25, base: 0.4, slow: 0.6, hero: 0.9, stagger: 0.06 };
const E = {
  enter: CustomEase.create("enter", "0.05,0.7,0.1,1"),
  exit: CustomEase.create("exit", "0.3,0,0.8,0.15"),
  std: CustomEase.create("std", "0.2,0,0,1"),
  expressive: CustomEase.create("expressive", "0.4,0.14,0.3,1"),
  inout: CustomEase.create("inout", "0.83,0,0.17,1"),
  linear: "none",
};
const S = { def: "back.out(1.2)", pop: "back.out(1.7)", heavy: "power3.out", snappy: "back.out(1.1)" };
const exitDur = (d) => +(d * 0.68).toFixed(2); // sortie = 65–70 % de l'entrée

// Exemple : entrée d'un élément, jamais depuis scale(0)
tl.from(".card", { autoAlpha: 0, scale: 0.95, y: "4vw", duration: T.base, ease: E.enter });
tl.to(".card", { autoAlpha: 0, duration: exitDur(T.base), ease: E.exit }, "+=1.5");
```

Rappels moteur : pas de `setAttribute`, `Math.random`, `document`, `window` ; tailles en % ou vw ; événement final obligatoire (voir la description de `create_motion_scene`). Sans CustomEase, remplacer `E` par les approximations natives.

Sources : Material 3 / androidx (Apache-2.0), IBM Carbon (Apache-2.0), Fluent 2 (MIT), Shopify Polaris (MIT), Uber baseweb (MIT), Atlassian ; JakeB-5/motion-graphic-skill (MIT), greensock/gsap-skills (MIT).
