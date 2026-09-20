import { useRouter } from 'next/router';

export default function Navbar({ activeTab, setActiveTab, onSearchClick }) {
  const router = useRouter();

  const handleNav = (tab, path) => {
    if (setActiveTab) {
      setActiveTab(tab);
    }
    router.push(path);
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '16px 24px', 
      backgroundColor: 'rgba(9, 9, 11, 0.95)', 
      backdropFilter: 'blur(12px)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      borderBottom: '1px solid rgba(255,255,255,0.08)' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <h1 
          style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#f97316', cursor: 'pointer' }} 
          onClick={() => handleNav('home', '/')}
        >
          CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
        </h1>
        <div style={{ display: 'flex', gap: '20px', fontSize: '15px', fontWeight: '600' }}>
          <span 
            style={{ color: activeTab === 'home' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} 
            onClick={() => handleNav('home', '/')}
          >
            الرئيسية
          </span>
          <span 
            style={{ color: activeTab === 'movies' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} 
            onClick={() => handleNav('movies', '/')}
          >
            الأفلام
          </span>
          <span 
            style={{ color: activeTab === 'tv' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} 
            onClick={() => handleNav('tv', '/')}
          >
            المسلسلات
          </span>
        </div>
      </div>
      
      {onSearchClick && (
        <button 
          onClick={onSearchClick} 
          style={{ background: 'none', border: 'none', color: '#f4f4f5', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
      )}
    </nav>
  );
}
