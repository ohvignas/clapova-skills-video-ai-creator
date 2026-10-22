---
name: storyboard
description: Use when a Clapova user asks for a multi-shot video (pub produit, explainer, TikTok, Reel, Short, "fais-moi une vidéo de…") and you must plan it BEFORE any paid generation — brief, arc et beats, rythme par plateforme, thème visuel figé, fiche personnage, grille de plans avec prompts, relecture PASS/FAIL, accord explicite, puis build (ask_storyboard_questions, create_storyboard, update_storyboard, estimate_storyboard, approve_storyboard, build_from_storyboard, storyboard_thumbnails).
---

# Clapova : storyboard pro avant toute génération

Une vidéo de plus d'un plan commence par un storyboard. Il est gratuit, son coût réel est estimé, et rien n'est généré (donc rien n'est facturé) avant l'accord explicite de l'utilisateur. La règle d'or : la cohérence entre les plans compte plus que la beauté d'un plan isolé.

Format par défaut : 9:16 ; 16:9 pour YouTube long, 1:1 ou 4:5 pour le fil.

## Boucle obligatoire

1. **Brief** (§1), via `ask_storyboard_questions` si des infos manquent.
2. **Architecture** : arc, rythme, beats, grille de plans, thème, personnage (§2 à §5). Tout se prépare dans le plan en 5 blocs, rien n'est généré.
3. **Créer** : `create_storyboard` avec les champs pro (voir « Outils »). Si le retour contient `qualityIssues`, corrige-les avec `update_storyboard` avant de présenter.
4. **Relire** avec la grille PASS/FAIL (§9).
5. **Présenter** en quelques lignes : arc, scènes, durée, coût estimé (`estimate_storyboard`). Pour un explainer, présente aussi les 3 faits à vérifier (§6) : le même « oui » vaut accord et exactitude. ATTENDS l'accord explicite. Les retours passent par `update_storyboard`.
6. **Valider** : `approve_storyboard` seulement après un oui explicite dans son message (recopie ses mots).
7. **Construire** : `build_from_storyboard`, puis ses `followUps`, puis `review_montage`. Si l'appel expire côté client, relance-le : le montage déjà posé (même version) renvoie `built` sans rien refaire ; `rebuild:true` retire le montage précédent avant de le reposer. Une scène sans média reçoit un fond du Brand Kit ou du thème visuel, texte centré en grand. (Limite connue : le build attend encore toutes les générations vidéo avant de répondre.)
8. **Vérifier** : `render_preview_frames`, regarde la planche avant de livrer (voir `clapova:monteur`).

## 1. Brief : seulement ce qui manque

Six infos font un brief : plateforme et durée ; sujet (produit, idée, message) ; ton et ambiance ; appel à l'action final ; contraintes (logo, couleurs, lieux, personnage, musique) ; visuel de référence du produit (photo ou capture). Sans visuel de référence : repli en stock, packshot, motion design ou 2 plans génériques au plus, annoncé dans `inputs`. Pour un logiciel, la capture réelle tient lieu de visuel de référence. S'il en manque, appelle `ask_storyboard_questions` (2 à 4 questions, 2 à 5 réponses toutes prêtes chacune), n'écris rien d'autre et attends. Une seule fois par projet. Jamais si la demande est complète, si un storyboard existe, ou si l'utilisateur dit « décide pour moi » : annonce alors tes choix par défaut dans `inputs`.

Marque ou produit non nommé : n'invente aucun nom, écris [MARQUE] et dis-le dans `inputs`.

## 2. Arc narratif et beats

Renseigne `arc`. Chaque arc se décompose en 3 à 5 beats (6 pour un explainer de plus de 45 s) ; chaque beat devient 1 à 4 plans. Mis bout à bout, les beats racontent l'histoire sans le son.

| Arc | Quand | Beats |
|---|---|---|
| Hook / Build / Payoff / CTA (hook_build_payoff_cta) | TikTok, Reels, Shorts par défaut | 1 accroche (image qui arrête le pouce), 2 montée d'intrigue, 3 révélation, 4 appel |
| Problème / Solution / Preuve / CTA (problem_solution_proof_cta) | pub, produit, service | 1 douleur reconnaissable, 2 le produit en action, 3 bénéfice ou chiffre, 4 appel |
| Relatable / Reveal / Reward (relatable_reveal_reward) | humour, lifestyle | 1 « c'est moi », 2 retournement, 3 récompense |
| Atmosphère / Climax (atmosphere_climax) | marque, voyage, teaser | 1 plans tenus, 2 montée, 3 apogée, 4 logo |
| Explainer (arc other) | explication, tuto | 1 problème et idée clé, 2 à 4 étapes (une par beat), 5 résultat et appel |
| Démo produit (arc problem_solution_proof_cta) | app, SaaS, outil | 1 problème, 2 capture de l'interface en action, 3 résultat visible, 4 appel |

Le bloc `structure` (accroche, preuve, résultat, signature, avec durées) se remplit depuis les beats : accroche = beat 1, preuve = beats du milieu, résultat = dernier beat de valeur, signature = appel et logo.

Lien beat, `shotFunction`, `intent` : hook donne hook ; setting, action, detail donnent problem ou proof ; reveal donne result ; proof donne proof ; cta donne cta ou signature.

Marque connue : logo et couleurs viennent de `clapova:brandkit`.

Démo produit : les captures d'interface sont réelles, jamais générées. Demande-les à l'utilisateur (upload, puis `import_media` pour les ajouter au projet). Cadrage : capture 16:9 recadrée en zoom sur la zone utile dans un cadre téléphone 9:16, jamais étirée ; 3 captures consécutives au plus. Sans capture disponible : repli en motion_design maquette, annoncé dans `inputs`.

## 3. Rythme par plateforme et durée

| Format | Durée | Plans | Rythme |
|---|---|---|---|
| TikTok / Reel accroche | 10 à 15 s | 5 à 8 | coupe toutes les 1,5 à 2,5 s, une seule idée |
| TikTok / Reel / Short | 20 à 30 s | 8 à 12 | coupe 1,5 à 3 s, relance visuelle toutes les 3 s |
| Pub, histoire de marque courte | 15 à 30 s | 6 à 12 | plan moyen de 2,5 à 3 s ; accroche, produit, bénéfice, preuve, CTA |
| Short / explainer | 45 à 60 s | 14 à 22 | plans de 2 à 4 s, un changement de décor ou de cadrage à chaque idée |
| Histoire de marque longue | 45 à 90 s | 10 à 14 | plans de 3 à 5 s, mouvements lents |

Départage : un produit ou un service à vendre = ligne Pub ; sinon contenu social. Promo d'un logiciel ou d'une app = ligne Pub (6 à 12 plans) avec l'arc Démo produit.

Règles dures (vérifiées par `qualityIssues`) :
- Aucun plan fixe au-delà de 5 s : ajoute un mouvement ou coupe.
- La promesse (premier texte ou première voix off) tombe avant 3 s. Contenu non commercial : la question ou le fait étonnant du hook vaut promesse.
- Le logo ne s'affiche jamais dans les 3 premières secondes : il arrive après l'accroche, pleinement en signature. Pour un logiciel, seul le logotype compte, pas l'interface. Sans marque, la règle ne s'applique pas ; un CTA sans marque (« abonne-toi ») est valide.
- Durée moyenne d'un plan en format court : 3,5 s au plus.
- Accroche de 5 s au plus, un élément fort dès la première image.

## 4. Thème visuel figé (visualTheme)

Fixe avant le premier plan : palette (3 à 5 couleurs), lumière, focale, grain, mouvement. Renseigne `visualTheme`, puis abrège-le en UNE chaîne canonique de 20 mots au plus (palette, lumière, focale, grain, mouvement) recopiée mot pour mot dans le prompt de chaque plan video_gen et image_anime. Résume-le aussi dans `style` en une phrase.

Plans motion_design : exige une seconde chaîne de 15 mots (police, style d'icône, easing, palette) recopiée à l'identique dans chaque brief motion_design, sinon les schémas divergent.

## 5. Fiche personnage figée (characterSheet)

Si une personne, une mascotte ou un objet-héros revient : écris sa fiche une fois (âge approximatif, cheveux, peau, tenue précise, accessoire, expression) et abrège-la en une chaîne canonique de 20 mots au plus, recopiée à l'identique dans chaque prompt où il apparaît, sans synonymes d'un plan à l'autre.

Le text-to-video ne garde pas la même personne d'un plan à l'autre ; la fiche seule ne suffit pas. Dès qu'un personnage apparaît dans 3 plans video_gen ou plus, `clapova:personnages` est obligatoire (création avant le build, puis référence). Sinon cadre sans visage : mains, dos, silhouette. Produit : forme, couleur, matière, jamais de texte lisible.

## 6. Les plans : une ligne par plan, tous les champs

Pour chaque plan renseigne :

- **fonction** (`shotFunction`) : hook, setting, action, detail, reveal, proof, cta (lien avec `intent` : §2).
- **cadrage** (`framing`) : ECU et CU/MCU = close ou macro ; MS/MLS = medium ; LS/WS/EWS = wide ; ajoute overhead ou pov au besoin. Jamais trois fois le même cadrage de suite.
- **angle** (`angle`, valeurs en anglais) : hauteur d'yeux = eye_level, plongée = high, contre-plongée = low, vue du dessus = birds_eye, vue du sol = worms_eye, penché = dutch, par-dessus l'épaule = ots.
- **mouvement** (`cameraMove`) : static, pan, tilt, push_in, pull_out, tracking, handheld, orbit. **lumière** (`lighting`) : celle du thème.
- **sujet et action concrets** (`shotDescription`) : qui, fait quoi, où, avec quel objet. Jamais « une femme » : « une barista d'environ 28 ans, cheveux auburn ondulés, tablier en jean ».
- **texte à l'écran** (`onScreenText`) : 6 mots au plus, lisible en 1 s. Zone sûre : TikTok et Reels, bas 20 % et droite 12 % ; Shorts, bas 25 % et droite 12 % ; haut 8 à 10 % sur toutes. `textZone` : top ou center seulement ; bottom = au-dessus du bas 20 %. Sous-titres : entre 55 et 70 % de hauteur, jamais dans les marges. Texte ou captions portent l'idée de chaque plan parlé.
- **voix off** (`voiceoverLine`) : mots max = 2,3 x durée du plan en s, arrondi à l'inférieur (3 s = 6 mots). Chiffres et unités comptent comme des mots (« 3 h » = 2). Le texte à l'écran n'est jamais la voix mot pour mot.
- **asset voiceover** : `text` = le texte lu à voix haute (sinon les `voiceoverLine` de toutes les scènes, dans l'ordre) ; `voiceStyle` = la description de la voix (âge, ton, langue), qui choisit la voix et n'est JAMAIS lue. Ne mets jamais « Voix jeune… : » dans `prompt`.
- **scène sans média** : chaque scène a au moins un asset image ou vidéo (ou un `motion`). Sinon le build prolonge le plan précédent ou pose un fond de marque (jamais de noir) et `qualityIssues` signale la scène sans visuel.
- **posé automatiquement au build** : une `transition` autre que cut devient une vraie transition ; les `sfx` déclarés sont calés, et un whoosh-short discret (0,25) marque les coupes restantes ; en 9:16 le `onScreenText` va en zone haute et `add_captions` s'écarte des textes à l'écran.
- **transition** (`transition`) : cut par défaut ; match_cut pour un raccord de forme ou de geste ; whip_pan pour l'énergie ; fade ou dissolve seulement pour changer de temps ou de lieu.
- **source** (`source`) : video_gen, image_anime (image-to-video depuis un visuel de référence), motion_design, screen_capture ou stock. Budget : 60 % au plus de plans générés (video_gen + image_anime confondus) ; préfère motion_design et stock. Un plan video_gen ou image_anime coûte un clip entier (environ 5 s) même coupé à 2 s ; sous 3 s, préfère stock ou motion_design. Puis `estimate_storyboard` avant de présenter. Schéma, texte lisible, interface, logo ou chiffre : JAMAIS en génération. Chaque plan tient en 5 s.
- **prompt** (`prompt`) : video_gen et image_anime : 60 à 110 mots, en anglais, concrets : sujet + action + décor + cadrage + angle + mouvement + lumière + chaîne thème + chaîne personnage + format. Un seul mouvement principal (sujet OU caméra), direction et vitesse explicites, durée réaliste, pas de combat, foule ni transformation complexe. motion_design : 30 à 60 mots (éléments, mouvement, couleurs du thème, durée). screen_capture et stock : brief de 15 à 40 mots (ce qu'on voit, fichier à fournir), sans chaîne thème, stock et screen_capture seulement. Recopie-le dans `assets[].prompt` pour les médias à générer ; le modèle est choisi par le catalogue (`clapova:generate`).

Règle texte et logo : « no text, no logo » vise le texte et les logos ajoutés par le modèle, qui les déforme ; termine chaque prompt de génération par ce négatif. Textes, logos et URL se posent au montage, en overlay. Une référence produit peut porter un logo ou du texte, mais image_anime les déforme : pour le plan où le logo doit rester net, utilise un packshot stock.

Règle appareils : en video_gen, un écran d'appareil s'écrit « écran éteint, flou ou noir » ; la capture réelle s'incruste au montage. Mains qui tapent : plans courts, jamais en gros plan.

Règle produit : fournis un visuel de référence et pars en image_anime pour tout plan où le produit apparaît. Sans référence, 2 plans produit génériques au plus.

Règle claims (toute promo) : tout chiffre, gain de temps, prix, « gratuit » ou allégation (éco, santé, vitesse) vient du brief ou est marqué [à confirmer] ; n'invente jamais une statistique. Pas de label ni logo tiers généré. Même règle pour les images qui suggèrent une allégation (stock de recyclage, labels, forêts).

Règle explainer : vocabulaire au niveau du public ; un terme technique est expliqué par une image avant d'être dit ; les schémas se font en motion design. Contrôle d'exactitude : liste 3 faits, présentés avec le storyboard à l'étape 5 ; recommande `web_search` pour les vérifier, sans appel payant.

Règle public mineur : ton sans peur ni pression, vocabulaire scolaire, pas de marque ni sponsoring sans mention ; CTA d'abonnement neutre seulement (jamais « n'oublie de », ni compte à rebours).

## 7. Fiche son (obligatoire)

Avant de présenter, écris dans `audioNote` ou `direction` : genre et BPM ; plan du temps fort ; voix (âge, ton, débit, langue) ; 1 sfx au plus par coupe ; ducking musique 0,35 sous la voix. Voix off obligatoire pour explainer et histoire, facultative pour une pub courte. Musique libre de droits générée, jamais un son tendance sous licence. Champs `sfx` et `audioNote` de chaque plan : seulement le bruitage et la note du plan.

## 8. Continuité

- Règle des 180° : en face à face, la caméra reste du même côté de l'axe, sauf plan neutre ou mouvement visible.
- Raccord de mouvement : un geste commencé continue au même point dans le plan suivant.
- Raccord de regard : après un regard, montre ce qui est regardé. Direction d'écran constante ; même décor, accessoires, heure.

## 9. Relecture PASS/FAIL et whyItWorks

Avant de présenter, relis comme un réalisateur exigeant. Chaque critère est PASS ou FAIL.

- Arc : l'histoire se comprend sans le son ?
- Accroche : image forte à 0 s, promesse avant 3 s ?
- Rythme : coupe 1,5 à 3 s, aucun plan fixe de plus de 5 s ?
- Son : fiche du §7 complète ?
- Thème : chaîne canonique dans chaque prompt ?
- Personnage : mêmes traits et mêmes mots partout ?
- Continuité (§8) et variété des cadrages ?
- Voix off : plafond du §6 respecté, écran différent de la voix ?
- Logo et CTA : règles du §3, CTA clair à la fin ?
- Image-to-video : produit dévié de la référence ? 2 régénérations au plus, sinon packshot stock (échec pour l'escalade).
- Prompts : taille selon la source, concrets, « no text, no logo » en négatif ?

Corrige chaque FAIL avec `update_storyboard`, puis relis. **Escalade après 3 échecs** sur le même critère (une même erreur ou `qualityIssues` répétée compte comme un échec) : dis à l'utilisateur ce qui bloque en une phrase et propose deux options (simplifier le plan, ou accepter l'écart).

Termine par `whyItWorks` : 3 à 5 phrases (pourquoi l'accroche arrête le pouce, le rythme tient l'attention, l'ordre fait monter l'intérêt). 


## Outils Clapova

| Étape | Outil |
|---|---|
| Brief | `ask_storyboard_questions` |
| Créer (plan en 5 blocs, arc, visualTheme, characterSheet, whyItWorks, scènes) | `create_storyboard` |
| Corriger, réordonner | `update_storyboard` |
| Coût réel | `estimate_storyboard` |
| Accord | `approve_storyboard` (après un oui explicite) |
| Vignettes basse définition (payantes, sur demande) | `storyboard_thumbnails` |
| Captures d'interface fournies par l'utilisateur | `import_media` |
| Musique libre de droits | `generate_music` (après `approve_storyboard` seulement) |
| Voix off | `generate_voiceover` (après `approve_storyboard` seulement) |
| Construire | `build_from_storyboard` |
| Comparer au storyboard | `review_montage` |
| Voir la planche | `render_preview_frames` |
| Plans motion_design (30 à 60 mots) | `clapova:motion-design` |

Champs pro de `create_storyboard` / `update_storyboard`, optionnels : `arc`, `visualTheme`, `characterSheet`, `whyItWorks`, et ceux des scènes (§6, §7).

Plans screen_capture : marque-les « à fournir » dans `shotDescription` (ex. « à fournir : capture de l'écran Réglages ») et laisse `assets` vide : `estimate_storyboard` ne chiffre que les `assets`, ce plan coûte 0 crédit. `build_from_storyboard` attend ces captures : relance l'utilisateur.

## Interdits

Générer avant l'accord explicite ; `approve_storyboard` sans oui clair ; relancer `ask_storyboard_questions` ; vignettes payantes sans demande ni coût annoncé ; un storyboard pour un plan unique ou une retouche ; changer thème ou personnage d'un plan à l'autre.

## Exemple : pub produit, 20 s, 9:16 (3 plans sur 8)

Gourde « Nova » ; arc problème, solution, preuve, CTA ; thème « deep navy, copper, off-white; soft side window light; 50mm shallow depth of field; light digital grain; slow gimbal ».

| N° | Fonction | Source | Cadrage, angle, mouvement | Texte / voix |
|---|---|---|---|---|
| 1 | hook | video_gen | close, eye_level, push_in | « Ton café refroidit ? » |
| 3 | reveal | image_anime | close, low, orbit | voix « Voici Nova. » |
| 8 | cta | stock | close, eye_level, static | texte « Nova », URL (logo seulement ici) |

