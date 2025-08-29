import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const tipocursoSchema = z.object({
  nome: z.string().min(3,
    { message: "Tipo de curso deve possuir, no mínimo, 3 caracteres" })
})

router.get("/", async (req, res) => {
  try {
    const tiposcursos = await prisma.tipoCurso.findMany()
    res.status(200).json(tiposcursos)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.post("/", async (req, res) => {

  const valida = tipocursoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { nome } = valida.data

  try {
    const tiposcursos = await prisma.tipoCurso.create({
      data: { nome }
    })
    res.status(201).json(tiposcursos)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const tiposcursos = await prisma.tipoCurso.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(tiposcursos)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params

  const valida = tipocursoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { nome } = valida.data

  try {
    const tiposcursos = await prisma.tipoCurso.update({
      where: { id: Number(id) },
      data: { nome }
    })
    res.status(200).json(tiposcursos)
  } catch (error) {
    res.status(400).json({ error })
  }
})

export default router
