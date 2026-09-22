import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import MediaRow from '../components/MediaRow';
import MediaGrid from '../components/MediaGrid';

export default function Home() {
  const router = useRouter();
  const { view, search, recommendations } = router.query;

  const [currentView, setCurrentView] = useState('home');

  // أقسام الرئيسية
  const [trending, setTrending] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);

  // مكتبة الأفلام أو المسلسلات والتصنيفات
  const [libraryItems, setLibraryItems] = useState([]);
  const [libraryPage, setLibraryPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // البحث
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);

  // نافذة سهرتك من توصيتنا
  const [showRecModal, setShowRecModal] = useState(false);
  const [recType, setRecType] = useState('movie');
  const [recGenre, setRecGenre] = useState('28');
  const [recResults, setRecResults] = useState([]);
  const [isRecLoading, setIsRecLoading] = useState(false);

  const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';
  const BASE_URL = 'https://api.themoviedb.org/3';

  const genres = [
    { id: 'all', name: 'الكل' },
    { id: '28', name: 'أكشن' },
    { id: '27', name: 'رعب' },
    { id: '18', name: 'دراما' },
    { id: '35', name: 'كوميديا' },
    { id: '878', name: 'خيال علمي' },
    { id: '9648', name: 'غموض' },
    { id: '10749', name: 'رومنسي' },
    { id: '12', name: 'مغامرة' }
  ];

  // مزامنة الحالة مع الـ URL
  useEffect(() => {
    if (view === 'movies' || view === 'tv') {
      setCurrentView(view);
      setSearchResults(null);
    } else {
      setCurrentView('home');
    }

    if (search) {
      executeSearch(search);
    }

    if (recommendations === 'true') {
      setShowRecModal(true);
    }
  }, [view, search, recommendations]);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [resTrending, resTop, resTv, resHorror, resAction] = await Promise.all([
          fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=ar-SA`),
          fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=ar-SA`),
          fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=ar-SA`),
          fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ar-SA&with_genres=27`),
          fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ar-SA&with_genres=28`)
        ]);

        const [dTrending, dTop, dTv, dHorror, dAction] = await Promise.all([
          resTrending.json(), resTop.json(), resTv.json(), resHorror.json(), resAction.json()
        ]);

        if (dTrending.results) setTrending(dTrending.results);
        if (dTop.results) setTopMovies(dTop.results);
        if (dTv.results) setPopularTv(dTv.results);
        if (dHorror.results) setHorrorMovies(dHorror.results);
        if (dAction.results) setActionMovies(dAction.results);
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  useEffect(() => {
    if (currentView === 'home' || search) return;

    async function fetchLibraryData() {
      setLoading(true);
      try {
        const type = currentView === 'movies' ? 'movie' : 'tv';
        let url = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&language=ar-SA&page=1`;
        if (selectedGenre !== 'all') {
          url += `&with_genres=${selectedGenre}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.results) {
          setLibraryItems(data.results);
          setLibraryPage(1);
        }
      } catch (err) {
        console.error("Error fetching library:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLibraryData();
  }, [currentView, selectedGenre]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = libraryPage + 1;
      const type = currentView === 'movies' ? 'movie' : 'tv';
      let url = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&language=ar-SA&page=${nextPage}`;
      if (selectedGenre !== 'all') {
        url += `&with_genres=${selectedGenre}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.results) {
        setLibraryItems((prev) => [...prev, ...data.results]);
        setLibraryPage(nextPage);
      }
    } catch (err) {
      console.error("Error loading more:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // تنفيذ البحث
  const executeSearch = async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=ar-SA&query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data.results) {
        setSearchResults(data.results);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchNav = (query) => {
    router.push(`/?search=${encodeURIComponent(query)}`);
  };

  const changeTab = (tab) => {
    setSearchResults(null);
    setSelectedGenre('all');
    if (tab === 'home') {
      router.push('/');
    } else {
      router.push(`/?view=${tab}`);
    }
  };

  // جلب التوصيات الذكية لزر "سهرتك من توصيتنا"
  const fetchRecommendations = async () => {
    setIsRecLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/discover/${recType}?api_key=${API_KEY}&language=ar-SA&with_genres=${recGenre}&sort_by=vote_average.desc&vote_count.gte=200`);
      const data = await res.json();
      if (data && data.results) {
        setRecResults(data.results);
      }
    } catch (err) {
      console.error("Recommendation error:", err);
    } finally {
      setIsRecLoading(false);
    }
  };

  useEffect(() => {
    if (showRecModal) {
      fetchRecommendations();
    }
  }, [recType, recGenre, showRecModal]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: '#fff' }} dir="rtl">
      <Head>
        <title>سينما فيب - Cinema Vibe</title>
      </Head>

      <Navbar 
        activeTab={currentView}
        setActiveTab={changeTab}
        onSearch={handleSearchNav}
        onOpenRecommendations={() => setShowRecModal(true)}
      />

      {/* نافذة سهرتك من توصيتنا */}
      {showRecModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 2000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#121215', border: '1px solid #27272a', borderRadius: '12px',
            width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#f97316' }}>سهرتك من توصيتنا</h2>
              <button 
                onClick={() => { setShowRecModal(false); router.push('/'); }}
                style={{ background: 'none', border: 'none', color: '#a1a1aa', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                إغلاق X
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px' }}>نوع المحتوى:</label>
                <select 
                  value={recType} 
                  onChange={(e) => setRecType(e.target.value)}
                  style={{ backgroundColor: '#18181b', color: '#fff', border: '1px solid #27272a', padding: '8px 12px', borderRadius: '6px', outline: 'none' }}
                >
                  <option value="movie">أفلام</option>
                  <option value="tv">مسلسلات</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px' }}>التصنيف:</label>
                <select 
                  value={recGenre} 
                  onChange={(e) => setRecGenre(e.target.value)}
                  style={{ backgroundColor: '#18181b', color: '#fff', border: '1px solid #27272a', padding: '8px 12px', borderRadius: '6px', outline: 'none' }}
                >
                  {genres.filter(g => g.id !== 'all').map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {isRecLoading ? (
              <p style={{ textAlign: 'center', color: '#a1a1aa', padding: '30px' }}>جاري جلب أفضل التوصيات...</p>
            ) : (
              <MediaGrid items={recResults} />
            )}
          </div>
        </div>
      )}

      <main style={{ padding: '30px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        {searchResults ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>نتائج البحث</h2>
              <button onClick={() => router.push('/')} style={{ background: '#27272a', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>العودة للرئيسية</button>
            </div>
            <MediaGrid items={searchResults} />
          </div>
        ) : currentView === 'movies' || currentView === 'tv' ? (
          <div>
            <h2 style={{ fontSize: '22px', borderRight: '4px solid #f97316', paddingRight: '10px', margin: '0 0 20px 0' }}>
              {currentView === 'movies' ? 'مكتبة الأفلام الشاملة' : 'مكتبة المسلسلات الشاملة'}
            </h2>

            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '30px' }}>
              {genres.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGenre(g.id)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '20px',
                    border: '1px solid #27272a',
                    backgroundColor: selectedGenre === g.id ? '#f97316' : '#18181b',
                    color: selectedGenre === g.id ? '#000' : '#fff',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {g.name}
                </button>
              ))}
            </div>

            {loading && libraryItems.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#a1a1aa', marginTop: '50px' }}>جاري التحميل...</p>
            ) : (
              <>
                <MediaGrid items={libraryItems} />
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    style={{
                      padding: '12px 36px',
                      backgroundColor: '#f97316',
                      color: '#000',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      fontSize: '15px',
                      cursor: 'pointer',
                      opacity: isLoadingMore ? 0.6 : 1
                    }}
                  >
                    {isLoadingMore ? 'جاري التحميل...' : 'عرض المزيد'}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div>
            <MediaRow title="الأفلام والمسلسلات الرائجة" items={trending} onViewMore={() => changeTab('movies')} />
            <MediaRow title="أفضل الأفلام تقييماً" items={topMovies} onViewMore={() => changeTab('movies')} />
            <MediaRow title="المسلسلات الأكثر مشاهدة" items={popularTv} onViewMore={() => changeTab('tv')} />
            <MediaRow title="أفلام الأكشن والمغامرة" items={actionMovies} onViewMore={() => changeTab('movies')} />
            <MediaRow title="أفلام الرعب والتشويق" items={horrorMovies} onViewMore={() => changeTab('movies')} />
          </div>
        )}
      </main>

      <footer style={{ borderTop: '1px solid #27272a', padding: '24px 20px', textAlign: 'center', backgroundColor: '#09090b', color: '#71717a', fontSize: '13px', marginTop: '60px' }}>
        <p style={{ margin: 0 }}>جميع الحقوق محفوظة © 2026 CINEMA VIBE</p>
      </footer>
    </div>
  );
}
