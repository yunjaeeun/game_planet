import React, { forwardRef, useMemo, useEffect } from "react";
import Card from "../Card";
import { sortPenaltyGroups } from "../utils/cardUtils";
import PenaltyCardStack from "./PenaltyCardArea";

const OpponentArea = forwardRef(({
  playerNumber,
  penaltyCards = [],
  playerName,
  isMyTurn,
  selectedCard,
  handlePlayerClick,
  isPassing,
  passedPlayers,
  cardSender,
  remainingPlayers,
  currentUser,
  gameData,
}, ref) => {
  // 디버깅을 위한 useEffect
  useEffect(() => {
    console.log("OpponentArea for player:", playerName);
    console.log("Cards for this player:", gameData?.playerCards?.[playerName]);
  }, [gameData, playerName]);

  // Group penalty cards
  const groupedPenaltyCards = useMemo(() => {
    return penaltyCards.reduce((acc, card) => {
      const baseType = card.type.replace("King", "");
      if (!acc[baseType]) {
        acc[baseType] = {
          type: card.type,
          count: 0,
          royal: card.royal,
        };
      }
      acc[baseType].count += card.count;
      return acc;
    }, {});
  }, [penaltyCards]);

  const sortedPenaltyGroups = useMemo(() => 
    sortPenaltyGroups(groupedPenaltyCards)
  , [groupedPenaltyCards]);

  // Calculate if this opponent is selectable
  const isSelectable = useMemo(() => {
    if (isPassing) {
      return remainingPlayers.includes(playerName) && 
             !passedPlayers.includes(playerName);
    }
    return isMyTurn && selectedCard && playerName !== currentUser;
  }, [isPassing, remainingPlayers, playerName, passedPlayers, 
      isMyTurn, selectedCard, currentUser]);

  // Get actual number of cards for this opponent
// OpponentArea 컴포넌트에서
// OpponentArea 컴포넌트에서
const opponentCards = useMemo(() => {
  if (!gameData?.playerCards?.[playerName]) {
    console.log("Checking for cards:", {
      gameData,
      playerName,
      cards: gameData?.playerCards?.[playerName]
    });
    return [];
  }
  const cards = gameData.playerCards[playerName];
  return cards.map(() => ({ isBack: true }));
}, [gameData, playerName]);

  return (
    <div
      ref={ref}
      className={`w-64 space-y-4 
        ${!isSelectable ? "opacity-50" : ""} 
        ${isSelectable ? "cursor-pointer hover:ring-2 hover:ring-blue-500 rounded-lg" : "cursor-not-allowed"}
      `}
      data-player={playerName}
      onClick={() => isSelectable && handlePlayerClick(playerName)}
    >
      {/* Player name header */}
      <div className="px-3 py-1.5 bg-gray-800/90 rounded-lg">
        <div className="text-center text-sm font-medium text-white">
          {playerName} ({opponentCards.length} cards)
        </div>
      </div>

      <div className="space-y-4">
        {/* Penalty cards area */}
        <div className="h-40 overflow-y-auto">
          <div className="flex flex-wrap justify-center gap-2 p-2">
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

        {/* Hand cards area */}
        <div className="relative h-24">
          {opponentCards.length > 0 ? (
            opponentCards.length > 4 ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="flex">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="relative"
                      style={{
                        marginLeft: i === 0 ? "0" : "-12px",
                      }}
                    >
                      <Card isBack={true} />
                    </div>
                  ))}
                </div>
                <div className="ml-2 px-3 py-1 bg-gray-800/80 text-white text-sm rounded-lg">
                  +{opponentCards.length - 4}
                </div>
              </div>
            ) : (
              <div className="flex justify-center gap-2">
                {opponentCards.map((_, i) => (
                  <Card key={i} isBack={true} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center text-gray-400">No cards</div>
          )}
        </div>
      </div>
    </div>
  );
});

OpponentArea.displayName = "OpponentArea";

export default OpponentArea;