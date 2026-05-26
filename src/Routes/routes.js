import auth from './pages/auth';
import dashboard from './pages/dashboard';
import calculations from './pages/calculations';
import admin from './pages/admin';
import user from './pages/user';
import print from './pages/print';
import tools from './pages/tools';
import help from './pages/help';

// Rotas especificas devem vir antes do dashboard raiz para evitar que "/" capture modulos profundos.
export default [...auth, ...help, ...calculations, ...user, ...print, ...tools, ...admin, ...dashboard];
