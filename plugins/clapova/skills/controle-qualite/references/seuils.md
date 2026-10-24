# Mesures et seuils

Tous les seuils viennent de `references/synthese-motion-design.md` (racine du plugin) (§3) et de `references/recherche/ (racine du plugin) rapport-outils-controle.md` (§4). « Proposé » = attend la validation de l'utilisateur.

| Contrôle | ok | warn | fail | Source |
|---|---|---|---|---|
| Sonie intégrée | −14 ±1 LUFS | ±2 | au-delà | §3.10, C8 (proposé) |
| True peak | ≤ −1,5 dBTP | −1,5 à 0 | > 0 | §3.10 (proposé) |
| Écran noir | aucun | ≤ 0,2 s en transition | > 0,2 s, ou début/fin | outils-contrôle §4 |
| Image figée | aucune | 0,5 à 1 s | > 1 s | outils-contrôle §4 |
| Durée d'un plan | 0,4 à 4 s | < 0,4 ou 4 à 6 s | > 6 s | outils-contrôle §4 |
| Coupes sur un temps (±2 images) | ≥ 60 % | 30 à 60 % | < 30 % | §3.3 |
| Couverture du son | jusqu'à la fin | plus de temps détecté > 2 s avant la fin | silence > 1 s | outils-contrôle §4 |
| Hauteur de texte (1920) | ≥ 58 px | 44 à 58 px | < 44 px | C7 (proposé) |
| Tenue d'un texte | ≥ max(1 s ; 0,3 s × mots + 0,5 s) | −20 % | moins | C13 |
| Zone vitale | dedans | déborde ≤ 20 px | au-delà | §3.9 ; outils-contrôle §4 |
| Contraste | ≥ 4,5:1 | 3 à 4,5 | < 3 | outils-contrôle §3 (WCAG) |
| Accroche | coupe ou texte avant 1 s | — | rien | outils-contrôle §4 |

Score du script : 10 − 1,5 par `fail` − 0,5 par `warn`, plafonné à 5 si un `fail` porte sur le son, le noir ou la zone sûre (synthèse §5.2 S1). Ce score n'est pas la note de `review_montage` : c'est une preuve à citer.

Pièges de mesure :
- Sonie : mesurer en stéréo sur le fichier exporté (`ebur128=peak=true`). pyloudnorm en mono 22 kHz donne −17,4 au lieu de −14,1.
- Plans : le filtre ffmpeg `scene` est bruité en motion design (flashs, zooms) : regrouper les détections à moins de 0,2 s. PySceneDetect `detect-adaptive` résiste mieux.
- BPM : librosa peut doubler ou diviser le tempo ; vérifier à l'oreille via les 5 instants.
- OCR à 2 images/s : une durée de texte est connue à 0,5 s près ; un mot « slam » de 0,5 s apparaît « lu 0,5 s ». Confirmer sur `render_preview_frames` avant d'en faire un P1. Le contraste (k-moyennes dans la boîte) est une approximation.

## Script `scripts/controle_video.py`

```
python3 scripts/controle_video.py video.mp4 --platform tiktok [--fast] [--ocr-fps 2] [--out rapport.json]
```

- Obligatoire : `ffmpeg` et `ffprobe`. Optionnel (`scripts/requirements.txt`) : scenedetect, librosa, rapidocr-onnxruntime, opencv. Le champ `mode` dit ce qui a tourné ; sans dépendance : plans par `scene`, pas de temps ni de texte (`skipped`).
- Sortie JSON : `meta`, `checks[]` (`id`, `status`, valeurs), `fixes[]`, `score`, `elapsed_s`.
- `--platform pinterest` applique la zone stricte. Les zones sont mises à l'échelle de la résolution réelle.

Test réel sur `nova-hyper.mp4` (1080×1920, 30 i/s, 15,02 s), le 2026-10-24 :

| Mode | Temps | Résultat |
|---|---|---|
| Complet (scenedetect, librosa, OCR 30 images) | 23 s | −14,1 LUFS, −3,8 dBTP, pas de noir ni de figé ; 15 plans ; 136 BPM, 36 % des coupes sur le temps (warn) ; musique sans temps après 12,0 s (warn) ; « Commande sur nova.fr » 41 px et hors zone (fail) ; « de chaud » 40 px, contraste 1,8:1 ; score 5 (plafonné) |
| Dégradé (ffmpeg seul) | 2,2 s | mêmes sonie, crête, noir, figé ; 10 plans par `scene` ; temps et texte `skipped` ; score 9,5 |

Les mesures reproduisent celles du rapport outils-contrôle (−14,1 LUFS, −3,8 dBTP, 136 BPM, texte du CTA à 41 px). Le nombre de plans diffère (15 contre 10) : `detect-adaptive` coupe plus finement que `detect-content`.
