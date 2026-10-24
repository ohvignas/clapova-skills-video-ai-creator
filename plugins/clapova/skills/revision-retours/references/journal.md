# Journal des versions

Un bloc par version, ajouté en fin de réponse ou dans la description du projet.

```
v03 · 2026-10-24 · projet <projectId> · snapshot <snapshotId>
Retour (mots du client) : « le prix se voit pas assez, et la musique couvre la voix »
R1 · t=8,4 s · prix 52 px → 96 px, y 900 · fait
R2 · 0–15 s · musique → ducking renforcé (option A) · fait, 5 instants à écouter : 1,2 · 4,0 · 8,4 · 11,0 · 14,2 s
R3 · t=0 s · « logo plus gros » → contredit la règle « pas de logo plaqué en ouverture » · en attente
Changements de l'utilisateur conservés : titre réécrit à 3,1 s ; clip 4 déplacé.
Contrôle : check_composition 0 erreur ; images avant / après de R1 vues.
```

Règles : on ne renumérote jamais une version ; une version annulée reste dans le journal avec « annulée » ; le `snapshotId` de chaque lot est noté.
