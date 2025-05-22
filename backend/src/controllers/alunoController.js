import * as alunoService from "../services/alunoService.js";

export const createAluno = async (req, res) => {
  try {
    const aluno = await alunoService.createAluno(req.body);
    res.status(201).json(aluno);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar aluno", error });
  }
};

export const updateAluno = async (req, res) => {
  try {
    const aluno = await alunoService.updateAluno(req.params.id, req.body);
    res.status(202).json(aluno);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar aluno", error });
  }
};

export const deleteAluno = async (req, res) => {
  try {
    await alunoService.deleteAluno(req.params.id);
    res.status(203).json({ message: "Aluno deletado" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar aluno", error });
  }
};

export const getAlunos = async (req, res) => {
  try {
    const alunos = await alunoService.getAlunos();
    res.status(200).json(alunos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar alunos", error });
  }
};
