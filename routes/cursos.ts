import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

import { verificaToken } from '../middlewares/verificaToken'

const prisma = new PrismaClient()

const router = Router()

const cursoSchema = z.object({
  titulo: z.string().min(2,
    { message: "Titulo deve possuir, no mínimo, 2 caracteres" }),
  preco: z.number(),
  foto: z.string(),
  cargaHoraria: z.string(),
  descricao: z.string().min(10,
    { message: "Descrição deve possuir, no mínimo, 10 caracteres" }),
  destaque: z.boolean().optional(),
  professorId: z.number(),
  tipoCursoId: z.number(),
  adminId: z.string().uuid()
})

router.get("/", async (req, res) => {
  try {
    const cursos = await prisma.curso.findMany({
      where: {
        ativo: true,
      },
      include: {
        tipoCurso: true,
        professor: true,
        admin: true,
      },
      orderBy: {
        id: 'desc'
      }
    })
    res.status(200).json(cursos)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.get("/destaques", async (req, res) => {
  try {
    const cursos = await prisma.curso.findMany({
      where: {
        ativo: true,
        destaque: true
      },
      include: {
        tipoCurso: true,
        professor: true,
        admin: true,
      },
      orderBy: {
        id: 'desc'
      }
    })
    res.status(200).json(cursos)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const cursos = await prisma.curso.findFirst({
      where: { id: Number(id) },
      include: {
        tipoCurso: true,
        professor: true,
        admin: true,
      }
    })
    res.status(200).json(cursos)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.post("/", async (req, res) => {

  const valida = cursoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { titulo, preco, foto, cargaHoraria, descricao, destaque, professorId, tipoCursoId, adminId } = valida.data

  try {
    const cursos = await prisma.curso.create({
      data: {
        titulo, preco, foto, cargaHoraria, descricao, destaque, professorId, tipoCursoId, adminId
      }
    })
    res.status(201).json(cursos)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.delete("/:id", verificaToken, async (req, res) => {
  const { id } = req.params

  try {
    // soft delete
    const cursos = await prisma.curso.update({
      where: { id: Number(id) },
      data: { ativo: false }
    })

    // adminId vem do verificaToken (que acrescenta quando o usuário faz login)
    const adminId = req.userLogadoId as string
    const adminNome = req.userLogadoNome as string

    const descricao = `Exclusão do Curso ${cursos.titulo}`
    const complemento = `Admin: ${adminNome}`

    // registra a log
    const logs = await prisma.log.create({
      data: { descricao, complemento, adminId }
    })

    res.status(200).json(cursos)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params

  const valida = cursoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { titulo, preco, foto, cargaHoraria, descricao, destaque, professorId, tipoCursoId } = valida.data

  try {
    const cursos = await prisma.curso.update({
      where: { id: Number(id) },
      data: {
        titulo, preco, foto, cargaHoraria, descricao, destaque, professorId, tipoCursoId
      }
    })
    res.status(200).json(cursos)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.get("/pesquisa/:termo", async (req, res) => {
  const { termo } = req.params

  const termoNumero = Number(termo)

  if (isNaN(termoNumero)) {
    try {
      const cursos = await prisma.curso.findMany({
        include: {
          tipoCurso: true,
          professor: true,
          admin: true,
        },
        where: {
          ativo: true,
          OR: [
            { titulo: { contains: termo, mode: "insensitive" } },
            { tipoCurso: { nome: { equals: termo, mode: "insensitive" } } }
          ]
        }
      })
      res.status(200).json(cursos)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  } else {
    if (termoNumero <= 3000) {
      try {
        const cursos = await prisma.curso.findMany({
          include: {
            tipoCurso: true,
            professor: true,
            admin: true,
          },
          where: {
            ativo: true,
            preco: termoNumero
          }
        })
        res.status(200).json(cursos)
      } catch (error) {
        res.status(500).json({ erro: error })
      }  
    } else {
      try {
        const cursos = await prisma.curso.findMany({
          include: {
            tipoCurso: true,
            professor: true,
            admin: true,
          },
          where: {
            ativo: true,
            preco: { lte: termoNumero }
          }
        })
        res.status(200).json(cursos)
      } catch (error) {
        res.status(500).json({ erro: error })
      }
    }
  }
})

router.patch("/destacar/:id", verificaToken, async (req, res) => {
  const { id } = req.params

  try {
    const cursoDestacar = await prisma.curso.findUnique({
      where: { id: Number(id) },
      select: { destaque: true },
    });
    
    const curso = await prisma.curso.update({
      where: { id: Number(id)},
      data: { destaque: !cursoDestacar?.destaque }
    })

    res.status(200).json(curso)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router
