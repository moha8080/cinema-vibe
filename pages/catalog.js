import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';

export default function Catalog() {
  const router = useRouter();
  const { endpoint, title } = router.query;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!endpoint) return;

    const fetchCatalogData = async () => {
      try {
        setLoading(true);
        let url = '';
        
        if (endpoint === 'top_rated') {
          url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=ar-SA&page=${page}`;
        } else {
          url = `https://api.themoviedb.org/3/trending/${endpoint}/day?api_key=${API_KEY}&language=ar-SA&page=${page}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        
        setItems(data.results || []);
        setTotalPages(data.total_pages > 500 ? 500 : (data.total_pages || 1));
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('Error fetching catalog:', error);
        setLoading(false);
      }
    };

    fetchCatalogData();
  }, [endpoint, page]);

  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Head>
        <title>{title || 'التصنيفات'} | CINEMAVIBE</title>
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
      `}</style>

      {/* شريط علوي ثابت */}
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
        <h1 
          style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#f97316', cursor: 'pointer' }} 
          onClick={() => router.push('/')}
        >
          CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
        </h1>
        <button 
          onClick={() => router.push('/')}
          style={{ backgroundColor: '#18181b', color: '#fff', border: '1px solid #27272a', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
        >
          الرئيسية 🏠
        </button>
      </nav>

      {/* محتوى الصفحة */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px 20px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#fff', marginBottom: '24px', borderRight: '4px solid #f97316', paddingRight: '12px' }}>
          {title || 'قائمة العروض'}
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#a1a1aa', fontSize: '16px' }}>جاري التحميل...</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#a1a1aa', fontSize: '16px' }}>لا توجد عناوين متاحة حالياً.</div>
        ) : (
          <>
            {/* شبكة متجاوبة بالكامل للكمبيوتر والجوال */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
              gap: '20px' 
            }}>
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
                      backgroundColor: '#121215', 
                      borderRadius: '12px', 
                      overflow: 'hidden', 
                      cursor: 'pointer', 
                      border: '1px solid #27272a',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = '#f97316'; }}
                    onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#27272a'; }}
                  >
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '2/3' }}>
                      <img src={poster} alt={itemTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                      <span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#eab308', padding: '3px 7px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                        ★ {rating}
                      </span>
                    </div>
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#fff', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {itemTitle}
                      </h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#a1a1aa' }}>
                        <span>{year}</span>
                        <span style={{ color: '#f97316', fontWeight: '600' }}>{endpoint === 'tv' ? 'مسلسل' : 'فيلم'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* أزرار التنقل بين الصفحات (Pagination) */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '40px', paddingBottom: '20px' }}>
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                style={{ 
                  backgroundColor: page === 1 ? '#18181b' : '#f97316', 
                  color: page === 1 ? '#52525b' : '#000', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  fontWeight: 'bold', 
                  cursor: page === 1 ? 'not-allowed' : 'pointer' 
                }}
              >
                ← السابق
              </button>
              <span style={{ fontSize: '14px', color: '#d4d4d8', fontWeight: 'bold' }}>
                صفحة {page} من {totalPages}
              </span>
              <button 
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                style={{ 
                  backgroundColor: page >= totalPages ? '#18181b' : '#f97316', 
                  color: page >= totalPages ? '#52525b' : '#000', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  fontWeight: 'bold', 
                  cursor: page >= totalPages ? 'not-allowed' : 'pointer' 
                }}
              >
                التالي →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
