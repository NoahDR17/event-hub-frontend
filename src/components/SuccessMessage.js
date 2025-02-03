import React from "react";

const SuccessMessage = ({ message, onClose }) => {
  return (
    <div className="success-message">
      <p>{message}</p>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

export default SuccessMessage;
