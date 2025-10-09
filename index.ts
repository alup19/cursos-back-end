import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// 1. IMPORTAÇÕES ADICIONADAS
import path from 'path';
import { fileURLToPath } from 'url';

import routesTiposCursos from './routes/tiposcursos';
import routesProfessores from './routes/professores';
import routesCursos from './routes/cursos';
import routesClientes from './routes/clientes';
import routesLoginCli from './routes/loginClientes';
import routesDuvidas from './routes/duvidas';
import routesAdmins from './routes/admins';
import routesLoginAdm from './routes/loginAdmins';
import routesDashboard from './routes/dashboard';

// 2. CONFIGURAÇÃO PARA OBTER O CAMINHO DO DIRETÓRIO ATUAL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// SUAS ROTAS DE API (NÃO MUDAM E DEVEM VIR PRIMEIRO)
app.use("/tiposcursos", routesTiposCursos);
app.use("/professores", routesProfessores);
app.use("/cursos", routesCursos);
app.use("/clientes", routesClientes);
app.use("/clientes/login", routesLoginCli);
app.use("/duvidas", routesDuvidas);
app.use("/admins", routesAdmins);
app.use("/admins/login", routesLoginAdm);
app.use("/dashboard", routesDashboard);


// 3. CÓDIGO PARA SERVIR O FRONTEND (A PARTE MAIS IMPORTANTE)
// Esta linha diz ao Express para servir os arquivos estáticos (js, css, imagens)
// da pasta 'public'. VOCÊ TALVEZ PRECISE MUDAR 'public' PARA 'dist' OU 'build'.
app.use(express.static(path.join(__dirname, '..', 'public')));

// Esta rota "catch-all" (*) garante que qualquer requisição que não seja para a API
// receba o arquivo principal do seu site, o index.html.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


// 4. O 'app.listen' É PARA DESENVOLVIMENTO LOCAL. A VERCEL USA O EXPORT.
// app.listen(port, () => {
//   console.log(`Servidor rodando na porta: ${port}`);
// });

// 5. EXPORTA O APP PARA A VERCEL
export default app;