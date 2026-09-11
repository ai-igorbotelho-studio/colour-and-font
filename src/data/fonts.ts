/* ═══════════ DADOS — TIPOGRAFIA ═══════════ */
export type FontClass = 'serif-old' | 'serif-trans' | 'serif-mod' | 'serif-slab' | 'sans-grot' | 'sans-neo' | 'sans-geo' | 'sans-hum' | 'mono' | 'display';
export type FontRole = 'both' | 'body' | 'display' | 'mono';
export type FontBank = 'google' | 'fontshare';

export const CLS: Record<FontClass, { n: string; d: string }> = {
 'serif-old'  :{n:'Serifada humanista',d:'As mais antigas, herdeiras da pena inclinada. Eixo oblíquo, contraste moderado, aberturas generosas. Lêem bem em texto longo e trazem calor sem parecer nostálgicas.'},
 'serif-trans':{n:'Serifada transicional',d:'O passo entre a pena e o compasso. Eixo mais vertical, contraste médio, formas reguladas. É a classe mais neutra do lado serifado e a mais segura para texto contínuo.'},
 'serif-mod'  :{n:'Serifada moderna',d:'As didonas. Eixo vertical, contraste extremo, serifas finas e retas. Brilham em corpo grande e desmancham em corpo pequeno.'},
 'serif-slab' :{n:'Serifada egípcia',d:'Serifas retangulares do mesmo peso da haste. Contraste quase nulo, presença mecânica. Aguentam condições ruins de impressão e tela.'},
 'sans-grot'  :{n:'Sem serifa grotesca',d:'As primeiras sem serifa do século XIX. Terminais horizontais, aberturas fechadas, personalidade áspera. Boas em título e em corpo médio.'},
 'sans-neo'   :{n:'Sem serifa neogrotesca',d:'A reforma modernista da grotesca: uniforme, silenciosa, quase sem maneirismo. É a classe padrão da interface.'},
 'sans-geo'   :{n:'Sem serifa geométrica',d:'Construída a partir de círculo e reta. Contraste mínimo, clareza em título, cansaço em texto longo por causa da repetição de formas.'},
 'sans-hum'   :{n:'Sem serifa humanista',d:'Uma serifada sem as serifas: eixo caligráfico, proporções variadas, aberturas amplas. A melhor classe sem serifa para texto corrido.'},
 'mono'       :{n:'Monoespaçada',d:'Todas as letras com a mesma largura. Nasceu da máquina e do terminal; hoje carrega leitura técnica, dado, código e legenda.'},
 'display'    :{n:'De exibição',d:'Desenhada para corpo grande e área pequena. Espaçamento apertado, formas fortes, nenhuma pretensão de servir a um parágrafo.'}
};

/* [nome, banco, classe, altura de x, contraste, largura, papel, pesos, superfamília, humores] */
type Raw = [string, 'g' | 'f', FontClass, number, number, number, FontRole, string, string | null, string];
const FRAW: Raw[] = [
 ['EB Garamond','g','serif-old',.42,.55,.5,'both','400;500;600;700',null,'cerimônia,repouso,editorial,elegante'],
 ['Cormorant Garamond','g','serif-old',.38,.78,.47,'display','300;400;500;600;700',null,'elegante,cerimônia,melancolia,mistério'],
 ['Crimson Pro','g','serif-old',.45,.52,.48,'body','300;400;600;700',null,'editorial,repouso,intimidade'],
 ['Gentium Book Plus','g','serif-old',.48,.45,.5,'body','400;700',null,'repouso,cuidado'],
 ['Alegreya','g','serif-old',.5,.5,.5,'both','400;500;700;800','alegreya','calor,editorial,intimidade'],
 ['Vollkorn','g','serif-old',.53,.45,.52,'both','400;500;600;700;800;900',null,'calor,abundância,intimidade'],
 ['Cardo','g','serif-old',.44,.55,.48,'body','400;700',null,'cerimônia,melancolia'],
 ['Petrona','g','serif-old',.5,.5,.48,'both','300;400;500;600;700',null,'intimidade,calor'],
 ['Erode','f','serif-old',.5,.45,.5,'both','300;400;500;600;700',null,'repouso,cuidado,editorial'],
 ['Lora','g','serif-trans',.52,.5,.5,'both','400;500;600;700',null,'confiança,editorial,cerimônia'],
 ['Spectral','g','serif-trans',.5,.45,.48,'both','300;400;500;600;700',null,'rigor,editorial,repouso'],
 ['Source Serif 4','g','serif-trans',.52,.45,.5,'both','300;400;600;700','source','confiança,institucional,rigor'],
 ['Literata','g','serif-trans',.53,.4,.52,'body','300;400;500;600;700',null,'repouso,editorial,cuidado'],
 ['Newsreader','g','serif-trans',.52,.55,.48,'both','300;400;500;600;700',null,'editorial,confiança'],
 ['Libre Baskerville','g','serif-trans',.55,.55,.54,'body','400;700',null,'confiança,institucional,editorial'],
 ['Libre Caslon Text','g','serif-trans',.5,.55,.5,'body','400;700',null,'editorial,cerimônia'],
 ['Frank Ruhl Libre','g','serif-trans',.5,.6,.48,'both','300;400;500;700;900',null,'autoridade,editorial'],
 ['Faustina','g','serif-trans',.52,.45,.5,'both','300;400;500;600;700',null,'cuidado,repouso'],
 ['Neuton','g','serif-trans',.48,.45,.48,'body','300;400;700;800',null,'repouso,melancolia'],
 ['IBM Plex Serif','g','serif-trans',.52,.4,.5,'both','300;400;500;600;700','plex','rigor,técnico,institucional'],
 ['PT Serif','g','serif-trans',.52,.45,.5,'body','400;700','pt','institucional,confiança'],
 ['Noto Serif','g','serif-trans',.53,.42,.5,'body','400;500;600;700','noto','institucional,repouso'],
 ['Author','f','serif-trans',.52,.45,.5,'both','300;400;500;600;700',null,'editorial,confiança'],
 ['Playfair Display','g','serif-mod',.55,.95,.5,'display','400;500;600;700;800;900',null,'elegante,cerimônia,desejo,autoridade'],
 ['Bodoni Moda','g','serif-mod',.48,1,.48,'display','400;500;600;700;800;900',null,'autoridade,cerimônia,elegante'],
 ['Prata','g','serif-mod',.5,.85,.5,'display','400',null,'elegante,cerimônia'],
 ['DM Serif Display','g','serif-mod',.53,.8,.5,'display','400',null,'elegante,desejo,abundância'],
 ['Abril Fatface','g','serif-mod',.55,.9,.56,'display','400',null,'energia,abundância,desejo'],
 ['Instrument Serif','g','serif-mod',.48,.8,.46,'display','400',null,'editorial,elegante,mistério'],
 ['Bespoke Serif','f','serif-mod',.5,.7,.5,'display','300;400;500;700',null,'elegante,editorial'],
 ['Zodiak','f','serif-mod',.5,.75,.5,'display','300;400;500;700;900',null,'aspiração,elegante,mistério'],
 ['Young Serif','g','display',.55,.35,.54,'display','400',null,'abundância,calor,informal'],
 ['Fraunces','g','display',.52,.6,.52,'display','300;400;500;700;900',null,'calor,informal,alegria'],
 ['Roboto Slab','g','serif-slab',.53,.2,.5,'both','300;400;500;700;900','roboto','rigor,institucional,técnico'],
 ['Bitter','g','serif-slab',.53,.25,.5,'both','300;400;500;700',null,'rigor,confiança'],
 ['Zilla Slab','g','serif-slab',.52,.2,.5,'both','300;400;500;600;700',null,'técnico,rigor'],
 ['Arvo','g','serif-slab',.52,.15,.52,'display','400;700',null,'rigor,autoridade'],
 ['Josefin Slab','g','serif-slab',.4,.3,.46,'display','300;400;600;700',null,'elegante,melancolia'],
 ['Inter','g','sans-neo',.57,.12,.5,'both','300;400;500;600;700;800',null,'rigor,técnico,confiança'],
 ['Roboto','g','sans-neo',.53,.12,.49,'both','300;400;500;700;900','roboto','institucional,rigor'],
 ['Archivo','g','sans-neo',.53,.12,.5,'both','300;400;500;600;700;800','archivo','energia,confiança'],
 ['Public Sans','g','sans-neo',.54,.12,.5,'both','300;400;500;600;700',null,'institucional,rigor'],
 ['Libre Franklin','g','sans-neo',.52,.15,.5,'both','300;400;500;600;700;800',null,'confiança,institucional'],
 ['Barlow','g','sans-neo',.52,.1,.47,'both','300;400;500;600;700',null,'energia,técnico'],
 ['Switzer','f','sans-neo',.53,.1,.5,'both','300;400;500;600;700',null,'rigor,confiança'],
 ['Noto Sans','g','sans-neo',.53,.12,.5,'body','400;500;600;700','noto','institucional,repouso'],
 ['Space Grotesk','g','sans-grot',.53,.12,.5,'both','300;400;500;600;700',null,'técnico,mistério,aspiração'],
 ['Chivo','g','sans-grot',.52,.12,.5,'both','300;400;700;900',null,'energia,confiança'],
 ['Karla','g','sans-grot',.52,.1,.49,'both','300;400;500;600;700;800',null,'informal,alegria'],
 ['Ranade','f','sans-grot',.52,.12,.49,'both','300;400;500;700',null,'informal,técnico'],
 ['Oswald','g','sans-grot',.55,.1,.31,'display','300;400;500;600;700',null,'energia,autoridade,urgência'],
 ['Archivo Narrow','g','sans-neo',.53,.12,.33,'display','400;500;600;700','archivo','energia,urgência'],
 ['Anton','g','display',.56,.1,.33,'display','400',null,'energia,urgência,autoridade'],
 ['Archivo Black','g','display',.54,.12,.6,'display','400',null,'autoridade,energia'],
 ['Poppins','g','sans-geo',.52,.05,.52,'both','300;400;500;600;700;800',null,'alegria,informal,otimismo'],
 ['Montserrat','g','sans-geo',.53,.08,.53,'both','300;400;500;600;700;800',null,'confiança,alegria'],
 ['Jost','g','sans-geo',.48,.08,.48,'both','300;400;500;600;700',null,'rigor,elegante,repouso'],
 ['Outfit','g','sans-geo',.52,.05,.5,'both','300;400;500;600;700;800',null,'alegria,otimismo'],
 ['Lexend','g','sans-geo',.55,.08,.51,'body','300;400;500;600;700',null,'cuidado,repouso,alegria'],
 ['Sora','g','sans-geo',.52,.1,.5,'display','300;400;500;600;700;800',null,'mistério,técnico,aspiração'],
 ['Questrial','g','sans-geo',.5,.05,.5,'display','400',null,'repouso,elegante'],
 ['Urbanist','g','sans-geo',.52,.05,.49,'both','300;400;500;600;700;800',null,'alegria,otimismo'],
 ['Satoshi','f','sans-geo',.53,.07,.5,'both','300;400;500;700;900',null,'confiança,rigor,alegria'],
 ['General Sans','f','sans-geo',.53,.07,.5,'both','300;400;500;600;700',null,'confiança,repouso'],
 ['Chillax','f','sans-geo',.52,.05,.51,'display','300;400;500;600',null,'informal,alegria,cuidado'],
 ['Open Sans','g','sans-hum',.54,.15,.5,'body','300;400;500;600;700;800',null,'confiança,repouso'],
 ['Source Sans 3','g','sans-hum',.52,.15,.49,'both','300;400;500;600;700','source','institucional,confiança'],
 ['Lato','g','sans-hum',.5,.12,.49,'both','300;400;700;900',null,'calor,confiança'],
 ['PT Sans','g','sans-hum',.52,.15,.49,'body','400;700','pt','institucional,repouso'],
 ['Nunito Sans','g','sans-hum',.53,.1,.5,'both','300;400;600;700;800',null,'cuidado,alegria'],
 ['Rubik','g','sans-hum',.53,.08,.51,'both','300;400;500;600;700;800',null,'alegria,informal'],
 ['Work Sans','g','sans-hum',.52,.1,.5,'both','300;400;500;600;700;800',null,'confiança,rigor'],
 ['Mulish','g','sans-hum',.52,.08,.49,'body','300;400;500;600;700;800',null,'repouso,cuidado'],
 ['Figtree','g','sans-hum',.53,.08,.5,'both','300;400;500;600;700;800',null,'alegria,otimismo'],
 ['Cabin','g','sans-hum',.52,.12,.49,'body','400;500;600;700',null,'cuidado,calor'],
 ['Asap','g','sans-hum',.53,.1,.5,'both','400;500;600;700',null,'informal,alegria'],
 ['IBM Plex Sans','g','sans-hum',.52,.12,.5,'both','300;400;500;600;700','plex','técnico,rigor,confiança'],
 ['Alegreya Sans','g','sans-hum',.5,.15,.48,'both','300;400;500;700;800','alegreya','calor,editorial'],
 ['Fira Sans','g','sans-hum',.53,.12,.5,'both','300;400;500;600;700','fira','técnico,confiança'],
 ['Syne','g','display',.52,.2,.52,'display','400;500;600;700;800',null,'aspiração,mistério,energia'],
 ['Unbounded','g','display',.55,.15,.53,'display','300;400;500;600;700;800',null,'energia,abundância'],
 ['Bricolage Grotesque','g','display',.55,.2,.5,'display','300;400;500;600;700;800',null,'informal,editorial,energia'],
 ['Clash Display','f','display',.53,.15,.5,'display','400;500;600;700',null,'energia,autoridade,aspiração'],
 ['Cabinet Grotesk','f','display',.53,.15,.5,'display','300;400;500;700;800',null,'editorial,autoridade'],
 ['Panchang','f','display',.52,.2,.52,'display','300;400;500;600;700',null,'abundância,informal,energia'],
 ['JetBrains Mono','g','mono',.55,.1,.5,'mono','300;400;500;700',null,'técnico,rigor'],
 ['IBM Plex Mono','g','mono',.52,.1,.5,'mono','300;400;500;600;700','plex','técnico,rigor'],
 ['Space Mono','g','mono',.53,.12,.5,'mono','400;700',null,'mistério,técnico'],
 ['Roboto Mono','g','mono',.53,.1,.5,'mono','300;400;500;700','roboto','técnico,institucional'],
 ['Fira Code','g','mono',.53,.1,.5,'mono','300;400;500;600;700','fira','técnico'],
 ['DM Mono','g','mono',.52,.1,.5,'mono','300;400;500',null,'técnico,repouso'],
 ['Source Code Pro','g','mono',.52,.1,.49,'mono','300;400;500;600;700','source','técnico,rigor']
];

export interface Font { n: string; src: FontBank; cls: FontClass; x: number; ct: number; w: number; role: FontRole; wts: string; sf: string | null; moods: string[] }
export const FONTS: Font[] = FRAW.map(t => ({ n: t[0], src: t[1] === 'g' ? 'google' : 'fontshare', cls: t[2], x: t[3], ct: t[4], w: t[5],
  role: t[6], wts: t[7], sf: t[8], moods: t[9].split(',') }));

export const SUPER: Record<string, string> = { plex: 'IBM Plex', source: 'Source', roboto: 'Roboto', pt: 'PT', noto: 'Noto', alegreya: 'Alegreya', fira: 'Fira', archivo: 'Archivo' };

export interface Option { v: string; n: string }
export const USES: Option[] = [
 {v:'none',n:'Nenhum — sem preferência'},
 {v:'editorial',n:'Editorial e texto longo'},
 {v:'ui',n:'Interface e produto digital'},
 {v:'display',n:'Cartaz, capa e título grande'},
 {v:'apres',n:'Apresentação e slide'},
 {v:'doc',n:'Documento e relatório'},
 {v:'site',n:'Site institucional'}
];
export const STRATS: Option[] = [
 {v:'none',n:'Nenhuma — só respeitar os filtros'},
 {v:'contraste',n:'Contraste de estrutura'},
 {v:'super',n:'Superfamília'},
 {v:'uma',n:'Uma só família'},
 {v:'metrica',n:'Compatibilidade métrica'},
 {v:'oposto',n:'Oposição máxima'}
];
export const WIDTHS: Option[] = [{v:'none',n:'Nenhuma'},{v:'cond',n:'Condensada'},{v:'norm',n:'Normal'},{v:'ext',n:'Larga'}];
export const CONTRS: Option[] = [{v:'none',n:'Nenhum'},{v:'low',n:'Baixo — mecânico'},{v:'med',n:'Médio'},{v:'high',n:'Alto — didona'}];
export const BANKS: [string, string, string][] = [
 ['Google Fonts','O maior banco aberto, com API de entrega e download direto. Licenças SIL OFL e Apache na maioria.','woff2 pela API, ttf no download'],
 ['Fontshare','Banco da Indian Type Foundry com famílias contemporâneas gratuitas para uso comercial.','woff2 e woff pela API, otf e ttf no download'],
 ['Fontsource','Espelho das famílias do Google empacotado para npm e CDN, útil para hospedagem própria.','woff2 e woff por arquivo de peso'],
 ['Bunny Fonts','Espelho do Google sem rastreamento, com a mesma sintaxe de URL.','woff2'],
 ['Velvetyne','Fundição francesa livre, com desenhos experimentais e licenças abertas.','otf, ttf e woff2'],
 ['The League of Moveable Type','Projeto veterano de fontes abertas, poucas famílias e muito cuidadas.','otf, ttf e woff'],
 ['Uncut','Curadoria de famílias gratuitas contemporâneas de várias fundições.','varia por família'],
 ['Open Foundry','Curadoria com ficha técnica e ensaio sobre cada família aberta.','otf e woff']
];

/* ── níveis da hierarquia ── */
export type WeightKind = 'reg' | 'mid' | 'bold' | 'max';
export type RoleSlot = 'aux' | 'disp' | 'body' | 'accent' | 'quote';
export type CaseKind = 'none' | 'upper' | 'lower' | 'cap';
export interface Role { k: string; n: string; step: number; wt: WeightKind; lh: number; tr: number; it: boolean; cs: CaseKind; slot: RoleSlot }
export const ROLES: Role[] = [
 {k:'rotulo',    n:'Rótulo',     step:-1,wt:'mid', lh:1.4, tr:.05, it:false,cs:'none',slot:'aux'},
 {k:'titulo',    n:'Título',     step:4, wt:'max', lh:1.0, tr:-.02,it:false,cs:'none',slot:'disp'},
 {k:'subtitulo', n:'Subtítulo',  step:2, wt:'mid', lh:1.18,tr:-.01,it:false,cs:'none',slot:'disp'},
 {k:'paragrafo', n:'Parágrafo',  step:0, wt:'reg', lh:1.6, tr:0,   it:false,cs:'none',slot:'body'},
 {k:'destaque',  n:'Destaque',   step:1, wt:'bold',lh:1.38,tr:0,   it:false,cs:'none',slot:'accent'},
 {k:'citacao',   n:'Citação',    step:2, wt:'reg', lh:1.3, tr:-.01,it:true, cs:'none',slot:'quote'},
 {k:'referencia',n:'Referência', step:-1,wt:'reg', lh:1.5, tr:.01, it:false,cs:'none',slot:'aux'},
 {k:'botao',     n:'Botão',      step:0, wt:'mid', lh:1,   tr:.01, it:false,cs:'none',slot:'accent'}
];
export const CASES: Option[] = [{v:'none',n:'Nenhuma — como está'},{v:'upper',n:'Maiúsculas'},{v:'lower',n:'Minúsculas'},{v:'cap',n:'Iniciais maiúsculas'}];
export const STEPS: number[] = [-2, -1, 0, 1, 2, 3, 4, 5, 6];

export const SAMPLE_TXT = `### Instrumento cromático
# A cor nasce no limite entre a luz e a treva
## Goethe recusou a explicação puramente física e colocou o olho no centro do problema
O que vemos depende do objeto, da iluminação e de quem olha. Dessa recusa nasce um círculo de seis matizes, com um lado que se aproxima e outro que se afasta, e uma intensificação que leva os dois extremos a se encontrarem no purpúreo.
! A mesma lógica vale para a escolha de uma família tipográfica: a forma não é neutra.
> No verde, olho e alma descansam. Não se quer ir além, e não se pode.
A escolha entre duas famílias raramente é de gosto. É de estrutura: altura de x, contraste de traço, largura e ritmo decidem se o parágrafo parece uniforme ou manchado.
[Ver a paleta completa]
-- Zur Farbenlehre, 1810. Tradução livre.`;
