/* ═══════════ MOVIMENTO ═══════════
   Revelação ao rolar, paralaxe leve, inclinação ao ponteiro, lupa com zoom e
   arrasto. Tudo em requestAnimationFrame, com escutas passivas, e nada disso
   roda quando a pessoa pediu menos movimento. */
import './styles/motion.css';
import { t } from './i18n';

const REVEAL = '.stage > div, .homecard, .magcard, .mock, .card, .prop, .fontcard, .magmusic, .magrefs, .mocksec > *, .hero > *';
const TILT = '.homecard, .magopen, .mock';
const ZOOM = '.mockimg, .bnr, .v-poster, .v-ui, .spec';

export function initMotion(): void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  initZoom();
  if (reduce) return;
  initReveal(); initParallax(); initTilt(); initMagnet();
}

/* ── revelação ── */
function initReveal(): void {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -6% 0px', threshold: .08 });
  const seen = new WeakSet<Element>();
  const scan = (root: ParentNode = document): void => {
    root.querySelectorAll<HTMLElement>(REVEAL).forEach((el, i) => { if (seen.has(el)) return; seen.add(el);
      const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0 && document.readyState === 'complete' && performance.now() > 2500) return; // já visível: não esconder
      el.classList.add('rv'); el.dataset.d = String(i % 5); io.observe(el) });
  };
  scan();
  let h = 0; const mo = new MutationObserver(() => { clearTimeout(h); h = window.setTimeout(() => scan(), 40) });
  mo.observe(document.body, { childList: true, subtree: true });
  // rede de segurança: nada fica invisível se o observador não disparar
  setInterval(() => document.querySelectorAll('.rv:not(.in)').forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight * 1.1 && r.bottom > -50) el.classList.add('in') }), 900);
}

/* ── paralaxe: o título da página desce mais devagar que a rolagem ── */
function initParallax(): void {
  const mark = (): void => document.querySelectorAll<HTMLElement>('.hero h1, .hero .lede, .maghead h1, .maghead .dek').forEach((el, i) => { if (!el.dataset.plx) el.dataset.plx = String(i % 2 ? .06 : .1) });
  mark(); new MutationObserver(mark).observe(document.body, { childList: true, subtree: true });
  let tick = false;
  const run = (): void => { tick = false; const y = scrollY;
    document.querySelectorAll<HTMLElement>('[data-plx]').forEach(el => { const f = +el.dataset.plx!; const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) return; el.style.setProperty('--plx', (Math.min(y, 900) * f).toFixed(1) + 'px') }) };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(run) } }, { passive: true }); run();
}

/* ── inclinação: só com ponteiro fino e hover real ── */
function initTilt(): void {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.addEventListener('pointermove', ev => { const el = (ev.target as Element).closest<HTMLElement>(TILT); if (!el) return; el.classList.add('tilt');
    const r = el.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
    el.style.setProperty('--ry', (x * 5).toFixed(2) + 'deg'); el.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg') }, { passive: true });
  document.addEventListener('pointerout', ev => { const el = (ev.target as Element).closest<HTMLElement>(TILT); if (!el || el.contains(ev.relatedTarget as Node)) return;
    el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg') }, { passive: true });
}

/* ── lupa: clique numa imagem abre em tela cheia; roda, pinça, botões e arrasto ── */
function initZoom(): void {
  const z = document.createElement('div'); z.id = 'zoom'; z.hidden = true; z.setAttribute('role', 'dialog'); z.setAttribute('aria-modal', 'true'); z.setAttribute('aria-label', t('Ampliar'));
  z.innerHTML = `<div class="zwrap"><div class="zin"></div></div>
    <div class="zbar"><button data-z="-" aria-label="${t('Reduzir')}">−</button><button data-z="0" aria-label="${t('Tamanho original')}">1:1</button><button data-z="+" aria-label="${t('Ampliar')}">+</button></div>
    <button class="zclose" aria-label="${t('Fechar')}">×</button>`;
  document.body.appendChild(z);
  const inner = z.querySelector<HTMLElement>('.zin')!, wrap = z.querySelector<HTMLElement>('.zwrap')!;
  let s = 1, x = 0, y = 0, last: Element | null = null;
  const apply = (): void => { inner.style.setProperty('--zs', s.toFixed(3)); inner.style.setProperty('--zx', x.toFixed(0) + 'px'); inner.style.setProperty('--zy', y.toFixed(0) + 'px') };
  const setS = (v: number, cx = 0, cy = 0): void => { const n = Math.min(6, Math.max(.5, v)); x = cx - (cx - x) * (n / s); y = cy - (cy - y) * (n / s); s = n; apply() };
  const open = (src: Element): void => { last = document.activeElement; inner.innerHTML = '';
    const svg = src.querySelector('svg'); if (svg) inner.appendChild(svg.cloneNode(true)); else { const c = src.cloneNode(true) as HTMLElement; c.style.cssText += ';width:min(92vw,900px);max-height:80vh;overflow:auto;padding:24px'; inner.appendChild(c) }
    s = 1; x = 0; y = 0; apply(); z.hidden = false; document.body.style.overflow = 'hidden'; z.querySelector<HTMLButtonElement>('.zclose')!.focus() };
  const close = (): void => { z.hidden = true; document.body.style.overflow = ''; inner.innerHTML = ''; if (last instanceof HTMLElement) last.focus() };
  document.addEventListener('click', ev => { const tg = ev.target as Element; if (tg.closest('button, a, input, select, textarea, .cell, .pick')) return;
    const src = tg.closest<HTMLElement>(ZOOM); if (src && !z.contains(src)) { ev.preventDefault(); open(src) } });
  z.querySelector('.zclose')!.addEventListener('click', close);
  z.addEventListener('click', ev => { if (ev.target === z) close() });
  z.querySelectorAll<HTMLButtonElement>('[data-z]').forEach(b => b.onclick = () => { const k = b.dataset.z; if (k === '0') { s = 1; x = 0; y = 0; apply() } else setS(s * (k === '+' ? 1.25 : .8)) });
  addEventListener('keydown', ev => { if (z.hidden) return; if (ev.key === 'Escape') close(); if (ev.key === '+' || ev.key === '=') setS(s * 1.25); if (ev.key === '-') setS(s * .8) });
  wrap.addEventListener('wheel', ev => { ev.preventDefault(); const r = wrap.getBoundingClientRect(); setS(s * (ev.deltaY < 0 ? 1.1 : .9), ev.clientX - r.left - r.width / 2, ev.clientY - r.top - r.height / 2) }, { passive: false });
  // arrasto e pinça com pointer events
  const pts = new Map<number, { x: number; y: number }>(); let d0 = 0, s0 = 1, px = 0, py = 0;
  wrap.addEventListener('pointerdown', ev => { wrap.setPointerCapture(ev.pointerId); pts.set(ev.pointerId, { x: ev.clientX, y: ev.clientY }); px = ev.clientX - x; py = ev.clientY - y;
    if (pts.size === 2) { const [a, b] = [...pts.values()]; d0 = Math.hypot(a.x - b.x, a.y - b.y); s0 = s } });
  wrap.addEventListener('pointermove', ev => { if (!pts.has(ev.pointerId)) return; pts.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (pts.size === 2) { const [a, b] = [...pts.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); if (d0) { s = Math.min(6, Math.max(.5, s0 * d / d0)); apply() } }
    else if (pts.size === 1) { x = ev.clientX - px; y = ev.clientY - py; apply() } });
  const up = (ev: PointerEvent): void => { pts.delete(ev.pointerId); if (pts.size < 2) d0 = 0 };
  wrap.addEventListener('pointerup', up); wrap.addEventListener('pointercancel', up);
  wrap.addEventListener('dblclick', () => { if (s > 1.01) { s = 1; x = 0; y = 0; apply() } else setS(2) });
}

/* ── botões principais seguem levemente o ponteiro ── */
function initMagnet(): void {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.addEventListener('pointermove', ev => { const b = (ev.target as Element).closest<HTMLElement>('button.act'); if (!b) return;
    const r = b.getBoundingClientRect(); b.style.transform = `translate(${((ev.clientX - r.left) / r.width - .5) * 8}px,${((ev.clientY - r.top) / r.height - .5) * 6}px) scale(1.02)` }, { passive: true });
  document.addEventListener('pointerout', ev => { const b = (ev.target as Element).closest<HTMLElement>('button.act'); if (b && !b.contains(ev.relatedTarget as Node)) b.style.transform = '' }, { passive: true });
}
