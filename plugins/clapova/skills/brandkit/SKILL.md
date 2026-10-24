---
name: brandkit
description: Use when a Clapova user wants a brand applied consistently to videos and visuals — palette, logo, typography, the "Brand Lock" fed to templates (brand colors, logo, fonts), branded social graphics, posters, mockups — or a new identity when explicitly asked ("charte", "kit de marque", "mes couleurs", "crée un logo", "logo vectoriel") with get_brand_kit, generate_vector_logo, vectorize_logo, export_brand_guidelines. To import a brand from a website use clapova:marque-depuis-site.
---

# Clapova : kit de marque
> Adapté du workflow `higgsfield-brandkit` de github.com/higgsfield-ai/skills (MIT, Copyright (c) 2026 Higgsfield AI) — voir `../../THIRD_PARTY_NOTICES.md`. Les appels CLI Higgsfield sont remplacés par les outils Agent de Clapova (modèles fal du catalogue, crédits Clapova).

## Règles

- Français, « vous ». Une seule série de questions bloquantes, jamais un questionnaire complet.
- Après chaque proposition (palette, logo, typographie) : stop, attendre un choix explicite. Le silence n'est pas une validation.
- Conserver mot pour mot le texte de l'utilisateur. N'inventer aucun positionnement, chiffre, certification.
- Marque tierce : « mets les couleurs / le logo de Nike (ou d'un concurrent) » → refuse. Un kit de marque ne reprend que la marque de l'utilisateur ou celle d'un client dont il a les droits. Propose une palette ou un logo originaux dans le même esprit (énergie, contraste, formes), sans copier ni imiter le logo.

## 1. Classer la demande

Commencez par `get_guide({topic:'marque'})` (méthode officielle du serveur) puis `get_brand_kit` (kit existant). Kit vide alors que l'utilisateur dit « mets mes couleurs » : demande-les (hex) ou propose `import_brand_from_website` ; ne devine rien. Kit existant avec un autre logo ou d'autres couleurs que la demande : montre l'écart en deux lignes et laisse choisir (garder le kit, ou le remplacer après accord explicite) ; n'écrase jamais en silence. Marque à importer depuis un site : `import_brand_from_website({url})` puis `apply_brand_import` après accord explicite (skill `marque-depuis-site` du plugin).


**Inventaire des fichiers fournis** : donne un rôle à chacun : logo officiel, variante de logo, police, palette, charte existante, référence de style (inspiration seulement), contenu. Une inspiration n'est jamais traitée comme un actif officiel sans confirmation. Pour s'inspirer d'une vidéo ou d'une chaîne (palette, ton, rythme), passe par `clapova:recreer-depuis-reference` : tu en tires des idées, jamais la marque de quelqu'un d'autre.

- `appliquer` : l'utilisateur a déjà logo/couleurs → ne rien redessiner.
- `compléter` : créer seulement les éléments manquants requis par le livrable.
- `créer` : nouvelle identité, seulement si demandée.

## 2. Brand Lock (la fiche qui fait foi)

Notez : nom exact, logo officiel (URL), couleurs hex (`primary`, `background`, `text`), polices (titre / texte), formes, interdits. Cette fiche est la source unique des couleurs et polices pour les autres skills. Marque chaque champ : `fixé` (fourni ou approuvé, on n'y touche pas sans permission), `proposé` (comble un manque, révisable), `inconnu` (ne rien inventer, demander). Dis aussi d'où vient la valeur : déclarée par l'utilisateur, mesurée sur un fichier, observée à l'œil, ou déduite.

Application dans les outils : le kit de marque est appliqué automatiquement par `apply_template` (paramètre `brandLock`, vrai par défaut ; `false` l'ignore) ; ne le repasse pas à la main. `apply_template` n'a que `brand:{name, primary, background, text}` : le logo (`logoUrl`) ne passe que par `create_from_template`. Dans les prompts d'image : « exact hex #… », polices nommées.

## 3. Éléments requis selon le livrable

- vidéo par modèle de montage → palette + logo (optionnel) ;
- visuel avec texte (post, affiche) → logo + palette + typographie ;
- maquette sans texte → logo seul.

## 4. Créer ce qui manque

Avant tout appel payant : liste ce que tu vas générer (nombre de logos, de visuels), annonce le coût en une ligne (`get_credits`, `estimate_plan` au-delà de 3 images) et attends l'accord. Aucune génération « en plus » : chaque sortie sert un livrable précis.

1. **Palette** : proposer 3 palettes vraiment différentes de 3 à 6 couleurs nommées (hex), chacune avec les rôles (fond, texte, principale, accent) et une phrase de justification, présentées en tableau texte (nom, hex, rôle) avec un exemple de titre ; aucun outil MCP ne rend du HTML, et pour un aperçu visuel `generate_image` produit un nuancier (« color swatches, exact hex #… ») ; contraste texte/fond ≥ 4,5:1. Ne choisis pas à la place de l'utilisateur ; une fois choisie, la palette est fixée dans le Brand Lock tout de suite.
2. **Logo** : par défaut `generate_vector_logo` (Recraft, vectoriel propre) avec 3 concepts de symbole distincts (couleurs de la palette validée, texte seulement si le nom de marque est demandé, orthographe vérifiée) ; `generate_image` seulement pour une illustration ou une mascotte. Un logo fourni en PNG/JPG : `vectorize_logo`, jamais redessiné. Si `generate_vector_logo` échoue ou si le plan ne le permet pas : dis-le, remboursement automatique en cas d'échec ; repli `generate_image` (3 concepts) avec l'accord de l'utilisateur, ou `vectorize_logo` d'un logo qu'il fournit. Fichier joint : `create_upload_link` puis `get_upload_status`. Changer la palette invalide le logo généré avec elle.
3. **Typographie** : 2–3 paires Google Fonts (titre / texte), chaque paire unique, rendues avec le vrai nom de marque. Si la marque utilise une police propriétaire sans fichier fourni, garde son nom comme règle observée et propose un substitut Google en le disant clairement ; ne redistribue jamais un fichier de police.

## 5. Produire

Réutiliser partout la même source de logo (jamais redessiné). Visuels photo : `generate_image` avec le Brand Lock copié dans le prompt. Vidéos : modèles de montage avec `brand` (`clapova:presets`). Contrôler chaque rendu : en MCP seul, seul `render_preview_frames` (sur un projet) renvoie des images ; sinon donne l'URL et fais valider à l'œil par l'utilisateur, sans prétendre avoir vérifié (`get_media_info` donne le format). Puis, sur l'ensemble produit, un tableau de cohérence : orthographe du nom, logo identique, rôles de couleur, paire de polices, texte exact. Un écart inexpliqué est une dérive à corriger ; ne réparer que ce qui échoue. Livrer : liens des fichiers, `/app/marque` pour voir le kit, et un court message de félicitations original avec un emoji. Suite montage : lis `get_guide('montage')` puis passe par `clapova:monteur` (musique sur toute la durée, contrôle image par image) ; le kit s'applique via `apply_template` (`brandLock`).

## Pièges

- Redessiner un logo fourni : interdit, la même source partout.
- Palette changée après un logo généré : le logo est à refaire.
- Texte du logo faux : vérifie l'orthographe du nom avant de livrer.
- Marque qui change : ne régénère que les sorties qui en dépendent.
- Pas de coût annoncé avant les logos : interdit.

## Critères de fin

Brand Lock écrit (nom, hex, polices, logo, interdits), choix validés par l'utilisateur à chaque étape, chaque sortie contrôlée à l'œil, charte PDF proposée (`export_brand_guidelines`, lien de téléchargement).

## Écarts

Logo vectoriel SVG : `generate_vector_logo` (Recraft V3) ou `vectorize_logo` (PNG/JPG vers SVG), SVG nettoyé. Charte PDF : `export_brand_guidelines` (lien de téléchargement) ou bouton « Télécharger la charte (PDF) » sur /app/marque. Pas de PPTX. Les scripts Python de Higgsfield ne sont pas repris.
