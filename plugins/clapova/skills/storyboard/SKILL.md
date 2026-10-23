---
name: storyboard
description: Use when a Clapova user asks for a multi-shot video (pub produit, explainer, TikTok, Reel, Short, "fais-moi une vidéo de…") or mentions storyboard, planche, croquis, découpage — plan it BEFORE any paid generation as a free sketch board drawn in code (3 cases par plan, flèches caméra/sujet, notes, animatic optionnel), then iterate by conversation ("passe le plan 3 en travelling", "raccourcis le hook à 2 s", "ajoute un plan") with targeted edits and re-rendering until an explicit yes, then approve and build (create_storyboard, update_storyboard, estimate_storyboard, approve_storyboard, build_from_storyboard).
---

# Clapova : storyboard en croquis, itéré en discutant

Une vidéo de plus d'un plan commence par un storyboard. Le livrable de validation est une **planche de croquis dessinés en code** (0 crédit) : une ligne par plan, 3 cases début/milieu/fin, flèches rouges caméra et bleues sujet, notes Caméra / Action / Voix / Texte / Son / Transition. L'utilisateur la corrige en parlant ; tu modifies, tu re-rends, tu montres, jusqu'au « oui ». Rien n'est généré (donc rien n'est facturé) avant son accord explicite. Règle d'or : la cohérence entre les plans compte plus que la beauté d'un plan isolé.

Moteur : `planche/` (format complet, scènes, ajout de scène : `planche/FORMAT.md`). Format par défaut 9:16 ; 16:9 pour YouTube long, 1:1 ou 4:5 pour le fil.

Contraintes dures : 60 % au plus de plans générés ; plan moyen 3,5 s au plus en format court ; aucun plan de plus de 5 s ; logo jamais dans les 3 premières secondes ; promesse avant 3 s ; `get_guide('storyboard')` lu en entier AVANT `create_storyboard` (refusé sinon).

## Boucle

0. **Guide et solde** : `get_guide('storyboard')` (et `get_guide('motion')` avant le build), puis `get_credits`. Vidéo d'inspiration fournie : `clapova:recreer-depuis-reference` d'abord (`analyze_reference_video`), sa recette nourrit l'arc et le rythme.
1. **Cadrage** : la fiche de direction de `clapova:cadrage` doit être validée AVANT cette étape (sinon charge `clapova:cadrage` et fais-la). Le brief (§1) en découle ; tout choix de rendu, rythme, typo ou source suit la fiche.
2. **Découpage** : arc, beats, rythme, thème, personnage, plans (§2 à §6). Écris `storyboard.json` (dans le dossier de travail) et appelle `create_storyboard` avec les mêmes plans (§8) ; garde le `storyboardId` dans le JSON. `qualityIssues` dans le retour : corrige les deux côtés.
3. **Relire** PASS/FAIL (§7), corriger.
4. **Rendre la planche** : `node <skill>/planche/build.mjs storyboard.json --out planche-rendu`. Regarde `planche.png` (Read) avant de la montrer : cases lisibles, flèches au bon endroit, aucun encadré orange non voulu. Pas de PNG (pas de Playwright) : publie ou ouvre `planche.html`, autonome.
5. **Présenter** : la planche + 3 lignes (arc, durée et nombre de plans, coût estimé par `estimate_storyboard`). Solde insuffisant : propose de réduire (moins de plans générés, plus de motion_design et stock, plus court). Explainer : ajoute les 3 faits à vérifier (§5). Puis ATTENDS.
6. **Itérer** (§9) autant de tours qu'il faut.
7. **Valider** : `approve_storyboard` seulement après un oui explicite dans son message (recopie ses mots). Total au-delà de 50 crédits ou doublé depuis le dernier accord : redemande l'accord avec le nouveau chiffre.
8. **Construire** : `build_from_storyboard`, ses `followUps`, puis `review_montage`. L'appel peut durer plusieurs minutes (il attend les générations vidéo) ; s'il expire, relance-le tel quel (même version : renvoie `built` sans rien refaire ; `rebuild:true` repose tout). Scène sans média : fond du Brand Kit, texte centré.
9. **Vérifier et livrer** : `render_preview_frames`, planche regardée image par image, musique sur toute la durée, son léger (voir `clapova:monteur`). Après accord sur l'export : `export_video`, `get_render_status`, puis `videoUrl` et `studioUrl` avec un court message de félicitations.

## 1. Brief : seulement ce qui manque

Six infos : plateforme et durée ; sujet ; ton ; appel à l'action ; contraintes (logo, couleurs, lieux, personnage, musique) ; visuel de référence du produit (pour un logiciel, la capture réelle). Sans visuel : repli stock, packshot, motion design ou 2 plans génériques au plus, annoncé dans `inputs`. S'il manque des infos : `ask_storyboard_questions` (2 à 4 questions, 2 à 5 réponses prêtes), une seule fois par projet, jamais si la demande est complète ou si l'utilisateur dit « décide pour moi » (annonce alors tes choix dans `inputs`). Marque non nommée : écris [MARQUE], n'invente aucun nom.

## 2. Arc, beats, rythme

| Arc (`arc`) | Quand | Beats |
|---|---|---|
| hook_build_payoff_cta | TikTok, Reels, Shorts | accroche, montée, révélation, appel |
| problem_solution_proof_cta | pub, produit, démo d'app | douleur, produit en action (capture réelle pour une app), bénéfice ou chiffre, appel |
| relatable_reveal_reward | humour, lifestyle | « c'est moi », retournement, récompense |
| atmosphere_climax | marque, voyage, teaser | plans tenus, montée, apogée, logo |
| other (explainer) | tuto | problème, 2 à 4 étapes, résultat et appel |

3 à 5 beats (6 pour un explainer de plus de 45 s), 1 à 4 plans par beat ; mis bout à bout, ils racontent l'histoire sans le son. `structure` : accroche = beat 1, preuve = milieu, résultat = dernier beat de valeur, signature = appel et logo.

| Format | Durée | Plans | Rythme |
|---|---|---|---|
| TikTok / Reel accroche | 10 à 15 s | 5 à 8 | coupe 1,5 à 2,5 s |
| TikTok / Reel / Short | 20 à 30 s | 8 à 12 | coupe 1,5 à 3 s, relance toutes les 3 s |
| Pub courte | 15 à 30 s | 6 à 12 | plan moyen 2,5 à 3 s |
| Explainer | 45 à 60 s | 14 à 22 | plans de 2 à 4 s |
| Histoire de marque longue | 45 à 90 s | 10 à 14 | plans de 3 à 5 s, mouvements lents |

Accroche de 5 s au plus, élément fort dès la première image. Logo après l'accroche, pleinement en signature (sans marque, la règle tombe). Démo produit : captures réelles demandées à l'utilisateur (`import_media`), recadrées dans un cadre 9:16, jamais générées ni étirées.

## 3. Thème et personnage figés

`visualTheme` : palette 3 à 5 couleurs, lumière, focale, grain, mouvement, abrégé en une chaîne de 20 mots au plus recopiée mot pour mot dans chaque prompt video_gen et image_anime ; résumé dans `style`. Motion design : seconde chaîne de 15 mots (police, icônes, easing, palette) dans chaque brief. Personnage récurrent : fiche `characterSheet` abrégée en 20 mots, identique partout ; dès 3 plans video_gen avec lui, `clapova:personnages` est obligatoire, sinon cadre sans visage.

## 4. Les plans

Pour chaque plan : `shotFunction` (hook, setting, action, detail, reveal, proof, cta), `framing` (jamais trois fois le même de suite), `angle`, `cameraMove`, `lighting`, `shotDescription` concret (« une barista d'environ 28 ans, tablier en jean », jamais « une femme »), `onScreenText` (6 mots max, zones sûres de `clapova:montage-recipes`), `voiceoverLine` (mots max = 2,3 x durée en s, chiffres compris ; l'écran ne répète pas la voix), `transition` (cut ; match_cut ; whip_pan ; fade ou dissolve pour changer de temps ou de lieu), `source`, `prompt`.

- **Source et budget** : video_gen, image_anime (depuis un visuel de référence, obligatoire dès que le produit apparaît), motion_design, screen_capture, stock. Un plan généré coûte un clip entier (environ 5 s) même coupé : sous 3 s, préfère stock ou motion. Schéma, texte lisible, interface, logo ou chiffre : jamais en génération.
- **Prompts** : génération 60 à 110 mots en anglais (sujet, action, décor, cadrage, angle, un seul mouvement, lumière, chaîne thème, chaîne personnage, format), terminés par « no text, no logo » ; motion 30 à 60 mots ; stock et screen_capture 15 à 40 mots. Écran d'appareil généré : éteint ou flou, la vraie capture s'incruste au montage.
- **Voix et musique** : assets `kind:"voiceover"` (`text` lu, `voiceStyle` jamais lu) et `kind:"music"`. Fiche son dans `audioNote` : genre et BPM, temps fort, voix, 1 sfx au plus par coupe, musique à 0,5 avec `set_duck` 0,5, sur toute la durée.
- **Continuité** : règle des 180°, raccords de mouvement et de regard, même décor et même heure.
- **screen_capture** : « à fournir : … » dans `shotDescription`, `assets` vide (0 crédit).

## 5. Claims et publics

Tout chiffre, prix, « gratuit », gain de temps ou allégation (éco, santé, vitesse) vient du brief ou porte [à confirmer] ; aucune statistique inventée, aucun label tiers généré, ni image qui suggère l'allégation. Explainer : vocabulaire du public, terme technique montré avant d'être dit, 3 faits à vérifier présentés avec la planche (recommande `web_search`). Public mineur : ni peur ni pression, CTA d'abonnement neutre.

## 6. Dessiner le plan sur la planche

Chaque plan devient une ligne de `storyboard.json` : `scene` + `params` pour le dessin, `camera` pour les flèches rouges, `action`, `voice`, `text`, `sound`, `transition` pour les notes, `duration` pour le minutage. Sujet absent de la bibliothèque : scène `generique` (personne, objet, produit, écran, texte, logo dans un décor, avec déplacement) ; si un plan revient souvent et mérite mieux, ajoute une scène (FORMAT.md, « Ajouter une scène »). `panels: 1` pour un plan fixe sans action. Plans motion (`compteur`, `packshot`) : les cases montrent l'état exact du motion design.

## 7. Relecture PASS/FAIL

Arc compris sans le son ? Image forte à 0 s, promesse avant 3 s ? Coupes de 1,5 à 3 s, aucun plan de plus de 5 s ? Fiche son complète ? Chaîne thème et personnage identiques partout ? Continuité et variété des cadrages ? Plafond de mots de la voix, écran différent de la voix ? Logo et CTA conformes ? Prompts à la bonne taille, « no text, no logo » ? Les encadrés orange de la planche sont résolus ou justifiés ? Chaque FAIL se corrige, puis relis. **Escalade après 3 échecs** sur le même critère : dis ce qui bloque en une phrase, propose simplifier ou accepter l'écart. Termine par `whyItWorks` (3 à 5 phrases).

## 8. storyboard.json et create_storyboard : une seule vérité

Les deux décrivent les mêmes plans dans le même ordre. Après chaque modification, mets à jour les deux (`update_storyboard` avec le `storyboardId`) avant de re-rendre.

| storyboard.json | create_storyboard / update_storyboard |
|---|---|
| `title` | `title` |
| `format.ratio` | `format` |
| `shots[i].duration` (s) | `scenes[i].durationMs` (x 1000) |
| `shots[i].title` + `action` | `scenes[i].shotDescription` |
| `shots[i].camera.type` | `scenes[i].cameraMove` (push-in = push_in, track = tracking, pull-out = pull_out) |
| `shots[i].text.value` | `scenes[i].onScreenText` |
| `shots[i].voice.value` | `scenes[i].voiceoverLine` |
| `shots[i].sound` | `scenes[i].sfx` / `audioNote` |
| `shots[i].transition` | `scenes[i].transition` (Cut = cut, Raccord = match_cut, Fondu = fade) |
| `shots[i].tag` Motion / Croquis | `scenes[i].source` motion_design / autre |

Les champs sans équivalent de dessin (`framing`, `angle`, `prompt`, `assets`, `shotFunction`, `arc`, `visualTheme`…) vivent dans `create_storyboard` seulement ; reflète le cadrage dans le dessin (`scale`, `zoom`).

## 9. Itérer en discutant

Une demande = une modification ciblée du JSON, jamais une régénération globale.
1. Traduis la phrase en changement précis : « passe le plan 3 en travelling » = `shots[2].camera = {type:"track", dir:"left", label:"…"}` ; « raccourcis le hook à 2 s » = `shots[0].duration = 2` (la suite se décale seule) ; « ajoute un plan avant le packshot » = insertion d'un plan puis renumérotation des `id`. Si la phrase est ambiguë, une seule question courte.
2. Vérifie qu'elle ne casse pas une règle dure (5 s, promesse, logo, budget) ; sinon dis-le et propose l'option conforme.
3. Mets à jour `update_storyboard` (même plan), incrémente `version`.
4. Re-rends : `--changed 3` (planche complète, plan marqué) ou `--shots 3` (seulement les plans changés, plus rapide à lire). Regarde le PNG.
5. Montre-la avec UNE ligne : « v3 : plan 3 en travelling droite → gauche, durée inchangée (20 s, 0 crédit). » Puis attends la suite.
Coût estimé changé (source modifiée, plan ajouté) : relance `estimate_storyboard` et donne le nouveau total dans la même ligne.

## 10. Sans shell (connecteur claude.ai)

Pas de Node ni de fichiers : construis toi-même la planche en HTML (même mise en page : en-tête, frise, une ligne par plan, 3 cases en SVG simple, flèches rouges et bleues, notes) et rends-la dans la conversation comme artefact ; la boucle d'itération est identique. `storyboard_thumbnails` (vignettes basse définition, payantes) seulement si l'utilisateur demande des images, coût annoncé avant.

## Outils Clapova

`ask_storyboard_questions` (brief), `create_storyboard` / `update_storyboard` (plans), `estimate_storyboard` (coût et solde), `approve_storyboard` (après un oui), `storyboard_thumbnails` (sur demande, payant), `import_media` (captures), `generate_music` et `generate_voiceover` (après approbation seulement), `build_from_storyboard`, `review_montage`, `render_preview_frames`, `clapova:motion-design` (plans motion).

## Interdits

Générer avant l'accord explicite ; `approve_storyboard` sans oui clair ; relancer `ask_storyboard_questions` ; vignettes payantes sans demande ; régénérer toute la planche pour une retouche d'un plan ; laisser `storyboard.json` et le storyboard Clapova diverger ; un storyboard pour un plan unique ; changer thème ou personnage d'un plan à l'autre.
