import { useState } from 'react';
import { useRouter } from 'next/router';
// ... أي استيرادات أخرى موجودة لديك

export default function WatchPage() {
  const router = useRouter();
  const { id, season, episode } = router.query; // معرف الفيلم/المسلسل ورقم الموسم والحلقة إن وجد

  // 1. ضع حالة السيرفر النشط هنا مع بقية الـ useState
  const [activeServer, setActiveServer] = useState('vidsrc');
  const [selectedSeason, setSelectedSeason] = useState(season || 1);
  const [selectedEpisode, setSelectedEpisode] = useState(episode || 1);

  // حدد نوع المحتوى (هل هو فيلم أم مسلسل؟ بناءً على بيانات الـ TMDB لديك)
  // يمكنك تعديل هذا الشرط بحسب المتغيرات المتوفرة في كودك الحالي
  const isTvShow = false; // اجعلها true إذا كان مسلسل حسب جلب البيانات

  // 2. دالة توليد روابط السيرفرات الآمنة
  const getEmbedUrl = () => {
    if (!id) return '';
    if (!isTvShow) {
      // روابط الأفلام
      if (activeServer === 'vidsrc') return `https://vidsrc.su/embed/movie/${id}`;
      if (activeServer === 'embed.su') return `https://embed.su/embed/movie/${id}`;
      if (activeServer === 'vidlink') return `https://vidlink.pro/movie/${id}`;
    } else {
      // روابط المسلسلات
      if (activeServer === 'vidsrc') return `https://vidsrc.su/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`;
      if (activeServer === 'embed.su') return `https://embed.su/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`;
      if (activeServer === 'vidlink') return `https://vidlink.pro/tv/${id}/${selectedSeason}/${selectedEpisode}`;
    }
  };

  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      
      {/* 3. أزرار تبديل السيرفرات (توضع فوق مشغل الفيديو مباشرة) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', backgroundColor: '#121215', padding: '12px 16px', borderRadius: '10px', border: '1px solid #27272a' }}>
        <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 'bold' }}>اختر سيرفر المشاهدة:</span>
        {[
          { id: 'vidsrc', name: 'سيرفر VidSrc (رئيسي)' },
          { id: 'embed.su', name: 'سيرفر Embed.su (بديل 1)' },
          { id: 'vidlink', name: 'سيرفر VidLink (بديل 2)' }
        ].map((server) => (
          <button
            key={server.id}
            onClick={() => setActiveServer(server.id)}
            style={{
              backgroundColor: activeServer === server.id ? '#f97316' : '#27272a',
              color: activeServer === server.id ? '#000' : '#fff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {server.name}
          </button>
        ))}
      </div>

      {/* 4. إطار مشغل الفيديو (Iframe) الذي يعرض السيرفر المختار */}
      <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #27272a' }}>
        <iframe
          src={getEmbedUrl()}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
          title="Movie Player"
        ></iframe>
      </div>

    </div>
  );
}
