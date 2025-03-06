import React from "react";
import Card from "../Card";

const DeckArea = ({ publicDeck = [] }) => {
  // 마지막 카드를 오픈 카드로 사용
  const openCard = publicDeck.length > 0 ? publicDeck[publicDeck.length - 1] : null;
  
  // 나머지 카드들은 뒷면으로 표시 (마지막 카드 제외)
  const remainingCards = publicDeck.length - 1;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="relative">
        {/* 덱 카드들 (뒷면) */}
        {Array.from({ length: remainingCards }).map((_, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              top: `${-index * 1}px`,
              left: `${-index * 1}px`,
              zIndex: index,
            }}
          >
            <Card isBack={true} />
          </div>
        ))}

        {/* 오픈 카드 */}
        {openCard && (
          <div
            className="absolute"
            style={{
              top: "-30px",
              left: "20px",
              zIndex: 10,
              transform: `rotate(5deg)`,
            }}
          >
            <Card
              type={openCard.type}
              isBack={false}
              isRoyal={openCard.royal}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckArea;