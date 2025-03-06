import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

const WrongPasswordModal = ({ onClose }) => {
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
      <h2>비밀번호가 일치하지 않습니다.</h2>
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

export default WrongPasswordModal;
