import { retry } from "@reduxjs/toolkit/query";
import axios from "axios";
import { useSelector } from "react-redux";
import { exp } from "three/tsl";

const FRIEND_API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/friend`; // 배포 API 주소
// const FRIEND_API_BASE_URL = `${import.meta.env.VITE_LOCAL_API_BASE_URL}/friend`; // 로컬 서버 API 주소

// 친구 요청 처리
export const processFriendRequest = async (friendId, requirements) => {
  try {
    const requestBody = {
      friendId,
      requirements,
    };

    const response = await axios.put(
      `${FRIEND_API_BASE_URL}/process-request`,
      requestBody
    );

    return response.data;
  } catch (error) {
    console.error("친구 요청 처리 중 오류 : ", error);
    throw error;
  }
};

// 친구 요청 보내기
export const sendFriendRequest = async (userId, friendId) => {
  if (!userId) throw new Error("유저 아이디가 없습니다.");
  if (userId) {
    try {
      const requestBody = {
        userId,
        friendId,
      };
      const response = await axios.post(
        `${FRIEND_API_BASE_URL}/request-friend`,
        requestBody
      );
    } catch (error) {
      console.error("친구 요청 보내기 중 오류 : ", error);
      throw error;
    }
  }
};

// 쪽지 목록 조회
export const messageList = async (userId) => {
  if (!userId) throw new Error("유저 아이디가 없습니다.");
  if (userId) {
    try {
      const response = await axios.get(
        `${FRIEND_API_BASE_URL}/message?userId=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("쪽지 목록 조회 중 오류 : ", error);
      throw error;
    }
  }
};

// 메세지 발송
export const sendMessage = async (content, ToId, userId) => {
  if (!userId) throw new Error("유저 아이디가 없습니다.");
  if (userId) {
    try {
      const requestBody = {
        content: content,
        userId: ToId,
        senderId: userId,
      };
      const response = await axios.post(
        `${FRIEND_API_BASE_URL}/message`,
        requestBody
      );
      return response.data;
    } catch (error) {
      console.error("메세지 발송 중 오류 :", error);
      throw error;
    }
  }
};

// 쪽지 삭제
export const deleteMessage = async (friendMessageId) => {
  try {
    const response = await axios.delete(
      `${FRIEND_API_BASE_URL}/message?friendMessageId=${friendMessageId}`
    );
    return response.data;
  } catch (error) {
    console.error("쪽지 삭제 중 에러 : ", error);
    throw error;
  }
};

// 친구 목록 조회
export const fetchFriendList = async (userId) => {
  if (!userId) throw new Error("유저 아이디가 없습니다.");
  if (userId) {
    try {
      const response = await axios.get(
        `${FRIEND_API_BASE_URL}?userId=${userId}`
      );
      console.log("✅ [프론트] API 응답:", response.data);
      return response.data;
    } catch (error) {
      console.error("FriendList fetch error : ", error);
      throw error;
    }
  }
};

// 닉네임으로 친구 검색
export const searchFriend = async (userNickname) => {
  try {
    const response = await axios.get(
      `${FRIEND_API_BASE_URL}/search?userNickname=${userNickname}`
    );

    return response.data;
  } catch (error) {
    console.error("닉네임으로 친구 검색 중 오류가 났습니다. : ", error);
    throw error;
  }
};

// // 친구 요청 목록
export const requestFriendList = async (userId) => {
  if (!userId) throw new Error("유저 아이디가 없습니다.");
  if (userId) {
    try {
      const response = await axios.get(
        `${FRIEND_API_BASE_URL}/request-list?userId=${userId}`
      );

      return response.data;
    } catch (error) {
      console.error("친구 요청 목록 조회 중 오류 : ", error);
      throw error;
    }
  }
};

// 차단 목록
export const blokingFriendList = async (userId) => {
  if (!userId) throw new Error("유저 아이디가 없습니다.");
  if (userId) {
    try {
      const response = await axios.get(
        `${FRIEND_API_BASE_URL}/blocking-list?=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("차단 목록 조회 중 오류 : ", error);
      throw error;
    }
  }
};

// 차단 해제
export const liftBlocking = async (friendId) => {
  try {
    const requestBody = {
      friendId,
    };
    const response = await axios.delete(
      `${FRIEND_API_BASE_URL}/process-block`,
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("차단 해제 중 오류 : ", error);
    throw error;
  }
};

// 친구 삭제
export const deleteFriend = async (friendId) => {
  try {
    const response = await axios.delete(
      `${FRIEND_API_BASE_URL}/delete-friend?friendId=${friendId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "친구 삭제 실패";
  }
};

// 친구 요청 삭제
export const deleteFriendRequest = async (friendId) => {
  try {
    const response = await axios.delete(
      `${FRIEND_API_BASE_URL}/delete-friend-request?friendId=${friendId}`
    );
    return response.data;
  } catch (error) {
    console.error("친구 요청 삭제 중 오류 :", error);
    throw error;
  }
};
