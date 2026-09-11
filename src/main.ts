import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/views.css';
import { initHome } from './home';
import { initPalette } from './palette/index';
import { initType } from './type/index';
import { initCreate } from './create/index';
import { initTrends } from './trends/render';
import { initNav } from './nav';
import { installTestHooks } from './testing';

/* A ordem importa: o instrumento de cor gera a primeira paleta, a tipografia
   assina o store de cor, e Criação e Tendências dependem dos dois. */
initHome();
initPalette();
initType();
initNav();
initCreate();
initTrends();
installTestHooks();
