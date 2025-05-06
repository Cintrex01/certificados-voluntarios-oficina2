import styles from './Alunos.module.css'; 

function Alunos() {

  return (
    <>
        <div className={styles.container}>
            <h1 className={styles.title}>Bem-vindo à página de Alunos!</h1>
            <p>Esse é o conteúdo de Alunos.</p>
        </div>
    </>
  )
}

export default Alunos