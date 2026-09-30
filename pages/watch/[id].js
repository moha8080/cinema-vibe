import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import TopAd from '../../components/TopAd';

export default function WatchPage() {
  const router = useRouter();
  const { id, type } = router.query; // type: movie أو tv

  const [mediaData, setMediaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeServer, setActiveServer] = useState('server1');

  const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';
  const BASE_URL = 'https://api.themoviedb.org/3';

  // جلب تفاصيل الفيلم أو المسلسل من TMDB
  useEffect(() => {
    if (!id) return;
    async function fetchMediaDetails() {
      try {
        const mediaType = type || 'movie';
        const res = await fetch(`${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}&language=ar-SA`);
        const data = await res.json();
        setMediaData(data);
      } catch (err) {
        console.error("Error fetching media details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMediaDetails();
  }, [id, type]);

  // روابط السيرفرات
  const server1Url = `https://vidsrc.xyz/embed/${type === 'tv' ? 'tv' : 'movie'}?tmdb=${id}`;
  const server2Url = 'https://down.vidtube.one/embed-x178a3y5r14b.html'; // 🟠 السيرفر الجديد

  // استخراج سنة الإصدار فقط من تاريخ الإصدار (release_date أو first_air_date)
  const releaseDate = mediaData?.release_date || mediaData?.first_air_date || '';
  const releaseYear = releaseDate ? releaseDate.split('-')[0] : '';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: '#fff' }} dir="rtl">
      <Head>
        <title>{mediaData ? `${mediaData.title || mediaData.name} - سينما فيب` : 'مشاهدة - سينما فيب'}</title>
      </Head>

      {/* الإعلانات التلقائية في الخلفية */}
      <TopAd scriptUrl="https://pl31594020.profitableratecpmnetwork.com/da/b7/ad/dab7adf74b77570bc2d0a3ec039ee972.js" />
      <TopAd scriptUrl="https://pl31594021.profitableratecpmnetwork.com/b7/d3/55/b7d3559c02d1ccf97d09a94d3dfe9899.js" />

      {/* تم إصلاح الروابط واستجابة الناف بار بالكامل */}
      <div style={{ position: 'relative', zIndex: 1000 }}>
        <Navbar 
          activeTab="home"
          setActiveTab={(tab) => {
            if (tab === 'home') router.push('/');
            else router.push(`/?view=${tab}`);
          }}
          onSearch={(query) => router.push(`/?search=${encodeURIComponent(query)}`)}
          onOpenRecommendations={() => router.push('/?recommendations=true')}
        />
      </div>

      <main style={{ padding: '30px 20px', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#a1a1aa', marginTop: '50px' }}>جاري تحميل تفاصيل العرض...</p>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <h1 style={{ fontSize: '22px', margin: 0, color: '#fff', borderRight: '4px solid #f97316', paddingRight: '10px' }}>
                {mediaData?.title || mediaData?.name} {releaseYear ? `(${releaseYear})` : ''}
              </h1>
              
              {/* زر العودة الفعال */}
              <button 
                onClick={() => router.push('/')}
                style={{
                  backgroundColor: '#27272a',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  transition: '0.2s'
                }}
              >
                العودة للرئيسية
              </button>
            </div>

            {/* أزرار التبديل بين السيرفرات */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', color: '#a1a1aa', fontWeight: 'bold' }}>اختر سيرفر المشاهدة:</span>
              
              <button
                onClick={() => setActiveServer('server1')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #27272a',
                  backgroundColor: activeServer === 'server1' ? '#f97316' : '#18181b',
                  color: activeServer === 'server1' ? '#000' : '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: '0.2s'
                }}
              >
                سيرفر 1 (الأساسي)
              </button>

              <button
                onClick={() => setActiveServer('server2')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #27272a',
                  backgroundColor: activeServer === 'server2' ? '#f97316' : '#18181b',
                  color: activeServer === 'server2' ? '#000' : '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: '0.2s'
                }}
              >
                سيرفر 2 (VidTube السريع)
              </button>
            </div>

            {/* مشغل الفيديو (Iframe) */}
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', // نسبة 16:9
              backgroundColor: '#121215',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #27272a',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
              <iframe
                src={activeServer === 'server1' ? server1Url : server2Url}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allowFullScreen
              />
            </div>

            <p style={{ fontSize: '12px', color: '#71717a', textAlign: 'center', marginTop: '12px' }}>
              إذا واجهتك أي مشكلة في التشغيل أو توقف السيرفر الأول، يمكنك الضغط على "سيرفر 2" للمشاهدة بدون تقطيع.
            </p>

            {/* نبذة عن الفيلم/المسلسل */}
            {mediaData?.overview && (
              <div style={{ marginTop: '30px', backgroundColor: '#121215', padding: '20px', borderRadius: '12px', border: '1px solid #27272a' }}>
                <h3 style={{ fontSize: '16px', color: '#f97316', marginBottom: '10px' }}>قصة العرض</h3>
                <p style={{ fontSize: '14px', color: '#d1d5db', lineHeight: '1.6', margin: 0 }}>{mediaData.overview}</p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer style={{ borderTop: '1px solid #27272a', padding: '24px 20px', textAlign: 'center', backgroundColor: '#09090b', color: '#71717a', fontSize: '13px', marginTop: '50px' }}>
        <p style={{ margin: 0 }}>جميع الحقوق محفوظة © 2026 CINEMA VIBE</p>
      </footer>
    </div>
  );
}
