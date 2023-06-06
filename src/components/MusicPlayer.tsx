import React from "react";
import ReactAudioPlayer from "react-audio-player";
import "../styles/styles.module.css";
import "font-awesome/css/font-awesome.min.css";

type Track = {
  title: string;
  src: string;
  image: string;
};

type MusicPlayerProps = {
  playerReady: boolean;
  filteredPlaylist: Track[];
  currentTrackIndex: number;
  handlePreviousTrack: () => void;
  handleAudioEnded: () => void;
  handleShufflePlaylist: () => void;
  loop: boolean;
  handleTrackUnLoop: () => void;
  handleTrackLoop: () => void;
  handlePlayerReady: () => void;
};
const handleFavorite = () => {
  console.log("favorite");
};
const MusicPlayer: React.FC<MusicPlayerProps> = ({
  playerReady,
  filteredPlaylist,
  currentTrackIndex,
  handlePreviousTrack,
  handleAudioEnded,
  handleShufflePlaylist,
  loop,
  handleTrackUnLoop,
  handleTrackLoop,
  handlePlayerReady,
}) => {
  return (
    <div className="main fixed bottom-0 left-0 w-full bg-black p-4">
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
        style={{}}
      />
      <div></div>
      <div className="flex items-center justify-between">
        <div className="flex text-white">
          {currentTrackIndex !== -1 && (
            <div className="mr-2 flex items-center">
              <img
                src={filteredPlaylist[currentTrackIndex]?.image}
                alt={filteredPlaylist[currentTrackIndex]?.title}
                className="relative h-20 w-20"
              />
              <div className="ml-2">
                <p className="text-sm text-gray-400">Artist: NCS</p>
                <p className="text-sm text-gray-400">
                  {filteredPlaylist[currentTrackIndex]?.title}
                </p>
                <div>
                  <i
                    className="fa fa-heart text-white"
                    style={{ color: "red" }}
                    onClick={() => handleFavorite()}
                  ></i>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-8">
          <button
            className="border-none bg-transparent font-bold text-white"
            onClick={handlePreviousTrack}
            disabled={!playerReady}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-6 w-6"
            >
              <path
                className="fill-current"
                d="M12 2 L2 12 L12 22 L13.5 20.5 L6.5 13.5 L22 13.5 L22 10.5 L6.5 10.5 L13.5 3.5 Z"
              ></path>
            </svg>
          </button>
          <button
            className="border-none bg-transparent font-bold text-white"
            onClick={handleAudioEnded}
            disabled={!playerReady}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-6 w-6"
            >
              <path
                className="fill-current"
                d="M12 2 L2 12 L12 22 L13.5 20.5 L6.5 13.5 L22 13.5 L22 10.5 L6.5 10.5 L13.5 3.5 Z"
              ></path>
            </svg>
          </button>
          <button
            className="border-none bg-transparent font-bold text-white"
            onClick={handleShufflePlaylist}
            disabled={!playerReady}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-6 w-6"
            >
              <path
                className="fill-current"
                d="M5 4 L3 6 L9 12 L3 18 L5 20 L11 14 L13 16 L15.5 13.5 L21 19 L23 17 L17.5 11.5 L23 6 L21 4 Z"
              ></path>
            </svg>
          </button>
          {loop ? (
            <button
              className="border-none bg-transparent font-bold text-white"
              onClick={handleTrackUnLoop}
              disabled={!playerReady}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6"
              >
                <path
                  className="fill-current"
                  d="M5 4 L3 6 L9 12 L3 18 L5 20 L11 14 L13 16 L15.5 13.5 L21 19 L23 17 L17.5 11.5 L23 6 L21 4 Z"
                ></path>
              </svg>
            </button>
          ) : (
            <button
              className="border-none bg-transparent font-bold text-white"
              onClick={handleTrackLoop}
              disabled={!playerReady}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6"
              >
                <path
                  className="fill-current"
                  d="M5 4 L3 6 L9 12 L3 18 L5 20 L11 14 L13 16 L15.5 13.5 L21 19 L23 17 L17.5 11.5 L23 6 L21 4 Z"
                ></path>
              </svg>
            </button>
          )}
        </div>
      </div>
      {currentTrackIndex !== -1 && (
        <div className="mt-1 text-center text-white">
          <p className="text-xl">
            Now Playing: {filteredPlaylist[currentTrackIndex]?.title}
          </p>
        </div>
      )}
    </div>
  );
};
export default MusicPlayer;
