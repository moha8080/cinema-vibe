import { useState } from 'react';

export default function Navbar({ activeTab, setActiveTab, onSearchClick }) {
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '14px 20px', 
      backgroundColor: 'rgba(9, 9, 11, 0.95)', 
      backdropFilter: 'blur(10px)',
      position: 'sticky', 
      top: 0, 
      zIndex: 1000, 
      borderBottom: '1px solid rgba(255,255,255,0.08)' 
    }}>
      {/* الشعار وروابط التنقل */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <h1 
          style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#f97316', cursor: 'pointer', letterSpacing: '0.5px' }} 
          onClick={() => setActiveTab('home')}
        >
          CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
        </h1>
        
        <div style={{ display: 'flex', gap: '16px', fontSize: '14px', fontWeight: '600' }}>
          <span 
            style={{ color: activeTab === 'home' ? '#f97316' : '#a1a1aa', cursor: 'pointer', transition: 'color 0.2s' }} 
            onClick={() => setActiveTab('home')}
          >
            الرئيسية
          </span>
          <span 
            style={{ color: activeTab === 'movies' ? '#f97316' : '#a1a1aa', cursor: 'pointer', transition: 'color 0.2s' }} 
            onClick={() => setActiveTab('movies')}
          >
            الأفلام
          </span>
          <span 
            style={{ color: activeTab === 'tv' ? '#f97316' : '#a1a1aa', cursor: 'pointer', transition: 'color 0.2s' }} 
            onClick={() => setActiveTab('tv')}
          >
            المسلسلات
          </span>
        </div>
      </div>

      {/* زر البحث */}
      <button 
        onClick={onSearchClick} 
        style={{ 
          background: 'rgba(255,255,255,0.06)', 
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: '50%', 
          width: '38px', 
          height: '38px', 
          color: '#f97316', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          transition: 'background 0.2s'
        }}
        aria-label="بحث"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </nav>
  );
}
