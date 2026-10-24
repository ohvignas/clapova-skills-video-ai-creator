# Traitements A / B / C

Règles : `SKILL.md`. Ici, le choix et le gabarit du plan.

## Choisir le traitement

| La phrase… | Traitement | Pourquoi |
|---|---|---|
| est personnelle, émotionnelle, une confession | **A** orateur seul | le visage porte le sens |
| cite un objet, un écran, un lieu, que l'on peut montrer à côté du visage | **B** incrustation | on garde le regard et on illustre |
| décrit quelque chose qui demande tout le cadre (démo, schéma, comparaison) | **C** cache plein cadre, 3 à 10 s | lisibilité |
| est l'accroche (première seconde) | **A** ou **B** | jamais de C |

Après un C : revenir à A ou B pendant au moins environ 2 s.

## Densité

| Choix | B-rolls par minute |
|---|---|
| Légère | 2–4 |
| Moyenne | 4–7 |

## Gabarit du plan (à valider avant toute pose)

```
| # | t début | mot ancre | traitement | contenu | source | coût |
|---|---------|-----------|------------|---------|--------|------|
| 1 | 0,0     | —         | A          | orateur | rush   | 0    |
| 2 | 4,2     | « appli » | B          | capture de l'écran d'accueil | média utilisateur | 0 |
| 3 | 9,8     | « trois étapes » | C (5 s) | schéma 3 étapes | create_motion_scene | … |
| … | fin     | —         | A          | orateur | rush   | 0    |
```

Colonne « illustratif » à ajouter si un contenu n'est pas un fait de l'utilisateur.

## Minutage sur le mot

- Structure (cadre, axes, cartes) : 6 images d'avance sur le mot.
- Fait (chiffre, nom, prix) : sur son mot.
- Chute : attend le mot qui la révèle.
- Un changement d'état par temps parlé, espacés de 0,4 à 1,2 s.
- Changements importants sur le premier ou le dernier mot d'une réplique (les temps des sous-titres dérivent).

## Sources de b-roll

1. Médias de l'utilisateur (`list_media`), puis bibliothèque (`list_library`).
2. Scène motion construite (`create_motion_scene`) pour schéma, interface, comparaison ; interface : `clapova:motion-scene-ui` ; schéma : `clapova:motion-carte-diagramme`.
3. Génération (`generate_broll`, `dryRun:true` d'abord), un mouvement de caméra par plan (`clapova:montage-camera-virtuelle`).
