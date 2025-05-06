import styles from './Termos.module.css';
import Sidebar from '../components/Sidebar' 

function Termos() {

  return (
    <>
      <div className={styles.container}>
        <Sidebar/>
        <div className={styles.content}>
            <h1 className={styles.title}>Bem-vindo à página de Termos!</h1>
            <p>Esse é o conteúdo de Termos.</p>
        </div>
      </div>
    </>
  )
}

export default Termos