import ReviewList from "./ReviewList";
import { useParams } from "react-router-dom";
import { useEffect,useState } from "react";
import axios from "axios";

const GameReview = () =>{
  const params= useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`https://boardjjigae.duckdns.org/api/game-info/review`)
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, [params]);

  return (
    <div>
      {/* 평균별점 */}
      <section>{data.starAvg}</section>
      {/* 리뷰목록 */}
      <section>
        리뷰목록
      </section>
    </div>
  )
};

export default GameReview;