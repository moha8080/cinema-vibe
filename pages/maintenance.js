import Head from 'next/head';

export default function Maintenance() {
  return (
    <>
      <Head>
        <title>الموقع تحت الصيانة | CINEMA VIBE</title>
      </Head>

      <div style={{
        backgroundColor: '#09090b',
        color: '#f4f4f5',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        margin: 0,
        boxSizing: 'border-box'
      }} dir="rtl">

        <div style={{
          maxWidth: '520px',
          width: '100%',
          backgroundColor: '#121215',
          border: '1px solid #27272a',
          padding: '50px 40px',
          borderRadius: '12px',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'right'
        }}>
          
          {/* الشعار بخط إنجليزي نقي ومرتب */}
          <h1 style={{ 
            fontSize: '22px', 
            fontWeight: '900', 
            color: '#f97316', 
            margin: '0 0 24px 0', 
            letterSpacing: '1.5px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            direction: 'ltr'
          }}>
            CINEMA<span style={{ color: '#ffffff' }}>VIBE</span>
          </h1>

          {/* العنوان الرئيسي */}
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: '#ffffff', 
            margin: '0 0 16px 0',
            borderRight: '4px solid #f97316',
            paddingRight: '12px'
          }}>
            تحديثات النظام الجارية
          </h2>

          {/* النص التوضيحي */}
          <p style={{ 
            fontSize: '15px', 
            color: '#a1a1aa', 
            lineHeight: '1.8', 
            margin: '0 0 30px 0' 
          }}>
            نعمل في الوقت الحالي على إجراء أعمال صيانة وتطوير شاملة لتحسين أداء المنصة وتقديم تجربة مشاهدة استثنائية. سنعود للعمل بكامل طاقتنا قريباً.
          </p>

          {/* مؤشر الحالة */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            backgroundColor: '#18181b', 
            border: '1px solid #27272a', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: '#f97316', 
              borderRadius: '50%', 
              display: 'inline-block' 
            }} />
            <span style={{ fontSize: '13px', color: '#d4d4d8', fontWeight: '500' }}>
              الحالة: الموقع مغلق مؤقتاً لأعمال التطوير
            </span>
          </div>

        </div>

        {/* الحقوق */}
        <div style={{ marginTop: '24px', fontSize: '13px', color: '#52525b', letterSpacing: '0.5px' }}>
          جميع الحقوق محفوظة &copy; {new Date().getFullYear()} CINEMA VIBE
        </div>

      </div>
    </>
  );
}
