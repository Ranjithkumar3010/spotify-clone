import React from "react";
import { FaSpotify } from "react-icons/fa";

const Sidebar = ({
  isOpen,
  sidebarRef,
  setMenuOpen,
  favorites,
  recentlyPlayed,
  playFromList,
  activeTab,
  setActiveTab,
  currentSong
}) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`} ref={sidebarRef}>
      <div className="sidebar-header">
        <div className="logo">
          <FaSpotify size={28} style={{ marginRight: "10px" }} />
          <span>Spotify</span>
        </div>
        <button className="close-btn" onClick={() => setMenuOpen(false)}>✕</button>
      </div>

      <ul>
        <li
          className={activeTab === "For You" ? "active" : ""}
          onClick={() => setActiveTab("For You")}
        >
          For You
        </li>
        <li
          className={activeTab === "Top Tracks" ? "active" : ""}
          onClick={() => setActiveTab("Top Tracks")}
        >
          Top Tracks
        </li>
        <li
          className={activeTab === "Favourites" ? "active" : ""}
          onClick={() => setActiveTab("Favourites")}
        >
          Favourites
        </li>
        {activeTab === "Favourites" && (
          <ul>
            {favorites.length > 0 ? (
              favorites.map((song, i) => (
                <li
                  key={i}
                  className={song.title === currentSong?.title ? "active song-active" : ""}
                  onClick={() => playFromList(song)}
                >
                  ❤️ {song.title}
                </li>
              ))
            ) : (
              <li style={{ opacity: 0.6 }}>No favorites yet</li>
            )}
          </ul>
        )}
        <li
          className={activeTab === "Recently Played" ? "active" : ""}
          onClick={() => setActiveTab("Recently Played")}
        >
          Recently Played
        </li>
        {activeTab === "Recently Played" && (
          <ul>
            {recentlyPlayed.length > 0 ? (
              recentlyPlayed.map((song, i) => (
                <li
                  key={i}
                  className={song.title === currentSong?.title ? "active song-active" : ""}
                  onClick={() => playFromList(song)}
                >
                  🎵 {song.title}
                </li>
              ))
            ) : (
              <li style={{ opacity: 0.6 }}>No recent plays</li>
            )}
          </ul>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
