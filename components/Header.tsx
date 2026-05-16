'use client';

import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { Fish, LogOut, Globe } from 'lucide-react';

interface HeaderProps {
  lang: string;
  onLangToggle: () => void;
  showBack?: boolean;
  backHref?: string;
}

export default function Header({ lang, onLangToggle, showBack, backHref }: HeaderProps) {
  const t = useT(lang);
  const router = useRouter();

  function handleLogout() {
    store.clearUser();
    router.push('/');
  }

  function handleBack() {
    if (backHref) router.push(backHref);
    else router.back();
  }

  return (
    <header className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 mr-2"
            >
              ← {t.back}
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Fish className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-blue-900 text-lg leading-tight">{t.appName}</span>
              <span className="hidden sm:block text-xs text-blue-500 leading-tight">{t.appTagline}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLangToggle}
            className="flex items-center gap-1.5 text-sm text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>{lang === 'en' ? 'BM' : 'EN'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 bg-gray-50 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t.logout}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
