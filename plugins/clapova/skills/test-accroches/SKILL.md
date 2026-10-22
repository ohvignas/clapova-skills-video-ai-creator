---
name: test-accroches
description: Use when a Clapova user wants several hook variants of the same video before publishing ("teste 3 accroches", "quelle intro marche le mieux", "fais-moi des hooks UGC", "A/B test de l'ouverture") — write 3 to 4 hook formulas, build each first 1.5 to 3 seconds on the same body, compare on frames and with analyze_virality, keep the best and optionally publish the variants.
---

# Clapova : test d'accroches (hooks)

L'accroche est un module testable séparément du corps de la vidéo. Règle d'or : **un seul paramètre change entre deux variantes**, l'accroche. Même corps, même musique, même format.

## Méthode

1. **Brief** : produit ou sujet, public, plateforme (`tiktok`, `reels`, `shorts`), promesse honnête. Le corps de la vidéo existe déjà (`clapova:monteur`) ; sinon monte-le d'abord. Lis `get_guide('viralite')`, `get_guide('montage')` puis `get_guide('motion')` en entier avant d'agir (les variantes sont des projets avec blocs motion et `export_video` refuse sans le guide motion).
2. **Formules** : `get_creative_recipes({topic:"hooks"})` puis 3 ou 4 variantes de familles différentes :
   - résultat d'abord (« 12 000 vues en 3 jours »),
   - question qui pique (« Pourquoi ton café refroidit ? »),
   - contre-pied (« Arrête d'acheter… »),
   - aveu ou preuve choc,
   - avant/après visuel.
   Chaque hook : 5 mots à l'écran au plus, voix avant 0,5 s, élément fort visible à la première image, 1,5 à 3 s au total.
3. **Une variante = un projet** : `create_project({title, aspectRatio})` (même format), recopie le corps depuis `get_timeline` du master avec `apply_edit_plan` (`add_clip` aux mêmes temps ; `add_clip` ne reprend pas effets, sous-titres ni musique du master : recrée-les avec leurs ops, ou limite la variante à l'accroche plus 5 s de corps, ce qui suffit pour comparer et coûte moins ; dans ce cas la musique va de 0 à la fin de cet extrait, pas de la vidéo entière, avec fondu final : la règle « musique sur toute la durée » s'applique à la durée de la variante exportée), puis pose l'accroche : `add_text`, `add_motion_block` (`title-kinetic-words`, `title-stack-bold`), `add_effect` (`camera-zoom-punch`), `add_sfx` léger (`volume` 0,18), `speed_ramp` si utile. Rien d'autre ne change.
4. **Comparer gratuitement d'abord** : `check_composition` et `render_preview_frames` à 0 s, 0,5 s, 1 s, 1,5 s, 3 s pour chaque variante. Élimine toute variante illisible ou coupée. Option économique, sans export : `review_montage` sur chaque projet (`vision:false` gratuit, 1 crédit avec vision) renvoie le score d'accroche des 3 premières secondes ; si l'utilisateur ne veut pas dépenser, arrête-toi là et choisis sur la planche et ces scores.
5. **Mesurer** : `get_credits`, puis annonce le TOTAL en une ligne (variantes x (export + analyse) ; les coûts se lisent dans la description de `export_video` et `analyze_virality`, `estimate_plan` ne les chiffre pas) et attends l'accord AVANT d'exporter. Exporte les variantes restantes en 720p (`export_video`, preset de la plateforme) et lance `analyze_virality({videoUrl, platform})` sur chacune. Compare le sous-score d'accroche (hook) s'il est renvoyé, sinon le score d'accroche de `review_montage` ; faute de l'un et de l'autre, note « n/d » dans le tableau, compare les corrections proposées pour les premières secondes et dis que le score est global. N'invente jamais un sous-score.
6. **Choisir** : garde la meilleure, dis pourquoi en deux phrases. La variante gagnante est affinée puis exportée en 1080p (`clapova:monteur`, Livraison finale).
7. **Publier en test** (sur demande) : publier plusieurs variantes du même corps sur le même compte ressemble à du spam (doublons, baisse de portée). Publie la gagnante ; ou, si l'utilisateur veut un vrai test, une variante par compte ou par réseau, `scheduledAt` espacés d'au moins 24 h, puis `get_post_stats` après 48 h (`clapova:statistiques`). La publication passe par `clapova:publication-calendrier` : le post attend toujours la validation de l'utilisateur dans Clapova, ne dis jamais qu'il part seul.

## Pièges

- Changer la musique, la durée ou le format en même temps que l'accroche : le test ne prouve plus rien.
- Tester plus de 4 variantes : coût et bruit sans gain.
- Promesse que le corps ne tient pas : exagérer oui, mentir non.
- Logo ou « Bonjour » en ouverture.
- Musique plus courte ou sans ducking sur une variante : même musique de 0 à la fin, `set_duck` niveau 0,5, sinon le test est faussé.

## Critères de fin

Tableau (variante, formule, note d'accroche ou « n/d », coût), gagnante choisie avec sa raison, lien direct (`videoUrl`, `studioUrl`) de la meilleure vidéo avec un mot de félicitations, crédits dépensés rappelés.
