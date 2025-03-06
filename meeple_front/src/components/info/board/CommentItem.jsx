// CommentItem.jsx
import { useSelector } from 'react-redux';

const CommentItem = ({ comment, onEdit, onDelete }) => {
  const { token } = useSelector((state) => state.user);
  const currentUserId = token ? JSON.parse(atob(token.split(".")[1])).sub : null;
  const isAuthor = currentUserId === comment.userId;

  return (
    <div className="border-b pb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-4">
          <span className="font-semibold">{comment.userName}</span>
          <span className="text-sm text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        {isAuthor && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(comment)}
              className="text-sm text-blue-600 hover:text-blue-700
                       focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            >
              수정
            </button>
            <button
              onClick={() => {
                if (window.confirm('댓글을 삭제하시겠습니까?')) {
                  onDelete(comment.id);
                }
              }}
              className="text-sm text-red-600 hover:text-red-700
                       focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
            >
              삭제
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-700">{comment.content}</p>
    </div>
  );
};

export default CommentItem;