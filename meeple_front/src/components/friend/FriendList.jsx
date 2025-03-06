import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFriends } from "../../sources/store/slices/FriendSlice";
import { fetchFriendList, deleteFriend } from "../../sources/api/FriendApi";
import axios from "axios";
import { UserRoundMinus } from "lucide-react";

const FriendList = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);
  const { friends, status, error } = useSelector((state) => state.friend);
  const [friendList, setFriendList] = useState([]);

  const loadingFriends = async (userId) => {
    if (userId) {
      try {
        const response = await fetchFriendList(userId);
        setFriendList(response);
      } catch (error) {
        console.error("친구 목록 로딩 중 에러 : ", error);
      }
    }
  };

  useEffect(() => {
    loadingFriends(userId);
  }, [userId]);

  useEffect(() => {
    console.log("✅ 업데이트된 친구 목록:", friendList);
  }, [friendList]); // ✅ friendList 변경될 때마다 실행

  const handleDeleteFriend = async (friendId) => {
    if (friendId) {
      try {
        await deleteFriend(friendId);
        loadingFriends(userId);
      } catch (error) {
        console.error("친구 삭제 중 오류 : ", error);
        throw error;
      }
    }
  };

  return (
    <div className="">
      <h2 className="text-2xl text-center my-2">친구 목록</h2>
      <div className="bg-slate-100 h-80 rounded-lg overflow-y-auto">
        <ul className="mt-2 space-y-2">
          {friendList && friendList.length > 0 ? (
            friendList.map((friend, index) => (
              <li
                key={index}
                className="p-2 bg-white mx-2 rounded flex justify-between items-center"
              >
                {friend.friend.nickname}
                <button
                  onClick={() => handleDeleteFriend(friend.friendId)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  <UserRoundMinus color="#000f5c" strokeWidth={2.5} />
                </button>
              </li>
            ))
          ) : (
            <p className="text-center">친구가 없습니다.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FriendList;
