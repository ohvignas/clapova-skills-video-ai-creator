# Modèles pour un produit cohérent

Source : rapport-ia-produit §0.1 et §5 (catalogue Clapova, offre studio, lu le 2026-10-24). Prix indicatifs : revérifier avec `list_models` / `estimate_plan`.

| Usage | Modèle | Crédits | Références |
|---|---|---|---|
| Plan final (héros) | Kling 3.0 Pro I2V | 58 | `elements[]` : 1 face + 1 à 3 angles ; `end_image_url` ; `negative_prompt` ; 3 à 15 s |
| Scène riche en références | Seedance 2.5 | 95 | « large budget » (nombre non confirmé) |
| Retouche itérative | Gemini Omni Flash 1.1 I2V | 42 | remplace Veo 3.1 Preview, arrêtée dans l'API Gemini |
| Première + dernière image seulement | Seedance 2.0 I2V | 59 | 2 images |
| Mouvement imposé par animatique | Kling 3.0 Pro motion-control | 70 | |
| Retouche vidéo | Kling O1 edit | 70 | |
| Brouillon | MiniMax H3 Max Turbo I2V | 7 | première image |
| Brouillon | Wan 3.0 I2V | 16 | première image |

Choix « Pro pour le final, Turbo pour les brouillons » : **proposé**.

Chiffres non confirmés, à ne pas citer : « 7 références Kling », « 50 références Seedance ».

Exposition des Elements dans `generate_video` : à vérifier par `list_model_params`. Validation de la durée avant facturation : quand disponible (S10).
