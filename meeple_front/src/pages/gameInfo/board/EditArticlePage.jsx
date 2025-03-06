import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BoardHeader from "../../../components/info/board/BoardHeader";
import ArticleForm from "../../../components/info/board/ArticleForm";
import { GameInfoAPI } from '../../../sources/api/GameInfoAPI';

const EditArticlePage = () => {
  const { gameInfoId, articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await GameInfoAPI.getCommunityPost(articleId);
        setArticle(response);
      } catch (error) {
        console.error('게시글 조회 실패:', error);
        alert('게시글을 불러오는데 실패했습니다.');
        navigate(`/game/${gameInfoId}/board`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId, gameInfoId, navigate]);

  const handleSubmit = async (formData) => {
    try {
      await GameInfoAPI.updateCommunityPost(articleId, formData);
      alert('게시글이 수정되었습니다.');
      navigate(`/game/${gameInfoId}/board/detail/${articleId}`);
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <section className="mb-6">
        <BoardHeader />
      </section>
      <section>
        {article && (
          <ArticleForm 
            gameInfoId={gameInfoId}
            initialData={article}
            onSubmit={handleSubmit}
            isEditing={true}
          />
        )}
      </section>
    </div>
  );
};

export default EditArticlePage;
