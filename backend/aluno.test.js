import request from "supertest";
import app from "./app.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Testes de integração da API de alunos", () => {
  let alunoId;
  // Limpa a coleção antes de começar os testes
  beforeAll(async () => {
    await prisma.aluno.deleteMany();
  });

  it("POST /alunos - deve criar um novo aluno", async () => {
    const response = await request(app).post("/alunos").send({
      nome: "Maria",
      cpf: "12345678901",
      dataDeNascimento: "2000-01-01T00:00:00.000Z",
      estudanteDaUtfpr: true,
      curso: "Engenharia",
      periodo: 6,
      ra: "123456",
      endereco: "Rua A",
      cidade: "Curitiba",
      estado: "PR",
      telefone: "41999999999",
      email: "maria@email.com",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.nome).toBe("Maria");

    const aluno = await prisma.aluno.findFirst({
      where: { cpf: "12345678901" },
    });
    alunoId = aluno.id;
  });

  it("GET /alunos - deve retornar lista de alunos", async () => {
    const res = await request(app).get("/alunos");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("PUT /alunos/:id - deve atualizar aluno", async () => {
    const res = await request(app).put(`/alunos/${alunoId}`).send({
      nome: "Maria Atualizada",
      cpf: "12345678901",
      dataDeNascimento: "2000-01-01T00:00:00.000Z",
      estudanteDaUtfpr: true,
      curso: "Engenharia de Software",
      periodo: 7,
      ra: "123456",
      endereco: "Rua A",
      cidade: "Curitiba",
      estado: "PR",
      telefone: "41999999999",
      email: "maria@email.com",
    });

    expect(res.statusCode).toBe(202);
    expect(res.body.nome).toBe("Maria Atualizada");
  });

  it("DELETE /alunos/:id - deve deletar aluno", async () => {
    const res = await request(app).delete(`/alunos/${alunoId}`);
    expect(res.statusCode).toBe(203);
  });
});
