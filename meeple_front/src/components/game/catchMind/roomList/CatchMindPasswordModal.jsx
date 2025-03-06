import React, { useState } from "react";
import { Lock } from "lucide-react";
import { CatchMindAPI } from "../../../../sources/api/CatchMindAPI";

const CatchMindPasswordModal = ({
  isOpen,
  onClose,
  roomId,
  onSuccessfulEntry,
  roomTitle,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await CatchMindAPI.checkRoomPassword(roomId, password);
      console.log("Password check response:", response);

      // response.data가 boolean이거나 {isCorrect: boolean} 형태 모두 처리
      const isCorrect =
        typeof response === "boolean" ? response : response.isCorrect;

      if (isCorrect) {
        onSuccessfulEntry(roomId);
        onClose();
      } else {
        setError("비밀번호가 일치하지 않습니다.");
      }
    } catch (err) {
      console.error("비밀번호 확인 중 오류:", err);
      setError("비밀번호 확인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock size={20} className="text-gray-600" />
            비밀방 입장
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold">{roomTitle}</span>은 비밀방입니다.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            입장하려면 방 비밀번호를 입력하세요.
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                // 숫자만 입력 가능하도록 제한
                const value = e.target.value.replace(/[^0-9]/g, "");
                setPassword(value.slice(0, 8)); // 최대 8자리
              }}
              placeholder="비밀번호를 입력하세요"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={8}
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg transition-colors ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isLoading ? "확인 중..." : "입장하기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CatchMindPasswordModal;
