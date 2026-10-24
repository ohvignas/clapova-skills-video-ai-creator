---
name: marque-depuis-site
description: Use when a Clapova user wants to import their brand identity from a website URL (logos, colors, fonts, tone, audience, social links) into the Clapova brand kit — "importe ma marque depuis mon site", "récupère mes couleurs et mon logo", "charte depuis l'URL" — with import_brand_from_website then apply_brand_import after explicit approval. A YouTube channel or video as input is handled in the Entrées section. To design a new brand from scratch use clapova:brandkit.
---

# Clapova : kit de marque depuis un site

Outils MCP : `import_brand_from_website` (payant, voir sa description), `apply_brand_import`, `get_brand_kit`, `export_brand_guidelines`.

## Entrées autres qu'un site

- **Chaîne YouTube** : `analyze_competitor({channel})` donne ton, rythme et titres via l'API officielle (indisponible si `status:'not_configured'`) ; ce n'est pas une charte, tu ne récupères ni logo ni couleurs. Demande le site de la marque.
- **Vidéo envoyée** (fichier via `create_upload_link`) : `extract_frames` puis lis palette et ton à l'œil, comme inspiration seulement. Marque d'un tiers : refuse de l'appliquer.
- Vidéo YouTube à analyser pour sa palette : `analyze_reference_video` renvoie une palette dans sa recette (indicative, vérifie qu'elle est présente dans le retour avant de la citer, inspiration seulement). Pour recopier le style d'une vidéo (rythme, plans, ton), c'est `clapova:recreer-depuis-reference`, pas ce skill. Lien TikTok ou Instagram, ou page de réseau social (profil Instagram, LinkedIn) comme URL : l'import de marque échoue ou reste partiel ; demande le site de la marque ou un logo en fichier. Plusieurs pages ou sous-domaine : importe la page d'accueil du domaine principal.

## Méthode

0. `get_guide({topic:'marque'})` (méthode du serveur), puis `get_credits` : annonce le coût indiqué par la description de `import_brand_from_website` (aujourd'hui 1 crédit) avant de lancer.
1. `get_brand_kit` : ce qui existe déjà (à ne pas écraser sans accord).
2. `import_brand_from_website({url})` : logos, palette avec contrastes, typographies, ton, cible, valeurs, réseaux. N'écrit RIEN dans le kit. Une URL de page d'accueil donne le meilleur résultat. Site vide (application à page unique), domaine inatteignable ou page d'erreur : réessaie avec la page d'accueil, puis demande à l'utilisateur d'envoyer son logo (`create_upload_link`) et ses couleurs en hex ; n'invente rien.
3. **Résume** en un tableau court : trouvé / absent / ce qui serait remplacé (couleurs, logo, polices, ton). Signale un contraste texte-fond sous 4,5:1.
4. Attends l'accord explicite de l'utilisateur dans ce fil (« oui », « ok, applique »). Un silence, ta propre déduction ou un accord donné avant le résumé ne comptent pas. Rappelle-lui le coût et que l'outil remplace le kit.
5. `apply_brand_import({importId, confirmed:true, parts?})` seulement après cet accord : l'outil est destructif, il remplace le kit. `parts` limite l'import ; valeurs valides : `identity`, `logo`, `palette`, `fonts`, `voice`, `socials`, `designMd` (tout par défaut).
6. Vérifie avec `get_brand_kit`, donne `/app/marque` pour voir le résultat, puis propose la suite : charte PDF (`export_brand_guidelines`), logo vectoriel (`clapova:brandkit`), premier montage avec la marque (`clapova:presets`, champ `brand`).

## Pièges

- Site derrière une connexion ou un mur de cookies : l'import est partiel ; dis ce qui manque, ne l'invente pas.
- Logo trop petit ou en bitmap : propose `vectorize_logo`.
- Marque qui n'appartient pas à l'utilisateur : refuse.
- Idée de la méthode (reformulée de higgsfield-brandkit, MIT) : chaque valeur importée est marquée `fixée` seulement après l'accord ; le reste est `proposé` ou `inconnu`, et un fichier fourni garde son rôle (logo officiel, jamais une simple inspiration).

## Critères de fin

Kit relu avec l'utilisateur, `confirmed:true` utilisé une seule fois après son oui, couleurs hex et polices rappelées en deux lignes, crédit dépensé annoncé, lien `/app/marque`, suite proposée.
