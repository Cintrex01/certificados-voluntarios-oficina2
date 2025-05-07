import express from "express";
import alunoRoutes from "./routes/alunoRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(alunoRoutes);

// Middleware para tratar erros
app.use(errorMiddleware);

export default app;
