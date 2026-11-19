import { useState } from 'react';
import { Play } from 'lucide-react';

export function SplashScreen({ onEnter }) {
  const [exiting, setExiting] = useState(false);

  function handleEnter() {
    setExiting(true);
    setTimeout(() => {
      onEnter();
    }, 320);
  }

  return (
    <main className={`splash-screen ${exiting ? 'exiting' : ''}`}>
      <h1 className="splash-title">Celsius Library</h1>

      <button
        type="button"
        className="splash-play-btn"
        onClick={handleEnter}
        aria-label="Entrar na biblioteca"
      >
        <Play size={40} fill="currentColor" style={{ marginLeft: 4 }} />
      </button>

      <div className="splash-platforms" aria-label="Plataformas suportadas">
        {/* Nintendo */}
        <svg viewBox="0 0 24 24" role="img" aria-label="Nintendo">
          <path d="M4 3h4.5l7 11.5V3H20v18h-4.5l-7-11.5V21H4V3z" />
        </svg>

        {/* PlayStation */}
        <svg viewBox="0 0 24 24" role="img" aria-label="PlayStation">
          <path d="M9.5 4v15.2l3.2 1.1V8.4c0-.9.4-1.3 1-1.1.7.2.9.8.9 1.7v4.5c2.3 1.1 4.1-.1 4.1-3.1 0-2.9-1.1-4.3-4.3-5.4L9.5 4zm-1 10.6l-5.2 1.8c-.9.3-1.4.9-1.4 1.5 0 .8.9 1.3 2.2 1.5 1.3.2 2.8.1 4.4-.5v-1.8c-1.1.4-2.1.5-2.9.4-.6-.1-.8-.3-.5-.5l3.4-1.2v-1.2zm11.2-.2c-1.4-.5-3-.4-4.5.1v1.8c1.1-.4 2.1-.5 2.8-.3.6.2.7.5.2.7l-3 1.1v1.9l4.8-1.7c1.1-.4 1.7-1 1.7-1.7 0-.8-.7-1.4-2-1.9z" />
        </svg>

        {/* Steam */}
        <svg viewBox="0 0 24 24" role="img" aria-label="Steam">
          <path d="M12 2a10 10 0 0 0-9.8 8.1l5.2 2.1a2.8 2.8 0 0 1 1.6-.4l2.4-3.4v-.1a3.8 3.8 0 1 1 3.8 3.8h-.1l-3.4 2.4a2.9 2.9 0 0 1-5.6 1.2L2.2 14A10 10 0 1 0 12 2zm-3.2 15.6l-1.5-.6a2.1 2.1 0 0 0 3.9-.2 2.1 2.1 0 0 0-2.4-1.4l1.5.6a1.5 1.5 0 0 1-1.5 2.6zm6.4-7.1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
        </svg>
      </div>
    </main>
  );
}
