{/* الخانة المتناسقة لاختيار الموسم والحلقة */}
{(selectedMedia.media_type === 'tv' || selectedMedia.first_air_date || activeTab === 'tv') && (
  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: '#09090b', padding: '10px 16px', borderRadius: '10px', border: '1px solid #3f3f46', marginBottom: '10px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '13px', color: '#f97316', fontWeight: 'bold' }}>الموسم:</span>
      <select 
        value={season} 
        onChange={(e) => setSeason(Number(e.target.value))}
        style={{ backgroundColor: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '6px', padding: '6px 12px', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
      >
        {[...Array(20).keys()].map(i => (
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        ))}
      </select>
    </div>

    <div style={{ width: '1px', height: '22px', backgroundColor: '#3f3f46' }}></div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '13px', color: '#f97316', fontWeight: 'bold' }}>الحلقة:</span>
      <select 
        value={episode} 
        onChange={(e) => setEpisode(Number(e.target.value))}
        style={{ backgroundColor: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '6px', padding: '6px 12px', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
      >
        {[...Array(50).keys()].map(i => (
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        ))}
      </select>
    </div>
  </div>
)}
