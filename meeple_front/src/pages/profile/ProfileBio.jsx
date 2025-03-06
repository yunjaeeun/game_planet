import React, { useState, useEffect } from "react";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";

const ProfileBio = ({ initialBio, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(initialBio); // 초기값을 직접 설정
  const [tempBio, setTempBio] = useState(initialBio); // 초기값을 직접 설정

  useEffect(() => {
    // initialBio가 변경될 때마다 bio와 tempBio를 업데이트
    if (initialBio === "" || initialBio === null || initialBio === undefined) {
      setBio("자기소개를 입력해주세요.");
      setTempBio("자기소개를 입력해주세요.");
    } else {
      setBio(initialBio);
      setTempBio(initialBio);
    }
  }, [initialBio]);

  const handleSave = () => {
    const trimmedBio = tempBio.trim();
    const bioToSave =
      trimmedBio === "" ? "자기소개를 입력해주세요." : trimmedBio;

    setBio(bioToSave);
    setTempBio(bioToSave);
    onSave(bioToSave);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempBio(bio);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setTempBio(value);
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        <textarea
          value={tempBio}
          onChange={handleChange}
          className="w-full h-[50px] p-2 text-zinc-900 bg-zinc-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500" // h-[55px]를 h-[35px]로 변경
          rows="1" // rows="3"을 rows="1"로 변경
          maxLength={20}
          autoFocus
          placeholder="자기소개를 입력해주세요."
        />
        <div className="absolute bottom-2 right-2 flex gap-2">
          <button
            onClick={handleSave}
            className="p-1 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white"
            title="저장"
          >
            <CheckIcon size={16} />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 rounded-full bg-zinc-500 hover:bg-zinc-600 text-white"
            title="취소"
          >
            <XIcon size={16} />
          </button>
        </div>
        <span className="text-xs text-zinc-400 absolute bottom-2 left-2">
          {tempBio.length}/20
        </span>
      </div>
    );
  }

  return (
    <div className="group inline-flex items-center gap-2">
      <p className="text-zinc-300 text-base min-h-[24px]">{bio}</p>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500 hover:text-cyan-400"
        title="자기소개 수정"
      >
        <PencilIcon size={16} />
      </button>
    </div>
  );
};

export default ProfileBio;
