import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';

export default function WatchPage() {
  const router = useRouter();
  const { id, type } = router.query;

  const [media, setMedia] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        let mediaType = type || 'movie';

        let res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${API_KEY}&language=ar-SA`);
        let data = await res.json();

        if (data.success === false) {
          mediaType = 'tv';
          res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=ar-SA`);
          data = await res.json();
        }

        const isTv = mediaType === 'tv';
        setMedia({ ...data, isTvShow: isTv });

        if (isTv && data.seasons) {
          const validSeasons = data.seasons.filter(s => s.season_number > 0);
          setSeasons(validSeasons);
          if (validSeasons.length > 0) {
            setSelectedSeason(validSeasons[0].season_number);
          }
        }

        const creditsRes = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${API_KEY}&language=ar-SA`);
        const creditsData = await creditsRes.json();

        setCast(creditsData.cast?.filter(actor => actor.profile_path).slice(0, 12) || []);
        
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('Error fetching details:', error);
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, type]);

  useEffect(() => {
    if (media?.isTvShow && selectedSeason) {
      fetch(`https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}&language=ar-SA`)
        .then(res => res.json())
        .then(data => {
          setEpisodes(data.episodes || []);
          if (data.episodes?.length > 0) {
            setSelectedEpisode(data.episodes[0].episode_number);
          }
        })
        .catch(err => console.error('Error fetching episodes:', err));
    }
  }, [selectedSeason, media, id]);

  if (loading) {
    return (
      <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px' }}>
        جاري تحميل التفاصيل...
      </div>
    );
  }

  if (!media || media.success === false) {
    return (
      <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '20px', textAlign: 'center' }}>
        <h2>عذراً، العنوان غير متوفر أو حدث خطأ أثناء الجلب.</h2>
        <button onClick={() => router.push('/')} style={{ backgroundColor: '#f97316', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>العودة للرئيسية</button>
      </div>
    );
  }

  const title = media.title || media.name;
  const year = (media.release_date || media.first_air_date || '').slice(0, 4);
  const rating = media.vote_average ? media.vote_average.toFixed(1) : 'N/A';

  const embedUrl = !media.isTvShow 
    ? `https://vidsrc.xyz/embed/movie?imdb=${media.imdb_id || id}`
    : `https://vidsrc.xyz/embed/tv?imdb=${media.imdb_id || id}&season=${selectedSeason}&episode=${selectedEpisode}`;

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
        <h1 
          style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#f97316', cursor: 'pointer' }} 
          onClick={() => router.push('/')}
        >
          CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
        </h1>
        <button 
          onClick={() => router.push('/')}
          style={{ backgroundColor: '#18181b', color: '#fff', border: '1px solid #27272a', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
        >
          الرئيسية 🏠
        </button>
      </nav>

      {/* محتوى الصفحة */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 16px', position: 'relative', zIndex: 1 }}>

        {/* العنوان والمعلومات الأساسية */}
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', margin: '0 0 8px 0' }}>{title}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', fontSize: '13px', color: '#d4d4d8' }}>
            <span style={{ backgroundColor: '#f97316', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>★ {rating}</span>
            <span>{year}</span>
            <span>•</span>
            <span>{media.isTvShow ? 'مسلسل تلفزيوني' : 'فيلم سينمائي'}</span>
            {media.runtime && <span>• {media.runtime} دقيقة</span>}
          </div>
        </div>

        {/* مشغل الفيديو */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #27272a', boxShadow: '0 8px 25px rgba(0,0,0,0.7)', marginBottom: '16px' }}>
          <iframe 
            src={embedUrl} 
            style={{ width: '100%', height: '100%', border: 'none' }} 
            allowFullScreen 
            title={title}
          />
        </div>

        {/* اختيار المواسم والحلقات للمسلسلات */}
        {media.isTvShow && (
          <div style={{ backgroundColor: '#121215', padding: '14px', borderRadius: '10px', border: '1px solid #27272a', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <div style={{ minWidth: '130px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#a1a1aa', marginBottom: '4px' }}>الموسم:</label>
              <select 
                value={selectedSeason} 
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                style={{ width: '100%', backgroundColor: '#18181b', color: '#fff', border: '1px solid #27272a', padding: '8px', borderRadius: '6px', outline: 'none', cursor: 'pointer', fontSize: '13px' }}
              >
                {seasons.map(s => (
                  <option key={s.id} value={s.season_number}>الموسم {s.season_number}</option>
                ))}
              </select>
            </div>

            <div style={{ flexGrow: 1, minWidth: '180px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#a1a1aa', marginBottom: '4px' }}>الحلقة:</label>
              <select 
                value={selectedEpisode} 
                onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                style={{ width: '100%', backgroundColor: '#18181b', color: '#fff', border: '1px solid #27272a', padding: '8px', borderRadius: '6px', outline: 'none', cursor: 'pointer', fontSize: '13px' }}
              >
                {episodes.map(ep => (
                  <option key={ep.id} value={ep.episode_number}>
                    الحلقة {ep.episode_number}: {ep.name || `الحلقة ${ep.episode_number}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* قصة العمل */}
        <div style={{ backgroundColor: '#121215', padding: '16px', borderRadius: '10px', border: '1px solid #27272a', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', color: '#f97316', margin: '0 0 8px 0' }}>قصة العمل</h3>
          <p style={{ fontSize: '13px', color: '#d4d4d8', lineHeight: '1.6', margin: 0 }}>
            {media.overview || 'لا توجد نبذة تعريفية متوفرة لهذا العنوان.'}
          </p>
        </div>

        {/* طاقم التمثيل */}
        {cast.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '12px', borderRight: '4px solid #f97316', paddingRight: '8px' }}>طاقم التمثيل</h3>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }} className="no-scrollbar">
              {cast.map(actor => (
                <div key={actor.id} style={{ minWidth: '90px', maxWidth: '90px', textAlign: 'center', flexShrink: 0 }}>
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} 
                    alt={actor.name} 
                    style={{ width: '90px', height: '130px', objectFit: 'cover', borderRadius: '6px', marginBottom: '4px', border: '1px solid #27272a' }} 
                  />
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{actor.name}</div>
                  <div style={{ fontSize: '10px', color: '#a1a1aa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{actor.character}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
