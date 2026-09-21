import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';

export default function WatchPage() {
  const router = useRouter();
  const { id, type } = router.query; // جلب المعرف ونوع المحتوى من الرابط

  // حالة السيرفر النشط (افتراضياً vidsrc)
  const [activeServer, setActiveServer] = useState('vidsrc');
  
  // حالات المواسم والحلقات للمسلسلات
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  // تحديد ما إذا كان المحتوى مسلسلاً أم فيلماً
  const isTv = type === 'tv';

  // دالة توليد روابط السيرفرات المختلفة
  const getEmbedUrl = () => {
    if (!id) return '';
    
    if (!isTv) {
      // روابط الأفلام
      if (activeServer === 'vidsrc') return `https://vidsrc.su/embed/movie/${id}`;
      if (activeServer === 'embed.su') return `https://embed.su/embed/movie/${id}`;
      if (activeServer === 'vidlink') return `https://vidlink.pro/movie/${id}`;
    } else {
      // روابط المسلسلات
      if (activeServer === 'vidsrc') return `https://vidsrc.su/embed/tv/${id}/${season}/${episode}`;
      if (activeServer === 'embed.su') return `https://embed.su/embed/tv/${id}/${season}/${episode}`;
      if (activeServer === 'vidlink') return `https://vidlink.pro/tv/${id}/${season}/${episode}`;
    }
  };

  // التعامل مع البحث القادم من النافبار
  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* الشريط العلوي للموقع */}
      <Navbar onSearch={handleSearch} />

      {/* محتوى صفحة المشاهدة */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }} dir="rtl">
        
        {/* أزرار اختيار سيرفرات البث */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          marginBottom: '16px', 
          flexWrap: 'wrap', 
          backgroundColor: '#121215', 
          padding: '12px 16px', 
          borderRadius: '10px', 
          border: '1px solid #27272a' 
        }}>
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

        {/* خانات اختيار الموسم والحلقة (تظهر فقط إذا كان المحتوى مسلسلاً) */}
        {isTv && (
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            marginBottom: '16px', 
            backgroundColor: '#121215', 
            padding: '12px 16px', 
            borderRadius: '10px', 
            border: '1px solid #27272a',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#a1a1aa' }}>الموسم:</span>
              <input 
                type="number" 
                min="1" 
                value={season} 
                onChange={(e) => setSeason(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: '60px', padding: '6px', backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fff', borderRadius: '6px', textAlign: 'center' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#a1a1aa' }}>الحلقة:</span>
              <input 
                type="number" 
                min="1" 
                value={episode} 
                onChange={(e) => setEpisode(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: '60px', padding: '6px', backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fff', borderRadius: '6px', textAlign: 'center' }}
              />
            </div>
          </div>
        )}

        {/* مشغل الفيديو الأساسي (Iframe) */}
        <div style={{ 
          width: '100%', 
          aspectRatio: '16/9', 
          backgroundColor: '#000', 
          borderRadius: '12px', 
          overflow: 'hidden', 
          border: '1px solid #27272a',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <iframe
            src={getEmbedUrl()}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
            title="Media Player"
          ></iframe>
        </div>

      </div>
    </div>
  );
}
