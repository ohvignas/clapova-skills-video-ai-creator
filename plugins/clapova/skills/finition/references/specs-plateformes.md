# Export par plateforme

Le format du projet est fixé à `create_project` ; un autre format = un autre projet (`clapova:declinaison-formats`).

| Cible | Format | `preset` | Résolution / i/s | Durée par défaut | Zone vitale (1080×1920) |
|---|---|---|---|---|---|
| TikTok | 9:16 | `tiktok` (1080p max) | 1080p, 30 i/s | 6–15 s (C5) | x 120–900, y 270–1248 |
| Reels | 9:16 | `reels` (1080p 30 i/s max) | 1080p, 30 i/s | 6–15 s | idem |
| Shorts | 9:16 | `shorts` | 1080p, 30 i/s | 6–15 s | idem |
| Pinterest | 9:16 | `standard` | 1080p | 6–15 s (Pinterest, officiel) | x 65–885, y 270–1130 |
| YouTube | 16:9 | `youtube` | 1080p à 2160p, 24–60 i/s | selon le contenu | — |
| LinkedIn | 1:1 ou 4:5 | `standard` | 1080p | selon le contenu | — |

Options d'`export_video` : `resolution` `720p` | `1080p` (défaut) | `1440p` | `2160p` ; `fps` 24 | 25 | 30 (défaut) | 60. 1440p, 4K et 60 i/s relèvent des plans payants ; 60 i/s double le prix.

Son : le rendu est normalisé à −14 LUFS / −1,5 dBTP ; on le **mesure** quand même sur le fichier exporté (`clapova:son-design`).

Fichier pro pour un monteur : `export_project_file({projectId, format:"aep_jsx"|"premiere_xml"|"fcpxml"})` (gratuit).

Zones TikTok et YouTube en pixels : non vérifiées sur les gabarits officiels (synthèse §8) ; le profil vertical est le plus prudent connu.
