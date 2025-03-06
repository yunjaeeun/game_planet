import React, { useState, useEffect } from "react";
import Card from "../Card";

const PenaltyCardStack = ({ type, count = 3, isRoyal, isNew = false }) => {
  const [isReceiving, setIsReceiving] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      setIsReceiving(true);
      const timer = setTimeout(() => setIsReceiving(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  return (
    <div
      className={`
      relative w-16 h-24 flex-shrink-0
      transition-all duration-300 ease-in-out
      ${isReceiving ? "scale-110" : "scale-100"}
    `}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`
            absolute border-2 border-gray-300 rounded-lg
            transition-all duration-300 ease-in-out
          `}
          style={{
            top: `${index * 8}px`,
            left: `${index * 4}px`,
            zIndex: index,
            width: "100%",
            height: "100%",
          }}
        >
          <Card type={type} isRoyal={isRoyal} />
        </div>
      ))}
    </div>
  );
};

export default PenaltyCardStack;
