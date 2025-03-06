import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FriendList from "./FriendList";
import RequestFriend from "./RequestFriend";
import { UsersRound, MessageSquareMore, Handshake } from "lucide-react";
import Message from "./Message";

const FriendModal = () => {
  const userId = useSelector((state) => state.user.userId);

  const [activeTab, setActiveTab] = useState("friendList");

  const renderContent = () => {
    switch (activeTab) {
      case "friendList":
        return <FriendList userId={userId} />;
      case "allRequest":
        return <RequestFriend />;
      case "message":
        return <Message />;
      default:
        return <FriendList userId={userId} />;
    }
  };

  return (
    <>
      <div className="flex justify-around items-center ">
        <button
          className={`rounded p-1 ${
            activeTab === "friendList" ? "border-2 border-[#7a90ff] " : null
          }`}
          onClick={() => setActiveTab("friendList")}
        >
          <UsersRound color="#7a90ff" strokeWidth={2.5} />
        </button>
        <button
          className={`rounded p-1 ${
            activeTab === "allRequest" ? "border-2 border-[#7a90ff] " : null
          }`}
          onClick={() => setActiveTab("allRequest")}
        >
          <Handshake color="#7a90ff" strokeWidth={2.5} />
        </button>
        <button
          className={`rounded p-1 ${
            activeTab === "message" ? "border-2 border-[#7a90ff] " : null
          }`}
          onClick={() => setActiveTab("message")}
        >
          <MessageSquareMore color="#7a90ff" strokeWidth={2.5} />
        </button>
      </div>
      <div>{renderContent()}</div>
    </>
  );
};

export default FriendModal;
