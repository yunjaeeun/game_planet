import { useSelector } from "react-redux";
import { useState } from "react";
import axios from 'axios';

const ArticleCreate = ({ gameId, onCancel }) => {
  const [input, setInput] = useState({
    title: '',
    content: ''
  });

  const { token } = useSelector((state) => state.user);
  const userId = token ? JSON.parse(atob(token.split(".")[1])).sub : null; //토큰 이용해 userId 가져오기기

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!input.title.trim() || !input.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await axios.post(`https://boardjjigae.duckdns.org/api/game-info/community`, {
        gameInfoId: gameId,
        title: input.title,
        content: input.content,
        userId: userId,
      });
      onCancel(); // 성공 시 목록으로 돌아가기
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">게시글 작성</h2>
      
      {/* 제목 입력 */}
      <section className="mb-4">
        <input
          type="text"
          name="title"
          value={input.title}
          onChange={handleChange}
          placeholder="글 제목을 입력해주세요"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        />
      </section>

      {/* 내용 입력 */}
      <section className="mb-6">
        <textarea
          name="content"
          value={input.content}
          onChange={handleChange}
          placeholder="글 내용을 입력해주세요"
          className="w-full h-64 px-4 py-2 border rounded-lg resize-none focus:outline-none focus:border-blue-500"
        />
      </section>

      {/* 버튼 영역 */}
      <section className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 border rounded-lg hover:bg-gray-100"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          작성
        </button>
      </section>
    </div>
  );
};

export default ArticleCreate;
