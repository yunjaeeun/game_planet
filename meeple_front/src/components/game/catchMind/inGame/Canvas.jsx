import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Pencil, Eraser, Trash2 } from "lucide-react";
import useCatchSocket from "../../../../hooks/useCatchSocket";

const DrawingTools = ({
  onColorChange,
  onWidthChange,
  onEraserToggle,
  onClearCanvas,
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/90 backdrop-blur-md rounded-lg p-3 shadow-lg border border-gray-800">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 group">
          <Pencil className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
          <input
            type="color"
            className="w-8 h-8 rounded cursor-pointer 
              bg-gray-800 border border-gray-700 
              hover:ring-2 hover:ring-blue-500/50 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all"
            onChange={(e) => onColorChange(e.target.value)}
            onClick={() => onEraserToggle(false)}
          />
        </div>
        <select
          className="px-2 py-1.5 border border-gray-700 rounded-lg 
            bg-gray-800 text-gray-200 
            focus:outline-none focus:ring-2 focus:ring-blue-500
            hover:border-gray-600 
            transition-all"
          onChange={(e) => onWidthChange(parseInt(e.target.value))}
        >
          <option value="2">2px</option>
          <option value="4">4px</option>
          <option value="6">6px</option>
          <option value="8">8px</option>
          <option value="10">10px</option>
        </select>
      </div>
      <div className="h-6 w-px bg-gray-700" />
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEraserToggle(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 
            bg-gray-800 text-gray-200 
            rounded-lg hover:bg-gray-700 
            focus:outline-none focus:ring-2 focus:ring-blue-500
            border border-gray-700
            transition-colors group"
        >
          <Eraser className="w-4 h-4 text-gray-400 group-hover:text-gray-200 transition-colors" />
          지우개
        </button>
        <button
          onClick={onClearCanvas}
          className="flex items-center gap-1.5 px-3 py-1.5 
            bg-red-800/80 text-red-100 
            rounded-lg hover:bg-red-700/90 
            focus:outline-none focus:ring-2 focus:ring-red-500
            transition-colors group"
        >
          <Trash2 className="w-4 h-4 text-red-300 group-hover:text-red-100 transition-colors" />
          전체 지우기
        </button>
      </div>
    </div>
  );
};

const Canvas = () => {
  const { roomId } = useParams();
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const subscriptionRef = useRef(null);
  const prevCurrentPlayerRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);

  // 그리기 도구 상태 관리
  const [drawingColor, setDrawingColor] = useState("#000000");
  const [drawingWidth, setDrawingWidth] = useState(2);
  const [isEraserMode, setIsEraserMode] = useState(false);

  const { client, connected } = useCatchSocket(roomId);
  const currentPlayer = useSelector((state) =>
    state.catchmind.players.find((p) => p.isTurn)
  );
  const userNickname = useSelector(
    (state) => state.profile.profileData?.userNickname
  );
  const userId = useSelector((state) => state.user.userId);

  // 그리기 도구 핸들러
  const handleColorChange = useCallback((color) => {
    setDrawingColor(color);
    setIsEraserMode(false);
  }, []);

  const handleWidthChange = useCallback((width) => {
    setDrawingWidth(width);
  }, []);

  const handleEraserToggle = useCallback((eraserMode) => {
    setIsEraserMode(eraserMode);
  }, []);

  // 현재 그리기 색상과 굵기 가져오기
  const getCurrentColor = useCallback(() => {
    return isEraserMode ? "#FFFFFF" : drawingColor;
  }, [isEraserMode, drawingColor]);

  const getCurrentWidth = useCallback(() => {
    return isEraserMode ? drawingWidth * 2 : drawingWidth;
  }, [isEraserMode, drawingWidth]);

  // 드로잉 데이터 핸들러
  const handleDrawingData = useCallback(
    (message) => {
      try {
        const data = JSON.parse(message.body);
        if (!data || !data.type || data.userId === parseInt(userId)) return;

        const context = canvasRef.current?.getContext("2d");
        if (!context) return;

        context.strokeStyle = data.color || "#000000";
        context.lineWidth = parseInt(data.lineWidth) || 2;
        context.lineCap = "round";

        switch (data.type) {
          case "start":
            context.beginPath();
            context.moveTo(data.x, data.y);
            break;

          case "draw":
          case "end":
            if (
              typeof data.lastX === "number" &&
              typeof data.lastY === "number"
            ) {
              context.beginPath();
              context.moveTo(data.lastX, data.lastY);
              context.lineTo(data.x, data.y);
              context.stroke();
            }
            if (data.type === "end") {
              context.closePath();
            }
            break;

          case "clear":
            context.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
            break;
        }
      } catch (error) {
        console.error("드로잉 데이터 처리 오류:", error);
      }
    },
    [userId]
  );

  // WebSocket 구독 설정
  useEffect(() => {
    if (!client || !connected || !roomId) return;

    try {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }

      subscriptionRef.current = client.subscribe(
        `/topic/catch-mind/${roomId}`,
        handleDrawingData
      );
    } catch (error) {
      console.error("구독 설정 실패:", error);
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [client, connected, roomId, handleDrawingData]);

  // WebSocket을 통한 그리기 데이터 전송
  const sendDrawingData = useCallback(
    (drawingData) => {
      if (!client || !roomId || !connected) return;

      try {
        const message = {
          type: drawingData.type,
          roomId: parseInt(roomId),
          userId: parseInt(userId),
          x: Math.round(drawingData.x),
          y: Math.round(drawingData.y),
          color: getCurrentColor(),
          lineWidth: getCurrentWidth().toString(),
        };

        if (drawingData.type === "draw" || drawingData.type === "end") {
          if (
            drawingData.lastX !== undefined &&
            drawingData.lastY !== undefined
          ) {
            message.lastX = Math.round(drawingData.lastX);
            message.lastY = Math.round(drawingData.lastY);
          }
        }

        client.publish({
          destination: `/app/drawing/${roomId}`,
          body: JSON.stringify(message),
          headers: { "content-type": "application/json" },
        });
      } catch (error) {
        console.error("드로잉 데이터 전송 실패:", error);
      }
    },
    [client, roomId, connected, userId, getCurrentColor, getCurrentWidth]
  );

  // 캔버스 초기화 함수
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (client && connected) {
      sendDrawingData({ type: "clear" });
    }
  }, [client, connected, sendDrawingData]);

  // 캔버스 초기 설정
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    contextRef.current = context;

    // 초기 스타일 설정
    context.strokeStyle = getCurrentColor();
    context.lineWidth = getCurrentWidth();
  }, []);

  // 출제자 변경 시 캔버스 초기화
  useEffect(() => {
    if (
      prevCurrentPlayerRef.current &&
      currentPlayer &&
      prevCurrentPlayerRef.current.nickname !== currentPlayer.nickname
    ) {
      clearCanvas();
    }
    prevCurrentPlayerRef.current = currentPlayer;
  }, [currentPlayer, clearCanvas]);

  // 그리기 스타일 업데이트
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = getCurrentColor();
      contextRef.current.lineWidth = getCurrentWidth();
    }
  }, [getCurrentColor, getCurrentWidth]);

  // 그리기 시작
  const startDrawing = ({ nativeEvent }) => {
    if (!canDraw() || !connected) return;

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setLastPoint({ x: offsetX, y: offsetY });

    sendDrawingData({
      type: "start",
      x: offsetX,
      y: offsetY,
    });
  };

  // 그리기
  const draw = ({ nativeEvent }) => {
    if (!isDrawing || !canDraw() || !lastPoint || !connected) return;

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(lastPoint.x, lastPoint.y);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    sendDrawingData({
      type: "draw",
      x: offsetX,
      y: offsetY,
      lastX: lastPoint.x,
      lastY: lastPoint.y,
    });

    setLastPoint({ x: offsetX, y: offsetY });
  };

  // 그리기 종료
  const finishDrawing = (event) => {
    if (!connected || !isDrawing || !lastPoint) return;

    const { offsetX, offsetY } = event.nativeEvent || event;
    contextRef.current.beginPath();
    contextRef.current.moveTo(lastPoint.x, lastPoint.y);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    contextRef.current.closePath();

    sendDrawingData({
      type: "end",
      x: offsetX,
      y: offsetY,
      lastX: lastPoint.x,
      lastY: lastPoint.y,
    });

    setIsDrawing(false);
    setLastPoint(null);
  };

  // 그리기 권한 확인
  const canDraw = () => {
    return currentPlayer?.nickname === userNickname;
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${
          canDraw() ? "cursor-crosshair" : "cursor-not-allowed"
        }`}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
      />
      {/* 현재 턴인 플레이어에게만 그리기 도구 표시 */}
      {canDraw() && (
        <DrawingTools
          onColorChange={handleColorChange}
          onWidthChange={handleWidthChange}
          onEraserToggle={handleEraserToggle}
          onClearCanvas={clearCanvas}
        />
      )}
    </div>
  );
};

export default Canvas;
