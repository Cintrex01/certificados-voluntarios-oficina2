import express from "express";
import {
  createTermo,
  updateTermo,
  deleteTermo,
  getTermo,
} from "../controllers/termoController.js";

const router = express.Router();

router.post("/termos", createTermo);
router.put("/termos/:id", updateTermo);
router.delete("/termos/:id", deleteTermo);
router.get("/termos", getTermo);

export default router;