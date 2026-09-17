import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// استدعاء باقي الأقسام...

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* هيدر وبحث مستقل تماماً */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        showSearchModal={showSearchModal} 
        setShowSearchModal={setShowSearchModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* محتوى الصفحة المتغير */}
      <div style={{ flex: 1 }}>
        {activeTab === 'home' && <div>محتوى الرئيسية هنا...</div>}
        {activeTab === 'movies' && <div>محتوى الأفلام هنا...</div>}
        {activeTab === 'privacy' && <div>محتوى سياسة الخصوصية هنا...</div>}
        {activeTab === 'contact' && <div>محتوى اتصل بنا هنا...</div>}
      </div>

      {/* فوتر مستقل تماماً */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
