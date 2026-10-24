# Dérushage : paramètres et cas difficiles

## `analyze_rushes`

| Paramètre | Rôle | Conseil |
|---|---|---|
| `projectId`, `clipIds` | rushes posés sur la timeline | obligatoire : le clip doit être sur la timeline |
| `minSilence` | silence minimal retiré | laisser le défaut, puis ajuster si le rythme semble haché |
| `keepSilence` | air conservé | viser 0,12 s avant / 0,18 s après (Clapova actuel) |
| `cutFillers` | retire « euh », « hum » | `true` |
| `cutRepetitions` | retire faux départs et redites | `true`, vérifier la prise gardée |

Coût ≈ 1 crédit par minute de source ; la transcription est conservée et resservira (sous-titres en phase B).

## Silence adaptatif

Principe (synthèse §4, méthode ffmpeg standard) : mesurer la sonie de la source, en déduire le seuil de silence, puis détecter les silences à ce seuil. Une source bruitée et une source studio n'ont pas le même seuil. Si le résultat d'`analyze_rushes` coupe des fins de mots, augmenter `keepSilence` plutôt que baisser le seuil à la main.

## Cas difficiles

- **Phrase émotionnelle, chute, rire** : garder le silence qui précède, il fait l'effet.
- **Deux prises du même passage** : garder la plus nette ; en cas de doute, montrer les deux débuts.
- **Musique ou bruit de fond continu** : les silences ne sont pas détectés ; travailler à partir de la transcription (`transcribe_media`) et couper aux fins de phrase.
- **Extrait isolé (short)** : 0,3 s d'air avant et après (Clapova actuel), fin sur une phrase complète.
- **Jump cuts visibles** : les couvrir par un b-roll ou un léger coup de zoom (`clapova:montage-broll`, `clapova:montage-camera-virtuelle`).

## Réencodage

Toujours réencoder un extrait (`trim_media`, `split_media`) : une copie sans réencodage se cale sur l'image clé précédente et décale la coupe (synthèse C16).
