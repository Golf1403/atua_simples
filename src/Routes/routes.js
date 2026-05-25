import auth from './pages/auth';
import dashboard from './pages/dashboard';
import calculations from './pages/calculations';
import admin from './pages/admin';
import user from './pages/user';
import print from './pages/print';
import tools from './pages/tools';
import help from './pages/help';

export default [...auth, ...help, ...dashboard, ...calculations, ...user, ...print, ...tools, ...admin];
