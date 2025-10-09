import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import routesTiposCursos from './routes/tiposcursos';
import routesProfessores from './routes/professores';
import routesCursos from './routes/cursos';
import routesClientes from './routes/clientes';
import routesLoginCli from './routes/loginClientes';
import routesDuvidas from './routes/duvidas';
import routesAdmins from './routes/admins';
import routesLoginAdm from './routes/loginAdmins';
import routesDashboard from './routes/dashboard';

const app = express();

app.use(express.json());
app.use(cors());

// --- SUAS ROTAS DE API ---
app.use("/tiposcursos", routesTiposCursos);
app.use("/professores", routesProfessores);
app.use("/cursos", routesCursos);
app.use("/clientes", routesClientes);
app.use("/clientes/login", routesLoginCli);
app.use("/duvidas", routesDuvidas);
app.use("/admins", routesAdmins);
app.use("/admins/login", routesLoginAdm);
app.use("/dashboard", routesDashboard);

// Rota principal para testar se a API está no ar
app.get('/', (req, res) => {
  res.send('API Orvion Cursos: Online');
});

// --- ESSA LINHA É ESSENCIAL PARA A VERCEL ---
export default app;
