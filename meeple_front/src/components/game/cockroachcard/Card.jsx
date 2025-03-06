import React from "react";

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

  if (type?.startsWith("King")) {
    const baseName = type.replace("King", "");
    return `${nameMap[baseName]}:킹`;
  }

  return nameMap[type] || type;
};

const Card = ({
  type = null,
  isBack = false,
  isRoyal = false,
  onClick,
  selectedCard,
  isActive = false,
  cardId,
}) => {
  if (isBack || !type) {
    return (
      <div
        className="flex-shrink-0 w-16 h-24 rounded-lg relative group cursor-pointer overflow-hidden 
           shadow-[0_0_0_1px_rgba(255,255,255,0.3)] hover:shadow-[0_0_0_2px_rgba(255,255,255,0.5)]
           transition-shadow duration-200"
      >
        <img
          src="/src/assets/image/cockroachpoker/CardBack.svg"
          alt="Card Back"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (type === "Joker" || type === "Black") {
    const cardImageType = type === "Joker" ? "JockerCard" : "BlackCard";
    return (
      <div
        data-card-id={cardId} // data-card-id 추가
        onClick={(e) => onClick?.({ type, cardId }, e)}
        className={`flex-shrink-0 w-16 h-24 rounded-lg relative group cursor-pointer overflow-hidden
          ${selectedCard?.cardId === cardId ? "ring-2 ring-blue-500" : ""} 
          ${isActive ? "ring-2 ring-green-500" : ""}`}
      >
        <img
          src={`/src/assets/image/cockroachpoker/${cardImageType}.svg`}
          alt={type}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100">
          <span className="text-sm text-white">{getKoreanName(type)}</span>
        </div>
      </div>
    );
  }

  const cardImageType = isRoyal ? `King${type}Card` : `${type}Card`;
  const displayName = isRoyal ? `King${type}` : type;

  return (
    <div
      data-card-id={cardId}
      onClick={(e) => onClick?.({ type, isRoyal, cardId }, e)}
      className={`
          flex-shrink-0 w-16 h-24 rounded-lg relative group cursor-pointer overflow-hidden
          ${selectedCard?.cardId === cardId ? "ring-2 ring-blue-500" : ""}
          ${isActive ? "shadow-lg shadow-blue-500/50" : ""}
        `}
    >
      <img
        src={`/src/assets/image/cockroachpoker/${cardImageType}.svg`}
        alt={displayName}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100">
        <span className="text-sm text-white">{getKoreanName(displayName)}</span>
      </div>
    </div>
  );
};

export default Card;
