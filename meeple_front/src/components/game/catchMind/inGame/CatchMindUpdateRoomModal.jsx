import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const CatchMindUpdateRoomModal = ({ isOpen, onClose, roomInfo, client }) => {
  const [formData, setFormData] = useState({
    roomTitle: "",
    isPrivate: false,
    password: "",
    maxPeople: "2",
    timeLimit: "90",
    quizCount: "5",
  });

  // 컴포넌트 마운트 시 현재 방 정보로 폼 초기화
  useEffect(() => {
    if (roomInfo) {
      setFormData({
        roomTitle: roomInfo.roomTitle || "",
        isPrivate: Boolean(roomInfo.isPrivate), // boolean 값 보장
        password: roomInfo.password || "",
        maxPeople: String(roomInfo.maxPeople || 2),
        timeLimit: String(roomInfo.timeLimit || 90),
        quizCount: String(roomInfo.quizCount || 5),
      });
    }
  }, [roomInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // RoomInfoDTO 구조에 맞게 데이터 구성
      const requestData = {
        roomTitle: formData.roomTitle.trim(),
        isPrivate: formData.isPrivate,
        password: formData.isPrivate ? formData.password : "", // 비공개가 아닐 경우 빈 문자열
        maxPeople: parseInt(formData.maxPeople),
        timeLimit: parseInt(formData.timeLimit),
        quizCount: parseInt(formData.quizCount),
      };

      // WebSocket을 통해 방 정보 업데이트 메시지 전송
      if (client) {
        client.publish({
          destination: `/app/update-room/${roomInfo.roomId}`,
          body: JSON.stringify(requestData),
          headers: { "content-type": "application/json" },
        });
      }

      onClose();
    } catch (error) {
      console.error("Room update error:", error);
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
          <h2 className="text-xl font-bold text-gray-900">방 정보 수정</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
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
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="방 제목을 입력하세요"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900">비밀방</label>
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

          {formData.isPrivate && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
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
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="비밀번호를 입력하세요"
                required={formData.isPrivate}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
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
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="2">2인</option>
              <option value="3">3인</option>
              <option value="4">4인</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
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
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="5">5초</option>
              <option value="90">90초</option>
              <option value="120">120초</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
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
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="5">5개</option>
              <option value="7">7개</option>
              <option value="10">10개</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            수정하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default CatchMindUpdateRoomModal;
