'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { store } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { User, WaterTest, Consultation } from '@/lib/types';
import { RISK_CONFIG } from '@/lib/colors';
import Header from '@/components/Header';
import RiskBadge from '@/components/RiskBadge';
import { Plus, FlaskConical, MessageSquare, Pill, Shield, ChevronRight, Clock } from 'lucide-react';

export default function FarmerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState('en');
  const [tests, setTests] = useState<WaterTest[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  const loadData = useCallback(() => {
    const u = store.getUser();
    if (!u || u.role !== 'farmer') { router.push('/'); return; }
    setUser(u);
    setTests(store.getTests().filter((t) => t.farmerId === u.id));
    setConsultations(store.getConsultations().filter((c) => c.farmerId === u.id));
  }, [router]);

  useEffect(() => {
    setLang(store.getLang());
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [loadData]);

  function toggleLang() {
    const next = lang === 'en' ? 'bm' : 'en';
    setLang(next);
    store.setLang(next);
  }

  const t = useT(lang);
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang={lang} onLangToggle={toggleLang} />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-5 text-white">
          <p className="text-teal-100 text-sm">{t.welcome},</p>
          <h1 className="text-2xl font-bold mt-0.5">{user.name}</h1>
          <p className="text-teal-200 text-sm mt-1">{t.farm}: {user.farmName}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/farmer/test" className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center gap-2 hover:border-teal-300 hover:shadow-md transition-all">
            <div className="bg-teal-100 p-3 rounded-xl">
              <Plus className="w-6 h-6 text-teal-700" />
            </div>
            <span className="text-sm font-semibold text-gray-800 text-center">{t.submitTest}</span>
          </Link>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center gap-2 opacity-60">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Pill className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-center">
              <span className="text-sm font-semibold text-gray-700 block">{t.medicines}</span>
              <span className="text-xs text-gray-400">{t.comingSoon}</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center gap-2 opacity-60">
            <div className="bg-green-100 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-center">
              <span className="text-sm font-semibold text-gray-700 block">{t.insurance}</span>
              <span className="text-xs text-gray-400">{t.comingSoon}</span>
            </div>
          </div>
          <Link href="/vet" className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center gap-2 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="bg-blue-100 p-3 rounded-xl">
              <MessageSquare className="w-6 h-6 text-blue-700" />
            </div>
            <span className="text-sm font-semibold text-gray-800 text-center">{t.vetConsultation}</span>
          </Link>
        </div>

        {/* My Tests */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-teal-600" />
              {t.myTests}
            </h2>
            <Link href="/farmer/test" className="text-sm text-teal-600 font-medium flex items-center gap-1">
              + {t.submitTest}
            </Link>
          </div>

          {tests.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-400 text-sm">
              {t.noTests}
            </div>
          ) : (
            <div className="space-y-3">
              {tests.map((test) => {
                const cfg = RISK_CONFIG[test.riskLevel] ?? RISK_CONFIG.normal;
                return (
                  <div key={test.id} className={`bg-white rounded-xl border p-4 shadow-sm ${cfg.border}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className="w-10 h-10 rounded-lg border border-black/10 flex-shrink-0"
                          style={{ backgroundColor: test.colorHex }}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">
                            {test.colorLabel[lang as 'en' | 'bm']}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {new Date(test.timestamp).toLocaleDateString(lang === 'bm' ? 'ms-MY' : 'en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <RiskBadge risk={test.riskLevel} lang={lang} size="sm" />
                    </div>

                    {test.notes && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{test.notes}</p>
                    )}

                    <div className="mt-3 flex gap-2">
                      {!test.consultationId ? (
                        <Link
                          href={`/farmer/consult?testId=${test.id}`}
                          className="flex-1 text-center text-xs font-semibold bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {t.requestConsult}
                        </Link>
                      ) : (
                        <Link
                          href={`/farmer/consult/${test.consultationId}`}
                          className="flex-1 text-center text-xs font-semibold bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-1"
                        >
                          {t.viewConsult} <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* My Consultations */}
        <section>
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            {t.myConsultations}
          </h2>

          {consultations.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-400 text-sm">
              {t.noConsultations}
            </div>
          ) : (
            <div className="space-y-3">
              {consultations.map((c) => (
                <Link
                  key={c.id}
                  href={`/farmer/consult/${c.id}`}
                  className="block bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {c.colorLabel[lang as 'en' | 'bm']}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {c.vetName ? `Dr. ${c.vetName}` : lang === 'en' ? 'Waiting for vet...' : 'Menunggu doktor vet...'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={c.status} lang={lang} t={t} />
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatusBadge({ status, lang, t }: { status: string; lang: string; t: ReturnType<typeof useT> }) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-700',
  };
  const labels: Record<string, string> = {
    pending: t.pending,
    active: t.active,
    completed: t.completed,
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[status] ?? map.pending}`}>
      {labels[status] ?? status}
    </span>
  );
}
