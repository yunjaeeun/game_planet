import React from "react"
import { TypedText } from "./TypedText"
import mainBackground from '../../assets/images/mainBackground.gif'

export const MainPageUp = ({ isFirstSection, showScrollDown, onLastTextComplete }) => {
  return (
    <div 
      className={`fixed inset-0 w-full h-full transition-transform duration-1000 ease-in-out`}
      style={{ 
        backgroundImage: `url(${mainBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: `translateY(${isFirstSection ? '0' : '-100%'})` // 섹션 전환 애니메이션
      }}
    >
      <div className="h-full flex flex-col justify-between">
        {/* 타이핑 효과 텍스트 영역 */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            {/* 첫 번째 텍스트 라인 */}
            <div 
              className="mt-[80px] text-white text-[130px] mr-[300px]"
              style={{ 
                textShadow: '0 4px 12px rgba(0, 255, 255, 0.6), 0 8px 24px rgba(0, 255, 255, 0.4)'
              }}
            >
              <TypedText text="ARE " delay={0} />
              <TypedText text="YOU " delay={0.8} className="ml-7" />
              <TypedText text="BORING?" delay={1.6} className="ml-7" />
            </div>
            {/* 두 번째 텍스트 라인 */}
            <div 
              className="mt-[60px] text-white text-[130px] ml-[300px]"
              style={{ 
                textShadow: '0 4px 12px rgba(255, 0, 255, 0.6), 0 8px 24px rgba(255, 0, 255, 0.4)'
              }}
            >
              <TypedText text="WANT " delay={2.4} className="ml-14"/>
              <TypedText text="SOME " delay={3.2} className="ml-7" />
              <TypedText 
                text="FUN?" 
                delay={4.0} 
                className="ml-7" 
                onComplete={onLastTextComplete}
              />
            </div>
          </div>
        </div>

        {/* 스크롤 다운 영역 */}
        <div className="relative">
          {/* 그라데이션 오버레이: 아래쪽으로 검은색 그라데이션 효과 */}
          <div 
            className={`absolute bottom-0 left-0 w-full h-96 transition-opacity duration-500 ${
              showScrollDown ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
              transform: 'translateY(50%)'
            }}
          />
          
          {/* 스크롤 다운 텍스트와 애니메이션 화살표 */}
          <div 
            className={`relative z-10 text-white text-center mb-16 transition-opacity duration-500 ${
              showScrollDown ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {showScrollDown && (
              <>
                <div className="text-[25px] mb-4">Scroll down</div>
                <div className="h-8">
                  <div className="animate-bounce">
                    <span className="text-3xl block">﹀</span>
                    <span className="text-3xl block -mt-7">﹀</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};