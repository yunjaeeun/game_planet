import { useState } from "react";
import { useNavigate } from "react-router-dom";

//게임 목록에 표시할 게임카드 컴포넌트

function GameCard({ gameInfoId, imgUrl, title, description }) {
  const [isHovered, setIsHovered] = useState(false);
  const nav=useNavigate()

  return (
    <div
      className="relative w-72 h-72 rounded-lg shadow-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 배경 이미지 */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ${
          isHovered ? "opacity-30" : "opacity-100"
        }`}
        style={{ backgroundImage: `url(${imgUrl})` }}
      ></div>

      {/* 호버 시 나타나는 콘텐츠 */}
      {isHovered && (
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          {/* 텍스트 영역 */}
          <div className="text-black">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm">{description}</p>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-center gap-2">
            <button onClick={()=>nav(`../game-info/${gameInfoId}`)}className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors">
              INFO
            </button>
            <button onClick={()=>nav(``)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors">
              PLAY
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameCard;
