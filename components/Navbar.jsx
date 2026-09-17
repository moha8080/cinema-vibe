import React from 'react';

export default function Navbar({ activeTab, setActiveTab, setSearchResults, setSelectedGenre, showSearchModal, setShowSearchModal, searchQuery, setSearchQuery, handleSearch }) {
  return (
    <>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: 'rgba(9, 9, 11, 0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#f97316', letterSpacing: '1px', cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setSearchResults(null); setSelectedGenre('all'); }}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>
          <div style={{ display: 'flex', gap: '16px', fontSize: '15px', fontWeight: '600' }}>
            <span style={{ color: activeTab === 'home' && !searchQuery ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setSearchResults(null); setSelectedGenre('all'); }}>
              الرئيسية
            </span>
            <span style={{ color: activeTab === 'movies' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('movies'); setSearchResults(null); setSelectedGenre('all'); }}>
              الأفلام
            </span>
            <span style={{ color: activeTab === 'tv' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => { setActiveTab('tv'); setSearchResults(null); setSelectedGenre('all'); }}>
              المسلسلات
            </span>
          </div>
        </div>

        {/* أيقونة البحث */}
        <button 
          onClick={() => setShowSearchModal(!showSearchModal)}
          style={{ background: 'none', border: 'none', color: '#f4f4f5', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          aria-label="Search"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </nav>

      {/* مربع البحث */}
      {showSearchModal && (
        <div style={{ padding: '16px 24px', backgroundColor: '#18181b', borderBottom: '1px solid #27272a' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', maxWidth: '600px', margin: '0 auto' }}>
            <input
              type="text"
              placeholder="ابحث عن فيلم أو مسلسل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#f97316', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
              بحث
            </button>
          </form>
        </div>
      )}
    </>
  );
}
