---
name: revision-retours
description: Use when a Clapova user or client gives feedback on an existing edit — « j'aime pas trop », « fais que ça pète », « change la musique », « le texte à 0:12 », retour client, liste de corrections, nouvelle version. One feedback = one targeted fix, versioned, without overwriting what the user changed. Not for the first quality check (clapova:controle-qualite) nor a new video (clapova:montage).
---

# Clapova : traiter les retours

Une idée : **un retour = une correction ciblée**, tranchée avec l'utilisateur, appliquée sans toucher au reste, dans une nouvelle version.

## Boucle

1. **Relire l'état réel** : `get_timeline({projectId})` avant tout. L'utilisateur a pu modifier la timeline depuis le dernier passage : ses changements font foi (signalement automatique et `lockedDecisions` : **quand disponibles**, S19). Note ce qui a bougé.
2. **Découper le retour** en lignes numérotées R1, R2… : une ligne = un endroit + un problème. Exemple : « R1 · t=0:12 · titre trop petit ».
3. **Localiser** : chaque ligne a un instant ou un clip. Sans horodatage, demande-le (« à quel moment ? ») ou propose 2 instants candidats avec `render_preview_frames({projectId, times})`.
4. **Traduire un retour vague** en 2 ou 3 choix mesurables (`references/traducteur.md`), et attendre le choix. Ne corrige que ce qui a été tranché.
5. **Versionner** : avant un changement large, `duplicate_project` (la version précédente reste intacte) ; sinon un seul `apply_edit_plan` par tour, dont le `snapshotId` permet d'annuler. Nomme la version `vNN` (v01, v02…) et garde le journal (`references/journal.md`).
6. **Appliquer** : un `apply_edit_plan` qui ne contient que les ops des lignes tranchées (`move_clip`, `trim_clip`, `replace_media`, `set_volume`…), jamais une reconstruction du montage.
7. **Contrôler ce qui a changé** : `check_composition`, puis `render_preview_frames` sur chaque instant touché, avant et après (`clapova:controle-qualite`, un tour suffit si aucun P0).
8. **Répondre ligne à ligne** : R1 fait / R2 choix B appliqué / R3 en attente de réponse, avec le lien du projet.

## Règles

- Un retour ne déclenche jamais de génération payante sans accord : annonce le coût (`get_credits`, `estimate_plan`) avant.
- Ne pas « en profiter » pour changer autre chose. Un défaut vu en passant se signale, il ne se corrige pas sans accord.
- Ce que l'utilisateur a fait à la main (texte réécrit, clip déplacé, volume) n'est jamais écrasé : ni `replace:true` sur des sous-titres retouchés, ni `apply_template` sur un projet monté, ni `delete_clip` sur ses ajouts.
- Retour contradictoire avec une décision validée (style, durée, musique) : rappelle la décision et demande laquelle garder.
- Retour client relayé : garde les mots du client dans le journal, sans les reformuler.
- Au plus 3 tours de retours sur une même ligne (proposé, aligné sur les 3 tours de C10) ; au-delà, propose une version alternative au lieu de retoucher encore.

## Interdits

- Corriger sans savoir où (« j'ai amélioré l'ensemble »).
- Repartir de zéro, ou relancer un build sur un projet que l'utilisateur a retouché.
- Supprimer la version précédente ; perdre le `snapshotId`.
- Dire « c'est corrigé » sans image de l'instant après correction.

## Contrôle

- [ ] Chaque ligne R a un instant, un choix tranché et un statut.
- [ ] `get_timeline` relu avant d'éditer ; changements de l'utilisateur intacts.
- [ ] Une image avant / après par ligne corrigée.
- [ ] Version notée (vNN) et journal mis à jour.

## Renvois

Contrôle : `clapova:controle-qualite`. Rythme, coupes : `clapova:montage-rythme`. Son : `clapova:son-design`. Titres : `clapova:motion-titres`. Style : `clapova:motion-direction-artistique`. Version finale et export : `clapova:finition`.

## Sources

Traduction d'un retour vague en choix précis : idée du glossaire inverse `animation-vocabulary` (emilkowalski/skills, MIT) et du `HANDOFF.md` de JakeB-5 (MIT), reformulés.
