import React, { useEffect, useState } from "react";
import { createAluno, updateAluno } from "../services/alunoService";
import styles from "./Form.module.css";

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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (alunoEdit) {
      setForm({
        ...alunoEdit,
        dataDeNascimento: alunoEdit.dataDeNascimento.slice(0, 10),
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

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    let rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    return rest === parseInt(cpf[10]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    Object.entries(form).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        newErrors[key] = "Campo obrigatório.";
      }
    });

    if (form.email && !isValidEmail(form.email)) {
      newErrors.email = "E-mail inválido.";
    }

    if (form.cpf && !isValidCPF(form.cpf)) {
      newErrors.cpf = "CPF inválido.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const dataDeNascimentoISO = new Date(form.dataDeNascimento).toISOString();

    const alunoData = {
      ...form,
      dataDeNascimento: dataDeNascimentoISO,
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
          <input name="nome" value={form.nome} onChange={handleChange} />
          {errors.nome && (
            <small className={styles.errorText}>{errors.nome}</small>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label>CPF</label>
          <input name="cpf" value={form.cpf} onChange={handleChange} />
          {errors.cpf && (
            <small className={styles.errorText}>{errors.cpf}</small>
          )}
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
          />
          {errors.dataDeNascimento && (
            <small className={styles.errorText}>
              {errors.dataDeNascimento}
            </small>
          )}
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
          <input name="curso" value={form.curso} onChange={handleChange} />
          {errors.curso && (
            <small className={styles.errorText}>{errors.curso}</small>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label>Período</label>
          <select name="periodo" value={form.periodo} onChange={handleChange}>
            <option value="">Selecione o período</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{`${i + 1}º período`}</option>
            ))}
          </select>
          {errors.periodo && (
            <small className={styles.errorText}>{errors.periodo}</small>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label>RA</label>
          <input name="ra" value={form.ra} onChange={handleChange} />
          {errors.ra && <small className={styles.errorText}>{errors.ra}</small>}
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label>Endereço</label>
        <input name="endereco" value={form.endereco} onChange={handleChange} />
        {errors.endereco && (
          <small className={styles.errorText}>{errors.endereco}</small>
        )}
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>Cidade</label>
          <input name="cidade" value={form.cidade} onChange={handleChange} />
          {errors.cidade && (
            <small className={styles.errorText}>{errors.cidade}</small>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label>Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange}>
            <option value="">Selecione o estado</option>
            {[
              "AC",
              "AL",
              "AP",
              "AM",
              "BA",
              "CE",
              "DF",
              "ES",
              "GO",
              "MA",
              "MT",
              "MS",
              "MG",
              "PA",
              "PB",
              "PR",
              "PE",
              "PI",
              "RJ",
              "RN",
              "RS",
              "RO",
              "RR",
              "SC",
              "SP",
              "SE",
              "TO",
            ].map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
          {errors.estado && (
            <small className={styles.errorText}>{errors.estado}</small>
          )}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>Telefone</label>
          <input
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
          />
          {errors.telefone && (
            <small className={styles.errorText}>{errors.telefone}</small>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} />
          {errors.email && (
            <small className={styles.errorText}>{errors.email}</small>
          )}
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
