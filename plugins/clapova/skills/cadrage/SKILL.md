---
name: cadrage
description: Use FIRST, before any storyboard, montage or multi-shot generation in Clapova ("fais-moi une vidéo", "une pub pour…", "un Reel / TikTok / Short", "monte mes rushes", "une vidéo comme celle-ci") — mandatory creative framing that asks the user what they really want (render: real / AI-realistic / 2D / 3D / motion / mixed, energy, goal, audience, platform, material, references) with ask_storyboard_questions, shows 3 style directions, and writes a one-page "fiche de direction" (brief créatif + note d'intention) that must be approved before clapova:storyboard or clapova:monteur. Not for a single image or clip (clapova:generate).
---

# Clapova : cadrage créatif obligatoire

Avant tout storyboard ou montage, on sait ce que l'utilisateur veut. Ce document existe dans le métier sous deux noms : le **brief créatif** (agence : objectif, cible, message, preuve, ton, appel) et la **note d'intention du réalisateur** (vision, rendu, caméra, rythme, son, références). Ici les deux tiennent en une **fiche de direction** d'une page. Sans fiche validée : pas de storyboard, pas de génération, pas de montage.

Règle dure : **ne devine jamais le rendu ni l'énergie.** Une vidéo « réelle + motion marketing » et une vidéo « animation 2D » ne sont pas la même commande ; se tromper ici gâche tout le reste.

## Boucle

1. **Lire ce qui est déjà dit** : message, fichiers joints, Brand Kit (`get_brand_kit`). Lien ou fichier de référence : analyse-le et regarde-le avec `clapova:toolbox-createur` (lecture de style en 6 lignes + images clés) avant toute question. Pas de référence : propose d'en donner une (« un TikTok ou Reel que tu aimes ? »), c'est le moyen le plus sûr de comprendre. Remplis la fiche avec ce qui est certain ; marque le reste « ? ».
2. **Demander ce qui manque** avec `ask_storyboard_questions` : 3 à 5 questions, réponses toutes prêtes, une seule fois. Les questions 1 et 2 sont TOUJOURS posées sauf si l'utilisateur y a répondu en clair. Ordre :
   1. **Rendu** : images réelles ou IA réaliste ; réel + motion design (marketing) ; motion design pur ; animation 2D illustrée ; 3D produit ; face caméra.
   2. **Énergie** : calme et premium (plans de 2 à 3 s) ; dynamique réseaux sociaux (1 à 2 s, textes qui claquent) ; très nerveux (0,5 à 1 s, speed ramps, flashs).
   3. **Objectif et cible** : vendre (conversion), faire connaître, expliquer, recruter ; à qui on parle.
   4. **Plateforme et durée** : TikTok / Reels / Shorts 9:16 (15, 20, 30 s), fil 4:5, YouTube 16:9.
   5. **Matière** : photo du produit, rushes, logo, captures ; ou rien (alors tout est généré ou dessiné, annonce-le). Et une **référence** : lien d'une vidéo « comme ça ».
   L'utilisateur dit « décide pour moi » : choisis, mais présente quand même la fiche à valider.
3. **Montrer 3 directions** (gratuit) : une planche de 3 vignettes dessinées en code avec le moteur de `clapova:storyboard` (`planche/`), une par direction plausible (ex. A réel + motion marketing, B motion pur graphique, C UGC téléphone), chacune avec 1 ligne : rendu, énergie, palette, typo. L'utilisateur pointe ; on n'écrit pas de longue description.
4. **Écrire la fiche de direction** (gabarit ci-dessous), la présenter, ATTENDRE un oui. Corrections : on modifie la fiche, pas autre chose.
5. **Transmettre** : la fiche validée est collée dans `storyboard.json` (`direction`) et dans le champ `brief` / `plan.direction` de `create_storyboard`. `clapova:storyboard`, la réalisation et `clapova:monteur` la relisent à chaque étape et la citent quand ils choisissent une source, un modèle, une typo ou un rythme. Un écart à la fiche = demander, jamais trancher seul.

## Fiche de direction (gabarit)

```
FICHE DE DIRECTION · <projet> · v1
Objectif      : <vendre / notoriété / expliquer> · KPI visé
Cible         : <qui, où, état d'esprit>
Message clé   : <une phrase>         Preuve : <chiffre, démo, avis>
Appel         : <action + où>
Rendu         : <réel / IA réaliste / réel + motion / motion pur / 2D / 3D / face caméra>
Énergie       : <calme premium / dynamique / nerveux> · plan moyen <x> s
Plateforme    : <réseau> · <format> · <durée> s
Caméra        : <mouvements dominants : push-in, whip pan, macro, orbit…>
Motion design : <titres cinétiques, compteurs, stickers, soulignés…> · typo <police> · palette <3 couleurs>
Son           : <genre, BPM>, voix off <oui/non, ton>, bruitages <léger / marqué>
Références    : <liens ou direction choisie A/B/C>
Matière       : <fournie / à générer / à dessiner>
Interdits     : <ce qu'on ne veut surtout pas>
Budget        : <crédits max>
```

## Correspondance rendu → fabrication (à respecter ensuite)

| Rendu | Plans « filmés » | Texte, chiffres, logo, CTA |
|---|---|---|
| Réel / IA réaliste | rushes de l'utilisateur, sinon image → vidéo depuis une photo du produit (jamais texte → vidéo pour un produit de marque) | overlays motion code, sobres |
| Réel + motion marketing | idem, plans courts (1 à 2 s), speed ramps, zooms punch | motion code dynamique : titres cinétiques, compteurs, soulignés, stickers, transitions graphiques |
| Motion design pur | aucun | tout en code (`clapova:motion-design`) |
| Animation 2D | illustration en code | code |
| Face caméra | rushes de l'utilisateur ou personnage (`clapova:talking-head`) | sous-titres styles, b-roll |

## Interdits

Commencer un storyboard ou une génération sans fiche validée ; supposer le rendu ou l'énergie ; poser plus de 5 questions ou relancer les questions ; une fiche de plus d'une page ; changer de rendu en cours de route sans accord.
