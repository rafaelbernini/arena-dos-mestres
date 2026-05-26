import { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext(null);

const initialState = {
  playerId: null, nickname: null, heroClass: null, avatarJson: {},
  currentRoomId: 1, currentPhase: 1, totalScore: 0,
  rooms: [], roomsCompleted: 0, isLoggedIn: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':      return { ...state, ...action.payload, isLoggedIn: true };
    case 'SET_ROOMS':  return { ...state, rooms: action.payload };
    case 'ADD_SCORE':  return { ...state, totalScore: state.totalScore + action.payload };
    case 'NEXT_PHASE': return { ...state, currentPhase: state.currentPhase + 1 };
    case 'SET_ROOM':   return { ...state, currentRoomId: action.payload, currentPhase: 1 };
    case 'LOGOUT':     return initialState;
    default:           return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    try {
      const saved = localStorage.getItem('arena_player');
      return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
    } catch { return initialState; }
  });

  useEffect(() => {
    if (state.isLoggedIn) {
      localStorage.setItem('arena_player', JSON.stringify({
        playerId: state.playerId, nickname: state.nickname,
        heroClass: state.heroClass, avatarJson: state.avatarJson,
        currentRoomId: state.currentRoomId, totalScore: state.totalScore,
        isLoggedIn: true,
      }));
    }
  }, [state]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export const useGame = () => useContext(GameContext);
