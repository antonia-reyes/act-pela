import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const TREASURES = {
  1: {
    title: 'Tesoro 1',
    code: '325100',
  },
  2: {
    title: 'Tesoro 2',
    code: '123456',
  },
  3: {
    title: 'Tesoro 3',
    code: '567890',
  },
  4: {
    title: 'Tesoro 4',
    code: '901234',
  },
};

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

function getTreasureIdFromHash() {
  const match = window.location.hash.match(/^#\/treasure\/([1-4])$/);
  return match ? Number(match[1]) : null;
}

function goTo(path) {
  window.location.hash = path;
}

function HomePage() {
  return (
    <main className="page-shell home-page">
      <section className="panel selection-panel">
        <div className="eyebrow">Actividad</div>
        <h1>Elige un tesoro</h1>
        <p className="intro">
          Selecciona una opción para abrir el desafío correspondiente.
        </p>

        <div className="treasure-options">
          {Object.entries(TREASURES).map(([id, treasure]) => (
            <button
              key={id}
              className="treasure-option"
              type="button"
              onClick={() => goTo(`/treasure/${id}`)}
            >
              <span className="treasure-number">{id}</span>
              <span>{treasure.title}</span>
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

function TreasurePage({ treasureId }) {
  const treasure = TREASURES[treasureId];
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
  }, [treasureId]);

  const showSuccess = () => {
    setMessage('');
    setIsTransitioning(true);

    transitionTimer.current = setTimeout(() => {
      setIsCodeCorrect(true);
      setIsTransitioning(false);
    }, 260);
  };

  const handleSubmit = () => {
    if (!treasure || isCodeCorrect || isTransitioning) return;

    if (inputValue === treasure.code) {
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
      if (!treasure || isCodeCorrect || isTransitioning) return;

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

        if (inputValue === treasure.code) {
          showSuccess();
        } else {
          setMessage('Código incorrecto. Inténtalo nuevamente.');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputValue, isCodeCorrect, isTransitioning, treasure]);

  if (!treasure) {
    return <HomePage />;
  }

  return (
    <main className="page-shell treasure-page">
      <section className="game-panel">
        {!isCodeCorrect ? (
          <div className={`challenge-content ${isTransitioning ? 'fade-out' : ''}`}>
            <button className="back-button" type="button" onClick={() => goTo('/')}>
              ← Volver
            </button>

            <div className="treasure-heading">
              <div className="eyebrow">{treasure.title}</div>
              <h1>Descubre el código</h1>
            </div>

            <div className="chest-stage">
              <img
                src={`${process.env.PUBLIC_URL}/cofre.png`}
                alt="Cofre del tesoro"
                className="central-image"
              />

              <div className="chest-controls">
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
              src={`${process.env.PUBLIC_URL}/gato-lingotes.webp`}
              alt="Gato con el tesoro"
              className="success-image"
            />

            <h1>¡Felicidades, has adivinado el código!</h1>

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
  const [treasureId, setTreasureId] = useState(() => getTreasureIdFromHash());

  useEffect(() => {
    const syncRoute = () => setTreasureId(getTreasureIdFromHash());

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
        className="forest-background"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12)), url(${process.env.PUBLIC_URL}/fondo2.webp)`,
        }}
        aria-hidden="true"
      />

      {treasureId ? <TreasurePage treasureId={treasureId} /> : <HomePage />}
    </div>
  );
}

export default App;
