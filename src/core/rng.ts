/* Gerador congruente linear determinístico. O estado é inteiro de propósito:
   operar sobre float colapsava a sequência (achado 7 da auditoria). */
export function lcg(seed: number, offset = 1): () => number {
  let rs = Math.floor(seed * 233279) + offset;
  return () => { rs = (rs * 9301 + 49297) % 233280; return rs / 233280 };
}
