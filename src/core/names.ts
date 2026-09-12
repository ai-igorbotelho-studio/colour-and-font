/* ═══════════ NOMES DAS CORES ═══════════
   Cada cor gerada ganha um nome curto e evocativo, determinístico a partir do
   hex: família de matiz em OKLCH, modificador por luminosidade, e neutros
   próprios para o croma baixo. Duas línguas, mesma escolha. */
import { hex2lch } from './color';

type Pair = [string, string];
const FAM: { h: number; pt: string[]; en: string[] }[] = [
  { h: 20, pt: ['Rosa', 'Cereja', 'Carmim', 'Framboesa', 'Rubi', 'Romã'], en: ['Rose', 'Cherry', 'Carmine', 'Raspberry', 'Ruby', 'Pomegranate'] },
  { h: 50, pt: ['Coral', 'Terracota', 'Papoula', 'Ferrugem', 'Tijolo', 'Lacre'], en: ['Coral', 'Terracotta', 'Poppy', 'Rust', 'Brick', 'Sealing wax'] },
  { h: 80, pt: ['Âmbar', 'Damasco', 'Cobre', 'Abóbora', 'Caqui', 'Canela'], en: ['Amber', 'Apricot', 'Copper', 'Pumpkin', 'Persimmon', 'Cinnamon'] },
  { h: 110, pt: ['Açafrão', 'Mel', 'Palha', 'Mostarda', 'Ouro', 'Trigo'], en: ['Saffron', 'Honey', 'Straw', 'Mustard', 'Gold', 'Wheat'] },
  { h: 145, pt: ['Lima', 'Oliva', 'Musgo', 'Capim', 'Pistache', 'Broto'], en: ['Lime', 'Olive', 'Moss', 'Grass', 'Pistachio', 'Sprout'] },
  { h: 180, pt: ['Jade', 'Esmeralda', 'Sálvia', 'Hortelã', 'Floresta', 'Samambaia'], en: ['Jade', 'Emerald', 'Sage', 'Mint', 'Forest', 'Fern'] },
  { h: 220, pt: ['Turquesa', 'Lagoa', 'Verdete', 'Maré', 'Água-marinha', 'Glacial'], en: ['Turquoise', 'Lagoon', 'Verdigris', 'Tide', 'Aquamarine', 'Glacier'] },
  { h: 265, pt: ['Cobalto', 'Anil', 'Céu', 'Ardósia', 'Marinho', 'Safira'], en: ['Cobalt', 'Indigo', 'Sky', 'Slate', 'Navy', 'Sapphire'] },
  { h: 305, pt: ['Lavanda', 'Ameixa', 'Violeta', 'Íris', 'Uva', 'Ametista'], en: ['Lavender', 'Plum', 'Violet', 'Iris', 'Grape', 'Amethyst'] },
  { h: 345, pt: ['Orquídea', 'Magenta', 'Amora', 'Fúcsia', 'Vinho', 'Peônia'], en: ['Orchid', 'Magenta', 'Mulberry', 'Fuchsia', 'Wine', 'Peony'] },
  { h: 361, pt: ['Rosa', 'Cereja', 'Carmim', 'Framboesa', 'Rubi', 'Romã'], en: ['Rose', 'Cherry', 'Carmine', 'Raspberry', 'Ruby', 'Pomegranate'] }
];
const NEUTRAL: { L: number; pt: string; en: string }[] = [
  { L: .96, pt: 'Marfim', en: 'Ivory' }, { L: .88, pt: 'Giz', en: 'Chalk' }, { L: .74, pt: 'Névoa', en: 'Mist' }, { L: .58, pt: 'Pedra', en: 'Stone' },
  { L: .42, pt: 'Fumo', en: 'Smoke' }, { L: .26, pt: 'Carvão', en: 'Charcoal' }, { L: 0, pt: 'Breu', en: 'Pitch' }
];
const MOD: { test: (L: number, C: number) => boolean; pt: (n: string) => string; en: (n: string) => string }[] = [
  { test: (L, C) => L > .86 && C < .09, pt: n => `${n} pálido`, en: n => `Pale ${n.toLowerCase()}` },
  { test: (L, C) => L > .86 && C >= .09, pt: n => `${n} claro`, en: n => `Light ${n.toLowerCase()}` },
  { test: L => L < .3, pt: n => `${n} profundo`, en: n => `Deep ${n.toLowerCase()}` },
  { test: (L, C) => C < .06, pt: n => `${n} enevoado`, en: n => `Misty ${n.toLowerCase()}` },
  { test: (L, C) => C > .2, pt: n => `${n} vivo`, en: n => `Vivid ${n.toLowerCase()}` }
];
const hash = (s: string): number => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 };

/** Nome em português e inglês para um hex. Sempre o mesmo par para o mesmo hex. */
export function colourName(hex: string): Pair {
  const { L, C, H } = hex2lch(hex), h = ((H % 360) + 360) % 360;
  if (C < .025) { const n = NEUTRAL.find(x => L >= x.L) || NEUTRAL[NEUTRAL.length - 1]; return [n.pt, n.en] }
  const fam = FAM.find(f => h < f.h)!, k = hash(hex.toUpperCase()) % fam.pt.length;
  const mod = MOD.find(m => m.test(L, C));
  return mod ? [mod.pt(fam.pt[k]), mod.en(fam.en[k])] : [fam.pt[k], fam.en[k]];
}
