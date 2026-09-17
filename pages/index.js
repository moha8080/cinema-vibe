import { useState, useEffect, useRef } from 'react';
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
  
  const [selectedServer, setSelectedServer] = useState('vidsrc-cc');

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [tvDetails, setTvDetails] = useState(null);
  const [episodesList, setEpisodesList] = useState([]);

  // القوائم المدمجة
  const [topRatedMixed, setTopRatedMixed] = useState([]);
  const [actionMixed, setActionMixed] = useState([]);
  const [horrorThrillerMixed, setHorrorThrillerMixed] = useState([]);
  const [sciFiAdventureMixed, setSciFiAdventureMixed] = useState([]);
  const [dramaMixed, setDramaMixed] = useState([]);
  const [mysteryMixed, setMysteryMixed] = useState([]);
  const [comedyMixed, setComedyMixed] = useState([]);
  const [suspenseMixed, setSuspenseMixed] = useState([]);
  const [oscarsMixed, setOscarsMixed] = useState([]);
  const [thisMonthMixed, setThisMonthMixed] = useState([]);

  // حالات صفحة الكتالوج والصفحات الإضافية
  const [catalogTitle, setCatalogTitle] = useState('');
  const [catalogItems, setCatalogItems] = useState([]);
  const [catalogEndpoint, setCatalogEndpoint] = useState('');
  const [catalogGenre, setCatalogGenre] = useState('');
  const [catalogPage, setCatalogPage] = useState(1);
  const [hasMoreCatalog, setHasMoreCatalog] = useState(true);

  // مراجع لتحريك الصفوف أفقياً تلقائياً كل 5 ثوانٍ
  const rowRefs = {
    thisMonth: useRef(null),
    oscars: useRef(null),
    topRated: useRef(null),
    drama: useRef(null),
    mystery: useRef(null),
    comedy: useRef(null),
    suspense: useRef(null),
    action: useRef(null),
    horror: useRef(null),
    scifi: useRef(null),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendRes = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&language=en-US`);
        const trendData = await trendRes.json();
        setTrending(trendData.results || []);

        const fetchMixedCategory = async (movieGenre, tvGenre, setter) => {
          const [movieRes, tvRes] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${movieGenre}&language=en-US&sort_by=vote_average.desc&vote_count.gte=300`),
            fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${tvGenre}&language=en-US&sort_by=vote_average.desc&vote_count.gte=150`)
          ]);
          const movieData = await movieRes.json();
          const tvData = await tvRes.json();
          
          const combined = [...(movieData.results || []), ...(tvData.results || [])];
          setter(combined.sort(() => 0.5 - Math.random()));
        };

        const topMovieRes = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US`);
        const topTvRes = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=en-US`);
        const topMovieData = await topMovieRes.json();
        const topTvData = await topTvRes.json();
        setTopRatedMixed([...(topMovieData.results || []), ...(topTvData.results || [])].sort(() => 0.5 - Math.random()));

        fetchMixedCategory('28', '10759', setActionMixed);
        fetchMixedCategory('27', '10765', setHorrorThrillerMixed);
        fetchMixedCategory('12,878', '10765', setSciFiAdventureMixed);
        fetchMixedCategory('18', '18', setDramaMixed);
        fetchMixedCategory('9648', '9648', setMysteryMixed);
        fetchMixedCategory('35', '35', setComedyMixed);
        fetchMixedCategory('53', '10768', setSuspenseMixed);
        fetchMixedCategory('18,36', '18', setOscarsMixed);
        
        const monthMovieRes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&primary_release_date.gte=2026-01-01`);
        const monthTvRes = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&first_air_date.gte=2026-01-01`);
        const monthMovieData = await monthMovieRes.json();
        const monthTvData = await monthTvRes.json();
        setThisMonthMixed([...(monthMovieData.results || []), ...(monthTvData.results || [])].sort(() => 0.5 - Math.random()));

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // تمرير تلقائي للصفوف الأفقية كل 5 ثوانٍ
  useEffect(() => {
    const interval = setInterval(() => {
      Object.values(rowRefs).forEach((ref) => {
        if (ref.current) {
          const { scrollLeft, scrollWidth, clientWidth } = ref.current;
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            ref.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            ref.current.scrollBy({ left: 300, behavior: 'smooth' });
          }
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTvSeasonsAndEpisodes = async () => {
      if (!selectedMedia || (!selectedMedia.first_air_date && selectedMedia.media_type !== 'tv')) return;
      try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${selectedMedia.id}?api_key=${API_KEY}&language=en-US`);
        const data = await res.json();
        setTvDetails(data);

        const seasonRes = await fetch(`https://api.themoviedb.org/3/tv/${selectedMedia.id}/season/${selectedSeason}?api_key=${API_KEY}&language=en-US`);
        const seasonData = await seasonRes.json();
        if (seasonData.episodes && seasonData.episodes.length > 0) {
          setEpisodesList(seasonData.episodes);
        } else {
          setEpisodesList(Array.from({ length: 20 }, (_, i) => ({ episode_number: i + 1, name: `Episode ${i + 1}` })));
        }
      } catch (err) {
        console.error('Error fetching TV details:', err);
      }
    };

    fetchTvSeasonsAndEpisodes();
  }, [selectedMedia, selectedSeason]);

  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(trending.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [trending]);

  const openCatalog = async (endpointType, genreId, title) => {
    setCatalogTitle(title);
    setCatalogEndpoint(endpointType);
    setCatalogGenre(genreId);
    setCatalogPage(1);
    setActiveTab('catalog');
    try {
      let url = `https://api.themoviedb.org/3/discover/${endpointType}?api_key=${API_KEY}&language=en-US&page=1`;
      if (genreId && genreId !== '0') {
        url += `&with_genres=${genreId}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setCatalogItems(data.results || []);
      setHasMoreCatalog(data.page < data.total_pages);
    } catch (err) {
      console.error('Error fetching catalog:', err);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadMoreCatalogItems = async () => {
    const nextPage = catalogPage + 1;
    try {
      let url = `https://api.themoviedb.org/3/discover/${catalogEndpoint}?api_key=${API_KEY}&language=en-US&page=${nextPage}`;
      if (catalogGenre && catalogGenre !== '0') {
        url += `&with_genres=${catalogGenre}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setCatalogItems(prev => [...prev, ...(data.results || [])]);
      setCatalogPage(nextPage);
      setHasMoreCatalog(nextPage < data.total_pages);
    } catch (err) {
      console.error('Error loading more catalog items:', err);
    }
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

  const openWatchPage = async (item) => {
    setSelectedMedia(item);
    setSelectedSeason(1);
    setSelectedEpisode(1);
    setSelectedServer('vidsrc-cc');
    setActiveTab('watch');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const res = await fetch(`https://api.themoviedb.org/3/${item.media_type || (item.first_air_date ? 'tv' : 'movie')}/${item.id}?api_key=${API_KEY}&language=ar-SA`);
      const data = await res.json();
      if (data.overview) {
        setSelectedMedia(prev => ({ ...prev, overview: data.overview }));
      }
    } catch (err) {
      console.error('Error fetching arabic overview:', err);
    }
  };

  const heroItem = trending[heroIndex];

  const getEmbedUrl = (media, server) => {
    if (!media) return '';
    const isTv = media.media_type === 'tv' || media.first_air_date;
    const id = media.id;

    switch (server) {
      case 'vidsrc-cc':
        return isTv ? `https://vidsrc.cc/v2/embed/tv/${id}/${selectedSeason}/${selectedEpisode}?sub.lang=ar` : `https://vidsrc.cc/v2/embed/movie/${id}?sub.lang=ar`;
      case 'vidsrc-icu':
        return isTv ? `https://vidsrc.icu/embed/tv/${id}/${selectedSeason}/${selectedEpisode}?sub.lang=ar` : `https://vidsrc.icu/embed/movie/${id}?sub.lang=ar`;
      case 'multiembed':
        return `https://multiembed.mov/?video_id=${id}&tmdb=1${isTv ? `&s=${selectedSeason}&e=${selectedEpisode}` : ''}&sub.lang=ar`;
      case 'player-vid':
        return isTv ? `https://vidsrc.vip/embed/tv/${id}/${selectedSeason}/${selectedEpisode}?sub.lang=ar` : `https://vidsrc.vip/embed/movie/${id}?sub.lang=ar`;
      default:
        return isTv ? `https://vidsrc.cc/v2/embed/tv/${id}/${selectedSeason}/${selectedEpisode}?sub.lang=ar` : `https://vidsrc.cc/v2/embed/movie/${id}?sub.lang=ar`;
    }
  };

  const serversList = [
    { id: 'vidsrc-cc', name: 'سيرفر فايبر الأساسي' },
    { id: 'vidsrc-icu', name: 'سيرفر سينما برو' },
    { id: 'multiembed', name: 'سيرفر متعدد المصادر' },
    { id: 'player-vid', name: 'سيرفر البديل السريع' }
  ];

  const HorizontalRow = ({ title, items, rowRef, onSeeMore }) => {
    if (!items || items.length === 0) return null;

    return (
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingRight: '4px', paddingLeft: '4px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', borderRight: '3px solid #f97316', paddingRight: '8px', margin: 0, color: '#fff' }}>
            {title}
          </h2>
          <button 
            onClick={onSeeMore} 
            style={{ 
              backgroundColor: 'rgba(249, 115, 22, 0.1)', 
              border: '1px solid #f97316', 
              color: '#f97316', 
              fontSize: '12px', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              padding: '6px 14px',
              borderRadius: '6px',
              transition: 'all 0.2s'
            }}
          >
            عرض المزيد
          </button>
        </div>

        <div 
          ref={rowRef}
          style={{ 
            display: 'flex', 
            gap: '14px', 
            overflowX: 'auto', 
            scrollBehavior: 'smooth', 
            paddingBottom: '8px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          className="no-scrollbar"
        >
          {items.map((item) => {
            const itemTitle = item.title || item.name;
            const posterPath = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
            const year = (item.release_date || item.first_air_date || '').slice(0, 4);
            const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
            const isTvShow = item.media_type === 'tv' || item.first_air_date;

            return (
              <div 
                key={item.id} 
                onClick={() => openWatchPage(item)}
                style={{ 
                  minWidth: '135px', 
                  maxWidth: '135px',
                  backgroundColor: '#121215', 
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  cursor: 'pointer', 
                  border: '1px solid #27272a',
                  flexShrink: '0',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '190px' }}>
                  <img src={posterPath} alt={itemTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  <span style={{ position: 'absolute', top: '6px', left: '6px', backgroundColor: 'rgba(0, 0, 0, 0.75)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ color: '#eab308' }}>★</span> {rating}
                  </span>
                </div>
                <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', direction: 'ltr', textAlign: 'left' }}>
                    {itemTitle}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#a1a1aa' }}>
                    <span>{year}</span>
                    <span style={{ color: '#f97316', fontWeight: 'bold' }}>{isTvShow ? 'مسلسل' : 'فيلم'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const MediaGrid = ({ items, onSelect }) => {
    if (!items || items.length === 0) {
      return <p style={{ color: '#a1a1aa', textAlign: 'center', padding: '20px' }}>لا توجد عناوين متاحة حالياً...</p>;
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '14px' }}>
        {items.map((item) => {
          const title = item.title || item.name;
          const posterPath = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
          const year = (item.release_date || item.first_air_date || '').slice(0, 4);
          const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
          const isTvShow = item.media_type === 'tv' || item.first_air_date;

          return (
            <div 
              key={item.id} 
              onClick={() => onSelect(item)}
              style={{ backgroundColor: '#121215', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #27272a', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                <img src={posterPath} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(0, 0, 0, 0.75)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span style={{ color: '#eab308' }}>★</span> {rating}
                </span>
              </div>
              <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', direction: 'ltr', textAlign: 'left' }}>
                  {title}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#a1a1aa' }}>
                  <span>{year}</span>
                  <span style={{ color: '#f97316', fontWeight: 'bold' }}>{isTvShow ? 'مسلسل' : 'فيلم'}</span>
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

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
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '38px', height: '38px', minWidth: '38px', color: '#f97316', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
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
          <button onClick={() => setActiveTab('home')} style={{ marginBottom: '20px', backgroundColor: '#27272a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>العودة للرئيسية</button>
          
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f97316', marginBottom: '16px', direction: 'ltr', textAlign: 'left' }}>
            {selectedMedia.title || selectedMedia.name}
          </h2>

          {(selectedMedia.media_type === 'tv' || selectedMedia.first_air_date) && (
            <div style={{ display: 'flex', gap: '15px', marginBottom: '16px', backgroundColor: '#121215', padding: '14px 18px', borderRadius: '10px', border: '1px solid #27272a', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: '#f97316', fontWeight: 'bold' }}>اختر الموسم والحلقة:</span>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <label style={{ fontSize: '12px', color: '#a1a1aa' }}>الموسم:</label>
                <select 
                  value={selectedSeason} 
                  onChange={(e) => {
                    setSelectedSeason(Number(e.target.value));
                    setSelectedEpisode(1);
                  }} 
                  style={{ padding: '8px 12px', backgroundColor: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', outline: 'none' }}
                >
                  {tvDetails && tvDetails.seasons ? (
                    tvDetails.seasons.map(season => (
                      <option key={season.id} value={season.season_number}>
                        {season.name || `Season ${season.season_number}`}
                      </option>
                    ))
                  ) : (
                    [1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Season {s}</option>)
                  )}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <label style={{ fontSize: '12px', color: '#a1a1aa' }}>الحلقة:</label>
                <select 
                  value={selectedEpisode} 
                  onChange={(e) => setSelectedEpisode(Number(e.target.value))} 
                  style={{ padding: '8px 12px', backgroundColor: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', outline: 'none' }}
                >
                  {episodesList.map(ep => (
                    <option key={ep.id || ep.episode_number} value={ep.episode_number}>
                      Episode {ep.episode_number} {ep.name && ep.name !== `Episode ${ep.episode_number}` ? `- ${ep.name}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div style={{ marginBottom: '16px', backgroundColor: '#121215', padding: '14px 18px', borderRadius: '10px', border: '1px solid #27272a' }}>
            <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>اختر سيرفر التشغيل عالي الدقة:</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                    color: selectedServer === srv.id ? '#000' : '#fff',
                  }}
                >
                  {srv.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #27272a' }}>
            <iframe src={getEmbedUrl(selectedMedia, selectedServer)} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen title="مشغل الفيديو" />
          </div>

          <div style={{ marginTop: '20px', backgroundColor: '#121215', padding: '18px', borderRadius: '10px', border: '1px solid #27272a' }}>
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
          <h2 style={{ fontSize: '22px', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>قسم الأفلام الشاملة</h2>
          
          <section>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}>أفلام الأكشن والمغامرة</h3>
            <MediaGrid items={actionMixed.filter(item => item.media_type === 'movie' || !item.first_air_date)} onSelect={openWatchPage} />
          </section>

          <section>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}>أفلام الدراما</h3>
            <MediaGrid items={dramaMixed.filter(item => item.media_type === 'movie' || !item.first_air_date)} onSelect={openWatchPage} />
          </section>

          <section>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}>أفلام الكوميديا</h3>
            <MediaGrid items={comedyMixed.filter(item => item.media_type === 'movie' || !item.first_air_date)} onSelect={openWatchPage} />
          </section>
        </div>
      ) : activeTab === 'tv-hub' ? (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <h2 style={{ fontSize: '22px', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>قسم المسلسلات الشاملة</h2>

          <section>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}>مسلسلات الدراما</h3>
            <MediaGrid items={dramaMixed.filter(item => item.media_type === 'tv' || item.first_air_date)} onSelect={openWatchPage} />
          </section>

          <section>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}>مسلسلات التشويق والإثارة</h3>
            <MediaGrid items={suspenseMixed.filter(item => item.media_type === 'tv' || item.first_air_date)} onSelect={openWatchPage} />
          </section>
        </div>
      ) : activeTab === 'catalog' ? (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={() => setActiveTab('home')} style={{ marginBottom: '20px', backgroundColor: '#27272a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>العودة للرئيسية</button>
          
          <h2 style={{ fontSize: '22px', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '20px', color: '#fff' }}>
            {catalogTitle}
          </h2>

          <MediaGrid items={catalogItems} onSelect={openWatchPage} />

          {hasMoreCatalog && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '35px', marginBottom: '20px' }}>
              <button 
                onClick={loadMoreCatalogItems}
                style={{ 
                  backgroundColor: '#f97316', 
                  color: '#000', 
                  border: 'none', 
                  padding: '12px 32px', 
                  borderRadius: '8px', 
                  fontWeight: 'bold', 
                  fontSize: '15px', 
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                عرض المزيد من النتائج
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {heroItem && (
            <div style={{ position: 'relative', width: '100%', height: '400px', backgroundImage: `linear-gradient(to top, #09090b 10%, transparent 90%), url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '24px' }}>
              <div style={{ maxWidth: '650px', zIndex: 2 }}>
                <span style={{ backgroundColor: '#f97316', color: '#000', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px' }}>رائج الآن</span>
                <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '10px 0', color: '#fff', direction: 'ltr', textAlign: 'left' }}>
                  {heroItem.title || heroItem.name}
                </h1>
                <p style={{ color: '#d4d4d8', fontSize: '13px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>{heroItem.overview}</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button onClick={() => openWatchPage(heroItem)} style={{ padding: '10px 22px', backgroundColor: '#f97316', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>شاهد الآن</button>
                </div>
              </div>
            </div>
          )}

          {/* القوائم الأفقية المتسلسلة والمتحركة تلقائياً، مع زر "عرض المزيد" لكل قائمة */}
          <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            <HorizontalRow 
              title="أفضل الأفلام والمسلسلات هذا الشهر" 
              items={thisMonthMixed} 
              rowRef={rowRefs.thisMonth} 
              onSeeMore={() => openCatalog('movie', '0', 'أفضل الأفلام والمسلسلات هذا الشهر')} 
            />

            <HorizontalRow 
              title="أعمال حاصلة على أوسكار" 
              items={oscarsMixed} 
              rowRef={rowRefs.oscars} 
              onSeeMore={() => openCatalog('movie', '18,36', 'أعمال حاصلة على أوسكار')} 
            />

            <HorizontalRow 
              title="أفضل الأعمال تقييماً" 
              items={topRatedMixed} 
              rowRef={rowRefs.topRated} 
              onSeeMore={() => openCatalog('movie', '0', 'أفضل الأعمال تقييماً')} 
            />

            <HorizontalRow 
              title="قائمة الدراما" 
              items={dramaMixed} 
              rowRef={rowRefs.drama} 
              onSeeMore={() => openCatalog('movie', '18', 'قائمة الدراما')} 
            />

            <HorizontalRow 
              title="قائمة الغموض" 
              items={mysteryMixed} 
              rowRef={rowRefs.mystery} 
              onSeeMore={() => openCatalog('movie', '9648', 'قائمة الغموض')} 
            />

            <HorizontalRow 
              title="قائمة الكوميديا" 
              items={comedyMixed} 
              rowRef={rowRefs.comedy} 
              onSeeMore={() => openCatalog('movie', '35', 'قائمة الكوميديا')} 
            />

            <HorizontalRow 
              title="قائمة التشويق والإثارة" 
              items={suspenseMixed} 
              rowRef={rowRefs.suspense} 
              onSeeMore={() => openCatalog('movie', '53', 'قائمة التشويق والإثارة')} 
            />

            <HorizontalRow 
              title="الأكشن والمغامرة" 
              items={actionMixed} 
              rowRef={rowRefs.action} 
              onSeeMore={() => openCatalog('movie', '28', 'الأكشن والمغامرة')} 
            />

            <HorizontalRow 
              title="أفلام ومسلسلات الرعب والإثارة" 
              items={horrorThrillerMixed} 
              rowRef={rowRefs.horror} 
              onSeeMore={() => openCatalog('movie', '27', 'أفلام ومسلسلات الرعب والإثارة')} 
            />

            <HorizontalRow 
              title="الخيال العلمي والفانتازيا" 
              items={sciFiAdventureMixed} 
              rowRef={rowRefs.scifi} 
              onSeeMore={() => openCatalog('movie', '12,878', 'الخيال العلمي والفانتازيا')} 
            />

          </div>
        </>
      )}

      <footer style={{ backgroundColor: '#121215', borderTop: '1px solid #27272a', padding: '24px', textAlign: 'center', color: '#a1a1aa', fontSize: '14px', marginTop: '40px' }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#f97316' }}>CINEMA VIBE</p>
        <p style={{ margin: 0 }}>جميع الحقوق محفوظة 2026</p>
      </footer>
    </div>
  );
}
