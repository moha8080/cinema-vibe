import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import MediaGrid from '../components/MediaGrid';
import WatchView from '../components/WatchView';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);

  const [horrorData, setHorrorData] = useState([]);
  const [dramaData, setDramaData] = useState([]);
  const [actionData, setActionData] = useState([]);
  const [comedyData, setComedyData] = useState([]);
  const [scifiData, setSciFiData] = useState([]);
  const [mysteryData, setMysteryData] = useState([]);
  const [romanceData, setRomanceData] = useState([]);
  const [adventureData, setAdventureData] = useState([]);
  
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [pageData, setPageData] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [arabicOverview, setArabicOverview] = useState('جاري تحميل القصة...');
  const [activeServer, setActiveServer] = useState('vidsrc.to');
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [availableSeasons, setAvailableSeasons] = useState([]);
  const [availableEpisodes, setAvailableEpisodes] = useState([]);

  const [heroIndex, setHeroIndex] = useState(0);

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

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
        setAvailableSeasons(Array.from({ length: totalSeasons }, (_, i) => i + 1));

        if (tvData.overview && tvData.overview.trim() !== '') {
          setArabicOverview(tvData.overview);
        } else {
          setArabicOverview('لا تتوفر قصة حالياً لهذا العمل.');
        }

        fetchEpisodeCount(item.id, 1, apiKey);
      } catch (e) {
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
          setArabicOverview('لا تتوفر قصة حالياً لهذا العمل  .');
        }
      } catch (e) {
        setArabicOverview('لا تتوفر قصة مترجمة حالياً لهذا العمل.');
      }
    }
  };

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

  const handleSeasonChange = (newSeason) => {
    setSeason(newSeason);
    setEpisode(1);
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (selectedMedia) {
      fetchEpisodeCount(selectedMedia.id, newSeason, apiKey);
    }
  };

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

  useEffect(() => {
    if (trending.length === 0 || activeTab !== 'home') return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % trending.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [trending, activeTab]);

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

  const getEmbedUrl = () => {
    if (!selectedMedia) return '';
    const isTv = selectedMedia.media_type === 'tv' || selectedMedia.first_air_date || activeTab === 'tv';
    const id = selectedMedia.id;

    if (isTv) {
      if (activeServer === 'vidsrc.to') return `https://vidsrc.to/embed/tv/${id}/${season}/${episode}?sub.lang=ar&ds_lang=ar&auto_play=1`;
      if (activeServer === 'vidsrc.me') return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}&sub.lang=ar&ds_lang=ar`;
      if (activeServer === 'embed.su') return `https://embed.su/embed/tv/${id}/${season}/${episode}?sub.lang=ar`;
    } else {
      if (activeServer === 'vidsrc.to') return `https://vidsrc.to/embed/movie/${id}?sub.lang=ar&ds_lang=ar&auto_play=1`;
      if (activeServer === 'vidsrc.me') return `https://vidsrc.me/embed/movie?tmdb=${id}&sub.lang=ar&ds_lang=ar`;
      if (activeServer === 'embed.su') return `https://embed.su/embed/movie/${id}?sub.lang=ar`;
    }
    return `https://vidsrc.to/embed/movie/${id}?sub.lang=ar&ds_lang=ar`;
  };

  const heroItem = trending[heroIndex];

  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      <Head>
        <title>سينما فايب | Cinema Vibe - مشاهدة أفلام ومسلسلات مترجمة</title>
        <meta name="description" content="منصة سينما فايب لمشاهدة وتحميل أحدث الأفلام والمسلسلات العالمية المترجمة بجودة عالية مجاناً." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <style jsx global>{`
        html, body {
          margin: 0; padding: 0; background-color: #09090b; overflow-x: hidden;
        }
        * { box-sizing: border-box; }
        .media-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(135px, 1fr)); gap: 14px;
        }
        .poster-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .poster-card:hover {
          transform: translateY(-6px); box-shadow: 0 10px 20px rgba(249, 115, 22, 0.2); border-color: #f97316 !important;
        }
        .poster-img { height: 200px; }
        .hero-banner { height: 380px; }
        @media (min-width: 768px) {
          .media-grid { grid-template-columns: repeat(auto-fill, minmax(185px, 1fr)); gap: 22px; }
          .poster-img { height: 280px; }
          .hero-banner { height: 500px; }
        }
      `}</style>

      {/* استدعاء شريط التنقل */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setSelectedGenre={setSelectedGenre} 
        setShowSearchModal={setShowSearchModal} 
        showSearchModal={showSearchModal} 
      />

      {showSearchModal && (
        <div style={{ padding: '20px 28px', backgroundColor: '#121215', borderBottom: '1px solid #27272a' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', maxWidth: '650px', margin: '0 auto' }}>
            <input
              type="text"
              placeholder="ابحث عن فيلم أو مسلسل مفضل لديك..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{ flex: 1, padding: '14px 18px', borderRadius: '10px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '14px 28px', borderRadius: '10px', border: 'none', backgroundColor: '#f97316', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
              بحث
            </button>
          </form>
        </div>
      )}

      {/* استدعاء صفحة المشاهدة */}
      {activeTab === 'watch' && selectedMedia ? (
        <WatchView 
          selectedMedia={selectedMedia}
          activeTab={activeTab}
          season={season}
          episode={episode}
          availableSeasons={availableSeasons}
          availableEpisodes={availableEpisodes}
          handleSeasonChange={handleSeasonChange}
          setEpisode={setEpisode}
          activeServer={activeServer}
          setActiveServer={setActiveServer}
          arabicOverview={arabicOverview}
          getEmbedUrl={getEmbedUrl}
          setActiveTab={setActiveTab}
        />
      ) : searchResults ? (
        <div style={{ padding: '24px 28px' }}>
          <h2 style={{ fontSize: '20px', borderRight: '4px solid #f97316', paddingRight: '12px', marginBottom: '24px', fontWeight: '800' }}>نتائج البحث</h2>
          <MediaGrid items={searchResults} onSelect={openWatchPage} />
        </div>
      ) : activeTab === 'movies' || activeTab === 'tv' ? (
        <div style={{ padding: '24px 28px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', borderRight: '4px solid #f97316', paddingRight: '14px', marginBottom: '22px' }}>
            {activeTab === 'movies' ? 'مكتبة الأفلام الشاملة' : 'مكتبة المسلسلات الشاملة'}
          </h2>

          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '14px', marginBottom: '28px' }}>
            {genres.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                style={{
                  padding: '9px 20px', borderRadius: '25px', border: '1px solid #3f3f46',
                  backgroundColor: selectedGenre === g.id ? '#f97316' : '#121215',
                  color: selectedGenre === g.id ? '#000' : '#fff',
                  fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                {g.name}
              </button>
            ))}
          </div>

          <MediaGrid items={pageData} onSelect={openWatchPage} />
          
          <div style={{ textAlign: 'center', marginTop: '35px' }}>
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              style={{
                padding: '12px 35px', backgroundColor: '#f97316', color: '#000', border: 'none',
                borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', opacity: isLoadingMore ? 0.6 : 1
              }}
            >
              {isLoadingMore ? 'جاري التحميل...' : 'عرض المزيد من الأعمال'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {heroItem && (
            <div className="hero-banner" style={{ position: 'relative', width: '100%', backgroundImage: `linear-gradient(to top, #09090b 10%, rgba(9,9,11,0.5) 60%, rgba(9,9,11,0.2) 100%), url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '28px' }}>
              <div style={{ maxWidth: '650px', zIndex: 2 }}>
                <span style={{ backgroundColor: '#f97316', color: '#000', padding: '5px 10px', borderRadius: '6px', fontWeight: '900', fontSize: '11px' }}>الأكثر رواجاً</span>
                <h1 style={{ fontSize: '32px', fontWeight: '900', margin: '12px 0' }}>{heroItem.title || heroItem.name}</h1>
                <p style={{ color: '#d4d4d8', fontSize: '14px', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>{heroItem.overview}</p>
                <div style={{ marginTop: '18px' }}>
                  <button onClick={() => openWatchPage(heroItem)} style={{ padding: '12px 26px', backgroundColor: '#f97316', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
                    مشاهدة الآن
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ padding: '24px 28px' }}>
            <section style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', borderRight: '4px solid #f97316', paddingRight: '12px', margin: 0 }}>أفضل الأفلام تقييماً</h2>
                <button onClick={() => setActiveTab('movies')} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>عرض الكل</button>
              </div>
              <MediaGrid items={topMovies} onSelect={openWatchPage} />
            </section>

            <section style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', borderRight: '4px solid #f97316', paddingRight: '12px', margin: 0 }}>المسلسلات الأكثر مشاهدة</h2>
                <button onClick={() => setActiveTab('tv')} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>عرض الكل</button>
              </div>
              <MediaGrid items={popularTv} onSelect={openWatchPage} />
            </section>

            <section style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', borderRight: '4px solid #f97316', paddingRight: '12px', margin: 0 }}>أفلام ومسلسلات الرعب</h2>
                <button onClick={() => { setActiveTab('movies'); setSelectedGenre('27'); }} style={{ backgroundColor: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>عرض الكل</button>
              </div>
              <MediaGrid items={horrorData} onSelect={openWatchPage} />
            </section>
          </div>
        </>
      )}

      <footer style={{ borderTop: '1px solid #27272a', padding: '24px', textAlign: 'center', color: '#71717a', fontSize: '13px', backgroundColor: '#121215' }}>
        © 2026 CINEMA VIBE - All rights reserved
     {/* Footer */}
<footer style={{ borderTop: '1px solid #27272a', padding: '24px 20px', textAlign: 'center', backgroundColor: '#09090b', color: '#71717a', fontSize: '13px', marginTop: '40px' }}>
  <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
    <p style={{ margin: 0 }}>جميع الحقوق محفوظة © 2026 CINEMA VIBE</p>
    <div style={{ display: 'flex', gap: '20px' }}>
      <a href="/privacy" style={{ color: '#f97316', textDecoration: 'none', fontWeight: 'bold' }}>سياسة الخصوصية</a>
      <a href="/contact" style={{ color: '#f97316', textDecoration: 'none', fontWeight: 'bold' }}>اتصل بنا / اطلب فيلم</a>
    </div>
  </div>
</footer>
