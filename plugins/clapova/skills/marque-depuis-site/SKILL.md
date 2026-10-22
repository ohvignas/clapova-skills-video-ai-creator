---
name: marque-depuis-site
description: Use when a Clapova user wants to import their brand identity from a website URL (logos, colors, fonts, tone, audience, social links) into the Clapova brand kit — "importe ma marque depuis mon site", "récupère mes couleurs et mon logo", "charte depuis l'URL" — with import_brand_from_website then apply_brand_import after explicit approval. To design a new brand from scratch use clapova-brandkit.
---

# Clapova : kit de marque depuis un site

Outils MCP : `import_brand_from_website` (1 crédit), `apply_brand_import`, `get_brand_kit`, `export_brand_guidelines`.

## Méthode

1. `get_brand_kit` : ce qui existe déjà (à ne pas écraser sans accord).
2. `import_brand_from_website({url})` : logos, palette avec contrastes, typographies, ton, cible, valeurs, réseaux. N'écrit RIEN dans le kit. Une URL de page d'accueil donne le meilleur résultat.
3. **Résume** en un tableau court : trouvé / absent / ce qui serait remplacé (couleurs, logo, polices, ton). Signale un contraste texte-fond sous 4,5:1.
4. Attends l'accord explicite, mot pour mot.
5. `apply_brand_import({importId, confirmed:true, parts?})` seulement après cet accord : l'outil est destructif, il remplace le kit. `parts` limite l'import (ex. couleurs seulement) si l'utilisateur ne veut pas tout.
6. Vérifie avec `get_brand_kit`, puis propose la suite : charte PDF (`export_brand_guidelines`), logo vectoriel (`clapova:brandkit`), premier montage avec la marque (`clapova:presets`, champ `brand`).

## Pièges

- Site derrière une connexion ou un mur de cookies : l'import est partiel ; dis ce qui manque, ne l'invente pas.
- Logo trop petit ou en bitmap : propose `vectorize_logo`.
- Marque qui n'appartient pas à l'utilisateur : refuse.

## Critères de fin

Kit relu avec l'utilisateur, `confirmed:true` utilisé une seule fois après son oui, couleurs hex et polices rappelées en deux lignes, suite proposée.
