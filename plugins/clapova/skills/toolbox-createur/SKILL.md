---
name: toolbox-createur
description: Use when a Clapova user shares a reference to understand what they want or to check a result — a YouTube / TikTok / Instagram link, a video or image file, "regarde cette vidéo", "analyse cette pub", "je veux ce style", "transcris", "récupère les images", "c'est quoi le rythme de…", moodboard, or when Claude must look at a generated media before showing it. Picks the right Clapova analysis tool (analyze_reference_video, transcribe_media, extract_frames, get_media_info, fetch_url, web_search, analyze_competitor, list_references, review_montage, render_preview_frames, check_composition) and turns references into a style read the user validates. Feeds clapova:cadrage.
---

# Clapova : toolbox du créateur (voir, écouter, comprendre)

But : comprendre ce que l'utilisateur veut en VOYANT ce qu'il montre, et vérifier ce qu'on fabrique avant de le livrer. On regarde d'abord, on parle ensuite.

## Quel outil pour quel besoin

| Besoin | Outil | Coût | Notes |
|---|---|---|---|
| Décortiquer une vidéo de référence (plans, caméra, texte, musique, rythme, CTA, palette, storyboard prêt) | `analyze_reference_video` | ≈ 1 crédit | `source` = lien YouTube public, `mediaId` ou URL https directe. 10 min max. |
| Lien TikTok / Instagram / fichier de l'utilisateur | `create_upload_link` puis `get_upload_status`, ensuite `analyze_reference_video` sur le `mediaId` | gratuit puis ≈ 1 | Ces liens ne s'importent pas tels quels ; demande le fichier (enregistrement d'écran accepté). |
| Voir des images d'une vidéo | `extract_frames` (mode `sceneChanges` pour un plan par coupe, `everySeconds`, `timestamps`) | gratuit | 30 images max ; regarde-les avant d'en parler. |
| Transcrire (script, voix, sous-titres) | `transcribe_media` | ≈ 1 crédit/min | 10 min max ; passe `language`. Relis les noms propres et mots clés (« chaud » lu « show ») et corrige avant usage. |
| Infos techniques | `get_media_info` | gratuit | durée, résolution, fps, audio. |
| Lire une page (fiche produit, site, article) | `fetch_url` | gratuit | dès qu'un lien est donné. |
| Chercher des exemples, tendances | `web_search` | 1 crédit | cite les URL. |
| Ce qui marche sur une chaîne YouTube | `analyze_competitor` | 2 crédits | motifs à adapter, jamais copier. |
| Cibles chiffrées d'un format (plans, relances, CTA) | `list_references` | gratuit | pub-ugc, lancement-produit, face-camera, listicle, broll-storytelling, hyper-motion. |
| Garder un montage réussi comme étalon | `mark_as_reference` | gratuit | review_montage comparera les suivants. |
| Contrôler un montage | `check_composition` (erreurs), `render_preview_frames` (images), `review_montage` (note /10, 1 crédit) | 0 à 1 | regarde les images une par une. |

Annonce le coût en une ligne avant tout outil payant.

## Lire une référence (méthode)

1. **Récupérer** la source (tableau ci-dessus). Plusieurs références : 3 au plus.
2. **Analyser** : `analyze_reference_video`, puis `extract_frames` en `sceneChanges` pour voir les vrais plans.
3. **Regarder** les images avant de conclure : rendu (réel, IA, 2D, 3D, motion), cadrages, mouvements, typo, couleurs, densité de texte, transitions.
4. **Restituer en « lecture de style »** de 6 lignes, avec 3 à 6 images clés montrées :
   ```
   Rendu      : réel produit + motion design par-dessus
   Rythme     : plan moyen 1,2 s, relance toutes les 2 s
   Caméra     : macro, push-in rapides, whip pans
   Motion     : titres cinétiques gras, compteurs, soulignés, stickers
   Couleurs   : bleu nuit, orange, blanc · typo sans serif grasse
   Son        : musique 120 BPM, impacts sur les coupes, voix directe
   ```
   Puis : « C'est bien ça que tu veux ? Qu'est-ce que tu gardes, qu'est-ce que tu enlèves ? »
5. **Reporter** dans la fiche de direction de `clapova:cadrage` (Rendu, Énergie, Caméra, Motion, Son, Références). On s'inspire de la structure, jamais des images, sons, textes ou marques de la référence.

## Vérifier avant de montrer

Avant de présenter un média généré ou un montage : `get_media_info` (durée, audio), `extract_frames` ou `render_preview_frames`, regarde, compare à la case du storyboard et à la fiche. Un défaut visible (texte collé, mot mal transcrit, objet déformé, écran noir) se corrige avant de montrer. Montre le résultat dans la conversation (images ou vidéo), pas seulement un lien vers l'app.

## Limites connues (à signaler, pas à contourner)

Pas d'analyse d'image seule ni de moodboard dédiés : utilise les images extraites et ta propre lecture. Pas d'import direct TikTok / Instagram / YouTube en fichier : demande le fichier à l'utilisateur. Transcription limitée à 10 min par appel : découpe (`split_media`) au-delà.

## Interdits

Parler d'une référence sans l'avoir analysée ni regardée ; republier ou recopier une référence ; inventer ce qu'il y a dans une vidéo ; montrer un résultat qu'on n'a pas regardé.
