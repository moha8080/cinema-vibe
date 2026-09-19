import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';

export default function Home() {
  const router = useRouter();
  
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTv, setTrendingTv] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [tonightsPick, setTonightsPick] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // جلب البيانات مع الترجمة العربية
        const [moviesRes, tvRes, topRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&language=ar-SA`),
          fetch(`https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}&language=ar-SA`),
          fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=ar-SA`)
        ]);

        const moviesData = await moviesRes.json();
        const tvData = await tvRes.json();
        const topData = await topRes.json();

        setTrendingMovies(moviesData.results || []);
        setTrendingTv(tvData.results || []);
        setTopRated(topData.results || []);

        // اختيار "سهرتك اليوم من اختيارنا" عشوائياً
        const combined = [...(moviesData.results || []), ...(tvData.results || [])];
        if (combined.length > 0) {
          const randomPick = combined[Math.floor(Math.random() * combined.length)];
          setTonightsPick(randomPick);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching home data:', error);
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // التعامل مع البحث المباشر
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&language=ar-SA`);
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Head>
        <title>CINEMAVIBE | افلام ومسلسلات</title>
      </Head>

      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background-color: #09090b !important;
          color-scheme: dark;
          overflow-x: hidden;
        }
        * { box-sizing: border-box; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* شريط التنقل العلوي الثابت */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '14px 24px', 
        backgroundColor: 'rgba(9, 9, 11, 0.95)', 
        backdropFilter: 'blur(10px)',
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        borderBottom: '1px solid rgba(255,255,255,0.08)' 
      }}>
        {/* اسم الموقع والقوائم */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <h1 
            style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#f97316', cursor: 'pointer', letterSpacing: '0.5px' }} 
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setSearchQuery(''); }}
          >
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>

          <div style={{ display: 'flex', gap: '20px' }}>
            <span onClick={() => router.push('/catalog?endpoint=movie&title=الأفلام')} style={{ color: '#d4d4d8', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='#f97316'} onMouseOut={e => e.target.style.color='#d4d4d8'}>الأفلام</span>
            <span onClick={() => router.push('/catalog?endpoint=tv&title=المسلسلات')} style={{ color: '#d4d4d8', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='#f97316'} onMouseOut={e => e.target.style.color='#d4d4d8'}>المسلسلات</span>
            <span onClick={() => router.push('/catalog?endpoint=top_rated&title=الأعلى تقييماً')} style={{ color: '#d4d4d8', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='#f97316'} onMouseOut={e => e.target.style.color='#d4d4d8'}>الأعلى تقييماً</span>
          </div>
        </div>

        {/* خانة البحث */}
        <div style={{ position: 'relative', width: '260px' }}>
          <input 
            type="text" 
            placeholder="ابحث عن فيلم أو مسلسل..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              padding: '8px 36px 8px 12px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = '#f97316'}
            onBlur={e => e.target.style.borderColor = '#27272a'}
          />
          <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a1a1aa', fontSize: '14px', pointerEvents: 'none' }}>🔍</span>
        </div>
      </nav>

      {/* نتائج البحث المباشر */}
      {isSearching && (
        <div style={{ maxWidth: '1400px', margin: '20px auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', color: '#fff', margin: 0 }}>نتائج البحث عن "{searchQuery}"</h3>
            <button onClick={() => { setSearchQuery(''); setIsSearching(false); }} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontWeight: 'bold' }}>مسح</button>
          </div>
          {searchResults.length === 0 ? (
            <p style={{ color: '#a1a1aa' }}>لا توجد نتائج مطابقة.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
              {searchResults.filter(item => item.poster_path).map((item) => {
                const itemTitle = item.title || item.name;
                const year = (item.release_date || item.first_air_date || '').slice(0, 4);
                return (
                  <div key={item.id} onClick={() => router.push(`/watch/${item.id}`)} style={{ backgroundColor: '#121215', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #27272a' }}>
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={itemTitle} style={{ width: '100%', height: '210px', objectFit: 'cover' }} />
                    <div style={{ padding: '8px' }}>
                      <h4 style={{ fontSize: '12px', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>{itemTitle}</h4>
                      <span style={{ fontSize: '11px', color: '#a1a1aa' }}>{year}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* المحتوى الرئيسي */}
      {!isSearching && (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 24px' }}>

          {/* ميزة: سهرتك اليوم من اختيارنا */}
          {tonightsPick && (
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              height: '420px', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              marginBottom: '40px',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'flex-end'
            }}>
              {/* الخلفية */}
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                backgroundImage: `url(https://image.tmdb.org/t/p/original${tonightsPick.backdrop_path || tonightsPick.poster_path})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                filter: 'brightness(0.5)'
              }} />
              
              {/* تدرج الألوان للإضاءة الخافتة */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #09090b 5%, rgba(9,9,11,0.7) 50%, transparent 100%)' }} />

              {/* المحتوى فوق البانر */}
              <div style={{ position: 'relative', padding: '32px', zIndex: 2, maxWidth: '700px' }}>
                <span style={{ backgroundColor: '#f97316', color: '#000', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'inline-block' }}>
                  ★ سهرتك اليوم من اختيارنا
                </span>
                <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', margin: '0 0 10px 0' }}>
                  {tonightsPick.title || tonightsPick.name}
                </h2>
                <p style={{ fontSize: '14px', color: '#d4d4d8', margin: '0 0 20px 0', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {tonightsPick.overview || 'لا توجد نبذة متوفرة حالياً.'}
                </p>
                <button 
                  onClick={() => router.push(`/watch/${tonightsPick.id}`)}
                  style={{ 
                    backgroundColor: '#f97316', 
                    color: '#000', 
                    border: 'none', 
                    padding: '10px 24px', 
                    borderRadius: '8px', 
                    fontSize: '14px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.target.style.transform = 'scale(1)'}
                >
                  شاهد الآن 🎬
                </button>
              </div>
            </div>
          )}

          {/* قسم الأفلام الرائجة */}
          <SectionRow 
            title="الأفلام الرائجة" 
            items={trendingMovies} 
            router={router} 
            onViewMore={() => router.push('/catalog?endpoint=movie&title=الأفلام الرائجة')} 
          />

          {/* قسم المسلسلات الرائجة */}
          <SectionRow 
            title="المسلسلات الرائجة" 
            items={trendingTv} 
            router={router} 
            onViewMore={() => router.push('/catalog?endpoint=tv&title=المسلسلات الرائجة')} 
          />

          {/* قسم الأعلى تقييماً */}
          <SectionRow 
            title="الأعلى تقييماً عالمياً" 
            items={topRated} 
            router={router} 
            onViewMore={() => router.push('/catalog?endpoint=top_rated&title=الأعلى تقييماً عالمياً')} 
          />

        </div>
      )}
    </div>
  );
}

// مكون فرعي لعرض صف العناصر بشكل أفقي أنيق
function SectionRow({ title, items, router, onViewMore }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>
          {title}
        </h3>
        <button 
          onClick={onViewMore} 
          style={{ background: 'none', border: 'none', color: '#f97316', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          عرض الكل ←
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px' }} className="no-scrollbar">
        {items.map((item) => {
          const itemTitle = item.title || item.name;
          const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
          const year = (item.release_date || item.first_air_date || '').slice(0, 4);
          const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

          return (
            <div 
              key={item.id} 
              onClick={() => router.push(`/watch/${item.id}`)}
              style={{ 
                minWidth: '160px', 
                maxWidth: '160px', 
                backgroundColor: '#121215', 
                borderRadius: '10px', 
                overflow: 'hidden', 
                cursor: 'pointer', 
                border: '1px solid #27272a',
                flexShrink: 0,
                transition: 'transform 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ position: 'relative', height: '230px', width: '100%' }}>
                <img src={poster} alt={itemTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                <span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.8)', color: '#eab308', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                  ★ {rating}
                </span>
              </div>
              <div style={{ padding: '10px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {itemTitle}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#a1a1aa' }}>
                  <span>{year}</span>
                  <span style={{ color: '#f97316' }}>{item.media_type === 'tv' ? 'مسلسل' : 'فيلم'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
