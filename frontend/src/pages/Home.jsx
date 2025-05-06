import styles from './Home.module.css'; 

function Home() {

  return (
    <>
      <div className={styles.container}>
      <h1 className={styles.title}>Bem-vindo à página inicial!</h1>
      <p>Esse é o conteúdo da Home.</p>
    </div>
    </>
  )
}

export default Home