import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createTermo = (termoData) => {
  return prisma.termo.create({
    data: termoData,
  });
};

export const updateTermo = (id, termoData) => {
  return prisma.termo.update({
    where: { id },
    data: termoData,
  });
};

export const deleteTermo = (id) => {
  return prisma.termo.delete({
    where: { id },
  });
};

export const getTermos = () => {
  return prisma.termo.findMany();
};
