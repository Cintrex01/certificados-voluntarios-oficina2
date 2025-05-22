import { PrismaClient } from "@prisma/client";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import archiver from "archiver";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      zlib: { level: 9 }, // Nível de compressão
    });

    archive.pipe(output);

    // Iniciar o navegador Puppeteer
    const browser = await puppeteer.launch({
      headless: "new", // Use o novo modo headless
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    // Template HTML path
    const templatePath = path.join(
      __dirname,
      "../../templates/pdf/template.html"
    );
    const templateHtml = fs.readFileSync(templatePath, "utf8");

    // Copiar as imagens e CSS para o diretório temporário para acesso via puppeteer
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
      // Criar HTML personalizado para este aluno
      let html = templateHtml;

      // Substituir dados do termo
      html = html.replace(
        /<span>Instituição: <\/span><span>Universidade Tecnológica Federal do Paraná - UTFPR<\/span>/g,
        `<span>Instituição: </span><span>${termo.instituicao}</span>`
      );

      html = html.replace(
        /<span>Câmpus: <\/span><span>Cornélio Procópio<\/span>/g,
        `<span>Câmpus: </span><span>${termo.campus}</span>`
      );

      html = html.replace(
        /<span class="tituloAcao">ELLP \(Ensino Lúdico de Lógica e Programação\)<\/span>/g,
        `<span class="tituloAcao">${termo.tituloDaAcao}</span>`
      );

      // Atualizar opção de modalidade
      const modalidades = ["programa", "projeto", "evento", "curso"];
      modalidades.forEach((modalidade) => {
        const isSelected = modalidade === termo.modalidade.toLowerCase();
        const replacement = isSelected ? "(X)" : "( )";
        const regex = new RegExp(`\\( \\) ${modalidade}`, "gi");
        html = html.replace(regex, `${replacement} ${modalidade}`);
      });

      // Formatar datas
      const dataInicio = new Date(termo.dataDeInicio);
      const dataTermino = new Date(termo.dataDeTermino);

      html = html.replace(
        /<span>15\/08\/2022<\/span>/g,
        `<span>${dataInicio.toLocaleDateString("pt-BR")}</span>`
      );

      html = html.replace(
        /<span>11\/08\/2023<\/span>/g,
        `<span>${dataTermino.toLocaleDateString("pt-BR")}</span>`
      );

      // Coordenação
      html = html.replace(
        /<span class="coordenacaoNome">Roberto Carlos Fernandes da Silva<\/span>/g,
        `<span class="coordenacaoNome">${termo.nomeCoordenacao}</span>`
      );

      html = html.replace(
        /<span class="cpf">000\.000\.000-00<\/span>/g,
        `<span class="cpf">${formatCPF(termo.cpfCoordenacao)}</span>`
      );

      html = html.replace(
        /<span class="departamento">DACOM<\/span>/g,
        `<span class="departamento">${termo.departamento}</span>`
      );

      html = html.replace(
        /<span>\( 43 \) 990000000<\/span>/g,
        `<span>${formatTelefone(termo.telefoneCoordenacao)}</span>`
      );

      html = html.replace(
        /<span>roberto@email\.com<\/span>/g,
        `<span>${termo.emailCoordenacao}</span>`
      );

      // Dados do aluno
      html = html.replace(
        /<span>Fulano Ribeiro Santos Almeida<\/span>/g,
        `<span>${aluno.nome}</span>`
      );

      const dataNascimento = new Date(aluno.dataDeNascimento);
      html = html.replace(
        /<span>09\/03\/2000<\/span>/g,
        `<span>${dataNascimento.toLocaleDateString("pt-BR")}</span>`
      );

      html = html.replace(
        /<span>000\.000\.000-00<\/span>/g,
        `<span>${formatCPF(aluno.cpf)}</span>`
      );

      // É estudante da UTFPR
      const isEstudante = aluno.estudanteDaUtfpr;
      html = html.replace(
        /<span class="eEstudanteOpcao">\(X\) Sim <\/span>/g,
        `<span class="eEstudanteOpcao">${
          isEstudante ? "(X)" : "( )"
        } Sim </span>`
      );

      html = html.replace(
        /<span class="eEstudanteOpcao">\( \) Não <\/span>/g,
        `<span class="eEstudanteOpcao">${
          !isEstudante ? "(X)" : "( )"
        } Não </span>`
      );

      // Curso, período e RA
      html = html.replace(
        /<span>Engenharia de Controle e automação<\/span>/g,
        `<span>${aluno.curso}</span>`
      );

      html = html.replace(/<span>6<\/span>/g, `<span>${aluno.periodo}</span>`);

      html = html.replace(/<span>0000000<\/span>/g, `<span>${aluno.ra}</span>`);

      // Endereço, cidade e estado
      html = html.replace(
        /<span>Rua Ordem e Progresso, 1230<\/span>/g,
        `<span>${aluno.endereco}</span>`
      );

      html = html.replace(
        /<span>Cornélio Procópio<\/span>/g,
        `<span>${aluno.cidade}</span>`
      );

      html = html.replace(/<span>PR<\/span>/g, `<span>${aluno.estado}</span>`);

      // Telefone e email
      html = html.replace(
        /<span>\(43\) 900000000<\/span>/g,
        `<span>${formatTelefone(aluno.telefone)}</span>`
      );

      html = html.replace(
        /<span>fulano@email\.com<\/span>/g,
        `<span>${aluno.email}</span>`
      );

      // Atividades a serem desenvolvidas
      const atividadesHTML = termo.atividadesParaDesenvolver
        .map(
          (atividade, index) =>
            `<div class="sinteseRow"><span>${
              index + 1
            } </span><span>${atividade}</span></div>`
        )
        .join("");

      const sinteseRegex = /<div class="sinteseRow">[\s\S]*?<\/div>/g;
      const allSinteseRows = html.match(sinteseRegex);

      if (allSinteseRows) {
        const originalSinteseSection = allSinteseRows.join("");
        const newSinteseSection =
          atividadesHTML +
          Array(Math.max(0, 11 - termo.atividadesParaDesenvolver.length))
            .fill(
              '<div class="sinteseRow"><span>&nbsp;</span><span>&nbsp;</span></div>'
            )
            .join("");

        html = html.replace(originalSinteseSection, newSinteseSection);
      }

      // Condições gerais
      let condicoesGeraisHTML = "";
      termo.condicoesGerais.forEach((condicao, index) => {
        condicoesGeraisHTML += `<p>${condicao.titulo}`;

        if (condicao.subtopicos && condicao.subtopicos.length > 0) {
          condicao.subtopicos.forEach((subtopico) => {
            condicoesGeraisHTML += `<br /><span>${subtopico}</span>`;
          });
        }

        condicoesGeraisHTML += `</p>`;
      });

      const condicoesGeraisRegex =
        /<div class="condicoesGerais">[\s\S]*?<\/div>/;
      const condicoesGeraisMatch = html.match(condicoesGeraisRegex);

      if (condicoesGeraisMatch) {
        const newCondicoesGerais = `<div class="condicoesGerais">
          <h3 class="docTitle">Condições Gerais</h3>
          ${condicoesGeraisHTML}
        </div>`;

        html = html.replace(condicoesGeraisMatch[0], newCondicoesGerais);
      }

      // Data atual
      const dataAtual = new Date();
      html = html.replace(
        /<span>22\/08\/2022<\/span>/g,
        `<span>${dataAtual.toLocaleDateString("pt-BR")}</span>`
      );

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

// Funções auxiliares
function formatCPF(cpf) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, "");

  // Formatação do CPF: XXX.XXX.XXX-XX
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatTelefone(telefone) {
  // Remove caracteres não numéricos
  telefone = telefone.replace(/\D/g, "");

  // Formatação do telefone: (XX) XXXXXXXXX
  if (telefone.length === 11) {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (telefone.length === 10) {
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return telefone;
}

function sanitizeFilename(filename) {
  // Substitui caracteres inválidos para nomes de arquivo
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
