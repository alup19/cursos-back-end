import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/gerais", async (req, res) => {
  try {
    const professores = await prisma.professor.count()
    const clientes = await prisma.cliente.count()
    const cursos = await prisma.curso.count()
    const duvidas = await prisma.duvida.count()
    res.status(200).json({ professores, clientes, cursos, duvidas })
  } catch (error) {
    res.status(400).json(error)
  }
})

type tipoCursoGroupByNome = {
  nome: string
  _count: {
    cursos: number
  }
}

router.get("/cursosTipo", async (req, res) => {
  try {
    const tiposcursos = await prisma.tipoCurso.findMany({
      select: {
        nome: true,
        _count: {
          select: { cursos: true }
        }
      }
    })

    const tiposcursos2 = tiposcursos
        .filter((item: tipoCursoGroupByNome) => item._count.cursos > 0)
        .map((item: tipoCursoGroupByNome) => ({
            tipoCurso: item.nome,
            num: item._count.cursos
        }))
    res.status(200).json(tiposcursos2)
  } catch (error) {
    res.status(400).json(error)
  }
})

type ClienteGroupByCidade = {
  cidade: string
  _count: {
    cidade: number
  }
}

router.get("/clientesCidade", async (req, res) => {
  try {
    const clientes = await prisma.cliente.groupBy({
      by: ['cidade'],
      _count: {
        cidade: true,
      },
    })

    const clientes2 = clientes.map((cliente: ClienteGroupByCidade) => ({
      cidade: cliente.cidade,
      num: cliente._count.cidade
    }))

    res.status(200).json(clientes2)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router