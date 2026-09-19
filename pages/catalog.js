import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';

export default function CatalogPage() {
  const router = useRouter();
  const { endpoint, genre, title } = router.query;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchCatalogData = async () => {
      try {
        setLoading(true);
        let results = [];

        if (endpoint === 'movie' && genre && genre !== '0') {
          // جلب الأفلام بناءً على التصنيف المختار
          const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre}&language=ar&sort_by=popularity.desc`);
          const data = await res.json();
          results = data.results || [];
        } else if (endpoint === 'movie') {
          // الأفلام العامة أو الأعلى تقييماً
          const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=ar`);
          const data = await res.json();
          results = data.results || [];
        } else {
          // افتراضي منوع (أفلام ومسلسلات)
          const [movieRes, tvRes] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre || '28'}&language=ar&sort_by=popularity.desc`),
            fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genre || '18'}&language=ar&sort_by=popularity.desc`)
          ]);
          const movieData = await movieRes.json();
          const tvData = await tvRes.json();
          results = [...(movieData.results || []), ...(tvData.results || [])].sort(() => 0.5 - Math.random());
        }

        setItems(results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching catalog:', error);
        setLoading(false);
      }
    };

    fetchCatalogData();
  }, [router.isReady, endpoint, genre]);

  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Head>
        <title>{title || 'قائمة الأعمال'} | سينما فايب</title>
      </Head>

      <style jsx global>{`
        html, body { margin: 0; padding: 0; background-color: #09090b; }
        * { box-sizing: border-box; }
      `}</style>

      {/* شريط التنقل العلوي */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', backgroundColor: 'rgba(9, 9, 11, 0.95)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#f97316', cursor: 'pointer' }} onClick={() => router.push('/')}>
          CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
        </h1>
        <button onClick={() => router.push('/')} style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#fff', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
          ← الرئيسية
        </button>
      </nav>

      {/* محتوى القائمة */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', borderRight: '4px solid #f97316', paddingRight: '12px', marginBottom: '24px' }}>
          {title || 'قائمة الأعمال'}
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#a1a1aa', fontSize: '16px' }}>
            جاري جلب الأعمال...
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#a1a1aa', fontSize: '16px' }}>
            لا توجد أعمال متاحة في هذه القائمة حالياً.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
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
                    backgroundColor: '#121215', 
                    borderRadius: '10px', 
                    overflow: 'hidden', 
                    cursor: 'pointer', 
                    border: '1px solid #27272a',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s'
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                    <img src={posterPath} alt={itemTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                      ★ {rating}
                    </span>
                  </div>
                  <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', direction: 'ltr', textAlign: 'left' }}>
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
        )}
      </div>
    </div>
  );
}
