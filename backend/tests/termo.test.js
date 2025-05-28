import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let termoId;

beforeAll(async () => {
  await prisma.termo.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("API de Termos", () => {
  it("POST /termos - deve criar um termo com condicoes complexas", async () => {
    const termo = {
      instituicao:
        "Instituição: Universidade Tecnológica Federal do Paraná – UTFPR",
      campus: "Cornélio Procópio",
      tituloDaAcao: "ELLP (Ensino Lúdico de Lógica e Programação)",
      modalidade: "projeto",
      dataDeInicio: "2022-08-15T00:00:00.000Z",
      dataDeTermino: "2023-08-11T00:00:00.000Z",
      nomeCoordenacao: "Antonio Carlos Fernandes da Silva",
      cpfCoordenacao: "02653094924",
      departamento: "DACOM",
      telefoneCoordenacao: "43999150078",
      emailCoordenacao: "antonio@utfpr.edu.br",
      atividadesParaDesenvolver: [
        "Pesquisa de tópicos em ciência e tecnologia",
        "Produção de textos educativos e atividades  para redes sociais",
        "Elaboração de material para as oficinas",
        "Produção de atividades lúdicas",
        "Divulgação de oficinas do projeto",
        "Ministrar oficinas",
        "Descrever resultados e avaliar o andamento do projeto",
      ],
      condicoesGerais: [
        {
          titulo: "1. O(a) Voluntário(a) compromete-se a:",
          subtopicos: [
            "a) Dedicar-se às atividades acadêmicas e ações de extensão em ritmo compatível com as atividades exigidas pelo curso durante o ano letivo.\n",
            "b) Realizar suas atividades nos dias e horários previstos, podendo modificá-los, em comum acordo com a Coordenação da ação de Extensão.\n",
            "c) Ser assíduo, pontual e agir de forma ética nas ações extensionistas.\n",
            "d) Observar as determinações da coordenação alusivas ao bom desenvolvimento das ações de extensão.\n",
            "e)  Solicitar por escrito, com anuência da Coordenação da ação de Extensão, junto à DIREC, ou órgão equivalente de seu Campus, permissão para afastamentos superiores a 15 dias consecutivos. \n",
            "f) Apresentar relatório parcial e final do trabalho desenvolvido à Coordenação da ação de Extensão.",
          ],
        },
        {
          titulo:
            '2. Os trabalhos publicados em decorrência das ações de extensão apoiadas pela UTFPR deverão, necessariamente, fazer referência ao apoio recebido, com a seguinte expressão:\n"O presente trabalho foi realizado com o apoio da Universidade Tecnológica Federal do Paraná - UTFPR".\n',
          subtopicos: [],
        },
        {
          titulo:
            "3. O(a) Voluntário(a) declara ser conhecedor da Lei Federal N. 9.608, de 18 de fevereiro de 1998, especialmente de que o serviço voluntário “não gera vínculo empregatício, nem obrigação de natureza trabalhista, previdenciária ou afim”.\n",
          subtopicos: [],
        },
        {
          titulo:
            "4. O(a) Voluntário(a), estudante da UTFPR, contará com o seguro contra acidentes pessoais pago pela UTFPR, conforme dispositivo legal pertinente.\n",
          subtopicos: [],
        },
        {
          titulo:
            "5. A UTFPR não se responsabiliza por qualquer dano físico ou mental causado ao(à) estudante voluntário(a) na execução da ação de extensão.\n",
          subtopicos: [],
        },
        {
          titulo:
            "6. À coordenação da ação de extensão cabe supervisionar as atividades desenvolvidas pelo(a) voluntário(a), nos dias e horários previstos, e informar à DIREC sobre o cancelamento deste Termo, quando ocorrer, em até 03 dias.\n",
          subtopicos: [],
        },
        {
          titulo:
            "7. A UTFPR poderá cancelar ou suspender o vínculo com a atividade quando constatado que foram infringidas quaisquer das condições constantes deste termo e das normas aplicáveis ao Edital respectivo, sem prejuízo da aplicação dos dispositivos legais que disciplinam o ressarcimento dos recursos.\n",
          subtopicos: [],
        },
        {
          titulo:
            "8. O(a) voluntário(a) e a coordenação da ação de Extensão comprometem-se a cumprir as condições expressas neste instrumento e as normas que lhe são aplicáveis.\n\n",
          subtopicos: [],
        },
      ],
    };

    const res = await request(app).post("/termos").send(termo);

    expect(res.status).toBe(201);
    expect(res.body.tituloDaAcao).toBe(
      "ELLP (Ensino Lúdico de Lógica e Programação)"
    );
    expect(Array.isArray(res.body.condicoesGerais)).toBe(true);
    termoId = res.body.id;
  });

  it("GET /termos - deve retornar a lista de termos", async () => {
    const res = await request(app).get("/termos");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].tituloDaAcao).toBeDefined();
  });

  it("PUT /termos/:id - deve atualizar o termo", async () => {
    const updatedTermo = {
      instituicao: "UTFPR - Atualizada",
      campus: "Londrina",
      tituloDaAcao: "Projeto Atualizado",
      modalidade: "remoto",
      dataDeInicio: "2023-01-01T00:00:00.000Z",
      dataDeTermino: "2023-12-31T00:00:00.000Z",
      nomeCoordenacao: "João da Silva",
      cpfCoordenacao: "12345678900",
      departamento: "INF",
      telefoneCoordenacao: "41988887777",
      emailCoordenacao: "joao@utfpr.edu.br",
      atividadesParaDesenvolver: [
        "Planejamento de atividades",
        "Execução de tarefas",
        "Relatórios mensais",
      ],
      condicoesGerais: [
        {
          titulo: "1. Compromissos do voluntário (atualizado)",
          subtopicos: [
            "a) Seguir o cronograma revisado.",
            "b) Cumprir com as novas diretrizes do projeto.",
          ],
        },
      ],
    };

    const res = await request(app).put(`/termos/${termoId}`).send(updatedTermo);

    expect(res.status).toBe(202);
    expect(res.body.tituloDaAcao).toBe("Projeto Atualizado");
    expect(res.body.campus).toBe("Londrina");
    expect(Array.isArray(res.body.condicoesGerais)).toBe(true);
    expect(res.body.condicoesGerais[0].titulo).toContain("Compromissos");
  });

  it("DELETE /termos/:id - deve deletar o termo criado", async () => {
    const res = await request(app).delete(`/termos/${termoId}`);
    expect(res.status).toBe(203);
  });
});
