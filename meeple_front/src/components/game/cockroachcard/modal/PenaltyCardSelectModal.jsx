import React, { useState, useEffect } from "react";

const PenaltyCardSelectModal = ({
  isOpen,
  onClose,
  handCards,
  onSubmit,
  count,
  claimedAnimal,
  isKing,
  sendMessage,
  currentUser,
  currentLoser,
}) => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [animatingCards, setAnimatingCards] = useState([]);

  useEffect(() => {
    // 자동 선택 로직 (count가 1일 때)
    console.log({ 결과: handCards, claimedAnimal, isKing });
    if (count === 1) {
      const claimedCard = handCards.find(
        (card) =>
          card.type === claimedAnimal &&
          card.royal === isKing &&
          card.type !== "Joker" &&
          card.type !== "Black"
      );

      if (claimedCard) {
        // 애니메이션을 위해 선택된 카드 저장
        setAnimatingCards([claimedCard]);

        // 애니메이션 후 제출
        setTimeout(() => {
          onSubmit([claimedCard]);
        }, 500); // 1초 후 제출
        return;
      }
    }
  }, [count, handCards, claimedAnimal, isKing, onSubmit]);

  // 애니메이션 중인 카드에 대한 스타일 클래스
  const getCardClassName = (card) => {
    const isAnimating = animatingCards.includes(card);
    return `flex-shrink-0 w-16 h-24 rounded-lg relative cursor-pointer overflow-hidden
      ${selectedCards.includes(card) ? "ring-2 ring-blue-500" : ""}
      ${isAnimating ? "animate-fadeOut" : ""}
    `;
  };

  // Don't render modal if count is 1 (automatic case) or not open
  if (!isOpen || count === 1) return null;

  // Filter out Joker and Black cards for selection
  const selectableCards = handCards.filter(
    (card) => card.type !== "Joker" && card.type !== "Black"
  );

  const handleCardSelect = (card) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter((c) => c !== card));
    } else if (selectedCards.length < 2) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleSubmit = () => {
    setAnimatingCards(selectedCards);
    setTimeout(() => {
      // 선택된 카드 수에 따라 다른 메시지 타입 사용
      const messageType = selectedCards.length > 1 ? "MULTI_CARD" : "SINGLE_CARD";
      
      sendMessage({
        type: messageType,
        data: messageType === "MULTI_CARD" ? {
          user: currentLoser,
          cards: selectedCards,
          isBlack: true
        } : {
          from: currentUser,
          to: currentLoser,
          card: selectedCards[0],
          correct: false
        }
      });
  
      onSubmit(selectedCards);
      onClose();
    }, 1000);
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl space-y-6">
        <h2 className="text-xl font-bold text-white text-center">
          패널티로 보낼 카드 2장을 선택하세요
        </h2>

        <div className="flex flex-wrap gap-4 justify-center">
          {selectableCards.map((card, index) => (
            <div
              key={index}
              onClick={() => handleCardSelect(card)}
              className={getCardClassName(card)}
            >
              <img
                src={`/src/assets/image/cockroachpoker/${
                  card.royal ? "King" : ""
                }${card.type}Card.svg`}
                alt={card.type}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleSubmit}
            disabled={selectedCards.length !== 2}
            className={`px-4 py-2 ${
              selectedCards.length === 2
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-gray-500 cursor-not-allowed"
            } text-white rounded`}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenaltyCardSelectModal;
