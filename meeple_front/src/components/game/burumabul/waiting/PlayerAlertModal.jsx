import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

const PlayerAlertModal = ({ onClose }) => {
  const modalRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target))
        onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      ref={modalRef}
      className=" relative bg-black text-white rounded bg-opacity-50 w-80 h-28 flex flex-row justify-center items-center"
    >
      <h2>플레이어가 모두 들어와야 합니다.</h2>
      <X
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition"
        onClick={onClose}
        size={20}
        color="#ffffff"
        strokeWidth={2.25}
      />
    </div>
  );
};

export default PlayerAlertModal;
