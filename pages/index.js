import { useState, useEffect } from 'react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [activeServer, setActiveServer] = useState('vidsrc.to');

  useEffect(() => {
    async function loadData() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const res = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=ar-SA`);
        const data = await res.json();
        if (data.results) setItems(data.results);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ar-SA&query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.results) setItems(data.results);
    } catch (e) {
      console.error(e);
    }
  };

  // توليد رابط المشغل بناءً على السيرفر المختار
  const getEmbedUrl = () => {
    if (!selectedMedia) return '';
    const type = selectedMedia.media_type === 'tv' ? 'tv' : 'movie';
    const id = selectedMedia.id;

    if (activeServer === 'vidsrc.to') {
      return `https://vidsrc.to/embed/${type}/${id}`;
    } else if (activeServer === 'vidsrc.me') {
      return `https://vidsrc.me/embed/${type}?tmdb=${id}`;
    } else if (activeServer === 'embed.su') {
      return `https://embed.su/embed/${type}/${id}`;
    }
    return `https://vidsrc.to/embed/${type}/${id}`;
  };

  return (
    <div dir="rtl" style={{ backgroundColor: '#090d16', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #1e293b', paddingBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#a855f7' }}>Cinema Vibe | سينما فايب</h1>
          <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>عِش أجواءك السينمائية - أكثر من 30 ألف عمل بين يديك</p>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="ابحث عن فيلم أو مسلسل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#9333ea', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            بحث
          </button>
        </form>
      </header>

      {/* نافذة المشغل المتقدمة مع أزرار التبديل */}
      {selectedMedia && (
        <div style={{ marginBottom: '40px', backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ margin: 0, color: '#38bdf8' }}>{selectedMedia.title || selectedMedia.name}</h2>
            
            {/* خيارات أزرار السيرفرات */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>السيرفر:</span>
              <button 
                onClick={() => setActiveServer('vidsrc.to')} 
                style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'vidsrc.to' ? '#a855f7' : '#334155', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
                سيرفر 1
              </button>
              <button 
                onClick={() => setActiveServer('vidsrc.me')} 
                style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'vidsrc.me' ? '#a855f7' : '#334155', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
                سيرفر 2
              </button>
              <button 
                onClick={() => setActiveServer('embed.su')} 
                style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'embed.su' ? '#a855f7' : '#334155', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
                سيرفر 3
              </button>
              
              <button onClick={() => setSelectedMedia(null)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginRight: '15px' }}>
                ✕ إغلاق
              </button>
            </div>
          </div>

          <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
            <iframe
              src={getEmbedUrl()}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              allowFullScreen
              referrerPolicy="origin"
            ></iframe>
          </div>
        </div>
      )}

      <h2 style={{ fontSize: '20px', marginBottom: '20px', borderRight: '4px solid #a855f7', paddingRight: '10px' }}>
        {searchQuery ? `نتائج البحث عن: ${searchQuery}` : 'الأكثر شيوعاً هذا الأسبوع'}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
        {items.map((item) => {
          if (!item.poster_path) return null;
          return (
            <div
              key={item.id}
              onClick={() => { setSelectedMedia(item); setActiveServer('vidsrc.to'); }}
              style={{ backgroundColor: '#0f172a', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #1e293b' }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                style={{ width: '100%', height: '240px', objectFit: 'cover' }}
              />
              <div style={{ padding: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title || item.name}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                  <span>⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
                  <span>{(item.release_date || item.first_air_date || '').slice(0, 4)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
