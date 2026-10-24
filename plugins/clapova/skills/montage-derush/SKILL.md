---
name: montage-derush
description: Use when a Clapova user wants a face-to-camera video or long rush cleaned — « nettoie ma vidéo », « enlève les blancs », « coupe les euh », « garde les meilleurs passages », « dérushe », « retire les faux départs » — silences, fillers, repetitions, cut between words, re-encoded excerpts. Not for adding b-roll (clapova:montage-broll) nor captions (clapova:motion-sous-titres).
---

# Clapova : dérushage

Une idée : **retirer ce qui ne sert pas sans jamais couper un mot**. On propose les coupes, l'utilisateur les valide, puis on applique. Le dérushage précède tout motion design (phase A) ; aucun sous-titre n'est posé ici.

## Règles

- **Silences adaptatifs** : le seuil se déduit de la sonie de la source (mesure `loudnorm`, puis détection de silence à ce seuil), pas d'un niveau fixe d'une source à l'autre (synthèse §4, méthode ffmpeg standard ; côté serveur dans `analyze_rushes`, si disponible).
- **Coupe entre deux mots**, jamais au milieu : on se cale sur les temps par mot de la transcription.
- **Air autour des phrases** (règle Clapova actuelle) : 0,12 s avant et 0,18 s après chaque phrase ; 0,3 s avant et après un extrait isolé (short).
- **Tics** : « euh », répétitions, faux départs retirés (`cutFillers`, `cutRepetitions`) ; un tic qui porte le sens ou l'émotion reste.
- **Extraits toujours réencodés** : sans réencodage, la coupe se cale sur l'image clé précédente (synthèse C16).
- Une prise par idée : entre deux prises du même passage, garder la plus nette et le dire.
- Durée finale tirée de ce qui reste, pas l'inverse : on n'accélère pas la voix pour tenir un temps (débit et durée des plans : `clapova:montage-rythme`).

Paramètres et cas difficiles : `references/silences.md`.

## Boucle de travail

1. `get_guide('montage')`. Source : `list_media` / `get_timeline` ; fichier local : `create_upload_link` puis `get_upload_status`.
2. Coût : `get_credits`, puis annonce `analyze_rushes` (≈ 1 crédit/min) en une ligne et attends l'accord.
3. `analyze_rushes({projectId, clipIds, minSilence?, keepSilence?, cutFillers:true, cutRepetitions:true})` : rien n'est modifié, l'outil propose des plages. Transcription seule si besoin : `transcribe_media`.
4. Présente les coupes (début, fin, motif) ; signale celles qui touchent une phrase émotionnelle ou une chute.
5. Après accord : op `cut_ranges` dans `apply_edit_plan` (un seul lot) ; extrait autonome : `trim_media` ou `split_media` (réencodés).
6. Contrôle : `get_timeline` (aucun trou, `visualGaps` vide), `render_preview_frames` autour de 3 coupes ; liste des coupes douteuses à écouter.
7. Suite : `clapova:montage-broll` pour couvrir les jump cuts, `clapova:montage` pour le reste.

## Interdits

- Couper au milieu d'un mot ou d'une respiration utile.
- Appliquer les coupes sans validation.
- Extrait coupé sans réencodage.
- Accélérer la voix pour gagner du temps.
- Ajouter des sous-titres pendant le dérushage (phase B, sur demande).

## Contrôle

- [ ] Chaque coupe tombe entre deux mots (transcription).
- [ ] Air de 0,12 s / 0,18 s respecté.
- [ ] Aucun trou noir ni son coupé à une couture.
- [ ] Les coupes douteuses sont listées pour écoute humaine.

Sources : règles Clapova actuelles (talking-head, shorts-depuis-video-longue) ; synthèse §2 C16 et §4. Formulation propre.
