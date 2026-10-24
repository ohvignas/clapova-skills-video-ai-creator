# Défauts : identifiants stables, gravité, correctif par défaut

Les identifiants ne changent jamais (on en ajoute, on n'en renumérote pas). Colonne « D » : correspondance avec la table D1–D11 de JakeB-5 (MIT), reformulée. Colonne « Mesure » : code renvoyé par un outil ou par `scripts/controle_video.py` ; « œil » = seulement regardé.

Format d'une ligne de compte rendu : `t=4,2 s · où · problème → correctif · reste`.

## P0 : bloque la livraison

| Id | Défaut | D | Mesure | Correctif par défaut |
|---|---|---|---|---|
| CQ-P0-01 | Écran noir > 0,2 s, ou en début / fin | D5 | `black` | Combler le trou de la piste vidéo (`move_clip`, `trim_clip`), supprimer le fondu depuis le noir |
| CQ-P0-02 | Image 0 vide (fond seul) | D3 | `first_frame_empty` (quand disponible), œil | Démarrer sur l'élément fort déjà en action (`clapova:montage-accroche`) |
| CQ-P0-03 | Texte sur texte, ou titre motion sur sous-titres | D1 | `content_overlap` (quand disponible), œil | Déplacer le titre en zone haute (`move_clip{y}`) ou `add_captions{until}` |
| CQ-P0-04 | Texte coupé ou masqué par un élément | D8 | layout (quand disponible), œil | Couper le texte, jamais la taille ; redonner la place dans la zone vitale |
| CQ-P0-05 | Texte, logo ou CTA hors zone vitale de plus de 20 px | — | `text` (zone) | Ramener dans x 120–900, y 270–1248 (profil vertical) |
| CQ-P0-06 | Texte ou sous-titre sur un visage | — | œil (`frame_subject`) | Déplacer hors de la boîte du visage |
| CQ-P0-07 | Musique absente, ou silence > 1 s avant la fin | D11 | `audio_coverage` | Prolonger ou boucler la musique jusqu'à la fin, fondu de sortie ~1 s |
| CQ-P0-08 | Écrêtage : true peak > 0 dBTP | D11 | `true_peak` | Limiteur à −1,5 dBTP (`clapova:son-design`) |
| CQ-P0-09 | Sonie à plus de 2 LU de −14 LUFS | — | `loudness` | Normaliser en deux passes (`clapova:son-design`) |
| CQ-P0-10 | Chiffre différent de sa source, ou écrit de deux façons | D10 | œil + `facts` | Reprendre la valeur et l'écriture uniques de la source (`clapova:motion-compteurs-data`) |
| CQ-P0-11 | Objet incompréhensible (il faut l'expliquer) | — | œil | Le retirer ou le remplacer par un élément lisible |
| CQ-P0-12 | Logo ou étiquette produit déformé | — | œil, CLIP (quand disponible) | `clapova:produit-coherent` |
| CQ-P0-13 | Texte < 44 px (en 1920) | D2 | `text`, `text_below_floor` | Agrandir à ≥ 58 px, raccourcir la ligne si besoin |

## P1 : à corriger avant de livrer

| Id | Défaut | D | Mesure | Correctif par défaut |
|---|---|---|---|---|
| CQ-P1-01 | Texte lu entre 44 et 58 px, titre < 96 px | D2 | `text` | Monter à 58 px (lu), 96 px (titre) |
| CQ-P1-02 | Tenue sous max(1 s ; 0,3 s × mots + 0,5 s) | — | `text`, `line_unread` | Prolonger le plan ou couper des mots |
| CQ-P1-03 | Plus de 3 s sans rien de nouveau | D4 | `dead_stretch`, `freeze` | Ajouter un changement (coupe, mot, mouvement) à intervalle irrégulier |
| CQ-P1-04 | Moins de 30 % des coupes à ±2 images d'un temps | D11 | `beat_sync` | `snap_cuts_to_beats` (`clapova:montage-rythme`) |
| CQ-P1-05 | Plan > 6 s, ou image figée > 1 s | — | `shots`, `freeze` | Redécouper (plans de 1,5 à 2,5 s) |
| CQ-P1-06 | Contraste < 4,5:1 (3:1 pour un grand titre) | — | `text` (contraste), `contrast` | Couleur proposée par l'outil, ou fond derrière le texte |
| CQ-P1-07 | Élément BANNED : titre centré sur dégradé, tout en fondu, glow, particules, fond mesh, indicateur qui pulse, CTA qui « respire » | D7 | œil | Retirer (`clapova:motion-direction-artistique`) |
| CQ-P1-08 | Élément qui surgit tout formé, ou glisse à vitesse constante | D6 | œil | Entrée en `enter`, départ d'échelle 0,95 (`clapova:motion-tokens`) |
| CQ-P1-09 | Plus de 2 `impact`, SFX sans cause visible, repère son à plus de ±100 ms | D11 | `check_audio_sync` (quand disponible), œil | `clapova:son-design` |
| CQ-P1-10 | Saccade ou image vide à une coupe | D5 | bande de coupe | Recaler la coupe, `set_transition` adaptée (`clapova:montage-transitions`) |
| CQ-P1-11 | Texte flou (réduit sous ~60 %) | D9 | œil (planche téléphone) | Réduire le texte, pas l'échelle du calque |
| CQ-P1-12 | Rien de net avant 1 s, accroche illisible à 2 s | D3 | `hook` | `clapova:montage-accroche` |
| CQ-P1-13 | Logo plaqué en ouverture | — | œil | Signaux de marque intégrés (`clapova:montage-accroche`) |

## P2 : finition

| Id | Défaut | Correctif par défaut |
|---|---|---|
| CQ-P2-01 | Coupes entre 30 et 60 % sur le temps | Recaler les coupes les plus proches d'un temps |
| CQ-P2-02 | Plan de 4 à 6 s, ou < 0,4 s non voulu | Ajuster la durée |
| CQ-P2-03 | Sortie aussi longue que l'entrée | Sortie à 65–70 % de l'entrée |
| CQ-P2-04 | Plus de 5 types de transition, transition non causée | Revenir à 3–5 familles, coupe franche par défaut |
| CQ-P2-05 | Plus de 3 couleurs par scène hors noir et blanc | Réduire à la palette |
| CQ-P2-06 | Contraste entre 3 et 4,5:1 sur un grand titre | Renforcer si possible |

## Compte rendu type

```
Tour 2/3 · note 7,5/10 (plafonnée : 1 P0)
P0  t=12,0 s · CTA « Commande sur nova.fr » · 41 px, hors zone de 176 px → 64 px, y ≤ 1248 · CQ-P0-13, CQ-P0-05
P1  t=3,1 s / 5,4 s · coupes · 164 et 167 ms du temps → snap_cuts_to_beats · CQ-P1-04
Mesuré : sonie −14,1 LUFS, TP −3,8 dBTP, 15 plans, 136 BPM, 36 % des coupes sur le temps.
Regardé seulement : visages, BANNED, lisibilité téléphone.
À écouter au casque : 0,0 s · 2,4 s · 6,6 s · 12,0 s · 14,5 s.
Non résolu : (vide)
```
