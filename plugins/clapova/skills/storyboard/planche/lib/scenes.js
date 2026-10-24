/* Modèles de scènes paramétrables, composés à partir des primitives de sketch.js.
   Chaque modèle : (t in 0..1, params) => { art: <svg plein cadre>, marks: <svg d'annotations, planche seulement> }.
   La caméra (push-in, tracking, orbit) est appliquée DANS la scène pour que l'animatic bouge vraiment. */
(function (root) {
  const K = root.Sketch;
  const { G, C, lerp, cl, ease, easeOut, seg, ST, frame, camPush } = K;

  const SCENES = {
    /* Tasse de café froid sur une table, push-in */
    'cafe-froid': (t, p = {}) => {
      const z = lerp(1, p.zoom || 1.45, ease(t)), cx = 176, cy = 420;
      const vp = [180, 250];
      const planks = [-260, -170, -80, 10, 100, 190, 280, 370, 460].map((x) => `<path d="M${x},640 L${lerp(x, vp[0], .55)},392" stroke="${G.g4}" stroke-width="2" opacity=".5"/>`).join('');
      const art = frame(`
<rect width="360" height="400" fill="${G.g2}"/>
<rect x="214" y="58" width="118" height="196" fill="${G.g1}" ${ST(3.4)}/><path d="M273,58 v196 M214,156 h118" ${ST(3)}/>
<path d="M214,254 L120,400 L190,400 L332,254 Z" fill="#fff" opacity=".45"/>
<rect width="214" height="392" fill="url(#hatchL)" opacity=".7"/>
<circle cx="86" cy="132" r="40" fill="${G.g1}" ${ST(3.4)}/><path d="M86,132 L86,104 M86,132 L104,142" ${ST(3.4)}/>
${[0, 1, 2, 3].map((i) => `<path d="M${86 + 33 * Math.cos(i * Math.PI / 2)},${132 + 33 * Math.sin(i * Math.PI / 2)} L${86 + 38 * Math.cos(i * Math.PI / 2)},${132 + 38 * Math.sin(i * Math.PI / 2)}" ${ST(2.4)}/>`).join('')}
<path d="M0,392 L360,392 L360,640 L0,640 Z" fill="${G.g3}"/>${planks}
<path d="M0,392 L360,392" ${ST(4.5)}/><path d="M0,400 L360,400" stroke="${G.g5}" stroke-width="6" opacity=".4"/>
<path d="M44,560 l26,-8 l20,10 l-24,10 z" fill="${G.g1}" ${ST(2.4)}/>
${K.mug(176, 520, 1.12, { cold: true })}
<path d="M262,560 q30,-6 58,4" fill="none" ${ST(5)}/><ellipse cx="322" cy="565" rx="9" ry="5" fill="${G.g2}" ${ST(2.4)}/>`, { cam: camPush(z, cx, cy) });
      const marks = `${K.subjArrow('M300,300 Q250,330 222,384', 6)}${K.note(222, 292, 'plus de vapeur', C.subj, 25, -6)}`;
      return { art, marks };
    },

    /* Main qui sort la gourde d'un sac, tracking latéral avec parallaxe */
    'main-sac': (t, p = {}) => {
      const e = ease(t), tx = lerp(p.trackFrom ?? 34, p.trackTo ?? -34, e);
      const reach = easeOut(seg(t, 0, .4)), open = 1 - seg(t, .32, .46), lift = ease(seg(t, .46, 1)) * 175;
      const bx = 196, by = 592 - lift, s = .92, g = K.bottleGeom(bx, by, s);
      const gx = g.grip.x, gy = g.top + 34 * s;
      const hx = lerp(gx + 70, gx, reach), hy = lerp(gy - 150, gy, reach);
      const b = K.bag(190, 606, 1.02);
      const bgPanels = [0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${-80 + i * 80}" y="0" width="38" height="420" fill="${G.g2}" opacity=".75"/>`).join('');
      const art = frame(`
<g transform="translate(${tx * 1.7} 0)"><rect x="-120" width="600" height="440" fill="${G.g3}"/>${bgPanels}<rect x="-120" width="600" height="440" fill="url(#hatchL)"/></g>
<path d="M-60,440 L420,440 L420,640 L-60,640 Z" fill="${G.g4}"/><path d="M-60,440 L420,440" ${ST(4.5)}/>
<path d="M-60,470 L420,470" stroke="${G.g5}" stroke-width="3" opacity=".5"/>
${b.back}${K.bottle(bx, by, s).svg}${K.hand(hx, hy, g.grip.w, { s: 1.05, rot: lerp(-34, -12, reach), open, arm: 190 })}${b.front}`, { cam: `translate(${tx} 0)` });
      const marks = t < .4 ? K.subjArrow('M318,96 Q262,150 238,236', 6) + K.note(250, 84, 'la main plonge', C.subj, 24, -4)
        : t < .7 ? K.subjArrow(`M${gx - 66},${gy + 40} L${gx - 66},${gy - 80}`, 7) + K.note(30, gy - 92, 'on tire', C.subj, 25, -6)
          : K.subjArrow(`M${gx - 70},${gy + 20} L${gx - 70},${gy - 90}`, 7);
      return { art, marks };
    },

    /* Ouverture du bouchon, vapeur, orbit en contre-plongée */
    'ouverture-vapeur': (t, p = {}) => {
      const e = ease(t), spin = lerp(p.spinFrom ?? -.8, p.spinTo ?? .8, e), tilt = spin * 3.2;
      const capOff = ease(seg(t, .18, .62)), twist = seg(t, 0, .2) * 0;
      const bx = 178, by = 618, s = 1.42, taper = .13;
      const g = K.bottleGeom(bx, by, s, { capOff, taper, capTwist: twist });
      const st = seg(t, .4, .85), cap = g.cap;
      const stripes = [0, 1, 2].map((i) => `<path d="M${-60 + i * 150 - spin * 90},0 L${40 + i * 150 - spin * 90},640" stroke="#fff" stroke-width="${46 - i * 10}" opacity=".16"/>`).join('');
      const art = frame(`
<rect width="360" height="640" fill="${G.g5}"/>
<path d="M0,0 L360,0 L360,${520 + tilt * 8} L0,${520 - tilt * 8} Z" fill="${G.g4}"/>
${[1, 2, 3, 4, 5].map((i) => `<path d="M${-40 + i * 80 - spin * 40},0 L${180 + (i - 3) * 20 - spin * 10},${520}" stroke="${G.g5}" stroke-width="2" opacity=".45"/>`).join('')}
${stripes}
<path d="M0,${520 - tilt * 8} L360,${520 + tilt * 8}" ${ST(4.5)}/>
<path d="M0,${520 - tilt * 8} L360,${520 + tilt * 8} L360,640 L0,640 Z" fill="${G.g3}"/><rect y="520" width="360" height="120" fill="url(#hatch)" opacity=".6"/>
${K.steam(bx, g.top - 16 * s, st, t, { n: 3, height: 250, spread: 18, width: 16 })}
${K.bottle(bx, by, s, { capOff, taper, spin }).svg}
${K.hand(bx, g.top + 150 * s, lerp(g.w, g.wt, .3), { s: 1.12, side: 'left', rot: 6, arm: 160, sleeve: G.g5 })}
${K.hand(cap.x, cap.y, cap.w, { s: 1.0, rot: cap.rot - 10, arm: 170 })}`, { cam: `rotate(${spin * 2.5} 180 400)` });
      const marks = t < .3 ? K.subjArrow(`M${cap.x - 52},${cap.y + 30} Q${cap.x - 64},${cap.y - 40} ${cap.x - 8},${cap.y - 52}`, 6) + K.note(20, cap.y - 64, 'dévisse', C.subj, 26, -6)
        : t < .7 ? K.subjArrow(`M${cap.x + 70},${cap.y + 20} L${cap.x + 100},${cap.y - 50}`, 6) + K.note(cap.x - 40, cap.y - 80, 'pop !', C.subj, 28, -8)
          : K.subjArrow(`M70,330 Q60,230 110,170`, 6) + K.note(22, 160, 'la vapeur monte', C.subj, 24, -6);
      return { art, marks };
    },

    /* Compteur motion design : anneau + chiffre, keyframes paramétrables */
    'compteur': (t, p = {}) => {
      const keys = p.keys || [[0, 0], [.7, 12]], unit = p.unit || 'h';
      const u = seg(t, keys[0][0], keys[keys.length - 1][0]);
      const v = Math.round(lerp(keys[0][1], keys[keys.length - 1][1], easeOut(u)));
      const pr = v / (keys[keys.length - 1][1] || 1), R = 112, cx = 180, cy = 280;
      const lab = easeOut(seg(t, .55, .8)), sub = seg(t, .72, .92);
      const ticks = Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2 - Math.PI / 2, on = i < v; return `<line x1="${cx + Math.cos(a) * (R + 22)}" y1="${cy + Math.sin(a) * (R + 22)}" x2="${cx + Math.cos(a) * (R + 32)}" y2="${cy + Math.sin(a) * (R + 32)}" stroke="${on ? C.acc : '#3a4d7c'}" stroke-width="4" stroke-linecap="round"/>`; }).join('');
      const art = frame(`
<rect width="360" height="640" fill="url(#night)"/>
<path d="M150,600 L150,420 Q150,400 170,400 L190,400 Q210,400 210,420 L210,600" fill="none" stroke="#2c3f6c" stroke-width="2" opacity=".7"/>
<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#24365f" stroke-width="16"/>
<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.acc}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${(2 * Math.PI * R * pr).toFixed(1)} 999" transform="rotate(-90 ${cx} ${cy})"/>
<circle cx="${cx}" cy="${cy}" r="${R + 2}" fill="none" stroke="${C.acc}" stroke-width="30" opacity="${.12 * pr}" filter="url(#soft)"/>
${ticks}
<text x="${cx}" y="${cy + 34}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="104" fill="#fff" letter-spacing="-4">${v}<tspan font-size="46" dx="6" font-weight="700">${unit}</tspan></text>
<g opacity="${lab}" transform="translate(0 ${lerp(26, 0, lab)})"><text x="180" y="478" text-anchor="middle" font-family="Inter" font-weight="800" font-size="40" fill="#fff">${p.label || 'de chaud'}</text></g>
<text x="180" y="518" text-anchor="middle" font-family="Inter" font-weight="500" font-size="17" fill="#9fb0d6" opacity="${sub}">${p.sub || ''}</text>`, { rough: false, vig: false });
      const marks = K.keyTrack([[0, `${keys[0][1]}${unit}`], [keys[keys.length - 1][0] * .5, '6' + unit], [keys[keys.length - 1][0], `${keys[keys.length - 1][1]}${unit}`], [.86, 'label']], t, { y: 608 })
        + (t < .4 ? K.note(236, 120, 'ease-out', C.acc, 26, -6) : '');
      return { art, marks };
    },

    /* Packshot : gourde produit, révélation du logo (masque), trait, URL */
    'packshot': (t, p = {}) => {
      const a = easeOut(seg(t, 0, .3)), wipe = ease(seg(t, .22, .52)), line = ease(seg(t, .48, .66)), url = seg(t, .62, .8);
      const ls = lerp(26, 10, ease(seg(t, .22, .7))), sweep = seg(t, .1, .55);
      const wl = K.uid('wl'), b = K.bottle(180, 548 + lerp(40, 0, a), 1.02, { palette: 'product', spin: lerp(-.4, .1, a) });
      const art = frame(`
<rect width="360" height="640" fill="url(#night)"/>
<ellipse cx="180" cy="300" rx="150" ry="230" fill="#2f4a8a" opacity=".35" filter="url(#soft)"/>
<ellipse cx="180" cy="556" rx="${lerp(40, 92, a)}" ry="14" fill="#000" opacity=".45" filter="url(#soft)"/>
<g opacity="${a}">${b.svg}</g>
<path d="M${lerp(60, 300, sweep)},250 l26,0 l-60,330 l-26,0 z" fill="#fff" opacity="${.35 * Math.sin(sweep * Math.PI)}"/>
<clipPath id="${wl}"><rect x="0" y="40" width="${360 * wipe}" height="120"/></clipPath>
<g clip-path="url(#${wl})"><text x="${180 + ls * 2}" y="126" text-anchor="middle" font-family="Inter" font-weight="800" font-size="66" fill="#fff" letter-spacing="${ls}">${p.logo || 'NOVA'}</text></g>
<line x1="${180 - 70 * line}" y1="150" x2="${180 + 70 * line}" y2="150" stroke="${C.acc}" stroke-width="5" stroke-linecap="round"/>
<text x="180" y="186" text-anchor="middle" font-family="Inter" font-weight="500" font-size="17" fill="#b9c6e4" opacity="${url}">${p.tagline || ''}</text>
<text x="180" y="610" text-anchor="middle" font-family="Inter" font-weight="700" font-size="24" fill="${C.acc}" opacity="${url}" transform="translate(0 ${lerp(12, 0, url)})">${p.url || ''}</text>`, { rough: false, vig: false });
      const marks = K.keyTrack([[0, 'gourde'], [.22, 'logo'], [.48, 'trait'], [.62, 'url']], t, { y: 250 })
        + (t > .15 && t < .6 ? K.subjArrow('M70,74 L290,74', 6) + K.note(200, 52, 'masque →', C.acc, 24, -4) : '');
      return { art, marks };
    },
  };

  root.SCENES = SCENES;
})(typeof window !== 'undefined' ? window : globalThis);
