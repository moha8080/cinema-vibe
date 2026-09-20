import { useRouter } from 'next/router';

export default function MediaRow({ title, items, onViewMore }) {
  const router = useRouter();

  const handleCardClick = (item) => {
    const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
    router.push(`/watch/${item.id}?type=${mediaType}`);
  };

  return (
    <div style={{ marginBottom: '32px', width: '100%' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '14px',
        paddingRight: '4px',
        paddingLeft: '4px'
      }}>
        <h2 style={{ 
          color: '#ffffff', 
          fontSize: '18px', 
          fontWeight: '700', 
          margin: 0,
          borderRight: '4px solid #f97316',
          paddingRight: '10px'
        }}>
          {title}
        </h2>
        
        {onViewMore && (
          <button 
            onClick={onViewMore}
            style={{ 
              backgroundColor: 'transparent', 
              color: '#f97316', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '13px', 
              fontWeight: '600'
            }}
          >
            عرض المزيد ←
          </button>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '14px', 
        overflowX: 'auto', 
        paddingBottom: '10px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#f97316 #18181b',
      }}>
        {items && items.map((item) => {
          const posterPath = item.poster_path 
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=No+Image';
          
          const itemTitle = item.title || item.name || 'بدون عنوان';
          const voteAverage = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
          const releaseYear = (item.release_date || item.first_air_date || '').substring(0, 4);

          return (
            <div 
              key={item.id} 
              onClick={() => handleCardClick(item)}
              style={{ 
                minWidth: '150px',
                width: '150px',
                backgroundColor: '#18181b', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'transform 0.2s ease',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '2/3', backgroundColor: '#27272a' }}>
                <img 
                  src={posterPath} 
                  alt={itemTitle} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <div style={{ 
                  position: 'absolute', 
                  top: '6px', 
                  left: '6px', 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  color: '#f97316', 
                  padding: '2px 5px', 
                  borderRadius: '4px', 
                  fontSize: '10px', 
                  fontWeight: '700'
                }}>
                  ★ {voteAverage}
                </div>
              </div>

              <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
                <h3 style={{ 
                  color: '#ffffff', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  margin: '0 0 4px 0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {itemTitle}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#a1a1aa' }}>
                  <span>{releaseYear}</span>
                  <span style={{ textTransform: 'uppercase' }}>
                    {item.media_type || (item.title ? 'Movie' : 'TV')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
