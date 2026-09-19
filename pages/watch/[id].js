import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const API_KEY = '62ba727696f6c4d85d14ec42e701ab38';

export default function WatchPage() {
  const router = useRouter();
  const { id } = router.query;

  const [media, setMedia] = useState(null);
  const [selectedServer, setSelectedServer] = useState('embedsu');
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [tvDetails, setTvDetails] = useState(null);
  const [episodesList, setEpisodesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const serversList = [
    { id: 'embedsu', name: 'سيرفر Embed.su (ممتاز وسريع)' },
    { id: 'twouembed', name: 'سيرفر 2Embed' },
    { id: 'multiembed', name: 'سيرفر MultiEmbed' },
    { id: 'smashy', name: 'سيرفر SmashyStream' }
  ];

  useEffect(() => {
    if (!id) return;
    const fetchMediaDetails = async () => {
      try {
        // جلب تفاصيل الفيلم أو المسلسل بناءً على الـ ID
        // سنحاول معرفة هل هو فيلم أم مسلسل من خلال استدعاء عام أو فحص البيانات
        let res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=ar-SA`);
        let data = await res.json();
        
        let mediaType = 'movie';
        if (data.success === false) {
          // إن لم يكن فيلماً، قد يكون مسلسلاً
          res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=ar-SA`);
          data = await res.json();
          mediaType = 'tv';
        } else {
          mediaType = 'movie';
        }

        setMedia({ ...data, media_type: mediaType });
        setLoading(false);

        if (mediaType === 'tv') {
          setTvDetails(data);
          const seasonRes = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/1?api_key=${API_KEY}&language=ar-SA`);
          const seasonData = await seasonRes.json();
          setEpisodesList(seasonData.episodes || []);
        }
      } catch (err) {
        console.error('Error fetching media details:', err);
        setLoading(false);
      }
    };

    fetchMediaDetails();
  }, [id]);

  // تحديث الحلقات عند تغيير الموسم
  useEffect(() => {
    if (!id || !media || media.media_type !== 'tv') return;
    const fetchEpisodes = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}&language=ar-SA`);
        const data = await res.json();
        setEpisodesList(data.episodes || []);
      } catch (err) {
        console.error('Error fetching episodes:', err);
      }
    };
    fetchEpisodes();
  }, [selectedSeason, id, media]);

  const getEmbedUrl = () => {
    if (!media) return '';
    const isTv = media.media_type === 'tv';
    switch (selectedServer) {
      case 'embedsu':
        return isTv ? `https://embed.su/embed/tv/${id}/${selectedSeason}/${selectedEpisode}` : `https://embed.su/embed/movie/${id}`;
      case 'twouembed':
        return isTv ? `https://www.2embed.cc/embedtv/${id}&s=${selectedSeason}&e=${selectedEpisode}` : `https://www.2embed.cc/embed/${id}`;
      case 'multiembed':
        return isTv ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${selectedSeason}&e=${selectedEpisode}` : `https://multiembed.mov/?video_id=${id}&tmdb=1`;
      case 'smashy':
        return isTv ? `https://player.smashy.stream/tv/${id}?s=${selectedSeason}&e=${selectedEpisode}` : `https://player.smashy.stream/movie/${id}`;
      default:
        return isTv ? `https://embed.su/embed/tv/${id}/${selectedSeason}/${selectedEpisode}` : `https://embed.su/embed/movie/${id}`;
    }
  };

  if (loading) {
    return <div style={{ color: '#fff', textAlign: 'center', marginTop: '100px', background: '#09090b', minHeight: '100vh' }}>جاري التحميل...</div>;
  }

  if (!media || media.success === false) {
    return <div style={{ color: '#fff', textAlign: 'center', marginTop: '100px', background: '#09090b', minHeight: '100vh' }}>عذراً، لم يتم العثور على العمل المطلوب.</div>;
  }

  const title = media.title || media.name;

  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', padding: '20px' }}>
      <Head>
        <title>مشاهدة {title} | سينما فايب</title>
      </Head>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* زر رجوع حقيقي يعيدك للصفحة السابقة أو الرئيسية */}
        <button 
          onClick={() => router.back()} 
          style={{ marginBottom: '20px', backgroundColor: '#27272a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ← رجوع للخلف
        </button>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f97316', marginBottom: '16px', direction: 'ltr', textAlign: 'left' }}>
          {title}
        </h2>

        {media.media_type === 'tv' && (
          <div style={{ display: 'flex', gap: '15px', marginBottom: '16px', backgroundColor: '#121215', padding: '14px 18px', borderRadius: '10px', border: '1px solid #27272a', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#f97316', fontWeight: 'bold' }}>اختر الموسم والحلقة:</span>
            
            <select 
              value={selectedSeason} 
              onChange={(e) => { setSelectedSeason(Number(e.target.value)); setSelectedEpisode(1); }} 
              style={{ padding: '8px 12px', backgroundColor: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '6px', cursor: 'pointer' }}
            >
              {tvDetails?.seasons?.map(season => (
                <option key={season.id} value={season.season_number}>
                  {season.name || `الموسم ${season.season_number}`}
                </option>
              ))}
            </select>

            <select 
              value={selectedEpisode} 
              onChange={(e) => setSelectedEpisode(Number(e.target.value))} 
              style={{ padding: '8px 12px', backgroundColor: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '6px', cursor: 'pointer' }}
            >
              {episodesList.map(ep => (
                <option key={ep.id || ep.episode_number} value={ep.episode_number}>
                  الحلقة {ep.episode_number} {ep.name ? `- ${ep.name}` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{ marginBottom: '16px', backgroundColor: '#121215', padding: '14px 18px', borderRadius: '10px', border: '1px solid #27272a' }}>
          <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>اختر سيرفر التشغيل:</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {serversList.map((srv) => (
              <button 
                key={srv.id} 
                onClick={() => setSelectedServer(srv.id)}
                style={{ 
                  padding: '8px 14px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', 
                  backgroundColor: selectedServer === srv.id ? '#f97316' : '#27272a',
                  color: selectedServer === srv.id ? '#000' : '#fff',
                }}
              >
                {srv.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #27272a' }}>
          <iframe src={getEmbedUrl()} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen title="مشغل الفيديو" />
        </div>

        <div style={{ marginTop: '20px', backgroundColor: '#121215', padding: '18px', borderRadius: '10px', border: '1px solid #27272a' }}>
          <h3 style={{ fontSize: '15px', color: '#f97316', margin: '0 0 8px 0', fontWeight: 'bold' }}>قصة العمل:</h3>
          <p style={{ margin: 0, lineHeight: '1.7', color: '#d4d4d8', fontSize: '14px' }}>
            {media.overview || 'لا يتوفر وصف تفصيلي حالياً لهذا العنوان باللغة العربية.'}
          </p>
        </div>
      </div>
    </div>
  );
}
