import React from "react";
import styles from "./Modal.module.css";

function ConfirmDialog({ isOpen, onClose, onConfirm, mensagem }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p>{mensagem}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <button onClick={onConfirm} className={styles.confirmButton}>
            Excluir
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
