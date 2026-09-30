import { useEffect, useRef } from 'react';

export default function AdBanner({ zoneKey, width, height }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && zoneKey) {
      containerRef.current.innerHTML = ''; // تنظيف الحاوية

      // 1. إنشاء سكريبت الإعدادات الخاص بالمنطقة الإعلانية
      const scriptOption = document.createElement('script');
      scriptOption.type = 'text/javascript';
      scriptOption.text = `
        atOptions = {
          'key' : '${zoneKey}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;
      containerRef.current.appendChild(scriptOption);

      // 2. إنشاء سكريبت الاستدعاء
      const scriptInvoke = document.createElement('script');
      scriptInvoke.type = 'text/javascript';
      scriptInvoke.async = true;
      scriptInvoke.src = `https://www.highrevenueformat.com/${zoneKey}/invoke.js`;
      containerRef.current.appendChild(scriptInvoke);
    }
  }, [zoneKey, width, height]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '20px auto',
      width: '100%',
      minHeight: `${height}px`,
      overflow: 'hidden'
    }}>
      <div ref={containerRef} />
    </div>
  );
}
