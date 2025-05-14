import styles from './Home.module.css'; 
import Sidebar from '../components/Sidebar'
import { PiStudent } from "react-icons/pi";
import { PiCertificateLight } from "react-icons/pi";

function Home() {

  return (
    <>
      <div className={styles.container}>
        <Sidebar/>
        <div className={styles.content}>
          <div className={styles.linhacont}>
            <div className={styles.cardTermo}>
              <div >
                <i className={styles.iconTermo}><PiCertificateLight /></i>
              </div>
              <div className={styles.text}>
                <p>Termos de voluntário</p>
              </div>
              <div className={styles.count}>
                <strong>120</strong>
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
                <strong>120</strong>
              </div>
            </div>
          </div>   
        </div>
      </div>
    </>
  )
}

export default Home