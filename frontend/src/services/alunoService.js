const API_URL = "http://localhost:3000";

export const getAlunos = () =>
  fetch(`${API_URL}/alunos`).then((res) => res.json());

export const createAluno = (aluno) =>
  fetch(`${API_URL}/alunos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aluno),
  }).then((res) => res.json());

export const updateAluno = (id, aluno) =>
  fetch(`${API_URL}/alunos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aluno),
  }).then((res) => res.json());

export const deleteAluno = (id) =>
  fetch(`${API_URL}/alunos/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
