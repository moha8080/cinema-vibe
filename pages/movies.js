import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';
const GENRES = [
  { id: 'all', name: 'الكل / الشائع', movieGenre: '0' },
  { id: 'action', name: 'أكشن', movieGenre: '28' },
  { id: 'drama', name: 'دراما', movieGenre: '18' },
  { id: 'horror', name: 'رعب', movieGenre: '27' },
  { id: 'comedy', name: 'كوميديا', movieGenre: '35' },
  { id: 'scifi', name: 'خيال علمي', movieGenre: '878' },
  { id: 'crime', name: 'جريمة', movieGenre: '80' },
  { id: 'mystery', name: 'غموض', movieGenre: '9648' },
  { id: 'romance', name: 'رومانسية', movieGenre: '10749' },
  { id: 'animation', name: 'رسوم متحركة / أنمي', movieGenre: '16' },
  { id: 'documentary', name: 'وثائقي', movieGenre: '99' },
  { id: 'family', name: 'عائلي', movieGenre: '10751' },
];

export default function MoviesHub() {
  const router = useRouter();
  const [hubGenre, setHubGenre] = useState('all');
  const [hubItems, setHubItems] = useState([]);

  useEffect(() => {
    const fetchHubContent = async () => {
      const selectedObj = GENRES.find(g => g.id === hubGenre) || GENRES[0];
      try {
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&page=1`;
        if (selectedObj.movieGenre && selectedObj.movieGenre !== '0') {
          url += `&with_genres=${selectedObj.movieGenre}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setHubItems(data.results || []);
      } catch (err) {
        console.error('Error fetching movies:', err);
      }
    };
    fetchHubContent();
  }, [hubGenre]);

  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <Head><title>قسـم الأفلام | سينما فايب</title></Head>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'rgba(9, 9, 11, 0.95)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#f97316', cursor: 'pointer' }} onClick={() => router.push('/')}>
          CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
        </h1>
        <div style={{ display: 'flex', gap: '16px', fontSize: '14px', fontWeight: '600' }}>
          <span style={{ color: '#a1a1aa', cursor: 'pointer' }} onClick={() => router.push('/')}>الرئيسية</span>
          <span style={{ color: '#f97316', cursor: 'pointer' }}>الأفلام</span>
          <span style={{ color: '#a1a1aa', cursor: 'pointer' }} onClick={() => router.push('/tv')}>المسلسلات</span>
        </div>
      </nav>

      <div style={{ display: 'flex', gap: '24px', maxWidth: '1300px', margin: '0 auto', padding: '24px' }}>
        <div style={{ width: '240px', minWidth: '240px', backgroundColor: '#121215', border: '1px solid #27272a', borderRadius: '12px', padding: '16px', height: 'fit-content', position: 'sticky', top: '80px' }}>
          <h3 style={{ fontSize: '14px', color: '#f97316', marginBottom: '12px', marginTop: 0 }}>تصنيفات الأفلام</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {GENRES.map(g => (
              <button key={g.id} onClick={() => setHubGenre(g.id)} style={{ padding: '10px 12px', textAlign: 'right', backgroundColor: hubGenre === g.id ? '#f97316' : 'transparent', color: hubGenre === g.id ? '#000' : '#d4d4d8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: hubGenre === g.id ? 'bold' : 'normal' }}>
                {g.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '20px', borderRight: '4px solid #f97316', paddingRight: '10px' }}>قائمة الأفلام</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '14px' }}>
            {hubItems.map(item => (
              <div key={item.id} onClick={() => router.push(`/watch/${item.id}`)} style={{ backgroundColor: '#121215', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #27272a' }}>
                <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '10px' }}>
                  <h3 style={{ fontSize: '13px', color: '#fff', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', direction: 'ltr', textAlign: 'left' }}>{item.title}</h3>
                  <span style={{ fontSize: '12px', color: '#f97316', fontWeight: 'bold' }}>فيلم</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
