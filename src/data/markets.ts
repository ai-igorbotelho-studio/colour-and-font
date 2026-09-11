/* Campos — a convenção cromática já ocupada em cada setor. */
export interface Market { n: string; a: number | null; c: string; d: string }
export const MKT: Market[] = [
 {n:'Nenhum',a:null,c:'nenhuma',d:'Sem campo declarado, nada puxa o matiz para o lugar já ocupado por outros — o resultado vem da intenção e da geometria, e não de um território disputado.'},
 {n:'Finanças e bancos',a:235,c:'azul institucional',d:'O azul domina o setor porque promete distância e frieza — exatamente o que Goethe descreve. Por isso deixou de significar qualquer coisa: todos o usam.'},
 {n:'Fintech e cripto',a:282,c:'violeta e gradiente',d:'A categoria migrou em bloco para o vermelho-azul. Diferenciar-se hoje custa mais do que aderir.'},
 {n:'Clima e regeneração',a:175,c:'verde de repouso',d:'O verde diz repouso, não transformação. Para um campo cuja tese é mudança sistêmica, a convenção trabalha contra a mensagem.'},
 {n:'Bioeconomia e agro',a:155,c:'verde com terra',d:'Convenção sólida e pouco disputada; a ruptura útil costuma ser no croma, não no matiz.'},
 {n:'Saúde e cuidado',a:214,c:'azul clínico',d:'Azul-esverdeado de croma baixo. Ganha credibilidade e perde calor — a troca é conhecida.'},
 {n:'Bem-estar e longevidade',a:158,c:'verde suave e neutros',d:'Categoria saturada de dessaturação. O bege com sálvia virou o lugar-comum do setor.'},
 {n:'Alimentos e bebidas',a:40,c:'vermelho-amarelo',d:'O lado ativo em alta energia funciona porque atua no corpo antes do juízo. É também o mais disputado.'},
 {n:'Luxo e joalheria',a:4,c:'purpúreo e preto',d:'O campo onde o preto já é tratado como cor, não como fundo. A gravidade do purpúreo é a escolha histórica.'},
 {n:'Moda',a:300,c:'preto e o extremo do círculo',d:'Tolera qualquer matiz porque o sistema é carregado pelo preto e pelo branco.'},
 {n:'Tecnologia e software',a:248,c:'azul e violeta',d:'A convenção é tão espessa que qualquer coisa fora dela já lê como posicionamento.'},
 {n:'Turismo e hospitalidade',a:205,c:'azul-verde de destino',d:'Mar e folha. Funciona no destino e falha na peça, porque não distingue um lugar do outro.'},
 {n:'Viagem transformacional',a:288,c:'violeta e terrosos',d:'Categoria jovem, convenção ainda mole — é onde a ruptura custa menos.'},
 {n:'Energia e infraestrutura',a:58,c:'laranja e amarelo',d:'Herança de segurança industrial. O amarelo aqui não é alegria: é sinalização.'},
 {n:'Educação',a:122,c:'amarelo e azul',d:'A combinação característica amarelo e azul é a mais antiga do setor e continua funcionando.'},
 {n:'Mídia e cultura',a:345,c:'purpúreo e preto',d:'Campo que recompensa contraste de valor mais do que matiz.'},
 {n:'Setor público e ONGs',a:230,c:'azul de instituição',d:'Convenção defensiva. Romper aqui exige sustentar a ruptura por anos.'},
 {n:'Arte e editorial',a:352,c:'preto, branco e um acento',d:'O conteúdo carrega o sistema. A cor entra como pontuação, não como estrutura.'},
 {n:'Imobiliário e arquitetura',a:148,c:'verde e neutros quentes',d:'Croma baixo por padrão; a diferenciação costuma vir do preto escolhido.'},
 {n:'Varejo e e-commerce',a:28,c:'vermelho de conversão',d:'O vermelho-amarelo vende porque pressiona. Usado o tempo todo, deixa de pressionar.'}
];
