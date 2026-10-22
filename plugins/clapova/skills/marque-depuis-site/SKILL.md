---
name: marque-depuis-site
description: Use when a Clapova user wants to import their brand from a website URL (logos, colors, fonts, tone) into the Clapova brand kit.
---

# Clapova : kit de marque depuis un site

Outils MCP : `import_brand_from_website` (1 crédit), `apply_brand_import`, `get_brand_kit`.

1. `get_brand_kit` : ce qui existe déjà.
2. `import_brand_from_website({ url })` : logos, palette avec contrastes, typographies, ton, cible, valeurs, réseaux. N'écrit RIEN dans le kit.
3. Résumez ce qui a été trouvé et ce qui serait remplacé. Attendez l'accord explicite.
4. `apply_brand_import({ importId, confirmed: true, parts? })` seulement après cet accord (outil destructif : il remplace le kit).
5. Suite : charte PDF (`export_brand_guidelines`) ou logo vectoriel (`clapova:brandkit`).
