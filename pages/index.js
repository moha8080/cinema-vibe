import { useState, useEffect } from 'react';
import Head from 'next/head';

const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  const [trending, setTrending] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedServer, setSelectedServer] = useState(1); // نظام السيرفرات المتعددة

  const [topMovies, setTopMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  const [horrorData, setHorrorData] = useState([]);
  const [actionData, setActionData] = useState([]);

  const [selectedGenre, setSelectedGenre] = useState('all');
  const [catalogItems, setCatalogItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lang = '&language=ar-SA';
        
        const trendRes = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}${lang}`);
        const trendData = await trendRes.json();
        setTrending(trendData.results || []);

        const topRes = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}${lang}`);
        const topData = await topRes.json();
        setTopMovies(topData.results || []);

        const tvRes = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}${lang}`);
        const tvData = await tvRes.json();
        setPopularTv(tvData.results || []);

        const fetchGenre = async (genreId, setter) => {
          const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}${lang}`);
          const data = await res.json();
          setter(data.results || []);
        };

        fetchGenre('27', setHorrorData);
        fetchGenre('28', setActionData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(trending.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [trending]);

  useEffect(() => {
    const fetchCatalog = async () => {
      const type = activeTab === 'tv' ? 'tv' : 'movie';
      let url = `https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&language=ar-SA`;
      if (selectedGenre !== 'all') {
        url += `&with_genres=${selectedGenre}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setCatalogItems(data.results || []);
    };

    if (activeTab === 'movies' || activeTab === 'tv') {
      fetchCatalog();
    }
  }, [activeTab, selectedGenre]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&language=ar-SA`);
      const data = await res.json();
      setSearchResults(data.results || []);
      setShowSearchModal(false);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const openWatchPage = (item) => {
    setSelectedMedia(item);
    setSelectedServer(1); // إعادة ضبط السيرفر الافتراضي عند فتح فيلم جديد
    setActiveTab('watch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heroItem = trending[heroIndex];

  // تحديد روابط السيرفرات المختلفة بناءً على نوع العرض (فيلم أو مسلسل)
  const getEmbedUrl = (media, serverId) => {
    if (!media) return '';
    const isTv = media.media_type === 'tv' || media.first_air_date;
    const type = isTv ? 'tv' : 'movie';
    const id = media.id;

    switch (serverId) {
      case 1:
        return `https://vidsrc.me/embed/${type}?tmdb=${id}&sub.lang=ar`;
      case 2:
        return `https://vidsrc.to/embed/${type}/${id}`;
      case 3:
        return `https://multiembed.mov/?video_id=${id}&tmdb=1${isTv ? '&s=1&e=1' : ''}`;
      default:
        return `https://vidsrc.me/embed/${type}?tmdb=${id}&sub.lang=ar`;
    }
  };

  const MediaGrid = ({ items, onSelect }) => {
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
                backgroundColor: '#121215', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                cursor: 'pointer', 
                border: '1px solid #27272a',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ position: 'relative', width: '100%' }} className="poster-img">
                <img src={posterPath} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(0, 0, 0, 0.75)', color: '#f97316', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                  ⭐ {rating}
                </span>
              </div>
              <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {title}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#a1a1aa' }}>
                  <span>{year}</span>
                  <span style={{ color: '#f97316', fontWeight: 'bold' }}>{item.media_type === 'tv' || item.first_air_date ? 'مسلسل' : 'فيلم'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Head>
        <title>سينما فايب | Cinema Vibe</title>
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
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#f97316', cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setSearchResults(null); }}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>
          <div style={{ display: 'flex', gap: '16px', fontSize: '15px', fontWeight: '600' }}>
            <span style={{ color: activeTab === 'home' && !searchQuery ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setSearchResults(null); }}>الرئيسية</span>
            <span style={{ color: activeTab === 'movies' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('movies'); setSearchResults(null); }}>الأفلام</span>
            <span style={{ color: activeTab === 'tv' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('tv'); setSearchResults(null); }}>المسلسلات</span>
          </div>
        </div>
        <button onClick={() => setShowSearchModal(!showSearchModal)} style={{ background: 'none', border: 'none', color: '#f4f4f5', cursor: 'pointer', padding: '6px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
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
        <div style={{ padding: '30px 24px', maxWidth: '1000px', margin: '0 auto' }}>
          <button onClick={() => setActiveTab('home')} style={{ marginBottom: '20px', backgroundColor: '#27272a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>← العودة للرئيسية</button>
          
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f97316', marginBottom: '12px' }}>{selectedMedia.title || selectedMedia.name}</h2>
          
          {/* أزرار اختيار السيرفرات */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14px', color: '#a1a1aa', fontWeight: 'bold' }}>اختر السيرفر:</span>
            {[1, 2, 3].map((srv) => (
              <button 
                key={srv} 
                onClick={() => setSelectedServer(srv)}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: '6px', 
                  border: 'none', 
                  fontWeight: 'bold', 
                  cursor: 'pointer', 
                  backgroundColor: selectedServer === srv ? '#f97316' : '#27272a',
                  color: selectedServer === srv ? '#000' : '#fff',
                  transition: '0.2s'
                }}
              >
                سيرفر {srv} {srv === 1 ? '(رئيسي)' : srv === 2 ? '(احتياطي 1)' : '(احتياطي 2)'}
              </button>
            ))}
          </div>

          {/* مشغل الفيديو (Iframe) */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #27272a' }}>
            <iframe src={getEmbedUrl(selectedMedia, selectedServer)} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen title="مشغل الفيديو" />
          </div>

          <p style={{ marginTop: '20px', lineHeight: '1.6', color: '#d4d4d8' }}>{selectedMedia.overview}</p>
        </div>
      ) : searchResults ? (
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>نتائج البحث</h2>
            <button onClick={() => setSearchResults(null)} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontWeight: 'bold' }}>إلغاء البحث</button>
          </div>
          <MediaGrid items={searchResults} onSelect={openWatchPage} />
        </div>
      ) : activeTab === 'movies' || activeTab === 'tv' ? (
        <div style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '22px', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '20px' }}>{activeTab === 'movies' ? 'مكتبة الأفلام' : 'مكتبة المسلسلات'}</h2>
          <MediaGrid items={catalogItems} onSelect={openWatchPage} />
        </div>
      ) : (
        <>
          {heroItem && (
            <div className="hero-banner" style={{ position: 'relative', width: '100%', backgroundImage: `linear-gradient(to top, #09090b 10%, transparent 90%), url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '24px' }}>
              <div style={{ maxWidth: '650px', zIndex: 2 }}>
                <span style={{ backgroundColor: '#f97316', color: '#000', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px' }}>رائج الآن</span>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0', color: '#fff' }}>{heroItem.title || heroItem.name}</h1>
                <p style={{ color: '#d4d4d8', fontSize: '13px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>{heroItem.overview}</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button onClick={() => openWatchPage(heroItem)} style={{ padding: '10px 22px', backgroundColor: '#f97316', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>شاهد الآن</button>
                </div>
              </div>
            </div>
          )}

          <div style={{ padding: '24px' }}>
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '16px' }}>أفضل الأفلام تقييماً</h2>
              <MediaGrid items={topMovies} onSelect={openWatchPage} />
            </section>
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '16px' }}>المسلسلات الأكثر مشاهدة</h2>
              <MediaGrid items={popularTv} onSelect={openWatchPage} />
            </section>
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '16px' }}>أفلام الرعب</h2>
              <MediaGrid items={horrorData} onSelect={openWatchPage} />
            </section>
          </div>
        </>
      )}

      <footer style={{ backgroundColor: '#121215', borderTop: '1px solid #27272a', padding: '24px', textAlign: 'center', color: '#a1a1aa', fontSize: '14px', marginTop: '40px' }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#f97316' }}>CINEMA VIBE</p>
        <p style={{ margin: 0 }}>جميع الحقوق محفوظة © 2026</p>
      </footer>
    </div>
  );
}
