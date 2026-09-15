import { useState, useEffect } from 'react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [activeServer, setActiveServer] = useState('vidsrc.to');
  const [filterType, setFilterType] = useState('all'); // all, movie, tv

  // جلب البيانات بناءً على التصنيف المختار
  useEffect(() => {
    async function loadData() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) return;
        
        let endpoint = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=ar-SA`;
        if (filterType === 'movie') {
          endpoint = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ar-SA`;
        } else if (filterType === 'tv') {
          endpoint = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=ar-SA`;
        }

        const res = await fetch(endpoint);
        const data = await res.json();
        if (data && data.results) setItems(data.results);
      } catch (e) {
        console.error("Error loading data:", e);
      }
    }
    loadData();
  }, [filterType]);

  // البحث
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery || !searchQuery.trim()) return;
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ar-SA&query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.results) setItems(data.results);
    } catch (e) {
      console.error("Error searching:", e);
    }
  };

  // توليد رابط المشغل بناءً على السيرفر ونوع العمل
  const getEmbedUrl = () => {
    if (!selectedMedia) return '';
    const type = (selectedMedia.media_type === 'tv' || filterType === 'tv' || selectedMedia.first_air_date) ? 'tv' : 'movie';
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
    <div dir="rtl" style={{ backgroundColor: '#0c0a09', color: '#f5f5f4', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* الهيدر العلوي */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #292524', paddingBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#f97316', letterSpacing: '-0.5px' }}>
            CINEMA<span style={{ color: '#fff' }}>VIBE</span>
          </h1>
          <span style={{ backgroundColor: '#f97316', color: '#000', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>PRO</span>
        </div>

        {/* نموذج البحث */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flexGrow: 1, maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="ابحث عن فيلم أو مسلسل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid #44403c', backgroundColor: '#1c1917', color: '#fff', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#f97316', color: '#000', fontWeight: 'bold', cursor: 'pointer', whitespace: 'nowrap' }}>
            بحث
          </button>
        </form>
      </header>

      {/* شريط الأقسام / التصنيفات */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '1px solid #1c1917', paddingBottom: '15px' }}>
        <button
          onClick={() => { setFilterType('all'); setSearchQuery(''); }}
          style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: filterType === 'all' && !searchQuery ? '#f97316' : '#1c1917', color: filterType === 'all' && !searchQuery ? '#000' : '#a8a29e' }}
        >
          الكل 🔥
        </button>
        <button
          onClick={() => { setFilterType('movie'); setSearchQuery(''); }}
          style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: filterType === 'movie' && !searchQuery ? '#f97316' : '#1c1917', color: filterType === 'movie' && !searchQuery ? '#000' : '#a8a29e' }}
        >
          أفلام 🎬
        </button>
        <button
          onClick={() => { setFilterType('tv'); setSearchQuery(''); }}
          style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: filterType === 'tv' && !searchQuery ? '#f97316' : '#1c1917', color: filterType === 'tv' && !searchQuery ? '#000' : '#a8a29e' }}
        >
          مسلسلات 📺
        </button>
      </div>

      {/* نافذة المشغل المتقدمة */}
      {selectedMedia && (
        <div style={{ marginBottom: '40px', backgroundColor: '#1c1917', padding: '20px', borderRadius: '12px', border: '1px solid #78350f' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ margin: 0, color: '#ea580c', fontSize: '20px' }}>{selectedMedia.title || selectedMedia.name}</h2>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#a8a29e' }}>السيرفر:</span>
              <button 
                type="button"
                onClick={() => setActiveServer('vidsrc.to')} 
                style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'vidsrc.to' ? '#ea580c' : '#292524', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
                سيرفر 1
              </button>
              <button 
                type="button"
                onClick={() => setActiveServer('vidsrc.me')} 
                style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'vidsrc.me' ? '#ea580c' : '#292524', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
                سيرفر 2
              </button>
              <button 
                type="button"
                onClick={() => setActiveServer('embed.su')} 
                style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'embed.su' ? '#ea580c' : '#292524', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
                سيرفر 3
              </button>
              
              <button type="button" onClick={() => setSelectedMedia(null)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginRight: '15px' }}>
                ✕ إغلاق
              </button>
            </div>
          </div>

          <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', border: '1px solid #292524' }}>
            <iframe
              src={getEmbedUrl()}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              allowFullScreen
              referrerPolicy="origin"
            ></iframe>
          </div>
        </div>
      )}

      {/* عنوان المعرض */}
      <h2 style={{ fontSize: '20px', marginBottom: '20px', borderRight: '4px solid #f97316', paddingRight: '10px' }}>
        {searchQuery 
          ? `نتائج البحث عن: ${searchQuery}` 
          : filterType === 'movie' 
          ? 'الأفلام الأكثر شعبية' 
          : filterType === 'tv' 
          ? 'المسلسلات الأكثر شعبية' 
          : 'الأكثر شيوعاً هذا الأسبوع'}
      </h2>

      {/* شبكة الأعمال */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
        {items && items.map((item) => {
          if (!item || !item.poster_path) return null;
          return (
            <div
              key={item.id}
              onClick={() => { setSelectedMedia(item); setActiveServer('vidsrc.to'); }}
              style={{ 
                backgroundColor: '#1c1917', 
                borderRadius: '10px', 
                overflow: 'hidden', 
                cursor: 'pointer', 
                border: '1px solid #292524',
                transition: 'transform 0.2s',
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name || 'Poster'}
                style={{ width: '100%', height: '240px', objectFit: 'cover' }}
              />
              <div style={{ padding: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#f5f5f4' }}>
                  {item.title || item.name}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#a8a29e', marginTop: '8px' }}>
                  <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
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
