// React와 필요한 훅, 컴포넌트들을 임포트
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PasswordChangePage from "./PasswordChangePage";
import UserDeletePage from "./UserDeletePage";
import Heejun from "../../assets/images/pixel_character/pixel-heejun.png";

// Redux 액션들과 API 임포트
import {
  fetchProfile,
  setPasswordModalOpen,
  resetUpdateSuccess,
  clearError,
  setDeleteModalOpen,
  updateProfile,
} from "../../sources/store/slices/ProfileSlice";
import MyAward from "./MyAward";
import MyFavoriteGame from "./MyFavoriteGame";
import MyCustomRequest from "./MyCustomRequest";
import MyInformation from "./MyInformation";
import ProfileBio from "./ProfileBio";

const ProfilePage = () => {
  // URL 파라미터에서 userId를 추출하고 Redux dispatch 함수 가져오기
  const { userId } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("info");

  // Redux store에서 필요한 상태들을 가져오기
  const {
    profileData: profile,
    isLoading,
    error,
    isPasswordModalOpen,
    isDeleteModalOpen,
    updateSuccess,
  } = useSelector((state) => state.profile);

  // LocalDateTime 형식과 input date 형식 간의 변환 함수들
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // "2024-01-26T00:00:00" -> "2024-01-26"
  };

  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    userName: "",
    userNickname: "",
    userBirthday: "",
  });

  // 컴포넌트 마운트 시 프로필 데이터 로드
  useEffect(() => {
    dispatch(fetchProfile(userId));
  }, [dispatch, userId]);

  // 프로필 데이터가 로드되면 폼 데이터 업데이트
  useEffect(() => {
    if (profile) {
      setFormData({
        userName: profile.userName,
        userNickname: profile.userNickname,
        userBirthday: formatDateForInput(profile.userBirthday),
        userBio: profile.userBio,
      });
    }
  }, [profile]);

  // 에러 발생 시 처리
  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // 로딩 상태 처리
  if (isLoading && !profile) return <div className="p-4">Loading...</div>;
  if (error && !profile)
    return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!profile) return null;

  // UI 렌더링
  return (
    <div className="min-h-screen mt-3">
      <div className="max-w-3xl mx-auto bg-zinc-900/80 rounded-[40px] border border-cyan-400/40">
        <div className="max-w-3xl mx-auto py-6 px-8">
          {/* 프로필 헤더 */}
          <div className="mb-8">
            <div className="rounded-xl p-7 bg-zinc-900/60 shadow-lg backdrop-blur-sm border border-zinc-700/50">
              <div className="flex items-start gap-8">
                {/* 프로필 이미지 */}
                <div className="relative w-36 h-36">
                  <div className="w-full h-full bg-white rounded-full overflow-hidden border-4 border-cyan-500 shadow-xl">
                    <img
                      src={Heejun}
                      alt="프로필"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* 사용자 정보 */}
                <div className="flex-1">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-4 mt-3">
                      <h1 className="text-[28px] font-bold text-white mb-2">
                        {profile.userNickname}
                      </h1>
                      <span className="text-cyan-400 text-md px-3 py-0.5 bg-cyan-950 rounded-full">
                        Lv.{profile.userLevel}
                      </span>
                    </div>
                    <div className="space-y-4">
                      <ProfileBio
                        initialBio={profile?.userBio}
                        onSave={async (newBio) => {
                          try {
                            await dispatch(
                              updateProfile({
                                userId,
                                data: { userBio: newBio },
                              })
                            ).unwrap();
                          } catch (error) {
                            console.error("자기소개 업데이트 실패:", error);
                            alert("자기소개 업데이트에 실패했습니다.");
                          }
                        }}
                      />
                      <div className="text-zinc-300 text-base font-medium">
                        15승 / 5무 / 0패
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 마이페이지 네비게이션 */}
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: "내 정보", id: "info" },
                { name: "내 업적", id: "achievements" },
                { name: "내 요청", id: "requests" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all
                    ${
                      activeTab === item.id
                        ? "bg-cyan-500 text-white"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* 탭 컨텐츠 */}
          <div>
            {activeTab === "info" && <MyInformation />}
            {activeTab === "achievements" && <MyAward />}
            {activeTab === "requests" && <MyCustomRequest />}
          </div>
        </div>
      </div>

      {/* 모달 컴포넌트들 */}
      {isPasswordModalOpen && (
        <PasswordChangePage
          userId={userId}
          onClose={() => dispatch(setPasswordModalOpen(false))}
        />
      )}
      {isDeleteModalOpen && (
        <UserDeletePage
          userId={userId}
          onClose={() => dispatch(setDeleteModalOpen(false))}
        />
      )}
    </div>
  );
};

export default ProfilePage;
