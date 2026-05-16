'use client';

import { User, WaterTest, Consultation, Message } from './types';

const KEYS = {
  USER: 'dp_user',
  LANG: 'dp_lang',
  TESTS: 'dp_tests',
  CONSULTATIONS: 'dp_consultations',
};

function get<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function set<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const store = {
  genId,

  // Language
  getLang(): string {
    if (typeof window === 'undefined') return 'en';
    return localStorage.getItem(KEYS.LANG) || 'en';
  },
  setLang(lang: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.LANG, lang);
  },

  // User
  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },
  clearUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEYS.USER);
  },

  // Water Tests
  getTests(): WaterTest[] {
    return get<WaterTest>(KEYS.TESTS);
  },
  getTest(id: string): WaterTest | undefined {
    return this.getTests().find((t) => t.id === id);
  },
  addTest(test: WaterTest): void {
    set(KEYS.TESTS, [test, ...this.getTests()]);
  },
  updateTest(id: string, updates: Partial<WaterTest>): void {
    set(KEYS.TESTS, this.getTests().map((t) => (t.id === id ? { ...t, ...updates } : t)));
  },

  // Consultations
  getConsultations(): Consultation[] {
    return get<Consultation>(KEYS.CONSULTATIONS);
  },
  getConsultation(id: string): Consultation | undefined {
    return this.getConsultations().find((c) => c.id === id);
  },
  addConsultation(c: Consultation): void {
    set(KEYS.CONSULTATIONS, [c, ...this.getConsultations()]);
  },
  updateConsultation(id: string, updates: Partial<Consultation>): void {
    set(KEYS.CONSULTATIONS, this.getConsultations().map((c) => (c.id === id ? { ...c, ...updates } : c)));
  },
  addMessage(consultationId: string, message: Message): void {
    const c = this.getConsultation(consultationId);
    if (!c) return;
    this.updateConsultation(consultationId, { messages: [...c.messages, message] });
  },
};
