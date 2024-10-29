// Button.js
import React from 'react';
import './App.css';

function Button({ onClick, children }) {
  return (
    <button onClick={onClick} className="submit-button">
      {children}
    </button>
  );
}

export default Button;
