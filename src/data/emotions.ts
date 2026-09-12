/* Intenções — as posições no círculo e a leitura de Goethe para cada uma. */
export interface Emotion { n: string; a: number | null; g: string; key?: string }
export const EMO: Emotion[] = [
 {n:'Nenhuma',a:null,g:'Sem intenção declarada, o matiz de partida vem só da convenção do campo, da referência cultural e de onde as bolas estiverem no anel.'},
 {n:'Alegria e clareza',a:120,g:'O amarelo é a cor imediatamente vizinha da luz. Em estado puro e límpido, diz Goethe, traz consigo uma natureza serena, alegre, suavemente excitante — mas basta sujá-lo um pouco para que essa mesma alegria vire desonra.'},
 {n:'Otimismo caloroso',a:100,g:'Intensificar o amarelo em direção ao vermelho é dar-lhe calor sem ainda lhe dar violência. É a região em que o olho se sente acolhido e não pressionado.'},
 {n:'Energia e urgência',a:45,g:'O vermelho-amarelo é o lado ativo em sua maior energia. Goethe observa que animais se irritam diante dele e que pessoas sensíveis não o suportam por muito tempo — o que é exatamente o ponto, quando se quer forçar uma ação.'},
 {n:'Desejo e apetite',a:35,g:'Aqui a intensificação já beira o insuportável. É a faixa que chama o corpo antes de chamar o juízo.'},
 {n:'Autoridade e gravidade',a:5,g:'O purpúreo é o cume da intensificação: nele os dois lados do círculo se encontram. Goethe atribui-lhe dignidade e gravidade e nota que não por acaso foi a cor dos que governam.'},
 {n:'Cerimônia e legado',a:350,g:'Purpúreo puxado ao escuro. Goethe o descreve como severidade e graça ao mesmo tempo — a mesma cor que impõe é a que encanta.'},
 {n:'Aspiração e inquietação',a:305,g:'O vermelho-azul é inquieto e aspirante. Goethe o descreve como algo que não se acomoda: quer continuar subindo.'},
 {n:'Mistério e transcendência',a:290,g:'O lado negativo intensificado. A cor deixa de descrever o mundo e passa a sugerir o que está atrás dele.'},
 {n:'Profundidade e distância',a:240,g:'O azul carrega consigo um princípio de treva. Goethe diz que ele nos atrai e ao mesmo tempo nos puxa para longe — como um belo nada, que se afasta à medida que se olha.'},
 {n:'Confiança e serenidade',a:225,g:'Azul empurrado ao verde: a contradição entre excitação e repouso que Goethe atribui ao azul começa a se resolver em favor do repouso.'},
 {n:'Melancolia e saudade',a:258,g:'O azul frio e sombrio. Goethe associa esse lado a um sentimento de ausência que não chega a ser desagradável.'},
 {n:'Repouso e equilíbrio',a:180,g:'No verde, diz Goethe, olho e alma descansam. Não se quer ir além, e não se pode — é o único ponto do círculo em que a busca termina.'},
 {n:'Cuidado e regeneração',a:163,g:'Verde com amarelo dentro. O repouso do verde recebe de volta uma parte da atividade da luz, sem virar estímulo.'},
 {n:'Rigor e precisão',a:203,g:'Verde-azulado de croma contido. Nada nessa faixa pede atenção; ela é lida como método.'},
 {n:'Abundância e fartura',a:135,g:'Amarelo puxado ao verde, com croma alto. A sensação de excesso vem menos do matiz do que da saturação que ele suporta.'},
 {n:'Intimidade e calor',a:18,g:'Purpúreo puxado ao vermelho e rebaixado de luminosidade. Goethe nota que essa vizinhança tem graça sem perder gravidade.'}
];
/* radical da primeira palavra em português — os humores das famílias são pontuados por ele, em qualquer idioma */
EMO.forEach(e => { e.key = e.n.split(' ')[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 5) });
