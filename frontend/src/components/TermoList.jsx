import React, { useEffect, useState } from "react";
import { getTermos, deleteTermo } from "../services/termoService";
import TermoForm from "./TermoForm";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";
import styles from "./AlunoList.module.css";

function TermoList() {
  const [termos, setTermos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [confirmModalAberto, setConfirmModalAberto] = useState(false);
  const [termoParaExcluir, setTermoParaExcluir] = useState(null);

  const carregarTermos = () => {
    getTermos().then(setTermos);
  };

  const abrirModalCadastro = () => {
    setEditando(null);
    setModalAberto(true);
  };

  const abrirModalEdicao = (termo) => {
    setEditando(termo);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setEditando(null);
    setModalAberto(false);
  };

  const abrirConfirmacaoExclusao = (termo) => {
    setTermoParaExcluir(termo);
    setConfirmModalAberto(true);
  };

  const fecharConfirmacaoExclusao = () => {
    setTermoParaExcluir(null);
    setConfirmModalAberto(false);
  };

  const handleDeleteConfirmado = () => {
    if (termoParaExcluir) {
      deleteTermo(termoParaExcluir.id).then(() => {
        carregarTermos();
        fecharConfirmacaoExclusao();
      });
    }
  };

  useEffect(() => {
    carregarTermos();
  }, []);

  return (
    <div>
      <div className={styles.header}>
        <h2>Lista de Termos</h2>
        <button onClick={abrirModalCadastro} className={styles.createButton}>
          Cadastrar Termo
        </button>
      </div>
      <ul className={styles.list}>
        {termos.map((termo) => (
          <li key={termo.id} className={styles.item}>
            <strong>{termo.tituloDaAcao}</strong> — {termo.modalidade}
            <br />
            Período: {new Date(
              termo.dataDeInicio
            ).toLocaleDateString()} até{" "}
            {new Date(termo.dataDeTermino).toLocaleDateString()}
            <br />
            Coordenação: {termo.nomeCoordenacao} ({termo.cpfCoordenacao})
            <br />
            Instituição: {termo.instituicao} - Campus: {termo.campus}
            <br />
            E-mail: {termo.emailCoordenacao} | Telefone:{" "}
            {termo.telefoneCoordenacao}
            <br />
            Departamento: {termo.departamento}
            <br />
            <button
              onClick={() => abrirModalEdicao(termo)}
              className={styles.updateButton}
            >
              Editar
            </button>
            <button
              onClick={() => abrirConfirmacaoExclusao(termo)}
              className={styles.deleteButton}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>

      <Modal isOpen={modalAberto} onClose={fecharModal}>
        <TermoForm
          onSuccess={() => {
            carregarTermos();
            fecharModal();
          }}
          onCancel={fecharModal}
          termoEdit={editando}
          setTermoEdit={setEditando}
        />
      </Modal>

      <ConfirmDialog
        isOpen={confirmModalAberto}
        onClose={fecharConfirmacaoExclusao}
        onConfirm={handleDeleteConfirmado}
        mensagem={`Deseja realmente excluir o termo "${termoParaExcluir?.tituloDaAcao}"?`}
      />
    </div>
  );
}

export default TermoList;
