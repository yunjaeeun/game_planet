import React, { forwardRef } from "react";
import Card from "../Card";
import { sortCards, sortPenaltyGroups } from "../utils/cardUtils";
import PenaltyCardStack from "./PenaltyCardArea";

const MyArea = forwardRef(
  (
    {
      penaltyCards = [],
      handCards = [],
      isMyTurn,
      selectedCard,
      handleCardClick,
      currentUser,
    },
    ref
  ) => {
    const groupedPenaltyCards = penaltyCards.reduce((acc, card) => {
      const baseType = card.type.replace("King", "");
      if (!acc[baseType]) {
        acc[baseType] = { type: card.type, count: 0 };
      }
      acc[baseType].count += card.count;
      return acc;
    }, {});

    const sortedPenaltyGroups = sortPenaltyGroups(groupedPenaltyCards);

    return (
      <div
        ref={ref}
        className="absolute bottom-4 left-0 right-0 px-8"
        data-player={currentUser}
      >
        <div className="mb-6">
          <div className="flex justify-center gap-4 flex-wrap">
            {sortedPenaltyGroups.map((stack, i) => (
              <PenaltyCardStack
                key={i}
                type={stack.type}
                count={stack.count}
                isRoyal={stack.royal}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          {sortCards(handCards).map((card, i) => {
            // 고유한 cardId 생성
            const uniqueCardId = `${card.type}-${card.royal ? 'king' : 'normal'}-${i}`;
            return (
              <div
                key={uniqueCardId}
                className="transition-all duration-300 ease-in-out"
                style={{
                  // selectedCard의 cardId와 정확히 일치할 때만 사라지도록
                  opacity: selectedCard?.cardId === uniqueCardId ? 0 : 1,
                  transform: selectedCard?.cardId === uniqueCardId ? "scale(0.9)" : "scale(1)",
                }}
              >
                <Card
                  type={card.type}
                  isRoyal={card.royal}  // royal 속성 전달
                  cardId={uniqueCardId}  // 고유한 cardId 전달
                  onClick={(e) => handleCardClick({
                    ...card,
                    cardId: uniqueCardId
                  }, e)}
                  selectedCard={selectedCard}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

MyArea.displayName = "MyArea";

export default MyArea;
