import React, { useState, useEffect } from "react";

const UpdateRoomModal = ({ isOpen, onClose, onUpdateRoom, initialData }) => {
  const [roomTitle, setRoomTitle] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [maxPeople, setMaxPeople] = useState(4);

  // 초기 데이터로 필드들을 채워줌
  useEffect(() => {
    if (isOpen && initialData) {
      setRoomTitle(initialData.roomTitle || "");
      setIsPrivate(!!initialData.password); // 비밀번호 존재 여부로 비밀방 설정
      setPassword(initialData.password || "");
      setMaxPeople(initialData.maxPeople || 4);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onUpdateRoom({
        roomTitle,
        private:isPrivate,
        password: isPrivate ? password : "",
        maxPeople
      });
      console.log(roomTitle, isPrivate, password, maxPeople);
      
      onClose();
    } catch (error) {
      console.error("방 설정 수정 실패:", error);
    }
  };

  // 비밀방 체크박스 변경 시
const handlePrivateChange = (e) => {
  const newIsPrivate = e.target.checked;
  setIsPrivate(newIsPrivate);
  if (!newIsPrivate) {
    setPassword(""); // 비밀방 해제 시 비밀번호 초기화
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">방 설정 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              방 제목
            </label>
            <input
              type="text"
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              placeholder="방 제목을 입력하세요"
              className="w-full p-2 border rounded"
              maxLength={20}
              required
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={handlePrivateChange}
                className="mr-2"
              />
              비밀방으로 설정
            </label>
          </div>

          {isPrivate && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최대 인원
            </label>
            <select
              value={maxPeople}
              onChange={(e) => setMaxPeople(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              <option value={2}>2명</option>
              <option value={3}>3명</option>
              <option value={4}>4명</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              수정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRoomModal;
