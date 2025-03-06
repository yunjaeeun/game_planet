import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import LoginModal from "../../components/user/LoginModal";
import RegisterModal from "../../components/user/RegisterModal";

import { MainPageUp } from "./MainPageUp";
import { MainPageDown } from "./MainPageDown";

const MainPage = () => {
  // 현재 보여지는 섹션 상태 (첫 번째/두 번째)
  const [isFirstSection, setIsFirstSection] = useState(true);
  // 스크롤 애니메이션 진행 중 여부
  const [isScrolling, setIsScrolling] = useState(false);
  // 스크롤 다운 인디케이터 표시 여부
  const [showScrollDown, setShowScrollDown] = useState(false);
  // 회원가입 모달 표시 여부 상태
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  // 스크롤 다운 타이머 참조
  const scrollDownTimeoutRef = useRef(null);

  // 토큰 상태 구독
  const { token } = useSelector((state) => state.user);

  // 토큰 변경 감지 시 자동으로 두 번째 섹션으로 이동
  useEffect(() => {
    if (token) {
      setIsFirstSection(false);
    }
  }, [token]);

  useEffect(() => {
    const handleWheel = (e) => {
      // 스크롤 애니메이션 중복 방지
      if (isScrolling) return;

      setIsScrolling(true);
      // 스크롤 방향에 따라 섹션 전환
      if (e.deltaY > 0 && isFirstSection) {
        setIsFirstSection(false);
      } else if (e.deltaY < 0 && !isFirstSection) {
        setIsFirstSection(true);
      }

      // 스크롤 잠금 해제 타이머
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (scrollDownTimeoutRef.current) {
        clearTimeout(scrollDownTimeoutRef.current);
      }
    };
  }, [isFirstSection, isScrolling]);

  const handleLastTextComplete = () => {
    scrollDownTimeoutRef.current = setTimeout(() => {
      setShowScrollDown(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Meeple</h1>
        </div>
      </header>

      <div className="h-screen overflow-hidden">
        <MainPageUp
          isFirstSection={isFirstSection}
          showScrollDown={showScrollDown}
          onLastTextComplete={handleLastTextComplete}
        />

        <MainPageDown
          isFirstSection={isFirstSection}
          onRegisterClick={() => setIsRegisterModalOpen(true)}
        />

        <LoginModal />
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default MainPage;