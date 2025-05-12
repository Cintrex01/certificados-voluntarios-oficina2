import styles from './Home.module.css'; 
import Sidebar from '../components/Sidebar'

function Home() {

  return (
    <>
      <div className={styles.container}>
        <Sidebar/>
        <div className={styles.content}>
            <h1 className={styles.title}>Bem-vindo à página Home!</h1>
            <p>Esse é o conteúdo de Home.</p>

            <div className={styles.card}>
              <span className={styles.icon}>🎓</span>
              <div>
                <p className={styles.text}>Alunos</p>
                <strong className={styles.count}>120</strong>
              </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default Home