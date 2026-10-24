---
name: son-design
description: Use when il faut poser ou corriger le son d'une vidéo Clapova — « bruitages », « le son fait cheap », « ajoute une musique », « la musique couvre la voix », « mixe », « niveau sonore » : son provisoire en phase A, mix et sonie en phase B, mesure sur le fichier exporté. Not for le calage des coupes sur le BPM (clapova:montage-rythme) ni la voix off seule (clapova:montage).
---

# Clapova : son design

Idée unique : **Claude n'entend pas : il mesure, puis donne 5 instants à écouter.** Règles canoniques : synthèse §3.10, C3, C4, C8, C9. Détails : `references/categories-sfx.md`, `references/mixage.md`, `references/licences-son.md`.

## Phase A : son provisoire (avec le motion design)

- **Musique sur toute la durée**, de 0 à la dernière image, fondu de sortie d'environ 1 s. Plus courte que la vidéo : boucler le même média ou `generate_music` à la durée totale. Départ choisi sur la fenêtre la plus forte du morceau.
- **Coupes et temps** : ≥ 60 % des coupes sur un temps à ±2 images (67 ms à 30 i/s), gros changements tous les 4 temps (§3.3). Le calage vit dans `clapova:montage-rythme` (`plan_shots`, `analyze_music_beats` **quand disponible**).
- **SFX** : `place_sfx_from_events({projectId})` (gratuit) après les scènes et la voix. Chaque son a une cause visible. Le **pic** tombe sur l'image de l'événement, à 0 / +1 image ; un whoosh ou un riser part en avance de son temps de montée et le riser finit sur l'impact (C3). `impact` au plus 2 fois par film. Alterner 2 à 3 prises d'un même son. 3 à 6 dB au-dessus du lit musical.
- Densité serveur : un bruitage par 1,8 s au plus, gain 0,12 à 0,24, −6 dB sous la voix off.

## Phase B : mix (sur demande)

- Hiérarchie **voix > SFX > musique**.
- Musique sous la voix (**proposé, à confirmer**, C4) : 15 à 18 LU sous la voix en sonie court terme, gain de départ 0,18, **jamais sous 0,15**. Règle serveur actuelle : clip 0,5 + `set_duck{level:0.5}` ≈ 0,25. On tranche sur la mesure, pas sur le gain.
- Sonie de sortie (**proposé, à confirmer**, C8) : **−14 LUFS intégrés ±1, true peak ≤ −1,5 dBTP**, mesure stéréo + contrôle mono.
- **Mesure sur le fichier exporté** (`ebur128=peak=true`), jamais sur la timeline : `measure_audio` / `check_audio_sync` (**quand disponible**, S8) ou contrôle après export dans `get_render_status` (**quand disponible**, S5). Sans mesure : écrire « sonie non mesurée ».

## Boucle

1. `get_timeline` (pistes Musique, Bruitages, Voix off).
2. Musique : `list_library` ou `generate_music({prompt, projectId})` (annonce le coût).
3. Un seul `apply_edit_plan` : `add_clip` musique 0 → fin, `set_volume`, `set_duck`, `set_fades{fadeOut:1}`.
4. `place_sfx_from_events` ; retouches à la main par `add_sfx` dans le même type de lot.
5. `check_composition` puis `review_montage` (« musique absente ou trop courte »).
6. Phase B : `export_video` seulement sur accord, puis mesure.

## Contrôle

- OFF-BEAT si un son s'écarte de plus de ±100 ms de son image ; STARTLE si le niveau saute de plus de 6 dB par rapport à la seconde d'avant.
- Sonie par scène : écart à la médiane > 1,5 LU = déséquilibre. Plus de 15 s sans son = film muet.
- Livrer les **5 instants les plus risqués** à écouter au casque (temps, quoi écouter).
- Relecture d'ensemble : `clapova:controle-qualite`.

## Interdits

Sons de synthèse (bips générés par code) ; sons non CC0 sans licence vérifiée ; Mixkit embarqué ; Freesound NC ; un whoosh à chaque coupe ; un SFX devant la voix ; musique plus courte que la vidéo ; dire « ça sonne bien » sans mesure ; madmom, essentia (licences).

## Renvois

`clapova:montage-rythme`, `clapova:finition` (export, `CREDITS.txt`), `clapova:controle-qualite`, `clapova:montage` (pistes, voix off), routeur `clapova:montage`.

## Sources

Synthèse §3.3, §3.10, §2 (C3, C4, C8, C9), §5.2 (S5, S7, S8) ; `rapport-outils-controle.md` (ebur128, ducking) ; `rapport-skills-motion.md` §1 et §11.1 (banque CC0 Barty mesurée). Méthode reformulée de Barty-Bart/motion-graphics `sound-effects` (MIT © 2026 Bart, sons CC0) et heygen-com/hyperframes (Apache-2.0), voir `THIRD_PARTY_NOTICES.md`.
