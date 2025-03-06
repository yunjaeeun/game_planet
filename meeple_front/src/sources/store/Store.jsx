import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/UserSlice";
import boardReducer from "./slices/BoardSlice";
import gameReducer from "./slices/GameSlice";
import tournamentReducer from "./slices/TournamentSlice";
import profileReducer from "./slices/ProfileSlice";
import catchmindReducer from "./slices/CatchMindSlice";
import friendReducer from "./slices/FriendSlice";
import cockroachReducer from "./slices/CockroachSlice";
import burumabulGameReducer from "./slices/BurumabulGameSlice";

// 로컬 저장소에서 부루마불 상태 불러오기
const loadBurumabulState = () => {
  try {
    const serializedState = localStorage.getItem("burumabulState");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (error) {
    console.error("부루마불 상태 불러오기 실패", error);
    return undefined;
  }
};

// Redux 스토어 생성 및 설정
export const Store = configureStore({
  // 루트 리듀서 설정
  reducer: {
    user: userReducer, // 유저 관련 상태 관리
    board: boardReducer, // 게시판 관련 상태 관리
    game: gameReducer, // 게임 관련 상태 관리
    tournament: tournamentReducer, // 토너먼트 관련 상태 관리
    profile: profileReducer,
    catchmind: catchmindReducer,
    friend: friendReducer,
    cockroach: cockroachReducer,
    burumabul: burumabulGameReducer,
  },
  // 기본적으로 Redux DevTools와 Redux Thunk가 포함됨

  preloadedState: {
    burumabul: loadBurumabulState(),
  },
});

// burumabul slice 상태 변경 시 자동 저장
Store.subscribe(() => {
  try {
    const state = Store.getState();
    const burumabulState = state.burumabul; // 부루마불 슬라이스만 선택
    localStorage.setItem("burumabulState", JSON.stringify(burumabulState));
  } catch (error) {
    console.error("부루마불 상태 저장 실패 : ", error);
  }
});

export default Store;
