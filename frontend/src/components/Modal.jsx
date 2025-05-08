import React from "react";
import styles from "./Modal.module.css";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
