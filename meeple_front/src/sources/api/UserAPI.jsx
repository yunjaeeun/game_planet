import axios from "axios";

/**
 * Axios 인스턴스 생성 및 기본 설정
 * baseURL: API 서버의 기본 URL
 * withCredentials: 쿠키를 포함한 인증 요청 허용
 */
const API = axios.create({
  // baseURL: `${import.meta.env.VITE_LOCAL_API_BASE_URL}`,
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * 요청 인터셉터 설정
 * 모든 요청에 Authorization 헤더 자동 추가
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터 설정
 * 응답 데이터 추출 및 에러 처리 통합
 */
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 에러 정보 상세 로깅
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error.response?.data || error);
  }
);

export const UserAPI = {
  /**
   * 로그인 API
   * @param {Object} credentials - 로그인 정보 (이메일, 비밀번호)
   * @returns {Promise<string>} JWT 토큰
   */
  login: async (credentials) => {
    try {
      const response = await API.post("/auth/login", credentials);
      if (response) {
        localStorage.setItem("token", response);
      }
      return response;
    } catch (error) {
      throw error || "로그인에 실패했습니다.";
    }
  },

  /**
   * 로그아웃 API
   */
  logout: async () => {
    try {
      await API.post("/auth/logout");
      localStorage.removeItem("token");
    } catch (error) {
      throw error || "로그아웃에 실패했습니다.";
    }
  },

  /**
   * 회원가입 API (자동 로그인 포함)
   * @param {Object} userData - 회원가입 정보
   * @returns {Promise<Object>} 회원가입 결과 및 토큰
   */
  register: async (userData) => {
    try {
      // 1. 회원가입 요청
      const registerResponse = await API.post("/user/register", userData);
      const isRegistered = registerResponse.status === 201;

      if (isRegistered) {
        // 2. 회원가입 성공 시 자동 로그인
        const loginData = {
          email: userData.userEmail,
          password: userData.userPassword,
        };

        // 3. 로그인 요청 및 토큰 받기
        const token = await API.post("/auth/login", loginData);

        // 4. 토큰 저장
        if (token) {
          localStorage.setItem("token", token);
        }

        return {
          success: true,
          token: token,
        };
      }

      return {
        success: false,
        token: null,
      };
    } catch (error) {
      throw error || "회원가입에 실패했습니다.";
    }
  },

  /**
   * 이메일 중복 확인 API
   * @param {string} email - 확인할 이메일
   */
  checkEmail: async (email) => {
    try {
      const response = await API.get(`/user/checkEmail/${email}`);
      return response;
    } catch (error) {
      throw error || "이메일 중복 검사에 실패했습니다.";
    }
  },

  /**
   * 닉네임 중복 확인 API
   * @param {string} nickname - 확인할 닉네임
   */
  checkNickname: async (nickname) => {
    try {
      const response = await API.get(`/user/checkNickname/${nickname}`);
      return response;
    } catch (error) {
      throw error || "닉네임 중복 검사에 실패했습니다.";
    }
  },

  /**
   * 프로필 조회 API
   * @param {string} userId - 조회할 사용자 ID
   */
  getProfile: async (userId) => {
    try {
      const response = await API.get(`/profile/${userId}`);
      return response;
    } catch (error) {
      throw error || "프로필 정보를 불러오는데 실패했습니다.";
    }
  },

  /**
   * 프로필 수정 API
   * @param {string} userId - 수정할 사용자 ID
   * @param {Object} data - 수정할 프로필 정보
   */
  updateProfile: async (userId, data) => {
    try {
      const response = await API.put(`/profile/${userId}`, data);
      return response;
    } catch (error) {
      throw error || "프로필 수정에 실패했습니다.";
    }
  },

  /**
   * 비밀번호 변경 API
   * @param {string} userId - 사용자 ID
   * @param {Object} data - 새 비밀번호 정보
   */
  updatePassword: async (userId, data) => {
    try {
      const response = await API.put(`/profile/${userId}/password`, data);
      return response;
    } catch (error) {
      throw error || "비밀번호 변경에 실패했습니다.";
    }
  },

  /**
   * 회원 탈퇴 API
   * @param {string} userId - 탈퇴할 사용자 ID
   * @param {string} password - 확인용 비밀번호
   */
  deleteUser: async (userId, password) => {
    try {
      await API.delete(`/profile/${userId}/delete`, {
        data: { password },
      });
    } catch (error) {
      throw error || "회원 탈퇴에 실패했습니다.";
    }
  },
};

export default UserAPI;
