import React, { useState, useEffect } from "react";
import FriendSearch from "../game/FriendSearch";
import { fetchFriendList } from "../../sources/api/FriendApi";
import { useSelector } from "react-redux";

const SendMessage = () => {
  const userId = useSelector((state) => state.user.user);
  const [friendList, setFriendList] = useState(null);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await fetchFriendList(userId);
        console.log(response);
        setFriendList(response);
      } catch (error) {
        console.error("친구 목록 로드 중 에러");
      }
    };
    getFriends();
  }, [userId]);

  useEffect(() => {
    console.log("업데이트된 friendList:", friendList);
  }, [friendList]);

  return (
    <div>
      <h1>쪽지 보내기</h1>
      <div>
        <FriendSearch friendList={friends} />
      </div>
    </div>
  );
};

export default SendMessage;
