# Traduire un retour vague en choix mesurables

Toujours 2 ou 3 options, chacune avec un chiffre de la synthèse (`references/synthese-motion-design.md` (racine du plugin) §3) et l'outil qui l'applique. On montre l'option, on attend le choix.

| Retour | Option A | Option B | Option C |
|---|---|---|---|
| « fais que ça pète », « plus dynamique » | Plans de 1,5 à 2,5 s, 1 à 1,5 s dans l'accroche (§3.3) | Coupes recalées sur le temps, ≥ 60 % (`snap_cuts_to_beats`) | Un seul moment fort : `expressive` sur le CTA, un `impact` (§3.1, §3.10) |
| « trop lent », « ça traîne » | Couper ce qui dépasse 3 s sans changement (`dead_stretch`) | Raccourcir la vidéo vers 6 à 15 s (C5) | Accélérer la voix off, `atempo` ≥ 0,85 (§3.3) |
| « on ne lit pas » | Texte à ≥ 58 px, titre ≥ 96 px (§3.2, proposé) | Tenue max(1 s ; 0,3 s × mots + 0,5 s) (C13) | Moins de mots : 25 caractères par ligne, 3 lignes au plus |
| « ça fait cheap », « ça fait IA » | Retirer glow, particules, dégradés (BANNED, C11) | Une seule couleur héros par image, 3 couleurs par scène | Sons CC0 au lieu de bips, `impact` ≤ 2 (§3.10) |
| « la musique est trop forte » | Musique 15 à 18 LU sous la voix (C4, proposé) | Ducking plus marqué (`set_duck`) | Autre morceau, plus calme |
| « le début ne marche pas » | Élément fort dès l'image 0 (§3.4) | Accroche écrite courte, ~5 mots | Signal de marque sonore ou verbal avant 2 s |
| « plus premium » | Dépassement 0 %, `spring.heavy` sur le texte (§3.1) | Coupes franches, fondus 0,25 à 0,4 s seulement (§3.7) | Push-in lent 1,0 → 1,08 (§3.8) |
| « j'aime pas trop » (sans plus) | Demander l'instant et un mot : rythme, texte, son, couleur, image ? | Montrer 3 images clés et demander laquelle gêne | — |

Si le retour vise un chiffre faux, un nom mal écrit ou un prix : pas d'options, on corrige sur la source donnée par l'utilisateur.
