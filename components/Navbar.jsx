export default function Navbar({ activeTab, setActiveTab, showSearchModal, setShowSearchModal, setSearchQuery, searchQuery, handleSearch }) {
  return (
    <>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: 'rgba(9, 9, 11, 0.95)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#f97316', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>
          <div style={{ display: 'flex', gap: '16px', fontSize: '15px', fontWeight: '600' }}>
            <span style={{ color: activeTab === 'home' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>الرئيسية</span>
            <span style={{ color: activeTab === 'movies' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => setActiveTab('movies')}>الأفلام</span>
            <span style={{ color: activeTab === 'tv' ? '#f97316' : '#a1a1aa', cursor: 'pointer' }} onClick={() => setActiveTab('tv')}>المسلسلات</span>
          </div>
        </div>

        <button onClick={() => setShowSearchModal(!showSearchModal)} style={{ background: 'none', border: 'none', color: '#f4f4f5', cursor: 'pointer' }}>
          🔍
        </button>
      </nav>

      {showSearchModal && (
        <div style={{ padding: '16px 24px', backgroundColor: '#18181b', borderBottom: '1px solid #27272a' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', maxWidth: '600px', margin: '0 auto' }}>
            <input
              type="text"
              placeholder="ابحث عن فيلم أو مسلسل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff' }}
            />
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#f97316', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>بحث</button>
          </form>
        </div>
      )}
    </>
  );
}
