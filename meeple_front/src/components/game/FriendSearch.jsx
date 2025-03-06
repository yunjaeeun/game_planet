import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { ul } from "framer-motion/client";
const dummyFriends = [
  "은수",
  "은지",
  "은영",
  "덕진",
  "희준",
  "성현",
  "재은",
  "홍범",
  "진혁",
];

const FriendSearch = () => {
  const [searchNickname, setSearchNickname] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const handleSearch = (e) => {
    setSearchNickname(e.target.value);
    setShowResults(true);
  };

  const handleSearchClick = () => {
    setShowResults(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClick();
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target))
        setSearchNickname("");
      setShowResults(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 검색어에 맞는 닉네임 필터링
  const filteredFriends = dummyFriends.filter((friend) =>
    friend.toLowerCase().includes(searchNickname.toLowerCase())
  );

  return (
    <>
      <div
        ref={searchRef}
        className="relative w-full sm:w-72 md:w-96 lg:w-[450px]"
      >
        <input
          className="w-full h-12 p-4 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 "
          type="text"
          value={searchNickname}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          placeholder="친구를 검색해 초대해보세요..."
        />
        <Search
          type="button"
          onClick={handleSearchClick}
          size={20}
          color="#ce47ff"
          strokeWidth={2.25}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        />
      </div>

      {/* 검색 결과 */}
      {showResults && searchNickname.length > 0 && (
        <ul className="mt-2 w-full bg-white shadow-lg rounded-lg p-2 max-h-32 overflow-y-auto">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend, index) => (
              <li
                key={index}
                className="p-2 border-b last:border-0 hover:bg-gray-100 flex flex-row justify-between items-center"
              >
                <p>{friend}</p>
                <button className="w-20 rounded bg-[#d69ceb]">초대하기</button>
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">검색 결과가 없습니다.</li>
          )}
        </ul>
      )}
    </>
  );
};

export default FriendSearch;
