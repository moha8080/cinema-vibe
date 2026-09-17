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
  const [selectedServer, setSelectedServer] = useState('streamwish');

  // بيانات التصنيفات المتعددة للقائمة الرئيسية
  const [topMovies, setTopMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  const [actionData, setActionData] = useState([]);
  const [comedyData, setComedyData] = useState([]);
  const [horrorData, setHorrorData] = useState([]);
  const [sciFiData, setSciFiData] = useState([]);
  const [animationData, setAnimationData] = useState([]);

  // صفحة عرض المزيد
  const [selectedGenreTitle, setSelectedGenreTitle] = useState('');
  const [genreCatalogItems, setGenreCatalogItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendRes = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&language=en-US`);
        const trendData = await trendRes.json();
        setTrending(trendData.results || []);

        const topRes = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US`);
        const topData = await topRes.json();
        setTopMovies(topData.results || []);

        const tvRes = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US`);
        const tvData = await tvRes.json();
        setPopularTv(tvData.results || []);

        const fetchGenre = async (genreId, setter) => {
          const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US`);
          const data = await res.json();
          setter(data.results || []);
        };

        fetchGenre('28', setActionData);   // أكشن
        fetchGenre('35', setComedyData);   // كوميدي
        fetchGenre('27', setHorrorData);   // رعب
        fetchGenre('878', setSciFiData);   // خيال علمي
        fetchGenre('16', setAnimationData); // أنمي / رسوم متحركة

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

  // دالة جلب عناصر تصنيف معين عند الضغط على "عرض المزيد"
  const openGenreCatalog = async (genreId, title) => {
    setSelectedGenreTitle(title);
    setActiveTab('genre-catalog');
    try {
      const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US`);
      const data = await res.json();
      setGenreCatalogItems(data.results || []);
    } catch (err) {
      console.error('Error fetching genre catalog:', err);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&language=en-US`);
      const data = await res.json();
      setSearchResults(data.results || []);
      setShowSearchModal(false);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const openWatchPage = (item) => {
    setSelectedMedia(item);
    setSelectedServer('streamwish');
    setActiveTab('watch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heroItem = trending[heroIndex];

  // قائمة السيرفرات المطلوبة بالأسماء المحددة مع ضبط الترجمة العربية تلقائياً للكمبيوتر والجوال
  const getEmbedUrl = (media, serverName) => {
    if (!media) return '';
    const isTv = media.media_type === 'tv' || media.first_air_date;
    const type = isTv ? 'tv' : 'movie';
    const id = media.id;

    switch (serverName) {
      case 'streamwish':
        return `https://vidsrc.xyz/embed/${type}?tmdb=${id}&sub.lang=ar`;
      case 'streamtape':
        return `https://vidsrc.to/embed/${type}/${id}?sub.lang=ar`;
      case 'filelions':
        return `https://vidsrc.me/embed/${type}?tmdb=${id}&sub.lang=ar`;
      case 'videotube':
        return `https://multiembed.mov/?video_id=${id}&tmdb=1${isTv ? '&s=1&e=1' : ''}&sub.lang=ar`;
      case 'updwon':
        return `https://iframe.vidsrc.xyz/embed/${type}/${id}?sub.lang=ar`;
      case 'lulustream':
        return `https://vidsrc.vip/embed/${type}/${id}?sub.lang=ar`;
      default:
        return `https://vidsrc.xyz/embed/${type}?tmdb=${id}&sub.lang=ar`;
    }
  };

  const serversList = [
    { id: 'streamwish', name: 'Streamwish' },
    { id: 'streamtape', name: 'Streamtape' },
    { id: 'filelions', name: 'Filelions' },
    { id: 'videotube', name: 'Videotube' },
    { id: 'updwon', name: 'Updwon' },
    { id: 'lulustream', name: 'Lulustream' }
  ];

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
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', direction: 'ltr', textAlign: 'right' }}>
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

      {/* Navbar العلوي */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'rgba(9, 9, 11, 0.95)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#f97316', cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => { setActiveTab('home'); setSearchResults(null); }}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>
          <div style={{ display: 'flex', gap: '12px', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}>
            <span style={{ color: activeTab === 'home' && !searchQuery ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setSearchResults(null); }}>الرئيسية</span>
          </div>
        </div>
        <button 
          onClick={() => setShowSearchModal(!showSearchModal)} 
          style={{ 
            background: 'rgba(255,255,255,0.06)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '50%', 
            width: '38px', 
            height: '38px', 
            minWidth: '38px', 
            color: '#f97316', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexShrink: 0 
          }}
          aria-label="Search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
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
          
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f97316', marginBottom: '12px', direction: 'ltr', textAlign: 'right' }}>
            {selectedMedia.title || selectedMedia.name}
          </h2>
          
          {/* اختيار السيرفرات بالأسماء المحددة */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 'bold', width: '100%' }}>اختر السيرفر (الترجمة العربية مفعلة تلقائياً):</span>
            {serversList.map((srv) => (
              <button 
                key={srv.id} 
                onClick={() => setSelectedServer(srv.id)}
                style={{ 
                  padding: '8px 14px', 
                  borderRadius: '6px', 
                  border: 'none', 
                  fontWeight: 'bold', 
                  fontSize: '12px',
                  cursor: 'pointer', 
                  backgroundColor: selectedServer === srv.id ? '#f97316' : '#27272a',
                  color: selectedServer === srv.id ? '#000' : '#fff'
                }}
              >
                {srv.name}
              </button>
            ))}
          </div>

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
      ) : activeTab === 'genre-catalog' ? (
        <div style={{ padding: '24px' }}>
          <button onClick={() => setActiveTab('home')} style={{ marginBottom: '20px', backgroundColor: '#27272a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>← العودة للرئيسية</button>
          <h2 style={{ fontSize: '22px', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '20px' }}>{selectedGenreTitle}</h2>
          <MediaGrid items={genreCatalogItems} onSelect={openWatchPage} />
        </div>
      ) : (
        <>
          {heroItem && (
            <div className="hero-banner" style={{ position: 'relative', width: '100%', backgroundImage: `linear-gradient(to top, #09090b 10%, transparent 90%), url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '24px' }}>
              <div style={{ maxWidth: '650px', zIndex: 2 }}>
                <span style={{ backgroundColor: '#f97316', color: '#000', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px' }}>رائج الآن</span>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0', color: '#fff', direction: 'ltr', textAlign: 'right' }}>
                  {heroItem.title || heroItem.name}
                </h1>
                <p style={{ color: '#d4d4d8', fontSize: '13px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>{heroItem.overview}</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button onClick={() => openWatchPage(heroItem)} style={{ padding: '10px 22px', backgroundColor: '#f97316', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>شاهد الآن</button>
                </div>
              </div>
            </div>
          )}

          {/* القوائم والتصنيفات المتعددة مع أزرار عرض المزيد */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* أفضل الأفلام تقييماً */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أفضل الأفلام تقييماً</h2>
                <button onClick={() => openGenreCatalog('0', 'أفضل الأفلام تقييماً')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>عرض المزيد ➔</button>
              </div>
              <MediaGrid items={topMovies} onSelect={openWatchPage} />
            </section>

            {/* المسلسلات الأكثر مشاهدة */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>المسلسلات الأكثر مشاهدة</h2>
                <button onClick={() => openGenreCatalog('10759', 'المسلسلات الشهيرة')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>عرض المزيد ➔</button>
              </div>
              <MediaGrid items={popularTv} onSelect={openWatchPage} />
            </section>

            {/* تصنيف الرعب */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أفلام الرعب</h2>
                <button onClick={() => openGenreCatalog('27', 'أفلام الرعب')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>عرض المزيد ➔</button>
              </div>
              <MediaGrid items={horrorData} onSelect={openWatchPage} />
            </section>

            {/* تصنيف الأكشن */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أفلام الأكشن والمغامرة</h2>
                <button onClick={() => openGenreCatalog('28', 'أفلام الأكشن')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>عرض المزيد ➔</button>
              </div>
              <MediaGrid items={actionData} onSelect={openWatchPage} />
            </section>

            {/* تصنيف الكوميديا */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أفلام الكوميديا</h2>
                <button onClick={() => openGenreCatalog('35', 'أفلام الكوميديا')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>عرض المزيد ➔</button>
              </div>
              <MediaGrid items={comedyData} onSelect={openWatchPage} />
            </section>

            {/* تصنيف الخيال العلمي */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أفلام الخيال العلمي</h2>
                <button onClick={() => openGenreCatalog('878', 'أفلام الخيال العلمي')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>عرض المزيد ➔</button>
              </div>
              <MediaGrid items={sciFiData} onSelect={openWatchPage} />
            </section>

            {/* تصنيف الأنيماشن / الأنمي */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>عالم الأنيماشن</h2>
                <button onClick={() => openGenreCatalog('16', 'عالم الأنيماشن')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>عرض المزيد ➔</button>
              </div>
              <MediaGrid items={animationData} onSelect={openWatchPage} />
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
