import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
app.use(express.json())

app.post('/alunos', async (req, res) => {
    await prisma.aluno.create({
        data: {
            nome:               req.body.nome,
            cpf:                req.body.cpf,
            dataDeNascimento:   req.body.dataDeNascimento,
            estudanteDaUtfpr:   req.body.estudanteDaUtfpr,
            curso:              req.body.curso,
            periodo:            req.body.periodo,
            ra:                 req.body.ra,
            endereco:           req.body.endereco,
            cidade:             req.body.cidade,
            estado:             req.body.estado,
            telefone:           req.body.telefone,
            email:              req.body.email
        }
    })

    res.status(201).json(req.body)
})

app.put('/alunos/:id', async (req, res) => {
    await prisma.aluno.update({
        where: {
            id: req.params.id
        },
        data: {
            nome:               req.body.nome,
            cpf:                req.body.cpf,
            dataDeNascimento:   req.body.dataDeNascimento,
            estudanteDaUtfpr:   req.body.estudanteDaUtfpr,
            curso:              req.body.curso,
            periodo:            req.body.periodo,
            ra:                 req.body.ra,
            endereco:           req.body.endereco,
            cidade:             req.body.cidade,
            estado:             req.body.estado,
            telefone:           req.body.telefone,
            email:              req.body.email
        }
    })

    res.status(202).json(req.body)
})

app.delete('/alunos/:id', async (req, res) => {
    await prisma.aluno.delete({
        where: {
            id: req.params.id,
        }
    })

    res.status(203).json(req.body)
})

app.get('/alunos', async (req, res) => {
    let alunos = []

    if (req.query) {
        alunos = await prisma.aluno.findMany({
            where: {
                id: req.query.id
            }
        })
    } else {
        anulos = await prisma.aluno.findMany()
    }
    res.status(200).json(alunos)
})

app.listen(3000)