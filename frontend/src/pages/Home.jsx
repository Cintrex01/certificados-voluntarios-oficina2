import styles from './Home.module.css'; 
import Sidebar from '../components/Sidebar'

function Home() {

  return (
    <>
      <div className={styles.container}>
        <Sidebar/>
        <div className={styles.content}>
            <h1 className={styles.title}>Bem-vindo à página Home!</h1>
            <p>Esse é o conteúdo de Homeeeee.</p>
        </div>
      </div>
    </>
  )
}

export default Home