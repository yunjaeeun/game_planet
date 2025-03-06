import React, { useEffect, useState } from "react";
import Card from "../Card";

const ActiveCardArea = ({
  currentCard,
  cardSender,
  cardReceiver,
  currentUser,
  handlePass,
  setShowGuessModal,
  gameData,
  isPassing,
  selectedCard,
}) => {
  const [cardVisible, setCardVisible] = useState(true);

  // 디버깅을 위한 useEffect
  useEffect(() => {
    console.log("ActiveCardArea 전달 받은 값:", {
      currentCard,
      selectedCard,
      cardSender,
      cardReceiver,
      isPassing,
    });
  }, [currentCard, selectedCard, cardSender, cardReceiver, isPassing]);

  // 카드가 앞면을 보여줘야 하는지 결정
  const shouldShowFront = () => {
    return !!selectedCard || cardSender === currentUser || isPassing;
  };

  // 카드 상태가 변경될 때마다 카드를 보이게 설정
  useEffect(() => {
    if (currentCard || selectedCard) {
      setCardVisible(true);
      console.log("카드 상태 업데이트:", { currentCard, selectedCard });
    }
  }, [currentCard, selectedCard]);


  // 추측 버튼 클릭 핸들러
  const handleGuessClick = () => {
    if (isPassing) {
      console.log("패스 진행중!")
      return};
    setShowGuessModal(true);
    setTimeout(()=> setCardVisible(false), 100);
  };

  // 카드 정보 계산
  const getCardInfo = () => {
    const activeCard = currentCard || selectedCard;
    if (!activeCard) {
      console.log("Active Card 가 없습니다!");
      
      return null};

    // 카드 타입 정규화
    let cardType = activeCard.type;
    let isRoyal = activeCard.royal;

    // King 접두사 처리
    if (typeof cardType === 'string' && cardType.startsWith('King')) {
      cardType = cardType.substring(4);
      isRoyal = true;
    }

    const cardInfo = {
      type: cardType,
      isBack: !shouldShowFront(),
      isRoyal: isRoyal
    };

    console.log("Card info" , cardInfo);
    return cardInfo
  };

  const cardInfo = getCardInfo();
  const showButtons = cardReceiver === currentUser && currentCard

  return (
    <div className="absolute top-[60%] right-4 w-72 active-card-area">
      <div className="bg-gray-800/90 p-4 rounded-lg space-y-4 min-h-[200px]">
        <div className="text-center text-sm font-medium text-amber-400 mb-2">
          PLAY ZONE
        </div>

        <div className="relative flex justify-center h-24" data-active-card-slot>
          <div
            className={`
              transition-all duration-300 ease-in-out
              ${cardVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
            `}
          >
            {cardInfo ? (
              <Card
                type={cardInfo.type}
                isBack={cardInfo.isBack}
                isRoyal={cardInfo.isRoyal}
                isActive={true}
              />
            ) : (
              <div className="w-16 h-24 border-2 border-dashed border-gray-600 rounded-lg opacity-50" />
            )}
          </div>
        </div>

        <div className="text-sm text-blue-300 text-center">
          {cardSender && cardReceiver ? `${cardSender} → ${cardReceiver}` : ""}
        </div>

        {showButtons && (
          <div className="flex justify-center gap-4 mt-4">
            {!isPassing && (
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                onClick={handlePass}
              >
                PASS
              </button>
            )}
            <button
              className={`px-4 py-2 ${
                isPassing
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500"
              } text-white rounded`}
              onClick={handleGuessClick}
              disabled={isPassing}
            >
              GUESS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveCardArea;