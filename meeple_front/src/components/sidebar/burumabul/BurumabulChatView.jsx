import React, { useRef, useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../../sources/store/slices/ProfileSlice";
import { SocketContext } from "../../layout/SocketLayout";

const BurumabulChatView = ({ playerInfoList }) => {
  const { connected, chatMessage, chatWaitingRoom } = useContext(SocketContext);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  // Redux에서 userId와 프로필 데이터 가져오기
  const userId = Number(useSelector((state) => state.user.userId));
  const profileData = useSelector((state) => state.profile.profileData);

  // 컴포넌트 마운트 시 프로필 정보 가져오기
  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (chatMessage && chatMessage.type === "chat") {
      const { sender, content } = chatMessage;
      // 플레이어 정보에서 발신자의 닉네임 찾기
      const senderInfo = playerInfoList.find(
        (player) => Number(player.playerId) === Number(sender)
      );
      const senderName = senderInfo ? senderInfo.playerName : "알 수 없음";

      setMessages((prev) => [
        ...prev,
        {
          type: "chat",
          sender: sender,
          senderName: senderName,
          content: content,
          isMe: sender === userId,
          timestamp: Date.now(),
        },
      ]);

      console.log("현재 유저 목록:", playerInfoList);
      console.log("닉네임 찾기 결과:", senderName);
    }
  }, [chatMessage, playerInfoList, userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !connected) return;

    const chatInfo = {
      type: "chat",
      sender: userId,
      content: chatInput,
    };
    chatWaitingRoom(chatInfo);
    setChatInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-3 mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full ${
                msg.isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg p-2 max-w-[75%] ${
                  msg.isMe ? "bg-gray-600 text-white" : "bg-gray-700 text-white"
                }`}
              >
                {/* ✅ 여기 적용 (보낸 사람 닉네임 표시) */}
                <span
                  className={`text-xs text-gray-500 mb-1 ${
                    msg.isMe ? "text-right block" : "text-left block"
                  }`}
                >
                  {msg.isMe ? "나" : msg.senderName}
                </span>

                <div className="break-words text-sm">{msg.content}</div>
                <div className="text-[10px] opacity-50 mt-0.5 text-right">
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

export default BurumabulChatView;
