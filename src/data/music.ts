/* Dinâmicas musicais — reescrevem croma, contraste e proporção. */
export interface Music { n: string; Cm: number; ct: number; sy: number; m: string }
export const MUS: Music[] = [
 {n:'Nenhum',Cm:1,ct:0,sy:.5,m:''},
 {n:'Bossa nova',Cm:.72,ct:-.35,sy:.25,m:'Harmonia complexa em dinâmica baixa. Croma reduzido e contraste curto: tudo acontece dentro de uma faixa estreita, e a sofisticação está no intervalo, não no volume.'},
 {n:'Samba de roda e batucada',Cm:1.28,ct:.25,sy:.88,m:'Síncope pesada. A proporção deixa de ser regular: uma cor domina, as outras entram fora do tempo, em áreas pequenas e recorrentes.'},
 {n:'Choro',Cm:.92,ct:0,sy:.62,m:'Virtuosismo dentro de forma fixa. Proporção irregular, mas sempre voltando ao mesmo ponto de apoio.'},
 {n:'Techno de Berlim',Cm:.82,ct:.9,sy:.12,m:'Repetição sobre grade rígida. Contraste de valor extremo, quase nenhum evento de matiz, proporção regular — tudo vive no escuro e no pulso.'},
 {n:'Ambient e drone',Cm:.40,ct:-.7,sy:0,m:'Sem ataque e sem borda. Croma mínimo e diferenças de luminosidade que quase não se resolvem: a paleta é lida como campo, não como conjunto.'},
 {n:'Punk',Cm:1.34,ct:1,sy:.35,m:'Preto, branco e uma cor gritando. Contraste máximo, nenhuma transição, nenhuma cor de apoio.'},
 {n:'Jazz modal',Cm:.96,ct:.1,sy:.58,m:'Poucos acordes, muito espaço. Intervalos largos entre os matizes e proporção que respira.'},
 {n:'Gospel e soul',Cm:1.14,ct:-.15,sy:.42,m:'Luz alta e calor. Grande área clara com cores cheias por cima — a paleta é coral, não solo.'},
 {n:'Dub e reggae',Cm:1.08,ct:.55,sy:.72,m:'Grave enorme e eco. O escuro ganha área, o resto entra em atraso e em pedaços separados por silêncio.'},
 {n:'Fado',Cm:.58,ct:.45,sy:.22,m:'Modo menor, sem ornamento. Croma baixo sobre escuro, e a cor aparece como voz única.'},
 {n:'Afrobeats',Cm:1.26,ct:.15,sy:.78,m:'Camadas de percussão que não coincidem. Várias cores em áreas médias, nenhuma totalmente subordinada.'},
 {n:'Romantismo clássico',Cm:.84,ct:.2,sy:.28,m:'Crescendo longo e resolução. Proporção quase regular, com uma dominante que só se impõe no fim.'},
 {n:"Flamenco",Cm:1.12,ct:0.6,sy:0.8,m:"Compás de doze tempos e ataque seco. Contraste alto e proporção irregular: uma cor entra como palma, fora do lugar esperado, e o silêncio entre as entradas é parte da paleta."},
 {n:"Tango",Cm:0.8,ct:0.5,sy:0.4,m:"Modo menor, corte e pausa. Croma contido, contraste de valor claro e uma cor que aparece como o bandoneón: sozinha, no meio, e depois se retira."},
 {n:"Hip-hop e boom bap",Cm:1.0,ct:0.4,sy:0.7,m:"Loop curto e grave presente. Proporção quebrada em blocos que se repetem, uma dominante escura e as outras cores como samples: pedaços reconhecíveis, recortados."},
 {n:"Raga indiano",Cm:0.9,ct:-0.2,sy:0.15,m:"Drone contínuo e ornamento microtonal. Uma cor de base que nunca sai, e as outras como variações muito próximas dela; quase nenhum contraste, muita nuance."},
 {n:"Gamelan",Cm:1.05,ct:0.1,sy:0.66,m:"Metais entrelaçados em ciclos que se encaixam. Várias cores em área média, nenhuma solista, todas necessárias para o padrão fechar."},
 {n:"Taiko",Cm:0.7,ct:0.8,sy:0.55,m:"Tambor grande e silêncio. Croma baixo, contraste máximo de valor: o escuro domina e o claro entra como golpe."},
 {n:"Highlife e soukous",Cm:1.3,ct:-0.05,sy:0.7,m:"Guitarras claras em camadas alegres. Croma alto e luz alta, muitas cores em áreas parecidas, nenhuma sombra longa."},
 {n:"Cumbia",Cm:1.2,ct:0,sy:0.62,m:"Compasso de dois tempos que balança. Cores plenas em proporção quase regular, com uma leve inclinação para que o conjunto não pare."},
 {n:"Forró",Cm:1.18,ct:0.1,sy:0.7,m:"Sanfona, zabumba e triângulo: três vozes de pesos diferentes. Uma cor grande, uma média e uma pequena que marca o tempo."},
 {n:"Minimalismo — Reich, Glass",Cm:0.78,ct:0.2,sy:0.5,m:"Repetição com deslocamento lento. Proporção regular e croma contido; a mudança acontece por fase, uma cor ganhando área quase sem se perceber."},
 {n:"Canto gregoriano",Cm:0.35,ct:-0.5,sy:0.05,m:"Uma só linha, sem pulso, em pedra. Croma quase nulo e uma faixa de luminosidade estreita: a paleta é um único material com variações de luz."},
 {n:"Blues do Delta",Cm:0.7,ct:0.4,sy:0.35,m:"Voz e violão, doze compassos. Croma baixo, uma dominante escura e uma cor quente que responde como o slide na corda."},
 {n:"K-pop",Cm:1.3,ct:0.3,sy:0.5,m:"Produção densa e mudanças de seção bruscas. Croma máximo, luz alta e proporção que troca de dominante no meio: a paleta tem dois refrões."},
 {n:"Música andina",Cm:0.95,ct:0.1,sy:0.5,m:"Siku, charango e bombo. Cores de lã em alturas diferentes, uma cor grave que sustenta e melodias claras por cima."}
];

export interface CvdOption { v: string; n: string }
export const CVDLIST: CvdOption[] = [
 {v:'none',n:'Nenhuma — visão tricromática'},
 {v:'deuteranopia',n:'Deuteranopia — a mais comum'},
 {v:'protanopia',n:'Protanopia'},
 {v:'tritanopia',n:'Tritanopia'},
 {v:'acromatopsia',n:'Acromatopsia — sem cor'}
];
