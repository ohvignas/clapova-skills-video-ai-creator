# Catégories de repères sonores

Sources : synthèse §3.10 et C3 ; banque CC0 de Barty-Bart/motion-graphics mesurée (rapport-skills-motion §11.1). Valeurs Barty = tiers.

| Événement à l'image | Son | Placement | Niveau (Barty, tiers) |
|---|---|---|---|
| Mouvement, changement de scène | whoosh | départ avancé de son temps de montée | −4 dB |
| Apparition, clic, survol | pop / click | pic sur l'image (0 / +1) | −6 dB |
| Frappe au clavier | typing en boucle | fondu 50 ms | −8 dB |
| Montée vers un temps fort | riser | **finit** sur le coup suivant | −6 dB |
| Temps fort principal | impact | pic sur l'image ; 2 fois max par film | le plus fort du film |
| Compteur | tick | 3 ticks par compteur (serveur) | bas |

## Banque CC0 de Barty
- 109 fichiers OGG : 53 Kenney, 50 Freesound, 6 du kit par défaut (whoosh, click, pop, riser, impact, tick).
- 66 fichiers sur 109 dépassent −1 dBTP : réencoder chacun à **≤ −3 dBTP** (proposé, à confirmer), vérifié par `ebur128=peak=true`.
- À écarter ou renormaliser : `pop/kenney-interface-maximize-002.ogg` (+10,7 dBTP), `transition/kenney-interface-scroll-001.ogg` (+1,1).
- Sons < 0,4 s : classer par crête et RMS, pas par LUFS (fenêtre EBU R128).
- Import dans `place_sfx_from_events` : quand disponible (S7).
