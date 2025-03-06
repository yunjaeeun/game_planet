import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ totalItems, itemsPerPage = 10, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6">
      <nav className="flex gap-2">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 border border-slate-600 rounded-lg text-gray-300 
            ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700'} 
            transition-colors flex items-center gap-1`}
        >
          <ChevronLeft size={16} />
          이전
        </button>
        
        {getPageNumbers().map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-3 py-1 border rounded-lg transition-colors
              ${currentPage === number 
                ? 'border-cyan-500 bg-cyan-500 text-white' 
                : 'border-slate-600 text-gray-300 hover:bg-slate-700'}`}
          >
            {number}
          </button>
        ))}
        
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border border-slate-600 rounded-lg text-gray-300 
            ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700'} 
            transition-colors flex items-center gap-1`}
        >
          다음
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;