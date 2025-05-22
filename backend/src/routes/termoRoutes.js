import express from "express";
import {
  createTermo,
  updateTermo,
  deleteTermo,
  getTermos,
} from "../controllers/termoController.js";

const router = express.Router();

router.post("/termos", createTermo);
router.put("/termos/:id", updateTermo);
router.delete("/termos/:id", deleteTermo);
router.get("/termos", getTermos);

export default router;
