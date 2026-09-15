import { useState, useEffect } from 'react';

export default function Home() {
  // البيانات
  const [trending, setTrending] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  
  // المشغل
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [activeServer, setActiveServer] = useState('vidsrc.to');
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  // السلايدر الرئيسي (البانر)
  const [heroIndex, setHeroIndex] = useState(0);

  // البحث
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  // جلب البيانات الأساسية
  useEffect(() => {
    async function fetchData() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) return;

        const [resTrending, resTopMovies, resPopularTv] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=ar-SA`),
          fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=ar-SA`),
          fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=ar-SA`)
        ]);

        const dataTrending = await resTrending.json();
        const dataTopMovies = await resTopMovies.json();
        const dataPopularTv = await resPopularTv.json();

        if (dataTrending.results) setTrending(dataTrending.results.slice(0, 10));
        if (dataTopMovies.results) setTopMovies(dataTopMovies.results.slice(0, 12));
        if (dataPopularTv.results) setPopularTv(dataPopularTv.results.slice(0, 12));
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    }
    fetchData();
  }, []);

  // التبديل التلقائي للسلايدر كل 5 ثواني
  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % trending.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [trending]);

  // تنفيذ البحث
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ar-SA&query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.results) setSearchResults(data.results);
    } catch (e) {
      console.error("Search error:", e);
    }
  };

  // رابط Embed التشغيل
  const getEmbedUrl = () => {
    if (!selectedMedia) return '';
    const isTv = selectedMedia.media_type === 'tv' || selectedMedia.first_air_date;
    const id = selectedMedia.id;

    if (isTv) {
      if (activeServer === 'vidsrc.to') return `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`;
      if (activeServer === 'vidsrc.me') return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
      if (activeServer === 'embed.su') return `https://embed.su/embed/tv/${id}/${season}/${episode}`;
    } else {
      if (activeServer === 'vidsrc.to') return `https://vidsrc.to/embed/movie/${id}`;
      if (activeServer === 'vidsrc.me') return `https://vidsrc.me/embed/movie?tmdb=${id}`;
      if (activeServer === 'embed.su') return `https://embed.su/embed/movie/${id}`;
    }
    return `https://vidsrc.to/embed/movie/${id}`;
  };

  const heroItem = trending[heroIndex];

  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* 1. Navbar علوي فخم */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: 'rgba(9, 9, 11, 0.85)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '900', color: '#f97316', letterSpacing: '1px', cursor: 'pointer' }} onClick={() => setSearchResults(null)}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>
          <div style={{ display: 'flex', gap: '20px', fontSize: '15px', fontWeight: '600' }}>
            <span style={{ color: '#f97316', cursor: 'pointer' }} onClick={() => setSearchResults(null)}>الرئيسية</span>
            <span style={{ color: '#a1a1aa', cursor: 'pointer' }}>الأفلام</span>
            <span style={{ color: '#a1a1aa', cursor: 'pointer' }}>المسلسلات</span>
          </div>
        </div>

        {/* نموذج البحث */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', width: '320px' }}>
          <input
            type="text"
            placeholder="ابحث عن فيلم أو مسلسل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 16px', borderRadius: '20px', border: '1px solid #27272a', backgroundColor: '#18181b', color: '#fff', fontSize: '13px', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '8px 18px', borderRadius: '20px', border: 'none', backgroundColor: '#f97316', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
            بحث
          </button>
        </form>
      </nav>

      {/* 2. المشغل (تأثير المنبثق العلوي المدمج) */}
      {selectedMedia && (
        <div style={{ padding: '20px 40px', backgroundColor: '#18181b', borderBottom: '2px solid #f97316' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div>
              <h2 style={{ margin: 0, color: '#f97316', fontSize: '22px' }}>{selectedMedia.title || selectedMedia.name}</h2>
              <p style={{ margin: '5px 0 0 0', color: '#a1a1aa', fontSize: '13px' }}>{(selectedMedia.release_date || selectedMedia.first_air_date || '').slice(0, 4)} | ⭐ {selectedMedia.vote_average?.toFixed(1)}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {(selectedMedia.media_type === 'tv' || selectedMedia.first_air_date) && (
                <div style={{ display: 'flex', gap: '8px', marginLeft: '15px', backgroundColor: '#09090b', padding: '5px 12px', borderRadius: '8px', border: '1px solid #27272a' }}>
                  <label style={{ fontSize: '13px', color: '#f97316' }}>الموسم: 
                    <input type="number" min="1" value={season} onChange={(e) => setSeason(e.target.value)} style={{ width: '45px', background: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px', marginRight: '5px', padding: '2px' }} />
                  </label>
                  <label style={{ fontSize: '13px', color: '#f97316' }}>الحلقة: 
                    <input type="number" min="1" value={episode} onChange={(e) => setEpisode(e.target.value)} style={{ width: '45px', background: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px', marginRight: '5px', padding: '2px' }} />
                  </label>
                </div>
              )}

              {/* اختيار السيرفر */}
              <button onClick={() => setActiveServer('vidsrc.to')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'vidsrc.to' ? '#f97316' : '#27272a', color: activeServer === 'vidsrc.to' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '12px' }}>سيرفر 1</button>
              <button onClick={() => setActiveServer('vidsrc.me')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'vidsrc.me' ? '#f97316' : '#27272a', color: activeServer === 'vidsrc.me' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '12px' }}>سيرفر 2</button>
              <button onClick={() => setActiveServer('embed.su')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'embed.su' ? '#f97316' : '#27272a', color: activeServer === 'embed.su' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '12px' }}>سيرفر 3</button>
              
              <button onClick={() => setSelectedMedia(null)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px', marginRight: '15px' }}>✕ إغلاق</button>
            </div>
          </div>

          <div style={{ position: 'relative', paddingTop: '50%', width: '100%', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #27272a' }}>
            <iframe src={getEmbedUrl()} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen referrerPolicy="origin"></iframe>
          </div>
        </div>
      )}

      {/* 3. نتائج البحث إن وجدت */}
      {searchResults ? (
        <div style={{ padding: '30px 40px' }}>
          <h2 style={{ fontSize: '22px', borderRight: '4px solid #f97316', paddingRight: '12px', marginBottom: '20px' }}>نتائج البحث</h2>
          <MediaGrid items={searchResults} onSelect={(item) => { setSelectedMedia(item); setSeason(1); setEpisode(1); }} />
        </div>
      ) : (
        <>
          {/* 4. السلايدر المتحرك التلقائي (البانر الرئيسي) */}
          {heroItem && (
            <div style={{ position: 'relative', height: '480px', width: '100%', backgroundImage: `linear-gradient(to top, #09090b 10%, transparent 90%), url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '40px', transition: 'background-image 0.8s ease-in-out' }}>
              <div style={{ maxWidth: '600px', zIndex: 2 }}>
                <span style={{ backgroundColor: '#f97316', color: '#000', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}>🔥 تريند الأسبوع</span>
                <h1 style={{ fontSize: '38px', fontWeight: 'bold', margin: '12px 0', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{heroItem.title || heroItem.name}</h1>
                <p style={{ color: '#d4d4d8', fontSize: '14px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{heroItem.overview}</p>
                
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                  <button onClick={() => { setSelectedMedia(heroItem); setSeason(1); setEpisode(1); }} style={{ padding: '12px 28px', backgroundColor: '#f97316', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
                    ▶ شاهد الآن
                  </button>
                </div>
              </div>

              {/* مؤشرات التبديل السفلية */}
              <div style={{ position: 'absolute', bottom: '20px', left: '40px', display: 'flex', gap: '8px' }}>
                {trending.map((_, idx) => (
                  <div key={idx} onClick={() => setHeroIndex(idx)} style={{ width: idx === heroIndex ? '28px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: idx === heroIndex ? '#f97316' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s' }}></div>
                ))}
              </div>
            </div>
          )}

          {/* 5. الأقسام المنظمة */}
          <div style={{ padding: '20px 40px' }}>
            
            {/* قسم الأفلام الأعلى تقييماً */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '12px', marginBottom: '20px' }}>🏆 أفضل الأفلام تقييماً</h2>
              <MediaGrid items={topMovies} onSelect={(item) => { setSelectedMedia(item); setSeason(1); setEpisode(1); }} />
            </section>

            {/* قسم المسلسلات الأكثر مشاهدة */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '12px', marginBottom: '20px' }}>📺 المسلسلات الأكثر مشاهدة وشعبية</h2>
              <MediaGrid items={popularTv} onSelect={(item) => { setSelectedMedia(item); setSeason(1); setEpisode(1); }} />
            </section>

          </div>
        </>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #27272a', padding: '25px', textAlign: 'center', color: '#71717a', fontSize: '13px' }}>
        © 2026 CINEMA VIBE - جميع الحقوق محفوظة
      </footer>
    </div>
  );
}

// مكون كروت العرض الاحترافية
function MediaGrid({ items, onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '20px' }}>
      {items && items.map((item) => {
        if (!item || !item.poster_path) return null;
        return (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            style={{
              backgroundColor: '#18181b',
              borderRadius: '10px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid #27272a',
              transition: 'transform 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = '#f97316';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#27272a';
            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                style={{ width: '100%', height: '250px', objectFit: 'cover' }}
              />
              <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.75)', color: '#fbbf24', fontSize: '11px', fontWeight: 'bold', padding: '3px 6px', borderRadius: '4px' }}>
                ⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
              </span>
            </div>
            <div style={{ padding: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#f4f4f5' }}>
                {item.title || item.name}
              </h3>
              <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#71717a' }}>
                {(item.release_date || item.first_air_date || '').slice(0, 4)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
