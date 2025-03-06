import React, { useEffect, useState, useRef } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import PlayerCard from "./PlayerCard";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useSelector } from "react-redux";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";

const VideoChat = ({ nickname, sessionId, isCurrentUser }) => {
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [connectionError, setConnectionError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [players, setPlayers] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const tokenRef = useRef(null);
  const stompClient = useRef(null);

  const gameStatePlayers = useSelector((state) => state.catchmind.players);

  useEffect(() => {
    let isComponentMounted = true;
    let client = null;

    const connect = () => {
      if (!isComponentMounted) return;

      try {
        const wsUrl = `${import.meta.env.VITE_SOCKET_API_BASE_URL}`;
        console.log("Connecting to WebSocket URL:", wsUrl);

        // SockJS 설정
        const socket = new SockJS(wsUrl, null, {
          transports: ["websocket", "xhr-streaming", "xhr-polling"],
          timeout: 10000,
        });

        client = new StompJs.Client({
          webSocketFactory: () => socket,
          connectHeaders: {
            Origin: window.location.origin,
          },
          debug: (str) => {
            console.log("STOMP Debug:", str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          connectionTimeout: 10000,
        });

        client.onConnect = () => {
          console.log("WebSocket Connected Successfully");
          if (!isComponentMounted) {
            client.deactivate();
            return;
          }
          stompClient.current = client;

          // OpenVidu 스트림이 이미 존재하면 데이터 전송
          if (publisher) {
            const streamData = {
              nickname: nickname,
              streamId: publisher.stream.streamId,
              connectionId: publisher.stream.connection.connectionId,
            };
            sendStreamData(nickname, JSON.stringify(streamData));
          }
        };

        client.onStompError = (frame) => {
          console.error("STOMP Protocol Error:", frame);
        };

        client.onWebSocketError = (error) => {
          console.error("WebSocket Error:", error);
        };

        client.onDisconnect = () => {
          console.log("WebSocket Disconnected");
          if (isComponentMounted) {
            setTimeout(connect, 5000);
          }
        };

        client.activate();
      } catch (error) {
        console.error("Error creating WebSocket connection:", error);
        if (isComponentMounted) {
          setTimeout(connect, 5000);
        }
      }
    };

    connect();

    return () => {
      isComponentMounted = false;
      if (client?.connected) {
        client.deactivate();
      }
    };
  }, [nickname, publisher]);

  // 스트림 데이터 전송 함수
  const sendStreamData = (nickname, streamData) => {
    if (stompClient.current?.connected) {
      try {
        const message = {
          userStream: streamData,
        };
        console.log("Sending stream data:", message);
        stompClient.current.publish({
          destination: `/app/give-stream/${nickname}`,
          body: JSON.stringify(message),
          headers: { "content-type": "application/json" },
        });
      } catch (error) {
        console.error("Error sending stream data:", error);
      }
    } else {
      console.warn("STOMP client not connected. Unable to send stream data.");
    }
  };

  // 오디오 상태 토글
  const toggleAudio = () => {
    if (publisher) {
      publisher.publishAudio(!audioEnabled);
      setAudioEnabled(!audioEnabled);
    }
  };

  // 비디오 상태 토글
  const toggleVideo = () => {
    if (publisher) {
      publisher.publishVideo(!videoEnabled);
      setVideoEnabled(!videoEnabled);
    }
  };

  // Media Control Button 컴포넌트
  const MediaControlButton = ({ onClick, enabled, Icon, DisabledIcon }) => (
    <button
      onClick={onClick}
      className={`p-1.5 rounded-full transition-all duration-200 backdrop-blur-md
        ${
          enabled
            ? "bg-white/10 hover:bg-white/20 text-white shadow-lg"
            : "bg-red-500/20 hover:bg-red-500/30 text-red-500 shadow-lg"
        }
        group flex items-center justify-center
        hover:scale-110 active:scale-95
        border ${enabled ? "border-white/20" : "border-red-500/30"}
      `}
    >
      <div className="transition-transform duration-200 group-hover:scale-110">
        {enabled ? <Icon size={16} /> : <DisabledIcon size={16} />}
      </div>
    </button>
  );

  // players 상태 업데이트 함수
  const updatePlayers = (publisher, subscribers) => {
    const allPlayers = [];
    const addedNicknames = new Set(); // 이미 추가된 닉네임을 추적

    // 현재 사용자(publisher) 추가
    if (publisher) {
      const currentPlayerState = gameStatePlayers.find(
        (p) => p.nickname === nickname
      );
      allPlayers.push({
        stream: publisher.stream,
        nickname: nickname,
        isCurrentUser: true,
        score: currentPlayerState?.score || 0, // Redux store에서 점수 가져오기
        isCurrentTurn: currentPlayerState?.isTurn || false,
        audioEnabled: audioEnabled,
        videoEnabled: videoEnabled,
      });
      addedNicknames.add(nickname);
    }

    // 다른 참가자들(subscribers) 추가 - 중복 닉네임 체크
    subscribers.forEach((subscriber) => {
      const connectionData = JSON.parse(subscriber.stream.connection.data);
      const playerNickname = connectionData.clientData;
      const playerState = gameStatePlayers.find(
        (p) => p.nickname === connectionData.clientData
      );

      // 이미 추가된 닉네임이 아닌 경우에만 추가
      if (!addedNicknames.has(playerNickname)) {
        allPlayers.push({
          stream: subscriber.stream,
          nickname: connectionData.clientData,
          isCurrentUser: false,
          score: playerState?.score || 0, // Redux store에서 점수 가져오기
          isCurrentTurn: playerState?.isTurn || false,
          audioEnabled: subscriber.stream.audioActive,
          videoEnabled: subscriber.stream.videoActive,
        });
        addedNicknames.add(playerNickname);
      }
    });

    setPlayers(allPlayers);
  };

  useEffect(() => {
    if (publisher || subscribers.length > 0) {
      updatePlayers(publisher, subscribers);
    }
  }, [gameStatePlayers, publisher, subscribers]);

  useEffect(() => {
    console.log("Subscribers 상태 변경:", {
      count: subscribers.length,
      subscribers: subscribers.map((sub) => ({
        connectionId: sub.stream.connection.connectionId,
        streamId: sub.stream.streamId,
        connectionData: JSON.parse(sub.stream.connection.data),
      })),
    });

    updatePlayers(publisher, subscribers);
  }, [subscribers, publisher, audioEnabled, videoEnabled]);

  useEffect(() => {
    if (!sessionId || !nickname || !isCurrentUser || isConnecting) {
      return;
    }

    const OV = new OpenVidu();
    let currentSession = null;

    const connectToSession = async () => {
      try {
        setIsConnecting(true);
        console.log("Initializing session with ID:", sessionId);
        currentSession = OV.initSession();
        setSession(currentSession);

        currentSession.on("streamCreated", (event) => {
          console.log("New stream created", event.stream.connection.data);
          const connectionData = JSON.parse(event.stream.connection.data);

          if (connectionData.clientData !== nickname) {
            console.log("구독 시도:", {
              streamId: event.stream.streamId,
              connectionData: connectionData,
            });

            const subscriber = currentSession.subscribe(
              event.stream,
              undefined
            );

            setSubscribers((prev) => {
              const exists = prev.find(
                (sub) =>
                  sub.stream.connection.connectionId ===
                  subscriber.stream.connection.connectionId
              );
              return exists ? prev : [...prev, subscriber];
            });
          }
        });

        currentSession.on("streamDestroyed", (event) => {
          console.log("Stream destroyed", {
            connectionData: event.stream.connection.data,
            streamId: event.stream.streamId,
          });

          setSubscribers((prev) =>
            prev.filter(
              (sub) =>
                sub.stream.connection.connectionId !==
                event.stream.connection.connectionId
            )
          );
        });

        currentSession.on("sessionDisconnected", () => {
          console.log("Session disconnected, clearing subscribers");
          setSubscribers([]);
          setIsConnecting(false);
          tokenRef.current = null;
        });

        if (!tokenRef.current) {
          const response = await axios.post(
            `${
              import.meta.env.VITE_API_BASE_URL
            }/api/video/generate-token/${sessionId}`,
            // `${
            //   import.meta.env.VITE_LOCAL_API_BASE_URL
            // }/api/video/generate-token/${sessionId}`,
            {},
            {
              headers: { "Content-Type": "application/json" },
              timeout: 10000,
            }
          );

          if (!response.data?.token) {
            throw new Error("No token received from server");
          }

          tokenRef.current = response.data.token;
        }

        await currentSession.connect(tokenRef.current, {
          clientData: nickname,
        });

        const newPublisher = await OV.initPublisher(undefined, {
          audioSource: undefined, // 기본 마이크 사용
          videoSource: undefined, // 기본 카메라 사용
          publishAudio: audioEnabled,
          publishVideo: videoEnabled,
          resolution: "640x480",
          frameRate: 15,
          insertMode: "APPEND",
          mirror: false,
          publisherProperties: {
            mediaConstraints: {
              audio: {
                echoCancellation: true, // 에코 캔슬레이션 활성화
                noiseSuppression: true, // 노이즈 제거 활성화
                autoGainControl: true, // 자동 게인 컨트롤 활성화
              },
            },
          },
        });

        await currentSession.publish(newPublisher);
        setPublisher(newPublisher);

        // Publisher가 생성되면 스트림 데이터 전송
        const streamData = {
          nickname: nickname,
          streamId: newPublisher.stream.streamId,
          connectionId: newPublisher.stream.connection.connectionId,
        };

        // nickname으로 스트림 데이터 전송
        sendStreamData(nickname, JSON.stringify(streamData));
      } catch (error) {
        console.error("Error in video chat connection:", error);
        setConnectionError(
          error.response?.status === 500
            ? "서버 오류가 발생했습니다."
            : `연결 오류: ${error.message}`
        );
        tokenRef.current = null;
      } finally {
        setIsConnecting(false);
      }
    };

    connectToSession();

    return () => {
      if (currentSession) {
        try {
          console.log("Cleaning up video session...");
          if (publisher) {
            currentSession.unpublish(publisher);
          }
          subscribers.forEach((subscriber) => {
            currentSession.unsubscribe(subscriber);
          });
          currentSession.disconnect();
          setSubscribers([]);
          setIsConnecting(false);
          tokenRef.current = null;
          setSession(null);
          setPublisher(null);
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      }
    };
  }, [sessionId, nickname, isCurrentUser]);

  if (connectionError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <p className="text-sm text-red-400">{connectionError}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {players.map((player) => (
        <PlayerCard
          key={player.stream.connection?.connectionId || player.nickname}
          userNickname={player.nickname}
          isCurrentTurn={player.isCurrentTurn}
          score={player.score}
          isCurrentUser={player.isCurrentUser}
          sessionId={sessionId}
        >
          <div className="relative w-full h-full group">
            <video
              autoPlay
              ref={(video) => {
                if (video) {
                  video.srcObject = player.stream.getMediaStream();
                  video.muted = player.isCurrentUser; // 자신의 비디오는 음소거
                }
              }}
              className={`w-full h-full object-cover rounded-lg ${
                !player.videoEnabled ? "hidden" : ""
              }`}
            />
            {!player.videoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                <div className="text-white text-lg">카메라 꺼짐</div>
              </div>
            )}

            {/* 미디어 상태 표시 */}
            <div className="absolute bottom-2 left-2 flex items-center space-x-2">
              <div className="bg-black/50 px-2 py-1 rounded text-white">
                {player.isCurrentUser
                  ? `나 (${player.nickname})`
                  : player.nickname}
              </div>
              {!player.audioEnabled && (
                <div className="bg-red-500/80 p-1 rounded-full">
                  <MicOff size={16} className="text-white" />
                </div>
              )}
            </div>

            {/* 미디어 컨트롤 버튼 (현재 사용자만) */}
            {player.isCurrentUser && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="flex gap-3 bg-black/20 backdrop-blur-md p-1.5 rounded-full">
                  <MediaControlButton
                    onClick={toggleAudio}
                    enabled={audioEnabled}
                    Icon={Mic}
                    DisabledIcon={MicOff}
                  />
                  <MediaControlButton
                    onClick={toggleVideo}
                    enabled={videoEnabled}
                    Icon={Video}
                    DisabledIcon={VideoOff}
                  />
                </div>
              </div>
            )}
          </div>
        </PlayerCard>
      ))}
    </div>
  );
};

export default VideoChat;
