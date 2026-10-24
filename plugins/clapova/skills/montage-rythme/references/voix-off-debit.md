# Débit de la voix off et durée des scènes

Lire dès qu'il y a un script ou une voix off (témoin ou finale).

## Valeurs

| Mesure | Valeur |
|---|---|
| Débit standard | 2,3 mots/s (140 mots/min) |
| Débit technique (explication, chiffres) | 2,0 mots/s |
| Hors plage | sous 110 ou au-dessus de 170 mots/min |
| Durée d'une scène depuis le script | mots ÷ 2,3 + 0,4 s |
| Recalage sur la voix réelle | durée mesurée de la phrase + 1 s de marge |
| Correction de débit | `atempo` ≥ 0,85, jamais en dessous |

Les chiffres comptent comme des mots (« 1 284 » se dit en plusieurs mots : compter les mots prononcés).

## Méthode

1. **Avant la voix** : pour chaque scène, mots du script ÷ 2,3 (÷ 2,0 en technique) + 0,4 s → durée provisoire. Total comparé à la durée de la fiche ; trop long = couper du texte, jamais accélérer.
2. **Après la voix** : `list_media` (durée) ou `transcribe_media` (horodatage des mots) → débit réel = mots ÷ durée × 60.
3. Débit hors plage : le signaler ; proposer de réécrire ou de regénérer la phrase (`generate_voiceover_lines`, coût annoncé) plutôt que de corriger au-delà de `atempo` 0,85.
4. **Recaler** : chaque scène prend la durée de sa phrase + 1 s de marge, puis les coupes se reposent sur la grille (`references/bpm.md`) si la musique le permet.

En phase A, la voix est souvent témoin : on cale le rythme dessus, la voix finale arrive en phase B (`clapova:finition`) et on recale alors.

Sources : débit et formule de durée d'après iart-ai/motion-skills (MIT © 2026 iart.ai) et digitalsamba/claude-code-video-toolkit (MIT © 2024 Digital Samba, `sync_timing`), reformulés.
