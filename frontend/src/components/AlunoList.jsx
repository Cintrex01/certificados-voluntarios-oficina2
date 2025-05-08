import React, { useEffect, useState } from "react";
import { getAlunos, deleteAluno } from "../services/alunoService";
import AlunoForm from "./AlunoForm";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";
import styles from "./AlunoList.module.css";

function AlunoList() {
  const [alunos, setAlunos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  const [confirmModalAberto, setConfirmModalAberto] = useState(false);
  const [alunoParaExcluir, setAlunoParaExcluir] = useState(null);

  const carregarAlunos = () => {
    getAlunos().then(setAlunos);
  };

  const abrirModalCadastro = () => {
    setEditando(null);
    setModalAberto(true);
  };

  const abrirModalEdicao = (aluno) => {
    setEditando(aluno);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setEditando(null);
    setModalAberto(false);
  };

  const abrirConfirmacaoExclusao = (aluno) => {
    setAlunoParaExcluir(aluno);
    setConfirmModalAberto(true);
  };

  const fecharConfirmacaoExclusao = () => {
    setAlunoParaExcluir(null);
    setConfirmModalAberto(false);
  };

  const handleDeleteConfirmado = () => {
    if (alunoParaExcluir) {
      deleteAluno(alunoParaExcluir.id).then(() => {
        carregarAlunos();
        fecharConfirmacaoExclusao();
      });
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  return (
    <div>
      <div className={styles.header}>
        <h2>Lista de Alunos</h2>
        <button onClick={abrirModalCadastro} className={styles.createButton}>
          Cadastrar Aluno
        </button>
      </div>
      <ul className={styles.list}>
        {alunos.map((aluno) => (
          <li key={aluno.id} className={styles.item}>
            <strong>{aluno.nome}</strong> — {aluno.email} | CPF: {aluno.cpf} |
            Nascimento: {new Date(aluno.dataDeNascimento).toLocaleDateString()}{" "}
            | UTFPR: {aluno.estudanteDaUtfpr ? "Sim" : "Não"}
            <br />
            Curso: {aluno.curso}, Período: {aluno.periodo}, RA: {aluno.ra}
            <br />
            {aluno.endereco}, {aluno.cidade} - {aluno.estado}
            <br />
            Tel: {aluno.telefone}
            <br />
            <button
              onClick={() => abrirModalEdicao(aluno)}
              className={styles.updateButton}
            >
              Editar
            </button>
            <button
              onClick={() => abrirConfirmacaoExclusao(aluno)}
              className={styles.deleteButton}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>

      {/* Modal de Cadastro/Edição */}
      <Modal isOpen={modalAberto} onClose={fecharModal}>
        <AlunoForm
          onSuccess={() => {
            carregarAlunos();
            fecharModal();
          }}
          onCancel={fecharModal}
          alunoEdit={editando}
          setAlunoEdit={setEditando}
        />
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDialog
        isOpen={confirmModalAberto}
        onClose={fecharConfirmacaoExclusao}
        onConfirm={handleDeleteConfirmado}
        mensagem={`Deseja realmente excluir o aluno ${alunoParaExcluir?.nome}?`}
      />
    </div>
  );
}

export default AlunoList;
