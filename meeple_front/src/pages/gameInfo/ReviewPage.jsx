// ReviewList.jsx
import ReviewForm from "../../components/info/gamereview/ReviewForm"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReviewItem from "../../components/info/gamereview/ReviewItem";
import { GameInfoAPI } from '../../sources/api/GameInfoAPI';
import { useSelector } from 'react-redux';

const ReviewPage = () => {
  const { gameInfoId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  
  const { token } = useSelector((state) => state.user);
  const currentUserId = token ? JSON.parse(atob(token.split(".")[1])).sub : null;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const reviewData = await GameInfoAPI.getReviews(gameInfoId);
      setData(reviewData);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [gameInfoId]);

  const handleEditClick = (reviewId) => {
    setEditingReviewId(reviewId);
  };

  const handleEditSuccess = () => {
    setEditingReviewId(null);
    fetchReviews();
  };

  const handleDeleteClick = async (reviewId) => {
    if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      try {
        await GameInfoAPI.deleteReview(gameInfoId, reviewId);
        alert('리뷰가 삭제되었습니다.');
        fetchReviews();
      } catch (error) {
        console.error('리뷰 삭제 실패:', error);
        alert('리뷰 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;
  if (!data) return null;

  return (
    <div>
      <div className="min-h-screen relative overflow-hidden">
      <div className="min-h-screen p-8 relative z-5">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-900 bg-opacity-80 rounded-xl shadow-2xl p-8 backdrop-blur-lg border border-indigo-500/30">
            <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              게임 리뷰
            </h1>
            <section className="text-white">
              {data.starAvg 
                ? `별점 ${data.starAvg}` 
                : "아직 별점을 등록한 사람이 없어요"
              }
            </section>
            
            {!editingReviewId && (
              <ReviewForm 
                gameInfoId={gameInfoId}
                onSuccess={fetchReviews}
              />
            )}

            <section>
              {data.reviewList?.map((item) => (
                editingReviewId === item.gameReviewId ? (
                  <ReviewForm 
                    key={item.gameReviewId}
                    initialData={item}
                    onSuccess={handleEditSuccess}
                  />
                ) : (
                  <ReviewItem 
                    key={item.gameReviewId}
                    {...item}
                    isAuthor={String(currentUserId) === String(item.user.userId)}
                    onEditClick={() => handleEditClick(item.gameReviewId)}
                    onDeleteClick={() => handleDeleteClick(item.gameReviewId)}
                  />
                )
              ))}
            </section>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
};


export default ReviewPage;
