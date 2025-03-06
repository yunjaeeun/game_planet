import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const QuestBuyLand = ({ setIsBuyLand, onClose, cardId, cardInfo }) => {
  const [flippedCards, setFlippedCards] = useState({});
  const [cardInfoma, setCardInfoma] = useState(null);

  useEffect(() => {
    setCardInfoma(cardId);
  }, [cardInfo]);

  const handleYes = () => {
    setIsBuyLand(true);
    onClose();
  };

  const handleNo = () => {
    setIsBuyLand(false);
    onClose();
  };

  const handleFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  return (
    <>
      {cardInfo && (
        <>
          <motion.div
            key={cardInfo.id}
            className="relative bg-white w-96 h-80 p-4"
          >
            <motion.div
              className="relative w-full h-full cursor-pointer"
              animate={{ rotateY: flippedCards[cardInfo.id] ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => handleFlip(cardInfo.id)}
            >
              {/* 앞면 */}
              <motion.div
                className="absolute w-full h-full bg-gradient-to-br rounded-xl p-6 flex flex-col items-center justify-center shadow-xl"
                style={{ backfaceVisibility: "hidden" }}
              >
                <h2 className="text-lg font-bold">{cardInfo.name}</h2>
                <p className="text-gray-700">{cardInfo.description}</p>
                <p className="text-gray-400 mt-8">Click!</p>
              </motion.div>

              {/* 뒷면 */}
              <motion.div
                className="absolute w-full h-full bg-gradient-to-br bg-[${cardInfo.color}] rounded-xl p-6 flex flex-col gap-4 items-center justify-center shadow-xl"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className={`bg-[${cardInfo.color}] p-3 rounded`}>
                  <div className="mt-3">
                    <p>땅 매입 비용: {cardInfo.seedCount}</p>
                    <p>기지 건설 비용: {cardInfo.baseConstructionCost} 마불</p>
                    <p>본부 사용료: {cardInfo.headquartersUsageFee} 마불</p>
                    <p>기지 사용료: {cardInfo.baseUsageFee} 마불</p>
                  </div>
                </div>
                <div className="mt-2 w-full">
                  <p className="pb-2">땅을 구매하시겠습니까?</p>
                  <div className="flex justify-around mt-2">
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                      onClick={handleNo}
                    >
                      안 살래요
                    </button>
                    <button
                      className="bg-indigo-700 bg-opacity-85 border-2 border-transparent text-white px-4 py-2 rounded hover:border-2 hover:border-indigo-700"
                      onClick={handleYes}
                    >
                      살래요
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default QuestBuyLand;
