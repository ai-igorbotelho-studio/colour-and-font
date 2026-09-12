/* ═══════════ CONTEÚDOS — segunda série ═══════════
   Cinco artigos que tocam o lado emocional, cultural e espiritual da cor e da
   letra. Mesmo formato da primeira série (ver articles.ts). */
import type { Article } from './articles';

export const ARTICLES_2: Article[] = [
{ slug: 'a-cor-do-luto', date: '2026-07-03', min: 7, topics: ['cor', 'cultura', 'espirito'],
  pt: { kicker: 'Rito', title: 'A cor do luto não é a mesma em toda parte',
    dek: 'No Ocidente é o preto. Na China e na Índia, o branco. Na Tailândia foi o roxo; no Brasil, o roxo cobre os santos na Semana Santa. A cor da perda diz o que cada cultura acredita que acontece depois.',
    body: `Uma mulher de preto num funeral em Lisboa e uma mulher de branco num funeral em Pequim estão fazendo a mesma coisa. Estão dizendo, sem falar, que alguém se foi e que elas ficaram. A cor é diferente porque a crença por trás dela é diferente: para uma, a morte é noite; para a outra, é retorno ao início, ao não-tingido, ao que ainda não foi tocado.

## O preto que aprendemos a vestir

O preto não foi sempre a cor da morte na Europa. Michel Pastoureau mostra que na Idade Média o luto usava vários tons, e que o preto só se impôs a partir do século XIV, quando os tintureiros aprenderam a produzir um preto profundo e as cortes o adotaram como sinal de gravidade [1]. A rainha Vitória, viúva em 1861, vestiu preto por quarenta anos e transformou o luto numa indústria: crepe, azeviche, papel de carta com borda negra, etiquetas de meses e anos [2].

Aquilo que parece instinto foi, na verdade, ensinado, e faz pouco mais de seis séculos.

## O branco que devolve

Na tradição chinesa, o branco é a cor do outono, do oeste, do metal e do luto; o vestuário funerário é de cânhamo cru, sem tingir [3]. Na Índia, a viúva veste branco, e o branco é a ausência de ornamento, o despojamento. No Japão, o morto é vestido de branco, como o noivo e a noiva nas cerimônias antigas: as três passagens partilham a mesma cor, a cor do limiar [4].

> O preto diz que a luz se apagou. O branco diz que ela voltou para onde estava antes de ter cor.

Goethe teria reconhecido as duas leituras. Na *Farbenlehre*, o preto e o branco não são ausências: são os dois polos de onde toda cor nasce [5]. A cor do luto é sempre um dos polos. Nenhuma cultura enterra os seus em amarelo.

## O roxo entre os dois

Há uma terceira cor, e ela fica entre os polos. No catolicismo, o roxo cobre as imagens da Semana Santa e veste o padre no Advento e na Quaresma: é a cor da espera e da penitência, não da morte consumada [6]. Na Tailândia, as viúvas vestiram roxo por séculos. Goethe chamou o púrpura de cor da dignidade e da gravidade, o ponto mais alto do círculo, onde o azul e o vermelho se encontram [5]. Não é por acaso que a Igreja escolheu para o tempo do luto a cor que Goethe pôs no topo.

## O que isso pede a quem desenha

Uma peça que fala de perda, de memória, de despedida, precisa saber para quem fala. O preto é solene num contexto e neutro em outro; o branco é pureza aqui e luto ali. Não há resposta certa fora de um lugar e de uma pessoa. O instrumento de Cores deste site oferece o preto e o branco como cores plenas, com o mesmo peso das outras, e a referência cultural como um dos eixos da paleta. Use os dois com o cuidado de quem entra numa casa em luto: devagar, e olhando primeiro.`,
    refs: [
      { n: 'Pastoureau, M. *Black: The History of a Color*. Princeton: Princeton University Press, 2008.', u: 'https://press.princeton.edu/books/hardcover/9780691139302/black' },
      { n: 'Taylor, L. *Mourning Dress: A Costume and Social History*. Londres: George Allen & Unwin, 1983 (reed. Routledge, 2009).' },
      { n: 'Watson, J. L.; Rawski, E. S. (orgs.). *Death Ritual in Late Imperial and Modern China*. Berkeley: University of California Press, 1988.' },
      { n: 'Ohnuki-Tierney, E. *Illness and Culture in Contemporary Japan*. Cambridge: Cambridge University Press, 1984.' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*. Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Igreja Católica. *Instrução Geral do Missal Romano*, n.º 346 (cores litúrgicas). Cidade do Vaticano, 2002.', u: 'https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_po.html' } ],
    seo: { kw: 'cor do luto culturas', title: 'A cor do luto: preto, branco e roxo em culturas diferentes', desc: 'Por que o Ocidente veste preto, a China e a Índia vestem branco e a Igreja usa roxo: a história e o sentido das cores da perda.',
      outline: ['O preto que aprendemos a vestir', 'O branco que devolve', 'O roxo entre os dois', 'O que isso pede a quem desenha'], links: ['Cores', 'Teoria'] },
    music: { title: 'Spiegel im Spiegel', artist: 'Arvo Pärt', why: 'Piano e violino, quase nada, dez minutos. É a música que muita gente escolhe para as despedidas, e sabe-se porquê.', q: 'Arvo Pärt Spiegel im Spiegel' } },
  en: { kicker: 'Rite', title: 'The colour of mourning is not the same everywhere',
    dek: 'In the West it is black. In China and India, white. In Thailand it was purple; in Brazil, purple covers the saints in Holy Week. The colour of loss says what each culture believes happens next.',
    body: `A woman in black at a funeral in Lisbon and a woman in white at a funeral in Beijing are doing the same thing. They are saying, without speaking, that someone has gone and that they have stayed. The colour differs because the belief behind it differs: for one, death is night; for the other, it is a return to the beginning, to the undyed, to what has not yet been touched.

## The black we learned to wear

Black was not always the colour of death in Europe. Michel Pastoureau shows that in the Middle Ages mourning used several tones, and that black imposed itself only from the fourteenth century, when dyers learned to produce a deep black and the courts adopted it as a sign of gravity [1]. Queen Victoria, widowed in 1861, wore black for forty years and turned mourning into an industry: crape, jet, black-edged writing paper, etiquette measured in months and years [2].

What feels like instinct was in fact taught, and little more than six centuries ago.

## The white that gives back

In the Chinese tradition white is the colour of autumn, of the west, of metal and of mourning; funeral clothing is raw, undyed hemp [3]. In India the widow wears white, and white is the absence of ornament, the stripping away. In Japan the dead are dressed in white, as bride and groom were in the old ceremonies: the three passages share the same colour, the colour of the threshold [4].

> Black says the light went out. White says it went back to where it was before it had colour.

Goethe would have recognised both readings. In the *Farbenlehre*, black and white are not absences: they are the two poles from which every colour is born [5]. The colour of mourning is always one of the poles. No culture buries its dead in yellow.

## The purple in between

There is a third colour, and it sits between the poles. In Catholicism purple covers the images in Holy Week and clothes the priest in Advent and Lent: it is the colour of waiting and penance, not of death accomplished [6]. In Thailand widows wore purple for centuries. Goethe called purple the colour of dignity and gravity, the highest point of the circle, where blue and red meet [5]. It is no accident that the Church chose, for the season of mourning, the colour Goethe placed at the top.

## What this asks of anyone who designs

A piece that speaks of loss, memory or farewell needs to know whom it speaks to. Black is solemn in one context and neutral in another; white is purity here and mourning there. There is no right answer outside a place and a person. This site's Colour instrument offers black and white as full colours, with the same weight as the others, and cultural reference as one of the palette's axes. Use both with the care of someone entering a house in mourning: slowly, and looking first.`,
    refs: [
      { n: 'Pastoureau, M. *Black: The History of a Color*. Princeton: Princeton University Press, 2008.', u: 'https://press.princeton.edu/books/hardcover/9780691139302/black' },
      { n: 'Taylor, L. *Mourning Dress: A Costume and Social History*. London: George Allen & Unwin, 1983 (repr. Routledge, 2009).' },
      { n: 'Watson, J. L.; Rawski, E. S. (eds.). *Death Ritual in Late Imperial and Modern China*. Berkeley: University of California Press, 1988.' },
      { n: 'Ohnuki-Tierney, E. *Illness and Culture in Contemporary Japan*. Cambridge: Cambridge University Press, 1984.' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*. Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Catholic Church. *General Instruction of the Roman Missal*, no. 346 (liturgical colours). Vatican City, 2002.', u: 'https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_en.html' } ],
    seo: { kw: 'colour of mourning cultures', title: 'The colour of mourning: black, white and purple across cultures', desc: 'Why the West wears black, China and India wear white and the Church uses purple: the history and meaning of the colours of loss.',
      outline: ['The black we learned to wear', 'The white that gives back', 'The purple in between', 'What this asks of anyone who designs'], links: ['Colour', 'Theory'] },
    music: { title: 'Spiegel im Spiegel', artist: 'Arvo Pärt', why: 'Piano and violin, almost nothing, ten minutes. It is the music many people choose for farewells, and one can hear why.', q: 'Arvo Pärt Spiegel im Spiegel' } } },

{ slug: 'a-letra-da-sua-avo', date: '2026-07-10', min: 7, topics: ['tipografia', 'educacao', 'espirito'],
  pt: { kicker: 'Memória', title: 'A letra da sua avó',
    dek: 'Você reconhece a caligrafia de quem ama antes de ler a primeira palavra. Há uma razão neurológica para isso, e uma razão para a escola estar deixando de ensinar a escrever à mão.',
    body: `Abra uma caixa de cartas antigas. Antes de ler qualquer coisa, você já sabe de quem é cada uma. A inclinação, o modo como o *t* é cortado, a pressão da caneta no papel: tudo isso chega antes das palavras e diz *é ela*. Nenhuma fonte digital faz isso. A caligrafia é a única tipografia que carrega um corpo.

## O que a mão ensina ao olho

Marieke Longcamp e colegas mostraram, em 2008, que adultos que aprenderam novos caracteres escrevendo-os à mão os reconheciam melhor, e por mais tempo, do que os que aprenderam digitando; a imagem cerebral revelou que, ao ver a letra, o cérebro reativava o gesto de escrevê-la [1]. A letra fica guardada no corpo, não só na vista.

Em 2014, Mueller e Oppenheimer compararam alunos que tomavam notas à mão com alunos que digitavam. Os que escreviam à mão lembravam melhor os conceitos, porque a lentidão os obrigava a resumir, e resumir é entender [2]. Estudos posteriores nuançaram o efeito, mas não o apagaram.

> A caligrafia é lenta. É por isso que ela guarda.

## O que se perde quando deixa de ser ensinada

Em vários países a escrita cursiva saiu do currículo obrigatório ou ficou opcional. Anne Trubek defende que isso não é uma tragédia, apenas uma passagem, como a que levou do pergaminho ao papel [3]. Rosemary Sassoon, que passou a vida estudando a escrita das crianças, responde que a letra é também uma forma de identidade, e que uma geração sem letra própria perde um modo de se reconhecer [4].

Os dois têm razão. O que se perde não é a capacidade de comunicar. É o rastro.

## A letra como presença

Em culturas de tradição caligráfica, isso nunca foi dúvida. Na China e no Japão, a caligrafia é a arte mais alta, acima da pintura, porque revela o caráter de quem escreve: o traço não pode ser corrigido, e o papel guarda o instante [5]. Na tradição islâmica, a caligrafia é a forma visual da palavra sagrada, e o calígrafo trabalha em estado de recolhimento [6].

Ninguém emoldura um e-mail. Todo mundo guarda um bilhete.

## O que isso diz a quem escolhe fontes

As famílias tipográficas deste instrumento são desenhadas para não carregar um corpo: são regulares, repetíveis, iguais em todos os aparelhos. Isso é uma virtude, e é o que as torna legíveis. Mas quando uma peça precisa de presença, de calor, de *alguém*, a resposta não é uma fonte que imita letra cursiva. É uma letra de verdade, digitalizada, com os seus erros. Ou é uma família com mão visível, como as que a Tipografia classifica em *humanista*: desenhadas por quem ainda sabia o que a pena faz.

Da próxima vez que escrever à mão, repare no que a caneta faz sem que você mande. É isso que a sua avó deixou nas cartas.`,
    refs: [
      { n: 'Longcamp, M.; Boucard, C.; Gilhodes, J.-C.; Anton, J.-L.; Roth, M.; Nazarian, B.; Velay, J.-L. "Learning through Hand- or Typewriting Influences Visual Recognition of New Graphic Shapes". *Journal of Cognitive Neuroscience*, 20(5), 2008.', u: 'https://doi.org/10.1162/jocn.2008.20504' },
      { n: 'Mueller, P. A.; Oppenheimer, D. M. "The Pen Is Mightier Than the Keyboard". *Psychological Science*, 25(6), 2014.', u: 'https://doi.org/10.1177/0956797614524581' },
      { n: 'Trubek, A. *The History and Uncertain Future of Handwriting*. Nova York: Bloomsbury, 2016.' },
      { n: 'Sassoon, R. *Handwriting of the Twentieth Century*. Londres: Routledge, 1999.' },
      { n: 'Billeter, J. F. *The Chinese Art of Writing*. Genebra: Skira / Nova York: Rizzoli, 1990.' },
      { n: 'Schimmel, A. *Calligraphy and Islamic Culture*. Nova York: New York University Press, 1984.' } ],
    seo: { kw: 'caligrafia memória escrita à mão', title: 'A letra da sua avó: por que a escrita à mão guarda memória e presença', desc: 'O que a neurociência diz sobre escrever à mão, o que se perde quando a escola deixa de ensinar cursiva e o que a caligrafia tem de sagrado.',
      outline: ['O que a mão ensina ao olho', 'O que se perde quando deixa de ser ensinada', 'A letra como presença', 'O que isso diz a quem escolhe fontes'], links: ['Tipografia'] },
    music: { title: 'Gymnopédies', artist: 'Erik Satie', why: 'Três peças curtas, escritas à mão numa mesa de café em 1888. Têm a lentidão certa para ler cartas.', q: 'Erik Satie Gymnopédies' } },
  en: { kicker: 'Memory', title: 'Your grandmother\'s handwriting',
    dek: 'You recognise the handwriting of someone you love before you read the first word. There is a neurological reason for that, and a reason schools are ceasing to teach writing by hand.',
    body: `Open a box of old letters. Before reading anything, you already know whose each one is. The slant, the way the *t* is crossed, the pressure of the pen on the paper: all of it arrives before the words and says *it is her*. No digital typeface does that. Handwriting is the only typography that carries a body.

## What the hand teaches the eye

Marieke Longcamp and colleagues showed in 2008 that adults who learned new characters by writing them by hand recognised them better, and for longer, than those who learned by typing; brain imaging revealed that, on seeing the letter, the brain reactivated the gesture of writing it [1]. The letter is stored in the body, not only in the eye.

In 2014 Mueller and Oppenheimer compared students who took notes by hand with students who typed. Those who wrote by hand remembered the concepts better, because slowness forced them to summarise, and to summarise is to understand [2]. Later studies qualified the effect but did not erase it.

> Handwriting is slow. That is why it keeps.

## What is lost when it stops being taught

In several countries cursive writing has left the compulsory curriculum or become optional. Anne Trubek argues that this is not a tragedy, only a passage, like the one from parchment to paper [3]. Rosemary Sassoon, who spent her life studying children's writing, replies that handwriting is also a form of identity, and that a generation without a hand of its own loses a way of recognising itself [4].

Both are right. What is lost is not the ability to communicate. It is the trace.

## Handwriting as presence

In cultures with a calligraphic tradition this was never in doubt. In China and Japan calligraphy is the highest art, above painting, because it reveals the character of the writer: the stroke cannot be corrected, and the paper keeps the instant [5]. In the Islamic tradition calligraphy is the visual form of the sacred word, and the calligrapher works in a state of recollection [6].

Nobody frames an email. Everybody keeps a note.

## What this says to anyone choosing typefaces

The families in this instrument are drawn not to carry a body: they are regular, repeatable, identical on every device. That is a virtue, and it is what makes them legible. But when a piece needs presence, warmth, *someone*, the answer is not a typeface that imitates cursive. It is real handwriting, scanned, with its mistakes. Or a family with a visible hand, like those the Type page classes as *humanist*: drawn by people who still knew what the pen does.

Next time you write by hand, notice what the pen does without being told. That is what your grandmother left in her letters.`,
    refs: [
      { n: 'Longcamp, M.; Boucard, C.; Gilhodes, J.-C.; Anton, J.-L.; Roth, M.; Nazarian, B.; Velay, J.-L. "Learning through Hand- or Typewriting Influences Visual Recognition of New Graphic Shapes". *Journal of Cognitive Neuroscience*, 20(5), 2008.', u: 'https://doi.org/10.1162/jocn.2008.20504' },
      { n: 'Mueller, P. A.; Oppenheimer, D. M. "The Pen Is Mightier Than the Keyboard". *Psychological Science*, 25(6), 2014.', u: 'https://doi.org/10.1177/0956797614524581' },
      { n: 'Trubek, A. *The History and Uncertain Future of Handwriting*. New York: Bloomsbury, 2016.' },
      { n: 'Sassoon, R. *Handwriting of the Twentieth Century*. London: Routledge, 1999.' },
      { n: 'Billeter, J. F. *The Chinese Art of Writing*. Geneva: Skira / New York: Rizzoli, 1990.' },
      { n: 'Schimmel, A. *Calligraphy and Islamic Culture*. New York: New York University Press, 1984.' } ],
    seo: { kw: 'handwriting memory neuroscience', title: 'Your grandmother\'s handwriting: why writing by hand keeps memory and presence', desc: 'What neuroscience says about writing by hand, what is lost when schools drop cursive, and what calligraphy has of the sacred.',
      outline: ['What the hand teaches the eye', 'What is lost when it stops being taught', 'Handwriting as presence', 'What this says to anyone choosing typefaces'], links: ['Type'] },
    music: { title: 'Gymnopédies', artist: 'Erik Satie', why: 'Three short pieces, written by hand at a café table in 1888. They have the right slowness for reading letters.', q: 'Erik Satie Gymnopédies' } } },

{ slug: 'cores-sagradas', date: '2026-07-17', min: 8, topics: ['cor', 'cultura', 'espirito'],
  pt: { kicker: 'Sagrado', title: 'O ouro dos ícones, o azul de lápis-lazúli, o açafrão do monge',
    dek: 'Toda tradição reservou uma cor para o que não se pode nomear. Elas eram caras, raras ou difíceis, e por isso mesmo serviam. O que a economia da cor sagrada ensina sobre valor.',
    body: `No século XIV, quando um pintor florentino recebia a encomenda de uma Virgem, o contrato dizia quanto azul ultramarino ele podia usar e onde. O pigmento vinha de lápis-lazúli extraído nas montanhas do Afeganistão, moído e lavado num processo que Cennino Cennini descreve com a paciência de uma receita; custava mais que o ouro [1]. Por isso o manto de Maria é azul: não porque o azul fosse celestial, mas porque era o que de mais caro se podia dar.

A cor sagrada é, em toda parte, uma cor que custa.

## O ouro que não representa

Nos ícones bizantinos e nos mosaicos de Ravena, o fundo é de ouro. Não é um céu dourado; é a recusa de um céu. O ouro não representa nada, e por isso pode servir de fundo ao que não tem lugar [2]. A luz que ele devolve muda conforme a vela se move, e a imagem parece respirar. Goethe, que viu esses mosaicos na Itália, descreveu a cor dos metais como luz presa na matéria [3].

## O açafrão que se entrega

O monge budista veste açafrão, ou uma cor entre o laranja e o ocre. A tradição diz que os primeiros hábitos eram feitos de trapos recolhidos e tingidos com o que havia: raízes, cascas, terra [4]. A cor não era escolhida pela beleza, mas pela renúncia. Séculos depois, ela virou uma das cores mais reconhecíveis do mundo, e o sentido inverteu-se: hoje o açafrão é visto antes de ser entendido.

> O sagrado começa onde a cor deixa de ser decorativa e passa a ser um preço pago.

## O branco do limiar

No xintoísmo, o branco é a cor do puro e do não-tocado: as cordas, o papel dobrado, as vestes dos sacerdotes [5]. Kenya Hara, diretor de arte da Muji, escreveu um livro inteiro sobre esse branco, e nele diz que o branco japonês não é uma cor, mas uma condição: a de estar pronto para receber [6]. É o oposto do ouro bizantino e faz o mesmo trabalho.

## O que a cor sagrada ensina a quem desenha

Três coisas, e nenhuma é religiosa.

Primeira: **o valor de uma cor vem do que ela custou**. Não no sentido literal, hoje que todo azul custa o mesmo, mas no sentido de que uma cor rara na peça vale mais do que uma cor em toda parte. Esquemas com uma cor de acento pequena funcionam por isso.

Segunda: **uma cor que não representa nada pode segurar tudo**. O fundo neutro, o branco do papel, o preto do palco: são os ouros do nosso tempo.

Terceira: **cor é rito**. Quando você repete uma cor no mesmo lugar por tempo suficiente, ela deixa de ser escolha e vira identidade. É assim que um tom se torna o de uma instituição, de uma cidade, de uma festa.

O instrumento de Cores mostra a área que cada cor deve ocupar. Preste atenção na menor. É quase sempre lá que mora o sagrado.`,
    refs: [
      { n: 'Cennini, C. *Il Libro dell\'Arte* (c. 1400). Trad. D. V. Thompson, *The Craftsman\'s Handbook*. Nova York: Dover, 1954.', u: 'https://www.gutenberg.org/ebooks/70932' },
      { n: 'Belting, H. *Likeness and Presence: A History of the Image before the Era of Art*. Chicago: University of Chicago Press, 1994.' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*. Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Finlay, V. *Colour: Travels Through the Paintbox*. Londres: Sceptre, 2002.' },
      { n: 'Nelson, J. K. *A Year in the Life of a Shinto Shrine*. Seattle: University of Washington Press, 1996.' },
      { n: 'Hara, K. *White*. Zurique: Lars Müller Publishers, 2010.', u: 'https://www.lars-mueller-publishers.com/white' } ],
    seo: { kw: 'cores sagradas ouro azul ultramarino açafrão', title: 'Cores sagradas: ouro, ultramarino, açafrão e branco, e o que ensinam sobre valor', desc: 'Por que cada tradição reservou uma cor cara ou rara para o sagrado, e três lições disso para quem desenha paletas.',
      outline: ['O ouro que não representa', 'O açafrão que se entrega', 'O branco do limiar', 'O que a cor sagrada ensina a quem desenha'], links: ['Cores', 'Teoria'] },
    music: { title: 'O vis aeternitatis', artist: 'Hildegard von Bingen', why: 'Canto do século XII, uma voz e uma nota longa. É o som mais próximo de um fundo de ouro.', q: 'Hildegard von Bingen O vis aeternitatis' } },
  en: { kicker: 'Sacred', title: 'The gold of icons, the blue of lapis lazuli, the monk\'s saffron',
    dek: 'Every tradition reserved a colour for what cannot be named. They were expensive, rare or difficult, and that is exactly why they served. What the economy of sacred colour teaches about value.',
    body: `In the fourteenth century, when a Florentine painter was commissioned to paint a Virgin, the contract said how much ultramarine blue he could use and where. The pigment came from lapis lazuli mined in the mountains of Afghanistan, ground and washed in a process Cennino Cennini describes with the patience of a recipe; it cost more than gold [1]. That is why Mary's mantle is blue: not because blue was heavenly, but because it was the most expensive thing one could give.

Sacred colour is, everywhere, a colour that costs.

## The gold that represents nothing

In Byzantine icons and the mosaics of Ravenna the ground is gold. It is not a golden sky; it is the refusal of a sky. Gold represents nothing, and so it can serve as ground for what has no place [2]. The light it returns changes as the candle moves, and the image seems to breathe. Goethe, who saw those mosaics in Italy, described the colour of metals as light held in matter [3].

## The saffron that gives itself up

The Buddhist monk wears saffron, or a colour between orange and ochre. Tradition says the first robes were made of gathered rags dyed with whatever there was: roots, bark, earth [4]. The colour was chosen not for beauty but for renunciation. Centuries later it became one of the most recognisable colours in the world, and the meaning reversed: today saffron is seen before it is understood.

> The sacred begins where colour stops being decorative and becomes a price paid.

## The white of the threshold

In Shinto, white is the colour of the pure and the untouched: the ropes, the folded paper, the priests' robes [5]. Kenya Hara, art director of Muji, wrote an entire book about that white, and in it he says that Japanese white is not a colour but a condition: that of being ready to receive [6]. It is the opposite of Byzantine gold and does the same work.

## What sacred colour teaches anyone who designs

Three things, none of them religious.

First: **a colour's value comes from what it cost**. Not literally, now that every blue costs the same, but in the sense that a colour that is rare within the piece is worth more than a colour that is everywhere. Schemes with one small accent colour work for this reason.

Second: **a colour that represents nothing can hold everything**. The neutral ground, the white of the paper, the black of the stage: these are the golds of our time.

Third: **colour is rite**. When you repeat a colour in the same place for long enough, it stops being a choice and becomes identity. That is how a tone becomes that of an institution, a city, a festival.

The Colour instrument shows the area each colour should occupy. Pay attention to the smallest. That is almost always where the sacred lives.`,
    refs: [
      { n: 'Cennini, C. *Il Libro dell\'Arte* (c. 1400). Trans. D. V. Thompson, *The Craftsman\'s Handbook*. New York: Dover, 1954.', u: 'https://www.gutenberg.org/ebooks/70932' },
      { n: 'Belting, H. *Likeness and Presence: A History of the Image before the Era of Art*. Chicago: University of Chicago Press, 1994.' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*. Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Finlay, V. *Colour: Travels Through the Paintbox*. London: Sceptre, 2002.' },
      { n: 'Nelson, J. K. *A Year in the Life of a Shinto Shrine*. Seattle: University of Washington Press, 1996.' },
      { n: 'Hara, K. *White*. Zurich: Lars Müller Publishers, 2010.', u: 'https://www.lars-mueller-publishers.com/white' } ],
    seo: { kw: 'sacred colours gold ultramarine saffron', title: 'Sacred colours: gold, ultramarine, saffron and white, and what they teach about value', desc: 'Why every tradition reserved an expensive or rare colour for the sacred, and three lessons from that for anyone designing palettes.',
      outline: ['The gold that represents nothing', 'The saffron that gives itself up', 'The white of the threshold', 'What sacred colour teaches anyone who designs'], links: ['Colour', 'Theory'] },
    music: { title: 'O vis aeternitatis', artist: 'Hildegard von Bingen', why: 'Twelfth-century chant, one voice and one long note. It is the closest sound to a gold ground.', q: 'Hildegard von Bingen O vis aeternitatis' } } },

{ slug: 'o-silencio-do-espaco-em-branco', date: '2026-07-24', min: 7, topics: ['tipografia', 'percepcao', 'espirito'],
  pt: { kicker: 'Vazio', title: 'O silêncio do espaço em branco',
    dek: 'Em japonês há uma palavra para o intervalo que dá sentido ao que o cerca: ma. A tipografia vive dele. O que uma página respira diz mais do que o que ela afirma.',
    body: `Um músico sabe que a pausa é parte da música. John Cage levou isso ao limite em 1952 com *4′33″*, uma peça em que o pianista não toca: o que se ouve é a sala, a tosse, a chuva no telhado [1]. Uma página é igual. O que não está impresso é o que permite ler o que está.

## Ma: o intervalo que sustenta

Em japonês, *ma* (間) nomeia o intervalo entre duas coisas: o silêncio entre duas notas, o vazio entre duas colunas, a pausa entre duas frases. Não é ausência; é o espaço em que as coisas podem ser o que são [2]. Jun'ichirō Tanizaki, em *Elogio da Sombra*, defende que a beleza japonesa vive na penumbra, no que não é totalmente revelado [3]. Um texto sem margens é uma sala sem penumbra: tudo à vista, nada visível.

## A margem como respiração

Jan Tschichold, que redesenhou a coleção Penguin nos anos 1940, dedicou páginas inteiras à proporção das margens e à posição do bloco de texto na página; a fórmula que ele recuperou dos manuscritos medievais dá à margem inferior o dobro da superior, para que o texto pareça flutuar em vez de afundar [4]. Bringhurst resume: a página tem de ser um lugar onde o leitor quer estar [5].

> A margem não é o que sobra. É o que segura.

Kenya Hara vai mais longe: o vazio não é neutro, é convite. Uma superfície branca pede para ser preenchida pela atenção de quem olha, e é nesse pedido que está a força do design japonês [6].

## O que a tela fez com o vazio

A tela tem uma economia diferente do papel: rolar é grátis, a margem custa pixels. Por isso a maioria das interfaces comprime o espaço até sufocar. Mas as medidas da leitura não mudaram: a linha continua a pedir entre 45 e 75 caracteres, e a entrelinha continua a pedir ar [5]. Este instrumento começa com 62 caracteres de medida e 1,5 de entrelinha, e deixa você abrir mais.

## O vazio como atitude

Há uma dimensão que não é técnica. Deixar espaço é confiar no leitor: é dizer que ele consegue ficar com uma frase sem que outra o empurre. É também uma forma de respeito pelo que se escreveu, como o silêncio antes de uma resposta importante. Peças apinhadas tratam o leitor como alguém a ser convencido. Peças com espaço tratam-no como alguém a ser recebido.

Na próxima vez que uma página parecer vazia demais, espere um minuto antes de preenchê-la. Talvez ela esteja apenas em silêncio.`,
    refs: [
      { n: 'Cage, J. *Silence: Lectures and Writings*. Middletown: Wesleyan University Press, 1961.' },
      { n: 'Isozaki, A. *Japan-ness in Architecture*. Cambridge, MA: MIT Press, 2006.' },
      { n: 'Tanizaki, J. *In Praise of Shadows* (1933). Trad. T. J. Harper e E. G. Seidensticker. Stony Creek: Leete\'s Island Books, 1977.' },
      { n: 'Tschichold, J. *The Form of the Book: Essays on the Morality of Good Design*. Vancouver: Hartley & Marks, 1991.' },
      { n: 'Bringhurst, R. *The Elements of Typographic Style*. Vancouver: Hartley & Marks, 4.ª ed., 2012.' },
      { n: 'Hara, K. *Designing Design*. Zurique: Lars Müller Publishers, 2007.', u: 'https://www.lars-mueller-publishers.com/designing-design' } ],
    seo: { kw: 'espaço em branco tipografia ma', title: 'O silêncio do espaço em branco: ma, margens e o vazio na tipografia', desc: 'Por que o espaço vazio sustenta a leitura: o conceito japonês de ma, as margens de Tschichold, o vazio de Kenya Hara e o que a tela fez com isso.',
      outline: ['Ma: o intervalo que sustenta', 'A margem como respiração', 'O que a tela fez com o vazio', 'O vazio como atitude'], links: ['Tipografia', 'Criação'] },
    music: { title: 'async', artist: 'Ryuichi Sakamoto', why: 'Um disco feito de intervalos. Sakamoto disse que o compôs para ser ouvido como quem olha um jardim.', q: 'Ryuichi Sakamoto async' } },
  en: { kicker: 'Emptiness', title: 'The silence of white space',
    dek: 'Japanese has a word for the interval that gives meaning to what surrounds it: ma. Typography lives on it. What a page breathes says more than what it states.',
    body: `A musician knows that the rest is part of the music. John Cage took this to the limit in 1952 with *4′33″*, a piece in which the pianist does not play: what one hears is the room, the cough, the rain on the roof [1]. A page is the same. What is not printed is what allows one to read what is.

## Ma: the interval that holds

In Japanese, *ma* (間) names the interval between two things: the silence between two notes, the void between two columns, the pause between two sentences. It is not absence; it is the space in which things can be what they are [2]. Jun'ichirō Tanizaki, in *In Praise of Shadows*, argues that Japanese beauty lives in the half-light, in what is not fully revealed [3]. A text without margins is a room without half-light: everything in view, nothing visible.

## The margin as breath

Jan Tschichold, who redesigned the Penguin series in the 1940s, gave whole pages to the proportion of margins and the position of the text block; the formula he recovered from medieval manuscripts gives the bottom margin twice the top, so that the text seems to float rather than sink [4]. Bringhurst sums it up: the page has to be a place where the reader wants to be [5].

> The margin is not what is left over. It is what holds.

Kenya Hara goes further: emptiness is not neutral, it is invitation. A white surface asks to be filled by the attention of whoever looks, and in that request lies the strength of Japanese design [6].

## What the screen did to emptiness

The screen has a different economy from paper: scrolling is free, the margin costs pixels. So most interfaces compress space until it suffocates. But the measurements of reading have not changed: the line still asks for 45 to 75 characters, and the leading still asks for air [5]. This instrument starts at a measure of 62 characters and a line height of 1.5, and lets you open it further.

## Emptiness as attitude

There is a dimension that is not technical. Leaving space is trusting the reader: it says they can stay with one sentence without another pushing them on. It is also a form of respect for what was written, like the silence before an important answer. Crowded pieces treat the reader as someone to be convinced. Pieces with space treat them as someone to be received.

Next time a page looks too empty, wait a minute before filling it. Perhaps it is only being silent.`,
    refs: [
      { n: 'Cage, J. *Silence: Lectures and Writings*. Middletown: Wesleyan University Press, 1961.' },
      { n: 'Isozaki, A. *Japan-ness in Architecture*. Cambridge, MA: MIT Press, 2006.' },
      { n: 'Tanizaki, J. *In Praise of Shadows* (1933). Trans. T. J. Harper and E. G. Seidensticker. Stony Creek: Leete\'s Island Books, 1977.' },
      { n: 'Tschichold, J. *The Form of the Book: Essays on the Morality of Good Design*. Vancouver: Hartley & Marks, 1991.' },
      { n: 'Bringhurst, R. *The Elements of Typographic Style*. Vancouver: Hartley & Marks, 4th ed., 2012.' },
      { n: 'Hara, K. *Designing Design*. Zurich: Lars Müller Publishers, 2007.', u: 'https://www.lars-mueller-publishers.com/designing-design' } ],
    seo: { kw: 'white space typography ma', title: 'The silence of white space: ma, margins and emptiness in typography', desc: 'Why empty space holds reading: the Japanese concept of ma, Tschichold\'s margins, Kenya Hara\'s emptiness and what the screen did to it.',
      outline: ['Ma: the interval that holds', 'The margin as breath', 'What the screen did to emptiness', 'Emptiness as attitude'], links: ['Type', 'Create'] },
    music: { title: 'async', artist: 'Ryuichi Sakamoto', why: 'A record made of intervals. Sakamoto said he composed it to be heard the way one looks at a garden.', q: 'Ryuichi Sakamoto async' } } },

{ slug: 'vermelho-antes-da-mente', date: '2026-07-31', min: 7, topics: ['cor', 'percepcao', 'cultura'],
  pt: { kicker: 'Corpo', title: 'Vermelho: a cor que o corpo reconhece antes da mente',
    dek: 'Foi a primeira cor que os humanos fabricaram, há cem mil anos. É a primeira que as línguas nomeiam depois do claro e do escuro. E ainda muda o resultado de um jogo. Sobre a cor que nunca é neutra.',
    body: `Na caverna de Blombos, na África do Sul, arqueólogos encontraram em 2011 duas conchas de abalone com restos de uma pasta de ocre vermelho, moído e misturado com gordura e carvão, datada de cem mil anos [1]. Não se sabe para que servia: pintar o corpo, proteger a pele, marcar uma pedra. Sabe-se que alguém a preparou com cuidado, e que era vermelha.

O vermelho é a primeira cor que fizemos. Também é, segundo Berlin e Kay, a primeira cor propriamente dita que as línguas nomeiam, logo depois de separar o claro do escuro [2]. Antes do verde, do amarelo, do azul. O sangue vem primeiro.

## O que ele faz com o corpo

Em 2005, Russell Hill e Robert Barton analisaram os resultados dos Jogos Olímpicos de Atenas em quatro esportes de combate em que a cor do uniforme é sorteada. Os atletas de vermelho venceram mais vezes do que os de azul, e a diferença foi maior nos combates equilibrados [3]. A explicação proposta é que o vermelho sinaliza dominância em muitos animais, e que os nossos corpos ainda respondem a isso.

Três anos depois, Elliot e Niesta mostraram que homens avaliavam a mesma mulher como mais atraente quando a fotografia tinha fundo vermelho, sem se darem conta da razão [4]. O vermelho age antes de ser visto.

> Nenhuma outra cor tem um efeito que se mede num placar.

## O que Goethe viu

Goethe pôs o vermelho, que chamou de púrpura, no topo do seu círculo: a cor em que os dois lados, o do amarelo e o do azul, se intensificam até se encontrarem. Escreveu que ela produz "uma impressão de gravidade e dignidade, e ao mesmo tempo de graça e encanto", e que um vidro púrpura mostra a paisagem "como no dia do Juízo" [5]. Pastoureau, que lhe dedicou um volume, mostra que o vermelho foi durante milênios *a* cor, a única que merecia o nome, a do poder e do sagrado, até que o azul a destronou na Idade Média [6].

## Onde mora hoje

O vermelho mora nos avisos, nos botões de parar, no lábio, na bandeira. É a única cor que quase todas as culturas usam para o mesmo par: perigo e desejo. É a cor mais usada nas bandeiras do mundo e a mais evitada nos hospitais.

## O que isso pede a quem desenha

Que se use pouco. Uma cor que age no corpo não pode estar em toda parte, porque o corpo cansa. No instrumento de Cores, o vermelho-amarelo é uma das seis âncoras, e a proporção que a paleta lhe atribui costuma ser pequena. Isso não é timidez; é a dose certa de uma coisa forte.

E que se use com respeito. Há cem mil anos alguém moeu ocre numa concha. Cada vez que você escolhe vermelho, está a continuar esse gesto.`,
    refs: [
      { n: 'Henshilwood, C. S. et al. "A 100,000-Year-Old Ochre-Processing Workshop at Blombos Cave, South Africa". *Science*, 334(6053), 2011.', u: 'https://doi.org/10.1126/science.1211535' },
      { n: 'Berlin, B.; Kay, P. *Basic Color Terms: Their Universality and Evolution*. Berkeley: University of California Press, 1969.' },
      { n: 'Hill, R. A.; Barton, R. A. "Red enhances human performance in contests". *Nature*, 435, 2005.', u: 'https://doi.org/10.1038/435293a' },
      { n: 'Elliot, A. J.; Niesta, D. "Romantic red: Red enhances men\'s attraction to women". *Journal of Personality and Social Psychology*, 95(5), 2008.', u: 'https://doi.org/10.1037/0022-3514.95.5.1150' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*, § 792–799. Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Pastoureau, M. *Red: The History of a Color*. Princeton: Princeton University Press, 2017.', u: 'https://press.princeton.edu/books/hardcover/9780691172774/red' } ],
    seo: { kw: 'vermelho efeito psicológico', title: 'Vermelho: a cor que o corpo reconhece antes da mente', desc: 'A primeira cor fabricada, a primeira nomeada, a que muda resultados de jogos: o que a ciência, Goethe e a história dizem sobre o vermelho.',
      outline: ['O que ele faz com o corpo', 'O que Goethe viu', 'Onde mora hoje', 'O que isso pede a quem desenha'], links: ['Cores', 'Tendências'] },
    music: { title: 'A Sagração da Primavera', artist: 'Igor Stravinsky', why: 'Estreou em 1913 com uma revolta na plateia. É pulso, sangue e terra: o vermelho em forma de orquestra.', q: 'Stravinsky Rite of Spring' } },
  en: { kicker: 'Body', title: 'Red: the colour the body recognises before the mind',
    dek: 'It was the first colour humans made, a hundred thousand years ago. It is the first that languages name after light and dark. And it still changes the result of a match. On the colour that is never neutral.',
    body: `In Blombos Cave, South Africa, archaeologists found in 2011 two abalone shells with the remains of a paste of red ochre, ground and mixed with fat and charcoal, dated to a hundred thousand years ago [1]. Nobody knows what it was for: painting the body, protecting the skin, marking a stone. What is known is that someone prepared it with care, and that it was red.

Red is the first colour we made. It is also, according to Berlin and Kay, the first colour proper that languages name, right after separating light from dark [2]. Before green, yellow or blue. Blood comes first.

## What it does to the body

In 2005 Russell Hill and Robert Barton analysed the results of the Athens Olympic Games in four combat sports where the colour of the outfit is assigned at random. Athletes in red won more often than those in blue, and the difference was largest in evenly matched bouts [3]. The proposed explanation is that red signals dominance in many animals, and that our bodies still respond to it.

Three years later Elliot and Niesta showed that men rated the same woman as more attractive when the photograph had a red background, without being aware of the reason [4]. Red acts before it is seen.

> No other colour has an effect you can measure on a scoreboard.

## What Goethe saw

Goethe placed red, which he called purpur, at the top of his circle: the colour in which the two sides, yellow's and blue's, intensify until they meet. He wrote that it produces "an impression of gravity and dignity, and at the same time of grace and attractiveness", and that a purple glass shows the landscape "as on the Day of Judgement" [5]. Pastoureau, who gave it a volume, shows that red was for millennia *the* colour, the only one that deserved the name, the colour of power and the sacred, until blue dethroned it in the Middle Ages [6].

## Where it lives today

Red lives in warnings, stop buttons, the lip, the flag. It is the only colour almost every culture uses for the same pair: danger and desire. It is the most used colour on the world's flags and the most avoided in hospitals.

## What this asks of anyone who designs

That it be used sparingly. A colour that acts on the body cannot be everywhere, because the body tires. In the Colour instrument, red-yellow is one of the six anchors, and the proportion the palette assigns it is usually small. That is not timidity; it is the right dose of a strong thing.

And that it be used with respect. A hundred thousand years ago someone ground ochre in a shell. Every time you choose red, you continue that gesture.`,
    refs: [
      { n: 'Henshilwood, C. S. et al. "A 100,000-Year-Old Ochre-Processing Workshop at Blombos Cave, South Africa". *Science*, 334(6053), 2011.', u: 'https://doi.org/10.1126/science.1211535' },
      { n: 'Berlin, B.; Kay, P. *Basic Color Terms: Their Universality and Evolution*. Berkeley: University of California Press, 1969.' },
      { n: 'Hill, R. A.; Barton, R. A. "Red enhances human performance in contests". *Nature*, 435, 2005.', u: 'https://doi.org/10.1038/435293a' },
      { n: 'Elliot, A. J.; Niesta, D. "Romantic red: Red enhances men\'s attraction to women". *Journal of Personality and Social Psychology*, 95(5), 2008.', u: 'https://doi.org/10.1037/0022-3514.95.5.1150' },
      { n: 'Goethe, J. W. von. *Zur Farbenlehre*, § 792–799. Tübingen: Cotta, 1810.', u: 'https://www.deutschestextarchiv.de/book/show/goethe_farbenlehre01_1810' },
      { n: 'Pastoureau, M. *Red: The History of a Color*. Princeton: Princeton University Press, 2017.', u: 'https://press.princeton.edu/books/hardcover/9780691172774/red' } ],
    seo: { kw: 'red colour psychological effect', title: 'Red: the colour the body recognises before the mind', desc: 'The first colour made, the first named, the one that changes match results: what science, Goethe and history say about red.',
      outline: ['What it does to the body', 'What Goethe saw', 'Where it lives today', 'What this asks of anyone who designs'], links: ['Colour', 'Trends'] },
    music: { title: 'The Rite of Spring', artist: 'Igor Stravinsky', why: 'It premiered in 1913 with a riot in the audience. It is pulse, blood and earth: red in the form of an orchestra.', q: 'Stravinsky Rite of Spring' } } }
];
