import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import HomeContent from './HomeContent';
import Footer from './Footer';

// (يمكنك الاحتفاظ بمكون MediaGrid هنا أو نقله بملف مستقل واستدعائه)

export default function Home() {
  // ... (نفس الـ States والـ Functions الموجودة لديك تماماً بدون أي تغيير)
  // ...
  
  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* تنسيقات التجاوب الذكية */}
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background-color: #09090b;
          overflow-x: hidden;
        }
        * {
          box-sizing: border-box;
        }
        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 12px;
        }
        .poster-img {
          height: 190px;
        }
        .hero-banner {
          height: 360px;
        }
        @media (min-width: 768px) {
          .media-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 20px;
          }
          .poster-img {
            height: 270px;
          }
          .hero-banner {
            height: 480px;
          }
        }
      `}</style>

      {/* 1. Navbar العلوي */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSearchResults={setSearchResults}
        setSelectedGenre={setSelectedGenre}
        showSearchModal={showSearchModal}
        setShowSearchModal={setShowSearchModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      {/* 2. صفحة المشاهدة المخصصة */}
      {activeTab === 'watch' && selectedMedia ? (
        <div style={{ padding: '20px 24px', maxWidth: '1100px', margin: '0 auto' }}>
          {/* ... (نفس كود صفحة المشاهدة الخاص بك كما هو) ... */}
        </div>
      ) : searchResults ? (
        /* 3. نتائج البحث */
        <div style={{ padding: '20px 24px' }}>
          <h2 style={{ fontSize: '20px', borderRight: '4px solid #f97316', paddingRight: '10px', marginBottom: '20px' }}>نتائج البحث</h2>
          <MediaGrid items={searchResults} onSelect={openWatchPage} />
        </div>
      ) : activeTab === 'movies' || activeTab === 'tv' ? (
        /* 4. المكتبة الشاملة للأفلام والمسلسلات */
        <div style={{ padding: '20px 24px' }}>
          {/* ... (نفس كود المكتبة الخاص بك كما هو) ... */}
        </div>
      ) : (
        /* 5. الصفحة الرئيسية المليئة بالقوائم المتعددة */
        <HomeContent 
          heroItem={heroItem}
          trending={trending}
          heroIndex={heroIndex}
          setHeroIndex={setHeroIndex}
          openWatchPage={openWatchPage}
          topMovies={topMovies}
          popularTv={popularTv}
          horrorData={horrorData}
          dramaData={dramaData}
          actionData={actionData}
          comedyData={comedyData}
          scifiData={scifiData}
          mysteryData={mysteryData}
          romanceData={romanceData}
          adventureData={adventureData}
          setActiveTab={setActiveTab}
          setSelectedGenre={setSelectedGenre}
        />
      )}

      {/* 6. الفوتر */}
      <Footer />

    </div>
  );
}
