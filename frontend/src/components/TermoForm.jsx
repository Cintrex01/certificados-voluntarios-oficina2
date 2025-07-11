import React, { useState, useEffect } from "react";
import styles from "./Form.module.css";
import { createTermo, updateTermo } from "../services/termoService";

function TermoForm({ onSuccess, termoEdit, setTermoEdit, onCancel }) {
  const [form, setForm] = useState({
    instituicao: "",
    campus: "",
    tituloDaAcao: "",
    modalidade: "",
    dataDeInicio: "",
    dataDeTermino: "",
    nomeCoordenacao: "",
    cpfCoordenacao: "",
    departamento: "",
    telefoneCoordenacao: "",
    emailCoordenacao: "",
    atividadesParaDesenvolver: [""],
    condicoesGerais: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (termoEdit) {
      setForm({
        ...termoEdit,
        dataDeInicio: termoEdit.dataDeInicio.slice(0, 10),
        dataDeTermino: termoEdit.dataDeTermino.slice(0, 10),
      });
    }
  }, [termoEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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

  const handleArrayChange = (index, value) => {
    const atividades = [...form.atividadesParaDesenvolver];
    atividades[index] = value;
    setForm({ ...form, atividadesParaDesenvolver: atividades });
  };

  const addAtividade = () => {
    setForm({
      ...form,
      atividadesParaDesenvolver: [...form.atividadesParaDesenvolver, ""],
    });
  };

  const removeAtividade = (index) => {
    const atividades = [...form.atividadesParaDesenvolver];
    atividades.splice(index, 1);
    setForm({ ...form, atividadesParaDesenvolver: atividades });
  };

  const addTopico = () => {
    setForm({
      ...form,
      condicoesGerais: [
        ...form.condicoesGerais,
        { titulo: "", subtopicos: [] },
      ],
    });
  };

  const removeTopico = (index) => {
    const novos = [...form.condicoesGerais];
    novos.splice(index, 1);
    setForm({ ...form, condicoesGerais: novos });
  };

  const handleTopicoChange = (index, value) => {
    const novos = [...form.condicoesGerais];
    novos[index].titulo = value;
    setForm({ ...form, condicoesGerais: novos });
  };

  const addSubtopico = (topicoIndex) => {
    const novos = [...form.condicoesGerais];
    novos[topicoIndex].subtopicos.push("");
    setForm({ ...form, condicoesGerais: novos });
  };

  const removeSubtopico = (topicoIndex, subIndex) => {
    const novos = [...form.condicoesGerais];
    novos[topicoIndex].subtopicos.splice(subIndex, 1);
    setForm({ ...form, condicoesGerais: novos });
  };

  const handleSubtopicoChange = (topicoIndex, subIndex, value) => {
    const novos = [...form.condicoesGerais];
    novos[topicoIndex].subtopicos[subIndex] = value;
    setForm({ ...form, condicoesGerais: novos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const requiredFields = [
      "instituicao",
      "campus",
      "tituloDaAcao",
      "modalidade",
      "dataDeInicio",
      "dataDeTermino",
      "nomeCoordenacao",
      "cpfCoordenacao",
      "departamento",
      "telefoneCoordenacao",
      "emailCoordenacao",
    ];

    requiredFields.forEach((field) => {
      if (
        !form[field] ||
        form[field] === "" ||
        form[field] === null ||
        form[field] === undefined
      ) {
        newErrors[field] = "Campo obrigatório.";
      }
    });

    // Validação específica do email
    if (form.emailCoordenacao && !isValidEmail(form.emailCoordenacao)) {
      newErrors.emailCoordenacao = "E-mail inválido.";
    }

    // Validação específica do CPF
    if (form.cpfCoordenacao && !isValidCPF(form.cpfCoordenacao)) {
      newErrors.cpfCoordenacao = "CPF inválido.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const termoData = {
      ...form,
      dataDeInicio: new Date(form.dataDeInicio).toISOString(),
      dataDeTermino: new Date(form.dataDeTermino).toISOString(),
    };

    if (termoEdit) {
      delete termoData.id;
      delete termoData._id;
    }

    try {
      const action = termoEdit
        ? updateTermo(termoEdit.id, termoData)
        : createTermo(termoData);

      await action;

      setForm({
        instituicao: "",
        campus: "",
        tituloDaAcao: "",
        modalidade: "",
        dataDeInicio: "",
        dataDeTermino: "",
        nomeCoordenacao: "",
        cpfCoordenacao: "",
        departamento: "",
        telefoneCoordenacao: "",
        emailCoordenacao: "",
        atividadesParaDesenvolver: [""],
        condicoesGerais: [],
      });
      setTermoEdit(null);
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar termo:", error);
      alert(`Erro ao salvar termo: ${error.message || "verifique o console"}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {/* Campos básicos escritos um por um */}
      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>Instituição</label>
          <input
            type="text"
            name="instituicao"
            value={form.instituicao}
            onChange={handleChange}
          />
          {errors.instituicao && (
            <small className={styles.errorText}>{errors.instituicao}</small>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label>Campus</label>
          <input
            type="text"
            name="campus"
            value={form.campus}
            onChange={handleChange}
          />
          {errors.campus && (
            <small className={styles.errorText}>{errors.campus}</small>
          )}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>Título da Ação</label>
          <input
            type="text"
            name="tituloDaAcao"
            value={form.tituloDaAcao}
            onChange={handleChange}
          />
          {errors.tituloDaAcao && (
            <small className={styles.errorText}>{errors.tituloDaAcao}</small>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label>Modalidade</label>
          <select
            name="modalidade"
            value={form.modalidade}
            onChange={handleChange}
          >
            <option value="">Selecione a modalidade</option>
            <option value="programa">Programa</option>
            <option value="projeto">Projeto</option>
            <option value="evento">Evento</option>
            <option value="curso">Curso</option>
          </select>
          {errors.modalidade && (
            <small className={styles.errorText}>{errors.modalidade}</small>
          )}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>Data de Início</label>
          <input
            type="date"
            name="dataDeInicio"
            value={form.dataDeInicio}
            onChange={handleChange}
          />
          {errors.dataDeInicio && (
            <small className={styles.errorText}>{errors.dataDeInicio}</small>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label>Data de Término</label>
          <input
            type="date"
            name="dataDeTermino"
            value={form.dataDeTermino}
            onChange={handleChange}
          />
          {errors.dataDeTermino && (
            <small className={styles.errorText}>{errors.dataDeTermino}</small>
          )}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>Nome da Coordenação</label>
          <input
            type="text"
            name="nomeCoordenacao"
            value={form.nomeCoordenacao}
            onChange={handleChange}
          />
          {errors.nomeCoordenacao && (
            <small className={styles.errorText}>{errors.nomeCoordenacao}</small>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label>CPF da Coordenação</label>
          <input
            type="text"
            name="cpfCoordenacao"
            value={form.cpfCoordenacao}
            onChange={handleChange}
          />
          {errors.cpfCoordenacao && (
            <small className={styles.errorText}>{errors.cpfCoordenacao}</small>
          )}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>Departamento</label>
          <input
            type="text"
            name="departamento"
            value={form.departamento}
            onChange={handleChange}
          />
          {errors.departamento && (
            <small className={styles.errorText}>{errors.departamento}</small>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label>Telefone da Coordenação</label>
          <input
            type="text"
            name="telefoneCoordenacao"
            value={form.telefoneCoordenacao}
            onChange={handleChange}
          />
          {errors.telefoneCoordenacao && (
            <small className={styles.errorText}>
              {errors.telefoneCoordenacao}
            </small>
          )}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>Email da Coordenação</label>
          <input
            type="email"
            name="emailCoordenacao"
            value={form.emailCoordenacao}
            onChange={handleChange}
          />
          {errors.emailCoordenacao && (
            <small className={styles.errorText}>
              {errors.emailCoordenacao}
            </small>
          )}
        </div>
      </div>

      {/* Atividades */}
      <div className={styles.inputGroup}>
        <label>Atividades para Desenvolver</label>
        {form.atividadesParaDesenvolver.map((atividade, index) => (
          <div key={index} className={styles.inputWithButton}>
            <textarea
              value={atividade}
              onChange={(e) => handleArrayChange(index, e.target.value)}
              rows={4}
              className={styles.textarea}
            />
            <button type="button" onClick={() => removeAtividade(index)}>
              Remover Atividade
            </button>
          </div>
        ))}
        <button type="button" onClick={addAtividade}>
          Adicionar Atividade
        </button>
      </div>

      {/* Condições Gerais */}
      <div className={styles.inputGroup}>
        <label>Condições Gerais</label>
        {form.condicoesGerais.map((topico, i) => (
          <div key={i} className={styles.inputGroup}>
            <label>Tópico</label>
            <textarea
              placeholder="Título do Tópico"
              value={topico.titulo}
              onChange={(e) => handleTopicoChange(i, e.target.value)}
              rows={2}
              className={styles.textarea}
            />
            <div style={{ marginTop: "0.5rem" }}>
              <label>Subtópicos</label>
              {topico.subtopicos.map((sub, j) => (
                <div key={j} className={styles.inputWithButton}>
                  <textarea
                    placeholder="Subtópico"
                    value={sub}
                    onChange={(e) =>
                      handleSubtopicoChange(i, j, e.target.value)
                    }
                    rows={3}
                    className={styles.textarea}
                  />
                  <button type="button" onClick={() => removeSubtopico(i, j)}>
                    Remover Subtópico
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.buttonSubGroup}>
              <button type="button" onClick={() => addSubtopico(i)}>
                Adicionar Subtópico
              </button>
              <button type="button" onClick={() => removeTopico(i)}>
                Remover Tópico
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addTopico}>
          Adicionar Tópico
        </button>
      </div>

      {/* Botões */}
      <div className={styles.buttonGroup}>
        <button type="submit">{termoEdit ? "Atualizar" : "Cadastrar"}</button>
        <button
          type="button"
          onClick={() => {
            setTermoEdit(null);
            if (onCancel) onCancel();
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default TermoForm;
