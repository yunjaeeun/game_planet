import React, { useState, useEffect } from 'react';
import { GameInfoAPI } from '../../../sources/api/GameInfoAPI';

const CommentForm = ({ initialData, articleId, commentId, userId, onSuccess }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!commentId;

  useEffect(() => {
    if (initialData) {
      setContent(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    const commentData = {
      content,
      gameCommunityId: articleId,
      userId
    };

    try {
      setIsSubmitting(true);

      if (isEditing) {
        await GameInfoAPI.updateComment(commentId, commentData);
      } else {
        await GameInfoAPI.createComment(commentData);
      }

      if (!isEditing) {
        setContent('');
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('댓글 저장 실패:', error);
      alert('댓글 저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="flex-1 p-2 border rounded resize-none h-[100px]
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:border-transparent
                   disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded 
                   hover:bg-blue-600 h-[100px] min-w-[80px]
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200"
        >
          {isSubmitting ? (
            '저장 중...'
          ) : (
            <>
              {isEditing ? '댓글\n수정' : '댓글\n작성'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;