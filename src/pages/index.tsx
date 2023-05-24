import React, { useState } from "react";
import ReactAudioPlayer from "react-audio-player";

const Home = () => {
  const [music, setMusic] = useState([
    { title: "Heroes", src: "./heroes.mp3" },
    { title: "On", src: "./on.mp3" },
  ]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playlist, setPlaylist] = useState([]);

  const handleAudioEnded = () => {
    setCurrentTrackIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex < playlist.length) {
        return nextIndex;
      } else {
        return 0;
      }
    });
  };
  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex < playlist.length) {
        return nextIndex;
      } else {
        return 0;
      }
    });
  };

  const handlePreviousTrack = () => {
    setCurrentTrackIndex((prevIndex) => {
      const nextIndex = prevIndex - 1;
      if (nextIndex >= 0) {
        return nextIndex;
      } else {
        return playlist.length - 1;
      }
    });
  };

  const handleAddToPlaylist = (track) => {
    setPlaylist((prevPlaylist) => [...prevPlaylist, track]);
  };

  return (
    <div>
      <ReactAudioPlayer
        src={music[currentTrackIndex].src}
        autoPlay
        controls
        onEnded={handleAudioEnded}
      />
      <button onClick={handlePreviousTrack}>Previous Track</button>
      <button onClick={handleNextTrack}>Next Track</button>
      <ul>
        {music.map((track, index) => (
          <li key={track.src}>
            <button onClick={() => handleAddToPlaylist(track)}>
              {track.index, track.title}
            </button>
          </li>
        ))}
      </ul>

      <ul>
        {playlist.map((track, index) => (
          <li key={track.src}>
            <button onClick={() => setCurrentTrackIndex(index)}>
              {track.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
