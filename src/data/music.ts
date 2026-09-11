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
 {n:'Romantismo clássico',Cm:.84,ct:.2,sy:.28,m:'Crescendo longo e resolução. Proporção quase regular, com uma dominante que só se impõe no fim.'}
];

export interface CvdOption { v: string; n: string }
export const CVDLIST: CvdOption[] = [
 {v:'none',n:'Nenhuma — visão tricromática'},
 {v:'deuteranopia',n:'Deuteranopia — a mais comum'},
 {v:'protanopia',n:'Protanopia'},
 {v:'tritanopia',n:'Tritanopia'},
 {v:'acromatopsia',n:'Acromatopsia — sem cor'}
];
