import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/views.css';
import './styles/shell.css';
import { initHome } from './home';
import { initPalette } from './palette/index';
import { initType } from './type/index';
import { initCreate } from './create/index';
import { initTrends } from './trends/render';
import { initNav } from './nav';
import { installTestHooks } from './testing';
import { initI18n } from './i18n';
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
installTestHooks();
