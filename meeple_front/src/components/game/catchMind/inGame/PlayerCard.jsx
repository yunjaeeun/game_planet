import React, { useState, useRef, useCallback } from "react";
import ProfileModal from "../../../user/ProfileModal";
import { UserSearch } from "lucide-react";
import ReportFormModal from "../../../user/ReportFormModal";

const PlayerCard = ({
  userNickname,
  isCurrentTurn,
  score,
  userLevel = 1,
  isCurrentUser = false,
  sessionId,
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const buttonRef = useRef();

  const getAnchorRect = useCallback(() => {
    return buttonRef.current?.getBoundingClientRect();
  }, []);

  const handleReport = () => {
    setIsModalOpen(false);
    setShowReportForm(true);
  };

  const handleReportSubmit = async (formData) => {
    // 기존 submit 로직
    setShowReportForm(false);
  };

  return (
    <div
      className={`bg-gray-800 rounded-lg overflow-hidden transition-all ${
        isCurrentTurn
          ? "ring-2 ring-blue-400 shadow-lg shadow-blue-500/20"
          : "border border-gray-700"
      }`}
    >
      <div className="w-full pt-[56.25%] relative">
        <div className="absolute inset-0 overflow-hidden">{children}</div>
        {isCurrentTurn && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full shadow-md z-50">
            출제자
          </div>
        )}
      </div>
      <div className="p-3 bg-gray-700/90 backdrop-blur-md border-t border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-200">{userNickname}</span>
            {!isCurrentUser && (
              <button
                ref={buttonRef}
                onClick={() => setIsModalOpen((prev) => !prev)}
                className="p-1 rounded-full hover:bg-gray-600 transition-colors"
              >
                <UserSearch className="w-4 h-4 text-gray-400 hover:text-gray-200" />
              </button>
            )}
          </div>
          <span className="text-sm text-blue-400 font-bold">{score}점</span>
        </div>
      </div>
      {isModalOpen && (
        <ProfileModal
          onClose={() => setIsModalOpen(false)}
          userNickname={userNickname}
          userLevel={userLevel}
          getAnchorRect={getAnchorRect}
          onReport={handleReport}
        />
      )}

      {showReportForm && (
        <ReportFormModal
          onClose={() => setShowReportForm(false)}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
};

export default PlayerCard;
