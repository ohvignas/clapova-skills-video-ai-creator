/* Scène de repli « generique » : dessine n'importe quel brief sans primitive dédiée.
   Une liste d'éléments (personne, objet, produit, ecran, texte, logo) posés dans un décor,
   chacun avec une position de départ et d'arrivée (le sujet bouge entre début et fin du plan).
   Repère 360x640 (9:16). Contrat de scène : (t, params) => { art, marks }. */
(function (root) {
  const K = root.Sketch;
  const { G, C, lerp, ease, seg, ST, frame, camPush } = K;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const DECORS = {
    interieur: () => `<rect width="360" height="420" fill="${G.g2}"/><rect width="360" height="420" fill="url(#hatchL)" opacity=".6"/>
<rect x="222" y="70" width="104" height="170" fill="${G.g1}" ${ST(3.4)}/><path d="M274,70 v170 M222,150 h104" ${ST(3)}/>
<path d="M0,420 L360,420 L360,640 L0,640 Z" fill="${G.g3}"/><path d="M0,420 L360,420" ${ST(4.5)}/>`,
    exterieur: () => `<rect width="360" height="400" fill="${G.g1}"/><circle cx="282" cy="96" r="30" fill="#fff" ${ST(3)}/>
<path d="M0,330 Q60,270 120,312 T240,300 T360,290 L360,400 L0,400 Z" fill="${G.g3}" ${ST(3.4)}/>
<path d="M0,400 L360,400 L360,640 L0,640 Z" fill="${G.g4}"/><path d="M0,400 L360,400" ${ST(4.5)}/>
<path d="M150,640 L176,400 M210,640 L184,400" stroke="${G.g2}" stroke-width="3" opacity=".7"/>`,
    studio: () => `<rect width="360" height="640" fill="${G.g1}"/><path d="M0,430 Q180,470 360,430 L360,640 L0,640 Z" fill="${G.g2}"/>
<ellipse cx="180" cy="300" rx="160" ry="240" fill="#fff" opacity=".5" filter="url(#soft)"/>`,
    nuit: () => `<rect width="360" height="640" fill="url(#night)"/>`,
    bureau: () => `<rect width="360" height="400" fill="${G.g2}"/><rect width="360" height="400" fill="url(#hatchL)" opacity=".5"/>
<path d="M0,400 L360,400 L360,640 L0,640 Z" fill="${G.g3}"/><path d="M0,400 L360,400" ${ST(4.5)}/>
<path d="M0,410 L360,410" stroke="${G.g5}" stroke-width="6" opacity=".35"/>`,
    uni: () => '',
  };

  /* Personne : silhouette marker (tête, buste, bras). pose : debout | assis | pointe | bras-leves | marche */
  function person(x, y, s, o, t) {
    const pose = o.pose || 'debout', fill = o.fill || G.g3, h = 300 * s;
    const head = y - h, sw = (pose === 'marche' ? Math.sin(t * 9) * 16 : 0) * s;
    const armL = pose === 'bras-leves' ? `M${x - 34 * s},${head + 92 * s} L${x - 74 * s},${head + 10 * s}` : `M${x - 34 * s},${head + 92 * s} L${x - 46 * s + sw},${head + 196 * s}`;
    const armR = pose === 'pointe' ? `M${x + 34 * s},${head + 92 * s} L${x + 120 * s},${head + 84 * s}`
      : pose === 'bras-leves' ? `M${x + 34 * s},${head + 92 * s} L${x + 74 * s},${head + 10 * s}` : `M${x + 34 * s},${head + 92 * s} L${x + 46 * s - sw},${head + 196 * s}`;
    const legs = pose === 'assis'
      ? `M${x - 18 * s},${head + 210 * s} L${x + 50 * s},${head + 214 * s} L${x + 50 * s},${y} M${x + 14 * s},${head + 210 * s} L${x + 80 * s},${head + 216 * s} L${x + 80 * s},${y}`
      : `M${x - 16 * s},${head + 206 * s} L${x - 22 * s - sw},${y} M${x + 16 * s},${head + 206 * s} L${x + 22 * s + sw},${y}`;
    return `<ellipse cx="${x}" cy="${y + 4 * s}" rx="${70 * s}" ry="${12 * s}" fill="${G.g5}" opacity=".35" filter="url(#soft)"/>
<path d="${legs}" fill="none" ${ST(22 * s, G.ink)}/><path d="${legs}" fill="none" stroke="${G.g5}" stroke-width="${15 * s}" stroke-linecap="round"/>
<path d="M${x - 44 * s},${head + 90 * s} Q${x},${head + 66 * s} ${x + 44 * s},${head + 90 * s} L${x + 36 * s},${head + 212 * s} L${x - 36 * s},${head + 212 * s} Z" fill="${fill}" ${ST(4)}/>
<path d="M${x + 6 * s},${head + 92 * s} L${x + 36 * s},${head + 212 * s} L${x + 6 * s},${head + 212 * s} Z" fill="url(#hatch)"/>
<path d="${armL} ${armR}" fill="none" ${ST(18 * s, G.ink)}/><path d="${armL} ${armR}" fill="none" stroke="${fill}" stroke-width="${11 * s}" stroke-linecap="round"/>
<path d="M${x - 9 * s},${head + 56 * s} L${x - 9 * s},${head + 74 * s} L${x + 9 * s},${head + 74 * s} L${x + 9 * s},${head + 56 * s}" fill="${G.g1}" ${ST(3)}/>
<ellipse cx="${x}" cy="${head + 30 * s}" rx="${27 * s}" ry="${32 * s}" fill="${G.g1}" ${ST(4)}/>
<path d="M${x - 27 * s},${head + 26 * s} Q${x - 22 * s},${head - 8 * s} ${x + 6 * s},${head - 2 * s} Q${x + 30 * s},${head + 4 * s} ${x + 27 * s},${head + 26 * s} Q${x + 8 * s},${head + 10 * s} ${x - 27 * s},${head + 26 * s} Z" fill="${G.g5}" ${ST(3)}/>`;
  }
  /* Objet : forme simple ombrée. forme : boite | cylindre | sphere | telephone */
  function object(x, y, s, o) {
    const f = o.forme || 'boite', fill = o.fill || G.g2, w = (o.w || 120) * s, h = (o.h || 150) * s;
    const shadow = `<ellipse cx="${x + 8 * s}" cy="${y + 4 * s}" rx="${w * .75}" ry="${14 * s}" fill="${G.g5}" opacity=".4" filter="url(#soft)"/>`;
    if (f === 'cylindre') return shadow + `<path d="M${x - w / 2},${y - h} L${x - w / 2},${y} Q${x},${y + 18 * s} ${x + w / 2},${y} L${x + w / 2},${y - h} Z" fill="${fill}" ${ST(4)}/>
<rect x="${x + w * .1}" y="${y - h}" width="${w * .4}" height="${h + 8 * s}" fill="url(#hatch)"/><ellipse cx="${x}" cy="${y - h}" rx="${w / 2}" ry="${12 * s}" fill="${G.g1}" ${ST(4)}/>
<rect x="${x - w * .32}" y="${y - h + 16 * s}" width="${w * .1}" height="${h - 30 * s}" rx="4" fill="#fff" opacity=".85"/>`;
    if (f === 'sphere') return shadow + `<circle cx="${x}" cy="${y - w / 2}" r="${w / 2}" fill="${fill}" ${ST(4)}/>
<path d="M${x + w * .1},${y - w * .95} A${w / 2},${w / 2} 0 0 1 ${x + w * .1},${y - w * .05} A${w * .38},${w / 2} 0 0 0 ${x + w * .1},${y - w * .95} Z" fill="url(#hatch)"/>
<ellipse cx="${x - w * .18}" cy="${y - w * .72}" rx="${w * .1}" ry="${w * .07}" fill="#fff"/>`;
    if (f === 'telephone') return shadow + `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="${16 * s}" fill="${G.g5}" ${ST(4)}/>
<rect x="${x - w / 2 + 8 * s}" y="${y - h + 14 * s}" width="${w - 16 * s}" height="${h - 28 * s}" rx="${8 * s}" fill="${o.screen || G.g1}"/>
<path d="M${x - w / 2 + 16 * s},${y - h + 30 * s} h${w * .5} M${x - w / 2 + 16 * s},${y - h + 50 * s} h${w * .65} M${x - w / 2 + 16 * s},${y - h + 70 * s} h${w * .4}" ${ST(5 * s, G.g3)}/>`;
    const d = 22 * s;
    return shadow + `<path d="M${x - w / 2},${y - h} l${d},${-d} h${w} v${h} l${-d},${d} Z" fill="${G.g3}" ${ST(4)}/>
<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" fill="${fill}" ${ST(4)}/>
<path d="M${x + w / 2},${y - h} l${d},${-d} v${h} l${-d},${d} Z" fill="url(#hatch)" ${ST(3)}/>`;
  }
  /* Écran (interface, maquette) : cadre téléphone plein cadre ou fenêtre, lignes d'UI. */
  function screen(x, y, s, o) {
    const w = (o.w || 250) * s, h = (o.h || 420) * s, top = y - h;
    const rows = Array.from({ length: 6 }, (_, i) => `<rect x="${x - w / 2 + 18 * s}" y="${top + 66 * s + i * 52 * s}" width="${(w - 36 * s) * (i % 3 === 1 ? .62 : .9)}" height="${30 * s}" rx="${6 * s}" fill="${i === (o.highlight ?? 2) ? C.acc : G.g2}" opacity="${i === (o.highlight ?? 2) ? .85 : 1}"/>`).join('');
    return `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${h}" rx="${22 * s}" fill="#fff" ${ST(5)}/>
<rect x="${x - w / 2}" y="${top}" width="${w}" height="${44 * s}" rx="${22 * s}" fill="${G.g1}"/><path d="M${x - w / 2},${top + 44 * s} h${w}" ${ST(3)}/>${rows}
${o.label ? `<text x="${x}" y="${top + 30 * s}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="${15 * s}" fill="${G.ink}">${esc(o.label)}</text>` : ''}`;
  }
  function textEl(x, y, s, o, light) {
    return `<text x="${x}" y="${y}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="${(o.size || 44) * s}" fill="${o.color || (light ? '#fff' : G.ink)}" letter-spacing="-1">${esc(o.value || o.label || '')}</text>`;
  }

  const AT = (el, t) => {
    const from = el.from || el.at || [180, 560], to = el.to || from, u = ease(seg(t, el.moveStart ?? 0, el.moveEnd ?? 1));
    return [lerp(from[0], to[0], u), lerp(from[1], to[1], u), lerp(el.scale ?? 1, el.scaleTo ?? el.scale ?? 1, u)];
  };
  const DEFAULTS = { personne: [180, 600], objet: [180, 560], produit: [180, 560], ecran: [180, 560], texte: [180, 200], logo: [180, 320] };

  function generique(t, p = {}) {
    const decor = DECORS[p.decor || 'interieur'] || DECORS.interieur, dark = p.decor === 'nuit';
    const els = p.elements || [{ type: 'personne' }];
    let inner = decor(), labels = '';
    els.forEach((raw, i) => {
      const el = { ...raw, from: raw.from || raw.at || DEFAULTS[raw.type] || [180, 560] };
      if (el.appear != null && t < el.appear) return;
      const [x, y, s] = AT(el, t), a = el.appear != null ? Math.min(1, (t - el.appear) / .12) : 1;
      let g = '';
      if (el.type === 'personne') g = person(x, y, s, el, t);
      else if (el.type === 'ecran') g = screen(x, y, s, el);
      else if (el.type === 'texte' || el.type === 'logo') g = textEl(x, y, s, el.type === 'logo' ? { size: 60, ...el } : el, dark);
      else g = object(x, y, s, el.type === 'produit' ? { fill: G.g1, ...el } : el);
      inner += `<g opacity="${a}">${g}</g>`;
      if (el.label && el.type !== 'texte' && el.type !== 'logo' && el.type !== 'ecran') labels += K.note(Math.max(14, x - 60), Math.min(626, y + 30), el.label, G.g5, 22, -3);
    });
    const c = p.camera || {}, e = ease(t);
    let cam = '';
    if (c.type === 'push-in') cam = camPush(lerp(1, c.zoom || 1.35, e), ...(c.center || [180, 400]));
    else if (c.type === 'pull-out') cam = camPush(lerp(c.zoom || 1.35, 1, e), ...(c.center || [180, 400]));
    else if (c.type === 'track' || c.type === 'pan') cam = `translate(${lerp(30, -30, e) * (c.dir === 'right' ? -1 : 1)} 0)`;
    else if (c.type === 'tilt') cam = `translate(0 ${lerp(-40, 40, e) * (c.dir === 'down' ? -1 : 1)})`;
    else if (c.type === 'orbit') cam = `rotate(${lerp(-3, 3, e)} 180 400)`;
    else if (c.type === 'handheld') cam = `translate(${Math.sin(t * 23) * 4} ${Math.cos(t * 17) * 3})`;
    const art = frame(inner + labels, { cam, rough: !dark, vig: !dark });
    let marks = '';
    els.forEach((el) => {
      if (!el.to || t > .7) return;
      const f = el.from || DEFAULTS[el.type], to = el.to, yy = (v) => Math.max(30, v - 120);
      marks += K.subjArrow(`M${f[0]},${yy(f[1])} L${lerp(f[0], to[0], .85)},${yy(lerp(f[1], to[1], .85))}`, 6);
    });
    if (p.note && t < .4) marks += K.note(p.noteAt?.[0] ?? 30, p.noteAt?.[1] ?? 120, p.note, C.subj, 24, -5);
    return { art, marks };
  }

  root.SCENES = Object.assign(root.SCENES || {}, { generique });
  root.GENERIC_HELPERS = { person, object, screen, textEl, DECORS, esc };
})(typeof window !== 'undefined' ? window : globalThis);
