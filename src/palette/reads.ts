/* ── leituras: Goethe, campo, lente, referência cultural, dinâmica ── */
import { nameOf } from '../core/goethe';
import { $ } from '../core/dom';
import { S, cur } from './state';
import { t, isEn } from '../i18n';

/* A nota sobre referência cultural não é opcional e não deve ser encurtada:
   pigmento e valor são o que a ferramenta empresta; grafismo é taonga e propriedade cultural. */
const CAUTION_CULT_PT = `<b>Sobre a referência cultural.</b> O que entra aqui é lógica de pigmento e de valor — de onde vinha a cor, o que ela custava, em que proporção aparecia. Grafismo é outra coisa: moko, kusiwa e padrões de tecelagem são taonga e propriedade cultural, não repertório disponível. Se o projeto for para um público ou território dessa cultura, a paleta é ponto de partida de uma conversa com quem pertence a ela, e não substituto dela.`;
const CAUTION_CULT_EN = `<b>On the cultural reference.</b> What comes in here is the logic of pigment and value — where the colour came from, what it cost, in what proportion it appeared. Pattern is another matter: moko, kusiwa and weaving patterns are taonga and cultural property, not a repertoire on offer. If the project is for an audience or territory of that culture, the palette is the starting point of a conversation with those who belong to it, not a substitute for it.`;
const CAUTION_NONE_PT = `<b>Sem referência cultural.</b> A paleta vem só do círculo, do campo e da lente. Ao escolher uma referência, o matiz é puxado na direção dos pigmentos historicamente disponíveis àquela cultura — e vem com uma nota sobre o limite do que se pode tomar emprestado.`;
const CAUTION_NONE_EN = `<b>No cultural reference.</b> The palette comes from the circle, the field and the lens alone. When you choose a reference, the hue is pulled towards the pigments historically available to that culture — and it comes with a note on the limit of what may be borrowed.`;
export const CAUTION_CULT = isEn() ? CAUTION_CULT_EN : CAUTION_CULT_PT;
export const CAUTION_NONE = isEn() ? CAUTION_NONE_EN : CAUTION_NONE_PT;

export function drawReads(): void {
  const { E, M, SC, L, K, U } = cur(), a = S.colors[0] ? S.colors[0].a : 0, pct = Math.round(S.pos);
  const post = t(S.baseOver !== null ? 'posicionada à mão no anel' : E.a === null || M.a === null ? 'sem tensão entre intenção e campo' :
    pct < 25 ? 'quase inteiramente dentro da convenção do campo' : pct < 50 ? 'ancorada na convenção, com desvio perceptível' :
    pct < 75 ? 'mais próxima da intenção do que da categoria' : 'deliberadamente fora do que o campo faz');
  const lado = t(a >= 30 && a <= 150 ? 'Está no lado positivo — o lado que Goethe descreve como ativo, quente e que se aproxima de quem olha.'
    : a >= 210 && a <= 330 ? 'Está no lado negativo — passivo, frio, que segundo ele afasta o olho em vez de atraí-lo.'
    : 'Está no ponto em que os dois lados do círculo se encontram, onde a intensificação chega ao purpúreo.');
  $('goetheRead').innerHTML = `<p class="lede">${E.g}</p><p class="lede" style="margin-top:10px">${t('A primeira cor caiu em')} <b style="color:var(--ink)">${nameOf(a).toLowerCase()}</b> ${t('({a}° no círculo)', { a: Math.round(a) })}, ${post}. ${lado}</p>`;
  $('verdict').innerHTML = `<b>${SC.n}.</b> ${SC.d}`;
  let h = `<p class="lede"><b style="color:var(--ink)">${M.n}.</b> ${t('A convenção é {c}.', { c: M.c })} ${M.d}</p>`;
  h += `<p class="lede" style="margin-top:10px"><b style="color:var(--ink)">${L.n}.</b> ${L.m}</p>`;
  if (K.m) h += `<p class="lede" style="margin-top:10px"><b style="color:var(--ink)">${K.n}.</b> ${K.m}</p>`;
  if (U.m) h += `<p class="lede" style="margin-top:10px"><b style="color:var(--ink)">${U.n}.</b> ${U.m}</p>`;
  $('marketRead').innerHTML = h;
  $('caution').innerHTML = K.anc ? CAUTION_CULT : CAUTION_NONE;
  $('palTitle').textContent = t('{n} cores', { n: S.n });
  $('palSub').textContent = [E.a !== null ? E.n.toLowerCase() : null, M.a !== null ? t('em {m}', { m: M.n.toLowerCase() }) : null,
    L.Cm !== 1 || S.lens !== 0 ? t('sob a lente {l}', { l: L.n.split(' — ')[0] }) : null,
    K.anc ? t('inflectida por {k}', { k: K.n.split(' — ')[0] }) : null,
    U.m ? t('em dinâmica de {u}', { u: U.n.toLowerCase() }) : null].filter(Boolean).join(', ') + '.';
}
