import React, { useState, useEffect } from "react";
import BatCard from "../../../assets/image/cockroachpoker/BatCard.svg";
import CockroachCard from "../../../assets/image/cockroachpoker/CockroachCard.svg";
import RatCard from "../../../assets/image/cockroachpoker/RatCard.svg";
import ScorpionCard from "../../../assets/image/cockroachpoker/ScorpionCard.svg";
import ToadCard from "../../../assets/image/cockroachpoker/ToadCard.svg";
import CockroachPokerLogo from "../../../assets/image/cockroachpoker/cockroachpoker.svg";
import UpdateRoomModal from "./modal/UpdateRoomModal";

const GameStartScreen = ({
  playerCount,
  onStart,
  roomTitle,
  maxPeople,
  isCreator,
  onUpdateRoom,
  gameData,
  players,
  roomData,
  stompClient,
}) => {
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

  const actualPlayerCount = players.length || 0;
  const canStartGame = playerCount >= 2;

  useEffect(() => {
    console.log("GameStartScreen 현재 상태:", {
      players,
      actualPlayerCount,
      canStartGame
    });
  }, [players, actualPlayerCount, canStartGame]);

  const handleUpdateRoom = async (updateData) => {
    if (stompClient) {
      stompClient.publish({
        destination: `/app/game/update-room/${roomData.roomId}`,
        body: JSON.stringify(updateData),
      });
    }
  };

  return (
    <div className="relative w-full h-[800px] max-w-[1600px] mx-auto bg-gray-700/10 rounded-3xl flex items-center justify-center">
      {/* 메인 로고 배경 */}
      <div className="absolute inset-0 opacity-30">
        <img
          src={CockroachPokerLogo}
          className="w-full h-full object-cover animate-rotate-slow"
          alt="Cockroach Poker Logo"
        />
      </div>

      {/* 움직이는 카드 배경 */}
      <div className="absolute inset-0 opacity-5">
        <div className="animate-float-slow">
          <img
            src={CockroachCard}
            className="absolute top-10 left-20 w-32 h-32 transform -rotate-12"
            alt="Cockroach"
          />
          <img
            src={BatCard}
            className="absolute top-20 right-32 w-40 h-40 transform rotate-12"
            alt="Bat"
          />
        </div>
        <div className="animate-float-medium">
          <img
            src={RatCard}
            className="absolute bottom-20 left-40 w-36 h-36 transform rotate-45"
            alt="Rat"
          />
          <img
            src={ScorpionCard}
            className="absolute top-40 right-20 w-32 h-32 transform -rotate-45"
            alt="Scorpion"
          />
        </div>
        <div className="animate-float-fast">
          <img
            src={ToadCard}
            className="absolute bottom-32 right-40 w-32 h-32 transform rotate-180"
            alt="Toad"
          />
          <img
            src={CockroachCard}
            className="absolute top-1/2 left-1/3 w-32 h-32 transform rotate-90"
            alt="Cockroach"
          />
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div
        className="relative z-10 text-center space-y-8 p-12 bg-gray-800/80 rounded-2xl backdrop-blur-lg 
          border border-gray-700/50 shadow-2xl animate-fade-in
          hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-shadow duration-300"
      >
        <div className="space-y-4">
          <h2
            className="text-5xl font-bold text-white mb-2 animate-glow
              bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
          >
            {roomTitle || "바퀴벌레 포커"}
          </h2>
          <div className="flex justify-center gap-4 mb-6">
            <img
              src={CockroachCard}
              className="w-16 h-16 transform hover:scale-110 transition-all duration-300 
                  animate-slide-in hover:rotate-12 hover:shadow-lg"
              style={{ animationDelay: "0.1s" }}
              alt="Cockroach"
            />
            <img
              src={BatCard}
              className="w-16 h-16 transform hover:scale-110 transition-transform"
              alt="Bat"
            />
            <img
              src={RatCard}
              className="w-16 h-16 transform hover:scale-110 transition-transform"
              alt="Rat"
            />
          </div>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-white mb-2">
              참가자 목록
            </h3>
            <div className="bg-gray-800/50 rounded-lg p-4">
              {players?.map((player, index) => (
                <div key={index} className="text-white mb-2 last:mb-0">
                  {player} {player === roomData?.creator && "(방장)"}
                </div>
              ))}
            </div>
            <div className="text-gray-400 mt-2">
              {actualPlayerCount}/{maxPeople} 명
            </div>
          </div>
          <div className="space-y-2 text-gray-300">
            <p className="text-lg hover:text-blue-300 transition-colors duration-300">
              거짓말과 심리전으로 가득한
            </p>
            <p className="text-lg hover:text-blue-300 transition-colors duration-300">
              카드게임에 오신 것을 환영합니다!
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {isCreator ? (
            <button
              onClick={onStart}
              disabled={!canStartGame}
              className={`w-full px-8 py-3 text-xl font-medium rounded-lg transition-colors
                ${
                  canStartGame
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-400 cursor-not-allowed text-gray-200"
                }`}
            >
              {!canStartGame
                ? `최소 2명이 필요합니다 (현재: ${playerCount}명)`
                : "게임 시작"}
            </button>
          ) : (
            <div className="text-gray-300 text-xl">
              방장이 게임을 시작하기를 기다리는 중...
            </div>
          )}

          {isCreator && (
            <button
              onClick={() => setUpdateModalOpen(true)}
              className="w-full px-8 py-3 text-xl font-medium rounded-lg 
                bg-purple-500 hover:bg-purple-600 text-white transition-colors"
            >
              방 설정 변경
            </button>
          )}
        </div>
      </div>

      <UpdateRoomModal
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onUpdateRoom={(updateData) => {
          if (stompClient) {
            stompClient.publish({
              destination: `/app/game/update-room/${roomData.roomId}`,
              body: JSON.stringify(updateData),
            });
          }
        }}
        initialData={{
          roomTitle: roomData?.roomTitle,
          maxPeople: roomData?.maxPeople,
          password: roomData?.password,
        }}
      />
    </div>
  );
};

export default GameStartScreen;
