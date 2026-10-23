/* Clapova storyboard — primitives de croquis (100 % code, SVG, aucune IA).
   Repère : viewBox 360x640 (9:16). Chaque primitive renvoie une chaîne SVG.
   Style : marker gris 5 valeurs, trait encre épais tremblé (filtre #rough), grain papier, hachures. */
(function (root) {
  const G = { paper: '#f4f1ea', g1: '#e6e3dc', g2: '#cbc7bf', g3: '#a5a19a', g4: '#7a766f', g5: '#4b4945', ink: '#1d1c1a' };
  const C = { cam: '#d6453d', subj: '#2f6fd6', acc: '#ff8a3d', night: '#0f1b36', night2: '#1d2f5a' };
  const lerp = (a, b, t) => a + (b - a) * t;
  const cl = (t) => Math.max(0, Math.min(1, t));
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const seg = (t, a, b) => cl((t - a) / (b - a));
  const f = (n) => (Math.round(n * 10) / 10).toString();
  let uid = 0; const id = (p) => `${p}${++uid}`;

  const ST = (w = 4, c = G.ink) => `stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

  const DEFS = `<defs>
<filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="11"/><feDisplacementMap in="SourceGraphic" scale="2.6"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .11 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
<filter id="soft"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="blur2"><feGaussianBlur stdDeviation="2.2"/></filter>
<pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><line x1="0" y1="0" x2="0" y2="8" stroke="${G.g5}" stroke-width="1.8" opacity=".5"/></pattern>
<pattern id="hatchL" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-50)"><line x1="0" y1="0" x2="0" y2="10" stroke="${G.g4}" stroke-width="1.4" opacity=".35"/></pattern>
<linearGradient id="vig" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".16"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
<linearGradient id="steamG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".55" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="night" cx=".5" cy=".55" r=".75"><stop offset="0" stop-color="${C.night2}"/><stop offset="1" stop-color="#08112a"/></radialGradient>
</defs>`;

  /* Cadre : papier + caméra + vignette + grain. cam = transform appliqué au dessin. */
  function frame(inner, { cam = '', bg = G.paper, rough = true, grain = true, vig = true } = {}) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640" preserveAspectRatio="xMidYMid slice">${DEFS}
<rect width="360" height="640" fill="${bg}"/><g transform="${cam}"><g ${rough ? 'filter="url(#rough)"' : ''}>${inner}</g></g>
${vig ? '<rect width="360" height="640" fill="url(#vig)"/>' : ''}${grain ? '<rect width="360" height="640" filter="url(#grain)" fill="#fff"/>' : ''}</svg>`;
  }
  const camPush = (z, cx = 180, cy = 330) => `translate(${cx} ${cy}) scale(${z}) translate(${-cx} ${-cy})`;

  /* ---------- Tasse (vue légèrement plongeante) ---------- */
  function mug(x, y, s = 1, { cold = true } = {}) {
    const rx = 62 * s, ry = 17 * s, h = 112 * s, rb = 54 * s;
    const top = y - h;
    return `<g>
<ellipse cx="${x + 6 * s}" cy="${y + 4 * s}" rx="${rx * 1.75}" ry="${ry * 2.2}" fill="${G.g4}" opacity=".35" filter="url(#soft)"/>
<ellipse cx="${x}" cy="${y}" rx="${rx * 1.6}" ry="${ry * 1.9}" fill="${G.g1}" ${ST(3.4)}/>
<ellipse cx="${x}" cy="${y - 2 * s}" rx="${rx * 1.05}" ry="${ry * 1.15}" fill="none" ${ST(2, G.g4)}/>
<path d="M${x + rx - 2 * s},${top + 22 * s} c${48 * s},${-6 * s} ${54 * s},${56 * s} ${4 * s},${66 * s}" fill="none" ${ST(13 * s)}/>
<path d="M${x + rx - 2 * s},${top + 22 * s} c${48 * s},${-6 * s} ${54 * s},${56 * s} ${4 * s},${66 * s}" fill="none" stroke="${G.g1}" stroke-width="${7 * s}" stroke-linecap="round"/>
<path d="M${x - rx},${top} L${x - rb},${y - 4 * s} Q${x},${y + ry * 1.25} ${x + rb},${y - 4 * s} L${x + rx},${top} Z" fill="${G.g1}" ${ST(4)}/>
<path d="M${x + rx * .42},${top + ry} L${x + rb * .5},${y + 3 * s} Q${x + rb * .85},${y} ${x + rb},${y - 4 * s} L${x + rx},${top} Z" fill="url(#hatch)" stroke="none"/>
<path d="M${x + rx * .62},${top + ry * .6} L${x + rb * .78},${y} L${x + rb},${y - 4 * s} L${x + rx},${top} Z" fill="${G.g3}" opacity=".75" stroke="none"/>
<path d="M${x - rx + 14 * s},${top + 20 * s} L${x - rb + 12 * s},${y - 14 * s}" stroke="#fff" stroke-width="${7 * s}" stroke-linecap="round" opacity=".9"/>
<ellipse cx="${x}" cy="${top}" rx="${rx}" ry="${ry}" fill="${G.g1}" ${ST(4)}/>
<ellipse cx="${x}" cy="${top + 4 * s}" rx="${rx - 7 * s}" ry="${ry - 4 * s}" fill="${G.g5}" stroke="none"/>
${cold ? `<ellipse cx="${x - 8 * s}" cy="${top + 5 * s}" rx="${rx - 26 * s}" ry="${ry - 9 * s}" fill="none" stroke="${G.g3}" stroke-width="1.6" opacity=".9"/>
<path d="M${x - 30 * s},${top + 3 * s} q${10 * s},${4 * s} ${22 * s},0 M${x + 6 * s},${top + 8 * s} q${8 * s},${3 * s} ${18 * s},0" stroke="${G.g3}" stroke-width="1.4" fill="none"/>` : ''}
</g>`;
  }

  /* ---------- Gourde (cylindre) ----------
     x,y = centre de la base. o.capOff 0..1 (levée du bouchon), o.capTwist (deg), o.spin -1..1 (rotation orbit),
     o.taper (rétrécissement haut, contre-plongée), o.palette 'sketch' | 'product'. Renvoie {svg, cap, grip}. */
  function bottleGeom(x, y, s = 1, o = {}) {
    const w = 60 * s, h = 214 * s, taper = o.taper || 0, wt = w * (1 - taper);
    const top = y - h, capH = 42 * s, capW = wt * .9;
    const off = o.capOff || 0;
    const cap = { x: x + off * 34 * s, y: top - 8 * s - capH / 2 - off * 64 * s, w: capW, h: capH, rot: (o.capTwist || 0) * 0 + off * 16 };
    return { w, wt, h, top, cap, grip: { x, y: top + 62 * s, w: lerp(wt, w, 62 / 214) } };
  }
  function bottle(x, y, s = 1, o = {}) {
    const g = bottleGeom(x, y, s, o), P = o.palette === 'product'
      ? { body: '#c9d3e6', hi: '#ffffff', sh: '#6e7c9c', core: '#4c5a7c', cap: '#13213f', capHi: '#3b5185', ink: '#0b1430', lab: '#13213f' }
      : { body: G.g3, hi: G.g1, sh: G.g4, core: G.g5, cap: G.g5, capHi: G.g3, ink: G.ink, lab: G.g1 };
    const { w, wt, h, top, cap } = g, r = 18 * s, spin = o.spin || 0, sw = o.palette === 'product' ? 0 : 4;
    const L = x - w / 2, R = x + w / 2, Lt = x - wt / 2, Rt = x + wt / 2;
    const body = `M${Lt},${top + r} Q${Lt},${top} ${Lt + r},${top} L${Rt - r},${top} Q${Rt},${top} ${Rt},${top + r} L${R},${y - 10 * s} Q${R},${y + 4 * s} ${x},${y + 5 * s} Q${L},${y + 4 * s} ${L},${y - 10 * s} Z`;
    const cid = id('bc');
    const hx = lerp(-.28, .18, (spin + 1) / 2), lx = Math.sin(spin * 1.1) * .28, lsc = Math.max(.15, Math.cos(spin * 1.1));
    const capOpen = (o.capOff || 0) > .02;
    const capSvg = (() => {
      const cw = cap.w, chh = cap.h, cx = cap.x, cy = cap.y;
      const ribs = [-.3, -.1, .1, .3].map((k) => `M${cx + k * cw},${cy - chh / 2 + 7 * s} v${chh - 16 * s}`).join(' ');
      return `<g transform="rotate(${cap.rot} ${cx} ${cy})">
<path d="M${cx - cw / 2},${cy - chh / 2 + 8 * s} Q${cx - cw / 2},${cy - chh / 2} ${cx - cw / 2 + 8 * s},${cy - chh / 2} L${cx + cw / 2 - 8 * s},${cy - chh / 2} Q${cx + cw / 2},${cy - chh / 2} ${cx + cw / 2},${cy - chh / 2 + 8 * s} L${cx + cw / 2},${cy + chh / 2 - 4 * s} Q${cx},${cy + chh / 2 + 5 * s} ${cx - cw / 2},${cy + chh / 2 - 4 * s} Z" fill="${P.cap}" ${sw ? ST(sw, P.ink) : ''}/>
<path d="${ribs}" stroke="${P.capHi}" stroke-width="${2.6 * s}" stroke-linecap="round"/>
<path d="M${cx - cw / 2 + 6 * s},${cy - chh / 2 + 5 * s} h${cw * .5}" stroke="${P.capHi}" stroke-width="${3 * s}" stroke-linecap="round" opacity=".8"/></g>`;
    })();
    return {
      g, svg: `<g>
<clipPath id="${cid}"><path d="${body}"/></clipPath>
${capOpen ? `<rect x="${x - wt * .36}" y="${top - 13 * s}" width="${wt * .72}" height="${15 * s}" rx="${3 * s}" fill="${P.sh}" ${sw ? ST(3, P.ink) : ''}/>
<path d="M${x - wt * .36},${top - 8 * s} l${wt * .72},${-3 * s} M${x - wt * .36},${top - 2 * s} l${wt * .72},${-3 * s}" stroke="${P.core}" stroke-width="${1.6 * s}"/>
<ellipse cx="${x}" cy="${top - 13 * s}" rx="${wt * .36}" ry="${4 * s}" fill="${P.core}" ${sw ? ST(2.4, P.ink) : ''}/>` : ''}
<path d="${body}" fill="${P.body}"/>
<g clip-path="url(#${cid})">
 <rect x="${x + w * (.18 + hx * .3)}" y="${top}" width="${w * .5}" height="${h + 10 * s}" fill="${P.sh}"/>
 ${o.palette === 'product' ? '' : `<rect x="${x + w * (.16 + hx * .3)}" y="${top}" width="${w * .5}" height="${h + 10 * s}" fill="url(#hatch)"/>`}
 <rect x="${x + w * (.34 + hx * .25)}" y="${top}" width="${w * .1}" height="${h + 10 * s}" fill="${P.core}" opacity=".7"/>
 <rect x="${x + w * (hx - .12)}" y="${top + 8 * s}" width="${w * .11}" height="${h - 24 * s}" rx="${4 * s}" fill="${P.hi}" opacity=".95"/>
 <rect x="${x + w * (hx + .03)}" y="${top + 14 * s}" width="${w * .035}" height="${h - 40 * s}" rx="${2 * s}" fill="${P.hi}" opacity=".6"/>
 <path d="M${L},${y - 64 * s} Q${x},${y - 56 * s} ${R},${y - 64 * s}" fill="none" stroke="${P.core}" stroke-width="${2 * s}" opacity=".7"/>
 ${lsc > .2 ? `<text x="0" y="0" font-family="Inter,sans-serif" font-weight="800" font-size="${14 * s}" letter-spacing="${4 * s}" text-anchor="middle" fill="${P.lab}" opacity="${cl(lsc * 1.2)}" transform="translate(${x + lx * w} ${y - 128 * s}) rotate(-90) scale(1 ${lsc})">NOVA</text>` : ''}
</g>
<path d="${body}" fill="none" ${sw ? ST(sw, P.ink) : `stroke="${P.core}" stroke-width="1"`}/>
${capSvg}</g>`,
    };
  }

  /* ---------- Main qui agrippe un cylindre ----------
     x,y = centre de la prise, w = largeur de l'objet saisi, s = échelle de la main,
     side 'right' (bras vient de droite) | 'left', rot (deg), arm = longueur d'avant-bras, open 0..1 (main ouverte). */
  function hand(x, y, w, { s = 1, side = 'right', rot = 0, arm = 170, open = 0, sleeve = G.g4 } = {}) {
    const fh = 13.5 * s, fy = [-27, -13.5, 0, 13.5].map((k) => k * s - fh / 2);
    const tipX = [-w / 2 - 5 * s, -w / 2 - 7 * s, -w / 2 - 5 * s, -w / 2 + 1 * s].map((v) => v + open * (w * .9 + 6 * s));
    const baseX = w / 2 + 14 * s;
    const fingers = fy.map((yy, i) => {
      const hh = i === 3 ? fh * .86 : fh, x0 = tipX[i], x1 = baseX, r = hh / 2;
      return `<path d="M${x1},${yy} L${x0 + r},${yy} Q${x0 - r * .4},${yy + r} ${x0 + r},${yy + hh} L${x1},${yy + hh}" fill="${G.g1}" ${ST(3.2)}/>
<path d="M${x0 + r * 1.1},${yy + 3 * s} q${-3 * s},${hh * .32} 0,${hh - 6 * s}" fill="none" ${ST(1.6, G.g4)}/>
<path d="M${lerp(x0, x1, .42)},${yy + 3 * s} q${2.5 * s},${hh * .35} 0,${hh - 6 * s}" fill="none" ${ST(1.5, G.g4)}/>
<path d="M${x0 + r},${yy + hh - 1.5 * s} L${x1},${yy + hh - 1.5 * s}" stroke="${G.g3}" stroke-width="${2.4 * s}" opacity=".9"/>`;
    }).join('');
    const pr = baseX - 6 * s;
    const palm = `<path d="M${pr},${-34 * s} Q${pr + 40 * s},${-44 * s} ${pr + 58 * s},${-26 * s} L${pr + 62 * s},${30 * s} Q${pr + 34 * s},${44 * s} ${pr},${36 * s} Q${pr - 8 * s},${0} ${pr},${-34 * s} Z" fill="${G.g1}" ${ST(3.6)}/>
<path d="M${pr + 30 * s},${-30 * s} Q${pr + 50 * s},${0} ${pr + 40 * s},${32 * s} L${pr + 60 * s},${28 * s} L${pr + 56 * s},${-24 * s} Z" fill="url(#hatchL)" stroke="none"/>
<path d="M${pr + 4 * s},${-20 * s} q${6 * s},${3 * s} ${3 * s},${9 * s} M${pr + 4 * s},${-6 * s} q${6 * s},${3 * s} ${3 * s},${9 * s} M${pr + 4 * s},${8 * s} q${6 * s},${3 * s} ${3 * s},${9 * s}" fill="none" ${ST(1.6, G.g4)}/>`;
    const ax = pr + 52 * s;
    const forearm = `<path d="M${ax},${-30 * s} L${ax + arm * s},${-46 * s} L${ax + arm * s},${48 * s} L${ax},${32 * s} Z" fill="${G.g2}" ${ST(3.6)}/>
<path d="M${ax + 38 * s},${-35 * s} L${ax + arm * s},${-50 * s} L${ax + arm * s},${52 * s} L${ax + 38 * s},${38 * s} Q${ax + 30 * s},${0} ${ax + 38 * s},${-35 * s} Z" fill="${sleeve}" ${ST(3.6)}/>
<path d="M${ax + 48 * s},${-32 * s} Q${ax + 40 * s},${0} ${ax + 48 * s},${36 * s}" fill="none" ${ST(2, G.g5)}/>
<path d="M${ax + 60 * s},${-34 * s} L${ax + arm * s},${-44 * s} L${ax + arm * s},${-20 * s} Z" fill="url(#hatch)" stroke="none"/>`;
    const thumb = (() => {
      const t0x = pr + 6 * s, ty = -36 * s, tx = lerp(-w * .1, w * .5, open);
      return `<path d="M${t0x + 16 * s},${ty + 10 * s} Q${t0x - 6 * s},${ty - 12 * s} ${tx + 6 * s},${ty - 8 * s} Q${tx - 7 * s},${ty - 2 * s} ${tx + 4 * s},${ty + 6 * s} Q${t0x - 2 * s},${ty + 4 * s} ${t0x + 4 * s},${ty + 20 * s}" fill="${G.g1}" ${ST(3.2)}/>
<path d="M${tx + 4 * s},${ty - 5 * s} q${-3 * s},${4 * s} ${2 * s},${8 * s}" fill="none" ${ST(1.5, G.g4)}/>`;
    })();
    const shadow = open < .5 ? `<path d="M${-w / 2},${fy[3] + fh + 3 * s} L${w / 2},${fy[3] + fh + 3 * s}" stroke="${G.g5}" stroke-width="${5 * s}" opacity=".35" filter="url(#blur2)"/>` : '';
    const sx = side === 'left' ? -1 : 1;
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sx} 1)">${shadow}${forearm}${palm}${fingers}${thumb}</g>`;
  }

  /* ---------- Sac cabas : back / front séparés pour y glisser un objet ---------- */
  function bag(x, y, s = 1) {
    const w = 210 * s, h = 230 * s, top = y - h;
    return {
      back: `<path d="M${x - w / 2 + 10 * s},${top} L${x + w / 2 - 10 * s},${top - 14 * s} L${x + w / 2 - 4 * s},${top + 30 * s} L${x - w / 2 + 4 * s},${top + 30 * s} Z" fill="${G.g5}" ${ST(3.4)}/>
<path d="M${x - 44 * s},${top - 6 * s} Q${x - 10 * s},${top - 120 * s} ${x + 44 * s},${top - 12 * s}" fill="none" ${ST(10 * s)}/><path d="M${x - 44 * s},${top - 6 * s} Q${x - 10 * s},${top - 120 * s} ${x + 44 * s},${top - 12 * s}" fill="none" stroke="${G.g3}" stroke-width="${5 * s}" stroke-linecap="round"/>`,
      front: `<ellipse cx="${x + 10 * s}" cy="${y + 6 * s}" rx="${w * .62}" ry="${16 * s}" fill="${G.g5}" opacity=".35" filter="url(#soft)"/>
<path d="M${x - w / 2},${top + 8 * s} Q${x},${top + 22 * s} ${x + w / 2},${top + 2 * s} L${x + w / 2 - 14 * s},${y} Q${x},${y + 8 * s} ${x - w / 2 + 12 * s},${y} Z" fill="${G.g2}" ${ST(4)}/>
<path d="M${x + w * .12},${top + 18 * s} L${x + w / 2},${top + 2 * s} L${x + w / 2 - 14 * s},${y} L${x + w * .2},${y + 4 * s} Z" fill="url(#hatch)" stroke="none"/>
<path d="M${x - w / 2 + 22 * s},${top + 40 * s} Q${x - w / 2 + 30 * s},${top + 120 * s} ${x - w / 2 + 24 * s},${y - 20 * s}" fill="none" stroke="${G.g1}" stroke-width="${5 * s}" stroke-linecap="round" opacity=".8"/>
<path d="M${x - 50 * s},${top + 20 * s} Q${x - 18 * s},${top - 92 * s} ${x + 50 * s},${top + 8 * s}" fill="none" ${ST(10 * s)}/><path d="M${x - 50 * s},${top + 20 * s} Q${x - 18 * s},${top - 92 * s} ${x + 50 * s},${top + 8 * s}" fill="none" stroke="${G.g2}" stroke-width="${5 * s}" stroke-linecap="round"/>
<text x="${x - 20 * s}" y="${top + 120 * s}" font-family="Caveat,cursive" font-size="${30 * s}" fill="${G.g4}" text-anchor="middle" transform="rotate(-4 ${x} ${top + 120 * s})">tote</text>`,
    };
  }

  /* ---------- Vapeur élégante : rubans effilés, ondulation animée ---------- */
  function steam(x, y, amt, t, { n = 3, height = 200, spread = 16, width = 13 } = {}) {
    if (amt <= 0) return '';
    let o = '';
    for (let i = 0; i < n; i++) {
      const dx = (i - (n - 1) / 2) * spread, H = height * (0.55 + 0.45 * amt) * (1 - Math.abs(i - (n - 1) / 2) * .15), ph = t * 5.5 + i * 2.1;
      const pts = [], N = 26;
      for (let k = 0; k <= N; k++) {
        const u = k / N, yy = y - u * H, amp = 4 + 18 * u;
        pts.push([x + dx + Math.sin(ph + u * 5.2) * amp + u * u * 14 * Math.sin(i + t), yy, width * Math.pow(1 - u, .8) * (0.5 + .5 * amt) + 0.6]);
      }
      const L = pts.map((p, k) => { const q = pts[Math.min(k + 1, N)], pp = pts[Math.max(k - 1, 0)]; const ang = Math.atan2(q[1] - pp[1], q[0] - pp[0]) + Math.PI / 2; return [p[0] + Math.cos(ang) * p[2] / 2, p[1] + Math.sin(ang) * p[2] / 2]; });
      const Rr = pts.map((p, k) => { const q = pts[Math.min(k + 1, N)], pp = pts[Math.max(k - 1, 0)]; const ang = Math.atan2(q[1] - pp[1], q[0] - pp[0]) - Math.PI / 2; return [p[0] + Math.cos(ang) * p[2] / 2, p[1] + Math.sin(ang) * p[2] / 2]; });
      const d = 'M' + L.map((p) => f(p[0]) + ',' + f(p[1])).join(' L') + ' L' + Rr.reverse().map((p) => f(p[0]) + ',' + f(p[1])).join(' L') + ' Z';
      const gid = id('sg');
      o += `<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="${y}" x2="0" y2="${y - H}"><stop offset="0" stop-color="#fff" stop-opacity="${.95 * amt}"/><stop offset=".6" stop-color="#fff" stop-opacity="${.55 * amt}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<path d="${d}" fill="url(#${gid})" stroke="none"/>
<path d="M${pts.slice(2, 18).map((p) => f(p[0] - p[2] * .55) + ',' + f(p[1])).join(' L')}" fill="none" stroke="${G.g4}" stroke-width="1.2" stroke-dasharray="5 7" opacity="${.55 * amt}"/>`;
    }
    return o;
  }

  /* ---------- Annotations (hors filtre) ---------- */
  const marker = (c) => `<marker id="m${c.slice(1)}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.6" markerHeight="3.6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`;
  function overlay(inner) { return `<svg viewBox="0 0 360 640" preserveAspectRatio="none"><defs>${marker(C.cam)}${marker(C.subj)}</defs>${inner}</svg>`; }
  function arrow(d, c, w = 8) { return `<path d="${d}" fill="none" stroke="#fff" stroke-width="${w + 6}" stroke-linecap="round" opacity=".9"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" marker-end="url(#m${c.slice(1)})"/>`; }
  const camArrow = (d, w) => arrow(d, C.cam, w), subjArrow = (d, w) => arrow(d, C.subj, w);
  function label(x, y, t, c = C.cam, size = 19) { const wd = t.length * size * .62 + 20; return `<g><rect x="${x}" y="${y - size - 6}" width="${wd}" height="${size + 13}" rx="5" fill="${c}"/><text x="${x + 10}" y="${y}" font-family="Inter" font-weight="800" font-size="${size}" fill="#fff" letter-spacing=".5">${t}</text></g>`; }
  function note(x, y, t, c = C.subj, size = 24, rot = -4) { return `<text x="${x}" y="${y}" font-family="Caveat,cursive" font-weight="700" font-size="${size}" fill="${c}" transform="rotate(${rot} ${x} ${y})" paint-order="stroke" stroke="#fff" stroke-width="5">${t}</text>`; }
  /* Cadre d'arrivée d'un push-in (rapport de zoom z) + flèches aux coins */
  function pushFrame(z, cx = 180, cy = 330) {
    const w = 360 / z, h = 640 / z, x = cx - w / 2, y = cy - h / 2;
    return `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="none" stroke="${C.cam}" stroke-width="4.5" stroke-dasharray="14 9" rx="3"/>` +
      [[10, 10, x - 6, y - 6], [350, 10, x + w + 6, y - 6], [10, 630, x - 6, y + h + 6], [350, 630, x + w + 6, y + h + 6]].map((a) => camArrow(`M${a[0]},${a[1]} L${f(a[2])},${f(a[3])}`, 6)).join('');
  }
  function sup(t, y = 150) { return `<rect x="26" y="${y - 40}" width="308" height="60" rx="10" fill="${G.ink}" opacity=".9"/><text x="180" y="${y + 1}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="27" fill="#fff">${t}</text>`; }
  /* Piste de keyframes (case motion) : keys = [[u, 'label'], ...], u in 0..1, playhead p */
  function keyTrack(keys, p, { y = 600, color = C.acc } = {}) {
    const x0 = 34, x1 = 326, X = (u) => lerp(x0, x1, u);
    return `<rect x="18" y="${y - 30}" width="324" height="52" rx="8" fill="#fff" opacity=".94"/>
<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${G.g3}" stroke-width="3" stroke-linecap="round"/>
<line x1="${x0}" y1="${y}" x2="${X(p)}" y2="${y}" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>
${keys.map(([u, l]) => `<rect x="${X(u) - 7}" y="${y - 7}" width="14" height="14" transform="rotate(45 ${X(u)} ${y})" fill="${u <= p + 1e-3 ? color : '#fff'}" stroke="${G.ink}" stroke-width="2.4"/><text x="${X(u)}" y="${y - 13}" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" font-size="11.5" fill="${G.ink}">${l}</text>`).join('')}
<line x1="${X(p)}" y1="${y - 22}" x2="${X(p)}" y2="${y + 16}" stroke="${C.cam}" stroke-width="2.5"/>`;
  }

  root.Sketch = { uid: id, G, C, lerp, cl, ease, easeOut, seg, f, ST, frame, camPush, mug, bottle, bottleGeom, hand, bag, steam, overlay, arrow, camArrow, subjArrow, label, note, pushFrame, sup, keyTrack };
})(typeof window !== 'undefined' ? window : globalThis);
