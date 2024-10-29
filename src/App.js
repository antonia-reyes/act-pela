import './App.css';
import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import ResetButton from './ResetButton';
import DigitButton from './DigitButton';


function App() {

  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');

  const handleDigitClick = (digit) => {
    if (inputValue.length < 4) {
      setInputValue((prev) => prev + digit);
    }
  };

  const handleSubmit = () => {
    if (inputValue === '1234') {
      setMessage('Bien');
    } else {
      setMessage('Código incorrecto');
    }
  };

  const handleReset = () => {
    setInputValue('');
    setMessage('');
  };

  const digitPositions = [
    { top: 20, left: 60 },   // 1
    { top: 20, left: 120 },  // 2
    { top: 20, left: 180 },  // 3
    { top: 80, left: 60 },   // 4
    { top: 80, left: 120 },  // 5
    { top: 80, left: 180 },  // 6
    { top: 140, left: 60 },  // 7
    { top: 140, left: 120 }, // 8
    { top: 140, left: 180 }, // 9
    { top: 200, left: 120 }, // 0
  ];

  return (
    <div className="App">
      <img src={`${process.env.PUBLIC_URL}/cofre.png`} alt="Imagen central" className="central-image" />
      <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
      <Button onClick={handleSubmit}>Enviar</Button>
      <ResetButton onClick={handleReset}>Reiniciar</ResetButton>

      <div className="digit-container">
        {digitPositions.map((position, index) => (
          <DigitButton
            key={((index + 1) % 10).toString()}
            digit={((index + 1) % 10).toString()}
            position={position}
            onClick={handleDigitClick}
          />
        ))}
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
