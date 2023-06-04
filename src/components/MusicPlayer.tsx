import React from "react";
import ReactAudioPlayer from "react-audio-player";

type Track = {
  title: string;
  src: string;
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

      <div className="flex justify-center space-x-4">
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
      <div className="mt-4 text-center text-white">
        {currentTrackIndex !== -1 && (
          <p>Now Playing: {filteredPlaylist[currentTrackIndex]?.title}</p>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
