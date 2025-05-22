import * as termoService from "../services/termoService.js";

export const createTermo = async (req, res) => {
  try {
    const termo = await termoService.createTermo(req.body);
    res.status(201).json(termo);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar o termo", error });
  }
};

export const updateTermo = async (req, res) => {
  try {
    const termo = await termoService.updateTermo(req.params.id, req.body);
    res.status(202).json(termo);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar o termo", error });
  }
};

export const deleteTermo = async (req, res) => {
  try {
    await termoService.deleteTermo(req.params.id);
    res.status(203).json({ message: "Termo deletado" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar o termo", error });
  }
};

export const getTermos = async (req, res) => {
  try {
    const termos = await termoService.getTermos();
    res.status(200).json(termos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar os termos", error });
  }
};
