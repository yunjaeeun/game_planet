// src/sources/api/store/slices/ProfileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserAPI } from "../../api/UserAPI";

// 프로필 조회를 위한 비동기 액션 생성
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await UserAPI.getProfile(userId);
      return response;
    } catch (error) {
      console.error("ProfileSlice: Error fetching profile:", error);
      return rejectWithValue(error.message || "프로필 조회에 실패했습니다.");
    }
  }
);

// 프로필 수정을 위한 비동기 액션 생성
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      // userId와 data가 제대로 전달되는지 확인 (디버깅용)

      const response = await UserAPI.updateProfile(userId, data);
      return response;
    } catch (error) {
      // 에러 발생 시 자세한 정보 로깅
      return rejectWithValue(error.message);
    }
  }
);

// 비밀번호 변경을 위한 비동기 액션 생성
export const updatePassword = createAsyncThunk(
  "profile/updatePassword",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      await UserAPI.updatePassword(userId, data);
      return true;
    } catch (error) {
      return rejectWithValue(error.message || "비밀번호 변경에 실패했습니다.");
    }
  }
);

// 회원 탈퇴 액션 생성
export const deleteUser = createAsyncThunk(
  "profile/deleteUser",
  async ({ userId, password }, { rejectWithValue }) => {
    try {
      await UserAPI.deleteUser(userId, password);
      return true;
    } catch (error) {
      throw rejectWithValue(error.message || "회원 탈퇴에 실패했습니다.");
    }
  }
);

// 프로필 관련 Redux 슬라이스 생성
const ProfileSlice = createSlice({
  name: "profile",

  // 초기 상태 정의
  initialState: {
    profileData: null, // 프로필 데이터
    isLoading: false, // 로딩 상태
    error: null, // 에러 상태
    isEditing: false, // 수정 모드 상태
    isPasswordModalOpen: false, // 비밀번호 변경 모달 상태
    isDeleteModalOpen: false,
    updateSuccess: false, // 수정 성공 상태
    deleteSuccess: false,
  },

  // 동기적 액션에 대한 리듀서
  reducers: {
    // 수정 모드 토글
    setEditing: (state, action) => {
      state.isEditing = action.payload;
    },
    // 비밀번호 모달 토글
    setPasswordModalOpen: (state, action) => {
      state.isPasswordModalOpen = action.payload;
    },
    // 회원 탈퇴 모달 토글
    setDeleteModalOpen: (state, action) => {
      state.isDeleteModalOpen = action.payload;
    },
    // 수정 성공 상태 초기화
    resetUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    // 회원 탈퇴 상태 초기화
    resetDeleteSuccess: (state) => {
      state.deleteSuccess = false;
    },
    // 에러 상태 초기화
    clearError: (state) => {
      state.error = null;
    },
  },

  // 비동기 액션에 대한 리듀서
  extraReducers: (builder) => {
    builder
      // 프로필 조회 상태 처리
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileData = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 프로필 수정 상태 처리
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileData = action.payload;
        state.isEditing = false;
        state.updateSuccess = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 비밀번호 변경 상태 처리
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isPasswordModalOpen = false;
        state.updateSuccess = true;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // 회원 탈퇴 상태 처리
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isDeleteModalOpen = false;
        state.deleteSuccess = true;
        state.profileData = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// 액션 생성자들을 내보내기
export const {
  setEditing,
  setPasswordModalOpen,
  setDeleteModalOpen,
  resetUpdateSuccess,
  resetDeleteSuccess,
  clearError,
} = ProfileSlice.actions;

// 리듀서를 내보내기
export default ProfileSlice.reducer;
