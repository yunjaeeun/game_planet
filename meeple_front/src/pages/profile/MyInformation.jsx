// React와 필요한 훅, 컴포넌트들을 임포트
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Redux 액션들과 API 임포트
import {
  fetchProfile,
  updateProfile,
  setEditing,
  setPasswordModalOpen,
  resetUpdateSuccess,
  clearError,
  setDeleteModalOpen,
} from "../../sources/store/slices/ProfileSlice";
import { UserAPI } from "../../sources/api/UserAPI";
import { Lock } from "lucide-react";

const MyInformation = () => {
  // URL 파라미터에서 userId를 추출하고 Redux dispatch 함수 가져오기
  const { userId } = useParams();
  const dispatch = useDispatch();

  // 입력값 검증을 위한 정규식 패턴 정의
  const REGEX = {
    nickname: /^[a-zA-Z0-9가-힣]{2,10}$/, // 2-10자의 한글, 영문, 숫자
    name: /^[가-힣]{2,5}$/, // 2-5자의 한글
  };

  // 각 필드의 유효성 상태를 관리하는 state
  const [validations, setValidations] = useState({
    validName: true, // 이름 형식의 유효성
    validNickname: true, // 닉네임 형식의 유효성
    nicknameChecked: false, // 닉네임 중복 검사 수행 여부
    nicknameDuplicate: false, // 닉네임 중복 여부
  });

  // Redux store에서 필요한 상태들을 가져오기
  const {
    profileData: profile,
    isLoading,
    error,
    isEditing,
    updateSuccess,
  } = useSelector((state) => state.profile);

  // LocalDateTime 형식과 input date 형식 간의 변환 함수들
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // "2024-01-26T00:00:00" -> "2024-01-26"
  };

  const formatDateForApi = (dateString) => {
    if (!dateString) return null;
    return `${dateString}T00:00:00`; // "2024-01-26" -> "2024-01-26T00:00:00"
  };

  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    userName: "",
    userNickname: "",
    userBirthday: "",
  });

  // 각 필드별 유효성 검사 함수
  const validateField = (name, value) => {
    switch (name) {
      case "userName":
        return REGEX.name.test(value);
      case "userNickname":
        return REGEX.nickname.test(value);
      default:
        return true;
    }
  };

  // 닉네임 중복 검사 처리 함수
  const handleNicknameCheck = async () => {
    // 닉네임 형식이 유효하지 않으면 중복 검사 수행하지 않음
    if (!validations.validNickname) {
      alert("닉네임 형식을 확인해주세요.");
      return;
    }

    try {
      // API를 통해 닉네임 중복 검사 수행
      const isDuplicate = await UserAPI.checkNickname(formData.userNickname);
      setValidations((prev) => ({
        ...prev,
        nicknameChecked: true,
        nicknameDuplicate: isDuplicate,
      }));

      // 검사 결과에 따른 알림 표시
      if (isDuplicate) {
        alert("이미 사용 중인 닉네임입니다.");
      } else {
        alert("사용 가능한 닉네임입니다.");
      }
    } catch (error) {
      alert("닉네임 중복 검사 중 오류가 발생했습니다.");
    }
  };

  // 컴포넌트 마운트 시 프로필 데이터 로드
  useEffect(() => {
    dispatch(fetchProfile(userId));
  }, [dispatch, userId]);

  // 프로필 데이터가 로드되면 폼 데이터 업데이트
  useEffect(() => {
    if (profile) {
      setFormData({
        userName: profile.userName,
        userNickname: profile.userNickname,
        userBirthday: formatDateForInput(profile.userBirthday),
      });
    }
  }, [profile]);

  // 입력 필드 값 변경 처리 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 이름이나 닉네임 필드가 변경될 때 유효성 검사 수행
    if (name === "userName" || name === "userNickname") {
      const isValid = validateField(name, value);
      setValidations((prev) => ({
        ...prev,
        [name === "userName" ? "validName" : "validNickname"]: isValid,
        // 닉네임이 변경되면 중복 검사 상태 초기화
        ...(name === "userNickname"
          ? {
              nicknameChecked: false,
              nicknameDuplicate: false,
            }
          : {}),
      }));
    }
  };

  // 폼 제출 처리 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 이름 입력값이 있고 유효하지 않은 경우 검사
    if (formData.userName && !validations.validName) {
      alert("이름 형식을 확인해주세요.");
      return;
    }

    // 닉네임이 변경된 경우에만 닉네임 관련 유효성 검사 수행
    const isNicknameChanged = formData.userNickname !== profile.userNickname;
    if (isNicknameChanged) {
      if (!validations.validNickname) {
        alert("닉네임 형식을 확인해주세요.");
        return;
      }

      if (!validations.nicknameChecked) {
        alert("닉네임 중복 확인을 해주세요.");
        return;
      }

      if (validations.nicknameDuplicate) {
        alert("이미 사용 중인 닉네임입니다.");
        return;
      }
    }

    // 변경된 내용이 없는 경우 검사
    const isFormChanged =
      formData.userName !== profile.userName ||
      formData.userNickname !== profile.userNickname ||
      formData.userBirthday !== formatDateForInput(profile.userBirthday);

    if (!isFormChanged) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    // API 요청을 위한 데이터 준비
    const apiData = {
      ...formData,
      userBirthday: formatDateForApi(formData.userBirthday),
    };

    try {
      await dispatch(
        updateProfile({
          userId,
          data: apiData,
        })
      ).unwrap();
      alert("프로필이 성공적으로 수정되었습니다.");
    } catch (error) {
      alert(error.message || "프로필 수정에 실패했습니다.");
    }
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    // 폼 데이터를 원래 프로필 데이터로 복원
    setFormData({
      userName: profile.userName,
      userNickname: profile.userNickname,
      userBirthday: formatDateForInput(profile.userBirthday),
    });

    // 유효성 검사 상태도 초기화
    setValidations({
      validName: true,
      validNickname: true,
      nicknameChecked: false,
      nicknameDuplicate: false,
    });

    // 수정 모드 종료
    dispatch(setEditing(false));
  };

  // 에러 발생 시 처리
  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // 정보 수정이 되었는지 확인
  const isFormChanged = () => {
    return (
      formData.userName !== profile.userName ||
      formData.userNickname !== profile.userNickname ||
      formData.userBirthday !== formatDateForInput(profile.userBirthday)
    );
  };

  // 로딩 상태 처리
  if (isLoading && !profile) return <div className="p-4">Loading...</div>;
  if (error && !profile)
    return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!profile) return null;

  return (
    <>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-zinc-300 text-lg mb-3">이름</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className={`w-full p-4 bg-zinc-900 border-2 rounded-lg text-white
                          ${
                            formData.userName && !validations.validName
                              ? "border-rose-500 focus:border-rose-500"
                              : "border-zinc-700 focus:border-cyan-500"
                          } transition-colors focus:outline-none`}
              placeholder="2-5자의 한글만 입력 가능합니다"
            />
            {formData.userName && !validations.validName && (
              <p className="text-rose-500 mt-2 text-sm">
                이름은 2-5자의 한글만 가능합니다.
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-zinc-300 text-lg">닉네임</label>
              <button
                type="button"
                onClick={handleNicknameCheck}
                className="px-4 py-2 bg-zinc-700 text-zinc-200 text-sm rounded-lg hover:bg-zinc-600 transition-colors"
              >
                중복확인
              </button>
            </div>
            <input
              type="text"
              name="userNickname"
              value={formData.userNickname}
              onChange={handleChange}
              className={`w-full p-3 bg-zinc-900 border-2 rounded-lg text-white transition-colors focus:outline-none
                          ${
                            formData.userNickname &&
                            (!validations.validNickname ||
                              validations.nicknameDuplicate)
                              ? "border-rose-500 focus:border-rose-500"
                              : validations.nicknameChecked &&
                                !validations.nicknameDuplicate
                              ? "border-emerald-500 focus:border-emerald-500"
                              : "border-zinc-700 focus:border-cyan-500"
                          }`}
              placeholder="2-10자의 한글, 영문, 숫자만 입력 가능합니다"
            />
            {formData.userNickname && !validations.validNickname && (
              <p className="text-rose-500 mt-2 text-sm">
                닉네임은 2-10자의 한글, 영문, 숫자만 가능합니다.
              </p>
            )}
            {formData.userNickname &&
              validations.nicknameChecked &&
              validations.nicknameDuplicate && (
                <p className="text-rose-500 mt-2 text-sm">
                  이미 사용 중인 닉네임입니다.
                </p>
              )}
          </div>

          <div>
            <label className="block text-zinc-300 text-lg mb-2">생년월일</label>
            <input
              type="date"
              name="userBirthday"
              value={formData.userBirthday}
              onChange={handleChange}
              className="w-full p-3 bg-zinc-900 border-2 border-zinc-700 rounded-lg text-white
                focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-zinc-700 text-zinc-200 rounded-lg hover:bg-zinc-600 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg transition-colors
              ${
                isLoading ||
                (formData.userName && !validations.validName) ||
                (formData.userNickname && !validations.validNickname) ||
                (formData.userNickname &&
                  validations.nicknameChecked &&
                  validations.nicknameDuplicate) ||
                !isFormChanged()
                  ? "bg-zinc-600 text-zinc-400 cursor-not-allowed"
                  : "bg-cyan-500 text-white hover:bg-cyan-600"
              }`}
              disabled={
                isLoading ||
                (formData.userName && !validations.validName) ||
                (formData.userNickname && !validations.validNickname) ||
                (formData.userNickname &&
                  validations.nicknameChecked &&
                  validations.nicknameDuplicate) ||
                !isFormChanged()
              }
            >
              {isLoading ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex flex-col space-y-7 rounded-xl p-7 bg-zinc-900/60 shadow-lg backdrop-blur-sm border border-zinc-700/50">
            <h2 className="text-xl font-bold text-white">기본 정보</h2>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "이름", value: profile.userName },
                { label: "이메일", value: profile.userEmail },
                {
                  label: "생년월일",
                  value: formatDateForInput(profile.userBirthday),
                },
                { label: "레벨", value: profile.userLevel },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="p-3 bg-zinc-900 rounded-lg border border-zinc-700/50"
                >
                  <p className="text-zinc-400 mb-1 text-sm">{label}</p>
                  <p className="text-white text-base">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <div className="flex gap-3">
                <button
                  onClick={() => dispatch(setPasswordModalOpen(true))}
                  className="flex px-4 py-2 bg-zinc-700 text-zinc-200 rounded-lg hover:bg-zinc-600 transition-colors"
                >
                  <Lock className="w-4 h-4 mr-2 mt-1" />
                  비밀번호 변경
                </button>
                <button
                  onClick={() => dispatch(setEditing(true))}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  수정하기
                </button>
              </div>
              <button
                onClick={() => dispatch(setDeleteModalOpen(true))}
                className="px-4 py-2 bg-zinc-900 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-colors"
              >
                회원탈퇴
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MyInformation;
