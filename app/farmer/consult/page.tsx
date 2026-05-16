'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { store } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { User, WaterTest, Consultation } from '@/lib/types';
import Header from '@/components/Header';
import RiskBadge from '@/components/RiskBadge';
import { MessageSquare, Video, ChevronRight } from 'lucide-react';

function ConsultSetup() {
  const router = useRouter();
  const params = useSearchParams();
  const testId = params.get('testId');

  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState('en');
  const [test, setTest] = useState<WaterTest | null>(null);
  const [consultType, setConsultType] = useState<'chat' | 'video'>('chat');

  useEffect(() => {
    const u = store.getUser();
    if (!u || u.role !== 'farmer') { router.push('/'); return; }
    setUser(u);
    setLang(store.getLang());
    if (testId) {
      const t = store.getTest(testId);
      if (t) setTest(t);
    }
  }, [router, testId]);

  function toggleLang() {
    const next = lang === 'en' ? 'bm' : 'en';
    setLang(next);
    store.setLang(next);
  }

  const t = useT(lang);

  function handleStart() {
    if (!user || !test) return;
    const id = store.genId();
    const videoLink = consultType === 'video'
      ? `https://meet.jit.si/dekapod-${store.genId()}`
      : undefined;
    const consultation: Consultation = {
      id,
      testId: test.id,
      farmerId: user.id,
      farmerName: user.name,
      farmName: user.farmName ?? '',
      colorLabel: test.colorLabel,
      riskLevel: test.riskLevel,
      status: 'pending',
      type: consultType,
      messages: [],
      videoLink,
      timestamp: Date.now(),
    };
    store.addConsultation(consultation);
    store.updateTest(test.id, { consultationId: id });
    router.push(`/farmer/consult/${id}`);
  }

  if (!user || !test) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang={lang} onLangToggle={toggleLang} showBack backHref="/farmer" />
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">{t.requestConsult}</h1>

        {/* Test Summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{t.kitResult}</p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg border border-black/10" style={{ backgroundColor: test.colorHex }} />
            <div>
              <p className="font-semibold text-gray-900">{test.colorLabel[lang as 'en' | 'bm']}</p>
              <RiskBadge risk={test.riskLevel} lang={lang} size="sm" />
            </div>
          </div>
          {test.notes && <p className="text-xs text-gray-500 mt-3 line-clamp-2">{test.notes}</p>}
        </div>

        {/* Consult Type */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
          <h2 className="font-semibold text-gray-800 mb-3">{t.chooseConsultType}</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setConsultType('chat')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                consultType === 'chat' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <MessageSquare className={`w-6 h-6 ${consultType === 'chat' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className="text-sm font-semibold text-gray-800">{t.chatConsult}</span>
            </button>
            <button
              onClick={() => setConsultType('video')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                consultType === 'video' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <Video className={`w-6 h-6 ${consultType === 'video' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className="text-sm font-semibold text-gray-800">{t.videoConsult}</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {t.requestConsult} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function ConsultPage() {
  return (
    <Suspense>
      <ConsultSetup />
    </Suspense>
  );
}
