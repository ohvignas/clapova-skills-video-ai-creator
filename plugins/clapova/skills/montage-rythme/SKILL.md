---
name: montage-rythme
description: Use when a Clapova edit must breathe or hit the music — « plus rythmé », « trop lent », « cale sur le beat », « ça traîne », « la voix va trop vite », « durée des plans ». Shot lengths, novelty spacing, BPM grid, cuts on beat, voice-over pace, scene durations. Not for transitions (clapova:montage-transitions) nor mix (clapova:son-design).
---

# Clapova : rythme, coupes, BPM, débit de la voix off

Phase A. Règles reprises de la synthèse §3.3 et C5 ; la boucle d'outils est celle de `clapova:montage`. Valeurs « proposé » = arbitrage de la synthèse, à confirmer avec l'utilisateur.

## Règles

- **Structure** : accroche, corps, conclusion (TikTok, officiel).
- **Durée totale** en vertical court : 6 à 15 s par défaut, plus une version longue en test A/B (C5) — sauf durée fixée dans la fiche.
- **Plans** : 1,5 à 2,5 s ; 1 à 1,5 s dans l'accroche (**proposé**). Un plan qui porte du texte dure au moins son temps de lecture (règle de tenue : `clapova:motion-titres`).
- **Nouveauté** : quelque chose de nouveau toutes les 2 à 4 s, à intervalles irréguliers. Plus de 3 s sans changement = `dead_stretch`.
- **Respiration** : au moins 3 moments immobiles ; un mouvement constant fait amateur.
- **Coupes sur le temps** à ±2 images (67 ms à 30 i/s). Viser ≥ 60 % des coupes sur un temps, les autres en contre-temps assumé. Gros changements sur la mesure (tous les 4 temps), typo sur les 1/8 et 1/16.
- **Pub énergique** : 120–140 BPM, 6 à 8 scènes de 1,5 à 3 s, au plus 2 coupes sèches et seulement sur un temps fort.
- **Grille BPM** (calcul, arrondi, recalage) : `references/bpm.md`, à lire avant tout calage sur la musique.
- **Voix off** : 2,3 mots/s (140 mots/min), 2,0 mots/s en technique ; durée de scène = mots ÷ 2,3 + 0,4 s ; débit hors plage sous 110 ou au-dessus de 170 mots/min. Les scènes se recalent sur la voix réelle + 1 s de marge. Calcul et correction : `references/voix-off-debit.md`, à lire dès qu'il y a un script ou une voix.
- Énergie et plan moyen de la fiche de direction priment sur ces défauts ; un écart se demande.

## Boucle

1. Fiche (`clapova:cadrage`) : Énergie, plan moyen, Plateforme et durée, Son (BPM).
2. `get_timeline` + `list_media` : durées réelles de la voix et de la musique.
3. Voix off présente : calcule le débit et les durées de scène (`references/voix-off-debit.md`).
4. Musique présente : grille de temps — `analyze_music_beats` si disponible, sinon les beats de `plan_shots` — en vérifiant la confiance (calage refusé si `uncertain`).
5. `plan_shots({voiceoverMediaId?, musicMediaId?, totalSec, aspectRatio, style?})` → comparer à ces règles, ajuster.
6. `apply_edit_plan` en un lot : `trim_clip`, `split_clip`, `move_clip`, puis `snap_cuts_to_beats{beats, tolerance}` (tolérance ≈ 2 images).
7. `check_composition`, puis Contrôle.

## Interdits

- Plus de 3 s sans changement ; mouvement continu sans aucun temps immobile.
- Coupe au milieu d'un mot ; plan de texte plus court que son temps de lecture.
- Grille de BPM appliquée sans vérifier le premier temps ni la confiance.
- Corriger le débit avec un `atempo` sous 0,85, ou laisser un débit hors plage sans le dire.
- Changer la durée totale de la fiche sans accord.

## Contrôle

- Lister les plans (début, durée) depuis `get_timeline` : aucun plan d'accroche > 1,5 s, aucun plan > 2,5 s sans raison écrite, aucun trou > 3 s sans nouveauté.
- Taux de coupes sur un temps (écart ≤ 67 ms à 30 i/s) : ≥ 60 %, chiffre donné à l'utilisateur.
- Débit de la voix (mots ÷ durée × 60) dans 110–170 mots/min.
- `render_preview_frames` sur chaque coupe ; `review_montage` sans défaut de rythme restant (`clapova:controle-qualite`).
- Mesure automatique des coupes et des beats (`analyze_edit`) si disponible ; sinon dire « calculé sur la timeline, pas mesuré sur le rendu ».
