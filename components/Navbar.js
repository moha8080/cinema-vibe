import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Navbar({ activeTab, setActiveTab, onSearch }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    // إذا لم نكن في الصفحة الرئيسية، نعود إليها مع تحديد التاب المطلوب
    if (router.pathname !== '/') {
      router.push(`/?tab=${tab}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: '#121215',
      borderBottom: '1px solid #27272a',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }} dir="rtl">
      {/* الشعار */}
      <div 
        onClick={() => router.push('/')} 
        style={{ fontSize: '22px', fontWeight: 'bold', color: '#f97316', cursor: 'pointer', letterSpacing: '1px' }}
      >
        CINEMA VIBE
      </div>

      {/* روابط التنقل */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <button 
          onClick={() => handleNavClick('home')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'home' ? '#f97316' : '#d4d4d8',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: activeTab === 'home' ? 'bold' : 'normal'
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
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: activeTab === 'movies' ? 'bold' : 'normal'
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
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: activeTab === 'tv' ? 'bold' : 'normal'
          }}
        >
          المسلسلات
        </button>
      </div>

      {/* خانة البحث */}
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input 
          type="text" 
          placeholder="ابحث عن فيلم أو مسلسل..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            color: '#fff',
            outline: 'none',
            fontSize: '14px',
            width: '200px'
          }}
        />
        <button 
          type="submit"
          style={{
            padding: '8px 14px',
            backgroundColor: '#f97316',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          بحث
        </button>
      </form>
    </nav>
  );
}
