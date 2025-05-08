import styles from './Alunos.module.css'; 
import Sidebar from '../components/Sidebar'
import AlunoList from '../components/AlunoList';

function Alunos() {

  return (
    <>
      <div className={styles.container}>
        <Sidebar/>
        <div className={styles.content}>
            <AlunoList/>
        </div>
      </div>
        
    </>
  )
}

export default Alunos