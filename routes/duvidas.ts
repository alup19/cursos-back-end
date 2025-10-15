import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import { z } from 'zod'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()
const router = Router()

const duvidaSchema = z.object({
  clienteId: z.string(),
  cursoId: z.number(),
  descricao: z.string().min(10,
    { message: "Descrição sua Duvida deve possuir, no mínimo, 10 caracteres" }),
})

async function enviaEmail(nome: string, email: string, descricao: string, resposta: string) {
  
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAILTRAP_EMAIL,
      pass: process.env.MAILTRAP_SENHA,
    },
  });

  const info = await transporter.sendMail({
    from: 'orvioncursos@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Re: Duvida Orvion Cursos", // Subject line
    text: resposta, // plain text body
    html: `<h3>Estimado Cliente: ${nome}</h3>
           <h3>Duvida: ${descricao}</h3>
           <h3>Resposta da Coordenação: ${resposta}</h3>
           <p>Muito obrigado pelo seu contato</p>
           <p>Orvion Cursos</p>`
  });

  console.log("Message sent: %s", info.messageId);

}

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

router.patch("/:id", async (req, res) => {
  const { id } = req.params
  const { resposta } = req.body

  if (!resposta) {
    res.status(400).json({ "erro": "Informe a resposta desta duvida" })
    return
  }

  try {
    const duvida = await prisma.duvida.update({
      where: { id: Number(id) },
      data: { resposta }
    })

    const dados = await prisma.duvida.findUnique({
      where: { id: Number(id) },
      include: {
        cliente: true
      }
    })

    enviaEmail(dados?.cliente.nome as string,
      dados?.cliente.email as string,
      dados?.descricao as string,
      resposta)

    res.status(200).json(duvida)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const duvidas = await prisma.duvida.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(duvidas)

  } catch (error) {
    res.status(400).json(error)
  }
})

export default router