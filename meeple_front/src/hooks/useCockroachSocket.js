import { useEffect, useRef, useCallback, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";


// WebSocket URL constants
export const WS_ENDPOINTS = {
  SUBSCRIBE_ROOMS: "/topic/game/rooms",
  JOIN_ROOM: "/game/join-room",
  CHAT: (roomId) => `/game/chat/${roomId}`,
  UPDATE_ROOM: (roomId) => `/game/update-room/${roomId}`,
  START_GAME: (roomId) => `/game/start-game/${roomId}`,
  GIVE_CARD: (roomId) => `/game/give-card/${roomId}`,
  SINGLE_CARD: (roomId) => `/game/single-card/${roomId}`,
  MULTI_CARD: (roomId) => `/game/multi-card/${roomId}`,
  EXIT_ROOM: (roomId) => `/game/exit-room/${roomId}`,
  SEND_VOTE: (roomId) => `/game/send-vote/${roomId}`,
  VOTE: (roomId) => `/game/vote/${roomId}`,
  VOTE_RESULT: (roomId) => `/game/vote-result/${roomId}`,
  HAND_CHECK: (roomId) => `/game/hand-check/${roomId}`,
  // Subscribe endpoints
  SUBSCRIBE_GAME: (roomId) => `/topic/game/${roomId}`,
  SUBSCRIBE_CHAT: (roomId) => `/topic/messages/${roomId}`,
};

const useCockroachSocket = (roomId) => {
  const clientRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const isConnecting = useRef(false);
  const subscriptionsRef = useRef(new Map());
  const isGameStartedRef = useRef(false);

  const handleGameMessage = useCallback((response) => {
    console.log("게임 메시지 처리 시작:", response);
  },[]);

  const connect = useCallback(() => {
    if (isConnecting.current) return;
    isConnecting.current = true;

    const client = new Client({
      webSocketFactory: () => {
        const socket = new SockJS(
          // `${import.meta.env.VITE_SOCKET_LOCAL_API_BASE_URL}`
          `${import.meta.env.VITE_SOCKET_API_BASE_URL}`
        );

        socket.onclose = () => {
          console.log("웹소켓 연결이 끊겼습니다.");
          setTimeout(() => {
            connect();
          }, 1000);
        };

        return socket;
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // 구독 설정 함수
    const setupSubscriptions = () => {
      // 게임방 내부
      if (!subscriptionsRef.current.has("game")) {
        const gameSubscription = client.subscribe(
          WS_ENDPOINTS.SUBSCRIBE_GAME(roomId),
          (message) => {
            const response = JSON.parse(message.body);
            handleGameMessage(response);
          }
        );
        subscriptionsRef.current.set("game", gameSubscription);
      }

      // 채팅 메시지 구독
      if (!subscriptionsRef.current.has("chat")) {
        const chatSubscription = client.subscribe(
          WS_ENDPOINTS.SUBSCRIBE_CHAT(roomId),
          (message) => {
            const newMessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, newMessage]);
          }
        );
        subscriptionsRef.current.set("chat", chatSubscription);
      }
    };

    // Connect 이벤트 핸들러
    client.onConnect = () => {
      console.log("웹소켓 연결 완료");
      setConnected(true);
      setStompClient(client);
      isConnecting.current = false;
      setupSubscriptions();
    };

    // Disconnect 이벤트 핸들러
    client.onDisconnect = () => {
      console.log("웹소켓 연결이 끊겼습니다.");
      setConnected(false);
      setStompClient(null);
      isConnecting.current = false;
      setTimeout(() => connect(), 1000);
    };

    client.onWebSocketError = (error) => {
      console.error("웹소켓 에러:", error);
    };

    clientRef.current = client;
    client.activate();
  }, [roomId, handleGameMessage]);

  const sendMessage = useCallback(
    (type, data) => {
      if (!clientRef.current?.connected) {
        console.error("웹소켓이 연결 되었습니다.");
        return Promise.reject(new Error("웹소켓 연결 끊김"));
      }

      const endpoint =
        WS_ENDPOINTS[type]?.(roomId) || WS_ENDPOINTS.CHAT(roomId);

      console.log("보낸 웹소켓 메시지:", {
        destination: `/app${endpoint}`,
        type,
        data,
      });

      return new Promise((resolve, reject) => {
        try {
          clientRef.current.publish({
            destination: `/app${endpoint}`,
            body: JSON.stringify(data),
          });
          console.log("메시지를 성공적으로 보냈습니다.");
          resolve();
        } catch (error) {
          console.error("메시지 전송 실패", error);
          reject(error);
        }
      });
    },
    [roomId]
  );

  // Specific message sending functions
  const gameActions = {
    joinRoom: (data) => sendMessage("JOIN_ROOM", data),
    sendChat: (message) => sendMessage("CHAT", { message }),
    updateRoom: (data) => sendMessage("UPDATE_ROOM", data),
    startGame: () => sendMessage("START_GAME", {}),
    giveCard: (data) => sendMessage("GIVE_CARD", data),
    checkSingleCard: (data) => sendMessage("SINGLE_CARD", data),
    checkMultiCard: (data) => sendMessage("MULTI_CARD", data),
    exitRoom: (nickname) =>
      sendMessage("EXIT_ROOM", { userNickname: nickname }),
    sendVote: (data) => sendMessage("SEND_VOTE", data),
    vote: (data) => sendMessage("VOTE", data),
    sendVoteResult: (data) => sendMessage("VOTE_RESULT", data),
    checkHand: (data) => sendMessage("HAND_CHECK", data),
  };

  useEffect(() => {
    if (roomId) {
      connect();
    }
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [roomId, connect]);

  return {
    connected,
    messages,
    stompClient,
    ...gameActions,
  };
};

export default useCockroachSocket;
