import express from 'express'
import cors from 'cors'

import routesTiposCursos from './routes/tiposcursos'
import routesProfessores from './routes/professores'
import routesCursos from './routes/cursos'
import routesClientes from './routes/clientes'
// import routesDuvidas from './routes/duvidas'
// import routesAdmins from './routes/admins'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use("/tiposcursos", routesTiposCursos)
app.use("/professores", routesProfessores)
app.use("/cursos", routesCursos)
app.use("/clientes", routesClientes)
// app.use("/duvidas", routesDuvidas)
// app.use("/admins", routesAdmins)

app.get('/', (req, res) => {
  res.send('API: Cadastro de Cursos')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})