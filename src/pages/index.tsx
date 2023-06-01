import React, { useState, useEffect } from "react";
import ReactAudioPlayer from "react-audio-player";
import { signIn, signOut, useSession } from "next-auth/react";

type Track = {
  title: string;
  src: string;
};

const Home = () => {
  const [music, setMusic] = useState<Track[]>([
    { title: "Heroes", src: "./heroes.mp3" },
    { title: "On", src: "./on.mp3" },
    { title: "Hellcat", src: "./hellcat.mp3" },
    { title: "SkyHigh", src: "./skyhigh.mp3" },
    { title: "WhyWeLose", src: "./welose.mp3" },
  ]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [filteredPlaylist, setFilteredPlaylist] = useState<Track[]>([]);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [loop, setLoop] = useState<boolean>(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const filteredPlaylist = playlist.reduce((acc: Track[], current: Track) => {
      return !acc.find((item: Track) => item.src === current.src)
        ? acc.concat([current])
        : acc;
    }, []);
    setFilteredPlaylist(filteredPlaylist);
  }, [playlist]);

  const handleAudioEnded = () => {
    if (loop) {
      return filteredPlaylist[currentTrackIndex]?.src;
    }

    setCurrentTrackIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex < filteredPlaylist.length) {
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
        return filteredPlaylist.length - 1;
      }
    });
  };

  const handleAddToPlaylist = (track: Track) => {
    if (track.title !== "Heroes") {
      setPlaylist((prevPlaylist) => [...prevPlaylist, track]);
      if (currentTrackIndex === -1) {
        setCurrentTrackIndex(0);
      }
    }
  };

  const handleTrackLoop = () => {
    setLoop(true);
  };

  const handleTrackUnLoop = () => {
    setLoop(false);
  };

  const handlePlayerReady = () => {
    setPlayerReady(true);
  };

  const handleShufflePlaylist = () => {
    setFilteredPlaylist([...filteredPlaylist].sort(() => Math.random() - 0.5));
    setCurrentTrackIndex(0);
  };

  if (!session) {
    return (
      <div className="mx-auto max-w-xl">
        <h1 className="mb-4 text-2xl font-bold">
          You must be logged in to access this website.
        </h1>
        <button
          onClick={() => void signIn("discord")}
          className="rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          Sign in with Discord
        </button>
      </div>
    );
  }

  return (
    <div className="main pb-16">
      <h3 className="text-center text-4xl text-gray-500">React Music Player</h3>
      <br />
      <div className="fixed bottom-0 left-0 w-full bg-black p-4">
        <ReactAudioPlayer
          src={
            playerReady
              ? filteredPlaylist[currentTrackIndex]?.src
              : "./heroes.mp3"
          }
          autoPlay
          controls
          onEnded={handleAudioEnded}
          onCanPlay={handlePlayerReady}
          className="audio-player mb-4 w-full bg-black"
        />

        <div className="flex justify-center">
          <button
            className="mr-4 text-white"
            onClick={handlePreviousTrack}
            disabled={!playerReady}
          >
            Previous Track
          </button>
          <button
            className="text-white"
            onClick={handleAudioEnded}
            disabled={!playerReady}
          >
            Next Track
          </button>
          <button
            className="text-white"
            onClick={handleShufflePlaylist}
            disabled={!playerReady}
          >
            &nbsp; &nbsp; Shuffle Playlist
          </button>
          {loop ? (
            <button
              className="text-white"
              onClick={handleTrackUnLoop}
              disabled={!playerReady}
            >
              &nbsp; &nbsp; Disable Looping
            </button>
          ) : (
            <button
              className="text-white"
              onClick={handleTrackLoop}
              disabled={!playerReady}
            >
              &nbsp; &nbsp; Enable Looping
            </button>
          )}
        </div>
        <div className="mt-4 text-center text-white">
          {currentTrackIndex !== -1 && (
            <p>Now Playing: {filteredPlaylist[currentTrackIndex]?.title}</p>
          )}
        </div>
      </div>
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
        {filteredPlaylist.map((track, index) => (
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
