---
name: montage
description: Use when any multi-shot video work starts in Clapova (load FIRST) — « monte mes rushes », « fais une vidéo », « anime ce texte », « refais le montage », « exporte ». Routes to montage-*/motion-* skills, splits phase A (motion) from B (finition), owns tool loop, budget, no-rebilling. Not for a single clip (clapova:generate) nor framing (clapova:cadrage).
---

# Clapova : montage (routeur unique)

Tu montes DANS Clapova avec les outils MCP `clapova`, par opérations typées (`apply_edit_plan`), jamais en HTML. Cette skill choisit qui fait quoi et tient la boucle ; les règles de métier vivent chacune dans UNE skill voisine, citée ici sans être recopiée.

## Étape 0 : prérequis

1. **Fiche de direction validée** (`clapova:cadrage`). Absente : charge `clapova:cadrage` et arrête-toi là. Chaque choix cite sa ligne de la fiche (Style, Énergie, Plateforme, Son, Budget, Interdits).
2. **Guides** : `get_guide('montage')`, `get_guide('motion')`, `get_guide('storyboard')`, lus en entier avant la première op.
3. **Solde** : `get_credits`. Plafond = ligne Budget de la fiche.
4. Plusieurs plans à fabriquer : `clapova:storyboard` d'abord (planche validée, `approve_storyboard`).

## Routage (une intention, une skill)

Table complète avec « ne pas utiliser si… » : `references/routeur.md` (à lire dès que la demande ne tombe pas dans une ligne ci-dessous).

| L'utilisateur dit | Skill |
|---|---|
| « début plus fort », « hook » | `clapova:montage-accroche` |
| « plus rythmé », « sur la musique », « trop lent », débit de voix | `clapova:montage-rythme` |
| « transition », « raccord », « enchaînement » | `clapova:montage-transitions` |
| « zoom », « Ken Burns », mouvement de caméra | `clapova:montage-camera-virtuelle` |
| « enlève les blancs », dérushage | `clapova:montage-derush` |
| « style », « fais premium » | `clapova:motion-direction-artistique` |
| titres, compteurs, logo, CTA | `clapova:motion-titres`, `clapova:motion-compteurs-data`, `clapova:motion-logo-cta` |
| bruitages, musique | `clapova:son-design` |
| « vérifie », « c'est bon ? » | `clapova:controle-qualite` |
| sous-titres, export, version finale | phase B : `clapova:motion-sous-titres`, `clapova:finition` |

## Phases

- **Phase A, motion design (par défaut)** : rythme, accroche, titres, transitions, caméra, son provisoire. **Pas de sous-titres, pas de voix off finale, pas d'export plateforme** sauf demande écrite.
- **Phase B, finition (sur demande seulement)** : sous-titres, voix off finale, mix, export. On n'y entre qu'après un oui sur la phase A.
- Détail, critères de passage et message de fin de phase : `references/phases.md`.

## Boucle de travail

1. **Lire** : `list_projects`, `get_timeline({projectId})`, `list_media({projectId})`. Toujours relire la timeline avant d'éditer : l'utilisateur a pu changer des clips ; on ne défait jamais ses changements ni une piste verrouillée.
2. **Planifier** : `plan_shots` (nombre de plans, coupes), plan court écrit et validé avant de construire.
3. **Construire** : `build_from_storyboard` (storyboard approuvé) ou `apply_edit_plan` en un seul lot atomique.
4. **Contrôler sans rendre** : `check_composition` (gratuit), appliquer les `fix`.
5. **Regarder** : `render_preview_frames` sur l'accroche, chaque coupe, chaque titre, le CTA ; regarder chaque image.
6. **Relire** : `review_montage`, puis seuil et tours selon `clapova:controle-qualite`.
7. **Livrer la phase A** (lien du projet), proposer la phase B.

Pas à pas, pistes fixes et ops : `references/boucle.md`. **Zones sûres** (texte, logo, CTA dans x 120–900, y 270–1248 en 1080×1920 ; profils par plateforme) : source unique `references/zones-sures.md`, à lire avant de poser du texte.

## Budget et anti-refacturation

- Annonce le coût total en une ligne avant tout outil payant ; `estimate_plan` au-delà de 3 générations. Si le total dépasse la ligne Budget ou le solde : rien n'est lancé, propose la version économique et attends.
- **Ne relance jamais `build_from_storyboard` expiré (timeout) sans `list_media` puis `get_timeline`** : les générations ont souvent abouti ; on reprend ce qui existe, on ne repaie pas.
- **N'exporte jamais sans avoir regardé les images** (`render_preview_frames`) du montage dans son état final.
- Une génération par besoin, jamais « pour essayer ». Réutilise `list_media` / `list_library` d'abord.
- Pièges MCP connus (timeouts, lots refusés, faux positifs) : `references/pieges-mcp.md`, à lire au premier refus ou expiration.

## Promesse de livraison

Dis-le si un plan prévu animé retombe en image fixe, si un média manque, ou si un contrôle annoncé n'est pas encore fait par l'outil (« si disponible »). Termine par le lien du projet ou de la vidéo, jamais « c'est en ligne ».

## Interdits

- Construire sans fiche de direction validée, ou sans plan validé.
- Sous-titres, voix off finale ou export en phase A sans demande.
- Relancer un build expiré à l'aveugle ; exporter sans images regardées ou avec une erreur de `check_composition`.
- Créer une piste, mettre un effet ou une transition dans un clip séparé, écrire du HTML.
- Recopier ici une règle chiffrée d'une skill voisine au lieu d'y renvoyer.

## Contrôle

- Fiche citée pour chaque choix ; phase annoncée (A ou B) dans chaque message de livraison.
- `get_timeline` relu avant chaque lot ; `visualGaps` vide.
- Planche `render_preview_frames` regardée et décrite en une ligne par moment clé.
- Verdict `clapova:controle-qualite` atteint ou `Non résolu :` listé.
- Crédits dépensés ≤ ligne Budget, annoncés en fin de tâche.
