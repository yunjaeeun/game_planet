import React from "react";
import virgo from "../../../../assets/burumabul_images/virgo.png";

const PlayerCard = ({ playerInfo }) => {
  //  백엔드 연결 필요
  return (
    <div className="md:w-44 md:h-60 lg:w-52 lg:h-64  bg-white rounded-lg flex flex-col justify-center items-center">
      <div className="my-3">
        <img
          src={virgo}
          alt="플레이어 이미지"
          className="w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 max-w-28 max-h-28 rounded-full "
        />
      </div>
      <div className="mx-3 flex flex-col justify-center items-center">
        <p className="my-1">{playerInfo.playerName}</p>
        <p className="my-1">플레이어 실적</p>
        <button className="bg-blue-300 rounded my-1 px-2 text-slate-500">
          친구 추가
        </button>
        {/* <button className="bg-pink-300 rounded my-1 px-2 text-slate-500">
          친구 중
        </button> */}
      </div>
    </div>
  );
};

export default PlayerCard;
