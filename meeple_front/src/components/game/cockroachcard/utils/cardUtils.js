// cardUtils.js
export const ANIMAL_ORDER = [
  "Bat", "Rat", "Fly", "Cockroach", "Scorpion", "Toad", "Stinkbug", "Joker", "Black"
 ];
 
 export const getSelectableAnimals = () => {
  return ANIMAL_ORDER.slice(0, -2); // Joker, Black 제외
 };
 
 export const sortCards = (cards) => {
  if (!cards) return [];
  
  return [...cards].filter(card => card && card.type).sort((a, b) => {
    // type이 있는지 한번 더 체크
    if (!a?.type || !b?.type) return 0;
    
    const typeA = a.type.replace("King", "");
    const typeB = b.type.replace("King", "");
    
    if (typeA === typeB) return a.type.includes("King") ? 1 : -1;
    return ANIMAL_ORDER.indexOf(typeA) - ANIMAL_ORDER.indexOf(typeB);
  });
};

export const sortPenaltyGroups = (groups) => {
  if (!groups) return [];
  
  return Object.values(groups).filter(group => group && group.type).sort((a, b) => {
    if (!a?.type || !b?.type) return 0;
    
    const typeA = a.type.replace("King", "");
    const typeB = b.type.replace("King", "");
    return ANIMAL_ORDER.indexOf(typeA) - ANIMAL_ORDER.indexOf(typeB);
  });
};
 
 export const getKoreanName = (type) => {
  const nameMap = {
    Bat: "박쥐", Rat: "쥐", Fly: "파리", 
    Cockroach: "바퀴벌레", Scorpion: "전갈",
    Toad: "두꺼비", Stinkbug: "노린재",
    Joker: "조커", Black: "블랙"
  };
  
  if (type.startsWith("King")) {
    return `${nameMap[type.replace("King", "")]}:킹`;
  }
  return nameMap[type] || type;
 };
 
 export const getCardInfo = (card, showFront = false) => {
  if (!card) return null;
  if (typeof card === 'object' && 'type' in card) {
    return { type: card.type, isBack: !showFront, isRoyal: card.royal };
  }
  const isKingCard = card.startsWith('King');
  const baseType = isKingCard ? card.replace('King', '') : card;
  return { type: baseType, isBack: !showFront, isRoyal: isKingCard };
 };
 
 export const normalizeCardData = (card) => {
  if (!card) return null;
  
  // type이 'King'으로 시작하면 royal을 true로 설정
  const isKingCard = card.type?.startsWith('King');
  const cardType = isKingCard ? card.type.substring(4) : card.type;
  
  return {
    type: cardType,
    royal: isKingCard || card.royal || card.isRoyal,
    isRoyal: isKingCard || card.royal || card.isRoyal,
    cardId: card.cardId  // cardId 추가
  };
};