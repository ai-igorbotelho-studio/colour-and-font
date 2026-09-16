// src/core/color.ts
var lin = (c) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
var unlin = (v) => {
  const x = v <= 31308e-7 ? v * 12.92 : 1.055 * Math.pow(Math.max(v, 0), 1 / 2.4) - 0.055;
  return Math.max(0, Math.min(1, x));
};
var hex2rgb = (h) => {
  h = h.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};
var rgb2hex = (r, g, b) => "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("").toUpperCase();
function rgb2oklab(r, g, b) {
  const R = lin(r), G = lin(g), B = lin(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B), m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B), s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return { L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s };
}
function oklab2raw(L2, A, B) {
  const l = (L2 + 0.3963377774 * A + 0.2158037573 * B) ** 3, m = (L2 - 0.1055613458 * A - 0.0638541728 * B) ** 3, s = (L2 - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}
var inG = (v) => v.every((c) => c >= -1e-3 && c <= 1.001);
function oklch2hex(L2, C, H) {
  L2 = Math.max(0, Math.min(1, L2));
  const rad = H * Math.PI / 180;
  let lo = 0, hi = Math.max(C, 0);
  if (inG(oklab2raw(L2, C * Math.cos(rad), C * Math.sin(rad)))) lo = C;
  else for (let i = 0; i < 20; i++) {
    const md = (lo + hi) / 2;
    if (inG(oklab2raw(L2, md * Math.cos(rad), md * Math.sin(rad)))) lo = md;
    else hi = md;
  }
  const v = oklab2raw(L2, lo * Math.cos(rad), lo * Math.sin(rad));
  return rgb2hex(unlin(v[0]) * 255, unlin(v[1]) * 255, unlin(v[2]) * 255);
}
function hex2lch(h) {
  const [r, g, b] = hex2rgb(h), o = rgb2oklab(r, g, b);
  return { L: o.L, C: Math.hypot(o.a, o.b), H: (Math.atan2(o.b, o.a) * 180 / Math.PI + 360) % 360 };
}
var lum = (h) => {
  const [r, g, b] = hex2rgb(h);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
var ratio = (a, b) => {
  const x = lum(a), y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
var wrapDeg = (d) => {
  d = (d % 360 + 360) % 360;
  return d > 180 ? d - 360 : d;
};
function rgb2hsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) {
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  const l = (mx + mn) / 2, s = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
  return [h, s * 100, l * 100];
}
function rgb2cmyk(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return [0, 0, 0, 100];
  return [(1 - r - k) / (1 - k) * 100, (1 - g - k) / (1 - k) * 100, (1 - b - k) / (1 - k) * 100, k * 100];
}

// src/i18n/ui-en.ts
var UI = {
  /* ── casca ── */
  "Ir para o conte\xFAdo": "Skip to content",
  "In\xEDcio": "Home",
  "Fundo": "Ground",
  "Luz": "Light",
  "Treva": "Dark",
  "Se\xE7\xF5es": "Sections",
  "Idioma": "Language",
  "Cores": "Colour",
  "Tipografia": "Type",
  "Cria\xE7\xE3o": "Create",
  "Tend\xEAncias": "Trends",
  "Teoria": "Theory",
  "Auge \u2014 instrumentos de cor e tipografia": "Auge \u2014 instruments for colour and type",
  "Instrumentos de cor e tipografia derivados do c\xEDrculo crom\xE1tico de Goethe: paletas por inten\xE7\xE3o e campo, combina\xE7\xE3o de fam\xEDlias, hierarquia, legibilidade medida e tend\xEAncias trimestrais.": "Instruments for colour and type derived from Goethe's colour circle: palettes by intention and field, type pairing, hierarchy, measured legibility and quarterly trends.",
  "Paletas derivadas do c\xEDrculo de Goethe, combina\xE7\xE3o tipogr\xE1fica com hierarquia, legibilidade medida em WCAG e um compilado trimestral de tend\xEAncias.": "Palettes derived from Goethe's circle, type pairing with hierarchy, legibility measured to WCAG and a quarterly digest of trends.",
  /* ── início ── */
  "Cor e tipografia": "Colour and type",
  "como instrumentos": "as instruments",
  "Paletas derivadas do c\xEDrculo de Goethe, combina\xE7\xE3o de fam\xEDlias com hierarquia, legibilidade medida e um compilado trimestral de tend\xEAncias. Escolha por onde come\xE7ar.": "Palettes derived from Goethe's circle, type pairing with hierarchy, measured legibility and a quarterly digest of trends. Choose where to begin.",
  "Roda de Goethe, esquemas, lentes de est\xFAdio, legibilidade e vinte formatos de exporta\xE7\xE3o.": "Goethe's wheel, schemes, studio lenses, legibility and twenty export formats.",
  "Noventa e tr\xEAs fam\xEDlias livres, cinco estrat\xE9gias de combina\xE7\xE3o e oito n\xEDveis de hierarquia ao vivo.": "Ninety-three open families, five pairing strategies and eight live levels of hierarchy.",
  "Descreva a pe\xE7a e receba tr\xEAs propostas por caminhos opostos, com paleta, fam\xEDlias e amostra.": "Describe the piece and receive three proposals by opposite routes, each with palette, families and specimen.",
  "Edi\xE7\xF5es trimestrais com fonte e data: cor, tipografia, combina\xE7\xF5es e aplica\xE7\xF5es.": "Quarterly editions with source and date: colour, type, pairings and applications.",
  "O c\xEDrculo de Goethe, os tr\xEAs regimes, OKLab, contraste e a classifica\xE7\xE3o tipogr\xE1fica.": "Goethe's circle, the three regimes, OKLab, contrast and the classification of type.",
  /* ── fundamentação ── */
  "O que est\xE1 por tr\xE1s": "What lies behind",
  "dos instrumentos": "the instruments",
  "Duas ferramentas e uma base te\xF3rica comum. A de cor deriva paletas a partir do c\xEDrculo de Goethe, de inten\xE7\xF5es, de setores, de m\xE9todos de est\xFAdio, de refer\xEAncias culturais e de din\xE2micas musicais. A de tipografia faz o mesmo com fam\xEDlias tipogr\xE1ficas e combina\xE7\xF5es. Esta p\xE1gina explica o que est\xE1 por tr\xE1s das duas.": "Two tools and one shared theoretical base. The colour tool derives palettes from Goethe's circle, from intentions, sectors, studio methods, cultural references and musical dynamics. The type tool does the same with typefaces and pairings. This page explains what lies behind both.",
  "O c\xEDrculo de Goethe": "Goethe's colour circle",
  "Em 1810, Goethe recusou a explica\xE7\xE3o de Newton e colocou o olho no centro: o que vemos depende do objeto, da ilumina\xE7\xE3o e da percep\xE7\xE3o. Da\xED ele deriva um c\xEDrculo de seis matizes, um lado positivo e um negativo, uma intensifica\xE7\xE3o em dire\xE7\xE3o ao purp\xFAreo, e tr\xEAs regimes de combina\xE7\xE3o.": "In 1810 Goethe refused Newton's explanation and put the eye at the centre: what we see depends on the object, the light and perception. From that he derives a circle of six hues, a positive and a negative side, an intensification towards purple, and three regimes of combination.",
  "Lado positivo": "The positive side",
  "Amarelo, vermelho-amarelo, escarlate. Goethe os descreve como ativos, quentes, que se aproximam de quem olha. O amarelo \xE9 a cor imediatamente vizinha da luz; o vermelho-amarelo \xE9 o lado ativo em sua maior energia.": "Yellow, red-yellow, scarlet. Goethe describes them as active, warm, advancing towards the viewer. Yellow is the colour nearest to light; red-yellow is the active side at its highest energy.",
  "Lado negativo": "The negative side",
  "Azul, vermelho-azul. Passivos, frios, que afastam. O azul carrega consigo um princ\xEDpio de treva: atrai e ao mesmo tempo puxa para longe.": "Blue, red-blue. Passive, cold, receding. Blue carries a principle of darkness: it draws us in and at the same time pulls away.",
  "Intensifica\xE7\xE3o": "Intensification",
  "Cada lado pode ser empurrado em dire\xE7\xE3o ao vermelho. No purp\xFAreo os dois se encontram \u2014 \xE9 o cume, ao qual Goethe atribui dignidade e gravidade.": "Each side can be pushed towards red. In purple the two meet \u2014 the summit, to which Goethe attributes dignity and gravity.",
  "Verde": "Green",
  "A uni\xE3o do amarelo com o azul. Ali, diz ele, olho e alma descansam: n\xE3o se quer ir al\xE9m, e n\xE3o se pode.": "The union of yellow and blue. There, he says, eye and soul rest: one does not wish to go further, and cannot.",
  "Preto e branco s\xE3o cores.": "Black and white are colours.",
  "Em Goethe, a cor nasce no limite entre luz e treva, atravessada por um meio turvo. A treva n\xE3o \xE9 aus\xEAncia: \xE9 o outro polo, sem o qual nenhuma cor existiria. As duas ferramentas aqui tratam luz e treva como participantes plenos, com matiz, papel e propor\xE7\xE3o pr\xF3prios \u2014 e n\xE3o como fundo neutro.": "For Goethe, colour is born at the boundary between light and darkness, seen through a turbid medium. Darkness is not absence: it is the other pole, without which no colour would exist. Both tools here treat light and darkness as full participants, with their own hue, role and proportion \u2014 not as neutral background.",
  "Os tr\xEAs regimes de Goethe": "Goethe's three regimes",
  "Antes do vocabul\xE1rio moderno de esquemas, Goethe j\xE1 classificava as combina\xE7\xF5es em tr\xEAs \u2014 e dava seu veredito sobre cada uma.": "Before the modern vocabulary of schemes, Goethe already sorted combinations into three \u2014 and passed his verdict on each.",
  "Harm\xF4nica": "Harmonious",
  "Caracter\xEDstica": "Characteristic",
  "Sem car\xE1ter": "Characterless",
  "Os opostos do c\xEDrculo. O olho, for\xE7ado a uma s\xF3 cor, produz por conta pr\xF3pria a oposta, e s\xF3 ent\xE3o se sente completo. Carregam em si a condi\xE7\xE3o de totalidade: \xE9 o par mais est\xE1vel e o menos surpreendente.": "The opposites of the circle. The eye, forced to a single colour, produces the opposite of its own accord and only then feels complete. They carry the condition of totality within them: the most stable pair and the least surprising.",
  "Um espa\xE7o de dist\xE2ncia no c\xEDrculo \u2014 amarelo e azul, amarelo e vermelho, azul e vermelho. Dizem alguma coisa, ainda que n\xE3o tudo. \xC9 onde mora quase todo trabalho interessante.": "One space apart on the circle \u2014 yellow and blue, yellow and red, blue and red. They say something, though not everything. It is where almost all interesting work lives.",
  "Vizinhas no c\xEDrculo. N\xE3o produzem efeito desagrad\xE1vel, mas ficam aqu\xE9m: falta-lhes car\xE1ter. Servem quando outra coisa carrega o sistema.": "Neighbours on the circle. They produce no unpleasant effect, but fall short: they lack character. Useful when something else carries the system.",
  "O vocabul\xE1rio moderno de esquemas": "The modern vocabulary of schemes",
  "O que o s\xE9culo XX chamou de esquemas s\xE3o rela\xE7\xF5es geom\xE9tricas no c\xEDrculo. Todos est\xE3o no instrumento de cor, e a geometria \xE9 preservada enquanto voc\xEA arrasta as bolas.": "What the twentieth century called schemes are geometric relations on the circle. All of them are in the colour instrument, and the geometry is preserved while you drag the balls.",
  "Monocrom\xE1tico varia luminosidade e croma num s\xF3 matiz. An\xE1logo fica em vizinhan\xE7a. Complementar cruza o c\xEDrculo. Tr\xEDade divide em tr\xEAs. Complementar dividido troca o oposto pelos dois vizinhos dele \u2014 mant\xE9m a tens\xE3o e reduz o choque. Tetr\xE1dico forma um ret\xE2ngulo e entrega dois pares opostos.": "Monochromatic varies lightness and chroma within one hue. Analogous stays in the neighbourhood. Complementary crosses the circle. Triadic divides it in three. Split-complementary swaps the opposite for its two neighbours \u2014 keeps the tension, reduces the clash. Tetradic forms a rectangle and delivers two opposite pairs.",
  "Luz que soma, pigmento que subtrai": "Light that adds, pigment that subtracts",
  "Uma paleta se comporta de dois modos diferentes conforme o suporte, e confundir os dois \xE9 a origem de boa parte da frustra\xE7\xE3o entre tela e impress\xE3o. Arraste os c\xEDrculos abaixo: as sobreposi\xE7\xF5es s\xE3o calculadas de verdade pelo navegador, somando ou subtraindo.": "A palette behaves in two different ways depending on the medium, and confusing the two is the source of much of the frustration between screen and print. Drag the circles below: the overlaps are genuinely computed by the browser, adding or subtracting.",
  "Recolocar": "Reset",
  "Arraste os c\xEDrculos.": "Drag the circles.",
  "Aditiva \u2014 RGB": "Additive \u2014 RGB",
  "Subtrativa \u2014 CMYK": "Subtractive \u2014 CMYK",
  "Feixes de luz somados. Vermelho, verde e azul se sobrep\xF5em e produzem ciano, magenta e amarelo; os tr\xEAs juntos d\xE3o branco. \xC9 o modelo da tela, do projetor, do LED. Somar luz clareia.": "Beams of light added together. Red, green and blue overlap to produce cyan, magenta and yellow; all three give white. It is the model of the screen, the projector, the LED. Adding light brightens.",
  "Tintas que filtram a luz refletida pelo papel. Ciano, magenta e amarelo sobrepostos absorvem quase tudo e tendem ao preto \u2014 na pr\xE1tica um preto sujo, por isso a impress\xE3o acrescenta o K. Somar pigmento escurece.": "Inks that filter the light reflected by paper. Cyan, magenta and yellow overlapped absorb almost everything and tend towards black \u2014 in practice a muddy black, which is why print adds K. Adding pigment darkens.",
  "Consequ\xEAncia pr\xE1tica.": "A practical consequence.",
  "Amarelos, verdes e azuis muito saturados que existem em tela n\xE3o t\xEAm equivalente em tinta de escala. O instrumento de cor mostra o valor CMYK ao lado do RGB justamente para tornar essa perda vis\xEDvel antes de ela virar prova de gr\xE1fica.": "Highly saturated yellows, greens and blues that exist on screen have no equivalent in process ink. The colour instrument shows the CMYK value beside the RGB precisely to make that loss visible before it turns into a press proof.",
  "Por que OKLab": "Why OKLab",
  "HSL \xE9 f\xE1cil de calcular e mente sobre o olho: um amarelo e um azul com a mesma luminosidade declarada n\xE3o parecem ter a mesma luminosidade. OKLab \xE9 um espa\xE7o perceptualmente uniforme \u2014 dist\xE2ncias iguais no n\xFAmero correspondem a diferen\xE7as mais parecidas na percep\xE7\xE3o.": "HSL is easy to compute and lies about the eye: a yellow and a blue with the same declared lightness do not look equally light. OKLab is a perceptually uniform space \u2014 equal distances in the numbers correspond to more similar differences in perception.",
  "Acima, a mesma sequ\xEAncia de matizes com luminosidade fixa em HSL e em OKLab. Toda interpola\xE7\xE3o, escala de tons e ajuste destas ferramentas acontece em OKLab, e o croma \xE9 reduzido at\xE9 caber no sRGB em vez de ser cortado.": "Above, the same sequence of hues at fixed lightness in HSL and in OKLab. Every interpolation, tonal scale and adjustment in these tools happens in OKLab, and chroma is reduced until it fits sRGB rather than clipped.",
  "Contraste n\xE3o \xE9 gosto": "Contrast is not taste",
  "A raz\xE3o de contraste do WCAG mede o que o olho consegue ler, n\xE3o o que ele sente. Texto corrido pede 4.5, texto grande e elementos de interface pedem 3.0. As duas ferramentas calculam isso automaticamente para todos os pares e avisam quando a combina\xE7\xE3o bonita \xE9 ileg\xEDvel.": "The WCAG contrast ratio measures what the eye can read, not what it feels. Body text asks for 4.5, large text and interface elements for 3.0. Both tools compute this automatically for every pair and warn when the handsome combination is illegible.",
  "Classifica\xE7\xE3o tipogr\xE1fica": "Classifying type",
  "A escolha de uma fam\xEDlia come\xE7a por identificar a que fam\xEDlia hist\xF3rica ela pertence \u2014 porque \xE9 isso que define como ela se comporta em texto longo, em tamanho grande e em tela pequena.": "Choosing a typeface begins with identifying which historical family it belongs to \u2014 because that is what determines how it behaves in long text, at large sizes and on small screens.",
  "Anatomia que importa na pr\xE1tica": "Anatomy that matters in practice",
  "Altura de x": "x-height",
  "A altura das min\xFAsculas em rela\xE7\xE3o \xE0s mai\xFAsculas. Alta l\xEA bem em tamanho pequeno e em tela; baixa tem eleg\xE2ncia e pede corpo maior. Duas fam\xEDlias com alturas de x muito diferentes brigam quando postas lado a lado.": "The height of the lowercase relative to the capitals. High reads well at small sizes and on screen; low has elegance and asks for a larger size. Two families with very different x-heights fight when set side by side.",
  "Contraste de tra\xE7o": "Stroke contrast",
  "A diferen\xE7a entre a haste grossa e a fina. Alto contraste \u2014 as modernas, as didonas \u2014 brilha em t\xEDtulo e some em corpo pequeno. Baixo contraste aguenta condi\xE7\xF5es ruins de leitura.": "The difference between the thick and the thin stroke. High contrast \u2014 the moderns, the Didones \u2014 shines in headlines and vanishes at small sizes. Low contrast withstands poor reading conditions.",
  "Abertura": "Aperture",
  "O quanto letras como c, e, s se fecham. Aberturas amplas mant\xEAm as letras distingu\xEDveis \xE0 dist\xE2ncia e em corpo pequeno; fechadas d\xE3o densidade e ar editorial.": "How far letters such as c, e and s close up. Wide apertures keep letters distinct at a distance and at small sizes; closed ones give density and an editorial air.",
  "Largura e ritmo": "Width and rhythm",
  "Condensada economiza espa\xE7o e acelera; estendida ocupa e desacelera. O ritmo entre letra e contraforma \xE9 o que faz um par\xE1grafo parecer uniforme ou manchado.": "Condensed saves space and speeds up; extended occupies and slows down. The rhythm between letter and counter is what makes a paragraph look even or patchy.",
  "Medida": "Measure",
  "O comprimento da linha. Entre 45 e 75 caracteres \xE9 a faixa em que o olho encontra o in\xEDcio da pr\xF3xima linha sem esfor\xE7o. Linha longa demais exige mais entrelinha para compensar.": "The length of the line. Between 45 and 75 characters is the range in which the eye finds the start of the next line without effort. Too long a line demands more leading to compensate.",
  "Escala modular": "Modular scale",
  "Os tamanhos derivam de uma raz\xE3o constante \u2014 quarta justa, quinta, \xE1urea. A hierarquia fica previs\xEDvel e as decis\xF5es param de ser arbitr\xE1rias.": "Sizes derive from a constant ratio \u2014 perfect fourth, fifth, golden. The hierarchy becomes predictable and decisions stop being arbitrary.",
  "Como combinar duas fam\xEDlias": "How to pair two families",
  "O erro comum \xE9 buscar semelhan\xE7a. Duas fam\xEDlias parecidas n\xE3o se harmonizam: elas competem, e a diferen\xE7a pequena parece defeito.": "The common mistake is to seek similarity. Two similar families do not harmonise: they compete, and the small difference looks like a fault.",
  "Contraste de estrutura": "Structural contrast",
  "Uma serifada de alto contraste no t\xEDtulo contra uma sem serifa humanista no corpo. A diferen\xE7a \xE9 clara, a hierarquia se resolve sozinha e nenhuma das duas parece erro.": "A high-contrast serif for the headline against a humanist sans for the body. The difference is clear, the hierarchy resolves itself and neither looks like a mistake.",
  "Superfam\xEDlia": "Superfamily",
  "Fam\xEDlias desenhadas juntas para conviver \u2014 a vers\xE3o serifada, a sem serifa e a monoespa\xE7ada do mesmo projeto. Harmonia garantida, contraste menor, risco de monotonia.": "Families drawn together to coexist \u2014 the serif, sans and monospaced versions of one design. Harmony guaranteed, less contrast, a risk of monotony.",
  "Uma s\xF3 fam\xEDlia": "A single family",
  "Toda a hierarquia feita por peso, tamanho, largura e caixa. \xC9 a sa\xEDda mais dif\xEDcil de errar e a que mais depende de disciplina de espa\xE7amento.": "The whole hierarchy built from weight, size, width and case. The hardest route to get wrong, and the one that most depends on spacing discipline.",
  "Compatibilidade m\xE9trica": "Metric compatibility",
  "Mesmo com estruturas diferentes, altura de x e largura pr\xF3ximas fazem as duas parecerem escolhidas juntas. \xC9 o crit\xE9rio que o instrumento usa para pontuar as combina\xE7\xF5es.": "Even with different structures, close x-heights and widths make the two look chosen together. It is the criterion the instrument uses to score pairings.",
  "Base te\xF3rica:": "Theoretical basis:",
  "(1810), na parte dos efeitos sens\xEDveis e morais da cor e nos cap\xEDtulos sobre completude e combina\xE7\xF5es caracter\xEDsticas. Convers\xF5es de cor em OKLab, com ajuste de croma para o gamut sRGB. Raz\xF5es de contraste segundo WCAG 2.1. Fam\xEDlias tipogr\xE1ficas de bancos abertos \u2014 Google Fonts, Fontshare, Fontsource \u2014 com licen\xE7as que permitem uso e hospedagem pr\xF3pria.": "(1810), in the section on the sensuous and moral effect of colour and the chapters on completeness and characteristic combinations. Colour conversions in OKLab, with chroma adjusted to the sRGB gamut. Contrast ratios to WCAG 2.1. Typefaces from open libraries \u2014 Google Fonts, Fontshare, Fontsource \u2014 with licences that allow use and self-hosting.",
  /* ── cores ── */
  "C\xEDrculo de Goethe. Arraste as bolas para mudar as cores.": "Goethe's circle. Drag the balls to change the colours.",
  "O que a pe\xE7a precisa provocar": "What the piece needs to evoke",
  "Campo de atua\xE7\xE3o": "Field",
  "Postura diante da conven\xE7\xE3o do campo": "Stance towards the field's convention",
  "Pertencer": "Belong",
  "Romper": "Break",
  "Esquema geom\xE9trico": "Geometric scheme",
  "Quantas cores": "How many colours",
  "N\xFAmero de cores": "Number of colours",
  "Lente de est\xFAdio": "Studio lens",
  "Refer\xEAncia cultural": "Cultural reference",
  "Estilo musical": "Musical style",
  "Simular vis\xE3o de cor": "Simulate colour vision",
  "Gerar \xB7 barra de espa\xE7o": "Generate \xB7 space bar",
  "\u2190 Voltar": "\u2190 Undo",
  "Refazer \u2192": "Redo \u2192",
  "Exportar": "Export",
  "Ver em escala": "View full screen",
  "Salvar": "Save",
  "Paleta": "Palette",
  "Modo de visualiza\xE7\xE3o": "View mode",
  "Cor": "Colour",
  "Escala de tons": "Tonal scale",
  "Fechar": "Close",
  "A leitura de Goethe": "Goethe's reading",
  "Campo, lente, cultura e som": "Field, lens, culture and sound",
  "Legibilidade": "Legibility",
  "Uma paleta bonita pode ser ileg\xEDvel, e o olho de quem a escolheu \xE9 o pior juiz disso. Esta grade responde a uma pergunta pr\xE1tica: se eu escrever com uma cor desta paleta sobre um fundo de outra, algu\xE9m consegue ler?": "A handsome palette can be illegible, and the eye that chose it is the worst judge. This grid answers a practical question: if I write in one colour of this palette on a ground of another, can anyone read it?",
  "O n\xFAmero \xE9 a raz\xE3o de contraste entre as duas \u2014 quanto maior, mais separadas elas est\xE3o para o olho. Cada c\xE9lula est\xE1 pintada com o par de verdade, ent\xE3o a pr\xF3pria grade mostra o resultado: onde o n\xFAmero some, o texto tamb\xE9m some.": "The number is the contrast ratio between the two \u2014 the higher, the further apart they are to the eye. Each cell is painted with the actual pair, so the grid shows the result itself: where the number vanishes, so does the text.",
  "Exig\xEAncia": "Requirement",
  "Texto corrido": "Body text",
  "Texto grande": "Large text",
  "Exig\xEAncia m\xE1xima": "Highest requirement",
  "A linha \xE9 o fundo, a coluna \xE9 o texto. Toque numa c\xE9lula para ver o par em tamanho real e corrigir o que n\xE3o passa.": "Rows are the ground, columns the text. Tap a cell to see the pair at real size and correct what fails.",
  "Os pares que funcionam": "The pairs that work",
  "Gradientes": "Gradients",
  "Arraste as paradas na r\xE9gua. O espa\xE7o de interpola\xE7\xE3o muda tudo: em sRGB dois tons cruzados passam por um meio cinzento; em OKLab o caminho \xE9 perceptualmente reto e n\xE3o afunda.": "Drag the stops along the ruler. The interpolation space changes everything: in sRGB two crossing tones pass through a greyish middle; in OKLab the path is perceptually straight and does not sink.",
  "Adicionar parada": "Add stop",
  "Remover parada": "Remove stop",
  "Puxar da paleta": "Pull from palette",
  "Inverter": "Reverse",
  "Tipo": "Type",
  "Linear": "Linear",
  "Radial": "Radial",
  "C\xF4nico": "Conic",
  "Espa\xE7o de interpola\xE7\xE3o": "Interpolation space",
  "OKLab \u2014 perceptual": "OKLab \u2014 perceptual",
  "OKLCH \u2014 pelo arco do matiz": "OKLCH \u2014 along the hue arc",
  "sRGB \u2014 o padr\xE3o do CSS": "sRGB \u2014 the CSS default",
  "\xC2ngulo": "Angle",
  "Distribui\xE7\xE3o das paradas": "Distribution of stops",
  "Nenhuma \u2014 como est\xE3o": "None \u2014 as they are",
  "Suave nas pontas": "Soft at the ends",
  "Acelera no fim": "Accelerates at the end",
  "Acelera no come\xE7o": "Accelerates at the start",
  "Copiar CSS": "Copy CSS",
  "Baixar SVG": "Download SVG",
  "Baixar PNG": "Download PNG",
  "Arquivos de imagem para apresenta\xE7\xE3o, arquivos de troca para software de design, e c\xF3digo para implementa\xE7\xE3o.": "Image files for presentation, exchange files for design software, and code for implementation.",
  "ASE \xB7 Adobe": "ASE \xB7 Adobe",
  "GPL \xB7 GIMP e Inkscape": "GPL \xB7 GIMP and Inkscape",
  "Texto para Procreate e afins": "Text for Procreate and the like",
  "Hex puro": "Plain hex",
  "Copiar": "Copy",
  "Baixar arquivo": "Download file",
  "Paletas salvas": "Saved palettes",
  "Nada salvo ainda. Fica s\xF3 neste navegador.": "Nothing saved yet. It stays in this browser only.",
  /* ── tipografia ── */
  "Uso principal": "Main use",
  "Estrat\xE9gia de combina\xE7\xE3o": "Pairing strategy",
  "Classe do t\xEDtulo": "Headline class",
  "Classe do texto": "Text class",
  "Banco de fontes": "Font library",
  "Largura": "Width",
  "Formato do arquivo": "File format",
  "woff2 \u2014 padr\xE3o da web": "woff2 \u2014 the web standard",
  "woff2 vari\xE1vel": "variable woff2",
  "Nenhum \u2014 s\xF3 a CDN": "None \u2014 CDN only",
  "Quantas fam\xEDlias": "How many families",
  "N\xFAmero de fam\xEDlias": "Number of families",
  "Gerar combina\xE7\xE3o": "Generate pairing",
  "Trocar t\xEDtulo e texto": "Swap headline and text",
  "Somar uma monoespa\xE7ada": "Add a monospaced",
  "A combina\xE7\xE3o": "The pairing",
  "Hierarquia": "Hierarchy",
  "Cada n\xEDvel tem fam\xEDlia, peso, degrau da escala, entrelinha, entreletra, caixa e cor pr\xF3prios. Toque num n\xEDvel para ajust\xE1-lo; use o bot\xE3o da direita para ligar e desligar os que o projeto n\xE3o usa.": "Each level has its own family, weight, scale step, leading, tracking, case and colour. Tap a level to adjust it; use the button on the right to switch off the ones the project does not use.",
  "Devolver este n\xEDvel ao padr\xE3o": "Reset this level",
  "Devolver todos": "Reset all",
  "N\xEDvel": "Level",
  "Fam\xEDlia": "Family",
  "Corpo": "Size",
  "Peso": "Weight",
  "Entrelinha": "Leading",
  "Seu texto": "Your text",
  "Cole aqui o texto real do projeto. Cada linha vira um n\xEDvel da hierarquia, e a amostra abaixo se redesenha ao vivo com a paleta, o corpo e a escala escolhidos.": "Paste the project's real text here. Each line becomes a level of the hierarchy, and the specimen below redraws live with the chosen palette, size and scale.",
  "Seu texto, uma linha por n\xEDvel": "Your text, one line per level",
  "Comece a linha com": "Start a line with",
  "para t\xEDtulo,": "for a headline,",
  "para subt\xEDtulo,": "for a subheading,",
  "para r\xF3tulo,": "for a label,",
  "para cita\xE7\xE3o,": "for a quotation,",
  "para destaque,": "for emphasis,",
  "para refer\xEAncia, e envolva em": "for a reference, and wrap in",
  "[colchetes]": "[brackets]",
  "para bot\xE3o. Linha sem prefixo vira par\xE1grafo.": "for a button. A line without a prefix becomes a paragraph.",
  "para refer\xEAncia e": "for a reference and",
  "[texto]": "[text]",
  "para bot\xE3o.": "for a button.",
  "Trazer texto de exemplo": "Bring the sample text",
  "Limpar": "Clear",
  "Baixar a amostra em PNG": "Download the specimen as PNG",
  "Amostra": "Specimen",
  "Nenhuma \u2014 tudo no mesmo corpo": "None \u2014 everything the same size",
  "1,200 \u2014 ter\xE7a menor": "1.200 \u2014 minor third",
  "1,250 \u2014 ter\xE7a maior": "1.250 \u2014 major third",
  "1,333 \u2014 quarta justa": "1.333 \u2014 perfect fourth",
  "1,414 \u2014 tr\xEDtono": "1.414 \u2014 tritone",
  "1,500 \u2014 quinta justa": "1.500 \u2014 perfect fifth",
  "1,618 \u2014 \xE1urea": "1.618 \u2014 golden",
  "2,000 \u2014 oitava": "2.000 \u2014 octave",
  "Corpo do texto": "Text size",
  "66 caracteres": "66 characters",
  "Entreletra do t\xEDtulo": "Headline tracking",
  "-0,02em": "-0.02em",
  "Cores da amostra": "Specimen colours",
  "Nenhuma \u2014 preto sobre branco": "None \u2014 black on white",
  "A paleta atual": "The current palette",
  "A paleta invertida": "The palette inverted",
  "A paleta da proposta": "The proposal's palette",
  "Todos os c\xF3digos": "All the code",
  "Link da CDN": "CDN link",
  "HTML completo": "Full HTML",
  "Onde baixar": "Where to download",
  "Bancos de fontes livres": "Open font libraries",
  "Todas as fam\xEDlias deste instrumento v\xEAm de bancos que permitem baixar, hospedar e usar comercialmente. Vale conferir a licen\xE7a de cada uma no pr\xF3prio banco antes de distribuir.": "Every family in this instrument comes from libraries that allow downloading, self-hosting and commercial use. Check each licence at the library itself before distributing.",
  "Banco": "Library",
  "O que \xE9": "What it is",
  "Formato entregue": "Format delivered",
  "Combina\xE7\xF5es salvas": "Saved pairings",
  "Nada salvo ainda.": "Nothing saved yet.",
  /* ── criação ── */
  "Descreva o que voc\xEA precisa fazer. O instrumento atravessa os dois anteriores \u2014 o c\xEDrculo de Goethe do lado da cor, o banco de fam\xEDlias do lado da tipografia \u2014 e devolve tr\xEAs propostas completas, cada uma com paleta, combina\xE7\xE3o tipogr\xE1fica, aplica\xE7\xE3o desenhada e o racioc\xEDnio por tr\xE1s.": "Describe what you need to make. The instrument runs through the two before it \u2014 Goethe's circle on the colour side, the font library on the type side \u2014 and returns three complete proposals, each with a palette, a type pairing, a drawn application and the reasoning behind it.",
  "As tr\xEAs nunca s\xE3o varia\xE7\xF5es da mesma ideia: a primeira l\xEA a conven\xE7\xE3o do campo, a segunda a contraria, e a terceira entra por um caminho lateral. Tudo \xE9 calculado no seu navegador, sem consultar nada fora dele.": "The three are never variations on one idea: the first reads the field's convention, the second goes against it, and the third comes in sideways. Everything is computed in your browser, without consulting anything outside it.",
  "O que voc\xEA est\xE1 criando": "What you are making",
  "Onde isso vai existir": "Where it will live",
  "O que precisa provocar": "What it needs to evoke",
  "Postura diante da conven\xE7\xE3o": "Stance towards convention",
  "Quantas fam\xEDlias tipogr\xE1ficas": "How many typefaces",
  "Que o instrumento decida": "Let the instrument decide",
  "Descreva em uma ou duas frases \u2014 quem \xE9, para quem fala, que sensa\xE7\xE3o precisa deixar": "Describe it in a sentence or two \u2014 who it is, who it speaks to, what feeling it must leave",
  "Ex.: um relat\xF3rio anual de uma cooperativa de caf\xE9 na Amaz\xF4nia, s\xE9rio mas quente, para investidores que n\xE3o conhecem o setor": "E.g. an annual report for a coffee cooperative in the Amazon, serious but warm, for investors who do not know the sector",
  "Gerar tr\xEAs propostas": "Generate three proposals",
  "Outras tr\xEAs": "Another three",
  "Limpar tudo": "Clear everything",
  "Seu texto e a amostra": "Your text and the specimen",
  "Cole o texto real do projeto: cada proposta abaixo o redesenha ao vivo com a pr\xF3pria paleta e as pr\xF3prias fam\xEDlias. Corpo, escala, medida, entrelinha e entreletra valem para as tr\xEAs, e mudam na hora.": "Paste the project's real text: each proposal below redraws it live with its own palette and families. Size, scale, measure, leading and tracking apply to all three and change instantly.",
  /* ── tendências ── */
  "Um compilado trimestral do que as casas de previs\xE3o, as fundi\xE7\xF5es tipogr\xE1ficas e os observat\xF3rios de comportamento est\xE3o publicando \u2014 reduzido a quatro eixos: cor, tipografia, combina\xE7\xF5es e aplica\xE7\xF5es. Cada eixo vira um banner que voc\xEA pode baixar, e a paleta e as fam\xEDlias de cada edi\xE7\xE3o abrem direto nos outros instrumentos.": "A quarterly digest of what forecasting houses, type foundries and behaviour observatories are publishing \u2014 reduced to four axes: colour, type, pairings and applications. Each axis becomes a banner you can download, and each edition's palette and families open directly in the other instruments.",
  "O que esta p\xE1gina \xE9 e o que n\xE3o \xE9.": "What this page is and is not.",
  "Ela re\xFAne o que foi publicado abertamente: comunicados de imprensa, an\xFAncios de instituto de cor, relat\xF3rios de fundi\xE7\xE3o e cobertura editorial, cada item com fonte e data. N\xE3o reproduz relat\xF3rio de assinatura \u2014 previs\xF5es completas de WGSN, Coloro, Nelly Rodi, Peclers ou Monotype s\xF3 existem para quem assina, e o que est\xE1 aqui \xE9 o recorte p\xFAblico. Os valores em hex s\xE3o": "It gathers what was published openly: press releases, colour-institute announcements, foundry reports and editorial coverage, each item with source and date. It does not reproduce subscription reports \u2014 the full forecasts from WGSN, Coloro, Nelly Rodi, Peclers or Monotype exist only for subscribers, and what is here is the public excerpt. The hex values are",
  "aproxima\xE7\xF5es em sRGB": "sRGB approximations",
  "feitas a partir da descri\xE7\xE3o e da imagem divulgadas, n\xE3o os c\xF3digos oficiais: para produ\xE7\xE3o, use o c\xF3digo da pr\xF3pria fonte.": "made from the published description and image, not the official codes: for production, use the source's own code.",
  "Edi\xE7\xF5es": "Editions",
  "Banners": "Banners",
  "Quatro resumos em formato de cart\xE3o, gerados a partir da edi\xE7\xE3o escolhida. Saem em SVG vetorial ou PNG de 1200 por 630, que \xE9 a medida de pr\xE9-visualiza\xE7\xE3o de link.": "Four card-shaped summaries generated from the chosen edition. They come out as vector SVG or 1200 by 630 PNG, the link-preview size.",
  "Arquivo": "Archive",
  "As edi\xE7\xF5es anteriores continuam acess\xEDveis. Nada \xE9 apagado quando entra uma nova.": "Earlier editions remain accessible. Nothing is deleted when a new one comes in.",
  "Como esta p\xE1gina se atualiza": "How this page is updated",
  "Todo o conte\xFAdo vive numa \xFAnica estrutura de dados no c\xF3digo, a constante": "All the content lives in a single data structure in the code, the constant",
  ", com uma entrada por trimestre. Acrescentar uma edi\xE7\xE3o \xE9 inserir um objeto no come\xE7o da lista, com per\xEDodo, resumo, os quatro eixos e as fontes de cada um. Nada mais precisa ser tocado: as abas, os banners, o arquivo e os bot\xF5es que levam aos instrumentos se montam sozinhos a partir dela.": ", with one entry per quarter. Adding an edition means inserting an object at the start of the list, with period, summary, the four axes and the sources of each. Nothing else needs touching: the tabs, banners, archive and the buttons that lead to the instruments build themselves from it.",
  "Ver o formato de uma edi\xE7\xE3o": "See the format of an edition",
  "Baixar as edi\xE7\xF5es em JSON": "Download the editions as JSON",
  "Baixar a edi\xE7\xE3o atual em Markdown": "Download the current edition as Markdown",
  /* ── exportação (folha) ── */
  "Exportar a paleta": "Export the palette",
  "Imagem": "Image",
  "SVG vetorial": "Vector SVG",
  "P\xF4ster PNG 2000px": "2000px PNG poster",
  "Troca entre programas": "Exchange between programs",
  "Texto com todos os c\xF3digos": "Text with all the codes",
  "CSV para planilha": "CSV for spreadsheets",
  "Markdown para colar no Claude": "Markdown to paste into Claude",
  "C\xF3digo": "Code",
  "V\xE1rios de uma vez, num arquivo .zip": "Several at once, in a .zip file",
  "Marque o que precisa e baixe tudo num pacote s\xF3.": "Tick what you need and download it all in one package.",
  "Baixar o .zip": "Download the .zip",
  "Selecionar tudo": "Select all",
  "Limpar sele\xE7\xE3o": "Clear selection",
  "S\xF3 um .txt com todos os c\xF3digos": "Just a .txt with all the codes",
  "Paleta em escala": "Palette full screen",
  /* ── JS: utilitários ── */
  "O navegador bloqueou a c\xF3pia": "The browser blocked copying",
  "Copiado": "Copied",
  " compartilhado": " shared",
  " gerado": " generated",
  "O navegador bloqueou o download \u2014 use copiar": "The browser blocked the download \u2014 use copy",
  "Uma fam\xEDlia n\xE3o carregou \u2014 a reserva declarada est\xE1 em uso": "A family did not load \u2014 the declared fallback is in use",
  "HEX curto": "Short HEX",
  "Lumin\xE2ncia": "Luminance",
  "Contraste com branco": "Contrast with white",
  "Contraste com preto": "Contrast with black",
  " puxado ao ": " pulled towards ",
  /* ── JS: instrumento de cor ── */
  "Um passo atr\xE1s": "One step back",
  "Um passo \xE0 frente": "One step forward",
  "Nova combina\xE7\xE3o \u2014 use Voltar para recuperar a anterior": "New combination \u2014 use Undo to bring back the previous one",
  "\u2190 Voltar ({n})": "\u2190 Undo ({n})",
  "Arraste cada bola livremente: o \xE2ngulo \xE9 o matiz, a dist\xE2ncia do centro \xE9 o croma. Nenhuma geometria \xE9 imposta.": "Drag each ball freely: the angle is the hue, the distance from the centre is the chroma. No geometry is imposed.",
  "{n}. {d} Arraste qualquer bola e o conjunto gira junto, mantendo as dist\xE2ncias.": "{n}. {d} Drag any ball and the whole set turns with it, keeping the distances.",
  "Congelar": "Freeze",
  "Mover para tr\xE1s": "Move back",
  "Mover para frente": "Move forward",
  "Abrir c\xF3digos": "Open codes",
  "% da \xE1rea": "% of the area",
  "Painel": "Panel",
  "Cole\xE7\xF5es": "Collections",
  "Hist\xF3rico": "History",
  "Ajustes": "Settings",
  "Um t\xEDtulo dentro de uma interface": "A headline inside an interface",
  "O contraste aqui \xE9 {r} para 1.": "The contrast here is {r} to 1.",
  "A\xE7\xE3o principal": "Primary action",
  "Secund\xE1ria": "Secondary",
  "\xC1rea segundo o m\xE9todo de {l}": "Area by the method of {l}",
  ", reescrita pela din\xE2mica de {u}": ", rewritten by the dynamics of {u}",
  ". A cor {n} domina com {p}% \u2014 \xE9 a ordem, mais que os n\xFAmeros, que decide se o conjunto \xE9 lido como contido ou como declarado.": ". Colour {n} dominates at {p}% \u2014 it is the order, more than the numbers, that decides whether the set reads as restrained or declared.",
  "Cor {n} \u2014 {name}": "Colour {n} \u2014 {name}",
  "Matiz no c\xEDrculo": "Hue on the circle",
  "{h} \xB7 {name} \xB7 {p}% da \xE1rea": "{h} \xB7 {name} \xB7 {p}% of the area",
  "{n} cores": "{n} colours",
  "em {m}": "in {m}",
  "sob a lente {l}": "through the {l} lens",
  "inflectida por {k}": "inflected by {k}",
  "em din\xE2mica de {u}": "in the dynamics of {u}",
  "posicionada \xE0 m\xE3o no anel": "placed by hand on the ring",
  "sem tens\xE3o entre inten\xE7\xE3o e campo": "with no tension between intention and field",
  "quase inteiramente dentro da conven\xE7\xE3o do campo": "almost entirely within the field's convention",
  "ancorada na conven\xE7\xE3o, com desvio percept\xEDvel": "anchored in the convention, with a perceptible deviation",
  "mais pr\xF3xima da inten\xE7\xE3o do que da categoria": "closer to the intention than to the category",
  "deliberadamente fora do que o campo faz": "deliberately outside what the field does",
  "Est\xE1 no lado positivo \u2014 o lado que Goethe descreve como ativo, quente e que se aproxima de quem olha.": "It sits on the positive side \u2014 the side Goethe describes as active, warm and advancing towards the viewer.",
  "Est\xE1 no lado negativo \u2014 passivo, frio, que segundo ele afasta o olho em vez de atra\xED-lo.": "It sits on the negative side \u2014 passive, cold, which by his account pushes the eye away rather than drawing it in.",
  "Est\xE1 no ponto em que os dois lados do c\xEDrculo se encontram, onde a intensifica\xE7\xE3o chega ao purp\xFAreo.": "It sits where the two sides of the circle meet, where intensification reaches purple.",
  "A primeira cor caiu em": "The first colour landed on",
  "({a}\xB0 no c\xEDrculo)": "({a}\xB0 on the circle)",
  "A conven\xE7\xE3o \xE9 {c}.": "The convention is {c}.",
  "Exig\xEAncia atual:": "Current requirement:",
  "{t} para 1": "{t} to 1",
  "\xC9 o m\xEDnimo do WCAG 2.1 para texto de leitura, do tamanho de um par\xE1grafo. Serve como r\xE9gua padr\xE3o.": "The WCAG 2.1 minimum for reading text at paragraph size. It serves as the default rule.",
  "Basta para t\xEDtulo grande, texto em negrito acima de 18 pontos, \xEDcones, bordas de campo e outros elementos de interface.": "Enough for large headlines, bold text above 18 points, icons, field borders and other interface elements.",
  "O n\xEDvel mais alto do WCAG, pensado para quem tem baixa vis\xE3o ou l\xEA em condi\xE7\xF5es ruins de luz. Exigir isso encolhe muito a paleta utiliz\xE1vel.": "The highest WCAG level, meant for low vision or poor lighting. Demanding it shrinks the usable palette considerably.",
  "Cada c\xE9lula mostra o n\xEDvel que o par alcan\xE7a \u2014 AAA a partir de 7, AA a partir de 4,5, AA grande a partir de 3, e baixo abaixo disso. As que n\xE3o chegam \xE0 exig\xEAncia aparecem riscadas e com contorno.": "Each cell shows the level the pair reaches \u2014 AAA from 7, AA from 4.5, AA large from 3, and low below that. Those that fall short of the requirement appear struck through and outlined.",
  "fundo \u2193 &nbsp; texto \u2192": "ground \u2193 &nbsp; text \u2192",
  "AA grande": "AA large",
  "baixo": "low",
  "Um t\xEDtulo nesta combina\xE7\xE3o": "A headline in this combination",
  "E um par\xE1grafo do tamanho que voc\xEA realmente vai usar, com linhas suficientes para perceber se o olho cansa antes do fim. \xC9 aqui que se descobre se a raz\xE3o de contraste era s\xF3 um n\xFAmero.": "And a paragraph at the size you will actually use, with enough lines to notice whether the eye tires before the end. This is where you find out whether the contrast ratio was only a number.",
  "Cor {j} {tx} sobre cor {i} {bg} \xB7 {r} para 1 \xB7 {l}": "Colour {j} {tx} on colour {i} {bg} \xB7 {r} to 1 \xB7 {l}",
  "Este par passa na exig\xEAncia atual. Pode usar como texto sobre fundo.": "This pair passes the current requirement. You can use it as text on a ground.",
  "Este par fica abaixo de {t}.": "This pair falls below {t}.",
  "Mantendo o mesmo matiz e croma e mexendo s\xF3 na luminosidade, a cor {j} chegaria l\xE1 em": "Keeping the same hue and chroma and moving only the lightness, colour {j} would get there at",
  "N\xE3o existe luminosidade que resolva sem mudar o matiz \u2014 troque uma das duas cores.": "No lightness solves it without changing the hue \u2014 swap one of the two colours.",
  "Corrigir a cor {j} para {h}": "Correct colour {j} to {h}",
  "Inverter fundo e texto": "Swap ground and text",
  "Copiar o par": "Copy the pair",
  "Cor {j} ajustada para {h}": "Colour {j} adjusted to {h}",
  "fundo {bg} \xB7 texto {tx} \xB7 {r}:1 \xB7 {l}": "ground {bg} \xB7 text {tx} \xB7 {r}:1 \xB7 {l}",
  "Par copiado": "Pair copied",
  "Nenhum par desta paleta alcan\xE7a {t} para 1.": "No pair in this palette reaches {t} to 1.",
  "Isso n\xE3o invalida a paleta: quer dizer que ela \xE9 de superf\xEDcie, n\xE3o de texto \u2014 e que o texto vai precisar de um preto ou um branco vindo de fora dela.": "That does not invalidate the palette: it means it is a surface palette, not a text one \u2014 and the text will need a black or a white from outside it.",
  "Texto da cor {j} sobre a cor {i}": "Colour {j} text on colour {i}",
  "{tx} sobre {bg} \xB7 {r} para 1 \xB7 {l}": "{tx} on {bg} \xB7 {r} to 1 \xB7 {l}",
  "Um gradiente precisa de ao menos duas paradas": "A gradient needs at least two stops",
  "Paradas puxadas da paleta": "Stops pulled from the palette",
  "CSS do gradiente copiado": "Gradient CSS copied",
  "/* paradas */": "/* stops */",
  "/* {h} em {p}% */": "/* {h} at {p}% */",
  "Paleta recarregada": "Palette reloaded",
  "N\xE3o foi poss\xEDvel ler as paletas salvas neste ambiente.": "Could not read the saved palettes in this environment.",
  "Paleta salva \u2014 aparece logo abaixo dos bot\xF5es": "Palette saved \u2014 it appears just below the buttons",
  "Salva s\xF3 nesta sess\xE3o: este navegador n\xE3o guardou": "Saved for this session only: this browser did not keep it",
  "N\xE3o foi poss\xEDvel rasterizar aqui \u2014 baixe o SVG": "Could not rasterise here \u2014 download the SVG",
  "C\xF3digo copiado": "Code copied",
  "/* \xE1rea sugerida */": "/* suggested area */",
  "esquema {s}": "{s} scheme",
  "Derivada do c\xEDrculo crom\xE1tico de Goethe": "Derived from Goethe's colour circle",
  "Esquema: {s}": "Scheme: {s}",
  "Cores: {c}": "Colours: {c}",
  "\xC1rea: {a}": "Area: {a}",
  "cor {n} {p}%": "colour {n} {p}%",
  "Derivada do c\xEDrculo crom\xE1tico de Goethe. Convers\xF5es em OKLab, croma ajustado ao gamut sRGB.": "Derived from Goethe's colour circle. Conversions in OKLab, chroma adjusted to the sRGB gamut.",
  "Gerado em {d}.": "Generated on {d}.",
  "Marque ao menos um formato": "Tick at least one format",
  "Montando\u2026": "Building\u2026",
  "Nenhum formato p\xF4de ser gerado": "No format could be generated",
  "{n} arquivos no pacote": "{n} files in the package",
  "SVG da paleta": "Palette SVG",
  "PNG da paleta": "Palette PNG",
  "JPG da paleta": "Palette JPG",
  "P\xF4ster PNG": "PNG poster",
  "ASE da Adobe": "Adobe ASE",
  "GPL do GIMP": "GIMP GPL",
  "Todos os c\xF3digos em txt": "All codes as txt",
  "SVG do gradiente": "Gradient SVG",
  "Markdown para o Claude": "Markdown for Claude",
  "CSS da tipografia": "Type CSS",
  "HTML com o texto": "HTML with the text",
  "PNG da amostra": "Specimen PNG",
  "Cor {n} \u2014 {name}\n  HEX {h}\n  RGB {rgb}\n  HSL {hsl}\n  CMYK {cmyk}\n  OKLCH {ok}\n  \xC1rea {p}%": "Colour {n} \u2014 {name}\n  HEX {h}\n  RGB {rgb}\n  HSL {hsl}\n  CMYK {cmyk}\n  OKLCH {ok}\n  Area {p}%",
  "indice,nome,hex": "index,name,hex",
  "area_pct": "area_pct",
  "/* \u2550\u2550 TODOS OS C\xD3DIGOS \u2550\u2550 */": "/* \u2550\u2550 ALL CODES \u2550\u2550 */",
  "-tudo": "-all",
  "-codigos": "-codes",
  "Faixas": "Bands",
  "Propor\xE7\xE3o": "Proportion",
  "Cart\xF5es": "Cards",
  "C\xEDrculos": "Circles",
  "An\xE9is": "Rings",
  "Mosaico": "Mosaic",
  "Em interface": "In an interface",
  "Em p\xF4ster": "On a poster",
  "Degrad\xEA": "Blend",
  "Arraste as c\xE9lulas para reordenar. O cadeado congela a cor na hora de gerar. Toque numa cor para abrir todos os c\xF3digos e a escala de tons.": "Drag the cells to reorder. The lock freezes a colour when generating. Tap a colour to open all its codes and the tonal scale.",
  "A largura de cada cor \xE9 a \xE1rea que ela deve ocupar segundo o m\xE9todo de est\xFAdio escolhido.": "The width of each colour is the area it should occupy by the chosen studio method.",
  "Cada cor com hex, rgb, hsl e cmyk vis\xEDveis de uma vez \u2014 bom para conferir antes de mandar para gr\xE1fica.": "Each colour with hex, rgb, hsl and cmyk visible at once \u2014 good for checking before sending to press.",
  "O di\xE2metro acompanha a \xE1rea. \xDAtil para enxergar a domin\xE2ncia sem a distra\xE7\xE3o da forma retangular.": "The diameter follows the area. Useful for seeing dominance without the distraction of the rectangle.",
  "Cores encaixadas uma dentro da outra: mostra como cada uma se comporta cercada pela seguinte.": "Colours nested one inside another: shows how each behaves surrounded by the next.",
  "A rampa completa de cada cor, de 50 a 950. Toque em qualquer degrau para copiar aquele tom.": "The full ramp of each colour, from 50 to 950. Tap any step to copy that tone.",
  "Blocos de tamanhos diferentes, como uma superf\xEDcie real seria composta.": "Blocks of different sizes, the way a real surface would be composed.",
  "A paleta aplicada a uma tela de exemplo, com a raz\xE3o de contraste do par principal calculada.": "The palette applied to a sample screen, with the contrast ratio of the main pair computed.",
  "A paleta em composi\xE7\xE3o impressa, com o fundo mais claro e o texto mais escuro da pr\xF3pria paleta.": "The palette in a printed composition, with the lightest ground and the darkest text from the palette itself.",
  "As cores derretidas umas nas outras, na ordem da tira. Mostra se a sequ\xEAncia tem buracos ou saltos.": "The colours melted into one another, in the order of the strip. Shows whether the sequence has gaps or jumps.",
  /* ── JS: tipografia ── */
  "Nenhuma fam\xEDlia atende a todos os filtros ao mesmo tempo. Solte um deles \u2014 ou volte algum para Nenhuma.": "No family meets every filter at once. Release one \u2014 or set one back to None.",
  "{d} sozinha, carregando a hierarquia inteira": "{d} alone, carrying the whole hierarchy",
  "{d} no t\xEDtulo, {b} no texto": "{d} for headlines, {b} for text",
  ", mais {x}": ", plus {x}",
  ", para provocar {e}": ", to evoke {e}",
  ", pela estrat\xE9gia de {s}": ", by the strategy of {s}",
  "Com uma fam\xEDlia s\xF3 n\xE3o h\xE1 o que trocar": "With a single family there is nothing to swap",
  "{d} no t\xEDtulo, {b} no texto \u2014 invertido \xE0 m\xE3o.": "{d} for headlines, {b} for text \u2014 swapped by hand.",
  "Terceira fam\xEDlia acrescentada, em r\xF3tulo e refer\xEAncia": "Third family added, for labels and references",
  "Nenhuma monoespa\xE7ada passa nos filtros": "No monospaced passes the filters",
  "N\xEDvel devolvido ao padr\xE3o": "Level reset",
  "Hierarquia inteira devolvida ao padr\xE3o": "Whole hierarchy reset",
  "Ligar e desligar n\xEDveis": "Switch levels on and off",
  "Agora um toque no n\xEDvel liga ou desliga": "Now a tap on a level switches it on or off",
  "De volta a ajustar n\xEDveis": "Back to adjusting levels",
  "Fam\xEDlia de {r}": "Family for {r}",
  "Degrau da escala": "Scale step",
  "Entreletra": "Tracking",
  "Caixa": "Case",
  "Autom\xE1tica pela paleta": "Automatic from the palette",
  "Cor {n} \u2014 {h}": "Colour {n} \u2014 {h}",
  "It\xE1lico": "Italic",
  "Nenhum": "None",
  " \xB7 desligado": " \xB7 off",
  "sem n\xEDvel atribu\xEDdo": "no level assigned",
  " \xB7 pesos ": " \xB7 weights ",
  "Por que este conjunto funciona.": "Why this set works.",
  "Uma fam\xEDlia s\xF3: toda a hierarquia ter\xE1 de vir de peso, corpo, largura e caixa. \xC9 a sa\xEDda mais dif\xEDcil de errar e a que mais depende de disciplina de espa\xE7amento. ": "A single family: the whole hierarchy will have to come from weight, size, width and case. The hardest route to get wrong, and the one that most depends on spacing discipline. ",
  "Uma serifada contra uma sem serifa: a diferen\xE7a de estrutura \xE9 clara o bastante para que nenhuma pare\xE7a erro. ": "A serif against a sans: the structural difference is clear enough that neither looks like a mistake. ",
  "S\xE3o parentes da mesma superfam\xEDlia, desenhadas para conviver \u2014 a harmonia \xE9 garantida e o contraste vem do peso e do tamanho. ": "They are relatives from the same superfamily, drawn to coexist \u2014 harmony is guaranteed and contrast comes from weight and size. ",
  "Mesma classifica\xE7\xE3o em pap\xE9is diferentes: o contraste ter\xE1 de vir do peso e do corpo, n\xE3o da forma. ": "The same classification in different roles: contrast will have to come from weight and size, not from form. ",
  "As alturas de x das duas primeiras s\xE3o {met} ({a} contra {b} da altura de mai\xFAscula), e a diferen\xE7a de contraste de tra\xE7o \xE9 {ct}.": "The x-heights of the first two are {met} ({a} against {b} of cap height), and the difference in stroke contrast is {ct}.",
  "muito pr\xF3ximas": "very close",
  "compat\xEDveis": "compatible",
  "distantes": "far apart",
  "grande, o que separa bem t\xEDtulo de texto": "large, which separates headline from text well",
  "moderada": "moderate",
  "pequena, ent\xE3o use peso e corpo para separar": "small, so use weight and size to separate",
  " A terceira entra em r\xF3tulo e refer\xEAncia, onde a diferen\xE7a de forma vira sinal de fun\xE7\xE3o.": " The third goes into labels and references, where the difference in form becomes a sign of function.",
  " A quarta carrega a cita\xE7\xE3o, que \xE9 o \xFAnico lugar onde uma voz diferente n\xE3o atrapalha a leitura.": " The fourth carries the quotation, the one place where a different voice does not disturb reading.",
  " A quinta fica em destaque e bot\xE3o \u2014 cinco vozes \xE9 o limite antes de o sistema virar ru\xEDdo.": " The fifth takes emphasis and buttons \u2014 five voices is the limit before the system turns to noise.",
  "Refer\xEAncia": "Reference",
  "Par\xE1grafo": "Paragraph",
  "Destaque": "Emphasis",
  "Cita\xE7\xE3o": "Quotation",
  "Subt\xEDtulo": "Subheading",
  "T\xEDtulo": "Headline",
  "R\xF3tulo": "Label",
  "Bot\xE3o": "Button",
  "Nenhum arquivo escolhido \u2014 use a aba do link da CDN.": "No file chosen \u2014 use the CDN link tab.",
  "/* {n} \u2014 baixe em {u} */": "/* {n} \u2014 download at {u} */",
  "/* mesma fam\xEDlia pela CDN do Fontsource, sem hospedar nada */": "/* the same family via the Fontsource CDN, hosting nothing */",
  "<!-- pr\xE9-conex\xE3o, acelera a primeira renderiza\xE7\xE3o -->": "<!-- preconnect, speeds up the first render -->",
  "/* n\xEDveis da hierarquia */": "/* levels of the hierarchy */",
  "  Banco: {b}": "  Library: {b}",
  "  P\xE1gina: {u}": "  Page: {u}",
  "  Arquivo {f} pela CDN do Fontsource: {u}": "  {f} file via the Fontsource CDN: {u}",
  "  Baixe otf e ttf direto na p\xE1gina do Fontshare": "  Download otf and ttf directly from the Fontshare page",
  "  Licen\xE7a: confira na pr\xF3pria p\xE1gina antes de redistribuir": "  Licence: check the page itself before redistributing",
  "Espelho sem rastreamento das fam\xEDlias do Google:": "Tracking-free mirror of the Google families:",
  "Combina\xE7\xE3o recarregada": "Pairing reloaded",
  "{d} no t\xEDtulo, {b} no texto \u2014 combina\xE7\xE3o recarregada.": "{d} for headlines, {b} for text \u2014 pairing reloaded.",
  "N\xE3o foi poss\xEDvel ler as combina\xE7\xF5es salvas neste ambiente.": "Could not read the saved pairings in this environment.",
  "Combina\xE7\xE3o salva \u2014 aparece no fim da p\xE1gina": "Pairing saved \u2014 it appears at the end of the page",
  "{n}px": "{n}px",
  "{n} caracteres": "{n} characters",
  "Exemplo: {n}": "Example: {n}",
  /* ── JS: criação ── */
  "A leitura direta": "The direct reading",
  "A leitura de contraste": "The contrasting reading",
  "A leitura lateral": "The lateral reading",
  "Reconheci na descri\xE7\xE3o:": "I recognised in the description:",
  ". Essas palavras deslocam inten\xE7\xE3o, campo, refer\xEAncia e postura \u2014 o que voc\xEA escolher nos campos acima tem prioridade.": ". These words shift intention, field, reference and stance \u2014 whatever you choose in the fields above takes priority.",
  "Ainda n\xE3o reconheci nenhuma palavra do l\xE9xico. Escreva \xE0 vontade: os campos acima j\xE1 bastam para gerar.": "No word from the lexicon recognised yet. Write freely: the fields above are enough to generate.",
  "O que eu li do seu pedido.": "What I read in your request.",
  "Pe\xE7a: {p}.": "Piece: {p}.",
  "Suporte: {s}.": "Medium: {s}.",
  "Inten\xE7\xE3o: {e}. Campo: {m}.": "Intention: {e}. Field: {m}.",
  "Refer\xEAncia: {k}.": "Reference: {k}.",
  "Din\xE2mica: {u}.": "Dynamics: {u}.",
  "Postura de partida: {t} de 100.": "Starting stance: {t} of 100.",
  " Da descri\xE7\xE3o, pesaram: {w}.": " From the description, these carried weight: {w}.",
  " A descri\xE7\xE3o n\xE3o trouxe palavras do l\xE9xico \u2014 as tr\xEAs propostas v\xEAm s\xF3 dos campos.": " The description brought no words from the lexicon \u2014 the three proposals come from the fields alone.",
  "n\xE3o definida": "not set",
  "n\xE3o definido": "not set",
  "Campos limpos": "Fields cleared",
  " \xB7 din\xE2mica de {u}": " \xB7 dynamics of {u}",
  "Amostra \u2014 {f}": "Specimen \u2014 {f}",
  "\xC1rea": "Area",
  "Baixar em Markdown": "Download as Markdown",
  "Baixar .zip": "Download .zip",
  "Levar para Cores": "Take to Colour",
  "Levar para Tipografia": "Take to Type",
  "Copiar os hex": "Copy the hex values",
  "Hex copiados": "Hex values copied",
  "Paleta carregada no instrumento de cor": "Palette loaded into the colour instrument",
  "Combina\xE7\xE3o carregada no instrumento de tipografia": "Pairing loaded into the type instrument",
  "{f} \u2014 vindo da proposta {a}.": "{f} \u2014 from the {a} proposal.",
  "{e} em {m}": "{e} in {m}",
  "Proposta": "Proposal",
  "O esquema \xE9 {s} \u2014 {d} ": "The scheme is {s} \u2014 {d} ",
  "A \xE1rea vem do m\xE9todo de {l}: {m}.": "The area comes from the {l} method: {m}.",
  " A refer\xEAncia {k} puxa o matiz para os pigmentos que aquela cultura tinha \xE0 m\xE3o.": " The {k} reference pulls the hue towards the pigments that culture had to hand.",
  " A din\xE2mica de {u} reescreve a propor\xE7\xE3o entre as cores.": " The dynamics of {u} rewrite the proportion between the colours.",
  "{d} sozinha: a hierarquia inteira ter\xE1 de vir de peso, corpo e caixa.": "{d} alone: the whole hierarchy will have to come from weight, size and case.",
  "{d} contra {b} \u2014 uma serifada e uma sem serifa, diferen\xE7a de estrutura clara o bastante para que nenhuma pare\xE7a erro.": "{d} against {b} \u2014 a serif and a sans, a structural difference clear enough that neither looks like a mistake.",
  "{d} e {b} s\xE3o da mesma superfam\xEDlia, desenhadas para conviver: harmonia garantida, contraste vindo do peso.": "{d} and {b} are from the same superfamily, drawn to coexist: harmony guaranteed, contrast from weight.",
  "{d} e {b} compartilham a classifica\xE7\xE3o, ent\xE3o o contraste ter\xE1 de vir do peso e do corpo.": "{d} and {b} share a classification, so contrast will have to come from weight and size.",
  " {d} Do lado do texto: {b}": " {d} On the text side: {b}",
  "Riscos.": "Risks.",
  "{n} pares desta paleta passam em 4,5 para 1, ent\xE3o h\xE1 por onde escrever.": "{n} pairs in this palette pass 4.5 to 1, so there is room to write.",
  "Nenhum par desta paleta chega a 4,5 para 1 \u2014 ela \xE9 de superf\xEDcie, e o texto vai precisar de um preto ou branco de fora.": "No pair in this palette reaches 4.5 to 1 \u2014 it is a surface palette, and the text will need a black or white from outside.",
  " Como vai para papel, confira o CMYK: matizes muito saturados n\xE3o existem em tinta de escala.": " As it goes to paper, check the CMYK: highly saturated hues do not exist in process ink.",
  " Em grande formato, a dist\xE2ncia de leitura perdoa menos o contraste baixo do que a tela.": " At large format, reading distance forgives low contrast less than the screen does.",
  "altura de x alta": "high x-height",
  "altura de x baixa": "low x-height",
  "altura de x m\xE9dia": "medium x-height",
  "contraste de tra\xE7o alto": "high stroke contrast",
  "contraste quase nulo": "almost no contrast",
  "contraste moderado": "moderate contrast",
  "condensada": "condensed",
  "larga": "wide",
  "feita para corpo grande": "made for large sizes",
  "feita para texto corrido": "made for running text",
  "monoespa\xE7ada": "monospaced",
  "serve a t\xEDtulo e a texto": "serves headline and text",
  /* ── JS: markdown ── */
  "**Inten\xE7\xE3o:** {e}": "**Intention:** {e}",
  "**Campo:** {m}": "**Field:** {m}",
  "**Esquema:** {s}": "**Scheme:** {s}",
  "**Lente de est\xFAdio:** {l}": "**Studio lens:** {l}",
  "**Refer\xEAncia cultural:** {k}": "**Cultural reference:** {k}",
  "**Estilo musical:** {u}": "**Musical style:** {u}",
  "**Postura:** {p} de 100 entre pertencer e romper": "**Stance:** {p} of 100 between belonging and breaking",
  "**Leitura:** {a}": "**Reading:** {a}",
  "**Pe\xE7a:** {p}": "**Piece:** {p}",
  "**Suporte:** {s}": "**Medium:** {s}",
  "**Postura:** {p} de 100": "**Stance:** {p} of 100",
  "**Palavras reconhecidas na descri\xE7\xE3o:** {w}": "**Words recognised in the description:** {w}",
  "## Paleta": "## Palette",
  "| # | HEX | RGB | HSL | CMYK | OKLCH | \xC1rea |": "| # | HEX | RGB | HSL | CMYK | OKLCH | Area |",
  "| # | Nome | HEX | RGB | HSL | CMYK | OKLCH | \xC1rea |": "| # | Name | HEX | RGB | HSL | CMYK | OKLCH | Area |",
  "Fundo sugerido `{bg}`, texto `{ink}`, contraste {r} para 1.": "Suggested ground `{bg}`, text `{ink}`, contrast {r} to 1.",
  "### Pares leg\xEDveis a 4,5 para 1": "### Legible pairs at 4.5 to 1",
  "- Nenhum. Use preto ou branco de fora da paleta para texto.": "- None. Use black or white from outside the palette for text.",
  "## Tipografia": "## Type",
  "| Papel | Fam\xEDlia | Banco | Pesos | Caracter\xEDstica |": "| Role | Family | Library | Weights | Character |",
  "Texto": "Text",
  "Apoio": "Support",
  "Acento": "Accent",
  "Extra": "Extra",
  "## Vari\xE1veis CSS": "## CSS variables",
  "Derivada do c\xEDrculo crom\xE1tico de Goethe (*Zur Farbenlehre*, 1810). Convers\xF5es em OKLab, croma ajustado ao gamut sRGB. Raz\xF5es de contraste segundo WCAG 2.1. Gerado em {d}.": "Derived from Goethe's colour circle (*Zur Farbenlehre*, 1810). Conversions in OKLab, chroma adjusted to the sRGB gamut. Contrast ratios to WCAG 2.1. Generated on {d}.",
  /* ── JS: tendências ── */
  " \xB7 atual": " \xB7 current",
  " \xB7 edi\xE7\xE3o em vigor": " \xB7 edition in force",
  " \xB7 arquivada": " \xB7 archived",
  "Fontes: ": "Sources: ",
  "Abrir esta paleta em Cores": "Open this palette in Colour",
  "Abrir estas fam\xEDlias em Tipografia": "Open these families in Type",
  "Paleta da edi\xE7\xE3o carregada, em esquema livre": "Edition palette loaded, in free scheme",
  "Estas fam\xEDlias n\xE3o est\xE3o no banco do instrumento": "These families are not in the instrument's library",
  "{f} \u2014 fam\xEDlias citadas na edi\xE7\xE3o {e}.": "{f} \u2014 families cited in the {e} edition.",
  "Fam\xEDlias da edi\xE7\xE3o carregadas": "Edition families loaded",
  "Copiar o c\xF3digo SVG": "Copy the SVG code",
  "SVG copiado": "SVG copied",
  "tendencias": "trends",
  "{n} edi\xE7\xF5es no arquivo. A mais antiga \xE9 {e}.": "{n} editions in the archive. The oldest is {e}.",
  "# Tend\xEAncias \u2014 {e}": "# Trends \u2014 {e}",
  "| Cor | HEX aproximado | Observa\xE7\xE3o |": "| Colour | Approximate HEX | Note |",
  "Fam\xEDlias citadas: {f}": "Families cited: {f}",
  "Fontes:": "Sources:",
  "Os valores em hex s\xE3o aproxima\xE7\xF5es em sRGB feitas a partir da descri\xE7\xE3o e da imagem divulgadas, n\xE3o os c\xF3digos oficiais. Compilado em {d}.": "The hex values are sRGB approximations made from the published description and image, not the official codes. Compiled on {d}.",
  "// r\xF3tulo da aba": "// tab label",
  "// pal.hex alimenta o bot\xE3o que abre a paleta no instrumento de cor": "// pal.hex feeds the button that opens the palette in the colour instrument",
  "// tipo.fam precisa bater com o nome exato de uma fam\xEDlia em src/data/fonts.ts": "// tipo.fam must match the exact name of a family in src/data/fonts.ts",
  "Uma frase que resume o trimestre.": "One sentence summing up the quarter.",
  /* ── JS: início e navegação ── */
  "lado": "side",
  "positivo": "positive",
  "negativo": "negative",
  "Monocrom\xE1tico": "Monochromatic",
  "An\xE1logo": "Analogous",
  "Complementar": "Complementary",
  "Complementar dividido": "Split-complementary",
  "Tr\xEDade": "Triadic",
  "Tetr\xE1dico": "Tetradic",
  /* visualização de exemplos */
  "Visualiza\xE7\xE3o de exemplos": "Example views",
  "A paleta e as fam\xEDlias aplicadas a pe\xE7as reais, em pacotes por campo: digital, produtos, papel, rua, vestu\xE1rio e telas em ambiente. Tudo \xE9 desenhado aqui, em vetor, e sai em SVG ou PNG.": "The palette and families applied to real pieces, in bundles by field: digital, products, paper, street, clothing and ambient screens. Everything is drawn here, as vectors, and exports as SVG or PNG.",
  "Aplica\xE7\xE3o": "Application",
  "Cen\xE1rio": "Scene",
  "Pe\xE7as": "Pieces",
  "Proposta {n}": "Proposal {n}",
  "Baixar todas em SVG": "Download all as SVG",
  "Copiar SVG": "Copy SVG",
  "Arquivos SVG gerados": "SVG files generated",
  "mockup": "mockup",
  "Cor e tipografia como instrumentos": "Colour and type as instruments",
  "Digital": "Digital",
  "Produtos": "Products",
  "Papel": "Paper",
  "Rua": "Street",
  "Vestu\xE1rio": "Clothing",
  "Telas em ambiente": "Ambient screens",
  "Telas de celular, tablet, port\xE1til e desktop, \xEDcone de aplicativo e publica\xE7\xE3o social.": "Phone, tablet, laptop and desktop screens, an app icon and a social post.",
  "Embalagens: caixa, frasco, pote, bisnaga, saco de papel e copo.": "Packaging: box, bottle, jar, tube, paper pouch and cup.",
  "Papelaria: papel timbrado, cart\xE3o de visita, envelope, caderno, p\xF4ster e capa de livro.": "Stationery: letterhead, business card, envelope, notebook, poster and book cover.",
  "Sinaliza\xE7\xE3o: outdoor, placa de fachada, ponto de \xF4nibus, bandeira, mural e vitrine.": "Signage: billboard, blade sign, bus shelter, flag, mural and storefront.",
  "Pe\xE7as e brindes: camiseta, sacola de tecido, bon\xE9, moletom, crach\xE1 e chaveiro.": "Garments and merchandise: t-shirt, tote bag, cap, hoodie, badge and key tag.",
  "Pain\xE9is em espa\xE7o: aeroporto, balc\xE3o, parede de telas, totem, televis\xE3o e rel\xF3gio.": "Panels in space: airport, desk, screen wall, kiosk, television and watch.",
  "Celular": "Phone",
  "Tablet": "Tablet",
  "Port\xE1til": "Laptop",
  "Desktop": "Desktop",
  "\xCDcone de app": "App icon",
  "Publica\xE7\xE3o social": "Social post",
  "Frasco": "Bottle",
  "Pote": "Jar",
  "Bisnaga": "Tube",
  "Saco de papel": "Paper pouch",
  "Copo": "Cup",
  "Papel timbrado": "Letterhead",
  "Cart\xE3o de visita": "Business card",
  "Envelope": "Envelope",
  "Caderno": "Notebook",
  "P\xF4ster": "Poster",
  "Capa de livro": "Book cover",
  "Outdoor": "Billboard",
  "Placa de fachada": "Blade sign",
  "Ponto de \xF4nibus": "Bus shelter",
  "Bandeira": "Flag",
  "Mural": "Mural",
  "Vitrine": "Storefront",
  "Camiseta": "T-shirt",
  "Sacola de tecido": "Tote bag",
  "Bon\xE9": "Cap",
  "Moletom": "Hoodie",
  "Crach\xE1": "Badge",
  "Chaveiro": "Key tag",
  "Painel de aeroporto": "Airport panel",
  "Balc\xE3o": "Desk",
  "Parede de telas": "Screen wall",
  "Totem": "Kiosk",
  "Televis\xE3o": "Television",
  "Rel\xF3gio": "Watch",
  "Est\xFAdio claro": "Light studio",
  "Est\xFAdio escuro": "Dark studio",
  "Cor da paleta": "Palette colour",
  "Caixa de cart\xE3o": "Box",
  /* conteúdos */
  "Conte\xFAdos": "Contents",
  "Revista": "Magazine",
  "Artigos para ler ou ouvir: Goethe, a cor como fen\xF4meno, tipografia e leitura, com fontes e m\xFAsica de fundo.": "Articles to read or listen to: Goethe, colour as phenomenon, typography and reading, with sources and background music.",
  "Artigos curtos sobre cor, tipografia e percep\xE7\xE3o, para ler ou ouvir. Cada um tem data, refer\xEAncias verificadas, arquivos para baixar e uma m\xFAsica para acompanhar.": "Short articles on colour, typography and perception, to read or listen to. Each has a date, verified references, files to download and a piece of music to go with it.",
  "Buscar nos artigos": "Search the articles",
  "Palavra, autor, tema\u2026": "Word, author, topic\u2026",
  "Temas": "Topics",
  "Limpar filtros": "Clear filters",
  "1 artigo": "1 article",
  "{n} artigos": "{n} articles",
  "{n} min de leitura": "{n} min read",
  "Nada encontrado com esses filtros.": "Nothing found with these filters.",
  "refer\xEAncia {n}": "reference {n}",
  "\u2190 Todos os artigos": "\u2190 All articles",
  "Ajustes de leitura": "Reading settings",
  "Diminuir letra": "Smaller text",
  "Aumentar letra": "Larger text",
  "Leitura facilitada": "Easier reading",
  "Publicado em {d}": "Published {d}",
  "Ouvir o artigo": "Listen to the article",
  "Ouvir": "Listen",
  "Pausar": "Pause",
  "Continuar": "Resume",
  "Parar": "Stop",
  "Voz": "Voice",
  "Velocidade": "Speed",
  "Leitura com as vozes instaladas no seu aparelho, sem custo e sem enviar o texto a nenhum servi\xE7o.": "Read aloud with the voices installed on your device, at no cost and without sending the text to any service.",
  "Nenhuma voz instalada": "No voice installed",
  "Este navegador n\xE3o oferece leitura em voz": "This browser does not offer read-aloud",
  "M\xFAsica para ler": "Music to read to",
  "Refer\xEAncias": "References",
  "Todas as refer\xEAncias s\xE3o obras publicadas, com editor e ano; os links levam a p\xE1ginas institucionais ou a DOIs permanentes.": "All references are published works, with publisher and year; links go to institutional pages or permanent DOIs.",
  "Baixar": "Download",
  "PDF \xB7 imprimir": "PDF \xB7 print",
  "Partilhar": "Share",
  "Copiar link": "Copy link",
  "Link copiado": "Link copied",
  "Link copiado \u2014 o Instagram n\xE3o recebe links de fora; cole na sua publica\xE7\xE3o": "Link copied \u2014 Instagram does not accept outside links; paste it into your post",
  "Estrat\xE9gia SEO deste artigo": "SEO strategy for this article",
  "Palavra-chave foco": "Focus keyword",
  "T\xEDtulo da p\xE1gina": "Page title",
  "Descri\xE7\xE3o": "Description",
  "Endere\xE7o": "Address",
  "Estrutura de se\xE7\xF5es (H2)": "Section structure (H2)",
  "Liga\xE7\xF5es internas": "Internal links",
  "Dados estruturados": "Structured data",
  "Este texto foi cocriado entre uma pessoa e uma ferramenta de IA, como parte de um experimento de aprendizagem, cria\xE7\xE3o e desenvolvimento. N\xE3o guardamos nenhum dado e nada daqui ser\xE1 usado como fonte de marketing.": "This text was co-created between a human and an AI tool, as part of an experiment in learning, creation and development. We keep no data, and nothing here will be used as a source of marketing.",
  /* lupa */
  "Ampliar": "Zoom in",
  "Reduzir": "Zoom out",
  "Tamanho original": "Original size",
  "Escalas de tom": "Tone scales",
  /* teoria editorial */
  "O c\xEDrculo": "The circle",
  "Tr\xEAs regimes": "Three regimes",
  "Esquemas": "Schemes",
  "Luz e pigmento": "Light and pigment",
  "OKLab": "OKLab",
  "Contraste": "Contrast",
  "Classes": "Classes",
  "Anatomia": "Anatomy",
  "Combinar": "Pairing",
  "Formatos": "Formats",
  "Cap\xEDtulos": "Chapters",
  "Anterior": "Previous",
  "Seguinte": "Next",
  "As cores s\xE3o atos da luz, atos e sofrimentos.": "Colours are the deeds of light, its deeds and sufferings.",
  "Goethe, , pref\xE1cio, 1810": "Goethe, , preface, 1810",
  "O olho pede totalidade: diante de uma cor, produz por conta pr\xF3pria a que falta.": "The eye demands totality: faced with one colour, it produces on its own the one that is missing.",
  "Goethe, , \xA7 805": "Goethe, , \xA7 805",
  "opostos no c\xEDrculo": "opposites on the circle",
  "um espa\xE7o de dist\xE2ncia": "one step apart",
  "vizinhas no c\xEDrculo": "neighbours on the circle",
  "Formatos de arquivo de fonte": "Font file formats",
  "Uma fam\xEDlia tipogr\xE1fica chega em v\xE1rios formatos, e cada um serve a um lugar. Confundi-los custa peso na p\xE1gina, licen\xE7as mal usadas ou recursos que n\xE3o aparecem. O essencial cabe numa tabela.": "A typeface family comes in several formats, and each serves a place. Mixing them up costs page weight, misused licences or features that never show. The essentials fit in a table.",
  "Formato": "Format",
  "Ano": "Year",
  "Onde usar": "Where to use",
  "Tamanho relativo": "Relative size",
  "Web, sempre": "Web, always",
  "O padr\xE3o da web. Compress\xE3o Brotli, cerca de 30% menor que WOFF. Todo navegador atual l\xEA.": "The web standard. Brotli compression, about 30% smaller than WOFF. Every current browser reads it.",
  "Web, s\xF3 como reserva": "Web, fallback only",
  "O primeiro empacotamento para a web, com compress\xE3o zlib. S\xF3 faz sentido para navegadores muito antigos.": "The first packaging for the web, with zlib compression. Only makes sense for very old browsers.",
  "Desktop, impress\xE3o, apps": "Desktop, print, apps",
  "OpenType: um cont\xEAiner que pode trazer curvas c\xFAbicas (CFF) e recursos como ligaturas, versaletes e algarismos alternativos.": "OpenType: a container that can carry cubic curves (CFF) and features such as ligatures, small caps and alternate figures.",
  "Desktop, apps, Android": "Desktop, apps, Android",
  "TrueType: curvas quadr\xE1ticas e instru\xE7\xF5es de ajuste de pixel. Universal, mas costuma ser maior que o OTF equivalente.": "TrueType: quadratic curves and pixel-hinting instructions. Universal, but usually larger than the equivalent OTF.",
  "Vari\xE1vel": "Variable",
  "Web e desktop": "Web and desktop",
  "1 arquivo em vez de 6 a 18": "1 file instead of 6 to 18",
  "Um s\xF3 arquivo com eixos cont\xEDnuos: peso, largura, tamanho \xF3ptico, inclina\xE7\xE3o. Substitui a fam\xEDlia inteira e anima entre pesos.": "One file with continuous axes: weight, width, optical size, slant. Replaces the whole family and animates between weights.",
  "Nenhum lugar": "Nowhere",
  "Formatos do Internet Explorer e do iOS antigo. N\xE3o devem mais ser publicados.": "Formats from Internet Explorer and old iOS. They should no longer be published.",
  "O que publicar na web": "What to publish on the web",
  "O que instalar no computador": "What to install on the computer",
  "Subconjuntos e alcance": "Subsets and range",
  "Fontes coloridas e \xEDcones": "Colour fonts and icons",
  "Licen\xE7a muda com o formato": "Licence changes with format",
  "S\xF3 WOFF2, com um subconjunto latino (e latino estendido se houver acentos al\xE9m do portugu\xEAs). Se a fam\xEDlia tem tr\xEAs pesos ou mais, a vers\xE3o vari\xE1vel em WOFF2 costuma pesar menos do que dois arquivos est\xE1ticos e d\xE1 acesso a todos os pesos intermedi\xE1rios. Declare": "WOFF2 only, with a Latin subset (and Latin Extended if there are accents beyond Portuguese). If the family has three weights or more, the variable WOFF2 usually weighs less than two static files and gives access to every intermediate weight. Declare",
  "e pr\xE9-carregue apenas a fonte do texto principal.": "and preload only the main text font.",
  "OTF quando existir, porque traz os recursos OpenType completos e curvas mais leves; TTF quando o software pede. Para impress\xE3o e PDF, os dois se incorporam sem problema.": "OTF when it exists, because it carries the full OpenType features and lighter curves; TTF when the software asks for it. For print and PDF, both embed without trouble.",
  "Uma fonte completa pode trazer cir\xEDlico, grego e vietnamita que a pe\xE7a nunca vai usar. Os bancos entregam subconjuntos por escrita; no CSS,": "A complete font may carry Cyrillic, Greek and Vietnamese the piece will never use. Libraries deliver subsets by script; in CSS,",
  "faz o navegador baixar s\xF3 o bloco necess\xE1rio. \xC9 a maior economia depois do WOFF2.": "makes the browser download only the block it needs. It is the biggest saving after WOFF2.",
  "Emoji e fam\xEDlias de exibi\xE7\xE3o em v\xE1rias cores usam as tabelas COLR/CPAL ou OpenType-SVG, dentro de um arquivo OTF ou WOFF2 normal. \xCDcones como fonte foram substitu\xEDdos por SVG inline na maioria dos projetos.": "Emoji and multicolour display families use the COLR/CPAL tables or OpenType-SVG, inside a normal OTF or WOFF2 file. Icon fonts have been replaced by inline SVG in most projects.",
  "Uma licen\xE7a de desktop n\xE3o cobre a publica\xE7\xE3o de WOFF2 num site, e a de web costuma limitar visitas por m\xEAs. Fam\xEDlias livres (SIL Open Font License, Apache) permitem os dois usos e a convers\xE3o entre formatos; as comerciais precisam ser lidas uma a uma.": "A desktop licence does not cover publishing WOFF2 on a site, and a web licence usually caps visits per month. Free families (SIL Open Font License, Apache) allow both uses and conversion between formats; commercial ones must be read one by one.",
  "A p\xE1gina de Tipografia gera o": "The Type page generates the",
  "para cada formato e o link da CDN do Fontsource, que serve WOFF2 j\xE1 subconjuntado.": "for each format and the Fontsource CDN link, which serves already-subsetted WOFF2.",
  ", pref\xE1cio, 1810": ", preface, 1810",
  ", \xA7 805": ", \xA7 805",
  "Goethe,": "Goethe,",
  /* teoria interativa */
  "Todo espa\xE7o de cor \xE9 um sistema de coordenadas. A diferen\xE7a est\xE1 em o que as coordenadas medem: n\xFAmeros convenientes para a m\xE1quina, ou dist\xE2ncias que o olho reconhece. HSL \xE9 do primeiro tipo. OKLab, do segundo. Estas ferramentas calculam tudo em OKLab, e o que vem abaixo mostra por qu\xEA.": "Every colour space is a coordinate system. The difference is what the coordinates measure: numbers convenient for the machine, or distances the eye recognises. HSL is the first kind. OKLab, the second. These tools compute everything in OKLab, and what follows shows why.",
  "A luminosidade que mente": "The lightness that lies",
  'Em HSL, "luminosidade 55%" \xE9 a m\xE9dia entre o canal mais forte e o mais fraco, sem nenhuma rela\xE7\xE3o com o brilho que o olho v\xEA. Um amarelo e um azul declarados com a mesma luminosidade parecem um claro e um escuro. Em OKLab, o L \xE9 calibrado sobre medi\xE7\xF5es de percep\xE7\xE3o: dois tons com o mesmo L parecem igualmente claros, seja qual for o matiz. Mova o controle abaixo e compare as duas fileiras.': 'In HSL, "lightness 55%" is the average of the strongest and weakest channel, with no relation to the brightness the eye sees. A yellow and a blue declared at the same lightness look like one light and one dark. In OKLab, L is calibrated on perceptual measurements: two tones with the same L look equally light, whatever the hue. Move the control below and compare the two rows.',
  "A mistura que passa pelo cinza": "The mix that goes through grey",
  "Ao misturar duas cores, a m\xE1quina desenha uma linha reta entre elas. Em RGB e HSL, essa linha atravessa uma zona morta: o meio do caminho entre um azul e um amarelo \xE9 um cinza sujo. Em OKLab a linha passa por tons que ainda t\xEAm vida, porque o espa\xE7o foi desenhado para que a reta pare\xE7a uma transi\xE7\xE3o. \xC9 o que faz o degrad\xEA e as escalas de tom destas ferramentas.": "When mixing two colours, the machine draws a straight line between them. In RGB and HSL that line crosses a dead zone: halfway between a blue and a yellow is a dirty grey. In OKLab the line passes through tones that still have life, because the space was designed so that a straight line looks like a transition. It is what drives the gradient and tone scales in these tools.",
  "O croma que se reduz em vez de se cortar": "Chroma reduced instead of clipped",
  "Nem toda cor que o OKLab descreve existe em sRGB: um azul muito claro e muito saturado n\xE3o cabe na tela. A sa\xEDda f\xE1cil \xE9 cortar os canais que passam de 255, e o resultado muda de matiz. A sa\xEDda certa, que estas ferramentas usam, \xE9 reduzir o croma por busca bin\xE1ria at\xE9 a cor caber, mantendo o L e o matiz. A cor fica menos intensa, mas continua sendo a mesma cor.": "Not every colour OKLab describes exists in sRGB: a very light, very saturated blue does not fit on screen. The easy way out is to clip channels above 255, and the result shifts hue. The right way, which these tools use, is to reduce chroma by binary search until the colour fits, keeping L and hue. The colour becomes less intense but stays the same colour.",
  "De onde vem": "Where it comes from",
  "OKLab foi publicado por Bj\xF6rn Ottosson em 2020 como uma corre\xE7\xE3o pr\xE1tica dos espa\xE7os CIELAB e IPT, ajustada para que as dist\xE2ncias e os matizes batessem melhor com os dados perceptivos. Entrou no CSS Color 4 e \xE9 hoje o espa\xE7o recomendado para interpolar cor no navegador.": "OKLab was published by Bj\xF6rn Ottosson in 2020 as a practical correction of the CIELAB and IPT spaces, tuned so that distances and hues matched perceptual data better. It entered CSS Color 4 and is today the recommended space for interpolating colour in the browser.",
  "Luminosidade declarada": "Declared lightness",
  "A mesma sequ\xEAncia de oito matizes, com a luminosidade fixada no valor do controle. Em HSL o brilho salta de um matiz para o outro; em OKLab fica est\xE1vel.": "The same sequence of eight hues, with lightness fixed at the control's value. In HSL the brightness jumps from hue to hue; in OKLab it stays steady.",
  "Mistura entre": "Mix between",
  "Cor A": "Colour A",
  "Cor B": "Colour B",
  "Posi\xE7\xE3o na mistura": "Position in the mix",
  "A faixa de cima \xE9 a mistura em RGB, a de baixo em OKLab. O marcador mostra a cor no ponto escolhido em cada uma. Toque nas duas bolinhas para trocar as cores de partida pelas da sua paleta.": "The top band is the mix in RGB, the bottom one in OKLab. The marker shows the colour at the chosen point in each. Tap the two dots to swap the starting colours for ones from your palette.",
  "Uma combina\xE7\xE3o pode ser bonita e ileg\xEDvel ao mesmo tempo. A raz\xE3o de contraste do WCAG n\xE3o mede beleza: mede a diferen\xE7a de lumin\xE2ncia entre o texto e o fundo, que \xE9 o que decide se uma pessoa com vis\xE3o comum, cansada ou reduzida consegue ler. Experimente abaixo.": "A combination can be beautiful and illegible at the same time. The WCAG contrast ratio does not measure beauty: it measures the luminance difference between text and background, which is what decides whether a person with ordinary, tired or reduced sight can read. Try it below.",
  "Cor do texto": "Text colour",
  "Hex do texto": "Text hex",
  "Trocar texto e fundo": "Swap text and background",
  "Cor do fundo": "Background colour",
  "Hex do fundo": "Background hex",
  "Usar a paleta atual": "Use the current palette",
  "para 1": "to 1",
  "Texto grande, 24 px em negrito \u2014 pede 3,0 para 1.": "Large text, 24 px bold \u2014 asks for 3.0 to 1.",
  "Texto corrido, 16 px \u2014 pede 4,5 para 1. Este par\xE1grafo \xE9 o que mais importa, porque \xE9 o que as pessoas leem por mais tempo.": "Body text, 16 px \u2014 asks for 4.5 to 1. This paragraph matters most, because it is what people read the longest.",
  "Interface e \xEDcones \u2014 3,0 para 1": "Interface and icons \u2014 3.0 to 1",
  "Como se calcula": "How it is calculated",
  "Cada cor vira uma lumin\xE2ncia relativa, de 0 (preto) a 1 (branco), com os canais RGB linearizados e ponderados pela sensibilidade do olho (o verde pesa 71%, o vermelho 21%, o azul 7%). A raz\xE3o \xE9 (L clara + 0,05) dividido por (L escura + 0,05). Vai de 1 (mesma cor) a 21 (preto sobre branco).": "Each colour becomes a relative luminance, from 0 (black) to 1 (white), with the RGB channels linearised and weighted by the eye's sensitivity (green weighs 71%, red 21%, blue 7%). The ratio is (lighter L + 0.05) divided by (darker L + 0.05). It runs from 1 (same colour) to 21 (black on white).",
  "Os limiares": "The thresholds",
  "Texto corrido: 4,5 para 1 (n\xEDvel AA) ou 7 para 1 (AAA). Texto grande, a partir de 24 px ou 19 px em negrito: 3,0 (AA) ou 4,5 (AAA). Elementos de interface e \xEDcones: 3,0. Abaixo de 3,0 nada \xE9 leg\xEDvel para uma parte grande das pessoas, mesmo que pare\xE7a n\xEDtido para voc\xEA.": "Body text: 4.5 to 1 (level AA) or 7 to 1 (AAA). Large text, from 24 px or 19 px bold: 3.0 (AA) or 4.5 (AAA). Interface elements and icons: 3.0. Below 3.0 nothing is legible for a large share of people, even if it looks sharp to you.",
  "Por que a cor bonita falha": "Why the pretty colour fails",
  "O azul pesa pouco na lumin\xE2ncia, por isso um azul saturado sobre branco passa e um laranja igualmente saturado falha: o laranja carrega muito verde e vermelho, que s\xE3o claros para o olho. Duas cores de matizes opostos e mesmo brilho, as mais vibrantes lado a lado, costumam ter raz\xE3o perto de 1: elas vibram exatamente porque o olho n\xE3o consegue separ\xE1-las por lumin\xE2ncia.": "Blue weighs little in luminance, which is why a saturated blue on white passes and an equally saturated orange fails: orange carries a lot of green and red, which are light to the eye. Two colours of opposite hue and equal brightness, the most vibrant side by side, usually have a ratio near 1: they vibrate precisely because the eye cannot separate them by luminance.",
  "O que a raz\xE3o n\xE3o mede": "What the ratio does not measure",
  "Ela n\xE3o v\xEA tamanho, peso, espa\xE7amento nem o cansa\xE7o. Um texto que passa com 4,6 em corpo 16 e peso fino continua dif\xEDcil. E a f\xF3rmula n\xE3o distingue daltonismo: para isso, as ferramentas simulam as tr\xEAs formas de vis\xE3o de cor reduzida. A raz\xE3o \xE9 o m\xEDnimo, n\xE3o o suficiente.": "It does not see size, weight, spacing or fatigue. A text that passes at 4.6 in 16 px and a thin weight is still hard. And the formula does not distinguish colour-vision deficiency: for that, the tools simulate the three forms of reduced colour vision. The ratio is the minimum, not the sufficient.",
  "Texto corrido AA": "Body text AA",
  "Texto corrido AAA": "Body text AAA",
  "Texto grande AA": "Large text AA",
  "Texto grande AAA": "Large text AAA",
  "Interface e \xEDcones": "Interface and icons",
  "passa": "passes",
  "falha": "fails",
  "Raz\xE3o de contraste {r} para 1": "Contrast ratio {r} to 1",
  "Gere uma paleta em Cores primeiro": "Generate a palette in Colour first",
  "A cor nasce na fronteira": "Colour is born at the boundary",
  "Entre a luz e a treva, atravessada por um meio turvo, diz Goethe. O texto corrido pede calma; o t\xEDtulo pede presen\xE7a.": "Between light and dark, crossed by a turbid medium, says Goethe. Body text asks for calm; the headline asks for presence.",
  /* ousadia */
  "Ousadia": "Boldness",
  "Conservador": "Conservative",
  "Inovador": "Innovative",
  "Disruptivo": "Disruptive",
  "Croma contido, matiz perto da conven\xE7\xE3o, fam\xEDlias de texto seguras.": "Contained chroma, hue close to convention, safe text families.",
  "O comportamento de refer\xEAncia do instrumento.": "The instrument's reference behaviour.",
  "Croma um pouco acima, mais liberdade no matiz, fam\xEDlias com voz pr\xF3pria.": "Chroma a little higher, more freedom in hue, families with a voice of their own.",
  "Croma alto, matiz solto, oposi\xE7\xE3o de estrutura e fundi\xE7\xF5es independentes.": "High chroma, loose hue, structural opposition and independent foundries.",
  /* caminho */
  "Compor um caminho": "Compose a path",
  "Das tr\xEAs propostas, escolha de qual vem a paleta e de qual vem a tipografia. O resultado \xE9 um caminho s\xF3, com amostra viva, e pode ser refinado cor a cor e fam\xEDlia a fam\xEDlia.": "From the three proposals, choose which one gives the palette and which one gives the type. The result is a single path, with a live specimen, and can be refined colour by colour and family by family.",
  "Paleta de": "Palette from",
  "Tipografia de": "Type from",
  "Paleta de qual proposta": "Palette from which proposal",
  "Tipografia de qual proposta": "Type from which proposal",
  "Paleta da proposta {a} com a tipografia da proposta {b}": "Palette of proposal {a} with the type of proposal {b}",
  "Caminho composto": "Composed path",
  "Caminho": "Path",
  "caminho": "path",
  "Caminho composto \u2014 {t}": "Composed path \u2014 {t}",
  "Refinar este caminho": "Refine this path",
  "Cada cor pode ser trocada, clareada, escurecida, avivada ou acalmada, e volta ao original com um toque. Cada fam\xEDlia pode ser trocada por outra que combine, for\xE7ada a serifada ou sem serifa, ou escolhida \xE0 m\xE3o.": "Each colour can be swapped, lightened, darkened, enlivened or calmed, and returns to the original with one tap. Each family can be swapped for another that pairs, forced to serif or sans, or chosen by hand.",
  "Trocar": "Swap",
  "Mais clara": "Lighter",
  "Mais escura": "Darker",
  "Mais viva": "More vivid",
  "Mais s\xF3bria": "More muted",
  "Original": "Original",
  "Serifada": "Serif",
  "Sem serifa": "Sans serif",
  "Escolher fam\xEDlia": "Choose a family",
  "Escolher\u2026": "Choose\u2026",
  "Mudan\xE7as: ": "Changes: ",
  "cor {n} {o}": "colour {n} {o}",
  "mais clara": "lighter",
  "mais escura": "darker",
  "mais viva": "more vivid",
  "mais s\xF3bria": "more muted",
  "trocada": "swapped",
  "{r} agora em {f}": "{r} now in {f}",
  "Nenhuma fam\xEDlia cabe nesse pedido": "No family fits that request",
  "Ou pe\xE7a por escrito": "Or ask in writing",
  "Ex.: cor 2 mais escura, t\xEDtulo serifado, texto em Inter, todas mais s\xF3brias": "E.g. colour 2 darker, serif headline, body in Inter, all more muted",
  "Aplicar": "Apply",
  "{n} mudan\xE7a(s) aplicada(s)": "{n} change(s) applied",
  "N\xE3o entendi o pedido \u2014 use os bot\xF5es ou escreva como nos exemplos": "I did not understand the request \u2014 use the buttons or write as in the examples",
  "Desfazer tudo": "Undo everything",
  "Refinamentos: ": "Refinements: ",
  "Paleta da proposta {a} ({x}); tipografia da proposta {b} ({y}).": "Palette of proposal {a} ({x}); type of proposal {b} ({y}).",
  "{f} \u2014 vindo do caminho composto.": "{f} \u2014 from the composed path.",
  /* imagem */
  "Inspirar em imagem": "From an image",
  "Encontrar essa tipografia": "Find this typography",
  "Imagem de refer\xEAncia \u2014 paleta e tipografia inspiradas na imagem": "Reference image \u2014 palette and typography drawn from the image",
  "Enviar imagem": "Upload image",
  "Usar c\xE2mera": "Use camera",
  "Remover": "Remove",
  "Lendo a imagem\u2026": "Reading the image\u2026",
  "{n} cores extra\xEDdas da imagem, em esquema livre. Arraste as bolas para refinar.": "{n} colours extracted from the image, in free scheme. Drag the balls to refine.",
  "N\xE3o consegui ler essa imagem \u2014 tente JPG, PNG, WEBP ou SVG.": "Could not read that image \u2014 try JPG, PNG, WEBP or SVG.",
  "{d} no t\xEDtulo, {b} no texto \u2014 estimadas a partir da textura da imagem.": "{d} for the headline, {b} for the text \u2014 estimated from the image texture.",
  "Textura pouco n\xEDtida \u2014 a estimativa \xE9 fraca. ": "Texture not clear \u2014 the estimate is weak. ",
  "Estimativa: {s}, contraste {c}. Fam\xEDlias parecidas: {l}.": "Estimate: {s}, {c} contrast. Similar families: {l}.",
  "serifada": "serif",
  "sem serifa": "sans serif",
  "alto": "high",
  "m\xE9dio": "medium",
  "As tr\xEAs propostas v\xE3o partir desta imagem.": "The three proposals will start from this image.",
  "Tipografia estimada: {s}, contraste {c}.": "Estimated typography: {s}, {c} contrast.",
  "Paleta extra\xEDda da imagem": "Palette extracted from the image",
  "cores exatas da imagem": "exact image colours",
  "A primeira proposta usa exatamente estas cores; as outras duas as interpretam.": "The first proposal uses exactly these colours; the other two interpret them."
};

// src/data/emotions.ts
var EMO = [
  { n: "Nenhuma", a: null, g: "Sem inten\xE7\xE3o declarada, o matiz de partida vem s\xF3 da conven\xE7\xE3o do campo, da refer\xEAncia cultural e de onde as bolas estiverem no anel." },
  { n: "Alegria e clareza", a: 120, g: "O amarelo \xE9 a cor imediatamente vizinha da luz. Em estado puro e l\xEDmpido, diz Goethe, traz consigo uma natureza serena, alegre, suavemente excitante \u2014 mas basta suj\xE1-lo um pouco para que essa mesma alegria vire desonra." },
  { n: "Otimismo caloroso", a: 100, g: "Intensificar o amarelo em dire\xE7\xE3o ao vermelho \xE9 dar-lhe calor sem ainda lhe dar viol\xEAncia. \xC9 a regi\xE3o em que o olho se sente acolhido e n\xE3o pressionado." },
  { n: "Energia e urg\xEAncia", a: 45, g: "O vermelho-amarelo \xE9 o lado ativo em sua maior energia. Goethe observa que animais se irritam diante dele e que pessoas sens\xEDveis n\xE3o o suportam por muito tempo \u2014 o que \xE9 exatamente o ponto, quando se quer for\xE7ar uma a\xE7\xE3o." },
  { n: "Desejo e apetite", a: 35, g: "Aqui a intensifica\xE7\xE3o j\xE1 beira o insuport\xE1vel. \xC9 a faixa que chama o corpo antes de chamar o ju\xEDzo." },
  { n: "Autoridade e gravidade", a: 5, g: "O purp\xFAreo \xE9 o cume da intensifica\xE7\xE3o: nele os dois lados do c\xEDrculo se encontram. Goethe atribui-lhe dignidade e gravidade e nota que n\xE3o por acaso foi a cor dos que governam." },
  { n: "Cerim\xF4nia e legado", a: 350, g: "Purp\xFAreo puxado ao escuro. Goethe o descreve como severidade e gra\xE7a ao mesmo tempo \u2014 a mesma cor que imp\xF5e \xE9 a que encanta." },
  { n: "Aspira\xE7\xE3o e inquieta\xE7\xE3o", a: 305, g: "O vermelho-azul \xE9 inquieto e aspirante. Goethe o descreve como algo que n\xE3o se acomoda: quer continuar subindo." },
  { n: "Mist\xE9rio e transcend\xEAncia", a: 290, g: "O lado negativo intensificado. A cor deixa de descrever o mundo e passa a sugerir o que est\xE1 atr\xE1s dele." },
  { n: "Profundidade e dist\xE2ncia", a: 240, g: "O azul carrega consigo um princ\xEDpio de treva. Goethe diz que ele nos atrai e ao mesmo tempo nos puxa para longe \u2014 como um belo nada, que se afasta \xE0 medida que se olha." },
  { n: "Confian\xE7a e serenidade", a: 225, g: "Azul empurrado ao verde: a contradi\xE7\xE3o entre excita\xE7\xE3o e repouso que Goethe atribui ao azul come\xE7a a se resolver em favor do repouso." },
  { n: "Melancolia e saudade", a: 258, g: "O azul frio e sombrio. Goethe associa esse lado a um sentimento de aus\xEAncia que n\xE3o chega a ser desagrad\xE1vel." },
  { n: "Repouso e equil\xEDbrio", a: 180, g: "No verde, diz Goethe, olho e alma descansam. N\xE3o se quer ir al\xE9m, e n\xE3o se pode \u2014 \xE9 o \xFAnico ponto do c\xEDrculo em que a busca termina." },
  { n: "Cuidado e regenera\xE7\xE3o", a: 163, g: "Verde com amarelo dentro. O repouso do verde recebe de volta uma parte da atividade da luz, sem virar est\xEDmulo." },
  { n: "Rigor e precis\xE3o", a: 203, g: "Verde-azulado de croma contido. Nada nessa faixa pede aten\xE7\xE3o; ela \xE9 lida como m\xE9todo." },
  { n: "Abund\xE2ncia e fartura", a: 135, g: "Amarelo puxado ao verde, com croma alto. A sensa\xE7\xE3o de excesso vem menos do matiz do que da satura\xE7\xE3o que ele suporta." },
  { n: "Intimidade e calor", a: 18, g: "Purp\xFAreo puxado ao vermelho e rebaixado de luminosidade. Goethe nota que essa vizinhan\xE7a tem gra\xE7a sem perder gravidade." },
  { n: "Nostalgia e ternura", a: 80, g: "Um amarelo j\xE1 puxado ao vermelho e rebaixado, a cor da luz no fim da tarde e do papel envelhecido. Goethe diz que o amarelo intensificado traz calor sem viol\xEAncia; aqui o calor vem com a dist\xE2ncia do tempo, e por isso comove em vez de agitar.", key: "intim" },
  { n: "Coragem e afirma\xE7\xE3o", a: 30, g: "O vermelho-amarelo na sua faixa mais firme, antes de virar apetite. \xC9 a cor que Goethe descreve como a que avan\xE7a sobre quem olha; usada com \xE1rea contida, deixa de ser amea\xE7a e vira decis\xE3o.", key: "energ" },
  { n: "Rever\xEAncia e sagrado", a: 335, g: "O p\xFArpura no ponto em que o azul ainda o segura. Goethe atribui a essa cor dignidade e gravidade, e um vidro p\xFArpura mostra o mundo, diz ele, como no Dia do Ju\xEDzo. \xC9 a cor dos mantos, dos altares e do que n\xE3o se toca.", key: "cerim" },
  { n: "Espanto e maravilha", a: 270, g: "Entre o azul e o vermelho-azul, onde o olho n\xE3o descansa nem decide. Goethe v\xEA no azul algo que recua e atrai ao mesmo tempo; puxado ao violeta, esse movimento vira inquieta\xE7\xE3o luminosa, a sensa\xE7\xE3o de estar diante de algo maior.", key: "aspir" },
  { n: "Sil\xEAncio e contempla\xE7\xE3o", a: 215, g: "Azul esverdeado com o croma quase todo retirado. Nada avan\xE7a, nada chama. \xC9 a regi\xE3o que Goethe associa ao repouso do olho quando o verde se aproxima do azul: a cor de um lago parado ao amanhecer.", key: "repou" },
  { n: "Esperan\xE7a e recome\xE7o", a: 150, g: "Verde puxado ao amarelo, a cor do broto antes da folha. Goethe diz que no verde o olho e a alma descansam; com um pouco de amarelo, esse descanso ganha dire\xE7\xE3o, e vira promessa.", key: "cuida" },
  { n: "Luto e despedida", a: 250, g: "Azul profundo, rebaixado quase at\xE9 a treva. Para Goethe o azul carrega um princ\xEDpio de escurid\xE3o e sempre puxa para longe; aqui \xE9 a dist\xE2ncia de quem partiu. As culturas vestem o luto de preto ou de branco, mas o sentimento tem esta cor.", key: "melan" },
  { n: "Erotismo e pele", a: 355, g: "P\xFArpura puxado ao vermelho, aquecido e com o croma alto. \xC9 a faixa que Goethe chama de gra\xE7a e encanto ao mesmo tempo que gravidade: chama o corpo com eleg\xE2ncia, sem a urg\xEAncia do vermelho-amarelo.", key: "desej" },
  { n: "Liberdade e vastid\xE3o", a: 232, g: "O azul do c\xE9u alto, claro e aberto. Goethe descreve o azul como a cor que se afasta e nos puxa atr\xE1s dela: \xE9 o horizonte, o mar visto de longe, tudo o que ainda n\xE3o tem borda.", key: "profu" },
  { n: "Humor e ironia", a: 110, g: "Amarelo levemente esverdeado, mais \xE1cido do que alegre. Goethe avisa que basta sujar o amarelo para a alegria virar desonra; a ironia mora exatamente nessa margem, e sabe disso.", key: "alegr" },
  { n: "Raiz e pertencimento", a: 70, g: "Vermelho-amarelo escurecido at\xE9 o ocre, a cor da terra, do barro e do p\xE3o. \xC9 a primeira cor que os humanos fabricaram, e Goethe a coloca do lado ativo e quente do c\xEDrculo: aqui, aquecida e rebaixada, vira ch\xE3o.", key: "confi" },
  { n: "Vertigem e \xEAxtase", a: 320, g: "Magenta com o croma no limite do gamut. Goethe descreve o encontro dos dois lados no p\xFArpura como o cume; empurrado at\xE9 o fim, o cume vira precip\xEDcio, e o olho n\xE3o sabe se sobe ou cai.", key: "aspir" },
  { n: "Sabedoria e tempo", a: 210, g: "Azul-verde fechado e sem brilho, a cor do bronze antigo e da \xE1gua funda. Do lado passivo do c\xEDrculo de Goethe, \xE9 a cor que n\xE3o pede nada: j\xE1 viu o suficiente para n\xE3o precisar convencer.", key: "rigor" },
  { n: "Al\xEDvio e leveza", a: 140, g: "Verde claro puxado ao amarelo, com muita luz e pouco croma. \xC9 o descanso de Goethe depois de um esfor\xE7o: a cor de sair de uma sala fechada para o ar.", key: "repou" }
];
EMO.forEach((e) => {
  if (e.key) return;
  e.key = e.n.split(" ")[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").slice(0, 5);
});

// src/data/markets.ts
var MKT = [
  { n: "Nenhum", a: null, c: "nenhuma", d: "Sem campo declarado, nada puxa o matiz para o lugar j\xE1 ocupado por outros \u2014 o resultado vem da inten\xE7\xE3o e da geometria, e n\xE3o de um territ\xF3rio disputado." },
  { n: "Finan\xE7as e bancos", a: 235, c: "azul institucional", d: "O azul domina o setor porque promete dist\xE2ncia e frieza \u2014 exatamente o que Goethe descreve. Por isso deixou de significar qualquer coisa: todos o usam." },
  { n: "Fintech e cripto", a: 282, c: "violeta e gradiente", d: "A categoria migrou em bloco para o vermelho-azul. Diferenciar-se hoje custa mais do que aderir." },
  { n: "Clima e regenera\xE7\xE3o", a: 175, c: "verde de repouso", d: "O verde diz repouso, n\xE3o transforma\xE7\xE3o. Para um campo cuja tese \xE9 mudan\xE7a sist\xEAmica, a conven\xE7\xE3o trabalha contra a mensagem." },
  { n: "Bioeconomia e agro", a: 155, c: "verde com terra", d: "Conven\xE7\xE3o s\xF3lida e pouco disputada; a ruptura \xFAtil costuma ser no croma, n\xE3o no matiz." },
  { n: "Sa\xFAde e cuidado", a: 214, c: "azul cl\xEDnico", d: "Azul-esverdeado de croma baixo. Ganha credibilidade e perde calor \u2014 a troca \xE9 conhecida." },
  { n: "Bem-estar e longevidade", a: 158, c: "verde suave e neutros", d: "Categoria saturada de dessatura\xE7\xE3o. O bege com s\xE1lvia virou o lugar-comum do setor." },
  { n: "Alimentos e bebidas", a: 40, c: "vermelho-amarelo", d: "O lado ativo em alta energia funciona porque atua no corpo antes do ju\xEDzo. \xC9 tamb\xE9m o mais disputado." },
  { n: "Luxo e joalheria", a: 4, c: "purp\xFAreo e preto", d: "O campo onde o preto j\xE1 \xE9 tratado como cor, n\xE3o como fundo. A gravidade do purp\xFAreo \xE9 a escolha hist\xF3rica." },
  { n: "Moda", a: 300, c: "preto e o extremo do c\xEDrculo", d: "Tolera qualquer matiz porque o sistema \xE9 carregado pelo preto e pelo branco." },
  { n: "Tecnologia e software", a: 248, c: "azul e violeta", d: "A conven\xE7\xE3o \xE9 t\xE3o espessa que qualquer coisa fora dela j\xE1 l\xEA como posicionamento." },
  { n: "Turismo e hospitalidade", a: 205, c: "azul-verde de destino", d: "Mar e folha. Funciona no destino e falha na pe\xE7a, porque n\xE3o distingue um lugar do outro." },
  { n: "Viagem transformacional", a: 288, c: "violeta e terrosos", d: "Categoria jovem, conven\xE7\xE3o ainda mole \u2014 \xE9 onde a ruptura custa menos." },
  { n: "Energia e infraestrutura", a: 58, c: "laranja e amarelo", d: "Heran\xE7a de seguran\xE7a industrial. O amarelo aqui n\xE3o \xE9 alegria: \xE9 sinaliza\xE7\xE3o." },
  { n: "Educa\xE7\xE3o", a: 122, c: "amarelo e azul", d: "A combina\xE7\xE3o caracter\xEDstica amarelo e azul \xE9 a mais antiga do setor e continua funcionando." },
  { n: "M\xEDdia e cultura", a: 345, c: "purp\xFAreo e preto", d: "Campo que recompensa contraste de valor mais do que matiz." },
  { n: "Setor p\xFAblico e ONGs", a: 230, c: "azul de institui\xE7\xE3o", d: "Conven\xE7\xE3o defensiva. Romper aqui exige sustentar a ruptura por anos." },
  { n: "Arte e editorial", a: 352, c: "preto, branco e um acento", d: "O conte\xFAdo carrega o sistema. A cor entra como pontua\xE7\xE3o, n\xE3o como estrutura." },
  { n: "Imobili\xE1rio e arquitetura", a: 148, c: "verde e neutros quentes", d: "Croma baixo por padr\xE3o; a diferencia\xE7\xE3o costuma vir do preto escolhido." },
  { n: "Varejo e e-commerce", a: 28, c: "vermelho de convers\xE3o", d: "O vermelho-amarelo vende porque pressiona. Usado o tempo todo, deixa de pressionar." }
];

// src/data/schemes.ts
var SCH = [
  { n: "Nenhum \u2014 livre", off: null, d: "As bolas ficam onde voc\xEA as deixar. Nada \xE9 for\xE7ado a manter dist\xE2ncia." },
  { n: "Goethe \u2014 harm\xF4nica", off: [180, 180, 0, 180, 0], mirror: true, d: "Os opostos do c\xEDrculo: a combina\xE7\xE3o que, segundo Goethe, traz em si a condi\xE7\xE3o de totalidade." },
  { n: "Goethe \u2014 caracter\xEDstica", off: [120, 240, 120, 240, 120], d: "Um espa\xE7o de dist\xE2ncia. Diz alguma coisa, ainda que n\xE3o tudo." },
  { n: "Goethe \u2014 sem car\xE1ter", off: [60, -60, 120, -120, 30], d: "Vizinhas no c\xEDrculo. N\xE3o desagradam, mas segundo ele falta-lhes car\xE1ter." },
  { n: "Monocrom\xE1tico", off: [0, 0, 0, 0, 0], mono: true, d: "Um s\xF3 matiz, variando luminosidade e croma. Toda a hierarquia vem do valor." },
  { n: "An\xE1logo", off: [30, -30, 60, -60, 90], d: "Vizinhan\xE7a estreita. Coeso e sem tens\xE3o; precisa de contraste de valor para n\xE3o achatar." },
  { n: "Complementar", off: [180, 180, 180, 0, 180], mirror: true, d: "Cruza o c\xEDrculo. M\xE1xima tens\xE3o de matiz entre dois polos." },
  { n: "Complementar dividido", off: [150, 210, 150, 210, 180], d: "Troca o oposto pelos dois vizinhos dele. Mant\xE9m a tens\xE3o e reduz o choque." },
  { n: "Tr\xEDade", off: [120, 240, 120, 240, 0], d: "Divide o c\xEDrculo em tr\xEAs. Vivo e equilibrado, dif\xEDcil de dosar em \xE1rea." },
  { n: "Tetr\xE1dico", off: [60, 180, 240, 0, 120], d: "Ret\xE2ngulo no c\xEDrculo: dois pares de opostos. Rico e o mais dif\xEDcil de equilibrar." },
  { n: "Quadrado", off: [90, 180, 270, 45, 225], d: "Quatro pontos equidistantes. Tetr\xE1dico sim\xE9trico, com a mesma exig\xEAncia de dosagem." }
];

// src/data/lenses.ts
var LENS = [
  {
    n: "Nenhuma",
    Cm: 1,
    Lp: [0.93, 0.62, 0.44, 0.76, 0.28, 0.55],
    w: [30, 22, 18, 14, 10, 6],
    m: "Sem m\xE9todo declarado, a paleta distribui luminosidade e \xE1rea de forma equilibrada, sem privilegiar nem a conten\xE7\xE3o nem o volume."
  },
  {
    n: "Pentagram \u2014 Londres e Nova York",
    Cm: 0.9,
    Lp: [0.965, 0.17, 0.58, 0.78, 0.42, 0.88],
    w: [70, 18, 7, 3, 1.2, 0.8],
    m: "Sabem ser barulhentos, mas quase sempre escolhem clareza: a tipografia carrega o sistema e a cor entra em dose \xFAnica. Da\xED o trabalho envelhecer bem enquanto o resto persegue ciclo de tend\xEAncia."
  },
  {
    n: "Wolff Olins \u2014 Londres e Nova York",
    Cm: 1.18,
    Lp: [0.62, 0.96, 0.16, 0.44, 0.8, 0.34],
    w: [56, 22, 12, 6, 3, 1],
    m: "Contratados quando o mercado precisa perceber que algo mudou de fato. A cor entra em volume alto e \xE9 tratada como propriedade do sistema, n\xE3o como acento."
  },
  {
    n: "COLLINS \u2014 Nova York e S\xE3o Francisco",
    Cm: 1.22,
    Lp: [0.66, 0.52, 0.76, 0.38, 0.9, 0.22],
    w: [26, 20, 18, 15, 12, 9],
    m: "Maximalismo crom\xE1tico: o sistema inteiro \xE9 a paleta, n\xE3o uma cor com apoios. Funciona quando h\xE1 superf\xEDcie suficiente para mostrar varia\xE7\xE3o."
  },
  {
    n: "PORTO ROCHA \u2014 Nova York e Londres",
    Cm: 1.1,
    Lp: [0.95, 0.3, 0.62, 0.15, 0.78, 0.45],
    w: [44, 24, 16, 10, 4, 2],
    m: "Fundado por dois brasileiros e virou refer\xEAncia editorial em poucos anos. Contraste de valor alto, dire\xE7\xE3o de arte forte, cor a servi\xE7o do conceito."
  },
  {
    n: "Koto \u2014 Londres e Nova York",
    Cm: 0.95,
    Lp: [0.96, 0.55, 0.72, 0.86, 0.24, 0.4],
    w: [48, 20, 12, 10, 6, 4],
    m: "Sistema digital limpo, constru\xEDdo para escalar em produto. A paleta vem como escala de tons, n\xE3o como conjunto de cores soltas."
  },
  {
    n: "Jones Knowles Ritchie \u2014 Londres e Nova York",
    Cm: 1.3,
    Lp: [0.6, 0.46, 0.92, 0.2, 0.72, 0.34],
    w: [50, 20, 14, 10, 4, 2],
    m: "Disciplina de g\xF4ndola: a cor precisa vencer a dist\xE2ncia de tr\xEAs metros e a concorr\xEAncia ao lado. Satura\xE7\xE3o alta e recorte duro."
  },
  {
    n: "Studio Dumbar \u2014 Roterd\xE3",
    Cm: 1.24,
    Lp: [0.14, 0.6, 0.74, 0.94, 0.46, 0.34],
    w: [52, 24, 12, 7, 3, 2],
    dark: true,
    m: "Identidade pensada em movimento antes de pensada parada. Cores duras sobre fundo escuro, porque o sistema vai viver em tela."
  },
  {
    n: "Chermayeff & Geismar & Haviv \u2014 Nova York",
    Cm: 1.02,
    Lp: [0.96, 0.54, 0.16, 0.7, 0.4, 0.84],
    w: [60, 26, 10, 2, 1, 1],
    m: "A casa dos s\xEDmbolos que atravessaram d\xE9cadas. Redu\xE7\xE3o plana: duas cores e a forma resolvem, e o que sobra \xE9 subtra\xEDdo."
  },
  {
    n: "Landor \u2014 rede global",
    Cm: 0.86,
    Lp: [0.95, 0.52, 0.72, 0.22, 0.84, 0.4],
    w: [52, 22, 12, 9, 3, 2],
    m: "Programas multimercado com governan\xE7a e pesquisa longa. O desvio em rela\xE7\xE3o ao que j\xE1 existe \xE9 pequeno de prop\xF3sito: protege o valor acumulado."
  },
  {
    n: "Mucho \u2014 Barcelona e S\xE3o Francisco",
    Cm: 0.98,
    Lp: [0.95, 0.5, 0.18, 0.7, 0.38, 0.82],
    w: [54, 20, 14, 8, 3, 1],
    m: "Modernismo europeu contido: grade vis\xEDvel, paleta fechada, nada sobrando. Cor usada como estrutura, n\xE3o como emo\xE7\xE3o declarada."
  },
  {
    n: "Experimental Jetset \u2014 Amsterd\xE3",
    Cm: 1.05,
    Lp: [0.97, 0.13, 0.55, 0.75, 0.35, 0.88],
    w: [58, 32, 8, 1, 0.5, 0.5],
    m: "Preto, branco e uma cor. A prova viva de que os dois polos de Goethe s\xE3o cores plenas: aqui eles fazem quase todo o trabalho e o matiz entra como acontecimento."
  },
  {
    n: "&Walsh \u2014 Nova York",
    Cm: 1.26,
    Lp: [0.64, 0.5, 0.9, 0.34, 0.74, 0.2],
    w: [32, 22, 18, 14, 9, 5],
    m: "Expressivo e saturado, com contraste de valor deliberadamente alto. A paleta \xE9 personagem."
  },
  {
    n: "DixonBaxi \u2014 Londres",
    Cm: 1.16,
    Lp: [0.15, 0.62, 0.5, 0.9, 0.36, 0.74],
    w: [46, 24, 14, 10, 4, 2],
    dark: true,
    m: "Melhor escolha quando o sistema precisa funcionar em movimento e no digital. Fundo escuro por padr\xE3o, porque \xE9 onde ele vai ser visto."
  },
  {
    n: "Ragged Edge \u2014 Londres",
    Cm: 1.2,
    Lp: [0.58, 0.94, 0.2, 0.7, 0.42, 0.8],
    w: [48, 26, 14, 8, 3, 1],
    m: "Trabalho opinativo: a cor toma partido e aceita afastar parte do p\xFAblico. N\xE3o existe vers\xE3o morna."
  },
  {
    n: "Pearlfisher \u2014 Londres e Nova York",
    Cm: 0.8,
    Lp: [0.94, 0.66, 0.78, 0.48, 0.3, 0.86],
    w: [54, 18, 12, 9, 5, 2],
    m: "Of\xEDcio de embalagem: cor dessaturada, sensa\xE7\xE3o de material, acabamento acima do impacto."
  },
  {
    n: "Interbrand e Siegel+Gale \u2014 rede global",
    Cm: 0.88,
    Lp: [0.96, 0.48, 0.72, 0.2, 0.84, 0.6],
    w: [58, 20, 12, 7, 2, 1],
    m: "A disciplina \xE9 simplificar: poucos tokens, acessibilidade resolvida na origem, sistema que sobrevive a quem o implementa mal."
  }
];

// src/data/cultures.ts
var CULT = [
  { n: "Nenhuma", pull: 0, Cm: 1, luzD: 0, trevaD: 0, m: "" },
  {
    n: "Aotearoa \u2014 k\u014Dk\u014Dwai, pango, m\u0101",
    anc: [22],
    pull: 0.62,
    Cm: 1.04,
    luzD: 6e-3,
    trevaD: -0.055,
    m: "K\u014Dk\u014Dwai \xE9 o ocre vermelho de argila e arenito ricos em ferro, queimados e mo\xEDdos, depois misturados a \xF3leo de f\xEDgado de tubar\xE3o ou de t\u012Btoki. A tradi\xE7\xE3o polin\xE9sia associa o vermelho a kura \u2014 algo precioso \u2014 e o que era pintado de vermelho tornava-se tapu. Pango e m\u0101 n\xE3o s\xE3o fundo: s\xE3o princ\xEDpios, e o branco vinha de concha queimada ou argila, por isso \xE9 quente."
  },
  {
    n: "Amaz\xF4nia ind\xEDgena \u2014 urucum, jenipapo, tabatinga",
    anc: [35, 250],
    pull: 0.68,
    Cm: 1.1,
    luzD: 4e-3,
    trevaD: -0.045,
    m: "O vermelho vem da polpa do urucum, o azul-escuro e o preto do suco fermentado do jenipapo \u2014 cujo nome, do guarani, quer dizer fruta que serve para pintar \u2014 e o branco da tabatinga ou do calc\xE1rio. Entre os Kayap\xF3, o vermelho testemunha a vida social e o preto \xE9 a cor da criatividade; a pintura indica idade, filhos e condi\xE7\xE3o, e n\xE3o \xE9 s\xF3 ritual: tamb\xE9m \xE9 prazer est\xE9tico."
  },
  {
    n: "Jap\xE3o \u2014 aizome, sumi, kurenai",
    anc: [255, 18],
    pull: 0.6,
    Cm: 0.72,
    luzD: 8e-3,
    trevaD: -0.06,
    m: "\xCDndigo de tina, tinta de fuligem e um vermelho que aparece pouco e em pouca \xE1rea. A l\xF3gica n\xE3o \xE9 de matiz, \xE9 de intervalo: croma baixo em quase tudo, para que um acontecimento de cor tenha peso."
  },
  {
    n: "\xC1frica Ocidental \u2014 \xEDndigo adire, ouro kente",
    anc: [250, 105, 30],
    pull: 0.58,
    Cm: 1.22,
    luzD: 0,
    trevaD: -0.03,
    m: "\xCDndigo resistido a amarra\xE7\xE3o e a amido, contra ouro e vermelho de tecelagem em faixas. Cores fortes que convivem porque s\xE3o separadas por estrutura \u2014 a trama faz o trabalho que uma grade faria."
  },
  {
    n: "Andes \u2014 cochonilha e \xEDndigo",
    anc: [358, 252],
    pull: 0.6,
    Cm: 1.12,
    luzD: -0.01,
    trevaD: -0.04,
    m: "O carmim de cochonilha e o \xEDndigo em l\xE3. O par vive de contraste de matiz com luminosidade parecida \u2014 o oposto do que o design ocidental costuma fazer."
  },
  {
    n: "Mediterr\xE2neo \u2014 cal e azul",
    anc: [243],
    pull: 0.52,
    Cm: 0.9,
    luzD: 0.014,
    trevaD: -0.01,
    m: "A cal domina em \xE1rea e o azul entra em recorte pequeno. \xC9 uma paleta de propor\xE7\xE3o, n\xE3o de quantidade de cores."
  },
  {
    n: "N\xF3rdico \u2014 luz baixa",
    anc: [218],
    pull: 0.48,
    Cm: 0.62,
    luzD: 6e-3,
    trevaD: -0.02,
    m: "Latitude alta, luz difusa e longa. Croma contido e faixa de luminosidade estreita: nada brilha porque nada precisa competir com sol forte."
  },
  {
    n: "M\xE9xico \u2014 Barrag\xE1n",
    anc: [340, 108, 240],
    pull: 0.58,
    Cm: 1.26,
    luzD: -4e-3,
    trevaD: -0.02,
    m: "Rosa, amarelo e azul em planos inteiros de parede. A cor \xE9 arquitetura: n\xE3o decora superf\xEDcie, define volume e sombra."
  },
  {
    n: "\xCDndia \u2014 sindoor, a\xE7afr\xE3o, \xEDndigo",
    anc: [22, 88, 255],
    pull: 0.58,
    Cm: 1.24,
    luzD: 2e-3,
    trevaD: -0.035,
    m: "Vermelho, a\xE7afr\xE3o e \xEDndigo em satura\xE7\xE3o alta e sem transi\xE7\xE3o. A vizinhan\xE7a de cores plenas \xE9 a regra, n\xE3o a exce\xE7\xE3o a administrar."
  },
  {
    n: "Bauhaus \u2014 prim\xE1rias e plano",
    anc: [18, 115, 245],
    pull: 0.66,
    Cm: 1.06,
    luzD: 0.012,
    trevaD: -0.05,
    m: "Vermelho, amarelo e azul tratados como material, sobre branco e preto. O pressuposto \xE9 o de Goethe invertido: a cor serve \xE0 forma, e a forma \xE9 geom\xE9trica."
  },
  {
    n: "Marrocos \u2014 zellige, a\xE7afr\xE3o, azul Majorelle",
    anc: [245, 95, 20],
    pull: 0.58,
    Cm: 1.18,
    luzD: 4e-3,
    trevaD: -0.04,
    m: "Azulejo cortado \xE0 m\xE3o em cobalto, verde e branco, contra paredes de terra e um a\xE7afr\xE3o que vem do mercado, n\xE3o da tinta. O azul intenso de Marrakech foi batizado por um pintor franc\xEAs, mas o esmalte que o antecede \xE9 do s\xE9culo XIV. A l\xF3gica \xE9 de repeti\xE7\xE3o: a cor ganha for\xE7a por ser cortada em peda\xE7os e repetida sem fim."
  },
  {
    n: "Coreia \u2014 obangsaek, as cinco cores",
    anc: [250, 18, 110],
    pull: 0.6,
    Cm: 1.15,
    luzD: 6e-3,
    trevaD: -0.05,
    m: "Azul, vermelho, amarelo, branco e preto, cada um ligado a uma dire\xE7\xE3o, um elemento e uma esta\xE7\xE3o. Aparecem nas faixas dos hanbok infantis, nas cordas dos templos e na comida. N\xE3o \xE9 uma paleta de harmonia: \xE9 um sistema do mundo, e as cinco precisam estar presentes para o conjunto estar completo."
  },
  {
    n: "China \u2014 vermelh\xE3o e jade",
    anc: [15, 165],
    pull: 0.62,
    Cm: 1.1,
    luzD: 2e-3,
    trevaD: -0.05,
    m: "O vermelho de cin\xE1brio dos port\xF5es e dos selos, e o verde do jade, a pedra que valia mais que o ouro. O vermelho \xE9 sorte e festa; o jade \xE9 virtude e perman\xEAncia. A dupla vive de contraste de matiz e de valor ao mesmo tempo, com o preto da tinta como terceira voz."
  },
  {
    n: "Mali \u2014 bogolan, a lama fermentada",
    anc: [40, 75],
    pull: 0.55,
    Cm: 0.78,
    luzD: -6e-3,
    trevaD: -0.06,
    m: "Tecido de algod\xE3o tingido com casca de \xE1rvore e pintado com lama de rio fermentada, que fixa o preto pelo ferro. Ocre, preto e o cru do algod\xE3o, em s\xEDmbolos que contam hist\xF3rias de aldeia. O croma \xE9 baixo porque vem da terra, e a for\xE7a est\xE1 no desenho, n\xE3o na cor."
  },
  {
    n: "Portugal \u2014 azulejo cobalto sobre branco",
    anc: [250],
    pull: 0.55,
    Cm: 0.95,
    luzD: 0.012,
    trevaD: -0.02,
    m: "Um s\xF3 azul, o de cobalto, sobre o branco de estanho, cobrindo igrejas, esta\xE7\xF5es e cozinhas desde o s\xE9culo XVII. \xC9 uma paleta de uma cor e de muita \xE1rea: o branco faz o trabalho de luz, e o azul desenha. Onde h\xE1 uma segunda cor, \xE9 o amarelo, e entra em pouca \xE1rea."
  },
  {
    n: "Egito antigo \u2014 azul eg\xEDpcio, ocre, ouro",
    anc: [240, 60, 95],
    pull: 0.6,
    Cm: 1.05,
    luzD: 2e-3,
    trevaD: -0.045,
    m: "O primeiro pigmento sint\xE9tico da hist\xF3ria, um silicato de cobre e c\xE1lcio cozido h\xE1 quatro mil anos, ao lado do ocre das paredes e do ouro das m\xE1scaras. As cores eram fixas por significado: o azul do rio e do c\xE9u, o verde do renascimento, o vermelho do deserto e do perigo. A paleta \xE9 um vocabul\xE1rio, n\xE3o um gosto."
  },
  {
    n: "P\xE9rsia \u2014 miniatura e l\xE1pis-laz\xFAli",
    anc: [250, 95, 350],
    pull: 0.6,
    Cm: 1.12,
    luzD: 4e-3,
    trevaD: -0.03,
    m: "Nas miniaturas de Herat e Tabriz, o azul de l\xE1pis-laz\xFAli mo\xEDdo ocupa o c\xE9u inteiro, o ouro entra em folha e o rosa e o verde v\xEAm em pequenos jardins. Cores planas, sem sombra, lado a lado: a profundidade \xE9 feita por sobreposi\xE7\xE3o, n\xE3o por gradiente."
  },
  {
    n: "Guatemala \u2014 huipil maia",
    anc: [340, 20, 105, 250],
    pull: 0.58,
    Cm: 1.3,
    luzD: 0,
    trevaD: -0.03,
    m: "Blusas tecidas em tear de cintura, com cores que identificam a aldeia de quem veste. Magenta, vermelho, amarelo e azul em satura\xE7\xE3o total, separadas por faixas de padr\xE3o. A regra \xE9 a vizinhan\xE7a de cores plenas: nada \xE9 rebaixado para que outra cor apare\xE7a."
  },
  {
    n: "Java \u2014 batik sogan",
    anc: [50, 250],
    pull: 0.55,
    Cm: 0.82,
    luzD: -4e-3,
    trevaD: -0.04,
    m: "Cera desenhada \xE0 m\xE3o e banhos de tintura em \xEDndigo e sogan, o marrom de casca de \xE1rvore dos batiks de Yogyakarta e Solo. Creme, marrom e azul-escuro, com o desenho em reserva. \xC9 uma paleta de tr\xEAs valores e croma baixo, feita para ser lida de perto."
  },
  {
    n: "Esc\xF3cia \u2014 tartan",
    anc: [160, 20, 250],
    pull: 0.55,
    Cm: 1,
    luzD: -2e-3,
    trevaD: -0.05,
    m: "Fios tingidos e cruzados em sequ\xEAncia fixa, o mesmo padr\xE3o na trama e na urdidura. Verde, azul e vermelho escurecidos pelo cruzamento: onde duas cores se sobrep\xF5em, nasce uma terceira. A mistura acontece no tecido, e o olho a completa a dist\xE2ncia."
  },
  {
    n: "Turquia \u2014 \u0130znik",
    anc: [250, 200, 20],
    pull: 0.6,
    Cm: 1.1,
    luzD: 0.01,
    trevaD: -0.03,
    m: "Cer\xE2mica otomana do s\xE9culo XVI: cobalto, turquesa e um vermelho de tomate em relevo, sobre branco. Tulipas, cravos e rom\xE3s em contorno preto. O branco \xE9 a maior \xE1rea; as tr\xEAs cores entram em desenho e se equilibram por serem igualmente saturadas."
  },
  {
    n: "Austr\xE1lia abor\xEDgene \u2014 ocres do deserto",
    anc: [45, 60],
    pull: 0.6,
    Cm: 0.9,
    luzD: -5e-3,
    trevaD: -0.05,
    m: "Ocre vermelho, ocre amarelo, carv\xE3o e argila branca, mo\xEDdos e misturados com \xE1gua ou seiva, em pontos e linhas que mapeiam territ\xF3rio e hist\xF3ria. As cores v\xEAm de lugares espec\xEDficos, com trocas registadas h\xE1 milhares de anos. O ponto \xE9 a unidade: a cor existe em acumula\xE7\xE3o, n\xE3o em plano."
  },
  {
    n: "Brasil \u2014 cerrado e sert\xE3o",
    anc: [45, 100, 165],
    pull: 0.56,
    Cm: 0.85,
    luzD: 2e-3,
    trevaD: -0.035,
    m: "Barro vermelho, palha, o verde-cinza da caatinga e o azul lavado do c\xE9u de seca. Cores de pouco croma e muita luz, que aparecem na cer\xE2mica do Jequitinhonha, no couro e nas fachadas de cal pintada. A paleta \xE9 de terra e de tempo, e o que brilha \xE9 o que a chuva traz."
  }
];

// src/data/music.ts
var MUS = [
  { n: "Nenhum", Cm: 1, ct: 0, sy: 0.5, m: "" },
  { n: "Bossa nova", Cm: 0.72, ct: -0.35, sy: 0.25, m: "Harmonia complexa em din\xE2mica baixa. Croma reduzido e contraste curto: tudo acontece dentro de uma faixa estreita, e a sofistica\xE7\xE3o est\xE1 no intervalo, n\xE3o no volume." },
  { n: "Samba de roda e batucada", Cm: 1.28, ct: 0.25, sy: 0.88, m: "S\xEDncope pesada. A propor\xE7\xE3o deixa de ser regular: uma cor domina, as outras entram fora do tempo, em \xE1reas pequenas e recorrentes." },
  { n: "Choro", Cm: 0.92, ct: 0, sy: 0.62, m: "Virtuosismo dentro de forma fixa. Propor\xE7\xE3o irregular, mas sempre voltando ao mesmo ponto de apoio." },
  { n: "Techno de Berlim", Cm: 0.82, ct: 0.9, sy: 0.12, m: "Repeti\xE7\xE3o sobre grade r\xEDgida. Contraste de valor extremo, quase nenhum evento de matiz, propor\xE7\xE3o regular \u2014 tudo vive no escuro e no pulso." },
  { n: "Ambient e drone", Cm: 0.4, ct: -0.7, sy: 0, m: "Sem ataque e sem borda. Croma m\xEDnimo e diferen\xE7as de luminosidade que quase n\xE3o se resolvem: a paleta \xE9 lida como campo, n\xE3o como conjunto." },
  { n: "Punk", Cm: 1.34, ct: 1, sy: 0.35, m: "Preto, branco e uma cor gritando. Contraste m\xE1ximo, nenhuma transi\xE7\xE3o, nenhuma cor de apoio." },
  { n: "Jazz modal", Cm: 0.96, ct: 0.1, sy: 0.58, m: "Poucos acordes, muito espa\xE7o. Intervalos largos entre os matizes e propor\xE7\xE3o que respira." },
  { n: "Gospel e soul", Cm: 1.14, ct: -0.15, sy: 0.42, m: "Luz alta e calor. Grande \xE1rea clara com cores cheias por cima \u2014 a paleta \xE9 coral, n\xE3o solo." },
  { n: "Dub e reggae", Cm: 1.08, ct: 0.55, sy: 0.72, m: "Grave enorme e eco. O escuro ganha \xE1rea, o resto entra em atraso e em peda\xE7os separados por sil\xEAncio." },
  { n: "Fado", Cm: 0.58, ct: 0.45, sy: 0.22, m: "Modo menor, sem ornamento. Croma baixo sobre escuro, e a cor aparece como voz \xFAnica." },
  { n: "Afrobeats", Cm: 1.26, ct: 0.15, sy: 0.78, m: "Camadas de percuss\xE3o que n\xE3o coincidem. V\xE1rias cores em \xE1reas m\xE9dias, nenhuma totalmente subordinada." },
  { n: "Romantismo cl\xE1ssico", Cm: 0.84, ct: 0.2, sy: 0.28, m: "Crescendo longo e resolu\xE7\xE3o. Propor\xE7\xE3o quase regular, com uma dominante que s\xF3 se imp\xF5e no fim." },
  { n: "Flamenco", Cm: 1.12, ct: 0.6, sy: 0.8, m: "Comp\xE1s de doze tempos e ataque seco. Contraste alto e propor\xE7\xE3o irregular: uma cor entra como palma, fora do lugar esperado, e o sil\xEAncio entre as entradas \xE9 parte da paleta." },
  { n: "Tango", Cm: 0.8, ct: 0.5, sy: 0.4, m: "Modo menor, corte e pausa. Croma contido, contraste de valor claro e uma cor que aparece como o bandone\xF3n: sozinha, no meio, e depois se retira." },
  { n: "Hip-hop e boom bap", Cm: 1, ct: 0.4, sy: 0.7, m: "Loop curto e grave presente. Propor\xE7\xE3o quebrada em blocos que se repetem, uma dominante escura e as outras cores como samples: peda\xE7os reconhec\xEDveis, recortados." },
  { n: "Raga indiano", Cm: 0.9, ct: -0.2, sy: 0.15, m: "Drone cont\xEDnuo e ornamento microtonal. Uma cor de base que nunca sai, e as outras como varia\xE7\xF5es muito pr\xF3ximas dela; quase nenhum contraste, muita nuance." },
  { n: "Gamelan", Cm: 1.05, ct: 0.1, sy: 0.66, m: "Metais entrela\xE7ados em ciclos que se encaixam. V\xE1rias cores em \xE1rea m\xE9dia, nenhuma solista, todas necess\xE1rias para o padr\xE3o fechar." },
  { n: "Taiko", Cm: 0.7, ct: 0.8, sy: 0.55, m: "Tambor grande e sil\xEAncio. Croma baixo, contraste m\xE1ximo de valor: o escuro domina e o claro entra como golpe." },
  { n: "Highlife e soukous", Cm: 1.3, ct: -0.05, sy: 0.7, m: "Guitarras claras em camadas alegres. Croma alto e luz alta, muitas cores em \xE1reas parecidas, nenhuma sombra longa." },
  { n: "Cumbia", Cm: 1.2, ct: 0, sy: 0.62, m: "Compasso de dois tempos que balan\xE7a. Cores plenas em propor\xE7\xE3o quase regular, com uma leve inclina\xE7\xE3o para que o conjunto n\xE3o pare." },
  { n: "Forr\xF3", Cm: 1.18, ct: 0.1, sy: 0.7, m: "Sanfona, zabumba e tri\xE2ngulo: tr\xEAs vozes de pesos diferentes. Uma cor grande, uma m\xE9dia e uma pequena que marca o tempo." },
  { n: "Minimalismo \u2014 Reich, Glass", Cm: 0.78, ct: 0.2, sy: 0.5, m: "Repeti\xE7\xE3o com deslocamento lento. Propor\xE7\xE3o regular e croma contido; a mudan\xE7a acontece por fase, uma cor ganhando \xE1rea quase sem se perceber." },
  { n: "Canto gregoriano", Cm: 0.35, ct: -0.5, sy: 0.05, m: "Uma s\xF3 linha, sem pulso, em pedra. Croma quase nulo e uma faixa de luminosidade estreita: a paleta \xE9 um \xFAnico material com varia\xE7\xF5es de luz." },
  { n: "Blues do Delta", Cm: 0.7, ct: 0.4, sy: 0.35, m: "Voz e viol\xE3o, doze compassos. Croma baixo, uma dominante escura e uma cor quente que responde como o slide na corda." },
  { n: "K-pop", Cm: 1.3, ct: 0.3, sy: 0.5, m: "Produ\xE7\xE3o densa e mudan\xE7as de se\xE7\xE3o bruscas. Croma m\xE1ximo, luz alta e propor\xE7\xE3o que troca de dominante no meio: a paleta tem dois refr\xF5es." },
  { n: "M\xFAsica andina", Cm: 0.95, ct: 0.1, sy: 0.5, m: "Siku, charango e bombo. Cores de l\xE3 em alturas diferentes, uma cor grave que sustenta e melodias claras por cima." }
];
var CVDLIST = [
  { v: "none", n: "Nenhuma \u2014 vis\xE3o tricrom\xE1tica" },
  { v: "deuteranopia", n: "Deuteranopia \u2014 a mais comum" },
  { v: "protanopia", n: "Protanopia" },
  { v: "tritanopia", n: "Tritanopia" },
  { v: "acromatopsia", n: "Acromatopsia \u2014 sem cor" }
];

// src/data/fonts.ts
var BANK_CODE = { g: "google", f: "fontshare", s: "fontsource", v: "velvetyne" };
var CLS = {
  "serif-old": { n: "Serifada humanista", d: "As mais antigas, herdeiras da pena inclinada. Eixo obl\xEDquo, contraste moderado, aberturas generosas. L\xEAem bem em texto longo e trazem calor sem parecer nost\xE1lgicas." },
  "serif-trans": { n: "Serifada transicional", d: "O passo entre a pena e o compasso. Eixo mais vertical, contraste m\xE9dio, formas reguladas. \xC9 a classe mais neutra do lado serifado e a mais segura para texto cont\xEDnuo." },
  "serif-mod": { n: "Serifada moderna", d: "As didonas. Eixo vertical, contraste extremo, serifas finas e retas. Brilham em corpo grande e desmancham em corpo pequeno." },
  "serif-slab": { n: "Serifada eg\xEDpcia", d: "Serifas retangulares do mesmo peso da haste. Contraste quase nulo, presen\xE7a mec\xE2nica. Aguentam condi\xE7\xF5es ruins de impress\xE3o e tela." },
  "sans-grot": { n: "Sem serifa grotesca", d: "As primeiras sem serifa do s\xE9culo XIX. Terminais horizontais, aberturas fechadas, personalidade \xE1spera. Boas em t\xEDtulo e em corpo m\xE9dio." },
  "sans-neo": { n: "Sem serifa neogrotesca", d: "A reforma modernista da grotesca: uniforme, silenciosa, quase sem maneirismo. \xC9 a classe padr\xE3o da interface." },
  "sans-geo": { n: "Sem serifa geom\xE9trica", d: "Constru\xEDda a partir de c\xEDrculo e reta. Contraste m\xEDnimo, clareza em t\xEDtulo, cansa\xE7o em texto longo por causa da repeti\xE7\xE3o de formas." },
  "sans-hum": { n: "Sem serifa humanista", d: "Uma serifada sem as serifas: eixo caligr\xE1fico, propor\xE7\xF5es variadas, aberturas amplas. A melhor classe sem serifa para texto corrido." },
  "mono": { n: "Monoespa\xE7ada", d: "Todas as letras com a mesma largura. Nasceu da m\xE1quina e do terminal; hoje carrega leitura t\xE9cnica, dado, c\xF3digo e legenda." },
  "display": { n: "De exibi\xE7\xE3o", d: "Desenhada para corpo grande e \xE1rea pequena. Espa\xE7amento apertado, formas fortes, nenhuma pretens\xE3o de servir a um par\xE1grafo." }
};
var FRAW = [
  ["EB Garamond", "g", "serif-old", 0.42, 0.55, 0.5, "both", "400;500;600;700", null, "cerim\xF4nia,repouso,editorial,elegante"],
  ["Cormorant Garamond", "g", "serif-old", 0.38, 0.78, 0.47, "display", "300;400;500;600;700", null, "elegante,cerim\xF4nia,melancolia,mist\xE9rio"],
  ["Crimson Pro", "g", "serif-old", 0.45, 0.52, 0.48, "body", "300;400;600;700", null, "editorial,repouso,intimidade"],
  ["Gentium Book Plus", "g", "serif-old", 0.48, 0.45, 0.5, "body", "400;700", null, "repouso,cuidado"],
  ["Alegreya", "g", "serif-old", 0.5, 0.5, 0.5, "both", "400;500;700;800", "alegreya", "calor,editorial,intimidade"],
  ["Vollkorn", "g", "serif-old", 0.53, 0.45, 0.52, "both", "400;500;600;700;800;900", null, "calor,abund\xE2ncia,intimidade"],
  ["Cardo", "g", "serif-old", 0.44, 0.55, 0.48, "body", "400;700", null, "cerim\xF4nia,melancolia"],
  ["Petrona", "g", "serif-old", 0.5, 0.5, 0.48, "both", "300;400;500;600;700", null, "intimidade,calor"],
  ["Erode", "f", "serif-old", 0.5, 0.45, 0.5, "both", "300;400;500;600;700", null, "repouso,cuidado,editorial"],
  ["Lora", "g", "serif-trans", 0.52, 0.5, 0.5, "both", "400;500;600;700", null, "confian\xE7a,editorial,cerim\xF4nia"],
  ["Spectral", "g", "serif-trans", 0.5, 0.45, 0.48, "both", "300;400;500;600;700", null, "rigor,editorial,repouso"],
  ["Source Serif 4", "g", "serif-trans", 0.52, 0.45, 0.5, "both", "300;400;600;700", "source", "confian\xE7a,institucional,rigor"],
  ["Literata", "g", "serif-trans", 0.53, 0.4, 0.52, "body", "300;400;500;600;700", null, "repouso,editorial,cuidado"],
  ["Newsreader", "g", "serif-trans", 0.52, 0.55, 0.48, "both", "300;400;500;600;700", null, "editorial,confian\xE7a"],
  ["Libre Baskerville", "g", "serif-trans", 0.55, 0.55, 0.54, "body", "400;700", null, "confian\xE7a,institucional,editorial"],
  ["Libre Caslon Text", "g", "serif-trans", 0.5, 0.55, 0.5, "body", "400;700", null, "editorial,cerim\xF4nia"],
  ["Frank Ruhl Libre", "g", "serif-trans", 0.5, 0.6, 0.48, "both", "300;400;500;700;900", null, "autoridade,editorial"],
  ["Faustina", "g", "serif-trans", 0.52, 0.45, 0.5, "both", "300;400;500;600;700", null, "cuidado,repouso"],
  ["Neuton", "g", "serif-trans", 0.48, 0.45, 0.48, "body", "300;400;700;800", null, "repouso,melancolia"],
  ["IBM Plex Serif", "g", "serif-trans", 0.52, 0.4, 0.5, "both", "300;400;500;600;700", "plex", "rigor,t\xE9cnico,institucional"],
  ["PT Serif", "g", "serif-trans", 0.52, 0.45, 0.5, "body", "400;700", "pt", "institucional,confian\xE7a"],
  ["Noto Serif", "g", "serif-trans", 0.53, 0.42, 0.5, "body", "400;500;600;700", "noto", "institucional,repouso"],
  ["Author", "f", "serif-trans", 0.52, 0.45, 0.5, "both", "300;400;500;600;700", null, "editorial,confian\xE7a"],
  ["Playfair Display", "g", "serif-mod", 0.55, 0.95, 0.5, "display", "400;500;600;700;800;900", null, "elegante,cerim\xF4nia,desejo,autoridade"],
  ["Bodoni Moda", "g", "serif-mod", 0.48, 1, 0.48, "display", "400;500;600;700;800;900", null, "autoridade,cerim\xF4nia,elegante"],
  ["Prata", "g", "serif-mod", 0.5, 0.85, 0.5, "display", "400", null, "elegante,cerim\xF4nia"],
  ["DM Serif Display", "g", "serif-mod", 0.53, 0.8, 0.5, "display", "400", null, "elegante,desejo,abund\xE2ncia"],
  ["Abril Fatface", "g", "serif-mod", 0.55, 0.9, 0.56, "display", "400", null, "energia,abund\xE2ncia,desejo"],
  ["Instrument Serif", "g", "serif-mod", 0.48, 0.8, 0.46, "display", "400", null, "editorial,elegante,mist\xE9rio"],
  ["Bespoke Serif", "f", "serif-mod", 0.5, 0.7, 0.5, "display", "300;400;500;700", null, "elegante,editorial"],
  ["Zodiak", "f", "serif-mod", 0.5, 0.75, 0.5, "display", "300;400;500;700;900", null, "aspira\xE7\xE3o,elegante,mist\xE9rio"],
  ["Young Serif", "g", "display", 0.55, 0.35, 0.54, "display", "400", null, "abund\xE2ncia,calor,informal"],
  ["Fraunces", "g", "display", 0.52, 0.6, 0.52, "display", "300;400;500;700;900", null, "calor,informal,alegria"],
  ["Roboto Slab", "g", "serif-slab", 0.53, 0.2, 0.5, "both", "300;400;500;700;900", "roboto", "rigor,institucional,t\xE9cnico"],
  ["Bitter", "g", "serif-slab", 0.53, 0.25, 0.5, "both", "300;400;500;700", null, "rigor,confian\xE7a"],
  ["Zilla Slab", "g", "serif-slab", 0.52, 0.2, 0.5, "both", "300;400;500;600;700", null, "t\xE9cnico,rigor"],
  ["Arvo", "g", "serif-slab", 0.52, 0.15, 0.52, "display", "400;700", null, "rigor,autoridade"],
  ["Josefin Slab", "g", "serif-slab", 0.4, 0.3, 0.46, "display", "300;400;600;700", null, "elegante,melancolia"],
  ["Inter", "g", "sans-neo", 0.57, 0.12, 0.5, "both", "300;400;500;600;700;800", null, "rigor,t\xE9cnico,confian\xE7a"],
  ["Roboto", "g", "sans-neo", 0.53, 0.12, 0.49, "both", "300;400;500;700;900", "roboto", "institucional,rigor"],
  ["Archivo", "g", "sans-neo", 0.53, 0.12, 0.5, "both", "300;400;500;600;700;800", "archivo", "energia,confian\xE7a"],
  ["Public Sans", "g", "sans-neo", 0.54, 0.12, 0.5, "both", "300;400;500;600;700", null, "institucional,rigor"],
  ["Libre Franklin", "g", "sans-neo", 0.52, 0.15, 0.5, "both", "300;400;500;600;700;800", null, "confian\xE7a,institucional"],
  ["Barlow", "g", "sans-neo", 0.52, 0.1, 0.47, "both", "300;400;500;600;700", null, "energia,t\xE9cnico"],
  ["Switzer", "f", "sans-neo", 0.53, 0.1, 0.5, "both", "300;400;500;600;700", null, "rigor,confian\xE7a"],
  ["Noto Sans", "g", "sans-neo", 0.53, 0.12, 0.5, "body", "400;500;600;700", "noto", "institucional,repouso"],
  ["Space Grotesk", "g", "sans-grot", 0.53, 0.12, 0.5, "both", "300;400;500;600;700", null, "t\xE9cnico,mist\xE9rio,aspira\xE7\xE3o"],
  ["Chivo", "g", "sans-grot", 0.52, 0.12, 0.5, "both", "300;400;700;900", null, "energia,confian\xE7a"],
  ["Karla", "g", "sans-grot", 0.52, 0.1, 0.49, "both", "300;400;500;600;700;800", null, "informal,alegria"],
  ["Ranade", "f", "sans-grot", 0.52, 0.12, 0.49, "both", "300;400;500;700", null, "informal,t\xE9cnico"],
  ["Oswald", "g", "sans-grot", 0.55, 0.1, 0.31, "display", "300;400;500;600;700", null, "energia,autoridade,urg\xEAncia"],
  ["Archivo Narrow", "g", "sans-neo", 0.53, 0.12, 0.33, "display", "400;500;600;700", "archivo", "energia,urg\xEAncia"],
  ["Anton", "g", "display", 0.56, 0.1, 0.33, "display", "400", null, "energia,urg\xEAncia,autoridade"],
  ["Archivo Black", "g", "display", 0.54, 0.12, 0.6, "display", "400", null, "autoridade,energia"],
  ["Poppins", "g", "sans-geo", 0.52, 0.05, 0.52, "both", "300;400;500;600;700;800", null, "alegria,informal,otimismo"],
  ["Montserrat", "g", "sans-geo", 0.53, 0.08, 0.53, "both", "300;400;500;600;700;800", null, "confian\xE7a,alegria"],
  ["Jost", "g", "sans-geo", 0.48, 0.08, 0.48, "both", "300;400;500;600;700", null, "rigor,elegante,repouso"],
  ["Outfit", "g", "sans-geo", 0.52, 0.05, 0.5, "both", "300;400;500;600;700;800", null, "alegria,otimismo"],
  ["Lexend", "g", "sans-geo", 0.55, 0.08, 0.51, "body", "300;400;500;600;700", null, "cuidado,repouso,alegria"],
  ["Sora", "g", "sans-geo", 0.52, 0.1, 0.5, "display", "300;400;500;600;700;800", null, "mist\xE9rio,t\xE9cnico,aspira\xE7\xE3o"],
  ["Questrial", "g", "sans-geo", 0.5, 0.05, 0.5, "display", "400", null, "repouso,elegante"],
  ["Urbanist", "g", "sans-geo", 0.52, 0.05, 0.49, "both", "300;400;500;600;700;800", null, "alegria,otimismo"],
  ["Satoshi", "f", "sans-geo", 0.53, 0.07, 0.5, "both", "300;400;500;700;900", null, "confian\xE7a,rigor,alegria"],
  ["General Sans", "f", "sans-geo", 0.53, 0.07, 0.5, "both", "300;400;500;600;700", null, "confian\xE7a,repouso"],
  ["Chillax", "f", "sans-geo", 0.52, 0.05, 0.51, "display", "300;400;500;600", null, "informal,alegria,cuidado"],
  ["Open Sans", "g", "sans-hum", 0.54, 0.15, 0.5, "body", "300;400;500;600;700;800", null, "confian\xE7a,repouso"],
  ["Source Sans 3", "g", "sans-hum", 0.52, 0.15, 0.49, "both", "300;400;500;600;700", "source", "institucional,confian\xE7a"],
  ["Lato", "g", "sans-hum", 0.5, 0.12, 0.49, "both", "300;400;700;900", null, "calor,confian\xE7a"],
  ["PT Sans", "g", "sans-hum", 0.52, 0.15, 0.49, "body", "400;700", "pt", "institucional,repouso"],
  ["Nunito Sans", "g", "sans-hum", 0.53, 0.1, 0.5, "both", "300;400;600;700;800", null, "cuidado,alegria"],
  ["Rubik", "g", "sans-hum", 0.53, 0.08, 0.51, "both", "300;400;500;600;700;800", null, "alegria,informal"],
  ["Work Sans", "g", "sans-hum", 0.52, 0.1, 0.5, "both", "300;400;500;600;700;800", null, "confian\xE7a,rigor"],
  ["Mulish", "g", "sans-hum", 0.52, 0.08, 0.49, "body", "300;400;500;600;700;800", null, "repouso,cuidado"],
  ["Figtree", "g", "sans-hum", 0.53, 0.08, 0.5, "both", "300;400;500;600;700;800", null, "alegria,otimismo"],
  ["Cabin", "g", "sans-hum", 0.52, 0.12, 0.49, "body", "400;500;600;700", null, "cuidado,calor"],
  ["Asap", "g", "sans-hum", 0.53, 0.1, 0.5, "both", "400;500;600;700", null, "informal,alegria"],
  ["IBM Plex Sans", "g", "sans-hum", 0.52, 0.12, 0.5, "both", "300;400;500;600;700", "plex", "t\xE9cnico,rigor,confian\xE7a"],
  ["Alegreya Sans", "g", "sans-hum", 0.5, 0.15, 0.48, "both", "300;400;500;700;800", "alegreya", "calor,editorial"],
  ["Fira Sans", "g", "sans-hum", 0.53, 0.12, 0.5, "both", "300;400;500;600;700", "fira", "t\xE9cnico,confian\xE7a"],
  ["Syne", "g", "display", 0.52, 0.2, 0.52, "display", "400;500;600;700;800", null, "aspira\xE7\xE3o,mist\xE9rio,energia"],
  ["Unbounded", "g", "display", 0.55, 0.15, 0.53, "display", "300;400;500;600;700;800", null, "energia,abund\xE2ncia"],
  ["Bricolage Grotesque", "g", "display", 0.55, 0.2, 0.5, "display", "300;400;500;600;700;800", null, "informal,editorial,energia"],
  ["Clash Display", "f", "display", 0.53, 0.15, 0.5, "display", "400;500;600;700", null, "energia,autoridade,aspira\xE7\xE3o"],
  ["Cabinet Grotesk", "f", "display", 0.53, 0.15, 0.5, "display", "300;400;500;700;800", null, "editorial,autoridade"],
  ["Panchang", "f", "display", 0.52, 0.2, 0.52, "display", "300;400;500;600;700", null, "abund\xE2ncia,informal,energia"],
  ["JetBrains Mono", "g", "mono", 0.55, 0.1, 0.5, "mono", "300;400;500;700", null, "t\xE9cnico,rigor"],
  ["IBM Plex Mono", "g", "mono", 0.52, 0.1, 0.5, "mono", "300;400;500;600;700", "plex", "t\xE9cnico,rigor"],
  ["Space Mono", "g", "mono", 0.53, 0.12, 0.5, "mono", "400;700", null, "mist\xE9rio,t\xE9cnico"],
  ["Roboto Mono", "g", "mono", 0.53, 0.1, 0.5, "mono", "300;400;500;700", "roboto", "t\xE9cnico,institucional"],
  ["Fira Code", "g", "mono", 0.53, 0.1, 0.5, "mono", "300;400;500;600;700", "fira", "t\xE9cnico"],
  ["DM Mono", "g", "mono", 0.52, 0.1, 0.5, "mono", "300;400;500", null, "t\xE9cnico,repouso"],
  ["Source Code Pro", "g", "mono", 0.52, 0.1, 0.49, "mono", "300;400;500;600;700", "source", "t\xE9cnico,rigor"],
  ["Bagnard", "v", "serif-old", 0.46, 0.5, 0.5, "both", "400", null, "editorial,cerim\xF4nia,mist\xE9rio"],
  ["Bagnard Sans", "v", "sans-hum", 0.5, 0.2, 0.5, "both", "400", null, "editorial,rigor,t\xE9cnico"],
  ["Bluu Next", "v", "serif-mod", 0.5, 0.62, 0.52, "display", "700", null, "elegante,cerim\xF4nia,desejo"],
  ["Karmilla", "v", "sans-grot", 0.52, 0.15, 0.5, "both", "400;700", null, "informal,confian\xE7a,t\xE9cnico"],
  ["Geist Sans", "s", "sans-neo", 0.53, 0.1, 0.5, "both", "100;200;300;400;500;600;700;800;900", null, "t\xE9cnico,rigor,institucional"],
  ["Apfel Grotezk", "s", "sans-grot", 0.54, 0.12, 0.52, "both", "400;700", null, "editorial,informal,energia"],
  ["Uncut Sans", "s", "sans-neo", 0.52, 0.1, 0.5, "both", "300;400;500;600;700", null, "rigor,institucional,t\xE9cnico"],
  ["Open Runde", "s", "sans-geo", 0.52, 0.08, 0.52, "both", "400;500;600;700", null, "alegria,informal,cuidado"],
  ["Hauora Sans", "s", "sans-hum", 0.52, 0.12, 0.5, "both", "200;300;400;500;600;700;800", null, "confian\xE7a,cuidado,repouso"],
  ["Nebula Sans", "s", "sans-neo", 0.53, 0.1, 0.5, "both", "300;400;500;600;700;900", null, "t\xE9cnico,rigor,energia"],
  ["Redaction", "s", "serif-trans", 0.48, 0.5, 0.5, "both", "400;700", null, "editorial,autoridade,mist\xE9rio"],
  ["Metropolis", "s", "sans-geo", 0.5, 0.1, 0.5, "both", "100;200;300;400;500;600;700;800;900", null, "aspira\xE7\xE3o,energia,institucional"],
  ["Clear Sans", "s", "sans-hum", 0.53, 0.12, 0.5, "body", "100;300;400;500;700", null, "t\xE9cnico,rigor,cuidado"],
  ["Cooper Hewitt", "s", "sans-geo", 0.5, 0.1, 0.48, "both", "100;200;300;400;500;600;700;800", null, "institucional,editorial,rigor"],
  ["iA Writer Quattro", "s", "sans-hum", 0.53, 0.1, 0.5, "body", "400;700", null, "editorial,repouso,t\xE9cnico"],
  ["Argentum Sans", "s", "sans-hum", 0.52, 0.12, 0.5, "both", "100;200;300;400;500;600;700;800;900", null, "confian\xE7a,cuidado,institucional"],
  ["Aileron", "s", "sans-neo", 0.52, 0.1, 0.5, "both", "100;300;400;600;700;800", null, "institucional,rigor,confian\xE7a"],
  ["Pretendard", "s", "sans-neo", 0.53, 0.1, 0.5, "both", "100;200;300;400;500;600;700;800;900", null, "t\xE9cnico,institucional,rigor"],
  ["Libre Caslon Condensed", "s", "serif-trans", 0.47, 0.55, 0.34, "display", "400;500;600;700", null, "editorial,autoridade,cerim\xF4nia"],
  ["Junction", "s", "sans-hum", 0.52, 0.15, 0.5, "both", "300;400;700", null, "cuidado,repouso,informal"],
  ["Ostrich Sans", "s", "sans-geo", 0.48, 0.05, 0.3, "display", "300;400;700;900", null, "energia,urg\xEAncia,aspira\xE7\xE3o"],
  ["Chunk Five", "s", "serif-slab", 0.5, 0.1, 0.52, "display", "800", null, "autoridade,energia,abund\xE2ncia"],
  ["Norwester", "s", "sans-geo", 0.52, 0.05, 0.5, "display", "400", null, "autoridade,energia,informal"],
  ["OpenDyslexic", "s", "sans-hum", 0.55, 0.12, 0.54, "body", "400;700", null, "cuidado,informal"],
  ["Commit Mono", "s", "mono", 0.52, 0.08, 0.5, "mono", "200;300;400;500;600;700", null, "t\xE9cnico,rigor"],
  ["Maple Mono", "s", "mono", 0.52, 0.08, 0.5, "mono", "100;200;300;400;500;600;700;800", null, "t\xE9cnico,informal"],
  ["Monaspace Neon", "s", "mono", 0.52, 0.08, 0.5, "mono", "200;300;400;500;600;700;800", null, "t\xE9cnico,rigor"],
  ["League Mono", "s", "mono", 0.5, 0.1, 0.5, "mono", "100;200;300;400;500;600;700;800", null, "t\xE9cnico,editorial"]
];
var legacyPool = false;
var pool = () => legacyPool ? FONTS.filter((f) => f.src === "google" || f.src === "fontshare") : FONTS;
var FONTS = FRAW.map((t2) => ({
  n: t2[0],
  src: BANK_CODE[t2[1]],
  cls: t2[2],
  x: t2[3],
  ct: t2[4],
  w: t2[5],
  role: t2[6],
  wts: t2[7],
  sf: t2[8],
  moods: t2[9].split(",")
}));
var BANK_NAME = { google: "Google Fonts", fontshare: "Fontshare", fontsource: "Fontsource", velvetyne: "Velvetyne" };
var bankName = (f) => BANK_NAME[f.src];
var FS_ID = { "iA Writer Quattro": "ia-writer-quattro", "Geist Sans": "geist-sans" };
var fontsourceId = (f) => FS_ID[f.n] || f.n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function bankPage(f) {
  if (f.src === "google") return `https://fonts.google.com/specimen/${f.n.replace(/ /g, "+")}`;
  if (f.src === "fontshare") return `https://www.fontshare.com/fonts/${fontsourceId(f)}`;
  if (f.src === "velvetyne") return `https://velvetyne.fr/fonts/${fontsourceId(f).replace(/-sans$/, "")}/`;
  return `https://fontsource.org/fonts/${fontsourceId(f)}`;
}
var USES = [
  { v: "none", n: "Nenhum \u2014 sem prefer\xEAncia" },
  { v: "editorial", n: "Editorial e texto longo" },
  { v: "ui", n: "Interface e produto digital" },
  { v: "display", n: "Cartaz, capa e t\xEDtulo grande" },
  { v: "apres", n: "Apresenta\xE7\xE3o e slide" },
  { v: "doc", n: "Documento e relat\xF3rio" },
  { v: "site", n: "Site institucional" }
];
var STRATS = [
  { v: "none", n: "Nenhuma \u2014 s\xF3 respeitar os filtros" },
  { v: "contraste", n: "Contraste de estrutura" },
  { v: "super", n: "Superfam\xEDlia" },
  { v: "uma", n: "Uma s\xF3 fam\xEDlia" },
  { v: "metrica", n: "Compatibilidade m\xE9trica" },
  { v: "oposto", n: "Oposi\xE7\xE3o m\xE1xima" }
];
var WIDTHS = [{ v: "none", n: "Nenhuma" }, { v: "cond", n: "Condensada" }, { v: "norm", n: "Normal" }, { v: "ext", n: "Larga" }];
var CONTRS = [{ v: "none", n: "Nenhum" }, { v: "low", n: "Baixo \u2014 mec\xE2nico" }, { v: "med", n: "M\xE9dio" }, { v: "high", n: "Alto \u2014 didona" }];
var BANKS = [
  ["Google Fonts", "O maior banco aberto, com API de entrega e download direto. Licen\xE7as SIL OFL e Apache na maioria.", "woff2 pela API, ttf no download"],
  ["Fontshare", "Banco da Indian Type Foundry com fam\xEDlias contempor\xE2neas gratuitas para uso comercial.", "woff2 e woff pela API, otf e ttf no download"],
  ["Fontsource", "Empacota fam\xEDlias do Google e de fundi\xE7\xF5es independentes (Vercel, Collletttivo, The League, Cooper Hewitt) para npm e CDN, com subconjuntos por escrita. Licen\xE7as OFL, Apache e dom\xEDnio p\xFAblico.", "woff2 e woff por peso e subconjunto, pela CDN do jsDelivr"],
  ["Bunny Fonts", "Espelho do Google sem rastreamento, com a mesma sintaxe de URL.", "woff2"],
  ["Velvetyne", "Fundi\xE7\xE3o livre francesa, de desenhos experimentais e licen\xE7a SIL OFL. As fam\xEDlias servidas aqui v\xEAm pela CDN do Fontsource; o site da fundi\xE7\xE3o entrega os arquivos completos.", "otf e ttf no site; woff2 pela CDN"],
  ["The League of Moveable Type", "Projeto veterano de fontes abertas, poucas fam\xEDlias e muito cuidadas.", "otf, ttf e woff"],
  ["Uncut", "Curadoria de fam\xEDlias gratuitas contempor\xE2neas de v\xE1rias fundi\xE7\xF5es.", "varia por fam\xEDlia"],
  ["Open Foundry", "Curadoria com ficha t\xE9cnica e ensaio sobre cada fam\xEDlia aberta.", "otf e woff"]
];
var ROLES = [
  { k: "rotulo", n: "R\xF3tulo", step: -1, wt: "mid", lh: 1.4, tr: 0.05, it: false, cs: "none", slot: "aux" },
  { k: "titulo", n: "T\xEDtulo", step: 4, wt: "max", lh: 1, tr: -0.02, it: false, cs: "none", slot: "disp" },
  { k: "subtitulo", n: "Subt\xEDtulo", step: 2, wt: "mid", lh: 1.18, tr: -0.01, it: false, cs: "none", slot: "disp" },
  { k: "paragrafo", n: "Par\xE1grafo", step: 0, wt: "reg", lh: 1.6, tr: 0, it: false, cs: "none", slot: "body" },
  { k: "destaque", n: "Destaque", step: 1, wt: "bold", lh: 1.38, tr: 0, it: false, cs: "none", slot: "accent" },
  { k: "citacao", n: "Cita\xE7\xE3o", step: 2, wt: "reg", lh: 1.3, tr: -0.01, it: true, cs: "none", slot: "quote" },
  { k: "referencia", n: "Refer\xEAncia", step: -1, wt: "reg", lh: 1.5, tr: 0.01, it: false, cs: "none", slot: "aux" },
  { k: "botao", n: "Bot\xE3o", step: 0, wt: "mid", lh: 1, tr: 0.01, it: false, cs: "none", slot: "accent" }
];
var CASES = [{ v: "none", n: "Nenhuma \u2014 como est\xE1" }, { v: "upper", n: "Mai\xFAsculas" }, { v: "lower", n: "Min\xFAsculas" }, { v: "cap", n: "Iniciais mai\xFAsculas" }];

// src/data/lexicon.ts
var PIECES = [
  { v: "none", n: "Nenhum \u2014 sem definir", mock: "editorial" },
  { v: "site", n: "Site ou p\xE1gina", mock: "ui" },
  { v: "app", n: "Aplicativo ou produto digital", mock: "ui" },
  { v: "identidade", n: "Identidade visual", mock: "ident" },
  { v: "cartaz", n: "Cartaz ou capa", mock: "poster" },
  { v: "apres", n: "Apresenta\xE7\xE3o ou slide", mock: "slide" },
  { v: "relatorio", n: "Relat\xF3rio ou documento", mock: "editorial" },
  { v: "ebook", n: "Livro, e-book ou revista", mock: "editorial" },
  { v: "news", n: "Newsletter ou e-mail", mock: "editorial" },
  { v: "embalagem", n: "Embalagem ou r\xF3tulo", mock: "pack" },
  { v: "painel", n: "Painel de dados", mock: "ui" },
  { v: "social", n: "Pe\xE7a para redes", mock: "poster" },
  { v: "sinal", n: "Sinaliza\xE7\xE3o ou ambiente", mock: "poster" }
];
var SUPS = [
  { v: "none", n: "Nenhum \u2014 sem definir" },
  { v: "tela", n: "Tela" },
  { v: "impresso", n: "Impresso" },
  { v: "ambos", n: "Tela e impresso" },
  { v: "ambiente", n: "Ambiente e grande formato" }
];
var LEX = [
  { w: ["s\xE9rio", "seria", "sobrio", "s\xF3brio", "formal", "institucional", "corporativo", "banco", "governo"], emo: "Autoridade", lens: "Landor", dpos: -0.22, dc: -0.18 },
  { w: ["confian\xE7a", "confiavel", "confi\xE1vel", "seguro", "solidez", "est\xE1vel"], emo: "Confian\xE7a", dpos: -0.15 },
  { w: ["alegre", "alegria", "leve", "divertido", "otimista", "colorido", "festa"], emo: "Alegria", dc: 0.2, dpos: 0.1 },
  { w: ["urgente", "urg\xEAncia", "promo\xE7\xE3o", "liquida\xE7\xE3o", "agora", "r\xE1pido", "a\xE7\xE3o"], emo: "Energia", mus: "Punk", dc: 0.25, dpos: 0.2 },
  { w: ["luxo", "sofisticado", "premium", "exclusivo", "elegante", "alta joalheria", "requinte"], emo: "Cerim\xF4nia", mkt: "Luxo", lens: "Pearlfisher", dc: -0.2 },
  { w: ["calor", "quente", "acolhedor", "afetivo", "humano", "pr\xF3ximo", "proximo", "carinho"], emo: "Intimidade", dc: 0.1 },
  { w: ["calma", "calmo", "sereno", "tranquilo", "descanso", "pausa", "sil\xEAncio", "silencio"], emo: "Repouso", mus: "Ambient", dc: -0.3 },
  { w: ["natureza", "floresta", "regenera\xE7\xE3o", "regenerativo", "clima", "sustent\xE1vel", "sustentavel", "ambiental"], emo: "Cuidado", mkt: "Clima" },
  { w: ["caf\xE9", "cafe", "cacau", "agro", "agricultura", "fazenda", "cooperativa", "ro\xE7a"], mkt: "Bioeconomia", emo: "Abund\xE2ncia" },
  { w: ["amaz\xF4nia", "amazonia", "ind\xEDgena", "indigena", "floresta em p\xE9", "ribeirinho", "kayap\xF3", "urucum", "jenipapo"], cult: "Amaz\xF4nia", mkt: "Bioeconomia" },
  { w: ["maori", "m\u0101ori", "aotearoa", "nova zel\xE2ndia", "nova zelandia", "iwi", "tangata"], cult: "Aotearoa" },
  { w: ["jap\xE3o", "japao", "japon\xEAs", "japones", "zen", "wabi", "minimalista japon\xEAs", "quioto", "kyoto", "t\xF3quio", "toquio"], cult: "Jap\xE3o", dc: -0.25 },
  { w: ["m\xE9xico", "mexico", "barrag\xE1n", "barragan", "latino"], cult: "M\xE9xico", dc: 0.2 },
  { w: ["\xEDndia", "india", "indiano", "sari", "holi"], cult: "\xCDndia", dc: 0.2 },
  { w: ["\xE1frica", "africa", "africano", "kente", "adire", "afrobeat"], cult: "\xC1frica", mus: "Afrobeats", dc: 0.18 },
  { w: ["andes", "andino", "peru", "bol\xEDvia", "bolivia", "qu\xE9chua", "quechua"], cult: "Andes" },
  { w: ["mediterr\xE2neo", "mediterraneo", "gr\xE9cia", "grecia", "ibiza", "cal"], cult: "Mediterr\xE2neo" },
  { w: ["n\xF3rdico", "nordico", "escandinavo", "su\xE9cia", "suecia", "dinamarca", "noruega"], cult: "N\xF3rdico", dc: -0.3 },
  { w: ["bauhaus", "modernista", "su\xED\xE7o", "suico", "grid", "grade"], cult: "Bauhaus", lens: "Mucho" },
  { w: ["tecnologia", "software", "saas", "startup", "plataforma", "digital", "api"], mkt: "Tecnologia", lens: "Koto" },
  { w: ["sa\xFAde", "saude", "cl\xEDnica", "clinica", "hospital", "paciente", "m\xE9dico", "medico"], mkt: "Sa\xFAde", emo: "Cuidado", dc: -0.15 },
  { w: ["educa\xE7\xE3o", "educacao", "escola", "curso", "aprender", "ensino", "universidade"], mkt: "Educa\xE7\xE3o", emo: "Alegria" },
  { w: ["viagem", "turismo", "roteiro", "expedi\xE7\xE3o", "expedicao", "retiro", "hospedagem"], mkt: "Turismo" },
  { w: ["comida", "alimento", "restaurante", "bebida", "gastronomia", "chef", "card\xE1pio", "cardapio"], mkt: "Alimentos", emo: "Desejo", dc: 0.2 },
  { w: ["moda", "roupa", "cole\xE7\xE3o", "colecao", "desfile", "vestu\xE1rio", "vestuario"], mkt: "Moda", lens: "PORTO ROCHA" },
  { w: ["arte", "museu", "galeria", "exposi\xE7\xE3o", "exposicao", "curadoria", "editorial"], mkt: "Arte", lens: "Experimental Jetset" },
  { w: ["finan\xE7as", "financas", "investidor", "fundo", "capital", "banco", "cr\xE9dito", "credito"], mkt: "Finan\xE7as", emo: "Confian\xE7a" },
  { w: ["ong", "social", "comunidade", "impacto", "doa\xE7\xE3o", "doacao", "volunt\xE1rio", "voluntario"], mkt: "Setor p\xFAblico", emo: "Cuidado" },
  { w: ["ousado", "ousada", "radical", "provocativo", "disruptivo", "barulhento", "forte"], lens: "Ragged Edge", dpos: 0.3, dc: 0.25 },
  { w: ["discreto", "contido", "sutil", "silencioso", "minimalista", "limpo", "s\xF3brio visual"], lens: "Pentagram", dc: -0.25, dpos: -0.15 },
  { w: ["m\xE1ximo", "maximo", "exuberante", "farto", "abundante", "festivo", "vibrante"], lens: "COLLINS", dc: 0.3 },
  { w: ["noturno", "escuro", "noite", "fundo preto", "dark"], lens: "Studio Dumbar" },
  { w: ["movimento", "anima\xE7\xE3o", "animacao", "v\xEDdeo", "video", "motion"], lens: "DixonBaxi" },
  { w: ["g\xF4ndola", "gondola", "prateleira", "supermercado", "varejo", "embalagem"], lens: "Jones Knowles", mkt: "Varejo", dc: 0.25 },
  { w: ["melancolia", "saudade", "nostalgia", "mem\xF3ria", "memoria", "luto"], emo: "Melancolia", mus: "Fado", dc: -0.25 },
  { w: ["mist\xE9rio", "misterio", "oculto", "ritual", "espiritual", "sagrado", "inicia\xE7\xE3o"], emo: "Mist\xE9rio", dc: -0.1 },
  { w: ["t\xE9cnico", "tecnico", "dado", "dados", "pesquisa", "cient\xEDfico", "cientifico", "engenharia"], emo: "Rigor", mus: "Techno", dc: -0.2 },
  { w: ["brasil", "brasileiro", "samba", "carnaval", "tropical"], mus: "Samba", dc: 0.22 },
  { w: ["bossa", "jazz", "suave", "sofistica\xE7\xE3o sonora"], mus: "Bossa" },
  { w: ["jovem", "juventude", "adolescente", "gen z", "tiktok"], dpos: 0.25, dc: 0.2 },
  { w: ["infantil", "crian\xE7a", "crianca", "brinquedo", "l\xFAdico", "ludico"], emo: "Alegria", dc: 0.3 },
  { w: ["idoso", "longevidade", "s\xEAnior", "senior", "envelhecer"], mkt: "Bem-estar", dc: -0.1 },
  { w: ["nostalgia", "ternura", "inf\xE2ncia", "infancia", "av\xF3", "avo", "mem\xF3ria afetiva"], emo: "Nostalgia" },
  { w: ["coragem", "ousadia", "afirma\xE7\xE3o", "afirmacao", "determina\xE7\xE3o", "determinacao"], emo: "Coragem" },
  { w: ["rever\xEAncia", "reverencia", "sagrado", "templo", "liturgia", "devo\xE7\xE3o", "devocao"], emo: "Rever\xEAncia" },
  { w: ["espanto", "maravilha", "assombro", "cosmos", "universo", "estrelas"], emo: "Espanto" },
  { w: ["contempla\xE7\xE3o", "contemplacao", "medita\xE7\xE3o", "meditacao", "retiro", "mindfulness"], emo: "Sil\xEAncio", mus: "Ambient" },
  { w: ["esperan\xE7a", "esperanca", "recome\xE7o", "recomeco", "renascer", "primavera"], emo: "Esperan\xE7a" },
  { w: ["despedida", "funeral", "memorial", "perda", "homenagem p\xF3stuma"], emo: "Luto", mus: "Canto" },
  { w: ["sensual", "er\xF3tico", "erotico", "pele", "lingerie", "perfume", "sedu\xE7\xE3o", "seducao"], emo: "Erotismo" },
  { w: ["liberdade", "vastid\xE3o", "vastidao", "horizonte", "viagem", "estrada", "mar aberto"], emo: "Liberdade" },
  { w: ["humor", "ir\xF4nico", "ironico", "piada", "s\xE1tira", "satira", "sarcasmo"], emo: "Humor" },
  { w: ["raiz", "ra\xEDzes", "raizes", "pertencimento", "terra", "ancestral", "territ\xF3rio", "territorio"], emo: "Raiz" },
  { w: ["\xEAxtase", "extase", "vertigem", "rave", "clube", "noite"], emo: "Vertigem", mus: "Techno" },
  { w: ["sabedoria", "maturidade", "tradi\xE7\xE3o", "tradicao", "centen\xE1rio", "centenario", "heran\xE7a"], emo: "Sabedoria" },
  { w: ["al\xEDvio", "alivio", "leveza", "respirar", "bem-estar", "spa"], emo: "Al\xEDvio" },
  { w: ["marrocos", "marroquino", "marrakech", "zellige", "riad"], cult: "Marrocos" },
  { w: ["coreia", "coreano", "seul", "hanbok", "obangsaek"], cult: "Coreia", mus: "K-pop" },
  { w: ["china", "chin\xEAs", "chines", "jade", "ano novo lunar", "pequim"], cult: "China" },
  { w: ["mali", "bogolan", "sahel", "bamako"], cult: "Mali" },
  { w: ["portugal", "portugu\xEAs", "portugues", "azulejo", "lisboa", "porto"], cult: "Portugal", mus: "Fado" },
  { w: ["egito", "eg\xEDpcio", "egipcio", "fara\xF3", "farao", "nilo"], cult: "Egito" },
  { w: ["p\xE9rsia", "persia", "persa", "ir\xE3", "ira", "miniatura", "tapete persa"], cult: "P\xE9rsia" },
  { w: ["guatemala", "maia", "maya", "huipil", "tear de cintura"], cult: "Guatemala" },
  { w: ["java", "indon\xE9sia", "indonesia", "batik", "bali"], cult: "Java", mus: "Gamelan" },
  { w: ["esc\xF3cia", "escocia", "escoc\xEAs", "escoces", "tartan", "xadrez escoc\xEAs"], cult: "Esc\xF3cia" },
  { w: ["turquia", "turco", "otomano", "istambul", "iznik", "\u0130znik"], cult: "Turquia" },
  { w: ["austr\xE1lia", "australia", "abor\xEDgene", "aborigene", "deserto vermelho", "outback"], cult: "Austr\xE1lia" },
  { w: ["sert\xE3o", "sertao", "cerrado", "caatinga", "nordeste", "jequitinhonha"], cult: "Brasil", mus: "Forr\xF3" },
  { w: ["flamenco", "andaluzia", "andaluz", "sevilha"], mus: "Flamenco" },
  { w: ["tango", "buenos aires", "milonga"], mus: "Tango" },
  { w: ["hip-hop", "hip hop", "rap", "boom bap", "streetwear"], mus: "Hip-hop" },
  { w: ["raga", "sitar", "tabla", "m\xFAsica indiana"], mus: "Raga", cult: "\xCDndia" },
  { w: ["taiko", "tambor japon\xEAs", "dojo"], mus: "Taiko", cult: "Jap\xE3o" },
  { w: ["cumbia", "col\xF4mbia", "colombia", "caribe"], mus: "Cumbia" },
  { w: ["minimalismo", "minimalista", "repeti\xE7\xE3o", "repeticao", "glass", "reich"], mus: "Minimalismo" },
  { w: ["gregoriano", "mosteiro", "mon\xE1stico", "monastico", "coral sacro"], mus: "Canto" },
  { w: ["blues", "delta", "mississippi"], mus: "Blues" },
  { w: ["k-pop", "kpop", "idol"], mus: "K-pop" },
  { w: ["andina", "andino", "charango", "siku", "quena"], mus: "M\xFAsica andina", cult: "Andes" },
  { w: ["highlife", "soukous", "congo", "gana", "ghana"], mus: "Highlife" }
];
var ANGLES = [
  {
    k: "convencao",
    n: "A leitura direta",
    dpos: -0.28,
    lens: ["Pentagram \u2014 Londres e Nova York", "Landor \u2014 rede global", "Interbrand e Siegel+Gale \u2014 rede global", "Mucho \u2014 Barcelona e S\xE3o Francisco"],
    sch: ["Goethe \u2014 caracter\xEDstica", "An\xE1logo", "Monocrom\xE1tico"],
    strat: "contraste",
    why: "Fica dentro do que o campo j\xE1 reconhece e gasta a diferen\xE7a em precis\xE3o, n\xE3o em volume. \xC9 a proposta que n\xE3o precisa ser defendida numa reuni\xE3o."
  },
  {
    k: "ruptura",
    n: "A leitura de contraste",
    dpos: 0.34,
    lens: ["Wolff Olins \u2014 Londres e Nova York", "Ragged Edge \u2014 Londres", "Jones Knowles Ritchie \u2014 Londres e Nova York", "&Walsh \u2014 Nova York"],
    sch: ["Complementar", "Goethe \u2014 harm\xF4nica", "Tr\xEDade"],
    strat: "oposto",
    why: "Vai contra a conven\xE7\xE3o de prop\xF3sito: o objetivo \xE9 ser percebido como diferente antes de ser compreendido. Custa mais para sustentar e rende mais quando sustentada."
  },
  {
    k: "lateral",
    n: "A leitura lateral",
    dpos: 0.05,
    lens: ["COLLINS \u2014 Nova York e S\xE3o Francisco", "Experimental Jetset \u2014 Amsterd\xE3", "PORTO ROCHA \u2014 Nova York e Londres", "Studio Dumbar \u2014 Roterd\xE3", "Pearlfisher \u2014 Londres e Nova York"],
    sch: ["Complementar dividido", "Tetr\xE1dico", "Quadrado", "Goethe \u2014 sem car\xE1ter"],
    strat: "super",
    why: "Entra por um caminho que ningu\xE9m pediu: troca o eixo do problema, seja pela refer\xEAncia cultural, pela din\xE2mica ou pela quantidade de cor. \xC9 a que costuma abrir a conversa."
  }
];

// src/data/trends.ts
var TREND = [
  {
    id: "2026 \xB7 T3",
    per: "Julho a setembro de 2026",
    tese: "O ciclo se parte em dois. De um lado, a cor volta a ser evento depois de um ano de branco estrutural; de outro, a tipografia e a identidade recusam a neutralidade que a produ\xE7\xE3o automatizada tornou barata.",
    cor: {
      tese: "Azul de cobalto como \xE2ncora, calor terroso como contrapeso",
      pal: [
        { n: "Luminous Blue", hex: "#2340C8", obs: "Cor do Ano 2027 de WGSN e Coloro, c\xF3digo Coloro 125-28-38" },
        { n: "Energy Orange", hex: "#F2600C", obs: "Cor-chave S/S 27, c\xF3digo Coloro 018-57-34" },
        { n: "Pop Pink", hex: "#F25BA0", obs: "Cor-chave S/S 27, c\xF3digo Coloro 151-73-22" },
        { n: "Meadowland Green", hex: "#6F8F4A", obs: "Cor-chave S/S 27, c\xF3digo Coloro 050-61-19" },
        { n: "Clay", hex: "#B6795A", obs: "Cor-chave S/S 27, c\xF3digo Coloro 014-60-13" }
      ],
      corpo: [
        "WGSN e Coloro nomearam Luminous Blue como Cor do Ano de 2027 e descreveram o tema que governa a escolha das cinco cores-chave de primavera e ver\xE3o de 2027: interconex\xE3o entre polaridades \u2014 claro e escuro, natureza e tecnologia, antigo e contempor\xE2neo, racionalidade e espiritualidade.",
        "As tr\xEAs primeiras cores-chave s\xE3o declaradamente animadas, pensadas para sustentar as pessoas diante da press\xE3o; as duas \xFAltimas, Meadowland Green e Clay, v\xEAm da busca por prop\xF3sito e por v\xEDnculo com comunidade e natureza. \xC9 a mesma tens\xE3o que Goethe descreve entre o lado ativo e o lado passivo do c\xEDrculo, com o purp\xFAreo ausente e o azul ocupando o papel de gravidade.",
        "Para o instrumento de cor, a leitura pr\xE1tica \xE9 esta: um azul frio de croma alto como prim\xE1ria, com laranja e barro entrando como contraparte caracter\xEDstica em \xE1rea pequena \u2014 n\xE3o como complementar em \xE1rea igual, que \xE9 o erro previs\xEDvel dessa combina\xE7\xE3o."
      ],
      fontes: [
        { n: "WGSN e Coloro, comunicado de 29 de abril de 2025", u: "https://www.wgsn.com/en/wgsn/press/press-releases/wgsn-and-coloro-reveal-colour-year-2027-luminous-blue-and-s-s-27-key" },
        { n: "Coloro, p\xE1gina das cores-chave", u: "https://coloro.com/key-colors" },
        { n: "WWD, cobertura de 29 de abril de 2025", u: "https://wwd.com/fashion-news/fashion-features/color-of-the-year-wgsn-coloro-single-out-luminous-blue-1237109361/" }
      ]
    },
    tipo: {
      tese: "A fonte vari\xE1vel virou infraestrutura, e a neutralidade virou defeito",
      fam: ["Inter", "Bricolage Grotesque", "Fraunces", "Instrument Serif", "JetBrains Mono"],
      corpo: [
        "O padr\xE3o de fonte vari\xE1vel, publicado pelo W3C em 2017, deixou de ser diferencial e virou expectativa: navegadores, sistemas operacionais e ferramentas de design lidam com ele sem atrito, e uma fam\xEDlia inteira chega num arquivo s\xF3, cobrindo peso, tamanho \xF3ptico, largura e eixos experimentais.",
        "O movimento est\xE9tico anda no sentido contr\xE1rio da economia de arquivo. As grotescas limpas ficaram t\xE3o onipresentes em produto que passaram a ser lidas como aus\xEAncia de escolha, e o trabalho mais interessante migrou para o que \xE9 mais macio, mais quente, mais expressivo ou simplesmente mais peculiar. A satura\xE7\xE3o de conte\xFAdo gerado automaticamente transformou tra\xE7o com marca de m\xE3o em sinal de autoria.",
        "H\xE1 tamb\xE9m um retorno do dinheiro ao tipo: depois de uma d\xE9cada de disciplina or\xE7ament\xE1ria apoiada s\xF3 em bancos abertos, est\xFAdios voltaram a encomendar e licenciar desenhos pr\xF3prios. Os bancos livres continuam excelentes \u2014 a diferen\xE7a \xE9 que deixaram de ser o \xFAnico caminho aceit\xE1vel."
      ],
      fontes: [
        { n: "Font Trends 2026, levantamento de mercado e lan\xE7amentos de fundi\xE7\xE3o", u: "https://madegooddesigns.com/font-trends-2026/" },
        { n: "Typography Trends 2026, fontes vari\xE1veis e tipo cin\xE9tico", u: "https://designflea.com/typography-trends-2026/" },
        { n: "Monotype, relat\xF3rio anual Type Trends", u: "https://www.monotype.com/type-trends" }
      ]
    },
    comb: {
      tese: "Paleta flex\xEDvel no lugar de paleta fixa",
      corpo: [
        "A recomenda\xE7\xE3o que se repete nos relat\xF3rios de identidade \xE9 abandonar a paleta congelada em favor de um tema crom\xE1tico que se desloca conforme contexto e plataforma: reconhec\xEDvel por atmosfera, n\xE3o por um conjunto exato de valores.",
        "Isso muda o que um sistema de cor precisa entregar. N\xE3o bastam cinco hex: \xE9 preciso uma regra de deslocamento \u2014 quanto o matiz pode girar, quanto o croma pode subir, qual a faixa de luminosidade que ainda pertence ao sistema. \xC9 exatamente o que um c\xEDrculo com geometria preservada resolve e uma lista de amostras n\xE3o resolve.",
        "A contrapartida \xE9 o risco de dissolu\xE7\xE3o. Sem uma \xE2ncora de valor \u2014 um escuro e um claro que n\xE3o se mexem \u2014 a identidade flex\xEDvel vira identidade indistingu\xEDvel."
      ],
      fontes: [
        { n: "The Branding Journal, tend\xEAncias de branding e design 2026", u: "https://www.thebrandingjournal.com/2026/01/top-branding-design-trends-2026/" },
        { n: "It\u2019s Nice That, tend\xEAncias gr\xE1ficas 2026", u: "https://www.itsnicethat.com/features/forward-thinking-graphic-trends-2026-graphic-design-120126" }
      ]
    },
    apl: {
      tese: "Movimento antes de forma, textura antes de acabamento",
      corpo: [
        "Identidade pensada primeiro em movimento deixou de ser especialidade de est\xFAdio de motion e virou requisito de entrega, porque a tela passou a ser o primeiro ponto de contato e n\xE3o o \xFAltimo.",
        "Junto vem uma prefer\xEAncia por superf\xEDcie: transl\xFAcido, ceroso, v\xEDtreo, com granula\xE7\xE3o e imperfei\xE7\xE3o vis\xEDveis. A leitura corrente \xE9 que isso funciona como assinatura de autoria humana num ambiente saturado de produ\xE7\xE3o autom\xE1tica.",
        "Para quem trabalha com cor, a consequ\xEAncia \xE9 t\xE9cnica: uma paleta que s\xF3 foi testada em superf\xEDcie chapada quebra quando entra em transpar\xEAncia e sobreposi\xE7\xE3o. Vale testar cada par em camada antes de fechar."
      ],
      fontes: [
        { n: "Three Rooms, oito tend\xEAncias de identidade para 2026", u: "https://www.threerooms.com/blog/8-design-trends-shaping-brand-identity-in-2026" },
        { n: "It\u2019s Nice That, tend\xEAncias gr\xE1ficas 2026", u: "https://www.itsnicethat.com/features/forward-thinking-graphic-trends-2026-graphic-design-120126" }
      ]
    }
  },
  {
    id: "2026 \xB7 T2",
    per: "Abril a junho de 2026",
    tese: "O relat\xF3rio de comportamento do trimestre desloca o eixo de novidade para estabilidade, e a consequ\xEAncia visual \xE9 uma prefer\xEAncia por continuidade leg\xEDvel em vez de ruptura anual.",
    cor: {
      tese: "Pr\xEAmio de estabilidade: cor que n\xE3o precisa ser trocada todo ano",
      pal: [
        { n: "Azul de institui\xE7\xE3o", hex: "#2F4A7A", obs: "aproxima\xE7\xE3o do azul de continuidade descrito nos relat\xF3rios" },
        { n: "Verde de campo", hex: "#5E7A4B", obs: "aproxima\xE7\xE3o" },
        { n: "Areia", hex: "#D9CDBA", obs: "aproxima\xE7\xE3o" },
        { n: "Tinta", hex: "#1B1A18", obs: "aproxima\xE7\xE3o" }
      ],
      corpo: [
        "O relat\xF3rio de tend\xEAncias de vida da Accenture para 2026 organiza o ano em cinco movimentos, e o primeiro deles \xE9 o pr\xEAmio de estabilidade: previsibilidade de pre\xE7o e de qualidade vira conforto num contexto inst\xE1vel, e rituais dom\xE9sticos viram \xE2ncora.",
        "A tradu\xE7\xE3o crom\xE1tica que aparece nos materiais de identidade \xE9 a de legado din\xE2mico \u2014 preservar o que j\xE1 \xE9 reconhecido e modernizar por dentro, em vez de recome\xE7ar. Na pr\xE1tica, isso favorece esquemas an\xE1logos e monocrom\xE1ticos sobre complementares, e croma m\xE9dio sobre croma alto."
      ],
      fontes: [{ n: "Accenture Life Trends 2026", u: "https://www.accenture.com/us-en/insights/song/accenture-life-trends" }]
    },
    tipo: {
      tese: "Tipo como ativo de continuidade",
      fam: ["Source Serif 4", "Public Sans", "IBM Plex Sans"],
      corpo: ["Quando a estrat\xE9gia \xE9 continuidade, a tipografia deixa de ser onde se busca novidade e passa a ser onde se busca durabilidade: classes transicionais e humanistas, alturas de x compat\xEDveis, fam\xEDlias com faixa de peso larga o bastante para carregar hierarquia sem trocar de desenho."],
      fontes: [{ n: "Accenture Life Trends 2026", u: "https://www.accenture.com/us-en/insights/song/accenture-life-trends" }]
    },
    comb: {
      tese: "Legado din\xE2mico em vez de recome\xE7o",
      corpo: ["A recomenda\xE7\xE3o estrat\xE9gica do trimestre \xE9 preservar o patrim\xF4nio visual acumulado e evoluir por dentro. Para um sistema de cor, isso significa desvio pequeno e deliberado em rela\xE7\xE3o ao que j\xE1 existe \u2014 a mesma disciplina que as redes de consultoria aplicam em programas multimercado."],
      fontes: [{ n: "Accenture Life Trends 2026", u: "https://www.accenture.com/us-en/insights/song/accenture-life-trends" }]
    },
    apl: {
      tese: "Ritual como ponto de contato",
      corpo: ["Se o comportamento se ancora em rotina, a aplica\xE7\xE3o que mais importa deixa de ser a campanha e passa a ser a pe\xE7a recorrente: a embalagem que reaparece, a tela que se abre todo dia, o documento que chega todo m\xEAs. S\xE3o superf\xEDcies que perdoam menos contraste ruim, porque s\xE3o vistas muitas vezes."],
      fontes: [{ n: "Accenture Life Trends 2026", u: "https://www.accenture.com/us-en/insights/song/accenture-life-trends" }]
    }
  },
  {
    id: "2026 \xB7 T1",
    per: "Janeiro a mar\xE7o de 2026",
    tese: "Pela primeira vez em vinte e sete anos o instituto de cor escolhe um branco. A consequ\xEAncia n\xE3o \xE9 aus\xEAncia de cor: \xE9 que o branco passa a ser tratado como material com papel, e n\xE3o como fundo.",
    cor: {
      tese: "O branco como cor estrutural",
      pal: [
        { n: "Cloud Dancer", hex: "#F0EEE9", obs: "Pantone 11-4201, Cor do Ano 2026 \u2014 aproxima\xE7\xE3o em sRGB" },
        { n: "Transformative Teal", hex: "#1E7F86", obs: "Cor do Ano 2026 de WGSN e Coloro \u2014 aproxima\xE7\xE3o" },
        { n: "Sombra fria", hex: "#8E9298", obs: "aproxima\xE7\xE3o das paletas de luz e sombra divulgadas" },
        { n: "Pastel empoeirado", hex: "#D8C7C0", obs: "aproxima\xE7\xE3o das paletas de past\xE9is divulgadas" }
      ],
      corpo: [
        "Em 4 de dezembro de 2025, o instituto anunciou Pantone 11-4201 Cloud Dancer como Cor do Ano de 2026, descrita como um branco a\xE9reo que funciona como s\xEDmbolo de influ\xEAncia calmante numa sociedade que redescobre o valor da reflex\xE3o silenciosa. \xC9 a primeira vez que a escolha recai sobre um branco.",
        "O argumento publicado \xE9 de estrutura, n\xE3o de moda: um branco que serve de andaime para o espectro e permite que as outras cores apare\xE7am. Sete paletas foram divulgadas junto, entre elas past\xE9is empoeirados e luz e sombra.",
        "Em paralelo, WGSN e Coloro j\xE1 haviam apontado Transformative Teal como sua Cor do Ano de 2026, por representar mudan\xE7a e estabilidade ao mesmo tempo. As duas escolhas convergem no mesmo diagn\xF3stico e divergem na resposta: uma retira, a outra media.",
        "A leitura de Goethe aqui \xE9 direta. Ele recusa tratar o branco como aus\xEAncia: luz e treva s\xE3o os dois polos sem os quais nenhuma cor existe. Uma Cor do Ano branca \xE9 a ind\xFAstria chegando, por outro caminho, \xE0 mesma posi\xE7\xE3o de 1810."
      ],
      fontes: [
        { n: "Pantone, Cor do Ano 2026", u: "https://www.pantone.com/na/en-us/color-of-the-year/2026" },
        { n: "Pantone, as sete paletas de Cloud Dancer", u: "https://www.pantone.com/na/en-us/articles/color-of-the-year/color-of-the-year-2026-color-palettes" },
        { n: "NPR, cobertura de 4 de dezembro de 2025", u: "https://www.npr.org/2025/12/04/nx-s1-5632651/pantones-color-of-the-year-2026-white" },
        { n: "Coloro, cores-chave e hist\xF3rico", u: "https://coloro.com/key-colors" }
      ]
    },
    tipo: {
      tese: "Revis\xE3o em vez de inven\xE7\xE3o",
      fam: ["EB Garamond", "Libre Caslon Text", "Newsreader"],
      corpo: ["O relat\xF3rio anual de tend\xEAncias de tipo da fundi\xE7\xE3o que mais publica sobre o assunto tratou o ciclo sob o t\xEDtulo de revis\xE3o \u2014 releitura de repert\xF3rio existente em lugar de busca por forma in\xE9dita. Em termos pr\xE1ticos: revivals cuidadosos, tipos de texto com serifa e corre\xE7\xE3o de desenhos que j\xE1 circulavam h\xE1 tempo demais sem ajuste."],
      fontes: [{ n: "Monotype, Type Trends", u: "https://www.monotype.com/type-trends" }]
    },
    comb: {
      tese: "Branco em \xE1rea dominante, cor em recorte",
      corpo: [
        "Uma paleta ancorada em branco estrutural exige inverter a propor\xE7\xE3o habitual: a superf\xEDcie clara passa de sessenta para oitenta por cento da \xE1rea, e o matiz entra como acontecimento. \xC9 o m\xE9todo que est\xFAdios de conten\xE7\xE3o j\xE1 praticam, agora com respaldo de calend\xE1rio.",
        "O risco declarado \xE9 o esvaziamento. Branco dominante sem uma treva bem escolhida e sem um acento com contraste medido produz o que o setor chamou de identidade sem identidade."
      ],
      fontes: [{ n: "Pantone, guia de aplica\xE7\xE3o de Cloud Dancer", u: "https://www.pantone.com/na/en-us/articles/color-of-the-year/how-to-use-pantone-color-of-the-year-2026-cloud-dancer-in-products" }]
    },
    apl: {
      tese: "Superf\xEDcie t\xE1til como compensa\xE7\xE3o",
      corpo: ["Quando a cor recua, a mat\xE9ria avan\xE7a: os materiais divulgados junto com a escolha do ano enfatizam textura acolchoada, l\xE3, pelo e volume arredondado. Em suporte plano, o equivalente \xE9 granula\xE7\xE3o, papel vis\xEDvel e sombra macia \u2014 a compensa\xE7\xE3o de quem tirou o matiz da equa\xE7\xE3o."],
      fontes: [{ n: "Pantone, guia de aplica\xE7\xE3o de Cloud Dancer", u: "https://www.pantone.com/na/en-us/articles/color-of-the-year/how-to-use-pantone-color-of-the-year-2026-cloud-dancer-in-products" }]
    }
  }
];
var AXES = [{ k: "cor", n: "Cor" }, { k: "tipo", n: "Tipografia" }, { k: "comb", n: "Combina\xE7\xF5es" }, { k: "apl", n: "Aplica\xE7\xF5es" }];

// src/i18n/data-en.ts
var emo = [
  ["None", "With no declared intention, the starting hue comes only from the field's convention, the cultural reference and wherever the balls sit on the ring."],
  ["Joy and clarity", "Yellow is the colour nearest to light. In its pure, clear state, says Goethe, it carries a serene, cheerful, gently exciting nature \u2014 but sully it a little and that same cheer turns to disgrace."],
  ["Warm optimism", "Intensifying yellow towards red gives it warmth without yet giving it violence. It is the region where the eye feels welcomed rather than pressed."],
  ["Energy and urgency", "Red-yellow is the active side at its greatest energy. Goethe notes that animals grow irritated before it and that sensitive people cannot bear it for long \u2014 which is exactly the point when you want to force an action."],
  ["Desire and appetite", "Here intensification already borders on the unbearable. It is the band that calls the body before it calls judgement."],
  ["Authority and gravity", "Purple is the summit of intensification: in it the two sides of the circle meet. Goethe attributes dignity and gravity to it, and notes it was no accident that it was the colour of those who govern."],
  ["Ceremony and legacy", "Purple pulled towards dark. Goethe describes it as severity and grace at once \u2014 the same colour that imposes is the one that enchants."],
  ["Aspiration and restlessness", "Red-blue is restless and aspiring. Goethe describes it as something that does not settle: it wants to keep climbing."],
  ["Mystery and transcendence", "The intensified negative side. Colour stops describing the world and starts suggesting what lies behind it."],
  ["Depth and distance", "Blue carries a principle of darkness. Goethe says it draws us in and at the same time pulls us away \u2014 like a beautiful nothing that recedes as one looks."],
  ["Trust and serenity", "Blue pushed towards green: the contradiction between excitement and repose that Goethe attributes to blue begins to resolve in favour of repose."],
  ["Melancholy and longing", "Cold, sombre blue. Goethe links this side to a feeling of absence that never quite becomes unpleasant."],
  ["Rest and balance", "In green, says Goethe, eye and soul rest. One does not wish to go further, and cannot \u2014 the one point on the circle where the search ends."],
  ["Care and regeneration", "Green with yellow inside it. The repose of green takes back a share of the activity of light, without turning into stimulus."],
  ["Rigour and precision", "Blue-green of restrained chroma. Nothing in this band asks for attention; it reads as method."],
  ["Abundance and plenty", "Yellow pulled towards green, with high chroma. The sense of excess comes less from the hue than from the saturation it can bear."],
  ["Intimacy and warmth", "Purple pulled towards red and lowered in lightness. Goethe notes that this neighbourhood has grace without losing gravity."],
  ["Nostalgia and tenderness", "A yellow already pulled towards red and lowered, the colour of late-afternoon light and aged paper. Goethe says intensified yellow brings warmth without violence; here the warmth comes with the distance of time, and so it moves rather than stirs."],
  ["Courage and assertion", "Red-yellow at its firmest band, before it turns into appetite. It is the colour Goethe describes as advancing on the viewer; used in a contained area it stops being a threat and becomes a decision."],
  ["Reverence and the sacred", "Purple at the point where blue still holds it. Goethe gives this colour dignity and gravity, and a purple glass, he says, shows the world as on the Day of Judgement. It is the colour of mantles, altars and what is not touched."],
  ["Wonder and awe", "Between blue and red-blue, where the eye neither rests nor decides. Goethe sees in blue something that recedes and attracts at once; pulled towards violet, that movement becomes luminous unease, the feeling of standing before something larger."],
  ["Silence and contemplation", "Greenish blue with almost all the chroma withdrawn. Nothing advances, nothing calls. It is the region Goethe associates with the eye at rest as green approaches blue: the colour of a still lake at dawn."],
  ["Hope and beginning again", "Green pulled towards yellow, the colour of the shoot before the leaf. Goethe says that in green the eye and the soul rest; with a little yellow, that rest gains direction and becomes promise."],
  ["Grief and farewell", "Deep blue, lowered almost to darkness. For Goethe blue carries a principle of darkness and always pulls away; here it is the distance of someone who has gone. Cultures dress mourning in black or white, but the feeling has this colour."],
  ["Eroticism and skin", "Purple pulled towards red, warmed and with high chroma. It is the band Goethe calls grace and charm together with gravity: it calls the body with elegance, without the urgency of red-yellow."],
  ["Freedom and vastness", "The blue of the high sky, clear and open. Goethe describes blue as the colour that moves away and draws us after it: it is the horizon, the sea seen from afar, everything that has no edge yet."],
  ["Humour and irony", "Slightly greenish yellow, more acid than cheerful. Goethe warns that it takes little dirt for yellow's joy to turn to disgrace; irony lives exactly on that margin, and knows it."],
  ["Roots and belonging", "Red-yellow darkened to ochre, the colour of earth, clay and bread. It is the first colour humans made, and Goethe places it on the active, warm side of the circle: here, warmed and lowered, it becomes ground."],
  ["Vertigo and ecstasy", "Magenta with chroma at the edge of the gamut. Goethe describes the meeting of the two sides in purple as the summit; pushed to the end, the summit becomes a precipice, and the eye does not know whether it rises or falls."],
  ["Wisdom and time", "Closed, unshining blue-green, the colour of old bronze and deep water. On the passive side of Goethe's circle, it is the colour that asks for nothing: it has seen enough not to need to convince."],
  ["Relief and lightness", "Light green pulled towards yellow, with much light and little chroma. It is Goethe's rest after an effort: the colour of stepping out of a closed room into the air."]
];
var mkt = [
  ["None", "none", "With no declared field, nothing pulls the hue towards ground already occupied by others \u2014 the result comes from intention and geometry, not from a contested territory."],
  ["Finance and banking", "institutional blue", "Blue dominates the sector because it promises distance and coolness \u2014 exactly what Goethe describes. That is why it stopped meaning anything: everyone uses it."],
  ["Fintech and crypto", "violet and gradient", "The category migrated wholesale to red-blue. Standing out today costs more than joining in."],
  ["Climate and regeneration", "restful green", "Green says rest, not transformation. For a field whose thesis is systemic change, the convention works against the message."],
  ["Bioeconomy and agriculture", "green with earth", "A solid, little-contested convention; the useful break is usually in chroma, not hue."],
  ["Health and care", "clinical blue", "Low-chroma blue-green. Gains credibility and loses warmth \u2014 a well-known trade."],
  ["Wellbeing and longevity", "soft green and neutrals", "A category saturated with desaturation. Beige with sage became the sector's commonplace."],
  ["Food and drink", "red-yellow", "The active side at high energy works because it acts on the body before judgement. It is also the most contested."],
  ["Luxury and jewellery", "purple and black", "The field where black is already treated as a colour, not a background. The gravity of purple is the historical choice."],
  ["Fashion", "black and the far end of the circle", "Tolerates any hue because the system is carried by black and white."],
  ["Technology and software", "blue and violet", "The convention is so thick that anything outside it already reads as a position."],
  ["Tourism and hospitality", "destination blue-green", "Sea and leaf. Works at the destination and fails on the piece, because it does not tell one place from another."],
  ["Transformational travel", "violet and earth tones", "A young category with a still-soft convention \u2014 where breaking away costs least."],
  ["Energy and infrastructure", "orange and yellow", "An inheritance of industrial safety. Yellow here is not joy: it is signage."],
  ["Education", "yellow and blue", "The characteristic yellow-and-blue pair is the sector's oldest and still works."],
  ["Media and culture", "purple and black", "A field that rewards contrast of value more than of hue."],
  ["Public sector and NGOs", "institutional blue", "A defensive convention. Breaking it here means sustaining the break for years."],
  ["Art and editorial", "black, white and one accent", "The content carries the system. Colour comes in as punctuation, not structure."],
  ["Property and architecture", "green and warm neutrals", "Low chroma by default; differentiation usually comes from the chosen black."],
  ["Retail and e-commerce", "conversion red", "Red-yellow sells because it presses. Used all the time, it stops pressing."]
];
var sch = [
  ["None \u2014 free", "The balls stay wherever you leave them. Nothing is forced to keep its distance."],
  ["Goethe \u2014 harmonious", "The opposites of the circle: the combination which, according to Goethe, carries within it the condition of totality."],
  ["Goethe \u2014 characteristic", "One space apart. It says something, though not everything."],
  ["Goethe \u2014 characterless", "Neighbours on the circle. Not displeasing, but by his account they lack character."],
  ["Monochromatic", "One hue only, varying lightness and chroma. The whole hierarchy comes from value."],
  ["Analogous", "A narrow neighbourhood. Cohesive and without tension; needs contrast of value not to go flat."],
  ["Complementary", "Crosses the circle. Maximum hue tension between two poles."],
  ["Split-complementary", "Swaps the opposite for its two neighbours. Keeps the tension and softens the clash."],
  ["Triadic", "Divides the circle in three. Lively and balanced, hard to dose by area."],
  ["Tetradic", "A rectangle on the circle: two pairs of opposites. Rich, and the hardest to balance."],
  ["Square", "Four equidistant points. A symmetrical tetrad, with the same demand for dosing."]
];
var lens = [
  ["None", "With no declared method, the palette distributes lightness and area evenly, favouring neither restraint nor volume."],
  ["Pentagram \u2014 London and New York", "They know how to be loud, but almost always choose clarity: type carries the system and colour comes in a single dose. Hence the work ages well while the rest chases the trend cycle."],
  ["Wolff Olins \u2014 London and New York", "Hired when the market needs to notice that something has really changed. Colour comes in at high volume and is treated as a property of the system, not an accent."],
  ["COLLINS \u2014 New York and San Francisco", "Chromatic maximalism: the whole system is the palette, not one colour with supports. Works when there is enough surface to show variation."],
  ["PORTO ROCHA \u2014 New York and London", "Founded by two Brazilians and an editorial reference within a few years. High value contrast, strong art direction, colour in service of the concept."],
  ["Koto \u2014 London and New York", "A clean digital system, built to scale in product. The palette comes as a tonal scale, not a set of loose colours."],
  ["Jones Knowles Ritchie \u2014 London and New York", "Shelf discipline: colour has to win at three metres and against the competitor beside it. High saturation and a hard edge."],
  ["Studio Dumbar \u2014 Rotterdam", "Identity thought in motion before it is thought still. Hard colours on a dark ground, because the system will live on screen."],
  ["Chermayeff & Geismar & Haviv \u2014 New York", "The house of the symbols that crossed decades. Flat reduction: two colours and the form resolve it, and what is left is subtracted."],
  ["Landor \u2014 global network", "Multi-market programmes with long governance and research. The deviation from what already exists is small on purpose: it protects accumulated value."],
  ["Mucho \u2014 Barcelona and San Francisco", "Restrained European modernism: visible grid, closed palette, nothing to spare. Colour used as structure, not as declared emotion."],
  ["Experimental Jetset \u2014 Amsterdam", "Black, white and one colour. Living proof that Goethe's two poles are full colours: here they do almost all the work and hue comes in as an event."],
  ["&Walsh \u2014 New York", "Expressive and saturated, with deliberately high value contrast. The palette is a character."],
  ["DixonBaxi \u2014 London", "The best choice when the system must work in motion and on screen. Dark ground by default, because that is where it will be seen."],
  ["Ragged Edge \u2014 London", "Opinionated work: colour takes sides and accepts alienating part of the audience. There is no lukewarm version."],
  ["Pearlfisher \u2014 London and New York", "The craft of packaging: desaturated colour, a sense of material, finish above impact."],
  ["Interbrand and Siegel+Gale \u2014 global network", "The discipline is to simplify: few tokens, accessibility solved at the source, a system that survives being implemented badly."]
];
var cult = [
  ["None", ""],
  ["Aotearoa \u2014 k\u014Dk\u014Dwai, pango, m\u0101", "K\u014Dk\u014Dwai is the red ochre of iron-rich clay and sandstone, burnt and ground, then mixed with shark-liver or t\u012Btoki oil. Polynesian tradition links red to kura \u2014 something precious \u2014 and what was painted red became tapu. Pango and m\u0101 are not background: they are principles, and the white came from burnt shell or clay, which is why it is warm."],
  ["Indigenous Amazon \u2014 urucum, jenipapo, tabatinga", "The red comes from urucum pulp, the dark blue and black from fermented jenipapo juice \u2014 whose Guarani name means fruit that serves for painting \u2014 and the white from tabatinga or limestone. Among the Kayap\xF3, red bears witness to social life and black is the colour of creativity; body painting signals age, children and status, and is not only ritual: it is also aesthetic pleasure."],
  ["Japan \u2014 aizome, sumi, kurenai", "Vat indigo, soot ink and a red that appears rarely and in small area. The logic is not of hue but of interval: low chroma in almost everything, so that an event of colour carries weight."],
  ["West Africa \u2014 adire indigo, kente gold", "Tie- and starch-resist indigo against gold and red woven in strips. Strong colours that coexist because structure separates them \u2014 the weave does the work a grid would do."],
  ["Andes \u2014 cochineal and indigo", "Cochineal carmine and indigo in wool. The pair lives on hue contrast at similar lightness \u2014 the opposite of what Western design usually does."],
  ["Mediterranean \u2014 lime and blue", "Lime dominates the area and blue comes in as a small cut-out. A palette of proportion, not of quantity of colours."],
  ["Nordic \u2014 low light", "High latitude, long diffuse light. Restrained chroma and a narrow lightness band: nothing shines because nothing needs to compete with strong sun."],
  ["Mexico \u2014 Barrag\xE1n", "Pink, yellow and blue across whole planes of wall. Colour is architecture: it does not decorate surface, it defines volume and shadow."],
  ["India \u2014 sindoor, saffron, indigo", "Red, saffron and indigo at high saturation and without transition. The neighbourhood of full colours is the rule, not an exception to manage."],
  ["Bauhaus \u2014 primaries and plane", "Red, yellow and blue treated as material, on white and black. The premise is Goethe inverted: colour serves form, and form is geometric."],
  ["Morocco \u2014 zellige, saffron, Majorelle blue", "Hand-cut tile in cobalt, green and white against earthen walls, and a saffron that comes from the market, not the paint tin. The intense blue of Marrakech was named after a French painter, but the glaze that precedes it is from the fourteenth century. The logic is repetition: colour gains strength by being cut into pieces and repeated without end."],
  ["Korea \u2014 obangsaek, the five colours", "Blue, red, yellow, white and black, each tied to a direction, an element and a season. They appear on the sleeve stripes of children's hanbok, on temple cords and in food. It is not a palette of harmony: it is a system of the world, and all five must be present for the set to be complete."],
  ["China \u2014 vermilion and jade", "The cinnabar red of gates and seals, and the green of jade, the stone worth more than gold. Red is luck and festival; jade is virtue and permanence. The pair lives on contrast of hue and value at once, with the black of ink as a third voice."],
  ["Mali \u2014 bogolan, fermented mud", "Cotton cloth dyed with tree bark and painted with fermented river mud, which fixes the black through iron. Ochre, black and the raw cotton, in symbols that tell village stories. The chroma is low because it comes from the earth, and the strength lies in the drawing, not the colour."],
  ["Portugal \u2014 cobalt azulejo on white", "A single blue, cobalt, over tin white, covering churches, stations and kitchens since the seventeenth century. It is a palette of one colour and much area: white does the work of light, and blue draws. Where there is a second colour it is yellow, and it enters in small area."],
  ["Ancient Egypt \u2014 Egyptian blue, ochre, gold", "The first synthetic pigment in history, a copper-calcium silicate fired four thousand years ago, beside the ochre of the walls and the gold of the masks. Colours were fixed by meaning: the blue of river and sky, the green of rebirth, the red of desert and danger. The palette is a vocabulary, not a taste."],
  ["Persia \u2014 miniature and lapis lazuli", "In the miniatures of Herat and Tabriz, ground lapis lazuli blue fills the whole sky, gold enters as leaf, and pink and green come in small gardens. Flat colours, without shadow, side by side: depth is made by overlap, not by gradient."],
  ["Guatemala \u2014 Maya huipil", "Blouses woven on a backstrap loom, with colours that identify the village of the wearer. Magenta, red, yellow and blue at full saturation, separated by bands of pattern. The rule is the neighbourhood of full colours: nothing is lowered so that another colour can appear."],
  ["Java \u2014 sogan batik", "Hand-drawn wax and dye baths in indigo and sogan, the tree-bark brown of the batiks of Yogyakarta and Solo. Cream, brown and dark blue, with the pattern held in reserve. It is a palette of three values and low chroma, made to be read up close."],
  ["Scotland \u2014 tartan", "Dyed threads crossed in a fixed sequence, the same pattern in warp and weft. Green, blue and red darkened by the crossing: where two colours overlap, a third is born. The mixing happens in the cloth, and the eye completes it from a distance."],
  ["Turkey \u2014 \u0130znik", "Sixteenth-century Ottoman ceramics: cobalt, turquoise and a raised tomato red, over white. Tulips, carnations and pomegranates in black outline. White is the largest area; the three colours enter as drawing and balance each other by being equally saturated."],
  ["Aboriginal Australia \u2014 desert ochres", "Red ochre, yellow ochre, charcoal and white clay, ground and mixed with water or sap, in dots and lines that map country and story. The colours come from specific places, traded for thousands of years. The dot is the unit: colour exists in accumulation, not in flat area."],
  ["Brazil \u2014 cerrado and sert\xE3o", "Red clay, straw, the grey-green of the caatinga and the washed blue of a dry-season sky. Low-chroma, high-light colours, seen in Jequitinhonha ceramics, in leather and on lime-painted fa\xE7ades. The palette is of earth and time, and what shines is what the rain brings."]
];
var mus = [
  ["None", ""],
  ["Bossa nova", "Complex harmony at low dynamics. Reduced chroma and short contrast: everything happens within a narrow band, and the sophistication is in the interval, not the volume."],
  ["Samba de roda and batucada", "Heavy syncopation. Proportion stops being regular: one colour dominates, the others come in off the beat, in small, recurring areas."],
  ["Choro", "Virtuosity within a fixed form. Irregular proportion, but always returning to the same point of support."],
  ["Berlin techno", "Repetition over a rigid grid. Extreme value contrast, almost no hue event, regular proportion \u2014 everything lives in the dark and in the pulse."],
  ["Ambient and drone", "No attack and no edge. Minimal chroma and lightness differences that barely resolve: the palette reads as a field, not a set."],
  ["Punk", "Black, white and one colour shouting. Maximum contrast, no transition, no supporting colour."],
  ["Modal jazz", "Few chords, much space. Wide intervals between hues and a proportion that breathes."],
  ["Gospel and soul", "High light and warmth. A large bright area with full colours over it \u2014 the palette is a choir, not a solo."],
  ["Dub and reggae", "Enormous bass and echo. The dark gains area, the rest comes in late and in pieces separated by silence."],
  ["Fado", "Minor mode, no ornament. Low chroma on dark, and colour appears as a single voice."],
  ["Afrobeats", "Layers of percussion that do not coincide. Several colours in medium areas, none fully subordinate."],
  ["Classical romanticism", "Long crescendo and resolution. Near-regular proportion, with a dominant that only asserts itself at the end."],
  ["Flamenco", "Twelve-beat comp\xE1s and a dry attack. High contrast and irregular proportion: one colour comes in like a handclap, off the expected place, and the silence between entries is part of the palette."],
  ["Tango", "Minor mode, cut and pause. Contained chroma, clear value contrast and one colour that appears like the bandoneon: alone, in the middle, and then withdraws."],
  ["Hip-hop and boom bap", "Short loop and a present bass. Proportion broken into repeating blocks, one dark dominant and the other colours as samples: recognisable pieces, cut out."],
  ["Indian raga", "Continuous drone and microtonal ornament. One base colour that never leaves, and the others as very close variations of it; almost no contrast, much nuance."],
  ["Gamelan", "Interlocking metals in cycles that fit into one another. Several colours in medium area, no soloist, all needed for the pattern to close."],
  ["Taiko", "Large drum and silence. Low chroma, maximum value contrast: the dark dominates and the light enters as a strike."],
  ["Highlife and soukous", "Bright guitars in cheerful layers. High chroma and high light, many colours in similar areas, no long shadow."],
  ["Cumbia", "A two-beat measure that sways. Full colours in near-regular proportion, with a slight tilt so the set never stands still."],
  ["Forr\xF3", "Accordion, zabumba and triangle: three voices of different weights. One large colour, one medium and one small that keeps time."],
  ["Minimalism \u2014 Reich, Glass", "Repetition with slow phase shift. Regular proportion and contained chroma; change happens by phasing, one colour gaining area almost unnoticed."],
  ["Gregorian chant", "A single line, without pulse, in stone. Almost no chroma and a narrow lightness band: the palette is one material with variations of light."],
  ["Delta blues", "Voice and guitar, twelve bars. Low chroma, one dark dominant and a warm colour that answers like the slide on the string."],
  ["K-pop", "Dense production and abrupt section changes. Maximum chroma, high light and a proportion that swaps dominant midway: the palette has two choruses."],
  ["Andean music", "Siku, charango and bombo. Wool colours at different heights, one low colour that holds and clear melodies above."]
];
var cvd = ["None \u2014 trichromatic vision", "Deuteranopia \u2014 the most common", "Protanopia", "Tritanopia", "Achromatopsia \u2014 no colour"];
var cls = {
  "serif-old": ["Humanist serif", "The oldest, heirs of the angled pen. Oblique axis, moderate contrast, generous apertures. They read well in long text and bring warmth without seeming nostalgic."],
  "serif-trans": ["Transitional serif", "The step between pen and compass. More vertical axis, medium contrast, regulated forms. The most neutral class on the serif side and the safest for continuous text."],
  "serif-mod": ["Modern serif", "The Didones. Vertical axis, extreme contrast, thin straight serifs. They shine at large sizes and fall apart at small ones."],
  "serif-slab": ["Slab serif", "Rectangular serifs of the same weight as the stem. Almost no contrast, mechanical presence. They withstand poor printing and screen conditions."],
  "sans-grot": ["Grotesque sans", "The first sans serifs of the nineteenth century. Horizontal terminals, closed apertures, a rough personality. Good in headlines and at medium sizes."],
  "sans-neo": ["Neo-grotesque sans", "The modernist reform of the grotesque: uniform, quiet, almost without mannerism. The default class for interfaces."],
  "sans-geo": ["Geometric sans", "Built from circle and line. Minimal contrast, clarity in headlines, fatigue in long text because of repeated forms."],
  "sans-hum": ["Humanist sans", "A serif without the serifs: calligraphic axis, varied proportions, wide apertures. The best sans class for running text."],
  "mono": ["Monospaced", "Every letter the same width. Born of the typewriter and the terminal; today it carries technical reading, data, code and captions."],
  "display": ["Display", "Drawn for large sizes and small areas. Tight spacing, strong forms, no pretence of serving a paragraph."]
};
var uses = ["None \u2014 no preference", "Editorial and long text", "Interface and digital product", "Poster, cover and large headline", "Presentation and slides", "Document and report", "Institutional website"];
var strats = ["None \u2014 just respect the filters", "Structural contrast", "Superfamily", "A single family", "Metric compatibility", "Maximum opposition"];
var widths = ["None", "Condensed", "Normal", "Wide"];
var contrs = ["None", "Low \u2014 mechanical", "Medium", "High \u2014 Didone"];
var banks = [
  ["Google Fonts", "The largest open library, with a delivery API and direct download. Mostly SIL OFL and Apache licences.", "woff2 via the API, ttf on download"],
  ["Fontshare", "The Indian Type Foundry's library of contemporary families, free for commercial use.", "woff2 and woff via the API, otf and ttf on download"],
  ["Fontsource", "Packages families from Google and from independent foundries (Vercel, Collletttivo, The League, Cooper Hewitt) for npm and CDN, with subsets by script. OFL, Apache and public-domain licences.", "woff2 and woff per weight and subset, via the jsDelivr CDN"],
  ["Bunny Fonts", "A tracking-free mirror of Google with the same URL syntax.", "woff2"],
  ["Velvetyne", "A French libre foundry of experimental designs under the SIL OFL. The families served here come through the Fontsource CDN; the foundry's site delivers the complete files.", "otf and ttf on the site; woff2 via the CDN"],
  ["The League of Moveable Type", "A veteran open-font project: few families, well cared for.", "otf, ttf and woff"],
  ["Uncut", "A curated set of free contemporary families from several foundries.", "varies by family"],
  ["Open Foundry", "A curated set with a technical sheet and essay on each open family.", "otf and woff"]
];
var roles = ["Label", "Headline", "Subheading", "Paragraph", "Emphasis", "Quotation", "Reference", "Button"];
var cases = ["None \u2014 as written", "Uppercase", "Lowercase", "Title case"];
var pieces = ["None \u2014 not set", "Website or page", "App or digital product", "Visual identity", "Poster or cover", "Presentation or slides", "Report or document", "Book, e-book or magazine", "Newsletter or e-mail", "Packaging or label", "Data dashboard", "Social media piece", "Signage or environment"];
var sups = ["None \u2014 not set", "Screen", "Print", "Screen and print", "Environment and large format"];
var angles = [
  ["The direct reading", "Stays within what the field already recognises and spends the difference on precision, not volume. It is the proposal that does not need defending in a meeting."],
  ["The contrasting reading", "Goes against the convention on purpose: the aim is to be perceived as different before being understood. Costs more to sustain and pays more when sustained."],
  ["The lateral reading", "Comes in by a route nobody asked for: it changes the axis of the problem, whether through cultural reference, dynamics or the quantity of colour. It is the one that usually opens the conversation."]
];
var lexFrag = {
  "Autoridade": "Authority",
  "Confian\xE7a": "Trust",
  "Alegria": "Joy",
  "Energia": "Energy",
  "Cerim\xF4nia": "Ceremony",
  "Intimidade": "Intimacy",
  "Repouso": "Rest",
  "Cuidado": "Care",
  "Abund\xE2ncia": "Abundance",
  "Melancolia": "Melancholy",
  "Mist\xE9rio": "Mystery",
  "Rigor": "Rigour",
  "Desejo": "Desire",
  "Luxo": "Luxury",
  "Clima": "Climate",
  "Bioeconomia": "Bioeconomy",
  "Tecnologia": "Technology",
  "Sa\xFAde": "Health",
  "Educa\xE7\xE3o": "Education",
  "Turismo": "Tourism",
  "Alimentos": "Food",
  "Moda": "Fashion",
  "Arte": "Art",
  "Finan\xE7as": "Finance",
  "Setor p\xFAblico": "Public sector",
  "Varejo": "Retail",
  "Bem-estar": "Wellbeing",
  "Amaz\xF4nia": "Amazon",
  "Aotearoa": "Aotearoa",
  "Jap\xE3o": "Japan",
  "M\xE9xico": "Mexico",
  "\xCDndia": "India",
  "\xC1frica": "Africa",
  "Andes": "Andes",
  "Mediterr\xE2neo": "Mediterranean",
  "N\xF3rdico": "Nordic",
  "Bauhaus": "Bauhaus",
  "Punk": "Punk",
  "Ambient": "Ambient",
  "Afrobeats": "Afrobeats",
  "Fado": "Fado",
  "Techno": "techno",
  "Samba": "Samba",
  "Bossa": "Bossa"
};
var views_axes = ["Colour", "Type", "Pairings", "Applications"];
var trend = [
  {
    id: "Q3 2026",
    per: "July to September 2026",
    tese: "The cycle splits in two. On one side, colour becomes an event again after a year of structural white; on the other, type and identity refuse the neutrality that automated production made cheap.",
    cor: {
      tese: "Cobalt blue as anchor, earthy warmth as counterweight",
      obs: ["WGSN and Coloro Colour of the Year 2027, Coloro code 125-28-38", "S/S 27 key colour, Coloro code 018-57-34", "S/S 27 key colour, Coloro code 151-73-22", "S/S 27 key colour, Coloro code 050-61-19", "S/S 27 key colour, Coloro code 014-60-13"],
      corpo: [
        "WGSN and Coloro named Luminous Blue Colour of the Year 2027 and described the theme governing the choice of the five spring/summer 2027 key colours: interconnection between polarities \u2014 light and dark, nature and technology, ancient and contemporary, rationality and spirituality.",
        "The first three key colours are declaredly upbeat, meant to sustain people under pressure; the last two, Meadowland Green and Clay, come from the search for purpose and for a bond with community and nature. It is the same tension Goethe describes between the active and passive sides of the circle, with purple absent and blue taking the role of gravity.",
        "For the colour instrument the practical reading is this: a cold, high-chroma blue as primary, with orange and clay coming in as a characteristic counterpart in small area \u2014 not as a complementary in equal area, which is the predictable mistake with that combination."
      ],
      fontes: ["WGSN and Coloro, press release of 29 April 2025", "Coloro, key colours page", "WWD, coverage of 29 April 2025"]
    },
    tipo: {
      tese: "The variable font became infrastructure, and neutrality became a fault",
      corpo: [
        "The variable font standard, published by the W3C in 2017, stopped being a differentiator and became an expectation: browsers, operating systems and design tools handle it without friction, and a whole family arrives in a single file covering weight, optical size, width and experimental axes.",
        "The aesthetic movement runs the other way from the file economy. Clean grotesques became so ubiquitous in product that they came to read as an absence of choice, and the more interesting work migrated to what is softer, warmer, more expressive or simply odder. The saturation of automatically generated content turned the hand-drawn stroke into a sign of authorship.",
        "Money has also returned to type: after a decade of budget discipline resting on open libraries alone, studios went back to commissioning and licensing their own designs. The free libraries remain excellent \u2014 the difference is that they stopped being the only acceptable route."
      ],
      fontes: ["Font Trends 2026, market survey and foundry releases", "Typography Trends 2026, variable fonts and kinetic type", "Monotype, annual Type Trends report"]
    },
    comb: {
      tese: "A flexible palette in place of a fixed one",
      corpo: [
        "The recommendation repeated across identity reports is to abandon the frozen palette in favour of a chromatic theme that shifts by context and platform: recognisable by atmosphere, not by an exact set of values.",
        "That changes what a colour system needs to deliver. Five hex values are not enough: you need a rule of displacement \u2014 how far the hue may turn, how high the chroma may rise, which band of lightness still belongs to the system. It is exactly what a circle with preserved geometry solves and a list of swatches does not.",
        "The counterpart is the risk of dissolution. Without an anchor of value \u2014 a dark and a light that do not move \u2014 a flexible identity becomes an indistinguishable one."
      ],
      fontes: ["The Branding Journal, identity and design trends 2026", "It's Nice That, graphic trends 2026"]
    },
    apl: {
      tese: "Motion before form, texture before finish",
      corpo: [
        "Identity conceived first in motion stopped being a motion-studio speciality and became a delivery requirement, because the screen became the first point of contact rather than the last.",
        "With it comes a preference for surface: translucent, waxy, glassy, with visible grain and imperfection. The current reading is that this works as a signature of human authorship in an environment saturated with automatic production.",
        "For anyone working with colour the consequence is technical: a palette tested only on flat surfaces breaks when it enters transparency and overlap. Test each pair in layers before closing."
      ],
      fontes: ["Three Rooms, eight identity trends for 2026", "It's Nice That, graphic trends 2026"]
    }
  },
  {
    id: "Q2 2026",
    per: "April to June 2026",
    tese: "The quarter's behaviour report shifts the axis from novelty to stability, and the visual consequence is a preference for legible continuity over annual rupture.",
    cor: {
      tese: "A stability premium: colour that does not need replacing every year",
      obs: ["approximation of the continuity blue described in the reports", "approximation", "approximation", "approximation"],
      corpo: [
        "Accenture's Life Trends report for 2026 organises the year into five movements, and the first is the stability premium: predictability of price and quality becomes a comfort in an unstable context, and domestic rituals become an anchor.",
        "The chromatic translation appearing in identity material is that of dynamic legacy \u2014 preserving what is already recognised and modernising from within, rather than starting over. In practice this favours analogous and monochromatic schemes over complementary ones, and medium chroma over high."
      ],
      fontes: ["Accenture Life Trends 2026"]
    },
    tipo: {
      tese: "Type as an asset of continuity",
      corpo: ["When the strategy is continuity, type stops being where novelty is sought and becomes where durability is sought: transitional and humanist classes, compatible x-heights, families with a weight range wide enough to carry hierarchy without changing design."],
      fontes: ["Accenture Life Trends 2026"]
    },
    comb: {
      tese: "Dynamic legacy rather than a fresh start",
      corpo: ["The quarter's strategic recommendation is to preserve accumulated visual heritage and evolve from within. For a colour system that means a small, deliberate deviation from what already exists \u2014 the same discipline the consultancy networks apply to multi-market programmes."],
      fontes: ["Accenture Life Trends 2026"]
    },
    apl: {
      tese: "Ritual as a point of contact",
      corpo: ["If behaviour anchors itself in routine, the application that matters most stops being the campaign and becomes the recurring piece: the packaging that reappears, the screen that opens every day, the document that arrives every month. These are surfaces that forgive poor contrast less, because they are seen many times."],
      fontes: ["Accenture Life Trends 2026"]
    }
  },
  {
    id: "Q1 2026",
    per: "January to March 2026",
    tese: "For the first time in twenty-seven years the colour institute chooses a white. The consequence is not an absence of colour: it is that white comes to be treated as a material with a role, not as a background.",
    cor: {
      tese: "White as a structural colour",
      obs: ["Pantone 11-4201, Colour of the Year 2026 \u2014 sRGB approximation", "WGSN and Coloro Colour of the Year 2026 \u2014 approximation", "approximation from the published light-and-shadow palettes", "approximation from the published pastel palettes"],
      corpo: [
        "On 4 December 2025 the institute announced Pantone 11-4201 Cloud Dancer as Colour of the Year 2026, described as an airy white that acts as a symbol of calming influence in a society rediscovering the value of quiet reflection. It is the first time the choice has fallen on a white.",
        "The published argument is one of structure, not fashion: a white that serves as scaffolding for the spectrum and lets the other colours appear. Seven palettes were released with it, among them dusty pastels and light and shadow.",
        "In parallel, WGSN and Coloro had already named Transformative Teal their Colour of the Year 2026, for representing change and stability at once. The two choices converge on the same diagnosis and diverge in the answer: one withdraws, the other mediates.",
        "Goethe's reading here is direct. He refuses to treat white as absence: light and darkness are the two poles without which no colour exists. A white Colour of the Year is the industry arriving, by another route, at the position of 1810."
      ],
      fontes: ["Pantone, Colour of the Year 2026", "Pantone, the seven Cloud Dancer palettes", "NPR, coverage of 4 December 2025", "Coloro, key colours and history"]
    },
    tipo: {
      tese: "Revision rather than invention",
      corpo: ["The annual type-trend report from the foundry that publishes most on the subject treated the cycle under the title of revision \u2014 rereading existing repertoire rather than searching for unprecedented form. In practice: careful revivals, serif text faces and the correction of designs that had circulated too long without adjustment."],
      fontes: ["Monotype, Type Trends"]
    },
    comb: {
      tese: "White in the dominant area, colour in cut-outs",
      corpo: [
        "A palette anchored in structural white demands inverting the usual proportion: the light surface goes from sixty to eighty per cent of the area, and hue comes in as an event. It is the method studios of restraint already practise, now with the calendar's backing.",
        "The declared risk is emptiness. Dominant white without a well-chosen dark and without an accent of measured contrast produces what the sector called an identity without identity."
      ],
      fontes: ["Pantone, guide to applying Cloud Dancer"]
    },
    apl: {
      tese: "Tactile surface as compensation",
      corpo: ["When colour recedes, material advances: the materials released with the choice of the year emphasise padded texture, wool, fur and rounded volume. On a flat medium the equivalent is grain, visible paper and soft shadow \u2014 the compensation of those who took hue out of the equation."],
      fontes: ["Pantone, guide to applying Cloud Dancer"]
    }
  }
];
function localizeData() {
  ANCHORS[0].nome = "Purple";
  ANCHORS[1].nome = "Red-yellow";
  ANCHORS[2].nome = "Yellow";
  ANCHORS[3].nome = "Green";
  ANCHORS[4].nome = "Blue";
  ANCHORS[5].nome = "Red-blue";
  EMO.forEach((e, i) => {
    e.n = emo[i][0];
    e.g = emo[i][1];
  });
  MKT.forEach((m, i) => {
    m.n = mkt[i][0];
    m.c = mkt[i][1];
    m.d = mkt[i][2];
  });
  SCH.forEach((s, i) => {
    s.n = sch[i][0];
    s.d = sch[i][1];
  });
  LENS.forEach((l, i) => {
    l.n = lens[i][0];
    l.m = lens[i][1];
  });
  CULT.forEach((c, i) => {
    c.n = cult[i][0];
    c.m = cult[i][1];
  });
  MUS.forEach((m, i) => {
    m.n = mus[i][0];
    m.m = mus[i][1];
  });
  CVDLIST.forEach((c, i) => {
    c.n = cvd[i];
  });
  Object.keys(cls).forEach((k) => {
    CLS[k].n = cls[k][0];
    CLS[k].d = cls[k][1];
  });
  USES.forEach((u, i) => {
    u.n = uses[i];
  });
  STRATS.forEach((s, i) => {
    s.n = strats[i];
  });
  WIDTHS.forEach((w, i) => {
    w.n = widths[i];
  });
  CONTRS.forEach((c, i) => {
    c.n = contrs[i];
  });
  BANKS.forEach((b, i) => {
    b[0] = banks[i][0];
    b[1] = banks[i][1];
    b[2] = banks[i][2];
  });
  ROLES.forEach((r, i) => {
    r.n = roles[i];
  });
  CASES.forEach((c, i) => {
    c.n = cases[i];
  });
  PIECES.forEach((p, i) => {
    p.n = pieces[i];
  });
  SUPS.forEach((s, i) => {
    s.n = sups[i];
  });
  ANGLES.forEach((a, i) => {
    a.n = angles[i][0];
    a.why = angles[i][1];
  });
  LEX.forEach((e) => {
    ["emo", "mkt", "cult", "mus"].forEach((k) => {
      const v = e[k];
      if (v && lexFrag[v]) e[k] = lexFrag[v];
    });
  });
  AXES.forEach((a, i) => {
    a.n = views_axes[i];
  });
  TREND.forEach((e, i) => {
    const t2 = trend[i];
    if (!t2) return;
    e.id = t2.id;
    e.per = t2.per;
    e.tese = t2.tese;
    ["cor", "tipo", "comb", "apl"].forEach((k) => {
      const ax = e[k], ex = t2[k];
      ax.tese = ex.tese;
      ax.corpo = ex.corpo;
      if (ax.pal && ex.obs) ax.pal.forEach((p, j) => {
        p.obs = ex.obs[j] || p.obs;
      });
      if (ex.fontes) ax.fontes.forEach((f, j) => {
        f.n = ex.fontes[j] || f.n;
      });
    });
  });
}

// src/i18n/index.ts
var KEY = "fk-lang";
var lang = "en";
try {
  const s = localStorage.getItem(KEY);
  if (s === "pt" || s === "en") lang = s;
} catch (_) {
}
var isEn = () => lang === "en";
function useLang(l) {
  lang = l;
}
function t(pt, vars) {
  let s = lang === "en" ? UI[pt] ?? pt : pt;
  if (vars) for (const k of Object.keys(vars)) s = s.split("{" + k + "}").join(String(vars[k]));
  return s;
}
var locale = () => lang === "en" ? "en-GB" : "pt-BR";

// src/core/goethe.ts
var ANCHORS = [
  { a: 0, nome: "Purp\xFAreo", hex: "#C4003F" },
  { a: 60, nome: "Vermelho-amarelo", hex: "#E96A00" },
  { a: 120, nome: "Amarelo", hex: "#F2CC00" },
  { a: 180, nome: "Verde", hex: "#3E8F45" },
  { a: 240, nome: "Azul", hex: "#22409B" },
  { a: 300, nome: "Vermelho-azul", hex: "#6E2B8C" }
].map((x) => Object.assign(x, hex2lch(x.hex)));
function atAngle(a) {
  a = (a % 360 + 360) % 360;
  const i = Math.floor(a / 60), p = ANCHORS[i], n = ANCHORS[(i + 1) % 6], t2 = (a - i * 60) / 60, dh = wrapDeg(n.H - p.H);
  return { L: p.L + (n.L - p.L) * t2, C: p.C + (n.C - p.C) * t2, H: p.H + dh * t2 };
}
function nameOf(a) {
  a = (a % 360 + 360) % 360;
  const i = Math.floor(a / 60), p = ANCHORS[i], n = ANCHORS[(i + 1) % 6], tt = (a - i * 60) / 60;
  if (tt < 0.14) return p.nome;
  if (tt > 0.86) return n.nome;
  return tt < 0.5 ? p.nome + t(" puxado ao ") + n.nome.toLowerCase() : n.nome + t(" puxado ao ") + p.nome.toLowerCase();
}
function angleFor(H) {
  let best = 0, bd = 999;
  for (let a = 0; a < 360; a += 0.5) {
    const d = Math.abs(wrapDeg(atAngle(a).H - H));
    if (d < bd) {
      bd = d;
      best = a;
    }
  }
  return best;
}
function colorsFromHex(hs) {
  return hs.map((h) => {
    const l = hex2lch(h);
    return { a: angleFor(l.H), L: l.L, C: l.C, lock: false };
  });
}
var hexOfColor = (c) => oklch2hex(c.L, c.C, atAngle(c.a).H);

// src/core/names.ts
var FAM = [
  { h: 20, pt: ["Rosa", "Cereja", "Carmim", "Framboesa", "Rubi", "Rom\xE3"], en: ["Rose", "Cherry", "Carmine", "Raspberry", "Ruby", "Pomegranate"] },
  { h: 50, pt: ["Coral", "Terracota", "Papoula", "Ferrugem", "Tijolo", "Lacre"], en: ["Coral", "Terracotta", "Poppy", "Rust", "Brick", "Sealing wax"] },
  { h: 80, pt: ["\xC2mbar", "Damasco", "Cobre", "Ab\xF3bora", "Caqui", "Canela"], en: ["Amber", "Apricot", "Copper", "Pumpkin", "Persimmon", "Cinnamon"] },
  { h: 110, pt: ["A\xE7afr\xE3o", "Mel", "Palha", "Mostarda", "Ouro", "Trigo"], en: ["Saffron", "Honey", "Straw", "Mustard", "Gold", "Wheat"] },
  { h: 145, pt: ["Lima", "Oliva", "Musgo", "Capim", "Pistache", "Broto"], en: ["Lime", "Olive", "Moss", "Grass", "Pistachio", "Sprout"] },
  { h: 180, pt: ["Jade", "Esmeralda", "S\xE1lvia", "Hortel\xE3", "Floresta", "Samambaia"], en: ["Jade", "Emerald", "Sage", "Mint", "Forest", "Fern"] },
  { h: 220, pt: ["Turquesa", "Lagoa", "Verdete", "Mar\xE9", "\xC1gua-marinha", "Glacial"], en: ["Turquoise", "Lagoon", "Verdigris", "Tide", "Aquamarine", "Glacier"] },
  { h: 265, pt: ["Cobalto", "Anil", "C\xE9u", "Ard\xF3sia", "Marinho", "Safira"], en: ["Cobalt", "Indigo", "Sky", "Slate", "Navy", "Sapphire"] },
  { h: 305, pt: ["Lavanda", "Ameixa", "Violeta", "\xCDris", "Uva", "Ametista"], en: ["Lavender", "Plum", "Violet", "Iris", "Grape", "Amethyst"] },
  { h: 345, pt: ["Orqu\xEDdea", "Magenta", "Amora", "F\xFAcsia", "Vinho", "Pe\xF4nia"], en: ["Orchid", "Magenta", "Mulberry", "Fuchsia", "Wine", "Peony"] },
  { h: 361, pt: ["Rosa", "Cereja", "Carmim", "Framboesa", "Rubi", "Rom\xE3"], en: ["Rose", "Cherry", "Carmine", "Raspberry", "Ruby", "Pomegranate"] }
];
var NEUTRAL = [
  { L: 0.96, pt: "Marfim", en: "Ivory" },
  { L: 0.88, pt: "Giz", en: "Chalk" },
  { L: 0.74, pt: "N\xE9voa", en: "Mist" },
  { L: 0.58, pt: "Pedra", en: "Stone" },
  { L: 0.42, pt: "Fumo", en: "Smoke" },
  { L: 0.26, pt: "Carv\xE3o", en: "Charcoal" },
  { L: 0, pt: "Breu", en: "Pitch" }
];
var MOD = [
  { test: (L2, C) => L2 > 0.86 && C < 0.09, pt: (n) => `${n} p\xE1lido`, en: (n) => `Pale ${n.toLowerCase()}` },
  { test: (L2, C) => L2 > 0.86 && C >= 0.09, pt: (n) => `${n} claro`, en: (n) => `Light ${n.toLowerCase()}` },
  { test: (L2) => L2 < 0.3, pt: (n) => `${n} profundo`, en: (n) => `Deep ${n.toLowerCase()}` },
  { test: (L2, C) => C < 0.06, pt: (n) => `${n} enevoado`, en: (n) => `Misty ${n.toLowerCase()}` },
  { test: (L2, C) => C > 0.2, pt: (n) => `${n} vivo`, en: (n) => `Vivid ${n.toLowerCase()}` }
];
var hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};
function colourName(hex) {
  const { L: L2, C, H } = hex2lch(hex), h = (H % 360 + 360) % 360;
  if (C < 0.025) {
    const n = NEUTRAL.find((x) => L2 >= x.L) || NEUTRAL[NEUTRAL.length - 1];
    return [n.pt, n.en];
  }
  const fam2 = FAM.find((f) => h < f.h), k = hash(hex.toUpperCase()) % fam2.pt.length;
  const mod = MOD.find((m) => m.test(L2, C));
  return mod ? [mod.pt(fam2.pt[k]), mod.en(fam2.en[k])] : [fam2.pt[k], fam2.en[k]];
}

// src/core/rng.ts
function lcg(seed, offset = 1) {
  let rs = Math.floor(seed * 233279) + offset;
  return () => {
    rs = (rs * 9301 + 49297) % 233280;
    return rs / 233280;
  };
}

// src/data/range.ts
var RANGES = [
  { k: "conservador", n: "Conservador", d: "Croma contido, matiz perto da conven\xE7\xE3o, fam\xEDlias de texto seguras.", dc: 0.82, jit: 0.45, dpos: -0.18, ct: -0.06 },
  { k: "normal", n: "Normal", d: "O comportamento de refer\xEAncia do instrumento.", dc: 1, jit: 1, dpos: 0, ct: 0 },
  { k: "inovador", n: "Inovador", d: "Croma um pouco acima, mais liberdade no matiz, fam\xEDlias com voz pr\xF3pria.", dc: 1.14, jit: 1.5, dpos: 0.15, ct: 0.05 },
  { k: "disruptivo", n: "Disruptivo", d: "Croma alto, matiz solto, oposi\xE7\xE3o de estrutura e fundi\xE7\xF5es independentes.", dc: 1.32, jit: 2.4, dpos: 0.32, ct: 0.12 }
];
var rangeOf = (k) => RANGES.find((r) => r.k === k) || RANGES[1];
function segValue(id, fallback = "normal") {
  const el = document.getElementById(id);
  if (!el) return fallback;
  const on = el.querySelector('button[aria-pressed="true"]');
  return on?.dataset.r || fallback;
}

// src/palette/generate.ts
function generatePalette(o) {
  const rnd = lcg(o.seed, 1);
  const { E, M, SC, L: L2, K, U } = o;
  let base;
  if (o.baseOver !== null && o.baseOver !== void 0) base = o.baseOver;
  else {
    const jit = (rnd() - 0.5) * o.jit;
    let b;
    if (E.a === null && M.a === null) b = o.seed * 360;
    else if (E.a === null) b = M.a;
    else if (M.a === null) b = E.a;
    else b = M.a + wrapDeg(E.a - M.a) * o.t;
    b = (b + jit + 360) % 360;
    if (K.anc) {
      let best = K.anc[0], bd = 999;
      K.anc.forEach((x) => {
        const d = Math.abs(wrapDeg(x - b));
        if (d < bd) {
          bd = d;
          best = x;
        }
      });
      b = (b + wrapDeg(best - b) * K.pull + 360) % 360;
    }
    base = b;
  }
  const Cm = L2.Cm * K.Cm * U.Cm * (o.dc || 1), ct = U.ct, n = o.n;
  const old = o.prev || [], out = [];
  for (let i = 0; i < n; i++) {
    const prev = old[i];
    if (o.keepLocks && prev && prev.lock) {
      out.push(prev);
      continue;
    }
    let a;
    if (SC.off === null) a = prev ? prev.a : (base + i * (360 / n)) % 360;
    else a = i === 0 ? base : (base + SC.off[(i - 1) % SC.off.length] + 360) % 360;
    const jL = (rnd() - 0.5) * 0.11, jC = 0.8 + rnd() * 0.46, jH = (rnd() - 0.5) * 13;
    if (SC.off !== null && i > 0) a = (a + jH + 360) % 360;
    let Lt = L2.Lp[i % L2.Lp.length] + jL;
    Lt = 0.5 + (Lt - 0.5) * (1 + ct * 0.42);
    if (i === 0 && L2.dark) Lt = Math.max(0.08, Lt + K.trevaD);
    if (Lt > 0.9) Lt = Math.min(0.995, Lt + K.luzD);
    if (Lt < 0.25) Lt = Math.max(0.05, Lt + K.trevaD);
    const nat = atAngle(a);
    let C = nat.C * Cm * jC * (SC.mono ? 1 - i * 0.14 : 1);
    if (Lt > 0.9) C *= 0.22;
    else if (Lt < 0.22) C *= 0.5;
    out.push({ a, L: Math.max(0.04, Math.min(0.995, Lt)), C: Math.max(0, C), lock: prev ? prev.lock : false });
  }
  return out;
}

// src/core/state.ts
function createStore(state) {
  const subs = /* @__PURE__ */ new Set();
  return {
    state,
    subscribe(fn) {
      subs.add(fn);
      return () => {
        subs.delete(fn);
      };
    },
    notify() {
      subs.forEach((f) => f(state));
    }
  };
}

// src/core/dom.ts
var $ = (id) => document.getElementById(id);
var $v = (id) => document.getElementById(id).value;
var slug = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
var norm = (t2) => t2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
var toastTimer = 0;
function toast(t2) {
  const el = $("toast");
  if (!el) return;
  el.textContent = t2;
  el.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove("on"), 1800);
}

// src/palette/state.ts
var paletteStore = createStore({
  n: 5,
  colors: [],
  seed: 0.5,
  fmt: "css",
  sel: null,
  baseOver: null,
  cvd: "none",
  range: "normal",
  view: "faixas",
  ctTarget: 4.5,
  ctPair: null,
  emo: 1,
  mkt: 3,
  scheme: 2,
  lens: 1,
  cult: 0,
  mus: 0,
  pos: 55
});
var S = paletteStore.state;
function proportionsFor(w0, sy, n) {
  const w = Array.from({ length: n }, (_, i) => w0[i % w0.length]);
  const ex = 0.6 + sy * 0.9, tot = w.reduce((s, x) => s + Math.pow(x, ex), 0);
  return w.map((x) => Math.pow(x, ex) / tot * 100);
}

// src/type/state.ts
var typeStore = createStore({
  disp: null,
  body: null,
  mono: null,
  seed: 0.3,
  fmt: "css",
  fams: [],
  nFam: 2,
  role: "titulo",
  ov: {},
  off: {},
  pick: false
});
var T = typeStore.state;

// src/type/pairing.ts
var isSerif = (c) => c.startsWith("serif");
var fam = (f) => `"${f.n}", ${f.cls === "mono" ? "ui-monospace, monospace" : isSerif(f.cls) ? "Georgia, serif" : "system-ui, sans-serif"}`;
function describe(f) {
  const p = [CLS[f.cls].n.toLowerCase()];
  p.push(t(f.x >= 0.54 ? "altura de x alta" : f.x <= 0.45 ? "altura de x baixa" : "altura de x m\xE9dia"));
  p.push(t(f.ct >= 0.7 ? "contraste de tra\xE7o alto" : f.ct <= 0.15 ? "contraste quase nulo" : "contraste moderado"));
  if (f.w <= 0.36) p.push(t("condensada"));
  else if (f.w >= 0.56) p.push(t("larga"));
  p.push(t(f.role === "display" ? "feita para corpo grande" : f.role === "body" ? "feita para texto corrido" : f.role === "mono" ? "monoespa\xE7ada" : "serve a t\xEDtulo e a texto"));
  return p.join(", ") + ".";
}
var widthBand = (w) => w <= 0.36 ? "cond" : w >= 0.56 ? "ext" : "norm";
var contrBand = (c) => c <= 0.2 ? "low" : c >= 0.65 ? "high" : "med";
var filtersFromUI = () => ({ bank: $v("tBank"), wf: $v("tWidth"), cf: $v("tContr"), clsD: $v("tClsD"), clsB: $v("tClsB"), use: $v("tUse"), strat: $v("tStrat"), emo: +$v("tEmo"), range: segValue("tRange") });
function candidates(slot, F = filtersFromUI()) {
  const cls2 = slot === "disp" ? F.clsD : F.clsB, use = F.use;
  return pool().filter((f) => {
    if (f.cls === "mono" && slot !== "mono") return false;
    if (slot === "mono" && f.cls !== "mono") return false;
    if (F.bank !== "none" && f.src !== F.bank) return false;
    if (cls2 !== "none" && f.cls !== cls2) return false;
    if (F.wf !== "none" && widthBand(f.w) !== F.wf) return false;
    if (F.cf !== "none" && contrBand(f.ct) !== F.cf) return false;
    if (slot === "disp" && f.role === "body" && use === "display") return false;
    if (slot === "body" && f.role === "display") return false;
    if (slot === "body" && use === "editorial" && f.cls === "sans-geo") return false;
    if (slot === "body" && use === "ui" && f.ct >= 0.7) return false;
    return true;
  });
}
function moodScore(f, emo2) {
  const e = EMO[emo2];
  if (e.a === null) return 0;
  const key = e.key;
  return f.moods.some((m) => norm(m).startsWith(key)) ? 26 : 0;
}
function pairScore(d, b, F) {
  const st = F.strat;
  let s = moodScore(d, F.emo) * 1.1 + moodScore(b, F.emo);
  const sameSuper = d.sf && d.sf === b.sf, sameFam = d.n === b.n;
  const classDiff = isSerif(d.cls) !== isSerif(b.cls) ? 1 : d.cls !== b.cls ? 0.5 : 0;
  const ctDiff = Math.abs(d.ct - b.ct), xDiff = Math.abs(d.x - b.x), wDiff = Math.abs(d.w - b.w);
  if (st === "super") s += sameFam ? -35 : sameSuper ? 60 : -45;
  else if (st === "uma") s += sameFam ? 70 : -60;
  else if (st === "contraste") {
    s += classDiff * 34 + ctDiff * 40 - xDiff * 70 - wDiff * 40;
    if (sameFam) s -= 60;
  } else if (st === "metrica") {
    s += (1 - xDiff * 4) * 40 + (1 - wDiff * 4) * 26 + classDiff * 12;
    if (sameFam) s -= 40;
  } else if (st === "oposto") {
    s += classDiff * 40 + ctDiff * 60 + wDiff * 40;
    if (sameFam) s -= 80;
  } else {
    s += classDiff * 10 - xDiff * 20;
    if (sameFam) s -= 25;
  }
  if (b.role === "display") s -= 25;
  if (d.role === "body") s -= 10;
  s += rangeBias(d, b, F.range || "normal");
  return s;
}
function rangeBias(d, b, r) {
  const indie = (f) => f.src === "velvetyne" || f.src === "fontsource";
  const cd = isSerif(d.cls) !== isSerif(b.cls) ? 1 : 0, ctd = Math.abs(d.ct - b.ct);
  if (r === "conservador") return (d.role === "display" ? -22 : 0) + (b.role === "body" ? 8 : 0) + (d.ct > 0.7 ? -8 : 0) + (d.sf && d.sf === b.sf ? 10 : 0) - (indie(d) ? 6 : 0);
  if (r === "inovador") return cd * 8 + (d.role === "display" ? 6 : 0) + (indie(d) || indie(b) ? 8 : 0);
  if (r === "disruptivo") return cd * 16 + ctd * 30 + (d.role === "display" ? 18 : 0) + (indie(d) ? 14 : 0) + (indie(b) ? 6 : 0) + (Math.abs(d.w - b.w) > 0.15 ? 10 : 0) - (d.sf && d.sf === b.sf ? 20 : 0);
  return 0;
}

// src/type/fontmatch.ts
function dist(f, m) {
  const sm = Math.abs(m.serif - (isSerif(f.cls) ? 1 : 0));
  return sm * 2.2 + Math.abs(m.ct - f.ct) * 1.7 + Math.abs(m.w - f.w) * 1.1;
}
var imgAffinity = (f, m) => (1.1 - dist(f, m)) * 24;

// src/type/loader.ts
var loaded = /* @__PURE__ */ new Set();
var failed = /* @__PURE__ */ new Set();
var warned = false;
var FONT_TIMEOUT = 6e3;
function cdnLink(f) {
  if (f.src === "google") return `https://fonts.googleapis.com/css2?family=${f.n.replace(/ /g, "+")}:wght@${f.wts}&display=swap`;
  if (f.src === "fontshare") return `https://api.fontshare.com/v2/css?f[]=${slug(f.n)}@${f.wts.replace(/;/g, ",")}&display=swap`;
  return `https://cdn.jsdelivr.net/fontsource/css/${fontsourceId(f)}@latest/latin.css`;
}
function loadFont(f) {
  if (typeof document === "undefined") return Promise.resolve(true);
  if (!f || loaded.has(f.n)) return Promise.resolve(!failed.has(f?.n || ""));
  loaded.add(f.n);
  return new Promise((res) => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = cdnLink(f);
    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      if (!ok) {
        failed.add(f.n);
        if (!warned) {
          warned = true;
          toast(t("Uma fam\xEDlia n\xE3o carregou \u2014 a reserva declarada est\xE1 em uso"));
        }
      }
      res(ok);
    };
    const timer = window.setTimeout(() => finish(false), FONT_TIMEOUT);
    l.onerror = () => {
      clearTimeout(timer);
      finish(false);
    };
    l.onload = () => {
      const fonts = document.fonts;
      if (!fonts || !fonts.load) {
        clearTimeout(timer);
        return finish(true);
      }
      fonts.load(`400 16px "${f.n}"`).then((faces) => {
        clearTimeout(timer);
        finish(faces.length > 0);
      }, () => {
        clearTimeout(timer);
        finish(false);
      });
    };
    document.head.appendChild(l);
  });
}

// src/create/brief.ts
var findIdx = (arr, frag) => {
  if (!frag) return -1;
  const f = norm(frag);
  return arr.findIndex((x) => norm(x.n).indexOf(f) === 0 || norm(x.n).includes(f));
};

// src/create/proposals.ts
function genFonts(o) {
  const editorial = o.use === "relatorio" || o.use === "ebook" || o.use === "news";
  const FONTS4 = pool();
  const D = FONTS4.filter((f) => f.cls !== "mono" && f.role !== "body");
  const B = FONTS4.filter((f) => f.cls !== "mono" && f.role !== "display" && !(editorial && f.cls === "sans-geo"));
  const rnd = lcg(o.seed, 7);
  const E = EMO[o.e], key = E.a === null ? null : E.key;
  const mood = (f) => key && f.moods.some((m) => norm(m).startsWith(key)) ? 26 : 0;
  const pairs = [];
  D.forEach((d) => B.forEach((b) => {
    let s = mood(d) * 1.1 + mood(b);
    const sameSuper = d.sf && d.sf === b.sf, sameFam = d.n === b.n;
    const cd = isSerif(d.cls) !== isSerif(b.cls) ? 1 : d.cls !== b.cls ? 0.5 : 0;
    const ctd = Math.abs(d.ct - b.ct), xd = Math.abs(d.x - b.x), wd = Math.abs(d.w - b.w);
    if (o.strat === "super") s += sameFam ? -35 : sameSuper ? 60 : -45;
    else if (o.strat === "uma") s += sameFam ? 70 : -60;
    else if (o.strat === "oposto") s += cd * 40 + ctd * 60 + wd * 40 + (sameFam ? -80 : 0);
    else if (o.strat === "metrica") s += (1 - xd * 4) * 40 + (1 - wd * 4) * 26 + cd * 12 + (sameFam ? -40 : 0);
    else s += cd * 34 + ctd * 40 - xd * 70 - wd * 40 + (sameFam ? -60 : 0);
    if (editorial && b.role === "both") s += 8;
    s += rangeBias(d, b, o.range || "normal");
    if (o.img) s += imgAffinity(d, o.img);
    pairs.push({ d, b, s: s + rnd() * 24 });
  }));
  pairs.sort((x, y) => y.s - x.s);
  const pool2 = pairs.slice(0, 8), p = pool2[Math.floor(rnd() * pool2.length)];
  const out = o.nf === 1 ? [p.b.role === "both" ? p.b : p.d] : [p.d, p.b];
  if (o.nf >= 3) {
    const ms = FONTS4.filter((f) => f.cls === "mono");
    out.push(ms.find((m) => m.sf && (m.sf === p.d.sf || m.sf === p.b.sf)) || ms[Math.floor(rnd() * ms.length)]);
  }
  if (o.nf >= 4) {
    const qs = FONTS4.filter((f) => f.cls !== "mono" && out.indexOf(f) < 0 && f.role !== "body" && isSerif(f.cls) !== isSerif(p.b.cls));
    out.push(qs[Math.floor(rnd() * qs.length)]);
  }
  return out.filter(Boolean);
}
function makeProposal(ang, br, seed) {
  const lensName = br.lensFrag && ang.k === "convencao" ? br.lensFrag : ang.lens[Math.floor(seed * ang.lens.length) % ang.lens.length];
  let li = findIdx(LENS, lensName);
  if (li < 0) li = findIdx(LENS, ang.lens[0]);
  if (li < 0) li = 1;
  let si = findIdx(SCH, ang.sch[Math.floor(seed * 97 * ang.sch.length) % ang.sch.length]);
  if (si < 0) si = 2;
  const R = rangeOf(br.range || "normal");
  const t2 = Math.max(0, Math.min(1, br.t + ang.dpos + R.dpos));
  const nf = br.nf || (ang.k === "lateral" ? 3 : 2);
  let u = br.u;
  const k = br.k;
  if (ang.k === "lateral" && u === 0) u = 1 + Math.floor(seed * 631) % (MUS.length - 1);
  if (ang.k === "ruptura" && u === 0 && br.t > 0.6) u = 6;
  const cols = generatePalette({ seed, n: br.n, E: EMO[br.e], M: MKT[br.m], SC: SCH[si], L: LENS[li], K: CULT[k], U: MUS[u], t: t2, jit: 40 * R.jit, dc: br.dc * R.dc, baseOver: br.imgBase ?? void 0 });
  const fonts = genFonts({ e: br.e, strat: ang.strat, use: br.piece, nf, seed, range: br.range, img: br.imgType ?? null });
  const areas = proportionsFor(LENS[li].w, MUS[u].sy, br.n);
  fonts.forEach(loadFont);
  return { ang, br, li, si, t: t2, u, k, cols, fonts, areas, seed, hs: cols.map(hexOfColor) };
}

// src/create/markdown.ts
function mdBlock(name, hs, areas, fonts, extra) {
  let s = `# ${name}

`;
  if (extra) s += extra + "\n\n";
  s += t("## Paleta") + `

` + t("| # | Nome | HEX | RGB | HSL | CMYK | OKLCH | \xC1rea |") + `
|---|---|---|---|---|---|---|---|
`;
  hs.forEach((h, i) => {
    const [r, g, b] = hex2rgb(h), hl = rgb2hsl(r, g, b), cm = rgb2cmyk(r, g, b), o = hex2lch(h);
    s += `| ${i + 1} | ${colourName(h)[isEn() ? 1 : 0]} | \`${h}\` | ${r}, ${g}, ${b} | ${hl.map((x) => Math.round(x)).join(", ")} | ${cm.map((x) => Math.round(x)).join(", ")} | ${Math.round(o.L * 100)}% ${o.C.toFixed(3)} ${Math.round(o.H)} | ${areas ? Math.round(areas[i]) + "%" : "\u2014"} |
`;
  });
  const ls = hs.map(lum), bg = hs[ls.indexOf(Math.max(...ls))], ink = hs[ls.indexOf(Math.min(...ls))];
  s += `
` + t("Fundo sugerido `{bg}`, texto `{ink}`, contraste {r} para 1.", { bg, ink, r: ratio(ink, bg).toFixed(2) }) + `
`;
  const ok = [];
  hs.forEach((b2, i) => hs.forEach((t2, j) => {
    if (i !== j && ratio(t2, b2) >= 4.5) ok.push(`\`${t2}\` sobre \`${b2}\` (${ratio(t2, b2).toFixed(2)})`);
  }));
  s += `
` + t("### Pares leg\xEDveis a 4,5 para 1") + `

` + (ok.length ? ok.slice(0, 8).map((x) => "- " + x).join("\n") : t("- Nenhum. Use preto ou branco de fora da paleta para texto.")) + "\n";
  if (fonts && fonts.length) {
    s += `
` + t("## Tipografia") + `

` + t("| Papel | Fam\xEDlia | Banco | Pesos | Caracter\xEDstica |") + `
|---|---|---|---|---|
`;
    const papel = [t("T\xEDtulo"), t("Texto"), t("Apoio"), t("Cita\xE7\xE3o"), t("Acento")];
    fonts.forEach((f, i) => s += `| ${papel[i] || t("Extra")} | ${f.n} | ${bankName(f)} | ${f.wts.replace(/;/g, ", ")} | ${describe(f)} |
`);
    s += `
\`\`\`html
` + fonts.map((f) => `<link rel="stylesheet" href="${cdnLink(f)}">`).join("\n") + `
\`\`\`
`;
  }
  s += `
` + t("## Vari\xE1veis CSS") + `

\`\`\`css
:root{
` + hs.map((h, i) => `  --cor-${i + 1}: ${h};`).join("\n") + `
  --fundo: ${bg};
  --tinta: ${ink};
` + (fonts && fonts.length ? fonts.map((f, i) => `  --fonte-${i + 1}: ${fam(f)};`).join("\n") + "\n" : "") + `}
\`\`\`
`;
  s += `
---

` + t("Derivada do c\xEDrculo crom\xE1tico de Goethe (*Zur Farbenlehre*, 1810). Convers\xF5es em OKLab, croma ajustado ao gamut sRGB. Raz\xF5es de contraste segundo WCAG 2.1. Gerado em {d}.", { d: (/* @__PURE__ */ new Date()).toLocaleString(locale()) }) + `
`;
  return s;
}

// src/api.ts
var VERSION = "1.0.0";
var INVARIANTS = "Six Goethe anchors with 180\xB0 opposites; OKLab interpolation with binary-search chroma reduction (never clipped); black and white are full colours; contrast measured on the real colours (WCAG 2.1). No network calls. Deterministic given a seed.";
var inited = false;
function init(lang2 = "en") {
  useLang(lang2);
  if (lang2 === "en") localizeData();
  inited = true;
}
var ensure = () => {
  if (!inited) init("en");
};
var L = (a) => a.map((x, i) => ({ index: i, label: x.n }));
var resolve = (arr, v, dflt = 0) => {
  if (v === void 0 || v === null || v === "") return dflt;
  if (typeof v === "number") return v >= 0 && v < arr.length ? v : dflt;
  const s = String(v).toLowerCase();
  const exact = arr.findIndex((x) => x.n.toLowerCase() === s);
  if (exact >= 0) return exact;
  const part = arr.findIndex((x) => x.n.toLowerCase().includes(s) || x.n.toLowerCase().split(/[ —–-]+/)[0] === s);
  return part >= 0 ? part : dflt;
};
var clamp = (v, a, b) => Math.min(b, Math.max(a, v));
function enrich(hex, areaPct) {
  const [r, g, b] = hex2rgb(hex), o = hex2lch(hex);
  return {
    hex,
    name: colourName(hex)[isEn() ? 1 : 0],
    rgb: [r, g, b],
    hsl: rgb2hsl(r, g, b).map((x) => Math.round(x)),
    cmyk: rgb2cmyk(r, g, b).map((x) => Math.round(x)),
    oklch: { L: +o.L.toFixed(3), C: +o.C.toFixed(3), H: Math.round(o.H) },
    areaPct: Math.round(areaPct),
    goethe: nameOf(angleFor(o.H))
  };
}
var fontOut = (f) => ({ name: f.n, bank: BANK_NAME[f.src], class: CLS[f.cls].n, page: bankPage(f), weights: f.wts.split(";"), note: describe(f) });
function listOptions() {
  ensure();
  return {
    version: VERSION,
    intentions: L(EMO),
    fields: L(MKT),
    schemes: L(SCH),
    lenses: L(LENS),
    cultures: L(CULT),
    music: L(MUS),
    ranges: RANGES.map((r) => ({ key: r.k, label: r.n, note: r.d })),
    fontBanks: Object.entries(BANK_NAME).map(([k, v]) => ({ key: k, label: v })),
    fontClasses: Object.entries(CLS).map(([k, v]) => ({ key: k, label: v.n })),
    strategies: [["contraste", "Structural contrast"], ["super", "Superfamily"], ["uma", "Single family"], ["metrica", "Metric compatibility"], ["oposto", "Maximum opposition"]].map(([key, label]) => ({ key, label })),
    readings: ANGLES.map((a, i) => ({ index: i, key: a.k, label: a.n })),
    counts: { colours: [2, 6], families: [1, 5] }
  };
}
function palette2(spec = {}) {
  ensure();
  const e = resolve(EMO, spec.intention), m = resolve(MKT, spec.field), sc = resolve(SCH, spec.scheme, 0), l = resolve(LENS, spec.lens, 1), k = resolve(CULT, spec.culture), u = resolve(MUS, spec.music);
  const R = rangeOf(spec.range || "normal"), n = clamp(Math.round(spec.n ?? 5), 2, 6), seed = spec.seed ?? 0.5;
  const t2 = clamp((spec.stance ?? 55) / 100 + R.dpos, 0, 1);
  const cols = generatePalette({ seed, n, E: EMO[e], M: MKT[m], SC: SCH[sc], L: LENS[l], K: CULT[k], U: MUS[u], t: t2, jit: 46 * R.jit, dc: R.dc });
  const hs = cols.map(hexOfColor), areas = proportionsFor(LENS[l].w, MUS[u].sy, n);
  const colours = hs.map((h, i) => enrich(h, areas[i]));
  const out = { scheme: SCH[sc].n, intention: EMO[e].n, field: MKT[m].n, range: R.n, stance: Math.round(t2 * 100), colours };
  if (spec.markdown) out.markdown = mdBlock(EMO[e].a !== null ? EMO[e].n : SCH[sc].n, hs, areas, null);
  return out;
}
function paletteFromColours(hexes, opts = {}) {
  ensure();
  const hs = hexes.map((h) => h.trim()).filter((h) => /^#?[0-9a-f]{6}$/i.test(h)).map((h) => h.startsWith("#") ? h.toUpperCase() : "#" + h.toUpperCase());
  const cols = colorsFromHex(hs), areas = proportionsFor(LENS[1].w, MUS[0].sy, hs.length);
  const colours = hs.map((h, i) => enrich(h, areas[i]));
  const out = { colours, wheel: cols.map((c) => ({ angle: Math.round(atAngle(c.a).H), L: +c.L.toFixed(3), C: +c.C.toFixed(3) })) };
  if (opts.markdown) out.markdown = mdBlock("Image palette", hs, areas, null);
  return out;
}
function pairing(spec = {}) {
  ensure();
  const F = {
    bank: spec.bank || "none",
    wf: spec.width || "none",
    cf: spec.contrast || "none",
    clsD: spec.classDisplay || "none",
    clsB: spec.classBody || "none",
    use: spec.use || "none",
    strat: spec.strategy || "contraste",
    emo: resolve(EMO, spec.intention),
    range: spec.range || "normal"
  };
  const nf = clamp(Math.round(spec.families ?? 2), 1, 5), seed = spec.seed ?? 0.5, rnd = lcg(seed, 1);
  const D = candidates("disp", F), B = candidates("body", F);
  if (!D.length || !B.length) return { error: "No families match those filters" };
  const scored = [];
  D.forEach((d) => B.forEach((b) => scored.push({ d, b, s: pairScore(d, b, F) + rnd() * 24 })));
  scored.sort((x, y) => y.s - x.s);
  const pool2 = scored.slice(0, Math.max(1, Math.min(8, scored.length))), p = pool2[Math.floor(rnd() * pool2.length)];
  const out = nf === 1 ? [p.b.role === "both" ? p.b : p.d] : [p.d, p.b];
  const extra = (slot, test) => {
    const c = candidates(slot, F).filter((f) => out.indexOf(f) < 0 && test(f));
    if (c.length) out.push(c[Math.floor(rnd() * c.length)]);
  };
  if (nf >= 3) extra("mono", () => true);
  if (nf >= 4) extra("disp", (f) => isSerif(f.cls) !== isSerif(p.b.cls));
  if (nf >= 5) extra("body", () => true);
  return { strategy: F.strat, families: out.slice(0, nf).map(fontOut) };
}
function proposals(spec = {}) {
  ensure();
  const seed = spec.seed ?? 0.5;
  const br = {
    piece: spec.piece || "none",
    sup: "none",
    e: resolve(EMO, spec.intention),
    m: resolve(MKT, spec.field),
    k: resolve(CULT, spec.culture),
    u: resolve(MUS, spec.music),
    n: clamp(Math.round(spec.colours ?? 5), 2, 6),
    nf: clamp(Math.round(spec.families ?? 2), 1, 5),
    t: clamp((spec.stance ?? 50) / 100, 0, 1),
    dc: 1,
    words: [],
    range: spec.range || "normal",
    imgBase: spec.imageColours && spec.imageColours.length ? colorsFromHex([spec.imageColours[0]])[0].a : null,
    imgType: null
  };
  const out = ANGLES.map((a, i) => {
    const p = makeProposal(a, br, seed * (i + 1) * 7.13 % 1);
    return {
      reading: p.ang.n,
      scheme: SCH[p.si].n,
      lens: LENS[p.li].n.split(" \u2014 ")[0],
      colours: p.hs.map((h, j) => enrich(h, p.areas[j])),
      families: p.fonts.map(fontOut),
      rationale: p.ang.why
    };
  });
  return { seed, proposals: out };
}
export {
  INVARIANTS,
  VERSION,
  init,
  listOptions,
  pairing,
  palette2 as palette,
  paletteFromColours,
  proposals
};
