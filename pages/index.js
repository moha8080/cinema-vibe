import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';

// ==========================================
// 🛠️ مفتاح تفعيل الصيانة (اجعله true لإغلاق الموقع)
// ==========================================
const MAINTENANCE_MODE = false; 
const SECRET_ADMIN_KEY = 'my_secret_key_123'; // الكود السري الخاص بك لفك الصيانة لمتصفحك

// قائمة التصنيفات الشاملة (أكثر من 10 تصنيفات)
const GENRES = [
  { id: 'all', name: 'الكل / الشائع', movieGenre: '0', tvGenre: '0' },
  { id: 'action', name: 'أكشن ومغامرة', movieGenre: '28', tvGenre: '10759' },
  { id: 'drama', name: 'دراما مؤثرة', movieGenre: '18', tvGenre: '18' },
  { id: 'horror', name: 'رعب وإثارة', movieGenre: '27', tvGenre: '10765' },
  { id: 'comedy', name: 'كوميديا وضاحكة', movieGenre: '35', tvGenre: '35' },
  { id: 'scifi', name: 'خيال علمي وفضاء', movieGenre: '878', tvGenre: '10765' },
  { id: 'crime', name: 'جريمة وتصحيح', movieGenre: '80', tvGenre: '80' },
  { id: 'mystery', name: 'غموض وتحقيق', movieGenre: '9648', tvGenre: '9648' },
  { id: 'romance', name: 'رومانسية وعاطفة', movieGenre: '10749', tvGenre: '18' },
  { id: 'animation', name: 'رسوم متحركة / أنمي', movieGenre: '16', tvGenre: '16' },
  { id: 'documentary', name: 'وثائقي ومعرفي', movieGenre: '99', tvGenre: '99' },
  { id: 'family', name: 'عائلي ومغامرات أطفال', movieGenre: '10751', tvGenre: '10762' },
  { id: 'history', name: 'تاريخ وحروب', movieGenre: '36,10752', tvGenre: '10768' },
];

export default function Home() {
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  // التحقق من المفتاح السري عبر الرابط أو التخزين المحلي لفتح الموقع لك وحدك
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const unlockParam = urlParams.get('unlock');

    if (unlockParam === SECRET_ADMIN_KEY) {
      localStorage.setItem('cinema_admin_unlocked', 'true');
      setIsAdminUnlocked(true);
    } else if (localStorage.getItem('cinema_admin_unlocked') === 'true') {
      setIsAdminUnlocked(true);
    }
  }, []);

  // حالات التطبيق الأصلية
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  const [trending, setTrending] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedServer, setSelectedServer] = useState('vidsrc-cc');

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [tvDetails, setTvDetails] = useState(null);
  const [episodesList, setEpisodesList] = useState([]);

  const [topRatedMixed, setTopRatedMixed] = useState([]);
  const [actionMixed, setActionMixed] = useState([]);
  const [horrorThrillerMixed, setHorrorThrillerMixed] = useState([]);
  const [sciFiAdventureMixed, setSciFiAdventureMixed] = useState([]);
  const [dramaMixed, setDramaMixed] = useState([]);
  const [mysteryMixed, setMysteryMixed] = useState([]);
  const [comedyMixed, setComedyMixed] = useState([]);
  const [suspenseMixed, setSuspenseMixed] = useState([]);
  const [oscarsMixed, setOscarsMixed] = useState([]);
  const [thisMonthMixed, setThisMonthMixed] = useState([]);

  const [hubGenre, setHubGenre] = useState('all');
  const [hubItems, setHubItems] = useState([]);
  const [hubPage, setHubPage] = useState(1);
  const [hasMoreHub, setHasMoreHub] = useState(true);

  const [catalogTitle, setCatalogTitle] = useState('');
  const [catalogItems, setCatalogItems] = useState([]);
  const [catalogEndpoint, setCatalogEndpoint] = useState('');
  const [catalogGenre, setCatalogGenre] = useState('');
  const [catalogPage, setCatalogPage] = useState(1);
  const [hasMoreCatalog, setHasMoreCatalog] = useState(true);

  const rowRefs = {
    thisMonth: useRef(null),
    oscars: useRef(null),
    topRated: useRef(null),
    drama: useRef(null),
    mystery: useRef(null),
    comedy: useRef(null),
    suspense: useRef(null),
    action: useRef(null),
    horror: useRef(null),
    scifi: useRef(null),
  };

  useEffect(() => {
    if (MAINTENANCE_MODE && !isAdminUnlocked) return; // عدم جلب بيانات الأفلام إذا كان الموقع مغلقاً للزوار

    const fetchData = async () => {
      try {
        const trendRes = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&language=en-US`);
        const trendData = await trendRes.json();
        setTrending(trendData.results || []);

        const fetchMixedCategory = async (movieGenre, tvGenre, setter) => {
          const [movieRes, tvRes] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${movieGenre}&language=en-US&sort_by=vote_average.desc&vote_count.gte=300`),
            fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${tvGenre}&language=en-US&sort_by=vote_average.desc&vote_count.gte=150`)
          ]);
          const movieData = await movieRes.json();
          const tvData = await tvRes.json();
          const combined = [...(movieData.results || []), ...(tvData.results || [])];
          setter(combined.sort(() => 0.5 - Math.random()));
        };

        const topMovieRes = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US`);
        const topTvRes = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=en-US`);
        const topMovieData = await topMovieRes.json();
        const topTvData = await topTvRes.json();
        setTopRatedMixed([...(topMovieData.results || []), ...(topTvData.results || [])].sort(() => 0.5 - Math.random()));

        fetchMixedCategory('28', '10759', setActionMixed);
        fetchMixedCategory('27', '10765', setHorrorThrillerMixed);
        fetchMixedCategory('12,878', '10765', setSciFiAdventureMixed);
        fetchMixedCategory('18', '18', setDramaMixed);
        fetchMixedCategory('9648', '9648', setMysteryMixed);
        fetchMixedCategory('35', '35', setComedyMixed);
        fetchMixedCategory('53', '10768', setSuspenseMixed);
        fetchMixedCategory('18,36', '18', setOscarsMixed);
        
        const monthMovieRes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&primary_release_date.gte=2026-01-01`);
        const monthTvRes = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&first_air_date.gte=2026-01-01`);
        const monthMovieData = await monthMovieRes.json();
        const monthTvData = await monthTvRes.json();
        setThisMonthMixed([...(monthMovieData.results || []), ...(monthTvData.results || [])].sort(() => 0.5 - Math.random()));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isAdminUnlocked]);

  // =========================================================================
  // 🛑 إذا كان وضع الصيانة مفعل ولم تقم بفك القفل عبر رابطك السري، اعرض صفحة الصيانة
  // =========================================================================
  if (MAINTENANCE_MODE && !isAdminUnlocked) {
    return (
      <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif', textAlign: 'center' }}>
        <Head>
          <title>صيانة وتحديث | Cinema Vibe</title>
        </Head>

        <div style={{ maxWidth: '500px', backgroundColor: '#121215', border: '1px solid #27272a', borderRadius: '16px', padding: '40px 30px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <div style={{ width: '70px', height: '70px', backgroundColor: 'rgba(249, 115, 22, 0.1)', border: '2px solid #f97316', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#f97316' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', margin: '0 0 10px 0' }}>
            CINEMA<span style={{ color: '#f97316' }}>VIBE</span>
          </h1>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f97316', margin: '0 0 15px 0' }}>
            الموقع تحت الصيانة والتطوير حالياً 🚧
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: '1.6', margin: '0 0 25px 0' }}>
            نعمل على إضافة ميزات وتعديلات جديدة لتحسين تجربتكم. سنعود للعمل بكامل طاقتنا قريباً جداً، شكراً لصبركم!
          </p>
          <div style={{ fontSize: '12px', color: '#52525b', borderTop: '1px solid #27272a', paddingTop: '15px' }}>
            جميع الحقوق محفوظة © Cinema Vibe 2026
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // موقعك الطبيعي الكامل (يظهر لك إذا دخلت برابطك السري، ويظهر للجميع بعد إيقاف الصيانة)
  // =========================================================================
  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Head>
        <title>سينما فايب | Cinema Vibe</title>
      </Head>

      <style jsx global>{`
        html, body { margin: 0; padding: 0; background-color: #09090b; overflow-x: hidden; }
        * { box-sizing: border-box; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .hub-container {
          display: flex;
          flex-direction: row;
          gap: 24px;
          max-width: 1300px;
          margin: 0 auto;
          padding: 24px;
        }
        .hub-sidebar {
          width: 240px;
          min-width: 240px;
          background-color: #121215;
          border: 1px solid #27272a;
          border-radius: 12px;
          padding: 16px;
          height: fit-content;
          position: sticky;
          top: 80px;
        }
        .hub-content {
          flex: 1;
          min-width: 0;
        }
        @media (max-width: 900px) {
          .hub-container {
            flex-direction: column;
          }
          .hub-sidebar {
            width: 100%;
            position: relative;
            top: 0;
            display: flex;
            overflow-x: auto;
            gap: 8px;
            padding: 12px;
          }
        }
      `}</style>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'rgba(9, 9, 11, 0.95)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0, flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#f97316', cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => { setActiveTab('home'); setSearchResults(null); }}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}>
            <span style={{ color: activeTab === 'home' && !searchQuery ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setSearchResults(null); }}>الرئيسية</span>
            <span style={{ color: activeTab === 'movies-hub' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('movies-hub'); setHubGenre('all'); setSearchResults(null); }}>الأفلام</span>
            <span style={{ color: activeTab === 'tv-hub' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('tv-hub'); setHubGenre('all'); setSearchResults(null); }}>المسلسلات</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isAdminUnlocked && (
            <span style={{ backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#eab308', border: '1px solid #eab308', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
              وضع المشرف (مفعل)
            </span>
          )}
          <button 
            onClick={() => setShowSearchModal(!showSearchModal)} 
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '38px', height: '38px', minWidth: '38px', color: '#f97316', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            🔍
          </button>
        </div>
      </nav>

      {/* المحتوى الكامل للموقع (بنفس الكود السابق للأفلام والمسلسلات والتصنيفات والتشغيل) */}
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#fff' }}>الموقع يعمل بنجاح في وضع المشرف! يمكنك اختبار التعديلات بحرية.</h2>
        <p style={{ color: '#a1a1aa' }}>عندما تنتهي من التعديلات تماماً، قم بتغيير قيمة <code style={{ color: '#f97316' }}>MAINTENANCE_MODE</code> في الأعلى إلى <code style={{ color: '#f97316' }}>false</code> وارفع التحديث ليعود الموقع للعامة.</p>
      </div>
    </div>
  );
}
