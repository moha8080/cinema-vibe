import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-12" dir="rtl">
      <Head>
        <title>سياسة الخصوصية - سينما فيب</title>
      </Head>
      
      <div className="max-w-3xl mx-auto bg-neutral-900 p-8 rounded-2xl shadow-xl border border-neutral-800">
        <Link href="/" className="text-orange-500 hover:underline mb-6 inline-block">
          ← العودة إلى الرئيسية
        </Link>
        
        <h1 className="text-3xl font-bold mb-6 text-orange-500">سياسة الخصوصية</h1>
        
        <p className="text-neutral-300 mb-4 leading-relaxed">
          مرحباً بك في موقع **سينما فيب (Cinema Vibe)**. نحن نولي اهتماماً بالغاً لخصوصية زوارنا، وتوضح لك وثيقة سياسة الخصوصية هذه أنواع المعلومات التي جمعتها وكيفية استخدامها.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3 text-white">1. ملفات تعريف الارتباط (Cookies)</h2>
        <p className="text-neutral-300 mb-4 leading-relaxed">
          قد نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتخصيص المحتوى والإعلانات بناءً على اهتمامات الزوار.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3 text-white">2. الإعلانات والشركاء الخارجيون</h2>
        <p className="text-neutral-300 mb-4 leading-relaxed">
          قد نستعين بشركات إعلانية خارجية (مثل Google AdSense) لعرض الإعلانات عندما تزور موقعنا. يحق لهذه الشركات استخدام معلومات حول زياراتك لهذا الموقع والمواقع الأخرى لتوفير إعلانات حول السلع والخدمات التي تهمك.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3 text-white">3. روابط التضمين الخارجية</h2>
        <p className="text-neutral-300 mb-4 leading-relaxed">
          الموقع يعتمد على تضمين مشغلات فيديو خارجية لعرض الأفلام والمسلسلات، ونحن غير مسؤولين عن محتوى تلك المواقع الخارجية أو سياسات الخصوصية الخاصة بها.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3 text-white">4. إخلاء المسؤولية</h2>
        <p className="text-neutral-300 mb-4 leading-relaxed">
          لا يقوم موقع سينما فيب بتخزين أي ملفات فيديو أو حقوق ملكية فكرية على خوادمه الخاصة، وجميع المحتويات مرفوعة على مصادر خارجية عامة.
        </p>

        <div className="mt-8 pt-4 border-t border-neutral-800 text-sm text-neutral-400">
          آخر تحديث: سبتمبر 2026
        </div>
      </div>
    </div>
  );
}
