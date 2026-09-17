import React from 'react';

export default function MediaGrid({ items, onSelect }) {
  if (!items || items.length === 0) {
    return <p style={{ color: '#a1a1aa', textAlign: 'center', padding: '20px' }}>لا توجد عناوين متاحة حالياً...</p>;
  }

  return (
    <div className="media-grid">
      {items.map((item) => {
        const title = item.title || item.name;
        const posterPath = item.poster_path 
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
          : 'https://via.placeholder.com/500x750?text=No+Image';
        const year = (item.release_date || item.first_air_date || '').slice(0, 4);
        const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

        return (
          <div 
            key={item.id} 
            onClick={() => onSelect(item)}
            style={{ 
              backgroundColor: '#18181b', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              cursor: 'pointer', 
              border: '1px solid #27272a',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(249, 115, 22, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ position: 'relative', width: '100%' }} className="poster-img">
              <img 
                src={posterPath} 
                alt={title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
              <span style={{ 
                position: 'absolute', 
                top: '8px', 
                left: '8px', 
                backgroundColor: 'rgba(0, 0, 0, 0.75)', 
                color: '#f97316', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                fontSize: '11px', 
                fontWeight: 'bold',
                backdropFilter: 'blur(4px)'
              }}>
                ⭐ {rating}
              </span>
            </div>
            <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                margin: '0 0 4px 0', 
                color: '#fff', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
              }}>
                {title}
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#a1a1aa' }}>
                <span>{year}</span>
                <span style={{ color: '#f97316', fontWeight: 'bold' }}>
                  {item.media_type === 'tv' || item.first_air_date ? 'مسلسل' : 'فيلم'}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
