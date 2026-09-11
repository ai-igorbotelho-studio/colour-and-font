/* Esquemas — os três regimes de Goethe (harmônica a 180°, característica a 120°,
   sem caráter a 60°) coexistem com os seis esquemas geométricos modernos.
   off = deslocamentos de matiz a partir da primeira cor. */
export interface Scheme { n: string; off: number[] | null; d: string; mirror?: boolean; mono?: boolean }
export const SCH: Scheme[] = [
 {n:'Nenhum — livre',off:null,d:'As bolas ficam onde você as deixar. Nada é forçado a manter distância.'},
 {n:'Goethe — harmônica',off:[180,180,0,180,0],mirror:true,d:'Os opostos do círculo: a combinação que, segundo Goethe, traz em si a condição de totalidade.'},
 {n:'Goethe — característica',off:[120,240,120,240,120],d:'Um espaço de distância. Diz alguma coisa, ainda que não tudo.'},
 {n:'Goethe — sem caráter',off:[60,-60,120,-120,30],d:'Vizinhas no círculo. Não desagradam, mas segundo ele falta-lhes caráter.'},
 {n:'Monocromático',off:[0,0,0,0,0],mono:true,d:'Um só matiz, variando luminosidade e croma. Toda a hierarquia vem do valor.'},
 {n:'Análogo',off:[30,-30,60,-60,90],d:'Vizinhança estreita. Coeso e sem tensão; precisa de contraste de valor para não achatar.'},
 {n:'Complementar',off:[180,180,180,0,180],mirror:true,d:'Cruza o círculo. Máxima tensão de matiz entre dois polos.'},
 {n:'Complementar dividido',off:[150,210,150,210,180],d:'Troca o oposto pelos dois vizinhos dele. Mantém a tensão e reduz o choque.'},
 {n:'Tríade',off:[120,240,120,240,0],d:'Divide o círculo em três. Vivo e equilibrado, difícil de dosar em área.'},
 {n:'Tetrádico',off:[60,180,240,0,120],d:'Retângulo no círculo: dois pares de opostos. Rico e o mais difícil de equilibrar.'},
 {n:'Quadrado',off:[90,180,270,45,225],d:'Quatro pontos equidistantes. Tetrádico simétrico, com a mesma exigência de dosagem.'}
];
