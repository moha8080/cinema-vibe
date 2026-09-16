import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  // يمكنك استبدال الرابط أدناه برابط حسابك المجاني في Formspree لاستقبال الرسائل على إيميلك
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    
    const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
      method: "POST",
      body: data,
      headers: { 'Accept': 'json' }
    });

    if (response.ok) {
      setSubmitted(true);
      form.reset();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-12" dir="rtl">
      <Head>
        <title>اتصل بنا وطلب الأفلام - سينما فيب</title>
      </Head>

      <div className="max-w-xl mx-auto bg-neutral-900 p-8 rounded-2xl shadow-xl border border-neutral-800">
        <Link href="/" className="text-orange-500 hover:underline mb-6 inline-block">
          ← العودة إلى الرئيسية
        </Link>

        <h1 className="text-3xl font-bold mb-2 text-orange-500">اتصل بنا أو اطلب فيلما</h1>
        <p className="text-neutral-400 mb-6 text-sm">
          هل تواجه مشكلة في رابط فيلم، أو تريد منا إضافة مسلسل معين؟ راسلنا فوراً وسنتعامل مع طلبك.
        </p>

        {submitted ? (
          <div className="bg-green-900/40 border border-green-600 text-green-200 p-4 rounded-xl text-center">
            شكراً لك! تم إرسال رسالتك بنجاح وسنراجعها في أقرب وقت.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-300">الاسم أو لقبك</label>
              <input 
                type="text" 
                name="name" 
                required 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
                placeholder="أدخل اسمك..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-300">البريد الإلكتروني (اختياري للرد)</label>
              <input 
                type="email" 
                name="email" 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-300">رسالتك أو طلب الفيلم</label>
              <textarea 
                name="message" 
                required 
                rows="4"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
                placeholder="اكتب اسم الفيلم المطلوب أو تفاصيل المشكلة التقنية..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-lg transition"
            >
              إرسال الطلب
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
