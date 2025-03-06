import ArticleItem from "./ArticleItem"
import ArticleCreate from "./ArticleCreate";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameInfoAPI } from '../api/GameInfoAPI';

const ArticleList = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isWriting, setIsWriting] = useState(false);
  const itemsPerPage = 10;

  const fetchArticles = async () => {
    try {
      setLoading(true);
      // const response = await GameInfoAPI.getCommunityPosts(gameId);
      // gameid 테스트용 코드
      const response = await GameInfoAPI.getCommunityPosts(7);
      setData(response);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [gameId]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;
  if (!data) return <div>데이터가 없습니다.</div>;

  if (isWriting) {
    return <ArticleCreate 
      gameId={gameId} 
      onCancel={() => setIsWriting(false)}
      onSuccess={() => {
        setIsWriting(false);
        fetchArticles();
      }}
    />;
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentArticles = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Community</h1>
      <section>
        <section className="grid grid-cols-12 gap-4 border-b-2 pb-2 font-medium">
          <span className="col-span-6 text-center">제목</span>
          <span className="col-span-2 text-center">작성자</span>
          <span className="col-span-2 text-center">작성일</span>
          <span className="col-span-2 text-center">조회수</span>
        </section>
        <section>
          {currentArticles.map((item) => (
            <ArticleItem
              key={item.gameCommunityId}
              content={item.gameCommunityContent}
              createdAt={item.createAt}
              createdBy={item.user}
              comments={item.commentList}
            />
          ))}
        </section>
        <section className="mt-4 flex justify-between items-center">
          <div className="flex gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              이전
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 border rounded 
                  ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              다음
            </button>
          </div>
          <button
            onClick={() => setIsWriting(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            글쓰기
          </button>
        </section>
      </section>
    </div>
  );
};

export default ArticleList;
