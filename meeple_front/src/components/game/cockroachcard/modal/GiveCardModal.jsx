import React, { useState, useEffect } from "react";
import { getSelectableAnimals, getKoreanName } from "../utils/cardUtils";

const GiveCardModal = ({
  isOpen,
  onClose,
  selectedCard,
  selectedPlayer,
  onSubmit,
  currentPlayer,
  isPassing = false
}) => {
  const [isKing, setIsKing] = useState(false);
  const [claimedAnimal, setClaimedAnimal] = useState(selectedCard?.type || "");
  const [isNegative, setIsNegative] = useState(false);

  useEffect(() => {
    if (selectedCard) {
      setClaimedAnimal(getSelectableAnimals()[0]);
      setIsKing(false);
      setIsNegative(false);
    }
  }, [selectedCard]);

  const handleSubmit = () => {
    onSubmit({
      king: isKing, // isKing -> king
      animal: claimedAnimal,
      negative: isNegative, 
      to: selectedPlayer, 
      from: currentPlayer, 
    });
  };

  if (!isOpen) return null;

  const handleBackgroundClick = (e) => {
    if (!isPassing && e.target === e.currentTarget) onClose();
  };


  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-gray-800 rounded-lg p-6 w-96 space-y-6">
        <h2 className="text-xl font-bold text-white text-center">
          {isPassing ? "카드 전달하기" : "카드 보내기"}
        </h2>

        <div className="space-y-2">
          <label className="text-white">선언할 동물:</label>
          <select
            value={claimedAnimal}
            onChange={(e) => setClaimedAnimal(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            {getSelectableAnimals().map((animal) => (
              <option key={animal} value={animal}>
                {getKoreanName(animal)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-white">카드 타입:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`p-2 rounded ${
                !isKing ? "bg-blue-500" : "bg-gray-700"
              } text-white`}
              onClick={() => setIsKing(false)}
            >
              일반
            </button>
            <button
              className={`p-2 rounded ${
                isKing ? "bg-blue-500" : "bg-gray-700"
              } text-white`}
              onClick={() => setIsKing(true)}
            >
              킹
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-white">선언 방식:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`p-2 rounded ${
                !isNegative ? "bg-blue-500" : "bg-gray-700"
              } text-white`}
              onClick={() => setIsNegative(false)}
            >
              진실
            </button>
            <button
              className={`p-2 rounded ${
                isNegative ? "bg-blue-500" : "bg-gray-700"
              } text-white`}
              onClick={() => setIsNegative(true)}
            >
              거짓
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            {isPassing ? "다른 플레이어 선택" : "취소"}
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            {isPassing ? "전달" : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiveCardModal;
