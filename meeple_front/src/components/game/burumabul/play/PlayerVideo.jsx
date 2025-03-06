import React from "react";
import { Camera, CameraOff, Mic, MicOff } from "lucide-react";

const PlayerVideo = ({ playerInfo }) => {
  return (
    <div className="bg-white rounded-md w-full flex flex-col h-32 border-2 border-violet-400">
      <div className="bg-black w-full rounded-t-sm h-28 sm:h-20 md:h-24 text-white flex items-center justify-center">
        화상 영역
      </div>
      <div className="flex justify-between items-center px-3 flex-shrink-0">
        <p>이름</p>
        <div className="flex flex-row items-center">
          <Mic className="w-5 h-5 mx-1" />
          <MicOff className="w-5 h-5 mx-1" />
          <Camera className="w-5 h-5 mx-1" />
          <CameraOff className="w-5 h-5 mx-1" />
        </div>
      </div>
    </div>
  );
};

export default PlayerVideo;
