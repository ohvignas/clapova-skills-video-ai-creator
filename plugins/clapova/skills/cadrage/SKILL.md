---
name: cadrage
description: Use FIRST, before any storyboard, montage or multi-shot generation in Clapova ("fais-moi une vidéo", "une pub pour…", "un Reel / TikTok / Short", "monte mes rushes", "une vidéo comme celle-ci") — mandatory creative framing that asks the user what they really want (render: real / AI-realistic / 2D / 3D / motion / mixed, energy, goal, audience, platform, material, references) with ask_storyboard_questions, shows 3 styles from the catalogue as a visual board, and writes a one-page "fiche de direction" (brief créatif + note d'intention) that must be approved before clapova:storyboard or clapova:montage. Not for a single image or clip (clapova:generate).
---

# Clapova : cadrage créatif (méthode du directeur créatif)

On ne fabrique rien avant de savoir ce que l'utilisateur veut voir. Le livrable est une **fiche de direction** d'une page (brief créatif + note d'intention), validée par un oui. Sans elle : pas de storyboard, pas de génération, pas de montage.

Règle dure : **ne devine jamais le rendu ni l'énergie.** « Réel + motion marketing » et « animation 2D » ne sont pas la même commande.

Outils : catalogue `styles/STYLES.md` (12 styles, ids stables), planche `styles/planche-styles.png`, générateur `styles/build.mjs`.

## 1. Écouter et regarder (avant toute question)

- Lis ce qui est dit : message, fichiers, Brand Kit (`get_brand_kit`). Remplis déjà la fiche avec le certain ; le reste est « ? ».
- **Référence fournie** (lien, fichier) : `clapova:toolbox-createur` l'analyse ET la regarde (images clés), puis tu restitues la lecture de style en 6 lignes et tu la rapproches d'un id du catalogue (« c'est du `reel-motion` »).
- **Pas de référence** : demande-en une dans les questions (§2, Q5) ; si l'utilisateur n'en a pas, cherche-lui des exemples : `web_search` (« pub TikTok <secteur> 2026 », 1 crédit) ou `analyze_competitor` sur une chaîne du secteur (2 crédits). Annonce le coût, cite les liens, rattache chaque exemple à un id.

## 2. Questions : une passe, 5 au plus

`ask_storyboard_questions`, une seule fois, réponses prêtes, une option « autre » ; saute une question déjà répondue en clair. Q1 et Q2 sont toujours posées sinon. Ordre et réponses :

1. **Rendu** — « Quel rendu ? »
   - Vraies images ou IA réaliste (`premium-apple`, `unboxing-asmr`)
   - Réel + motion marketing : textes, chiffres, badges par-dessus (`reel-motion`)
   - Motion design / typo pure, rien de filmé (`kinetic-type`, `faceless-explainer`)
   - Quelqu'un qui parle face caméra (`ugc-face-cam`, `pov-green-screen`)
   - Produit en 3D (`produit-3d`) · Capture d'app (`demo-app`)
2. **Énergie** — calme et premium (plans 2,5–3,5 s) ; dynamique réseaux (1–2 s, textes qui claquent) ; très nerveux (0,4–1 s, speed ramps, flashs : `hyper-motion`).
3. **Objectif et cible** — vendre maintenant ; faire connaître ; expliquer ; recruter / fidéliser. Plus « à qui ? » en texte libre.
4. **Plateforme et durée** — TikTok/Reels/Shorts 9:16 en 15 s, 20–30 s ou 45–60 s ; fil 4:5 ; YouTube 16:9.
5. **Matière et référence** — j'ai des rushes ; j'ai une photo du produit ; j'ai des captures ; je n'ai rien (tout sera généré ou dessiné, annonce-le). Plus « un lien d'une vidéo que tu aimes ? ».

« Décide pour moi » : tu choisis, mais la fiche passe quand même en validation.

## 3. Proposer 3 styles en planche (gratuit)

Choisis 3 ids compatibles avec les réponses (rendu d'abord, puis énergie, matière, budget) et **différents entre eux** (ex. un sûr, un plus audacieux, un moins cher). Rends le sous-ensemble :

```
node <skill>/styles/build.mjs --ids reel-motion,kinetic-type,ugc-face-cam --out <dossier de travail>/propositions
```

Regarde `propositions.png` (Read) puis montre-la avec, par lettre, 3 lignes : pourquoi ce style pour ce projet ; ce que ça coûte (0 crédit / rushes / ordre de grandeur en crédits via `estimate_plan`) ; un exemple (lien trouvé en §1 ou modèle Clapova `list_templates`). Pas de PNG : montre le HTML. L'utilisateur pointe A, B ou C (ou mélange : un dominant, l'autre en appoint).

## 4. Fiche de direction, validation explicite

Remplis le gabarit, présente-le, ATTENDS un oui écrit (recopie ses mots). Tant que ce n'est pas oui, on corrige la fiche, rien d'autre.

```
FICHE DE DIRECTION · <projet> · v1
Style         : <id du catalogue> (+ <id d'appoint>)
Objectif      : <vendre / notoriété / expliquer> · KPI visé
Cible         : <qui, où, état d'esprit>
Message clé   : <une phrase>         Preuve : <chiffre, démo, avis>
Appel         : <action + où>
Rendu         : <réel / IA réaliste / réel + motion / motion pur / 2D / 3D / face caméra>
Énergie       : <calme premium / dynamique / nerveux> · plan moyen <x> s
Plateforme    : <réseau> · <format> · <durée> s
Caméra        : <mouvements dominants : push-in, whip pan, macro, orbit…>
Motion design : <titres cinétiques, compteurs, stickers…> · typo <police> · palette <3 couleurs>
Son           : <genre, BPM>, voix off <oui/non, ton>, bruitages <léger / marqué>
Références    : <liens analysés, lecture de style en 1 ligne>
Matière       : <fournie / à générer / à dessiner>
Fabrication   : <rushes / image→vidéo / 3D / code> · modèle <id ou —>
Interdits     : <ce qu'on ne veut surtout pas>
Budget        : <crédits max>
```

## 5. Transmettre

La fiche validée va dans `storyboard.json` (`direction`, avec `direction.style` = id) et dans `brief` / `plan.direction` de `create_storyboard`. Ensuite :

- `clapova:storyboard` : arc, rythme et cases suivent Énergie et Style (plan moyen de la fiche).
- Réalisation : la colonne « Fabrication » de `STYLES.md` fixe la source de chaque plan (rushes, image → vidéo depuis photo produit, jamais texte → vidéo pour un produit de marque ; 3D ; code). Modèle indiqué : `get_template_recipe` puis `apply_template`.
- `clapova:montage` / `clapova:montage` / `clapova:montage` : typo, palette, transitions et son de la fiche.

Chaque étape cite la ligne de la fiche qui justifie son choix. Un écart à la fiche = demander, jamais trancher seul.

## 6. Itérer

Un retour de l'utilisateur = une correction de la fiche (v2, v3…, ligne changée signalée), puis on répercute seulement ce qui en dépend (cases du storyboard, plans, montage). Changement de Style ou de Rendu après validation : nouvelle validation et nouveau coût annoncé.

## Interdits

Storyboard ou génération sans fiche validée ; supposer le rendu ou l'énergie ; plus de 5 questions ou une deuxième salve ; parler d'une référence sans l'avoir regardée ; proposer des styles sans planche ni coût ; une fiche de plus d'une page ; changer de style en route sans accord.
