import Head from 'next/head';

export default function MaintenancePage() {
  return (
    <div dir="rtl" style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif', textAlign: 'center' }}>
      <Head>
        <title>صيانة وتحديث | Cinema Vibe</title>
      </Head>

      <div style={{ maxWidth: '500px', backgroundColor: '#121215', border: '1px solid #27272a', borderRadius: '16px', padding: '40px 30px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <div style={{ width: '70px', height: '70px', backgroundColor: 'rgba(249, 115, 22, 0.1)', border: '2px solid #f97316', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#f97316' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', margin: '0 0 10px 0' }}>
          CINEMA<span style={{ color: '#f97316' }}>VIBE</span>
        </h1>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f97316', margin: '0 0 15px 0' }}>
          الموقع تحت الصيانة والتطوير حالياً 🚧
        </h2>
        <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: '1.6', margin: '0 0 25px 0' }}>
          نعمل على إضافة ميزات وتعديلات جديدة لتحسين تجربتكم. سنعود للعمل بكامل طاقتنا قريباً جداً، شكراً لصبركم!
        </p>
        <div style={{ fontSize: '12px', color: '#52525b', borderTop: '1px solid #27272a', paddingTop: '15px' }}>
          جميع الحقوق محفوظة © Cinema Vibe 2026
        </div>
      </div>
    </div>
  );
}
