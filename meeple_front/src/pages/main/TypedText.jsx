import React, { useState, useEffect, useRef } from "react"

export const TypedText = ({ text, delay = 0, className = "", style = {}, onComplete }) => {
  // 현재 표시되는 텍스트를 관리하는 상태
  const [displayText, setDisplayText] = useState("");
  // 타이핑 진행 중 여부를 관리하는 상태
  const [isTyping, setIsTyping] = useState(false);
  // 타이핑이 완료되었는지 여부를 관리하는 상태
  const [isCompleted, setIsCompleted] = useState(false);
  // 완료 콜백이 이미 실행되었는지 추적하는 ref
  const hasCompletedRef = useRef(false);

  // 지정된 딜레이 후에 타이핑 시작
  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
    }, delay * 1000);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  // 타이핑 효과를 구현하는 부분
  useEffect(() => {
    if (!isTyping || isCompleted) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        
        if (currentIndex === text.length && !hasCompletedRef.current) {
          hasCompletedRef.current = true;
          setIsCompleted(true);
          onComplete?.();
        }
        
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 190); // 타이핑 속도 (150ms)

    return () => clearInterval(interval);
  }, [text, isTyping, onComplete, isCompleted]);

  // 컴포넌트가 리렌더링되어도 완료된 상태 유지
  useEffect(() => {
    if (isCompleted) {
      setDisplayText(text);
    }
  }, [isCompleted, text]);

  return (
    <span className={className} style={{
      ...style,
      // 타이핑 중일 때만 커서 표시
      borderRight: isTyping && !isCompleted ? '2px solid white' : 'none',
      whiteSpace: 'pre'
    }}>
      {displayText}
    </span>
  );
};