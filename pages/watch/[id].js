import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../../components/Navbar';

export default function WatchPage() {
  const router = useRouter();
  const { id, type } = router.query;

  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mediaType, setMediaType] = useState('movie');

  const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';
  const BASE_URL = 'https://api.themoviedb.org/3';

  useEffect(() => {
    if (!id) return;
    const detectedType = type || 'movie';
    setMediaType(detectedType);

    async function fetchMediaDetails() {
      try {
        const res = await fetch(`${BASE_URL}/${detectedType}/${id}?api_key=${API_KEY}&language=ar-SA`);
        const data = await res.json();
        if (data && !data.success) {
          setMedia(data);
        }
      } catch (err) {
        console.error("Error fetching media details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMediaDetails();
  }, [id, type]);

  // رابط السيرفر عالي الدقة
  const embedUrl = mediaType === 'tv' 
    ? `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=1&episode=1` 
    : `https://vidsrc.xyz/embed/movie?tmdb=${id}`;

  if (loading) {
    return (
      <div style={{ backgroundColor: '#09090b', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }} dir="rtl">
        <p>جاري تحميل محتوى الشاشة...</p>
      </div>
    );
  }

  const title = media?.title || media?.name || 'مشاهدة العمل';
  const overview = media?.overview || 'لا توجد نبذة تعريفية متاحة باللغة العربية لهذا العمل حالياً.';

  return (
    <div style={{ backgroundColor: '#09090b', color: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }} dir="rtl">
      <Head>
        <title>{title} - سينما فيب</title>
      </Head>

      {/* شريط التنقل العلوي */}
      <Navbar 
        activeTab={mediaType === 'movie' ? 'movies' : 'tv'}
        setActiveTab={(tab) => {
          if (tab === 'home') router.push('/');
          else if (tab === 'movies') router.push('/');
          else if (tab === 'tv') router.push('/');
        }}
        onSearchClick={() => router.push('/')}
      />

      <div style={{ padding: '30px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* زر العودة */}
        <button 
          onClick={() => router.back()}
          style={{ 
            backgroundColor: '#18181b', 
            color: '#fff', 
            border: '1px solid #27272a', 
            padding: '8px 16px', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            marginBottom: '20px',
            fontWeight: 'bold'
          }}
        >
          ← عودة للخلف
        </button>

        {/* مشغل الفيديو */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          aspectRatio: '16/9', 
          backgroundColor: '#000', 
          borderRadius: '12px', 
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
          marginBottom: '30px',
          border: '1px solid #27272a'
        }}>
          <iframe 
            src={embedUrl} 
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
            title={title}
          />
        </div>

        {/* معلومات العمل والقصة */}
        <div style={{ backgroundColor: '#121215', padding: '24px', borderRadius: '12px', border: '1px solid #27272a' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '12px', color: '#f97316' }}>{title}</h1>
          
          <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#a1a1aa', marginBottom: '20px' }}>
            <span>⭐ التقييم: {media?.vote_average ? media.vote_average.toFixed(1) : 'N/A'}</span>
            <span>📅 تاريخ الإصدار: {media?.release_date || media?.first_air_date || 'غير متوفر'}</span>
            <span style={{ textTransform: 'uppercase', backgroundColor: '#27272a', padding: '2px 8px', borderRadius: '4px', color: '#fff' }}>
              {mediaType === 'movie' ? 'فيلم' : 'مسلسل'}
            </span>
          </div>

          <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#fff' }}>القصة:</h3>
          <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#d4d4d8', margin: 0 }}>{overview}</p>
        </div>

      </div>
    </div>
  );
}
