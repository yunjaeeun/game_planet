// 로그인 모달 컴포넌트: 사용자 인증을 위한 UI 인터페이스를 제공합니다.
import React, { useState } from "react";
// Redux 관련 훅 임포트: dispatch는 액션 발생, useSelector는 상태 조회
import { useDispatch, useSelector } from "react-redux";
// 로그인 관련 액션과 모달 상태 제어 액션을 임포트
import { loginUser, setModalOpen } from "../../sources/store/slices/UserSlice";
// HeadlessUI의 Dialog 컴포넌트: 접근성이 고려된 모달 구현을 위해 사용
import { Dialog } from "@headlessui/react";
// Lucide 아이콘: 모달 닫기 버튼과 비밀번호 표시/숨김에 사용될 아이콘
import { X, Eye, EyeOff } from "lucide-react";

const LoginModal = () => {
  // Redux의 dispatch 함수를 가져옴: 액션을 발생시키는 데 사용
  const dispatch = useDispatch();

  // Redux store에서 필요한 상태를 가져옴
  const { isModalOpen, isLoading, error } = useSelector((state) => state.user);

  // 로그인 폼의 입력값을 관리하는 로컬 상태
  const [credentials, setCredentials] = useState({
    email: "", // 이메일 입력값
    password: "", // 비밀번호 입력값
  });

  // 입력값 유효성 검사 상태
  const [validations, setValidations] = useState({
    email: false,
    password: false,
  });

  // 비밀번호 표시/숨김 상태
  const [showPassword, setShowPassword] = useState(false);

  // 유효성 검사를 위한 정규식
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{9,16}$/;

  // 모달 닫기 핸들러: 상태 초기화 및 모달 닫기
  const handleClose = () => {
    setCredentials({ email: "", password: "" });
    setValidations({ email: false, password: false });
    dispatch(setModalOpen(false));
  };

  // 입력값 유효성 검사 함수
  const validateField = (name, value) => {
    if (name === "email") {
      return emailRegex.test(value);
    } else if (name === "password") {
      return passwordRegex.test(value);
    }
    return false;
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidations((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  // 폼 유효성 검사: 모든 필드가 유효한지 확인
  const isFormValid = () => {
    return validations.email && validations.password;
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      dispatch(loginUser(credentials));
    }
  };

  return (
    <Dialog open={isModalOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="space-y-1 mx-auto max-w-sm rounded-3xl bg-white p-6 w-full">
          <div className="flex justify-between items-center mb-2">
            <div className="flex-1 text-center">
              <Dialog.Title className="text-3xl font-bold ml-5">
                MEEPLE LOGIN
              </Dialog.Title>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="text-gray-400 text-center mb-6">PLAY MEEPLE NOW</div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-2xl mb-2">
                EMAIL
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={credentials.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md bg-gray-100 px-4 py-3 text-gray-700 focus:outline-none ${
                  credentials.email && !validations.email
                    ? "border-2 border-red-500"
                    : ""
                }`}
                required
                placeholder="이메일을 입력하세요."
              />
              {credentials.email && !validations.email && (
                <p className="text-red-500 text-sm mt-1">
                  유효한 이메일 형식이 아닙니다.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-2xl mb-2">
                PW
              </label>
              <div className="relative">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md bg-gray-100 px-4 py-3 pr-10 text-gray-700 focus:outline-none ${
                      credentials.password && !validations.password
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                    required
                    placeholder="비밀번호를 입력하세요."
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                {credentials.password && !validations.password && (
                  <p className="text-red-500 text-sm mt-1">
                    비밀번호는 영문, 숫자, 특수문자를 포함한 9-16자여야 합니다.
                  </p>
                )}
              </div>
            </div>

            <div className="text-right mb-4">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 text-[14px]"
              >
                Forgot PassWord
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="w-full rounded-md bg-gradient-to-tr from-cyan-500 to-gray-500 py-3 text-white text-xl font-semibold focus:outline-none disabled:opacity-50"
            >
              {isLoading ? "로그인 중..." : "LOGIN"}
            </button>

            {/* <hr /> */}

            {/* <div className="text-center text-gray-500 mt-4">또는</div>

            <div className="flex justify-center space-x-6 mt-4">
              <button type="button" className="w-12 h-12">
                <img
                  src="/src/assets/images/naver-icon.png"
                  alt="Naver"
                  className="w-full h-full"
                />
              </button>
              <button type="button" className="w-12 h-12">
                <img
                  src="/src/assets/images/kakao-icon.png"
                  alt="Kakao"
                  className="w-full h-full"
                />
              </button>
              <button type="button" className="w-12 h-12">
                <img
                  src="/src/assets/images/google-icon.png"
                  alt="Google"
                  className="w-full h-full"
                />
              </button>
              <button type="button" className="w-12 h-12">
                <img
                  src="/src/assets/images/apple-icon.png"
                  alt="Apple"
                  className="w-full h-full"
                />
              </button>
            </div> */}
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default LoginModal;
