import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createAluno = async (req, res) => {
  try {
    const aluno = await prisma.aluno.create({
      data: req.body,
    });
    res.status(201).json(aluno);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar aluno", error });
  }
};

export const updateAluno = async (req, res) => {
  try {
    const aluno = await prisma.aluno.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(202).json(aluno);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar aluno", error });
  }
};

export const deleteAluno = async (req, res) => {
  try {
    await prisma.aluno.delete({
      where: { id: req.params.id },
    });
    res.status(203).json({ message: "Aluno deletado" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar aluno", error });
  }
};

export const getAlunos = async (req, res) => {
  try {
    const alunos = await prisma.aluno.findMany();
    res.status(200).json(alunos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar alunos", error });
  }
};
