import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import GiveCardModal from "./modal/GiveCardModal";
import GuessCardModal from "./modal/GuessCardModal";
import PenaltyCardSelectModal from "./modal/PenaltyCardSelectModal";
import ActiveCardArea from "./areas/ActiveCardArea";
import Card from "./Card";
import GameEndModal from "./modal/GameEndModal";
import MyArea from "./areas/MyArea";
import DeckArea from "./areas/DeckArea";
import OpponentArea from "./areas/OpponentArea";
import useCockroachSocket from "../../../hooks/useCockroachSocket";
import { WS_ENDPOINTS } from "../../../hooks/useCockroachSocket";

import { getKoreanName, normalizeCardData } from "./utils/cardUtils";

const GameBoard = ({
  playerCount,
  gameState,
  playerCards,
  currentUser,
  sendMessage,
  stompClient,
  roomId,
  onGameEnd

}) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [showGiveCardModal, setShowGiveCardModal] = useState(false);
  const [showGuessModal, setShowGuessModal] = useState(false);
  const [isPassing, setIsPassing] = useState(false);
  const [showPenaltyCardModal, setShowPenaltyCardModal] = useState(false);
  const [currentLoser, setCurrentLoser] = useState(null);
  const [penaltyCardCount, setPenaltyCardCount] = useState(0);
  const [showGameEndModal, setShowGameEndModal] = useState(false);
  const [gameEndInfo, setGameEndInfo] = useState({ loser: "", reason: "" });
    
  // useRef
  const activeCardRef = useRef(null);
  const penaltyStackRefs = useRef({});
  
  // 애니메이션션
  const [penaltyAnimation, setPenaltyAnimation] = useState({
    isAnimating: false,
    card: null,
    loser: null,
    sourcePosition: null,
    targetPosition: null,
  });

  // 남은 플레이어 계산
  const remainingPlayers = useMemo(() => {
    if (!gameState) return [];

    const { cardSender, passedPlayers = [] } = gameState;
    
    return Object.keys(playerCards).filter(
      (player) => player !== cardSender && !passedPlayers.includes(player)
    );
  }, [gameState, playerCards]);

  useEffect(() => {
    console.log("게임 상태 : ", gameState);
    console.log("유저 카드더미 : ", playerCards);
  }, [gameState, playerCards]);

  // 1. 게임 핵심 로직
  //-----------------------
  //-----------------------

  const handleGameEnd = useCallback(async (gameFinishResult) => {
    try {
      console.log("게임 종료:", gameFinishResult);
      
      setGameEndInfo({
        loser: gameFinishResult.loser,
        reason: gameFinishResult.reason,
      });
      setShowGameEndModal(true);
  
      // 게임 종료 시 상태 초기화
      setSelectedCard(null);
      setSelectedPlayer(null);
      setIsMyTurn(false);
      setIsPassing(false);
  
      if (onGameEnd) {
        onGameEnd();
      }
    } catch (error) {
      console.error("게임 종료 처리 중 오류:", error);
    }
  }, [onGameEnd]);

  const checkGameFinish = useCallback(
    (userName, tableCards) => {
      // 1. 같은 카드 4장 체크
      const cardCount = {};
      tableCards.forEach((card) => {
        const type = card.type;
        cardCount[type] = (cardCount[type] || 0) + card.count;

        if (cardCount[type] >= 4) {
          const result = {
            isFinished: true,
            reason: `${getKoreanName(type)} 카드 4장 모음`,
            loser: userName,
          };
          handleGameEnd(result);
          return result;
        }
      });

      // 2. 모든 종류 카드 1장씩 체크
      const REQUIRED_TYPES = [
        "Bat",
        "Rat",
        "Fly",
        "Cockroach",
        "Scorpion",
        "Toad",
        "Stinkbug",
      ];
      const playerCardTypes = new Set(
        tableCards.map((card) => card.type.replace("King", ""))
      );

      const hasAllTypes = REQUIRED_TYPES.every((type) =>
        playerCardTypes.has(type)
      );
      if (hasAllTypes) {
        const result = {
          isFinished: true,
          reason: "모든 종류의 카드를 1장씩 모음",
          loser: userName,
        };
        handleGameEnd(result);
        return result;
      }

      return { isFinished: false };
    },
    [handleGameEnd]
  );

  const determineLoser = (guess) => {
    const { cardSender, cardReceiver, currentCard, claimedAnimal, isKing } =
      gameState;

    // 블랙이라고 추측했는데 아닐 경우
    if (guess === "Black" && currentCard.type !== "Black") {
      return cardReceiver; // 추측한 사람이 짐
    }

    // Black 카드 처리
    if (currentCard.type === "Black") {
      return guess === "Black" ? cardSender : cardReceiver;
    }

    // Joker 카드 처리
    if (currentCard.type === "Joker") {
      if (guess === "Black") {
        return cardReceiver; // 조커를 블랙이라고 잘못 추측하면 추측한 사람이 짐
      }
      // 조커는 왕 카드로 블러핑했을 때만 거짓
      const isJokerLie = isKing;
      return (guess === "TRUE" && isJokerLie) || 
             (guess === "FALSE" && !isJokerLie) 
             ? cardReceiver : cardSender;
    }

    // 일반 카드 처리
    const isCorrectClaim =
      currentCard.type === claimedAnimal && currentCard.royal === isKing;
      return (isCorrectClaim && guess === "FALSE") || 
      (!isCorrectClaim && guess === "TRUE") 
      ? cardReceiver : cardSender;
  };

  const handleGuess = async (guess) => {
    try {
      const { cardSender, cardReceiver, currentCard } = gameState;
      
      const currentLoser = determineLoser(guess);
  
      // 1. 첫 번째 패널티 카드 전송
        await sendMessage({
          type: "SINGLE_CARD",
          data: {
            from: currentUser,
            to: currentLoser,
            card: currentCard,
            correct: false  
          }
        });
  
      // 2. 블랙/조커 카드 특수 처리
      if (currentCard.type === "Black" || currentCard.type === "Joker") {
        setPenaltyCardCount(currentCard.type === "Black" ? 2 : 1);
        setCurrentLoser(currentLoser);
        setShowPenaltyCardModal(true);
        setShowGuessModal(false);
        return;
      }
  
      // 3. 일반/왕카드 처리를 위한 테이블 카드 업데이트
      let updatedTableCards = addCardToTable(
        [...(gameState.userTableCards[currentLoser] || [])],
        currentCard
      );
  
      // 4. 왕카드 추가 패널티 처리
      if (currentCard.royal) {
        const openCard = gameState.publicDeck[gameState.publicDeck.length - 1];
        if (openCard) {
          // 추가 패널티 카드 전송
          await sendMessage({
            type: "SINGLE_CARD",
            data: {
              from: currentUser,
              to: currentLoser,
              card: openCard,
              correct: false
            }
          });
  
          // 테이블 카드와 공개 덱 업데이트
          updatedTableCards = addCardToTable(updatedTableCards, openCard);
        }
      }
  
    // 5. 게임 종료 조건 체크
    const gameFinishResult = checkGameFinish(currentLoser, updatedTableCards);
    if (gameFinishResult.isFinished) {
      setShowGuessModal(false);
      setGameEndInfo(gameFinishResult);
      setShowGameEndModal(true);
      return;
    }

    setShowGuessModal(false);
  } catch (error) {
    console.error("Guess handling failed:", error);
    setShowGuessModal(false);
    setShowPenaltyCardModal(false);
  }
};

  const handleGiveCard = (claimData) => {
    const normalizedCard = normalizeCardData(selectedCard);
    
    sendMessage({
      type: "GIVE_CARD",
      data: {
        to: selectedPlayer,
        from: currentUser,
        card: {
          type: normalizedCard.type,
          royal: normalizedCard.royal,
        },
        animal: claimData.animal,
        king: claimData.king,
        negative: claimData.negative,
      }
    })
      .then(() => {
        setShowGiveCardModal(false);
        setIsPassing(false);
        setSelectedCard(null);
        setSelectedPlayer(null);
        setIsMyTurn(false);
      })
      .catch(error => {
        console.error("카드 전송 실패:", error);
      });
  };

  // 2. 카드 조작 로직---------------------------
  //---------------------------------------------
  //---------------------------------------------
  
  const addCardToTable = (tableCards, card) => {
    const cardType = card.royal ? `King${card.type}` : card.type;
    const existingIndex = tableCards.findIndex(
      (c) => c.type === cardType && c.royal === card.royal
    );

    if (existingIndex !== -1) {
      tableCards[existingIndex].count += 1;
    } else {
      tableCards.push({
        type: cardType,
        count: 1,
        royal: card.royal,
        isNew: true,
      });
    }

    return tableCards;
  };

  const addCardsToTable = (tableCards, newCards) => {
    return newCards.reduce(
      (acc, card) => {
        const cardType = card.royal ? `King${card.type}` : card.type;
        const existingIndex = acc.findIndex(
          (c) => c.type === cardType && c.royal === card.royal
        );

        if (existingIndex !== -1) {
          acc[existingIndex].count += 1;
        } else {
          acc.push({
            type: cardType,
            count: 1,
            royal: card.royal,
            isNew: true,
          });
        }
        return acc;
      },
      [...tableCards]
    );
  };

  const removeCardsFromHand = (handCards, selectedCards) => {
    return handCards.filter(
      (card) =>
        !selectedCards.some(
          (selectedCard) =>
            selectedCard.type === card.type && selectedCard.royal === card.royal
        )
    );
  };

  const handlePenaltyCardSelect = useCallback(async (selectedCards) => {
    try {
      // 1. 핸드 체크
      if (playerCards[currentLoser]?.length < selectedCards.length) {
        await sendMessage({
          type: "HAND_CHECK",
          data: { player: currentLoser }
        });
        return;
      }
  
      // 2. 핸드에서 카드 제거 & 테이블에 카드 추가
      const updatedTableCards = addCardsToTable(
        gameState.userTableCards[currentLoser] || [],
        selectedCards
      );
  
      // 3. 게임 종료 조건 체크
      const gameFinishResult = checkGameFinish(currentLoser, updatedTableCards);
      if (gameFinishResult.isFinished) {
        setShowPenaltyCardModal(false);
        setGameEndInfo(gameFinishResult);
        setShowGameEndModal(true);
        return;
      }
  
      setShowPenaltyCardModal(false);
    } catch (error) {
      console.error("패널티 카드 선택 처리 실패:", error);
      setShowPenaltyCardModal(false);
    }
  }, [currentLoser, currentUser, sendMessage, playerCards, gameState?.userTableCards, checkGameFinish]);

  // 3. 게임 진행 로직------------------------------------------------------------------------

  const handleCardClick = (card, event) => {
    if (!isMyTurn) return;
    setSelectedCard(card);
  };

  const handlePlayerClick = (playerNickname) => {
    if (!isPassing && (!isMyTurn || !selectedCard)) return;
    if (playerNickname === currentUser) return;
  
    setSelectedPlayer(playerNickname);
    setShowGiveCardModal(true);
  };

  const handlePass = async () => {
  try {
    // 1. 남은 플레이어 체크
    if (remainingPlayers.length === 0) {
      console.log("마지막 플레이어는 무조건 맞춰야 합니다!");
      setShowGuessModal(true);
      return;
    }

    // 2. 패스 상태 설정
    setIsPassing(true);
    setSelectedCard(normalizeCardData(gameState?.currentCard));
    setShowGiveCardModal(true);
    setShowGuessModal(false);

    // 이 상태에서 패스된 플레이어 정보는 
    // GiveCard를 통해 다음 플레이어에게 카드를 전달할 때
    // 서버에서 처리되도록 합니다.

  } catch (error) {
    console.error("패스 실패!", error);
    setIsPassing(false);
  }
};

  // 4. UI 상태 관리------------------------------------------------------------------------
  const handleModalClose = () => {
    setShowGiveCardModal(false);
    setSelectedPlayer(null);
    // PASS 모드였다면 isPassing도 초기화
    if (isPassing) {
      setIsPassing(false);
    }
  };

  const getOpponentCardCount = useCallback(
    (opponent) => {
      // opponent ID를 직접 사용해서 해당 플레이어의 카드 수를 반환
      return playerCards?.[opponent]?.length || 0;
    },
    [playerCards]
  );

  // 5. 상태 관리 Effects-----------------------
  //-------------------------------------------
  //-------------------------------------------
  
  // 턴 관리 Effect
  useEffect(() => {
    if (gameState?.currentTurn) {
      const isCurrentTurn = gameState.currentTurn === currentUser;
      setIsMyTurn(isCurrentTurn);
  
      if (isCurrentTurn) {
        const myHand = playerCards[currentUser] || [];
        if (myHand.length === 0) {
          sendMessage({
            type: "HAND_CHECK",
            data: {
              player: currentUser,
            },
          });
        }
      }
    }
  }, [gameState?.currentTurn, currentUser, playerCards, sendMessage]);

  // 현재 유저를 제외한 다른 플레이어들
  const opponents = useMemo(() => {
    if (!playerCards) return [];
    // playerCards의 키(플레이어 ID)들을 배열로 변환하고 현재 사용자 제외
    return Object.keys(playerCards).filter(
      (player) => player !== currentUser
    );
  }, [playerCards, currentUser]);

  if (!gameState) {
    return (
      <div className="relative w-full h-[800px] max-w-[1600px] mx-auto bg-gray-700/10 rounded-3xl flex items-center justify-center">
        <div className="text-xl text-gray-200">게임 데이터 로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="relative w-full h-[800px] max-w-[1600px] mx-auto bg-gray-700/10 rounded-3xl">
        {/* 상대방 영역 */}
        <div className="absolute top-4 left-0 right-0">
          <div
            className={`flex justify-between ${
              opponents.length === 1 ? "justify-center" : "px-4"
            }`}
          >
            {opponents.map((opponent, index) => (
              <div
                key={opponent}
                className={`${
                  opponents.length === 1
                    ? "w-64"
                    : opponents.length === 2
                    ? "w-[calc(40%-1rem)]"
                    : "w-[calc(33%-1rem)]"
                }`}
              >
                <OpponentArea
                  ref={(el) => (penaltyStackRefs.current[opponent] = el)}
                  playerNumber={index + 2}
                  penaltyCards={gameState.userTableCards?.[opponent] || []}
                  handCards={Array(getOpponentCardCount(opponent)).fill({
                    isBack: true,
                  })}
                  playerName={opponent}
                  isMyTurn={isMyTurn || isPassing}
                  selectedCard={selectedCard}
                  handlePlayerClick={handlePlayerClick}
                  isPassing={isPassing}
                  passedPlayers={gameState.passedPlayers || []}
                  cardSender={gameState.cardSender}
                  remainingPlayers={remainingPlayers}
                  currentUser={currentUser}
                />
              </div>
            ))}
          </div>
        </div>

        <DeckArea publicDeck={gameState.publicDeck || []} />

        {/* 내 영역 */}
        <MyArea
          ref={(el) => (penaltyStackRefs.current[currentUser] = el)}
          penaltyCards={gameState.userTableCards?.[currentUser] || []}
          handCards={playerCards[currentUser] || []}
          isMyTurn={isMyTurn && !isPassing}
          selectedCard={selectedCard}
          handleCardClick={handleCardClick}
          currentUser={currentUser}
        />

        {/* 애니메이션되는 카드 영역 */}
        {penaltyAnimation.isAnimating &&
          penaltyAnimation.sourcePosition &&
          penaltyAnimation.targetPosition && (
            <div
              className="fixed z-50 transition-all duration-1000 ease-in-out pointer-events-none"
              style={{
                left: penaltyAnimation.sourcePosition.left,
                top: penaltyAnimation.sourcePosition.top,
                transform: `translate(
                ${
                  penaltyAnimation.targetPosition.left -
                  penaltyAnimation.sourcePosition.left
                }px,
                ${
                  penaltyAnimation.targetPosition.top -
                  penaltyAnimation.sourcePosition.top
                }px
              )`,
                opacity: 1,
              }}
            >
              <Card
                type={penaltyAnimation.card.type}
                isRoyal={penaltyAnimation.card.royal}
                isActive={true}
              />
            </div>
          )}

        <div ref={activeCardRef}>
          <ActiveCardArea
            currentCard={gameState.currentCard}
            cardSender={gameState.cardSender}
            cardReceiver={gameState.cardReceiver}
            currentUser={currentUser}
            handlePass={handlePass}
            setShowGuessModal={setShowGuessModal}
            isPassing={isPassing}
            selectedCard={selectedCard}
          />
        </div>
      </div>

      <GiveCardModal
        isOpen={showGiveCardModal}
        onClose={handleModalClose}
        selectedCard={selectedCard}
        selectedPlayer={selectedPlayer}
        onSubmit={handleGiveCard}
        isPassing={isPassing}
        currentPlayer={currentUser}
      />

      {showGuessModal && (
        <GuessCardModal
          isOpen={showGuessModal}
          onClose={() => setShowGuessModal(false)}
          onSubmit={handleGuess}
          currentCard={gameState.currentCard}
          claimedAnimal={gameState.claimedAnimal}
          isKing={gameState.isKing}
          from={gameState.cardSender}
          to={gameState.cardReceiver}
        />
      )}

      {showPenaltyCardModal && currentLoser === currentUser && (
        <PenaltyCardSelectModal
        isOpen={showPenaltyCardModal}
        onClose={() => setShowPenaltyCardModal(false)}
        handCards={playerCards[currentLoser] || []}
        onSubmit={handlePenaltyCardSelect}
        count={penaltyCardCount}
        claimedAnimal={gameState.claimedAnimal}
        isKing={gameState.isKing}
        sendMessage={sendMessage}
        currentUser={currentUser}
        currentLoser={currentLoser}
      />
      )}

      <GameEndModal
        isOpen={showGameEndModal}
        onClose={() => setShowGameEndModal(false)}
        loser={gameEndInfo.loser}
        reason={gameEndInfo.reason}
        roomId={roomId}
      />
    </div>
  );
};

export default GameBoard;
