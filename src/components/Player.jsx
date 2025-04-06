import React, { useRef, useEffect, useState } from "react";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaVolumeMute
} from "react-icons/fa";

const Player = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  handleNext,
  handlePrev,
  favorites,
  toggleFavorite
}) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false); 

  const isFavorite = (song) =>
    (favorites || []).some((fav) => fav.title === song.title);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleVolume = () => {
    if (audioRef.current) {
      const mute = !audioRef.current.muted;
      audioRef.current.muted = mute;
      setIsMuted(mute); 
    }
  };

  const seek = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const percent = offsetX / width;
    const newTime = audioRef.current.duration * percent;
    audioRef.current.currentTime = newTime;
    setProgress(percent * 100);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setProgress(0);
    }
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playAudio = () => {
      if (isPlaying) {
        const promise = audio.play();
        if (promise !== undefined) {
          promise.catch((err) =>
            console.warn("Autoplay failed:", err)
          );
        }
      } else {
        audio.pause();
      }
    };

    if (audio.readyState >= 1) {
      playAudio();
    } else {
      audio.addEventListener("loadedmetadata", playAudio);
    }

    return () => {
      audio.removeEventListener("loadedmetadata", playAudio);
    };
  }, [isPlaying, currentSong]);

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio && audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const onEnded = () => {
      handleNext();
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", onEnded);
    };
  }, [handleNext]);

  return (
    <div className="player">
      <div className="song-info">
        <h2>{currentSong.title}</h2>
        <p>{currentSong.artistName}</p>
        <img
          src={currentSong.thumbnail}
          alt={currentSong.title}
          className="album-art"
        />
      </div>

      <div className="custom-progress-bar" onClick={seek}>
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="controls">
        
        <button
          className="control-btn round"
          onClick={() => toggleFavorite(currentSong)}
          title="Mark as Favorite"
        >
          {isFavorite(currentSong) ? "❤️" : "⋯"}
        </button>

        <button className="control-btn round" onClick={handlePrev}>
          <FaStepBackward />
        </button>

        <button className="control-btn round play-btn" onClick={togglePlay}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        <button className="control-btn round" onClick={handleNext}>
          <FaStepForward />
        </button>

        
        <button className="control-btn round" onClick={handleVolume}>
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </div>

      <audio id="main-audio" ref={audioRef} preload="metadata">
        <source src={currentSong.musicUrl} type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default Player;
