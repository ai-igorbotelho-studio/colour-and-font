/* ═══════════ EDITORIAL ═══════════
   Carrosséis com passo e pontos, navegação de capítulos com destaque ao rolar,
   barra de progresso da leitura. Serve a Teoria e a qualquer página que use
   [data-carousel], .chapters ou artigos longos. */
import { $all } from './core/dom';

export function initCarousels(root: ParentNode = document): void {
  $all<HTMLElement>(root, '[data-carousel]').forEach(c => { if (c.dataset.ready) return; c.dataset.ready = '1';
    const track = c.querySelector<HTMLElement>('.track')!, items = Array.from(track.children) as HTMLElement[], dots = c.querySelector<HTMLElement>('.dots')!;
    dots.innerHTML = items.map((_, i) => `<button role="tab" aria-selected="${i === 0}" aria-label="${i + 1}"></button>`).join('');
    const go = (i: number): void => { const n = (i + items.length) % items.length; track.scrollTo({ left: items[n].offsetLeft - track.offsetLeft, behavior: 'smooth' }) };
    const cur = (): number => { const x = track.scrollLeft + 10; let best = 0; items.forEach((it, i) => { if (it.offsetLeft - track.offsetLeft <= x) best = i }); return best };
    c.querySelector('[data-car="prev"]')!.addEventListener('click', () => go(cur() - 1));
    c.querySelector('[data-car="next"]')!.addEventListener('click', () => go(cur() + 1));
    $all<HTMLButtonElement>(dots, 'button').forEach((d, i) => d.onclick = () => go(i));
    let h = 0; track.addEventListener('scroll', () => { clearTimeout(h); h = window.setTimeout(() => { const k = cur(); $all(dots, 'button').forEach((d, i) => d.setAttribute('aria-selected', String(i === k))) }, 60) }, { passive: true });
    track.addEventListener('keydown', ev => { if (ev.key === 'ArrowRight') { ev.preventDefault(); go(cur() + 1) } if (ev.key === 'ArrowLeft') { ev.preventDefault(); go(cur() - 1) } });
  });
}
export function initChapters(): void {
  const nav = document.querySelector<HTMLElement>('.chapters'); if (!nav) return;
  const links = $all<HTMLAnchorElement>(nav, 'a'), secs = links.map(a => document.querySelector<HTMLElement>(a.getAttribute('href')!)).filter((x): x is HTMLElement => !!x);
  links.forEach(a => a.addEventListener('click', ev => { const t = document.querySelector<HTMLElement>(a.getAttribute('href')!); if (!t) return; ev.preventDefault();
    t.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }) }));
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => { es.forEach(e => { if (!e.isIntersecting) return; const id = '#' + e.target.id;
    links.forEach(a => { const on = a.getAttribute('href') === id; a.classList.toggle('on', on);
      if (on) { const tr = a.parentElement!; tr.scrollTo({ left: a.offsetLeft - tr.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' }) } }) }) }, { rootMargin: '-30% 0px -60% 0px' });
  secs.forEach(s => io.observe(s));
}
export function initProgress(): void {
  const bar = document.createElement('div'); bar.id = 'progress'; bar.setAttribute('aria-hidden', 'true'); document.body.appendChild(bar);
  let tick = false; const run = (): void => { tick = false; const h = document.documentElement.scrollHeight - innerHeight; bar.style.setProperty('--pg', h > 0 ? String(Math.min(1, scrollY / h)) : '0') };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(run) } }, { passive: true }); addEventListener('resize', run); run();
}
export function initEditorial(): void { initCarousels(); initChapters(); initProgress() }
