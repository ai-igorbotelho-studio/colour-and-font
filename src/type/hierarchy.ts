/* ── oito níveis de hierarquia, editáveis ── */
import { lum, ratio, mixLch } from '../core/color';
import { $, $v, $n, $all, esc, toast } from '../core/dom';
import { t, dec } from '../i18n';
import { ROLES, CASES, STEPS, type Font, type Role, type WeightKind, type RoleSlot, type CaseKind } from '../data/fonts';
import { palette } from '../palette/state';
import { T, typeHooks, type RoleOverride } from './state';
import { famAttr } from './pairing';

export function slotIndex(slot: RoleSlot, n: number): number {
  if (n <= 1) return 0;
  if (n === 2) return { disp: 0, quote: 0, body: 1, aux: 1, accent: 1 }[slot];
  if (n === 3) return { disp: 0, quote: 0, body: 1, aux: 2, accent: 1 }[slot];
  if (n === 4) return { disp: 0, quote: 3, body: 1, aux: 2, accent: 1 }[slot];
  return { disp: 0, quote: 3, body: 1, aux: 2, accent: 4 }[slot];
}
export function weightOf(f: Font, kind: WeightKind): number {
  const ws = f.wts.split(';').map(Number).sort((a, b) => a - b);
  if (kind === 'max') return ws[ws.length - 1];
  if (kind === 'bold') return ws.reduce((p, c) => Math.abs(c - 700) < Math.abs(p - 700) ? c : p, ws[0]);
  if (kind === 'mid') return ws.reduce((p, c) => Math.abs(c - 550) < Math.abs(p - 550) ? c : p, ws[0]);
  return ws.reduce((p, c) => Math.abs(c - 400) < Math.abs(p - 400) ? c : p, ws[0]);
}
export const roleDef = (k: string): Role => ROLES.find(r => r.k === k)!;
export interface RoleCfg { f: Font; fi: number; wt: number; step: number; lh: number; tr: number; it: boolean; cs: CaseKind; col: string }

/* Ambiente de uma amostra: famílias, ajustes por nível, paleta e os controles.
   O instrumento de tipografia monta o seu a partir de T e dos campos; a Criação monta um por proposta. */
export interface TypeEnv { fams: Font[]; ov: Record<string, RoleOverride>; off: Record<string, boolean>; hs: string[]; mode: string; base: number; rt: number; lh: number; tr: number; meas: number }
export const envFromT = (): TypeEnv => ({ fams: T.fams, ov: T.ov, off: T.off, hs: palette(), mode: $v('tPal'), base: $n('tBase'), rt: $n('tRatio'), lh: $n('tLh') / 100, tr: $n('tTrack') / 1000, meas: $n('tMeasure') });

export function roleCfgE(k: string, env: TypeEnv): RoleCfg {
  const d = roleDef(k), o = env.ov[k] || {}, n = env.fams.length;
  const fi = o.fam !== undefined ? Math.min(o.fam, n - 1) : slotIndex(d.slot, n);
  const f = env.fams[fi] || env.fams[0];
  return { f, fi, wt: o.wt !== undefined ? o.wt : weightOf(f, d.wt),
    step: o.step !== undefined ? o.step : d.step,
    lh: o.lh !== undefined ? o.lh : d.lh,
    tr: o.tr !== undefined ? o.tr : d.tr,
    it: o.it !== undefined ? o.it : d.it,
    cs: o.cs !== undefined ? o.cs : d.cs,
    col: o.col !== undefined ? o.col : 'auto' };
}
export const roleCfg = (k: string): RoleCfg => roleCfgE(k, envFromT());
export interface RoleColors { bg: string; fg: string; ac: string; mut: string; pal: string[] }
export function roleColorsE(env: TypeEnv): RoleColors {
  const mode = env.mode, hs = env.hs, ls = hs.map(lum);
  if (mode === 'none') return { bg: '#FFFFFF', fg: '#111111', ac: '#111111', mut: '#6B6B6B', pal: hs };
  let bg = hs[ls.indexOf(Math.max(...ls))], fg = hs[ls.indexOf(Math.min(...ls))];
  if (mode === 'inv') { const t = bg; bg = fg; fg = t }
  const ac = hs.find(h => h !== bg && h !== fg && ratio(h, bg) >= 3) || fg;
  return { bg, fg, ac, mut: mixLch(fg, bg, .42), pal: hs };
}
export const roleColors = (): RoleColors => roleColorsE(envFromT());
export function autoColor(k: string, C: RoleColors): string {
  return ({ rotulo: C.mut, titulo: C.fg, subtitulo: C.mut, paragrafo: C.fg,
    destaque: ratio(C.ac, C.bg) >= 4.5 ? C.ac : C.fg, citacao: C.ac, referencia: C.mut, botao: C.bg } as Record<string, string>)[k] || C.fg;
}
export interface RoleStyle { size: number; col: string; lh: number; tr: number; c: RoleCfg; style: string }
export function roleCssE(k: string, env: TypeEnv): RoleStyle {
  const c = roleCfgE(k, env), C = roleColorsE(env), base = env.base, rt = env.rt;
  const size = Math.round(base * Math.pow(rt, c.step) * 10) / 10;
  const col = c.col === 'auto' ? autoColor(k, C) : C.pal[+c.col] || C.fg;
  const lhAdj = k === 'paragrafo' ? env.lh : c.lh;
  const trAdj = k === 'titulo' ? env.tr : c.tr;
  return { size, col, lh: lhAdj, tr: trAdj, c,
    style: `font-family:${famAttr(c.f)};font-weight:${c.wt};font-size:${size}px;line-height:${lhAdj};`
      + `letter-spacing:${trAdj}em;color:${col};font-style:${c.it ? 'italic' : 'normal'};`
      + `text-transform:${c.cs === 'upper' ? 'uppercase' : c.cs === 'lower' ? 'lowercase' : c.cs === 'cap' ? 'capitalize' : 'none'};` };
}
export const roleCss = (k: string): RoleStyle => roleCssE(k, envFromT());

/* ── texto do usuário, com marcação ── */
export interface Block { r: string; t: string }
export function parseText(t: string, off: Record<string, boolean> = T.off): Block[] {
  return t.split('\n').map(l => { const s = l.trim(); if (!s) return null;
    if (s.startsWith('### ')) return { r: 'rotulo', t: s.slice(4) };
    if (s.startsWith('## ')) return { r: 'subtitulo', t: s.slice(3) };
    if (s.startsWith('# ')) return { r: 'titulo', t: s.slice(2) };
    if (s.startsWith('> ')) return { r: 'citacao', t: s.slice(2) };
    if (s.startsWith('! ')) return { r: 'destaque', t: s.slice(2) };
    if (s.startsWith('-- ')) return { r: 'referencia', t: s.slice(3) };
    if (/^\[.+\]$/.test(s)) return { r: 'botao', t: s.slice(1, -1) };
    return { r: 'paragrafo', t: s } }).filter((b): b is Block => !!b)
    .filter(b => !off[b.r]);
}

/* ── painel de hierarquia ── */
export function drawRoleBar(): void {
  $('tRoleBar').innerHTML = ROLES.map(r =>
    `<button data-k="${r.k}" class="${T.off[r.k] ? 'off' : ''}" aria-pressed="${T.role === r.k}">${r.n}</button>`).join('')
    + `<button data-all="1" style="margin-left:8px">${t('Ligar e desligar níveis')}</button>`;
  $all<HTMLButtonElement>($('tRoleBar'), 'button').forEach(b => {
    if (b.dataset.all) { b.onclick = () => { T.pick = !T.pick;
      toast(t(T.pick ? 'Agora um toque no nível liga ou desliga' : 'De volta a ajustar níveis')); drawRoleBar() };
      b.setAttribute('aria-pressed', String(!!T.pick)); return }
    b.onclick = () => { if (T.pick) { T.off[b.dataset.k!] = !T.off[b.dataset.k!] } else T.role = b.dataset.k!; typeHooks.renderSpec() } });
}
export function drawRoleCtl(): void {
  const k = T.role, c = roleCfg(k), d = roleDef(k), C = roleColors();
  const opt = (arr: { v: string; n: string }[], val: unknown) => arr.map(o => `<option value="${o.v}" ${String(o.v) === String(val) ? 'selected' : ''}>${esc(o.n)}</option>`).join('');
  $('tRoleCtl').innerHTML = `
   <div class="ctl"><label for="rFam">${t('Família de {r}', { r: d.n.toLowerCase() })}</label><select id="rFam">
     ${T.fams.map((f, i) => `<option value="${i}" ${i === c.fi ? 'selected' : ''}>${esc(f.n)}</option>`).join('')}</select></div>
   <div class="ctl"><label for="rWt">${t('Peso')}</label><select id="rWt">
     ${c.f.wts.split(';').map(x => `<option value="${x}" ${+x === c.wt ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
   <div class="ctl"><label for="rStep">${t('Degrau da escala')}</label><select id="rStep">
     ${STEPS.map(x => `<option value="${x}" ${x === c.step ? 'selected' : ''}>${x > 0 ? '+' + x : x} · ${Math.round($n('tBase') * Math.pow($n('tRatio'), x) * 10) / 10}px</option>`).join('')}</select></div>
   <div class="ctl"><label for="rLh">${t('Entrelinha')} <b>${dec(c.lh, 2)}</b></label>
     <input type="range" id="rLh" min="90" max="220" value="${Math.round(c.lh * 100)}"></div>
   <div class="ctl"><label for="rTr">${t('Entreletra')} <b>${dec(c.tr, 3)}em</b></label>
     <input type="range" id="rTr" min="-60" max="80" value="${Math.round(c.tr * 1000)}"></div>
   <div class="ctl"><label for="rCs">${t('Caixa')}</label><select id="rCs">${opt(CASES, c.cs)}</select></div>
   <div class="ctl"><label for="rCol">${t('Cor')}</label><select id="rCol">
     <option value="auto" ${c.col === 'auto' ? 'selected' : ''}>${t('Automática pela paleta')}</option>
     ${C.pal.map((h, i) => `<option value="${i}" ${String(c.col) === String(i) ? 'selected' : ''}>${t('Cor {n} — {h}', { n: i + 1, h })}</option>`).join('')}</select></div>
   <div class="ctl"><label for="rIt">${t('Itálico')}</label><select id="rIt">
     <option value="0" ${!c.it ? 'selected' : ''}>${t('Nenhum')}</option><option value="1" ${c.it ? 'selected' : ''}>${t('Itálico')}</option></select></div>`;
  const set = <K extends keyof import('./state').RoleOverride>(key: K, val: import('./state').RoleOverride[K]) => { T.ov[k] = T.ov[k] || {}; T.ov[k][key] = val; typeHooks.renderSpec() };
  const val = (e: Event) => (e.target as HTMLInputElement).value;
  $('rFam').onchange = e => { T.ov[k] = T.ov[k] || {}; delete T.ov[k].wt; set('fam', +val(e)) };
  $('rWt').onchange = e => set('wt', +val(e));
  $('rStep').onchange = e => set('step', +val(e));
  $('rLh').oninput = e => set('lh', +val(e) / 100);
  $('rTr').oninput = e => set('tr', +val(e) / 1000);
  $('rCs').onchange = e => set('cs', val(e) as CaseKind);
  $('rCol').onchange = e => set('col', val(e));
  $('rIt').onchange = e => set('it', val(e) === '1');
}
export function drawRoleRows(): void {
  $('tRoleRows').innerHTML = ROLES.map(r => { const c = roleCfg(r.k), s = roleCss(r.k);
    return `<tr style="${T.off[r.k] ? 'opacity:.4' : ''}"><td>${r.n}${T.off[r.k] ? t(' · desligado') : ''}</td>
      <td>${esc(c.f.n)}</td><td class="r">${s.size}px</td><td class="r">${c.wt}</td>
      <td class="r">${dec(s.lh, 2)}</td>
      <td><span style="display:inline-block;width:11px;height:11px;background:${s.col};vertical-align:-1px;margin-right:5px"></span>${s.col}</td></tr>` }).join('');
}
