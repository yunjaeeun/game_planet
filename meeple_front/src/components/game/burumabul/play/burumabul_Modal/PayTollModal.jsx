import React from "react";

const PayTollModal = ({ onClose, tollPrice, paidPlayer, receivedPlayer }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // 배경 클릭 시 모달 닫기
    >
      <div
        className="bg-white w-80 h-60 p-5 rounded-lg shadow-lg"
        onClick={(event) => event.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 함
      >
        <div className="text-center">
          <p className="text-lg font-semibold">
            {paidPlayer?.playerName}님이 {receivedPlayer?.playerName}님에게
          </p>
          <p className="text-2xl font-bold mt-2 text-red-500">
            {tollPrice} 마불
          </p>
          <p className="mt-2">을 지불했습니다.</p>
        </div>
        <button
          className="mt-5 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default PayTollModal;
