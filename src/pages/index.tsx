import React, { useState, useEffect } from "react";
import ReactAudioPlayer from "react-audio-player";

const Home = () => {
  const [music, setMusic] = useState([
    { title: "Heroes", src: "./heroes.mp3" },
    { title: "On", src: "./on.mp3" },
    { title: "Hellcat", src: "./hellcat.mp3" },
    { title: "SkyHigh", src: "./skyhigh.mp3" },
    { title: "WhyWeLose", src: "./welose.mp3" },
  ]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [playlist, setPlaylist] = useState([]);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    const filteredPlaylist = playlist.reduce((acc, current) => {
     return !acc.find((item) => item.src === current.src) ? acc.concat([current]) : acc;
    }, []);
    setPlaylist(filteredPlaylist);
    if (playlist.length > 0 && currentTrackIndex === -1) {
      setCurrentTrackIndex(0);
    }
  }, [playlist]);

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
    if (track.title !== "Heroes") {
      setPlaylist((prevPlaylist) => [...prevPlaylist, track]);
      if (currentTrackIndex === -1) {
        setCurrentTrackIndex(0);
      }
    }
  };

  const handlePlayerReady = () => {
    setPlayerReady(true);
  };

  return (
    <div>
      <ReactAudioPlayer
        className="mx-auto block w-1/2"
        style={{  }}
        src={playerReady ? playlist[currentTrackIndex]?.src : "./heroes.mp3"}
        autoPlay
        controls
        onEnded={handleAudioEnded}
        onCanPlay={handlePlayerReady}
      />
      <button className="mb-6" onClick={handlePreviousTrack}>
        Previous Track
      </button>
      <button className="mx-12" onClick={handleAudioEnded}>
        Next Track
      </button>
      <ul>
        {music.map((track, index) => (
          <li key={track.src}>
            <button
              className="mx-auto block px-3"
              onClick={() => handleAddToPlaylist(track)}
            >
              {index} {track.title}
            </button>
          </li>
        ))}
      </ul>
      <br />
      <ul>
        {playlist.map((track, index) => (
          <li key={index}>
            <button
              className={
                index === currentTrackIndex
                  ? "mx-auto block w-1/2 text-blue-500"
                  : "mx-auto block w-1/2"
              }
              onClick={() => setCurrentTrackIndex(index)}
            >
              {index} &nbsp; &times; &nbsp;
              {track.title}
              {index === currentTrackIndex ? " (Now Playing)" : ""}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;