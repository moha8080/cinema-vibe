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
      textAlign: 'center'
    }}>
      <Head>
        <title>الموقع تحت الصيانة</title>
      </Head>
      
      <div style={{
        maxWidth: '500px',
        backgroundColor: '#121215',
        border: '1px solid #27272a',
        padding: '40px 30px',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛠️</div>
        <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', marginBottom: '15px' }}>
          الموقع تحت الصيانة الحالية
        </h1>
        <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: '1.6', margin: 0 }}>
          نقوم حالياً بتحديثات برمجية وتحسينات عامة لنقدم لكم تجربة مشاهدة أفضل. سنعود للعمل قريباً جداً.
        </p>
      </div>
    </div>
  );
}
