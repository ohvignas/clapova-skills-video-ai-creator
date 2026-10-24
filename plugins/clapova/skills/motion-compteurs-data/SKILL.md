---
name: motion-compteurs-data
description: Use when a Clapova video shows a number, a counter, a stat or a chart ("compteur", "chiffre clé", "le chiffre qui monte", "graphique animé", "barres", "statistique", "compte à rebours"). Every figure is sourced in facts, tabular digits, worst cases 0/1/separators handled. Not for maps or flow diagrams (clapova:motion-carte-diagramme) nor plain titles (clapova:motion-titres).
---

# Clapova : compteurs et données

Une idée : **un chiffre à l'écran est une preuve, donc il est sourcé, lisible et tenu.** Règles canoniques : `docs/synthese-motion-design.md` §3.5. Durées et courbes : `clapova:motion-tokens`. Tailles de texte : `clapova:motion-titres`.

## Avant tout : la table `facts`

Aucun compteur sans une ligne `facts` validée (gabarit : `references/facts.md`) :
- chaque chiffre affiché = une source (URL, fichier et ligne, ou « donné par l'utilisateur ») et **une seule écriture** (même chaîne pour la barre et son libellé) ;
- arrondi selon la notation publique de la source ;
- pas de source : on ne l'affiche pas. Repli : barres **relatives** sans valeur, ou demande à l'utilisateur. Jamais de chiffre inventé (JakeB-5, Barty ; tiers) ;
- montre la table à l'utilisateur avant de construire.

## Règles chiffrées (§3.5)

- Durée du comptage : **1,2 s** jusqu'à 3 chiffres ; **2 s** de 4 à 6 chiffres ; **2,5 à 3 s** au-delà (proposé, d'après Carbon, Fluent et tiers).
- Easing de décélération : `enter` (0.05, 0.7, 0.1, 1) ou Polaris ease-out (0.19, 0.91, 0.38, 1). Jamais `linear` sur la valeur.
- Valeur finale tenue **≥ 0,83 s** (proposé) ; un texte lu tient aussi max(1 s ; 0,3 s × mots + 0,5 s) (C13).
- `font-variant-numeric: tabular-nums` obligatoire : sinon 99 → 100 saute en largeur.
- Format selon la langue : `1 284` en fr (espace fine insécable), `1,284` en en. Forme compacte `1 M` / `1,2 k` si > 6 chiffres.
- Compte à rebours : valeur affichée = `ceil(durée − N/fps)` (iart, tiers).
- Graphiques : échelles communes, ni axe tronqué ni échelle logarithmique, une mesure compagnon honnête (ex. « sur 1 200 répondants »). Barres en stagger 40–80 ms (§3.1).
- Données à l'écran : selon l'objectif (C6). Notoriété : au plus une ligne, pas de mur de chiffres (System1 : −7 à −12 % d'émotion).

## Pires cas (à tester à chaque fois) — `references/cas-limites.md`

0 et 1 (pluriel : « 1 client », « 0 client »), négatif (`−42,5`), > 100 %, décimales flottantes (0,1 + 0,2), séparateur régional, forme compacte, jamais `NaN`, `null` ni `undefined` affiché.

## Boucle

1. `get_guide('motion')` lu en entier, puis table `facts` validée.
2. Bloc prêt : `get_motion_catalog({category:"Chiffres"})` → `add_motion_block({projectId, block:"counter-count-up"|"counter-big-number"|"counter-progress-bar"|"counter-stat-ring", start, duration, variables})` (gratuit).
3. Sur mesure (graphique, plusieurs valeurs) : `create_motion_scene` avec la recette `references/recette-compteur.md` (événements `counter_tick` et `counter_end`), corrections par `edit_motion_scene`.
4. Repli : si `export_video` refuse la scène (« media_missing »), remplace-la par `add_motion_block` counter-* aux mêmes temps et préviens l'utilisateur.
5. `render_preview_frames({projectId, times})` : départ, mi-course, `counter_end`, fin de tenue. Puis `place_sfx_from_events({projectId})`.

## Interdits

Chiffre sans ligne `facts` ; deux écritures du même chiffre ; chiffres proportionnels (largeur variable) ; axe tronqué ; compteur sur 0,5 s (saccade) ; valeur finale qui bouge encore pendant la lecture ; glow, dégradé de texte (§3.2).

## Contrôle

- Chaque chiffre visible sur la planche = une ligne `facts` identique au caractère près.
- L'image `counter_end` montre la valeur finale formatée, chiffres alignés, dans la zone vitale x 120–900, y 270–1248 (§3.9).
- Note de la scène ≥ 8/10 ; défauts au format de `clapova:controle-qualite`.

## Sources

Synthèse §3.5, C6, C13. Cas limites : emilkowalski/skills `break-ui` (MIT). `facts` : JakeB-5/motion-graphic-skill (MIT), Barty-Bart/motion-graphics (MIT). Formulations propres, voir `../../THIRD_PARTY_NOTICES.md`.
