import Head from 'next/head';

export default function Maintenance() {
  return (
    <div style={{
      backgroundColor: '#09090b',
      color: '#f4f4f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }} dir="rtl">
      
      <Head>
        <title>الموقع تحت الصيانة - سينما فيب</title>
      </Head>

      {/* خلفية جمالية مضيئة خفيفة */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        backgroundColor: 'rgba(249, 115, 22, 0.08)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: 0
      }} />

      <div style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: '#121215',
        border: '1px solid #27272a',
        padding: '45px 30px',
        borderRadius: '16px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.9)',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        
        {/* أيقونة الصيانة بتصميم دائري أنيق */}
        <div style={{
          width: '70px',
          height: '70px',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          boxShadow: '0 0 20px rgba(249, 115, 22, 0.15)'
        }}>
          🛠️
        </div>

        {/* عنوان الموقع أو الشعار */}
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#f97316', margin: '0 0 5px 0', letterSpacing: '1px' }}>
            CINEMA VIBE
          </h2>
          <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
            نعمل على تحسين تجربتك
          </h1>
        </div>

        {/* وصف تفصيلي */}
        <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: '1.7', margin: 0 }}>
          الموقع خاضع حالياً لتحديثات برمجية شاملة وإضافات جديدة لنقدم لك أفضل أداء ومشاهدة ممتعة. سنعود للعمل قريباً جداً، شكراً لصبرك.
        </p>

        {/* خط فاصل أنيق */}
        <div style={{ width: '100%', height: '1px', backgroundColor: '#27272a', margin: '5px 0' }} />

        {/* ملاحظة أو حالة */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#71717a' }}>
          <span style={{ width: '8px', height: '8px', backgroundColor: '#eab308', borderRadius: '50%', display: 'inline-block' }}></span>
          <span>الصيانة الدورية جارية الآن</span>
        </div>

      </div>

      {/* الحقوق في الأسفل */}
      <div style={{ marginTop: '30px', fontSize: '12px', color: '#52525b', zIndex: 1 }}>
        جميع الحقوق محفوظة &copy; {new Date().getFullYear()} سينما فيب
      </div>

    </div>
  );
}
