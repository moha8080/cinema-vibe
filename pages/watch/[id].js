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
  const [similarMedia, setSimilarMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // حالة التبديل بين السيرفرات
  const [activeServer, setActiveServer] = useState('server1');

  const isTv = type === 'tv';

  // جلب تفاصيل العمل والمحتوى المشابه
  useEffect(() => {
    if (!id) return;

    const fetchDetailsAndSimilar = async () => {
      try {
        setLoading(true);
        // جلب تفاصيل العمل
        const res = await fetch(`https://api.themoviedb.org/3/${isTv ? 'tv' : 'movie'}/${id}?api_key=${API_KEY}&language=ar-SA`);
        const data = await res.json();
        setMediaData(data);

        // جلب المحتوى المشابه
        const similarRes = await fetch(`https://api.themoviedb.org/3/${isTv ? 'tv' : 'movie'}/${id}/similar?api_key=${API_KEY}&language=ar-SA&page=1`);
        const similarData = await similarRes.json();
        setSimilarMedia(similarData.results || []);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchDetailsAndSimilar();
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

  // روابط السيرفرات (تم تحديث السيرفر 2 و 3 بسيرفرات بديلة تعمل بكفاءة عالية)
  const getEmbedUrl = () => {
    if (!id) return '';
    
    if (activeServer === 'server2') {
      // سيرفر بديل 2 (VidSrc.me)
      return !isTv 
        ? `https://vidsrc.me/embed/movie?tmdb=${id}` 
        : `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    }

    if (activeServer === 'server3') {
      // سيرفر بديل 3 (2Embed)
      return !isTv 
        ? `https://www.2embed.cc/embed/${id}` 
        : `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`;
    }

    // السيرفر الأساسي (VidLink مع دعم الترجمة العربية)
    let url = !isTv ? `https://vidlink.pro/movie/${id}` : `https://vidlink.pro/tv/${id}/${season}/${episode}`;
    return `${url}?autoplay=false&primaryColor=f97316&secondaryColor=18181b&icon=default&sub.language=ar&ds_lang=ar`;
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
  const releaseYear = releaseDate ? releaseDate.substring(0, 4) : '';
  const voteAvg = mediaData && mediaData.vote_average ? mediaData.vote_average.toFixed(1) : 'N/A';
  const runtime = isTv 
    ? (mediaData?.episode_run_time?.[0] || mediaData?.runtime || '45') 
    : (mediaData?.runtime || '120');

  return (
    <div style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* الشريط العلوي الأصلي تماماً */}
      <Navbar onSearch={handleSearch} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px' }}>
        
        {/* زر العودة */}
        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={() => router.back()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#18181b',
              color: '#f4f4f5',
              border: '1px solid #27272a',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '13px',
              transition: '0.2s'
            }}
          >
            ← العودة للخلف
          </button>
        </div>

        {/* أزرار التبديل بين السيرفرات */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '15px', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          backgroundColor: '#121215',
          padding: '12px 16px',
          borderRadius: '10px',
          border: '1px solid #27272a'
        }}>
          <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 'bold' }}>اختر سيرفر المشاهدة:</span>
          
          <button
            onClick={() => setActiveServer('server1')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid #27272a',
              backgroundColor: activeServer === 'server1' ? '#f97316' : '#18181b',
              color: activeServer === 'server1' ? '#000' : '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            سيرفر 1 
          </button>

          <button
            onClick={() => setActiveServer('server2')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid #27272a',
              backgroundColor: activeServer === 'server2' ? '#f97316' : '#18181b',
              color: activeServer === 'server2' ? '#000' : '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            سيرفر 2 
          </button>

          <button
            onClick={() => setActiveServer('server3')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid #27272a',
              backgroundColor: activeServer === 'server3' ? '#f97316' : '#18181b',
              color: activeServer === 'server3' ? '#000' : '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            سيرفر 3 
          </button>
        </div>

        {/* مشغل الفيديو */}
        <div style={{ 
          position: 'relative',
          width: '100%', 
          aspectRatio: '16/9', 
          backgroundColor: '#000', 
          borderRadius: '12px', 
          overflow: 'hidden', 
          border: '1px solid #27272a',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
          marginBottom: '20px'
        }}>
          <iframe
            src={getEmbedUrl()}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen={true}
            title="Media Player"
          ></iframe>
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
                    direction: 'ltr',
                    cursor: 'pointer'
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
                    direction: 'ltr',
                    cursor: 'pointer'
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

        {/* تفاصيل العمل */}
        <div style={{ 
          backgroundColor: '#121215', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid #27272a',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '30px'
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
            <span>سنة الإصدار: <strong style={{ color: '#fff', direction: 'ltr', display: 'inline-block' }}>{releaseYear || 'N/A'}</strong></span>
            <span>المدة: <strong style={{ color: '#fff', direction: 'ltr', display: 'inline-block' }}>{formatNumber(runtime)} دقيقة</strong></span>
          </div>

          <div dir="rtl">
            <h3 style={{ fontSize: '15px', color: '#f97316', margin: '0 0 8px 0', fontWeight: 'bold' }}>قصة العمل:</h3>
            <p style={{ fontSize: '14px', color: '#d4d4d8', lineHeight: '1.7', margin: 0 }}>
              {mediaData?.overview || 'جاري تحميل قصة العمل باللغة العربية...'}
            </p>
          </div>
        </div>

        {/* قسم المحتوى المشابه */}
        {similarMedia.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginBottom: '20px', borderRight: '4px solid #f97316', paddingRight: '10px' }}>
              أعمال مشابهة قد تعجبك
            </h2>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
              gap: '16px' 
            }}>
              {similarMedia.slice(0, 10).map((item) => {
                const itemTitle = item.title || item.name;
                const itemPoster = item.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
                  : 'https://via.placeholder.com/500x750?text=No+Image';
                const itemType = isTv ? 'tv' : 'movie';

                return (
                  <div 
                    key={item.id}
                    onClick={() => router.push(`/watch/${item.id}?type=${itemType}`)}
                    style={{
                      backgroundColor: '#121215',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid #27272a',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{ aspectRatio: '2/3', width: '100%', position: 'relative', backgroundColor: '#27272a' }}>
                      <img 
                        src={itemPoster} 
                        alt={itemTitle} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '10px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {itemTitle}
                      </h4>
                      <span style={{ fontSize: '11px', color: '#a1a1aa' }}>
                        ⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
                      </span>
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
