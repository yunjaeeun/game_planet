import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SocketContext } from "../../layout/SocketLayout";
import BurumabulChatView from "./BurumabulChatView";
import BurumabulRuleView from "./BurumabulRuleView";
import BurumabulSettingView from "./BurumabulSettingView";
import Galmuri9 from "../../../assets/fonts/Galmuri9.ttf";

const BurumabulSidebar = ({ playerInfoList }) => {
  const [currentView, setCurrentView] = useState("chat");
  const userId = Number(useSelector((state) => state.user.userId));
  const { connected, chatMessage, leaveGame } = useContext(SocketContext);
  const navigate = useNavigate();
  const userNickname = localStorage.getItem("nickname");

  const renderView = () => {
    switch (currentView) {
      case "chat":
        return <BurumabulChatView playerInfoList={playerInfoList} />;
      case "rule":
        return <BurumabulRuleView />;
      case "setting":
        return <BurumabulSettingView />;
      default:
        return <BurumabulChatView playerInfoList={playerInfoList} />;
    }
  };

  const handleExit = () => {
    if (connected) {
      // lea;
    }
  };

  return (
    <>
      <style>
        {`
           @font-face {
             font-family: 'Galmuri9';
             src: url(${Galmuri9}) format('truetype');
           }
         `}
      </style>
      <div
        className="flex flex-col bg-gray-800 text-white w-72 h-screen border-r border-gray-700"
        style={{ fontFamily: "Galmuri9" }}
      >
        <div className="flex-1 overflow-hidden m-2">
          <div className="h-full border border-gray-400 rounded-lg">
            {renderView()}
          </div>
        </div>

        <div className="grid grid-cols-4 border-t border-gray-700">
          <button
            className={`py-2 text-center transition-colors text-sm ${
              currentView === "chat" ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
            onClick={() => setCurrentView("chat")}
          >
            CHAT
          </button>
          <button
            className={`py-2 text-center transition-colors text-sm border-l border-gray-700 ${
              currentView === "rule" ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
            onClick={() => setCurrentView("rule")}
          >
            RULE
          </button>
          <button
            className={`py-2 text-center transition-colors text-sm border-l border-gray-700 ${
              currentView === "setting" ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
            onClick={() => setCurrentView("setting")}
          >
            SETTING
          </button>
          <button
            className="py-2 text-center transition-colors text-sm border-l border-gray-700 hover:bg-gray-800"
            onClick={handleExit}
          >
            EXIT
          </button>
        </div>
      </div>
    </>
  );
};

export default BurumabulSidebar;
