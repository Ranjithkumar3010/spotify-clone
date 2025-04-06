import React from "react";

const SongCard = ({ song, onSelect, onToggleFavorite, isFavorite }) => {
  return (
    <div className="song-card" onClick={() => onSelect(song)}>
      <img src={song.thumbnail} alt={song.title} />
      <div className="song-info">
        <h5>{song.title}</h5>
        <p>{song.artistName}</p>
      </div>
      <div className="actions">
        <span className="duration">{song.duration}</span>
        <span
          className="favorite"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(song);
          }}
        >
          {isFavorite ? "❤️" : "⋮"}
        </span>
      </div>
    </div>
  );
};

export default SongCard;
