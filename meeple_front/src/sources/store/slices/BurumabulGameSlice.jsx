import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  roomId: null,
  gamePlayId: null,
  currentPlayerIndex: 0,
  players: [],
  gameStatus: "IN_PROGRESS",
  round: 1,
  board: [],
  card: {},
  firstDice: null,
  secondDice: null,
  prevPosition: null,
};

const loadStateBurumabul = () => {
  try {
    const serializedState = localStorage.getItem("burumabulState");
    return serializedState ? JSON.parse(serializedState) : initialState;
  } catch (error) {
    console.error("부루마불 정보 업데이트 중 에러 : ", error);
    return initialState;
  }
};
const saveStateBurumabul = (state) => {
  try {
    localStorage.setItem("burumabulState", JSON.stringify(state));
  } catch (error) {
    console.error("부루마불 데이터 저장 중 에러 : ", error);
  }
};

const burumabulGameSlice = createSlice({
  name: "burumabul",
  initialState: loadStateBurumabul(),
  reducers: {
    // 방 id 업데이트
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    // 게임 설정
    setGameData: (state, action) => {
      return { ...state, ...action.payload };
    },

    // 플레이어 추가
    addPlayer: (state, action) => {
      const { playerId, playerName } = action.payload;
      // 플레이어 안에 액션리스트 추가
      state.players.push({
        playerId,
        playerName,
        position: 0,
        balance: 1500,
        seedCertificateCardOwned: [],
      });
      saveStateBurumabul(state);
    },

    // 플레이어 삭제
    removePlayer: (state, action) => {
      const { playerId } = (action.state.players = state.players.filter(
        (player) => player.playerId !== playerId
      ));
    },

    // 플레이어 이동 => 주사위 안 굴리고 다른 카드들로 인한 이동
    // 상금 지급 없이
    movePlayer: (state, action) => {
      const { prevPosition, nextPosition } = action.payload;
      const currentPlayer = state.players[state.currentPlayerIndex];

      if (currentPlayer) {
        currentPlayer.position = nextPosition;
      }

      currentPlayer.position = nextPosition;
      state.prevPosition = prevPosition;
    },

    // 주사위 굴린 결과 처리
    handleDiceRoll: (state, action) => {
      const { prevPosition, nextPosition } = action.payload;
      const currentPlayer = state.players[state.currentPlayerIndex];

      currentPlayer.position = nextPosition;
      state.prevPosition = prevPosition;

      // 주사위 굴린 결과에 따른 추가 로직
      // 모서리 네 개의 칸 -> 0, 9, 19, 29
    },

    // 잔액 추가
    updatePlusBalance: (state, action) => {
      const { playerId, amount } = action.payload;
      const player = state.players.find(
        (player) => player.playerId === playerId
      );
      if (player) {
        player.balance += amount;
      }
    },

    // 잔액 감소
    updateMinusBalance: (state, action) => {
      const { playerId, amount } = action.payload;
      const player = state.players.find(
        (player) => player.playerId === playerId
      );
      if (player) {
        player.balance -= amount;
      }
    },

    // 턴 넘기기
    nextTurn: (state, action) => {
      if (state.players.length === 0) return;
      if (state.players.length === 1) {
        state.currentPlayerIndex = 0;
      } else {
        state.currentPlayerIndex =
          (state.currentPlayerIndex + 1) % state.players.length;
      }
    },

    // 주사위 눈 변경
    changeDice: (state, action) => {
      state.firstDice = action.payload.firstDice;
      state.secondDice = action.payload.secondDice;

      // // 더블이 나왔는지 체크, 특수 칸 도착 시 처리 등
    },

    // 라운드 증가 액션
    nextRound: (state) => {
      state.round += 1;
    },

    // 게임 초기화
    resetGame: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setRoomId,
  setGameData,
  addPlayer,
  removePlayer,
  movePlayer,
  handleDiceRoll,
  updateMinusBalance,
  updatePlusBalance,
  nextTurn,
  nextRound,
  changeDice,
} = burumabulGameSlice.actions;

export default burumabulGameSlice.reducer;
