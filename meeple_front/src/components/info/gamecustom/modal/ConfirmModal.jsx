import React from 'react';
import { X } from 'lucide-react';

const ConfirmModal = ({ onClose, onConfirm }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-800 rounded-lg w-[400px] p-6 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-cyan-400">커스터마이징 완료</h2>
          <p className="text-white">모든 설정을 완료하시겠습니까?</p>
          <p className="text-gray-400 text-sm">완료 후에는 수정이 불가능합니다.</p>
          
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors"
            >
              완료
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;