import express from "express";
import alunoRoutes from "./routes/alunoRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(express.json());
app.use(alunoRoutes); // Usando as rotas de alunos

// Middleware para tratar erros
app.use(errorMiddleware);

export default app;
