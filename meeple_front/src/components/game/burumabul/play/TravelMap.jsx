import React, {
  useEffect,
  useState,
  useRef,
  Suspense,
  useMemo,
  useContext,
} from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Canvas,
  render,
  useThree,
  useFrame,
  useLoader,
} from "@react-three/fiber";
import { OrbitControls, Text, Edges } from "@react-three/drei";
import Dice from "./Dice";
import { TextureLoader } from "three";
import spaceBackground from "../../../../assets/burumabul_images/space.jpg";

// 셀 topTexture 이미지
import earthTexture from "../../../../assets/burumabul_images/earth.png";
import moonTexture from "../../../../assets/burumabul_images/moon.png";
import telepathyTexture1 from "../../../../assets/burumabul_images/telepathy.png";
import marsTexture from "../../../../assets/burumabul_images/mars.png";
import jupiterTexture from "../../../../assets/burumabul_images/jupiter.png";
import vegaTexture from "../../../../assets/burumabul_images/vega.png";
import saturnTexture from "../../../../assets/burumabul_images/saturn.png";
import uranusTexture from "../../../../assets/burumabul_images/uranus.png";
import neptuneTexture from "../../../../assets/burumabul_images/neptune.png";
import timetravelTexture from "../../../../assets/burumabul_images/timetravel.png";
import ariesTexture from "../../../../assets/burumabul_images/aries.png";
import taurusTexture from "../../../../assets/burumabul_images/taurus.png";
import telepathyTexture2 from "../../../../assets/burumabul_images/telepathy2.png";
import geminiTexture from "../../../../assets/burumabul_images/gemini.png";
import neuronsTexture1 from "../../../../assets/burumabul_images/neurons1.png";
import cancerTexture from "../../../../assets/burumabul_images/cancer.png";
import timemachineTexture from "../../../../assets/burumabul_images/timemachine.png";
import leoTexture from "../../../../assets/burumabul_images/leo.png";
import virgoTexture from "../../../../assets/burumabul_images/virgo.png";
import blackholeTexture from "../../../../assets/burumabul_images/blackhole.png";
import libraTexture from "../../../../assets/burumabul_images/libra.png";
import scorpioTexture from "../../../../assets/burumabul_images/scorpio.png";
import telepathyTexture3 from "../../../../assets/burumabul_images/telepathy3.png";
import sagittariusTexture from "../../../../assets/burumabul_images/sagittarius.png";
import altairTexture from "../../../../assets/burumabul_images/altair.png";
import capricornTexture from "../../../../assets/burumabul_images/capricorn.png";
import aquariusTexture from "../../../../assets/burumabul_images/aquarius.png";
import piscesTexture from "../../../../assets/burumabul_images/pisces.png";
import resquebaseTexture from "../../../../assets/burumabul_images/resquebase.png";
import ursamajorTexture from "../../../../assets/burumabul_images/ursamajor.png";
import andromedaTexture from "../../../../assets/burumabul_images/andromeda.png";
import telepathyTexture4 from "../../../../assets/burumabul_images/telepathy4.png";
import orionTexture from "../../../../assets/burumabul_images/orion.png";
import neuronsTexture2 from "../../../../assets/burumabul_images/neurons2.png";
import cygnusTexture from "../../../../assets/burumabul_images/cygnus.png";
import halleyTexture from "../../../../assets/burumabul_images/halley.png";
import mercuryTexture from "../../../../assets/burumabul_images/mercury.png";
import venusTexture from "../../../../assets/burumabul_images/venus.png";
import floorTexture from "../../../../assets/burumabul_images/floor.png";
import timemachineStop from "../../../../assets/burumabul_images/timemachinestop.png";
import telepathyCard from "../../../../assets/burumabul_images/telepathycard.png";
import neuronsCard from "../../../../assets/burumabul_images/neuronscard.png";

import BlueRobot from "./BlueRobot";
import SpaceBase from "./SpaceBase";
import { SocketContext } from "../../../layout/SocketLayout";
import QuestBuildBase from "./burumabul_Modal/QuestBuildBase.";
import QuestBuyLand from "./burumabul_Modal/QuestBuyLand";
import PayTollModal from "./burumabul_Modal/PayTollModal";
import DiceVersion2 from "./DiceVersion2";
import HeartPlayer from "./HeartPlayer";

const Cell = ({
  position,
  name,
  textureUrl,
  topTextureUrl,
  size,
  ownerIndex,
  players,
}) => {
  const textRef = useRef();
  const { camera } = useThree();
  const colors = ["#FF3EA5", "#7695FF", "#00FF9C", "#EBF400"];
  // TextureLoader로 텍스쳐 로드
  const texture = textureUrl ? useLoader(TextureLoader, textureUrl) : null;
  const topTexture = topTextureUrl
    ? useLoader(TextureLoader, topTextureUrl)
    : null;

  useFrame(() => {
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
    }
  });

  const getColor = () => {
    if (ownerIndex !== null) {
      return colors[ownerIndex];
    }
  };

  return (
    <mesh position={position}>
      {/* 셀 박스 = 직육면체 */}
      <boxGeometry args={size} />
      {/* 각 면의 텍스처 및 색상 설정 */}
      <meshStandardMaterial color={getColor()} />

      <Edges
        scale={1}
        threshold={15} // 모서리 표시 임계값
        color="black"
        thickness={5}
      />

      {/* 윗면에만 텍스쳐 적용 */}
      {topTexture && (
        <mesh
          position={[0, size[1] / 2 + 0.001, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[size[0], size[2]]} />
          <meshStandardMaterial
            map={topTexture}
            transparent={true}
            encoding={3000} // sRGB 인코딩 사용
            toneMapped={false} // 톤 매핑 비활성화
          />
        </mesh>
      )}

      {/* 셀 이름 */}
      {/* <Text
        ref={textRef}
        position={[0, size[1] + 0.4, 0]} // 박스 위에 텍스트 표시
        fontSize={0.3}
        color="gray"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text> */}
    </mesh>
  );
};

const TravelMap = ({ onBasesInfo, gameData, roomId }) => {
  // cities 배열
  const cities = [
    "지구 Start",
    "달",
    "텔레파시 카드",
    "화성",
    "목성",
    "직녀성",
    "토성",
    "텔레파시 카드",
    "천왕성",
    "해왕성",
    "시간 여행",
    "양자리",
    "황소자리",
    "텔레파시 카드",
    "쌍둥이 자리",
    "뉴런의 골짜기 카드",
    "게자리",
    "타임머신",
    "사자자리",
    "처녀자리",
    "공포의 블랙홀",
    "천칭자리",
    "전갈자리",
    "텔레파시 카드",
    "궁수자리",
    "견우성",
    "염소자리",
    "물병자리",
    "물고기자리",
    "텔레파시 카드",
    "우주조난기지",
    "큰곰자리",
    "안드로메다",
    "텔레파시 카드",
    "오리온 자리",
    "뉴런의 골짜기 카드",
    "백조자리",
    "헬리 혜성",
    "수성",
    "금성",
  ];
  const userId = Number(useSelector((state) => state.user.userId));
  const colors = ["#FF3EA5", "#7695FF", "#00FF9C", "#EBF400"];

  const dispatch = useDispatch();
  // 소켓에서 받아오는 정보들
  const {
    connected,
    rollDice,
    buyLand,
    roll,
    buildBase,
    startTurn,
    payToll,
    drawCard,
    checkEnd,
    currentPlayerSocketIndex,
    rollDiceSocketData,
    socketBoard,
    socketCards,
    socketNext,
    socketUserUpdate,
    socketTileUpdate,
    buyLandSocketData,
    buildBaseSocketData,
    socketPayTollData,
    setBuyLandSocketData,
    setBuildBaseSocketData,
    setSocketPayTollData,
    socketTollPrice,
    socketReceivedPlayer,
    setSocketNext,
    socketFirstDice,
    socketSecondDice,
    socketDouble,
    socketCurrentRound,
    socketRoll,
  } = useContext(SocketContext);
  const [playData, setPlayData] = useState(gameData);

  useEffect(() => {
    // console.log(buyLandSocketData);
  }, [buyLandSocketData]);

  // 플레이어 정보
  const [players, setPlayers] = useState(playData?.players);
  const numPlayers = players?.length;

  const myInfo = players?.find((player) => player.playerId === userId);
  const myColorIndex = players?.findIndex(
    (player) => Number(player.playerId) === Number(userId)
  );

  const [cards, setCards] = useState(null);
  const [board, setBoard] = useState(null);
  const [updatePlayerList, setUpdatePlayerList] = useState(socketUserUpdate);
  const [updateTileList, setUpdateTileList] = useState(socketTileUpdate);

  const [showBuyLand, setShowBuyLand] = useState(false);
  const [showBuildBase, setShowBuildBase] = useState(false);
  const [isBuyLand, setIsBuyLand] = useState(false);
  const [isBuildBase, setIsBuildBase] = useState(false);
  const [showCardId, setShowCardId] = useState(null);

  useEffect(() => {
    setPlayData(gameData);
    setCards(socketCards);
    if (socketBoard) {
      setBoard((prevBoard) => {
        // 이전 board가 없는 경우에만 새로운 socketBoard로 설정
        if (!prevBoard) return socketBoard;

        // 기존 board 상태 유지하면서 필요한 부분만 업데이트
        return prevBoard.map((tile, index) => {
          const newTile = socketBoard[index];
          if (!newTile) return tile;

          return {
            ...tile,
            ownerId: newTile.ownerId || tile.ownerId,
            hasBase: newTile.hasBase || tile.hasBase,
            tollPrice: newTile.tollPrice || tile.tollPrice,
          };
        });
      });
    }
  }, [gameData, socketCards, socketBoard]);

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
          return [...newBoard];
        });
      }
      setBuyLandSocketData(null);
    }
  }, [buyLandSocketData, setPlayers, setBoard]);

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

      // 우주 기지 상태 업데이트
      setSpaceBases((prevBases) => {
        return prevBases.map((base, index) => {
          if (index === updatedTile.id) {
            const ownerIndex = players.findIndex(
              (p) => p.playerId === updatedTile.ownerId
            );
            return {
              ...base,
              visible: true,
              color: colors[ownerIndex],
            };
          }
          return base;
        });
      });
      setBuildBaseSocketData(null);
    }
  }, [buildBaseSocketData, players, colors]);

  // 통행료 지불 후 업데이트 정보
  const [tollPrice, setTollPrice] = useState(null);
  const [paidPlayer, setPaidPlayer] = useState(null);
  const [receivedPlayer, setReceivedPlayer] = useState(null);
  useEffect(() => {
    if (socketPayTollData) {
      const { paidPlayer, receivedPlayer, tollPrice } = socketPayTollData;

      if (paidPlayer) {
        setPlayers((prevPlayers) => {
          const newPlayers =
            prevPlayers?.map((player) =>
              player.playerId === paidPlayer.playerId
                ? {
                    ...player,
                    balance: paidPlayer.balance,
                    cardOwned: paidPlayer.cardOwned || [],
                    landOwned: paidPlayer.landOwned || [],
                    position: paidPlayer.position,
                  }
                : player
            ) || [];
          // console.log("Player update:", newPlayers);
          return newPlayers;
        });
        setPaidPlayer(paidPlayer);
      }
      if (receivedPlayer) {
        setPlayers((prevPlayers) => {
          const newPlayers =
            prevPlayers?.map((player) =>
              player.playerId === receivedPlayer.playerId
                ? {
                    ...player,
                    balance: receivedPlayer.balance,
                    cardOwned: receivedPlayer.cardOwned || [],
                    landOwned: receivedPlayer.landOwned || [],
                    position: receivedPlayer.position,
                  }
                : player
            ) || [];
          // console.log("Player update:", newPlayers);
          return newPlayers;
        });
        setReceivedPlayer(receivedPlayer);
      }
      setTollPrice(tollPrice);
    }
  }, [socketPayTollData]);

  // 상태 변화를 모니터링하기 위한 별도의 useEffect
  useEffect(() => {
    if (buyLandSocketData) {
      // console.log("상태 업데이트 확인:");
      // console.log("Updated Players:", players);
      // console.log("Updated Cards:", cards);
      // console.log("Updated Board:", board);
    }
  }, [players, board, cards, buyLandSocketData, buildBaseSocketData]);

  // 색상

  // 현재 플레이어는 인덱스 번호로
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const currentPlayer = players[currentPlayerIndex];
  // 주사위
  const [firstDice, setFirstDice] = useState(null);
  const [secondDice, setSecondDice] = useState(null);
  const isDouble = firstDice === secondDice;
  // 다음 행동
  const [nextAction, setNextAction] = useState(null);
  const [hasRolledDice, setHasRolledDice] = useState(false);
  const [isDiceRolling, setIsDiceRolling] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  // 통행료 알림 모달 오픈
  const [showPayTollModal, setShowPayTollModal] = useState(false);

  // 나는 몇 번째 순서인지
  const myIndex = players.findIndex((player) => player.playerId === userId);
  console.log(players);
  console.log(myIndex);

  const [nextxTurn, setNextTurn] = useState(Number(currentPlayerIndex) + 1);
  useEffect(() => {
    setNextTurn(Number(currentPlayerIndex) + 1);
  }, [currentPlayerIndex]);

  // 이전 위치 , 다음 위치
  const [prevPosition, setPrevPosition] = useState(null);
  const [nextPosition, setNextPosition] = useState(null);

  useEffect(() => {
    if (rollDiceSocketData) {
      setPrevPosition(rollDiceSocketData.prevPosition);
      setNextPosition(rollDiceSocketData.nextPosition);
    }
  }, [rollDiceSocketData]);

  const [onRollDice, setOnRollDice] = useState(false);

  // 이동 끝났는지 체크 (말)

  const [isMovementComplete, setIsMovementComplete] = useState(false);

  // 주사위 버튼을 눌렀는지 안 눌렀는지 추적
  useEffect(() => {
    if (onRollDice) {
      const alertRoll = async () => {
        try {
          const rollInfo = {
            playerId: currentPlayer.playerId,
            diceRolled: "true",
          };

          await roll(rollInfo);
          setOnRollDice(false);
          setIsDiceRolling(true);
          setHasRolledDice(true);
        } catch (error) {
          console.error("주사위 알림 전달 실패 :", error);
        }
      };
      alertRoll();
    }
  }, [onRollDice, currentPlayer]);

  useEffect(() => {
    setCurrentPlayerIndex(currentPlayerSocketIndex);
    setIsDiceRolling(false);
    setHasRolledDice(false);
    setShowModal(false);
  }, [currentPlayerSocketIndex]);

  // 다음행동 유추
  useEffect(() => {
    if (socketNext) {
      setNextAction(socketNext);
    }
  }, [socketNext]);

  // 턴 시작
  useEffect(() => {
    const turnStart = async () => {
      try {
        await startTurn();
        setSocketNext(null);
      } catch (error) {
        console.error("턴 시작에 오류가 생겼습니다.", error);
        setSocketNext(null);
      }
    };
    if (
      nextAction &&
      nextAction === "START_TURN" &&
      myIndex === currentPlayerIndex
    ) {
      console.log("턴을 시작합니다!!!");
      turnStart();
    }
  }, [nextAction]);
  console.log("현재 순서랑 내 차례", currentPlayerIndex, myIndex);

  // 주사위 굴리기
  useEffect(() => {
    console.log("🔍 주사위 굴리기 감지:", {
      nextAction,
      isDiceRolling,
      hasRolledDice,
      firstDice,
      secondDice,
      myIndex,
      currentPlayerIndex,
      isMovementComplete,
    });
    const handleDiceResult = async () => {
      if (
        isDiceRolling &&
        hasRolledDice &&
        firstDice !== null &&
        secondDice !== null
      ) {
        try {
          const diceInfo = {
            playerId: currentPlayer.playerId,
            firstDice: firstDice,
            secondDice: secondDice,
          };
          console.log("주사위 정보 :", diceInfo);
          await rollDice(diceInfo);
          setIsDiceRolling(false);
        } catch (error) {
          console.error("주사위 굴리기에 실패했습니다.", error);
          setSocketNext(null);
        }
      }
    };
    if (
      nextAction &&
      nextAction === "ROLL_DICE" &&
      hasRolledDice &&
      myIndex === currentPlayerIndex
    ) {
      handleDiceResult();
    }
  }, [
    nextAction,
    isDiceRolling,
    hasRolledDice,
    firstDice,
    secondDice,
    currentPlayer,
    rollDice,
  ]);

  useEffect(() => {
    if (!isDiceRolling) {
      console.log("♻️ 주사위 값 초기화 (턴 종료 후)");
      setTimeout(() => {
        setFirstDice(null);
        setSecondDice(null);
      }, 1000); // 1초 후 초기화
    }
  }, [isDiceRolling]);

  // 땅 구매
  useEffect(() => {
    if (!isMovementComplete) return;

    if (
      nextAction === "DO_YOU_WANT_TO_BUY_THE_LAND" &&
      !showBuyLand &&
      myIndex === currentPlayerIndex
    ) {
      if (showCardId !== nextPosition) {
        // 중복 실행 방지
        setShowCardId(nextPosition);
        setShowBuyLand(true);
        setSocketNext(null);
      }
    }
  }, [isMovementComplete, nextAction, nextPosition]);

  useEffect(() => {
    const handleBuyLand = async () => {
      if (
        isBuyLand &&
        currentPlayer &&
        nextPosition !== null &&
        myIndex === currentPlayerIndex
      ) {
        try {
          const buyInfo = {
            playerId: currentPlayer.playerId,
            tileId: nextPosition,
          };

          console.log("구매 요청 보내기 :", buyInfo);
          await buyLand(buyInfo);

          // 구매 요청이 성공적으로 보내진 후 상태 초기화
          setShowBuyLand(false);
          setShowCardId(null);
          setIsBuyLand(false);
        } catch (error) {
          console.error("땅 구매 요청 실패 :", error);
          setSocketNext(null);

          setShowBuyLand(false);
          setShowCardId(null);
          setIsBuyLand(false);
        }
      }
    };
    handleBuyLand();
  }, [isBuyLand, currentPlayer, nextPosition]);

  // 기지 건설
  useEffect(() => {
    if (!isMovementComplete) return;
    if (
      nextAction === "DO_YOU_WANT_TO_BUILD_THE_BASE" &&
      !showBuildBase &&
      myIndex === currentPlayerIndex
    ) {
      setShowCardId(nextPosition);
      setShowBuildBase(true);
      setSocketNext(null);
      return;
    }
  }, [isMovementComplete, nextAction, showBuildBase]);

  useEffect(() => {
    const handleBuildBase = async () => {
      if (
        isBuildBase &&
        currentPlayer &&
        nextPosition !== null &&
        myIndex === currentPlayerIndex
      ) {
        try {
          const buildInfo = {
            playerId: currentPlayer.playerId,
            tileId: nextPosition,
          };
          console.log("기지 건설 요청:", buildInfo);
          await buildBase(buildInfo);
          setShowBuildBase(false);
          setShowCardId(null);
          setIsBuildBase(false);
        } catch (error) {
          console.error("기지 건설 요청 실패 :", error);
          setSocketNext(null);
          setShowBuildBase(false);
          setShowCardId(null);
          setIsBuildBase(false);
        }
      }
    };
    handleBuildBase();
  }, [isBuildBase, currentPlayer, nextPosition]);

  // 종료 조건 확인
  useEffect(() => {
    if (
      nextAction &&
      nextAction === "CHECK_END" &&
      myIndex === currentPlayerIndex
    ) {
      try {
        const endInfo = {
          playerId: currentPlayer.playerId,
        };
        checkEnd(endInfo);
        console.log("종료 조건 체크");
      } catch (error) {
        console.error("종료 조건 체크 실패 : ", error);
        setSocketNext(null);
      }
    }
  }, [nextAction]);

  // 통행료 지불
  useEffect(() => {
    if (!isMovementComplete) return;
    if (
      nextAction &&
      nextAction === "PAY_TOLL" &&
      myIndex === currentPlayerIndex
    ) {
      try {
        const payInfo = {
          playerId: currentPlayer.playerId,
          tileId: nextPosition,
        };
        payToll(payInfo);
        console.log("통행료 지불 성공");
      } catch (error) {
        console.log("통행료 지불 실패: ", error);
        setSocketNext(null);
      }
      if (isMovementComplete) {
        setShowPayTollModal(true);
      }
    }
  }, [isMovementComplete, nextAction]);

  // 카드 뽑기 -> 모달
  useEffect(() => {
    if (
      nextAction &&
      nextAction === "DRAW_CARD" &&
      myIndex === currentPlayerIndex
    ) {
      try {
        const drawInfo = {
          playerId: currentPlayer.playerId,
          tileId: nextPosition,
        };
        drawCard(drawInfo);
        console.log("카드 뽑기 성공");
      } catch (error) {
        console.error("카드 뽑기 실패 :", error);
        setSocketNext(null);
      }
    }
  }, [nextAction]);

  const closeBuyLand = () => {
    setShowBuyLand(false);
    setShowCardId(null);
    setSocketNext("CHECK_END");
  };

  const closeBuildBase = () => {
    setShowBuildBase(false);
    setShowCardId(null);
    setSocketNext("CHECK_END");
  };

  const closePayToll = () => {
    setShowPayTollModal(false);
    setPaidPlayer(null);
    setReceivedPlayer(null);
    setTollPrice(null);
    setSocketNext("CHECK_END");
  };

  // 플레이어 위치 초기화
  const [playersPositions, setPlayersPositions] = useState(
    Array(numPlayers).fill(0)
  );

  const [isAnimating, setIsAnimating] = useState(false);
  // console.log(playersPositions);

  useEffect(() => {
    if (rollDiceSocketData && rollDiceSocketData.nextPosition !== undefined) {
      const playerIndex = players.findIndex(
        (player) => player.playerId === rollDiceSocketData.playerId
      );

      const startPosition = playersPositions[playerIndex];
      const targetPosition = rollDiceSocketData.nextPosition;
      console.log("🚀 이동 시작:", { startPosition, targetPosition });
      setIsMovementComplete(false); // 이동 시작 시 false 설정
      setIsAnimating(true);

      const animateMovement = async () => {
        let current = startPosition;

        while (current !== targetPosition) {
          current = (current + 1) % totalCells;
          setPlayersPositions((prev) => {
            const newPositions = [...prev];
            newPositions[playerIndex] = current;
            return newPositions;
          });
          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        setIsAnimating(false);
        setTimeout(() => setIsMovementComplete(true), 200); // 이동이 끝난 후 true로 변경
      };

      animateMovement();
    }
  }, [rollDiceSocketData]);

  useEffect(() => {
    if (currentPlayerIndex === myIndex) {
      setOnRollDice(false);
    }
  }, [currentPlayerIndex]);

  const [positions, setPositions] = useState([]);
  const [cellSizes, setCellSizes] = useState([]);

  const size = 11; // 각 변의 칸 수
  const totalCells = size * 4 - 4; // 전체 칸 개수
  const cells = Array.from({ length: totalCells }, (_, i) => i); // 칸 번호
  // const [currentPosition, setCurrentPosition] = useState(0); // 현재 말 위치

  // 카메라 위치 초기화하기 위한..
  const orbitControlsRef = useRef();
  const initialCameraPosition = [-20, 200, 0]; // 초기 카메라 위치
  const initialTarget = [0, 0, 0]; // 초기 카메라 타겟

  const resetCamera = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.object.position.set(...initialCameraPosition); // 카메라 위치 초기화
      orbitControlsRef.current.target.set(...initialTarget); // 타겟 초기화
      orbitControlsRef.current.update(); // OrbitControls 업데이트
    }
  };

  const cornerSize = [2.5, 0.2, 2.5]; // 코너 셀 크기
  const horizontalSize = [1.8, 0.2, 2.5]; // 가로 일반 셀 크기
  const verticalSize = [2.5, 0.2, 1.8]; // 세로 일반 셀 크기

  // 보드 전체 크기 계산 (간격 없이)
  const boardWidth = 2 * cornerSize[0] + (size - 2) * horizontalSize[0];
  const boardHeight = 2 * cornerSize[2] + (size - 2) * verticalSize[2];
  const centerOffsetX = boardWidth / 2;
  const centerOffsetZ = boardHeight / 2;

  // positions 초기화를 위한 useEffect 추가
  useEffect(() => {
    const newPositions = [];
    const newCellSizes = [];

    // 위쪽 면
    for (let i = 0; i < size; i++) {
      if (i === 0) {
        newCellSizes.push(cornerSize);
        newPositions.push([
          -centerOffsetX + cornerSize[0] / 2,
          0,
          -centerOffsetZ + cornerSize[2] / 2,
        ]);
      } else if (i === size - 1) {
        newCellSizes.push(cornerSize);
        newPositions.push([
          centerOffsetX - cornerSize[0] / 2,
          0,
          -centerOffsetZ + cornerSize[2] / 2,
        ]);
      } else {
        newCellSizes.push(horizontalSize);
        const xPos =
          -centerOffsetX +
          cornerSize[0] +
          (i - 1) * horizontalSize[0] +
          horizontalSize[0] / 2;
        newPositions.push([xPos, 0, -centerOffsetZ + horizontalSize[2] / 2]);
      }
    }

    // 오른쪽 면
    for (let i = 1; i < size - 1; i++) {
      newCellSizes.push(verticalSize);
      const zPos =
        -centerOffsetZ +
        cornerSize[2] +
        (i - 1) * verticalSize[2] +
        verticalSize[2] / 2;
      newPositions.push([centerOffsetX - verticalSize[0] / 2, 0, zPos]);
    }

    // 아래쪽 면
    for (let i = size - 1; i >= 0; i--) {
      if (i === 0) {
        newCellSizes.push(cornerSize);
        newPositions.push([
          -centerOffsetX + cornerSize[0] / 2,
          0,
          centerOffsetZ - cornerSize[2] / 2,
        ]);
      } else if (i === size - 1) {
        newCellSizes.push(cornerSize);
        newPositions.push([
          centerOffsetX - cornerSize[0] / 2,
          0,
          centerOffsetZ - cornerSize[2] / 2,
        ]);
      } else {
        newCellSizes.push(horizontalSize);
        const xPos =
          -centerOffsetX +
          cornerSize[0] +
          (i - 1) * horizontalSize[0] +
          horizontalSize[0] / 2;
        newPositions.push([xPos, 0, centerOffsetZ - horizontalSize[2] / 2]);
      }
    }

    // 왼쪽 면
    for (let i = size - 2; i > 0; i--) {
      newCellSizes.push(verticalSize);
      const zPos =
        -centerOffsetZ +
        cornerSize[2] +
        (i - 1) * verticalSize[2] +
        verticalSize[2] / 2;
      newPositions.push([-centerOffsetX + verticalSize[0] / 2, 0, zPos]);
    }

    setPositions(newPositions);
    setCellSizes(newCellSizes);
  }, []);

  // 칸별 내용 생성
  const renderCells = () => {
    const topTextures = [
      earthTexture,
      moonTexture,
      telepathyTexture1,
      marsTexture,
      jupiterTexture,
      vegaTexture,
      saturnTexture,
      telepathyTexture1,
      uranusTexture,
      neptuneTexture,
      timetravelTexture,
      ariesTexture,
      taurusTexture,
      telepathyTexture2,
      geminiTexture,
      neuronsTexture1,
      cancerTexture,
      timemachineTexture,
      leoTexture,
      virgoTexture,
      blackholeTexture,
      libraTexture,
      scorpioTexture,
      telepathyTexture3,
      sagittariusTexture,
      altairTexture,
      capricornTexture,
      aquariusTexture,
      piscesTexture,
      telepathyTexture3,
      resquebaseTexture,
      ursamajorTexture,
      andromedaTexture,
      telepathyTexture4,
      orionTexture,
      neuronsTexture2,
      cygnusTexture,
      halleyTexture,
      mercuryTexture,
      venusTexture,
    ];

    return positions.map((pos, index) => {
      const tile = board?.[index];
      const ownerId = players?.findIndex(
        (player) => player.playerId === tile?.ownerId
      );

      return (
        <Cell
          key={index}
          position={pos}
          name={cities[index]}
          topTextureUrl={index < topTextures.length ? topTextures[index] : null}
          size={cellSizes[index]}
          ownerIndex={ownerId}
          players={players}
        />
      );
    });
  };

  // 플레이어 우주 기지를 세운!
  const [playerBases, setPlayerBases] = useState(Array(numPlayers).fill(0));

  useEffect(() => {
    if (onBasesInfo) {
      onBasesInfo(playerBases);
    }
  }, [playerBases, onBasesInfo]); // playerBase가 변경될 때마다 실행

  // 우주기지 생성
  const [spaceBases, setSpaceBases] = useState(() => {
    //모든 포지션에 대해 초기 우주기지 생성
    // positions가 아직 설정되지 않았으므로 빈 배열로 시작
    return [];
  });

  // positions가 설정된 후 우주기지 초기화
  useEffect(() => {
    if (positions.length > 0) {
      // 모든 positions에 대해 우주기지 생성

      const initialBases = positions.map((position, index) => {
        const cellSize = cellSizes[index];

        let baseSize;
        // 인덱스  0-9, 20-29: 가로가 세로의 2배
        if ((index >= 0 && index <= 9) || (index >= 20 && index <= 29)) {
          baseSize = {
            width: cellSize[0] * 0.64,
            height: 1.3,
            depth: cellSize[2] * 0.28,
          };
        } else if (
          (index >= 10 && index <= 19) ||
          (index >= 30 && index <= 39)
        ) {
          baseSize = {
            width: cellSize[0] * 0.28,
            height: 1.3,
            depth: cellSize[2] * 0.64,
          };
        }

        return {
          position: position,
          color: null,
          size: baseSize,
          visible: false,
        };
      });
      setSpaceBases(initialBases);
    }
  }, [positions, cellSizes]);

  // Preload textures
  const floor = useMemo(() => useLoader(TextureLoader, floorTexture), []);
  const timeMachineStopTexture = useMemo(
    () => useLoader(TextureLoader, timemachineStop),
    []
  );
  const telepathyCardTexture = useMemo(
    () => useLoader(TextureLoader, telepathyCard),
    []
  );
  const neuronsCardTexture = useMemo(
    () => useLoader(TextureLoader, neuronsCard),
    []
  );

  // positions 배열에서 각 플레이어의 위치 좌표 계산
  const getPlayerPosition = (playerPosition, playerIndex) => {
    if (!positions[playerPosition]) {
      return [0, 0, 0];
    }
    const basePosition = positions[playerPosition];
    // 말이 같은 칸에 있을 때 겹치지 않도록 약간의 오프셋 추가
    const offset = 0.5;
    switch (playerIndex) {
      case 0:
        return [
          basePosition[0] - offset,
          basePosition[1] + 0.7,
          basePosition[2] - offset,
        ];
      case 1:
        return [
          basePosition[0] + offset,
          basePosition[1] + 0.7,
          basePosition[2] - offset,
        ];
      case 2:
        return [
          basePosition[0] - offset,
          basePosition[1] + 0.7,
          basePosition[2] + offset,
        ];
      case 3:
        return [
          basePosition[0] + offset,
          basePosition[1] + 0.7,
          basePosition[2] + offset,
        ];
    }
  };

  // // Canvas 내부에 우주선 렌더링 추가
  // const renderSpaceships = () => {
  //   return players
  //     .slice(0, numPlayers)
  //     .map((player, index) => (
  //       <BlueRobot
  //         key={player.id}
  //         position={getPlayerPosition(player.position, index)
  //           scale={0.2}
  //         }
  //       />
  //     ));
  // };

  // 우주 기지 렌더링 추가
  const renderSpaceBases = useMemo(() => {
    // console.log("render base");
    return spaceBases.map((base, index) => {
      let adjustedPosition;
      if (index >= 1 && index <= 9) {
        // 하단 1/3
        adjustedPosition = [
          base.position[0],
          base.position[1] + 0.3,
          base.position[2] + base.size.depth + 0.1,
        ];
      } else if (index >= 11 && index <= 19) {
        // 좌측 1/3
        adjustedPosition = [
          base.position[0] - base.size.width - 0.1,
          base.position[1] + 0.3,
          base.position[2],
        ];
      } else if (index >= 21 && index <= 29) {
        // 상단 1/3
        adjustedPosition = [
          base.position[0],
          base.position[1] + 0.3,
          base.position[2] - base.size.depth - 0.1,
        ];
      } else if (index >= 31 && index <= 39) {
        // 우측 1/3
        adjustedPosition = [
          base.position[0] + base.size.width + 0.1,
          base.position[1] + 0.3,
          base.position[2],
        ];
      }

      return (
        <SpaceBase
          position={adjustedPosition}
          key={index}
          color={base.color}
          width={base.size.width}
          height={base.size.height}
          depth={base.size.depth} // 3D 크기
          visible={base.visible}
        />
      );
    });
  }, [spaceBases]);

  // Portal을 위한 state
  const [mountPortal, setMountPortal] = useState(false);

  // 컴포넌트 마운트 후 Portal 활성화
  useEffect(() => {
    setMountPortal(true);
  }, []);

  useEffect(() => {
    // Modal이 열릴 때 메인 Canvas의 렌더링 일시 중지
    if (showModal) {
      // Canvas 렌더링 일시 중지 로직
      return () => {
        // Canvas 렌더링 재개 로직
      };
    }
  }, [showModal]);

  return (
    <div className="h-[100%] flex flex-col bg-black bg-opacity-50">
      {/* 이동 버튼 + 주사위 버튼 */}
      <div className="flex justify-center items-center mb-2">
        <button
          onClick={resetCamera}
          className="mt-5 mx-3 px-4 py-2 h-15 bg-yellow-300 text-white rounded hover:bg-blue-600"
        >
          Reset Camera
        </button>
        {currentPlayerIndex === myIndex && (
          <DiceVersion2
            setOnRollDice={setOnRollDice}
            setFirstDice={setFirstDice}
            setSecondDice={setSecondDice}
          />
        )}
      </div>
      <div className="flex w-full h-full">
        <div className=" w-full h-full">
          {!showModal && (
            <Canvas
              camera={{
                position: initialCameraPosition,
                fov: 75,
              }}
              dpr={[1, 1.5]}
              style={{ maxWidth: "1200px", maxHeight: "1000px" }}
              performance={{ min: 0.5 }}
              gl={{
                powerPreference: "high-performance",
                antialias: false, // 안티앨리어싱 비활성화로 성능 향상
                depth: true,
              }}
              onCreated={({ gl, scene }) => {
                const texture = new TextureLoader().load(spaceBackground);
                scene.background = texture;
                gl.setClearColor("#000000", 0);

                // WebGL 컨텍스트 복구 처리 추가
                if (gl.domElement) {
                  gl.domElement.addEventListener(
                    "webglcontextlost",
                    (event) => {
                      event.preventDefault();
                      // console.warn("Main canvas context lost");
                    }
                  );

                  gl.domElement.addEventListener("webglcontextrestored", () => {
                    // console.log("Context restored");
                    gl.render(scene, camera);
                  });
                }
              }}
            >
              <ambientLight intensity={1} /> {/* 주변광 밝기 증가 */}
              <directionalLight
                position={[10, 20, 10]}
                intensity={3}
                castShadow
              />{" "}
              {/* 태양광 추가 */}
              <pointLight position={[10, 20, 10]} intensity={3} color="white" />
              <spotLight
                position={[0, 10, 0]}
                angle={0.6}
                penumbra={0.5}
                intensity={3}
              />
              {/* 바닥 생성 */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, 0]}>
                <planeGeometry args={[16.5, 16.5]} />
                <meshStandardMaterial map={floor} color="#ffffff" />
              </mesh>
              {/* 타임머신 탑승장 */}
              <mesh position={[5, 0.01, -5]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[5, 5]} />
                <meshStandardMaterial
                  map={timeMachineStopTexture} // 추가 이미지 텍스처
                  transparent={true}
                />
              </mesh>
              {/* 텔레파시 카드 */}
              <mesh position={[5, 0.01, 4.5]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[3, 5]} />
                <meshStandardMaterial
                  map={telepathyCardTexture} // 추가 이미지 텍스처
                  transparent={true}
                />
              </mesh>
              {/* 뉴런의 골짜기 */}
              <mesh position={[-5, 0.01, -5]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[5, 5]} />
                <meshStandardMaterial
                  map={neuronsCardTexture} // 추가 이미지 텍스처
                  transparent={true}
                />
              </mesh>
              {/* OrbitControls로 카메라 이동 및 확대/축소 제어 */}
              <OrbitControls
                ref={orbitControlsRef}
                target={initialTarget}
                makeDefault
                maxPolarAngle={Math.PI / 2.5} // 위쪽으로 카메라 제한
                minDistance={1} // 최소 줌 거리
                maxDistance={15} // 최대 줌 거리
                mouseButtons={{
                  LEFT: 0,
                  MIDDLE: 1,
                  RIGHT: 2,
                }}
                enablePan={true}
                zoomToCursor={true}
                rotateSpeed={0.15}
              />
              {renderCells()}
              {players.slice(0, numPlayers).map((player, index) => (
                <HeartPlayer
                  key={player.id}
                  position={getPlayerPosition(playersPositions[index], index)}
                  color={colors[index]} // 플레이어 색상 적용
                  scale={0.6} // 하트 크기 조절
                />
              ))}
              {renderSpaceBases}
            </Canvas>
          )}
        </div>
      </div>
      {/* {mountPortal &&
        showModal &&
        createPortal(
          <div className="fixed inset-0 z-50 w-2/3 text-center flex items-center justify-center">
            <Dice
              onComplete={handleDiceComplete}
              onClose={() => setShowModal(false)}
              roomId={roomId}
              setFirstDice={setFirstDice}
              setSecondDice={setSecondDice}
            />
          </div>,
          document.body
        )} */}
      {mountPortal &&
        showBuyLand &&
        showCardId &&
        currentPlayerIndex === myColorIndex &&
        createPortal(
          <div className="fixed inset-0 z-50 w-2/3 text-center flex items-center justify-center">
            <QuestBuyLand
              setIsBuyLand={setIsBuyLand}
              onClose={closeBuyLand}
              cardId={showCardId}
              cardInfo={cards?.[showCardId]}
            />
          </div>,
          document.body
        )}

      {mountPortal &&
        showBuildBase &&
        showCardId &&
        currentPlayerIndex === myColorIndex &&
        createPortal(
          <div className="fixed inset-0 z-50 w-2/3 text-center flex items-center justify-center">
            <QuestBuildBase
              setIsBuildBase={setIsBuildBase}
              onClose={closeBuildBase}
              cardId={showCardId}
              cardInfo={cards?.[showCardId]}
            />
          </div>,
          document.body
        )}
      {mountPortal &&
        showPayTollModal &&
        createPortal(
          <div className="fixed inset-0 z-50 w-2/3 text-center flex items-center justify-center">
            <PayTollModal
              onClose={closePayToll}
              tollPrice={tollPrice}
              receivedPlayer={receivedPlayer}
              paidPlayer={paidPlayer}
            />
          </div>,
          document.body
        )}
    </div>
  );
};

export default TravelMap;
