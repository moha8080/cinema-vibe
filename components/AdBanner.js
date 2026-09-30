import { useEffect, useRef } from 'react';

export default function AdBanner() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ''; // تنظيف الحاوية لمنع التكرار

      // إنشاء عنصر السكريبت الأول للإعدادات
      const scriptOption = document.createElement('script');
      scriptOption.type = 'text/javascript';
      scriptOption.text = `
        atOptions = {
          'key' : '5358bd5bf06fe651cb4b33a9d850733c',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;
      containerRef.current.appendChild(scriptOption);

      // إنشاء عنصر السكريبت الثاني للاستدعاء
      const scriptInvoke = document.createElement('script');
      scriptInvoke.type = 'text/javascript';
      scriptInvoke.async = true;
      scriptInvoke.src = 'https://www.highrevenueformat.com/5358bd5bf06fe651cb4b33a9d850733c/invoke.js';
      containerRef.current.appendChild(scriptInvoke);
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
      <div ref={containerRef} />
    </div>
  );
}
