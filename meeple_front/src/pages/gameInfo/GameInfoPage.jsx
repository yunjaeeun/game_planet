import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GameInfoAPI from "../../sources/api/GameInfoAPI";
import { Star } from "lucide-react";

const FormattedLine = ({ line }) => {
  // 제품명 스타일링
  if (line.startsWith("제품명:")) {
    const [title, content] = line.split(": ");
    const [korName, engName] = content.split(" (");
    return (
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-cyan-400 flex items-center gap-4 mt">
          <Star className="w-6 h-6 text-yellow-400" />
          {korName}
          {/* {engName && (
            <span className="flex items-center gap-2 text-2xl text-gray-400">
              {engName}
            </span>
          )} */}
        </h1>
      </div>
    );
  }

  // 기본 게임 정보 스타일링 (플레이어 수, 연령, 게임 시간, 게임 구성품)
  if (line.includes(":") && !line.includes("Step")) {
    const [title, content] = line.split(": ");
    return (
      <div className="mb-3 flex items-center">
        <span className="text-cyan-400 font-semibold w-32">{title}:</span>
        <span className="text-gray-300">{content}</span>
      </div>
    );
  }

  // Step 제목 스타일링
  if (line.startsWith("Step")) {
    return (
      <div className="mt-8 mb-4">
        <h2 className="text-2xl font-bold text-amber-200 flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-200 rounded-full"></span>
          {line}
        </h2>
      </div>
    );
  }

  // 빈 줄 처리
  if (line.trim() === "") {
    return <div className="h-2"></div>;
  }

  // 일반 텍스트 스타일링
  return (
    <div className="mb-2 pl-4">
      <p className="text-gray-300 leading-relaxed">{line}</p>
    </div>
  );
};

const formatContent = (content) => {
  if (!content) return "";
  return content
    .split("\\n")
    .map((line, index) => <FormattedLine key={index} line={line.trim()} />);
};

const GameInfoPage = () => {
  const { gameInfoId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameInfo = async () => {
      try {
        setLoading(true);
        const gameData = await GameInfoAPI.getGameInfo(gameInfoId);
        console.log("게임 데이터 : ", gameData);
        setData(gameData);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameInfo();
  }, [gameInfoId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0a0a2a]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
          <div className="w-4 h-4 bg-white rounded-full animate-pulse delay-75" />
          <div className="w-4 h-4 bg-white rounded-full animate-pulse delay-150" />
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-[#0a0a2a]">
        에러가 발생했습니다.
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0a0a2a]">
        데이터가 없습니다.
      </div>
    );

  return (
    <div className="min-h-screen p-8 bg-[#0a0a2a]/50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-900 bg-opacity-80 rounded-xl shadow-2xl p-8 backdrop-blur-lg border border-cyan-500/50 max-h-[650px] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Left side - Image */}
            <div className="relative group">
              <div className="h-96 overflow-hidden rounded-xl border border-cyan-500/60 transition-all duration-300">
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                  <img
                    src={data.game.gameInfoFile}
                    alt="게임 사진"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Right side - Game Info */}
            <div className="flex flex-col">
              {/* <div className="flex items-center gap-2 mb-6">
                <Star className="w-6 h-6 text-yellow-400" />
                <h1 className="text-3xl font-bold text-cyan-400">
                  {data.game.gameName}
                </h1>
              </div> */}
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-300 leading-relaxed">
                  {formatContent(data.gameInfoContent)}
                </div>
              </div>
            </div>
          </div>

          {/* Game Rules Section */}
          <div className="border-t border-cyan-500/30 pt-8">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-cyan-400">게임 규칙</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-300 leading-relaxed">
                {formatContent(data.gameRule)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInfoPage;
