import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.post("/alunos", async (req, res) => {
  const aluno = await prisma.aluno.create({
    data: req.body,
  });
  res.status(201).json(aluno);
});

app.put("/alunos/:id", async (req, res) => {
  const aluno = await prisma.aluno.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.status(202).json(aluno);
});

app.delete("/alunos/:id", async (req, res) => {
  await prisma.aluno.delete({
    where: { id: req.params.id },
  });
  res.status(203).json({ message: "Aluno deletado" });
});

app.get("/alunos", async (req, res) => {
  const alunos = await prisma.aluno.findMany();
  res.status(200).json(alunos);
});

export default app;
