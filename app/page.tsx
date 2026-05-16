'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { User } from '@/lib/types';
import { Fish, Globe, Stethoscope, Droplets, Pill, Shield, ChevronRight, Sprout } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [role, setRole] = useState<'farmer' | 'vet' | null>(null);
  const [name, setName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [step, setStep] = useState<'home' | 'login'>('home');

  useEffect(() => {
    const savedLang = store.getLang();
    setLang(savedLang);
    const user = store.getUser();
    if (user) {
      router.push(user.role === 'farmer' ? '/farmer' : '/vet');
    }
  }, [router]);

  const t = useT(lang);

  function toggleLang() {
    const next = lang === 'en' ? 'bm' : 'en';
    setLang(next);
    store.setLang(next);
  }

  function startLogin(selectedRole: 'farmer' | 'vet') {
    setRole(selectedRole);
    setStep('login');
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !role) return;
    if (role === 'farmer' && !farmName.trim()) return;
    const user: User = {
      id: store.genId(),
      name: name.trim(),
      role,
      farmName: role === 'farmer' ? farmName.trim() : undefined,
    };
    store.setUser(user);
    router.push(role === 'farmer' ? '/farmer' : '/vet');
  }

  if (step === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex flex-col">
        <div className="flex justify-between items-center p-4">
          <button onClick={() => setStep('home')} className="text-blue-600 font-medium flex items-center gap-1">
            ← {t.back}
          </button>
          <button onClick={toggleLang} className="flex items-center gap-1.5 text-sm text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded-full">
            <Globe className="w-4 h-4" />
            {lang === 'en' ? 'BM' : 'EN'}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-xl ${role === 'farmer' ? 'bg-teal-100' : 'bg-blue-100'}`}>
                {role === 'farmer'
                  ? <Sprout className="w-6 h-6 text-teal-700" />
                  : <Stethoscope className="w-6 h-6 text-blue-700" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {role === 'farmer' ? t.farmer : t.vet}
                </h2>
                <p className="text-sm text-gray-500">{t.appName}</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t.yourName}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.enterName}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
                  required
                />
              </div>
              {role === 'farmer' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t.farmName}</label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder={t.enterFarmName}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
                    required
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {t.continueBtn} <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <nav className="flex justify-between items-center px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl shadow">
            <Fish className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-blue-900">DekaPod</span>
            <p className="text-xs text-blue-400 leading-none">{t.appTagline}</p>
          </div>
        </div>
        <button onClick={toggleLang} className="flex items-center gap-1.5 text-sm text-blue-700 bg-white border border-blue-200 px-3 py-2 rounded-full shadow-sm">
          <Globe className="w-4 h-4" />
          {lang === 'en' ? 'Bahasa Melayu' : 'English'}
        </button>
      </nav>

      <div className="text-center px-6 pt-6 pb-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          <Droplets className="w-3.5 h-3.5" />
          {t.hatchery}
        </div>
        <h1 className="text-4xl font-extrabold text-blue-900 leading-tight mb-3">DekaPod</h1>
        <p className="text-gray-600 text-base leading-relaxed">
          {lang === 'en'
            ? 'Smart aquaculture health for Malaysian hatcheries & prawn farms — virus detection kits, certified vet telemedicine, and AI-powered clinical records.'
            : 'Kesihatan akuakultur pintar untuk hatcheri & ladang udang Malaysia — kit pengesan virus, telemedicine vet bertauliah, dan rekod klinikal berkuasa AI.'}
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-6">
        <h2 className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{t.selectRole}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <button onClick={() => startLogin('farmer')} className="bg-white rounded-2xl shadow-md hover:shadow-lg border border-teal-100 hover:border-teal-300 p-6 text-left transition-all group">
            <div className="bg-teal-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
              <Sprout className="w-7 h-7 text-teal-700" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">{t.farmer}</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{t.farmerDesc}</p>
            <div className="flex items-center gap-1 text-teal-600 text-sm font-semibold mt-4">
              {t.continueBtn} <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          <button onClick={() => startLogin('vet')} className="bg-white rounded-2xl shadow-md hover:shadow-lg border border-blue-100 hover:border-blue-300 p-6 text-left transition-all group">
            <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Stethoscope className="w-7 h-7 text-blue-700" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">{t.vet}</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{t.vetDesc}</p>
            <div className="flex items-center gap-1 text-blue-600 text-sm font-semibold mt-4">
              {t.continueBtn} <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-12">
        <h2 className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{t.services}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-xl p-4 bg-cyan-50 border border-transparent">
            <div className="flex items-start gap-3">
              <Droplets className="w-5 h-5 text-cyan-600 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-800 text-sm">{t.waterTest}</span>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t.waterTestDesc}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl p-4 bg-blue-50 border border-transparent">
            <div className="flex items-start gap-3">
              <Stethoscope className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-800 text-sm">{t.vetConsultation}</span>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t.vetConsultationDesc}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl p-4 bg-purple-50 border border-gray-100 opacity-75">
            <div className="flex items-start gap-3">
              <Pill className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700 text-sm">{t.medicines}</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{t.comingSoon}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t.medicinesDesc}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl p-4 bg-green-50 border border-gray-100 opacity-75">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700 text-sm">{t.insurance}</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{t.comingSoon}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t.insuranceDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
