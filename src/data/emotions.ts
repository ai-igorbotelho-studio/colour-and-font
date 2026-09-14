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
 {n:'Intimidade e calor',a:18,g:'Purpúreo puxado ao vermelho e rebaixado de luminosidade. Goethe nota que essa vizinhança tem graça sem perder gravidade.'},
 {n:"Nostalgia e ternura",a:80,g:"Um amarelo já puxado ao vermelho e rebaixado, a cor da luz no fim da tarde e do papel envelhecido. Goethe diz que o amarelo intensificado traz calor sem violência; aqui o calor vem com a distância do tempo, e por isso comove em vez de agitar.",key:"intim"},
 {n:"Coragem e afirmação",a:30,g:"O vermelho-amarelo na sua faixa mais firme, antes de virar apetite. É a cor que Goethe descreve como a que avança sobre quem olha; usada com área contida, deixa de ser ameaça e vira decisão.",key:"energ"},
 {n:"Reverência e sagrado",a:335,g:"O púrpura no ponto em que o azul ainda o segura. Goethe atribui a essa cor dignidade e gravidade, e um vidro púrpura mostra o mundo, diz ele, como no Dia do Juízo. É a cor dos mantos, dos altares e do que não se toca.",key:"cerim"},
 {n:"Espanto e maravilha",a:270,g:"Entre o azul e o vermelho-azul, onde o olho não descansa nem decide. Goethe vê no azul algo que recua e atrai ao mesmo tempo; puxado ao violeta, esse movimento vira inquietação luminosa, a sensação de estar diante de algo maior.",key:"aspir"},
 {n:"Silêncio e contemplação",a:215,g:"Azul esverdeado com o croma quase todo retirado. Nada avança, nada chama. É a região que Goethe associa ao repouso do olho quando o verde se aproxima do azul: a cor de um lago parado ao amanhecer.",key:"repou"},
 {n:"Esperança e recomeço",a:150,g:"Verde puxado ao amarelo, a cor do broto antes da folha. Goethe diz que no verde o olho e a alma descansam; com um pouco de amarelo, esse descanso ganha direção, e vira promessa.",key:"cuida"},
 {n:"Luto e despedida",a:250,g:"Azul profundo, rebaixado quase até a treva. Para Goethe o azul carrega um princípio de escuridão e sempre puxa para longe; aqui é a distância de quem partiu. As culturas vestem o luto de preto ou de branco, mas o sentimento tem esta cor.",key:"melan"},
 {n:"Erotismo e pele",a:355,g:"Púrpura puxado ao vermelho, aquecido e com o croma alto. É a faixa que Goethe chama de graça e encanto ao mesmo tempo que gravidade: chama o corpo com elegância, sem a urgência do vermelho-amarelo.",key:"desej"},
 {n:"Liberdade e vastidão",a:232,g:"O azul do céu alto, claro e aberto. Goethe descreve o azul como a cor que se afasta e nos puxa atrás dela: é o horizonte, o mar visto de longe, tudo o que ainda não tem borda.",key:"profu"},
 {n:"Humor e ironia",a:110,g:"Amarelo levemente esverdeado, mais ácido do que alegre. Goethe avisa que basta sujar o amarelo para a alegria virar desonra; a ironia mora exatamente nessa margem, e sabe disso.",key:"alegr"},
 {n:"Raiz e pertencimento",a:70,g:"Vermelho-amarelo escurecido até o ocre, a cor da terra, do barro e do pão. É a primeira cor que os humanos fabricaram, e Goethe a coloca do lado ativo e quente do círculo: aqui, aquecida e rebaixada, vira chão.",key:"confi"},
 {n:"Vertigem e êxtase",a:320,g:"Magenta com o croma no limite do gamut. Goethe descreve o encontro dos dois lados no púrpura como o cume; empurrado até o fim, o cume vira precipício, e o olho não sabe se sobe ou cai.",key:"aspir"},
 {n:"Sabedoria e tempo",a:210,g:"Azul-verde fechado e sem brilho, a cor do bronze antigo e da água funda. Do lado passivo do círculo de Goethe, é a cor que não pede nada: já viu o suficiente para não precisar convencer.",key:"rigor"},
 {n:"Alívio e leveza",a:140,g:"Verde claro puxado ao amarelo, com muita luz e pouco croma. É o descanso de Goethe depois de um esforço: a cor de sair de uma sala fechada para o ar.",key:"repou"}
];
/* radical da primeira palavra em português — os humores das famílias são pontuados por ele, em qualquer idioma */
EMO.forEach(e => { if (e.key) return; e.key = e.n.split(' ')[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 5) });
