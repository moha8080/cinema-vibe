import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';

export default function WatchPage() {
  const router = useRouter();
  const { id } = router.query;

  const [media, setMedia] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // خاص بالمسلسلات (المواسم والحلقات)
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  
  // سيرفرات المشاهدة
  const [serverType, setServerType] = useState('vidsrc');

  useEffect(() => {
    if (!id) return;

    const fetchMediaDetails = async () => {
      try {
        setLoading(true);
        // محاولة جلب البيانات كفيلم أولاً
        let res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=ar-SA`);
        let data = await res.json();

        let isTvShow = false;
        if (data.success === false) {
          // إذا لم يكن فيلم، جربه كمسلسل TV
          res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=ar-SA`);
          data = await res.json();
          isTvShow = true;
        }

        setMedia({ ...data, isTvShow });

        if (isTvShow && data.seasons) {
          // تصفية المواسم الصالحة
          const validSeasons = data.seasons.filter(s => s.season_number > 0);
          setSeasons(validSeasons);
          if (validSeasons.length > 0) {
            setSelectedSeason(validSeasons[0].season_number);
          }
        }

        // جلب طاقم العمل والأعمال المشابهة
        const typePath = isTvShow ? 'tv' : 'movie';
        const [creditsRes, similarRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/${typePath}/${id}/credits?api_key=${API_KEY}&language=ar-SA`),
          fetch(`https://api.themoviedb.org/3/${typePath}/${id}/similar?api_key=${API_KEY}&language=ar-SA`)
        ]);

        const creditsData = await creditsRes.json();
        const similarData = await similarRes.json();

        setCast(creditsData.cast?.slice(0, 10) || []);
        setSimilar(similarData.results?.slice(0, 6) || []);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('Error fetching details:', error);
        setLoading(false);
      }
    };

    fetchMediaDetails();
  }, [id]);

  // جلب الحلقات عند تغيير الموسم للمسلسلات
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
      <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px' }}>
        جاري تحميل التفاصيل...
      </div>
    );
  }

  if (!media || media.success === false) {
    return (
      <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        <h2>العنوان غير موجود أو حدث خطأ في التحميل.</h2>
        <button onClick={() => router.push('/')} style={{ backgroundColor: '#f97316', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>العودة للرئيسية</button>
      </div>
    );
  }

  const title = media.title || media.name;
  const year = (media.release_date || media.first_air_date || '').slice(0, 4);
  const rating = media.vote_average ? media.vote_average.toFixed(1) : 'N/A';
  const backdropUrl = media.backdrop_path ? `https://image.tmdb.org/t/p/original${media.backdrop_path}` : '';

  // توليد روابط المشاهدة بناءً على نوع السيرفر
  let embedUrl = '';
  if (!media.isTvShow) {
    embedUrl = serverType === 'vidsrc' 
      ? `https://vidsrc.xyz/embed/movie?imdb=${media.imdb_id || id}`
      : `https://iframe.mediadelivery.net/embed/movie/${id}`; // كخيار بديل مستقر
  } else {
    embedUrl = `https://vidsrc.xyz/embed/tv?imdb=${media.imdb_id || id}&season=${selectedSeason}&episode=${selectedEpisode}`;
  }

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
      `}</style>

      {/* شريط التنقل العلوي الثابت */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '14px 24px', 
        backgroundColor: 'rgba(9, 9, 11, 0.95)', 
        backdropFilter: 'blur(10px)',
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        borderBottom: '1px solid rgba(255,255,255,0.08)' 
      }}>
        <h1 
          style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#f97316', cursor: 'pointer' }} 
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

      {/* خلفية بانر خافتة */}
      {backdropUrl && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '400px', backgroundImage: `url(${backdropUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.3)', zIndex: 0, pointerEvents: 'none' }} />
      )}

      {/* المحتوى الرئيسي */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', position: 'relative', zIndex: 1 }}>

        {/* عنوان العمل ومعلوماته */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#fff', margin: '0 0 10px 0' }}>{title}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', fontSize: '13px', color: '#d4d4d8' }}>
            <span style={{ backgroundColor: '#f97316', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>★ {rating}</span>
            <span>{year}</span>
            <span>•</span>
            <span>{media.isTvShow ? 'مسلسل تلفزيوني' : 'فيلم سينمائي'}</span>
            {media.runtime && <span>• {media.runtime} دقيقة</span>}
          </div>
        </div>

        {/* مشغل الفيديو (متجاوب 16:9) */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #27272a', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', marginBottom: '20px' }}>
          <iframe 
            src={embedUrl} 
            style={{ width: '100%', height: '100%', border: 'none' }} 
            allowFullScreen 
            title={title}
          />
        </div>

        {/* اختيار المواسم والحلقات (إذا كان مسلسلاً) */}
        {media.isTvShow && (
          <div style={{ backgroundColor: '#121215', padding: '16px', borderRadius: '12px', border: '1px solid #27272a', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px' }}>اختر الموسم:</label>
              <select 
                value={selectedSeason} 
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                style={{ backgroundColor: '#18181b', color: '#fff', border: '1px solid #27272a', padding: '8px 12px', borderRadius: '8px', outline: 'none', cursor: 'pointer' }}
              >
                {seasons.map(s => (
                  <option key={s.id} value={s.season_number}>الموسم {s.season_number}</option>
                ))}
              </select>
            </div>

            <div style={{ flexGrow: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px' }}>اختر الحلقة:</label>
              <select 
                value={selectedEpisode} 
                onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                style={{ width: '100%', backgroundColor: '#18181b', color: '#fff', border: '1px solid #27272a', padding: '8px 12px', borderRadius: '8px', outline: 'none', cursor: 'pointer' }}
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

        {/* قصة الفيلم/المسلسل */}
        <div style={{ backgroundColor: '#121215', padding: '20px', borderRadius: '12px', border: '1px solid #27272a', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', color: '#f97316', margin: '0 0 10px 0' }}>قصة العمل</h3>
          <p style={{ fontSize: '14px', color: '#d4d4d8', lineHeight: '1.7', margin: 0 }}>
            {media.overview || 'لا توجد نبذة تعريفية متوفرة لهذا العنوان باللغة العربية.'}
          </p>
        </div>

        {/* طاقم التمثيل */}
        {cast.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '14px', borderRight: '4px solid #f97316', paddingRight: '10px' }}>طاقم التمثيل</h3>
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }} className="no-scrollbar">
              {cast.map(actor => (
                <div key={actor.id} style={{ minWidth: '100px', maxWidth: '100px', textAlign: 'center', flexShrink: 0 }}>
                  <img 
                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Image'} 
                    alt={actor.name} 
                    style={{ width: '100px', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '6px', border: '1px solid #27272a' }} 
                  />
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{actor.name}</div>
                  <div style={{ fontSize: '10px', color: '#a1a1aa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{actor.character}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* أعمال مشابهة */}
        {similar.length > 0 && (
          <div>
            <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '14px', borderRight: '4px solid #f97316', paddingRight: '10px' }}>أعمال مشابهة قد تعجبك</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
              {similar.map(item => {
                const itemTitle = item.title || item.name;
                const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
                return (
                  <div 
                    key={item.id} 
                    onClick={() => router.push(`/watch/${item.id}`)}
                    style={{ backgroundColor: '#121215', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #27272a' }}
                  >
                    <img src={poster} alt={itemTitle} style={{ width: '100%', height: '210px', objectFit: 'cover' }} />
                    <div style={{ padding: '8px' }}>
                      <h4 style={{ fontSize: '12px', margin: '0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>{itemTitle}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
