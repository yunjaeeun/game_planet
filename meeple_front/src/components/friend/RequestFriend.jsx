import React, { act, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { requestFriendList } from "../../sources/api/FriendApi";
import ReceivedFriendRequest from "./ReceivedFriendRequest";
import RequestingFriend from "./RequestingFriend";

const RequestFriend = () => {
  const userId = useSelector((state) => state.user.userId);
  const [activeTab, setActiveTab] = useState("requestedList");
  const [response, setResponse] = useState({
    requestingList: [],
    requestedList: [],
  });

  const fetchData = async () => {
    try {
      const data = await requestFriendList(userId);
      setResponse(data);
    } catch (error) {
      console.error("친구 요청 목록을 불러오지 못했습니다.", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchData();
  };

  const requestingList = response.requestingList;
  const requestedList = response.requestedList;

  const renderContent = () => {
    switch (activeTab) {
      case "requestedList":
        return response ? (
          <ReceivedFriendRequest requestedList={requestedList} />
        ) : null;

      case "requestingList":
        return response ? (
          <RequestingFriend requestingList={requestingList} />
        ) : null;
      default:
        return <ReceivedFriendRequest requestedList={requestedList} />;
    }
  };

  return (
    <>
      <div className="my-3 text-center">
        <button
          className={`px-4 py-2 mx-3 rounded-lg font-semibold transition-all duration-300 
            ${
              activeTab === "requestedList"
                ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg scale-105 border-2 border-blue-700"
                : "bg-gray-500 text-gray-200 hover:bg-gray-600 hover:text-white"
            }`}
          onClick={() => handleTabChange("requestedList")}
        >
          받은 요청
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 
            ${
              activeTab === "requestingList"
                ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg scale-105 border-2 border-green-700"
                : "bg-gray-500 text-gray-200 hover:bg-gray-600 hover:text-white"
            }`}
          onClick={() => handleTabChange("requestingList")}
        >
          보낸 요청
        </button>
      </div>
      <div>{renderContent()}</div>
    </>
  );
};

export default RequestFriend;
