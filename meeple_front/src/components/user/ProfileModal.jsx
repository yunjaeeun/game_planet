import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Heejun from "../../assets/images/pixel_character/pixel-heejun.png";
import { Siren, CheckCircle2, XCircle } from "lucide-react";
import { useSelector } from "react-redux";
import {
  sendFriendRequest,
  fetchFriendList,
} from "../../sources/api/FriendApi";
import axios from "axios";
import ReportFormModal from "./ReportFormModal";

/**
 * 커스텀 알림 컴포넌트
 */
const Alert = ({ type, message }) => {
  const bgColor = type === "success" ? "bg-green-500/10" : "bg-red-500/10";
  const borderColor =
    type === "success" ? "border-green-500/50" : "border-red-500/50";
  const textColor = type === "success" ? "text-green-100" : "text-red-100";
  const Icon = type === "success" ? CheckCircle2 : XCircle;
  const iconColor = type === "success" ? "text-green-500" : "text-red-500";

  return (
    <div
      className={`rounded-lg p-3 ${bgColor} border ${borderColor} shadow-lg`}
    >
      <div className="flex items-center">
        <Icon className={`h-4 w-4 ${iconColor} mr-2`} />
        <span className={textColor}>{message}</span>
      </div>
    </div>
  );
};

const ProfileModal = ({
  onClose,
  userNickname,
  userLevel,
  getAnchorRect,
  onReport,
}) => {
  const modalRef = useRef();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const userId = useSelector((state) => state.user.userId);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [showReportForm, setShowReportForm] = useState(false);

  const updatePosition = () => {
    const anchorRect = getAnchorRect();
    if (anchorRect) {
      const modalWidth = 100;
      const rightSpace = window.innerWidth - anchorRect.right;
      const left =
        rightSpace < modalWidth
          ? anchorRect.right - modalWidth
          : anchorRect.right - modalWidth;

      setPosition({
        top: anchorRect.bottom + 13,
        left: Math.max(16, left),
      });
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
      if (type === "success") {
        onClose();
      }
    }, 2000);
  };

  const checkFriendStatus = async (friendId) => {
    try {
      const friendList = await fetchFriendList(userId);
      return friendList.some(
        (friend) =>
          friend.friend.userId === friendId &&
          friend.friendStatus === "ACCEPTED"
      );
    } catch (error) {
      console.error("친구 목록 조회 중 오류 발생:", error);
      return false;
    }
  };

  const handleFriendRequest = async () => {
    if (!userId || isLoading) return;

    try {
      setIsLoading(true);
      // 닉네임으로 유저 검색
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/friend/search?userNickName=${userNickname}`
        // `${
        //   import.meta.env.VITE_LOCAL_API_BASE_URL
        // }/friend/search?userNickName=${userNickname}`
      );
      const data = await response.json();

      if (data.code === 200 && data.userId) {
        // 이미 친구인지 체크
        const isAlreadyFriend = await checkFriendStatus(data.userId);

        if (isAlreadyFriend) {
          showAlert("이미 친구입니다.", "error");
          return;
        }

        await sendFriendRequest(userId, data.userId);
        showAlert("친구 요청이 전송되었습니다.", "success");
      } else {
        showAlert("유저를 찾을 수 없습니다.", "error");
      }
    } catch (error) {
      console.error("친구 요청 중 오류 발생:", error);
      if (error.response?.data?.message === "이미 요청을 보냈습니다.") {
        showAlert("이미 친구 요청을 보냈습니다.", "error");
      } else if (
        error.response?.data?.message ===
        "상대방이 요청을 보냈거나 차단했습니다."
      ) {
        showAlert("상대방이 이미 친구 요청을 보냈거나 차단했습니다.", "error");
      } else {
        showAlert("친구 요청 중 오류가 발생했습니다.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportClick = (e) => {
    e.stopPropagation();
    // onReport() 호출 대신 직접 ReportForm을 보여주도록 수정
    setShowReportForm(true);
  };

  const handleReportSubmit = async (formData) => {
    try {
      const searchResponse = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/friend/search?userNickName=${userNickname}`
        // `${
        //   import.meta.env.VITE_LOCAL_API_BASE_URL
        // }/friend/search?userNickName=${userNickname}`
      );
      const searchData = await searchResponse.json();

      if (searchData.code === 200 && searchData.userId) {
        const reportData = {
          ...formData,
          userId: searchData.userId,
          reporterId: userId,
        };

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/report`,
          // `${import.meta.env.VITE_LOCAL_API_BASE_URL}/report`,
          reportData
        );

        if (response.data.code === 200) {
          setShowReportForm(false);
          showAlert("신고가 접수되었습니다.", "success");
        } else {
          showAlert("신고 접수에 실패했습니다.", "error");
        }
      } else {
        showAlert("유저를 찾을 수 없습니다.", "error");
      }
    } catch (error) {
      console.error("신고 처리 중 오류 발생:", error);
      showAlert("신고 처리 중 오류가 발생했습니다.", "error");
    }
  };

  useEffect(() => {
    updatePosition();
    const handleResize = () => updatePosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getAnchorRect]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // ReportFormModal이 열려있을 때는 외부 클릭을 무시
        // if (!showReportForm) {
        //   onClose();
        // }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <>
      {ReactDOM.createPortal(
        <div
          ref={modalRef}
          className="fixed bg-zinc-900/95 backdrop-blur-sm rounded-xl shadow-2xl z-[9999] border border-cyan-500/20"
          style={{
            top: position.top,
            left: position.left,
            width: "230px",
          }}
        >
          {/* 알림 메시지 */}
          {alert.show && (
            <div className="fixed left-1/2 top-8 -translate-x-1/2 z-50 w-72">
              <Alert type={alert.type} message={alert.message} />
            </div>
          )}

          {/* 말풍선 화살표 */}
          <div className="absolute -top-2 right-[133px] w-4 h-4 bg-zinc-900/95 transform rotate-45 border-t border-l border-cyan-500/20" />

          {/* 내용 컨테이너 */}
          <div className="relative p-4 z-10">
            <div className="flex items-start space-x-3 mb-4">
              {/* 프로필 이미지 */}
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20">
                <img
                  src={Heejun}
                  alt={userNickname}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 유저 정보 */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-medium mb-1">
                      {userNickname}
                    </h3>
                    <span className="inline-flex items-center text-xs text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      <span className="mr-1">•</span>
                      Lv.{userLevel}
                    </span>
                  </div>
                  <button
                    onClick={handleReportClick}
                    className="group p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Siren className="w-5 h-5 text-red-400 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex justify-end items-center space-x-2 pt-2 border-t border-gray-700/50">
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-gray-300 hover:text-white rounded-lg hover:bg-gray-700/50 transition-all"
              >
                취소
              </button>
              <button
                onClick={handleFriendRequest}
                disabled={isLoading}
                className={`px-3 py-1.5 text-xs text-cyan-50 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/20 
                 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "처리중..." : "친구 신청"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 신고 폼 모달 */}
      {showReportForm && (
        <ReportFormModal
          onClose={() => setShowReportForm(false)}
          onSubmit={handleReportSubmit}
        />
      )}
    </>
  );
};

export default ProfileModal;
