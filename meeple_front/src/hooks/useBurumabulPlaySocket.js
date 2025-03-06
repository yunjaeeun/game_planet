import { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useDispatch, useSelector } from "react-redux";
import {
  addPlayer,
  removePlayer,
  movePlayer,
  updateMinusBalance,
  updatePlusBalance,
  nextTurn,
  nextRound,
} from "../sources/store/slices/BurumabulGameSlice";

const useBurumabulPlaySocket = (roomId) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const stompClientRef = useRef(null);
  const gameData = useSelector((state) => state.burumabul);
  const dispatch = useDispatch();

  const cleanupSubscriptions = useRef(() => {});

  useEffect(() => {
    if (!gameData || !roomId) {
      console.warn("게임 데이터 또는 방 ID가 없습니다.");
      return;
    }

    // const socket = new SockJS(
    //   `${import.meta.env.VITE_SOCKET_LOCAL_API_BASE_URL}`
    // ); // 로컬 서버 소켓 통신 URL
    const socket = new SockJS(`${import.meta.env.VITE_SOCKET_API_BASE_URL}`); // 배포 서버 소켓 통신 URL
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.debug(str);
      },
    });

    stompClient.onConnect = () => {
      console.log("부루마불 게임방 웹소켓 연결");
      setConnected(true);

      if (!roomId) {
        console.error("유효하지 않은 구독: ", roomId);
        return;
      }

      // 게임 상태 구독
      const gamePlaySubscribe = stompClient.subscribe(
        `/topic/game-plays/${gameData.gamePlayId}`,
        (message) => {
          try {
            const gamePlayData = JSON.parse(message.body);
            console.log(" 서버에서 받은 게임 상태 :", gamePlayData);
            dispatch({ type: "burumabul/setGameData", payload: gamePlayData });
          } catch (error) {
            console.error("게임 상태 처리 중 오류 :", error);
          }
        }
      );

      // 주사위 결과 알림 구독
      const diceRollResultSubscribe = stompClient.subscribe(
        `/topic/game-plays/${roomId}`,
        (message) => {
          try {
            const diceRollResult = JSON.parse(message.body);
            console.log("주사위 결과 : ", diceRollResult);
            // 주사위 결과 저장
            dispatch({
              type: "burumabul/handleDiceRoll",
              payload: diceRollResult,
            });
          } catch (error) {
            console.error("주사위 결과 처리 중 오류 : ", error);
          }
        }
      );

      cleanupSubscriptions.current = () => {
        gamePlaySubscribe.unsubscribe();
        diceRollResultSubscribe.unsubscribe();
      };
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP 오류:", frame);
      setError(`연결 오류 ${frame.headers.message}`);
      setConnected(false);
    };

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      cleanupSubscriptions.current();
      if (stompClient.activate) {
        stompClient.deactivate();
      }
    };
  }, [roomId, gameData?.gamePlayId, dispatch]);

  const createGame = useCallback(() => {
    if (!stompClientRef.current?.connected) {
      console.warn("웹소켓이 연결되어 있지 않습니다.");
      return;
    }

    try {
      const playerIds = gameData.players.map((player) => player.playerId);

      stompClientRef.current.publish({
        destination: "/game/blue-marble/game-plays/create",
        body: JSON.stringify({
          gmaePlayId: roomId,
          playerIds: playerIds,
        }),
      });
    } catch (error) {
      console.error("게임 생성 요청 중 오류 :", error);
      setError("게임을 생성하는 중 오류가 발생했습니다.");
    }
  }, [roomId, gameData?.players]);

  const rollTheDice = useCallback(
    (firstDice, secondDice) => {
      if (!stompClientRef.current?.connected) {
        console.warn("웹소켓이 연결되어 있지 않습니다.");
        return;
      }

      try {
        if (!firstDice || !secondDice) {
          console.error("주사위가 굴려지지 않았습니다.");
          return;
        }
        stompClientRef.current.publish({
          destination: `game/blue-marble/game-plays/${roomId}/roll-dice`,
          body: JSON.stringify({
            firstDice: firstDice,
            secondDice: secondDice,
          }),
        });
      } catch (error) {
        console.error("주사위 굴리기 요청 중 오류 : ", error);
        setError("주사위를 굴리는 중 오류가 발생했습니다.");
      }
    },
    [roomId, gameData?.players]
  );

  return {
    connected,
    error,
    createGame,
    rollTheDice,
  };
};

export default useBurumabulPlaySocket;
