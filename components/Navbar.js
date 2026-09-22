import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Navbar({ activeTab, setActiveTab, onSearch, onOpenRecommendations }) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput);
      setSearchInput('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header style={{
      backgroundColor: '#121215',
      borderBottom: '1px solid #27272a',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* الشعار وروابط التنقل */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', flexWrap: 'wrap' }}>
          <h1 
            style={{ color: '#f97316', fontSize: '20px', fontWeight: 'bold', margin: 0, cursor: 'pointer' }} 
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
          >
            CINEMA<span style={{ color: '#fff' }}>VIBE</span>
          </h1>

          <nav style={{ display: 'flex', gap: '15px', fontSize: '14px', fontWeight: '600', alignItems: 'center', flexWrap: 'wrap' }}>
            <span 
              style={{ color: activeTab === 'home' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} 
              onClick={() => setActiveTab('home')}
            >
              الرئيسية
            </span>
            <span 
              style={{ color: activeTab === 'movies' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} 
              onClick={() => setActiveTab('movies')}
            >
              الأفلام
            </span>
            <span 
              style={{ color: activeTab === 'tv' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} 
              onClick={() => setActiveTab('tv')}
            >
              المسلسلات
            </span>
            <span 
              style={{ 
                color: '#000', 
                backgroundColor: '#f97316', 
                padding: '4px 10px', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontSize: '13px',
                fontWeight: 'bold'
              }} 
              onClick={onOpenRecommendations}
            >
              سهرتك علينا
            </span>
          </nav>
        </div>

        {/* خانة البحث */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '6px', width: '100%', maxWidth: '280px' }}>
          <input 
            type="text" 
            placeholder="ابحث..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ 
              flex: 1, 
              padding: '6px 12px', 
              borderRadius: '6px', 
              border: '1px solid #27272a', 
              backgroundColor: '#18181b', 
              color: '#fff', 
              outline: 'none',
              fontSize: '13px'
            }}
          />
          <button 
            type="submit" 
            style={{ 
              padding: '6px 12px', 
              backgroundColor: '#f97316', 
              color: '#000', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              fontSize: '13px'
            }}
          >
            بحث
          </button>
        </form>
      </div>
    </header>
  );
}
