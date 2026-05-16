'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { store } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { User, Consultation } from '@/lib/types';
import { RISK_CONFIG } from '@/lib/colors';
import Header from '@/components/Header';
import RiskBadge from '@/components/RiskBadge';
import { Stethoscope, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function VetDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState('en');
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  const loadData = useCallback(() => {
    const u = store.getUser();
    if (!u || u.role !== 'vet') { router.push('/'); return; }
    setUser(u);
    setConsultations(store.getConsultations());
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

  const pending = consultations.filter((c) => c.status === 'pending');
  const active = consultations.filter((c) => c.status === 'active');
  const completed = consultations.filter((c) => c.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang={lang} onLangToggle={toggleLang} />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white">
          <p className="text-blue-100 text-sm">{t.welcome},</p>
          <h1 className="text-2xl font-bold mt-0.5">Dr. {user.name}</h1>
          <p className="text-blue-200 text-sm mt-1">{t.vet} — {t.appName}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pending.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t.pendingCases}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{active.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t.activeCases}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
            <p className="text-2xl font-bold text-gray-500">{completed.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t.completedCases}</p>
          </div>
        </div>

        {/* Pending Cases */}
        <section>
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-yellow-500" />
            {t.pendingCases}
            {pending.length > 0 && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {pending.length}
              </span>
            )}
          </h2>
          {pending.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-400 text-sm">
              {t.noPendingCases}
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((c) => <CaseCard key={c.id} c={c} lang={lang} t={t} href={`/vet/consult/${c.id}`} />)}
            </div>
          )}
        </section>

        {/* Active Cases */}
        {active.length > 0 && (
          <section>
            <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
              <Stethoscope className="w-5 h-5 text-green-600" />
              {t.activeCases}
            </h2>
            <div className="space-y-3">
              {active.map((c) => <CaseCard key={c.id} c={c} lang={lang} t={t} href={`/vet/consult/${c.id}`} />)}
            </div>
          </section>
        )}

        {/* Completed Cases */}
        {completed.length > 0 && (
          <section>
            <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-gray-400" />
              {t.completedCases}
            </h2>
            <div className="space-y-3">
              {completed.map((c) => <CaseCard key={c.id} c={c} lang={lang} t={t} href={`/vet/consult/${c.id}`} dimmed />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function CaseCard({
  c, lang, t, href, dimmed = false,
}: {
  c: Consultation;
  lang: string;
  t: ReturnType<typeof useT>;
  href: string;
  dimmed?: boolean;
}) {
  const cfg = RISK_CONFIG[c.riskLevel] ?? RISK_CONFIG.normal;
  return (
    <Link
      href={href}
      className={`block bg-white rounded-xl border shadow-sm p-4 transition-all hover:shadow-md ${dimmed ? 'opacity-70' : `${cfg.border} hover:border-blue-300`}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{c.farmerName}</p>
          <p className="text-xs text-gray-500 truncate">{c.farmName}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <RiskBadge risk={c.riskLevel} lang={lang} size="sm" />
            <span className="text-xs text-gray-400">
              {c.colorLabel[lang as 'en' | 'bm']}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(c.timestamp).toLocaleDateString(lang === 'bm' ? 'ms-MY' : 'en-MY', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            c.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            c.status === 'active' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-600'
          }`}>
            {c.status === 'pending' ? t.pending : c.status === 'active' ? t.active : t.completed}
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </Link>
  );
}
