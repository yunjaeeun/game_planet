import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useDispatch, useSelector } from "react-redux";
import { addFriendRequest } from "../sources/store/slices/FriendSlice";

const useFriendSocket = () => {
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef(null);
  const [responseSocket, setResponseSocket] = useState("");

  const friendsRequsets = useSelector((state) => state.friend.friendRequests);
  const userId = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!userId) return;

    // WebSocket 연결
    // const socket = new SockJS(
    //   `${import.meta.env.VITE_SOCKET_LOCAL_API_BASE_URL}`
    // ); // 로컬 서버 소켓 통신
    const socket = new SockJS(`${import.meta.env.VITE_SOCKET_API_BASE_URL}`); // 배포 서버 소켓 통신
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      setConnected(true);

      // 친구 요청 알림 구독
      stompClient.subscribe(`/topic/user/${userId}`, (message) => {
        const receivedData = message.body;
        console.log("원본 메시지:", message);
        console.log("메시지 헤더:", message.headers);
        console.log("메시지 바디:", message.body);
        console.log("친구 요청 알림 수신 : ", receivedData);
        setResponseSocket(receivedData);
        console.log(receivedData);
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("X WebSocket Error", frame.headers["message"]);
    };

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      // 컴포넌트 언마운트 시 연결 해제
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.deactivate();
        setConnected(false);
      }
    };
  }, [userId]);

  return {
    connected,
    responseSocket,
    stompClientRef,
  };
};

export default useFriendSocket;
