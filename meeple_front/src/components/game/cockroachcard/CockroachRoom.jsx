import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setRoomData } from "../../../sources/store/slices/CockroachSlice";
import CreateRoomModal from "./modal/CreateRoomModal";
import RoomList from "./RoomList";
import { fetchProfile } from "../../../sources/store/slices/ProfileSlice";

const CockroachRoom = () => {
  const navigate = useNavigate();
  const [isCreateRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.user.userId);  // 리덕스에서 userId만 가져오기
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        navigate('/home');
        return;
      }

      try {
        const response = await fetch(
          // `${import.meta.env.VITE_LOCAL_API_BASE_URL}/profile/${userId}`
          `${import.meta.env.VITE_API_BASE_URL}/profile/${userId}`
        );
        if (!response.ok) throw new Error("프로필을 가져오는데 실패했습니다.");
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("프로필 조회 오류:", error);
        setError(error.message);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  const handleCreateRoom = async (roomData) => {
    try {
      setError(null);

      if (!profileData?.userNickname) {
        throw new Error("사용자 정보를 불러올 수 없습니다.");
      }

      const response = await fetch(
        // `${import.meta.env.VITE_LOCAL_API_BASE_URL}/game/create-room`,
        `${import.meta.env.VITE_API_BASE_URL}/game/create-room`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...roomData,
            creator: profileData.userNickname,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "방 생성에 실패했습니다.");
      }

      const data = await response.json();

      if (!data.roomId) {
        throw new Error("방 ID가 없습니다.");
      }

      // 세션스토리지에 방 정보 저장
      sessionStorage.setItem(`room_${data.roomId}`, JSON.stringify({
        roomId: data.roomId,
        creator: profileData.userNickname,
        roomTitle: roomData.roomTitle,
        roomInfo: data.roomInfo || {},
      }));

      setCreateRoomModalOpen(false);

      // 잠시 대기 후 페이지 이동
      setTimeout(() => {
        navigate(`/game/cockroach/${data.roomId}`);
      }, 500);

    } catch (error) {
      console.error("방 생성 오류:", error);
      setError(error.message);
      alert(error.message);
    }
  };

  // 에러가 있을 경우 표시
  useEffect(() => {
    if (error) {
      console.error("Error:", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">바퀴벌레 포커</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">방 만들기</h2>
            <p className="text-gray-600 mb-4">
              새로운 게임방을 만들어 친구들과 함께 플레이하세요!
            </p>
            <button
              onClick={() => setCreateRoomModalOpen(true)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              disabled={!profileData?.userNickname}
            >
              방 만들기
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">현재 진행중인 방</h2>
            <RoomList />
          </div>
        </div>
      </div>

      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={() => setCreateRoomModalOpen(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
};

export default CockroachRoom;
