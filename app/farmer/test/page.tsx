'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { User, WaterTest, TestColor } from '@/lib/types';
import { TEST_COLORS } from '@/lib/colors';
import Header from '@/components/Header';
import ColorPicker from '@/components/ColorPicker';
import RiskBadge from '@/components/RiskBadge';
import { ImagePlus, CheckCircle2 } from 'lucide-react';

export default function TestPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState('en');
  const [selectedColor, setSelectedColor] = useState<TestColor | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedTest, setSubmittedTest] = useState<WaterTest | null>(null);

  useEffect(() => {
    const u = store.getUser();
    if (!u || u.role !== 'farmer') { router.push('/'); return; }
    setUser(u);
    setLang(store.getLang());
  }, [router]);

  const t = useT(lang);

  function toggleLang() {
    const next = lang === 'en' ? 'bm' : 'en';
    setLang(next);
    store.setLang(next);
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoData(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedColor || !user) return;
    const test: WaterTest = {
      id: store.genId(),
      farmerId: user.id,
      farmerName: user.name,
      farmName: user.farmName ?? '',
      colorId: selectedColor.id,
      colorHex: selectedColor.color,
      colorLabel: selectedColor.label,
      riskLevel: selectedColor.risk,
      photoData: photoData ?? undefined,
      notes,
      timestamp: Date.now(),
    };
    store.addTest(test);
    setSubmittedTest(test);
    setSubmitted(true);
  }

  if (!user) return null;

  if (submitted && submittedTest) {
    const color = TEST_COLORS.find((c) => c.id === submittedTest.colorId);
    return (
      <div className="min-h-screen bg-gray-50">
        <Header lang={lang} onLangToggle={toggleLang} showBack backHref="/farmer" />
        <div className="max-w-md mx-auto px-4 py-12 text-center space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t.testSubmitted}</h2>

            <div className="flex items-center justify-center gap-3 my-4">
              <div className="w-16 h-16 rounded-xl border border-black/10" style={{ backgroundColor: submittedTest.colorHex }} />
              <div className="text-left">
                <p className="font-semibold text-gray-800">{submittedTest.colorLabel[lang as 'en' | 'bm']}</p>
                <RiskBadge risk={submittedTest.riskLevel} lang={lang} />
              </div>
            </div>

            {color && (
              <div className="bg-blue-50 rounded-xl p-4 text-left mt-4">
                <p className="text-sm font-semibold text-blue-900 mb-1">{t.advice}</p>
                <p className="text-sm text-blue-800">{color.advice[lang as 'en' | 'bm']}</p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button
                onClick={() => router.push(`/farmer/consult?testId=${submittedTest.id}`)}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                {t.requestConsult}
              </button>
              <button
                onClick={() => router.push('/farmer')}
                className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
              >
                {t.back}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang={lang} onLangToggle={toggleLang} showBack backHref="/farmer" />
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">{t.submitWaterTest}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h2 className="font-semibold text-gray-800 mb-3">{t.uploadPhoto}</h2>
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors overflow-hidden">
              {photoData ? (
                <img src={photoData} alt="Kit" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <ImagePlus className="w-8 h-8" />
                  <span className="text-sm">{t.selectPhoto}</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
          </div>

          {/* Color Picker */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h2 className="font-semibold text-gray-800 mb-3">{t.colorResult}</h2>
            <ColorPicker lang={lang} selected={selectedColor?.id ?? null} onSelect={setSelectedColor} />

            {selectedColor && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-black/10" style={{ backgroundColor: selectedColor.color }} />
                  <RiskBadge risk={selectedColor.risk} lang={lang} size="sm" />
                </div>
                <p className="text-xs text-gray-600 mt-2">{selectedColor.advice[lang as 'en' | 'bm']}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h2 className="font-semibold text-gray-800 mb-3">{t.additionalNotes}</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={!selectedColor}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {t.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
