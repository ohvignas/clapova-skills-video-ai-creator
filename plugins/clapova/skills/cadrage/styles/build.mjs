#!/usr/bin/env node
// Planche visuelle du catalogue de styles : une vignette 9:16 par style = image IA (images/<id>.jpg, générée une fois) + overlays du style en code.
// Usage : node build.mjs [--ids reel-motion,kinetic-type,ugc-face-cam] [--out dossier] [--title "..."] [--no-png]
//   --ids    sous-ensemble à montrer (ex. les 3 directions proposées à l'utilisateur), lettres A, B, C ajoutées
//   --out    dossier de sortie (défaut : ce dossier, planche-styles.html/.png ; avec --ids : ./propositions)
// Polices et capture PNG : celles du moteur de storyboard (../../storyboard/planche).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLANCHE = path.join(HERE, '../../storyboard/planche');
const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
const ids = (opt('--ids') || '').split(',').map((s) => s.trim()).filter(Boolean);
const all = JSON.parse(fs.readFileSync(path.join(HERE, 'styles.json'), 'utf8')).styles;
const unknown = ids.filter((i) => !all.some((s) => s.id === i));
if (unknown.length) { console.error('Ids inconnus : ' + unknown.join(', ') + '\nIds : ' + all.map((s) => s.id).join(', ')); process.exit(1); }
const list = ids.length ? ids.map((i) => all.find((s) => s.id === i)) : all;
const out = path.resolve(opt('--out') || (ids.length ? path.join(process.cwd(), 'propositions') : HERE));
fs.mkdirSync(out, { recursive: true });
const name = ids.length ? 'propositions' : 'planche-styles';

// ---------- Vignette : image IA 9:16 (images/<id>.jpg) + overlays du style en code (SVG 270x480) ----------
const W = 270, H = 480;
const T = (x, y, s, txt, o = {}) => `<text x="${x}" y="${y}" font-size="${s}" font-family="${o.f || 'Inter'}" font-weight="${o.w || 800}" fill="${o.c || '#fff'}" text-anchor="${o.a || 'middle'}" ${o.extra || ''}>${txt}</text>`;
const SH = 'stroke="#000" stroke-opacity=".55" stroke-width="4" paint-order="stroke"';
const phoneUI = (c = '#fff') => `<g opacity=".9" fill="${c}"><circle cx="246" cy="300" r="11"/><circle cx="246" cy="340" r="11"/><circle cx="246" cy="380" r="11"/><rect x="16" y="430" width="120" height="7" rx="3"/><rect x="16" y="444" width="80" height="6" rx="3" opacity=".6"/></g>`;
const shadeTop = (o = .55, h = 200) => `<defs><linearGradient id="st${h}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="${o}"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs><rect width="${W}" height="${h}" fill="url(#st${h})"/>`;
const shadeBot = (o = .6, h = 180) => `<defs><linearGradient id="sb${h}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity="${o}"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs><rect y="${H - h}" width="${W}" height="${h}" fill="url(#sb${h})"/>`;
const ART = {
  'ugc-face-cam': () => `${shadeBot(.5, 200)}<rect x="38" y="322" width="194" height="36" rx="8" fill="#fff"/>${T(135, 347, 19, 'ça a tout changé', { c: '#111' })}
   ${T(135, 384, 21, 'en 7 jours', { c: '#ffe14d', extra: 'stroke="#000" stroke-width="5" paint-order="stroke"' })}${phoneUI()}
   <g fill="#fff"><circle cx="20" cy="20" r="5" fill="#ff3b30"/>${T(32, 25, 12, 'REC', { a: 'start', w: 700, extra: SH })}</g>`,
  'reel-motion': () => `${shadeTop(.6, 220)}<g transform="rotate(-6 100 80)"><rect x="18" y="44" width="190" height="56" fill="#fca311"/>${T(113, 86, 38, '-40 %', { c: '#14213d' })}</g>
   ${T(26, 140, 22, 'de déchets', { a: 'start', extra: SH })}<path d="M26 150 Q80 142 140 150" stroke="#fca311" stroke-width="6" fill="none" stroke-linecap="round"/>
   <g transform="translate(56 400)"><circle r="36" fill="#14213d" fill-opacity=".75"/><circle r="30" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="6"/><circle r="30" fill="none" stroke="#fca311" stroke-width="6" stroke-dasharray="140 200" transform="rotate(-90)" stroke-linecap="round"/>${T(0, 7, 19, '4,8')}</g>
   ${T(56, 456, 10, '★ AVIS CLIENTS', { w: 800, c: '#fca311', extra: SH })}<rect x="214" y="22" width="40" height="22" rx="11" fill="#fff"/>${T(234, 38, 12, 'NEW', { c: '#14213d' })}`,
  'kinetic-type': () => `${T(135, 110, 62, 'ARRÊTE', { c: '#111', extra: 'letter-spacing="-3"' })}<rect x="0" y="128" width="${W}" height="84" fill="#111"/>
   ${T(135, 194, 62, 'DE', { c: '#ffde00', extra: 'letter-spacing="-3"' })}
   ${T(135, 268, 48, 'SCROLLER', { c: '#111', extra: 'letter-spacing="-3" transform="rotate(-4 135 250)"' })}
   <rect x="0" y="440" width="${W}" height="40" fill="#111"/>${T(135, 466, 14, '♪ 128 BPM · coupe sur le temps', { c: '#ffde00', w: 700 })}`,
  'hyper-motion': () => `<g stroke="#00e5ff" stroke-width="3" fill="none"><path d="M20 20 h30 M20 20 v30"/><path d="M250 460 h-30 M250 460 v-30"/></g>
   <rect width="${W}" height="${H}" fill="#fff" opacity=".06"/>
   ${T(135, 420, 34, 'SPEED ×4', { c: '#fff', extra: 'font-style="italic" ' + SH })}${T(135, 70, 14, '0,4 s · CRASH ZOOM', { c: '#00e5ff', w: 700, f: 'JetBrains Mono', extra: SH })}`,
  'premium-apple': () => `${T(135, 72, 27, 'Pensée pour durer.', { c: '#1d1d1f', w: 600, extra: 'letter-spacing="-.5"' })}${T(135, 96, 13, 'Acier recyclé. 24 h de froid.', { c: '#4a4a50', w: 500 })}
   <rect x="85" y="434" width="100" height="28" rx="14" fill="#fff" fill-opacity=".85"/>${T(135, 453, 13, 'Découvrir ›', { c: '#0071e3', w: 600 })}`,
  'produit-3d': () => `<path d="M40 420 A110 30 0 0 0 230 420" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="6 6"/><path d="M222 412 l12 9 -14 5" fill="#fff"/>
   <rect x="52" y="30" width="166" height="26" rx="13" fill="#000" fill-opacity=".35"/>${T(135, 48, 12, 'ORBIT 360° · RENDU 3D', { c: '#fff', w: 700, f: 'JetBrains Mono' })}`,
  'unboxing-asmr': () => `${shadeTop(.45, 140)}${T(135, 70, 36, 'crrr… clac', { c: '#fff', w: 700, f: 'Caveat', extra: SH })}
   <rect x="40" y="436" width="190" height="26" rx="13" fill="#000" fill-opacity=".45"/>${T(135, 454, 11, 'MACRO · MAINS · SON NET', { c: '#fff', w: 700, f: 'JetBrains Mono' })}`,
  'avant-apres': () => `<rect width="135" height="${H}" fill="#3a3f4a" opacity=".35"/><rect x="133" width="4" height="${H}" fill="#fff"/><circle cx="135" cy="300" r="18" fill="#fff"/><path d="M127 300 l-6 0 M143 300 l6 0 M121 300 l5 -5 M121 300 l5 5 M149 300 l-5 -5 M149 300 l-5 5" stroke="#111" stroke-width="3" stroke-linecap="round"/>
   <rect x="22" y="32" width="92" height="32" rx="6" fill="#111" fill-opacity=".75"/>${T(68, 56, 20, 'AVANT')}<rect x="156" y="32" width="92" height="32" rx="6" fill="#7fd1ae"/>${T(202, 56, 20, 'APRÈS', { c: '#0d3b2a' })}
   ${T(135, 440, 18, 'Jour 1 → Jour 30', { c: '#fff', extra: 'stroke="#000" stroke-width="4" paint-order="stroke"' })}`,
  'listicle': () => `${shadeTop(.7, 260)}${T(135, 62, 28, '3 erreurs')}${T(135, 88, 15, 'qui ruinent ta gourde', { c: '#d0d5dd', w: 600 })}
   ${[0, 1, 2].map((i) => `<g transform="translate(24 ${112 + i * 62})"><rect width="222" height="52" rx="12" fill="${i === 1 ? '#ef4444' : '#101828'}" fill-opacity="${i === 1 ? 1 : .82}"/><text x="14" y="41" font-family="Inter" font-weight="800" font-size="36" fill="${i === 1 ? '#fff' : '#ef4444'}">${i + 1}</text><rect x="52" y="18" width="${[120, 100, 130][i]}" height="9" rx="4" fill="#fff" opacity=".9"/><rect x="52" y="33" width="${[80, 120, 70][i]}" height="7" rx="3" fill="#fff" opacity=".45"/></g>`).join('')}
   ${T(135, 452, 14, 'la 2e coûte cher ↓', { c: '#fda29b', w: 800, extra: SH })}`,
  'demo-app': () => `<circle cx="150" cy="330" r="30" fill="none" stroke="#f97316" stroke-width="4"/><path d="M166 338 l0 26 7 -7 6 12 6 -3 -6 -12 10 -1z" fill="#111" stroke="#fff" stroke-width="2"/>
   <rect x="16" y="20" width="150" height="30" rx="15" fill="#111"/>${T(91, 40, 13, '1 clic, c\'est réglé', { c: '#fff', w: 700 })}`,
  'faceless-explainer': () => `<rect x="30" y="40" width="210" height="76" rx="14" fill="#fdf6ec" fill-opacity=".92"/>${T(135, 72, 23, 'Comment ça', { c: '#073b4c' })}${T(135, 100, 23, 'marche ?', { c: '#073b4c' })}
   <rect x="54" y="400" width="162" height="62" rx="14" fill="#073b4c" fill-opacity=".85"/><g transform="translate(72 422)">${[6, 16, 26, 12, 22, 30, 14, 24, 8, 18, 28, 10, 20].map((h, i) => `<rect x="${i * 10}" y="${-h / 2}" width="6" height="${h}" rx="3" fill="#ffd166"/>`).join('')}</g>${T(135, 454, 11, 'VOIX OFF', { c: '#fff', w: 700, f: 'JetBrains Mono' })}`,
  'pov-green-screen': () => `<rect x="16" y="16" width="238" height="36" rx="8" fill="#fff"/>${T(135, 40, 15, 'POV : tu découvres le prix', { c: '#111', w: 700 })}${phoneUI()}`,
};
const IMG = (id) => { const p = path.join(HERE, 'images', id + '.jpg'); return fs.existsSync(p) ? `<image href="data:image/jpeg;base64,${fs.readFileSync(p).toString('base64')}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>` : `<rect width="${W}" height="${H}" fill="#ccc"/>`; };

const NIVEAU = { code: ['#16a34a', '0 crédit'], rushes: ['#2563eb', 'rushes'], mixte: ['#d97706', 'mixte'], ia: ['#9333ea', 'crédits IA'] };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const cards = list.map((s, i) => {
  const [col, lab] = NIVEAU[s.coutNiveau] || ['#666', s.coutNiveau];
  const letter = ids.length ? `<div class="letter">${String.fromCharCode(65 + i)}</div>` : '';
  return `<div class="card">${letter}<div class="frame"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${IMG(s.id)}${ART[s.id] ? ART[s.id]() : ''}</svg></div>
  <div class="meta"><div class="nom">${esc(s.nom)}</div><div class="id">${esc(s.id)}</div>
  <div class="mots">${s.mots.map((m) => `<span>${esc(m)}</span>`).join('')}</div>
  <div class="foot"><b style="background:${col}">${lab}</b><em>plan ${esc(s.plan)}</em></div>
  <div class="cout">${esc(s.cout)}${s.template && s.template !== '—' ? ` · modèle <code>${esc(s.template)}</code>` : ''}</div></div></div>`;
}).join('\n');

const fonts = fs.readFileSync(path.join(PLANCHE, 'lib/fonts.css'), 'utf8').replace(/url\(\.\.\/fonts\/([^)]+)\)/g, (_, f) => `url(data:font/woff2;base64,${fs.readFileSync(path.join(PLANCHE, 'fonts', f)).toString('base64')})`);
const cols = Math.min(list.length, ids.length ? 3 : 4);
const title = opt('--title') || (ids.length ? 'Trois directions possibles' : 'Catalogue de styles');
const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><style>${fonts}
:root{--bg:#f4f1ea;--ink:#1a1a1a;--mute:#6b6b6b;--card:#fff}
body{margin:0;background:var(--bg);font-family:Inter,sans-serif;color:var(--ink)}
.sheet{display:inline-block;padding:36px 40px 40px;background:var(--bg)}
h1{margin:0;font-size:30px;letter-spacing:-.5px}.sub{color:var(--mute);margin:6px 0 26px;font-size:14px}
.grid{display:grid;grid-template-columns:repeat(${cols},300px);gap:26px}
.card{position:relative;background:var(--card);border-radius:18px;padding:15px;box-shadow:0 2px 0 rgba(0,0,0,.05),0 10px 24px rgba(0,0,0,.07)}
.frame{border-radius:12px;overflow:hidden;line-height:0;outline:1px solid rgba(0,0,0,.08)}
.letter{position:absolute;top:-12px;left:-12px;width:42px;height:42px;border-radius:50%;background:#e4572e;color:#fff;font:800 22px Inter;display:flex;align-items:center;justify-content:center;z-index:2;box-shadow:0 4px 10px rgba(0,0,0,.2)}
.meta{padding:12px 2px 0}.nom{font-weight:800;font-size:18px}.id{font:500 11px 'JetBrains Mono';color:var(--mute);margin-top:2px}
.mots{display:flex;flex-wrap:wrap;gap:5px;margin:10px 0}.mots span{font-size:11.5px;font-weight:600;background:#f0ede6;border-radius:20px;padding:3px 9px}
.foot{display:flex;align-items:center;gap:8px;font-size:12px}.foot b{color:#fff;border-radius:5px;padding:2px 7px;font-size:11px}.foot em{color:var(--mute);font-style:normal}
.cout{font-size:11.5px;color:var(--mute);margin-top:6px}code{font:500 10.5px 'JetBrains Mono';color:var(--ink)}
.leg{margin-top:24px;font-size:12px;color:var(--mute)}
</style></head><body><div class="sheet"><h1>${esc(title)}</h1><div class="sub">Clapova · vignettes : image IA + overlays code · ${list.length} style${list.length > 1 ? 's' : ''} · détails : STYLES.md</div>
<div class="grid">${cards}</div><div class="leg">Coût de fabrication : <b style="color:#16a34a">0 crédit</b> tout en code · <b style="color:#2563eb">rushes</b> vidéos de l'utilisateur · <b style="color:#d97706">mixte</b> · <b style="color:#9333ea">crédits IA</b> génération</div></div>
<script>document.fonts.ready.then(()=>document.body.dataset.ready=1)</script></body></html>`;
const htmlPath = path.join(out, name + '.html');
fs.writeFileSync(htmlPath, html);
console.log('html :', htmlPath);
if (!argv.includes('--no-png')) {
  const { capture } = await import(path.join(PLANCHE, 'render.mjs'));
  const r = await capture(htmlPath, path.join(out, name + '.png'), { width: 1500, scale: 1.5 });
  console.log(r.ok ? 'png : ' + r.path : 'PNG non produit : ' + r.reason);
}
