import { useState, useEffect } from 'react';

export default function Home() {
  // البيانات الرئيسية
  const [trending, setTrending] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);

  // أقسام التصنيفات المخصصة
  const [horrorData, setHorrorData] = useState([]);
  const [dramaData, setDramaData] = useState([]);
  const [actionData, setActionData] = useState([]);
  const [comedyData, setComedyData] = useState([]);
  const [scifiData, setSciFiData] = useState([]);
  const [mysteryData, setMysteryData] = useState([]);
  const [romanceData, setRomanceData] = useState([]);
  const [adventureData, setAdventureData] = useState([]);
  
  // الوضع الحالي للصفحة: 'home' | 'movies' | 'tv' | 'watch'
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [pageData, setPageData] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // المشغل والصفحة الفرعية
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [arabicOverview, setArabicOverview] = useState('جاري تحميل القصة...');
  const [activeServer, setActiveServer] = useState('vidsrc.to');
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [availableSeasons, setAvailableSeasons] = useState([]);
  const [availableEpisodes, setAvailableEpisodes] = useState([]);

  // السلايدر الرئيسي (البانر)
  const [heroIndex, setHeroIndex] = useState(0);

  // البحث
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  // قائمة تصنيفات المكتبة
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

  // جلب كافة الأقسام والتصنيفات للصفحة الرئيسية
  useEffect(() => {
    async function fetchHomeData() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) return;

        const [
          resTrending, resTopMovies, resPopularTv,
          resHorror, resDrama, resAction, resComedy,
          resSciFi, resMystery, resRomance, resAdventure
        ] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&with_genres=27&sort_by=popularity.desc`),
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&with_genres=18&sort_by=popularity.desc`),
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&with_genres=28&sort_by=popularity.desc`),
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&with_genres=35&sort_by=popularity.desc`),
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&with_genres=878&sort_by=popularity.desc`),
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&with_genres=9648&sort_by=popularity.desc`),
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&with_genres=10749&sort_by=popularity.desc`),
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&with_genres=12&sort_by=popularity.desc`)
        ]);

        const dTrending = await resTrending.json();
        const dTopMovies = await resTopMovies.json();
        const dPopularTv = await resPopularTv.json();
        const dHorror = await resHorror.json();
        const dDrama = await resDrama.json();
        const dAction = await resAction.json();
        const dComedy = await resComedy.json();
        const dSciFi = await resSciFi.json();
        const dMystery = await resMystery.json();
        const dRomance = await resRomance.json();
        const dAdventure = await resAdventure.json();

        if (dTrending.results) setTrending(dTrending.results.slice(0, 10));
        if (dTopMovies.results) setTopMovies(dTopMovies.results.slice(0, 12));
        if (dPopularTv.results) setPopularTv(dPopularTv.results.slice(0, 12));

        if (dHorror.results) setHorrorData(dHorror.results.slice(0, 12));
        if (dDrama.results) setDramaData(dDrama.results.slice(0, 12));
        if (dAction.results) setActionData(dAction.results.slice(0, 12));
        if (dComedy.results) setComedyData(dComedy.results.slice(0, 12));
        if (dSciFi.results) setSciFiData(dSciFi.results.slice(0, 12));
        if (dMystery.results) setMysteryData(dMystery.results.slice(0, 12));
        if (dRomance.results) setRomanceData(dRomance.results.slice(0, 12));
        if (dAdventure.results) setAdventureData(dAdventure.results.slice(0, 12));
      } catch (e) {
        console.error("Error fetching home data:", e);
      }
    }
    fetchHomeData();
  }, []);

  // فتح صفحة التفاصيل للمشاهدة وتحديد عدد المواسم والحلقات الدقيقة
  const openWatchPage = async (item) => {
    setSelectedMedia(item);
    setSeason(1);
    setEpisode(1);
    setActiveTab('watch');
    setShowSearchModal(false);
    setArabicOverview('جاري تحميل قصة العمل باللغة العربية...');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const isTv = item.media_type === 'tv' || item.first_air_date || activeTab === 'tv';
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    if (isTv) {
      try {
        const tvRes = await fetch(`https://api.themoviedb.org/3/tv/${item.id}?api_key=${apiKey}&language=ar-SA`);
        const tvData = await tvRes.json();
        
        const totalSeasons = tvData.number_of_seasons || 1;
        const seasonsArr = Array.from({ length: totalSeasons }, (_, i) => i + 1);
        setAvailableSeasons(seasonsArr);

        if (tvData.overview && tvData.overview.trim() !== '') {
          setArabicOverview(tvData.overview);
        } else {
          setArabicOverview('لا تتوفر قصة مترجمة حالياً لهذا العمل باللغة العربية.');
        }

        fetchEpisodeCount(item.id, 1, apiKey);
      } catch (e) {
        console.error("Error fetching TV details:", e);
        setAvailableSeasons([1]);
        setAvailableEpisodes(Array.from({ length: 24 }, (_, i) => i + 1));
      }
    } else {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${item.id}?api_key=${apiKey}&language=ar-SA`);
        const data = await res.json();
        if (data && data.overview && data.overview.trim() !== '') {
          setArabicOverview(data.overview);
        } else {
          setArabicOverview('لا تتوفر قصة مترجمة حالياً لهذا العمل باللغة العربية.');
        }
      } catch (e) {
        console.error("Error fetching Movie overview:", e);
        setArabicOverview('لا تتوفر قصة مترجمة حالياً لهذا العمل.');
      }
    }
  };

  // جلب عدد الحلقات لموسم معين
  const fetchEpisodeCount = async (tvId, seasonNum, apiKey) => {
    try {
      const seasonRes = await fetch(`https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNum}?api_key=${apiKey}`);
      const seasonData = await seasonRes.json();
      const totalEp = seasonData.episodes ? seasonData.episodes.length : 24;
      setAvailableEpisodes(Array.from({ length: totalEp }, (_, i) => i + 1));
    } catch (e) {
      setAvailableEpisodes(Array.from({ length: 24 }, (_, i) => i + 1));
    }
  };

  // عند تغيير الموسم يدوياً من قبل المستخدم
  const handleSeasonChange = (newSeason) => {
    setSeason(newSeason);
    setEpisode(1);
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (selectedMedia) {
      fetchEpisodeCount(selectedMedia.id, newSeason, apiKey);
    }
  };

  // جلب صفحة المكتبة الشاملة
  useEffect(() => {
    if (activeTab === 'home' || activeTab === 'watch') return;

    async function fetchTabData() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) return;

        const type = activeTab === 'movies' ? 'movie' : 'tv';
        let endpoint = `https://api.themoviedb.org/3/discover/${type}?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=1`;
        
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

  // تحميل المزيد
  const handleLoadMore = async () => {
    if (activeTab === 'home' || activeTab === 'watch') return;
    setIsLoadingMore(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const nextPage = pageNum + 1;
      const type = activeTab === 'movies' ? 'movie' : 'tv';
      let endpoint = `https://api.themoviedb.org/3/discover/${type}?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=${nextPage}`;
      
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

  // Embed URL - دعم الجوال والكمبيوتر بفرض الترجمة العربية الإجبارية
  const getEmbedUrl = () => {
    if (!selectedMedia) return '';
    const isTv = selectedMedia.media_type === 'tv' || selectedMedia.first_air_date || activeTab === 'tv';
    const id = selectedMedia.id;

    if (isTv) {
      if (activeServer === 'vidsrc.to') return `https://vidsrc.to/embed/tv/${id}/${season}/${episode}?sub.lang=ar&ds_lang=ar`;
      if (activeServer === 'vidsrc.me') return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}&sub.lang=ar&ds_lang=ar`;
      if (activeServer === 'embed.su') return `https://embed.su/embed/tv/${id}/${season}/${episode}?sub.lang=ar`;
    } else {
      if (activeServer === 'vidsrc.to') return `https://vidsrc.to/embed/movie/${id}?sub.lang=ar&ds_lang=ar`;
      if (activeServer === 'vidsrc.me') return `https://vidsrc.me/embed/movie?tmdb=${id}&sub.lang=ar&ds_lang=ar`;
      if (activeServer === 'embed.su') return `https://embed.su/embed/movie/${id}?sub.lang=ar`;
    }
    return `https://vidsrc.to/embed/movie/${id}?sub.lang=ar&ds_lang=ar`;
  };

  const heroItem = trending[heroIndex];

  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* تنسيقات التجاوب الذكية */}
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

        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 12px;
        }
        .poster-img {
          height: 190px;
        }
        .hero-banner {
          height: 360px;
        }

        @media (min-width: 768px) {
          .media-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 20px;
          }
          .poster-img {
            height: 270px;
          }
          .hero-banner {
            height: 480px;
          }
        }
      `}</style>

      {/* 1. Navbar العلوي */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: 'rgba(9, 9, 11, 0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#f97316', letterSpacing: '1px', cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setSearchResults(null); setSelectedGenre('all'); }}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>
          <div style={{ display: 'flex', gap: '16px', fontSize: '15px', fontWeight: '600' }}>
            <span style={{ color: activeTab === 'home' && !searchResults ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setSearchResults(null); setSelectedGenre('all'); }}>
              الرئيسية
            </span>
            <span style={{ color: activeTab === 'movies' && !searchResults ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('movies'); setSearchResults(null); setSelectedGenre('all'); }}>
              الأفلام
            </span>
            <span style={{ color: activeTab === 'tv' && !searchResults ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('tv'); setSearchResults(null); setSelectedGenre('all'); }}>
              المسلسلات
            </span>
          </div>
        </div>

        {/* أيقونة البحث */}
        <button 
          onClick={() => setShowSearchModal(!showSearchModal)}
          style={{ background: 'none', border: 'none', color: '#f4f4f5', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          aria-label="Search"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </nav>

      {/* مربع البحث */}
      {showSearchModal && (
        <div style={{ padding: '16px 24px', backgroundColor: '#18181b', borderBottom: '1px solid #27272a' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', maxWidth: '600px', margin: '0 auto' }}>
            <input
              type="text"
              placeholder="Search movies or TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#f97316', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
              بحث
            </button>
          </form>
        </div>
      )}

      {/* 2. صفحة المشاهدة المخصصة */}
      {activeTab === 'watch' && selectedMedia ? (
        <div style={{ padding: '20px 24px', maxWidth: '1100px', margin: '0 auto' }}>
          <button 
            onClick={() => setActiveTab('home')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px', padding: '10px 18px', borderRadius: '8px', backgroundColor: '#27272a', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
          >
            العودة للرئيسية
          </button>

          <div style={{ backgroundColor: '#18181b', borderRadius: '12px', padding: '20px', border: '1px solid #27272a' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, color: '#f97316', fontSize: '24px' }}>{selectedMedia.title || selectedMedia.name}</h2>
                <p style={{ margin: '6px 0 0 0', color: '#a1a1aa', fontSize: '14px' }}>
                  {(selectedMedia.release_date || selectedMedia.first_air_date || '').slice(0, 4)} | {selectedMedia.vote_average?.toFixed(1)}
                </p>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                
                {/* قائمة المواسم والحلقات الديناميكية للمسلسلات فقط */}
                {(selectedMedia.media_type === 'tv' || selectedMedia.first_air_date || activeTab === 'tv') && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: '#09090b', padding: '8px 14px', borderRadius: '8px', border: '1px solid #27272a' }}>
                    
                    {/* اختيار الموسم */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px', color: '#f97316', fontWeight: 'bold' }}>الموسم:</span>
                      <select 
                        value={season} 
                        onChange={(e) => handleSeasonChange(Number(e.target.value))}
                        style={{ backgroundColor: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px', padding: '4px 8px', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                      >
                        {availableSeasons.map(s => (
                          <option key={s} value={s}>الموسم {s}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ width: '1px', height: '18px', backgroundColor: '#27272a' }}></div>

                    {/* اختيار الحلقة */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px', color: '#f97316', fontWeight: 'bold' }}>الحلقة:</span>
                      <select 
                        value={episode} 
                        onChange={(e) => setEpisode(Number(e.target.value))}
                        style={{ backgroundColor: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px', padding: '4px 8px', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                      >
                        {availableEpisodes.map(ep => (
                          <option key={ep} value={ep}>الحلقة {ep}</option>
                        ))}
                      </select>
                    </div>

                  </div>
                )}

                {/* أزرار السيرفرات */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setActiveServer('vidsrc.to')} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'vidsrc.to' ? '#f97316' : '#27272a', color: activeServer === 'vidsrc.to' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '13px' }}>سيرفر 1</button>
                  <button onClick={() => setActiveServer('vidsrc.me')} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'vidsrc.me' ? '#f97316' : '#27272a', color: activeServer === 'vidsrc.me' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '13px' }}>سيرفر 2</button>
                  <button onClick={() => setActiveServer('embed.su')} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'embed.su' ? '#f97316' : '#27272a', color: activeServer === 'embed.su' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '13px' }}>سيرفر 3</button>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', backgroundColor: '#000', borderRadius: '10px', overflow: 'hidden', border: '1px solid #27272a' }}>
              <iframe src={getEmbedUrl()} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen referrerPolicy="origin"></iframe>
            </div>

            {/* قصة العمل باللغة العربية */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #27272a' }}>
              <h3 style={{ fontSize: '16px', color: '#f97316', margin: '0 0 8px 0' }}>قصة العمل</h3>
              <p style={{ fontSize: '14px', color: '#d4d4d8', lineHeight: '1.7', margin: 0 }}>
                {arabicOverview}
              </p>
            </div>
          </div>
        </div>
      ) : searchResults ? (
        /* 3. نتائج البحث */
        <div style={{ padding: '20px 24px' }}>
          <h2 style={{ fontSize: '20px', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '20px' }}>نتائج البحث</h2>
          <MediaGrid items={searchResults} onSelect={openWatchPage} />
        </div>
      ) : activeTab === 'movies' || activeTab === 'tv' ? (
        /* 4. المكتبة الشاملة */
        <div style={{ padding: '20px 24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '12px', marginBottom: '20px' }}>
            {activeTab === 'movies' ? 'Movies Library' : 'TV Shows Library'}
          </h2>

          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
            {genres.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '20px',
                  border: '1px solid #3f3f46',
                  backgroundColor: selectedGenre === g.id ? '#f97316' : '#18181b',
                  color: selectedGenre === g.id ? '#000' : '#fff',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {g.name}
              </button>
            ))}
          </div>

          <MediaGrid items={pageData} onSelect={openWatchPage} />
          
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
        /* 5. الصفحة الرئيسية المليئة بالقوائم المتعددة لكل التصنيفات */
        <>
          {heroItem && (
            <div className="hero-banner" style={{ position: 'relative', width: '100%', backgroundImage: `linear-gradient(to top, #09090b 10%, transparent 90%), url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '24px', transition: 'background-image 0.8s ease-in-out' }}>
              <div style={{ maxWidth: '650px', zIndex: 2 }}>
                <span style={{ backgroundColor: '#f97316', color: '#000', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase' }}>Trending</span>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{heroItem.title || heroItem.name}</h1>
                <p style={{ color: '#d4d4d8', fontSize: '13px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>{heroItem.overview}</p>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button onClick={() => openWatchPage(heroItem)} style={{ padding: '10px 22px', backgroundColor: '#f97316', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
                    Watch Now
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
                <button onClick={() => { setActiveTab('movies'); setSelectedGenre('27'); }} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  عرض المزيد
                </button>
              </div>
              <MediaGrid items={horrorData} onSelect={openWatchPage} />
            </section>

            {/* قائمة أفلام ومسلسلات الأكشن */}
            <section style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أفلام ومسلسلات الأكشن</h2>
                <button onClick={() => { setActiveTab('movies'); setSelectedGenre('28'); }} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  عرض المزيد
                </button>
              </div>
              <MediaGrid items={actionData} onSelect={openWatchPage} />
            </section>

            {/* قائمة أفلام ومسلسلات الدراما */}
            <section style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أفلام ومسلسلات الدراما</h2>
                <button onClick={() => { setActiveTab('movies'); setSelectedGenre('18'); }} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  عرض المزيد
                </button>
              </div>
              <MediaGrid items={dramaData} onSelect={openWatchPage} />
            </section>

            {/* قائمة أفلام ومسلسلات الخيال العلمي */}
            <section style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أفلام ومسلسلات الخيال العلمي</h2>
                <button onClick={() => { setActiveTab('movies'); setSelectedGenre('878'); }} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  عرض المزيد
                </button>
              </div>
              <MediaGrid items={scifiData} onSelect={openWatchPage} />
            </section>

            {/* قائمة أفلام ومسلسلات الكوميديا */}
            <section style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أفلام ومسلسلات الكوميديا</h2>
                <button onClick={() => { setActiveTab('movies'); setSelectedGenre('35'); }} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  عرض المزيد
                </button>
              </div>
              <MediaGrid items={comedyData} onSelect={openWatchPage} />
            </section>

            {/* قائمة أفلام ومسلسلات الغموض والجريمة */}
            <section style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أفلام ومسلسلات الغموض والجريمة</h2>
                <button onClick={() => { setActiveTab('movies'); setSelectedGenre('9648'); }} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  عرض المزيد
                </button>
              </div>
              <MediaGrid items={mysteryData} onSelect={openWatchPage} />
            </section>

            {/* قائمة أفلام ومسلسلات الرومانسية */}
            <section style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أفلام ومسلسلات الرومانسية</h2>
                <button onClick={() => { setActiveTab('movies'); setSelectedGenre('10749'); }} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  عرض المزيد
                </button>
              </div>
              <MediaGrid items={romanceData} onSelect={openWatchPage} />
            </section>

            {/* قائمة أفلام ومسلسلات المغامرة */}
            <section style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>أفلام ومسلسلات المغامرة والعائلية</h2>
                <button onClick={() => { setActiveTab('movies'); setSelectedGenre('12'); }} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  عرض المزيد
                </button>
              </div>
              <MediaGrid items={adventureData} onSelect={openWatchPage} />
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

// مكون الشبكة العارضة للبطاقات
function MediaGrid({ items, onSelect }) {
  return (
    <div className="media-grid">
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
                className="poster-img"
                style={{ width: '100%', objectFit: 'cover', display: 'block' }}
              />
              <span style={{ position: 'absolute', top: '6px', left: '6px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#fbbf24', fontSize: '10px', fontWeight: 'bold', padding: '2px 5px', borderRadius: '3px' }}>
                {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
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
