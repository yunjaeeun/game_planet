// Redux 관련 기능들 임포트
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserAPI } from "../../api/UserAPI";

/**
 * JWT 토큰에서 userId를 추출하는 유틸리티 함수
 * @param {string} token - JWT 토큰 문자열
 * @returns {string|null} - 성공 시 userId, 실패 시 null
 */
const extractUserIdFromToken = (token) => {
  if (!token) return null;
  try {
    // JWT 토큰의 페이로드(두 번째 부분)를 디코딩하여 sub 필드 추출
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
};

// 토큰 유효성 검사 함수 추가
const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000; // 밀리초 단위로 변환
    return Date.now() < expirationTime;
  } catch {
    return false;
  }
};

// 앱 초기화 시 로컬 스토리지에서 토큰을 가져와 초기 상태 설정
const initialToken = localStorage.getItem("token");
const initialUserId = extractUserIdFromToken(initialToken);

/**
 * 로그인 비동기 액션 생성자
 * @param {Object} credentials - 로그인 정보 (이메일, 비밀번호)
 */
export const loginUser = createAsyncThunk("auth/login", async (credentials) => {
  try {
    const token = await UserAPI.login(credentials);
    return token;
  } catch (error) {
    throw new Error(error.message || "로그인에 실패했습니다.");
  }
});

/**
 * 로그아웃 비동기 액션 생성자
 */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await UserAPI.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * 유저 관련 Redux Slice
 * 인증 상태와 유저 정보를 관리
 */
const UserSlice = createSlice({
  name: "user",
  // 초기 상태 정의
  initialState: {
    token: initialToken, // JWT 토큰
    userId: initialUserId, // 현재 로그인한 사용자 ID
    isLoading: false, // 로딩 상태
    error: null, // 에러 메시지
    isModalOpen: false, // 로그인/회원가입 모달 표시 상태
  },

  // 동기적 액션에 대한 리듀서들
  reducers: {
    // 모달 열기/닫기 상태 설정
    setModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
      // 모달이 닫힐 때 에러 메시지 초기화
      if (!action.payload) {
        state.error = null;
      }
    },
    // 토큰 설정 및 관련 상태 업데이트
    setToken: (state, action) => {
      const token = action.payload;
      if (token && isTokenValid(token)) {
        state.token = token;
        state.userId = extractUserIdFromToken(token);
        localStorage.setItem("token", token);
      } else {
        state.token = null;
        state.userId = null;
        localStorage.removeItem("token");
      }
    },
    // 로그아웃 처리
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.isModalOpen = false;
      localStorage.removeItem("token");
    },
    // 에러 메시지 초기화
    clearError: (state) => {
      state.error = null;
    },
  },

  // 비동기 액션에 대한 리듀서들
  extraReducers: (builder) => {
    builder
      // 로그인 시작
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // 로그인 성공
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload;
        state.userId = extractUserIdFromToken(action.payload);
        state.isModalOpen = false;
      })
      // 로그인 실패
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // 로그아웃 시작
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // 로그아웃 성공
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.token = null;
        state.userId = null;
        state.error = null;
      })
      // 로그아웃 실패
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// 액션 생성자 내보내기
export const { setModalOpen, setToken, logout, clearError } = UserSlice.actions;

// 리듀서 내보내기
export default UserSlice.reducer;
