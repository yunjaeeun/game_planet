import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile } from "../../sources/store/slices/ProfileSlice";

const ChatView = ({ connected, sendMessage, messages }) => {
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  // Redux에서 userId와 프로필 데이터 가져오기
  const userId = useSelector((state) => state.user.userId);
  const profileData = useSelector((state) => state.profile.profileData);

  // 컴포넌트 마운트 시 프로필 정보 가져오기
  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile(userId));
    }
  }, [userId, dispatch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !connected) return;

    sendMessage({
      message: chatInput,
      sender: profileData?.userNickname || userId, // 닉네임이 없으면 userId를 대체값으로 사용
    });

    setChatInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1.5 mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === profileData?.userNickname
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg p-2 max-w-[75%] ${
                  msg.sender === profileData?.userNickname
                    ? "bg-gray-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                <div className="text-xs opacity-75 mb-0.5">{msg.sender}</div>
                <div className="break-words text-sm">{msg.content}</div>
                <div className="text-[10px] opacity-50 mt-0.5">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-2">
        <div className="relative">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="채팅을 입력하세요..."
            className="w-full bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none text-white"
            disabled={!connected}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            disabled={!connected}
          >
            ↑
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatView;