---
name: personnages
description: Use when a Clapova user wants a reusable identity or the same person across several images and videos — "crée mon avatar", "mon double numérique", "garde le même personnage dans toutes les vidéos", "mets-moi dans la vidéo", "remplace la personne de cette vidéo", mascot or presenter series — via create_character, list_characters, generate_with_character, generate_voice_with_character, train_character, swap_character_in_video. Covers photo guidance, the one-shot test before a series, consent links and costs.
---

# Clapova : Personnages (identité réutilisable)

Adapté du workflow `higgsfield-soul-id` (github.com/higgsfield-ai/skills, MIT, Copyright (c) 2026 Higgsfield AI), voir `../../THIRD_PARTY_NOTICES.md`.

## Deux niveaux

- **Fiche de référence** (par défaut, immédiat) : un Personnage = des images de référence réutilisées par un modèle multi-références. Pas d'attente.
- **Modèle entraîné** (option, plans payants) : `train_character({characterId})` entraîne un LoRA sur 10 à 20 photos pour un visage plus fidèle, en image puis en vidéo. Facturé une fois, remboursé en cas d'échec, 15 à 30 min. L'outil renvoie le prix et un lien : l'utilisateur ajoute les photos et lance lui-même.

## Règles

- Français, « vous ». Pas d'identifiant brut dans le chat : « Personnage « Léa » prêt ».
- Jamais de célébrité, de personnalité publique, de mineur, ni de personne réelle autre que l'utilisateur.
- Rien n'est silencieux : `create_character`, `train_character` et `swap_character_in_video` renvoient un lien que l'utilisateur ouvre pour confirmer (consentement, contrôle de sécurité).

## Déroulé

1. `list_characters` : réutilisez un personnage existant s'il convient.
2. Sinon demandez le nom (un mot) et le type : `self` (l'utilisateur) ou `fictional`.
3. Photos pour `self` : 5 à 12 photos nettes, une seule personne, yeux visibles, sans lunettes de soleil ni filtre ; angles variés (face, trois-quarts), lumières et expressions variées, du buste au plein pied.
4. `create_character({name, kind, style?, description?})`, donnez le lien de confirmation, attendez.
5. Utilisation :
   - image : `generate_with_character({characterId, prompt, type:"image"})` ;
   - vidéo : `type:"video"` (la référence principale sert de première image) ;
   - voix : `generate_voice_with_character({characterId, text})` ;
   - remplacer une personne dans une vidéo existante : `swap_character_in_video` (devis + lien, attestation de l'utilisateur).

## Série cohérente (test avant le lot)

1. Génère **un seul plan test** (`generate_with_character`), extrais une image (`extract_frames`) et compare au visage de référence.
2. Fidèle : lance la série, en gardant la fiche personnage figée du storyboard et la même référence principale à chaque plan.
3. Un plan dérive : régénère ce seul plan et remplace-le (`replace_media` dans `apply_edit_plan`), pas toute la série.
4. Choisis la finalité avant d'entraîner : photos fixes ou vidéo (un `train_character` pour l'usage dominant).

## Coûts et pièges

- `create_character` : le lien de confirmation est obligatoire (consentement). Rien ne démarre sans lui.
- `train_character` : facturé une fois, remboursé en cas d'échec, 15 à 30 min ; propose-le seulement si la fiche de référence ne suffit pas.
- `swap_character_in_video` : devis annoncé, l'utilisateur atteste avoir les droits sur la vidéo et la personne.
- Photos avec lunettes de soleil, filtres ou plusieurs personnes : visage infidèle.

## Critères de fin

Le Personnage est nommé et réutilisable, le plan test est validé à l'œil, l'utilisateur sait comment le réutiliser (« avec Léa, … »).

## Erreurs

Visage peu fidèle : demander de meilleures photos (nettes, bien éclairées, angles variés), ou proposer `train_character` sur un plan payant.
