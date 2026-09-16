import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);
  const [scifiMovies, setSciFiMovies] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [activeServer, setActiveServer] = useState('vidsrc.to');
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  const API_KEY = '5b9856f6fb6a1f87627447e13d9c2288';
  const BASE_URL = 'https://api.themoviedb.org/3';

  useEffect(() => {
    async function fetchAllData() {
      try {
        const [
          resTrending, resTop, resTv, resHorror, resAction, resComedy, resDrama, resSciFi
        ] = await Promise.all([
          fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=ar-SA`),
          fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=ar-SA`),
          fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=ar-SA`),
          fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ar-SA&with_genres=27`),
          fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ar-SA&with_genres=28`),
          fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ar-SA&with_genres=35`),
          fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ar-SA&with_genres=18`),
          fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ar-SA&with_genres=878`)
        ]);

        const dataTrending = await resTrending.json();
        const dataTop = await resTop.json();
        const dataTv = await resTv.json();
        const dataHorror = await resHorror.json();
        const dataAction = await resAction.json();
        const dataComedy = await resComedy.json();
        const dataDrama = await resDrama.json();
        const dataSciFi = await resSciFi.json();

        if (dataTrending.results) setTrending(dataTrending.results);
        if (dataTop.results) setTopMovies(dataTop.results);
        if (dataTv.results) setPopularTv(dataTv.results);
        if (dataHorror.results) setHorrorMovies(dataHorror.results);
        if (dataAction.results) setActionMovies(dataAction.results);
        if (dataComedy.results) setComedyMovies(dataComedy.results);
        if (dataDrama.results) setDramaMovies(dataDrama.results);
        if (dataSciFi.results) setSciFiMovies(dataSciFi.results);

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=ar-SA&query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.results) {
        setSearchResults(data.results);
      }
    } catch (err) {
      console.error("Search error:", err);
    }
    setLoading(false);
  };

  const getEmbedUrl = () => {
    if (!selectedMedia) return '';
    const isTv = selectedMedia.media_type === 'tv' || selectedMedia.first_air_date;
    const id = selectedMedia.id;

    if (isTv) {
      if (activeServer === 'vidsrc.to') return `https://vidsrc.to/embed/tv/${id}/${season}/${episode}?sub.lang=ar`;
      if (activeServer === 'vidsrc.me') return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}&sub.lang=ar`;
      if (activeServer === 'embed.su') return `https://embed.su/embed/tv/${id}/${season}/${episode}`;
    } else {
      if (activeServer === 'vidsrc.to') return `https://vidsrc.to/embed/movie/${id}?sub.lang=ar`;
      if (activeServer === 'vidsrc.me') return `https://vidsrc.me/embed/movie?tmdb=${id}&sub.lang=ar`;
      if (activeServer === 'embed.su') return `https://embed.su/embed/movie/${id}`;
    }
    return `https://vidsrc.to/embed/movie/${id}?sub.lang=ar`;
  };

  return (
    <div style={{ backgroundColor: '#09090b', color: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }} dir="rtl">
      <Head>
        <title>سينما فيب - Cinema Vibe</title>
      </Head>

      {/* الهيدر العلوي */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', backgroundColor: '#121215', borderBottom: '1px solid #27272a', position: 'sticky', top: 0, zIndex: 50 }}>
        <h1 style={{ color: '#f97316', fontSize: '22px', fontWeight: 'bold', margin: 0, cursor: 'pointer' }} onClick={() => { setSearchResults(null); setSearchQuery(''); }}>
          CINEMA<span style={{ color: '#fff' }}>VIBE</span>
        </h1>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="ابحث عن فيلم أو مسلسل..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #27272a', backgroundColor: '#18181b', color: '#fff', outline: 'none', width: '220px' }}
          />
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#f97316', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>بحث</button>
        </form>
      </header>

      <main style={{ padding: '32px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        {loading && !trending.length ? (
          <p style={{ textAlign: 'center', color: '#a1a1aa', marginTop: '50px' }}>جاري تحميل المحتوى...</p>
        ) : searchResults ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>نتائج البحث</h2>
              <button onClick={() => setSearchResults(null)} style={{ background: '#27272a', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>العودة للرئيسية</button>
            </div>
            <MovieGrid items={searchResults} onSelect={setSelectedMedia} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <MovieSection title="الأفلام والمسلسلات الرائجة هذا الأسبوع" items={trending} onSelect={setSelectedMedia} />
            <MovieSection title="أفضل الأفلام تقييماً" items={topMovies} onSelect={setSelectedMedia} />
            <MovieSection title="المسلسلات الأكثر مشاهدة" items={popularTv} onSelect={setSelectedMedia} />
            <MovieSection title="أفلام الأكشن والمغامرة" items={actionMovies} onSelect={setSelectedMedia} />
            <MovieSection title="أفلام الرعب والتشويق" items={horrorMovies} onSelect={setSelectedMedia} />
            <MovieSection title="أفلام الكوميديا" items={comedyMovies} onSelect={setSelectedMedia} />
            <MovieSection title="أفلام الدراما المؤثرة" items={dramaMovies} onSelect={setSelectedMedia} />
            <MovieSection title="أفلام الخيال العلمي" items={scifiMovies} onSelect={setSelectedMedia} />
          </div>
        )}
      </main>

      {/* نافذة المشغل */}
      {selectedMedia && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#121215', width: '100%', maxWidth: '900px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #27272a', position: 'relative', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#18181b', borderBottom: '1px solid #27272a' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#f97316' }}>{selectedMedia.title || selectedMedia.name}</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button onClick={() => setActiveServer('vidsrc.to')} style={{ padding: '4px 10px', background: activeServer === 'vidsrc.to' ? '#f97316' : '#27272a', color: activeServer === 'vidsrc.to' ? '#000' : '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>سيرفر 1</button>
                <button onClick={() => setActiveServer('vidsrc.me')} style={{ padding: '4px 10px', background: activeServer === 'vidsrc.me' ? '#f97316' : '#27272a', color: activeServer === 'vidsrc.me' ? '#000' : '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>سيرفر 2</button>
                <button onClick={() => setActiveServer('embed.su')} style={{ padding: '4px 10px', background: activeServer === 'embed.su' ? '#f97316' : '#27272a', color: activeServer === 'embed.su' ? '#000' : '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>سيرفر 3</button>
                <button onClick={() => setSelectedMedia(null)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginRight: '10px' }}>✕</button>
              </div>
            </div>

            {(selectedMedia.media_type === 'tv' || selectedMedia.first_air_date) && (
              <div style={{ display: 'flex', gap: '15px', padding: '8px 16px', backgroundColor: '#18181b', borderBottom: '1px solid #27272a', fontSize: '13px' }}>
                <label>الموسم: <input type="number" min="1" value={season} onChange={(e) => setSeason(e.target.value)} style={{ width: '50px', background: '#09090b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px', textAlign: 'center' }} /></label>
                <label>الحلقة: <input type="number" min="1" value={episode} onChange={(e) => setEpisode(e.target.value)} style={{ width: '50px', background: '#09090b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px', textAlign: 'center' }} /></label>
              </div>
            )}

            <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000' }}>
              <iframe src={getEmbedUrl()} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen></iframe>
            </div>

            <div style={{ padding: '16px', overflowY: 'auto' }}>
              <p style={{ fontSize: '13px', color: '#d4d4d8', margin: 0, lineHeight: '1.5' }}>{selectedMedia.overview || 'لا توجد قصة متوفرة.'}</p>
            </div>
          </div>
        </div>
      )}

      <footer style={{ borderTop: '1px solid #27272a', padding: '24px 20px', textAlign: 'center', backgroundColor: '#09090b', color: '#71717a', fontSize: '13px', marginTop: '60px' }}>
        <p style={{ margin: 0 }}>جميع الحقوق محفوظة © 2026 CINEMA VIBE</p>
      </footer>
    </div>
  );
}

// مكون لعرض كل قسم
function MovieSection({ title, items, onSelect }) {
  if (!items || items.length === 0) return null;
  return (
    <section>
      <h2 style={{ fontSize: '18px', marginBottom: '16px', borderRight: '4px solid #f97316', paddingRight: '10px' }}>{title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
        {items.map((item) => {
          const titleText = item.title || item.name;
          const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null;
          if (!poster) return null;

          return (
            <div 
              key={item.id} 
              onClick={() => onSelect(item)}
              style={{ backgroundColor: '#18181b', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #27272a', transition: 'transform 0.2s' }}
            >
              <img src={poster} alt={titleText} style={{ width: '100%', height: '230px', objectFit: 'cover' }} />
              <div style={{ padding: '10px' }}>
                <h3 style={{ fontSize: '13px', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{titleText}</h3>
                <p style={{ fontSize: '11px', color: '#a1a1aa', margin: 0 }}>⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// مكون لشبكة النتائج
function MovieGrid({ items, onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
      {items.map((item) => {
        const titleText = item.title || item.name;
        const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null;
        if (!poster) return null;

        return (
          <div 
            key={item.id} 
            onClick={() => onSelect(item)}
            style={{ backgroundColor: '#18181b', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #27272a' }}
          >
            <img src={poster} alt={titleText} style={{ width: '100%', height: '230px', objectFit: 'cover' }} />
            <div style={{ padding: '10px' }}>
              <h3 style={{ fontSize: '13px', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{titleText}</h3>
              <p style={{ fontSize: '11px', color: '#a1a1aa', margin: 0 }}>⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
