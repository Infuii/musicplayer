import { type NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import ReactAudioPlayer from "react-audio-player";

const Home: NextPage = () => {
  const [music, setMusic] = useState(["./heroes.mp3", "./on.mp3"]);
  const [count, setCount] = useState(0);
  console.log(count);
  const handleVideoEnd = () => {
    setCount(count + 1);
    console.log("ended");
    console.log(count);
    setMusic(music[count]);
    console.log(music[count], "2");
  };
  return (
    <div>
      <ReactAudioPlayer
        src={music[count]}
        autoPlay
        controls
        onEnded={handleVideoEnd}
      />
      <ReactAudioPlayer controls>
        <source src="./heroes.mp3" type="audio/mp3" />
        <source src="./on.mp3" type="audio/mp3" />
      </ReactAudioPlayer>
    </div>
  );
};

export default Home;
