import React, { useEffect, useState } from "react";
import { createAluno, updateAluno } from "../services/alunoService";
import styles from "./AlunoForm.module.css";

function AlunoForm({ onSuccess, alunoEdit, setAlunoEdit, onCancel }) {
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
    email: "",
  });

  useEffect(() => {
    if (alunoEdit) {
      setForm({
        ...alunoEdit,
        dataDeNascimento: alunoEdit.dataDeNascimento.slice(0, 10), // formato YYYY-MM-DD para input date
      });
    }
  }, [alunoEdit]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox"
        ? e.target.checked
        : name === "periodo"
        ? parseInt(value)
        : value;
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
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>Nome</label>
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>CPF</label>
          <input name="cpf" value={form.cpf} onChange={handleChange} required />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>Data de Nascimento</label>
          <input
            name="dataDeNascimento"
            type="date"
            value={form.dataDeNascimento}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Estudante da UTFPR?</label>
          <select
            name="estudanteDaUtfpr"
            value={form.estudanteDaUtfpr ? "true" : "false"}
            onChange={(e) =>
              setForm({ ...form, estudanteDaUtfpr: e.target.value === "true" })
            }
          >
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>Curso</label>
          <input
            name="curso"
            value={form.curso}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Período</label>
          <input
            name="periodo"
            type="number"
            value={form.periodo}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>RA</label>
          <input name="ra" value={form.ra} onChange={handleChange} required />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label>Endereço</label>
        <input
          name="endereco"
          value={form.endereco}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>Cidade</label>
          <input
            name="cidade"
            value={form.cidade}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Estado</label>
          <input
            name="estado"
            value={form.estado}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>Telefone</label>
          <input
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit">{alunoEdit ? "Atualizar" : "Cadastrar"}</button>
        <button
          type="button"
          onClick={() => {
            setAlunoEdit(null);
            if (onCancel) onCancel();
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default AlunoForm;
