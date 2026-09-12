/* ═══════════ CONTEÚDOS — revista ═══════════
   Lista com filtros por tema e busca em todo o texto; cada artigo abre com
   leitura em voz (vozes do próprio aparelho, sem serviço externo), ajustes de
   leitura, downloads em MD, TXT, DOC e impressão em PDF, partilha, música de
   fundo, referências, estratégia SEO visível e o aviso de coautoria.
   Endereço de cada artigo: #c/<slug>, para partilhar e para os buscadores. */
import { $, $all, esc, download, copy, toast } from '../core/dom';
import { t, isEn, locale } from '../i18n';
import { ARTICLES, TOPICS, type Article, type ArticleText, type Topic } from '../data/articles';
import { goto } from '../nav';

const L = (a: Article): ArticleText => isEn() ? a.en : a.pt;
const fmtDate = (d: string): string => new Date(d + 'T12:00:00').toLocaleDateString(locale(), { day: 'numeric', month: 'long', year: 'numeric' });
const norm = (s: string): string => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const plain = (s: string): string => s.replace(/^##\s+/gm, '').replace(/^>\s+/gm, '').replace(/\*\*?([^*]+)\*\*?/g, '$1').replace(/\s\[\d+\]/g, '');
const url = (a: Article): string => location.origin + location.pathname + '#c/' + a.slug;
const ST = { topics: new Set<Topic>(), q: '', open: null as string | null, scale: 1, dys: false };
try { ST.scale = +(localStorage.getItem('fk-artscale') || 1) || 1; ST.dys = localStorage.getItem('fk-artdys') === '1' } catch (_) {}

/** Marcação mínima → HTML: ## seção, > citação, parágrafos, **negrito**, *itálico*, [n] referência. */
export function mdHtml(body: string): string {
  const inline = (s: string): string => esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\s\[(\d+)\]/g, ' <sup class="ref"><a href="#ref-$1" aria-label="' + t('referência {n}', { n: '$1' }) + '">$1</a></sup>');
  return body.split(/\n\s*\n/).map(p => { p = p.trim(); if (!p) return '';
    if (p.startsWith('## ')) return `<h2>${inline(p.slice(3))}</h2>`;
    if (p.startsWith('> ')) return `<blockquote class="pull">${inline(p.slice(2))}</blockquote>`;
    return `<p>${inline(p)}</p>` }).join('\n');
}
function matches(a: Article): boolean {
  if (ST.topics.size && !a.topics.some(k => ST.topics.has(k))) return false;
  if (!ST.q) return true; const x = L(a), hay = norm([x.title, x.dek, x.kicker, plain(x.body), x.refs.map(r => r.n).join(' ')].join(' '));
  return ST.q.split(/\s+/).filter(Boolean).every(w => hay.includes(norm(w)));
}
const topicName = (k: Topic): string => { const tp = TOPICS.find(x => x.k === k)!; return isEn() ? tp.en : tp.pt };

function drawList(): void {
  const list = ARTICLES.filter(matches).sort((a, b) => b.date.localeCompare(a.date));
  $('magTopics').innerHTML = TOPICS.map(tp => `<button class="pill" data-k="${tp.k}" aria-pressed="${ST.topics.has(tp.k)}">${esc(isEn() ? tp.en : tp.pt)}</button>`).join('');
  $all<HTMLButtonElement>($('magTopics'), 'button').forEach(b => b.onclick = () => { const k = b.dataset.k as Topic; if (ST.topics.has(k)) ST.topics.delete(k); else ST.topics.add(k); drawList() });
  $('magCount').textContent = list.length === 1 ? t('1 artigo') : t('{n} artigos', { n: list.length });
  $('magList').innerHTML = list.length ? list.map((a, i) => { const x = L(a); return `<article class="magcard${i === 0 ? ' lead' : ''}" data-tone="${['accent', 'card', 'deep', 'ink', 'card'][i % 5]}">
      <button class="magopen" data-s="${a.slug}">
        <span class="kicker">${esc(x.kicker)}</span>
        <span class="magtitle">${esc(x.title)}</span>
        <span class="magdek">${esc(x.dek)}</span>
        <span class="magmeta"><time datetime="${a.date}">${esc(fmtDate(a.date))}</time> · ${t('{n} min de leitura', { n: a.min })} · ${a.topics.map(topicName).join(', ')}</span>
      </button></article>` }).join('') : `<p class="sm">${t('Nada encontrado com esses filtros.')}</p>`;
  $all<HTMLButtonElement>($('magList'), '.magopen').forEach(b => b.onclick = () => open(b.dataset.s!));
}

/* ── SEO: título, descrição, canônico e dados estruturados do artigo aberto ── */
const BASE_TITLE = document.title;
function meta(name: string, attr: 'name' | 'property', content: string | null): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (content === null) { if (el && el.dataset.art) el.remove(); return }
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); el.dataset.art = '1'; document.head.appendChild(el) }
  el.content = content;
}
function applySeo(a: Article | null): void {
  const old = document.getElementById('ldArticle'); if (old) old.remove();
  const can = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!a) { document.title = BASE_TITLE; meta('description', 'name', null); meta('og:title', 'property', null); meta('og:description', 'property', null); if (can && can.dataset.art) can.remove(); return }
  const x = L(a); document.title = x.seo.title + ' · Auge';
  meta('description', 'name', x.seo.desc); meta('og:title', 'property', x.seo.title); meta('og:description', 'property', x.seo.desc); meta('og:type', 'property', 'article');
  const c = can || Object.assign(document.createElement('link'), { rel: 'canonical' }); c.href = url(a); c.dataset.art = '1'; if (!can) document.head.appendChild(c);
  const ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ldArticle';
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: x.title, description: x.seo.desc, datePublished: a.date, inLanguage: isEn() ? 'en-GB' : 'pt-BR',
    keywords: [x.seo.kw, ...a.topics.map(topicName)].join(', '), author: { '@type': 'Organization', name: 'Auge' }, publisher: { '@type': 'Organization', name: 'Auge' }, mainEntityOfPage: url(a), wordCount: plain(x.body).split(/\s+/).length });
  document.head.appendChild(ld);
}

/* ── voz: Web Speech API, vozes instaladas no aparelho ── */
let utter: SpeechSynthesisUtterance | null = null;
const synth = (): SpeechSynthesis | null => (typeof speechSynthesis !== 'undefined' ? speechSynthesis : null);
function voicesFor(): SpeechSynthesisVoice[] { const s = synth(); if (!s) return []; const pref = isEn() ? 'en' : 'pt', all = s.getVoices();
  const same = all.filter(v => v.lang.toLowerCase().startsWith(pref)); return same.length ? same : all }
function fillVoices(): void { const sel = document.getElementById('artVoice') as HTMLSelectElement | null; if (!sel) return; const vs = voicesFor();
  sel.innerHTML = vs.length ? vs.map((v, i) => `<option value="${i}">${esc(v.name)} (${esc(v.lang)})</option>`).join('') : `<option value="">${t('Nenhuma voz instalada')}</option>` }
function speak(a: Article): void {
  const s = synth(); if (!s) return toast(t('Este navegador não oferece leitura em voz'));
  if (s.speaking && s.paused) { s.resume(); setState('playing'); return }
  if (s.speaking) { s.pause(); setState('paused'); return }
  const x = L(a), txt = [x.title, x.dek, plain(x.body)].join('. \n');
  utter = new SpeechSynthesisUtterance(txt); const vs = voicesFor(), sel = $('artVoice') as HTMLSelectElement, v = vs[+sel.value]; if (v) utter.voice = v;
  utter.lang = isEn() ? 'en-GB' : 'pt-BR'; utter.rate = +($('artRate') as HTMLInputElement).value;
  utter.onend = () => setState('idle'); utter.onerror = () => setState('idle');
  s.cancel(); s.speak(utter); setState('playing');
}
function stop(): void { const s = synth(); if (s) s.cancel(); setState('idle') }
function setState(st: 'idle' | 'playing' | 'paused'): void { const b = document.getElementById('artPlay'); if (!b) return;
  b.textContent = st === 'playing' ? t('Pausar') : st === 'paused' ? t('Continuar') : t('Ouvir'); b.setAttribute('aria-pressed', String(st === 'playing')) }

/* ── arquivos ── */
function asMd(a: Article): string { const x = L(a);
  return `# ${x.title}\n\n_${x.dek}_\n\n${fmtDate(a.date)} · ${t('{n} min de leitura', { n: a.min })} · ${a.topics.map(topicName).join(', ')}\n\n${x.body}\n\n## ${t('Referências')}\n\n`
   + x.refs.map((r, i) => `${i + 1}. ${r.n}${r.u ? ' ' + r.u : ''}`).join('\n') + `\n\n## ${t('Música para ler')}\n\n${x.music.title} — ${x.music.artist}. ${x.music.why}\n\n---\n\n${t(DISCLAIMER)}\n\n${url(a)}\n` }
function asTxt(a: Article): string { return plain(asMd(a)).replace(/^#+\s+/gm, '').replace(/^_|_$/gm, '') }
function asDoc(a: Article): string { const x = L(a);
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${esc(x.title)}</title>
<style>body{font-family:Georgia,serif;font-size:12pt;line-height:1.5}h1{font-size:24pt}h2{font-size:16pt}blockquote{font-style:italic;margin:12pt 24pt}p.dek{font-size:14pt;color:#444}</style></head><body>
<h1>${esc(x.title)}</h1><p class="dek">${esc(x.dek)}</p><p>${esc(fmtDate(a.date))} · ${t('{n} min de leitura', { n: a.min })}</p>${mdHtml(x.body)}
<h2>${t('Referências')}</h2><ol>${x.refs.map(r => `<li>${esc(r.n)}${r.u ? ` <a href="${r.u}">${r.u}</a>` : ''}</li>`).join('')}</ol>
<h2>${t('Música para ler')}</h2><p>${esc(x.music.title)} — ${esc(x.music.artist)}. ${esc(x.music.why)}</p><hr><p><small>${esc(t(DISCLAIMER))}</small></p><p><small>${url(a)}</small></p></body></html>` }

const DISCLAIMER = 'Este texto foi cocriado entre uma pessoa e uma ferramenta de IA, como parte de um experimento de aprendizagem, criação e desenvolvimento. Não guardamos nenhum dado e nada daqui será usado como fonte de marketing.';

function share(a: Article, where: string): void {
  const x = L(a), u = url(a), txt = x.title + ' — ' + u, enc = encodeURIComponent;
  const links: Record<string, string> = { facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(u)}`, whatsapp: `https://wa.me/?text=${enc(txt)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(u)}`, instagram: 'https://www.instagram.com/' };
  if (where === 'instagram') { const nav = navigator as Navigator & { share?: (d: { title: string; text: string; url: string }) => Promise<void> };
    if (nav.share) { nav.share({ title: x.title, text: x.dek, url: u }).catch(() => {}); return }
    copy(u, t('Link copiado — o Instagram não recebe links de fora; cole na sua publicação')); }
  window.open(links[where], '_blank', 'noopener');
}

function open(slug: string): void {
  const a = ARTICLES.find(z => z.slug === slug); if (!a) return; const x = L(a); ST.open = slug; stop();
  if (location.hash !== '#c/' + slug) history.replaceState(null, '', '#c/' + slug);
  const host = $('magArt'); host.hidden = false; $('magHome').hidden = true;
  host.style.setProperty('--artscale', String(ST.scale)); host.classList.toggle('dys', ST.dys);
  host.innerHTML = `<div class="arttools no-print">
      <button class="mini" id="artBack">${t('← Todos os artigos')}</button>
      <div class="artread" role="group" aria-label="${t('Ajustes de leitura')}">
        <button class="mini" id="artMinus" aria-label="${t('Diminuir letra')}">A−</button><button class="mini" id="artPlus" aria-label="${t('Aumentar letra')}">A+</button>
        <button class="mini" id="artDys" aria-pressed="${ST.dys}">${t('Leitura facilitada')}</button>
      </div></div>
    <article class="mag" lang="${isEn() ? 'en-GB' : 'pt-BR'}">
      <header class="maghead">
        <p class="kicker">${esc(x.kicker)}</p>
        <h1>${esc(x.title)}</h1>
        <p class="dek">${esc(x.dek)}</p>
        <p class="magmeta"><time datetime="${a.date}">${t('Publicado em {d}', { d: esc(fmtDate(a.date)) })}</time> · ${t('{n} min de leitura', { n: a.min })} · ${a.topics.map(k => `<span class="pill">${esc(topicName(k))}</span>`).join(' ')}</p>
      </header>
      <div class="artaudio no-print" role="group" aria-label="${t('Ouvir o artigo')}">
        <button class="act" id="artPlay">${t('Ouvir')}</button><button class="mini" id="artStop">${t('Parar')}</button>
        <label class="lbl"><span>${t('Voz')}</span><select id="artVoice"></select></label>
        <label class="lbl"><span>${t('Velocidade')}</span><input id="artRate" type="range" min=".7" max="1.3" step=".05" value="1"></label>
        <p class="sm">${t('Leitura com as vozes instaladas no seu aparelho, sem custo e sem enviar o texto a nenhum serviço.')}</p>
      </div>
      <div class="magbody">${mdHtml(x.body)}</div>
      <aside class="magmusic">
        <p class="kicker">${t('Música para ler')}</p>
        <p><b>${esc(x.music.title)}</b> — ${esc(x.music.artist)}</p>
        <p class="sm">${esc(x.music.why)}</p>
        <p class="btnrow no-print"><a class="mini" href="https://open.spotify.com/search/${encodeURIComponent(x.music.q)}" target="_blank" rel="noopener">Spotify</a>
          <a class="mini" href="https://music.apple.com/search?term=${encodeURIComponent(x.music.q)}" target="_blank" rel="noopener">Apple Music</a></p>
      </aside>
      <section class="magrefs"><h2>${t('Referências')}</h2>
        <ol>${x.refs.map((r, i) => `<li id="ref-${i + 1}">${esc(r.n).replace(/\*([^*]+)\*/g, '<em>$1</em>')}${r.u ? ` <a href="${r.u}" target="_blank" rel="noopener">${esc(r.u.replace(/^https?:\/\//, ''))}</a>` : ''}</li>`).join('')}</ol>
        <p class="sm">${t('Todas as referências são obras publicadas, com editor e ano; os links levam a páginas institucionais ou a DOIs permanentes.')}</p>
      </section>
      <div class="magact no-print">
        <div><p class="kicker">${t('Baixar')}</p><div class="btnrow">
          <button class="mini" data-dl="md">MD</button><button class="mini" data-dl="txt">TXT</button><button class="mini" data-dl="doc">DOC</button><button class="mini" data-dl="pdf">${t('PDF · imprimir')}</button></div></div>
        <div><p class="kicker">${t('Partilhar')}</p><div class="btnrow">
          <button class="mini" data-sh="facebook">Facebook</button><button class="mini" data-sh="whatsapp">WhatsApp</button><button class="mini" data-sh="instagram">Instagram</button><button class="mini" data-sh="linkedin">LinkedIn</button><button class="mini" data-sh="copy">${t('Copiar link')}</button></div></div>
      </div>
      <details class="magseo no-print"><summary>${t('Estratégia SEO deste artigo')}</summary>
        <dl>
          <dt>${t('Palavra-chave foco')}</dt><dd>${esc(x.seo.kw)}</dd>
          <dt>${t('Título da página')}</dt><dd>${esc(x.seo.title)} <span class="sm">(${x.seo.title.length}/60)</span></dd>
          <dt>${t('Descrição')}</dt><dd>${esc(x.seo.desc)} <span class="sm">(${x.seo.desc.length}/160)</span></dd>
          <dt>${t('Endereço')}</dt><dd><code>${esc(url(a))}</code></dd>
          <dt>${t('Estrutura de seções (H2)')}</dt><dd>${x.seo.outline.map(esc).join(' · ')}</dd>
          <dt>${t('Ligações internas')}</dt><dd>${x.seo.links.map(esc).join(', ')}</dd>
          <dt>${t('Dados estruturados')}</dt><dd>schema.org/Article (JSON-LD), canonical, Open Graph, <code>lang</code>, <code>datetime</code></dd>
        </dl></details>
      <p class="magdisc">${t(DISCLAIMER)}</p>
    </article>`;
  $('artBack').onclick = () => close();
  $('artMinus').onclick = () => setScale(ST.scale - .1); $('artPlus').onclick = () => setScale(ST.scale + .1);
  $('artDys').onclick = () => { ST.dys = !ST.dys; host.classList.toggle('dys', ST.dys); $('artDys').setAttribute('aria-pressed', String(ST.dys)); try { localStorage.setItem('fk-artdys', ST.dys ? '1' : '0') } catch (_) {} };
  $('artPlay').onclick = () => speak(a); $('artStop').onclick = stop;
  fillVoices(); const s = synth(); if (s) s.onvoiceschanged = fillVoices;
  $all<HTMLButtonElement>(host, '[data-dl]').forEach(b => b.onclick = () => { const k = b.dataset.dl, nm = a.slug + (isEn() ? '-en' : '-pt');
    if (k === 'md') return download(nm + '.md', asMd(a), 'text/markdown');
    if (k === 'txt') return download(nm + '.txt', asTxt(a), 'text/plain');
    if (k === 'doc') return download(nm + '.doc', asDoc(a), 'application/msword');
    window.print() });
  $all<HTMLButtonElement>(host, '[data-sh]').forEach(b => b.onclick = () => b.dataset.sh === 'copy' ? copy(url(a), t('Link copiado')) : share(a, b.dataset.sh!));
  applySeo(a); try { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }) } catch (_) {}
  function setScale(v: number): void { ST.scale = Math.min(1.6, Math.max(.8, Math.round(v * 10) / 10)); host.style.setProperty('--artscale', String(ST.scale)); try { localStorage.setItem('fk-artscale', String(ST.scale)) } catch (_) {} }
}
function close(): void { ST.open = null; stop(); $('magArt').hidden = true; $('magArt').innerHTML = ''; $('magHome').hidden = false; applySeo(null);
  if (location.hash.startsWith('#c/')) history.replaceState(null, '', '#c') }

export function openFromHash(): boolean {
  const m = location.hash.match(/^#c(?:\/([a-z0-9-]+))?$/); if (!m) return false;
  goto('cont'); if (m[1]) open(m[1]); else if (ST.open) close(); return true;
}
export function initContents(): void {
  const q = $('magSearch') as HTMLInputElement; let h = 0;
  q.oninput = () => { clearTimeout(h); h = window.setTimeout(() => { ST.q = q.value.trim(); drawList() }, 120) };
  $('magClear').onclick = () => { q.value = ''; ST.q = ''; ST.topics.clear(); drawList() };
  drawList();
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
}
