import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';

const GENRES = [
  { id: 'all', name: 'الكل / الشائع', movieGenre: '0', tvGenre: '0' },
  { id: 'action', name: 'أكشن ', movieGenre: '28', tvGenre: '10759' },
  { id: 'drama', name: 'دراما ', movieGenre: '18', tvGenre: '18' },
  { id: 'horror', name: 'رعب ', movieGenre: '27', tvGenre: '10765' },
  { id: 'comedy', name: 'كوميديا ', movieGenre: '35', tvGenre: '35' },
  { id: 'scifi', name: 'خيال علمي ', movieGenre: '878', tvGenre: '10765' },
  { id: 'crime', name: 'جريمة ', movieGenre: '80', tvGenre: '80' },
  { id: 'mystery', name: 'غموض ', movieGenre: '9648', tvGenre: '9648' },
  { id: 'romance', name: 'رومانسية ', movieGenre: '10749', tvGenre: '18' },
  { id: 'animation', name: 'رسوم متحركة / أنمي', movieGenre: '16', tvGenre: '16' },
  { id: 'documentary', name: 'وثائقي ', movieGenre: '99', tvGenre: '99' },
  { id: 'family', name: 'عائلي  ', movieGenre: '10751', tvGenre: '10762' },
  { id: 'history', name: 'تاريخ وحروب', movieGenre: '36,10752', tvGenre: '10768' },
];

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  const [trending, setTrending] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);

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

  // تمرير تلقائي للصفوف الأفقية
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
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(trending.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [trending]);

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
    router.push(`/watch/${item.id}`);
  };

  const openCatalog = (endpointType, genreId, title) => {
    router.push(`/catalog?endpoint=${endpointType}&genre=${genreId}&title=${encodeURIComponent(title)}`);
  };

  const heroItem = trending[heroIndex];

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
            style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', border: '1px solid #f97316', color: '#f97316', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', padding: '6px 14px', borderRadius: '6px' }}
          >
            عرض المزيد
          </button>
        </div>

        <div ref={rowRef} style={{ display: 'flex', gap: '14px', overflowX: 'auto', scrollBehavior: 'smooth', paddingBottom: '8px' }} className="no-scrollbar">
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
                style={{ minWidth: '135px', maxWidth: '135px', backgroundColor: '#121215', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #27272a', flexShrink: '0', display: 'flex', flexDirection: 'column' }}
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

  const MediaGrid = ({ items }) => {
    if (!items || items.length === 0) return <p style={{ color: '#a1a1aa', textAlign: 'center', padding: '40px' }}>لا توجد عناوين متاحة...</p>;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '14px' }}>
        {items.map((item) => {
          const title = item.title || item.name;
          const posterPath = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
          const year = (item.release_date || item.first_air_date || '').slice(0, 4);
          const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
          const isTvShow = item.media_type === 'tv' || item.first_air_date;

          return (
            <div key={item.id} onClick={() => openWatchPage(item)} style={{ backgroundColor: '#121215', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #27272a', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                <img src={posterPath} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(0, 0, 0, 0.75)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                  <span style={{ color: '#eab308' }}>★</span> {rating}
                </span>
              </div>
              <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', direction: 'ltr', textAlign: 'left' }}>{title}</h3>
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
      </Head>

      <style jsx global>{`
        html, body { margin: 0; padding: 0; background-color: #09090b; overflow-x: hidden; }
        * { box-sizing: border-box; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* شريط التنقل العلوي */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'rgba(9, 9, 11, 0.95)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#f97316', cursor: 'pointer' }} onClick={() => router.push('/')}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', fontWeight: '600' }}>
            <span style={{ color: '#f97316', cursor: 'pointer' }} onClick={() => router.push('/')}>الرئيسية</span>
            <span style={{ color: '#a1a1aa', cursor: 'pointer' }} onClick={() => router.push('/movies')}>الأفلام</span>
            <span style={{ color: '#a1a1aa', cursor: 'pointer' }} onClick={() => router.push('/tv')}>المسلسلات</span>
          </div>
        </div>
        <button onClick={() => setShowSearchModal(!showSearchModal)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '38px', height: '38px', color: '#f97316', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
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

      {searchResults ? (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>نتائج البحث</h2>
            <button onClick={() => setSearchResults(null)} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontWeight: 'bold' }}>إغلاق البحث</button>
          </div>
          <MediaGrid items={searchResults} />
        </div>
      ) : (
        <div style={{ padding: '24px', maxWidth: '1300px', margin: '0 auto' }}>
          {heroItem && (
            <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', marginBottom: '40px', background: '#121215', border: '1px solid #27272a' }}>
              <img src={`https://image.tmdb.org/t/p/original${heroItem.backdrop_path || heroItem.poster_path}`} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, left: 0, padding: '30px', background: 'linear-gradient(to top, #09090b, transparent)' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: '0 0 10px 0', direction: 'ltr', textAlign: 'right' }}>{heroItem.title || heroItem.name}</h2>
                <button onClick={() => openWatchPage(heroItem)} style={{ backgroundColor: '#f97316', color: '#000', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>مشاهدة الآن</button>
              </div>
            </div>
          )}

          <HorizontalRow title="أحدث إصدارات هذا الشهر" items={thisMonthMixed} rowRef={rowRefs.thisMonth} onSeeMore={() => openCatalog('discover/movie', '0', 'أحدث إصدارات هذا الشهر')} />
          <HorizontalRow title="الأفلام الحائزة على جوائز وتقييمات عالية" items={oscarsMixed} rowRefs={rowRefs.oscars} onSeeMore={() => openCatalog('discover/movie', '18,36', 'أفلام جوائز وتقييمات عالية')} />
          <HorizontalRow title="الأعلى تقييماً" items={topRatedMixed} rowRef={rowRefs.topRated} onSeeMore={() => openCatalog('movie/top_rated', '0', 'الأعلى تقييماً')} />
          <HorizontalRow title="أفلام ومسلسلات الأكشن والحماس" items={actionMixed} rowRef={rowRefs.action} onSeeMore={() => openCatalog('discover/movie', '28', 'أكشن وحماس')} />
          <HorizontalRow title="الرعب والإثارة" items={horrorThrillerMixed} rowRef={rowRefs.horror} onSeeMore={() => openCatalog('discover/movie', '27', 'رعب وإثارة')} />
          <HorizontalRow title="الخيال العلمي والمغامرة" items={sciFiAdventureMixed} rowRef={rowRefs.scifi} onSeeMore={() => openCatalog('discover/movie', '878', 'خيال علمي ومغامرة')} />
          <HorizontalRow title="الدراما المؤثرة" items={dramaMixed} rowRef={rowRefs.drama} onSeeMore={() => openCatalog('discover/movie', '18', 'دراما')} />
          <HorizontalRow title="الغموض والتحقيق" items={mysteryMixed} rowRef={rowRefs.mystery} onSeeMore={() => openCatalog('discover/movie', '9648', 'غموض وتحقيق')} />
          <HorizontalRow title="الكوميديا والضحك" items={comedyMixed} rowRef={rowRefs.comedy} onSeeMore={() => openCatalog('discover/movie', '35', 'كوميديا')} />
          <HorizontalRow title="التشويق والجريمة" items={suspenseMixed} rowRef={rowRefs.suspense} onSeeMore={() => openCatalog('discover/movie', '53', 'تشويق وجريمة')} />
        </div>
      )}
    </div>
  );
}
