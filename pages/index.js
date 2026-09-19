import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
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
        // جلب التريند (باللغة الإنجليزية للأصل، وللباقي حسب الحاجة)
        const trendRes = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&language=en-US`);
        const trendData = await trendRes.json();
        // تصفية العناصر بحيث تحتوي حصراً على قصة (overview) غير فارغة
        const validTrending = (trendData.results || []).filter(item => item.overview && item.overview.trim() !== '');
        setTrending(validTrending);

        const fetchMixedCategory = async (movieGenre, tvGenre, setter) => {
          const [movieRes, tvRes] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${movieGenre}&language=ar&sort_by=vote_average.desc&vote_count.gte=300`),
            fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${tvGenre}&language=ar&sort_by=vote_average.desc&vote_count.gte=150`)
          ]);
          const movieData = await movieRes.json();
          const tvData = await tvRes.json();
          
          const combined = [...(movieData.results || []), ...(tvData.results || [])];
          setter(combined.sort(() => 0.5 - Math.random()));
        };

        const topMovieRes = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=ar`);
        const topTvRes = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=ar`);
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
        
        const monthMovieRes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ar&sort_by=popularity.desc&primary_release_date.gte=2026-01-01`);
        const monthTvRes = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=ar&sort_by=popularity.desc&first_air_date.gte=2026-01-01`);
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

  // حركة البانر المتحرك في الأعلى وتغييره كل 5 ثوانٍ
  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(trending.length, 5));
    }, 5000);
    return () => clearInterval(interval);
  }, [trending]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&language=ar`);
      const data = await res.json();
      setSearchResults(data.results || []);
      setShowSearchModal(false);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const openCatalog = (endpointType, genreId, titleText) => {
    router.push({
      pathname: '/catalog',
      query: { endpoint: endpointType, genre: genreId, title: titleText }
    });
  };

  const heroItem = trending[heroIndex];

  const HorizontalRow = ({ title, items, rowRef, endpointType, genreId }) => {
    if (!items || items.length === 0) return null;

    return (
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingRight: '4px', paddingLeft: '4px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', borderRight: '3px solid #f97316', paddingRight: '8px', margin: 0, color: '#fff' }}>
            {title}
          </h2>
          <button 
            onClick={() => openCatalog(endpointType, genreId, title)} 
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
                onClick={() => router.push(`/watch/${item.id}`)}
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

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'rgba(9, 9, 11, 0.95)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0, flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#f97316', cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => router.push('/')}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#f97316', cursor: 'pointer' }}>الرئيسية</span>
            <span style={{ color: '#a1a1aa', cursor: 'pointer' }} onClick={() => router.push('/movies')}>الأفلام</span>
            <span style={{ color: '#a1a1aa', cursor: 'pointer' }} onClick={() => router.push('/tv')}>المسلسلات</span>
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

      {searchResults ? (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>نتائج البحث</h2>
            <button onClick={() => setSearchResults(null)} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontWeight: 'bold' }}>إلغاء البحث</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '14px' }}>
            {searchResults.map(item => (
              <div key={item.id} onClick={() => router.push(`/watch/${item.id}`)} style={{ backgroundColor: '#121215', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #27272a' }}>
                <img src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'} alt={item.title || item.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '10px' }}>
                  <h3 style={{ fontSize: '13px', color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', direction: 'ltr', textAlign: 'left' }}>{item.title || item.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
          {heroItem && (
            <div 
              onClick={() => router.push(`/watch/${heroItem.id}`)}
              style={{ 
                position: 'relative', 
                width: '100%', 
                height: '420px', 
                borderRadius: '14px', 
                overflow: 'hidden', 
                marginBottom: '36px', 
                cursor: 'pointer',
                border: '1px solid #27272a',
                transition: 'background-image 0.5s ease-in-out'
              }}
            >
              <img 
                src={`https://image.tmdb.org/t/p/original${heroItem.backdrop_path || heroItem.poster_path}`} 
                alt={heroItem.title || heroItem.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #09090b 5%, rgba(9,9,11,0.6) 50%, transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: '24px', right: '24px', left: '24px', maxWidth: '700px' }}>
                <span style={{ backgroundColor: '#f97316', color: '#000', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', display: 'inline-block', marginBottom: '8px' }}>
                  رائج الآن
                </span>
                <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#fff', margin: '0 0 8px 0', direction: 'ltr', textAlign: 'left' }}>
                  {heroItem.title || heroItem.name}
                </h2>
                {/* قصة الفيلم أو المسلسل الخاصة بالبانر المتحرك */}
                <p style={{ color: '#d4d4d8', fontSize: '13px', margin: '0 0 16px 0', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', direction: 'ltr', textAlign: 'left' }}>
                  {heroItem.overview}
                </p>
                <button style={{ backgroundColor: '#f97316', color: '#000', border: 'none', padding: '10px 22px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                  شاهد الآن
                </button>
              </div>
            </div>
          )}

          <HorizontalRow title="أفلام ومسلسلات أضيفت هذا الشهر (2026)" items={thisMonthMixed} rowRef={rowRefs.thisMonth} endpointType="movie" genreId="0" />
          <HorizontalRow title="ترشيح الأوسكار والقصص الخالدة" items={oscarsMixed} rowRef={rowRefs.oscars} endpointType="movie" genreId="18,36" />
          <HorizontalRow title="الأعلى تقييماً وعالمياً" items={topRatedMixed} rowRef={rowRefs.topRated} endpointType="movie" genreId="0" />
          <HorizontalRow title="دراما مؤثرة وعميقة" items={dramaMixed} rowRef={rowRefs.drama} endpointType="movie" genreId="18" />
          <HorizontalRow title="غموض وتحقيق مشوق" items={mysteryMixed} rowRef={rowRefs.mystery} endpointType="movie" genreId="9648" />
          <HorizontalRow title="كوميديا ومرح" items={comedyMixed} rowRef={rowRefs.comedy} endpointType="movie" genreId="35" />
          <HorizontalRow title="إثارة وجريمة وتشويق" items={suspenseMixed} rowRef={rowRefs.suspense} endpointType="movie" genreId="53" />
          <HorizontalRow title="أكشن وحركة بلا حدود" items={actionMixed} rowRef={rowRefs.action} endpointType="movie" genreId="28" />
          <HorizontalRow title="رعب وإثارة نفسية" items={horrorThrillerMixed} rowRef={rowRefs.horror} endpointType="movie" genreId="27" />
          <HorizontalRow title="خيال علمي وفضاء" items={sciFiAdventureMixed} rowRef={rowRefs.scifi} endpointType="movie" genreId="878" />
        </div>
      )}
    </div>
  );
}
