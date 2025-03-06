import React, { useEffect, useContext, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setRoomId } from "../../../sources/store/slices/BurumabulGameSlice";
import { SocketContext } from "../../layout/SocketLayout";
import { createPortal } from "react-dom";
import EnterSecretRoom from "../../game/burumabul/play/burumabul_Modal/EnterSecretRoom";
import { CircleX } from "lucide-react";
import WrongPasswordModal from "./play/burumabul_Modal/WrongPasswordModal";
import { setLoading } from "../../../sources/store/slices/BoardSlice";

const BurumabulRoomListCard = ({ roomInfo }) => {
  const {
    enterSecretWaitingRoom,
    roomSocketData,
    socketStatus,
    setSocketStatus,
  } = useContext(SocketContext);
  const navigate = useNavigate();
  const roomId = roomInfo.roomId;
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);
  const [passwordModal, setPasswordModal] = useState(false);
  const [enterPassword, setEnterPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const goToGeneralWaitingRoom = async (roomId) => {
    dispatch(setRoomId(roomInfo.roomId));
    navigate(`/game/burumabul/start/${roomId}`);
  };

  const goToSecretWaitingRoom = async (roomId) => {
    dispatch(setRoomId(roomInfo.roomId));
    setPasswordModal(true);
  };

  const handlePasswordSubmit = async (password) => {
    try {
      setIsLoading(true);
      await enterSecretWaitingRoom(password);
    } catch (error) {
      setErrorMessage(true);
    } finally {
      setIsLoading(false);
      setPasswordModal(false);
    }
  };

  useEffect(() => {
    if (socketStatus && socketStatus === 500) {
      setErrorMessage(true);
      setSocketStatus(null);
    }
  }, [socketStatus]);

  useEffect(() => {
    if (roomSocketData && roomSocketData.roomId === roomId) {
      navigate(`/game/burumabul/start/${roomId}`);
    }
  }, [roomSocketData]);

  return (
    <>
      {
        <div className="bg-white bg-opacity-70 rounded-lg w-[300px] shadow-lg overflow-hidden">
          {/* 카드 내용을 감싸는 컨테이너 */}
          <div className="w-full h-[120px] flex items-center justify-center">
            {/* 여기에 게임 관련 이미지나 아이콘을 추가*/}
          </div>

          {/* 방 정보 영역 */}
          <div className="bg-gray-800 bg-opacity-90 p-4 w-full">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white">Room.{roomId}</span>
                  <div
                    className="relative"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <div className="text-white overflow-hidden truncate max-w-[120px]">
                      {roomInfo.roomName}
                    </div>
                    {/* 커스텀 툴팁 */}
                    {showTooltip && roomInfo.roomName.length > 7 && (
                      <div className="absolute left-0 top-[-30px] bg-black text-white px-2 py-1 rounded text-sm whitespace-nowrap z-10">
                        {roomInfo.roomName}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-gray-300 mt-1">
                  방장 : {roomInfo.creator.playerName}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-white">
                  {roomInfo.players.length}/{roomInfo.maxPlayers}
                </div>
                {!roomInfo.private ? (
                  <button
                    onClick={() => goToGeneralWaitingRoom(roomId)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    입장
                  </button>
                ) : (
                  <button
                    onClick={() => goToSecretWaitingRoom(roomId)}
                    className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-lg transition-colors"
                  >
                    <LockKeyhole size={24} color="#ffffff" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      }

      {passwordModal &&
        createPortal(
          <div className="fixed inset-0 z-50 w-full text-center flex items-center justify-center">
            <EnterSecretRoom
              onSubmit={handlePasswordSubmit}
              onClose={() => setPasswordModal(false)}
              isLoading={isLoading}
            />
          </div>,
          document.body
        )}
      {errorMessage &&
        createPortal(
          <div className="fixed inset-0 z-50 flex flex-row justify-center items-center">
            <WrongPasswordModal onClose={() => setErrorMessage(false)} />
          </div>,
          document.body
        )}
    </>
  );
};

export default BurumabulRoomListCard;
