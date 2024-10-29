// Input.js
import React from 'react';
import './App.css';

function Input({ value, onChange }) {

    const handleChange = (event) => {
        const newValue = event.target.value;
        // Permitir solo dígitos y un máximo de 4 caracteres
        if (/^\d{0,4}$/.test(newValue)) {
            onChange(event);
        }
    };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      className="custom-input"
      placeholder="Ingresa el código"
      maxLength="4"
    />
  );
}

export default Input;
