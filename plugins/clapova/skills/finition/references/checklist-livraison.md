# Checklist de livraison

1. **Fichier** : `get_media_info` sur le rendu : largeur × hauteur attendues, i/s, durée = durée du projet ±0,5 s, piste audio présente.
2. **Son** : I = −14 LUFS ±1, true peak ≤ −1,5 dBTP, mesurés sur l'export (stéréo, plus un contrôle mono) (proposé, synthèse §3.10).
3. **Images** : première image pleine et forte ; dernière image propre (carte CTA tenue) ; aucune image noire.
4. **Textes** : noms propres, prix, URL, mentions légales relus contre la source ; CTA fourni par l'utilisateur ou son site, jamais inventé.
5. **Nommage** : `client_projet_livrable_ratio_durée_vNN_date`.
6. **Crédits** : `CREDITS.txt` avec chaque son (source, licence, auteur si CC BY), chaque police (licence OFL), chaque média tiers. Mixkit jamais embarqué ; NC interdit.
7. **Lien** : `videoUrl` (direct) et `studioUrl`, une seule fois en bas, avec durée, format, crédits dépensés. Ne jamais dire qu'une publication est en ligne.

Exemple de `CREDITS.txt` :

```
Projet : nova_isotherme_pub_9x16_15s_v03_2026-10-24
Musique : générée dans Clapova (generate_music)
SFX : kenney-interface-click-003.ogg · Kenney · CC0
Police : Geist · OFL (OFL-Geist.txt)
```
