import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';

// قائمة التصنيفات الشاملة (أكثر من 10 تصنيفات مع معرفات TMDB المقابلة للأفلام والمسلسلات)
const GENRES = [
  { id: 'all', name: 'الكل / الشائع', movieGenre: '0', tvGenre: '0' },
  { id: 'action', name: 'أكشن ومغامرة', movieGenre: '28', tvGenre: '10759' },
  { id: 'drama', name: 'دراما مؤثرة', movieGenre: '18', tvGenre: '18' },
  { id: 'horror', name: 'رعب وإثارة', movieGenre: '27', tvGenre: '10765' },
  { id: 'comedy', name: 'كوميديا وضاحكة', movieGenre: '35', tvGenre: '35' },
  { id: 'scifi', name: 'خيال علمي وفضاء', movieGenre: '878', tvGenre: '10765' },
  { id: 'crime', name: 'جريمة وتصحيح', movieGenre: '80', tvGenre: '80' },
  { id: 'mystery', name: 'غموض وتحقيق', movieGenre: '9648', tvGenre: '9648' },
  { id: 'romance', name: 'رومانسية وعاطفة', movieGenre: '10749', tvGenre: '18' },
  { id: 'animation', name: 'رسوم متحركة / أنمي', movieGenre: '16', tvGenre: '16' },
  { id: 'documentary', name: 'وثائقي ومعرفي', movieGenre: '99', tvGenre: '99' },
  { id: 'family', name: 'عائلي ومغامرات أطفال', movieGenre: '10751', tvGenre: '10762' },
  { id: 'history', name: 'تاريخ وحروب', movieGenre: '36,10752', tvGenre: '10768' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  const [trending, setTrending] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState(null);
  
  // تحديث السيرفر الافتراضي للسيرفرات البديلة الجديدة
  const [selectedServer, setSelectedServer] = useState('embedsu');

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [tvDetails, setTvDetails] = useState(null);
  const [episodesList, setEpisodesList] = useState([]);

  // القوائم للرئيسية
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

  // حالات صفحات الأفلام / المسلسلات مع التصنيفات الجانبية
  const [hubGenre, setHubGenre] = useState('all');
  const [hubItems, setHubItems] = useState([]);
  const [hubPage, setHubPage] = useState(1);
  const [hasMoreHub, setHasMoreHub] = useState(true);

  // حالات الكتالوج العام (عند الضغط على عرض المزيد في أي قسم بالرئيسية)
  const [catalogTitle, setCatalogTitle] = useState('');
  const [catalogItems, setCatalogItems] = useState([]);
  const [catalogEndpoint, setCatalogEndpoint] = useState('');
  const [catalogGenre, setCatalogGenre] = useState('');
  const [catalogPage, setCatalogPage] = useState(1);
  const [hasMoreCatalog, setHasMoreCatalog] = useState(true);

  // مراجع للتحريك التلقائي في الرئيسية
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

  // تمرير تلقائي للصفوف الأفقية في الرئيسية كل 5 ثوانٍ
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

  useEffect(() => {
    if (activeTab !== 'movies-hub' && activeTab !== 'tv-hub') return;
    
    const fetchHubContent = async () => {
      setHubPage(1);
      const endpoint = activeTab === 'movies-hub' ? 'movie' : 'tv';
      const selectedObj = GENRES.find(g => g.id === hubGenre) || GENRES[0];
      const genreId = activeTab === 'movies-hub' ? selectedObj.movieGenre : selectedObj.tvGenre;

      try {
        let url = `https://api.themoviedb.org/3/discover/${endpoint}?api_key=${API_KEY}&language=en-US&page=1`;
        if (genreId && genreId !== '0') {
          url += `&with_genres=${genreId}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setHubItems(data.results || []);
        setHasMoreHub(data.page < data.total_pages);
      } catch (err) {
        console.error('Error fetching hub content:', err);
      }
    };

    fetchHubContent();
  }, [activeTab, hubGenre]);

  const loadMoreHubItems = async () => {
    const nextPage = hubPage + 1;
    const endpoint = activeTab === 'movies-hub' ? 'movie' : 'tv';
    const selectedObj = GENRES.find(g => g.id === hubGenre) || GENRES[0];
    const genreId = activeTab === 'movies-hub' ? selectedObj.movieGenre : selectedObj.tvGenre;

    try {
      let url = `https://api.themoviedb.org/3/discover/${endpoint}?api_key=${API_KEY}&language=en-US&page=${nextPage}`;
      if (genreId && genreId !== '0') {
        url += `&with_genres=${genreId}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setHubItems(prev => [...prev, ...(data.results || [])]);
      setHubPage(nextPage);
      setHasMoreHub(nextPage < data.total_pages);
    } catch (err) {
      console.error('Error loading more hub items:', err);
    }
  };

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
    setSelectedServer('embedsu');
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

  // دالة توليد روابط السيرفرات البديلة الجديدة (Embed.su, 2Embed, MultiEmbed, SmashyStream)
  const getEmbedUrl = (media, server) => {
    if (!media) return '';
    const isTv = media.media_type === 'tv' || media.first_air_date;
    const id = media.id;

    switch (server) {
      case 'embedsu':
        return isTv ? `https://embed.su/embed/tv/${id}/${selectedSeason}/${selectedEpisode}` : `https://embed.su/embed/movie/${id}`;
      case 'twouembed':
        return isTv ? `https://www.2embed.cc/embedtv/${id}&s=${selectedSeason}&e=${selectedEpisode}` : `https://www.2embed.cc/embed/${id}`;
      case 'multiembed':
        return isTv ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${selectedSeason}&e=${selectedEpisode}` : `https://multiembed.mov/?video_id=${id}&tmdb=1`;
      case 'smashy':
        return isTv ? `https://player.smashy.stream/tv/${id}?s=${selectedSeason}&e=${selectedEpisode}` : `https://player.smashy.stream/movie/${id}`;
      default:
        return isTv ? `https://embed.su/embed/tv/${id}/${selectedSeason}/${selectedEpisode}` : `https://embed.su/embed/movie/${id}`;
    }
  };

  // قائمة السيرفرات الجديدة البديلة النشطة
  const serversList = [
    { id: 'embedsu', name: 'سيرفر Embed.su (ممتاز وسريع)' },
    { id: 'twouembed', name: 'سيرفر 2Embed' },
    { id: 'multiembed', name: 'سيرفر MultiEmbed' },
    { id: 'smashy', name: 'سيرفر SmashyStream' }
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
      return <p style={{ color: '#a1a1aa', textAlign: 'center', padding: '40px' }}>لا توجد عناوين متاحة لهذا التصنيف حالياً...</p>;
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
        <title>سينما فايب | مشاهدة أحدث الأفلام والمسلسلات مترجمة اونلاين</title>
        <meta name="description" content="استمتع بمشاهدة وتحميل أحدث الأفلام والمسلسلات العربية والعالمية بجودات عالية مترجمة حصرياً على سينما فايب - Cinema Vibe." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <style jsx global>{`
        html, body { margin: 0; padding: 0; background-color: #09090b; overflow-x: hidden; }
        * { box-sizing: border-box; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .hub-container {
          display: flex;
          flex-direction: row;
          gap: 24px;
          max-width: 1300px;
          margin: 0 auto;
          padding: 24px;
        }
        .hub-sidebar {
          width: 240px;
          min-width: 240px;
          background-color: #121215;
          border: 1px solid #27272a;
          border-radius: 12px;
          padding: 16px;
          height: fit-content;
          position: sticky;
          top: 80px;
        }
        .hub-content {
          flex: 1;
          min-width: 0;
        }
        @media (max-width: 900px) {
          .hub-container {
            flex-direction: column;
          }
          .hub-sidebar {
            width: 100%;
            position: relative;
            top: 0;
            display: flex;
            overflow-x: auto;
            gap: 8px;
            padding: 12px;
          }
        }
      `}</style>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'rgba(9, 9, 11, 0.95)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0, flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#f97316', cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => { setActiveTab('home'); setSearchResults(null); }}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}>
            <span style={{ color: activeTab === 'home' && !searchQuery ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setSearchResults(null); }}>الرئيسية</span>
            <span style={{ color: activeTab === 'movies-hub' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('movies-hub'); setHubGenre('all'); setSearchResults(null); }}>الأفلام</span>
            <span style={{ color: activeTab === 'tv-hub' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('tv-hub'); setHubGenre('all'); setSearchResults(null); }}>المسلسلات</span>
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
            <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>اختر سيرفر أو مصدر التشغيل (إذا واجهتك مشكلة، جرب سيرفر آخر):</span>
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
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>نتائج البحث</h2>
            <button onClick={() => setSearchResults(null)} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontWeight: 'bold' }}>إغلاق البحث</button>
          </div>
          <MediaGrid items={searchResults} onSelect={openWatchPage} />
        </div>
      ) : activeTab === 'movies-hub' || activeTab === 'tv-hub' ? (
        <div className="hub-container">
          <div className="hub-sidebar">
            <h3 style={{ fontSize: '14px', color: '#f97316', marginBottom: '12px', marginTop: 0, fontWeight: 'bold' }}>التصنيفات</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {GENRES.map(g => (
                <button
                  key={g.id}
                  onClick={() => setHubGenre(g.id)}
                  style={{
                    padding: '10px 12px',
                    textAlign: 'right',
                    backgroundColor: hubGenre === g.id ? '#f97316' : 'transparent',
                    color: hubGenre === g.id ? '#000' : '#d4d4d8',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: hubGenre === g.id ? 'bold' : 'normal',
                    fontSize: '13px'
                  }}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>
          <div className="hub-content">
            <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '20px', borderRight: '4px solid #f97316', paddingRight: '10px' }}>
              {activeTab === 'movies-hub' ? 'قائمة الأفلام' : 'قائمة المسلسلات'} - {GENRES.find(g => g.id === hubGenre)?.name}
            </h2>
            <MediaGrid items={hubItems} onSelect={openWatchPage} />
            {hasMoreHub && (
              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button
                  onClick={loadMoreHubItems}
                  style={{
                    backgroundColor: '#27272a',
                    color: '#fff',
                    border: '1px solid #3f3f46',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  تحميل المزيد
                </button>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'catalog' ? (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0, color: '#fff' }}>{catalogTitle}</h2>
            <button onClick={() => setActiveTab('home')} style={{ backgroundColor: '#27272a', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>العودة للرئيسية</button>
          </div>
          <MediaGrid items={catalogItems} onSelect={openWatchPage} />
          {hasMoreCatalog && (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                onClick={loadMoreCatalogItems}
                style={{
                  backgroundColor: '#27272a',
                  color: '#fff',
                  border: '1px solid #3f3f46',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                تحميل المزيد
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          {heroItem && (
            <div style={{ position: 'relative', width: '100%', height: '480px', overflow: 'hidden' }}>
              <img 
                src={heroItem.backdrop_path ? `https://image.tmdb.org/t/p/original${heroItem.backdrop_path}` : 'https://via.placeholder.com/1200x600?text=No+Image'} 
                alt={heroItem.title || heroItem.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }} 
              />
              <div style={{ position: 'absolute', bottom: 0, right: 0, left: 0, padding: '40px 24px', background: 'linear-gradient(to top, #09090b, transparent)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '900', margin: 0, color: '#fff', direction: 'ltr', textAlign: 'right' }}>
                  {heroItem.title || heroItem.name}
                </h2>
                <p style={{ margin: 0, maxWidth: '700px', fontSize: '14px', lineHeight: '1.6', color: '#d4d4d8', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {heroItem.overview}
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button 
                    onClick={() => openWatchPage(heroItem)}
                    style={{ backgroundColor: '#f97316', color: '#000', border: 'none', padding: '10px 22px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    ▶ مشاهدة الآن
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ padding: '24px', maxWidth: '1300px', margin: '0 auto' }}>
            <HorizontalRow title="أفلام ومسلسلات صدرت هذا الشهر" items={thisMonthMixed} rowRef={rowRefs.thisMonth} onSeeMore={() => openCatalog('movie', '0', 'أفلام ومسلسلات صدرت هذا الشهر')} />
            <HorizontalRow title="الترشيحات الحائزة على جوائز أوسكار" items={oscarsMixed} rowRef={rowRefs.oscars} onSeeMore={() => openCatalog('movie', '18,36', 'الترشيحات الحائزة على جوائز أوسكار')} />
            <HorizontalRow title="الأعلى تقييم والمشاهدة" items={topRatedMixed} rowRef={rowRefs.topRated} onSeeMore={() => openCatalog('movie', '0', 'الأعلى تقييم والمشاهدة')} />
            <HorizontalRow title="أكشن وحماس بلا حدود" items={actionMixed} rowRef={rowRefs.action} onSeeMore={() => openCatalog('movie', '28', 'أكشن وحماس بلا حدود')} />
            <HorizontalRow title="دراما مؤثرة وعميقة" items={dramaMixed} rowRef={rowRefs.drama} onSeeMore={() => openCatalog('movie', '18', 'دراما مؤثرة وعميقة')} />
            <HorizontalRow title="رعب وإثارة وتشويق" items={horrorThrillerMixed} rowRef={rowRefs.horror} onSeeMore={() => openCatalog('movie', '27', 'رعب وإثارة وتشويق')} />
            <HorizontalRow title="خيال علمي ومغامرات فضاء" items={sciFiAdventureMixed} rowRef={rowRefs.scifi} onSeeMore={() => openCatalog('movie', '878', 'خيال علمي ومغامرات فضاء')} />
            <HorizontalRow title="غموض وتحقيق جنائي" items={mysteryMixed} rowRef={rowRefs.mystery} onSeeMore={() => openCatalog('movie', '9648', 'غموض وتحقيق جنائي')} />
            <HorizontalRow title="كوميديا وضحك بلا حدود" items={comedyMixed} rowRef={rowRefs.comedy} onSeeMore={() => openCatalog('movie', '35', 'كوميديا وضحك بلا حدود')} />
            <HorizontalRow title="تشويق ومغامرة" items={suspenseMixed} rowRef={rowRefs.suspense} onSeeMore={() => openCatalog('movie', '53', 'تشويق ومغامرة')} />
          </div>
        </div>
      )}
    </div>
  );
}
