import styles from "./Termos.module.css";
import Sidebar from "../components/Sidebar";
import TermoList from "../components/TermoList";

function Termos() {
  return (
    <>
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.content}>
          <TermoList />
        </div>
      </div>
    </>
  );
}

export default Termos;
