/* ═══════════ CONTEÚDOS — artigos ═══════════
   Cada artigo existe nas duas línguas. O corpo usa uma marcação mínima:
   "## " título de seção, "> " citação destacada, parágrafos separados por linha
   em branco, **negrito**, *itálico* e [n] para a referência de número n.
   As referências são obras publicadas, com editor e ano; os links apontam para
   páginas institucionais ou DOIs. As datas são as de publicação nesta revista. */
export type Topic = 'cor' | 'tipografia' | 'percepcao' | 'educacao' | 'cultura' | 'espirito';
export interface Ref { n: string; u?: string }
export interface Music { title: string; artist: string; why: string; q: string }
export interface Seo { kw: string; title: string; desc: string; outline: string[]; links: string[] }
export interface ArticleText { title: string; kicker: string; dek: string; body: string; refs: Ref[]; seo: Seo; music: Music }
export interface Article { slug: string; date: string; min: number; topics: Topic[]; pt: ArticleText; en: ArticleText }

export const TOPICS: { k: Topic; pt: string; en: string }[] = [
  { k: 'cor', pt: 'Cor', en: 'Colour' }, { k: 'tipografia', pt: 'Tipografia', en: 'Typography' }, { k: 'percepcao', pt: 'Percepção', en: 'Perception' },
  { k: 'educacao', pt: 'Educação', en: 'Education' }, { k: 'cultura', pt: 'Cultura', en: 'Culture' }, { k: 'espirito', pt: 'Espírito', en: 'Spirit' }
];

import { ARTICLES_2 } from './articles-2';
import { ARTICLES_3 } from './articles-3';
const ARTICLES_1: Article[] = [
{ slug: 'goethe-e-as-cores', date: '2026-08-14', min: 7, topics: ['cor', 'percepcao', 'cultura'],
  pt: { kicker: 'Origens', title: 'Quem é Goethe e o que ele tem a ver com as cores?',
    dek: 'O autor de Fausto passou vinte anos olhando para prismas, sombras e céus. O que ele viu ainda organiza a roda que gira dentro deste instrumento.',
    body: `Johann Wolfgang von Goethe nasceu em Frankfurt em 1749 e morreu em Weimar em 1832. É lembrado como poeta, romancista e dramaturgo, mas ele mesmo, já velho, disse que de tudo o que fizera como poeta não se orgulhava tanto; o que considerava sua conquista era ser, no seu século, o único a ver a verdade na difícil ciência das cores [1].

A frase soa exagerada, e era. Mas ela mostra o tamanho do investimento. Entre 1790 e 1810, Goethe fez centenas de experimentos com prismas, lentes, cartões brancos e pretos, sombras ao entardecer e cristais coloridos. Publicou o resultado em 1810, em dois volumes, com o título *Zur Farbenlehre*, a Doutrina das Cores [1].

## A briga com Newton

Um século antes, Isaac Newton havia mostrado que a luz branca, ao passar por um prisma, se abre num espectro de cores, e que cada cor corresponde a um grau de refração diferente [2]. A física aceitou isso, e continua aceitando.

Goethe repetiu o experimento e viu outra coisa. Olhando *através* do prisma para uma parede branca, não via cor nenhuma; a cor só aparecia nas bordas, onde o claro encontrava o escuro. Para ele, a cor não estava contida na luz, mas nascia do encontro entre luz e escuridão, mediado por um meio turvo: o ar, a água, o vidro [1].

> A cor é um fenômeno de fronteira. Ela acontece onde o claro e o escuro se tocam.

Como física, a explicação de Goethe não se sustentou. Os historiadores da ciência são claros sobre isso [3]. Mas ele não estava, no fundo, fazendo física. Estava descrevendo o que o olho vê, e nisso foi rigoroso, sistemático e, em muitos pontos, certeiro.

## O que ficou

Três coisas da *Farbenlehre* sobreviveram e chegaram até aqui.

A primeira é o **círculo de seis cores**, com o amarelo e o azul como polos primários, o vermelho como intensificação de ambos, e cada cor de frente para a que a completa. Goethe chamou isso de totalidade: o olho, diante de uma cor, pede a oposta [1]. É o fenômeno da pós-imagem, e é também a raiz de todo esquema complementar.

A segunda é a ideia de que as cores têm um **efeito sensível e moral**: o amarelo alegra, o azul recua e chama, o púrpura impõe. Goethe organizou essas observações na última parte do livro, e elas atravessaram os séculos até chegar à sala de aula de Johannes Itten na Bauhaus e, de lá, ao design contemporâneo.

A terceira é o **método**: olhar antes de explicar. Wittgenstein, que leu a *Farbenlehre* com atenção, anotou que Goethe não oferecia uma teoria, mas uma descrição do que vemos, e que isso era outra coisa, e valiosa [4].

## Por que ele está neste instrumento

A roda que gera as paletas de Auge tem seis âncoras, cada uma de frente para a sua oposta a 180 graus. As cores intermediárias são interpoladas num espaço perceptivo, não numa fórmula de comprimento de onda. Isso é Goethe, não Newton: a paleta é feita para o olho, e o olho é o juiz.

Ele estava errado sobre a física. Estava certo sobre a experiência. Para quem escolhe cores, a experiência é o que importa.`,
    refs: [
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*. Tübingen: Cotta, 1810. Edição digital no Deutsches Textarchiv.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Newton, I. *Opticks*. Londres, 1704. Edição digital no Project Gutenberg.', u: 'https://www.gutenberg.org/ebooks/33504' },
      { n: 'Sepper, D. L. *Goethe contra Newton: Polemics and the Project for a New Science of Color*. Cambridge University Press, 1988.', u: 'https://www.cambridge.org/core/books/goethe-contra-newton/' },
      { n: 'Wittgenstein, L. *Remarks on Colour* (org. G. E. M. Anscombe). Oxford: Blackwell, 1977.' },
      { n: 'Goethe, J. W. von. *Theory of Colours* (trad. C. L. Eastlake, 1840). Cambridge, MA: MIT Press, 1970.', u: 'https://mitpress.mit.edu/9780262570213/theory-of-colours/' },
      { n: 'Stanford Encyclopedia of Philosophy. "Johann Wolfgang von Goethe".', u: 'https://plato.stanford.edu/entries/goethe/' } ],
    seo: { kw: 'Goethe teoria das cores', title: 'Goethe e as cores: o que a Doutrina das Cores ainda ensina', desc: 'Quem foi Goethe, por que discutiu com Newton e o que da sua Doutrina das Cores (1810) sobrevive no design de paletas hoje.',
      outline: ['A briga com Newton', 'O que ficou: círculo, efeito sensível e método', 'Por que ele está neste instrumento'], links: ['Cores', 'Teoria'] },
    music: { title: 'Lieder sobre poemas de Goethe', artist: 'Franz Schubert', why: 'Schubert musicou dezenas de poemas de Goethe. O ciclo combina com a leitura: lento, atento, em alemão.', q: 'Schubert Goethe Lieder' } },
  en: { kicker: 'Origins', title: 'Who is Goethe, and what does he have to do with colour?',
    dek: 'The author of Faust spent twenty years looking at prisms, shadows and skies. What he saw still organises the wheel that turns inside this instrument.',
    body: `Johann Wolfgang von Goethe was born in Frankfurt in 1749 and died in Weimar in 1832. He is remembered as a poet, novelist and playwright, but late in life he said that of everything he had done as a poet he was not especially proud; what he counted as his achievement was being, in his century, the only one to see the truth in the difficult science of colour [1].

The claim sounds excessive, and it was. But it shows the size of the investment. Between 1790 and 1810 Goethe ran hundreds of experiments with prisms, lenses, white and black cards, shadows at dusk and coloured crystals. He published the result in 1810, in two volumes, under the title *Zur Farbenlehre*, the Theory of Colours [1].

## The quarrel with Newton

A century earlier, Isaac Newton had shown that white light, passing through a prism, opens into a spectrum, and that each colour corresponds to a different degree of refraction [2]. Physics accepted this, and still does.

Goethe repeated the experiment and saw something else. Looking *through* the prism at a white wall he saw no colour at all; colour appeared only at the edges, where light met dark. For him colour was not contained in light but born of the meeting between light and darkness, mediated by a turbid medium: air, water, glass [1].

> Colour is a boundary phenomenon. It happens where light and dark touch.

As physics, Goethe's explanation did not hold. Historians of science are clear on this [3]. But he was not, at bottom, doing physics. He was describing what the eye sees, and there he was rigorous, systematic and, on many points, right.

## What survived

Three things from the *Farbenlehre* survived and reached this page.

The first is the **six-colour circle**, with yellow and blue as the primary poles, red as the intensification of both, and each colour facing the one that completes it. Goethe called this totality: the eye, faced with a colour, demands its opposite [1]. It is the after-image, and it is also the root of every complementary scheme.

The second is the idea that colours have a **sensuous and moral effect**: yellow cheers, blue recedes and beckons, purple commands. Goethe set these observations in the last part of the book, and they crossed the centuries to reach Johannes Itten's classroom at the Bauhaus and, from there, contemporary design.

The third is the **method**: look before you explain. Wittgenstein, who read the *Farbenlehre* closely, noted that Goethe was not offering a theory but a description of what we see, and that this was something else, and valuable [4].

## Why he is in this instrument

The wheel that generates Auge's palettes has six anchors, each facing its opposite at 180 degrees. The colours in between are interpolated in a perceptual space, not by a wavelength formula. That is Goethe, not Newton: the palette is made for the eye, and the eye is the judge.

He was wrong about the physics. He was right about the experience. For anyone choosing colours, the experience is what counts.`,
    refs: [
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*. Tübingen: Cotta, 1810. Digital edition at the Deutsches Textarchiv.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Newton, I. *Opticks*. London, 1704. Digital edition at Project Gutenberg.', u: 'https://www.gutenberg.org/ebooks/33504' },
      { n: 'Sepper, D. L. *Goethe contra Newton: Polemics and the Project for a New Science of Color*. Cambridge University Press, 1988.', u: 'https://www.cambridge.org/core/books/goethe-contra-newton/' },
      { n: 'Wittgenstein, L. *Remarks on Colour* (ed. G. E. M. Anscombe). Oxford: Blackwell, 1977.' },
      { n: 'Goethe, J. W. von. *Theory of Colours* (trans. C. L. Eastlake, 1840). Cambridge, MA: MIT Press, 1970.', u: 'https://mitpress.mit.edu/9780262570213/theory-of-colours/' },
      { n: 'Stanford Encyclopedia of Philosophy. "Johann Wolfgang von Goethe".', u: 'https://plato.stanford.edu/entries/goethe/' } ],
    seo: { kw: 'Goethe theory of colours', title: 'Goethe and colour: what the Theory of Colours still teaches', desc: 'Who Goethe was, why he quarrelled with Newton, and what from his Theory of Colours (1810) survives in palette design today.',
      outline: ['The quarrel with Newton', 'What survived: circle, sensuous effect and method', 'Why he is in this instrument'], links: ['Colour', 'Theory'] },
    music: { title: 'Lieder on poems by Goethe', artist: 'Franz Schubert', why: 'Schubert set dozens of Goethe poems to music. The cycle suits the reading: slow, attentive, in German.', q: 'Schubert Goethe Lieder' } } },

{ slug: 'as-cores-sao-um-fenomeno', date: '2026-08-21', min: 8, topics: ['cor', 'percepcao'],
  pt: { kicker: 'Percepção', title: 'As cores são um fenômeno?',
    dek: 'Está na luz, no objeto, no olho ou na cabeça? A pergunta tem trezentos anos e quatro respostas boas. Nenhuma delas resolve sozinha o que um designer precisa decidir.',
    body: `Pegue um tomate. Ele é vermelho? A física dirá que a sua casca reflete mais luz de comprimento de onda longo do que de curto. A fisiologia dirá que essa luz excita mais um tipo de cone na retina do que os outros dois. A filosofia perguntará onde, nessa cadeia, mora a vermelhidão. E o designer, que precisa entregar o cartaz amanhã, perguntará por que o vermelho do tomate fica marrom quando impresso em papel reciclado.

A palavra *fenômeno* vem do grego *phainómenon*, o que aparece. Chamar a cor de fenômeno não é diminuí-la: é dizer que ela é, antes de tudo, algo que aparece a alguém. A questão é o que mais ela é.

## Quatro respostas

**Física.** Newton mostrou em 1704 que a luz branca contém todas as cores e que um prisma as separa [1]. Para o físico, a cor é uma propriedade da luz: um comprimento de onda ou uma mistura deles.

**Fisiológica.** Ewald Hering, em 1878, notou que ninguém vê um vermelho esverdeado nem um amarelo azulado, e propôs que o sistema visual organiza as cores em pares opostos [2]. Isso foi confirmado um século depois. As cores que vemos não são o espectro; são o que a retina e o cérebro fazem dele.

**Contextual.** Edwin Land, o inventor da Polaroid, mostrou em 1977 que o mesmo pedaço de papel parece de cores diferentes conforme o que o cerca, mesmo com a luz idêntica [3]. A cor de uma coisa depende da cena inteira. Todo esquema de paleta é, na prática, uma aposta sobre esse efeito.

**Filosófica.** Há quem diga que as cores são propriedades reais das superfícies, quem diga que são disposições para causar experiências, e quem diga que só existem na mente [4]. A discussão segue aberta na *Stanford Encyclopedia of Philosophy* [5], e não vai fechar amanhã.

> Ninguém vê um vermelho esverdeado. Isso não está na luz: está em nós.

## O que Goethe diria

Goethe recusaria a pergunta como está posta. Para ele, a cor era um acontecimento entre luz, escuridão, meio e olho, e separar um desses termos era perder o fenômeno [6]. A fenomenologia do século XX, com Merleau-Ponty, retomou essa posição de outro ângulo: a cor não é um dado que recebemos, é uma forma de estarmos no mundo [7].

## O que isso muda para quem desenha

Três consequências práticas.

A primeira: **um código hex não é uma cor**. É uma instrução para um dispositivo. A cor acontece na tela, na luz da sala, ao lado das outras cores. Por isso este instrumento mostra cada paleta em dez arranjos diferentes.

A segunda: **a razão de contraste é uma medida de luminância, não de legibilidade**. Ela prevê bem, mas não prevê tudo. Sempre olhe.

A terceira: **o contexto vence a tabela**. Uma cor "calma" ao lado de um vermelho saturado deixa de ser calma. O esquema é a unidade, não o tom isolado.

A cor é um fenômeno, sim. E é também física, fisiologia e cultura ao mesmo tempo. Quem escolhe cores trabalha nessa interseção, queira ou não.`,
    refs: [
      { n: 'Newton, I. *Opticks*. Londres, 1704.', u: 'https://www.gutenberg.org/ebooks/33504' },
      { n: 'Hering, E. *Zur Lehre vom Lichtsinne*. Viena: Gerold, 1878.' },
      { n: 'Land, E. H. "The Retinex Theory of Color Vision". *Scientific American*, 237(6), 1977.', u: 'https://www.scientificamerican.com/article/the-retinex-theory-of-color-vision/' },
      { n: 'Byrne, A.; Hilbert, D. R. "Color realism and color science". *Behavioral and Brain Sciences*, 26(1), 2003.', u: 'https://doi.org/10.1017/S0140525X03000013' },
      { n: 'Stanford Encyclopedia of Philosophy. "Color".', u: 'https://plato.stanford.edu/entries/color/' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*. Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Merleau-Ponty, M. *Phénoménologie de la perception*. Paris: Gallimard, 1945.' } ],
    seo: { kw: 'cor é um fenômeno', title: 'As cores são um fenômeno? Física, fisiologia e percepção', desc: 'Onde mora a cor: na luz, no olho, no contexto ou na mente. Quatro respostas e o que elas mudam para quem desenha paletas.',
      outline: ['Quatro respostas', 'O que Goethe diria', 'O que isso muda para quem desenha'], links: ['Cores', 'Teoria'] },
    music: { title: 'Music for Airports', artist: 'Brian Eno', why: 'Música feita para ser ambiente, como a cor é feita para ser contexto. Não pede atenção; muda a sala.', q: 'Brian Eno Music for Airports' } },
  en: { kicker: 'Perception', title: 'Are colours a phenomenon?',
    dek: 'Is it in the light, the object, the eye or the head? The question is three hundred years old and has four good answers. None of them alone settles what a designer has to decide.',
    body: `Take a tomato. Is it red? Physics will say its skin reflects more long-wavelength light than short. Physiology will say that light excites one type of cone in the retina more than the other two. Philosophy will ask where, along that chain, redness lives. And the designer, who has to deliver the poster tomorrow, will ask why the tomato's red turns brown when printed on recycled paper.

The word *phenomenon* comes from the Greek *phainómenon*, that which appears. To call colour a phenomenon is not to diminish it: it is to say that it is, first of all, something that appears to someone. The question is what else it is.

## Four answers

**Physical.** Newton showed in 1704 that white light contains all colours and that a prism separates them [1]. For the physicist, colour is a property of light: a wavelength or a mixture of them.

**Physiological.** Ewald Hering noticed in 1878 that nobody sees a greenish red or a bluish yellow, and proposed that the visual system organises colour in opposing pairs [2]. This was confirmed a century later. The colours we see are not the spectrum; they are what retina and brain make of it.

**Contextual.** Edwin Land, the inventor of the Polaroid, showed in 1977 that the same patch of paper looks a different colour depending on what surrounds it, even under identical light [3]. The colour of a thing depends on the whole scene. Every palette scheme is, in practice, a bet on this effect.

**Philosophical.** Some say colours are real properties of surfaces, some that they are dispositions to cause experiences, some that they exist only in the mind [4]. The debate is open in the *Stanford Encyclopedia of Philosophy* [5] and will not close tomorrow.

> Nobody sees a greenish red. That is not in the light: it is in us.

## What Goethe would say

Goethe would refuse the question as posed. For him colour was an event between light, darkness, medium and eye, and to separate one of those terms was to lose the phenomenon [6]. Twentieth-century phenomenology, with Merleau-Ponty, took up that position from another angle: colour is not a datum we receive but a way of being in the world [7].

## What this changes for anyone who designs

Three practical consequences.

First: **a hex code is not a colour**. It is an instruction to a device. The colour happens on the screen, in the light of the room, next to the other colours. That is why this instrument shows every palette in ten different arrangements.

Second: **a contrast ratio measures luminance, not legibility**. It predicts well, but not everything. Always look.

Third: **context beats the table**. A "calm" colour next to a saturated red stops being calm. The scheme is the unit, not the isolated tone.

Colour is a phenomenon, yes. It is also physics, physiology and culture at once. Whoever chooses colours works at that intersection, whether they like it or not.`,
    refs: [
      { n: 'Newton, I. *Opticks*. London, 1704.', u: 'https://www.gutenberg.org/ebooks/33504' },
      { n: 'Hering, E. *Zur Lehre vom Lichtsinne*. Vienna: Gerold, 1878.' },
      { n: 'Land, E. H. "The Retinex Theory of Color Vision". *Scientific American*, 237(6), 1977.', u: 'https://www.scientificamerican.com/article/the-retinex-theory-of-color-vision/' },
      { n: 'Byrne, A.; Hilbert, D. R. "Color realism and color science". *Behavioral and Brain Sciences*, 26(1), 2003.', u: 'https://doi.org/10.1017/S0140525X03000013' },
      { n: 'Stanford Encyclopedia of Philosophy. "Color".', u: 'https://plato.stanford.edu/entries/color/' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*. Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Merleau-Ponty, M. *Phénoménologie de la perception*. Paris: Gallimard, 1945.' } ],
    seo: { kw: 'is colour a phenomenon', title: 'Are colours a phenomenon? Physics, physiology and perception', desc: 'Where colour lives: in light, in the eye, in context or in the mind. Four answers and what they change for anyone designing palettes.',
      outline: ['Four answers', 'What Goethe would say', 'What this changes for anyone who designs'], links: ['Colour', 'Theory'] },
    music: { title: 'Music for Airports', artist: 'Brian Eno', why: 'Music made to be ambient, as colour is made to be context. It does not ask for attention; it changes the room.', q: 'Brian Eno Music for Airports' } } },

{ slug: 'tipografia-e-compreensao', date: '2026-08-28', min: 7, topics: ['tipografia', 'percepcao'],
  pt: { kicker: 'Leitura', title: 'Como a tipografia influencia a sua compreensão de um conteúdo?',
    dek: 'Mudar a fonte não muda as palavras. Muda quanto esforço você faz para lê-las, quanto acredita nelas e quanto lembra depois. Há medidas para cada uma dessas coisas.',
    body: `Você já leu este parágrafo até aqui sem pensar na fonte. É assim que a tipografia funciona quando funciona: desaparece. Mas ela não é neutra. Três linhas de pesquisa, com métodos diferentes, mostram que a forma das letras interfere no que entendemos, no que acreditamos e no que retemos.

## Esforço: a fluência de leitura

Psicólogos chamam de *fluência de processamento* a facilidade com que o cérebro lida com um estímulo. Em 2008, Song e Schwarz deram a dois grupos as mesmas instruções de exercício físico, uma em fonte limpa, outra em fonte difícil. Quem leu a versão difícil estimou que o exercício levaria quase o dobro do tempo e se mostrou menos disposto a fazê-lo [1]. O texto era o mesmo. A fonte mudou o julgamento sobre o conteúdo.

O efeito se estende à credibilidade: o que é fácil de ler parece mais verdadeiro. Isso é bom para quem quer ser lido e perigoso para quem quer ser criticado.

## Retenção: a dificuldade desejável

O contrário também acontece. Em 2011, Diemand-Yauman, Oppenheimer e Vaughan mostraram que alunos que estudaram material em fontes ligeiramente mais difíceis de ler lembraram mais no teste, tanto no laboratório quanto em salas de aula reais [2]. A hipótese é que o pequeno atrito força um processamento mais profundo.

> Fácil de ler parece verdadeiro. Um pouco difícil de ler fica na memória. A tipografia escolhe entre os dois.

Estudos posteriores nem sempre replicaram o efeito, e ele parece depender do quanto o leitor já está motivado. Mas a lição prática se mantém: a legibilidade máxima nem sempre é o objetivo.

## Tamanho, medida e entrelinha

Legge e Bigelow reuniram um século de medições e concluíram que existe uma faixa de tamanho, entre cerca de 0,2 e 2 graus de ângulo visual, em que a velocidade de leitura é máxima e estável [3]. Abaixo disso, cai rápido. Acima, cai devagar. Em tela, para leitura contínua, isso costuma dar entre 16 e 22 pixels.

A medida (a largura da linha) e a entrelinha mudam menos a velocidade do que se pensa, mas mudam o conforto e a taxa de erro no retorno da linha. Bringhurst recomenda entre 45 e 75 caracteres por linha [4]; a hierarquia deste instrumento nasce com 62 e deixa você mover.

## Forma: serifa ou não?

A pergunta mais feita e a menos importante. As diferenças entre serifadas e sem serifa bem desenhadas são pequenas e dependem do meio, do tamanho e do leitor [5]. O que pesa mais é a distinção entre letras parecidas (I, l, 1; a, e, o), a abertura das formas e o espaço entre elas. Sofie Beier resume: a familiaridade é o maior preditor de legibilidade [5].

## Na prática

Uma fonte clara e um tamanho generoso quando você quer ser aceito. Um pouco de atrito, ou uma mudança de fonte, quando quer que algo seja notado e lembrado. Medida entre 45 e 75. E, sempre, testar com a pessoa que vai ler, não só com quem desenha.

A página de Tipografia deste instrumento mede tamanho, medida e razão de contraste enquanto você mexe. O resto é olhar.`,
    refs: [
      { n: 'Song, H.; Schwarz, N. "If It\'s Hard to Read, It\'s Hard to Do". *Psychological Science*, 19(10), 2008.', u: 'https://doi.org/10.1111/j.1467-9280.2008.02189.x' },
      { n: 'Diemand-Yauman, C.; Oppenheimer, D. M.; Vaughan, E. B. "Fortune favors the bold (and the italicized)". *Cognition*, 118(1), 2011.', u: 'https://doi.org/10.1016/j.cognition.2010.09.012' },
      { n: 'Legge, G. E.; Bigelow, C. A. "Does print size matter for reading?". *Journal of Vision*, 11(5), 2011.', u: 'https://doi.org/10.1167/11.5.8' },
      { n: 'Bringhurst, R. *The Elements of Typographic Style*. Vancouver: Hartley & Marks, 4.ª ed., 2012.' },
      { n: 'Beier, S. *Reading Letters: Designing for Legibility*. Amsterdã: BIS Publishers, 2012.' },
      { n: 'Butterick, M. *Practical Typography*.', u: 'https://practicaltypography.com/' } ],
    seo: { kw: 'tipografia e compreensão de leitura', title: 'Como a tipografia influencia a compreensão do que você lê', desc: 'Fluência, dificuldade desejável, tamanho e medida: o que a pesquisa mostra sobre como a forma das letras muda entendimento, crença e memória.',
      outline: ['Esforço: a fluência de leitura', 'Retenção: a dificuldade desejável', 'Tamanho, medida e entrelinha', 'Forma: serifa ou não?', 'Na prática'], links: ['Tipografia', 'Criação'] },
    music: { title: 'Spaces', artist: 'Nils Frahm', why: 'Piano com respiração: pausas longas, sem letra, no andamento de quem lê.', q: 'Nils Frahm Spaces' } },
  en: { kicker: 'Reading', title: 'How does typography shape your understanding of a text?',
    dek: 'Changing the typeface does not change the words. It changes how hard you work to read them, how much you believe them and how much you remember afterwards. There are measurements for each of these.',
    body: `You have read this paragraph so far without thinking about the typeface. That is how typography works when it works: it disappears. But it is not neutral. Three lines of research, with different methods, show that the shape of letters interferes with what we understand, what we believe and what we retain.

## Effort: reading fluency

Psychologists call the ease with which the brain handles a stimulus *processing fluency*. In 2008 Song and Schwarz gave two groups the same exercise instructions, one in a clean typeface, the other in a difficult one. Those who read the difficult version estimated the exercise would take almost twice as long and were less willing to do it [1]. The text was the same. The typeface changed the judgement about the content.

The effect extends to credibility: what is easy to read seems more true. That is good for anyone who wants to be read and dangerous for anyone who wants to be questioned.

## Retention: desirable difficulty

The opposite also happens. In 2011 Diemand-Yauman, Oppenheimer and Vaughan showed that students who studied material in slightly harder-to-read typefaces remembered more in the test, both in the laboratory and in real classrooms [2]. The hypothesis is that a little friction forces deeper processing.

> Easy to read feels true. Slightly hard to read sticks in memory. Typography chooses between the two.

Later studies did not always replicate the effect, and it seems to depend on how motivated the reader already is. But the practical lesson holds: maximum legibility is not always the goal.

## Size, measure and leading

Legge and Bigelow gathered a century of measurements and concluded that there is a size range, roughly between 0.2 and 2 degrees of visual angle, in which reading speed is maximal and stable [3]. Below it, speed drops fast. Above it, slowly. On screen, for continuous reading, that usually lands between 16 and 22 pixels.

Measure (line length) and leading change speed less than people think, but they change comfort and the error rate on the return sweep. Bringhurst recommends 45 to 75 characters per line [4]; this instrument's hierarchy starts at 62 and lets you move.

## Shape: serif or not?

The most asked question and the least important. The differences between well-drawn serif and sans-serif faces are small and depend on the medium, the size and the reader [5]. What weighs more is the distinction between similar letters (I, l, 1; a, e, o), the openness of the forms and the space between them. Sofie Beier sums it up: familiarity is the strongest predictor of legibility [5].

## In practice

A clear typeface and a generous size when you want to be accepted. A little friction, or a change of typeface, when you want something noticed and remembered. Measure between 45 and 75. And, always, test with the person who will read, not only with the person who designs.

This instrument's Type page measures size, measure and contrast ratio while you adjust. The rest is looking.`,
    refs: [
      { n: 'Song, H.; Schwarz, N. "If It\'s Hard to Read, It\'s Hard to Do". *Psychological Science*, 19(10), 2008.', u: 'https://doi.org/10.1111/j.1467-9280.2008.02189.x' },
      { n: 'Diemand-Yauman, C.; Oppenheimer, D. M.; Vaughan, E. B. "Fortune favors the bold (and the italicized)". *Cognition*, 118(1), 2011.', u: 'https://doi.org/10.1016/j.cognition.2010.09.012' },
      { n: 'Legge, G. E.; Bigelow, C. A. "Does print size matter for reading?". *Journal of Vision*, 11(5), 2011.', u: 'https://doi.org/10.1167/11.5.8' },
      { n: 'Bringhurst, R. *The Elements of Typographic Style*. Vancouver: Hartley & Marks, 4th ed., 2012.' },
      { n: 'Beier, S. *Reading Letters: Designing for Legibility*. Amsterdam: BIS Publishers, 2012.' },
      { n: 'Butterick, M. *Practical Typography*.', u: 'https://practicaltypography.com/' } ],
    seo: { kw: 'typography and reading comprehension', title: 'How typography shapes your understanding of what you read', desc: 'Fluency, desirable difficulty, size and measure: what research shows about how letterforms change understanding, belief and memory.',
      outline: ['Effort: reading fluency', 'Retention: desirable difficulty', 'Size, measure and leading', 'Shape: serif or not?', 'In practice'], links: ['Type', 'Create'] },
    music: { title: 'Spaces', artist: 'Nils Frahm', why: 'Piano that breathes: long pauses, no lyrics, at the tempo of someone reading.', q: 'Nils Frahm Spaces' } } },

{ slug: 'criancas-aprendendo-a-ler', date: '2026-09-04', min: 8, topics: ['tipografia', 'educacao'],
  pt: { kicker: 'Educação', title: 'Crianças aprendendo a ler: existe uma tipografia que ajuda?',
    dek: 'Livros infantis usam letras grandes, redondas e com o "a" de uma perna só. Parte disso tem base; parte é tradição. O que a pesquisa realmente sustenta.',
    body: `Abra uma cartilha de alfabetização. As letras são grandes, sem serifa, o *a* tem uma perna só, o *g* tem uma cauda aberta. Isso é chamado de "caracteres infantis", e a justificativa é que se parecem com o que a criança aprende a escrever à mão. A tradição é forte. A evidência, menos.

## O que se sabe sobre a leitura

Antes da tipografia, vale dizer o que a ciência da leitura consolidou. Castles, Rastle e Nation, numa revisão de 2018, resumem décadas de pesquisa: aprender a ler é aprender a mapear letras em sons, e o ensino explícito dessa correspondência funciona melhor do que esperar que a criança descubra sozinha [1]. A tipografia não substitui isso. Ela pode atrapalhar ou deixar de atrapalhar.

## Tamanho e espaço: onde há evidência

Hughes e Wilkins, em 2000, testaram crianças de 5 a 11 anos com textos em tamanhos diferentes. As mais novas leram mais rápido e com menos erros em tamanhos maiores do que os usados nos livros escolares da época, que os autores julgaram subótimos [2]. Em 2009, Wilkins e colegas ampliaram o estudo e chegaram à mesma conclusão: para leitores iniciantes, letras maiores e mais espaço entre as linhas ajudam, e os livros costumam reduzir o tamanho cedo demais [3].

> Para quem está começando, o tamanho da letra importa mais do que a forma da letra.

Isso se conecta com a faixa de tamanho ideal medida por Legge e Bigelow em adultos [4]: crianças precisam de um pouco mais, porque o reconhecimento ainda é letra a letra.

## Forma: serifa, sem serifa, infantil

Reynolds e Walker, no projeto Kidstype da Universidade de Reading, compararam leitura de crianças em fontes serifadas, sem serifa e com caracteres infantis. Não encontraram diferença consistente de desempenho; as crianças tinham preferências, e as preferências variavam [5]. O *a* de uma perna só não fez ninguém ler melhor.

O que ajuda é a distinção entre letras que se confundem: *b* e *d*, *p* e *q*, *l* e *I*. Fontes desenhadas com isso em mente, como a Andika, do SIL, distinguem essas formas de propósito [6]. Atkinson Hyperlegible, do Braille Institute, faz o mesmo para leitores com baixa visão [7].

## Dislexia: cuidado com as promessas

Há fontes vendidas como "para dislexia". Rello e Baeza-Yates testaram doze famílias com leitores disléxicos e encontraram que sem serifa, monoespaçadas e romanas comuns foram lidas mais rápido, enquanto itálicas foram piores; a fonte especializada não teve vantagem [8]. O que pareceu ajudar foi o que ajuda todo mundo: tamanho, espaço e formas claras.

## Uma resposta honesta

Existe uma tipografia que ajuda crianças a ler? Sim, e ela não é exótica. Letras maiores do que se costuma usar, mais espaço entre linhas, formas abertas e distintas, medida curta. Nada disso é tendência; é higiene. O resto, inclusive o *a* de uma perna só, é questão de gosto, e o gosto das crianças conta.

Na página de Tipografia deste instrumento há um filtro de contraste e um de largura; para material infantil, comece pelo tamanho base em 20 ou mais e pela entrelinha em 1,6.`,
    refs: [
      { n: 'Castles, A.; Rastle, K.; Nation, K. "Ending the Reading Wars". *Psychological Science in the Public Interest*, 19(1), 2018.', u: 'https://doi.org/10.1177/1529100618772271' },
      { n: 'Hughes, L. E.; Wilkins, A. J. "Typography in children\'s reading schemes may be suboptimal". *Journal of Research in Reading*, 23(3), 2000.', u: 'https://doi.org/10.1111/1467-9817.00126' },
      { n: 'Wilkins, A.; Cleave, R.; Grayson, N.; Wilson, L. "Typography for children may be inappropriately designed". *Journal of Research in Reading*, 32(4), 2009.', u: 'https://doi.org/10.1111/j.1467-9817.2008.01402.x' },
      { n: 'Legge, G. E.; Bigelow, C. A. "Does print size matter for reading?". *Journal of Vision*, 11(5), 2011.', u: 'https://doi.org/10.1167/11.5.8' },
      { n: 'Walker, S.; Reynolds, L. "Serifs, sans serifs and infant characters in children\'s reading books". *Information Design Journal*, 11(2/3), 2003.' },
      { n: 'SIL International. *Andika*, família tipográfica para alfabetização.', u: 'https://software.sil.org/andika/' },
      { n: 'Braille Institute. *Atkinson Hyperlegible*.', u: 'https://www.brailleinstitute.org/freefont/' },
      { n: 'Rello, L.; Baeza-Yates, R. "Good Fonts for Dyslexia". *ASSETS \'13*, ACM, 2013.', u: 'https://doi.org/10.1145/2513383.2513447' } ],
    seo: { kw: 'tipografia para alfabetização', title: 'Tipografia para crianças aprendendo a ler: o que ajuda de verdade', desc: 'Tamanho, espaço, formas distintas e o mito dos caracteres infantis: o que a pesquisa sustenta sobre fontes para leitores iniciantes e disléxicos.',
      outline: ['O que se sabe sobre a leitura', 'Tamanho e espaço: onde há evidência', 'Forma: serifa, sem serifa, infantil', 'Dislexia: cuidado com as promessas', 'Uma resposta honesta'], links: ['Tipografia'] },
    music: { title: 'O Carnaval dos Animais', artist: 'Camille Saint-Saëns', why: 'Peça pensada para ouvidos jovens, sem ser infantil. Cada movimento é um personagem; funciona como pano de fundo.', q: 'Saint-Saëns Carnival of the Animals' } },
  en: { kicker: 'Education', title: 'Children learning to read: is there a typeface that helps?',
    dek: 'Children\'s books use large, round letters with a single-storey "a". Part of that has a basis; part is tradition. What the research actually supports.',
    body: `Open a first reader. The letters are large, sans-serif, the *a* has a single storey, the *g* an open tail. These are called "infant characters", and the justification is that they resemble what the child learns to write by hand. The tradition is strong. The evidence, less so.

## What is known about reading

Before typography, it is worth stating what the science of reading has settled. Castles, Rastle and Nation, in a 2018 review, summarise decades of research: learning to read is learning to map letters to sounds, and explicit teaching of that correspondence works better than waiting for the child to discover it alone [1]. Typography does not replace this. It can get in the way, or stay out of it.

## Size and space: where the evidence is

Hughes and Wilkins, in 2000, tested children aged 5 to 11 with texts at different sizes. The youngest read faster and with fewer errors at sizes larger than those used in the school books of the time, which the authors judged suboptimal [2]. In 2009 Wilkins and colleagues extended the study and reached the same conclusion: for beginning readers, larger letters and more space between lines help, and books tend to shrink the size too early [3].

> For beginners, the size of the letter matters more than the shape of the letter.

This connects with the optimal size range Legge and Bigelow measured in adults [4]: children need a little more, because recognition is still letter by letter.

## Shape: serif, sans, infant

Reynolds and Walker, in the Kidstype project at the University of Reading, compared children's reading in serif, sans-serif and infant-character typefaces. They found no consistent performance difference; the children had preferences, and the preferences varied [5]. The single-storey *a* made nobody read better.

What helps is the distinction between letters that get confused: *b* and *d*, *p* and *q*, *l* and *I*. Typefaces drawn with this in mind, such as SIL's Andika, distinguish those shapes on purpose [6]. Atkinson Hyperlegible, from the Braille Institute, does the same for readers with low vision [7].

## Dyslexia: beware the promises

There are typefaces sold as "for dyslexia". Rello and Baeza-Yates tested twelve families with dyslexic readers and found that common sans-serif, monospaced and roman faces were read faster, while italics were worse; the specialised typeface had no advantage [8]. What seemed to help was what helps everyone: size, space and clear shapes.

## An honest answer

Is there a typeface that helps children read? Yes, and it is not exotic. Letters larger than usual, more space between lines, open and distinct forms, a short measure. None of this is a trend; it is hygiene. The rest, including the single-storey *a*, is a matter of taste, and children's taste counts.

On this instrument's Type page there is a contrast filter and a width filter; for children's material, start with the base size at 20 or more and the line height at 1.6.`,
    refs: [
      { n: 'Castles, A.; Rastle, K.; Nation, K. "Ending the Reading Wars". *Psychological Science in the Public Interest*, 19(1), 2018.', u: 'https://doi.org/10.1177/1529100618772271' },
      { n: 'Hughes, L. E.; Wilkins, A. J. "Typography in children\'s reading schemes may be suboptimal". *Journal of Research in Reading*, 23(3), 2000.', u: 'https://doi.org/10.1111/1467-9817.00126' },
      { n: 'Wilkins, A.; Cleave, R.; Grayson, N.; Wilson, L. "Typography for children may be inappropriately designed". *Journal of Research in Reading*, 32(4), 2009.', u: 'https://doi.org/10.1111/j.1467-9817.2008.01402.x' },
      { n: 'Legge, G. E.; Bigelow, C. A. "Does print size matter for reading?". *Journal of Vision*, 11(5), 2011.', u: 'https://doi.org/10.1167/11.5.8' },
      { n: 'Walker, S.; Reynolds, L. "Serifs, sans serifs and infant characters in children\'s reading books". *Information Design Journal*, 11(2/3), 2003.' },
      { n: 'SIL International. *Andika*, a typeface for literacy.', u: 'https://software.sil.org/andika/' },
      { n: 'Braille Institute. *Atkinson Hyperlegible*.', u: 'https://www.brailleinstitute.org/freefont/' },
      { n: 'Rello, L.; Baeza-Yates, R. "Good Fonts for Dyslexia". *ASSETS \'13*, ACM, 2013.', u: 'https://doi.org/10.1145/2513383.2513447' } ],
    seo: { kw: 'typography for early readers', title: 'Typography for children learning to read: what really helps', desc: 'Size, spacing, distinct shapes and the myth of infant characters: what research supports about typefaces for beginning and dyslexic readers.',
      outline: ['What is known about reading', 'Size and space: where the evidence is', 'Shape: serif, sans, infant', 'Dyslexia: beware the promises', 'An honest answer'], links: ['Type'] },
    music: { title: 'The Carnival of the Animals', artist: 'Camille Saint-Saëns', why: 'A piece written for young ears without being childish. Each movement is a character; it works as background.', q: 'Saint-Saëns Carnival of the Animals' } } },

{ slug: 'uma-cor-que-une-o-mundo', date: '2026-09-11', min: 6, topics: ['cor', 'cultura'],
  pt: { kicker: 'Cultura', title: 'Uma cor que une o mundo',
    dek: 'Em pesquisas de opinião em dez países, a resposta é a mesma. Nas línguas, ela chega tarde. Nas bandeiras, está em quase todas. O azul é a cor mais compartilhada que temos, e isso é recente.',
    body: `Pergunte a cem pessoas qual é a sua cor favorita. Em 2015, a YouGov fez isso em dez países de quatro continentes, e em todos eles a resposta mais comum foi a mesma: azul [1]. Nenhuma outra cor chegou perto. Não é o resultado de uma campanha; é uma regularidade que se repete desde os primeiros levantamentos do século XX.

## Uma cor sem nome

O curioso é que o azul quase não existe nas línguas antigas. Berlin e Kay, em 1969, compararam os termos básicos de cor em quase cem línguas e encontraram uma ordem: toda língua tem palavras para claro e escuro; depois vem o vermelho; depois verde ou amarelo; e só então, em quinto ou sexto lugar, o azul [2]. Homero descreve o mar como "cor de vinho". O azul do céu não tinha nome próprio.

Michel Pastoureau, historiador das cores, mostra que na Europa o azul foi por séculos uma cor menor, sem valor simbólico, até que no século XII ganhou o manto da Virgem e as vidraças das catedrais, e a partir daí subiu sem parar [3]. No século XVIII já era a cor da roupa, no XX a do jeans e do uniforme, e hoje é a de quase toda interface que você usa.

> A cor mais amada do mundo é uma das últimas a ganhar nome. Aprendemos a vê-la.

## O que Goethe viu no azul

Goethe dedicou ao azul um dos parágrafos mais citados da *Farbenlehre*. Para ele, o azul tem "algo de contraditório entre excitação e repouso"; é a cor da distância, do céu e das montanhas ao longe, e por isso "parece recuar diante de nós" e, ao mesmo tempo, "nos puxar atrás dele" [4]. Kandinsky, um século depois, escreveu que o azul profundo chama o homem para o infinito [5].

Distância, calma, profundidade. Essas são as palavras que aparecem em todas as culturas onde o azul foi estudado, com pequenas variações.

## Por que ele une

Há duas explicações que não se excluem. A primeira é biológica: céu e água limpa são azuis em todos os lugares, e são quase sempre boas notícias. A segunda é histórica: o azul chegou tarde, carregado de pouco, e foi por isso a cor que sobrou para os símbolos que precisavam ser de todos. A bandeira das Nações Unidas é azul. A do Conselho da Europa é azul. Yves Klein registrou um azul como obra de arte [6]; a Pantone escolheu um azul para abrir a década de 2020 e o chamou de "clássico" [7].

## O que isso diz a quem desenha

Que o azul é seguro, e que segurança tem preço. Uma paleta azul será aceita, e será parecida com todas as outras. Na roda deste instrumento, o azul é uma das seis âncoras, de frente para o laranja-avermelhado. Se quiser ser universal, comece por ele. Se quiser ser lembrado, olhe para o outro lado.`,
    refs: [
      { n: 'YouGov. "Why is blue the world\'s favourite colour?", 2015.', u: 'https://yougov.co.uk/topics/lifestyle/articles-reports/2015/05/12/why-blue-worlds-favorite-colour' },
      { n: 'Berlin, B.; Kay, P. *Basic Color Terms: Their Universality and Evolution*. Berkeley: University of California Press, 1969.' },
      { n: 'Pastoureau, M. *Blue: The History of a Color*. Princeton: Princeton University Press, 2001.', u: 'https://press.princeton.edu/books/hardcover/9780691090504/blue' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*, § 778–785. Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Kandinsky, W. *Über das Geistige in der Kunst*. Munique: Piper, 1911. Tradução inglesa no Project Gutenberg.', u: 'https://www.gutenberg.org/ebooks/5321' },
      { n: 'Tate. "International Klein Blue".', u: 'https://www.tate.org.uk/art/artists/yves-klein-1418' },
      { n: 'Pantone. "Color of the Year 2020: Classic Blue".', u: 'https://www.pantone.com/color-of-the-year/2020' } ],
    seo: { kw: 'cor favorita do mundo azul', title: 'Uma cor que une o mundo: por que o azul é a favorita em toda parte', desc: 'Pesquisas, línguas, bandeiras e Goethe: por que o azul é a cor mais compartilhada do mundo e o que isso significa para quem desenha paletas.',
      outline: ['Uma cor sem nome', 'O que Goethe viu no azul', 'Por que ele une', 'O que isso diz a quem desenha'], links: ['Cores', 'Tendências'] },
    music: { title: 'Kind of Blue', artist: 'Miles Davis', why: 'O disco mais ouvido do jazz, e o mais azul. Modal, calmo, profundo: tudo o que o texto diz sobre a cor.', q: 'Miles Davis Kind of Blue' } },
  en: { kicker: 'Culture', title: 'One colour that unites the world',
    dek: 'In opinion polls across ten countries the answer is the same. In languages it arrives late. On flags it is nearly everywhere. Blue is the most shared colour we have, and that is recent.',
    body: `Ask a hundred people their favourite colour. In 2015 YouGov did that in ten countries on four continents, and in every one of them the most common answer was the same: blue [1]. No other colour came close. It is not the result of a campaign; it is a regularity that has repeated since the first surveys of the twentieth century.

## A colour without a name

The curious thing is that blue barely exists in ancient languages. Berlin and Kay, in 1969, compared basic colour terms in almost a hundred languages and found an order: every language has words for light and dark; then comes red; then green or yellow; and only then, in fifth or sixth place, blue [2]. Homer describes the sea as "wine-dark". The blue of the sky had no name of its own.

Michel Pastoureau, historian of colour, shows that in Europe blue was for centuries a minor colour, without symbolic weight, until in the twelfth century it took the Virgin's mantle and the cathedral windows, and from there rose without pause [3]. By the eighteenth century it was the colour of clothing, by the twentieth that of jeans and uniforms, and today it is the colour of almost every interface you use.

> The most loved colour in the world is one of the last to get a name. We learned to see it.

## What Goethe saw in blue

Goethe gave blue one of the most quoted paragraphs of the *Farbenlehre*. For him blue has "something contradictory between excitement and repose"; it is the colour of distance, of the sky and of far mountains, and so it "seems to retreat from us" and at the same time "to draw us after it" [4]. Kandinsky, a century later, wrote that deep blue calls man towards the infinite [5].

Distance, calm, depth. These are the words that appear in every culture where blue has been studied, with small variations.

## Why it unites

There are two explanations that do not exclude each other. The first is biological: sky and clean water are blue everywhere, and they are almost always good news. The second is historical: blue arrived late, carrying little, and was therefore the colour left over for the symbols that had to belong to everyone. The United Nations flag is blue. The Council of Europe's is blue. Yves Klein registered a blue as a work of art [6]; Pantone chose a blue to open the 2020s and called it "classic" [7].

## What this says to anyone who designs

That blue is safe, and that safety has a price. A blue palette will be accepted, and it will look like all the others. On this instrument's wheel, blue is one of the six anchors, facing red-orange. If you want to be universal, start there. If you want to be remembered, look the other way.`,
    refs: [
      { n: 'YouGov. "Why is blue the world\'s favourite colour?", 2015.', u: 'https://yougov.co.uk/topics/lifestyle/articles-reports/2015/05/12/why-blue-worlds-favorite-colour' },
      { n: 'Berlin, B.; Kay, P. *Basic Color Terms: Their Universality and Evolution*. Berkeley: University of California Press, 1969.' },
      { n: 'Pastoureau, M. *Blue: The History of a Color*. Princeton: Princeton University Press, 2001.', u: 'https://press.princeton.edu/books/hardcover/9780691090504/blue' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*, § 778–785. Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Kandinsky, W. *Über das Geistige in der Kunst*. Munich: Piper, 1911. English translation at Project Gutenberg.', u: 'https://www.gutenberg.org/ebooks/5321' },
      { n: 'Tate. "International Klein Blue".', u: 'https://www.tate.org.uk/art/artists/yves-klein-1418' },
      { n: 'Pantone. "Color of the Year 2020: Classic Blue".', u: 'https://www.pantone.com/color-of-the-year/2020' } ],
    seo: { kw: 'world favourite colour blue', title: 'One colour that unites the world: why blue is the favourite everywhere', desc: 'Polls, languages, flags and Goethe: why blue is the most shared colour in the world and what that means for anyone designing palettes.',
      outline: ['A colour without a name', 'What Goethe saw in blue', 'Why it unites', 'What this says to anyone who designs'], links: ['Colour', 'Trends'] },
    music: { title: 'Kind of Blue', artist: 'Miles Davis', why: 'The most listened-to record in jazz, and the bluest. Modal, calm, deep: everything the text says about the colour.', q: 'Miles Davis Kind of Blue' } } }
];
export const ARTICLES: Article[] = [...ARTICLES_1, ...ARTICLES_2, ...ARTICLES_3];
