import styles from "./Emissao.module.css";
import Sidebar from "../components/Sidebar";
import { getAlunos } from "../services/alunoService";
import { getTermos } from "../services/termoService";
import { useState, useEffect } from "react";

function Emissao() {
  const [alunos, setAlunos] = useState([]);
  const [termos, setTermos] = useState([]);
  const [selectedAlunos, setSelectedAlunos] = useState([]);
  const [selectedTermo, setSelectedTermo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filteredAlunos, setFilteredAlunos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alunosData, termosData] = await Promise.all([
          getAlunos(),
          getTermos(),
        ]);
        setAlunos(alunosData);
        setFilteredAlunos(alunosData);
        setTermos(termosData);
      } catch (error) {
        setError("Erro ao carregar dados. Por favor, tente novamente.");
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filtrar alunos com base na pesquisa
    if (search) {
      const filtered = alunos.filter(
        (aluno) =>
          aluno.nome.toLowerCase().includes(search.toLowerCase()) ||
          aluno.cpf.includes(search) ||
          aluno.ra?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredAlunos(filtered);
    } else {
      setFilteredAlunos(alunos);
    }
  }, [search, alunos]);

  const handleSelectAluno = (alunoId) => {
    // Se já estiver selecionado, remove da seleção
    if (selectedAlunos.includes(alunoId)) {
      setSelectedAlunos((prev) => prev.filter((id) => id !== alunoId));
    } else {
      // Adiciona à seleção
      setSelectedAlunos((prev) => [...prev, alunoId]);
    }
  };

  const handleSelectTermo = (termoId) => {
    setSelectedTermo(termoId);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleEmitirTermos = async () => {
    // Validações
    if (!selectedTermo) {
      setError("Por favor, selecione um termo.");
      return;
    }

    if (selectedAlunos.length === 0) {
      setError("Por favor, selecione pelo menos um aluno.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3000/pdfs/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          termoId: selectedTermo,
          alunoIds: selectedAlunos,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao gerar PDFs");
      }

      // Se a resposta for um blob (arquivo)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `termos_${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      setSuccess("Termos gerados com sucesso!");
      // Limpar seleção após gerar com sucesso
      setSelectedAlunos([]);
      setSelectedTermo("");
    } catch (error) {
      setError(`Erro ao gerar PDFs: ${error.message}`);
      console.error("Erro ao gerar PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <>
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.content}>
          <div className={styles.container2}>
            <h1 className={styles.title}>Emissão de Termos de Adesão</h1>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <div className={styles.section}>
              <h2>Selecione um Termo</h2>
              <div className={styles.termosGrid}>
                {termos.map((termo) => (
                  <div
                    key={termo.id}
                    className={`${styles.termoCard} ${
                      selectedTermo === termo.id ? styles.selectedCard : ""
                    }`}
                    onClick={() => handleSelectTermo(termo.id)}
                  >
                    <h3>{termo.tituloDaAcao}</h3>
                    <p>
                      <strong>Instituição:</strong> {termo.instituicao}
                    </p>
                    <p>
                      <strong>Campus:</strong> {termo.campus}
                    </p>
                    <p>
                      <strong>Modalidade:</strong> {termo.modalidade}
                    </p>
                    <p>
                      <strong>Vigência:</strong>{" "}
                      {formatDate(termo.dataDeInicio)} a{" "}
                      {formatDate(termo.dataDeTermino)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2>Selecione os Alunos</h2>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Buscar por nome, CPF ou RA"
                  value={search}
                  onChange={handleSearch}
                />
                <span className={styles.alunoCounter}>
                  {selectedAlunos.length} aluno(s) selecionado(s)
                </span>
              </div>

              <div className={styles.alunosTable}>
                <table>
                  <thead>
                    <tr>
                      <th>Selecionar</th>
                      <th>Nome</th>
                      <th>CPF</th>
                      <th>RA</th>
                      <th>Curso</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAlunos.map((aluno) => (
                      <tr
                        key={aluno.id}
                        className={
                          selectedAlunos.includes(aluno.id)
                            ? styles.selectedRow
                            : ""
                        }
                        onClick={() => handleSelectAluno(aluno.id)}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedAlunos.includes(aluno.id)}
                            onChange={() => {}} // O onClick da linha já cuida disso
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td>{aluno.nome}</td>
                        <td>{aluno.cpf}</td>
                        <td>{aluno.ra}</td>
                        <td>{aluno.curso}</td>
                        <td>{aluno.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <button
                className={styles.emitirButton}
                onClick={handleEmitirTermos}
                disabled={
                  loading || selectedAlunos.length === 0 || !selectedTermo
                }
              >
                {loading ? "Gerando..." : "Emitir Termo(s)"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Emissao;
