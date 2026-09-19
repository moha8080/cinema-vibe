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
  
  // حالات المسلسلات (المواسم والحلقات)
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [seasonData, setSeasonData] = useState(null);
  
  // اختيار السيرفر
  const [activeServer, setActiveServer] = useState('vidsrc');

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchMediaDetails = async () => {
      setLoading(true);
      try {
        // جلب البيانات باللغة الإنجليزية لضمان العناوين الإنجليزية، ومع العربية لقصة العمل
        const [movieResEn, movieResAr] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=ar`)
        ]);

        if (movieResEn.ok) {
          const dataEn = await movieResEn.json();
          const dataAr = movieResAr.ok ? await movieResAr.json() : {};
          if (dataEn && dataEn.id) {
            setMedia({ ...dataEn, overview: dataAr.overview || dataEn.overview });
            setContentType('movie');
            setLoading(false);
            return;
          }
        }

        // إذا لم يكن فيلماً، نجرب كمسلسل (TV Show)
        const [tvResEn, tvResAr] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=ar`)
        ]);

        if (tvResEn.ok) {
          const dataEn = await tvResEn.json();
          const dataAr = tvResAr.ok ? await tvResAr.json() : {};
          if (dataEn && dataEn.id) {
            setMedia({ ...dataEn, overview: dataAr.overview || dataEn.overview });
            setContentType('tv');
            setLoading(false);
            return;
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching media details:', err);
        setLoading(false);
      }
    };

    fetchMediaDetails();
  }, [router.isReady, id]);

  // جلب تفاصيل الموسم للمسلسلات عند تغيير الموسم
  useEffect(() => {
    if (contentType === 'tv' && id) {
      fetch(`https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}&language=en-US`)
        .then(res => res.json())
        .then(data => {
          if (data && data.episodes) {
            setSeasonData(data);
          }
        })
        .catch(err => console.error('Error fetching season data:', err));
    }
  }, [contentType, id, selectedSeason]);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#09090b', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'system-ui, sans-serif' }}>
        جاري التحميل...
      </div>
    );
  }

  if (!media) {
    return (
      <div style={{ backgroundColor: '#09090b', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '15px', fontFamily: 'system-ui, sans-serif' }}>
        <p>عذراً، العنوان غير موجود.</p>
        <button onClick={() => router.push('/')} style={{ backgroundColor: '#f97316', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#000' }}>الرئيسية</button>
      </div>
    );
  }

  // فرض العنوان باللغة الإنجليزية حصراً
  const title = media.title || media.name || media.original_title || media.original_name || 'Title';
  const overview = media.overview || 'No overview available in Arabic.';
  const rating = media.vote_average ? media.vote_average.toFixed(1) : 'N/A';
  const releaseDate = media.release_date || media.first_air_date || '';

  // روابط السيرفرات المتعددة
  const getEmbedUrl = () => {
    if (contentType === 'movie') {
      if (activeServer === 'embed.su') return `https://embed.su/embed/movie/${id}`;
      if (activeServer === 'vidsrc.me') return `https://vidsrc.me/embed/movie?tmdb=${id}`;
      return `https://vidsrc.xyz/embed/movie?tmdb=${id}`;
    } else {
      if (activeServer === 'embed.su') return `https://embed.su/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`;
      if (activeServer === 'vidsrc.me') return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${selectedSeason}&episode=${selectedEpisode}`;
      return `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${selectedSeason}&episode=${selectedEpisode}`;
    }
  };

  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Head>
        <title>{title} | CINEMAVIBE</title>
      </Head>

      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background-color: #09090b !important;
          color-scheme: dark;
          overflow-x: hidden;
        }
        * { box-sizing: border-box; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* شريط التنقل العلوي */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', backgroundColor: 'rgba(9, 9, 11, 0.95)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#f97316', cursor: 'pointer' }} onClick={() => router.push('/')}>
          CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
        </h1>
        <button onClick={() => router.push('/')} style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#fff', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
          ← الرئيسية
        </button>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        
        {/* مشغل الفيديو */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #27272a', marginBottom: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <iframe 
            src={getEmbedUrl()} 
            style={{ width: '100%', height: '100%', border: 'none' }} 
            allowFullScreen 
            title={title}
          ></iframe>
        </div>

        {/* اختيار السيرفرات */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', flexWrap: 'wrap', backgroundColor: '#121215', padding: '12px 16px', borderRadius: '10px', border: '1px solid #27272a' }}>
          <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 'bold' }}>سيرفرات المشاهدة:</span>
          {['vidsrc', 'embed.su', 'vidsrc.me'].map((server) => (
            <button
              key={server}
              onClick={() => setActiveServer(server)}
              style={{
                backgroundColor: activeServer === server ? '#f97316' : '#27272a',
                color: activeServer === server ? '#000' : '#fff',
                border: '1px solid #27272a',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              سيرفر {server.toUpperCase()}
            </button>
          ))}
        </div>

        {/* قسم المواسم والحلقات (يظهر للمسلسلات بضمان كامل) */}
        {(contentType === 'tv' || (media.seasons && media.seasons.length > 0)) && (
          <div style={{ backgroundColor: '#121215', padding: '20px', borderRadius: '12px', border: '1px solid #27272a', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', color: '#fff', margin: '0 0 12px 0', borderRight: '3px solid #f97316', paddingRight: '8px' }}>
              Select Season & Episode
            </h3>
            
            {/* أزرار المواسم */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '16px' }} className="no-scrollbar">
              {(media.seasons || [{ season_number: 1, id: 1 }]).filter(s => s.season_number > 0).map((season) => (
                <button
                  key={season.id || season.season_number}
                  onClick={() => {
                    setSelectedSeason(season.season_number);
                    setSelectedEpisode(1);
                  }}
                  style={{
                    backgroundColor: selectedSeason === season.season_number ? '#f97316' : '#18181b',
                    color: selectedSeason === season.season_number ? '#000' : '#fff',
                    border: '1px solid #27272a',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Season {season.season_number}
                </button>
              ))}
            </div>

            {/* أزرار الحلقات */}
            {seasonData && seasonData.episodes && (
              <div>
                <div style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '8px' }}>Episodes:</div>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }} className="no-scrollbar">
                  {seasonData.episodes.map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => setSelectedEpisode(ep.episode_number)}
                      style={{
                        backgroundColor: selectedEpisode === ep.episode_number ? '#eab308' : '#18181b',
                        color: selectedEpisode === ep.episode_number ? '#000' : '#fff',
                        border: '1px solid #27272a',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        minWidth: '45px',
                        flexShrink: 0
                      }}
                    >
                      {ep.episode_number}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* تفاصيل العمل (العنوان بالإنجليزية حصراً) */}
        <div style={{ backgroundColor: '#121215', padding: '24px', borderRadius: '12px', border: '1px solid #27272a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '26px', fontWeight: '900', margin: '0 0 4px 0', color: '#fff', direction: 'ltr', textAlign: 'left' }}>
                {title}
              </h2>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid #eab308', color: '#eab308', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ★ {rating}
              </span>
              <span style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', border: '1px solid #f97316', color: '#f97316', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', direction: 'ltr' }}>
                {releaseDate.slice(0, 4)}
              </span>
              <span style={{ backgroundColor: '#27272a', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold' }}>
                {contentType === 'movie' ? 'Movie' : 'TV Show'}
              </span>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #27272a', margin: '16px 0' }} />

          <h4 style={{ fontSize: '14px', color: '#f97316', margin: '0 0 8px 0' }}>Overview:</h4>
          <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#d4d4d8', margin: 0 }}>
            {overview}
          </p>
        </div>

      </div>
    </div>
  );
}
