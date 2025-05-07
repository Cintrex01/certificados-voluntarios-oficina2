import express from "express";
import {
  createAluno,
  updateAluno,
  deleteAluno,
  getAlunos,
} from "../controllers/alunoController.js";

const router = express.Router();

router.post("/alunos", createAluno);
router.put("/alunos/:id", updateAluno);
router.delete("/alunos/:id", deleteAluno);
router.get("/alunos", getAlunos);

export default router;
