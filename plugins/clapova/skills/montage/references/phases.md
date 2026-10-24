# Phases A et B

Lire au moment de livrer la phase A ou quand l'utilisateur demande sous-titres, voix finale ou export.

## Phase A : motion design (par défaut)

Contenu : rythme et coupes, accroche, titres, compteurs, logo et CTA, transitions, caméra virtuelle, son provisoire (musique et bruitages de travail, voix témoin si elle existe).
Exclu sauf demande écrite : sous-titres, voix off finale, mixage final, export plateforme.
Critère de sortie : verdict de `clapova:controle-qualite` atteint (ou `Non résolu :` accepté par l'utilisateur), puis un oui écrit de l'utilisateur sur la phase A.

Message de fin de phase A (gabarit) :
```
Phase A prête · <durée> s · <format>
Structure : accroche 0–x s · corps · CTA y s
Vu sur les aperçus : <une ligne>
Relecture : <verdict controle-qualite>
Lien : <studioUrl>
Phase B possible : sous-titres, voix off finale, mix, export. On y va ?
```

## Phase B : finition (sur demande)

Ordre : voix off finale → sous-titres (`clapova:motion-sous-titres`) → mix (`clapova:son-design`) → export et livraison (`clapova:finition`).
Une modification de la phase A demandée pendant la phase B rouvre la phase A pour ce seul point, puis on reprend.

## Si l'utilisateur demande tout d'un coup

« Monte-la avec sous-titres et exporte » : c'est une demande explicite, les deux phases s'enchaînent, mais l'utilisateur voit la phase A (aperçus) avant tout export facturé.
