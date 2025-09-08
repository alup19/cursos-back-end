import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import { z } from 'zod'

const prisma = new PrismaClient()
const router = Router()

const duvidaSchema = z.object({
  clienteId: z.string(),
  cursoId: z.number(),
  descricao: z.string().min(10,
    { message: "Descrição sua Duvida deve possuir, no mínimo, 10 caracteres" }),
})

router.get("/", async (req, res) => {
  try {
    const duvidas = await prisma.duvida.findMany({
      include: {
        cliente: true,
        curso: {
          include: {
            tipoCurso: true
          }
        }
      },
      orderBy: { id: 'desc'}
    })
    res.status(200).json(duvidas)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.post("/", async (req, res) => {

  const valida = duvidaSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }  
  const { clienteId, cursoId, descricao } = valida.data

  try {
    const duvidas = await prisma.duvida.create({
      data: { clienteId, cursoId, descricao }
    })
    res.status(201).json(duvidas)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/:clienteId", async (req, res) => {
  const { clienteId } = req.params
  try {
    const duvidas = await prisma.duvida.findMany({
      where: { clienteId },
      include: {
        curso: {
          include: {
            tipoCurso: true
          }
        }
      }
    })
    res.status(200).json(duvidas)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router