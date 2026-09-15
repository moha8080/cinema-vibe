import { useState, useEffect } from 'react';

export default function Home() {
  // البيانات الرئيسية
  const [trending, setTrending] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  
  // الوضع الحالي للصفحة: 'home' | 'movies' | 'tv' | 'watch'
  const [activeTab, setActiveTab] = useState('home');
  const [pageData, setPageData] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // المشغل والصفحة الفرعية
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [activeServer, setActiveServer] = useState('vidsrc.to');
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  // السلايدر الرئيسي (البانر)
  const [heroIndex, setHeroIndex] = useState(0);

  // البحث
  const [showSearchModal, setShowSearchModal] = useState(false);
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

  // جلب قائمة الأفلام أو المسلسلات
  useEffect(() => {
    if (activeTab === 'home' || activeTab === 'watch') return;

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
    if (activeTab === 'home' || activeTab === 'watch') return;
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

  // التبديل التلقائي للبانر
  useEffect(() => {
    if (trending.length === 0 || activeTab !== 'home') return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % trending.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [trending, activeTab]);

  // البحث
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

  // فتح صفحة التاصيل للمشاهدة
  const openWatchPage = (item) => {
    setSelectedMedia(item);
    setSeason(1);
    setEpisode(1);
    setActiveTab('watch');
    setShowSearchModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      
      {/* تنسيقات الشاشة وإلغاء الهوامش */}
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background-color: #09090b;
          overflow-x: hidden;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>

      {/* 1. Navbar العلوي */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'rgba(9, 9, 11, 0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#f97316', letterSpacing: '1px', cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setSearchResults(null); }}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>
          <div style={{ display: 'flex', gap: '12px', fontSize: '13px', fontWeight: '600' }}>
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

        {/* أيقونة البحث في أعلى اليسار */}
        <button 
          onClick={() => setShowSearchModal(!showSearchModal)}
          style={{ background: 'none', border: 'none', color: '#f4f4f5', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          aria-label="Search"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </nav>

      {/* مربع البحث المنسدل عند ضغط الأيقونة */}
      {showSearchModal && (
        <div style={{ padding: '12px 16px', backgroundColor: '#18181b', borderBottom: '1px solid #27272a' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', maxWidth: '600px', margin: '0 auto' }}>
            <input
              type="text"
              placeholder="ابحث عن فيلم أو مسلسل بالإنجليزية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff', fontSize: '14px', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#f97316', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
              بحث
            </button>
          </form>
        </div>
      )}

      {/* 2. صفحة المشاهدة المخصصة (صفحة فرعية مستقلة) */}
      {activeTab === 'watch' && selectedMedia ? (
        <div style={{ padding: '16px', maxWidth: '1000px', margin: '0 auto' }}>
          <button 
            onClick={() => setActiveTab('home')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px', padding: '8px 14px', borderRadius: '8px', backgroundColor: '#27272a', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
          >
            ← العودة للرئيسية
          </button>

          <div style={{ backgroundColor: '#18181b', borderRadius: '12px', padding: '16px', border: '1px solid #27272a' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h2 style={{ margin: 0, color: '#f97316', fontSize: '22px' }}>{selectedMedia.title || selectedMedia.name}</h2>
                <p style={{ margin: '6px 0 0 0', color: '#a1a1aa', fontSize: '13px' }}>
                  {(selectedMedia.release_date || selectedMedia.first_air_date || '').slice(0, 4)} | ⭐ {selectedMedia.vote_average?.toFixed(1)}
                </p>
              </div>
              
              {/* اختيار السيرفر والحلقات */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
                {(selectedMedia.media_type === 'tv' || selectedMedia.first_air_date || activeTab === 'tv') && (
                  <div style={{ display: 'flex', gap: '8px', backgroundColor: '#09090b', padding: '6px 10px', borderRadius: '8px', border: '1px solid #27272a' }}>
                    <label style={{ fontSize: '12px', color: '#f97316' }}>الموسم: 
                      <input type="number" min="1" value={season} onChange={(e) => setSeason(e.target.value)} style={{ width: '42px', background: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px', marginRight: '4px', padding: '2px', textAlign: 'center' }} />
                    </label>
                    <label style={{ fontSize: '12px', color: '#f97316' }}>الحلقة: 
                      <input type="number" min="1" value={episode} onChange={(e) => setEpisode(e.target.value)} style={{ width: '42px', background: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px', marginRight: '4px', padding: '2px', textAlign: 'center' }} />
                    </label>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setActiveServer('vidsrc.to')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'vidsrc.to' ? '#f97316' : '#27272a', color: activeServer === 'vidsrc.to' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '12px' }}>سيرفر 1</button>
                  <button onClick={() => setActiveServer('vidsrc.me')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'vidsrc.me' ? '#f97316' : '#27272a', color: activeServer === 'vidsrc.me' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '12px' }}>سيرفر 2</button>
                  <button onClick={() => setActiveServer('embed.su')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'embed.su' ? '#f97316' : '#27272a', color: activeServer === 'embed.su' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '12px' }}>سيرفر 3</button>
                </div>
              </div>
            </div>

            {/* إطار مشغل الفيديو */}
            <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', backgroundColor: '#000', borderRadius: '10px', overflow: 'hidden', border: '1px solid #27272a' }}>
              <iframe src={getEmbedUrl()} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen referrerPolicy="origin"></iframe>
            </div>

            {/* نبذة عن العمل */}
            {selectedMedia.overview && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #27272a' }}>
                <h3 style={{ fontSize: '15px', color: '#f97316', margin: '0 0 8px 0' }}>Overview</h3>
                <p style={{ fontSize: '13px', color: '#d4d4d8', lineHeight: '1.5', margin: 0 }}>{selectedMedia.overview}</p>
              </div>
            )}
          </div>
        </div>
      ) : searchResults ? (
        /* 3. نتائج البحث */
        <div style={{ padding: '16px' }}>
          <h2 style={{ fontSize: '18px', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '16px' }}>نتائج البحث</h2>
          <MediaGrid items={searchResults} onSelect={openWatchPage} />
        </div>
      ) : activeTab === 'movies' || activeTab === 'tv' ? (
        /* 4. المكتبة الشاملة */
        <div style={{ padding: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '16px' }}>
            {activeTab === 'movies' ? 'Movies' : 'TV Shows'}
          </h2>
          <MediaGrid items={pageData} onSelect={openWatchPage} />
          
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              style={{
                padding: '10px 24px',
                backgroundColor: '#f97316',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '13px',
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
            <div style={{ position: 'relative', height: '320px', width: '100%', backgroundImage: `linear-gradient(to top, #09090b 10%, transparent 90%), url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '16px', transition: 'background-image 0.8s ease-in-out' }}>
              <div style={{ maxWidth: '600px', zIndex: 2 }}>
                <span style={{ backgroundColor: '#f97316', color: '#000', padding: '3px 6px', borderRadius: '4px', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase' }}>🔥 Trending</span>
                <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '8px 0', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{heroItem.title || heroItem.name}</h1>
                <p style={{ color: '#d4d4d8', fontSize: '12px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>{heroItem.overview}</p>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button onClick={() => openWatchPage(heroItem)} style={{ padding: '8px 18px', backgroundColor: '#f97316', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                    ▶ Watch Now
                  </button>
                </div>
              </div>

              <div style={{ position: 'absolute', bottom: '12px', left: '16px', display: 'flex', gap: '5px' }}>
                {trending.map((_, idx) => (
                  <div key={idx} onClick={() => setHeroIndex(idx)} style={{ width: idx === heroIndex ? '20px' : '5px', height: '5px', borderRadius: '3px', backgroundColor: idx === heroIndex ? '#f97316' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s' }}></div>
                ))}
              </div>
            </div>
          )}

          <div style={{ padding: '16px' }}>
            {/* قسم أفضل الأفلام تقييماً - بدون أيقونات وباللغة العربية */}
            <section style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '8px', margin: 0 }}>أفضل الأفلام تقييماً</h2>
                <button onClick={() => setActiveTab('movies')} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '4px 12px', borderRadius: '16px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                  عرض المزيد
                </button>
              </div>
              <MediaGrid items={topMovies} onSelect={openWatchPage} />
            </section>

            {/* قسم المسلسلات الأكثر مشاهدة - بدون أيقونات وباللغة العربية */}
            <section style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '8px', margin: 0 }}>المسلسلات الأكثر مشاهدة</h2>
                <button onClick={() => setActiveTab('tv')} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '4px 12px', borderRadius: '16px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                  عرض المزيد
                </button>
              </div>
              <MediaGrid items={popularTv} onSelect={openWatchPage} />
            </section>
          </div>
        </>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #27272a', padding: '16px', textAlign: 'center', color: '#71717a', fontSize: '11px' }}>
        © 2026 CINEMA VIBE - All rights reserved
      </footer>
    </div>
  );
}

// مكون الشبكة العارضة (مخصصة للتجاوب التام مع الجوالات والأيباد)
function MediaGrid({ items, onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))', gap: '10px' }}>
      {items && items.map((item) => {
        if (!item || !item.poster_path) return null;
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
              transition: 'transform 0.2s, border-color 0.2s',
            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                style={{ width: '100%', height: '155px', objectFit: 'cover', display: 'block' }}
              />
              <span style={{ position: 'absolute', top: '4px', left: '4px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#fbbf24', fontSize: '9px', fontWeight: 'bold', padding: '2px 4px', borderRadius: '3px' }}>
                ⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
              </span>
            </div>
            <div style={{ padding: '6px' }}>
              <h3 style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#f4f4f5' }}>
                {item.title || item.name}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '9px', color: '#71717a' }}>
                {(item.release_date || item.first_air_date || '').slice(0, 4)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
