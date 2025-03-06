const PlayVideo = () =>{
  return (
    <div>
      {/* 영상 표시 */}
      <h1>Video</h1>
      <video src="/videos/pokerexample.mp4" type="video/mp4" className="flex-1" controls></video>
    </div>
  )
};

export default PlayVideo;