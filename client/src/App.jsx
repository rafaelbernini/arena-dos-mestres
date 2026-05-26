import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import LobbyPage from './pages/LobbyPage.jsx';
import AvatarPage from './pages/AvatarPage.jsx';
import RoomSelectorPage from './pages/RoomSelectorPage.jsx';
import GamePage from './pages/GamePage.jsx';
import VictoryPage from './pages/VictoryPage.jsx';
import LeaderboardTV from './components/Leaderboard/LeaderboardTV.jsx';
import ProfessorPage from './pages/ProfessorPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <GameProvider>
          <Routes>
            <Route path="/"                 element={<LobbyPage />} />
            <Route path="/avatar"           element={<AvatarPage />} />
            <Route path="/salas"            element={<RoomSelectorPage />} />
            <Route path="/jogo/:roomId"     element={<GamePage />} />
            <Route path="/vitoria"          element={<VictoryPage />} />
            <Route path="/leaderboard-tv"   element={<LeaderboardTV />} />
            <Route path="/professor"        element={<ProfessorPage />} />
            <Route path="*"                 element={<Navigate to="/" replace />} />
          </Routes>
        </GameProvider>
      </SocketProvider>
    </BrowserRouter>
  );
}
