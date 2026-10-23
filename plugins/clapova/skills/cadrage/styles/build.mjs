#!/usr/bin/env node
// Planche visuelle du catalogue de styles (100 % code, 0 crédit) : une vignette 9:16 par style.
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

// ---------- Art : SVG 270x480 par style (image clé représentative) ----------
const W = 270, H = 480;
const T = (x, y, s, txt, o = {}) => `<text x="${x}" y="${y}" font-size="${s}" font-family="${o.f || 'Inter'}" font-weight="${o.w || 800}" fill="${o.c || '#fff'}" text-anchor="${o.a || 'middle'}" ${o.extra || ''}>${txt}</text>`;
const phoneUI = (c = '#fff') => `<g opacity=".85" fill="${c}"><circle cx="246" cy="300" r="11"/><circle cx="246" cy="340" r="11"/><circle cx="246" cy="380" r="11"/><rect x="16" y="430" width="120" height="7" rx="3"/><rect x="16" y="444" width="80" height="6" rx="3" opacity=".6"/></g>`;
const person = (x, y, s = 1, skin = '#e8b996', top = '#2f6df6', hair = '#3a2618') => `<g transform="translate(${x} ${y}) scale(${s})">
 <path d="M-70 200 Q-66 110 0 100 Q66 110 70 200 Z" fill="${top}"/><rect x="-14" y="70" width="28" height="36" fill="${skin}"/>
 <ellipse cx="0" cy="30" rx="44" ry="52" fill="${skin}"/><path d="M-46 22 Q-44 -30 0 -26 Q46 -30 46 22 Q36 -6 0 -6 Q-30 -6 -46 22Z" fill="${hair}"/>
 <circle cx="-16" cy="30" r="4" fill="#222"/><circle cx="16" cy="30" r="4" fill="#222"/><path d="M-14 56 Q0 68 14 56" stroke="#7a3b2e" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
const bottle = (x, y, s = 1, c = '#ff6a3d', cap = '#222') => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-26" y="-92" width="52" height="22" rx="6" fill="${cap}"/><rect x="-36" y="-72" width="72" height="150" rx="18" fill="${c}"/><rect x="-36" y="-20" width="72" height="44" fill="#fff" opacity=".9"/><text x="0" y="8" font-size="13" font-family="Inter" font-weight="800" text-anchor="middle" fill="${c}">NOVA</text><rect x="-28" y="-64" width="9" height="130" rx="4" fill="#fff" opacity=".25"/></g>`;
const ART = {
  'ugc-face-cam': () => `<rect width="${W}" height="${H}" fill="#d9cbb8"/><rect x="150" y="40" width="110" height="150" fill="#efe6d8"/><rect x="0" y="300" width="${W}" height="180" fill="#c3b29b"/>
   ${person(128, 150, 1.25)}<g transform="translate(206 330) rotate(-12)">${bottle(0, 0, .75)}</g>
   <rect x="38" y="232" width="194" height="36" rx="8" fill="#fff"/>${T(135, 257, 19, 'ça a tout changé', { c: '#111' })}
   ${T(135, 290, 19, '😳 en 7 jours', { c: '#ffe14d', extra: 'stroke="#000" stroke-width="5" paint-order="stroke"' })}${phoneUI()}
   <g fill="#fff" opacity=".9"><circle cx="20" cy="20" r="5" fill="#ff3b30"/>${T(32, 25, 12, 'REC', { a: 'start', w: 700 })}</g>`,
  'reel-motion': () => `<rect width="${W}" height="${H}" fill="#14213d"/><defs><linearGradient id="rm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4d74"/><stop offset="1" stop-color="#14213d"/></linearGradient></defs>
   <rect width="${W}" height="${H}" fill="url(#rm)"/><circle cx="160" cy="270" r="120" fill="#fca311" opacity=".18"/>${bottle(165, 290, 1.25, '#e5e5e5', '#fca311')}
   <g transform="rotate(-6 100 110)"><rect x="18" y="74" width="190" height="56" fill="#fca311"/>${T(113, 116, 38, '-40 %', { c: '#14213d', w: 800 })}</g>
   ${T(26, 170, 22, 'de déchets', { a: 'start' })}<path d="M26 180 Q80 172 140 180" stroke="#fca311" stroke-width="6" fill="none" stroke-linecap="round"/>
   <g transform="translate(60 380)"><circle r="34" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="7"/><circle r="34" fill="none" stroke="#fca311" stroke-width="7" stroke-dasharray="160 220" transform="rotate(-90)" stroke-linecap="round"/>${T(0, 7, 20, '4,8')}</g>
   ${T(60, 435, 10, '★ AVIS CLIENTS', { w: 700, c: '#fca311' })}<rect x="214" y="22" width="40" height="22" rx="11" fill="#fff"/>${T(234, 38, 12, 'NEW', { c: '#14213d' })}`,
  'kinetic-type': () => `<rect width="${W}" height="${H}" fill="#ffde00"/>
   ${T(135, 130, 64, 'ARRÊTE', { c: '#111', extra: 'letter-spacing="-3"' })}<rect x="0" y="152" width="${W}" height="104" fill="#111"/>
   ${T(135, 228, 70, 'DE', { c: '#ffde00', extra: 'letter-spacing="-3"' })}
   ${T(135, 340, 50, 'SCROLLER', { c: '#111', extra: 'letter-spacing="-3" transform="rotate(-4 135 320)"' })}
   <g stroke="#111" stroke-width="5" stroke-linecap="round"><path d="M30 380 h50"/><path d="M30 395 h90"/><path d="M190 380 h50"/></g>
   ${T(135, 445, 16, '♪ 128 BPM · coupe sur le temps', { c: '#111', w: 600 })}`,
  'hyper-motion': () => `<rect width="${W}" height="${H}" fill="#050505"/><g stroke="#fff" stroke-opacity=".5" stroke-width="2">${Array.from({ length: 28 }, (_, i) => { const a = i / 28 * Math.PI * 2; return `<path d="M${135 + Math.cos(a) * 70} ${240 + Math.sin(a) * 70} L${135 + Math.cos(a) * 320} ${240 + Math.sin(a) * 320}"/>`; }).join('')}</g>
   <circle cx="135" cy="240" r="90" fill="#7c3aed" opacity=".45"/>${bottle(135, 250, 1.1, '#00e5ff', '#fff')}
   <rect x="0" y="0" width="${W}" height="${H}" fill="#fff" opacity=".07"/><g stroke="#00e5ff" stroke-width="3" fill="none"><path d="M20 20 h30 M20 20 v30"/><path d="M250 460 h-30 M250 460 v-30"/></g>
   ${T(135, 420, 30, 'SPEED ×4', { c: '#fff', extra: 'font-style="italic" transform="translate(90 0) skewX(-12)" ' })}${T(135, 80, 14, '0,4 s · CRASH ZOOM', { c: '#00e5ff', w: 700, f: 'JetBrains Mono' })}`,
  'premium-apple': () => `<defs><radialGradient id="pa" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e6e6ea"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#pa)"/>
   <ellipse cx="135" cy="352" rx="70" ry="10" fill="#000" opacity=".12"/>${bottle(135, 268, 1.05, '#1d1d1f', '#8e8e93')}
   ${T(135, 92, 28, 'Pensée pour durer.', { c: '#1d1d1f', w: 600, extra: 'letter-spacing="-.5"' })}${T(135, 116, 13, 'Acier recyclé. 24 h de froid.', { c: '#6e6e73', w: 400 })}
   ${T(135, 430, 13, 'Découvrir ›', { c: '#0071e3', w: 600 })}`,
  'produit-3d': () => `<defs><linearGradient id="p3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9a8b"/><stop offset="1" stop-color="#6a5af9"/></linearGradient><linearGradient id="p3b" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#cfd3ff"/><stop offset="1" stop-color="#5b4fd8"/></linearGradient></defs>
   <rect width="${W}" height="${H}" fill="url(#p3)"/><ellipse cx="135" cy="360" rx="100" ry="24" fill="#000" opacity=".18"/>
   <g transform="translate(135 250)"><rect x="-44" y="-110" width="88" height="200" rx="24" fill="url(#p3b)"/><rect x="-32" y="-140" width="64" height="34" rx="8" fill="#2a2470"/><ellipse cx="0" cy="-110" rx="44" ry="10" fill="#fff" opacity=".6"/><rect x="-30" y="-96" width="12" height="170" rx="6" fill="#fff" opacity=".55"/></g>
   <path d="M40 380 A110 34 0 0 0 230 380" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="6 6"/><path d="M222 372 l12 9 -14 5" fill="#fff"/>
   ${T(135, 70, 13, 'ORBIT 360° · RENDU 3D', { c: '#fff', w: 700, f: 'JetBrains Mono' })}`,
  'unboxing-asmr': () => `<rect width="${W}" height="${H}" fill="#e9dccb"/><path d="M50 250 L135 210 L220 250 L220 400 L50 400Z" fill="#c69c6d"/><path d="M50 250 L135 290 L220 250 L220 400 L50 400Z" fill="#b5875a"/>
   <path d="M50 250 L135 290 L120 330 L30 286Z" fill="#d8b183"/><path d="M220 250 L135 290 L150 330 L240 286Z" fill="#d8b183"/>${bottle(135, 230, .8, '#2e7d5b', '#111')}
   <g fill="#f1c6a6"><ellipse cx="44" cy="300" rx="26" ry="40" transform="rotate(30 44 300)"/><ellipse cx="226" cy="300" rx="26" ry="40" transform="rotate(-30 226 300)"/></g>
   <g stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"><path d="M88 150 q6 -10 12 0 q6 10 12 0"/><path d="M160 140 q6 -10 12 0 q6 10 12 0"/></g>
   ${T(135, 84, 32, 'crrr… clac', { c: '#5a3d22', w: 700, f: 'Caveat' })}${T(135, 450, 12, 'MACRO · MAINS · SON NET', { c: '#5a3d22', w: 700, f: 'JetBrains Mono' })}`,
  'avant-apres': () => `<rect width="135" height="${H}" fill="#7d7d7d"/><rect x="135" width="135" height="${H}" fill="#7fd1ae"/>
   <g opacity=".7">${person(68, 190, .7, '#c9a58c', '#555', '#2b2b2b')}</g>${person(202, 190, .7, '#f0c09a', '#ff5d8f')}
   <path d="M35 250 q8 -4 12 2" stroke="#444" stroke-width="3" fill="none"/>
   <rect x="133" width="4" height="${H}" fill="#fff"/><circle cx="135" cy="320" r="18" fill="#fff"/><path d="M127 320 l-6 0 M143 320 l6 0 M121 320 l5 -5 M121 320 l5 5 M149 320 l-5 -5 M149 320 l-5 5" stroke="#111" stroke-width="3" stroke-linecap="round"/>
   ${T(68, 60, 22, 'AVANT', { c: '#fff' })}${T(202, 60, 22, 'APRÈS', { c: '#0d3b2a' })}${T(135, 430, 17, 'Jour 1 → Jour 30', { c: '#fff', extra: 'stroke="#000" stroke-width="4" paint-order="stroke"' })}`,
  'listicle': () => `<rect width="${W}" height="${H}" fill="#101828"/>${T(135, 70, 26, '3 erreurs', { c: '#fff' })}${T(135, 98, 16, 'qui ruinent ta peau', { c: '#98a2b3', w: 600 })}
   ${[0, 1, 2].map((i) => `<g transform="translate(24 ${132 + i * 98})"><rect width="222" height="82" rx="14" fill="${i === 1 ? '#ef4444' : '#1d2939'}"/><text x="16" y="60" font-family="Inter" font-weight="800" font-size="52" fill="${i === 1 ? '#fff' : '#ef4444'}">${i + 1}</text><rect x="70" y="26" width="${[120, 100, 130][i]}" height="11" rx="5" fill="#fff" opacity=".9"/><rect x="70" y="46" width="${[80, 120, 70][i]}" height="9" rx="4" fill="#fff" opacity=".45"/></g>`).join('')}
   ${T(135, 446, 13, 'la 2e coûte cher ↓', { c: '#fda29b', w: 700 })}`,
  'demo-app': () => `<rect width="${W}" height="${H}" fill="#eef2ff"/><circle cx="40" cy="60" r="90" fill="#c7d2fe"/>
   <g transform="translate(50 70)"><rect width="170" height="340" rx="26" fill="#111"/><rect x="8" y="8" width="154" height="324" rx="20" fill="#fff"/><rect x="20" y="30" width="80" height="10" rx="5" fill="#4f46e5"/>
   ${[0, 1, 2, 3].map((i) => `<rect x="20" y="${60 + i * 46}" width="130" height="34" rx="8" fill="${i === 1 ? '#e0e7ff' : '#f2f4f7'}"/>`).join('')}<rect x="20" y="260" width="130" height="38" rx="19" fill="#4f46e5"/><text x="85" y="284" font-size="13" font-family="Inter" font-weight="700" fill="#fff" text-anchor="middle">Valider</text></g>
   <circle cx="150" cy="352" r="34" fill="none" stroke="#f97316" stroke-width="4"/><path d="M168 360 l0 26 7 -7 6 12 6 -3 -6 -12 10 -1z" fill="#111" stroke="#fff" stroke-width="2"/>
   <rect x="16" y="20" width="150" height="30" rx="15" fill="#111"/>${T(91, 40, 13, '1 clic, c\'est réglé', { c: '#fff', w: 700 })}`,
  'faceless-explainer': () => `<rect width="${W}" height="${H}" fill="#fdf6ec"/>
   <g transform="translate(135 200)"><circle r="60" fill="#ffd166"/><path d="M-20 -10 a20 20 0 1 1 40 0 c0 16 -14 18 -14 34 h-12 c0 -16 -14 -18 -14 -34z" fill="#fff"/><rect x="-8" y="30" width="16" height="10" rx="3" fill="#fff"/></g>
   <g fill="none" stroke="#118ab2" stroke-width="4" stroke-linecap="round"><path d="M50 300 q30 -30 60 0" /><path d="M160 300 q30 -30 60 0"/></g>
   <g transform="translate(40 310)"><rect width="60" height="44" rx="10" fill="#118ab2"/></g><g transform="translate(170 310)"><rect width="60" height="44" rx="10" fill="#ef476f"/></g>
   ${T(135, 80, 24, 'Comment ça', { c: '#073b4c' })}${T(135, 108, 24, 'marche ?', { c: '#073b4c' })}
   <g transform="translate(70 412)">${[6, 16, 26, 12, 22, 30, 14, 24, 8, 18, 28, 10, 20].map((h, i) => `<rect x="${i * 10}" y="${-h / 2}" width="6" height="${h}" rx="3" fill="#073b4c"/>`).join('')}</g>${T(135, 456, 12, 'VOIX OFF', { c: '#073b4c', w: 700, f: 'JetBrains Mono' })}`,
  'pov-green-screen': () => `<rect width="${W}" height="${H}" fill="#1f2937"/><rect x="18" y="64" width="234" height="220" rx="6" fill="#fff"/><rect x="34" y="84" width="140" height="12" rx="6" fill="#111"/>
   ${[0, 1, 2, 3, 4].map((i) => `<rect x="34" y="${110 + i * 18}" width="${[200, 180, 196, 150, 120][i]}" height="8" rx="4" fill="#d0d5dd"/>`).join('')}<rect x="34" y="210" width="96" height="58" rx="6" fill="#93c5fd"/>
   ${person(160, 330, .95, '#d9a37f', '#16a34a', '#111')}
   <rect x="16" y="16" width="238" height="36" rx="8" fill="#fff"/>${T(135, 40, 15, 'POV : tu découvres le prix', { c: '#111', w: 700 })}${phoneUI()}`,
};

const NIVEAU = { code: ['#16a34a', '0 crédit'], rushes: ['#2563eb', 'rushes'], mixte: ['#d97706', 'mixte'], ia: ['#9333ea', 'crédits IA'] };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const cards = list.map((s, i) => {
  const [col, lab] = NIVEAU[s.coutNiveau] || ['#666', s.coutNiveau];
  const letter = ids.length ? `<div class="letter">${String.fromCharCode(65 + i)}</div>` : '';
  return `<div class="card">${letter}<div class="frame"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${ART[s.id] ? ART[s.id]() : ''}</svg></div>
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
</style></head><body><div class="sheet"><h1>${esc(title)}</h1><div class="sub">Clapova · vignettes dessinées en code, 0 crédit · ${list.length} style${list.length > 1 ? 's' : ''} · détails : STYLES.md</div>
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
