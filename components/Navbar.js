import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Navbar({ activeTab, setActiveTab, onSearch, onOpenRecommendations }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // تحديث التاب النشط بناءً على الـ Query Params عند تغير المسار
  useEffect(() => {
    if (router.query.tab && setActiveTab) {
      setActiveTab(router.query.tab);
    } else if (router.pathname === '/watch/[id]' && setActiveTab) {
      setActiveTab(''); // لا يوجد تاب رئيسي نشط في صفحة المشاهدة
    }
  }, [router.query.tab, router.pathname, setActiveTab]);

  const handleNavClick = (tab) => {
    if (setActiveTab) setActiveTab(tab);
    // التوجيه الذكي للصفحة الرئيسية مع تمرير التاب المطلوب لضمان عمله من أي مكان
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
    }
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 20px',
      backgroundColor: '#121215',
      borderBottom: '1px solid #27272a',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      flexWrap: 'wrap',
      gap: '12px'
    }} dir="rtl">
      
      {/* القسم الأيمن: الشعار وروابط التنقل الرئيسية */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        {/* الشعار */}
        <div 
          onClick={() => router.push('/')} 
          style={{ fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '1px', whiteSpace: 'nowrap' }}
        >
          <span style={{ color: '#f97316' }}>CINEMA</span> <span style={{ color: '#ffffff' }}>VIBE</span>
        </div>

        {/* روابط التنقل */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button 
            onClick={() => handleNavClick('home')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'home' ? '#f97316' : '#d4d4d8',
              fontSize: '15px',
              cursor: 'pointer',
              fontWeight: activeTab === 'home' ? 'bold' : 'normal',
              padding: '4px 0'
            }}
          >
            الرئيسية
          </button>

          <button 
            onClick={() => handleNavClick('movies')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'movies' ? '#f97316' : '#d4d4d8',
              fontSize: '15px',
              cursor: 'pointer',
              fontWeight: activeTab === 'movies' ? 'bold' : 'normal',
              padding: '4px 0'
            }}
          >
            الأفلام
          </button>

          <button 
            onClick={() => handleNavClick('tv')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'tv' ? '#f97316' : '#d4d4d8',
              fontSize: '15px',
              cursor: 'pointer',
              fontWeight: activeTab === 'tv' ? 'bold' : 'normal',
              padding: '4px 0'
            }}
          >
            المسلسلات
          </button>
        </div>
      </div>

      {/* القسم الأيسر: خانة البحث، زر التوصيات، والأيقونات المتجاوبة للجوال */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        
        {/* زر "سهرتك من توصيتنا" الجذاب */}
        <button
          onClick={onOpenRecommendations || (() => router.push('/?recommendations=true'))}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(249, 115, 22, 0.15)',
            color: '#f97316',
            border: '1px solid rgba(249, 115, 22, 0.4)',
            padding: '7px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s'
          }}
          title="سهرتك من توصيتنا - اختر التصنيف والمزاج لنقترح عليك الأفضل"
        >
          <span>🍿</span>
          <span className="rec-text">سهرتك من توصيتنا</span>
        </button>

        {/* مربع البحث لأجهزة الكمبيوتر */}
        <form onSubmit={handleSearchSubmit} className="desktop-search" style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="ابحث عن فيلم أو مسلسل..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              color: '#fff',
              outline: 'none',
              fontSize: '13px',
              width: '180px'
            }}
          />
          <button 
            type="submit"
            style={{
              padding: '7px 12px',
              backgroundColor: '#f97316',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '13px'
            }}
          >
            بحث
          </button>
        </form>

        {/* أيقونة البحث للجوالات والأيباد */}
        <div className="mobile-search-container" style={{ position: 'relative', display: 'none' }}>
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            style={{
              backgroundColor: '#f97316',
              color: '#fff',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            title="بحث"
          >
            🔍
          </button>

          {/* نافذة البحث المنبثقة للجوال عند النقر على الأيقونة */}
          {isMobileSearchOpen && (
            <form 
              onSubmit={handleSearchSubmit}
              style={{
                position: 'absolute',
                top: '45px',
                left: 0,
                backgroundColor: '#18181b',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #27272a',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                display: 'flex',
                gap: '6px',
                zIndex: 1100,
                width: '240px'
              }}
            >
              <input 
                type="text" 
                placeholder="ابحث هنا..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  backgroundColor: '#09090b',
                  border: '1px solid #27272a',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '13px',
                  width: '100%'
                }}
              />
              <button 
                type="submit"
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#f97316',
                  color: '#fff',
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
          )}
        </div>

      </div>

      {/* تنسيقات CSS مدمجة للتحكم بالتجاوب على الأجهزة الذكية */}
      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-search {
            display: none !important;
          }
          .mobile-search-container {
            display: block !important;
          }
          .rec-text {
            display: none; /* إخفاء النص الطويل في الشاشات الصغيرة جداً وإبقاء الأيقونة مع زر مميز أو اختصار */
          }
        }
      `}</style>
    </nav>
  );
}
