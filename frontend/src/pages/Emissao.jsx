import styles from './Emissao.module.css';
import Sidebar from '../components/Sidebar' 

function Emissao() {

  return (
    <>
        <div className={styles.container}>
        <Sidebar/>
        <div className={styles.content}>
            <h1 className={styles.title}>Bem-vindo à página de Emissão!</h1>
            <p>Esse é o conteúdo de Emissão.</p>
        </div>
      </div>
    </>
  )
}

export default Emissao