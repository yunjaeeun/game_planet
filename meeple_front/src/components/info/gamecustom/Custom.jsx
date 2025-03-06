import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Gamepad2, Plus } from 'lucide-react';
import buruMabulImage from '../../../assets/images/games/MainImage/BuruMabul.png';
import CustomTutorial from './modal/TutorialModal';


const Custom = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [customGames, setCustomGames] = useState([
      {
          id: 1,
          title: "나만의 부루마불",
          createdAt: "2024-02-11",
          thumbnail: buruMabulImage
        }
    ]);
    
    const navigate = useNavigate();
    const location = useLocation();
    const gameInfo = location.state?.gameInfo;
  return (
    <div className="min-h-screen p-8 bg-slate-900 opacity-90">
      <div className="mb-12 text-center relative">
        <h1 className="text-5xl font-bold text-cyan-400 mb-4 tracking-wide">나만의 커스텀 게임</h1>
        <p className="text-gray-300 text-lg tracking-wider">당신만의 특별한 보드게임을 만들어보세요!</p>
        {customGames.length === 0 ? (
          <button 
            className="flex items-center gap-2 px-8 py-4 bg-purple-500 animate-pulse hover:bg-purple-600 text-white rounded-lg transition-colors mb-8 text-lg"
            onClick={() => setShowTutorial(true)}
          >
            <Gamepad2 size={24} />
            게임 제작 가이드
          </button>
        ) : (
          <button 
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors mb-8"
            onClick={() => setShowTutorial(true)}
          >
            <Gamepad2 size={20} />
            게임 제작 가이드
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customGames.map((game) => (
          <div 
            key={game.id}
            className="bg-slate-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform cursor-pointer"
            onClick={() => navigate(`/game-info/${gameInfo.gameInfoId}/custom/detail/${game.id}`, {
              state: { 
                gameInfo,
                customGame: game 
              }
            })}
          >
            <img 
              src={game.thumbnail} 
              alt={game.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-2">{game.title}</h3>
              <p className="text-gray-400">제작일: {game.createdAt}</p>
            </div>
          </div>
        ))}

        <div 
        onClick={() => navigate(`/game-info/${gameInfo.gameInfoId}/custom/editor`, { 
            state: { gameInfo } })}
          className="bg-slate-800 rounded-lg overflow-hidden border-2 border-dashed border-cyan-500 flex items-center justify-center h-64 cursor-pointer hover:bg-slate-700 transition-colors"
        >
          <div className="text-center">
          <Plus size={40} className="text-cyan-500 mx-auto mb-2" />
            <p className="text-cyan-500 text-lg">새로운 게임 만들기</p>
          </div>
        </div>
      </div>

      {customGames.length === 0 && (
        <div className="text-center py-13">
          <Gamepad2 size={60} className="text-gray-500 mx-auto mb-4" />
          <h2 className="text-3xl font-semibold text-gray-300 mb-2">아직 제작한 게임이 없네요!</h2>
          <p className="text-gray-400 mb-4">당신만의 특별한 게임을 만들어보세요</p>
        </div>
      )}

      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg w-11/12 max-w-6xl h-5/6 p-5">
            <CustomTutorial onClose={() => setShowTutorial(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Custom;