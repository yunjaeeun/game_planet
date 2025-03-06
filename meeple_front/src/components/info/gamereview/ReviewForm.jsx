import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GameInfoAPI } from '../../../sources/api/GameInfoAPI';

const ReviewForm = ({ initialData, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { gameInfoId } = useParams();
  const { token } = useSelector((state) => state.user);
  const userId = token ? JSON.parse(atob(token.split(".")[1])).sub : null;
  
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setRating(initialData.gameReviewStar || 0);
      setContent(initialData.gameReviewContent || '');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      alert('별점을 선택해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    const reviewData = {
      gameReviewStar: rating,
      gameReviewContent: content,
      gameInfoId: gameInfoId,
      userId: userId,
    };

    try {
      setIsSubmitting(true);
      
      if (isEditing) {
        const reviewUpdateData={
          gameReviewStar: rating,
          gameReviewContent: content,
        }
        await GameInfoAPI.updateReview(initialData.gameReviewId, reviewData);
        alert('리뷰가 성공적으로 수정되었습니다.');
      } else {
        await GameInfoAPI.createReview(reviewData);
        alert('리뷰가 성공적으로 등록되었습니다.');
        // 새 리뷰 작성 후 폼 초기화
        setRating(0);
        setContent('');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('리뷰 저장 중 오류 발생:', error);
      alert('리뷰 저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 space-y-6"
    >
      <div className="flex justify-center items-center space-x-1">
        {[...Array(5)].map((star, index) => {
          const ratingValue = index + 1;
          
          return (
            <label key={index} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => setRating(ratingValue)}
                className="hidden"
              />
              <FaStar
                className="text-3xl transition-colors duration-200"
                style={{
                  color: ratingValue <= (hover || rating) 
                    ? '#ffc107' 
                    : '#e4e5e9'
                }}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
              />
            </label>
          );
        })}
      </div>
      
      <div className="w-full">
        <textarea
          placeholder="리뷰 내용을 입력해주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          disabled={isSubmitting}
          className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent resize-y
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
      
      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg
                   hover:bg-blue-700 transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? '저장 중...' : isEditing ? '리뷰 수정' : '리뷰 등록'}
      </button>
    </form>
  );
};

export default ReviewForm;