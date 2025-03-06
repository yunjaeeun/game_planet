import React from "react";
import { useNavigate } from "react-router-dom";

const GameEndModal = ({ isOpen, onClose, loser, reason, roomId, setIsGameStarted }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToHome = () => {
    navigate("/home");
  };

  const handleGoToGameList = () => {
    setIsGameStarted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">게임 종료!</h2>
        <div className="mb-6 text-gray-300">
          <p className="mb-2">
            <span className="font-semibold text-red-400">{loser}</span>님이
            패배하셨습니다.
          </p>
          <p className="text-sm text-gray-400">패배 사유: {reason}</p>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={handleGoToGameList}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            대기방으로
          </button>
          <button
            onClick={handleGoToHome}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameEndModal;
