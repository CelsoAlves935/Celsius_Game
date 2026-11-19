import { useEffect, useState } from 'react';
import { getGames } from './services/api';
import { PlayStationBg } from './components/PlayStationBg';
import { SplashScreen } from './components/SplashScreen';
import { HomePage } from './components/HomePage';

function extractCovers(gamesList) {
  return gamesList
    .map((g) => g.coverUrl)
    .filter((url) => Boolean(url));
}

function App() {
  const [entered, setEntered] = useState(false);
  const [bgCovers, setBgCovers] = useState([]);

  useEffect(() => {
    getGames()
      .then((data) => setBgCovers(extractCovers(data)))
      .catch(() => {
        // Falha silenciosa apenas para o fundo na Splash Screen
      });
  }, []);

  function handleGamesUpdated(gamesList) {
    setBgCovers(extractCovers(gamesList));
  }

  return (
    <>
      <PlayStationBg covers={bgCovers} />
      {!entered ? (
        <SplashScreen onEnter={() => setEntered(true)} />
      ) : (
        <HomePage onGamesUpdated={handleGamesUpdated} />
      )}
    </>
  );
}

export default App;
