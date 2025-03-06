import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X, Eye, EyeOff } from "lucide-react";
import { UserAPI } from "../../sources/api/UserAPI";
import { useDispatch } from "react-redux";
import { setToken } from "../../sources/store/slices/UserSlice";

const RegisterModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // 유효성 검사용 정규식
  // email: 이메일 형식
  // password: 영문, 숫자, 특수문자 포함 9-16자
  // nickname: 한글, 영문, 숫자 2-10자
  // name: 한글 2-5자
  const REGEX = {
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    password:
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{9,16}$/,
    nickname: /^[a-zA-Z0-9가-힣]{2,10}$/,
    name: /^[가-힣]{2,5}$/,
  };

  // 폼 데이터 초기값
  const initialFormData = {
    userName: "",
    userEmail: "",
    userPassword: "",
    userPasswordConfirm: "",
    userNickname: "",
    userBirthday: "",
  };

  // 유효성 검사 상태 초기값
  const initialValidations = {
    email: false, // 이메일 중복검사 통과 여부
    emailChecked: false, // 이메일 중복검사 수행 여부
    nickname: false, // 닉네임 중복검사 통과 여부
    nicknameChecked: false, // 닉네임 중복검사 수행 여부
    passwordMatch: true, // 비밀번호 확인 일치 여부
    validName: false, // 이름 형식 검사
    validNickname: false, // 닉네임 형식 검사
    validPassword: false, // 비밀번호 형식 검사
    validEmail: false, // 이메일 형식 검사
  };

  // 상태 관리
  const [formData, setFormData] = useState(initialFormData);
  const [validations, setValidations] = useState(initialValidations);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState({
    terms: false, // 이용약관 동의
    privacy: false, // 개인정보 동의
    device: false, // 기기접근 동의
    AI: false,
  });

  // 모달 닫기 시 초기화
  const handleClose = () => {
    setFormData(initialFormData);
    setValidations(initialValidations);
    setError(null);
    onClose();
  };

  // 스크롤 이벤트 전파 방지
  const handleWheel = (e) => {
    e.stopPropagation();
  };

  // 필드별 유효성 검사
  const validateField = (name, value) => {
    switch (name) {
      case "userName":
        return REGEX.name.test(value);
      case "userPassword":
        return REGEX.password.test(value);
      case "userEmail":
        return REGEX.email.test(value);
      case "userNickname":
        return REGEX.nickname.test(value);
      default:
        return true;
    }
  };

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const isValid = validateField(name, value);

    // 필드별 유효성 검사 상태 업데이트
    if (name === "userEmail") {
      setValidations((prev) => ({
        ...prev,
        email: false,
        emailChecked: false,
        validEmail: isValid,
      }));
    } else if (name === "userNickname") {
      setValidations((prev) => ({
        ...prev,
        nickname: false,
        nicknameChecked: false,
        validNickname: isValid,
      }));
    } else if (name === "userName") {
      setValidations((prev) => ({
        ...prev,
        validName: isValid,
      }));
    } else if (name === "userPassword") {
      setValidations((prev) => ({
        ...prev,
        validPassword: isValid,
        passwordMatch: value === formData.userPasswordConfirm,
      }));
    } else if (name === "userPasswordConfirm") {
      setValidations((prev) => ({
        ...prev,
        passwordMatch: value === formData.userPassword,
      }));
    }
  };

  // 이메일 중복 검사
  const handleEmailCheck = async () => {
    if (!formData.userEmail || !validations.validEmail) {
      setError("유효한 이메일을 입력해주세요.");
      return;
    }

    try {
      const isDuplicate = await UserAPI.checkEmail(formData.userEmail);
      setValidations((prev) => ({
        ...prev,
        email: !isDuplicate,
        emailChecked: true,
      }));
      setError(
        isDuplicate
          ? "이미 사용 중인 이메일입니다."
          : "사용 가능한 이메일입니다."
      );
    } catch (error) {
      setError("이메일 중복 검사 중 오류가 발생했습니다.");
    }
  };

  // 닉네임 중복 검사
  const handleNicknameCheck = async () => {
    if (!formData.userNickname || !validations.validNickname) {
      setError("유효한 닉네임을 입력해주세요.");
      return;
    }

    try {
      const isDuplicate = await UserAPI.checkNickname(formData.userNickname);
      setValidations((prev) => ({
        ...prev,
        nickname: !isDuplicate,
        nicknameChecked: true,
      }));
      setError(
        isDuplicate
          ? "이미 사용 중인 닉네임입니다."
          : "사용 가능한 닉네임입니다."
      );
    } catch (error) {
      setError("닉네임 중복 검사 중 오류가 발생했습니다.");
    }
  };

  // 폼 전체 유효성 검사
  const isFormValid = () => {
    return (
      validations.validName && // 이름 형식
      validations.validPassword && // 비밀번호 형식
      validations.validEmail && // 이메일 형식
      validations.validNickname && // 닉네임 형식
      validations.passwordMatch && // 비밀번호 확인
      validations.email && // 이메일 중복검사
      validations.nickname && // 닉네임 중복검사
      formData.userBirthday && // 생년월일
      termsAgreed.terms && // 이용약관
      termsAgreed.privacy && // 개인정보
      termsAgreed.device // 기기접근
    );
  };

  // 회원가입 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setError("모든 필드를 올바르게 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      // 생년월일 형식 변환 (YYYY-MM-DDT00:00:00)
      const birthdayDateTime = new Date(formData.userBirthday);
      const formattedBirthday =
        birthdayDateTime.toISOString().split("T")[0] + "T00:00:00";

      const userData = {
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPassword: formData.userPassword,
        userNickname: formData.userNickname,
        userBirthday: formattedBirthday,
      };

      // 회원가입 API 호출
      const success = await UserAPI.register(userData);
      if (success) {
        // 회원가입 성공 시 자동 로그인
        const loginData = {
          email: formData.userEmail,
          password: formData.userPassword,
        };
        const token = await UserAPI.login(loginData);
        if (token) {
          dispatch(setToken(token));
          handleClose();
        }
      }
    } catch (error) {
      setError(error.message || "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .thin-scrollbar::-webkit-scrollbar { width: 5px; padding-right: 12px; position: absolute; right: 0;}
        .thin-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .thin-scrollbar::-webkit-scrollbar-thumb { background: #888; border-radius: 15px;}
        .thin-scrollbar::-webkit-scrollbar-track { display: none; }
        .thin-scrollbar {padding-right: 10px;}
      `}</style>
      <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel
            className="relative space-y-1 rounded-3xl bg-white p-6 w-full max-w-lg overflow-visible"
            onWheel={handleWheel}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1 text-center">
                <Dialog.Title className="text-3xl font-bold ml-7">
                  MEEPLE SIGNUP
                </Dialog.Title>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="text-center text-gray-400 mb-3">
              MEET MEEPLE NOW
            </div>

            <div className="max-h-[75vh] overflow-y-auto thin-scrollbar pr-1">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="userName"
                    className="block text-xl font-medium text-gray-700"
                  >
                    이름
                  </label>
                  <input
                    type="text"
                    name="userName"
                    id="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                      formData.userName && !validations.validName
                        ? "border-red-500"
                        : "border-gray-300"
                    } px-3 py-2`}
                    required
                    placeholder="이름을 입력하세요."
                  />
                  {formData.userName && !validations.validName && (
                    <p className="mt-1 text-sm text-red-500">
                      이름은 2-5자의 한글만 가능합니다.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="userBirthday"
                    className="block text-xl font-medium text-gray-700"
                  >
                    생년월일
                  </label>
                  <input
                    type="date"
                    name="userBirthday"
                    id="userBirthday"
                    value={formData.userBirthday}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <label
                      htmlFor="userNickname"
                      className="block text-xl font-medium text-gray-700"
                    >
                      닉네임
                    </label>
                    <div className="ml-1 flex-1 text-[#FF7A4A]">*</div>
                    <button
                      type="button"
                      onClick={handleNicknameCheck}
                      className="mt-1 px-3 h-7 bg-[#E3E3E3] text-black rounded-md hover:bg-gray-600 whitespace-nowrap"
                    >
                      check
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="userNickname"
                      id="userNickname"
                      value={formData.userNickname}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formData.userNickname && !validations.validNickname
                          ? "border-red-500"
                          : "border-gray-300"
                      } px-3 py-2`}
                      required
                      placeholder="사용할 닉네임을 입력하세요."
                    />
                  </div>
                  {formData.userNickname && !validations.validNickname && (
                    <p className="mt-1 text-sm text-red-500">
                      닉네임은 2-10자의 한글, 영문, 숫자만 가능합니다.
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between">
                    <label
                      htmlFor="userEmail"
                      className="block text-xl font-medium text-gray-700"
                    >
                      이메일
                    </label>
                    <div className="ml-1 flex-1 text-[#FF7A4A]">*</div>
                    <button
                      type="button"
                      onClick={handleEmailCheck}
                      className="mt-1 px-3 h-7 bg-[#E3E3E3] text-black rounded-md hover:bg-gray-600 whitespace-nowrap"
                    >
                      check
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      name="userEmail"
                      id="userEmail"
                      value={formData.userEmail}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formData.userEmail && !validations.validEmail
                          ? "border-red-500"
                          : "border-gray-300"
                      } px-3 py-2`}
                      required
                      placeholder="사용할 이메일을 입력하세요."
                    />
                  </div>
                  {formData.userEmail && !validations.validEmail && (
                    <p className="mt-1 text-sm text-red-500">
                      유효한 이메일 형식이 아닙니다.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="userPassword"
                    className="block text-xl font-medium text-gray-700"
                  >
                    비밀번호
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="userPassword"
                      id="userPassword"
                      value={formData.userPassword}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formData.userPassword && !validations.validPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } px-3 py-2 pr-10`}
                      required
                      placeholder="사용할 비밀번호를 입력하세요."
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.userPassword && !validations.validPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      비밀번호는 영문, 숫자, 특수문자를 포함한 9-16자여야
                      합니다.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="userPasswordConfirm"
                    className="block text-xl font-medium text-gray-700"
                  >
                    비밀번호 확인
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordConfirm ? "text" : "password"}
                      name="userPasswordConfirm"
                      id="userPasswordConfirm"
                      value={formData.userPasswordConfirm}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formData.userPasswordConfirm &&
                        !validations.passwordMatch
                          ? "border-red-500"
                          : "border-gray-300"
                      } px-3 py-2 pr-10`}
                      required
                      placeholder="비밀번호를 다시 입력하세요."
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswordConfirm(!showPasswordConfirm)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPasswordConfirm ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {formData.userPasswordConfirm &&
                    !validations.passwordMatch && (
                      <p className="mt-1 text-sm text-red-500">
                        비밀번호가 일치하지 않습니다.
                      </p>
                    )}
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <hr className="my-4" />

                <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                  1️⃣ 본 서비스는 화상 카메라 및 마이크 사용이 필수적입니다.{" "}
                  <br></br>
                  <br></br>
                  2️⃣ 이용을 위한 카메라 및 마이크 기기 접근에 동의해주세요.{" "}
                  <br></br>
                  <br></br>
                  3️⃣ 청정한 소통 위한 욕설감지 AI프로그램 설치에 동의해주세요.
                </div>

                <span className="text-red-500">
                  <div className="text-center text-xl">⚠️주의⚠️</div>
                  <div className="text-center text-sm">
                    서비스 이용시 욕설을 할 경우 음성이 녹음될 수 있습니다.
                  </div>
                </span>

                <hr className="my-4" />

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="termsAgreement"
                      className="mr-2"
                      checked={termsAgreed.terms}
                      onChange={(e) =>
                        setTermsAgreed((prev) => ({
                          ...prev,
                          terms: e.target.checked,
                        }))
                      }
                      required
                    />
                    <label htmlFor="termsAgreement" className="text-sm">
                      [필수] 서비스 이용약관 동의
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="privacyAgreement"
                      className="mr-2"
                      checked={termsAgreed.privacy}
                      onChange={(e) =>
                        setTermsAgreed((prev) => ({
                          ...prev,
                          privacy: e.target.checked,
                        }))
                      }
                      required
                    />
                    <label htmlFor="privacyAgreement" className="text-sm">
                      [필수] 개인정보 수집 및 이용 동의
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="deviceAgreement"
                      className="mr-2"
                      checked={termsAgreed.device}
                      onChange={(e) =>
                        setTermsAgreed((prev) => ({
                          ...prev,
                          device: e.target.checked,
                        }))
                      }
                      required
                    />
                    <label htmlFor="deviceAgreement" className="text-sm">
                      [필수] 화상/음성 채팅 이용 동의
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="privacyAgreement"
                      className="mr-2"
                      checked={termsAgreed.AI}
                      onChange={(e) =>
                        setTermsAgreed((prev) => ({
                          ...prev,
                          AI: e.target.checked,
                        }))
                      }
                      required
                    />
                    <label htmlFor="privacyAgreement" className="text-sm">
                      [필수] AI 욕설 감지 프로그램 설치 동의
                    </label>
                  </div>
                </div>

                <hr className="my-4" />

                <button
                  type="submit"
                  disabled={isLoading || !isFormValid()}
                  className="w-full rounded-md text-xl py-2 text-white bg-gradient-to-tr from-cyan-500 to-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? "처리중..." : "SIGNUP"}
                </button>
              </form>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default RegisterModal;
