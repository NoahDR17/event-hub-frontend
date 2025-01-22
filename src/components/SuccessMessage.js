import React from "react";
import styles from "../styles/SuccessMessage.module.css"

const SuccessMessage = ({ message, onClose }) => {
  return (
    <div className="success-message">
      <p>{message}</p>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

export default SuccessMessage;
