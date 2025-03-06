import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// 아이콘
import { ChevronLeft, ChevronRight } from 'lucide-react';

//모달
import TileModal from './modal/TileModal';
import BankCardModal from './modal/BankCardModal';
import SpecialCardModal from './modal/SpecialCardModal';
import ConfirmModal from './modal/ConfirmModal';


const SlideSection = ({ title, currentIndex, setIndex, totalItems = 30, onCardClick, type }) => {
    const maxIndex = Math.ceil(totalItems / 5) - 1;
   
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
        <div className="bg-slate-800 p-6 rounded-lg relative">
          <div className="flex justify-between items-center">
            <button 
              className="p-2 bg-slate-700 rounded-full hover:bg-slate-600"
              onClick={() => setIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex <= 0}
            >
              <ChevronLeft className="text-white" />
            </button>
            <div className="flex-1 mx-8">
              <div className="grid grid-cols-5 gap-4">
                {Array(5).fill(0).map((_, idx) => (
                  <div 
                    key={idx} 
                    className="h-32 bg-slate-700/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-600/50"
                    onClick={() => onCardClick(currentIndex * 5 + idx + 1, type)}
                  >
                    <p className="text-white">{currentIndex * 5 + idx + 1}</p>
                  </div>
                ))}
              </div>
            </div>
            <button 
              className="p-2 bg-slate-700 rounded-full hover:bg-slate-600"
              onClick={() => setIndex(prev => Math.min(maxIndex, prev + 1))}
              disabled={currentIndex >= maxIndex}
            >
              <ChevronRight className="text-white" />
            </button>
          </div>
        </div>
      </div>
    );
   };
   
   const CustomEditor = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const gameInfo = location.state?.gameInfo;

    const [indices, setIndices] = useState({
      tile: 0,
      bank: 0,
      telepathy: 0,
      neuron: 0
    });
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false)
   
    const handleCardClick = (cardId, type) => {
      setSelectedCard(cardId);
      setModalType(type);
      setShowModal(true);
    };

    const handleComplete = () => {
      setShowConfirm(true);
    };

    const handleConfirm = () => {
      // 완료 처리 로직
      navigate(`/game-info/${gameInfo.gameInfoId}/custom`, { state: { gameInfo } });
    };
   
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8 text-center">게임 커스터마이징</h1>
   
        <SlideSection 
          title="타일 커스터마이징"
          currentIndex={indices.tile}
          setIndex={(newIndex) => setIndices(prev => ({...prev, tile: newIndex}))}
          totalItems={30}
          onCardClick={handleCardClick}
          type="tile"
        />
   
        <SlideSection 
          title="씨앗은행카드 커스터마이징"
          currentIndex={indices.bank}
          setIndex={(newIndex) => setIndices(prev => ({...prev, bank: newIndex}))}
          totalItems={30}
          onCardClick={handleCardClick}
          type="bank"
        />
   
        <SlideSection 
          title="텔레파시카드 커스터마이징"
          currentIndex={indices.telepathy}
          setIndex={(newIndex) => setIndices(prev => ({...prev, telepathy: newIndex}))}
          totalItems={10}
          onCardClick={handleCardClick}
          type="telepathy"
        />
   
        <SlideSection 
          title="뉴런의골짜기카드 커스터마이징"
          currentIndex={indices.neuron}
          setIndex={(newIndex) => setIndices(prev => ({...prev, neuron: newIndex}))}
          totalItems={10}
          onCardClick={handleCardClick}
          type="neuron"
        />
   
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {modalType === 'tile' && <TileModal onClose={() => setShowModal(false)} cardId={selectedCard} />}
            {modalType === 'bank' && <BankCardModal onClose={() => setShowModal(false)} cardId={selectedCard} />}
            {(modalType === 'telepathy' || modalType === 'neuron') && (
              <SpecialCardModal 
                onClose={() => setShowModal(false)} 
                cardId={selectedCard} 
                type={modalType} 
              />
            )}
          </div>
        )}
   
   <div className="text-center mt-8">
        <button
          onClick={handleComplete}
          className="px-8 py-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-lg font-semibold"
        >
          커스터마이징 완료
        </button>
      </div>

      {showConfirm && (
        <ConfirmModal 
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirm}
        />
      )}
      </div>
    );
   };
   
   export default CustomEditor;