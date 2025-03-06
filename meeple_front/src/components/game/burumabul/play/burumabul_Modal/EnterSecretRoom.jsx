import React, { useEffect, useState } from "react";

const EnterSecretRoom = ({ onSubmit, onClose, isLoading }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setPassword(event.target.value);
    setError(""); // 입력할 때마다 오류 메시지 초기화
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password.trim() === "") {
      setError("비밀번호를 입력해주세요.");
      return;
    }
    onSubmit(password);
    console.log("입력된 비밀번호:", password);
    onClose();
    setPassword("");
  };

  return (
    <>
      <div className="w-96 p-6 bg-slate-900 bg-opacity-90 rounded-lg flex flex-col justify-center items-center">
        <h2 className="text-lg text-white font-semibold mb-4">
          비밀 번호를 입력하세요
        </h2>

        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="password"
            value={password}
            onChange={handleChange}
            placeholder="비밀번호 입력"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex flex-row justify-around items-center">
            <button
              onClick={onClose}
              className="w-1/3 mt-4 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition duration-200"
            >
              뒤로가기
            </button>
            <button
              type="submit"
              className="w-1/3 mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              제출
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EnterSecretRoom;
