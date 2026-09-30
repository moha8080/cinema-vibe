import { useEffect } from 'react';

export default function TopAd({ scriptUrl }) {
  useEffect(() => {
    if (!scriptUrl) return;

    // التحقق من عدم تكرار السكريبت إذا تم تحميله مسبقاً
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existingScript) return;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = scriptUrl;
    
    document.body.appendChild(script);

    return () => {
      // تنظيف عند الخروج إذا لزم الأمر
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [scriptUrl]);

  // لا نحتاج لعرض أي مربعات مرئية على الشاشة، السكريبت يعمل بالخلفية لتغطية الصفحة
  return null;
}
