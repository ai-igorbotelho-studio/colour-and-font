/* Referências culturais — lógica de pigmento e de valor, nunca grafismo.
   A nota sobre o limite do que se pode tomar emprestado está em palette/reads.ts e não é opcional. */
export interface Culture { n: string; pull: number; Cm: number; luzD: number; trevaD: number; m: string; anc?: number[] }
export const CULT: Culture[] = [
 {n:'Nenhuma',pull:0,Cm:1,luzD:0,trevaD:0,m:''},
 {n:'Aotearoa — kōkōwai, pango, mā',anc:[22],pull:.62,Cm:1.04,luzD:.006,trevaD:-.055,
  m:'Kōkōwai é o ocre vermelho de argila e arenito ricos em ferro, queimados e moídos, depois misturados a óleo de fígado de tubarão ou de tītoki. A tradição polinésia associa o vermelho a kura — algo precioso — e o que era pintado de vermelho tornava-se tapu. Pango e mā não são fundo: são princípios, e o branco vinha de concha queimada ou argila, por isso é quente.'},
 {n:'Amazônia indígena — urucum, jenipapo, tabatinga',anc:[35,250],pull:.68,Cm:1.10,luzD:.004,trevaD:-.045,
  m:'O vermelho vem da polpa do urucum, o azul-escuro e o preto do suco fermentado do jenipapo — cujo nome, do guarani, quer dizer fruta que serve para pintar — e o branco da tabatinga ou do calcário. Entre os Kayapó, o vermelho testemunha a vida social e o preto é a cor da criatividade; a pintura indica idade, filhos e condição, e não é só ritual: também é prazer estético.'},
 {n:'Japão — aizome, sumi, kurenai',anc:[255,18],pull:.60,Cm:.72,luzD:.008,trevaD:-.06,
  m:'Índigo de tina, tinta de fuligem e um vermelho que aparece pouco e em pouca área. A lógica não é de matiz, é de intervalo: croma baixo em quase tudo, para que um acontecimento de cor tenha peso.'},
 {n:'África Ocidental — índigo adire, ouro kente',anc:[250,105,30],pull:.58,Cm:1.22,luzD:0,trevaD:-.03,
  m:'Índigo resistido a amarração e a amido, contra ouro e vermelho de tecelagem em faixas. Cores fortes que convivem porque são separadas por estrutura — a trama faz o trabalho que uma grade faria.'},
 {n:'Andes — cochonilha e índigo',anc:[358,252],pull:.60,Cm:1.12,luzD:-.01,trevaD:-.04,
  m:'O carmim de cochonilha e o índigo em lã. O par vive de contraste de matiz com luminosidade parecida — o oposto do que o design ocidental costuma fazer.'},
 {n:'Mediterrâneo — cal e azul',anc:[243],pull:.52,Cm:.90,luzD:.014,trevaD:-.01,
  m:'A cal domina em área e o azul entra em recorte pequeno. É uma paleta de proporção, não de quantidade de cores.'},
 {n:'Nórdico — luz baixa',anc:[218],pull:.48,Cm:.62,luzD:.006,trevaD:-.02,
  m:'Latitude alta, luz difusa e longa. Croma contido e faixa de luminosidade estreita: nada brilha porque nada precisa competir com sol forte.'},
 {n:'México — Barragán',anc:[340,108,240],pull:.58,Cm:1.26,luzD:-.004,trevaD:-.02,
  m:'Rosa, amarelo e azul em planos inteiros de parede. A cor é arquitetura: não decora superfície, define volume e sombra.'},
 {n:'Índia — sindoor, açafrão, índigo',anc:[22,88,255],pull:.58,Cm:1.24,luzD:.002,trevaD:-.035,
  m:'Vermelho, açafrão e índigo em saturação alta e sem transição. A vizinhança de cores plenas é a regra, não a exceção a administrar.'},
 {n:'Bauhaus — primárias e plano',anc:[18,115,245],pull:.66,Cm:1.06,luzD:.012,trevaD:-.05,
  m:'Vermelho, amarelo e azul tratados como material, sobre branco e preto. O pressuposto é o de Goethe invertido: a cor serve à forma, e a forma é geométrica.'}
];
