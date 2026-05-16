'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { Consultation, Message, User } from '@/lib/types';
import RiskBadge from './RiskBadge';
import { Send, Video, FileText, CheckCircle2, Loader2 } from 'lucide-react';

interface ConsultationRoomProps {
  consultationId: string;
  backHref: string;
}

export default function ConsultationRoom({ consultationId, backHref }: ConsultationRoomProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState('en');
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [generatingTranscript, setGeneratingTranscript] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadConsultation = useCallback(() => {
    const c = store.getConsultation(consultationId);
    if (c) setConsultation(c);
  }, [consultationId]);

  useEffect(() => {
    const u = store.getUser();
    if (!u) { router.push('/'); return; }
    setUser(u);
    setLang(store.getLang());
    loadConsultation();

    // Vet auto-joins
    if (u.role === 'vet') {
      const c = store.getConsultation(consultationId);
      if (c && !c.vetId) {
        store.updateConsultation(consultationId, { vetId: u.id, vetName: u.name, status: 'active' });
      }
    }

    const interval = setInterval(loadConsultation, 2000);
    return () => clearInterval(interval);
  }, [router, consultationId, loadConsultation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consultation?.messages]);

  const t = useT(lang);

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!messageText.trim() || !user) return;
    const msg: Message = {
      id: store.genId(),
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content: messageText.trim(),
      timestamp: Date.now(),
    };
    store.addMessage(consultationId, msg);
    setMessageText('');
    loadConsultation();
  }

  async function handleGenerateTranscript() {
    if (!consultation || !user) return;
    setGeneratingTranscript(true);
    try {
      const test = store.getTest(consultation.testId);
      const res = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: consultation.messages,
          testInfo: {
            farmName: consultation.farmName,
            farmerName: consultation.farmerName,
            colorLabel: consultation.colorLabel[lang as 'en' | 'bm'],
            riskLevel: consultation.riskLevel,
            notes: test?.notes ?? '',
          },
          lang,
        }),
      });
      const data = await res.json();
      if (data.transcript) {
        store.updateConsultation(consultationId, { transcript: data.transcript, status: 'completed' });
        loadConsultation();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingTranscript(false);
    }
  }

  if (!user || !consultation) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  );

  const isVet = user.role === 'vet';
  const isCompleted = consultation.status === 'completed';

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-3 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => router.push(backHref)} className="text-blue-600 font-medium text-sm flex-shrink-0">
              ← {t.back}
            </button>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {consultation.farmerName} — {consultation.farmName}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <RiskBadge risk={consultation.riskLevel} lang={lang} size="sm" />
                {consultation.vetName && (
                  <span className="text-xs text-gray-500">Dr. {consultation.vetName}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {consultation.videoLink && (
              <a
                href={consultation.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-200 transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                {isVet ? t.joinVideoCall : t.startVideoCall}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Test Info Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
            <p className="text-xs text-blue-700 font-medium">
              {t.kitResult}: <strong>{consultation.colorLabel[lang as 'en' | 'bm']}</strong>
            </p>
          </div>

          {consultation.messages.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-8">
              {isVet
                ? (lang === 'en' ? 'Start the consultation by sending a message.' : 'Mulakan konsultasi dengan menghantar mesej.')
                : (lang === 'en' ? 'Waiting for the vet to join...' : 'Menunggu doktor vet menyertai...')}
            </div>
          )}

          {consultation.messages.map((msg) => {
            const isMine = msg.senderId === user.id;
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  isMine
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : msg.senderRole === 'vet'
                    ? 'bg-white border border-green-200 text-gray-900 rounded-bl-sm'
                    : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'
                }`}>
                  {!isMine && (
                    <p className={`text-xs font-semibold mb-0.5 ${msg.senderRole === 'vet' ? 'text-green-700' : 'text-blue-600'}`}>
                      {msg.senderRole === 'vet' ? `Dr. ${msg.senderName}` : msg.senderName}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Transcript */}
          {consultation.transcript && (
            <div className="bg-white border border-teal-200 rounded-xl p-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-teal-800 text-sm">{t.aiTranscript}</h3>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap text-xs leading-relaxed">
                {consultation.transcript}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input / Actions */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 flex-shrink-0">
        <div className="max-w-2xl mx-auto">
          {isCompleted ? (
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              {t.sessionCompleted}
            </div>
          ) : (
            <>
              {isVet && consultation.messages.length > 0 && !consultation.transcript && (
                <button
                  onClick={handleGenerateTranscript}
                  disabled={generatingTranscript}
                  className="w-full mb-3 flex items-center justify-center gap-2 text-sm font-semibold bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white py-2.5 rounded-xl transition-colors"
                >
                  {generatingTranscript ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {t.generating}</>
                  ) : (
                    <><FileText className="w-4 h-4" /> {t.generateTranscript}</>
                  )}
                </button>
              )}
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={t.typeMessage}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2.5 rounded-xl transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
