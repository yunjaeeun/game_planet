import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const SeedCard = ({ cardList, onClose }) => {
  const [flippedCards, setFlippedCards] = useState({});
  const containerRef = useRef(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // 컴포넌트가 마운트되었을 때만 Portal 사용
  }, []);

  const [cards, setCards] = useState(cardList);

  useEffect(() => {
    setCards(cardList);
  }, [cardList]);

  const handleFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      {/* 닫기 버튼 (모달 닫기) */}
      <button
        className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-50"
        onClick={onClose}
      >
        <X size={24} />
      </button>

      {/* 카드 리스트 컨테이너 (가로 스크롤 가능) */}
      <motion.div
        ref={containerRef}
        className="flex gap-4 p-6 overflow-x-auto scrollbar-hide w-[80vw] max-w-4xl"
        // drag="x"
        // dragConstraints={{ left: 0, right: 0 }}
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className="relative w-48 h-72 perspective-1000 flex-shrink-0"
          >
            {/* 카드 회전 애니메이션 */}
            <motion.div
              className="relative w-full h-full cursor-pointer"
              animate={{ rotateY: flippedCards[card.id] ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => handleFlip(card.id)}
            >
              {/* 앞면 */}
              <motion.div
                className="absolute w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl p-6 flex flex-col items-center justify-center shadow-xl"
                style={{ backfaceVisibility: "hidden" }}
              >
                <h2 className="text-xl font-bold text-white text-center mb-2">
                  {card.name}
                </h2>
                <p className="text-white text-center text-sm">
                  (클릭하여 뒤집어보세요)
                </p>
              </motion.div>

              {/* 뒷면 */}
              <motion.div
                className="absolute w-full h-full bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl p-6 flex flex-col gap-4 items-center justify-center shadow-xl"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="text-white text-center">
                  <h3 className="font-bold mb-2">건설 비용</h3>
                  <p className="text-2xl font-bold">
                    {card.baseConstructionCost} 마불
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
  return isMounted && document.getElementById("modal-root")
    ? ReactDOM.createPortal(modalContent, document.getElementById("modal-root"))
    : null;
};

export default SeedCard;
