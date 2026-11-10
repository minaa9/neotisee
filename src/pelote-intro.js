// Néotisse — intro « pelote de laine »
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const BG = '#F8EDE4', RED = '#A53F30', DARK = '#7A2C21', NAVY = '#202B3C';
  let raf = 0, svg = null;

  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeIn = t => t * t * t;

  function stop() {
    cancelAnimationFrame(raf);
    if (svg) svg.remove();
    svg = null;
    document.documentElement.style.overflow = '';
  }

  function play() {
    stop();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const W = innerWidth, H = innerHeight;
    const R = clamp(Math.min(W, H) * 0.075, 28, 64);
    const cy = H * 0.52;
    const ground = cy + R;
    const cx = W / 2;

    document.documentElement.scrollTop = 0;
    document.documentElement.style.overflow = 'hidden';

    svg = el('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` });
    Object.assign(svg.style, { position: 'fixed', inset: 0, zIndex: 2147483600, pointerEvents: 'none' });

    const defs = el('defs', {}, svg);
    const clip = el('clipPath', { id: 'ntBallClip2' }, defs);
    el('circle', { r: R }, clip);
    const grad = el('radialGradient', { id: 'ntBallShade', cx: '35%', cy: '30%', r: '75%' }, defs);
    el('stop', { offset: '0%', 'stop-color': '#fff', 'stop-opacity': '.28' }, grad);
    el('stop', { offset: '55%', 'stop-color': '#fff', 'stop-opacity': '0' }, grad);
    el('stop', { offset: '100%', 'stop-color': '#000', 'stop-opacity': '.28' }, grad);

    // fond laine : maille jersey + fibres
    const knit = el('pattern', { id: 'ntKnit', width: 12, height: 14, patternUnits: 'userSpaceOnUse' }, defs);
    el('rect', { width: 12, height: 14, fill: BG }, knit);
    [[3, -22], [9, 22]].forEach(([x, a]) => {
      el('ellipse', { cx: x, cy: 7, rx: 2.4, ry: 6.2, transform: `rotate(${a} ${x} 7)`,
        fill: 'rgba(165,110,80,.05)', stroke: 'rgba(140,95,70,.15)', 'stroke-width': 0.8 }, knit);
    });
    const fib = el('filter', { id: 'ntFibers', x: 0, y: 0, width: '100%', height: '100%' }, defs);
    el('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.6 0.05', numOctaves: 2, seed: 3 }, fib);
    el('feColorMatrix', { type: 'matrix', values: '0 0 0 0 .45  0 0 0 0 .30  0 0 0 0 .22  0 0 0 .5 -.17' }, fib);
    const cclip = el('clipPath', { id: 'ntCurtClip' }, defs);
    el('use', { href: '#ntCurtA' }, cclip);
    el('use', { href: '#ntCurtB' }, cclip);

    const curtain = el('path', { id: 'ntCurtA', fill: 'url(#ntKnit)' }, svg);
    const curtain2 = el('path', { id: 'ntCurtB', fill: 'url(#ntKnit)' }, svg);
    const fibers = el('g', { 'clip-path': 'url(#ntCurtClip)' }, svg);
    el('rect', { width: W, height: H, filter: 'url(#ntFibers)' }, fibers);
    const thread2 = el('path', { fill: 'none', stroke: RED, 'stroke-width': 1.4, 'stroke-linecap': 'round', opacity: 0.7 }, svg);
    const thread = el('path', { fill: 'none', stroke: RED, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, svg);
    const threadHi = el('path', { fill: 'none', stroke: 'rgba(255,255,255,.45)', 'stroke-width': 1, 'stroke-dasharray': '1.5 4' }, svg);

    // pelote
    const shadow = el('ellipse', { rx: R * 0.9, ry: R * 0.16, fill: NAVY, opacity: 0.12 }, svg);
    const ball = el('g', {}, svg);
    const spin = el('g', { 'clip-path': 'url(#ntBallClip2)' }, ball);
    el('circle', { r: R, fill: RED }, spin);
    [[0.22, 20], [0.42, -35], [0.62, 70], [0.85, 10], [0.35, 115], [0.55, -80], [0.75, 150], [0.28, 55]]
      .forEach(([k, a]) => {
        el('ellipse', { rx: R * 1.02, ry: R * k, transform: `rotate(${a})`, fill: 'none',
          stroke: DARK, 'stroke-width': Math.max(1.2, R * 0.045) }, spin);
        el('ellipse', { rx: R * 1.02, ry: R * k + R * 0.06, transform: `rotate(${a + 4})`, fill: 'none',
          stroke: 'rgba(255,215,200,.35)', 'stroke-width': Math.max(0.8, R * 0.025) }, spin);
      });
    el('circle', { r: R, fill: 'url(#ntBallShade)' }, ball);
    el('circle', { r: R - 0.5, fill: 'none', stroke: DARK, 'stroke-width': 1, opacity: 0.5 }, ball);

    document.body.appendChild(svg);

    // timeline (ms)
    const T_IN = 1500, T_HOLD = 450, T_OUT = 800, T_LIFT = 1100;
    const t1 = T_IN, t2 = t1 + T_HOLD, t3 = t2 + T_OUT, END = t3 + T_LIFT - 150;
    const startX = -R * 1.5, exitX = W + R * 2;
    const t0 = performance.now();

    const wavePts = (y, amp, phase) => {
      const pts = [];
      for (let x = -20; x <= W + 20; x += 8)
        pts.push([x, y + amp * Math.sin(x * 0.012 + phase) + amp * 0.4 * Math.sin(x * 0.031 - phase * 1.7)]);
      return pts;
    };
    const line = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');

    function frame(now) {
      const t = now - t0;
      let bx, squash = 1;

      if (t < t1) bx = startX + (cx - startX) * easeOut(t / T_IN);
      else if (t < t2) {
        bx = cx;
        squash = 1 - 0.06 * Math.sin(((t - t1) / T_HOLD) * Math.PI);
      } else bx = cx + (exitX - cx) * easeIn(clamp((t - t2) / T_OUT));

      const rot = ((bx - startX) / R) * (180 / Math.PI);
      const by = cy + R * (1 - squash);
      ball.setAttribute('transform', `translate(${bx.toFixed(1)},${by.toFixed(1)}) scale(${(2 - squash).toFixed(3)},${squash.toFixed(3)})`);
      spin.setAttribute('transform', `rotate(${rot.toFixed(1)})`);
      shadow.setAttribute('cx', bx.toFixed(1));
      shadow.setAttribute('cy', (ground + 2).toFixed(1));
      shadow.setAttribute('opacity', bx > W + R ? 0 : 0.12);

      // rideau + fil
      const liftK = clamp((t - (t3 - 250)) / T_LIFT);
      const e = easeInOut(liftK);
      const edgeY = ground + (-80 - ground) * e;
      const amp = 4 + 26 * Math.sin(e * Math.PI);
      const pts = wavePts(edgeY, liftK > 0 ? amp : 1.5, t * 0.004);

      const edgeY2 = ground + (H + 80 - ground) * e;
      const pts2 = liftK > 0 ? wavePts(edgeY2, amp * 0.7, -t * 0.004 + 1.3) : pts.map(p => [p[0], p[1] - 1]);

      let tpts = pts;
      if (bx < W + 20) tpts = pts.filter(p => p[0] <= bx);
      const d = tpts.length > 1 ? line(tpts) : '';
      thread.setAttribute('d', d);
      threadHi.setAttribute('d', d);
      thread2.setAttribute('d', liftK > 0 ? line(pts2) : '');

      const rev = pts.slice().reverse().map(p => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
      curtain.setAttribute('d', `M-20,-200L${W + 20},-200${rev}Z`);
      const rev2 = pts2.slice().reverse().map(p => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
      curtain2.setAttribute('d', `M-20,${H + 200}L${W + 20},${H + 200}${rev2}Z`);

      if (t < END) raf = requestAnimationFrame(frame);
      else stop();
    }
    raf = requestAnimationFrame(frame);
  }

  window.__ntIntro = { play, stop };

  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', play, { once: true });
  else play();
})();