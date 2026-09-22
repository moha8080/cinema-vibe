import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Maintenance from './maintenance';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // 1. ضع حالة الصيانة هنا: true (يعني الموقع مغلق للصيانة)، false (يعني الموقع يعمل للجميع)
    const MAINTENANCE_MODE = false; 

    // 2. المفتاح السري الخاص بك لدخول الموقع أثناء الصيانة
    const SECRET_KEY = 'admin123';

    // التحقق من وجود المفتاح في رابط المتصفح
    const queryKey = router.query.key;
    
    // حفظ الصلاحية في التخزين المحلي للمتصفح (Local Storage) لكي لا تبقي الكلمة في الرابط طوال الوقت
    let hasAccess = false;
    if (queryKey === SECRET_KEY) {
      localStorage.setItem('admin_access', 'true');
      hasAccess = true;
    } else if (localStorage.getItem('admin_access') === 'true') {
      hasAccess = true;
    }

    if (MAINTENANCE_MODE && !hasAccess) {
      setIsMaintenance(true);
    } else {
      setIsMaintenance(false);
    }
    setAuthorized(true);
  }, [router.query]);

  if (!authorized) return null;

  // إذا كان الموقع تحت الصيانة وليس لديك صلاحية، اعرض صفحة الصيانة
  if (isMaintenance && router.pathname !== '/maintenance') {
    return <Maintenance />;
  }

  return <Component {...pageProps} />;
}
