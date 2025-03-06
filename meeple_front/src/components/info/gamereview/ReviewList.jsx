// ReviewList.jsx
import ReviewForm from "../info/ReviewForm"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReviewItem from "./ReviewItem";
import { GameInfoAPI } from '../../../sources/api/GameInfoAPI';
import { useSelector } from 'react-redux';

const ReviewList = () => {
  const { gameInfoId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  
  const { token } = useSelector((state) => state.user);
  const currentUserId = token ? JSON.parse(atob(token.split(".")[1])).sub : null;
  
  console.log(currentUserId)
  
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
      <section>
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
              isAuthor={String(currentUserId) === String(item.userId)}
              onEditClick={() => handleEditClick(item.gameReviewId)}
              onDeleteClick={() => handleDeleteClick(item.gameReviewId)}
            />
          )
        ))}
      </section>
    </div>
  );
};


export default ReviewList;
