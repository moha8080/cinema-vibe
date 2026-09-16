import React from 'react';

export default function Navbar({ activeTab, setActiveTab, setSelectedGenre, setShowSearchModal, showSearchModal }) {
  return (
    <>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 28px', backgroundColor: 'rgba(9, 9, 11, 0.85)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#f97316', letterSpacing: '1px', cursor: 'pointer', textShadow: '0 0 15px rgba(249,115,22,0.4)' }} onClick={() => { setActiveTab('home'); setSelectedGenre('all'); }}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>
          <div style={{ display: 'flex', gap: '18px', fontSize: '15px', fontWeight: '600' }}>
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

        <button 
          onClick={() => setShowSearchModal(!showSearchModal)}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '42px', height: '42px', color: '#f97316', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          aria-label="Search"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </nav>
    </>
  );
}
