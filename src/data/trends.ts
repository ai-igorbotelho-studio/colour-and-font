/* ═══════════ TENDÊNCIAS ═══════════
   Uma entrada por trimestre. Para acrescentar uma edição, insira um objeto
   no começo desta lista. Tudo o mais se monta a partir daqui.
   hex = aproximação em sRGB da cor descrita pela fonte, nunca o código oficial. */
export interface Source { n: string; u: string }
export interface TrendColor { n: string; hex: string; obs: string }
export interface Axis { tese: string; corpo: string[]; fontes: Source[]; pal?: TrendColor[]; fam?: string[] }
export interface Edition { id: string; per: string; tese: string; cor: Axis; tipo: Axis; comb: Axis; apl: Axis }
export type AxisKey = 'cor' | 'tipo' | 'comb' | 'apl';

export const TREND: Edition[] = [
{id:'2026 · T3',per:'Julho a setembro de 2026',
 tese:'O ciclo se parte em dois. De um lado, a cor volta a ser evento depois de um ano de branco estrutural; de outro, a tipografia e a identidade recusam a neutralidade que a produção automatizada tornou barata.',
 cor:{
  tese:'Azul de cobalto como âncora, calor terroso como contrapeso',
  pal:[{n:'Luminous Blue',hex:'#2340C8',obs:'Cor do Ano 2027 de WGSN e Coloro, código Coloro 125-28-38'},
       {n:'Energy Orange',hex:'#F2600C',obs:'Cor-chave S/S 27, código Coloro 018-57-34'},
       {n:'Pop Pink',hex:'#F25BA0',obs:'Cor-chave S/S 27, código Coloro 151-73-22'},
       {n:'Meadowland Green',hex:'#6F8F4A',obs:'Cor-chave S/S 27, código Coloro 050-61-19'},
       {n:'Clay',hex:'#B6795A',obs:'Cor-chave S/S 27, código Coloro 014-60-13'}],
  corpo:['WGSN e Coloro nomearam Luminous Blue como Cor do Ano de 2027 e descreveram o tema que governa a escolha das cinco cores-chave de primavera e verão de 2027: interconexão entre polaridades — claro e escuro, natureza e tecnologia, antigo e contemporâneo, racionalidade e espiritualidade.',
   'As três primeiras cores-chave são declaradamente animadas, pensadas para sustentar as pessoas diante da pressão; as duas últimas, Meadowland Green e Clay, vêm da busca por propósito e por vínculo com comunidade e natureza. É a mesma tensão que Goethe descreve entre o lado ativo e o lado passivo do círculo, com o purpúreo ausente e o azul ocupando o papel de gravidade.',
   'Para o instrumento de cor, a leitura prática é esta: um azul frio de croma alto como primária, com laranja e barro entrando como contraparte característica em área pequena — não como complementar em área igual, que é o erro previsível dessa combinação.'],
  fontes:[{n:'WGSN e Coloro, comunicado de 29 de abril de 2025',u:'https://www.wgsn.com/en/wgsn/press/press-releases/wgsn-and-coloro-reveal-colour-year-2027-luminous-blue-and-s-s-27-key'},
          {n:'Coloro, página das cores-chave',u:'https://coloro.com/key-colors'},
          {n:'WWD, cobertura de 29 de abril de 2025',u:'https://wwd.com/fashion-news/fashion-features/color-of-the-year-wgsn-coloro-single-out-luminous-blue-1237109361/'}]},
 tipo:{
  tese:'A fonte variável virou infraestrutura, e a neutralidade virou defeito',
  fam:['Inter','Bricolage Grotesque','Fraunces','Instrument Serif','JetBrains Mono'],
  corpo:['O padrão de fonte variável, publicado pelo W3C em 2017, deixou de ser diferencial e virou expectativa: navegadores, sistemas operacionais e ferramentas de design lidam com ele sem atrito, e uma família inteira chega num arquivo só, cobrindo peso, tamanho óptico, largura e eixos experimentais.',
   'O movimento estético anda no sentido contrário da economia de arquivo. As grotescas limpas ficaram tão onipresentes em produto que passaram a ser lidas como ausência de escolha, e o trabalho mais interessante migrou para o que é mais macio, mais quente, mais expressivo ou simplesmente mais peculiar. A saturação de conteúdo gerado automaticamente transformou traço com marca de mão em sinal de autoria.',
   'Há também um retorno do dinheiro ao tipo: depois de uma década de disciplina orçamentária apoiada só em bancos abertos, estúdios voltaram a encomendar e licenciar desenhos próprios. Os bancos livres continuam excelentes — a diferença é que deixaram de ser o único caminho aceitável.'],
  fontes:[{n:'Font Trends 2026, levantamento de mercado e lançamentos de fundição',u:'https://madegooddesigns.com/font-trends-2026/'},
          {n:'Typography Trends 2026, fontes variáveis e tipo cinético',u:'https://designflea.com/typography-trends-2026/'},
          {n:'Monotype, relatório anual Type Trends',u:'https://www.monotype.com/type-trends'}]},
 comb:{
  tese:'Paleta flexível no lugar de paleta fixa',
  corpo:['A recomendação que se repete nos relatórios de identidade é abandonar a paleta congelada em favor de um tema cromático que se desloca conforme contexto e plataforma: reconhecível por atmosfera, não por um conjunto exato de valores.',
   'Isso muda o que um sistema de cor precisa entregar. Não bastam cinco hex: é preciso uma regra de deslocamento — quanto o matiz pode girar, quanto o croma pode subir, qual a faixa de luminosidade que ainda pertence ao sistema. É exatamente o que um círculo com geometria preservada resolve e uma lista de amostras não resolve.',
   'A contrapartida é o risco de dissolução. Sem uma âncora de valor — um escuro e um claro que não se mexem — a identidade flexível vira identidade indistinguível.'],
  fontes:[{n:'The Branding Journal, tendências de branding e design 2026',u:'https://www.thebrandingjournal.com/2026/01/top-branding-design-trends-2026/'},
          {n:'It’s Nice That, tendências gráficas 2026',u:'https://www.itsnicethat.com/features/forward-thinking-graphic-trends-2026-graphic-design-120126'}]},
 apl:{
  tese:'Movimento antes de forma, textura antes de acabamento',
  corpo:['Identidade pensada primeiro em movimento deixou de ser especialidade de estúdio de motion e virou requisito de entrega, porque a tela passou a ser o primeiro ponto de contato e não o último.',
   'Junto vem uma preferência por superfície: translúcido, ceroso, vítreo, com granulação e imperfeição visíveis. A leitura corrente é que isso funciona como assinatura de autoria humana num ambiente saturado de produção automática.',
   'Para quem trabalha com cor, a consequência é técnica: uma paleta que só foi testada em superfície chapada quebra quando entra em transparência e sobreposição. Vale testar cada par em camada antes de fechar.'],
  fontes:[{n:'Three Rooms, oito tendências de identidade para 2026',u:'https://www.threerooms.com/blog/8-design-trends-shaping-brand-identity-in-2026'},
          {n:'It’s Nice That, tendências gráficas 2026',u:'https://www.itsnicethat.com/features/forward-thinking-graphic-trends-2026-graphic-design-120126'}]}},

{id:'2026 · T2',per:'Abril a junho de 2026',
 tese:'O relatório de comportamento do trimestre desloca o eixo de novidade para estabilidade, e a consequência visual é uma preferência por continuidade legível em vez de ruptura anual.',
 cor:{tese:'Prêmio de estabilidade: cor que não precisa ser trocada todo ano',
  pal:[{n:'Azul de instituição',hex:'#2F4A7A',obs:'aproximação do azul de continuidade descrito nos relatórios'},
       {n:'Verde de campo',hex:'#5E7A4B',obs:'aproximação'},
       {n:'Areia',hex:'#D9CDBA',obs:'aproximação'},
       {n:'Tinta',hex:'#1B1A18',obs:'aproximação'}],
  corpo:['O relatório de tendências de vida da Accenture para 2026 organiza o ano em cinco movimentos, e o primeiro deles é o prêmio de estabilidade: previsibilidade de preço e de qualidade vira conforto num contexto instável, e rituais domésticos viram âncora.',
   'A tradução cromática que aparece nos materiais de identidade é a de legado dinâmico — preservar o que já é reconhecido e modernizar por dentro, em vez de recomeçar. Na prática, isso favorece esquemas análogos e monocromáticos sobre complementares, e croma médio sobre croma alto.'],
  fontes:[{n:'Accenture Life Trends 2026',u:'https://www.accenture.com/us-en/insights/song/accenture-life-trends'}]},
 tipo:{tese:'Tipo como ativo de continuidade',fam:['Source Serif 4','Public Sans','IBM Plex Sans'],
  corpo:['Quando a estratégia é continuidade, a tipografia deixa de ser onde se busca novidade e passa a ser onde se busca durabilidade: classes transicionais e humanistas, alturas de x compatíveis, famílias com faixa de peso larga o bastante para carregar hierarquia sem trocar de desenho.'],
  fontes:[{n:'Accenture Life Trends 2026',u:'https://www.accenture.com/us-en/insights/song/accenture-life-trends'}]},
 comb:{tese:'Legado dinâmico em vez de recomeço',
  corpo:['A recomendação estratégica do trimestre é preservar o patrimônio visual acumulado e evoluir por dentro. Para um sistema de cor, isso significa desvio pequeno e deliberado em relação ao que já existe — a mesma disciplina que as redes de consultoria aplicam em programas multimercado.'],
  fontes:[{n:'Accenture Life Trends 2026',u:'https://www.accenture.com/us-en/insights/song/accenture-life-trends'}]},
 apl:{tese:'Ritual como ponto de contato',
  corpo:['Se o comportamento se ancora em rotina, a aplicação que mais importa deixa de ser a campanha e passa a ser a peça recorrente: a embalagem que reaparece, a tela que se abre todo dia, o documento que chega todo mês. São superfícies que perdoam menos contraste ruim, porque são vistas muitas vezes.'],
  fontes:[{n:'Accenture Life Trends 2026',u:'https://www.accenture.com/us-en/insights/song/accenture-life-trends'}]}},

{id:'2026 · T1',per:'Janeiro a março de 2026',
 tese:'Pela primeira vez em vinte e sete anos o instituto de cor escolhe um branco. A consequência não é ausência de cor: é que o branco passa a ser tratado como material com papel, e não como fundo.',
 cor:{tese:'O branco como cor estrutural',
  pal:[{n:'Cloud Dancer',hex:'#F0EEE9',obs:'Pantone 11-4201, Cor do Ano 2026 — aproximação em sRGB'},
       {n:'Transformative Teal',hex:'#1E7F86',obs:'Cor do Ano 2026 de WGSN e Coloro — aproximação'},
       {n:'Sombra fria',hex:'#8E9298',obs:'aproximação das paletas de luz e sombra divulgadas'},
       {n:'Pastel empoeirado',hex:'#D8C7C0',obs:'aproximação das paletas de pastéis divulgadas'}],
  corpo:['Em 4 de dezembro de 2025, o instituto anunciou Pantone 11-4201 Cloud Dancer como Cor do Ano de 2026, descrita como um branco aéreo que funciona como símbolo de influência calmante numa sociedade que redescobre o valor da reflexão silenciosa. É a primeira vez que a escolha recai sobre um branco.',
   'O argumento publicado é de estrutura, não de moda: um branco que serve de andaime para o espectro e permite que as outras cores apareçam. Sete paletas foram divulgadas junto, entre elas pastéis empoeirados e luz e sombra.',
   'Em paralelo, WGSN e Coloro já haviam apontado Transformative Teal como sua Cor do Ano de 2026, por representar mudança e estabilidade ao mesmo tempo. As duas escolhas convergem no mesmo diagnóstico e divergem na resposta: uma retira, a outra media.',
   'A leitura de Goethe aqui é direta. Ele recusa tratar o branco como ausência: luz e treva são os dois polos sem os quais nenhuma cor existe. Uma Cor do Ano branca é a indústria chegando, por outro caminho, à mesma posição de 1810.'],
  fontes:[{n:'Pantone, Cor do Ano 2026',u:'https://www.pantone.com/na/en-us/color-of-the-year/2026'},
          {n:'Pantone, as sete paletas de Cloud Dancer',u:'https://www.pantone.com/na/en-us/articles/color-of-the-year/color-of-the-year-2026-color-palettes'},
          {n:'NPR, cobertura de 4 de dezembro de 2025',u:'https://www.npr.org/2025/12/04/nx-s1-5632651/pantones-color-of-the-year-2026-white'},
          {n:'Coloro, cores-chave e histórico',u:'https://coloro.com/key-colors'}]},
 tipo:{tese:'Revisão em vez de invenção',fam:['EB Garamond','Libre Caslon Text','Newsreader'],
  corpo:['O relatório anual de tendências de tipo da fundição que mais publica sobre o assunto tratou o ciclo sob o título de revisão — releitura de repertório existente em lugar de busca por forma inédita. Em termos práticos: revivals cuidadosos, tipos de texto com serifa e correção de desenhos que já circulavam há tempo demais sem ajuste.'],
  fontes:[{n:'Monotype, Type Trends',u:'https://www.monotype.com/type-trends'}]},
 comb:{tese:'Branco em área dominante, cor em recorte',
  corpo:['Uma paleta ancorada em branco estrutural exige inverter a proporção habitual: a superfície clara passa de sessenta para oitenta por cento da área, e o matiz entra como acontecimento. É o método que estúdios de contenção já praticam, agora com respaldo de calendário.',
   'O risco declarado é o esvaziamento. Branco dominante sem uma treva bem escolhida e sem um acento com contraste medido produz o que o setor chamou de identidade sem identidade.'],
  fontes:[{n:'Pantone, guia de aplicação de Cloud Dancer',u:'https://www.pantone.com/na/en-us/articles/color-of-the-year/how-to-use-pantone-color-of-the-year-2026-cloud-dancer-in-products'}]},
 apl:{tese:'Superfície tátil como compensação',
  corpo:['Quando a cor recua, a matéria avança: os materiais divulgados junto com a escolha do ano enfatizam textura acolchoada, lã, pelo e volume arredondado. Em suporte plano, o equivalente é granulação, papel visível e sombra macia — a compensação de quem tirou o matiz da equação.'],
  fontes:[{n:'Pantone, guia de aplicação de Cloud Dancer',u:'https://www.pantone.com/na/en-us/articles/color-of-the-year/how-to-use-pantone-color-of-the-year-2026-cloud-dancer-in-products'}]}}
];

export const AXES: { k: AxisKey; n: string }[] = [{ k: 'cor', n: 'Cor' }, { k: 'tipo', n: 'Tipografia' }, { k: 'comb', n: 'Combinações' }, { k: 'apl', n: 'Aplicações' }];
