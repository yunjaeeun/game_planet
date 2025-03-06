import React, { useState } from 'react';
import { X } from 'lucide-react';

const SpecialCardModal = ({ onClose, cardId, type }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const cardType = type === 'telepathy' ? '텔레파시카드' : '뉴런의골짜기카드';

  return (
    <div className="bg-slate-800 rounded-lg w-[500px] p-6 relative">
      <button 
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-white"
      >
        <X size={24} />
      </button>
      
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">{cardType} {cardId} 커스터마이징</h2>

      <div className="space-y-6">
        <div className="bg-slate-700/50 p-4 rounded-lg">
          <label className="block text-white mb-2">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-slate-600 text-white rounded border border-slate-500 focus:border-cyan-400 outline-none"
            placeholder="카드의 제목을 입력하세요..."
          />
        </div>

        <div className="bg-slate-700/50 p-4 rounded-lg">
          <label className="block text-white mb-2">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="카드의 효과나 벌칙을 입력하세요..."
            className="w-full p-3 bg-slate-600 text-white rounded border border-slate-500 focus:border-cyan-400 outline-none resize-none"
          />
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

export default SpecialCardModal;