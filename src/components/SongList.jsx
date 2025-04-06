import React, { useState, useEffect } from "react";

const SongList = ({ songs, currentSong, playFromList }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="song-list">
      <h3>For You</h3>
      <input
        className="search-input"
        type="text"
        placeholder="Search Song, Artist"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredSongs.map((song, index) => (
          <li
            key={index}
            className={song.title === currentSong.title ? "active" : ""}
            onClick={() => playFromList(song)}
          >
            <img src={song.thumbnail} alt={song.title} />
            <div>
              <p className="title">{song.title}</p>
              <p className="artist">{song.artistName}</p>
            </div>
            <span>{song.duration}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongList;
