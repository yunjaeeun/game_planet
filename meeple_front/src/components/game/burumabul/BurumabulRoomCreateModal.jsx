import React, { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createBurumabulRoom } from "../../../sources/api/BurumabulRoomAPI";
import { useDispatch, useSelector } from "react-redux";
import { setRoomId } from "../../../sources/store/slices/BurumabulGameSlice";

const BurumabulRoomCreateModal = ({ onClose }) => {
  const userId = useSelector((state) => state.user.userId);
  const [showPassword, setShowPassword] = useState(false);

  const initialRoomData = {
    roomName: "",
    isPrivate: false,
    password: "",
    maxPlayers: 2,
  };
  const [roomData, setRoomData] = useState(initialRoomData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(roomData);
      const response = await createBurumabulRoom(userId, roomData);
      const roomId = response.roomId;
      dispatch(setRoomId(roomId));
      navigate(`/game/burumabul/start/${roomId}`);
    } catch (error) {
      console.error("방 생성 중 오류 발생 : ", error);
    }
  };

  const handlePassword = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 입력 가능
    if (value.length > 8) value = value.slice(0, 8); // 최대 8자리 제한
    setRoomData((prevData) => ({
      ...prevData,
      password: value,
    }));
  };

  const handleCancel = () => {
    setRoomData(initialRoomData); // roomData 초기화
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-blue-200 bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-96 p-6 bg-slate-900 bg-opacity-80 rounded-lg flex flex-col justify-center items-center">
        <h1 className="text-3xl text-white ">부루마불 방 만들기</h1>
        <hr className="w-80 border-t-2 border-white my-2" />
        <div className="bg-white w-full py-3 my-3 rounded-lg">
          <form onSubmit={handleSubmit} className="text-center">
            {/* 방 제목 */}
            <div className="flex flex-col items-center">
              <label
                className="text-xl block mt-2 text-gray-900"
                htmlFor="roomTitle"
              >
                방 제목
              </label>
              <hr className="w-80 border-t-2 border-gray-400 my-2" />
              <input
                type="text"
                value={roomData.roomName}
                className="w-72 h-8 pl-3 pr-3 mx-3 min-w-0 rounded-lg bg-slate-400 outline-1 -outline-offset-1 outline-black has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-slate-600"
                onChange={(e) =>
                  setRoomData({ ...roomData, roomName: e.target.value })
                }
                required
              />
            </div>

            {/* 비밀방 선택 */}
            <div className="flex flex-row justify-center items-center my-2">
              <label
                className="text-xl block my-2 text-gray-900"
                htmlFor="privateCheck"
              >
                비밀방
              </label>
              <div>
                <button
                  className={`bg-green-500 mx-2 text-white w-14 rounded ${
                    roomData.isPrivate ? "bg-green-500" : "bg-slate-500"
                  }`}
                  value={roomData.isPrivate}
                  onClick={() =>
                    setRoomData((prevData) => ({
                      ...prevData,
                      isPrivate: true,
                      // private: true,
                    }))
                  }
                  type="button"
                >
                  YES
                </button>
                <button
                  className={`"bg-red-500" mx-2 text-white w-14 rounded ${
                    roomData.isPrivate ? "bg-slate-500" : "bg-red-500"
                  }`}
                  value={roomData.isPrivate}
                  onClick={() =>
                    setRoomData((prevData) => ({
                      ...prevData,
                      isPrivate: false,
                      password: "",
                      // private: false,
                    }))
                  }
                  type="button"
                >
                  NO
                </button>
              </div>
            </div>
            {/* 비밀방이면 비밀번호 설정 */}
            <div>
              {roomData.isPrivate && (
                <div className="flex flex-col items-center my-3">
                  <label className="text-lg" htmlFor="password">
                    비밀번호 설정(숫자 8자리)
                  </label>
                  <hr className="w-80 border-t-2 border-gray-400 my-2" />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-40 bg-slate-400 h-8 rounded-lg pl-3 pr-10"
                      placeholder="비밀번호를 입력하세요..."
                      value={roomData.password}
                      onChange={handlePassword}
                      required
                    />
                    <button
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 bottom-1.5 text-gray-500"
                      type="button"
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* 플레이어 수 선택 */}
            <div className="flex flex-col items-center">
              <h2 className="text-lg">플레이어 수 선택</h2>
              <hr className="w-80 border-t-2 border-gray-400 my-2" />
              <div className="my-1">
                <button
                  className={`bg-blue-200 text-gray-500 w-14 rounded mx-2 ${
                    roomData.maxPlayers === 2 ? "bg-blue-400" : "bg-blue-200"
                  }`}
                  value={roomData.maxPlayers}
                  onClick={() =>
                    setRoomData((prevData) => ({
                      ...prevData,
                      maxPlayers: Number(2),
                    }))
                  }
                  type="button"
                >
                  2인
                </button>
                <button
                  className={`bg-blue-200 text-gray-500 w-14 rounded mx-2 ${
                    roomData.maxPlayers === 3 ? "bg-blue-400" : "bg-blue-200"
                  }`}
                  value={roomData.maxPlayers}
                  onClick={() =>
                    setRoomData((prevData) => ({
                      ...prevData,
                      maxPlayers: Number(3),
                    }))
                  }
                  type="button"
                >
                  3인
                </button>
                <button
                  className={`bg-blue-200 text-gray-500 w-14 rounded mx-2 ${
                    roomData.maxPlayers === 4 ? "bg-blue-400" : "bg-blue-200"
                  }`}
                  value={roomData.maxPlayers}
                  onClick={() =>
                    setRoomData((prevData) => ({
                      ...prevData,
                      maxPlayers: Number(4),
                    }))
                  }
                  type="button"
                >
                  4인
                </button>
              </div>
            </div>
            {/* 방 생성 or 취소 */}
            <div className="flex flex-row justify-evenly my-3">
              <button
                className="bg-red-500 rounded-lg text-white w-24"
                onClick={handleCancel}
              >
                취소
              </button>
              {/* 일단 생성 누르면 부루마불 대기방으로 */}
              <button
                className="bg-green-500 rounded-lg text-white w-24"
                onClick={handleSubmit}
                type="submit"
              >
                생성
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BurumabulRoomCreateModal;
