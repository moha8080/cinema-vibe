import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';

export default function TvShowsPage() {
  const router = useRouter();
  const [tvList, setTvList] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب تصنيفات المسلسلات
    fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=ar`)
      .then(res => res.json())
      .then(data => setGenres(data.genres || []))
      .catch(err => console.error(err));

    fetchTvShows('');
  }, []);

  const fetchTvShows = (genreId) => {
    setLoading(true);
    let url = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=ar`;
    if (genreId) {
      url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&language=ar`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setTvList(data.results || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    fetchTvShows(genreId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&language=ar`)
      .then(res => res.json())
      .then(data => {
        setTvList(data.results || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Head>
        <title>المسلسلات | سينما فايب</title>
      </Head>

      {/* شريط التنقل */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'rgba(9, 9, 11, 0.95)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#f97316', cursor: 'pointer' }} onClick={() => router.push('/')}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', fontWeight: '600' }}>
            <span style={{ color: '#a1a1aa', cursor: 'pointer' }} onClick={() => router.push('/')}>الرئيسية</span>
            <span style={{ color: '#a1a1aa', cursor: 'pointer' }} onClick={() => router.push('/movies')}>الأفلام</span>
            <span style={{ color: '#f97316', cursor: 'pointer' }} onClick={() => router.push('/tv')}>المسلسلات</span>
          </div>
        </div>
      </nav>

      <div style={{ padding: '24px', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>مكتبة المسلسلات</h2>
          
          {/* بحث داخل المسلسلات */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="ابحث عن مسلسل..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #3f3f46', backgroundColor: '#18181b', color: '#fff', outline: 'none', fontSize: '13px' }}
            />
            <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#f97316', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>بحث</button>
          </form>
        </div>

        {/* تصنيفات المسلسلات */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }} className="no-scrollbar">
          <button 
            onClick={() => handleGenreChange('')}
            style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', backgroundColor: selectedGenre === '' ? '#f97316' : '#18181b', color: selectedGenre === '' ? '#000' : '#f4f4f5', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            الكل
          </button>
          {genres.map(genre => (
            <button 
              key={genre.id}
              onClick={() => handleGenreChange(genre.id)}
              style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', backgroundColor: selectedGenre === genre.id ? '#f97316' : '#18181b', color: selectedGenre === genre.id ? '#000' : '#f4f4f5', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* شبكة العرض */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#a1a1aa', padding: '50px' }}>جاري التحميل...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '14px' }}>
            {tvList.map(item => {
              const title = item.name || item.title;
              const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
              const year = (item.first_air_date || '').slice(0, 4);
              const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

              return (
                <div 
                  key={item.id} 
                  onClick={() => router.push(`/watch/${item.id}`)}
                  style={{ backgroundColor: '#121215', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #27272a', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                    <img src={poster} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(0, 0, 0, 0.75)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                      <span style={{ color: '#eab308' }}>★</span> {rating}
                    </span>
                  </div>
                  <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', direction: 'ltr', textAlign: 'left' }}>{title}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#a1a1aa' }}>
                      <span>{year}</span>
                      <span style={{ color: '#f97316', fontWeight: 'bold' }}>مسلسل</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
