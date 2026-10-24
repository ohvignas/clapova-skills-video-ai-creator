# Routeur : intention → skill

Lire quand la demande ne tombe pas dans la table courte de `SKILL.md`, ou combine plusieurs intentions. Plusieurs intentions : ordre conseillé = direction → rythme → accroche → titres/compteurs/logo → transitions → caméra → son → contrôle.

| Intention (mots de l'utilisateur) | Skill | Ne pas utiliser si… |
|---|---|---|
| « fais-moi une vidéo », « une pub », pas de fiche | `clapova:cadrage` | la fiche est déjà validée |
| plusieurs plans à fabriquer | `clapova:storyboard` | on monte des rushes existants sans génération |
| « refais comme cette vidéo » | `clapova:recreer-depuis-reference` | la référence est déjà lue dans la fiche |
| « regarde cette vidéo », analyser | `clapova:toolbox-createur` | — |
| « quel style », « fais premium », « dans l'esprit de… » | `clapova:motion-direction-artistique` | le style est fixé dans la fiche |
| durée, courbe, ressort d'une animation | `clapova:motion-tokens` | — |
| « début plus fort », « hook », marque en ouverture | `clapova:montage-accroche` | on veut tester plusieurs accroches : `clapova:test-accroches` |
| « plus rythmé », « sur la musique », « trop lent », débit de voix off | `clapova:montage-rythme` | — |
| « transition », « raccord », « enchaînement » | `clapova:montage-transitions` | — |
| « zoom », « Ken Burns », « mouvement de caméra » | `clapova:montage-camera-virtuelle` | mouvement à générer dans le clip : `clapova:prompts-video` |
| « nettoie », « enlève les blancs », rush long | `clapova:montage-derush` | — |
| « ajoute du b-roll », « illustre ce que je dis » | `clapova:montage-broll` | — |
| « boucle », « loop » | `clapova:montage-boucle` | — |
| « promo », « diaporama », « conversation SMS », « Wrapped » | `clapova:montage-recettes` | — |
| « titre animé », « texte qui claque » | `clapova:motion-titres` | sous-titres : phase B |
| « compteur », « chiffre clé », « graphique » | `clapova:motion-compteurs-data` | — |
| « carte », « schéma », « comment ça marche » | `clapova:motion-carte-diagramme` | — |
| « logo animé », « fin avec CTA » | `clapova:motion-logo-cta` | — |
| « démo de mon app », « mockup animé » | `clapova:motion-scene-ui` | — |
| « détoure », « texte derrière moi » | `clapova:detourage-sujet` | — |
| « pub de mon produit », « le logo se déforme » | `clapova:produit-coherent` | — |
| « bruitages », « musique », « le son fait cheap » | `clapova:son-design` | — |
| « couleurs », « look ciné », « harmonise » | `clapova:etalonnage` | — |
| « vérifie », « c'est bon ? » | `clapova:controle-qualite` | — |
| « fais que ça pète », « j'aime pas trop » | `clapova:revision-retours` | le retour est déjà précis |
| « ajoute des sous-titres » (phase B) | `clapova:motion-sous-titres` | jamais sans demande |
| « exporte », « version finale », « livre » (phase B) | `clapova:finition` | phase A non validée |
| autres formats du même montage | `clapova:declinaison-formats` | format principal non validé |
