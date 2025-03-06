import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import FriendModal from "../friend/FriendModal";
import { FaUserFriends } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";

const FriendModalLayout = ({ children }) => {
  const { token } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const userId = useSelector((state) => state.user.userId);

  const showButton = location.pathname !== "/";
  // location.pathname !== `/profile/${userId}` &&
  // !location.pathname.match(/^\/game\/burumabul\/[\w-]+$/) &&
  // !location.pathname.match(/^\/catch-mind\/[\w-]+$/) &&
  // !location.pathname.match(/^\/game\/cockroach\/[\w-]+$/);

  return (
    <>
      {children}
      {showButton && ( // 조건부 렌더링 수정
        <>
          <div className="fixed right-0 top-1/2 transform -translate-y-1/2">
            <div className="relative group">
              <button
                className="bg-black bg-opacity-20 text-white p-2 rounded-l-lg transition-all duration-300 shadow-lg z-50 border-l border-t border-b border-cyan-400/60 hover:border-cyan-400"
                onClick={() => setIsModalOpen(true)}
              >
                <FaUserFriends size={25} className="ml-[3px]" />
              </button>
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed right-3 bottom-3 h-2/3 w-80 bg-white shadow-lg rounded-lg">
              <div className="p-4">
                <button
                  className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  <IoMdCloseCircleOutline size={25} />
                </button>
                <FriendModal userId={userId} />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default FriendModalLayout;
