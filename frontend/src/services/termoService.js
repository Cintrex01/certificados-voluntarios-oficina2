const API_URL = "http://localhost:3000";

export const getTermos = () =>
  fetch(`${API_URL}/termos`).then((res) => res.json());

export const createTermo = (termo) =>
  fetch(`${API_URL}/termos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(termo),
  }).then((res) => res.json());

export const updateTermo = (id, termo) =>
  fetch(`${API_URL}/termos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(termo),
  }).then((res) => res.json());

export const deleteTermo = (id) =>
  fetch(`${API_URL}/termos/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
