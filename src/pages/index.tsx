import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import MusicPlayer from "../components/MusicPlayer";
import { api } from "~/utils/api";
import { Track } from "@prisma/client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import styles from "../styles/styles.module.css";
import ReactModal from "react-modal";
import { FaTrash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const Home = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [filteredPlaylist, setFilteredPlaylist] = useState<Track[]>([]);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [loop, setLoop] = useState<boolean>(false);
  const { data: session } = useSession();
  const [selectedPlaylist, setSelectedPlaylist] = useState<number>(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const playlists = api.playlist.getAllPlaylists.useQuery();
  const music = api.playlist.getAllTracks.useQuery().data || [];
  const currentTracks = playlists.data?.[selectedPlaylist]?.tracks || [];

  useEffect(() => {
    console.log(filteredPlaylist);
    setFilteredPlaylist(playlists.data?.[selectedPlaylist]?.tracks || []);
  }, [playlists, selectedPlaylist]);

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
    setSearch("");
    setModalIsOpen(false);
    addTrack.mutate(
      {
        trackId: track.id,
        playlistId: playlists.data?.[selectedPlaylist]?.id as string,
      },
      {
        onSuccess: () => void playlists.refetch(),
      }
    );
    toast.success("Track added to playlist successfully");
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
    const shuffledTracks = [...currentTracks].sort(() => Math.random() - 0.5);
    setFilteredPlaylist(shuffledTracks);
    setCurrentTrackIndex(0);
  };

  const deletePlaylist = api.playlist.deletePlaylist.useMutation();

  const handleDeletePlaylist = () => {
    toast.success("Playlist deleted successfully");
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
    setPlayerReady(false);
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
      <Toaster />
      <button
        className="absolute right-0 top-0 m-4 text-white"
        onClick={() => setModalIsOpen(true)}
      >
        Open Track List
      </button>
      <h3 className="py-8 text-center text-4xl font-bold text-white">
        React Music Player
      </h3>
      <br />
      <h3 className="text-center text-3xl font-bold text-white">My Playlist</h3>

      <br />
      <button
        className="mx-auto block w-1/4 text-center text-2xl font-bold text-red-500 transition-colors duration-300 ease-in-out hover:text-red-600"
        onClick={() => handleDeletePlaylist()}
      >
        Delete Playlist
      </button>
      <br />
      <div className="mx-auto w-full">
        {currentTracks.map((track, index) => (
          <div
            key={index}
            className={`flex items-center border-b border-gray-700 bg-gray-800 px-8 py-4 transition-colors duration-300 ease-in-out hover:bg-gray-900 ${
              currentTrackIndex === index ? "bg-gray-600" : ""
            }`}
            onClick={() => setCurrentTrackIndex(index)}
          >
            <img
              src={track.image}
              alt={track.title}
              className="mr-4 h-10 w-10"
            />
            <div className="flex-grow">
              <div className="text-white">
                {track.title}{" "}
                {currentTrackIndex === index && (
                  <span className="text-xs text-green-500">
                    (Currently Playing)
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-400">No Copyright Sounds</div>
            </div>
            <div className="mr-8 text-sm text-gray-400">ALBUM</div>
            <div className="text-sm text-gray-400">{track.playlistId}</div>
            <div className="text-sm text-gray-400">
              {" "}
              &nbsp; {track.duration}
            </div>
          </div>
        ))}
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
      {/* <ul className="mt-8">
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
      </ul> */}
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
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2 className="mb-4 text-center text-3xl font-bold">Select a Song</h2>
        <input
          type="text"
          placeholder="Search for a song"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2"
          onAbort={() => setSearch("")}
          onBlur={() => setSearch("")}
        />
        <ul className="text-center">
          {music
            .filter((song) =>
              song.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((track) => (
              <li key={track.src}>
                <button
                  className="mb-2 text-center text-white"
                  onClick={() => handleAddToPlaylist(track)}
                >
                  {track.title}
                </button>
              </li>
            ))}
        </ul>
      </ReactModal>
      <br />

      <button
        className="absolute left-4 top-4 text-white"
        onClick={() => setSidebarOpen(true)}
      >
        View All Playlists ( {playlists.data?.length} )
      </button>
      <div
        className={`fixed left-0 top-0 h-screen w-1/4 transform bg-gray-800 text-white transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h3 className="py-8 text-center text-4xl font-bold text-white">
          Playlist Manager
        </h3>
        <ul className="mx-8">
          {playlists.data?.map((playlist, index) => (
            <li
              key={index}
              className={`my-2 cursor-pointer rounded-md p-4 transition-colors duration-300 ease-in-out ${
                selectedPlaylist === index
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => setSelectedPlaylist(index)}
            >
              {playlist.name}
              <button
                className="float-right text-red-500 "
                onClick={() => handleDeletePlaylist()}
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
        <h3>
          <button
            className="mx-auto block bg-gray-800 px-3 py-3 text-2xl font-bold text-white transition-colors duration-300 ease-in-out hover:bg-gray-900"
            onClick={() => setSidebarOpen(false)}
          >
            Close Sidebar
          </button>
        </h3>
      </div>

      {selectedSong && (
        <div>
          <h3 className="mt-4 text-center text-2xl font-bold">
            Selected Song:
          </h3>
          <div className="text-center text-white"></div>
        </div>
      )}
    </div>
  );
};

export default Home;
