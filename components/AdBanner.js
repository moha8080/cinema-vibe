import { useEffect, useRef } from 'react';

export default function AdBanner() {
  const bannerRef = useRef(null);

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.hasChildNodes()) {
      // 1. إنشاء متغير الإعدادات atOptions المطلوب من الشبكة
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.innerHTML = `
        atOptions = {
          'key' : '5358bd5bf06fe651cb4b33a9d850733c',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;
      bannerRef.current.appendChild(confScript);

      // 2. إنشاء سكريبت الاستدعاء (invoke.js)
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = 'https://www.highrevenueformat.com/5358bd5bf06fe651cb4b33a9d850733c/invoke.js';
      invokeScript.async = true;
      bannerRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '20px auto',
      width: '100%',
      minHeight: '50px',
      overflow: 'hidden'
    }}>
      <div ref={bannerRef} />
    </div>
  );
}
