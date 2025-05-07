import React, { useEffect, useState } from "react";
import { getAlunos, deleteAluno } from "../services/alunoService";
import AlunoForm from "./AlunoForm";

function AlunoList() {
  const [alunos, setAlunos] = useState([]);
  const [editando, setEditando] = useState(null);

  const carregarAlunos = () => {
    getAlunos().then(setAlunos);
  };

  const handleDelete = (id) => {
    deleteAluno(id).then(() => carregarAlunos());
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  return (
    <div>
      <h2>Lista de Alunos</h2>
      <AlunoForm
        onSuccess={carregarAlunos}
        alunoEdit={editando}
        setAlunoEdit={setEditando}
      />
      <ul>
        {alunos.map((aluno) => (
          <li key={aluno.id}>
            <strong>{aluno.nome}</strong> — {aluno.email} | CPF: {aluno.cpf} | Nascimento: {new Date(aluno.dataDeNascimento).toLocaleDateString()} | UTFPR: {aluno.estudanteDaUtfpr ? "Sim" : "Não"}<br />
            Curso: {aluno.curso}, Período: {aluno.periodo}, RA: {aluno.ra}<br />
            {aluno.endereco}, {aluno.cidade} - {aluno.estado}<br />
            Tel: {aluno.telefone}
            <br />
            <button onClick={() => setEditando(aluno)}>Editar</button>
            <button onClick={() => handleDelete(aluno.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlunoList;