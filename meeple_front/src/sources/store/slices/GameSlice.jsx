import { createSlice } from '@reduxjs/toolkit'

const GameSlice = createSlice({
  name: 'game',
  initialState: {
    currentGame: null,
    gameType: null, // 'baqui' or 'burumabul'
    score: 0,
    gameStatus: 'idle', // 'idle' | 'playing' | 'finished'
    error: null
  },
  reducers: {
    setCurrentGame: (state, action) => {
      state.currentGame = action.payload;
    },
    setGameType: (state, action) => {
      state.gameType = action.payload;
    },
    updateScore: (state, action) => {
      state.score = action.payload;
    },
    setGameStatus: (state, action) => {
      state.gameStatus = action.payload;
    },
    resetGame: (state) => {
      state.currentGame = null;
      state.score = 0;
      state.gameStatus = 'idle';
    }
  }
})

export const { setCurrentGame, setGameType, updateScore, setGameStatus, resetGame } = GameSlice.actions;
export default GameSlice.reducer;