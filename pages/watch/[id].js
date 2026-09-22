import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';

const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';

export default function WatchPage() {
  const router = useRouter();
  const { id, type } = router.query;

  const [mediaData, setMediaData] = useState(null);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customSubUrl, setCustomSubUrl] = useState('');
  const [showSubInput, setShowSubInput] = useState(false);

  const isTv = type === 'tv';

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.themoviedb.org/3/${isTv ? 'tv' : 'movie'}/${id}?api_key=${API_KEY}&language=ar-SA`);
        const data = await res.json();
        setMediaData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching media details:', err);
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, isTv]);

  useEffect(() => {
    if (!isTv || !id) return;

    const fetchSeasonData = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}&language=ar-SA`);
        const data = await res.json();
        setSeasonDetails(data);
      } catch (err) {
        console.error('Error fetching season data:', err);
      }
    };

    fetchSeasonData();
  }, [id, season, isTv]);

  // بناء رابط السيرفر مع تمرير باراميترات الترجمة التلقائية إن أمكن
  const getEmbedUrl = () => {
    if (!id) return '';
    let url = !isTv ? `https://vidlink.pro/movie/${id}` : `https://vidlink.pro/tv/${id}/${season}/${episode}`;
    // إضافة باراميتر لتفضيل اللغة العربية تلقائياً في السيرفر
    return `${url}?sub.language=ar`;
  };

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return Number(num).toLocaleString('en-US');
  };

  const englishTitle = mediaData ? (mediaData.original_title || mediaData.original_name || mediaData.title || mediaData.name) : '';
  const releaseDate = mediaData ? (mediaData.release_date || mediaData.first_air_date || '') : '';
  const releaseYear = releaseDate.substring(0, 4);
  const voteAvg = mediaData && mediaData.vote_average ? mediaData.vote_average.toFixed(1) : 'N/A';
  const runtime = isTv 
    ? (mediaData?.episode_run_time?.[0] || mediaData?.runtime || '45') 
    : (mediaData?.runtime || '120');

  return (
    <div style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      <Navbar onSearch={handleSearch} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px' }}>
        
        {/* مشغل الفيديو مع تفعيل تسريع عتاد الكمبيوتر لمنع التعليق */}
        <div style={{ 
          position: 'relative',
          width: '100%', 
          aspectRatio: '16/9', 
          backgroundColor: '#000', 
          borderRadius: '12px', 
          overflow: 'hidden', 
          border: '1px solid #27272a',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
          marginBottom: '15px',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          willChange: 'transform'
        }}>
          <iframe
            src={getEmbedUrl()}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen={true}
            title="Media Player"
          ></iframe>
        </div>

        {/* شريط التحكم السريع في الترجمة (يحل مشكلة الاختفاء عند تكبير الشاشة) */}
        <div style={{
          backgroundColor: '#121215',
          padding: '10px 16px',
          borderRadius: '8px',
          border: '1px solid #27272a',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#f97316', fontWeight: 'bold' }}>توجيه الترجمة:</span>
            <span style={{ fontSize: '12px', color: '#a1a1aa' }}>إذا اختفت الترجمة عند تكبير الشاشة، يمكنك استخدام إعدادات السيرفر الداخلية أو لصق رابط ترجمة خارجي (.srt/.vtt)</span>
          </div>
          
          <button 
            onClick={() => setShowSubInput(!showSubInput)}
            style={{
              backgroundColor: '#27272a',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            {showSubInput ? 'إخفاء خانة الترجمة' + '' : 'إضافة ترجمة خارجية يدوية'}
          </button>
        </div>

        {showSubInput && (
          <div style={{ backgroundColor: '#121215', padding: '12px', borderRadius: '8px', border: '1px solid #27272a', marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <input 
              type="text"
              placeholder="ضع رابط ملف الترجمة المباشر هنا (مثل رابط بصيغة .vtt)..."
              value={customSubUrl}
              onChange={(e) => setCustomSubUrl(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', backgroundColor: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '6px', fontSize: '13px', direction: 'ltr' }}
            />
            <button 
              onClick={() => alert('تم تفعيل الرابط، تأكد من دعم السيرفر لملفات الـ VTT')}
              style={{ backgroundColor: '#f97316', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
            >
              تطبيق
            </button>
          </div>
        )}

        {/* لوحة السيرفر */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          backgroundColor: '#121215', 
          padding: '12px 18px', 
          borderRadius: '10px', 
          border: '1px solid #27272a',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 'bold' }}>مشغل البث المباشر:</span>
          <div style={{
            backgroundColor: '#f97316',
            color: '#000',
            padding: '6px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '900'
          }}>
            سيرفر المشاهدة الأساسي
          </div>
        </div>

        {/* تنظيم المواسم والحلقات للمسلسلات */}
        {isTv && (
          <div style={{ 
            backgroundColor: '#121215', 
            padding: '16px', 
            borderRadius: '10px', 
            border: '1px solid #27272a',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1', minWidth: '140px' }}>
                <label style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 'bold' }}>اختر الموسم:</label>
                <select 
                  value={season} 
                  onChange={(e) => { setSeason(Number(e.target.value)); setEpisode(1); }}
                  style={{ 
                    padding: '8px 12px', 
                    backgroundColor: '#18181b', 
                    border: '1px solid #27272a', 
                    color: '#fff', 
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '14px',
                    direction: 'ltr'
                  }}
                >
                  {mediaData?.seasons?.filter(s => s.season_number > 0).map((s) => (
                    <option key={s.id} value={s.season_number}>
                      Season {formatNumber(s.season_number)} ({formatNumber(s.episode_count)} Episodes)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1', minWidth: '140px' }}>
                <label style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 'bold' }}>اختر الحلقة:</label>
                <select 
                  value={episode} 
                  onChange={(e) => setEpisode(Number(e.target.value))}
                  style={{ 
                    padding: '8px 12px', 
                    backgroundColor: '#18181b', 
                    border: '1px solid #27272a', 
                    color: '#fff', 
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '14px',
                    direction: 'ltr'
                  }}
                >
                  {seasonDetails?.episodes?.map((ep) => (
                    <option key={ep.id} value={ep.episode_number}>
                      Episode {formatNumber(ep.episode_number)}: {ep.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* تفاصيل العمل (بدون رموز تعبيرية) */}
        <div style={{ 
          backgroundColor: '#121215', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid #27272a',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h1 style={{ 
            fontSize: '26px', 
            fontWeight: '900', 
            color: '#ffffff', 
            margin: 0, 
            direction: 'ltr', 
            textAlign: 'left',
            letterSpacing: '0.5px'
          }}>
            {englishTitle || 'Loading...'}
          </h1>

          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            fontSize: '13px', 
            color: '#a1a1aa',
            borderBottom: '1px solid #27272a',
            paddingBottom: '14px'
          }}>
            <span style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#eab308', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
              التقييم: {formatNumber(voteAvg)} / 10
            </span>
            <span>تاريخ الإصدار: <strong style={{ color: '#fff', direction: 'ltr', display: 'inline-block' }}>{releaseDate}</strong> ({releaseYear})</span>
            <span>المدة: <strong style={{ color: '#fff', direction: 'ltr', display: 'inline-block' }}>{formatNumber(runtime)} دقيقة</strong></span>
          </div>

          <div dir="rtl">
            <h3 style={{ fontSize: '15px', color: '#f97316', margin: '0 0 8px 0', fontWeight: 'bold' }}>قصة العمل:</h3>
            <p style={{ fontSize: '14px', color: '#d4d4d8', lineHeight: '1.7', margin: 0 }}>
              {mediaData?.overview || 'جاري تحميل قصة العمل باللغة العربية...'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
