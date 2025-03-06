import React, { useCallback, useEffect, useState, useContext } from "react";
import TravelMap from "../play/TravelMap";
import { createPortal } from "react-dom";
import BurumabulSidebar from "../../../sidebar/burumabul/BurumabulSidebar";
import { Menu, X, Trophy, CreditCard } from "lucide-react";

import PlayerVideo from "../../../../components/game/burumabul/play/PlayerVideo";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../../layout/SocketLayout";

import SeedCard from "./burumabul_Modal/SeedCard";

const BurumabulPlay = ({ roomId, currentRoomInfo, setIsStart, playData }) => {
  // console.log("부루마불 플레이 현재 방 정보 :", currentRoomInfo);
  const userId = Number(useSelector((state) => state.user.userId));
  // 소켓 사용
  const socketContext = useContext(SocketContext);
  const {
    connected,
    roomSocketData,
    createBurumabulPlay,
    gamePlaySocketData,
    currentPlayerSocketIndex,
    gameSocketNotifi,
    socketBoard,
    socketCards,
    socketNext,
    socketFirstDice,
    socketSecondDice,
    socketCurrentRound,
    socketDouble,
    socketTileUpdate,
    socketUserUpdate,
    rollDiceSocketData,
    setBuyLandSocketData,
    buyLandSocketData,
    setBuildBaseSocketData,
    buildBaseSocketData,
    roll,
  } = socketContext;

  // 게임 데이터
  const [currentPlayData, setCurrentPlayData] = useState(playData);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(
    currentPlayerSocketIndex
  );
  const [board, setBoard] = useState(null);
  const [cards, setCards] = useState(null);
  const [players, setPlayers] = useState(currentPlayData?.players || []);
  useEffect(() => {
    setCurrentPlayData(playData);
    setBoard(socketBoard);
    setCards(socketCards);
  }, [playData]);

  useEffect(() => {
    setCurrentPlayerIndex(currentPlayerSocketIndex);
  }, [currentPlayerSocketIndex]);

  console.log("소켓에서 받아오는 현재 플레이어 순서", currentPlayerIndex);

  const currentPlayer = players?.[currentPlayData?.currentPlayerIndex];
  // console.log("현재 플레이어: ", currentPlayer);
  const playerInfoList = currentPlayData.players;

  const myInfo = players?.find((player) => Number(player.playerId) === userId);
  // console.log("내 정보 출력 ==================", myInfo);
  const myColorIndex = players?.findIndex(
    (player) => Number(player.playerId) === Number(userId)
  );
  // console.log(players);
  const colors = ["#FF3EA5", "#7695FF", "#00FF9C", "#EBF400"];

  const [playerBases, setPlayerBases] = useState(
    Array(currentPlayData?.players.length).fill([])
  );

  useEffect(() => {
    if (gamePlaySocketData) {
      console.log("새로운 gamePlaySocekData 수신:", gamePlaySocketData);
      setCurrentPlayData(gamePlaySocketData);
      setPlayers(gamePlaySocketData.players);
      setPlayerBases(Array(gamePlaySocketData.players.length).fill([]));
    }
  }, [gamePlaySocketData]);

  const roomInfo = currentRoomInfo;

  const dispatch = useDispatch();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [rollDice, setRollDice] = useState(null);

  const handleRollDiceRef = useCallback((rollDiceFn) => {
    setRollDice(() => rollDiceFn);
  }, []);

  // 주사위 결과

  const [firstDice, setFirstDice] = useState(null);
  const [secondDice, setSecondDice] = useState(null);
  const totalDice = Number(firstDice) + Number(secondDice);
  const [isDouble, setIsDouble] = useState(null);
  const [nextAction, setNextAction] = useState(null);

  useEffect(() => {
    setFirstDice(socketFirstDice);
    setSecondDice(socketSecondDice);
    setIsDouble(socketDouble);
    setNextAction(socketNext);
  }, [socketFirstDice, socketSecondDice, socketDouble, socketNext]);

  // 현재 라운드
  const [currentRound, setCurrentRound] = useState(null);
  useEffect(() => {
    setCurrentRound(socketCurrentRound);
  }, [socketCurrentRound]);

  useEffect(() => {
    if (buyLandSocketData) {
      const { updatedPlayer, updatedTile } = buyLandSocketData;

      // 플레이어 정보 업데이트
      if (updatedPlayer) {
        setPlayers((prevPlayers) => {
          const newPlayers =
            prevPlayers?.map((player) =>
              player.playerId === updatedPlayer.playerId
                ? {
                    ...player,
                    balance: updatedPlayer.balance,
                    cardOwned: updatedPlayer.cardOwned || [],
                    landOwned: updatedPlayer.landOwned || [],
                    position: updatedPlayer.position,
                  }
                : player
            ) || [];
          // console.log("Player update:", newPlayers);
          return newPlayers;
        });
      }

      // 보드(타일) 정보 업데이트
      if (updatedTile) {
        setBoard((prevBoard) => {
          const newBoard =
            prevBoard?.map((tile) =>
              tile.id === updatedTile.id
                ? {
                    ...tile,
                    ownerId: updatedTile.ownerId,
                    hasBase: updatedTile.hasBase,
                    tollPrice: updatedTile.tollPrice,
                  }
                : tile
            ) || [];
          // console.log("Board update:", newBoard);
          return newBoard;
        });
      }
      setBuyLandSocketData(null);
    }
  }, [buyLandSocketData]);

  useEffect(() => {
    if (buildBaseSocketData) {
      const { updatedPlayer, updatedTile } = buildBaseSocketData;

      // 플레이어 정보 업데이트
      if (updatedPlayer) {
        setPlayers((prevPlayers) => {
          const newPlayers =
            prevPlayers?.map((player) =>
              player.playerId === updatedPlayer.playerId
                ? {
                    ...player,
                    balance: updatedPlayer.balance,
                    cardOwned: updatedPlayer.cardOwned || [],
                    landOwned: updatedPlayer.landOwned || [],
                    position: updatedPlayer.position,
                  }
                : player
            ) || [];
          // console.log("Player update:", newPlayers);
          return newPlayers;
        });
      }

      // 보드(타일) 정보 업데이트
      if (updatedTile) {
        setBoard((prevBoard) => {
          const newBoard =
            prevBoard?.map((tile) =>
              tile.id === updatedTile.id
                ? {
                    ...tile,
                    ownerId: updatedTile.ownerId,
                    hasBase: updatedTile.hasBase,
                    tollPrice: updatedTile.tollPrice,
                  }
                : tile
            ) || [];
          // console.log("Board update:", newBoard);
          return newBoard;
        });
      }
      setBuildBaseSocketData(null);
    }
  }, [buildBaseSocketData, players, colors]);

  // 상태 변화를 모니터링하기 위한 별도의 useEffect
  useEffect(() => {
    if (buyLandSocketData) {
      // console.log("상태 업데이트 확인:");
      // console.log("Updated Players:", players);
      // console.log("Updated Cards:", cards);
      // console.log("Updated Board:", board);
    }
  }, [players, board, cards, buyLandSocketData]);

  const [showCard, setShowCard] = useState(null);

  const handleShowCard = () => {
    setShowCard(!showCard);
  };

  const handlePlayerBasesRef = useCallback((getBases) => {
    // console.log("플레이어 베이스 정보 : ", getBases);

    setPlayerBases(getBases);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const loadingMessage = !currentRoomInfo?.players ? (
    <div>게임 정보를 불러오는 중</div>
  ) : !currentPlayData || Object.keys(currentPlayData).length === 0 ? (
    <div>게임을 초기화하는 중</div>
  ) : null;

  if (loadingMessage) {
    return <>{loadingMessage}</>;
  }

  // console.log("currentPlayerIndex:", currentPlayerIndex);
  // console.log("myColorIndex:", myColorIndex);
  // console.log("rollDice 존재 여부:", !!rollDice);
  // console.log("현재 게임 데이터", currentPlayData);
  // console.log("현재 타일(보드 정보)", board);
  // console.log("현재 카드 정보", cards);

  // console.log("currentPlayerIndex:", currentPlayerIndex);
  // console.log("myColorIndex:", myColorIndex);

  return (
    <>
      <style>{`
        .thin-scrollbar::-webkit-scrollbar { width: 5px; position: absolute; right: 0;}
        .thin-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .thin-scrollbar::-webkit-scrollbar-thumb { background: #888; border-radius: 15px;}
        .thin-scrollbar::-webkit-scrollbar-track { display: none; }
        .game-stats { backdrop-filter: blur(8px); }
      `}</style>

      {/* 사이드바 */}
      <div className="fixed left-0 top-0 h-full z-50 flex">
        <div
          className={`transition-transform duration-300 ease-in-out transform 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} relative`}
        >
          <BurumabulSidebar playerInfoList={playerInfoList} />
          {isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-12 
                bg-indigo-600 rounded-r text-white
                hover:bg-indigo-700 focus:outline-none 
                flex items-center justify-center
                shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* 게임 상태 바 */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 game-stats z-40">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="text-indigo-600 font-medium">
                  Round {currentRound}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-indigo-100 rounded-lg px-3 py-1">
                  🎲 {firstDice} + {secondDice} = {totalDice}
                  {isDouble && (
                    <span className="ml-2 text-indigo-600 font-bold">
                      Double!
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-gray-600">{gameSocketNotifi}</div>
          </div>
        </div>
      </div>

      {/* 메인 게임 영역 */}
      <div
        className={`transition-all duration-300 ease-in-out pt-12
        ${isSidebarOpen ? "ml-64" : "ml-0"}`}
      >
        <div className="h-screen w-full flex bg-gradient-to-br from-gray-50 to-gray-100">
          {/* 게임 맵 영역 */}
          <div className="w-3/4">
            <TravelMap
              onBasesInfo={handlePlayerBasesRef}
              gameData={currentPlayData}
              roomId={roomId}
            />
          </div>

          {/* 플레이어 정보 영역 */}
          <div className="w-1/4 bg-white/90 shadow-lg flex flex-col">
            <div className="flex flex-col h-full">
              {/* 플레이어 비디오 및 순위 영역 */}
              <div className="h-[60%] overflow-y-auto thin-scrollbar border-b">
                <h2 className="text-xl font-semibold text-gray-800 p-4 border-b">
                  Players
                </h2>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {playerInfoList.map((player, index) => (
                      <PlayerVideo key={index} playerInfo={player} />
                    ))}
                  </div>
                </div>

                {/* 순위 보드 */}
                <div className="mx-4 mb-4 bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                    <h2 className="font-semibold text-gray-800">Ranking</h2>
                  </div>
                  <div className="space-y-2">
                    {/* 순위 매기기 */}
                    {players
                      .map((player, index) => ({
                        ...player,
                        originalIndex: index,
                      })) // 기존 인덱스 추가
                      .sort((a, b) => {
                        if (b.balance !== a.balance) {
                          return b.balance - a.balance; // balance 기준 내림차순 정렬
                        }
                        return a.originalIndex - b.originalIndex; // balance 같으면 기존 인덱스 기준 정렬
                      })
                      .map((player, index) => (
                        <div
                          key={player.originalIndex}
                          className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm"
                        >
                          <div className="flex items-center">
                            <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-medium text-indigo-600">
                              {index + 1}
                            </span>
                            <span className="ml-3 font-medium text-gray-700">
                              {player.playerName}
                            </span>
                          </div>
                          <span className="text-gray-600 font-medium">
                            {player.balance}마불
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* 내 정보 영역 */}
              <div
                className="h-[40%] p-4"
                style={{ backgroundColor: colors[myColorIndex] }}
              >
                <div className="h-full flex flex-col">
                  <h2 className="text-white font-bold text-lg mb-4">
                    My Status
                  </h2>
                  <div className="flex-1 bg-white/20 rounded-xl p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white">My Bases</span>
                        <button
                          onClick={handleShowCard}
                          className="flex items-center px-3 py-1.5 bg-white/90 hover:bg-white
                            rounded-lg text-sm font-medium text-gray-700 transition-colors"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          View Cards
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {myInfo?.cardOwned
                          ?.slice(0, 4)
                          .map((card, cardIndex) => (
                            <div
                              key={cardIndex}
                              className="bg-white/30 rounded-lg p-2 text-white text-sm truncate"
                            >
                              {card.name}
                            </div>
                          ))}
                      </div>
                      {myInfo?.cardOwned?.length > 4 && (
                        <div className="text-white text-center text-sm">
                          +{myInfo.cardOwned.length - 4} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 사이드바 토글 버튼 */}
      {!isSidebarOpen && (
        <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50">
          <button
            onClick={toggleSidebar}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-r p-3
              shadow-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* 카드 모달 */}
      {showCard &&
        createPortal(
          <SeedCard
            cardList={myInfo?.cardOwned}
            onClose={() => setShowCard(false)}
          />,
          document.body
        )}
    </>
  );
};
export default BurumabulPlay;
