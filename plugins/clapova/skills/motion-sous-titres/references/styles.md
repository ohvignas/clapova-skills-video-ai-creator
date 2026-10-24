# Looks de `add_captions`

| Look | Pour | Réglage de départ |
|---|---|---|
| `pop` | TikTok, Reels, énergie | 2–3 mots par page, mot actif surligné, `uppercase:true` |
| `karaoke` | chanté, tutoriel, rythme marqué | mot actif coloré |
| `boite` | texte sur fond chargé | mot actif sur pastille |
| `rebond` | humour | mots qui tombent, sans exagérer |
| `halo` | tech | lueur discrète, un seul ton (le glow est BANNED ailleurs : seulement si la marque le demande) |
| `propre` | LinkedIn, YouTube, corporate | 3–5 mots par page, bas d'écran au-dessus de la zone réservée |

Exemples :
- TikTok 9:16 : `add_captions({projectId, look:"pop", maxWordsPerPage:3, keywords:["12 h","Nova"], highlight:"#FFD400", uppercase:true, language:"fr", until:12.5, replace:false})`.
- LinkedIn 1:1 ou 16:9 : `add_captions({projectId, look:"propre", maxWordsPerPage:5, position:"bas", emoji:false, language:"fr"})`.

Pièges :
- Voix faible ou musique forte : transcription fausse. Baisse la musique (`clapova:son-design`) avant de relancer.
- Langue non forcée : un modèle anglais peut traduire au lieu de transcrire.
- Projet 9:16 : ne pousse pas `position:"bas"` sauf demande ; la zone sûre est appliquée par l'outil.
