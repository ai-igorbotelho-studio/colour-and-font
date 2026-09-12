/* ── Visualização de exemplos: pacotes de mockups por campo de aplicação ──
   Tudo é vetor desenhado aqui (src/mockups/draw.ts): sem imagens externas, sem rede.
   Nomes em português são a fonte; o inglês vem do dicionário da interface. */
export type SceneKey = 'claro' | 'escuro' | 'cor';
export interface MockItem { k: string; n: string }
export interface Bundle { k: string; n: string; d: string; items: MockItem[] }

export const BUNDLES: Bundle[] = [
  { k: 'digital', n: 'Digital', d: 'Telas de celular, tablet, portátil e desktop, ícone de aplicativo e publicação social.', items: [
    { k: 'phone', n: 'Celular' }, { k: 'tablet', n: 'Tablet' }, { k: 'laptop', n: 'Portátil' }, { k: 'desktop', n: 'Desktop' },
    { k: 'appicon', n: 'Ícone de app' }, { k: 'social', n: 'Publicação social' } ] },
  { k: 'products', n: 'Produtos', d: 'Embalagens: caixa, frasco, pote, bisnaga, saco de papel e copo.', items: [
    { k: 'box', n: 'Caixa de cartão' }, { k: 'bottle', n: 'Frasco' }, { k: 'jar', n: 'Pote' }, { k: 'tube', n: 'Bisnaga' },
    { k: 'pouch', n: 'Saco de papel' }, { k: 'cup', n: 'Copo' } ] },
  { k: 'paper', n: 'Papel', d: 'Papelaria: papel timbrado, cartão de visita, envelope, caderno, pôster e capa de livro.', items: [
    { k: 'letterhead', n: 'Papel timbrado' }, { k: 'card', n: 'Cartão de visita' }, { k: 'envelope', n: 'Envelope' },
    { k: 'notebook', n: 'Caderno' }, { k: 'poster', n: 'Pôster' }, { k: 'book', n: 'Capa de livro' } ] },
  { k: 'street', n: 'Rua', d: 'Sinalização: outdoor, placa de fachada, ponto de ônibus, bandeira, mural e vitrine.', items: [
    { k: 'billboard', n: 'Outdoor' }, { k: 'bladesign', n: 'Placa de fachada' }, { k: 'busstop', n: 'Ponto de ônibus' },
    { k: 'flag', n: 'Bandeira' }, { k: 'mural', n: 'Mural' }, { k: 'storefront', n: 'Vitrine' } ] },
  { k: 'clothing', n: 'Vestuário', d: 'Peças e brindes: camiseta, sacola de tecido, boné, moletom, crachá e chaveiro.', items: [
    { k: 'tshirt', n: 'Camiseta' }, { k: 'tote', n: 'Sacola de tecido' }, { k: 'cap', n: 'Boné' },
    { k: 'hoodie', n: 'Moletom' }, { k: 'badge', n: 'Crachá' }, { k: 'keytag', n: 'Chaveiro' } ] },
  { k: 'screens', n: 'Telas em ambiente', d: 'Painéis em espaço: aeroporto, balcão, parede de telas, totem, televisão e relógio.', items: [
    { k: 'airport', n: 'Painel de aeroporto' }, { k: 'desk', n: 'Balcão' }, { k: 'wall', n: 'Parede de telas' },
    { k: 'kiosk', n: 'Totem' }, { k: 'tv', n: 'Televisão' }, { k: 'watch', n: 'Relógio' } ] }
];
export const SCENES: { k: SceneKey; n: string }[] = [{ k: 'claro', n: 'Estúdio claro' }, { k: 'escuro', n: 'Estúdio escuro' }, { k: 'cor', n: 'Cor da paleta' }];
