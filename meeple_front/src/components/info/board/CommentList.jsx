// CommentList.jsx
import { useState } from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { useSelector } from 'react-redux';
import { GameInfoAPI } from '../../../sources/api/GameInfoAPI';

const CommentList = ({ articleId, commentListData, onCommentUpdate }) => {
  const [content, setContent] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const { token } = useSelector((state) => state.user);
  const userId = token ? JSON.parse(atob(token.split(".")[1])).sub : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await GameInfoAPI.createComment({
        content,
        gameCommunityId: articleId,
        userId
      });
      setContent('');
      if (onCommentUpdate) onCommentUpdate();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment);
  };

  const handleDelete = async (commentId) => {
    try {
      await GameInfoAPI.deleteComment(commentId);
      if (onCommentUpdate) onCommentUpdate();
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">
        댓글 {commentListData?.length || 0}
      </h2>
      
      <div className="space-y-4">
        {commentListData?.map((comment) => (
          editingComment?.id === comment.communityCommentId ? (
            <CommentForm
              key={comment.communityCommentId}
              initialData={comment.content}
              articleId={articleId}
              commentId={comment.communityCommentId}
              userId={userId}
              onSuccess={() => {
                setEditingComment(null);
                if (onCommentUpdate) onCommentUpdate();
              }}
            />
          ) : (
            <CommentItem 
              key={comment.communityCommentId}
              comment={{
                id: comment.communityCommentId,
                userId: comment.userId,
                userName: comment.userName,
                content: comment.content,
                createdAt: comment.createAt
              }}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )
        ))}
      </div>

      <CommentForm 
        articleId={articleId}
        userId={userId}
        content={content}
        setContent={setContent}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CommentList;