// DigitButton.js
import React from 'react';
import './App.css';

function DigitButton({ digit, position, onClick }) {
  return (
    <button
      className="digit-button"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: '50px',  // Ajusta el tamaño según sea necesario
        height: '50px',
      }}
      onClick={() => onClick(digit)}
    >
      {digit}
    </button>
  );
}

export default DigitButton;
