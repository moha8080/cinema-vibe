import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import MediaGrid from './components/MediaGrid';
import Footer from './components/Footer';

const API_KEY = 'YOUR_TMDB_API_KEY'; // ضع مفتاح الـ API الخاص بك هنا

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  const [trending, setTrending] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // أقسام الأفلام والمسلسلات
  const [topMovies, setTopMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  const [horrorData, setHorrorData] = useState([]);
  const [dramaData, setDramaData] = useState([]);
  const [actionData, setActionData] = useState([]);
  const [comedyData, setComedyData] = useState([]);
  const [scifiData, setSciFiData] = useState([]);
  const [mysteryData, setMysteryData] = useState([]);
  const [romanceData, setRomanceData] = useState([]);
  const [adventureData, setAdventureData] = useState([]);

  const [selectedGenre, setSelectedGenre] = useState('all');
  const [catalogItems, setCatalogItems] = useState([]);

  // جلب البيانات عند بدء التشغيل
  useEffect(() => {
    const fetchData = async () => {
      try {
        const lang = '&language=ar-SA';
        
        // 1. الرائج (Trending)
        const trendRes = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}${lang}`);
        const trendData = await trendRes.json();
        setTrending(trendData.results || []);

        // 2. أفضل الأفلام
        const topRes = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}${lang}`);
        const topData = await topRes.json();
        setTopMovies(topData.results || []);

        // 3. المسلسلات الشهيرة
        const tvRes = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}${lang}`);
        const tvData = await tvRes.json();
        setPopularTv(tvData.results || []);

        // 4. التصنيفات الخاصة (رعب، دراما، أكشن، إلخ)
        const fetchGenre = async (genreId, setter) => {
          const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}${lang}`);
          const data = await res.json();
          setter(data.results || []);
        };

        fetchGenre('27', setHorrorData);
        fetchGenre('18', setDramaData);
        fetchGenre('28', setActionData);
        fetchGenre('35', setComedyData);
        fetchGenre('878', setSciFiData);
        fetchGenre('9648', setMysteryData);
        fetchGenre('10749', setRomanceData);
        fetchGenre('12', setAdventureData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // تغيير البانر تلقائياً
  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(trending.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [trending]);

  // جلب محتوى صفحة الأفلام أو المسلسلات عند التبديل
  useEffect(() => {
    const fetchCatalog = async () => {
      const type = activeTab === 'tv' ? 'tv' : 'movie';
      let url = `https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&language=ar-SA`;
      if (selectedGenre !== 'all') {
        url += `&with_genres=${selectedGenre}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setCatalogItems(data.results || []);
    };

    if (activeTab === 'movies' || activeTab === 'tv') {
      fetchCatalog();
    }
  }, [activeTab, selectedGenre]);

  // دالة البحث
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&language=ar-SA`);
      const data = await res.json();
      setSearchResults(data.results || []);
      setShowSearchModal(false);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  // فتح صفحة المشاهدة
  const openWatchPage = (item) => {
    setSelectedMedia(item);
    setActiveTab('watch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heroItem = trending[heroIndex];

  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* تنسيقات متجاوبة للشاشات */}
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background-color: #09090b;
          overflow-x: hidden;
        }
        * { box-sizing: border-box; }
        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 12px;
        }
        .poster-img { height: 190px; }
        .hero-banner { height: 360px; }
        @media (min-width: 768px) {
          .media-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 20px;
          }
          .poster-img { height: 270px; }
          .hero-banner { height: 480px; }
        }
      `}</style>

      {/* 1. الشريط العلوي */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSearchResults={setSearchResults}
        setSelectedGenre={setSelectedGenre}
        showSearchModal={showSearchModal}
        setShowSearchModal={setShowSearchModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      {/* 2. المحتوى بناءً على الصفحة النشطة */}
      {activeTab === 'watch' && selectedMedia ? (
        <div style={{ padding: '30px 24px', maxWidth: '1000px', margin: '0 auto' }}>
          <button onClick={() => setActiveTab('home')} style={{ marginBottom: '20px', backgroundColor: '#27272a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            ← العودة للرئيسية
          </button>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f97316', marginBottom: '15px' }}>
            {selectedMedia.title || selectedMedia.name}
          </h2>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #27272a' }}>
            <iframe 
              src={`https://vidsrc.me/embed/${selectedMedia.media_type === 'tv' || selectedMedia.first_air_date ? 'tv' : 'movie'}?tmdb=${selectedMedia.id}`} 
              style={{ width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
              title="مشغل الفيديو"
            />
          </div>
          <p style={{ marginTop: '20px', lineHeight: '1.6', color: '#d4d4d8' }}>{selectedMedia.overview}</p>
        </div>
      ) : searchResults ? (
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>نتائج البحث</h2>
            <button onClick={() => setSearchResults(null)} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontWeight: 'bold' }}>إلغاء البحث</button>
          </div>
          <MediaGrid items={searchResults} onSelect={openWatchPage} />
        </div>
      ) : activeTab === 'movies' || activeTab === 'tv' ? (
        <div style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '22px', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '20px' }}>
            {activeTab === 'movies' ? 'مكتبة الأفلام' : 'مكتبة المسلسلات'}
          </h2>
          <MediaGrid items={catalogItems} onSelect={openWatchPage} />
        </div>
      ) : (
        <>
          {/* 3. البانر الرئيسي */}
          <HeroBanner 
            heroItem={heroItem} 
            trending={trending} 
            heroIndex={heroIndex} 
            setHeroIndex={setHeroIndex} 
            openWatchPage={openWatchPage} 
          />

          {/* 4. الأقسام المختلفة في الرئيسية */}
          <div style={{ padding: '24px' }}>
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '16px' }}>أفضل الأفلام تقييماً</h2>
              <MediaGrid items={topMovies} onSelect={openWatchPage} />
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '16px' }}>المسلسلات الأكثر مشاهدة</h2>
              <MediaGrid items={popularTv} onSelect={openWatchPage} />
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '16px' }}>أفلام الرعب</h2>
              <MediaGrid items={horrorData} onSelect={openWatchPage} />
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '16px' }}>أفلام الأكشن</h2>
              <MediaGrid items={actionData} onSelect={openWatchPage} />
            </section>
          </div>
        </>
      )}

      {/* 5. الفوتر */}
      <Footer />

    </div>
  );
}
