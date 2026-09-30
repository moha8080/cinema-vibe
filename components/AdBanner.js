import { useEffect, useRef } from 'react';

export default function AdBanner({ zoneKey, width, height }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && zoneKey) {
      containerRef.current.innerHTML = '';

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
      flexDirection: 'column',
      alignItems: 'center',
      margin: '20px auto',
      width: '100%',
      overflow: 'hidden'
    }}>
      <span style={{ fontSize: '11px', color: '#71717a', marginBottom: '4px' }}>
        إعلان ({width}x{height})
      </span>
      <div ref={containerRef} style={{ minHeight: `${height}px`, minWidth: `${width}px` }} />
    </div>
  );
}
