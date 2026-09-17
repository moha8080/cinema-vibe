import React from 'react';

// مكون عرض الشبكة للبطاقات
function MediaGrid({ items, onSelect }) {
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

export default function HomeContent({ 
  heroItem, 
  trending, 
  heroIndex, 
  setHeroIndex, 
  openWatchPage, 
  topMovies, 
  popularTv, 
  horrorData, 
  dramaData, 
  actionData, 
  comedyData, 
  scifiData, 
  mysteryData, 
  romanceData, 
  adventureData, 
  setActiveTab, 
  setSelectedGenre 
}) {
  return (
    <>
      {heroItem && (
        <div className="hero-banner" style={{ position: 'relative', width: '100%', backgroundImage: `linear-gradient(to top, #09090b 10%, transparent 90%), url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '24px', transition: 'background-image 0.8s ease-in-out' }}>
          <div style={{ maxWidth: '650px', zIndex: 2 }}>
            <span style={{ backgroundColor: '#f97316', color: '#000', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase' }}>رائج الآن</span>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{heroItem.title || heroItem.name}</h1>
            <p style={{ color: '#d4d4d8', fontSize: '13px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>{heroItem.overview}</p>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={() => openWatchPage(heroItem)} style={{ padding: '10px 22px', backgroundColor: '#f97316', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
                شاهد الآن
              </button>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: '16px', left: '24px', display: 'flex', gap: '6px' }}>
            {trending.map((_, idx) => (
              <div key={idx} onClick={() => setHeroIndex(idx)} style={{ width: idx === heroIndex ? '24px' : '6px', height: '6px', borderRadius: '3px', backgroundColor: idx === heroIndex ? '#f97316' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s' }}></div>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '20px 24px' }}>
        
        {/* قسم أفضل الأفلام تقييماً */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أفضل الأفلام تقييماً</h2>
            <button onClick={() => setActiveTab('movies')} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
              عرض المزيد
            </button>
          </div>
          <MediaGrid items={topMovies} onSelect={openWatchPage} />
        </section>

        {/* قسم المسلسلات الأكثر مشاهدة */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>المسلسلات الأكثر مشاهدة</h2>
            <button onClick={() => setActiveTab('tv')} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
              عرض المزيد
            </button>
          </div>
          <MediaGrid items={popularTv} onSelect={openWatchPage} />
        </section>

        {/* قائمة أفلام ومسلسلات الرعب */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أفلام ومسلسلات الرعب</h2>
            <button onClick={() => { setActiveTab('movies'); setSelectedGenre('27'); }} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>عرض المزيد</button>
          </div>
          <MediaGrid items={horrorData} onSelect={openWatchPage} />
        </section>

        {/* دراما */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>دراما</h2>
            <button onClick={() => { setActiveTab('movies'); setSelectedGenre('18'); }} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>عرض المزيد</button>
          </div>
          <MediaGrid items={dramaData} onSelect={openWatchPage} />
        </section>

        {/* أكشن */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أكشن</h2>
            <button onClick={() => { setActiveTab('movies'); setSelectedGenre('28'); }} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>عرض المزيد</button>
          </div>
          <MediaGrid items={actionData} onSelect={openWatchPage} />
        </section>

        {/* كوميديا */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>كوميديا</h2>
            <button onClick={() => { setActiveTab('movies'); setSelectedGenre('35'); }} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>عرض المزيد</button>
          </div>
          <MediaGrid items={comedyData} onSelect={openWatchPage} />
        </section>

        {/* خيال علمي */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>خيال علمي</h2>
            <button onClick={() => { setActiveTab('movies'); setSelectedGenre('878'); }} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>عرض المزيد</button>
          </div>
          <MediaGrid items={scifiData} onSelect={openWatchPage} />
        </section>

        {/* غموض */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>غموض</h2>
            <button onClick={() => { setActiveTab('movies'); setSelectedGenre('9648'); }} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>عرض المزيد</button>
          </div>
          <MediaGrid items={mysteryData} onSelect={openWatchPage} />
        </section>

        {/* رومنسي */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>رومنسي</h2>
            <button onClick={() => { setActiveTab('movies'); setSelectedGenre('10749'); }} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>عرض المزيد</button>
          </div>
          <MediaGrid items={romanceData} onSelect={openWatchPage} />
        </section>

        {/* مغامرة */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>مغامرة</h2>
            <button onClick={() => { setActiveTab('movies'); setSelectedGenre('12'); }} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>عرض المزيد</button>
          </div>
          <MediaGrid items={adventureData} onSelect={openWatchPage} />
        </section>

      </div>
    </>
  );
}
