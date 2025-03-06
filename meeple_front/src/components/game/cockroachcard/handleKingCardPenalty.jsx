// 왕 카드 패널티를 처리하는 헬퍼 함수
const handleKingCardPenalty = async (
    gameData,
    setGameData,
    loser,
    sendMessage
  ) => {
    // 현재 오픈된 카드 가져오기
    const openCard = gameData.gameData.publicDeck[gameData.gameData.publicDeck.length - 1];
    if (!openCard) return;
  
    // 패자의 테이블 카드에 오픈 카드 추가
    const updatedTableCards = [...(gameData.gameData.userTableCards[loser] || [])];
    const existingCardIndex = updatedTableCards.findIndex(
      (card) => card.type === (openCard.royal ? `King${openCard.type}` : openCard.type)
    );
  
    // 이미 같은 종류의 카드가 있다면 카운트 증가
    if (existingCardIndex !== -1) {
      updatedTableCards[existingCardIndex].count += 1;
    } else {
      // 새로운 카드 추가
      updatedTableCards.push({
        type: openCard.type,
        count: 1,
        royal: openCard.royal,
        isNew: true // 애니메이션을 위한 플래그
      });
    }
  
    // 공개 덱에서 현재 오픈 카드 제거
    const updatedDeck = [...gameData.gameData.publicDeck];
    updatedDeck.pop();
  
    // 게임 데이터 업데이트
    const updatedGameData = {
      ...gameData,
      gameData: {
        ...gameData.gameData,
        publicDeck: updatedDeck,
        userTableCards: {
          ...gameData.gameData.userTableCards,
          [loser]: updatedTableCards
        }
      }
    };
  
    setGameData(updatedGameData);
  
    // 왕 카드 패널티 이벤트 서버로 전송
    await sendMessage({
      type: "KING_PENALTY",
      data: {
        loser,
        openCard
      }
    });
  
    // 오픈 카드도 왕 카드라면 재귀적으로 패널티 적용
    if (openCard.royal) {
      await handleKingCardPenalty(updatedGameData, setGameData, loser, sendMessage);
    }
  };
  
  export default handleKingCardPenalty;