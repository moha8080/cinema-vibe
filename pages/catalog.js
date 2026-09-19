import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';

export default function CatalogPage() {
  const router = useRouter();
  const { endpoint, genre, title } = router.query;
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!endpoint) return;
    const fetchCatalog = async () => {
      try {
        let url = `https://api.themoviedb.org/3/${endpoint}?api_key=${API_KEY}&language=en-US&page=1`;
        if (genre && genre !== '0') {
          url += `&with_genres=${genre}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setItems(data.results || []);
      } catch (err) {
        console.error('Catalog fetch error:', err);
      }
    };
    fetchCatalog();
  }, [endpoint, genre]);

  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', padding: '24px' }}>
      <Head><title>{title || 'قائمة العروض'} | سينما فايب</title></Head>

      <button onClick={() => router.push('/')} style={{ marginBottom: '20px', backgroundColor: '#27272a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
        ← العودة للرئيسية
      </button>

      <h2 style={{ fontSize: '22px', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '20px' }}>{title || 'قائمة العروض'}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '14px' }}>
        {items.map(item => (
          <div key={item.id} onClick={() => router.push(`/watch/${item.id}`)} style={{ backgroundColor: '#121215', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #27272a' }}>
            <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title || item.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '10px' }}>
              <h3 style={{ fontSize: '13px', color: '#fff', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', direction: 'ltr', textAlign: 'left' }}>{item.title || item.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
