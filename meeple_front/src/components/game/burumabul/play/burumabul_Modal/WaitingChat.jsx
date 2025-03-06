import React, { useState, useRef, useEffect, useContext } from "react";
import { Send } from "lucide-react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../../layout/SocketLayout";

const WaitingChat = ({ roomId, players }) => {
  const [newMessage, setNewMessage] = useState("");
  const chatBoxRef = useRef(null);
  const userId = Number(useSelector((state) => state.user.userId));

  const { connected, chatMessage, chatWaitingRoom, roomNotifi, setRoomNotifi } =
    useContext(SocketContext);

  const [messages, setMessages] = useState([
    {
      type: "system",
      sender: "system",
      content: "유저들과 소통하세요!!",
    },
  ]);

  useEffect(() => {
    if (roomNotifi) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "system", sender: "system", content: roomNotifi },
      ]);
      setRoomNotifi("");
    }
  }, [roomNotifi]);

  // 채팅 메시지
  useEffect(() => {
    if (chatMessage && chatMessage.type === "chat") {
      const { sender, content } = chatMessage;

      // 플레이어 정보에서 발신자의 닉네임을 찾습니다
      const senderInfo = players.find(
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
        },
      ]);

      console.log("현재 유저 목록:", players);
      console.log("닉네임 찾기 결과:", senderName);
    }
  }, [chatMessage, players, userId]);

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // 메시지 전송 핸들러
  const handleSend = (e) => {
    e.preventDefault();
    if (!connected || !newMessage.trim()) return;
    const chatInfo = {
      type: "chat",
      sender: userId,
      content: newMessage.trim(),
    };
    // STOMP로 메시지 전송
    chatWaitingRoom(chatInfo);
    setNewMessage("");
  };

  return (
    <div className="h-[600px] w-[250px] bg-white bg-opacity-70 rounded-lg flex flex-col">
      {/* 채팅 헤더 */}
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-purple-600">채팅</h2>
      </div>

      {/* 채팅 메시지 영역 */}
      <div
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 thin-scrollbar"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex w-full ${
              msg.type === "system"
                ? "justify-center"
                : msg.isMe
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div className="flex flex-col max-w-[75%]">
              {/* 닉네임 표시 (시스템 메시지가 아닐 때만) */}
              {msg.type !== "system" && (
                <span
                  className={`text-xs text-gray-500 mb-1 ${
                    msg.isMe ? "text-right" : "text-left"
                  }`}
                >
                  {msg.isMe ? "나" : msg.senderName}
                </span>
              )}
              {/* 말풍선 스타일 */}
              <div
                className={`px-3 py-2 rounded-lg shadow-md text-sm ${
                  msg.type === "system"
                    ? "bg-gray-100 text-gray-600 text-center"
                    : msg.isMe
                    ? "bg-purple-600 text-white rounded-br-none self-end" // 내 말풍선은 오른쪽 정렬
                    : "bg-gray-200 text-gray-800 rounded-bl-none self-start" // 상대방 말풍선은 왼쪽 정렬
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 메시지 입력 영역 */}
      <form onSubmit={handleSend} className="p-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            className="w-4/5 px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            disabled={!connected}
          />
          <button
            type="submit"
            disabled={!connected || !newMessage.trim()}
            className="p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default WaitingChat;
