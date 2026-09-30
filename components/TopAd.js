import { useEffect, useRef } from 'react';

export default function TopAd({ scriptUrl }) {
  const adRef = useRef(null);

  useEffect(() => {
    if (adRef.current && scriptUrl) {
      adRef.current.innerHTML = ''; // تنظيف الحاوية لمنع التكرار

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = scriptUrl;
      
      adRef.current.appendChild(script);
    }
  }, [scriptUrl]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '20px auto',
      padding: '10px',
      backgroundColor: '#121215',
      border: '1px solid #27272a',
      borderRadius: '8px',
      maxWidth: '100%',
      overflow: 'hidden',
      minHeight: '90px'
    }}>
      <span style={{ fontSize: '10px', color: '#71717a', marginBottom: '6px' }}>إعلان رعاية</span>
      <div ref={adRef} style={{ display: 'flex', justifyContent: 'center', width: '100%' }} />
    </div>
  );
}
