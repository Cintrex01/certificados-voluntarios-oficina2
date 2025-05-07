import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let alunoId;

beforeAll(async () => {
  await prisma.aluno.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("API de Alunos", () => {
  it("POST /alunos - deve criar um aluno", async () => {
    const aluno = {
      nome: "Teste",
      cpf: "12345678901",
      dataDeNascimento: "2000-01-01T00:00:00.000Z",
      estudanteDaUtfpr: true,
      curso: "Engenharia",
      periodo: 5,
      ra: "9999999",
      endereco: "Rua A",
      cidade: "Curitiba",
      estado: "PR",
      telefone: "41999999999",
      email: "teste@example.com",
    };

    const res = await request(app).post("/alunos").send(aluno);

    expect(res.status).toBe(201);
    expect(res.body.nome).toBe("Teste");
    alunoId = res.body.id;
  });

  it("GET /alunos - deve retornar lista com o aluno", async () => {
    const res = await request(app).get("/alunos");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("PUT /alunos/:id - deve atualizar o aluno", async () => {
    const res = await request(app).put(`/alunos/${alunoId}`).send({
      nome: "Atualizado",
      cpf: "12345678901",
      dataDeNascimento: "2000-01-01T00:00:00.000Z",
      estudanteDaUtfpr: false,
      curso: "Arquitetura",
      periodo: 7,
      ra: "8888888",
      endereco: "Rua B",
      cidade: "Londrina",
      estado: "PR",
      telefone: "41988888888",
      email: "teste@example.com",
    });

    expect(res.status).toBe(202);
    expect(res.body.nome).toBe("Atualizado");
  });

  it("DELETE /alunos/:id - deve deletar o aluno", async () => {
    const res = await request(app).delete(`/alunos/${alunoId}`);
    expect(res.status).toBe(203);
  });
});
