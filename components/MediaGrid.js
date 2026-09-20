import { useRouter } from 'next/router';

export default function MediaGrid({ items }) {
  const router = useRouter();

  const handleCardClick = (item) => {
    const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
    router.push(`/watch/${item.id}?type=${mediaType}`);
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
      gap: '16px',
      width: '100%'
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
              backgroundColor: '#18181b', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              cursor: 'pointer',
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
  );
}
