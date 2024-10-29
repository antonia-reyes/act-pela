// ResetButton.js
import React from 'react';
import './App.css';

function ResetButton({ onClick, children }) {
  return (
    <button onClick={onClick} className="reset-button">
      {children}
    </button>
  );
}

export default ResetButton;
