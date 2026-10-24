# Mixage et mesure

Sources : synthèse §3.10, C4, C8 ; rapport-outils-controle (mesures testées).

## Cibles (proposé, à confirmer)
- −14 LUFS intégrés ±1 ; true peak ≤ −1,5 dBTP ; stéréo + contrôle mono.
- Musique 15 à 18 LU sous la voix (court terme) ; gain de départ 0,18 ; plancher 0,15.
- Seuils de l'outil de contrôle : LUFS ±1 ok, ±2 avertissement ; true peak ≤ −1 ok, −1 à 0 avertissement, > 0 échec.

## Ducking
- Serveur : `set_duck`. Référence HyperFrames : duck 0,25, attaque 0,15 s, relâche 0,4 s.
- Équivalent ffmpeg testé : `sidechaincompress=threshold=0.05:ratio=8:attack=20:release=300`.
- Contrôle : sonie court terme de la musique seule pendant et hors voix.

## Mesure
- `ffmpeg -nostats -i export.mp4 -af ebur128=peak=true -f null -` sur le **fichier exporté**.
- Piège : pyloudnorm en mono 22 kHz donne −17,4 au lieu de −14,1 ; mesurer en stéréo 48 kHz.
- Côté MCP sans shell : `measure_audio` ou contrôle après export, quand disponibles.

## 5 instants à écouter
Ordre de risque (Barty, tiers) : plus gros écart de temps, typing, riser, révélation, changement de scène. Format : `t=12,4 s · riser → impact · vérifier qu'il finit sur le coup`.
