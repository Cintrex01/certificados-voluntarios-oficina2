import express from "express";
import alunoRoutes from "./routes/alunoRoutes.js";
import termoRoutes from "./routes/termoRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use(alunoRoutes);
app.use(termoRoutes);
app.use(pdfRoutes);

// Middleware para tratar erros
app.use(errorMiddleware);

export default app;
