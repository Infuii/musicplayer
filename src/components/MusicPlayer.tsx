import React from "react";
import "font-awesome/css/font-awesome.min.css";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { FaArrowCircleRight, FaArrowLeft, FaRandom } from "react-icons/fa";
import { BiRepeat } from "react-icons/bi";
type Track = {
  title: string;
  src: string;
  image: string;
  duration: string;
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
      <AudioPlayer
        src={
          playerReady
            ? filteredPlaylist[currentTrackIndex]?.src
            : "./heroes.mp3"
        }
        autoPlay
        onEnded={handleAudioEnded}
        onCanPlay={handlePlayerReady}
        layout="stacked"
        style={{
          background: "black",
          color: "white",
        }}
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
              <div className="ml-3">
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
        {currentTrackIndex !== -1 && (
          <div className="text-center text-white">
            <p className="text-xl">
              Now Playing: {filteredPlaylist[currentTrackIndex]?.title}
            </p>
          </div>
        )}

        <div className="flex justify-center space-x-8 text-2xl">
          <button
            className="border-none bg-transparent font-bold text-white"
            onClick={handlePreviousTrack}
            disabled={!playerReady}
          >
            <FaArrowLeft />
          </button>
          <button
            className="border-none bg-transparent font-bold text-white"
            onClick={handleAudioEnded}
            disabled={!playerReady}
          >
            <FaArrowLeft className="rotate-180" />
          </button>
          <button
            className="border-none bg-transparent font-bold text-white"
            onClick={handleShufflePlaylist}
            disabled={!playerReady}
          >
            <FaRandom />
          </button>
          {loop ? (
            <button
              className="border-none bg-transparent font-bold text-white"
              onClick={handleTrackUnLoop}
              disabled={!playerReady}
            >
              <FaArrowCircleRight />
            </button>
          ) : (
            <button
              className="border-none bg-transparent font-bold text-white"
              onClick={handleTrackLoop}
              disabled={!playerReady}
            >
              <BiRepeat />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default MusicPlayer;
