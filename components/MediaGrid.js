import React from 'react';

export default function MediaGrid({ items, onSelect }) {
  return (
    <div className="media-grid">
      {items && items.map((item) => {
        if (!item || !item.poster_path) return null;
        return (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className="poster-card"
            style={{
              backgroundColor: '#121215',
              borderRadius: '10px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid #27272a',
            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                className="poster-img"
                style={{ width: '100%', objectFit: 'cover', display: 'block' }}
              />
              <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#fbbf24', fontSize: '11px', fontWeight: 'bold', padding: '3px 6px', borderRadius: '4px', backdropFilter: 'blur(4px)' }}>
                ⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
              </span>
            </div>
            <div style={{ padding: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#f4f4f5' }}>
                {item.title || item.name}
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#71717a' }}>
                {(item.release_date || item.first_air_date || '').slice(0, 4)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
