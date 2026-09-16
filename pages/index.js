import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const API_KEY = '5b9856f6fb6a1f87627447e13d9c2288';
  const BASE_URL = 'https://api.themoviedb.org/3';

  useEffect(() => {
    fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=ar-SA`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setMovies(data.results);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);

    const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=ar-SA&query=${encodeURIComponent(searchQuery)}`);
    const data = await res.json();
    if (data.results) {
      setMovies(data.results);
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#09090b', color: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }} dir="rtl">
      <Head>
        <title>سينما فيب - Cinema Vibe | مشاهدة الأفلام والمسلسلات</title>
      </Head>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', backgroundColor: '#121215', borderBottom: '1px solid #27272a' }}>
        <h1 style={{ color: '#f97316', fontSize: '22px', fontWeight: 'bold', margin: 0, cursor: 'pointer' }} onClick={() => window.location.reload()}>CINEMA VIBE</h1>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="ابحث عن فيلم أو مسلسل..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #27272a', backgroundColor: '#18181b', color: '#fff', outline: 'none', width: '220px' }}
          />
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#f97316', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>بحث</button>
        </form>
      </header>

      <main style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '24px', borderRight: '4px solid #f97316', paddingRight: '10px' }}>الأفلام والمسلسلات الرائجة</h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#a1a1aa', marginTop: '50px' }}>جاري تحميل المحتوى...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
            {movies.map((item) => {
              const title = item.title || item.name;
              const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null;
              
              return (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedMovie(item)}
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

      {selectedMovie && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#121215', width: '100%', maxWidth: '800px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #27272a', position: 'relative' }}>
            <button 
              onClick={() => setSelectedMovie(null)}
              style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#f97316', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold', zIndex: 10 }}
            >
              ✕
            </button>
            <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000' }}>
              <iframe 
                src={`https://vidsrc.to/embed/${selectedMovie.media_type === 'tv' ? 'tv' : 'movie'}/${selectedMovie.id}`} 
                style={{ width: '100%', height: '100%', border: 'none' }} 
                allowFullScreen
              ></iframe>
            </div>
            <div style={{ padding: '16px' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#f97316' }}>{selectedMovie.title || selectedMovie.name}</h2>
              <p style={{ fontSize: '13px', color: '#d4d4d8', margin: 0, lineHeight: '1.5' }}>{selectedMovie.overview || 'لا توجد قصة متوفرة.'}</p>
            </div>
          </div>
        </div>
      )}

      <footer style={{ borderTop: '1px solid #27272a', padding: '24px 20px', textAlign: 'center', backgroundColor: '#09090b', color: '#71717a', fontSize: '13px', marginTop: '60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <p style={{ margin: 0 }}>جميع الحقوق محفوظة © 2026 CINEMA VIBE</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="/privacy" style={{ color: '#f97316', textDecoration: 'none', fontWeight: 'bold' }}>سياسة الخصوصية</a>
            <a href="/contact" style={{ color: '#f97316', textDecoration: 'none', fontWeight: 'bold' }}>اتصل بنا / اطلب فيلم</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
