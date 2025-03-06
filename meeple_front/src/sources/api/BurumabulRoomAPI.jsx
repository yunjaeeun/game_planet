import React from "react";
import axios from "axios";

const BURUMABUL_API_BASE_URL = `${
  import.meta.env.VITE_API_BASE_URL
}/game/blue-marble/rooms`; // 배포 API
// const BURUMABUL_API_BASE_URL = `${
//   import.meta.env.VITE_LOCAL_API_BASE_URL
// }/game/blue-marble/rooms`; // 로컬 API

const getAuthHeaders = () => {
  const token = localStorage.getItem("token")?.trim() || "";
  if (!token) throw new Error("인증 토큰이 없습니다.");
  // 토큰에서 불필요한 문자 제거
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// 게임방 생성
export const createBurumabulRoom = async (userId, roomData) => {
  try {
    console.log("Request payload:", roomData);
    const response = await axios.post(
      `${BURUMABUL_API_BASE_URL}/${userId}/create`,
      roomData
    );
    return response.data;
  } catch (error) {
    console.error("방 생성 실패: ", error);
    console.error("방 생성 실패: ", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

// 게임 방 목록 조회
export const listBurumabulRoom = async () => {
  try {
    const response = await axios.get(`${BURUMABUL_API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("방 목록 조회 실패 : ", error);
    throw error;
  }
};

// 게임 방 삭제
export const deleteBurumabulRoom = async (roomId) => {
  try {
    const response = await axios.delete(
      `${BURUMABUL_API_BASE_URL}/${roomId}`,
      {},
      { headers: getAuthHeaders() }
    );

    return response.data;
  } catch (error) {
    console.error("방 삭제 실패 :", error);
    throw error;
  }
};

// 게임방 참가
export const joinBurumabulRoom = async (roomId) => {
  try {
    const response = await axios.post(
      `${BURUMABUL_API_BASE_URL}/${roomId}`,
      {},
      { headers: getAuthHeaders() }
    );

    return response.data;
  } catch (error) {
    console.error("방 참가 실패 : ", error);
    throw error;
  }
};

// 게임방 수정
export const putBurumabulRoom = async (roomData, roomId) => {
  try {
    const requestBody = roomData;

    const response = await axios.put(
      `${BURUMABUL_API_BASE_URL}/${roomId}`,
      requestBody
    );

    return response.data;
  } catch (error) {
    console.error("방 수정에 실패했습니다. : ", error);
    throw error;
  }
};

// 게임방 조회
export const findBurumabulRoom = async (roomId) => {
  try {
    const response = await axios.get(`${BURUMABUL_API_BASE_URL}/${roomId}`);
    return response.data;
  } catch (error) {
    console.error("방 상세 조회에 실패했습니다. : ", error);
    throw error;
  }
};

// 게임방 이름으로 검색
export const searchBurumabulRoomname = async (searchName) => {
  try {
    const response = await axios.get(
      `${BURUMABUL_API_BASE_URL}/${searchName}/search`
    );
    return response.data;
  } catch (error) {
    console.error("방 이름으로 검색 실패 :", error);
    throw error;
  }
};
