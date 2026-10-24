/* Planche + image d'animatic générées depuis storyboard.json. Dépend de sketch.js, scenes.js, generique.js.
   Les plans arrivent normalisés par build.mjs (start, end, camera, panels). */
(function (root) {
  const K = root.Sketch, SC = root.SCENES, { C, cl, ease } = K;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = (x) => (Math.round(x * 10) / 10).toFixed(1).replace('.', ',') + ' s';
  const PANEL_T = { 1: [0.5], 2: [0.03, 0.97], 3: [0.03, 0.5, 0.97] };
  const scene = (s) => SC[s.scene] || SC.generique;
  const draw = (s, t) => scene(s)(t, { camera: s.camera, ...(s.params || {}) });

  function cameraMarks(sh, j) {
    const c = sh.camera || {}, z = String(c.zoom || 1.4).replace('.', ',');
    switch (c.type) {
      case 'push-in': return j === 0 ? K.pushFrame(c.zoom || 1.4, 176, 420) + K.label(14, 628, 'PUSH-IN ×' + z, C.cam)
        : K.camArrow('M24,24 L64,74', 6) + K.camArrow('M336,24 L296,74', 6);
      case 'pull-out': return K.camArrow('M84,104 L30,40', 6) + K.camArrow('M276,104 L330,40', 6) + K.camArrow('M84,536 L30,600', 6) + K.camArrow('M276,536 L330,600', 6) + (j === 0 ? K.label(14, 628, 'PULL-OUT ×' + z, C.cam) : '');
      case 'track': case 'pan': {
        const d = c.dir === 'right' ? 'M60,628 L300,628' : 'M300,628 L60,628', w = c.type === 'track' ? 'TRACKING' : 'PAN';
        return K.camArrow(d, 8) + (j === 0 ? K.label(14, 40, c.dir === 'right' ? w + ' ►' : '◄ ' + w, C.cam) : '');
      }
      case 'tilt': return K.camArrow(c.dir === 'down' ? 'M340,80 Q356,320 340,560' : 'M340,560 Q356,320 340,80', 8) + (j === 0 ? K.label(14, 40, c.dir === 'down' ? 'TILT ▼' : 'TILT ▲', C.cam) : '');
      case 'orbit': return K.camArrow('M40,606 Q180,672 320,596', 8) + (j === 0 ? K.label(14, 40, 'ORBIT ↻', C.cam) : '');
      case 'handheld': return K.camArrow('M30,610 q20,-14 40,0 t40,0 t40,0', 6) + (j === 0 ? K.label(14, 40, 'CAMÉRA À L’ÉPAULE', C.cam, 17) : '');
      default: return j === 0 ? K.label(14, 40, sh.tag === 'Motion' ? 'FIXE · MOTION' : 'FIXE', C.cam, 17) : '';
    }
  }
  const textMarks = (sh, t) => (sh.text && !sh.text.inScene && t >= (sh.text.from || 0) ? K.sup(esc(sh.text.value), 170) : '');

  function row(s) {
    const n = s.panels, ts = PANEL_T[n] || PANEL_T[3], names = n === 1 ? ['Plan'] : n === 2 ? ['Début', 'Fin'] : ['Début', 'Milieu', 'Fin'];
    const pn = ts.map((t, j) => {
      const sc = draw(s, t);
      return `<div class="pnl"><div class="frame">${sc.art}${K.overlay(sc.marks + cameraMarks(s, j) + textMarks(s, t))}</div>
<div class="cap"><b>${s.id}${n === 1 ? '' : 'abc'[j]} · ${names[j]}</b><span class="tcx">${fmt(s.start + (s.end - s.start) * t)}</span></div></div>`;
    }).join('<div class="tri">›</div>');
    const dl = [['Caméra', esc(s.camera.label || s.camera.type)], ['Action', esc(s.action)], s.voice && ['Voix', `<span class="vo">« ${esc(s.voice.value)} »</span>`],
      s.text && ['Texte', `<span class="sup">${esc(s.text.value)}</span>`], s.sound && ['Son', esc(s.sound)]].filter((x) => x && x[1])
      .map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('');
    const warn = (s.warnings || []).map((w) => `<div class="warn">⚠ ${esc(w)}</div>`).join('');
    return `<section class="row${s.changed ? ' changed' : ''}" id="plan-${esc(s.id)}"><div class="id"><div class="num">${String(s.id).padStart(2, '0')}</div><div class="tc">${fmt(s.start)} → ${fmt(s.end)}</div><div class="dur">${fmt(s.end - s.start)}</div><span class="tag ${s.tag === 'Motion' ? 'motion' : ''}">${esc(s.tag)}</span>${s.changed ? '<span class="tag chg">modifié</span>' : ''}</div>
<div class="pnls">${pn}</div><div class="notes"><h3>${esc(s.title)}</h3><dl>${dl}</dl>${warn}<div class="tr">Transition <b>→ ${esc(s.transition || 'Cut')}</b></div></div></section>`;
  }

  function renderBoard(sb, el, only) {
    const cols = ['#3a3936', '#55524d', '#6f6b65', '#1d2f5a', '#0f1b36'];
    const tl = sb.shots.map((s, i) => `<div style="flex:${s.end - s.start};background:${cols[i % cols.length]}"><b>${esc(s.id)}</b>&nbsp;${esc(s.title)}<span>${fmt(s.start)}</span></div>`).join('');
    const shots = only && only.length ? sb.shots.filter((s) => only.includes(String(s.id))) : sb.shots;
    const gw = (sb.warnings || []).map((w) => `<div class="warn">⚠ ${esc(w)}</div>`).join('');
    el.innerHTML = `<header><div><div class="kicker">Clapova · ${esc(sb.style || 'croquis code, 0 crédit')}</div><h1>${esc(sb.title)}<small>${esc(sb.subtitle || '')}</small></h1></div>
<div class="meta"><span>Format<b>${esc(sb.format.ratio)} · ${sb.format.width}×${sb.format.height}</b></span><span>Durée<b>${fmt(sb.duration)} · ${sb.shots.length} plans</b></span><span>Version<b>${esc(sb.version || 'v1')}</b></span></div></header>
<div class="legend"><span><i style="background:${C.cam}"></i>Caméra (au bord)</span><span><i style="background:${C.subj}"></i>Sujet / action (dans l'image)</span><span><i class="dash"></i>Cadre d'arrivée</span><span><i class="kf"></i>Keyframe motion</span><span class="hand">notes manuscrites = intention</span></div>
<div class="timeline">${tl}</div>${gw}${only && only.length ? `<div class="warn info">Extrait : plan(s) ${esc(only.join(', '))} seulement</div>` : ''}${shots.map(row).join('')}
<footer><span>Croquis 100 % code (SVG), aucune IA, 0 crédit · généré depuis storyboard.json</span><span>Clapova · storyboard</span></footer>`;
  }

  /* Animatic : image complète à l'instant T (secondes). */
  function renderFrame(sb, T, el) {
    const sh = sb.shots.find((x) => T < x.end) || sb.shots[sb.shots.length - 1];
    const t = cl((T - sh.start) / (sh.end - sh.start));
    let h = draw(sh, t).art;
    if (sh.text && !sh.text.inScene && t >= (sh.text.from || 0)) { const a = cl((t - (sh.text.from || 0)) / .12); h += `<div class="sup" style="opacity:${a};transform:translateY(${(1 - ease(a)) * 30}px) scale(${.92 + .08 * ease(a)})">${esc(sh.text.value)}</div>`; }
    if (sh.voice && t >= (sh.voice.from || 0)) { const a = cl((t - (sh.voice.from || 0)) / .08); h += `<div class="vo" style="opacity:${a}">« ${esc(sh.voice.value)} »</div>`; }
    const i = sb.shots.indexOf(sh), next = sb.shots[i + 1], fade = (x) => /fondu|fade|dissolve/i.test(x.transition || '');
    const d = 0.2 / (sh.end - sh.start);
    if (fade(sh) && next && t > 1 - d) h += `<div class="fade" style="opacity:${cl((t - (1 - d)) / d)}"></div>`;
    if (i > 0 && fade(sb.shots[i - 1]) && t < d) h += `<div class="fade" style="opacity:${1 - t / d}"></div>`;
    h += `<div class="tc">P${esc(sh.id)} · ${esc(String(sh.camera.type).toUpperCase())} · ${T.toFixed(2).replace('.', ',')} s</div>`;
    el.innerHTML = h;
  }

  root.Board = { renderBoard, renderFrame };
})(typeof window !== 'undefined' ? window : globalThis);
