// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  
  // 1. مفتاح المرور السري الخاص بك للدخول أثناء الصيانة
  const bypassSecret = 'admin123';
  
  // 2. هل تم إرفاق المفتاح في الرابط؟
  const isBypassed = url.searchParams.get('key') === bypassSecret;

  // 3. حالة الصيانة: true (يعني الموقع تحت الصيانة)، false (يعني الموقع يعمل طبيعياً)
  const isUnderMaintenance = true; 

  // استثناء صفحة الصيانة والملفات الثابتة ومسارات النظام لكي لا يحدث تداخل
  if (
    isUnderMaintenance && 
    !isBypassed && 
    !url.pathname.startsWith('/maintenance') && 
    !url.pathname.startsWith('/_next') && 
    !url.pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.redirect(new URL('/maintenance', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
