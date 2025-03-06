import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReceivedMessage from "./ReceivedMessage";
import SendMessage from "./SendMessage";
import { messageList } from "../../sources/api/FriendApi";

const Message = () => {
  const userId = useSelector((state) => state.user.userId);
  if (!userId) {
    console.error("유저 아이디가 없어서 메세지를 조회하지 못 했습니다.");
  }

  const [messages, setMessages] = useState([]);
  const loadMessageData = async () => {
    try {
      const response = await messageList(userId);
      setMessages(response);
    } catch (error) {
      console.error("쪽지 목록을 불러오지 못 했습니다.");
    }
  };

  useEffect(() => {
    loadMessageData();
  }, []);

  const [activeTab, setActiveTab] = useState("ReceivedMessage");
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    loadMessageData();
  };
  const renderContent = () => {
    switch (activeTab) {
      case "ReceivedMessage":
        return <ReceivedMessage messages={messages} />;
      case "SendMessage":
        return <SendMessage />;
      default:
        return <ReceivedMessage />;
    }
  };
  return (
    <>
      <div className="flex justify-around items-center">
        <button
          className={`px-4 py-2 mx-3 rounded-lg font-semibold transition-all duration-300 
          ${
            activeTab === "ReceivedMessage"
              ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg scale-105 border-2 border-blue-700"
              : "bg-gray-500 text-gray-200 hover:bg-gray-600 hover:text-white"
          }`}
          onClick={() => handleTabChange("ReceivedMessage")}
        >
          받은 쪽지함
        </button>
        <button
          className={`px-4 py-2 mx-3 rounded-lg font-semibold transition-all duration-300 
          ${
            activeTab === "SendMessage"
              ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg scale-105 border-2 border-blue-700"
              : "bg-gray-500 text-gray-200 hover:bg-gray-600 hover:text-white"
          }`}
          onClick={() => handleTabChange("SendMessage")}
        >
          쪽지 보내기
        </button>
      </div>
      {renderContent()}
    </>
  );
};

export default Message;
