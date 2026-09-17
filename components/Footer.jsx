export default function Footer({ setActiveTab }) {
  return (
    <footer style={{ backgroundColor: '#121214', borderTop: '1px solid #27272a', padding: '30px 24px', marginTop: '40px', color: '#a1a1aa' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h2 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: '900', color: '#f97316' }}>
              CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#71717a' }}>وجهتك الأولى لمشاهدة أحدث الأفلام والمسلسلات مترجمة.</p>
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '14px', fontWeight: 'bold' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('home')}>الرئيسية</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('privacy')}>سياسة الخصوصية</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('contact')}>اتصل بنا</span>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #27272a', paddingTop: '16px', fontSize: '12px', color: '#71717a', textAlign: 'center' }}>
          جميع الحقوق محفوظة © {new Date().getFullYear()} CinemaVibe
        </div>
      </div>
    </footer>
  );
}
