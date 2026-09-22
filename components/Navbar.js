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
    <>
      <style jsx>{`
        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          gap: 15px;
        }
        .nav-links {
          display: flex;
          gap: 20px;
          font-size: 14px;
          font-weight: 600;
          align-items: center;
        }
        .search-form {
          display: flex;
          gap: 6px;
          width: 260px;
        }
        
        /* تنسيق خاص للجوال والشاشات الصغيرة */
        @media (max-width: 768px) {
          .navbar-container {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .nav-top-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
          .nav-bottom-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            gap: 10px;
            padding-top: 4px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
          }
          .nav-links {
            gap: 12px;
            font-size: 13px;
          }
          .search-form {
            width: 100%;
            flex: 1;
          }
        }
      `}</style>

      <header style={{
        backgroundColor: '#121215',
        borderBottom: '1px solid #27272a',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '12px 16px'
      }}>
        <div className="navbar-container">
          
          {/* شاشات سطح المكتب / الصف الأول في الجوال */}
          <div className="nav-top-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
              <h1 
                style={{ color: '#f97316', fontSize: '20px', fontWeight: 'bold', margin: 0, cursor: 'pointer' }} 
                onClick={() => setActiveTab('home')}
              >
                CINEMA<span style={{ color: '#fff' }}>VIBE</span>
              </h1>

              {/* الروابط تظهر هنا في الديسكتوب وتختفي في الجوال لتنتقل للأسفل */}
              <div className="desktop-links" style={{ display: 'flex' }}>
                <nav className="nav-links">
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
              </div>
            </div>

            {/* زر سهرتك علينا (بارز ومرتب) */}
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

          {/* الصف الثاني للجوال (يحتوي روابط التصفح السريع ومربع البحث) */}
          <div className="nav-bottom-row" style={{ display: 'none' }}>
            <nav className="nav-links">
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

            <form onSubmit={handleSearchSubmit} className="search-form">
              <input 
                type="text" 
                placeholder="ابحث عن فيلم أو مسلسل..." 
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
                  fontSize: '12px'
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

          {/* مربع البحث للديسكتوب */}
          <div className="desktop-search" style={{ display: 'flex' }}>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input 
                type="text" 
                placeholder="ابحث عن فيلم أو مسلسل..." 
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

        </div>

        {/* كود CSS لتفعيل وتوزيع العناصر بناء على حجم الشاشة بدقة */}
        <style jsx>{`
          @media (max-width: 768px) {
            .desktop-links { display: none !important; }
            .desktop-search { display: none !important; }
            .nav-bottom-row { display: flex !important; }
          }
          @media (min-width: 769px) {
            .nav-bottom-row { display: none !important; }
            .desktop-links { display: flex !important; }
            .desktop-search { display: flex !important; }
          }
        `}</style>
      </header>
    </>
  );
}
