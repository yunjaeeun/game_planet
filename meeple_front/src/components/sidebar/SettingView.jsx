import React, { useEffect, useState } from "react";
import { Volume2, Mic, Camera, Info } from "lucide-react";

const SettingView = () => {
  const [micVolume, setMicVolume] = useState(100);
  const [speakerVolume, setSpeakerVolume] = useState(100);
  const [availableMics, setAvailableMics] = useState([]);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedMic, setSelectedMic] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("");

  useEffect(() => {
    // 사용 가능한 장치 목록 가져오기
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const mics = devices.filter((device) => device.kind === "audioinput");
        const cameras = devices.filter(
          (device) => device.kind === "videoinput"
        );

        setAvailableMics(mics);
        setAvailableCameras(cameras);

        // 기본 장치가 있을 경우에만 설정
        if (mics.length > 0) {
          setSelectedMic(mics[0].deviceId || "");
        }
        if (cameras.length > 0) {
          setSelectedCamera(cameras[0].deviceId || "");
        }
      })
      .catch((error) => {
        console.error("장치 목록 가져오기 실패:", error);
      });
  }, []);

  const toggleMic = (isOn) => {
    try {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        stream.getAudioTracks()[0].enabled = isOn;
      });
    } catch (error) {
      console.error("마이크 토글 실패:", error);
    }
  };

  const changeMicDevice = async (deviceId) => {
    setSelectedMic(deviceId);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: deviceId },
        },
      });
      console.log("마이크 변경됨:", deviceId);
    } catch (error) {
      console.error("마이크 변경 실패:", error);
    }
  };

  const changeCameraDevice = async (deviceId) => {
    setSelectedCamera(deviceId);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: deviceId },
        },
      });
      console.log("카메라 변경됨:", deviceId);
    } catch (error) {
      console.error("카메라 변경 실패:", error);
    }
  };

  const handleSpeakerVolumeChange = (value) => {
    setSpeakerVolume(value);
    const audioElements = document.getElementsByTagName("audio");
    for (let audio of audioElements) {
      audio.volume = value / 100;
    }
  };

  const handleMicVolumeChange = async (value) => {
    setMicVolume(value);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const gainNode = audioContext.createGain();

      gainNode.gain.value = value / 100;
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
    } catch (error) {
      console.error("마이크 볼륨 조절 실패:", error);
    }
  };

  const CameraSelect = () => {
    if (availableCameras.length === 0) {
      return (
        <div className="text-sm text-gray-400">
          사용 가능한 카메라가 없습니다
        </div>
      );
    }

    return (
      <select
        className="w-full bg-gray-700 text-sm p-2 rounded"
        value={selectedCamera}
        onChange={(e) => changeCameraDevice(e.target.value)}
      >
        {availableCameras.map((camera) => (
          <option key={camera.deviceId} value={camera.deviceId}>
            {camera.label || `카메라 ${camera.deviceId.slice(0, 5)}`}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* 설정 섹션 */}
      <div className="flex-1 p-6 space-y-8">
        {/* 볼륨 설정 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 size={20} className="text-blue-500" />
            <span className="text-sm font-medium">VOLUME</span>
          </div>
          <div className="pl-7">
            <input
              type="range"
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              min="0"
              max="100"
              value={speakerVolume}
              onChange={(e) =>
                handleSpeakerVolumeChange(Number(e.target.value))
              }
            />
            <div className="mt-1 text-xs text-gray-400">
              Speaker Volume: {speakerVolume}%
            </div>
          </div>
        </div>

        {/* 마이크 설정 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Mic size={20} className="text-blue-500" />
            <span className="text-sm font-medium">MICROPHONE</span>
          </div>
          <div className="pl-7 space-y-3">
            <div>
              <input
                type="range"
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                min="0"
                max="100"
                value={micVolume}
                onChange={(e) => handleMicVolumeChange(Number(e.target.value))}
              />
              <div className="mt-1 text-xs text-gray-400">
                Microphone Volume: {micVolume}%
              </div>
            </div>
            <select
              className="w-full bg-gray-700 text-sm p-2 rounded"
              value={selectedMic}
              onChange={(e) => changeMicDevice(e.target.value)}
            >
              {availableMics.map((mic) => (
                <option key={mic.deviceId} value={mic.deviceId}>
                  {mic.label || `마이크 ${mic.deviceId.slice(0, 5)}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 카메라 설정 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Camera size={20} className="text-blue-500" />
            <span className="text-sm font-medium">CAMERA</span>
          </div>
          <div className="pl-7">
            <CameraSelect />
          </div>
        </div>
      </div>

      {/* 현재 설정 정보 */}
      <div className="p-6 bg-gray-800 border-t border-gray-700">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-gray-400 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-300">현재 설정</h3>
            <div className="text-xs text-gray-400">
              <p>
                마이크:{" "}
                {selectedMic
                  ? availableMics.find((m) => m.deviceId === selectedMic)?.label
                  : "선택되지 않음"}
              </p>
              <p>
                카메라:{" "}
                {selectedCamera
                  ? availableCameras.find((c) => c.deviceId === selectedCamera)
                      ?.label
                  : "선택되지 않음"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingView;
