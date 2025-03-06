import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import useCatchSocket from "../../../../hooks/useCatchSocket";
import { useSelector } from "react-redux";

const ChatBox = ({ roomId, currentUser, correctAnswer }) => {
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef(null);
  const { messages, sendMessage } = useCatchSocket(roomId);

  const currentUserTurn = useSelector(
    (state) =>
      state.catchmind.players.find((p) => p.isTurn)?.nickname === currentUser
  );

  useEffect(() => {
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        const scrollHeight = chatContainerRef.current.scrollHeight;
        const height = chatContainerRef.current.clientHeight;
        const maxScrollTop = scrollHeight - height;
        chatContainerRef.current.scrollTop =
          maxScrollTop > 0 ? maxScrollTop : 0;
      }
    };

    scrollToBottom();
    requestAnimationFrame(scrollToBottom);
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (
      currentUserTurn &&
      message.trim().toLowerCase() === correctAnswer?.toLowerCase()
    ) {
      console.log("출제자가 정답을 입력했습니다 - 무시됨");
      setMessage("");
      return;
    }

    const messageData = {
      message: message.trim(),
      sender: currentUser,
      correctAnswer,
    };

    sendMessage(messageData);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* 채팅 메시지 영역 */}
      <div className="relative flex-1 min-h-0">
        <div
          ref={chatContainerRef}
          className="absolute inset-0 p-4 overflow-y-scroll space-y-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800/40 [&::-webkit-scrollbar-thumb]:bg-gray-600/40 hover:[&::-webkit-scrollbar-thumb]:bg-gray-600/80 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
        >
          {messages.map((msg, index) => {
            if (msg.isNotice || msg.sender === "SYSTEM") {
              return (
                <div key={index} className="flex justify-center">
                  <div className="bg-yellow-500/20 text-yellow-200 px-4 py-2 rounded text-sm">
                    {msg.content}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === currentUser ? "items-end" : "items-start"
                }`}
              >
                <span className="text-sm text-gray-400">{msg.sender}</span>
                <div
                  className={`px-4 py-2 rounded-lg max-w-[80%] ${
                    msg.isCorrect
                      ? "bg-green-500 text-white"
                      : msg.sender === currentUser
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  <p>{msg.content}</p>
                  {msg.isCorrect && (
                    <div className="text-xs mt-1 text-green-200">
                      🎉 정답을 맞추셨습니다! + 30점
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 입력 폼 영역 */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              currentUserTurn
                ? "출제자는 정답을 맞출 수 없습니다"
                : "정답을 입력하세요..."
            }
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={currentUserTurn}
          />
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition-colors ${
              currentUserTurn
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
            disabled={currentUserTurn}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
