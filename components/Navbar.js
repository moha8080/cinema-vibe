import { useState } from 'react';

export default function Navbar({ activeTab, setActiveTab, onSearch, onOpenRecommendations }) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput);
      setSearchInput('');
    }
  };

  return (
    <header dir="rtl" style={{
      backgroundColor: '#121215',
      borderBottom: '1px solid #27272a',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 16px',
      textAlign: 'right'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        
        {/* الصف الأول: الشعار وزر سهرتك علينا */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', direction: 'rtl' }}>
          <h1 
            style={{ color: '#f97316', fontSize: '20px', fontWeight: 'bold', margin: 0, cursor: 'pointer' }} 
            onClick={() => setActiveTab('home')}
          >
            CINEMA<span style={{ color: '#fff' }}>VIBE</span>
          </h1>

          <button 
            onClick={onOpenRecommendations}
            style={{ 
              color: '#000', 
              backgroundColor: '#f97316', 
              padding: '6px 12px', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontSize: '12px',
              fontWeight: 'bold',
              border: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            سهرتك علينا
          </button>
        </div>

        {/* الصف الثاني: روابط التنقل وشريط البحث */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%', 
          gap: '10px', 
          flexWrap: 'wrap',
          paddingTop: '6px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          direction: 'rtl'
        }}>
          <nav style={{ display: 'flex', gap: '15px', fontSize: '13px', fontWeight: '600', alignItems: 'center' }}>
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
          </nav>

          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '6px', flex: '1', minWidth: '200px', maxWidth: '320px' }}>
            <input 
              type="text" 
              placeholder="ابحث..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ 
                flex: 1, 
                padding: '6px 10px', 
                borderRadius: '6px', 
                border: '1px solid #27272a', 
                backgroundColor: '#18181b', 
                color: '#fff', 
                outline: 'none',
                fontSize: '12px',
                textAlign: 'right'
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
                fontSize: '12px'
              }}
            >
              بحث
            </button>
          </form>
        </div>

      </div>
    </header>
  );
}
