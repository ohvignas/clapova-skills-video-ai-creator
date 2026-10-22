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
