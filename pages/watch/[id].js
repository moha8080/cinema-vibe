import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';

export default function WatchPage() {
  const router = useRouter();
  const { id } = router.query;
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentType, setContentType] = useState('movie');

  useEffect(() => {
    if (!router.isReady || !id) return;

    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=ar`)
      .then(res => {
        if (res.ok) {
          setContentType('movie');
          return res.json();
        } else {
          return fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=ar`)
            .then(tvRes => {
              setContentType('tv');
              return tvRes.json();
            });
        }
      })
      .then(data => {
        setMedia(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching media details:', err);
        setLoading(false);
      });
  }, [router.isReady, id]);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#09090b', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'system-ui, sans-serif' }}>
        جاري التحميل...
      </div>
    );
  }

  if (!media || media.status_code === 34) {
    return (
      <div style={{ backgroundColor: '#09090b', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '15px', fontFamily: 'system-ui, sans-serif' }}>
        <p>عذراً، العنوان غير موجود.</p>
        <button onClick={() => router.push('/')} style={{ backgroundColor: '#f97316', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#000' }}>الرئيسية</button>
      </div>
    );
  }

  const title = media.title || media.name;
  const overview = media.overview || 'لا توجد قصة متاحة    .';
  const rating = media.vote_average ? media.vote_average.toFixed(1) : 'N/A';
  const releaseDate = media.release_date || media.first_air_date || '';

  const embedUrl = contentType === 'movie' 
    ? `https://vidsrc.xyz/embed/movie?tmdb=${id}`
    : `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=1&episode=1`;

  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Head>
        <title>{title} | سينما فايب</title>
      </Head>

      {/* منع أي خطوط بيضاء بتثبيت لون الخلفية للصفحة بالكامل */}
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background-color: #09090b !important;
          color-scheme: dark;
        }
      `}</style>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'rgba(9, 9, 11, 0.95)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#f97316', cursor: 'pointer' }} onClick={() => router.push('/')}>
          CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
        </h1>
        <button onClick={() => router.push('/')} style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#fff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>الرئيسية</button>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #27272a', marginBottom: '24px' }}>
          <iframe 
            src={embedUrl} 
            style={{ width: '100%', height: '100%', border: 'none' }} 
            allowFullScreen 
            title={title}
          ></iframe>
        </div>

        <div style={{ backgroundColor: '#121215', padding: '24px', borderRadius: '12px', border: '1px solid #27272a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px',marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#fff', direction: 'ltr', textAlign: 'right' }}>{title}</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid #eab308', color: '#eab308', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                ★ {rating}
              </span>
              <span style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', border: '1px solid #f97316', color: '#f97316', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                {releaseDate.slice(0, 4)}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#a1a1aa', margin: 0 }}>
            {overview}
          </p>
        </div>
      </div>
    </div>
  );
}
