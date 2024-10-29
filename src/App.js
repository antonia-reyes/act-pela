import './App.css';
import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import ResetButton from './ResetButton';


function App() {

  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    if (inputValue === '1234') {
      setMessage('Bien');
    } else {
      setMessage('Mal');
    }
  };

  const handleReset = () => {
    setInputValue('');
    setMessage('');
  };

  return (
    <div className="App">
      <img src={`${process.env.PUBLIC_URL}/fondo6.png`} alt="Imagen central" className="central-image" />
      <Input value={inputValue} onChange={handleInputChange} />
      <Button onClick={handleSubmit}>Enviar</Button>
      <ResetButton onClick={handleReset}>Reiniciar</ResetButton>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
