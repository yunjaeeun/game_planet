import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useCockroachSocket from "../../hooks/useCockroachSocket";
import useCockState from "../../hooks/useCockState";
import GameBoard from "../../components/game/cockroachcard/GameBoard";
import GameStartScreen from "../../components/game/cockroachcard/GameStartScreen";
import GameSidebar from "../../components/sidebar/GameSidebar";
import VideoChat from "../../components/game/cockroachcard/VideoChat";
import { toast } from "react-hot-toast";

const CockroachPokerPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userId)

  const {
    gameState,
    setGameState,
    playerCards,
    setPlayerCards,
    currentUser,
    setCurrentUser,
    isGameStarted,
    setIsGameStarted,
    players,
    setPlayers,
    roomData,
    setRoomData
  } = useCockState(roomId);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const subscriptionRef = useRef(null);
  const { sendMessage, startGame, stompClient, connected } =
    useCockroachSocket(roomId);

  // 프로필 및 방 참여 로직
  const fetchProfileAndJoinRoom = async () => {
    try {
      if (hasJoined || retryCount > 3) return;

      const response = await fetch(
        // `${import.meta.env.VITE_LOCAL_API_BASE_URL}/profile/${userId}`
        `${import.meta.env.VITE_API_BASE_URL}/profile/${userId}`
      );
      if (!response.ok) throw new Error("프로필을 가져오는데 실패했습니다.");
      const profileData = await response.json();
      setCurrentUser(profileData.userNickname);

      // 웹소켓 연결 및 방 참여
      if (connected && stompClient) {
        stompClient.publish({
          destination: "/app/game/join-room",
          body: JSON.stringify({
            roomId: parseInt(roomId),
            playerName: profileData.userNickname,
            password: "",
          }),
        });
        setHasJoined(true);
        setRetryCount(0);
      } else {
        throw new Error("WebSocket 연결이 되지 않았습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      setRetryCount((prev) => prev + 1);
      
      if (retryCount >= 3) {
        toast.error("방 입장에 실패했습니다. 메인으로 이동합니다.");
        setTimeout(() => navigate("/home"), 1500);
      } else {
        toast.error(`방 입장 재시도 중... (${retryCount + 1}/3)`);
        setTimeout(fetchProfileAndJoinRoom, 1000);
      }
    }
  };
  // 로그인 체크 Effect
useEffect(() => {
  if (!userId) {
    console.log("로그인 해야겠어 안해야겠어 !! ");
    navigate("/home");
  }
}, [userId, navigate]);

// WebSocket 구독 설정
useEffect(() => {
  if (!stompClient || !connected || !currentUser) return;

  if (subscriptionRef.current) {
    subscriptionRef.current.unsubscribe();
  }

  const handleGameMessage = (message) => {
    try {
      const response = JSON.parse(message.body);
      console.log("웹소켓 메시지 수신:", response);

      // 방 정보 업데이트
      if (response.type === "UPDATE_ROOM" || response.roomInfo) {
        const roomInfo = response.roomInfo || response.data;
        if (roomInfo) {
          const uniquePlayers = [...new Set(roomInfo.players || [])];
          setPlayers(uniquePlayers);
          setRoomData(roomInfo);
        }
      }
      // 게임 데이터 업데이트
      else if (response.players && response.gameData) {
        setPlayers([...new Set(response.players)]);
        setGameState(response.gameData.gameState);
        setPlayerCards(response.gameData.playerCards);
        setIsGameStarted(true);
        setIsStarting(false);
        setHasJoined(true);
      }
      // 카드 전달 메시지 처리
      else if (response.to && response.from && response.card) {
        setGameState(prevState => ({
          ...prevState,
          cardReceiver: response.to,
          cardSender: response.from,
          currentCard: response.card,
          claimedAnimal: response.animal,
          king: response.king,
          currentPhase: "GUESS_OR_FORWARD",
          currentTurn: response.from,
          passCount: 0,
          passedPlayers: []
        }));

        setPlayerCards(prevCards => ({
          ...prevCards,
          [response.from]: prevCards[response.from].filter(
            card => card.type !== response.card.type || card.royal !== response.card.royal
          )
        }));
      }
    } catch (error) {
      console.error("웹소켓 메시지 처리 중 오류:", error);
    }
  };

  subscriptionRef.current = stompClient.subscribe(
    `/topic/game/${roomId}`,
    handleGameMessage
  );

  return () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }
  };
}, [stompClient, connected, currentUser, roomId]);


  // 게임 시작 핸들러
  const handleStartGame = async () => {
    if (!connected || isStarting) return;

    try {
      setIsStarting(true);
      setHasJoined(true);
      await startGame();
      setIsGameStarted(true);
      sessionStorage.setItem(`game_${roomId}_status`, "started");
      console.log("게임 시작 요청 전송!!");
    } catch (error) {
      console.error("게임 시작 실패:", error);
      toast.error("게임 시작에 실패했습니다.");
      setIsStarting(false);
    }
  };

 // 게임 종료 핸들러
 const handleGameEnd = () => {
  sessionStorage.removeItem(`game_${roomId}_status`);
  setGameState(null);
  setPlayerCards({});
  setIsGameStarted(false);
};

  // 방 업데이트 핸들러
  const handleUpdateRoom = (updateData) => {
    sendMessage({
      type: "UPDATE_ROOM",
      data: updateData,
    });
  };

  // 로딩 화면
  if (!currentUser && !isGameStarted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  // 메인 렌더링
  return (
    <div className="h-screen w-screen flex bg-gray-900">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-72" : "w-0"
        } relative z-50`}
      >
        <div
          className={`fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <GameSidebar />
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800 rounded-r text-white hover:bg-gray-700 focus:outline-none flex items-center justify-center"
          >
            {isSidebarOpen ? "←" : "→"}
          </button>
        </div>
      </div>

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-0" : "ml-0"
        }`}
      >
        <div className="flex-1 overflow-hidden">
          {!isGameStarted ? (
            <GameStartScreen
            playerCount={players?.length || 0}
            onStart={handleStartGame}
            roomTitle={roomData?.roomTitle || "바퀴벌레 포커"}
            maxPeople={roomData?.maxPeople || 4}
            isCreator={roomData?.creator === currentUser}
            onUpdateRoom={handleUpdateRoom}
            players={players || []}
            roomData={roomData}
            stompClient={stompClient}
            />
          ) : (
            <GameBoard
            playerCount={players?.length || 0}
            gameState={gameState}
            playerCards={playerCards}
            currentUser={currentUser}
            sendMessage={sendMessage}
            stompClient={stompClient}
            roomId={roomId}
            onGameEnd={handleGameEnd}
            />
          )}
        </div>

        <div className="h-48 bg-gray-800 border-t border-gray-700">
          {connected && (
            <VideoChat
              userId={currentUser}
              playerCount={players?.length || 0}
              players={players}
            />
          )}
        </div>
      </div>

      {!isSidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800 rounded-r text-white hover:bg-gray-700 focus:outline-none flex items-center justify-center z-50"
        >
          →
        </button>
      )}
    </div>
  );
};

export default CockroachPokerPage;
