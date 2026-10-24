---
name: motion-sous-titres
description: Use when a Clapova user explicitly asks for captions on a finished edit (phase B) — « ajoute des sous-titres », « sous-titres style TikTok », « karaoké », « mot actif en couleur », « sous-titres sobres LinkedIn ». Word-by-word groups, look, caption band, spelling from the script, timing from the transcript. Never by default. Not for motion titles (clapova:motion-titres).
---

# Clapova : sous-titres stylés (phase B, sur demande)

Une idée : **les sous-titres sont de la finition.** Jamais par défaut, jamais pendant la phase A (motion design), seulement quand l'utilisateur les demande. Remplace l'ancienne skill sous-titres-styles.

## Boucle

1. **Vérifier la demande et la voix** : demande explicite ? Sinon ne rien poser. Projet sans voix : `add_captions` échoue ; propose une voix off d'abord (`clapova:finition`).
2. **Coût** : `add_captions` ≈ 1 crédit par minute transcrite (gratuit si déjà transcrite). Annonce-le ; au-delà de 10 min, attends l'accord.
3. **Texte de référence** : si un script existe, il fixe l'orthographe (noms, prix, URL) ; la transcription (`transcribe_media`, langue forcée avec `language`) ne donne que les temps.
4. **Choisir le look** (table : `references/styles.md`) et les groupes : **2–3 mots** en énergique, **3–5** en conversation, 1 à 4 mots par page ; coupure sur une pause ≥ 150 ms.
5. **Poser** : `add_captions({projectId, look, maxWordsPerPage, position?, keywords?, highlight?, keywordColor?, uppercase?, contour?, emoji?, language, until?, replace:false})`. `until` arrête les sous-titres avant le carton final et le CTA.
6. **Relire le texte renvoyé** mot par mot contre le script. Mot faux : `delete_clip{clipId, removeText:true}` puis `add_text{lane:"captions"}` corrigé ; ou relancer avec `replace:true` seulement si rien n'a été retouché à la main.
7. **Voir** : `render_preview_frames` au début, au milieu, à la fin et sur chaque plan avec visage ; puis `clapova:controle-qualite`.

## Règles chiffrées

- Bande des sous-titres en 9:16 : **y 1100–1248**, dans la zone vitale x 120–900 ; les titres motion n'y entrent pas (synthèse §3.9, proposé). Organique seul, sans pub : bas jusqu'à y ≈ 1440 (proposé).
- Taille : texte lu **≥ 58 px** en 1920, échec sous 44 px (C7, proposé). Laisse la taille par défaut de l'outil si elle respecte ce plancher.
- Animation : fondu sur le groupe **ou** sur le mot actif, pas les deux. Mot actif d'une seule couleur d'accent.
- 3 à 5 mots-clés surlignés au plus (chiffres, verbes forts, nom du produit).
- Un seul look par vidéo ; couleurs du Brand Lock par défaut (`clapova:brandkit`), contour ≥ 1, jamais de bandeau noir plein.
- Rien sur un visage. Texte derrière le sujet (un titre, pas les sous-titres) : `clapova:detourage-sujet`.
- Garde-fous de l'outil, **quand disponibles** (S17) : retrait des mots dans le silence final ; échec au-delà de 20 % de jetons `♪`/`�`.

## Interdits

- Poser des sous-titres sans demande, ou depuis `build_from_storyboard`.
- `replace:true` sur des sous-titres retouchés à la main.
- Laisser la transcription corriger l'orthographe d'un nom, d'un prix ou d'une URL.
- Sous-titres qui chevauchent un titre motion ou débordent sous y 1248 en 9:16.
- Plus d'un emoji par phrase ; aucun en LinkedIn.

## Contrôle

- [ ] Demande explicite notée ; look justifié en une ligne.
- [ ] Texte relu contre le script : 0 faute sur les noms, prix, URL.
- [ ] 4 images regardées : bande respectée, ≥ 58 px, aucun mot coupé, rien sur un visage.
- [ ] `until` posé avant le CTA.

## Renvois

Titres animés : `clapova:motion-titres`. Zones et formats par plateforme : `clapova:finition`, `clapova:declinaison-formats`. Contrôle : `clapova:controle-qualite`. Boucle : `clapova:montage`.

## Sources

Groupes de mots, coupure sur pause, fondu groupe ou mot : HyperFrames `captions` (Apache-2.0) et iart-ai/motion-skills (MIT), reformulés.
