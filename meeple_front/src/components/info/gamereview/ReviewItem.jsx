import React from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewItem = ({
  gameReviewId,
  gameReviewStar, 
  gameReviewContent,
  gameInfoId,
  user,
  isAuthor,
  onEditClick,
  onDeleteClick
}) => {
  console.log(isAuthor)
  return (
    <div className="w-full p-4 border rounded-lg mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          
          {[...Array(5)].map((star, index) => (
            <FaStar
              key={index}
              className={`text-xl ${
                index < gameReviewStar 
                  ? 'text-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">
            작성자: {user.userNickname}
          </span>
          {isAuthor && (
            <div className="flex gap-2">
              <button
                onClick={onEditClick}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                수정
              </button>
              <button
                onClick={onDeleteClick}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700
                         focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="text-gray-700 whitespace-pre-wrap">
        {gameReviewContent}
      </div>
    </div>
  );
};


export default ReviewItem;
