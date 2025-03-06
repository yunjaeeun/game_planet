import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatView from "./ChatView";
import RuleView from "./RuleView";
import SettingView from "./SettingView";
import useSocket from "../../hooks/useCockroachSocket";
import Galmuri9 from "../../assets/fonts/Galmuri9.ttf";

const GameSidebar = () => {
  const [currentView, setCurrentView] = useState("chat");
  const { roomId } = useParams();
  const { connected, sendMessage, messages, stompClient } = useSocket(roomId);
  const navigate = useNavigate();
  const userNickname = localStorage.getItem("nickname");

  // subscription을 useRef로 변경
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (!connected || !stompClient || !roomId) return;

    try {
      // 게임 관련 메시지 구독
      subscriptionRef.current = stompClient.subscribe(
        `/topic/game/${roomId}`,
        (message) => {
          const data = JSON.parse(message.body);

          // players 배열이 있고 비어있거나, 내가 players 배열에 없으면 홈으로 이동
          if (data.players) {
            if (
              data.players.length === 0 ||
              !data.players.includes(userNickname)
            ) {
              if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
              }
              navigate("/home");
            }
          }
        }
      );

      return () => {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
      };
    } catch (error) {
      console.error("[WebSocket] Subscription error:", error);
    }
  }, [connected, stompClient, roomId, navigate, userNickname]);

  const handleExit = () => {
    if (!connected || !stompClient) return;

    try {
      stompClient.publish({
        destination: `/app/game/exit-room/${roomId}`,
        body: JSON.stringify({
          userNickname: userNickname,
          roomId: roomId,
        }),
      });
    } catch (error) {
      console.error("[WebSocket] Exit error:", error);
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      navigate("/home");
    }
  };

  const renderView = () => {
    switch (currentView) {
      case "chat":
        return (
          <ChatView
            connected={connected}
            sendMessage={sendMessage}
            messages={messages}
          />
        );
      case "rule":
        return <RuleView />;
      case "setting":
        return <SettingView />;
      default:
        return (
          <ChatView
            connected={connected}
            sendMessage={sendMessage}
            messages={messages}
          />
        );
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

export default GameSidebar;
