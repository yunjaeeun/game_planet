
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GameRule = () => {
  const { gameId } = useParams(); // URL에서 gameId 받아오기
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`https://boardjjigae.duckdns.org/api/game-info/${gameId}`) //받아온 gameId로 게임 정보 받아오기
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [gameId]); //게임이 바뀌면 다시 불러옴

  if (loading) return <div>로딩중...</div>; // 정보 받기 전에 표시시
  if (error) return <div>에러가 발생했습니다.</div>;  //에러 발생 시
  if (!data) return <div>데이터가 없습니다.</div>;  

  return (
    <div>
      <h1>규칙</h1>
      <p>
        {data.gameRule}
      </p>
    </div>
  );
};

export default GameRule;