import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GameInfoAPI from "../../sources/api/GameInfoAPI";
import { Star } from "lucide-react";

const GameRulePage = () => {
  const { gameInfoId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameRule = async () => {
      try {
        setLoading(true);
        const gameData = await GameInfoAPI.getGameInfo(gameInfoId);
        setData(gameData);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameRule();
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

  const formatContent = (content) => {
    if (!content) return "";
    return content.split("\\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="min-h-screen p-8 bg-[#0a0a2a]">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-900 bg-opacity-80 rounded-xl shadow-2xl p-8 backdrop-blur-lg border border-cyan-500/50">
          {/* 게임 제목 */}
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 text-yellow-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {data.game.gameName} 규칙
            </h1>
          </div>

          <div className="flex flex-col gap-6">
            {/* 이미지 영역 - 왼쪽 상단 */}
            <div className="w-64 h-64 relative group">
              <div className="w-full h-full overflow-hidden rounded-xl border border-cyan-500/60 hover:border-cyan-300 transition-all duration-300">
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                  <span className="text-lg">No Image</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* 규칙 내용 */}
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

export default GameRulePage;
