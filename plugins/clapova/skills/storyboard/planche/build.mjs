#!/usr/bin/env node
// Planche de storyboard en croquis (100 % code, 0 crédit) depuis storyboard.json.
// Usage : node build.mjs storyboard.json [--out dossier] [--shots 2,3] [--changed 3] [--animatic] [--no-png]
//   --out       dossier de sortie (défaut : ./planche-rendu à côté du JSON)
//   --shots     n'affiche que ces plans (planche partielle, pour montrer une modification)
//   --changed   marque ces plans « modifié » sur la planche complète
//   --animatic  écrit aussi animatic/index.html (composition GSAP seekable, contrat HyperFrames)
//   --no-png    n'essaie pas la capture PNG
// Aucune dépendance npm obligatoire. Playwright est détecté (voir render.mjs) : sans lui, seul le HTML est produit.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { capture } from './render.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
const flag = (k) => argv.includes(k);
const input = argv.find((a, i) => !a.startsWith('--') && !['--out', '--shots', '--changed'].includes(argv[i - 1]));
if (!input) { console.error('Usage : node build.mjs storyboard.json [--out dossier] [--shots 2,3] [--changed 3] [--animatic] [--no-png]'); process.exit(1); }
const list = (v) => (v ? v.split(',').map((x) => x.trim()).filter(Boolean) : []);
const out = path.resolve(opt('--out') || path.join(path.dirname(path.resolve(input)), 'planche-rendu'));
fs.mkdirSync(out, { recursive: true });

const sb = JSON.parse(fs.readFileSync(path.resolve(input), 'utf8'));
const LIBS = ['sketch.js', 'scenes.js', 'generique.js', 'board.js'];
const SCENE_NAMES = ['cafe-froid', 'main-sac', 'ouverture-vapeur', 'compteur', 'packshot', 'generique'];
const CAMS = ['static', 'push-in', 'pull-out', 'track', 'pan', 'tilt', 'orbit', 'handheld'];

// ---- Normalisation : durées en cascade, valeurs par défaut, contrôles métier ----
const RATIOS = { '9:16': [1080, 1920], '16:9': [1920, 1080], '1:1': [1080, 1080], '4:5': [1080, 1350] };
if (typeof sb.format === 'string') sb.format = { ratio: sb.format };
sb.format = { ratio: '9:16', fps: 30, ...(sb.format || {}) };
[sb.format.width, sb.format.height] = [sb.format.width || RATIOS[sb.format.ratio]?.[0] || 1080, sb.format.height || RATIOS[sb.format.ratio]?.[1] || 1920];
const changed = list(opt('--changed'));
let cursor = 0;
const warnings = [];
sb.shots = (sb.shots || []).map((s, i) => {
  const sh = { ...s };
  sh.id = sh.id ?? i + 1;
  const dur = sh.duration ?? (sh.end != null && sh.start != null ? sh.end - sh.start : 2.5);
  sh.start = cursor; sh.end = cursor + dur; cursor = sh.end;
  sh.title = sh.title || `Plan ${sh.id}`;
  sh.tag = sh.tag || (['compteur', 'packshot'].includes(sh.scene) ? 'Motion' : 'Croquis');
  sh.camera = typeof sh.camera === 'string' ? { type: sh.camera } : { type: 'static', ...(sh.camera || {}) };
  sh.camera.type = ({ push_in: 'push-in', pull_out: 'pull-out', tracking: 'track' })[sh.camera.type] || sh.camera.type;
  if (!CAMS.includes(sh.camera.type)) { warnings.push(`Plan ${sh.id} : caméra « ${sh.camera.type} » inconnue, dessinée fixe`); sh.camera.type = 'static'; }
  if (typeof sh.text === 'string') sh.text = { value: sh.text };
  if (typeof sh.voice === 'string') sh.voice = { value: sh.voice };
  if (!SCENE_NAMES.includes(sh.scene)) { if (sh.scene) warnings.push(`Plan ${sh.id} : scène « ${sh.scene} » absente, repli sur « generique »`); sh.scene = 'generique'; }
  sh.panels = sh.panels || 3;
  sh.changed = changed.includes(String(sh.id));
  const w = [];
  if (dur > 5) w.push(`${dur} s : plus de 5 s (plafond d'un clip généré)`);
  if (sh.voice?.value) { const n = sh.voice.value.trim().split(/\s+/).length, max = Math.floor(2.3 * dur); if (n > max) w.push(`voix : ${n} mots pour ${max} max`); }
  if (sh.text?.value && sh.text.value.trim().split(/\s+/).length > 6) w.push('texte à l\'écran : plus de 6 mots');
  if (w.length) sh.warnings = w;
  return sh;
});
sb.duration = Math.round(cursor * 100) / 100;
const short = sb.duration < 60, avg = sb.duration / Math.max(1, sb.shots.length);
if (short && avg > 3.5) warnings.push(`Plan moyen ${avg.toFixed(1).replace('.', ',')} s (3,5 s max en format court)`);
const first = sb.shots.find((s) => s.text?.value || s.voice?.value);
if (first && first.start + (first.text?.from ?? first.voice?.from ?? 0) * (first.end - first.start) >= 3) warnings.push('Promesse (premier texte ou voix) après 3 s');
sb.warnings = warnings;

// ---- Planche HTML autonome (JS et polices embarqués : s'ouvre seule, se publie telle quelle) ----
const read = (p) => fs.readFileSync(path.join(HERE, p), 'utf8');
const fontsCss = read('lib/fonts.css').replace(/url\(\.\.\/fonts\/([^)]+)\)/g, (_, f) => `url(data:font/woff2;base64,${fs.readFileSync(path.join(HERE, 'fonts', f)).toString('base64')})`);
const json = JSON.stringify(sb).replace(/</g, '\\u003c');
const only = list(opt('--shots'));
const css = read('lib/board.css');
const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${(sb.title || 'Storyboard').replace(/</g, '&lt;')}</title><style>${fontsCss}\n${css}</style></head>
<body><div class="sheet" id="sheet"></div>
${LIBS.map((l) => `<script>${read('lib/' + l)}</script>`).join('\n')}
<script>const SB=${json};const ONLY=${JSON.stringify(only)};document.fonts.ready.then(()=>{Board.renderBoard(SB,document.getElementById('sheet'),ONLY);document.body.dataset.ready=1});</script></body></html>`;
const htmlPath = path.join(out, 'planche.html');
fs.writeFileSync(htmlPath, html);
console.log('planche.html :', htmlPath);
for (const w of warnings) console.log('⚠', w);
for (const s of sb.shots) for (const w of s.warnings || []) console.log(`⚠ plan ${s.id} :`, w);

// ---- Animatic optionnel : composition seekable (GSAP en pause, window.__timelines / window.render) ----
if (flag('--animatic')) {
  const W = sb.format.width, H = sb.format.height, ad = path.join(out, 'animatic');
  fs.mkdirSync(path.join(ad, 'lib'), { recursive: true }); fs.mkdirSync(path.join(ad, 'fonts'), { recursive: true });
  for (const l of [...LIBS, 'gsap.min.js']) fs.copyFileSync(path.join(HERE, 'lib', l), path.join(ad, 'lib', l));
  for (const f of fs.readdirSync(path.join(HERE, 'fonts'))) fs.copyFileSync(path.join(HERE, 'fonts', f), path.join(ad, 'fonts', f));
  const ff = read('lib/fonts.css').replaceAll('../fonts/', 'fonts/');
  fs.writeFileSync(path.join(ad, 'index.html'), `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=${W}, height=${H}">
<title>Animatic</title><script src="lib/gsap.min.js"></script>
<style>${ff}
html,body{margin:0;background:#000;width:${W}px;height:${H}px}#root{position:relative;width:100%;height:100%;overflow:hidden;font-family:Inter}
#stage{position:absolute;inset:0}#stage>svg{position:absolute;inset:0;width:100%;height:100%}
.sup{position:absolute;left:7%;right:7%;top:15%;text-align:center;color:#fff;font:800 84px/1.1 Inter;letter-spacing:-.02em;background:rgba(29,28,26,.9);border-radius:22px;padding:30px 20px}
.vo{position:absolute;left:6%;right:6%;bottom:13%;text-align:center;font:italic 700 60px Inter;color:#fff;text-shadow:0 3px 18px rgba(0,0,0,.85)}
.fade{position:absolute;inset:0;background:#0f1b36}
.tc{position:absolute;right:28px;bottom:26px;font:500 26px 'JetBrains Mono';color:#fff;background:rgba(0,0,0,.38);padding:6px 12px;border-radius:8px;opacity:.75}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-width="${W}" data-height="${H}" data-duration="${sb.duration}">
<div id="stage" class="clip" data-start="0" data-duration="${sb.duration}" data-track-index="0"></div></div>
${LIBS.map((l) => `<script src="lib/${l}"></script>`).join('')}
<script>
const SB=${json};const stage=document.getElementById('stage');const st={T:0};
const draw=()=>Board.renderFrame(SB,Math.min(st.T,SB.duration-1e-3),stage);draw();
const tl=gsap.timeline({paused:true,onUpdate:draw});
tl.to(st,{T:SB.duration,duration:SB.duration,ease:'none'},0);
const _seek=tl.seek.bind(tl);tl.seek=(...a)=>{const r=_seek(...a);draw();return r;};
window.__timelines=window.__timelines||{};window.__timelines["main"]=tl;
window.render=(T)=>{st.T=T;draw();};
</script></body></html>`);
  console.log('animatic :', path.join(ad, 'index.html'));
}

// ---- PNG (si Playwright + Chromium sont disponibles) ----
if (!flag('--no-png')) {
  const r = await capture(htmlPath, path.join(out, 'planche.png'));
  console.log(r.ok ? `planche.png : ${r.path}` : `PNG non produit (${r.reason}) : ouvre ou publie planche.html.`);
}
