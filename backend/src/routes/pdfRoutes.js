import express from "express";
import { generatePDFs } from "../controllers/pdfController.js";

const router = express.Router();

router.post("/pdfs/generate", generatePDFs);

export default router;
