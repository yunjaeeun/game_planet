import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserAPI } from "../../api/UserAPI";

export const fetchUserInfo = createAsyncThunk(
  "catchmind/fetchUserInfo",
  async (userId, { rejectWithValue }) => {
    try {
      const profile = await UserAPI.getProfile(userId);
      return profile;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  roomId: null,
  currentWord: null, // 초기값을 null로 변경
  currentRound: 1,
  totalRounds: 5,
  timeLimit: 90,
  players: [],
  isGameStarted: false,
  currentTurnIndex: 0,
  quizCategory: null, // 퀴즈 카테고리 추가
  remainQuizCount: 0, // 남은 퀴즈 수 추가
  // 추가 필드들
  creator: null,
  roomTitle: "",
  maxPeople: 2,
  quizCount: 5,
  isPrivate: false,
  password: "",
  userStatus: {
    isLoading: false,
    error: null,
  },
  gameStatus: {
    isLoading: false,
    error: null,
  },
};

const CatchMindSlice = createSlice({
  name: "catchmind",
  initialState,
  reducers: {
    updatePlayerNickname: (state, action) => {
      const { playerId, nickname } = action.payload;
      const player = state.players.find((p) => p.id === playerId);
      if (player) {
        player.nickname = nickname;
      }
    },

    updatePlayers: (state, action) => {
      const { players } = action.payload;
      if (Array.isArray(players)) {
        state.players = players.map((player) => ({
          id: player.id || Math.random().toString(36).substr(2, 9),
          nickname: player.nickname,
          score: player.score || 0,
          isTurn: player.isTurn || false,
          isCurrentUser: player.isCurrentUser || false,
        }));
      }
    },

    updatePlayerScore: (state, action) => {
      const { nickname, score } = action.payload;
      const player = state.players.find((p) => p.nickname === nickname);
      if (player) {
        player.score = (player.score || 0) + score;
      }
    },

    nextTurn: (state) => {
      const currentIndex = state.players.findIndex((p) => p.isTurn);
      const nextIndex = (currentIndex + 1) % state.players.length;

      state.players.forEach((player, index) => {
        player.isTurn = index === nextIndex;
      });

      state.currentTurnIndex = nextIndex;
    },

    setCurrentWord: (state, action) => {
      state.currentWord = action.payload;
    },

    // 게임 시작 상태 업데이트 리듀서 추가
    setGameStarted: (state, action) => {
      console.log("게임 시작 상태 변경:", action.payload);
      state.isGameStarted = action.payload;

      // 게임 시작 시에는 상태 초기화하지 않음
      // 게임 종료 시에만 초기화
      if (action.payload === false) {
        state.currentWord = null;
        state.currentRound = 1;
        state.currentTurnIndex = 0;
        // 플레이어 점수 초기화
        state.players = state.players.map((player) => ({
          ...player,
          score: 0,
          isTurn: false,
        }));
      }
    },

    // sessionId 업데이트를 위한 리듀서 추가
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },

    updateGameState: (state, action) => {
      const {
        currentWord,
        currentRound,
        currentTurn,
        quizCategory,
        remainQuizCount,
        creator,
        roomTitle,
        maxPeople,
        timeLimit,
        quizCount,
        isPrivate,
        password,
        roomId,
        sessionId,
      } = action.payload;

      // 상태 업데이트
      if (currentWord !== undefined) state.currentWord = currentWord;
      // if (currentRound !== undefined) state.currentRound = currentRound;
      if (quizCategory !== undefined) state.quizCategory = quizCategory;
      if (remainQuizCount !== undefined) {
        state.remainQuizCount = remainQuizCount;
        // quizCount가 있으면 그것을 사용, 없으면 기본값 10 사용
        const totalQuizzes = quizCount || state.quizCount || 10;
        // 현재 라운드는 (전체 퀴즈 수 - 남은 퀴즈 수)
        state.currentRound = totalQuizzes - remainQuizCount;
      }
      // 추가 필드 업데이트
      if (creator !== undefined) state.creator = creator;
      if (roomTitle !== undefined) state.roomTitle = roomTitle;
      if (maxPeople !== undefined) state.maxPeople = maxPeople;
      if (timeLimit !== undefined) state.timeLimit = timeLimit;
      if (quizCount !== undefined) state.quizCount = quizCount;
      if (isPrivate !== undefined) state.isPrivate = isPrivate;
      if (password !== undefined) state.password = password;
      if (roomId !== undefined) state.roomId = roomId;

      // 턴 업데이트
      if (currentTurn && state.players.length > 0) {
        state.players = state.players.map((player) => ({
          ...player,
          isTurn: player.nickname === currentTurn,
        }));
      }

      if (sessionId !== undefined) state.sessionId = sessionId;
    },

    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },

    // 라운드 초기화
    resetRound: (state) => {
      state.currentRound = 1;
    },

    // 라운드 증가
    incrementRound: (state) => {
      console.group("Redux 라운드 증가");
      console.log("현재 라운드:", state.currentRound);
      console.log("현재 게임 상태:", state);

      state.currentRound += 1;

      console.log("증가된 라운드:", state.currentRound);
      console.groupEnd();
    },

    // 게임 상태 초기화 리듀서 추가
    resetGameState: (state) => {
      const existingPlayers = [...state.players]; // 기존 플레이어 정보 보존

      // 게임 상태 초기화
      state.currentWord = null;
      state.currentRound = 1;
      state.isGameStarted = false;
      state.quizCategory = null;
      state.remainQuizCount = 0;

      // 플레이어 정보는 유지하되 점수와 턴만 초기화
      state.players = existingPlayers.map((player) => ({
        ...player,
        score: 0,
        isTurn: false,
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.userStatus.isLoading = true;
        state.userStatus.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.userStatus.isLoading = false;
        if (action.payload && state.players.length === 0) {
          state.players = [
            {
              id: 1,
              nickname: action.payload.nickname,
              score: 0,
              isTurn: true,
              isCurrentUser: true,
            },
          ];
        }
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.userStatus.isLoading = false;
        state.userStatus.error = action.payload;
      });
  },
});

export const {
  resetRound,
  incrementRound,
  updatePlayers,
  updatePlayerScore,
  nextTurn,
  setCurrentWord,
  updateGameState,
  setRoomId,
  updatePlayerNickname,
  setGameStarted,
  resetGameState,
  setSessionId,
} = CatchMindSlice.actions;

export default CatchMindSlice.reducer;
