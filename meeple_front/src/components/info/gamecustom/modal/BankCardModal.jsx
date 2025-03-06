import React, { useState } from 'react';
import { X } from 'lucide-react';

const BankCardModal = ({ onClose, cardId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [landPrice, setLandPrice] = useState('');
  const [baseBuildPrice, setBaseBuildPrice] = useState('');
  const [hqPrice, setHqPrice] = useState('');
  const [basePrice, setBasePrice] = useState('');

  // 각 가격의 제한을 체크하는 함수
  const handlePriceChange = (value, setter, maxLimit) => {
    const numberValue = Math.min(maxLimit, parseInt(value) || 0);
    setter(numberValue);
  };

  return (
    <div className="bg-slate-800 rounded-lg w-[500px] p-6 relative">
      <button 
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-white"
      >
        <X size={24} />
      </button>
      
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">씨앗은행카드 {cardId} 커스터마이징</h2>

      <div className="space-y-6">
        <div className="bg-slate-700/50 p-4 rounded-lg">
          <label className="block text-white mb-2">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-slate-600 text-white rounded border border-slate-500 focus:border-cyan-400 outline-none"
            placeholder="카드 이름"
          />
        </div>

        <div className="bg-slate-700/50 p-4 rounded-lg">
          <label className="block text-white mb-2">설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-3 bg-slate-600 text-white rounded border border-slate-500 focus:border-cyan-400 outline-none resize-none"
            placeholder="카드 설명"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <label className="block text-white mb-2">땅 가격</label>
            <input
              type="number"
              value={landPrice}
              onChange={(e) => handlePriceChange(e.target.value, setLandPrice, 60)}
              min="0"
              max="60"
              className="w-full p-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-cyan-400 outline-none
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="최대 60"
            />
          </div>

          <div className="bg-slate-700/50 p-4 rounded-lg">
            <label className="block text-white mb-2">기지 건설비</label>
            <input
              type="number"
              value={baseBuildPrice}
              onChange={(e) => handlePriceChange(e.target.value, setBaseBuildPrice, 30)}
              min="0"
              max="30"
              className="w-full p-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-cyan-400 outline-none
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="최대 30"
            />
          </div>

          <div className="bg-slate-700/50 p-4 rounded-lg">
            <label className="block text-white mb-2">우주본부 가격</label>
            <input
              type="number"
              value={hqPrice}
              onChange={(e) => handlePriceChange(e.target.value, setHqPrice, 40)}
              min="0"
              max="40"
              className="w-full p-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-cyan-400 outline-none
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="최대 40"
            />
          </div>

          <div className="bg-slate-700/50 p-4 rounded-lg">
            <label className="block text-white mb-2">우주기지 가격</label>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => handlePriceChange(e.target.value, setBasePrice, 100)}
              min="0"
              max="100"
              className="w-full p-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-cyan-400 outline-none
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="최대 100"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankCardModal;