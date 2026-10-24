---
name: montage-accroche
description: Use when the first 2 s of a Clapova video must hit harder or carry the brand — « accroche », « hook », « début plus fort », « on décroche au début », « pas de logo au début ». Frame 0, 2 s read, brand signals, hook angles, checked on a 0–2.2 s strip. Not for testing several hooks (clapova:test-accroches) nor the end card (clapova:motion-logo-cta).
---

# Clapova : accroche (0 à 2 s) et marque

Phase A. Une seule question : les 2 premières secondes font-elles rester, et la marque est-elle reconnue sans logo plaqué ? Règles reprises de la synthèse §3.4 ; la boucle d'outils est celle de `clapova:montage`.

## Règles

- **Image 0** : un élément fort déjà en action, cadrage serré. Jamais un fondu depuis le noir, jamais un écran vide (`first_frame_empty`).
- **Lecture** : l'accroche se lit à 2 s. La proposition de valeur est bouclée avant 6 s (TikTok, officiel : 90 % de l'effet sur la mémorisation dans les 6 premières secondes).
- **Marque** : 2 à 4 signaux de marque intégrés dans les 2 premières secondes, dont au moins un sonore ou verbal (System1 2026, tiers) : produit en main, couleur de marque dans la scène, nom dit, son de marque.
- **Jamais de logo plaqué ni de plan produit statique en ouverture** : « un logo n'est pas une accroche ». La première ligne n'est jamais « Introducing » ni le logo.
- **Texte** : l'écran ne répète jamais mot pour mot la voix off. Environ 5 mots par ligne d'accroche (tailles et tenue : `clapova:motion-titres`).
- **Angle** : un seul, choisi selon l'objectif de la fiche (conversion ou haut de l'entonnoir). Liste et exemples : `references/angles.md`, à lire quand il faut proposer ou réécrire une accroche.
- **Texte à l'écran selon l'objectif** (C6) : conversion = accroche écrite courte, prix, CTA ; notoriété = au plus une ligne, pas de mur de chiffres.
- Durée des plans de l'accroche : `clapova:montage-rythme`. Zone où poser le texte : zone vitale de `clapova:montage` (`references/zones-sures.md`).

## Boucle

1. Relis la fiche (`clapova:cadrage`) : Objectif, Message clé, Preuve, Interdits.
2. `get_timeline({projectId})` : quels clips et textes couvrent 0 à 2,2 s.
3. Choisis l'angle, écris 2 ou 3 variantes d'accroche (texte + visuel + signal de marque), fais choisir.
4. `apply_edit_plan` en un lot : remplacer ou avancer le plan fort à 0 s (`replace_media`, `move_clip`, `trim_clip`), poser le texte sur l'overlay, retirer tout fondu d'entrée sur le premier clip (`set_transition{edge:"in", transition:null}`).
5. `check_composition`, puis la bande d'images (Contrôle).

## Interdits

- Logo, carton de titre, « Bonjour », « Introducing » ou plan produit statique en ouverture.
- Fondu depuis le noir ou image 0 vide.
- Texte d'accroche identique à la voix off.
- Signal de marque uniquement visuel (aucun son, aucun nom dit).
- Chiffre ou promesse inventés : seulement ce que donnent la fiche ou le site.

## Contrôle

- `render_preview_frames({projectId, times:[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2]})` (bande 0 à 2,2 s ; `mode:"hook"` si disponible). Regarder chaque image : image 0 pleine et en mouvement, texte entier lisible à 2 s, aucun logo plaqué.
- Compter les signaux de marque dans 0 à 2 s (2 à 4, dont un sonore ou verbal) et l'écrire : « marque : produit en main 0,3 s, nom dit 1,1 s ».
- Vérifier que la proposition de valeur est complète avant 6 s (timeline + transcription de la voix).
- `review_montage` : aucun défaut d'accroche restant ; sinon corriger et relire selon `clapova:controle-qualite`.
