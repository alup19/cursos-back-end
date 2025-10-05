import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { verificaToken } from '../middlewares/verificaToken'

const prisma = new PrismaClient()

const router = Router()

const clienteSchema = z.object({
  nome: z.string().min(2,
    { message: "Titulo deve possuir, no mínimo, 2 caracteres" }),
  email: z.string(),
  senha: z.string(),
  telefone: z.string(),
  cidade: z.string(),
})

router.get("/", async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      where: { ativo: true }
    })
    res.status(200).json(clientes)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

function validaSenha(senha: string) {

  const mensa: string[] = []

  if (senha.length < 8) {
    mensa.push("Erro... senha deve possuir, no mínimo, 8 caracteres")
  }

  let pequenas = 0
  let grandes = 0
  let numeros = 0
  let simbolos = 0

  for (const letra of senha) {
    if ((/[a-z]/).test(letra)) {
      pequenas++
    }
    else if ((/[A-Z]/).test(letra)) {
      grandes++
    }
    else if ((/[0-9]/).test(letra)) {
      numeros++
    } else {
      simbolos++
    }
  }

  if (pequenas == 0) {
    mensa.push("Erro... senha deve possuir letra(s) minúscula(s)")
  }

  if (grandes == 0) {
    mensa.push("Erro... senha deve possuir letra(s) maiúscula(s)")
  }

  if (numeros == 0) {
    mensa.push("Erro... senha deve possuir número(s)")
  }

  if (simbolos == 0) {
    mensa.push("Erro... senha deve possuir símbolo(s)")
  }

  return mensa
}

router.post("/", async (req, res) => {

  const valida = clienteSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const erros = validaSenha(valida.data.senha)
  if (erros.length > 0) {
    res.status(400).json({ erro: erros.join("; ") })
    return
  }

  const salt = bcrypt.genSaltSync(12)
  const hash = bcrypt.hashSync(valida.data.senha, salt)

  const { nome, email, telefone, cidade } = valida.data

  try {
    const clientes = await prisma.cliente.create({
      data: {
        nome, email, senha: hash, telefone, cidade
      }
    })
    res.status(201).json(clientes)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const clientes = await prisma.cliente.findUnique({
      where: { id }
    })
    res.status(200).json(clientes)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.delete("/:id", verificaToken, async (req, res) => {
  const { id } = req.params

  try {
    const clientes = await prisma.cliente.update({
      where: { id: id },
      data: { ativo: false }
    })

    // adminId vem do verificaToken (que acrescenta quando o usuário faz login)
    const adminId = req.userLogadoId as string
    const adminNome = req.userLogadoNome as string

    const descricao = `Exclusão do Cliente ${clientes.nome}`
    const complemento = `Admin: ${adminNome}`

    // registra a log
    const logs = await prisma.log.create({
      data: { descricao, complemento, adminId }
    })

    res.status(200).json(clientes)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

export default router
