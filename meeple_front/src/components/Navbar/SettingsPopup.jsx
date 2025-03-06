import React, { useState, useEffect, useRef } from "react";

const SettingsPopup = ({ isOpen, onClose }) => {
  const [volume, setVolume] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const popupRef = useRef(null);

  useEffect(() => {
    const audio = document.querySelector("audio");
    if (audio) {
      setAudioElement(audio);
      setVolume(audio.volume * 100);
      setIsMuted(audio.muted);
    }

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioElement) {
      audioElement.volume = newVolume / 100;
      // localStorage에 볼륨 값 저장
      localStorage.setItem("bgmVolume", newVolume / 100);
    }
  };

  const toggleMute = () => {
    if (audioElement) {
      audioElement.muted = !audioElement.muted;
      setIsMuted(!isMuted);
      // localStorage에 음소거 상태 저장
      localStorage.setItem("bgmMuted", !isMuted);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl p-4 z-50 border border-gray-700"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">설정</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-white">배경음악</span>
          <button
            onClick={toggleMute}
            className="relative inline-flex items-center w-10 h-5 rounded-full transition-colors duration-300 focus:outline-none"
            style={{
              backgroundColor: isMuted ? "#374151" : "#10B981",
            }}
          >
            <span
              className={`inline-block w-3.5 h-3.5 transform transition-transform duration-300 rounded-full bg-white ${
                isMuted ? "translate-x-1" : "translate-x-6"
              }`}
            />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white">음량</span>
            <span className="text-gray-400">{volume}%</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                backgroundImage: `linear-gradient(to right, #10B981 0%, #10B981 ${volume}%, #374151 ${volume}%, #374151 100%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;
