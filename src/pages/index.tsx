import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import MusicPlayer from "../components/MusicPlayer";
import { api } from "~/utils/api";
import { Track } from "@prisma/client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const Home = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [filteredPlaylist, setFilteredPlaylist] = useState<Track[]>([]);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [loop, setLoop] = useState<boolean>(false);
  const { data: session } = useSession();
  const [selectedPlaylist, setSelectedPlaylist] = useState<number>(0);

  const playlists = api.playlist.getAllPlaylists.useQuery();
  const music = api.playlist.getAllTracks.useQuery().data || [];
  const currentTracks = playlists.data?.[selectedPlaylist]?.tracks || [];
  // useEffect(() => {
  //   const fetchPlaylist = async () => {
  //     const response = await fetch("./api/playlist");
  //     const data = (await response.json()) as Track[];
  //     setPlaylist(data);
  //   };

  //   void fetchPlaylist();
  // }, []);

  useEffect(() => {
    setFilteredPlaylist(playlists.data?.[selectedPlaylist]?.tracks || []);
  }, [playlists, selectedPlaylist]);

  // useEffect(() => {
  //   const savePlaylist = async () => {
  //     await fetch("./api/playlist", {
  //       method: "POST",
  //       body: JSON.stringify(playlist),
  //     });
  //   };

  //   void savePlaylist();
  // }, [playlist]);

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

  const createNewPlaylist = api.playlist.createPlaylist.useMutation();

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

  const addTrack = api.playlist.addTrack.useMutation();

  const handleAddToPlaylist = (track: Track) => {
    // if (track.title !== "Heroes") {
    //   setPlaylist((prevPlaylist) => {
    //     const trackExists = prevPlaylist.some(
    //       (item) => item.title === track.title
    //     );
    //     if (!trackExists) {
    //       return [...prevPlaylist, track];
    //     } else {
    //       return prevPlaylist;
    //     }
    //   });

    //   if (currentTrackIndex === -1) {
    //     setCurrentTrackIndex(0);
    //   }
    // }

    addTrack.mutate(
      {
        trackId: track.id,
        playlistId: playlists.data?.[selectedPlaylist]?.id as string,
      },
      {
        onSuccess: () => void playlists.refetch(),
      }
    );
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

  const deletePlaylist = api.playlist.deletePlaylist.useMutation();

  const handleDeletePlaylist = () => {
    deletePlaylist.mutate(
      {
        playlistId: playlists.data?.[selectedPlaylist]?.id as string,
      },
      {
        onSuccess: () => void playlists.refetch(),
      }
    );

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
      <div className="mx-auto w-full flex-col">
        <ul>
          {currentTracks.map((track, index) => (
            <li key={index}>
              <button
                className={
                  index === currentTrackIndex
                    ? "mx-auto block w-1/2 border-none bg-transparent font-bold text-blue-500 transition-colors duration-300 ease-in-out"
                    : "mx-auto block w-1/2 border-none bg-transparent font-bold text-white transition-colors duration-300 ease-in-out hover:text-blue-500"
                }
                onClick={() => setCurrentTrackIndex(index)}
              >
                {index + 1} &nbsp;{" "}
                <img className="h-5 w-5" src={track.image}></img> &times; &nbsp;
                {track.title}
                {index === currentTrackIndex && (
                  <span className="ml-2 text-red-500">Now Playing</span>
                )}
              </button>
              {index === currentTrackIndex && (
                <div className="text-center">
                  {/* <img
                  src={track.image}
                  alt={track.title}
                  className="mx-auto my-4 w-1/4"
                /> */}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
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
              className="mx-auto block bg-gray-800 px-3 py-3 text-2xl font-bold text-white transition-colors duration-300 ease-in-out hover:bg-gray-900"
              onClick={() => handleAddToPlaylist(track)}
            >
              {index + 1}. {track.title}
            </button>
          </li>
        ))}
      </ul>
      <br />
      <button
        onClick={() => {
          const name = prompt("Enter playlist name");
          if (name) {
            createNewPlaylist.mutate(
              {
                name,
              },
              {
                onSuccess: () => void playlists.refetch(),
              }
            );
          }
        }}
        className="mx-auto block bg-gray-800 px-3 py-3 text-2xl font-bold text-white transition-colors duration-300 ease-in-out hover:bg-gray-900"
      >
        Create Playlist
      </button>
      <select
        className="mx-auto block w-1/4 border-none bg-transparent font-bold text-white transition-colors duration-300 ease-in-out hover:text-blue-500"
        onChange={(e) => setSelectedPlaylist(parseInt(e.target.value))}
      >
        {playlists.data?.map((playlist, index) => (
          <option key={index} value={index}>
            {playlist.name}
          </option>
        ))}
      </select>
      <br />
      <h3 className="text-center text-3xl font-bold text-white">My Playlist</h3>
      {/* playlist selector dropdown */}

      <br />
      <button
        className="mx-auto block w-1/4 text-center text-2xl font-bold text-red-500 transition-colors duration-300 ease-in-out hover:text-red-600"
        onClick={() => handleDeletePlaylist()}
      >
        Delete Playlist
      </button>
    </div>
  );
};

export default Home;
