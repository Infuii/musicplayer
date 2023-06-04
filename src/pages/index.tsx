import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import MusicPlayer from "../components/MusicPlayer";

type Track = {
  title: string;
  src: string;
};

const Home = () => {
  const [music] = useState<Track[]>([
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
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPlaylist = async () => {
      const response = await fetch("./api/playlist");
      const data = (await response.json()) as Track[];
      setPlaylist(data);
      console.log("data:", data);
    };

    void fetchPlaylist();
  }, []);

  useEffect(() => {
    setFilteredPlaylist(playlist);
  }, [playlist]);

  useEffect(() => {
    const savePlaylist = async () => {
      await fetch("./api/playlist", {
        method: "POST",
        body: JSON.stringify(playlist),
      });
    };

    void savePlaylist();
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
      setPlaylist((prevPlaylist) => {
        const trackExists = prevPlaylist.some(
          (item) => item.title === track.title
        );
        if (!trackExists) {
          return [...prevPlaylist, track];
        } else {
          return prevPlaylist;
        }
      });

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
  const deletePlaylist = () => {
    setPlaylist([]);
    setFilteredPlaylist([]);
    setCurrentTrackIndex(-1);
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
    <div className="main min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 pb-16">
      <h3 className="py-8 text-center text-4xl font-bold text-white">
        React Music Player
      </h3>
      <MusicPlayer
        filteredPlaylist={filteredPlaylist}
        currentTrackIndex={currentTrackIndex}
        playerReady={playerReady}
        loop={loop}
        handlePreviousTrack={handlePreviousTrack}
        handleAudioEnded={handleAudioEnded}
        handleTrackLoop={handleTrackLoop}
        handleTrackUnLoop={handleTrackUnLoop}
        handlePlayerReady={handlePlayerReady}
        handleShufflePlaylist={handleShufflePlaylist}
      />
      <ul className="mt-8">
        {music.map((track, index) => (
          <li key={track.src}>
            <button
              className="mx-auto block bg-gray-800 px-2 px-3 py-3 text-2xl font-bold text-white hover:bg-gray-900"
              onClick={() => handleAddToPlaylist(track)}
            >
              {index + 1}. {track.title}
            </button>
          </li>
        ))}
      </ul>
      <br />
      <h3 className="text-center text-3xl font-bold text-white">My Playlist</h3>
      <br />
      <button
        className="mx-auto block w-1/4 text-center text-2xl font-bold text-red-500"
        onClick={() => deletePlaylist()}
      >
        Delete Playlist
      </button>
      <ul>
        {filteredPlaylist.map((track, index) => (
          <li key={index}>
            <button
              className={
                index === currentTrackIndex
                  ? "mx-auto block w-1/2 border-none bg-transparent font-bold text-blue-500"
                  : "mx-auto block w-1/2 border-none bg-transparent font-bold text-white"
              }
              onClick={() => setCurrentTrackIndex(index)}
            >
              {index + 1} &nbsp; &times; &nbsp;
              {track.title}
              {index === currentTrackIndex && (
                <span className="ml-2 text-red-500">Now Playing</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
