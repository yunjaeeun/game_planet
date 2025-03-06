import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import background from "../../../../assets/burumabul_images/waitingroom.gif";
import PlayerCard from "./PlayerCard";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import FriendSearch from "../../FriendSearch";
import { connect, useDispatch, useSelector } from "react-redux";
import { putBurumabulRoom } from "../../../../sources/api/BurumabulRoomAPI";
import PutBurumabulRoom from "../PutBurumabulRoom";
import PlayerAlertModal from "./PlayerAlertModal";
import { createPortal } from "react-dom";
import { fetchFriendList } from "../../../../sources/api/FriendApi";
import { findBurumabulRoom } from "../../../../sources/api/BurumabulRoomAPI";
import { SocketContext } from "../../../layout/SocketLayout";
import ChangePasswordModal from "../play/burumabul_Modal/ChangePasswordModal";
import WaitingChat from "../play/burumabul_Modal/WaitingChat";

// 백엔드 연결 필요
const WaitingRoom = ({ roomId, roomInfo, setIsStart, setPlayData }) => {
  console.log(roomId);

  const userId = Number(useSelector((state) => state.user.userId));
  const [currentRoomInfo, setCurrentRoomInfo] = useState(roomInfo);
  useEffect(() => {
    if (roomInfo && Object.keys(roomInfo).length > 0) {
      setCurrentRoomInfo(roomInfo);
      setRoomName(roomInfo.roomName);
      setMaxPlayers(roomInfo.maxPlayers);
      setPlayerLen(roomInfo.players.length);
    }
  }, [roomInfo]);

  const {
    connected,
    roomSocketData,
    leaveGame,
    createBurumabulPlay,
    gamePlaySocketData,
  } = useContext(SocketContext);

  const [showPutRoomModal, setShowPutRoomModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [friendList, setFriendList] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log("소켓 데이터", SocketContext);

  const playersInfo = currentRoomInfo.players;
  const [roomName, setRoomName] = useState(currentRoomInfo.roomName);
  const [maxPlayers, setMaxPlayers] = useState(currentRoomInfo.maxPlayers);
  const [playerLen, setPlayerLen] = useState(currentRoomInfo.players.length);
  const creatorId = Number(currentRoomInfo.creator.playerId);
  const isPrivate = currentRoomInfo.private;

  useEffect(() => {
    if (!roomSocketData) return;
    setCurrentRoomInfo((prev) => ({
      ...prev,
      ...roomSocketData,
    }));

    if (roomSocketData.roomName) setRoomName(roomSocketData.roomName);
    if (roomSocketData.maxPlayers) setMaxPlayers(roomSocketData.maxPlayers);
    if (roomSocketData.players) setPlayerLen(roomSocketData.players.length);
  }, [roomSocketData]);

  useEffect(() => {
    const getFriendList = async () => {
      if (roomId) {
        try {
          const response = await fetchFriendList(userId);
          setFriendList(response);
        } catch (error) {
          console.log("친구 목록 로드 중 에러");
        } finally {
          setLoading(false);
        }
      }
    };
    getFriendList();
  }, [roomId]);

  useEffect(() => {
    const getRoomInfo = async () => {
      if (roomId) {
        try {
          const response = await findBurumabulRoom(roomId);
          setCurrentRoomInfo(response);
        } catch (error) {
          console.error("방 정보 조회 중 오류 발생 : ", error);
        } finally {
          setLoading(false);
        }
      }
    };
    getRoomInfo();
  }, [roomId]);

  useEffect(() => {
    if (connected && roomSocketData) {
      setCurrentRoomInfo((prev) => ({
        ...prev,
        ...roomSocketData,
      }));

      if (roomSocketData.roomName) setRoomName(roomSocketData.roomName);
      if (roomSocketData.maxPlayers) setMaxPlayers(roomSocketData.maxPlayers);
      if (roomSocketData.players) setPlayerLen(roomSocketData.players.length);
    }
  }, [connected, roomSocketData]);

  if (loading) {
    return <div>Loading Room Informangition</div>;
  }

  console.log(currentRoomInfo);

  const handlePutRoom = () => {
    setShowPutRoomModal(true);
  };

  const handleAlertModal = () => {
    setShowAlertModal(true);
  };

  const showChangePassword = () => {
    setShowPasswordModal(true);
  };

  //
  const goToGame = () => {
    if (connected && roomId && playersInfo) {
      try {
        const playerList = playersInfo.map((player) => player.playerId);
        const playInfo = {
          gamePlayId: roomId,
          players: playerList,
        };
        console.log("게임 생성 시도", playInfo);
        createBurumabulPlay(playInfo);
        setPlayData(gamePlaySocketData);
        setIsStart(true);
      } catch (error) {
        console.error("부루마불 플레이 생성 실패 :", error);
      }
    }
  };

  const leaveTheRoom = () => {
    if (connected) {
      leaveGame();
      navigate("/home");
    }
  };
  return (
    <>
      <style>{`
        .thin-scrollbar::-webkit-scrollbar { width: 5px; padding-right: 12px; position: absolute; right: 0;}
        .thin-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .thin-scrollbar::-webkit-scrollbar-thumb { background: #888; border-radius: 15px;}
        .thin-scrollbar::-webkit-scrollbar-track { display: none; }
        .thin-scrollbar {padding-right: 10px;}
      `}</style>
      <div
        className="h-screen w-full bg-cover bg-center relative flex justify-center items-center"
        style={{ backgroundImage: `url(${background}` }}
      >
        <div className="min-h-[600px] w-[880px] bg-black bg-opacity-30 rounded-lg flex flex-col justify-start items-center">
          {/* 친구 검색해서 친구 추가 */}
          <div className="mt-5">
            <FriendSearch friendList={friendList} />
          </div>
          <div className="flex flex-col items-center my-5">
            <div className="flex flex-row justify-center items-center mt-5">
              <h1 className="text-white text-3xl mx-2 text-center break-words w-[400px] truncate">
                {roomName}
              </h1>
              <span className="mx-2">
                {/* 비밀방이면 자물쇠 걸려있고 */}
                {isPrivate && (
                  <LockKeyhole size={20} color="#ce47ff" strokeWidth={2.25} />
                )}
                {/* 아니면 열려있게 */}
                {!isPrivate && (
                  <LockKeyholeOpen
                    size={20}
                    color="#ce47ff"
                    strokeWidth={2.25}
                  />
                )}
              </span>
              <span className="mx-1 text-white text-nowrap">
                {playerLen} / {maxPlayers}
              </span>
            </div>

            {/* 플레이어 카드 */}
            <div className="mt-10 mx-auto flex flex-wrap justify-center gap-6 my-4 overflow-y-auto thin-scrollbar">
              {playersInfo.map((player, index) => (
                <PlayerCard key={index} playerInfo={player} />
              ))}
            </div>

            {/* 하단 버튼 */}
            <div className="w-full flex flex-row justify-between my-10 px-10">
              <button
                className="relative overflow-hidden text-lg font-semibold text-white mx-10 bg-gradient-to-r from-red-400 to-red-500 border-2 border-red-600 w-32 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-white before:opacity-20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-all before:duration-700"
                onClick={leaveTheRoom}
              >
                방 나가기
              </button>
              {userId && creatorId && Number(userId) === Number(creatorId) ? (
                <div>
                  {Number(maxPlayers) === Number(playerLen) ? (
                    <div className="flex flex-row">
                      {isPrivate && (
                        <button
                          className="relative overflow-hidden text-lg font-semibold text-white mx-5 bg-gradient-to-r from-fuchsia-200 to-fuchsia-400 border-2 border-fuchsia-600 w-32 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-white before:opacity-20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-all before:duration-700"
                          onClick={showChangePassword}
                        >
                          비밀번호 변경
                        </button>
                      )}
                      <button
                        className="relative overflow-hidden text-lg font-semibold text-white mx-5 bg-gradient-to-r from-yellow-200 to-yellow-500 border-2 border-yellow-600 w-32 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-white before:opacity-20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-all before:duration-700"
                        onClick={handlePutRoom}
                      >
                        게임방 수정
                      </button>
                      <button
                        className="relative overflow-hidden text-lg font-semibold text-white mx-10 bg-gradient-to-r from-cyan-500 to-blue-500 border-2 border-blue-600 w-32 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-white before:opacity-20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-all before:duration-700"
                        onClick={goToGame}
                      >
                        게임 시작
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-row">
                      {isPrivate && (
                        <button
                          onClick={showChangePassword}
                          className="relative overflow-hidden text-lg font-semibold text-white mx-5 bg-gradient-to-r from-fuchsia-200 to-fuchsia-400 border-2 border-fuchsia-600 w-32 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-white before:opacity-20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-all before:duration-700"
                        >
                          비밀번호 변경
                        </button>
                      )}
                      <button
                        className="relative overflow-hidden text-lg font-semibold text-white mx-5 bg-gradient-to-r from-yellow-200 to-yellow-500 border-2 border-yellow-600 w-32 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-white before:opacity-20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-all before:duration-700"
                        onClick={handlePutRoom}
                      >
                        게임방 수정
                      </button>
                      <button
                        className="text-lg text-white mx-10 bg-gray-500 border-2 w-32 h-12 rounded "
                        onClick={handleAlertModal}
                      >
                        게임 시작
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>게임준비</div>
              )}

              {/* <button className="mx-3">게임 준비</button> */}
            </div>
          </div>
        </div>
        <div className="w-[250px] bg-white rounded-lg">
          <WaitingChat roomId={roomId} players={playersInfo} />
        </div>
      </div>

      {showPutRoomModal && (
        <PutBurumabulRoom
          originRoomData={currentRoomInfo}
          onClose={() => setShowPutRoomModal(false)}
        />
      )}

      {showAlertModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex flex-row justify-center items-center ">
            <PlayerAlertModal onClose={() => setShowAlertModal(false)} />
          </div>,
          document.body
        )}

      {isPrivate &&
        showPasswordModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex flex-row justify-center items-center">
            <ChangePasswordModal
              onClick={showChangePassword}
              onClose={() => setShowPasswordModal(false)}
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default WaitingRoom;
