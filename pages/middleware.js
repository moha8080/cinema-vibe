// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  
  // 1. مفتاح المرور الخاص بك (يمكنك تغليفه أو تعديله كما تحب)
  const bypassSecret = 'admin123'; // استبدله برمز سري صعب ومعقد تخصه لنفسك
  
  // 2. تحقق مما إذا كنت تستخدم الرابط الخاص بك لدخول الموقع
  const isBypassed = url.searchParams.get('key') === bypassSecret;

  // ضع هنا حالة الصيانة: true (يعني الموقع تحت الصيانة)، false (يعني الموقع يعمل بشكل طبيعي)
  const isUnderMaintenance = true; 

  if (isUnderMaintenance && !isBypassed && !url.pathname.startsWith('/maintenance') && !url.pathname.startsWith('/_next') && !url.pathname.startsWith('/favicon.ico')) {
    // إعادة توجيه أي زائر عادي إلى صفحة الصيانة
    return NextResponse.redirect(new URL('/maintenance', req.url));
  }

  // إذا أدخلت رابطك السري، اسمح لك بالدخول وثبت الجلسة برمزك
  if (isBypassed && url.pathname.startsWith('/maintenance')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
