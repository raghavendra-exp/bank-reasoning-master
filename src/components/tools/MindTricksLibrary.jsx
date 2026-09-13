import React, { useState } from 'react';
import { Sparkles, Zap, BookOpen, Clock, AlertTriangle, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function MindTricksLibrary({ isHindi }) {
  const [activeTab, setActiveTab] = useState('tricks'); // 'tricks', 'topper_methods', 'flashcards'
  const [flippedCardId, setFlippedCardId] = useState(null);

  const tricksData = dataManager.getTricksData();
  const mindTricks = tricksData.mind_tricks || [];
  const topperComparisons = tricksData.topper_vs_normal || [];
  const flashcards = tricksData.flashcards || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Topper Secrets & Mental Hacks
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isHindi ? 'माइंड ट्रिक्स एवं टॉपर विधियाँ' : 'Mind Tricks & Topper Methods Library'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isHindi
                ? 'केवल सही उत्तर निकालना पर्याप्त नहीं है, सबसे तेज और विश्वसनीय तरीका सीखना महत्वपूर्ण है।'
                : 'Learn not merely how to solve, but the fastest, most reliable exam-hall techniques tested by rank holders.'}
            </p>
          </div>

          {/* Sub-tabs */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('tricks')}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'tricks' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              {isHindi ? '10 माइंड ट्रिक्स' : '10 Mind Tricks'}
            </button>
            <button
              onClick={() => setActiveTab('topper_methods')}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'topper_methods' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              {isHindi ? 'सामान्य बनाम टॉपर विधि' : 'Normal vs Topper'}
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'flashcards' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              {isHindi ? 'रिवीजन फ्लैशकार्ड्स' : 'Flashcards'}
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: 10 Mind Tricks */}
      {activeTab === 'tricks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mindTricks.map(trick => (
            <div
              key={trick.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {trick.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ⏱ {trick.time_saved}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                  {isHindi ? trick.title_hi : trick.title}
                </h3>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">Why it works:</strong>
                    <span>{trick.why_it_works}</span>
                  </div>

                  <div className="p-2.5 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-amber-950 dark:text-amber-200">
                    <strong className="block mb-0.5">Exam Method:</strong>
                    <span className="whitespace-pre-line">{trick.method}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-rose-600 dark:text-rose-400 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span><strong>Common Mistake:</strong> {trick.common_mistake}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Solve Like Topper Dual Method Comparison */}
      {activeTab === 'topper_methods' && (
        <div className="space-y-4">
          {topperComparisons.map(comp => (
            <div
              key={comp.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
                  {comp.topic}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  ⚡ Time Saved: {comp.time_saved_percent}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono">
                Problem: {comp.problem}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Normal Method */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                  <div className="font-bold text-slate-700 dark:text-slate-300 mb-1 flex justify-between">
                    <span>Method 1: Normal Approach</span>
                    <span className="font-mono text-slate-500">⏱ {comp.normal_method.time_taken_seconds}s</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {comp.normal_method.description}
                  </p>
                  {comp.normal_method.trap_note && (
                    <div className="mt-2 text-rose-600 font-semibold text-[11px]">
                      ⚠️ {comp.normal_method.trap_note}
                    </div>
                  )}
                </div>

                {/* Topper Fast Method */}
                <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/40">
                  <div className="font-bold text-amber-900 dark:text-amber-300 mb-1 flex justify-between">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-600 fill-current" />
                      <span>Method 2: Fast Exam Hack</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">⏱ {comp.topper_method.time_taken_seconds}s</span>
                  </div>
                  <p className="text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                    {comp.topper_method.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Interactive Revision Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {flashcards.map(card => {
            const isFlipped = flippedCardId === card.id;
            return (
              <div
                key={card.id}
                onClick={() => setFlippedCardId(isFlipped ? null : card.id)}
                className="cursor-pointer h-52 perspective group"
              >
                <div className={`w-full h-full p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isFlipped
                    ? 'bg-slate-900 text-white border-brand-500 shadow-xl'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-brand-400 shadow-sm'
                }`}>
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                      <span>{card.topic}</span>
                      <span>{isFlipped ? 'Answer (Click to Flip)' : 'Question (Click to Flip)'}</span>
                    </div>

                    <div className="text-sm font-bold mt-2 leading-relaxed">
                      {isFlipped ? card.back : card.front}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                    <span>{isFlipped ? '✓ Answer Revealed' : 'Tap to Reveal Secret'}</span>
                    <RotateCw className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
