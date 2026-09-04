import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const ROOMS = {
  1: { title: 'Habitación 1', code: '325100' },
  2: { title: 'Habitación 2', code: '123456' },
  3: { title: 'Habitación 3', code: '567890' },
  4: { title: 'Habitación 4', code: '901234' },
};

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

function getRoomIdFromHash() {
  const match = window.location.hash.match(/^#\/room\/([1-4])$/);
  return match ? Number(match[1]) : null;
}

function goTo(path) {
  window.location.hash = path;
}

function HomePage() {
  return (
    <main className="page-shell home-page">
      <section className="panel selection-panel">
        <div className="eyebrow">Laboratorio abandonado</div>
        <h1>Elige una habitación</h1>
        <p className="intro">
          Selecciona una opción para abrir la puerta correspondiente.
        </p>

        <div className="room-options">
          {Object.entries(ROOMS).map(([id, room]) => (
            <button
              key={id}
              className="room-option"
              type="button"
              onClick={() => goTo(`/room/${id}`)}
            >
              <span className="room-number">{id}</span>
              <span>{room.title}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function Keypad({ value, onChange }) {
  const addDigit = (digit) => {
    if (value.length < 6) {
      onChange(`${value}${digit}`);
    }
  };

  return (
    <div className="keypad" aria-label="Teclado numérico">
      {digits.map((digit) => (
        <button
          key={digit}
          type="button"
          className={`digit-button ${digit === '0' ? 'zero-button' : ''}`}
          onClick={() => addDigit(digit)}
          aria-label={`Ingresar ${digit}`}
        >
          {digit}
        </button>
      ))}
    </div>
  );
}

function RoomPage({ roomId }) {
  const room = ROOMS[roomId];
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimer = useRef(null);

  useEffect(() => {
    setInputValue('');
    setMessage('');
    setIsCodeCorrect(false);
    setIsTransitioning(false);

    return () => {
      if (transitionTimer.current) {
        clearTimeout(transitionTimer.current);
      }
    };
  }, [roomId]);

  const showSuccess = () => {
    setMessage('');
    setIsTransitioning(true);

    transitionTimer.current = setTimeout(() => {
      setIsCodeCorrect(true);
      setIsTransitioning(false);
    }, 260);
  };

  const handleSubmit = () => {
    if (!room || isCodeCorrect || isTransitioning) return;

    if (inputValue === room.code) {
      showSuccess();
    } else {
      setMessage('Código incorrecto. Inténtalo nuevamente.');
    }
  };

  const deleteDigit = () => {
    if (isTransitioning) return;
    setInputValue((current) => current.slice(0, -1));
    setMessage('');
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!room || isCodeCorrect || isTransitioning) return;

      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        setInputValue((current) =>
          current.length < 6 ? `${current}${event.key}` : current
        );
        setMessage('');
        return;
      }

      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        setInputValue((current) => current.slice(0, -1));
        setMessage('');
        return;
      }

      if (event.key === 'Enter' && inputValue.length === 6) {
        event.preventDefault();

        if (inputValue === room.code) {
          showSuccess();
        } else {
          setMessage('Código incorrecto. Inténtalo nuevamente.');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputValue, isCodeCorrect, isTransitioning, room]);

  if (!room) {
    return <HomePage />;
  }

  return (
    <main className="page-shell room-page">
      <section className="game-panel">
        {!isCodeCorrect ? (
          <div className={`challenge-content ${isTransitioning ? 'fade-out' : ''}`}>
            <button className="back-button" type="button" onClick={() => goTo('/')}>
              ← Volver
            </button>

            <div className="door-stage">
              <img
                src={`${process.env.PUBLIC_URL}/lab-door-closed.png`}
                alt="Puerta cerrada del laboratorio"
                className="central-image"
              />

              <div className="door-controls">
                <div className="code-display" aria-label="Código ingresado">
                  {inputValue.padEnd(6, '•').split('').map((character, index) => (
                    <span
                      key={index}
                      className={index < inputValue.length ? 'filled' : ''}
                    >
                      {index < inputValue.length ? character : '•'}
                    </span>
                  ))}
                </div>

                <Keypad value={inputValue} onChange={setInputValue} />
              </div>
            </div>

            <div className="game-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={deleteDigit}
                disabled={!inputValue || isTransitioning}
              >
                Borrar
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={handleSubmit}
                disabled={inputValue.length !== 6 || isTransitioning}
              >
                Enviar
              </button>
            </div>

            {message && <p className="error-message">{message}</p>}
          </div>
        ) : (
          <div className="success-container">
            <img
              src={`${process.env.PUBLIC_URL}/lab-door-open.png`}
              alt="Puerta abierta del laboratorio"
              className="success-image"
            />

            <h1>Puedes pasar a la siguiente habitación.</h1>

            <button
              type="button"
              className="primary-button home-button"
              onClick={() => goTo('/')}
            >
              Volver al inicio
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function App() {
  const [roomId, setRoomId] = useState(() => getRoomIdFromHash());

  useEffect(() => {
    const syncRoute = () => setRoomId(getRoomIdFromHash());

    if (!window.location.hash) {
      window.location.hash = '/';
    }

    window.addEventListener('hashchange', syncRoute);
    syncRoute();

    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  return (
    <div className="App">
      <div
        className="lab-background"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0.22)), url(${process.env.PUBLIC_URL}/lab-background.png)`,
        }}
        aria-hidden="true"
      />

      {roomId ? <RoomPage roomId={roomId} /> : <HomePage />}
    </div>
  );
}

export default App;
