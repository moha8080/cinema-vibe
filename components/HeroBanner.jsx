import React from 'react';

export default function HeroBanner({ heroItem, trending, heroIndex, setHeroIndex, openWatchPage }) {
  if (!heroItem) return null;

  return (
    <div className="hero-banner" style={{ 
      position: 'relative', 
      width: '100%', 
      backgroundImage: `linear-gradient(to top, #09090b 10%, transparent 90%), url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      display: 'flex', 
      alignItems: 'flex-end', 
      padding: '24px', 
      transition: 'background-image 0.8s ease-in-out' 
    }}>
      <div style={{ maxWidth: '650px', zIndex: 2 }}>
        <span style={{ backgroundColor: '#f97316', color: '#000', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase' }}>
          رائج الآن
        </span>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0', textShadow: '0 2px 10px rgba(0,0,0,0.8)', color: '#fff' }}>
          {heroItem.title || heroItem.name}
        </h1>
        <p style={{ color: '#d4d4d8', fontSize: '13px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
          {heroItem.overview}
        </p>
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button onClick={() => openWatchPage(heroItem)} style={{ padding: '10px 22px', backgroundColor: '#f97316', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
            شاهد الآن
          </button>
        </div>
      </div>

      {/* النقاط السفلية لتغيير البانر */}
      <div style={{ position: 'absolute', bottom: '16px', left: '24px', display: 'flex', gap: '6px' }}>
        {trending.map((_, idx) => (
          <div 
            key={idx} 
            onClick={() => setHeroIndex(idx)} 
            style={{ 
              width: idx === heroIndex ? '24px' : '6px', 
              height: '6px', 
              borderRadius: '3px', 
              backgroundColor: idx === heroIndex ? '#f97316' : 'rgba(255,255,255,0.3)', 
              cursor: 'pointer', 
              transition: 'all 0.3s' 
            }}
          />
        ))}
      </div>
    </div>
  );
}
