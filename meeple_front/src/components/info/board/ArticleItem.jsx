import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { IoClose } from "react-icons/io5";


const ArticleModal = ({ isOpen, onClose, article }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* 배경 오버레이 */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

        {/* 모달 컨텐츠 */}
        <div className="relative bg-white rounded-lg w-full max-w-3xl p-6 overflow-hidden shadow-xl">
          {/* 헤더 */}
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              {/* <h3 className="text-xl font-semibold">{article.content}</h3> */}
              <div className="mt-2 text-sm text-gray-500">
                <span>{article.createdBy.nickname}</span>
                <span className="mx-2">•</span>
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* 본문 */}
          <div className="mt-4 mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{article.content}</p>
          </div>

          {/* 댓글 섹션 */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-4">댓글 {article.comments?.length || 0}</h4>
            <div className="space-y-4">
              {article.comments?.map((comment) => (
                <div key={comment.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{comment.user.nickname}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.gameCommunityCommentContent}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArticleItem = ({ content, createdAt, createdBy, comments, articleId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        onClick={handleClick}
        className="grid grid-cols-12 gap-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
      >
        <div className="col-span-8 text-center truncate">
          {content}
          {comments?.length > 0 && (
            <span className="text-blue-500 ml-2">[{comments.length}]</span>
          )}
        </div>
        <div className="col-span-2 text-center">{createdBy.nickname}</div>
        <div className="col-span-2 text-center">
          {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>

      <ArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        article={{ content, createdAt, createdBy, comments }}
      />
    </>
  );
};

export default ArticleItem;
