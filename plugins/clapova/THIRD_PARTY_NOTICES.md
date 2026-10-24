# Third-party notices — Clapova project skills

The `clapova-*` skills below reimplement, on Clapova's stack, workflows published in
**github.com/higgsfield-ai/skills** (version 0.13.0): clapova-generate,
clapova-product-photoshoot, clapova-marketplace-cards, clapova-personnages,
clapova-brandkit, clapova-youtube-thumbnail, clapova-video-explainer. Steps and
decision logic are adapted; Higgsfield CLI/API calls are replaced by Clapova
Agent tools; no private Higgsfield prompt, preset or endpoint is reused.
`src/lib/templates/recipes.ts` adapts the same repo's product-shot modes,
marketplace asset list and thumbnail frameworks.

clapova-montage-recipes also draws on the editing rules of
github.com/HeroicSwan/after-effects-mcp (skills/after-effects-mcp, MIT,
Copyright (c) 2026 ae-mcp contributors) and the discipline patterns of
github.com/OSideMedia/higgsfield-ai-prompt-skill (MIT, Copyright (c) 2026
O-Side Media). Ideas only (no text copied) from AKCodez/higgsfield-claude-skills
(no license).

```
MIT License

Copyright (c) 2026 Higgsfield AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

The same MIT terms apply to the ae-mcp contributors and O-Side Media
copyrights cited above.

## clapova-storyboard

Réécriture Clapova, qui s'inspire de : bernatmv/ai-rules `ai-video-storyboard`
(MIT déclaré dans le skill ; sources amont aicontentskills sans LICENSE : aucun
texte recopié), inference-sh/skills `storyboard-creation` (MIT d'après le
README du dépôt, sans fichier LICENSE) et rainlib/ai-storyboard (GPL-3.0 :
structure et idées seulement, aucun texte copié ni traduit). Voir la section
« Crédits » du skill.

## Skills ajoutés en 1.1.0

`prompts-video`, `pub-produit-ugc`, `talking-head`, `test-accroches`,
`sous-titres-styles`, `declinaison-formats` sont des textes originaux écrits
pour les outils MCP de Clapova. Ils s'inspirent, comme idées de méthode
uniquement (aucun texte recopié), de github.com/higgsfield-ai/skills (MIT,
Copyright (c) 2026 Higgsfield AI : prompt vidéo de mouvement seul, test d'une
accroche à la fois, barrières entre phases d'un explainer), des bonnes
pratiques d'écriture de skills publiées par Anthropic (platform.claude.com,
« Skill authoring best practices » : description déclencheuse, divulgation
progressive, critères de fin) et du dépôt github.com/heygen-com/hyperframes
(Apache-2.0 : principe d'une composition rendue de façon déterministe). Les
dépôts remotion-dev/skills et travisvn/awesome-claude-skills n'ont pas de
licence confirmée : idées seulement, rien n'est repris.

## Tour 1 de relecture (1.2.0)

`recreer-depuis-reference`, ainsi que l'enrichissement de `brandkit`,
`marque-depuis-site` et `video-explainer`, reprennent comme idées de méthode
uniquement (reformulées, aucun texte recopié) des éléments de
github.com/higgsfield-ai/skills (MIT, Copyright (c) 2026 Higgsfield AI) :
fiche de marque aux champs fixés, proposés ou inconnus avec l'origine de
chaque valeur, rôle donné à chaque fichier fourni (logo officiel, simple
inspiration), trois palettes réellement différentes avant choix, tableau de
cohérence de l'ensemble livré, vérification avant toute génération payante, et
recette d'une vidéo de référence reprise sans copier son contenu. Le texte de
la licence MIT reproduit plus haut s'applique à ces reprises.

## clapova-storyboard : moteur de planche (`skills/storyboard/planche/`)

- `lib/gsap.min.js` : GSAP 3.14.2, Copyright 2025 GreenSock (Webflow). Distribué sous la
  « GSAP Standard No-Charge License » (https://gsap.com/standard-license) : gratuit, y compris en
  usage commercial, depuis la reprise par Webflow (2024-2025). Restriction de cette licence : pas
  d'usage dans un outil concurrent du constructeur visuel de Webflow. Utilisé seulement pour la
  timeline de l'animatic optionnel ; la planche n'en dépend pas.
- `fonts/` : Inter (Rasmus Andersson), Caveat (Impallari Type), JetBrains Mono (JetBrains),
  fichiers woff2 issus de @fontsource, tous sous SIL Open Font License 1.1.
- Le reste du moteur (sketch.js, scenes.js, generique.js, board.js, build.mjs, render.mjs) est
  écrit pour Clapova.
