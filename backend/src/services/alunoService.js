import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createAluno = (alunoData) => {
  return prisma.aluno.create({
    data: alunoData,
  });
};

export const updateAluno = (id, alunoData) => {
  return prisma.aluno.update({
    where: { id },
    data: alunoData,
  });
};

export const deleteAluno = (id) => {
  return prisma.aluno.delete({
    where: { id },
  });
};

export const getAlunos = () => {
  return prisma.aluno.findMany();
};
