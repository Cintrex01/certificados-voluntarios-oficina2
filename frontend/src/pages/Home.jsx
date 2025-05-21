import { useEffect, useState } from 'react';
import styles from './Home.module.css'; 
import Sidebar from '../components/Sidebar';
import { PiStudent } from "react-icons/pi";
import { PiCertificateLight } from "react-icons/pi";
import { getAlunos } from '../services/alunoService';
import { getTermos } from '../services/termoService';

function Home() {
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [totalTermos, setTotalTermos] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const alunos = await getAlunos();
        const termos = await getTermos();
        setTotalAlunos(alunos.length);
        setTotalTermos(termos.length);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.linhacont}>
          <div className={styles.cardTermo}>
            <div>
              <i className={styles.iconTermo}><PiCertificateLight /></i>
            </div>
            <div className={styles.text}>
              <p>Termos de voluntário</p>
            </div>
            <div className={styles.count}>
              <strong>{totalTermos}</strong>
            </div>
          </div>

          <div className={styles.cardAluno}>
            <div>
              <i className={styles.iconAluno}><PiStudent /></i>
            </div>
            <div className={styles.text}>
              <p>Alunos</p>
            </div>
            <div className={styles.count}>
              <strong>{totalAlunos}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;