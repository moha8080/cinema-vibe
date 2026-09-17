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

  // إعدادات المسلسلات (الموسم والحلقة)
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  // قوائم رئيسية (بتقييم فوق 7)
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  const [actionTv, setActionTv] = useState([]);
  const [sciFiTv, setSciFiTv] = useState([]);

  // صفحة التصنيف الفرعي
  const [catalogTitle, setCatalogTitle] = useState('');
  const [catalogItems, setCatalogItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendRes = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&language=ar-SA`);
        const trendData = await trendRes.json();
        setTrending(trendData.results || []);

        // دالة لجلب البيانات وتصفية ما هو أعلى من تقييم 7
        const fetchAndFilter = async (url, setter) => {
          const res = await fetch(url);
          const data = await res.json();
          const filtered = (data.results || []).filter(item => item.vote_average >= 7);
          setter(filtered);
        };

        // الأفلام والمسلسلات بالعربي مع تقييم فوق 7
        fetchAndFilter(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=ar-SA`, setTopRatedMovies);
        fetchAndFilter(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28&vote_average.gte=7&language=ar-SA`, setActionMovies);
        fetchAndFilter(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=27&vote_average.gte=7&language=ar-SA`, setHorrorMovies);
        
        fetchAndFilter(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=ar-SA`, setPopularTv);
        fetchAndFilter(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=10759&vote_average.gte=7&language=ar-SA`, setActionTv);
        fetchAndFilter(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=10765&vote_average.gte=7&language=ar-SA`, setSciFiTv);

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

  const openCatalog = async (type, genreId, title) => {
    setCatalogTitle(title);
    setActiveTab('catalog');
    try {
      let url = `https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&vote_average.gte=7&language=ar-SA`;
      if (genreId && genreId !== '0') {
        url += `&with_genres=${genreId}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setCatalogItems(data.results || []);
    } catch (err) {
      console.error('Error fetching catalog:', err);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    setSelectedSeason(1);
    setSelectedEpisode(1);
    setActiveTab('watch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heroItem = trending[heroIndex];

  // السيرفر الفعال المضمون مع الترجمة العربية التلقائية
  const getEmbedUrl = (media) => {
    if (!media) return '';
    const isTv = media.media_type === 'tv' || media.first_air_date;
    const type = isTv ? 'tv' : 'movie';
    const id = media.id;
    const tvPathSegment = isTv ? `/${selectedSeason}/${selectedEpisode}` : '';

    return `https://vidsrc.xyz/embed/${type}/${id}${tvPathSegment}?sub.lang=ar`;
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
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'right' }}>
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

      {/* الشريط العلوي */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'rgba(9, 9, 11, 0.95)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0, flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#f97316', cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => { setActiveTab('home'); setSearchResults(null); }}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}>
            <span style={{ color: activeTab === 'home' && !searchQuery ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setSearchResults(null); }}>الرئيسية</span>
            <span style={{ color: activeTab === 'movies-hub' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('movies-hub'); setSearchResults(null); }}>الأفلام</span>
            <span style={{ color: activeTab === 'tv-hub' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('tv-hub'); setSearchResults(null); }}>المسلسلات</span>
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

      {/* صفحة المشاهدة */}
      {activeTab === 'watch' && selectedMedia ? (
        <div style={{ padding: '30px 24px', maxWidth: '1000px', margin: '0 auto' }}>
          <button onClick={() => setActiveTab('home')} style={{ marginBottom: '20px', backgroundColor: '#27272a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>← العودة للرئيسية</button>
          
          {/* عرض اسم العمل بوضوح تام */}
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f97316', marginBottom: '16px', textAlign: 'right' }}>
            {selectedMedia.title || selectedMedia.name} 
            {(selectedMedia.media_type === 'tv' || selectedMedia.first_air_date) && (
              <span style={{ color: '#fff', fontSize: '18px', marginRight: '10px' }}>
                (الموسم {selectedSeason} - الحلقة {selectedEpisode})
              </span>
            )}
          </h2>

          {/* خانة اختيار الموسم والحلقة (للمسلسلات) */}
          {(selectedMedia.media_type === 'tv' || selectedMedia.first_air_date) && (
            <div style={{ display: 'flex', gap: '15px', marginBottom: '16px', backgroundColor: '#18181b', padding: '12px 16px', borderRadius: '8px', border: '1px solid #27272a', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: '#f97316', fontWeight: 'bold' }}>اختر الموسم والحلقة:</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <label style={{ fontSize: '12px', color: '#a1a1aa' }}>الموسم:</label>
                <select value={selectedSeason} onChange={(e) => setSelectedSeason(Number(e.target.value))} style={{ padding: '6px 10px', backgroundColor: '#27272a', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px', cursor: 'pointer' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => <option key={s} value={s}>الموسم {s}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <label style={{ fontSize: '12px', color: '#a1a1aa' }}>الحلقة:</label>
                <select value={selectedEpisode} onChange={(e) => setSelectedEpisode(Number(e.target.value))} style={{ padding: '6px 10px', backgroundColor: '#27272a', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px', cursor: 'pointer' }}>
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(ep => <option key={ep} value={ep}>الحلقة {ep}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* المشغل المباشر الفعال مع الترجمة */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #27272a' }}>
            <iframe src={getEmbedUrl(selectedMedia)} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen title="مشغل الفيديو" />
          </div>

          {/* قصة العمل باللغة العربية */}
          <div style={{ marginTop: '20px', backgroundColor: '#18181b', padding: '16px', borderRadius: '8px', border: '1px solid #27272a' }}>
            <h3 style={{ fontSize: '15px', color: '#f97316', margin: '0 0 8px 0', fontWeight: 'bold' }}>قصة العمل:</h3>
            <p style={{ margin: 0, lineHeight: '1.7', color: '#d4d4d8', fontSize: '14px' }}>
              {selectedMedia.overview || 'لا يتوفر وصف تفصيلي حالياً لهذا العنوان باللغة العربية.'}
            </p>
          </div>
        </div>
      ) : searchResults ? (
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>نتائج البحث</h2>
            <button onClick={() => setSearchResults(null)} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontWeight: 'bold' }}>إلغاء البحث</button>
          </div>
          <MediaGrid items={searchResults} onSelect={openWatchPage} />
        </div>
      ) : activeTab === 'movies-hub' ? (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <h2 style={{ fontSize: '22px', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>قسم الأفلام الشاملة (تقييم 7+)</h2>
          
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0', color: '#fff' }}>أفلام الأكشن والمغامرة</h3>
              <button onClick={() => openCatalog('movie', '28', 'أفلام الأكشن')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>عرض المزيد ➔</button>
            </div>
            <MediaGrid items={actionMovies} onSelect={openWatchPage} />
          </section>

          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0', color: '#fff' }}>أفلام الرعب</h3>
              <button onClick={() => openCatalog('movie', '27', 'أفلام الرعب')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>عرض المزيد ➔</button>
            </div>
            <MediaGrid items={horrorMovies} onSelect={openWatchPage} />
          </section>
        </div>
      ) : activeTab === 'tv-hub' ? (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <h2 style={{ fontSize: '22px', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>قسم المسلسلات الشاملة (تقييم 7+)</h2>

          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0', color: '#fff' }}>مسلسلات الأكشن والمغامرة</h3>
              <button onClick={() => openCatalog('tv', '10759', 'مسلسلات الأكشن')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>عرض المزيد ➔</button>
            </div>
            <MediaGrid items={actionTv} onSelect={openWatchPage} />
          </section>

          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0', color: '#fff' }}>مسلسلات الخيال العلمي والفانتازيا</h3>
              <button onClick={() => openCatalog('tv', '10765', 'مسلسلات الخيال العلمي')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>عرض المزيد ➔</button>
            </div>
            <MediaGrid items={sciFiTv} onSelect={openWatchPage} />
          </section>
        </div>
      ) : activeTab === 'catalog' ? (
        <div style={{ padding: '24px' }}>
          <button onClick={() => setActiveTab('home')} style={{ marginBottom: '20px', backgroundColor: '#27272a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>← العودة للرئيسية</button>
          <h2 style={{ fontSize: '22px', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '20px' }}>{catalogTitle}</h2>
          <MediaGrid items={catalogItems} onSelect={openWatchPage} />
        </div>
      ) : (
        <>
          {heroItem && (
            <div className="hero-banner" style={{ position: 'relative', width: '100%', backgroundImage: `linear-gradient(to top, #09090b 10%, transparent 90%), url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '24px' }}>
              <div style={{ maxWidth: '650px', zIndex: 2 }}>
                <span style={{ backgroundColor: '#f97316', color: '#000', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px' }}>رائج الآن</span>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0', color: '#fff', textAlign: 'right' }}>
                  {heroItem.title || heroItem.name}
                </h1>
                <p style={{ color: '#d4d4d8', fontSize: '13px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>{heroItem.overview}</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button onClick={() => openWatchPage(heroItem)} style={{ padding: '10px 22px', backgroundColor: '#f97316', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>شاهد الآن</button>
                </div>
              </div>
            </div>
          )}

          {/* القوائم المتنوعة في الصفحة الرئيسية (أفلام ومسلسلات بتقييم فوق 7) */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أفضل الأفلام تقييماً (7+)</h2>
                <button onClick={() => openCatalog('movie', '0', 'أفضل الأفلام تقييماً')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>عرض المزيد ➔</button>
              </div>
              <MediaGrid items={topRatedMovies} onSelect={openWatchPage} />
            </section>

            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>المسلسلات الأكثر مشاهدة (7+)</h2>
                <button onClick={() => openCatalog('tv', '0', 'المسلسلات الأكثر مشاهدة')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>عرض المزيد ➔</button>
              </div>
              <MediaGrid items={popularTv} onSelect={openWatchPage} />
            </section>

            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أفلام الأكشن والمغامرة (7+)</h2>
                <button onClick={() => openCatalog('movie', '28', 'أفلام الأكشن')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>عرض المزيد ➔</button>
              </div>
              <MediaGrid items={actionMovies} onSelect={openWatchPage} />
            </section>

            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أفلام الرعب (7+)</h2>
                <button onClick={() => openCatalog('movie', '27', 'أفلام الرعب')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>عرض المزيد ➔</button>
              </div>
              <MediaGrid items={horrorMovies} onSelect={openWatchPage} />
            </section>

            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>مسلسلات الخيال العلمي والفانتازيا (7+)</h2>
                <button onClick={() => openCatalog('tv', '10765', 'مسلسلات الخيال العلمي')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>عرض المزيد ➔</button>
              </div>
              <MediaGrid items={sciFiTv} onSelect={openWatchPage} />
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
