import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import SongList from "./components/SongList";
import Player from "./components/Player";
import songsData from "./data/songs";
import "./styles/main.scss";

const App = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [recentlyPlayed, setRecentlyPlayed] = useState(() =>
    JSON.parse(sessionStorage.getItem("recentlyPlayed")) || []
  );
  const [activeTab, setActiveTab] = useState("For You");

  const sidebarRef = useRef(null);

  useEffect(() => {
    const loadDurations = async () => {
      const updatedSongs = await Promise.all(
        songsData.map((song) => {
          return new Promise((resolve) => {
            const audio = new Audio(song.musicUrl);
            audio.addEventListener("loadedmetadata", () => {
              resolve({ ...song, duration: formatDuration(audio.duration) });
            });
            audio.addEventListener("error", () => {
              resolve({ ...song, duration: "0:00" });
            });
          });
        })
      );
      setSongs(updatedSongs);
      setCurrentSong(updatedSongs[0]);
      setLoading(false);
    };

    loadDurations();
  }, []);

  const formatDuration = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const updateRecentlyPlayed = (song) => {
    const updated = [song, ...recentlyPlayed.filter(s => s.title !== song.title)].slice(0, 10);
    setRecentlyPlayed(updated);
    sessionStorage.setItem("recentlyPlayed", JSON.stringify(updated));
  };

  const playFromList = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    updateRecentlyPlayed(song);
  };

  const toggleFavorite = (song) => {
    const updated = favorites.find(f => f.title === song.title)
      ? favorites.filter(f => f.title !== song.title)
      : [...favorites, song];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const handleNext = () => {
    const idx = songs.findIndex(s => s.title === currentSong.title);
    const next = songs[(idx + 1) % songs.length];
    playFromList(next);
  };

  const handlePrev = () => {
    const idx = songs.findIndex(s => s.title === currentSong.title);
    const prev = songs[(idx - 1 + songs.length) % songs.length];
    playFromList(prev);
  };

  useEffect(() => {
    const closeOnClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", closeOnClickOutside);
    }
    return () => document.removeEventListener("mousedown", closeOnClickOutside);
  }, [menuOpen]);

  if (loading || !currentSong) {
    return (
      <div className="app loading-screen">
        <Sidebar
          isOpen={menuOpen}
          sidebarRef={sidebarRef}
          setMenuOpen={setMenuOpen}
          favorites={favorites}
          recentlyPlayed={recentlyPlayed}
          playFromList={playFromList}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="loading">Loading songs...</div>
      </div>
    );
  }

  return (
    <div
      className="app"
      style={{
        backgroundImage: `url(${currentSong.thumbnail})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)"
      }}
    >
      {!menuOpen && (
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(true)}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
      )}

      <Sidebar
        isOpen={menuOpen}
        sidebarRef={sidebarRef}
        setMenuOpen={setMenuOpen}
        favorites={favorites}
        recentlyPlayed={recentlyPlayed}
        playFromList={playFromList}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentSong={currentSong}
      />

      <div className="content">
        {activeTab === "For You" && (
          <SongList
            songs={songs}
            currentSong={currentSong}
            playFromList={playFromList}
          />
        )}

        <Player
          currentSong={currentSong}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          handleNext={handleNext}
          handlePrev={handlePrev}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      </div>
    </div>
  );
};

export default App;
