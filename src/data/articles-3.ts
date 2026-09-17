/* ═══════════ CONTEÚDOS — terceira série ═══════════
   Cinco artigos que leem a cor e a letra como condição material e perceptiva:
   o que custa, o que o olho não faz, o que o padrão esconde e o que a máquina
   não vê. Mesmo formato das séries anteriores (ver articles.ts). */
import type { Article } from './articles';

export const ARTICLES_3: Article[] = [
{ slug: 'toda-paleta-e-um-orcamento', date: '2026-09-18', min: 8, topics: ['cor', 'cultura', 'percepcao'],
  pt: { kicker: 'Matéria', title: 'Toda paleta é um orçamento disfarçado de gosto',
    dek: 'O azul do manto da Virgem era mais caro que ouro. O roxo de 1856 saiu de alcatrão de carvão. A história da cor é a história do que era possível pagar — e isso não acabou.',
    body: `Há uma maneira confortável de contar a história da cor: como história do gosto. Uma época prefere o dourado, outra prefere o cinzento, e as preferências se sucedem por algum movimento interior do espírito. É uma história agradável e quase sempre falsa. O que muda primeiro é o preço.

## O azul que custava mais que ouro

O ultramarino vinha do lápis-lazúli, extraído em Sar-e-Sang, no que hoje é o Afeganistão, e atravessava o continente para chegar às oficinas italianas. No século XV, o contrato de encomenda de um retábulo especificava a quantidade de ultramarino em onças, como se especifica ouro, e o pigmento chegava a custar mais que o ouro em folha [1]. É por isso que o manto da Virgem é azul em tanta pintura: não por teologia exclusiva, mas porque o azul mais caro cabia à figura mais importante, e o cliente queria que se visse que havia pago.

Michel Pastoureau mostra o azul a subir de cor menor a cor dominante na Europa entre os séculos XII e XVIII [2]. A subida acompanha, passo a passo, a queda do custo do pastel e depois do índigo. A devoção seguiu a economia, e não o contrário.

> Quando uma cor fica barata, ela deixa de significar riqueza e passa a significar normalidade. É o mesmo pigmento; mudou apenas quem pode usá-lo.

## O roxo de dezoito anos

Em 1856, William Henry Perkin, com dezoito anos, tentava sintetizar quinina a partir de derivados de alcatrão de carvão e obteve um resíduo escuro que tingia seda de um violeta intenso. Chamou-lhe mauveine, patenteou e montou fábrica [3]. Em poucos anos o violeta — que durante dois milénios fora a cor do poder justamente por exigir milhares de múrices por grama de tinta — cobria a Europa em vestido de senhora de classe média.

A consequência estética é a que interessa. O violeta perdeu a gravidade que Goethe lhe atribuía. Ele havia escrito que o púrpura produz impressão de gravidade e dignidade, e que um vidro púrpura mostra a paisagem como no dia do Juízo [4]. Essa descrição era verdadeira para um olho que quase nunca via aquela cor. Um olho que a vê todos os dias sente outra coisa. O efeito sensível da cor, que Goethe descreveu com tanto rigor, não é uma constante da natureza: é uma função da frequência com que a cor aparece, e a frequência é uma função do preço.

## O orçamento de hoje

O custo não desapareceu; mudou de forma. Numa tela emissiva, a saturação é gratuita: um azul de croma alto ocupa os mesmos bits que um cinzento. Em impressão de quatro cores, o mesmo azul fica na borda da gama e exige tinta adicional ou substrato melhor. Em vídeo comprimido, a granulação fina que assina superfície é a primeira coisa que o codificador descarta, porque é ruído de alta frequência e o orçamento de bits é finito.

Ou seja: continuamos a escolher entre cores que a cadeia de produção oferece a preços diferentes. A diferença é que o preço agora está em gama, em bits e em contrato de licença, e não em onças de pedra moída. Por ser invisível na fatura, é mais fácil confundi-lo com gosto.

## O que isto pede a quem desenha

Duas disciplinas.

A primeira é perguntar, diante de qualquer paleta admirada, o que é que a tornou possível. Se a resposta for "a tela", há uma probabilidade alta de que ela se desfaça no papel. Se a resposta for "o papel", ela costuma sobreviver a tudo.

A segunda é medir em vez de confiar. Neste instrumento, as cores vivem num espaço perceptivo e a redução de croma é feita por busca binária, nunca por corte: quando um matiz não cabe, ele perde saturação até caber, mantendo o tom. É uma decisão orçamentária disfarçada de decisão técnica, que é como as boas decisões orçamentárias costumam aparecer.

O gosto é real. Só chega depois.`,
    refs: [
      { n: 'Baxandall, M. *Painting and Experience in Fifteenth-Century Italy*. Oxford: Oxford University Press, 1972.', u: 'https://global.oup.com/academic/product/painting-and-experience-in-fifteenth-century-italy-9780198813587' },
      { n: 'Pastoureau, M. *Blue: The History of a Color*. Princeton: Princeton University Press, 2001.', u: 'https://press.princeton.edu/books/hardcover/9780691090504/blue' },
      { n: 'Garfield, S. *Mauve: How One Man Invented a Color That Changed the World*. Nova Iorque: W. W. Norton, 2001.' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*, § 792–799. Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Finlay, V. *Colour: Travels Through the Paintbox*. Londres: Sceptre, 2002.' },
      { n: 'Ball, P. *Bright Earth: Art and the Invention of Color*. Chicago: University of Chicago Press, 2003.', u: 'https://press.uchicago.edu/ucp/books/book/chicago/B/bo3616076.html' } ],
    seo: { kw: 'história dos pigmentos custo da cor', title: 'Toda paleta é um orçamento: o preço por trás da história da cor', desc: 'Ultramarino, mauveine, gama de impressão e orçamento de bits: por que o custo do pigmento decide o gosto de uma época, e não o contrário.',
      outline: ['O azul que custava mais que ouro', 'O roxo de dezoito anos', 'O orçamento de hoje', 'O que isto pede a quem desenha'], links: ['Cores', 'Tendências'] },
    music: { title: 'Música para os Reais Fogos de Artifício', artist: 'Georg Friedrich Händel', why: 'Encomenda régia, orquestra cara, efeito calculado para impressionar quem pagou. Ouvir é entender o argumento do texto.', q: 'Handel Music for the Royal Fireworks' } },
  en: { kicker: 'Matter', title: 'Every palette is a budget dressed up as taste',
    dek: 'The blue of the Virgin\'s mantle cost more than gold. The purple of 1856 came out of coal tar. The history of colour is the history of what could be afforded — and that has not ended.',
    body: `There is a comfortable way to tell the history of colour: as a history of taste. One age prefers gilding, another prefers grey, and the preferences succeed one another through some inner movement of the spirit. It is a pleasant history and almost always false. What changes first is the price.

## The blue that cost more than gold

Ultramarine came from lapis lazuli, mined at Sar-e-Sang in what is now Afghanistan, and crossed the continent to reach the Italian workshops. In the fifteenth century the contract for an altarpiece specified ultramarine by the ounce, as one specifies gold, and the pigment could cost more than gold leaf [1]. That is why the Virgin's mantle is blue in so much painting: not from exclusive theology, but because the most expensive blue belonged to the most important figure, and the client wanted it seen that he had paid.

Michel Pastoureau shows blue rising from a minor colour to a dominant one in Europe between the twelfth and eighteenth centuries [2]. The rise tracks, step by step, the falling cost of woad and then of indigo. Devotion followed the economy, not the other way round.

> When a colour becomes cheap it stops meaning wealth and starts meaning normality. It is the same pigment; only who may use it has changed.

## The purple of an eighteen-year-old

In 1856 William Henry Perkin, aged eighteen, was trying to synthesise quinine from coal-tar derivatives and obtained a dark residue that dyed silk an intense violet. He called it mauveine, patented it and built a factory [3]. Within a few years violet — which for two millennia had been the colour of power precisely because it demanded thousands of murex shells per gram of dye — covered Europe in middle-class dresses.

The aesthetic consequence is the interesting part. Violet lost the gravity Goethe had assigned it. He had written that purple produces an impression of gravity and dignity, and that a purple glass shows the landscape as on the Day of Judgement [4]. That description was true for an eye that almost never saw the colour. An eye that sees it daily feels something else. The sensuous effect of colour, which Goethe described with such rigour, is not a constant of nature: it is a function of how often the colour appears, and frequency is a function of price.

## Today's budget

Cost has not vanished; it has changed form. On an emissive screen, saturation is free: a high-chroma blue occupies the same bits as a grey. In four-colour print the same blue sits at the edge of gamut and demands an additional ink or a better substrate. In compressed video, the fine grain that signs a surface is the first thing the encoder discards, because it is high-frequency noise and the bit budget is finite.

We are still, in other words, choosing among colours that the production chain offers at different prices. The difference is that the price now sits in gamut, in bits and in a licence agreement rather than in ounces of ground stone. Being invisible on the invoice, it is easier to mistake for taste.

## What this asks of anyone who designs

Two disciplines.

The first is to ask, of any admired palette, what made it possible. If the answer is "the screen", there is a high probability it falls apart on paper. If the answer is "the paper", it usually survives everything.

The second is to measure rather than trust. In this instrument colours live in a perceptual space and chroma reduction is done by binary search, never by clipping: when a hue will not fit, it loses saturation until it does, keeping its tone. It is a budgetary decision dressed as a technical one, which is how good budgetary decisions usually appear.

Taste is real. It just arrives afterwards.`,
    refs: [
      { n: 'Baxandall, M. *Painting and Experience in Fifteenth-Century Italy*. Oxford: Oxford University Press, 1972.', u: 'https://global.oup.com/academic/product/painting-and-experience-in-fifteenth-century-italy-9780198813587' },
      { n: 'Pastoureau, M. *Blue: The History of a Color*. Princeton: Princeton University Press, 2001.', u: 'https://press.princeton.edu/books/hardcover/9780691090504/blue' },
      { n: 'Garfield, S. *Mauve: How One Man Invented a Color That Changed the World*. New York: W. W. Norton, 2001.' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*, § 792–799. Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Finlay, V. *Colour: Travels Through the Paintbox*. London: Sceptre, 2002.' },
      { n: 'Ball, P. *Bright Earth: Art and the Invention of Color*. Chicago: University of Chicago Press, 2003.', u: 'https://press.uchicago.edu/ucp/books/book/chicago/B/bo3616076.html' } ],
    seo: { kw: 'pigment history cost of colour', title: 'Every palette is a budget: the price behind the history of colour', desc: 'Ultramarine, mauveine, print gamut and bit budgets: why the cost of pigment decides the taste of an age, and not the other way round.',
      outline: ['The blue that cost more than gold', 'The purple of an eighteen-year-old', 'Today\'s budget', 'What this asks of anyone who designs'], links: ['Colour', 'Trends'] },
    music: { title: 'Music for the Royal Fireworks', artist: 'George Frideric Handel', why: 'A royal commission, an expensive orchestra, an effect calculated to impress the man who paid. Hearing it is understanding the argument.', q: 'Handel Music for the Royal Fireworks' } } },

{ slug: 'o-modo-escuro-nao-e-uma-inversao', date: '2026-09-25', min: 8, topics: ['cor', 'percepcao'],
  pt: { kicker: 'Instrumento', title: 'O modo escuro não é uma inversão, e tratá-lo como inversão é um erro de aritmética',
    dek: 'Trocar o claro pelo escuro e manter os mesmos matizes produz um tema que mede bem e lê mal. O olho não é simétrico, e Goethe já tinha dito por quê.',
    body: `A maneira mais comum de fazer um tema escuro é aritmética: pega-se a paleta clara, espelha-se a luminosidade, ajusta-se o que reprovar no teste de contraste e publica-se. O resultado passa na verificação automática e incomoda quem usa. A causa não é gosto nem hábito. É que a operação pressupõe um olho simétrico, e o olho não é.

## Três assimetrias

**O texto claro sobre fundo escuro espalha-se.** A luz de um glifo branco invade a área escura à volta pela dispersão dentro do próprio olho; o efeito, chamado halação, engorda o traço e fecha as contraformas. Quem tem astigmatismo não corrigido vê isto de forma acentuada, e é muita gente [1]. A consequência prática é que o mesmo peso tipográfico não é o mesmo peso nos dois temas: um texto que está certo em regular sobre branco costuma pedir um grau abaixo sobre preto.

**A cor perde croma aparente quando o entorno escurece.** A demonstração clássica é a de Bartleson e Breneman, que mediram como o contraste aparente das cores de uma imagem cai conforme o ambiente de visualização escurece [2]. Uma paleta que parecia viva no tema claro fica fraca no escuro sem ter mudado um único valor de matiz ou de saturação.

**O branco puro num fundo preto brilha mais do que o preto puro escurece.** A relação entre luminância física e claridade percebida não é linear, e os dois extremos não se comportam como espelhos um do outro [3].

> Um tema escuro correto não é a paleta clara ao contrário. É uma segunda paleta, feita para um segundo observador.

## Goethe, outra vez, antes do instrumento

Na *Farbenlehre*, Goethe dedica páginas às sombras coloridas e à persistência da imagem: uma superfície cinzenta parece azulada quando iluminada por luz de vela, o olho pede a oposta da cor que acabou de ver, e uma cor sobre fundo escuro não produz a mesma sensação que sobre fundo claro [4]. Ele não dispunha da palavra "contexto", mas o argumento inteiro do livro é que a cor não existe isolada: existe sempre contra alguma coisa. A cor é fenómeno de fronteira, e trocar o fundo é trocar a fronteira.

O erro do modo escuro por inversão é, portanto, um erro newtoniano no pior sentido: trata a cor como um número que se pode mover livremente, em vez de uma relação que só existe entre dois termos.

## O que fazer em vez disso

Quatro regras que se seguem directamente das assimetrias acima.

Primeiro, **não espelhe a luminosidade; reconstrua-a.** Num espaço perceptivo como o OKLab, mova o L por decisão, avaliando cada degrau, em vez de aplicar 1 − L a toda a escala.

Segundo, **suba um pouco o croma dos acentos no tema escuro** para compensar a perda aparente medida por Bartleson e Breneman — e depois verifique de novo o contraste, porque croma alto num fundo escuro pode fazer o par vibrar.

Terceiro, **evite os dois extremos absolutos.** Um cinzento muito escuro em vez de preto puro e um branco levemente reduzido cortam a halação sem custo de legibilidade.

Quarto, **meça o par, não a cor.** Neste instrumento o contraste é calculado sobre as cores reais, com o preto e o branco tratados como cores plenas e não como ausências. É a única forma de saber que um tema escuro funciona, porque é a única coisa nele que não depende do observador.

O modo escuro não é uma preferência estética com custo zero. É um segundo sistema, com o dobro do trabalho e metade do reconhecimento. Publicá-lo por inversão é o mesmo que publicar meio sistema.`,
    refs: [
      { n: 'Piepenbrock, C.; Mayr, S.; Buchner, A. "Positive Display Polarity Is Particularly Advantageous for Small Character Sizes". *Human Factors*, 56(5), 2014.', u: 'https://doi.org/10.1177/0018720813515967' },
      { n: 'Bartleson, C. J.; Breneman, E. J. "Brightness Perception in Complex Fields". *Journal of the Optical Society of America*, 57(7), 1967.', u: 'https://doi.org/10.1364/JOSA.57.000953' },
      { n: 'Fairchild, M. D. *Color Appearance Models*, 3.ª ed. Chichester: Wiley, 2013.', u: 'https://onlinelibrary.wiley.com/doi/book/10.1002/9781118653128' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*, § 1–135 (cores fisiológicas). Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'W3C. *Web Content Accessibility Guidelines 2.1*, critério 1.4.3.', u: 'https://www.w3.org/TR/WCAG21/' },
      { n: 'Ottosson, B. "A perceptual color space for image processing" (OKLab), 2020.', u: 'https://bottosson.github.io/posts/oklab/' } ],
    seo: { kw: 'modo escuro contraste percepção', title: 'O modo escuro não é uma inversão: halação, croma e o erro de espelhar a paleta', desc: 'Por que espelhar a luminosidade produz um tema escuro que mede bem e lê mal, e o que fazer em OKLab para corrigir.',
      outline: ['Três assimetrias', 'Goethe, outra vez, antes do instrumento', 'O que fazer em vez disso'], links: ['Cores', 'Teoria'] },
    music: { title: 'Nocturnos', artist: 'Frédéric Chopin', why: 'Música escrita para o escuro que não é a música do dia tocada mais baixo. A analogia é exactamente essa.', q: 'Chopin Nocturnes' } },
  en: { kicker: 'Instrument', title: 'Dark mode is not an inversion, and treating it as one is an arithmetic error',
    dek: 'Swapping light for dark while keeping the same hues produces a theme that measures well and reads badly. The eye is not symmetrical, and Goethe had already said why.',
    body: `The most common way to make a dark theme is arithmetic: take the light palette, mirror the lightness, fix whatever fails the contrast check and ship it. The result passes the automated audit and irritates the people using it. The cause is neither taste nor habit. It is that the operation assumes a symmetrical eye, and the eye is not.

## Three asymmetries

**Light text on a dark ground spreads.** The light of a white glyph bleeds into the dark area around it through scatter inside the eye itself; the effect, called halation, thickens the stroke and closes the counters. Anyone with uncorrected astigmatism sees this pronouncedly, and that is a great many people [1]. The practical consequence is that the same typographic weight is not the same weight in both themes: text that is right in regular on white usually asks for a step lighter on black.

**Colour loses apparent chroma as the surround darkens.** The classic demonstration is Bartleson and Breneman's, measuring how the apparent contrast of the colours in an image falls as the viewing environment darkens [2]. A palette that looked alive in the light theme goes flat in the dark one without a single hue or saturation value having changed.

**Pure white on black glares more than pure black darkens.** The relation between physical luminance and perceived lightness is not linear, and the two extremes do not behave as mirrors of each other [3].

> A correct dark theme is not the light palette turned around. It is a second palette, made for a second observer.

## Goethe, again, before the instrument

In the *Farbenlehre* Goethe gives pages to coloured shadows and to the persistence of the image: a grey surface looks bluish under candlelight, the eye demands the opposite of the colour it has just seen, and a colour on a dark ground does not produce the same sensation as on a light one [4]. He had no word for "context", but the whole argument of the book is that colour does not exist in isolation: it always exists against something. Colour is a boundary phenomenon, and changing the ground is changing the boundary.

The error of dark-mode-by-inversion is therefore a Newtonian error in the worst sense: it treats colour as a number that can be moved freely, rather than as a relation that exists only between two terms.

## What to do instead

Four rules, following directly from the asymmetries above.

First, **do not mirror lightness; rebuild it.** In a perceptual space such as OKLab, move L by decision, judging each step, rather than applying 1 − L across the whole scale.

Second, **raise the chroma of accents slightly in the dark theme** to offset the apparent loss Bartleson and Breneman measured — then check contrast again, because high chroma on a dark ground can make the pair vibrate.

Third, **avoid both absolute extremes.** A very dark grey instead of pure black and a slightly reduced white cut halation at no cost in legibility.

Fourth, **measure the pair, not the colour.** In this instrument contrast is computed on the real colours, with black and white treated as full colours rather than as absences. It is the only way to know a dark theme works, because it is the only thing in it that does not depend on the observer.

Dark mode is not a zero-cost aesthetic preference. It is a second system, with twice the work and half the credit. Shipping it by inversion is shipping half a system.`,
    refs: [
      { n: 'Piepenbrock, C.; Mayr, S.; Buchner, A. "Positive Display Polarity Is Particularly Advantageous for Small Character Sizes". *Human Factors*, 56(5), 2014.', u: 'https://doi.org/10.1177/0018720813515967' },
      { n: 'Bartleson, C. J.; Breneman, E. J. "Brightness Perception in Complex Fields". *Journal of the Optical Society of America*, 57(7), 1967.', u: 'https://doi.org/10.1364/JOSA.57.000953' },
      { n: 'Fairchild, M. D. *Color Appearance Models*, 3rd ed. Chichester: Wiley, 2013.', u: 'https://onlinelibrary.wiley.com/doi/book/10.1002/9781118653128' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*, § 1–135 (physiological colours). Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'W3C. *Web Content Accessibility Guidelines 2.1*, success criterion 1.4.3.', u: 'https://www.w3.org/TR/WCAG21/' },
      { n: 'Ottosson, B. "A perceptual color space for image processing" (OKLab), 2020.', u: 'https://bottosson.github.io/posts/oklab/' } ],
    seo: { kw: 'dark mode contrast perception', title: 'Dark mode is not an inversion: halation, chroma and the mirrored-palette error', desc: 'Why mirroring lightness produces a dark theme that measures well and reads badly, and what to do in OKLab instead.',
      outline: ['Three asymmetries', 'Goethe, again, before the instrument', 'What to do instead'], links: ['Colour', 'Theory'] },
    music: { title: 'Nocturnes', artist: 'Frédéric Chopin', why: 'Music written for the dark that is not daytime music played quieter. That is exactly the analogy.', q: 'Chopin Nocturnes' } } },

{ slug: 'a-visao-que-chamamos-de-excecao', date: '2026-10-02', min: 7, topics: ['cor', 'percepcao', 'educacao'],
  pt: { kicker: 'Olho', title: 'A visão que chamamos de excepção é o caso normal',
    dek: 'Cerca de um em cada doze homens não separa o vermelho do verde. Goethe descreveu dois deles em 1810. Uma paleta que precisa do matiz para dizer o que quer dizer não diz nada.',
    body: `Os números são conhecidos e continuam a ser tratados como nota de rodapé: a deficiência de visão de cores atinge cerca de 8% dos homens de ascendência do norte europeu e cerca de 0,5% das mulheres, sobretudo nas formas em que o vermelho e o verde se aproximam [1]. Num público de mil pessoas, são dezenas. Numa equipa de vinte, é provável que seja alguém na sala.

Chamar a isto excepção é uma escolha de vocabulário com consequências de engenharia.

## Goethe foi ver

A *Farbenlehre* tem uma secção que raramente se cita. Goethe descreve dois homens que não viam o azul como os outros — chamou-lhes acianoblépticos — e relata as suas confusões com paciência clínica: o que chamavam de rosa, o que trocavam, o que acertavam sempre [2]. Estava errado sobre o mecanismo, que só seria compreendido depois de Young e Helmholtz. Mas fez a coisa certa: em vez de descartar os casos que não cabiam no esquema, foi falar com eles e anotou o que diziam.

É esse o método que o livro defende do princípio ao fim. Olhar antes de explicar. Aplicado aqui, quer dizer: a percepção de cor não tem um observador padrão de quem os outros são desvios. Tem uma distribuição, e a distribuição é conhecida.

> Um sistema que só funciona para a visão mediana não é um sistema. É uma aposta com probabilidade declarada de falhar em um utilizador em doze.

## O que falha, concretamente

Falha sempre a mesma coisa: informação codificada apenas em matiz. O estado vermelho e o estado verde no mesmo formato e no mesmo peso. A série de linhas de um gráfico distinguida só por cor. O campo obrigatório assinalado por contorno vermelho. O botão perigoso e o botão seguro à mesma luminosidade.

Repare que nenhum destes casos é uma questão de simulação de daltonismo em ferramenta. Todos se detectam antes, com uma pergunta de uma linha: *se esta imagem fosse impressa a preto e branco, ainda se percebia?* Se a resposta for não, o problema existe para toda a gente numa fotocópia, num projector fraco e ao sol — e existe permanentemente para uma parte do público.

## A regra que resolve quase tudo

Separar por luminosidade, não por matiz. Duas cores que diferem em L num espaço perceptivo continuam distintas para qualquer tipo de visão de cores, porque a via acromática está intacta em todas as formas comuns de deficiência. Duas cores que só diferem em matiz podem colapsar numa só.

Neste instrumento, isso é mensurável: o contraste é calculado sobre as cores reais segundo a WCAG 2.1, e há simulação dos tipos de visão sobre a paleta gerada. Não é um recurso de conformidade. É a forma mais rápida de descobrir que o par bonito que escolheu carrega zero de informação.

## E depois há o segundo público

Vale dizer a parte menos confortável. O argumento acima não precisa de apelo moral para se sustentar, e é melhor que não precise: sistemas que só se defendem por virtude são os primeiros a ser cortados. Este defende-se por robustez. Uma paleta separada por luminosidade sobrevive ao ecrã calibrado e ao ecrã barato, à impressão a cores e à fotocópia, ao dia claro e à noite, ao olho de vinte anos e ao de setenta, onde a lente amarelece e o azul se apaga.

Desenhar para a distribuição inteira não é generosidade. É a única forma de não desenhar para uma pessoa imaginária.`,
    refs: [
      { n: 'Birch, J. "Worldwide prevalence of red-green color deficiency". *Journal of the Optical Society of America A*, 29(3), 2012.', u: 'https://doi.org/10.1364/JOSAA.29.000313' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*, § 103–115 (casos de acianoblepsia). Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Sharpe, L. T. et al. "Opsin genes, cone photopigments, color vision and color blindness", em Gegenfurtner, K.; Sharpe, L. T. (orgs.), *Color Vision*. Cambridge University Press, 1999.' },
      { n: 'Brettel, H.; Viénot, F.; Mollon, J. D. "Computerized simulation of color appearance for dichromats". *JOSA A*, 14(10), 1997.', u: 'https://doi.org/10.1364/JOSAA.14.002647' },
      { n: 'W3C. *Web Content Accessibility Guidelines 2.1*, critérios 1.4.1 e 1.4.3.', u: 'https://www.w3.org/TR/WCAG21/' },
      { n: 'Werner, J. S. "Development of scotopic sensitivity and the absorption spectrum of the human ocular media". *JOSA*, 72(2), 1982.', u: 'https://doi.org/10.1364/JOSA.72.000247' } ],
    seo: { kw: 'daltonismo design de paleta', title: 'A visão que chamamos de excepção é o caso normal', desc: 'Um em cada doze homens não separa vermelho de verde. Por que separar por luminosidade, e não por matiz, resolve quase todos os casos.',
      outline: ['Goethe foi ver', 'O que falha, concretamente', 'A regra que resolve quase tudo', 'E depois há o segundo público'], links: ['Cores', 'Teoria'] },
    music: { title: 'Sonatas e Interlúdios para piano preparado', artist: 'John Cage', why: 'Um instrumento alterado que obriga a ouvir pelo ritmo e pela textura quando a altura deixa de ser fiável. É a mesma transposição.', q: 'John Cage Sonatas and Interludes' } },
  en: { kicker: 'Eye', title: 'The vision we call an exception is the normal case',
    dek: 'About one man in twelve does not separate red from green. Goethe described two of them in 1810. A palette that needs hue to say what it means says nothing.',
    body: `The numbers are well known and are still treated as a footnote: colour-vision deficiency affects around 8% of men of northern European descent and around 0.5% of women, mostly in the forms where red and green converge [1]. In an audience of a thousand, that is dozens. On a team of twenty, it is probably someone in the room.

Calling this an exception is a choice of vocabulary with engineering consequences.

## Goethe went and looked

The *Farbenlehre* has a section that is rarely quoted. Goethe describes two men who did not see blue as others did — he called them acyanoblepts — and reports their confusions with clinical patience: what they called pink, what they mixed up, what they always got right [2]. He was wrong about the mechanism, which would only be understood after Young and Helmholtz. But he did the right thing: instead of discarding the cases that did not fit the scheme, he went and talked to them and wrote down what they said.

That is the method the book argues for from beginning to end. Look before you explain. Applied here it means: colour perception does not have a standard observer from whom the others are deviations. It has a distribution, and the distribution is known.

> A system that works only for median vision is not a system. It is a bet with a declared probability of failing for one user in twelve.

## What fails, concretely

The same thing always fails: information encoded in hue alone. The red state and the green state at the same shape and the same weight. A chart's series distinguished only by colour. The required field marked by a red outline. The dangerous button and the safe button at the same lightness.

Note that none of these cases is a matter of running a colour-blindness simulator. All of them are caught earlier, with a one-line question: *if this image were printed in black and white, would it still read?* If the answer is no, the problem exists for everyone on a photocopy, on a weak projector and in sunlight — and it exists permanently for part of the audience.

## The rule that solves almost everything

Separate by lightness, not by hue. Two colours differing in L in a perceptual space remain distinct for any kind of colour vision, because the achromatic pathway is intact in all common forms of deficiency. Two colours differing only in hue can collapse into one.

In this instrument that is measurable: contrast is computed on the real colours under WCAG 2.1, and the generated palette can be simulated across vision types. It is not a compliance feature. It is the fastest way to discover that the handsome pair you chose carries zero information.

## And then there is the second audience

The less comfortable part is worth saying. The argument above needs no moral appeal to stand, and it is better that it does not: systems defended only by virtue are the first to be cut. This one is defended by robustness. A palette separated by lightness survives the calibrated screen and the cheap screen, colour print and the photocopy, daylight and night, the eye of twenty and the eye of seventy, where the lens yellows and blue fades.

Designing for the whole distribution is not generosity. It is the only way not to design for an imaginary person.`,
    refs: [
      { n: 'Birch, J. "Worldwide prevalence of red-green color deficiency". *Journal of the Optical Society of America A*, 29(3), 2012.', u: 'https://doi.org/10.1364/JOSAA.29.000313' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*, § 103–115 (cases of acyanoblepsia). Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Sharpe, L. T. et al. "Opsin genes, cone photopigments, color vision and color blindness", in Gegenfurtner, K.; Sharpe, L. T. (eds.), *Color Vision*. Cambridge University Press, 1999.' },
      { n: 'Brettel, H.; Viénot, F.; Mollon, J. D. "Computerized simulation of color appearance for dichromats". *JOSA A*, 14(10), 1997.', u: 'https://doi.org/10.1364/JOSAA.14.002647' },
      { n: 'W3C. *Web Content Accessibility Guidelines 2.1*, success criteria 1.4.1 and 1.4.3.', u: 'https://www.w3.org/TR/WCAG21/' },
      { n: 'Werner, J. S. "Development of scotopic sensitivity and the absorption spectrum of the human ocular media". *JOSA*, 72(2), 1982.', u: 'https://doi.org/10.1364/JOSA.72.000247' } ],
    seo: { kw: 'colour blindness palette design', title: 'The vision we call an exception is the normal case', desc: 'One man in twelve does not separate red from green. Why separating by lightness rather than hue solves almost every case.',
      outline: ['Goethe went and looked', 'What fails, concretely', 'The rule that solves almost everything', 'And then there is the second audience'], links: ['Colour', 'Theory'] },
    music: { title: 'Sonatas and Interludes for prepared piano', artist: 'John Cage', why: 'An altered instrument that forces you to listen by rhythm and texture when pitch stops being reliable. The same transposition.', q: 'John Cage Sonatas and Interludes' } } },

{ slug: 'a-neutralidade-e-uma-posicao', date: '2026-10-09', min: 7, topics: ['tipografia', 'cultura'],
  pt: { kicker: 'Letra', title: 'A neutralidade é uma posição, e quase sempre a de outra pessoa',
    dek: 'Não existe letra sem sotaque. O que chamamos de neutro é o sotaque que ouvimos tantas vezes que deixámos de notar — e ele foi definido por alguém, num sítio, com um propósito.',
    body: `Há um pedido que aparece em quase todos os processos: "queremos uma tipografia neutra". Quem pede quer dizer que não quer chamar a atenção. O que está a pedir, sem saber, é que a decisão seja tomada por outro.

## O neutro tem data e morada

A grotesca suíça que serve de definição operacional de neutro nasceu em 1957, entre Münchenstein e Paris, num programa estético com posição declarada: objectividade, grelha, ausência de ornamento, retirada do autor [1]. Era uma posição forte, defendida em manifestos, contra outra posição. Chamar-lhe ausência de estilo é aceitar a vitória de um lado como se fosse a paisagem.

O mesmo vale para o que se lê em ecrã. As famílias de sistema — as que aparecem quando ninguém escolhe — são desenhos específicos, encomendados por empresas específicas para resolver problemas específicos de renderização em ecrãs específicos [2]. São excelentes, e são de alguém. A escolha por omissão transfere autoridade para a última pessoa que definiu o valor por defeito, e essa pessoa não estava a pensar no seu texto.

> Não escolher é escolher, com a diferença de que não se sabe o que foi escolhido nem porquê.

## Por que o neutro parou de funcionar

Há um argumento prático, além do histórico. Um traço é distintivo enquanto é escasso. Quando a competência para produzir grotescas limpas deixa de ser escassa — e deixou —, a grotesca limpa passa a comunicar exactamente uma coisa: que ninguém decidiu nada. O silêncio só é silêncio quando há som à volta; num quarto insonorizado, ele deixa de significar.

Isto não é um convite à excentricidade. A letra peculiar que não sobrevive ao tamanho de texto é um acento, não um sistema, e vender um acento como sistema é o erro simétrico.

## O que substitui o pedido de neutralidade

Três perguntas melhores que "é neutra?".

**Aguenta a distância?** Uma família cujo desenho se desfaz entre 9 e 11 pontos não serve de texto, por mais bonita que seja em título. Teste primeiro no tamanho em que vai ser lida durante horas, não no tamanho em que vai ser apresentada durante dez segundos.

**Aguenta o par?** O emparelhamento não se resolve por gosto: resolve-se por altura de x compatível, por eixo de contraste que não se contradiz e por uma diferença de classe grande o suficiente para se ver que foi de propósito. Duas grotescas parecidas não são um par; são um erro tipográfico distribuído por todo o documento.

**Aguenta dez anos?** É a pergunta que separa um sistema de uma tendência. Uma família que se vai poder licenciar, com faixa de pesos larga e manutenção activa, vale mais que um desenho brilhante e órfão.

## O que Goethe tem a ver com isto

Mais do que parece. O argumento central da *Farbenlehre* é que não há percepção sem relação: uma cor só existe contra outra, e o cinzento parece azul ou amarelo consoante o que está ao lado [3]. Não há cor neutra, há cor não contrastada. A letra comporta-se da mesma maneira. Uma família parece neutra porque o que está à volta a torna assim, e mudar o entorno chega para lhe devolver o sotaque.

Peça, então, outra coisa. Peça uma letra que não se intrometa, que é diferente de uma letra que não decide nada.`,
    refs: [
      { n: 'Hollis, R. *Swiss Graphic Design: The Origins and Growth of an International Style, 1920–1965*. New Haven: Yale University Press, 2006.' },
      { n: 'Coles, S. *The Anatomy of Type*. Nova Iorque: Harper Design, 2012.' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*, § 1–135. Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Lupton, E. *Thinking with Type*, 2.ª ed. Nova Iorque: Princeton Architectural Press, 2010.', u: 'https://papress.com/products/thinking-with-type-revised-and-expanded' },
      { n: 'Kinross, R. *Modern Typography: An Essay in Critical History*. Londres: Hyphen Press, 1992.', u: 'https://hyphenpress.co.uk/products/books/978-0-907259-18-9' },
      { n: 'Unger, G. *Theory of Type Design*. Roterdão: nai010, 2018.', u: 'https://www.nai010.com/en/publicaties/theory-of-type-design/216561' } ],
    seo: { kw: 'tipografia neutra escolha', title: 'A neutralidade é uma posição: por que não existe letra sem sotaque', desc: 'Onde nasceu o neutro tipográfico, por que deixou de funcionar e que três perguntas substituem o pedido de uma fonte neutra.',
      outline: ['O neutro tem data e morada', 'Por que o neutro parou de funcionar', 'O que substitui o pedido de neutralidade', 'O que Goethe tem a ver com isto'], links: ['Tipografia', 'Teoria'] },
    music: { title: 'Música para aeroportos', artist: 'Brian Eno', why: 'Feita para não se impor e, por isso mesmo, cheia de decisões. É a diferença entre discreto e indeciso.', q: 'Brian Eno Music for Airports' } },
  en: { kicker: 'Letter', title: 'Neutrality is a position, and almost always somebody else\'s',
    dek: 'There is no letterform without an accent. What we call neutral is the accent we have heard so often that we stopped noticing — and it was set by someone, somewhere, for a purpose.',
    body: `One request appears in almost every process: "we want a neutral typeface". The person asking means they do not want to draw attention. What they are asking, without knowing it, is for the decision to be taken by someone else.

## The neutral has a date and an address

The Swiss grotesque that serves as the operational definition of neutral was born in 1957, between Münchenstein and Paris, inside an aesthetic programme with a declared position: objectivity, the grid, absence of ornament, withdrawal of the author [1]. It was a strong position, argued in manifestos, against another position. Calling it an absence of style is to accept one side's victory as though it were the landscape.

The same holds on screen. The system families — the ones that appear when nobody chooses — are specific designs, commissioned by specific companies to solve specific rendering problems on specific screens [2]. They are excellent, and they belong to someone. Choosing by default transfers authority to the last person who set the default, and that person was not thinking about your text.

> Not choosing is choosing, with the difference that you do not know what was chosen, or why.

## Why the neutral stopped working

There is a practical argument as well as a historical one. A stroke is distinctive while it is scarce. When the competence to produce clean grotesques stops being scarce — and it has — the clean grotesque comes to communicate exactly one thing: that nobody decided anything. Silence is only silence when there is sound around it; in a soundproofed room it stops meaning.

This is not an invitation to eccentricity. An odd letterform that does not survive text size is an accent, not a system, and selling an accent as a system is the symmetrical mistake.

## What replaces the request for neutrality

Three better questions than "is it neutral?".

**Does it hold the distance?** A family whose design falls apart between 9 and 11 point will not serve as text, however handsome it is in display. Test first at the size it will be read at for hours, not the size it will be presented at for ten seconds.

**Does it hold the pair?** Pairing is not settled by taste: it is settled by compatible x-heights, by a contrast axis that does not contradict itself, and by a difference of class wide enough to show it was deliberate. Two similar grotesques are not a pair; they are a typographic error distributed across a whole document.

**Does it hold ten years?** That is the question separating a system from a trend. A family you will still be able to license, with a wide weight range and active maintenance, is worth more than a brilliant orphan.

## What Goethe has to do with it

More than it seems. The central argument of the *Farbenlehre* is that there is no perception without relation: a colour exists only against another, and grey looks blue or yellow depending on what sits beside it [3]. There is no neutral colour, only uncontrasted colour. Letterforms behave the same way. A family looks neutral because what surrounds it makes it so, and changing the surroundings is enough to give it back its accent.

So ask for something else. Ask for a letter that does not intrude, which is not the same as a letter that decides nothing.`,
    refs: [
      { n: 'Hollis, R. *Swiss Graphic Design: The Origins and Growth of an International Style, 1920–1965*. New Haven: Yale University Press, 2006.' },
      { n: 'Coles, S. *The Anatomy of Type*. New York: Harper Design, 2012.' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*, § 1–135. Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Lupton, E. *Thinking with Type*, 2nd ed. New York: Princeton Architectural Press, 2010.', u: 'https://papress.com/products/thinking-with-type-revised-and-expanded' },
      { n: 'Kinross, R. *Modern Typography: An Essay in Critical History*. London: Hyphen Press, 1992.', u: 'https://hyphenpress.co.uk/products/books/978-0-907259-18-9' },
      { n: 'Unger, G. *Theory of Type Design*. Rotterdam: nai010, 2018.', u: 'https://www.nai010.com/en/publicaties/theory-of-type-design/216561' } ],
    seo: { kw: 'neutral typeface choice', title: 'Neutrality is a position: why there is no letterform without an accent', desc: 'Where the typographic neutral was born, why it stopped working, and the three questions that replace asking for a neutral font.',
      outline: ['The neutral has a date and an address', 'Why the neutral stopped working', 'What replaces the request for neutrality', 'What Goethe has to do with it'], links: ['Typography', 'Theory'] },
    music: { title: 'Music for Airports', artist: 'Brian Eno', why: 'Made not to impose and, for that very reason, full of decisions. That is the difference between discreet and undecided.', q: 'Brian Eno Music for Airports' } } },

{ slug: 'a-cor-que-a-maquina-nao-tem', date: '2026-10-16', min: 8, topics: ['cor', 'percepcao', 'espirito'],
  pt: { kicker: 'Método', title: 'A máquina não tem cor: tem coordenadas',
    dek: 'Um modelo que gera paletas produz valores plausíveis a uma velocidade que nenhum estúdio acompanha. O que ele não tem é um olho cansado, um entorno e um corpo. Sobre o que resta ao humano na escolha da cor.',
    body: `Pedir uma paleta a um modelo de linguagem devolve, em segundos, seis valores hexadecimais razoáveis, com nomes e justificação. É rápido, é barato e, na maior parte dos casos, é aceitável. Vale a pena perceber exactamente o que aconteceu, porque o que aconteceu não foi ver.

## O que o modelo faz

Um modelo treinado em texto e imagem aprendeu correlações entre palavras e valores: que "confiança" aparece perto de azuis de luminosidade média, que "artesanal" aparece perto de ocres, que paletas publicadas juntas tendem a partilhar certas distâncias. Ele devolve a média do que foi publicado, ponderada pelo pedido. É uma operação de recuperação estatística, e é honesta desde que se saiba que é isso.

Daí decorrem duas consequências previsíveis. A primeira é a convergência: pedidos semelhantes produzem resultados semelhantes, e a paisagem visual de um sector converge mais depressa do que convergiria por imitação humana. A segunda é a ausência de contexto físico: o modelo não sabe em que ecrã, com que luz ambiente, a que distância e a que hora aquilo vai ser visto. E a cor, como a *Farbenlehre* argumenta em cada capítulo, não existe fora dessas condições [1].

> O modelo conhece todas as cores que já foram descritas. Não conhece nenhuma cor que esteja a ser vista.

## A parte que não se automatiza

Não é a geração. É o juízo, e o juízo tem três componentes que não estão no texto de treino.

**O corpo.** A pós-imagem, a fadiga do olho depois de vinte minutos de vermelho saturado, a halação do branco sobre preto, o amarelecimento do cristalino com a idade. Goethe começou o livro pelas cores fisiológicas — as que o olho produz e nenhum objecto contém — precisamente porque são a prova de que o observador entra na equação [1].

**O entorno.** A mesma amostra muda de identidade conforme o que está ao lado; as sombras coloridas que Goethe descreveu ao entardecer são o caso-limite [1]. Nenhum valor hexadecimal carrega a sua vizinhança.

**A consequência.** Uma cor num sistema significa, e significar tem custo: o vermelho que assinala erro não pode ser o vermelho que decora, e escolher qual é qual é uma decisão sobre o que acontece a quem se enganar.

## O que fazer com a ferramenta, então

Usá-la onde ela é boa, e medir onde ela é cega.

Um modelo é excelente a produzir variedade e péssimo a garantir relações. Portanto: peça-lhe candidatos, muitos, e depois submeta cada candidato a uma prova que não depende de opinião. Contraste medido sobre as cores reais. Separação em luminosidade, não só em matiz. Comportamento do croma quando a cor não cabe na gama — reduzir por busca, nunca cortar, porque cortar muda o tom e não só a intensidade. Geometria preservada no círculo, de modo que a oposta continue a ser a oposta.

É esta a divisão de trabalho que este instrumento assume. A máquina propõe coordenadas; o olho decide; o número verifica. Nenhum dos três chega sozinho.

## Uma nota final, e não é nostalgia

Goethe passou vinte anos a olhar para bordas de sombra e para cartões brancos e escreveu, no fim, que a sua conquista era ter visto. O argumento não é que a ferramenta seja má nem que a lentidão seja virtuosa. É que a velocidade resolveu a parte barata do problema — a geração — e deixou intacta a parte cara, que é responder por uma escolha diante de olhos concretos, em condições concretas, com consequências concretas.

Essa parte continua a ser sua. É também a única que alguém lhe vai pedir para explicar.`,
    refs: [
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*, § 1–135 e § 62–80. Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Ottosson, B. "A perceptual color space for image processing" (OKLab), 2020.', u: 'https://bottosson.github.io/posts/oklab/' },
      { n: 'Fairchild, M. D. *Color Appearance Models*, 3.ª ed. Chichester: Wiley, 2013.', u: 'https://onlinelibrary.wiley.com/doi/book/10.1002/9781118653128' },
      { n: 'Wittgenstein, L. *Remarks on Colour* (org. G. E. M. Anscombe). Oxford: Blackwell, 1977.' },
      { n: 'Bender, E. M. et al. "On the Dangers of Stochastic Parrots". *FAccT \'21*, 2021.', u: 'https://doi.org/10.1145/3442188.3445922' },
      { n: 'W3C. *Web Content Accessibility Guidelines 2.1*, critério 1.4.3.', u: 'https://www.w3.org/TR/WCAG21/' } ],
    seo: { kw: 'inteligência artificial paleta de cores', title: 'A máquina não tem cor: tem coordenadas', desc: 'O que um modelo faz quando gera uma paleta, o que ele não pode fazer, e como dividir o trabalho entre proposta automática, olho e medição.',
      outline: ['O que o modelo faz', 'A parte que não se automatiza', 'O que fazer com a ferramenta, então', 'Uma nota final, e não é nostalgia'], links: ['Cores', 'Teoria'] },
    music: { title: 'As Variações Goldberg (1981)', artist: 'Johann Sebastian Bach / Glenn Gould', why: 'A mesma partitura gravada duas vezes pelo mesmo intérprete, com trinta anos de diferença. As notas são idênticas; o juízo não.', q: 'Glenn Gould Goldberg Variations 1981' } },
  en: { kicker: 'Method', title: 'The machine has no colour: it has coordinates',
    dek: 'A model that generates palettes produces plausible values faster than any studio can follow. What it does not have is a tired eye, a surround and a body. On what is left to the human in choosing colour.',
    body: `Asking a language model for a palette returns, in seconds, six reasonable hexadecimal values, with names and a rationale. It is fast, it is cheap and, in most cases, it is acceptable. It is worth understanding exactly what happened, because what happened was not seeing.

## What the model does

A model trained on text and images has learned correlations between words and values: that "trust" appears near mid-lightness blues, that "handmade" appears near ochres, that palettes published together tend to share certain distances. It returns the average of what has been published, weighted by the request. It is a statistical retrieval operation, and it is honest as long as you know that is what it is.

Two predictable consequences follow. The first is convergence: similar requests produce similar results, and a sector's visual landscape converges faster than it would by human imitation. The second is the absence of physical context: the model does not know on which screen, in what ambient light, at what distance and at what hour the thing will be seen. And colour, as the *Farbenlehre* argues in every chapter, does not exist outside those conditions [1].

> The model knows every colour that has been described. It knows no colour that is being seen.

## The part that does not automate

It is not generation. It is judgement, and judgement has three components absent from the training text.

**The body.** The after-image, the fatigue of the eye after twenty minutes of saturated red, the halation of white on black, the yellowing of the lens with age. Goethe opened the book with the physiological colours — the ones the eye produces and no object contains — precisely because they are the proof that the observer enters the equation [1].

**The surround.** The same swatch changes identity according to what sits beside it; the coloured shadows Goethe described at dusk are the limit case [1]. No hexadecimal value carries its neighbourhood with it.

**The consequence.** A colour in a system means something, and meaning has a cost: the red that flags an error cannot be the red that decorates, and choosing which is which is a decision about what happens to whoever gets it wrong.

## What to do with the tool, then

Use it where it is good, and measure where it is blind.

A model is excellent at producing variety and poor at guaranteeing relations. So: ask it for candidates, many of them, then put each candidate through a test that does not depend on opinion. Contrast measured on the real colours. Separation in lightness, not only in hue. The behaviour of chroma when a colour will not fit the gamut — reduce by search, never clip, because clipping changes the tone and not just the intensity. Geometry preserved on the circle, so that the opposite remains the opposite.

That is the division of labour this instrument assumes. The machine proposes coordinates; the eye decides; the number verifies. None of the three suffices alone.

## A closing note, and it is not nostalgia

Goethe spent twenty years looking at shadow edges and white cards and wrote, at the end, that his achievement was having seen. The argument is not that the tool is bad or that slowness is virtuous. It is that speed solved the cheap part of the problem — generation — and left the expensive part intact, which is answering for a choice in front of concrete eyes, in concrete conditions, with concrete consequences.

That part is still yours. It is also the only part anyone will ask you to explain.`,
    refs: [
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*, § 1–135 and § 62–80. Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Ottosson, B. "A perceptual color space for image processing" (OKLab), 2020.', u: 'https://bottosson.github.io/posts/oklab/' },
      { n: 'Fairchild, M. D. *Color Appearance Models*, 3rd ed. Chichester: Wiley, 2013.', u: 'https://onlinelibrary.wiley.com/doi/book/10.1002/9781118653128' },
      { n: 'Wittgenstein, L. *Remarks on Colour* (ed. G. E. M. Anscombe). Oxford: Blackwell, 1977.' },
      { n: 'Bender, E. M. et al. "On the Dangers of Stochastic Parrots". *FAccT \'21*, 2021.', u: 'https://doi.org/10.1145/3442188.3445922' },
      { n: 'W3C. *Web Content Accessibility Guidelines 2.1*, success criterion 1.4.3.', u: 'https://www.w3.org/TR/WCAG21/' } ],
    seo: { kw: 'artificial intelligence colour palette', title: 'The machine has no colour: it has coordinates', desc: 'What a model does when it generates a palette, what it cannot do, and how to divide the work between automatic proposal, eye and measurement.',
      outline: ['What the model does', 'The part that does not automate', 'What to do with the tool, then', 'A closing note, and it is not nostalgia'], links: ['Colour', 'Theory'] },
    music: { title: 'The Goldberg Variations (1981)', artist: 'Johann Sebastian Bach / Glenn Gould', why: 'The same score recorded twice by the same performer, thirty years apart. The notes are identical; the judgement is not.', q: 'Glenn Gould Goldberg Variations 1981' } } }
];
