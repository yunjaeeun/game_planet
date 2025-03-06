import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { WS_ENDPOINTS } from "../../../hooks/useCockroachSocket";
import { RefreshCw } from "lucide-react"; // 새로고침 아이콘

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const userNickname = useSelector((state) => state.user.userNickname);
  const profileData = useSelector((state) => state.profile.profileData);
  const navigate = useNavigate();

  // 방 목록 가져오기
  const fetchRooms = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetch(
        // `${import.meta.env.VITE_LOCAL_API_BASE_URL}/game/rooms`,
        `${import.meta.env.VITE_API_BASE_URL}/game/rooms`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("방 목록을 불러오지 못했습니다");
      }

      const data = await response.json();

      const processedRooms = data.map(room => ({
        ...room,
        players : [...new Set(room.players)]
      }));      

      setRooms(data.sort((a, b) => b.roomId - a.roomId));
    } catch (error) {
      console.error("방 목록 조회 오류:", error);
      alert(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // WebSocket 연결
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        // new SockJS(`${import.meta.env.VITE_SOCKET_LOCAL_API_BASE_URL}`),
        new SockJS(`${import.meta.env.VITE_SOCKET_API_BASE_URL}`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

    });

    let roomSubscription = null;

    client.onConnect = () => {
      console.log("웹소켓 연결 성공");
      setStompClient(client);

      // 연결 성공 후에 구독 설정
      try {
        roomSubscription = client.subscribe(
          WS_ENDPOINTS.SUBSCRIBE_ROOMS,
          (message) => {
            try {
              const response = JSON.parse(message.body);
              console.log("방 목록 업데이트:", response);

              if (Array.isArray(response)) {
                const processedRooms = response.map(room => ({
                  ...room,
                  players: [...new Set(room.players || [])]
                }));
                setRooms(processedRooms.sort((a, b) => b.roomId - a.roomId));
              }
            } catch (error) {
              console.error("방 목록 메시지 처리 오류:", error);
            }
          }
        );

        // 초기 방 목록 요청
        client.publish({
          destination: "/app/game/rooms",
          body: JSON.stringify({}),
        });
      } catch (error) {
        console.error("구독 설정 오류:", error);
      }
    };

    client.onWebSocketError = (error) => {
      setStompClient(null);
    };

    client.onStompError = (frame) => {
    };

    try {
      client.activate();
    } catch (error) {
      console.error("클라이언트 활성화 오류:", error);
    }

    return () => {
      if (roomSubscription) {
        try {
          roomSubscription.unsubscribe();
        } catch (error) {
          console.error("구독 해제 오류:", error);
        }
      }
      
      if (client.connected) {
        try {
          client.deactivate();
        } catch (error) {
          console.error("연결 해제 오류:", error);
        }
      }
    };
  }, []);

  // 컴포넌트 마운트 시 최초 1회 조회
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleJoinRoom = useCallback(
    async (roomId, isPrivate, password = "") => {
      try {
        if (!stompClient?.connected) {
          alert("서버와 연결이 끊어졌습니다.");
          return;
        }

        const playerName = profileData?.userNickname || userNickname;
        if (!playerName) {
          alert("사용자 정보를 불러올 수 없습니다.");
          return;
        }

        // 방에 대한 구독 설정
        const subscription = stompClient.subscribe(
          WS_ENDPOINTS.SUBSCRIBE_GAME(roomId),
          (message) => {
            const response = JSON.parse(message.body);
            console.log("방 참가 응답:", response);

            if (response.code === 200) {
              subscription.unsubscribe(); // 구독 해제
              navigate(`/game/cockroach/${roomId}`);
            } else {
              alert(response.message || "방 참가에 실패했습니다.");
            }
          }
        );

        // 방 참가 요청
        stompClient.publish({
          destination: `/app${WS_ENDPOINTS.JOIN_ROOM}`,
          body: JSON.stringify({
            roomId,
            playerName,
            password,
          }),
        });
      } catch (error) {
        console.error("방 참가 오류:", error);
        alert(error.message);
      } finally {
        if (showPasswordModal) {
          setShowPasswordModal(false);
          setPassword("");
          setSelectedRoom(null);
        }
      }
    },
    [stompClient, profileData, userNickname, navigate, showPasswordModal]
  );

  const renderRoom = useCallback(
    (room, index) => {
      const uniqueKey = room.roomId
        ? `room-${room.roomId}`
        : `temp-room-${index}`;
        
      // 렌더링 시점에서도 한 번 더 중복 체크
      const uniquePlayers = [...new Set(room.players || [])];
      const currentPlayers = uniquePlayers.length;
      const isFull = currentPlayers >= room.maxPeople;


      return (
        <div key={uniqueKey} className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-2">
            {room.roomId} {room.roomTitle || room.gameType}
          </h3>
          <div className="text-sm text-gray-600 mb-2">
            참가자: {currentPlayers} / {room.maxPeople}
          </div>
          <div className="text-sm text-gray-500 mb-2">방장: {room.creator}</div>
          <button
            onClick={() => {
              if (room.isPrivate) {
                setSelectedRoom(room.roomId);
                setShowPasswordModal(true);
              } else {
                handleJoinRoom(room.roomId, false);
              }
            }}
            disabled={isFull}
            className={`w-full px-4 py-2 rounded text-white ${
              isFull
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {room.isPrivate ? "비밀번호 입력" : "참가하기"}
          </button>
        </div>
      );
    },
    [handleJoinRoom]
  );

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">방 목록을 불러오는 중...</h2>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">참가 가능한 방</h2>
        <button
          onClick={fetchRooms}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw
            className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "새로고침 중..." : "새로고침"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(rooms) && rooms.length > 0 ? (
          rooms.map(renderRoom)
        ) : (
          <div>방이 없습니다.</div>
        )}
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold mb-4">비밀번호 입력</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 mb-4"
              placeholder="비밀번호를 입력하세요"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleJoinRoom(selectedRoom, true, password)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                확인
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                  setSelectedRoom(null);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomList;
