"use client";

import { useTranslation } from "@/lib/hooks/useTranslation";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen pt-12 pb-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-[#0f172a] mb-8 text-center">{t.about.title}</h1>
        
        <div className="prose prose-lg mx-auto text-gray-600 space-y-6 text-center leading-relaxed">
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
          <p>{t.about.p3}</p>
        </div>
      </div>
    </main>
  );
}
 