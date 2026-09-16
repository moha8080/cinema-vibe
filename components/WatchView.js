import React from 'react';

export default function WatchView({
  selectedMedia,
  activeTab,
  season,
  episode,
  availableSeasons,
  availableEpisodes,
  handleSeasonChange,
  setEpisode,
  activeServer,
  setActiveServer,
  arabicOverview,
  getEmbedUrl,
  setActiveTab
}) {
  if (!selectedMedia) return null;

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1150px', margin: '0 auto' }}>
      <button 
        onClick={() => setActiveTab('home')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '10px 20px', borderRadius: '10px', backgroundColor: '#18181b', color: '#fff', border: '1px solid #27272a', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: 'background 0.2s' }}
      >
        ← العودة للرئيسية
      </button>

      <div style={{ backgroundColor: '#121215', borderRadius: '16px', padding: '24px', border: '1px solid #27272a', boxShadow: '0 15px 35px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: 0, color: '#f97316', fontSize: '26px', fontWeight: '800' }}>{selectedMedia.title || selectedMedia.name}</h2>
            <p style={{ margin: '6px 0 0 0', color: '#a1a1aa', fontSize: '14px' }}>
              {(selectedMedia.release_date || selectedMedia.first_air_date || '').slice(0, 4)} | التقييم: ⭐ {selectedMedia.vote_average?.toFixed(1)}
            </p>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#09090b', padding: '12px 16px', borderRadius: '12px', border: '1px solid #27272a' }}>
            
            {(selectedMedia.media_type === 'tv' || selectedMedia.first_air_date || activeTab === 'tv') && (
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#f97316', fontWeight: 'bold' }}>الموسم:</span>
                  <select 
                    value={season} 
                    onChange={(e) => handleSeasonChange(Number(e.target.value))}
                    style={{ backgroundColor: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                  >
                    {availableSeasons.map(s => (
                      <option key={s} value={s}>الموسم {s}</option>
                    ))}
                  </select>
                </div>

                <div style={{ width: '1px', height: '20px', backgroundColor: '#27272a' }}></div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#f97316', fontWeight: 'bold' }}>الحلقة:</span>
                  <select 
                    value={episode} 
                    onChange={(e) => setEpisode(Number(e.target.value))}
                    style={{ backgroundColor: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                  >
                    {availableEpisodes.map(ep => (
                      <option key={ep} value={ep}>الحلقة {ep}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
              <button onClick={() => setActiveServer('vidsrc.to')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'vidsrc.to' ? '#f97316' : '#18181b', color: activeServer === 'vidsrc.to' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '13px' }}>سيرفر 1</button>
              <button onClick={() => setActiveServer('vidsrc.me')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'vidsrc.me' ? '#f97316' : '#18181b', color: activeServer === 'vidsrc.me' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '13px' }}>سيرفر 2</button>
              <button onClick={() => setActiveServer('embed.su')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: activeServer === 'embed.su' ? '#f97316' : '#18181b', color: activeServer === 'embed.su' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '13px' }}>سيرفر 3</button>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #27272a' }}>
          <iframe 
            src={getEmbedUrl()} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
            allowFullScreen 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="origin"
          ></iframe>
        </div>

        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #27272a' }}>
          <h3 style={{ fontSize: '16px', color: '#f97316', margin: '0 0 8px 0', fontWeight: '700' }}>قصة العمل</h3>
          <p style={{ fontSize: '14px', color: '#d4d4d8', lineHeight: '1.8', margin: 0 }}>
            {arabicOverview}
          </p>
        </div>
      </div>
    </div>
  );
}
