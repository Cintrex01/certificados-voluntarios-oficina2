import styles from './Sidebar.module.css'; 
import { IoHomeOutline } from "react-icons/io5";
import { PiCertificateLight } from "react-icons/pi";
import { PiStudent } from "react-icons/pi";
import { FaRegFilePdf } from "react-icons/fa6";
import ellp from '../assets/ellp.png'
import { NavLink } from 'react-router-dom';

function Alunos() {

  return (
    <>
        <div className={styles.container}>
            <div className={styles.box1}>
                <div className={styles.title}>
                    <h1>ELLP</h1>
                </div>
            </div>
            <div className={styles.box2}>
                <NavLink to="/" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                    <button>
                        <span>
                            <i className={styles.icon}><IoHomeOutline /></i>
                            <span className={styles.option}>Home</span>
                        </span>
                    </button>
                </NavLink>
                <NavLink to="/termos" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                    <button>
                        <span>
                            <i className={styles.icon}><PiCertificateLight /></i>
                            <span className={styles.option}>Termos</span>
                        </span>
                    </button>
                </NavLink>
                <NavLink to="/alunos" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}> 
                    <button>
                        <span>
                            <i className={styles.icon}><PiStudent /></i>
                            <span className={styles.option}>Alunos</span>
                        </span>
                    </button>
                </NavLink>
                <NavLink to="/emissao" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                    <button>
                        <span>
                            <i className={styles.icon}><FaRegFilePdf /></i>
                            <span className={styles.option}>Gerar PDF</span>
                        </span>
                    </button>
                </NavLink>
            </div>
            <div className={styles.box3}>
                <img src={ellp} alt="Ellp logo" className={styles.imagem} />
            </div>
        </div>
    </>
  )
}

export default Alunos