import React, { useEffect, useState } from "react";
import { createAluno, updateAluno } from "../services/alunoService";

function AlunoForm({ onSuccess, alunoEdit, setAlunoEdit }) {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    dataDeNascimento: "",
    estudanteDaUtfpr: false,
    curso: "",
    periodo: "",
    ra: "",
    endereco: "",
    cidade: "",
    estado: "",
    telefone: "",
    email: ""
  });

  useEffect(() => {
    if (alunoEdit) {
      setForm({
        ...alunoEdit,
        dataDeNascimento: alunoEdit.dataDeNascimento.slice(0, 10) // formato YYYY-MM-DD para input date
      });
    }
  }, [alunoEdit]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox"
      ? e.target.checked
      : (name === "periodo" ? parseInt(value) : value);
    setForm({ ...form, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    
    const dataDeNascimentoISO = new Date(form.dataDeNascimento).toISOString();
  
    const alunoData = {
      nome: form.nome,
      cpf: form.cpf,
      dataDeNascimento: dataDeNascimentoISO,  
      estudanteDaUtfpr: form.estudanteDaUtfpr,
      curso: form.curso,
      periodo: form.periodo,
      ra: form.ra,
      endereco: form.endereco,
      cidade: form.cidade,
      estado: form.estado,
      telefone: form.telefone,
      email: form.email,
    };
  
    try {
      
      const action = alunoEdit
        ? updateAluno(alunoEdit.id, alunoData) 
        : createAluno(alunoData); 
  
      await action;
  
      setForm({
        nome: "",
        cpf: "",
        dataDeNascimento: "",
        estudanteDaUtfpr: false,
        curso: "",
        periodo: "",
        ra: "",
        endereco: "",
        cidade: "",
        estado: "",
        telefone: "",
        email: "",
      });
      setAlunoEdit(null);
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      alert("Erro ao salvar aluno. Verifique os dados e tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required />
      <input name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} required />
      <input name="dataDeNascimento" type="date" value={form.dataDeNascimento} onChange={handleChange} required />
      <select name="estudanteDaUtfpr" value={form.estudanteDaUtfpr ? "true" : "false"} onChange={(e) => setForm({ ...form, estudanteDaUtfpr: e.target.value === "true" })}>
        <option value="true">Sim</option>
        <option value="false">Não</option>
      </select>
      <input name="curso" placeholder="Curso" value={form.curso} onChange={handleChange} required />
      <input name="periodo" type="number" placeholder="Período" value={form.periodo} onChange={handleChange} required />
      <input name="ra" placeholder="RA" value={form.ra} onChange={handleChange} required />
      <input name="endereco" placeholder="Endereço" value={form.endereco} onChange={handleChange} required />
      <input name="cidade" placeholder="Cidade" value={form.cidade} onChange={handleChange} required />
      <input name="estado" placeholder="Estado" value={form.estado} onChange={handleChange} required />
      <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />

      <button type="submit">{alunoEdit ? "Atualizar" : "Cadastrar"}</button>
      {alunoEdit && <button type="button" onClick={() => setAlunoEdit(null)}>Cancelar</button>}
    </form>
  );
}

export default AlunoForm;