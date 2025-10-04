import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const professorSchema = z.object({
  nome: z.string().min(2,
    { message: "Titulo deve possuir, no mínimo, 2 caracteres" }),
  email: z.string(),
  telefone: z.string()
})

router.get("/", async (req, res) => {
  try {
    const professores = await prisma.professor.findMany({
      include: {
        cursos: true
      }
    })
    res.status(200).json(professores)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.post("/", async (req, res) => {

  const valida = professorSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { nome, email, telefone } = valida.data

  try {
    const professores = await prisma.professor.create({
      data: {
        nome, email, telefone
      }
    })
    res.status(201).json(professores)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const professores = await prisma.professor.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(professores)

  } catch (error) {
    res.status(400).json(error)
  }
})

export default router
