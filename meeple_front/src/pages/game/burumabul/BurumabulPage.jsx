import React, { useCallback, useEffect, useState, useContext } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useBurumabulSocket from "../../../hooks/useBurumabulSocket";
import WaitingRoom from "../../../components/game/burumabul/waiting/WaitingRoom";
import BurumabulPlay from "../../../components/game/burumabul/play/BurumabulPlay";
import { useSelector } from "react-redux";
import { findBurumabulRoom } from "../../../sources/api/BurumabulRoomAPI";
import { SocketContext } from "../../../components/layout/SocketLayout";

const BurumabulPage = () => {
  const roomId = useSelector((state) => state.burumabul.roomId);
  console.log("BurumabulPage received roomId:", roomId);
  const navigate = useNavigate();
  const userId = Number(useSelector((state) => state.user.userId));
  const [currentRoomInfo, setCurrentRoomInfo] = useState({});
  // 초기 게임 플레이 데이터
  const [playData, setPlayData] = useState(null);

  useEffect(() => {
    const getRoomInfo = async () => {
      if (roomId) {
        try {
          const response = await findBurumabulRoom(roomId);
          setCurrentRoomInfo(response || {});
        } catch (error) {
          console.error("방 정보 조회 중 오류 발생 : ", error);
        }
      }
    };
    getRoomInfo();
  }, [roomId]);

  const [isStart, setIsStart] = useState(false);
  const [roomMessage, setRoomMessage] = useState("");

  const { connected, enterWaitingRoom, roomSocketData, gamePlaySocketData } =
    useContext(SocketContext);

  useEffect(() => {
    const initializeRoom = async () => {
      if (!roomId) return;

      try {
        const response = await findBurumabulRoom(roomId);
        console.log("방정보 조회 결과 :", response);
        setCurrentRoomInfo(response);

        if (connected && response) {
          const isCreator = response.creator?.playerId === userId;
          const isExistingPlayer = response.players?.some(
            (player) => player.playerId === userId
          );
          if (!isCreator && !isExistingPlayer) {
            console.log("새로운 플레이어 입장 시도:", {
              userId,
              roomId,
              isCreator,
              isExistingPlayer,
            });
            enterWaitingRoom();
          }
        }
      } catch (error) {
        console.error("방 정보 조회/입장 중 오류:", error);
      }
    };
    initializeRoom();
  }, [roomId, connected, userId, enterWaitingRoom]);

  useEffect(() => {
    if (gamePlaySocketData) {
      console.log("새로운 gamePalySocetData 수신:", gamePlaySocketData);
      setPlayData(gamePlaySocketData);
      setIsStart(true);
    }
  }, [gamePlaySocketData]);

  useEffect(() => {
    console.log("현재 roomSocketData 상태:", roomSocketData);
    if (roomSocketData) {
      setCurrentRoomInfo((prev) => ({
        ...prev,
        ...roomSocketData,
      }));
    }
  }, [roomSocketData]);

  return (
    <>
      {Object.keys(currentRoomInfo).length === 0 ? (
        <div>Loading...</div>
      ) : playData && playData.gameStatus === "IN_PROGRESS" ? (
        <BurumabulPlay
          roomId={roomId}
          currentRoomInfo={currentRoomInfo}
          setIsStart={setIsStart}
          playData={playData}
        />
      ) : (
        <WaitingRoom
          roomId={roomId}
          roomInfo={currentRoomInfo}
          setIsStart={setIsStart}
          setPlayData={setPlayData}
        />
      )}
    </>
  );
};

export default BurumabulPage;
