import { PrismaClient } from "@prisma/client";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import archiver from "archiver";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sistema de template simples
class SimpleTemplateEngine {
  static render(template, data) {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const keys = key.trim().split(".");
      let value = data;

      for (const k of keys) {
        value = value?.[k];
      }

      return value !== undefined ? value : match;
    });
  }
}

export const generatePDFs = async (req, res) => {
  try {
    const { termoId, alunoIds } = req.body;

    if (
      !termoId ||
      !alunoIds ||
      !Array.isArray(alunoIds) ||
      alunoIds.length === 0
    ) {
      return res.status(400).json({
        message: "Termo e pelo menos um aluno devem ser selecionados",
      });
    }

    // Buscar o termo selecionado
    const termo = await prisma.termo.findUnique({
      where: { id: termoId },
    });

    if (!termo) {
      return res.status(404).json({ message: "Termo não encontrado" });
    }

    // Buscar os alunos selecionados
    const alunos = await prisma.aluno.findMany({
      where: {
        id: { in: alunoIds },
      },
    });

    if (alunos.length === 0) {
      return res.status(404).json({ message: "Nenhum aluno encontrado" });
    }

    // Criar diretório temporário para os PDFs
    const tempDir = path.join(__dirname, "../../temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Nome do arquivo ZIP
    const zipFilename = `termos_${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.zip`;
    const zipPath = path.join(tempDir, zipFilename);

    // Criar o arquivo ZIP
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    archive.pipe(output);

    // Iniciar o navegador Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    // Template HTML path
    const templatePath = path.join(
      __dirname,
      "../../templates/pdf/template.html"
    );
    const templateHtml = fs.readFileSync(templatePath, "utf8");

    // Copiar as imagens e CSS para o diretório temporário
    const imagesDir = path.join(__dirname, "../../templates/pdf/images");
    const cssFile = path.join(__dirname, "../../templates/pdf/style.css");

    const tempImagesDir = path.join(tempDir, "images");
    if (!fs.existsSync(tempImagesDir)) {
      fs.mkdirSync(tempImagesDir, { recursive: true });
    }

    // Copiar arquivos CSS
    fs.copyFileSync(cssFile, path.join(tempDir, "style.css"));

    // Copiar imagens
    const images = fs.readdirSync(imagesDir);
    for (const image of images) {
      fs.copyFileSync(
        path.join(imagesDir, image),
        path.join(tempImagesDir, image)
      );
    }

    // Gerar PDF para cada aluno
    for (const aluno of alunos) {
      // Preparar dados para o template
      const templateData = prepareTemplateData(termo, aluno);

      // Renderizar o template
      const html = SimpleTemplateEngine.render(templateHtml, templateData);

      // Salvar o HTML modificado em um arquivo temporário
      const tempHtmlPath = path.join(tempDir, `termo_${aluno.id}.html`);
      fs.writeFileSync(tempHtmlPath, html);

      // Abrir a página e gerar o PDF
      const page = await browser.newPage();
      await page.goto(`file://${tempHtmlPath}`, { waitUntil: "networkidle0" });

      const pdfPath = path.join(
        tempDir,
        `termo_${sanitizeFilename(aluno.nome)}_${aluno.id}.pdf`
      );

      await page.pdf({
        path: pdfPath,
        format: "A4",
        printBackground: true,
        margin: {
          top: "10mm",
          right: "10mm",
          bottom: "10mm",
          left: "10mm",
        },
      });

      // Adicionar o PDF ao arquivo ZIP
      archive.file(pdfPath, {
        name: `termo_${sanitizeFilename(aluno.nome)}.pdf`,
      });

      await page.close();
    }

    // Fechar o navegador
    await browser.close();

    // Finalizar o arquivo ZIP
    await archive.finalize();

    // Aguardar a conclusão da operação de escrita do ZIP
    await new Promise((resolve, reject) => {
      output.on("close", () => {
        resolve();
      });

      archive.on("error", (err) => {
        reject(err);
      });
    });

    // Enviar o arquivo ZIP como resposta
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename=${zipFilename}`);

    const zipStream = fs.createReadStream(zipPath);
    zipStream.pipe(res);

    // Limpar os arquivos temporários após o envio
    zipStream.on("end", () => {
      // Remover arquivos temporários
      fs.readdir(tempDir, (err, files) => {
        if (err) return;

        for (const file of files) {
          if (file !== "images") {
            fs.unlinkSync(path.join(tempDir, file));
          }
        }

        // Remover diretório de imagens
        fs.rmdir(path.join(tempDir, "images"), { recursive: true }, (err) => {
          if (err) return;
        });
      });
    });
  } catch (error) {
    console.error("Erro ao gerar PDFs:", error);
    res
      .status(500)
      .json({ message: "Erro ao gerar PDFs", error: error.message });
  }
};

// Função para preparar os dados do template
function prepareTemplateData(termo, aluno) {
  // Processar modalidades
  const modalidades = ["programa", "projeto", "evento", "curso"];
  const modalidade = {};
  modalidades.forEach((mod) => {
    modalidade[mod] = mod === termo.modalidade.toLowerCase() ? "(X)" : "( )";
  });

  // Processar se é estudante
  const estudante = {
    sim: aluno.estudanteDaUtfpr ? "(X)" : "( )",
    nao: !aluno.estudanteDaUtfpr ? "(X)" : "( )",
  };

  // Processar atividades
  const atividades = generateAtividadesHTML(termo.atividadesParaDesenvolver);

  // Processar condições gerais
  const condicoesGerais = generateCondicoesGeraisHTML(termo.condicoesGerais);

  return {
    termo: {
      instituicao: termo.instituicao,
      campus: termo.campus,
      tituloDaAcao: termo.tituloDaAcao,
      dataDeInicio: formatDate(termo.dataDeInicio),
      dataDeTermino: formatDate(termo.dataDeTermino),
      nomeCoordenacao: termo.nomeCoordenacao,
      cpfCoordenacao: formatCPF(termo.cpfCoordenacao),
      departamento: termo.departamento,
      telefoneCoordenacao: formatTelefone(termo.telefoneCoordenacao),
      emailCoordenacao: termo.emailCoordenacao,
    },
    aluno: {
      nome: aluno.nome,
      dataDeNascimento: formatDate(aluno.dataDeNascimento),
      cpf: formatCPF(aluno.cpf),
      curso: aluno.curso,
      periodo: aluno.periodo,
      ra: aluno.ra,
      endereco: aluno.endereco,
      cidade: aluno.cidade,
      estado: aluno.estado,
      telefone: formatTelefone(aluno.telefone),
      email: aluno.email,
    },
    modalidade,
    estudante,
    atividades,
    condicoesGerais,
    dataAtual: formatDate(new Date()),
  };
}

// Função para gerar HTML das atividades
function generateAtividadesHTML(atividades) {
  let html = "";

  // Adicionar atividades existentes
  atividades.forEach((atividade, index) => {
    html += `<div class="sinteseRow">
      <span>${index + 1} </span>
      <span>${atividade}</span>
    </div>`;
  });

  // Adicionar linhas vazias para completar o layout (máximo 11 linhas)
  const linhasVazias = Math.max(0, 11 - atividades.length);
  for (let i = 0; i < linhasVazias; i++) {
    html += `<div class="sinteseRow">
      <span>&nbsp;</span>
      <span>&nbsp;</span>
    </div>`;
  }

  return html;
}

// Função para gerar HTML das condições gerais
function generateCondicoesGeraisHTML(condicoes) {
  let html = "";

  condicoes.forEach((condicao) => {
    html += `<p>${condicao.titulo}`;

    if (condicao.subtopicos && condicao.subtopicos.length > 0) {
      condicao.subtopicos.forEach((subtopico) => {
        html += `<br /><span>${subtopico}</span>`;
      });
    }

    html += "</p>";
  });

  return html;
}

// Funções auxiliares
function formatCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatTelefone(telefone) {
  telefone = telefone.replace(/\D/g, "");

  if (telefone.length === 11) {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (telefone.length === 10) {
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return telefone;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR");
}

function sanitizeFilename(filename) {
  return filename
    .replace(/[áàãâä]/gi, "a")
    .replace(/[éèêë]/gi, "e")
    .replace(/[íìîï]/gi, "i")
    .replace(/[óòõôö]/gi, "o")
    .replace(/[úùûü]/gi, "u")
    .replace(/[ç]/gi, "c")
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();
}
