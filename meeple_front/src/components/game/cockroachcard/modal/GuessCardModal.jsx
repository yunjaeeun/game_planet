import React from "react";

const GuessCardModal = ({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
  currentCard = null,
  claimedAnimal = "",
  isKing = false,
  from = "",
  to = "",
  isNegative = false,
}) => {
  if (!isOpen) return null;

  // 동물 이름 한글 변환 함수
  const getKoreanName = (type) => {
    const nameMap = {
      Bat: "박쥐",
      Rat: "쥐",
      Fly: "파리",
      Cockroach: "바퀴벌레",
      Scorpion: "전갈",
      Toad: "두꺼비",
      Stinkbug: "노린재",
      Joker: "조커",
      Black: "블랙",
    };
    return nameMap[type] || type;
  };

  const message = `${from}님이 "${getKoreanName(claimedAnimal)} ${
    isKing ? " 킹이" : "일반이"
  }${isNegative ? " 아니야" : "야"}" 라고 했습니다.`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 space-y-6">
        <h2 className="text-xl font-bold text-white text-center">
          카드 판단하기
        </h2>

        <p className="text-white text-center">{message}</p>

        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => onSubmit("TRUE")}
            className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            진실
          </button>
          <button
            onClick={() => onSubmit("FALSE")}
            className="p-3 bg-red-500 text-white rounded hover:bg-red-600"
          >
            거짓
          </button>
          <button
            onClick={() => onSubmit("Black")}
            className="p-3 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            블랙
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuessCardModal;
