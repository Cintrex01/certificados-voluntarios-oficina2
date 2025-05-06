import styles from './Alunos.module.css'; 
import Sidebar from '../components/Sidebar'

function Alunos() {

  return (
    <>
      <div className={styles.container}>
        <Sidebar/>
        <div className={styles.content}>
            <h1 className={styles.title}>Bem-vindo à página de Alunos!</h1>
            <p>Esse é o conteúdo de Alunos.</p>
        </div>
      </div>
        
    </>
  )
}

export default Alunos