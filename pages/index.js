import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [selectedServer, setSelectedServer] = useState('vidsrc.to');

  const API_KEY = '5b9856f6fb6a1f87627447e13d9c2288';
  const BASE_URL = 'https://api.themoviedb.org/3';

  // قائمة السيرفرات الواسعة والمتنوعة لحل مشكلة الترجمة وتعدد المصادر
  const servers = [
    { id: 'vidsrc.to', name: 'سيرفر رئيسي 1 (سريع)' },
    { id: 'vidsrc.cc', name: 'سيرفر الترجمة العربي 2' },
    { id: 'vidsrc.me', name: 'سيرفر بديل 3' },
    { id: 'embed.su', name: 'سيرفر متعدد الجودات 4' },
    { id: '2embed.cc', name: 'سيرفر هوليوود 5' },
    { id: 'multiembed.mov', name: 'سيرفر متعدد المصادر 6' },
    { id: 'autoembed.to', name: 'سيرفر البث الذكي 7' }
  ];

  useEffect(() => {
    fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=ar-SA`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.results) {
          setMovies(data.results);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=ar-SA&query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.results) {
        setMovies(data.results);
      }
    } catch (err) {
      console.error("Search error:", err);
    }
    setLoading(false);
  };

  // توليد رابط التشغيل بناءً على السيرفر المختار
  const getEmbedUrl = () => {
    if (!selectedMovie) return '';
    const isTv = selectedMovie.media_type === 'tv' || selectedMovie.first_air_date;
    const id = selectedMovie.id;

    switch (selectedServer) {
      case 'vidsrc.to':
        return isTv ? `https://vidsrc.to/embed/tv/${id}/${season}/${episode}` : `https://vidsrc.to/embed/movie/${id}`;
      case 'vidsrc.cc':
        return isTv ? `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}?sub=ar` : `https://vidsrc.cc/v2/embed/movie/${id}?sub=ar`;
      case 'vidsrc.me':
        return isTv ? `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}` : `https://vidsrc.me/embed/movie?tmdb=${id}`;
      case 'embed.su':
        return isTv ? `https://embed.su/embed/tv/${id}/${season}/${episode}` : `https://embed.su/embed/movie/${id}`;
      case '2embed.cc':
        return isTv ? `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}` : `https://www.2embed.cc/embed/${id}`;
      case 'multiembed.mov':
        return isTv ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}` : `https://multiembed.mov/?video_id=${id}&tmdb=1`;
      case 'autoembed.to':
        return isTv ? `https://player.autoembed.to/embed/tv/${id}/${season}/${episode}` : `https://player.autoembed.to/embed/movie/${id}`;
      default:
        return isTv ? `https://vidsrc.to/embed/tv/${id}/${season}/${episode}` : `https://vidsrc.to/embed/movie/${id}`;
    }
  };

  return (
    <div style={{ backgroundColor: '#09090b', color: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }} dir="rtl">
      <Head>
        <title>سينما فيب - Cinema Vibe</title>
      </Head>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', backgroundColor: '#121215', borderBottom: '1px solid #27272a', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ color: '#f97316', fontSize: '22px', fontWeight: 'bold', margin: 0, cursor: 'pointer' }} onClick={() => window.location.reload()}>
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

      <main style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '24px', borderRight: '4px solid #f97316', paddingRight: '10px' }}>الأفلام والمسلسلات الرائجة</h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#a1a1aa', marginTop: '50px' }}>جاري تحميل المحتوى...</p>
        ) : movies.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#ef4444', marginTop: '50px' }}>لم يتم العثور على نتائج.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
            {movies.map((item) => {
              const title = item.title || item.name;
              const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null;
              
              return (
                <div 
                  key={item.id} 
                  onClick={() => { setSelectedMovie(item); setSeason(1); setEpisode(1); }}
                  style={{ backgroundColor: '#18181b', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #27272a' }}
                >
                  {poster ? (
                    <img src={poster} alt={title} style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#27272a', color: '#71717a' }}>بدون صورة</div>
                  )}
                  <div style={{ padding: '12px' }}>
                    <h3 style={{ fontSize: '14px', margin: '0 0 6px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title || 'بدون عنوان'}</h3>
                    <p style={{ fontSize: '12px', color: '#a1a1aa', margin: 0 }}>⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* نافذة المشغل المتقدمة مع خيارات السيرفرات المتعددة */}
      {selectedMovie && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '15px', overflowY: 'auto' }}>
          <div style={{ backgroundColor: '#121215', width: '100%', maxWidth: '900px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #27272a', position: 'relative', margin: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', backgroundColor: '#18181b', borderBottom: '1px solid #27272a' }}>
              <h2 style={{ margin: 0, fontSize: '16px', color: '#f97316' }}>{selectedMovie.title || selectedMovie.name}</h2>
              <button 
                onClick={() => setSelectedMovie(null)}
                style={{ backgroundColor: '#f97316', color: '#000', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            {/* شريط اختيار السيرفرات المتعددة */}
            <div style={{ padding: '12px 20px', backgroundColor: '#0f0f12', borderBottom: '1px solid #27272a', display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {servers.map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => setSelectedServer(srv.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    backgroundColor: selectedServer === srv.id ? '#f97316' : '#27272a',
                    color: selectedServer === srv.id ? '#000' : '#fff'
                  }}
                >
                  {srv.name}
                </button>
              ))}
            </div>

            {/* خيارات المواسم والحلقات للمسلسلات */}
            {(selectedMovie.media_type === 'tv' || selectedMovie.first_air_date) && (
              <div style={{ padding: '10px 20px', backgroundColor: '#18181b', borderBottom: '1px solid #27272a', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', color: '#a1a1aa' }}>الموسم: 
                  <input type="number" min="1" value={season} onChange={(e) => setSeason(e.target.value)} style={{ width: '50px', background: '#09090b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px', marginRight: '6px', padding: '4px', textAlign: 'center' }} />
                </label>
                <label style={{ fontSize: '13px', color: '#a1a1aa' }}>الحلقة: 
                  <input type="number" min="1" value= {episode} onChange={(e) => setEpisode(e.target.value)} style={{ width: '50px', background: '#09090b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px', marginRight: '6px', padding: '4px', textAlign: 'center' }} />
                </label>
              </div>
            )}

            <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000' }}>
              <iframe 
                src={getEmbedUrl()} 
                style={{ width: '100%', height: '100%', border: 'none' }} 
                allowFullScreen
                referrerPolicy="origin"
              ></iframe>
            </div>

            <div style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: '13px', color: '#d4d4d8', margin: 0, lineHeight: '1.5' }}>{selectedMovie.overview || 'لا توجد قصة متوفرة.'}</p>
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
