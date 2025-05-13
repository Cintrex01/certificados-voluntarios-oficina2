import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createTermo = async (req, res) => {
  try {
    const termo = await prisma.termo.create({
      data: req.body,
    });
    res.status(201).json(termo);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar o termo", error });
  }
};

export const updateTermo = async (req, res) => {
  try {
    const termo = await prisma.termo.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(202).json(termo);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar o termo", error });
  }
};

export const deleteTermo = async (req, res) => {
  try {
    await prisma.termo.delete({
      where: { id: req.params.id },
    });
    res.status(203).json({ message: "Termo deletado" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar o termo", error });
  }
};

export const getTermo = async (req, res) => {
  try {
    const termos = await prisma.termo.findMany();
    res.status(200).json(termos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar os termos", error });
  }
};
