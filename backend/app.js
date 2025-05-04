import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.post("/alunos", async (req, res) => {
  await prisma.aluno.create({ data: req.body });
  res.status(201).json(req.body);
});

app.put("/alunos/:id", async (req, res) => {
  await prisma.aluno.update({ where: { id: req.params.id }, data: req.body });
  res.status(202).json(req.body);
});

app.delete("/alunos/:id", async (req, res) => {
  await prisma.aluno.delete({ where: { id: req.params.id } });
  res.status(203).json({ message: "Aluno deletado" });
});

app.get("/alunos", async (req, res) => {
  const alunos = req.query.id
    ? await prisma.aluno.findMany({ where: { id: req.query.id } })
    : await prisma.aluno.findMany();

  res.status(200).json(alunos);
});

export default app;
