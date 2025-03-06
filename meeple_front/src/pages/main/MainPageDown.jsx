import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModalOpen } from "../../sources/store/slices/UserSlice";
import { useNavigate } from "react-router-dom";
import mainBackground from "../../assets/images/mainBackground.gif";
import cursorImage from "../../assets/images/cursor.png";
import Card from "../../assets/images/card.png";
import Card2 from "../../assets/images/card2.png";

export const MainPageDown = ({ isFirstSection, onRegisterClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const [showContent, setShowContent] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const prevTokenRef = useRef(token);
  const prevSectionRef = useRef(isFirstSection);

  useEffect(() => {
    const tokenChanged = prevTokenRef.current !== token && token !== null;
    const sectionChanged = prevSectionRef.current !== isFirstSection;

    if (tokenChanged) {
      window.location.reload();
      return;
    }

    // 상태 업데이트
    prevTokenRef.current = token;
    prevSectionRef.current = isFirstSection;

    // 첫 번째 섹션이면 항상 애니메이션 초기화
    if (isFirstSection) {
      setShowContent(false);
      setShowButtons(false);
      return;
    }

    // 토큰이 변경되었거나 섹션이 변경되었을 때만 애니메이션 재시작
    if (tokenChanged || sectionChanged) {
      // 즉시 초기화
      setShowContent(false);
      setShowButtons(false);

      // 약간의 지연 후 애니메이션 시작
      const textTimer = setTimeout(() => {
        setShowContent(true);
      }, 300);

      const buttonTimer = setTimeout(() => {
        setShowButtons(true);
      }, 600);

      return () => {
        clearTimeout(textTimer);
        clearTimeout(buttonTimer);
      };
    }
  }, [isFirstSection, token]);

  const neonTextStyle = {
    textShadow: `
      0 4px 12px rgba(21, 255, 0, 0.6),
      0 8px 24px rgba(0, 255, 47, 0.4)
    `,
  };

  const purpleNeonStyle = {
    textShadow: `
      0 4px 12px rgba(255, 0, 255, 0.6),
      0 8px 24px rgba(255, 0, 255, 0.4)
    `,
  };

  const redNeonStyle = {
    textShadow: `
      0 4px 12px rgba(255, 0, 38, 0.6),
      0 8px 24px rgba(255, 0, 60, 0.4)
    `,
  };

  return (
    <div
      className={`fixed inset-0 w-full h-full transition-transform duration-1000 ease-in-out flex flex-col items-center justify-center`}
      style={{
        backgroundImage: `url(${mainBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: `translateY(${isFirstSection ? "100%" : "0"})`,
      }}
    >
      {!token && (
        <div className="absolute inset-0 backdrop-blur-sm bg-black/30" />
      )}

      <div className="relative z-10 w-full max-w-7xl px-8">
        {!token ? (
          <div className="flex flex-col items-center">
            <div
              className={`text-[70px] mb-16 text-white transition-all duration-1000
                ${
                  showContent
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              style={purpleNeonStyle}
            >
              READY TO DIVE IN?
            </div>
            <div
              className={`flex justify-center gap-6 transition-all duration-1000 
              ${
                showButtons
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <button
                onClick={() => dispatch(setModalOpen(true))}
                className="group relative w-44 px-8 py-4 text-white text-2xl font-semibold rounded-md 
                bg-[#FFE4CB] bg-opacity-30 backdrop-blur-sm
                hover:bg-opacity-50
                transition-all duration-300
                shadow-lg hover:shadow-[#FFE4CB]/30"
              >
                <span className="relative z-10">LOGIN</span>
              </button>
              <button
                onClick={onRegisterClick}
                className="group relative w-44 px-8 py-4 text-white text-2xl font-semibold rounded-md 
                bg-[#FFE4CB] bg-opacity-30 backdrop-blur-sm
                hover:bg-opacity-50
                transition-all duration-300
                shadow-lg hover:shadow-[#FFE4CB]/30"
              >
                <span className="relative z-10">SIGNUP</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div
              className={`flex flex-col items-start relative transition-all duration-1000 
              ${
                showContent
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-20"
              }`}
            >
              <img
                src={Card}
                alt="card"
                className={`absolute left-[0px] top-5 w-[110px] h-auto transition-all duration-1000 ease-bounce
                  ${
                    showContent
                      ? "opacity-100 translate-y-0 rotate-12"
                      : "opacity-0 -translate-y-full rotate-0"
                  }`}
                style={{ transitionDelay: "300ms" }}
              />
              <img
                src={Card2}
                alt="card"
                className={`absolute right-[400px] top-[180px] w-[110px] h-auto transition-all duration-1000 ease-bounce
                  ${
                    showContent
                      ? "opacity-100 translate-y-0 rotate-[150deg]"
                      : "opacity-0 -translate-y-full rotate-0"
                  }`}
                style={{ transitionDelay: "600ms" }}
              />
              <img
                src={Card2}
                alt="card"
                className={`absolute -left-5 bottom-3 w-[110px] h-auto transition-all duration-1000 ease-bounce
                  ${
                    showContent
                      ? "opacity-100 translate-y-0 rotate-[43deg]"
                      : "opacity-0 -translate-y-full rotate-0"
                  }`}
                style={{ transitionDelay: "900ms" }}
              />
              <img
                src={Card}
                alt="card"
                className={`absolute right-[450px] mt-[450px] w-[110px] h-auto transition-all duration-1000 ease-bounce
                  ${
                    showContent
                      ? "opacity-100 translate-y-0 rotate-[150deg]"
                      : "opacity-0 -translate-y-full rotate-0"
                  }`}
                style={{ transitionDelay: "1200ms" }}
              />
              <div
                className={`mt-10 text-[110px] text-white relative z-10 transition-all duration-1000
                  ${
                    showContent
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-20"
                  }`}
                style={neonTextStyle}
              >
                WELCOME TO THE
              </div>
              <div
                className={`text-[110px] text-white relative z-10 transition-all duration-1000
                  ${
                    showContent
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-20"
                  }`}
                style={{ ...neonTextStyle, transitionDelay: "300ms" }}
              >
                GAME PLANET
                <img
                  src={cursorImage}
                  alt="cursor"
                  className="inline-block ml-5 w-[120px] h-[120px] mt-10"
                />
              </div>
              <div
                className={`mt-[60px] text-[80px] text-white relative z-10 transition-all duration-1000
                  ${
                    showContent
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-20"
                  }`}
                style={{ ...purpleNeonStyle, transitionDelay: "600ms" }}
              >
                ENJOY MEEPLE !
              </div>
            </div>

            <button
              onClick={() => navigate("/home")}
              className={`group relative w-52 px-8 py-6 text-5xl font-bold text-white 
                        bg-gradient-to-r from-red-600/80 to-pink-600/80
                        rounded-xl overflow-hidden
                        transition-all duration-1000
                        hover:scale-105
                        mr-40 mt-20
                        ${
                          showButtons
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-20"
                        }`}
              style={{
                boxShadow: `
                  0 0 20px rgba(255, 0, 0, 0.5),
                  0 0 40px rgba(255, 0, 0, 0.3),
                  inset 0 0 20px rgba(255, 255, 255, 0.2)
                `,
              }}
            >
              <span
                className="relative z-10 flex items-center justify-center"
                style={redNeonStyle}
              >
                START
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
