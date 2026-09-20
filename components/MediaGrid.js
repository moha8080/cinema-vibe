import Image from 'next/image';
import { useRouter } from 'next/router';

export default function MediaGrid({ items, title }) {
  const router = useRouter();

  // دالة التعامل مع النقر على الفيلم أو المسلسل والانتقال لصفحة المشاهدة
  const handleCardClick = (item) => {
    const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
    router.push(`/watch/${item.id}?type=${mediaType}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {title && (
        <h2 style={{ 
          color: '#ffffff', 
          fontSize: '22px', 
          fontWeight: '700', 
          marginBottom: '20px',
          borderRight: '4px solid #f97316',
          paddingRight: '12px'
        }}>
          {title}
        </h2>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
        gap: '16px' 
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
                borderRadius: '12px', 
                overflow: 'hidden', 
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(249, 115, 22, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              {/* بوستر العمل */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '2/3', backgroundColor: '#27272a' }}>
                <img 
                  src={posterPath} 
                  alt={itemTitle} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                {/* تقييم العمل */}
                <div style={{ 
                  position: 'absolute', 
                  top: '8px', 
                  left: '8px', 
                  backgroundColor: 'rgba(0, 0, 0, 0.75)', 
                  backdropFilter: 'blur(4px)',
                  color: '#f97316', 
                  padding: '3px 6px', 
                  borderRadius: '6px', 
                  fontSize: '11px', 
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  border: '1px solid rgba(249,115,22,0.3)'
                }}>
                  ★ {voteAverage}
                </div>
              </div>

              {/* معلومات العمل */}
              <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
                <h3 style={{ 
                  color: '#ffffff', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  margin: '0 0 6px 0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {itemTitle}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#a1a1aa' }}>
                  <span>{releaseYear}</span>
                  <span style={{ 
                    textTransform: 'uppercase', 
                    backgroundColor: 'rgba(255,255,255,0.08)', 
                    padding: '2px 5px', 
                    borderRadius: '4px',
                    fontSize: '10px'
                  }}>
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
