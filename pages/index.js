import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [genreMediaType, setGenreMediaType] = useState('movie');
  const [genreData, setGenreData] = useState([]);
  
  const [pageData, setPageData] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [activeServer, setActiveServer] = useState('vidsrc.to');
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  const [heroIndex, setHeroIndex] = useState(0);

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const API_KEY = '5b9856f6fb6a1f87627447e13d9c2288';
  const BASE_URL = 'https://api.themoviedb.org/3';

  const genres = [
    { id: 'all', name: 'الكل' },
    { id: '27', name: 'رعب' },
    { id: '18', name: 'دراما' },
    { id: '28', name: 'أكشن' },
    { id: '35', name: 'كوميديا' },
    { id: '878', name: 'خيال علمي' },
    { id: '9648', name: 'غموض' },
    { id: '80', name: 'جريمة' },
    { id: '12', name: 'مغامرة' },
    { id: '16', name: 'أنيميشن' },
    { id: '10751', name: 'عائلي' },
    { id: '99', name: 'وثائقي' },
    { id: '10749', name: 'رومنسي' }
  ];

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [resTrending, resTopMovies, resPopularTv] = await Promise.all([
          fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=ar-SA`),
          fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=ar-SA`),
          fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=ar-SA`)
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

  useEffect(() => {
    if (selectedGenre === 'all') {
      setGenreData([]);
      return;
    }

    async function fetchGenreData() {
      try {
        const endpoint = `${BASE_URL}/discover/${genreMediaType}?api_key=${API_KEY}&language=ar-SA&sort_by=popularity.desc&with_genres=${selectedGenre}&page=1`;
        const res = await fetch(endpoint);
        const data = await res.json();
        if (data && data.results) {
          setGenreData(data.results);
        }
      } catch (e) {
        console.error("Error fetching genre data:", e);
      }
    }

    fetchGenreData();
  }, [selectedGenre, genreMediaType]);

  useEffect(() => {
    if (activeTab === 'home' || activeTab === 'watch') return;

    async function fetchTabData() {
      try {
        const type = activeTab === 'movies' ? 'movie' : 'tv';
        let endpoint = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&language=ar-SA&sort_by=popularity.desc&page=1`;
        
        if (selectedGenre !== 'all') {
          endpoint += `&with_genres=${selectedGenre}`;
        }

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
  }, [activeTab, selectedGenre]);

  const handleLoadMore = async () => {
    if (activeTab === 'home' || activeTab === 'watch') return;
    setIsLoadingMore(true);
    try {
      const nextPage = pageNum + 1;
      const type = activeTab === 'movies' ? 'movie' : 'tv';
      let endpoint = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&language=ar-SA&sort_by=popularity.desc&page=${nextPage}`;
      
      if (selectedGenre !== 'all') {
        endpoint += `&with_genres=${selectedGenre}`;
      }

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

  useEffect(() => {
    if (trending.length === 0 || activeTab !== 'home') return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % trending.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [trending, activeTab]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=ar-SA&query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.results) setSearchResults(data.results);
    } catch (e) {
      console.error("Search error:", e);
    }
  };

  const openWatchPage = (item) => {
    setSelectedMedia(item);
    setSeason(1);
    setEpisode(1);
    setActiveTab('watch');
    setShowSearchModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getEmbedUrl = () => {
    if (!selectedMedia) return '';
    const isTv = selectedMedia.media_type === 'tv' || selectedMedia.first_air_date || activeTab === 'tv' || (selectedGenre !== 'all' && genreMediaType === 'tv');
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
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Head>
        <title>سينما فيب - Cinema Vibe</title>
      </Head>

      <style jsx global>{`
        html, body { margin: 0; padding: 0; background-color: #09090b; overflow-x: hidden; }
        * { box-sizing: border-box; }
        .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; }
        .poster-img { height: 190px; }
        .hero-banner { height: 360px; }
        @media (min-width: 768px) {
          .media-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
          .poster-img { height: 270px; }
          .hero-banner { height: 480px; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: 'rgba(9, 9, 11, 0.95)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#f97316', cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setSearchResults(null); setSelectedGenre('all'); }}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>
          <div style={{ display: 'flex', gap: '16px', fontSize: '15px', fontWeight: '600' }}>
            <span style={{ color: activeTab === 'home' && !searchResults ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setSearchResults(null); setSelectedGenre('all'); }}>الرئيسية</span>
            <span style={{ color: activeTab === 'movies' && !searchResults ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('movies'); setSearchResults(null); setSelectedGenre('all'); }}>الأفلام</span>
            <span style={{ color: activeTab === 'tv' && !searchResults ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('tv'); setSearchResults(null); setSelectedGenre('all'); }}>المسلسلات</span>
          </div>
        </div>

        <button onClick={() => setShowSearchModal(!showSearchModal)} style={{ background: 'none', border: 'none', color: '#f4f4f5', cursor: 'pointer', padding: '6px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
      </nav>

      {showSearchModal && (
        <div style={{ padding: '16px 24px', backgroundColor: '#18181b', borderBottom: '1px solid #27272a' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', maxWidth: '600px', margin: '0 auto' }}>
            <input type="text" placeholder="ابحث عن فيلم أو مسلسل..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff', outline: 'none' }} />
            <button type="submit" style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#f97316', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>بحث</button>
          </form>
        </div>
      )}

      {activeTab === 'watch' && selectedMedia ? (
        <div style={{ padding: '20px 24px', maxWidth: '1100px', margin: '0 auto' }}>
          <button onClick={() => setActiveTab('home')} style={{ marginBottom: '20px', padding: '10px 18px', borderRadius: '8px', backgroundColor: '#27272a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>← العودة للرئيسية</button>
          <div style={{ backgroundColor: '#18181b', borderRadius: '12px', padding: '20px', border: '1px solid #27272a' }}>
            <h2 style={{ color: '#f97316', margin: '0 0 10px 0' }}>{selectedMedia.title || selectedMedia.name}</h2>
            
            <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', backgroundColor: '#000', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
              <iframe src={getEmbedUrl()} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen></iframe>
            </div>
            <p style={{ color: '#d4d4d8', fontSize: '14px', lineHeight: '1.6' }}>{selectedMedia.overview}</p>
          </div>
        </div>
      ) : searchResults ? (
        <div style={{ padding: '20px 24px' }}>
          <h2 style={{ fontSize: '18px', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '20px' }}>نتائج البحث</h2>
          <MediaGrid items={searchResults} onSelect={openWatchPage} />
        </div>
      ) : activeTab === 'movies' || activeTab === 'tv' ? (
        <div style={{ padding: '20px 24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '12px', marginBottom: '20px' }}>{activeTab === 'movies' ? 'مكتبة الأفلام' : 'مكتبة المسلسلات'}</h2>
          
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
            {genres.map((g) => (
              <button key={g.id} onClick={() => setSelectedGenre(g.id)} style={{ padding: '8px 18px', borderRadius: '20px', border: '1px solid #3f3f46', backgroundColor: selectedGenre === g.id ? '#f97316' : '#18181b', color: selectedGenre === g.id ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>{g.name}</button>
            ))}
          </div>

          <MediaGrid items={pageData} onSelect={openWatchPage} />
          
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button onClick={handleLoadMore} disabled={isLoadingMore} style={{ padding: '12px 30px', backgroundColor: '#f97316', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>{isLoadingMore ? 'جاري التحميل...' : 'عرض المزيد'}</button>
          </div>
        </div>
      ) : (
        <>
          {heroItem && (
            <div className="hero-banner" style={{ position: 'relative', width: '100%', backgroundImage: `linear-gradient(to top, #09090b 10%, transparent 90%), url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '24px' }}>
              <div style={{ maxWidth: '650px', zIndex: 2 }}>
                <span style={{ backgroundColor: '#f97316', color: '#000', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px' }}>رائج الآن</span>
                <h2 style={{ fontSize: '26px', fontWeight: 'bold', margin: '10px 0' }}>{heroItem.title || heroItem.name}</h2>
                <button onClick={() => openWatchPage(heroItem)} style={{ padding: '10px 22px', backgroundColor: '#f97316', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>مشاهدة الان</button>
              </div>
            </div>
          )}

          <div style={{ padding: '20px 24px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '15px', color: '#a1a1aa', marginBottom: '10px' }}>التصنيفات:</h3>
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
                {genres.map((g) => (
                  <button key={g.id} onClick={() => { setSelectedGenre(g.id); setGenreMediaType('movie'); }} style={{ padding: '8px 18px', borderRadius: '20px', border: '1px solid #3f3f46', backgroundColor: selectedGenre === g.id ? '#f97316' : '#18181b', color: selectedGenre === g.id ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>{g.name}</button>
                ))}
              </div>
            </div>

            {selectedGenre !== 'all' ? (
              <section style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>تصنيف {genres.find(g => g.id === selectedGenre)?.name}</h3>
                  <div style={{ display: 'flex', gap: '8px', backgroundColor: '#18181b', padding: '4px', borderRadius: '8px', border: '1px solid #27272a' }}>
                    <button onClick={() => setGenreMediaType('movie')} style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: genreMediaType === 'movie' ? '#f97316' : 'transparent', color: genreMediaType === 'movie' ? '#000' : '#a1a1aa' }}>أفلام</button>
                    <button onClick={() => setGenreMediaType('tv')} style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: genreMediaType === 'tv' ? '#f97316' : 'transparent', color: genreMediaType === 'tv' ? '#000' : '#a1a1aa' }}>مسلسلات</button>
                  </div>
                </div>
                <MediaGrid items={genreData} onSelect={openWatchPage} />
              </section>
            ) : (
              <>
                <section style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '16px' }}>أفضل الأفلام تقييماً</h3>
                  <MediaGrid items={topMovies} onSelect={openWatchPage} />
                </section>
                <section style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '16px' }}>المسلسلات الأكثر مشاهدة</h3>
                  <MediaGrid items={popularTv} onSelect={openWatchPage} />
                </section>
              </>
            )}
          </div>
        </>
      )}

      {/* الفوتر مع الروابط باللون البرتقالي */}
      <footer style={{ borderTop: '1px solid #27272a', padding: '24px 20px', textAlign: 'center', backgroundColor: '#09090b', color: '#71717a', fontSize: '13px', marginTop: '40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <p style={{ margin: 0 }}>جميع الحقوق محفوظة © 2026 CINEMA VIBE</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="/privacy" style={{ color: '#f97316', textDecoration: 'none', fontWeight: 'bold' }}>سياسة الخصوصية</a>
            <a href="/contact" style={{ color: '#f97316', textDecoration: 'none', fontWeight: 'bold' }}>اتصل بنا / اطلب فيلم</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MediaGrid({ items, onSelect }) {
  return (
    <div className="media-grid">
      {items && items.map((item) => {
        if (!item || !item.poster_path) return null;
        return (
          <div key={item.id} onClick={() => onSelect(item)} style={{ backgroundColor: '#18181b', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #27272a' }}>
            <div style={{ position: 'relative' }}>
              <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title || item.name} className="poster-img" style={{ width: '100%', objectFit: 'cover', display: 'block' }} />
              <span style={{ position: 'absolute', top: '6px', left: '6px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#fbbf24', fontSize: '10px', fontWeight: 'bold', padding: '2px 5px', borderRadius: '3px' }}>⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
            </div>
            <div style={{ padding: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#f4f4f5' }}>{item.title || item.name}</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#71717a' }}>{(item.release_date || item.first_air_date || '').slice(0, 4)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
