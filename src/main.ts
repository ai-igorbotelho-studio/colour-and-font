import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/views.css';
import './styles/shell.css';
import './styles/flat.css';
import './styles/fluid.css';
import { initHome } from './home';
import { initPalette } from './palette/index';
import { initType } from './type/index';
import { initCreate } from './create/index';
import { initTrends } from './trends/render';
import { initNav, initHashRouting } from './nav';
import { installTestHooks } from './testing';
import { initI18n } from './i18n';
import { initEditorial } from './editorial';
import { initTheory } from './theory';
import { LEX } from './data/lexicon';
import { LEX_EN } from './i18n/data-en';

/* A ordem importa: o instrumento de cor gera a primeira paleta, a tipografia
   assina o store de cor, e Criação e Tendências dependem dos dois. */
// o léxico da Criação reconhece as duas línguas, sempre
LEX.forEach((e, i) => { if (LEX_EN[i]) e.w = e.w.concat(LEX_EN[i].filter(w => !e.w.includes(w))) });
initI18n();
initHome();
initPalette();
initType();
initNav();
initCreate();
initTrends();
initHashRouting();
installTestHooks();
initEditorial();
initTheory();

/* Conteúdos e Visualização de exemplos são pedaços separados do pacote:
   entram quando o navegador está ocioso, ou na hora se o endereço já pede
   um artigo (#c/…) ou se é uma sessão de teste. */
const lazy = (): Promise<unknown> => Promise.all([
  import('./mockups/pages').then(m => m.initMockupPages()),
  import('./contents/index').then(m => m.initContents())
]);
const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
if (location.hash.startsWith('#c') || location.search.includes('test') || typeof w.requestIdleCallback !== 'function') void lazy();
else w.requestIdleCallback(() => { void lazy() }, { timeout: 1500 });
import('./motion').then(m => m.initMotion());
