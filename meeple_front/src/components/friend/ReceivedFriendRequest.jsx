import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  processFriendRequest,
  requestFriendList,
} from "../../sources/api/FriendApi";
import useFriendSocket from "../../hooks/useFriendSocket";

const ReceivedFriendRequest = ({ requestedList }) => {
  const userId = useSelector((state) => state.user.userId);
  console.log(requestedList);
  const [requestList, setRequestList] = useState();

  useEffect(() => {
    setRequestList(requestedList);
  }, [requestedList]);

  const { connected, responseSocket, stompClientRef } = useFriendSocket();

  useEffect(() => {
    if (connected) {
      console.log("소켓이 연결되었습니다.");
    } else {
      console.error("소켓 연결 에러");
      // 재연결 시도
      const reconnectSocket = async () => {
        if (stompClientRef.current) {
          try {
            await stompClientRef.current.activate();
          } catch (error) {
            console.error("재연결 실패:", error);
          }
        }
      };
      reconnectSocket();
    }
  }, [connected]);

  useEffect(() => {
    if (responseSocket) {
      console.log("새로운 소켓 응답:", responseSocket);
    }
  }, [responseSocket]);

  const handleAccept = async (friendId) => {
    if (requestList && userId) {
      try {
        const requirements = "ACCEPT";
        const responseAPI = await processFriendRequest(friendId, requirements);
        console.log(responseAPI);
        console.log(connected);
        if (connected) {
          console.log(responseSocket);
        }
        console.log(responseSocket);

        const response = await requestFriendList(userId);
        setRequestList(response.requestedList);
      } catch (error) {
        console.error("친구 요청 승인 중 오류 : ", error);
        throw error;
      }
    }
  };

  const handleDeny = async (friendId) => {
    if (requestList && userId) {
      try {
        const requirements = "DENY";
        await processFriendRequest(friendId, requirements);
        const response = await requestFriendList(userId);
        setRequestList(response.requestedList);
      } catch (error) {
        console.error("친구 요청 거절 중 에러 : ", error);
        throw error;
      }
    }
  };

  return (
    <div className="my-2">
      {requestList && requestList.length > 0 ? (
        <ul>
          {requestList.map((list, index) => (
            <li
              key={index}
              className="p-2 border-b flex flex-row justify-between"
            >
              <p>{list.user.userNickname}</p>
              <div className="flex flex-row mx-2">
                <button
                  className="mx-2 w-12 rounded bg-cyan-400 text-white font-semibold shadow-lg hover:bg-cyan-500 hover:shadow-xl active:scale-95 transition-all duration-300 animate-pulse"
                  onClick={() => handleAccept(list.friendId)}
                >
                  승인
                </button>
                <button
                  className="mx-2 w-12 rounded bg-gray-400 text-white font-semibold shadow-lg hover:bg-gray-600 hover:shadow-xl active:scale-95 transition-all duration-300 animate-pulse"
                  onClick={() => handleDeny(list.friendId)}
                >
                  거절
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>받은 친구 요청이 없습니다.</p>
      )}
    </div>
  );
};

export default ReceivedFriendRequest;
