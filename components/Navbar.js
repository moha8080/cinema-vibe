import React from 'react';

export default function Navbar({ activeTab, setActiveTab, setSelectedGenre, setShowSearchModal, showSearchModal }) {
  return (
    <>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '12px 16px', // تقليص الهوامش الجانبية قليلاً لتناسب الشاشات الصغيرة
        backgroundColor: 'rgba(9, 9, 11, 0.85)', 
        backdropFilter: 'blur(16px)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        borderBottom: '1px solid rgba(255,255,255,0.08)' 
      }}>
        
        {/* قسم الشعار وروابط التنقل */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '20px', // تصغير حجم الشعار قليلاً ليناسب الجوال
            fontWeight: '900', 
            color: '#f97316', 
            letterSpacing: '0.5px', 
            cursor: 'pointer', 
            textShadow: '0 0 15px rgba(249,115,22,0.4)',
            whiteSpace: 'nowrap'
          }} onClick={() => { setActiveTab('home'); setSelectedGenre('all'); }}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>

          <div style={{ display: 'flex', gap: '12px', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>
            <span style={{ color: activeTab === 'home' ? '#f97316' : '#a1a1aa', cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => { setActiveTab('home'); setSelectedGenre('all'); }}>
              الرئيسية
            </span>
            <span style={{ color: activeTab === 'movies' ? '#f97316' : '#a1a1aa', cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => { setActiveTab('movies'); setSelectedGenre('all'); }}>
              الأفلام
            </span>
            <span style={{ color: activeTab === 'tv' ? '#f97316' : '#a1a1aa', cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => { setActiveTab('tv'); setSelectedGenre('all'); }}>
              المسلسلات
            </span>
          </div>
        </div>

        {/* زر البحث مع ضمان عدم انضغاطه أو قصره في الجوال */}
        <button 
          onClick={() => setShowSearchModal(!showSearchModal)}
          style={{ 
            background: 'rgba(255,255,255,0.06)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '50%', 
            width: '38px', 
            height: '38px', 
            minWidth: '38px', // لمنع تصغير الزر قسراً في الشاشات الضيقة
            color: '#f97316', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            transition: 'all 0.2s',
            flexShrink: 0 // منع انكماش الزر نهائياً
          }}
          aria-label="Search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </nav>
    </>
  );
}
