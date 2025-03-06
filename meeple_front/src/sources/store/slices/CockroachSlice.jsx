import { createSlice, createAction } from "@reduxjs/toolkit";

const initialState = {
  roomData: null,
  gameData: null,
  isGameStarted: false,
  currentUser: null,
  players: [],
  playerCards: {},
  publicDeck: [],
  userTableCards: {},
  gameState: {
    currentTurn: null,
    currentCard: null,
    cardSender: null,
    cardReceiver: null,
    claimedAnimal: null,
    isKing: false,
    passedPlayers: [],
    passCount: 0,
  },
};

export const setRoomData = createAction("cockroach/setRoomData", (roomData) => {
  console.log("방 데이터 설정:", roomData);
  return {
    payload: {
      ...roomData,
      roomTitle: roomData.roomTitle || "바퀴벌레 포커",
      players: roomData.players ? [...new Set(roomData.players)] : [],
    },
  };
});

const cockroachSlice = createSlice({
  name: "cockroach",
  initialState,
  reducers: {
    setGameData: (state, action) => {
      console.log("Setting gameData:", action.payload);

      if (!action.payload) return;

      // gameData가 직접 전달된 경우
      if (action.payload.playerCards || action.payload.gameState) {
        state.gameData = action.payload;
        state.playerCards = action.payload.playerCards || {};
        state.publicDeck = action.payload.publicDeck || [];
        state.userTableCards = action.payload.userTableCards || {};
        
        if (action.payload.gameState) {
          state.gameState = {
            ...state.gameState,
            ...action.payload.gameState,
          };
          // 게임이 진행중인지 확인 11
          if (state.gameState.currentTurn || state.playerCards[state.currentUser]?.length > 0) {
            state.isGameStarted = true;
          }
          };
        
        return;
      }

      // players와 gameData가 분리되어 전달된 경우
      const { players, gameData } = action.payload;

      if (action.payload.players) {
        state.players = [...new Set(action.payload.players)];
      }

      if (gameData) {
        state.gameData = gameData;
        state.playerCards = gameData.playerCards || {};
        state.publicDeck = gameData.publicDeck || [];
        state.userTableCards = gameData.userTableCards || {};
        
        if (gameData.gameState) {
          state.gameState = {
            ...state.gameState,
            ...gameData.gameState,
          };
          // 게임이 진행중인지 확인 22
          if (state.gameState.currentTurn || state.playerCards[state.currentUser]?.length > 0) {
            state.isGameStarted = true;
          }
        }
      }

      console.log("State after update:", {
        players: state.players,
        gameData: state.gameData,
        isGameStarted: state.isGameStarted,
      });
    },

    startGame: (state) => {
      console.log("게임 시작...");
      state.isGameStarted = true;
    },

updateGameState: (state, action) => {
  console.log("게임 진행 상황 :", action.payload);
  if (!action.payload) return;

  // currentCard 업데이트 시 특별 처리
  if (action.payload.currentCard) {
    state.gameState = {
      ...state.gameState,
      ...action.payload,
      currentCard: {
        type: action.payload.currentCard.type,
        royal: action.payload.currentCard.royal,
      },
    }
    return;
  }

  state.gameState = {
    ...state.gameState,
    ...action.payload,
    }
  },

    updatePlayerCards: (state, action) => {
      const { player, cards } = action.payload;
      if (!player || !cards) return;
      console.log("Updating playerCards for:", player);
      state.playerCards[player] = cards;
    },

    updateTableCards: (state, action) => {
      const { player, cards } = action.payload;
      if (!player || !cards) return;
      console.log("Updating tableCards for:", player);
      state.userTableCards[player] = cards;
    },

    setCurrentUser: (state, action) => {
      console.log("Setting currentUser:", action.payload);
      state.currentUser = action.payload;
    },

    updatePublicDeck: (state, action) => {
      console.log("Updating publicDeck");
      state.publicDeck = action.payload;
    },

    resetGame: (state) => {
      console.log("Resetting game state");
      const savedRoomData = state.roomData;
      const savedPlayers = state.players;
      
      // roomData와 players는 유지하고 나머지 상태만 초기화
      Object.assign(state, {
        ...initialState,
        roomData: savedRoomData,
        players: savedPlayers,
      });
    },

    leaveGame: (state) => {
      console.log("게임 나가기");
      // 모든 상태를 완전히 초기화
      return initialState;
    },

    setGameStarted: (state, action) => {
      state.isGameStarted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setRoomData, (state, action) => {
      console.log("Reducer received room data:", action.payload);
      state.roomData = action.payload;
      if (action.payload && action.payload.players) {
        state.players = [...new Set(action.payload.players)];
      }
    });
  },
});

export const {
  setGameData,
  startGame,
  updateGameState,
  updatePlayerCards,
  updateTableCards,
  setCurrentUser,
  updatePublicDeck,
  resetGame,
  leaveGame,
  setGameStarted,
} = cockroachSlice.actions;

export default cockroachSlice.reducer;