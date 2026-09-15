import { useState, useEffect } from 'react';

export default function Home() {
  // البيانات الرئيسية
  const [trending, setTrending] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  
  // الوضع الحالي للصفحة: 'home' | 'movies' | 'tv'
  const [activeTab, setActiveTab] = useState('home');
  const [pageData, setPageData] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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

  // جلب بيانات الصفحة الرئيسية بلغة إنجليزية
  useEffect(() => {
    async function fetchHomeData() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) return;

        const [resTrending, resTopMovies, resPopularTv] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US`)
        ]);

        const dataTrending = await resTrending.json();
        const dataTopMovies = await resTopMovies.json();
        const dataPopularTv = await resPopularTv.json();

        if (dataTrending.results) setTrending(dataTrending.results.slice(0, 10));
        if (dataTopMovies.results) setTopMovies(dataTopMovies.results.slice(0, 12));
        if (dataPopularTv.results) setPopularTv(dataPopularTv.results.slice(0, 12));
      } catch (e) {
        console.error("Error fetching home data:", e);
      }
    }
    fetchHomeData();
  }, []);

  // جلب قائمة الأفلام أو المسلسلات باللغة الإنجليزية
  useEffect(() => {
    if (activeTab === 'home') return;

    async function fetchTabData() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) return;

        const endpoint = activeTab === 'movies'
          ? `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=1`
          : `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=1`;

        const res = await fetch(endpoint);
        const data = await res.json();
        if (data && data.results) {
          setPageData(data.results);
          setPageNum(1);
        }
      } catch (e) {
        console.error("Error fetching tab data:", e);
      }
    }

    setSearchResults(null);
    fetchTabData();
  }, [activeTab]);

  // تحميل المزيد
  const handleLoadMore = async () => {
    if (activeTab === 'home') return;
    setIsLoadingMore(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const nextPage = pageNum + 1;
      const endpoint = activeTab === 'movies'
        ? `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=${nextPage}`
        : `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=${nextPage}`;

      const res = await fetch(endpoint);
      const data = await res.json();
      if (data && data.results) {
        setPageData((prev) => [...prev, ...data.results]);
        setPageNum(nextPage);
      }
    } catch (e) {
      console.error("Error loading more data:", e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // التبديل التلقائي للبانر كل 5 ثوانٍ
  useEffect(() => {
    if (trending.length === 0 || activeTab !== 'home') return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % trending.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [trending, activeTab]);

  // البحث بلغة إنجليزية
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.results) setSearchResults(data.results);
    } catch (e) {
      console.error("Search error:", e);
    }
  };

  // Embed URL
  const getEmbedUrl = () => {
    if (!selectedMedia) return '';
    const isTv = selectedMedia.media_type === 'tv' || selectedMedia.first_air_date || activeTab === 'tv';
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
      
      {/* إزالة الهوامش البيضاء الخارجية */}
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background-color: #09090b;
        }
      `}</style>

      {/* 1. Navbar العلوي */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: 'rgba(9, 9, 11, 0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#f97316', letterSpacing: '1px', cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setSearchResults(null); }}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>
          <div style={{ display: 'flex', gap: '15px', fontSize: '14px', fontWeight: '600' }}>
            <span style={{ color: activeTab === 'home' && !searchResults ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setSearchResults(null); }}>
              الرئيسية
            </span>
            <span style={{ color: activeTab === 'movies' && !searchResults ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('movies'); setSearchResults(null); }}>
              الأفلام
            </span>
            <span style={{ color: activeTab === 'tv' && !searchResults ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('tv'); setSearchResults(null); }}>
              المسلسلات
            </span>
          </div>
        </div>

        {/* نموذج البحث */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '6px', width: '180px' }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '6px 12px', borderRadius: '20px', border: '1px solid #27272a', backgroundColor: '#18181b', color: '#fff', fontSize: '12px', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', backgroundColor: '#f97316', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
            بحث
          </button>
        </form>
      </nav>

      {/* 2. المشغل */}
      {selectedMedia && (
        <div style={{ padding: '20px', backgroundColor: '#18181b', borderBottom: '2px solid #f97316' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div>
              <h2 style={{ margin: 0, color: '#f97316', fontSize: '20px' }}>{selectedMedia.title || selectedMedia.name}</h2>
              <p style={{ margin: '5px 0 0 0', color: '#a1a1aa', fontSize: '13px' }}>{(selectedMedia.release_date || selectedMedia.first_air_date || '').slice(0, 4)} | ⭐ {selectedMedia.vote_average?.toFixed(1)}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {(selectedMedia.media_type === 'tv' || selectedMedia.first_air_date || activeTab === 'tv') && (
                <div style={{ display: 'flex', gap: '6px', marginLeft: '10px', backgroundColor: '#09090b', padding: '4px 8px', borderRadius: '8px', border: '1px solid #27272a' }}>
                  <label style={{ fontSize: '12px', color: '#f97316' }}>S: 
                    <input type="number" min="1" value={season} onChange={(e) => setSeason(e.target.value)} style={{ width: '38px', background: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px', marginRight: '4px', padding: '2px' }} />
                  </label>
                  <label style={{ fontSize: '12px', color: '#f97316' }}>E: 
                    <input type="number" min="1" value={episode} onChange={(e) => setEpisode(e.target.value)} style={{ width: '38px', background: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px', marginRight: '4px', padding: '2px' }} />
                  </label>
                </div>
              )}

              <button onClick={() => setActiveServer('vidsrc.to')} style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'vidsrc.to' ? '#f97316' : '#27272a', color: activeServer === 'vidsrc.to' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '11px' }}>سيرفر 1</button>
              <button onClick={() => setActiveServer('vidsrc.me')} style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'vidsrc.me' ? '#f97316' : '#27272a', color: activeServer === 'vidsrc.me' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '11px' }}>سيرفر 2</button>
              <button onClick={() => setActiveServer('embed.su')} style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'embed.su' ? '#f97316' : '#27272a', color: activeServer === 'embed.su' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '11px' }}>سيرفر 3</button>
              
              <button onClick={() => setSelectedMedia(null)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginRight: '10px' }}>✕</button>
            </div>
          </div>

          <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #27272a' }}>
            <iframe src={getEmbedUrl()} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen referrerPolicy="origin"></iframe>
          </div>
        </div>
      )}

      {/* 3. نتائج البحث */}
      {searchResults ? (
        <div style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '20px', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '15px' }}>نتائج البحث</h2>
          <MediaGrid items={searchResults} onSelect={(item) => { setSelectedMedia(item); setSeason(1); setEpisode(1); }} />
        </div>
      ) : activeTab === 'movies' || activeTab === 'tv' ? (
        /* 4. المكتبة الشاملة */
        <div style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '20px' }}>
            {activeTab === 'movies' ? 'Movies' : 'TV Shows'}
          </h2>
          <MediaGrid items={pageData} onSelect={(item) => { setSelectedMedia(item); setSeason(1); setEpisode(1); }} />
          
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              style={{
                padding: '12px 30px',
                backgroundColor: '#f97316',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                opacity: isLoadingMore ? 0.6 : 1
              }}
            >
              {isLoadingMore ? 'Loading...' : 'عرض المزيد'}
            </button>
          </div>
        </div>
      ) : (
        /* 5. الصفحة الرئيسية */
        <>
          {heroItem && (
            <div style={{ position: 'relative', height: '400px', width: '100%', backgroundImage: `linear-gradient(to top, #09090b 10%, transparent 90%), url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '25px', transition: 'background-image 0.8s ease-in-out' }}>
              <div style={{ maxWidth: '600px', zIndex: 2 }}>
                <span style={{ backgroundColor: '#f97316', color: '#000', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase' }}>🔥 Trending</span>
                <h1 style={{ fontSize: '30px', fontWeight: 'bold', margin: '10px 0', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{heroItem.title || heroItem.name}</h1>
                <p style={{ color: '#d4d4d8', fontSize: '13px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{heroItem.overview}</p>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button onClick={() => { setSelectedMedia(heroItem); setSeason(1); setEpisode(1); }} style={{ padding: '10px 22px', backgroundColor: '#f97316', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
                    ▶ Watch Now
                  </button>
                </div>
              </div>

              <div style={{ position: 'absolute', bottom: '15px', left: '20px', display: 'flex', gap: '6px' }}>
                {trending.map((_, idx) => (
                  <div key={idx} onClick={() => setHeroIndex(idx)} style={{ width: idx === heroIndex ? '24px' : '6px', height: '6px', borderRadius: '3px', backgroundColor: idx === heroIndex ? '#f97316' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s' }}></div>
                ))}
              </div>
            </div>
          )}

          <div style={{ padding: '20px' }}>
            {/* قسم الأفلام الأعلى تقييماً */}
            <section style={{ marginBottom: '35px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>🏆 Top Rated Movies</h2>
                <button onClick={() => setActiveTab('movies')} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  عرض المزيد
                </button>
              </div>
              <MediaGrid items={topMovies} onSelect={(item) => { setSelectedMedia(item); setSeason(1); setEpisode(1); }} />
            </section>

            {/* قسم المسلسلات الأكثر مشاهدة */}
            <section style={{ marginBottom: '35px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>📺 Popular TV Shows</h2>
                <button onClick={() => setActiveTab('tv')} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  عرض المزيد
                </button>
              </div>
              <MediaGrid items={popularTv} onSelect={(item) => { setSelectedMedia(item); setSeason(1); setEpisode(1); }} />
            </section>
          </div>
        </>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #27272a', padding: '20px', textAlign: 'center', color: '#71717a', fontSize: '12px' }}>
        © 2026 CINEMA VIBE - All rights reserved
      </footer>
    </div>
  );
}

// مكون الشبكة العارضة
function MediaGrid({ items, onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
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
              e.currentTarget.style.transform = 'translateY(-4px)';
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
                style={{ width: '100%', height: '210px', objectFit: 'cover' }}
              />
              <span style={{ position: 'absolute', top: '6px', left: '6px', backgroundColor: 'rgba(0,0,0,0.8)', color: '#fbbf24', fontSize: '10px', fontWeight: 'bold', padding: '2px 5px', borderRadius: '4px' }}>
                ⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
              </span>
            </div>
            <div style={{ padding: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#f4f4f5' }}>
                {item.title || item.name}
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#71717a' }}>
                {(item.release_date || item.first_air_date || '').slice(0, 4)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
