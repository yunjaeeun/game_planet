import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SungHyun from "../../../assets/images/pixel_character/pixel-sunghyun.png"
import Earth from "../../../assets/burumabul_images/earth.png"

const CustomDetail = () => {
 const { customId } = useParams();
 const location = useLocation();

 const gameInfo = location.state?.gameInfo;
 const customGame = location.state?.customGame;

 // 백엔드 연결시 테스트코드 삭제
 const testCustomGame = {
    tiles: {
      0: { image: SungHyun },  
      1: { image: Earth },
    }
  };
 
 const getIndex = (position) => {
    // 하단 줄 
    if (position >= 0 && position <= 10) {
      return 10 - position; 
    }
    // 왼쪽 줄 
    else if (position >= 11 && position <= 19) {
      return position 
    }
    // 상단 줄 
    else if (position >= 20 && position <= 30) {
      return position;
    }
    // 오른쪽 줄 (31-39): 위에서 아래로
    else {
      return position; 
    }
  };

  const renderTile = (position) => {
    const index = getIndex(position);
    return (
      <div 
        key={position} 
        className={`
          w-24 h-24 border border-slate-600
          ${testCustomGame?.tiles?.[index]?.image 
            ? 'bg-slate-800' 
            : 'bg-slate-700/30'
          }
          group cursor-pointer
        `}
      >
        {testCustomGame?.tiles?.[index]?.image && (
          <div className="relative w-full h-full">
            <img 
              src={testCustomGame.tiles[index].image}
              alt={`타일 ${index}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 bottom-full left-1/2 -translate-x-1/2 mb-2">
              <div className="w-48 h-48 bg-slate-800 rounded-lg p-2 shadow-xl">
                <img 
                  src={testCustomGame.tiles[index].image}
                  alt={`타일 ${index} 확대`}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            </div>
          </div>
        )}
        {!testCustomGame?.tiles?.[index]?.image && (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            {index}
          </div>
        )}
      </div>
    );
  };


 return (
   <div className="min-h-screen bg-slate-900 p-8">
     <h1 className="text-3xl font-bold text-cyan-400 mb-8 text-center">커스텀 게임 미리보기</h1>
     
     <div className="max-w-[1200px] mx-auto">
  <div className="relative bg-slate-800/50 rounded-2xl p-8">
    {/* 상단 줄 */}
    <div className="flex justify-center">
      <div className="flex -space-x-[1px]">  {/* 간격 제거 */}
        {Array.from({ length: 11 }, (_, i) => renderTile(20 + i))}
      </div>
    </div>
    
    {/* 중간 섹션 */}
    <div className="flex justify-between -mt-[1px]">  {/* 상단과 간격 제거 */}
      {/* 왼쪽 열 */}
      <div className="flex flex-col -space-y-[1px]">  {/* 세로 간격 제거 */}
        {Array.from({ length: 9 }, (_, i) => renderTile(19 - i))}
      </div>
      
      {/* 중앙 영역 */}
      <div className="flex-1 flex items-center justify-center p-12">
        {/* ... 중앙 내용 ... */}
      </div>
      
      {/* 오른쪽 열 */}
      <div className="flex flex-col -space-y-[1px]">  {/* 세로 간격 제거 */}
        {Array.from({ length: 9 }, (_, i) => renderTile(31 + i))}
      </div>
    </div>
    
    {/* 하단 줄 */}
    <div className="flex justify-center -mt-[1px]">  {/* 상단과 간격 제거 */}
      <div className="flex -space-x-[1px]">  {/* 간격 제거 */}
        {Array.from({ length: 11 }, (_, i) => renderTile(i))}
      </div>
    </div>

         {/* 장식용 별들 */}
         <div className="absolute inset-0 pointer-events-none">
           {Array.from({ length: 20 }).map((_, i) => (
             <div
               key={i}
               className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
                 animationDelay: `${Math.random() * 2}s`,
                 opacity: Math.random() * 0.5 + 0.25
               }}
             />
           ))}
         </div>
       </div>
     </div>
   </div>
 );
};

export default CustomDetail;