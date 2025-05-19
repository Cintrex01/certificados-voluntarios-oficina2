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
          <select
            name="periodo"
            value={form.periodo}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o período</option>
            <option value="1">1º período</option>
            <option value="2">2º período</option>
            <option value="3">3º período</option>
            <option value="4">4º período</option>
            <option value="5">5º período</option>
            <option value="6">6º período</option>
            <option value="7">7º período</option>
            <option value="8">8º período</option>
            <option value="9">9º período</option>
            <option value="10">10º período</option>
          </select>
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
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o estado</option>
            <option value="AC">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AP">Amapá</option>
            <option value="AM">Amazonas</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceará</option>
            <option value="DF">Distrito Federal</option>
            <option value="ES">Espírito Santo</option>
            <option value="GO">Goiás</option>
            <option value="MA">Maranhão</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Pará</option>
            <option value="PB">Paraíba</option>
            <option value="PR">Paraná</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piauí</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RO">Rondônia</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SP">São Paulo</option>
            <option value="SE">Sergipe</option>
            <option value="TO">Tocantins</option>
          </select>
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
