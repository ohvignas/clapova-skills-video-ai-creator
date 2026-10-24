# Anti-patterns motion (identifiants stables)

Chaque identifiant est cité tel quel dans une relecture (`clapova:controle-qualite`). On ajoute, on ne renumérote jamais.

| Id | Défaut | Correctif | Source |
|---|---|---|---|
| AP-01 | Départ depuis `scale(0)` | partir de 0,9–0,97 avec opacité 0 | Emil (tiers) |
| AP-02 | Sortie aussi longue ou plus longue que l'entrée | sortie = 65–70 % de l'entrée, courbe `exit` | Atlassian (officiel, principe) |
| AP-03 | Déplacement en `linear` ou ease par défaut | `enter`, `std` ou `inout` | M3, Uber (officiel) |
| AP-04 | Dépassement sur l'opacité ou la couleur | `std` ou `linear` | androidx effects (officiel) |
| AP-05 | Entrée d'élément > 1 s | `hero` au plus ; > 1 s réservé au continu | M3 (officiel) ; proposé |
| AP-06 | Stagger total > 0,5 s ou pas > 80 ms | 40–80 ms, total ≤ 0,5 s | tiers |
| AP-07 | Gros texte qui rebondit | `spring.heavy`, 0 % de dépassement | JakeB-5 (tiers) |
| AP-08 | Couleur interpolée en sRGB brut | interpolation OKLCH | iart (tiers) |
| AP-09 | Aléa sans graine (scène différente à chaque rendu) | suite à graine fixe | iart, Barty (tiers) |
| AP-10 | Élément qui surgit tout formé ou glisse à vitesse constante | entrée avec courbe et départ d'échelle | JakeB-5 D6 (tiers) |
| AP-11 | Mouvement de titre < 10 % de sa taille (invisible sur mobile) | amplitude ≥ 10 % | Carbon (officiel) |
| AP-12 | Balancement périodique soutenu (~0,2 Hz) | mouvement unique ou secousse brève aléatoire | Apple HIG (officiel) |
| AP-13 | `will-change` sur un élément agrandi par la caméra (texte flou) | le retirer | Barty (tiers) |
| AP-14 | Valeur de durée ou de courbe sans token | citer un token de `tokens.md` | proposé |

Sources : emilkowalski/skills (MIT), JakeB-5/motion-graphic-skill (MIT), Barty-Bart/motion-graphics (MIT), iart-ai/motion-skills (MIT), formulations propres.
