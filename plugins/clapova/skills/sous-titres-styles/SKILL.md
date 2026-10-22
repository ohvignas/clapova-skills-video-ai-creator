---
name: sous-titres-styles
description: Use when a Clapova user wants styled, word-by-word captions on a video ("ajoute des sous-titres", "sous-titres style TikTok", "mot actif en couleur", "sous-titres karaoké", "sous-titres sobres pour LinkedIn", "mets les mots-clés en évidence") — choosing the look (pop, karaoke, propre, boite, rebond, halo), words per page, colors from the Brand Lock, position outside platform UI, keywords, emoji, and a frame check, with add_captions and cutout_subject for text behind the subject.
---

# Clapova : sous-titres stylés

Outil principal : `add_captions` (≈ 1 crédit par minute de voix transcrite, remboursé en échec ; gratuit si la transcription existe déjà). Vidéo de plus de 10 minutes : annonce le total et attends l'accord. Boucle d'outils : `clapova:monteur`.

## Méthode

1. **Cible** : réseau et format (`clapova:montage-recipes`, formats). Un projet qui contient déjà la voix (voix off ou vidéo avec son) : pas de projet ni de média, passe d'abord par `clapova:monteur` (étape 0b : `create_upload_link`, `create_project`). Sinon les sous-titres n'ont rien à synchroniser. Vidéo muette : `add_captions` renvoie une erreur ; propose d'abord une voix off (`generate_voiceover` sur un script validé), puis sous-titre.
2. **Look** selon l'usage :

| Look | Pour | Réglage de départ |
|---|---|---|
| `pop` | TikTok, Reels, énergie | 3 mots par page, mot actif surligné |
| `karaoke` | chanté, tutoriel, rythme marqué | mot actif coloré |
| `boite` | texte sur fond chargé | mot actif sur pastille |
| `rebond` | humour, gen-z | mots qui tombent, sans exagérer |
| `halo` | tech, néon | lueur discrète, un seul ton |
| `propre` | LinkedIn, YouTube, corporate | 5 mots par page, bas d'écran (au-dessus de la zone sûre) |

3. **Appel** (`size` : laisse la valeur par défaut de l'outil ; elle donne un texte d'au moins 48 px en 1080p, ne descends pas dessous) : `add_captions({projectId, look, maxWordsPerPage?, position?:"haut"|"centre"|"bas", keywords?, highlight?, keywordColor?, size?, uppercase?, contour?, emoji?, language?, voiceClipId?, until?, replace?})`. En 9:16 la zone de sécurité est automatique (jamais dans les 20 % du bas) ; ne pousse pas `position:"bas"` en 9:16 sauf demande. Même zone sûre que `clapova:montage-recipes` (20 % du bas).
4. **Couleurs** : celles du Brand Lock par défaut (`clapova:brandkit`) ; `brand:false` pour les ignorer ; `highlight` et `keywordColor` en hex. Contraste fort, contour 1 ou plus, jamais de bandeau noir plein.
5. **Mots-clés** : 3 à 5 mots qui portent l'idée (chiffres, verbes forts, nom du produit), pas tous les mots.
6. **CTA** : `until` arrête les sous-titres avant le carton final.
7. **Texte derrière le sujet** (effet premium, un titre seulement) : `cutout_subject` (≈ 3 crédits / 10 s : annonce-le) puis `add_text{lane:"overlay", ...}` : `cutout_subject` redessine le sujet détouré au-dessus de la piste Motion design, donc le texte de cette piste passe derrière lui sans que tu touches à l'ordre des pistes (ne crée jamais de piste). Exemple dans un lot : `[{"op":"add_text","text":"MOT","start":2,"duration":3,"lane":"overlay","fontSize":220}]` puis `cutout_subject({projectId, clipId, prompt:"la personne"})` ; ne pose pas ce texte sur la piste Sous-titres. Détail : `clapova:motion-design`.
8. **Voir** : `render_preview_frames` à 3 instants (début, milieu, fin) et sur un plan avec visage : pas de sous-titre sur un visage, taille lisible (≥ 48 px en 1080p), aucun mot coupé.

## Règles

- Texte fidèle à la voix, chiffres en chiffres, orthographe vérifiée sur les noms propres.
- Un seul look par vidéo ; une seule couleur d'accent.
- Sous-titres et titre motion ne se superposent jamais : titre motion en zone haute, sous-titres au tiers central (look `pop`) ou en bas au-dessus de la zone sûre (look `propre`, 16:9).
- Langue autre que le français : `language` (code à deux lettres).

## Pièges

- Remplacer par erreur des sous-titres retouchés à la main : `replace:false` pour garder.
- Voix faible ou bruit : transcription fausse. Relis le texte renvoyé par `add_captions` avant de livrer ; un mot faux se corrige en supprimant la page (`delete_clip{clipId, removeText:true}`) puis `add_text{lane:"captions"}` avec le bon mot (il n'existe pas d'outil d'édition mot à mot), ou en relançant `add_captions` avec `replace:true` et la bonne `language` (efface les retouches manuelles). Musique trop forte : baisse-la (`set_duck`, `clapova:monteur`) avant de relancer.
- Trop d'emoji : un par phrase au plus, ou aucun en LinkedIn.

## Exemples d'appel

- TikTok, 9:16 : `add_captions({projectId, look:"pop", maxWordsPerPage:3, keywords:["3 erreurs","gratuit","Nova"], highlight:"#FFD400", uppercase:true, until:27.5})`.
- LinkedIn, 1:1 ou 16:9 : `add_captions({projectId, look:"propre", maxWordsPerPage:5, position:"bas", emoji:false})` (position `bas` reste au-dessus de la zone sûre en 16:9 et 1:1).

## Critères de fin

Look choisi et justifié en une ligne, 3 images de contrôle regardées, mots-clés surlignés, aucun sous-titre sur un visage ni dans l'interface de la plateforme. Montrer l'aperçu ; export et félicitations : `clapova:monteur`.
