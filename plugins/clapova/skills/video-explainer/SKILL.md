---
name: video-explainer
description: Use when a Clapova user wants a complete narrated explainer from a topic, story or document ("vidéo explicative", "explique en vidéo", "vidéo pédagogique", "raconte cette histoire en vidéo") — style key, script by blocks, voiceover, one generated clip per block, assembled with the faceless-explainer template.
---

# Clapova : vidéo explicative narrée
> Adapté du workflow `higgsfield-video-explainer` de github.com/higgsfield-ai/skills (MIT, Copyright (c) 2026 Higgsfield AI) — voir `../../THIRD_PARTY_NOTICES.md`. Les appels CLI Higgsfield sont remplacés par les outils Agent de Clapova (modèles fal du catalogue, crédits Clapova).

## Phase 0 — demander d'abord (deux tours séparés)

1. **Style seul** : proposez 3–4 styles (aquarelle, papier découpé, ligne claire, 3D pâte à modeler…) ou une image de style de l'utilisateur.
2. **Réglages** : durée (30 s à 3 min ; N blocs de ~8 s), langue de la voix (français par défaut), mascotte récurrente ou scènes sans personnage, format 16:9 ou 9:16, sous-titres oui/non.

Chaque choix revient à l'utilisateur sauf s'il délègue.

## Règles dures

- Visuels **non photoréalistes**, même descripteur STYLE dans chaque prompt.
- Aucune parole dans les clips vidéo : la voix vient uniquement de `generate_voiceover`.
- Exactement un clip par bloc ; bloc N audio ↔ bloc N vidéo.
- Prompts image/vidéo en anglais ; narration dans la langue choisie.
- Sujet réel : vérifier les faits (recherche web) avant d'écrire ; aucune citation, date ou chiffre inventé. Histoire personnelle : seulement les détails donnés.
- Assembler dans la même session : rendre des clips en vrac est un échec.

## Pipeline

1. **Image de style** : `generate_image({prompt: STYLE + "abstract style swatch" (ou mascotte), aspectRatio})`. Gardez son URL = STYLE_KEY.
2. **Narration** : N blocs, une phrase de 18–22 mots (~8 s) chacun, nombres écrits en lettres, jamais « dans cette vidéo ». Accroche → idées → chute.
3. **Prompts de blocs** : `STYLE REFERENCE: match the attached image exactly. <STYLE>. SCENE: <action du bloc>. MOTION: <mouvement>.`
4. **Voix** : un `generate_voiceover` pour tout le texte (sous-titres mot à mot ensuite avec `add_captions`), ou un par bloc ; dans ce cas les blocs se suivent sans se chevaucher (règles de son : `clapova:montage-recipes`).
5. **Clips** : `generate_video({imageUrl: STYLE_KEY ou image du bloc, prompt, presets:["push-in"|"static"]})` par bloc. Au-delà de 3 clips : `estimate_plan` d'abord.
6. **Assemblage** : dans un projet vide, `apply_template({projectId, templateId:"faceless-explainer", mediaIds, voiceoverMediaId, musicMediaId?, brand?, texts:{title, subtitle, cta}})` (ou `create_from_template` avec des URL et `brand` obligatoire). Puis contrôle et relecture selon `clapova:monteur` (titre, chaque bloc, CTA).

## Écarts

Clips Clapova de 10 s par défaut (comme Higgsfield) : un bloc de 8–10 s tient en un clip. Pas de catalogue de styles hébergé ni de job d'assemblage serveur : le modèle `faceless-explainer` le remplace.
