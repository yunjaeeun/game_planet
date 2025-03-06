import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';


const ArticleForm = ({ gameInfoId,initialData, onSubmit, isEditing, isSubmitting: externalIsSubmitting }) => {
  const { token } = useSelector((state) => state.user);
  const userId = token ? JSON.parse(atob(token.split(".")[1])).sub : null;
  
  const [formData, setFormData] = useState({
    // title: '',
    gameCommunityContent: '',
    userId: userId,
    gameInfoId: gameInfoId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        // title: initialData.title || '',
        gameCommunityContent: initialData.gameCommunityContent || '',
        userId: userId
      });
    }
  }, [initialData, userId]);

  useEffect(() => {
    if (externalIsSubmitting !== undefined) {
      setIsSubmitting(externalIsSubmitting);
    }
  }, [externalIsSubmitting]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userId)
    if (!formData.gameCommunityContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    // 로그인 안한 사용자 필터링

    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      if (!isEditing) {
        setFormData({ 
          // title: '', 
          gameCommunityContent: '', 
          userId :userId
        });
      }
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('저장에 실패했습니다.');
    } finally {
      if (externalIsSubmitting === undefined) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-4">
      {/* <div className="space-y-2">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="제목을 입력하세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent"
          maxLength={100}
          disabled={isSubmitting}
        />
      </div> */}

      <div className="space-y-2">
        <textarea
          name="gameCommunityContent"
          value={formData.gameCommunityContent}
          onChange={handleChange}
          placeholder="내용을 입력하세요"
          className="w-full h-96 px-4 py-2 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent resize-none
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '저장 중...' : isEditing ? '수정' : '저장'}
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;
