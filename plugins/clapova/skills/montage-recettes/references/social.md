# Recettes réseaux et chaîne

Règles portées ailleurs : `clapova:montage-transitions`, `clapova:motion-titres`, `clapova:motion-compteurs-data`, `clapova:motion-scene-ui`, `clapova:motion-logo-cta`, `clapova:montage-camera-virtuelle`, `clapova:montage-boucle`, `clapova:declinaison-formats`.

## Diaporama photo

iart photo-slideshow (tiers) : **une seule transition**, fondu de 0,4 à 0,6 s ; carte d'intro 1,5–2 s ; carte de fin 2–3 s ; légende 0,3 s après que la photo est en place.

| Beat | Temps | Contenu | Skill |
|---|---|---|---|
| Intro | 0–2 s | titre du diaporama | `clapova:motion-titres` |
| Photos | 2 s → fin − 3 s | une photo par plan, push-in lent, légende décalée de 0,3 s | `clapova:montage-camera-virtuelle`, `clapova:montage-transitions` |
| Fin | 2–3 s | carte de fin | `clapova:motion-logo-cta` |

Interdits propres : deux types de transition ; photo fixe sans mouvement de caméra au-delà de 3 s (`dead_stretch`) ; légende qui arrive avec la photo.

## Conversation SMS, 10–20 s (proposé)

Bulles iart text-message (tiers) : envoyé à droite en bleu ou vert, reçu à gauche en gris ; coins de 18 à 22 px ; police 34 px pour 1080 de large ; « Lu » 300 ms après la bulle ; réaction 400 ms après la bulle, ancrée sur elle. Construction : `clapova:motion-scene-ui`.

| Beat | Temps (proposé) | Contenu | Skill |
|---|---|---|---|
| Accroche | 0–2 s | premier message qui intrigue | `clapova:montage-accroche` |
| Échange | 2 s → fin − 3 s | une bulle à la fois, chacune tenue son temps de lecture | `clapova:motion-scene-ui`, `clapova:motion-titres` (tenue) |
| Chute | 3 s | dernière bulle ou réaction, CTA éventuel | `clapova:motion-logo-cta` |

Interdits propres : copie de l'interface ou du logo d'une vraie application de marque ; faux échange présenté comme réel avec une vraie personne ; bulles dans le bas réservé.

## Récap « Wrapped »

iart explainer wrapped (tiers) : 5 à 7 scènes de 2,5 à 4 s ; texte dans les 80 % centraux de la hauteur ; chaque scène se lit en moins de 2 s et tient en capture d'écran ; image finale conçue pour être partagée. Zones sûres : celles de `clapova:montage` priment.

| Beat | Temps | Contenu | Skill |
|---|---|---|---|
| Ouverture | scène 1 | « Ton année / ton mois » | `clapova:montage-accroche` |
| Chiffres | scènes 2–5 | un chiffre par scène, compteur | `clapova:motion-compteurs-data` |
| Carte à partager | dernière scène | synthèse en une image | `clapova:motion-logo-cta` |

Interdits propres : chiffre sans source (`facts`) ; plus d'un chiffre clé par scène ; scène illisible en capture.

## Intro / outro YouTube (16:9)

iart youtube (tiers) : intro 3–5 s, logo 1–2 s ; outro ≥ 20 s, posée et calme, sur une vidéo ≥ 25 s (écrans de fin). Logo : `clapova:motion-logo-cta` ; format : `clapova:declinaison-formats`.

Interdits propres : intro qui repousse la promesse de la miniature ; outro animée qui gêne les écrans de fin.
