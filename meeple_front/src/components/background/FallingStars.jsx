import React, { useEffect } from "react";

const FallingStars = () => {
  useEffect(() => {
    let interval;

    const createStar = () => {
      const star = document.createElement("div");
      star.className = "star";

      const startingX = Math.random() * window.innerWidth;
      star.style.left = `${startingX}px`;
      star.style.top = "-2px";

      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      const duration = Math.random() * 4 + 2;
      star.style.animation = `falling-stars ${duration}s linear`;

      document.body.appendChild(star);

      star.addEventListener("animationend", () => {
        star.remove();
      });
    };

    // 페이지 가시성 변경 감지 핸들러
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 탭이 백그라운드로 갔을 때
        clearInterval(interval);
        // 기존 별들 제거
        const stars = document.querySelectorAll(".star");
        stars.forEach((star) => star.remove());
      } else {
        // 탭이 다시 활성화되었을 때
        interval = setInterval(createStar, 200);
      }
    };

    // 초기 interval 설정
    interval = setInterval(createStar, 200);

    // 가시성 변경 이벤트 리스너 등록
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      const stars = document.querySelectorAll(".star");
      stars.forEach((star) => star.remove());
    };
  }, []);

  return null;
};

export default FallingStars;
