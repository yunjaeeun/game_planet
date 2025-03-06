import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CatchMindAPI } from "../../../../sources/api/CatchMindAPI";
import { fetchProfile } from "../../../../sources/store/slices/ProfileSlice";

const CatchMindCreateRoomModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.user.userId);
  const profileData = useSelector((state) => state.profile.profileData);
  const token = useSelector((state) => state.user.token);

  // 폼 제출 상태 추가
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 컴포넌트 마운트 시 프로필 정보 가져오기
  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile(userId));
    }
  }, [userId, dispatch]);

  const [formData, setFormData] = useState({
    roomTitle: "",
    isPrivate: false,
    password: "",
    maxPeople: "2",
    timeLimit: "90",
    quizCount: "5",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 이미 제출 중이면 추가 제출 방지
    if (isSubmitting) return;

    // 제출 시작
    setIsSubmitting(true);

    try {
      // 리덕스의 토큰과 localStorage의 토큰 확인
      const localToken = localStorage.getItem("token");
      if (!localToken || !token || localToken !== token) {
        console.error("토큰이 유효하지 않습니다.");
        setIsSubmitting(false);
        return;
      }

      const requestData = {
        roomTitle: formData.roomTitle,
        creator: profileData?.userNickname,
        isPrivate: formData.isPrivate,
        password: formData.password,
        maxPeople: parseInt(formData.maxPeople),
        timeLimit: parseInt(formData.timeLimit),
        quizCount: parseInt(formData.quizCount),
        gameId: 1,
      };

      const response = await CatchMindAPI.createRoom(requestData);

      if (response.roomId) {
        navigate(`/catch-mind/${response.roomId}`);
      }
    } catch (error) {
      console.error("Room creation error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
      }
      // 에러 발생 시 제출 상태 초기화
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        !isOpen && "hidden"
      }`}
    >
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">방 만들기</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              방 제목
            </label>
            <input
              type="text"
              value={formData.roomTitle}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  roomTitle: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="방 제목을 입력하세요"
              required
            />
          </div>

          {/* 비밀방 설정 */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">비밀방</label>
            <div
              className="relative inline-flex items-center cursor-pointer"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  isPrivate: !prev.isPrivate,
                }))
              }
            >
              <div
                className={`w-11 h-6 rounded-full transition-colors ${
                  formData.isPrivate ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    formData.isPrivate ? "translate-x-6" : "translate-x-1"
                  } mt-0.5`}
                />
              </div>
            </div>
          </div>

          {/* 비밀번호 입력 */}
          {formData.isPrivate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 (숫자 최대 8자리)
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  if (value.length <= 8) {
                    setFormData((prev) => ({
                      ...prev,
                      password: value,
                    }));
                  }
                }}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="비밀번호를 입력하세요"
                required={formData.isPrivate}
              />
            </div>
          )}

          {/* 최대 인원 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              최대 인원
            </label>
            <select
              value={formData.maxPeople}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  maxPeople: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2">2인</option>
              <option value="3">3인</option>
              <option value="4">4인</option>
            </select>
          </div>

          {/* 제한 시간 설정 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제한 시간 (초)
            </label>
            <select
              value={formData.timeLimit}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  timeLimit: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="5">5초</option>
              <option value="90">90초</option>
              <option value="120">120초</option>
            </select>
          </div>

          {/* 퀴즈 개수 설정 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              퀴즈 개수
            </label>
            <select
              value={formData.quizCount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quizCount: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="5">5개</option>
              <option value="7">7개</option>
              <option value="10">10개</option>
            </select>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 text-white rounded-lg transition-colors ${
              isSubmitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "방 생성 중..." : "방 만들기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CatchMindCreateRoomModal;
