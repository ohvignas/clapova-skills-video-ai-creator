---
name: test-accroches
description: Use when a Clapova user wants several hook variants of the same video before publishing ("teste 3 accroches", "quelle intro marche le mieux", "fais-moi des hooks UGC", "A/B test de l'ouverture") — write 3 to 4 hook formulas, build each first 1.5 to 3 seconds on the same body, compare on frames and with analyze_virality, keep the best and optionally publish the variants.
---

# Clapova : test d'accroches (hooks)

L'accroche est un module testable séparément du corps de la vidéo. Règle d'or : **un seul paramètre change entre deux variantes**, l'accroche. Même corps, même musique, même format.

## Méthode

1. **Brief** : produit ou sujet, public, plateforme (`tiktok`, `reels`, `shorts`), promesse honnête. Le corps de la vidéo existe déjà (`clapova:monteur`) ; sinon monte-le d'abord.
2. **Formules** : `get_creative_recipes({topic:"hooks"})` puis 3 ou 4 variantes de familles différentes :
   - résultat d'abord (« 12 000 vues en 3 jours »),
   - question qui pique (« Pourquoi ton café refroidit ? »),
   - contre-pied (« Arrête d'acheter… »),
   - aveu ou preuve choc,
   - avant/après visuel.
   Chaque hook : 5 mots à l'écran au plus, voix avant 0,5 s, élément fort visible à la première image, 1,5 à 3 s au total.
3. **Une variante = un projet** : `create_project({title, aspectRatio})` (même format), recopie le corps depuis `get_timeline` du master avec `apply_edit_plan` (`add_clip` aux mêmes temps), puis pose l'accroche : `add_text`, `add_motion_block` (`title-kinetic-words`, `title-stack-bold`), `add_effect` (`camera-zoom-punch`), `add_sfx` léger (0,2 à 0,35), `speed_ramp` si utile. Rien d'autre ne change.
4. **Comparer gratuitement d'abord** : `check_composition` et `render_preview_frames` à 0 s, 0,5 s, 1 s, 1,5 s, 3 s pour chaque variante. Élimine toute variante illisible ou coupée.
5. **Mesurer** : `get_credits`, annonce le coût d'export de chaque variante. Exporte les variantes restantes en 720p (`export_video`, preset de la plateforme) et lance `analyze_virality({videoUrl, platform})` sur chacune. Compare la note d'accroche, pas le score global seul.
6. **Choisir** : garde la meilleure, dis pourquoi en deux phrases. La variante gagnante est affinée puis exportée en 1080p (`clapova:monteur`, Livraison finale).
7. **Publier en test** (sur demande) : `publish_post` avec `scheduledAt` espacés d'au moins 24 h, un réseau à la fois, puis `get_post_stats` après 48 h (`clapova:statistiques`).

## Pièges

- Changer la musique, la durée ou le format en même temps que l'accroche : le test ne prouve plus rien.
- Tester plus de 4 variantes : coût et bruit sans gain.
- Promesse que le corps ne tient pas : exagérer oui, mentir non.
- Logo ou « Bonjour » en ouverture.

## Critères de fin

Tableau (variante, formule, note d'accroche, coût), gagnante choisie avec sa raison, lien direct de la meilleure vidéo avec un mot de félicitations, crédits dépensés rappelés.
