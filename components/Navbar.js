import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Navbar({ activeTab, setActiveTab, onSearch, onOpenRecommendations }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    if (router.query.tab && setActiveTab) {
      setActiveTab(router.query.tab);
    } else if (router.pathname === '/watch/[id]' && setActiveTab) {
      setActiveTab('');
    }
  }, [router.query.tab, router.pathname, setActiveTab]);

  const handleNavClick = (tab) => {
    if (setActiveTab) setActiveTab(tab);
    router.push(`/?tab=${tab}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        router.push(`/?search=${encodeURIComponent(searchQuery)}`);
      }
      setIsMobileSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleRecClick = () => {
    if (onOpenRecommendations) {
      onOpenRecommendations();
    } else {
      router.push('/?recommendations=true');
    }
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: '#121215',
      borderBottom: '1px solid #27272a',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      gap: '10px'
    }} dir="rtl">
      
      {/* الشعار وروابط التنقل الأساسية */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0 }}>
        <div 
          onClick={() => router.push('/')} 
          style={{ fontSize: '18px', fontWeight: '900', cursor: 'pointer', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}
        >
          <span style={{ color: '#f97316' }}>CINEMA</span> <span style={{ color: '#ffffff' }}>VIBE</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px', whiteSpace: 'nowrap' }}>
          <button 
            onClick={() => handleNavClick('home')}
            style={{
              background: 'none', border: 'none',
              color: activeTab === 'home' ? '#f97316' : '#d4d4d8',
              cursor: 'pointer', fontWeight: activeTab === 'home' ? 'bold' : 'normal', padding: 0
            }}
          >
            الرئيسية
          </button>
          <button 
            onClick={() => handleNavClick('movies')}
            style={{
              background: 'none', border: 'none',
              color: activeTab === 'movies' ? '#f97316' : '#d4d4d8',
              cursor: 'pointer', fontWeight: activeTab === 'movies' ? 'bold' : 'normal', padding: 0
            }}
          >
            الأفلام
          </button>
          <button 
            onClick={() => handleNavClick('tv')}
            style={{
              background: 'none', border: 'none',
              color: activeTab === 'tv' ? '#f97316' : '#d4d4d8',
              cursor: 'pointer', fontWeight: activeTab === 'tv' ? 'bold' : 'normal', padding: 0
            }}
          >
            المسلسلات
          </button>
        </div>
      </div>

      {/* الأدوات اليسرى: زر التوصيات، والبحث للكمبيوتر والجوال */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        
        {/* زر سهرتك من توصيتنا (بدون إيموجي وبإصلاح كامل للوظيفة) */}
        <button
          onClick={handleRecClick}
          style={{
            backgroundColor: 'rgba(249, 115, 22, 0.15)',
            color: '#f97316',
            border: '1px solid rgba(249, 115, 22, 0.4)',
            padding: '6px 10px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s'
          }}
        >
          سهرتك من توصيتنا
        </button>

        {/* خانة البحث للكمبيوتر والشاشات الكبيرة */}
        <form onSubmit={handleSearchSubmit} className="desktop-search" style={{ display: 'flex', gap: '6px' }}>
          <input 
            type="text" 
            placeholder="بحث..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              color: '#fff',
              outline: 'none',
              fontSize: '12px',
              width: '140px'
            }}
          />
          <button 
            type="submit"
            style={{
              padding: '6px 10px',
              backgroundColor: '#f97316',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}
          >
            بحث
          </button>
        </form>

        {/* زر تفعيل نافذة البحث للجوالات والأيباد */}
        <div className="mobile-search-wrapper" style={{ position: 'relative', display: 'none' }}>
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            style={{
              backgroundColor: '#f97316',
              color: '#000',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}
          >
            بحث
          </button>

          {/* القائمة المنبثقة للبحث على الجوال */}
          {isMobileSearchOpen && (
            <form 
              onSubmit={handleSearchSubmit}
              style={{
                position: 'absolute',
                top: '40px',
                left: 0,
                backgroundColor: '#18181b',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #27272a',
                boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                display: 'flex',
                gap: '6px',
                zIndex: 2000,
                width: '210px'
              }}
            >
              <input 
                type="text" 
                placeholder="ابحث هنا..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  backgroundColor: '#09090b',
                  border: '1px solid #27272a',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '12px',
                  width: '100%'
                }}
              />
              <button 
                type="submit"
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#f97316',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}
              >
                تأكيد
              </button>
            </form>
          )}
        </div>

      </div>

      {/* التنسيق التلقائي للشاشات الصغيرة لتجنب سوء التنسيق */}
      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-search {
            display: none !important;
          }
          .mobile-search-wrapper {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
