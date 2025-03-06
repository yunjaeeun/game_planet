import { useEffect, useState } from "react";

// hooks/useCockState.js
const useCockState = (roomId) => {
    const [gameState, setGameState] = useState(null);
    const [playerCards, setPlayerCards] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [players, setPlayers] = useState([]);
    const [roomData, setRoomData] = useState(null);
  
    // sessionStorage 복구 로직
    useEffect(() => {
      try {
        const savedState = sessionStorage.getItem(`game_${roomId}`);
        const savedUser = sessionStorage.getItem(`user_${roomId}`);
        const gameStatus = sessionStorage.getItem(`game_${roomId}_status`);
        const savedPlayers = sessionStorage.getItem(`player_${roomId}`)
        const savedRoomData = sessionStorage.getItem(`room_${roomId}`)
  
        if (savedState) setGameState(JSON.parse(savedState));
        if (savedUser) setCurrentUser(savedUser);
        if (gameStatus === "started") setIsGameStarted(true);
        if (savedPlayers) setPlayers(JSON.parse(savedPlayers)); 
        if (savedRoomData) setRoomData(JSON.parse(savedRoomData)); 


      } catch (error) {
        console.error("상태 복구 중 오류:", error);
      }
    }, [roomId]);
  
    // 상태 변경시 자동 저장
    useEffect(() => {
      if (gameState) {
        sessionStorage.setItem(`game_${roomId}`, JSON.stringify(gameState));
      }
      if (currentUser) {
        sessionStorage.setItem(`user_${roomId}`, currentUser);
      }
      if (isGameStarted) {
        sessionStorage.setItem(`game_${roomId}_status`, "started");
      }
      if (players.length > 0) { 
        sessionStorage.setItem(`players_${roomId}`, JSON.stringify(players));
      }
      if (roomData) {  
        sessionStorage.setItem(`room_${roomId}`, JSON.stringify(roomData));
      }
    }, [gameState, currentUser, isGameStarted, roomId, players, roomData]);
  
    return {
      gameState,
      setGameState,
      playerCards,
      setPlayerCards,
      currentUser,
      setCurrentUser,
      isGameStarted,
      setIsGameStarted,
      players,
      setPlayers,
      roomData,
      setRoomData,
    };
  };

export default useCockState