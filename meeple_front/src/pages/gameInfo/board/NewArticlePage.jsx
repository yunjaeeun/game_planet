import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import BoardHeader from "../../../components/info/board/BoardHeader";
import ArticleForm from "../../../components/info/board/ArticleForm";
import { GameInfoAPI } from '../../../sources/api/GameInfoAPI';

const NewArticlePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const { gameInfoId } = useParams();

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await GameInfoAPI.createCommunityPost({
        ...formData,
        gameInfoId: gameInfoId
      });
      
      alert('게시글이 등록되었습니다.');
      navigate(`/game-info/${gameInfoId}/board`);
    } catch (error) {
      console.error('게시글 저장 실패:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <section>
        <ArticleForm 
          gameInfoId={gameInfoId}
          onSubmit={handleSubmit}
          isEditing={false}
          isSubmitting={isSubmitting}
        />
      </section>
    </div>
  );
};

export default NewArticlePage;
