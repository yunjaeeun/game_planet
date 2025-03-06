import React from 'react';
import { X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const CustomTutorial = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameInfo = location.state?.gameInfo;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-800 rounded-lg w-[600px] p-8 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">부루마불 커스터마이징</h2>

        <div className="space-y-6 mb-8">
          <div className="bg-slate-700/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">타일 커스터마이징</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• 각 칸의 이름과 이미지를 변경할 수 있습니다</li>
              <li>• 상단 색상과 가격(최대 60만마불)을 설정할 수 있습니다</li>
            </ul>
          </div>

          <div className="bg-slate-700/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">씨앗은행카드 커스터마이징</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• 이름과 땅 가격 수정시 타일의 이름과 땅 가격도 변경 됩니다.</li>
              <li>• 기지 건설비(최대 30), 우주본부(최대 40), 우주기지(최대 100) 가격을 설정할 수 있습니다</li>
            </ul>
          </div>

          <div className="bg-slate-700/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">특수 카드 커스터마이징</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• 텔레파시카드와 뉴런의골짜기카드의 제목과 내용을 설정할 수 있습니다</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button 
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-semibold"
            onClick={() => {
              navigate(`/game-info/${gameInfo.gameInfoId}/custom/editor`, { state: { gameInfo } });
              onClose();
            }}
          >
            커스터마이징 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTutorial;