import React, { useEffect, useRef, useState } from "react";
import { OpenVidu } from "openvidu-browser";
import { Camera, CameraOff, Mic, MicOff } from "lucide-react";
import axios from "axios";

const OPENVIDU_SERVER_URL = "https://boardjjigae.duckdns.org:4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";
const HEADERS = {
  Authorization: "Basic " + btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`),
  "Content-Type": "application/json",
};

const VideoChat = ({ playerCount, userId, players }) => {
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [error, setError] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [isConnecting, setIsConnecting] = useState(true);

  const videoRefs = useRef([]);
  const OVRef = useRef(null);

  const toggleMic = () => {
    if (publisher) {
      const newMicState = !isMicOn;
      publisher.publishAudio(newMicState);
      setIsMicOn(newMicState);
    }
  };

  const toggleCamera = () => {
    if (publisher) {
      const newCameraState = !isCameraOn;
      publisher.publishVideo(newCameraState);
      setIsCameraOn(newCameraState);
    }
  };

  const checkSession = async (sessionId) => {
    try {
      const response = await axios.get(
        `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}`,
        {
          headers: {
            Authorization:
              "Basic " + btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`),
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.warn("Session check failed:", error);
      return null;
    }
  };

  const createSession = async (sessionId) => {
    try {
      const response = await axios.post(
        `${OPENVIDU_SERVER_URL}/openvidu/api/sessions`,
        { customSessionId: sessionId },
        { headers: HEADERS, validateStatus: () => true }
      );

      if (response.status === 409) {
        return sessionId;
      }
      return response.data.id;
    } catch (error) {
      return sessionId;
    }
  };

  const createToken = async (sessionId) => {
    const response = await axios.post(
      `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection`,
      {},
      { headers: HEADERS }
    );
    return response.data.token;
  };

  const handleStreamCreated = (event) => {
    try {
      const streamUserId = JSON.parse(event.stream.connection.data).clientData;
      if (streamUserId === userId) return;

      const emptySlot = videoRefs.current.findIndex(
        (ref, index) =>
          index > 0 &&
          !subscribers.some(
            (sub) =>
              sub.stream.streamManager.stream.streamId === event.stream.streamId
          )
      );

      if (emptySlot === -1) return;

      const subscriber = session.subscribe(
        event.stream,
        videoRefs.current[emptySlot]
      );
      setSubscribers((prev) => [
        ...prev,
        { ...subscriber, slotIndex: emptySlot },
      ]);
    } catch (error) {
      setError("스트림 구독 중 오류가 발생했습니다.");
    }
  };

  const handleStreamDestroyed = (event) => {
    console.log("Stream destroyed event:", event);
    setSubscribers((prev) =>
      prev.filter((sub) => sub.stream.streamId !== event.stream.streamId)
    );
  };

  const initializeSession = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      OVRef.current = new OpenVidu();
      const sessionId = await createSession(userId);
      const session = OVRef.current.initSession();

      session.on("streamCreated", handleStreamCreated);
      session.on("streamDestroyed", handleStreamDestroyed);
      session.on("exception", () => setError("세션 오류가 발생했습니다."));

      setSession(session);

      const token = await createToken(sessionId);
      await session.connect(token, { clientData: userId });

      const publisher = await OVRef.current.initPublisher(
        videoRefs.current[0],
        {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: "640x480",
          frameRate: 30,
          insertMode: "APPEND",
          mirror: false,
        }
      );

      await session.publish(publisher);
      setPublisher(publisher);
      setIsConnecting(false);
    } catch (error) {
      setError("비디오 초기화 중 오류가 발생했습니다");
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    initializeSession();

    return () => {
      // Cleanup function
      if (publisher) {
        try {
          publisher.stream?.dispose();
        } catch (error) {
          console.warn("Publisher cleanup error:", error);
        }
      }

      subscribers.forEach((subscriber) => {
        try {
          subscriber.stream?.dispose();
        } catch (error) {
          console.warn("Subscriber cleanup error:", error);
        }
      });

      if (session) {
        console.log("Cleaning up session");
        session.disconnect();
      }

      if (OVRef.current) {
        OVRef.current = null;
      }
    };
  }, []);

  const renderVideoElement = (index) => {
    // 첫 번째 칸은 자신의 비디오 (publisher)
    if (index === 0) {
      return (
        <div
          key={index}
          ref={(el) => (videoRefs.current[index] = el)}
          className="relative bg-gray-900 rounded-lg flex items-center justify-center h-40 overflow-hidden"
        >
          <div className="absolute top-2 left-2 bg-gray-900/70 px-2 py-1 rounded text-xs text-white z-10">
            {userId} (나)
          </div>

          {error && (
            <div className="absolute top-2 right-2 bg-red-500/80 px-2 py-1 rounded text-xs text-white">
              {error}
            </div>
          )}

          {!publisher && !error && (
            <div className="text-gray-500 text-sm">
              {isConnecting ? "연결 중..." : "카메라 연결 실패"}
            </div>
          )}

          {publisher && (
            <div className="absolute bottom-2 right-2 flex gap-2 z-10">
              <button
                onClick={toggleMic}
                className="p-1.5 bg-gray-800/80 rounded-full hover:bg-gray-700/80 transition-colors"
              >
                {isMicOn ? (
                  <Mic className="w-4 h-4 text-white" />
                ) : (
                  <MicOff className="w-4 h-4 text-red-500" />
                )}
              </button>
              <button
                onClick={toggleCamera}
                className="p-1.5 bg-gray-800/80 rounded-full hover:bg-gray-700/80 transition-colors"
              >
                {isCameraOn ? (
                  <Camera className="w-4 h-4 text-white" />
                ) : (
                  <CameraOff className="w-4 h-4 text-red-500" />
                )}
              </button>
            </div>
          )}
        </div>
      );
    }

    // 나머지 칸들은 다른 참가자들의 공간
    const otherPlayers = players?.filter(player => player !== userId) || [];
    const playerForThisSlot = otherPlayers[index - 1];  // index 0은 자신이므로 1을 빼줌

    return (
      <div
        key={index}
        ref={(el) => (videoRefs.current[index] = el)}
        className="relative bg-gray-900 rounded-lg flex items-center justify-center h-40 overflow-hidden"
      >
        <div className="absolute top-2 left-2 bg-gray-900/70 px-2 py-1 rounded text-xs text-white z-10">
          {playerForThisSlot || "대기 중..."}
        </div>
        
        <div className="text-gray-500 text-sm">
          {playerForThisSlot ? "카메라 연결 실패" : "대기 중..."}
        </div>
      </div>
    );
  };

  return (
    <div
      className="grid gap-2 h-full p-2"
      style={{
        gridTemplateColumns: `repeat(${Math.max(playerCount, 1)}, 1fr)`,
      }}
    >
      {/* 디버깅용 로그 */}
      {console.log("VideoChat rendering:", { playerCount, subscribers })}

      {Array(Math.max(playerCount, 1))
        .fill(null)
        .map((_, i) => renderVideoElement(i))}
    </div>
  );
};

export default VideoChat;
