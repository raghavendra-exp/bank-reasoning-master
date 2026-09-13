import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, Clock, AlertTriangle, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function ExamPatternDashboard({ isHindi }) {
  const exams = dataManager.getExams();
  const [selectedExamId, setSelectedExamId] = useState('SBI_CLERK');

  const currentExam = exams.find(e => e.id === selectedExamId) || exams[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Official Patterns
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isHindi ? 'आधिकारिक परीक्षा संरचना एवं अधिसूचना डेटा' : 'Official Exam Pattern & Verification Dashboard'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isHindi
                ? 'एसबीआई, आईबीपीएस एवं आरआरबी की आधिकारिक अधिसूचनाओं पर आधारित वास्तविक परीक्षा संरचना।'
                : 'Zero fabricated data policy: verified against official SBI & IBPS notification archives.'}
            </p>
          </div>

          <div className="flex gap-2">
            {exams.map(ex => (
              <button
                key={ex.id}
                onClick={() => setSelectedExamId(ex.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                  selectedExamId === ex.id
                    ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {ex.name.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Exam Notification Header */}
        {currentExam && (
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {currentExam.name}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Body: <strong>{currentExam.conducting_body}</strong> • Cycle: <strong>{currentExam.latest_cycle}</strong>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-slate-500">
                  Last Verified: <strong className="text-emerald-600 dark:text-emerald-400">{currentExam.last_verified}</strong>
                </div>
                <a
                  href={currentExam.official_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 text-brand-600 dark:text-brand-300 font-bold flex items-center gap-1"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Prelims vs Mains Detailed Breakdown */}
      {currentExam && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prelims Card */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
                  PHASE 1: PRELIMS
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  currentExam.prelims.separately_timed ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {currentExam.prelims.separately_timed ? 'Separately Timed' : 'Composite Time'}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-500">Reasoning Section Questions:</span>
                  <strong className="font-mono text-sm text-slate-800 dark:text-slate-100">{currentExam.prelims.questions} Questions</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-500">Reasoning Section Marks:</span>
                  <strong className="font-mono text-sm text-slate-800 dark:text-slate-100">{currentExam.prelims.marks} Marks</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-500">Section Duration:</span>
                  <strong className="font-mono text-sm text-slate-800 dark:text-slate-100">{currentExam.prelims.duration_minutes} Minutes</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-500">Negative Marking:</span>
                  <strong className="font-mono text-sm text-rose-600">0.25 (1/4th of mark)</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-500">Computer Aptitude:</span>
                  <strong className="font-mono text-sm text-slate-800 dark:text-slate-100">
                    {currentExam.prelims.computer_aptitude_included ? 'Included' : 'Not Included in Prelims'}
                  </strong>
                </div>

                {currentExam.prelims.composite_time_note && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200">
                    <strong>Note on Composite Time: </strong> {currentExam.prelims.composite_time_note}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mains Card */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono">
                  PHASE 2: MAINS
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  currentExam.mains.separately_timed ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {currentExam.mains.separately_timed ? 'Separately Timed' : 'Composite Time'}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-500">Reasoning Section Questions:</span>
                  <strong className="font-mono text-sm text-slate-800 dark:text-slate-100">{currentExam.mains.questions} Questions</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-500">Reasoning Section Marks:</span>
                  <strong className="font-mono text-sm text-purple-600 dark:text-purple-400">{currentExam.mains.marks} Marks</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-500">Section Duration:</span>
                  <strong className="font-mono text-sm text-slate-800 dark:text-slate-100">{currentExam.mains.duration_minutes} Minutes</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-500">Negative Marking:</span>
                  <strong className="font-mono text-sm text-rose-600">0.25 (1/4th of mark)</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-500">Computer Aptitude:</span>
                  <strong className="font-mono text-sm text-slate-800 dark:text-slate-100">
                    {currentExam.mains.computer_aptitude_included ? 'Combined in section' : 'Separate Section'}
                  </strong>
                </div>

                {currentExam.mains.composite_time_note && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200">
                    <strong>Note on Composite Time: </strong> {currentExam.mains.composite_time_note}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strategic Blueprint (Section 36) */}
      {currentExam && (
        <div className="p-6 bg-slate-900 rounded-2xl text-white space-y-4">
          <div className="flex items-center gap-2 text-brand-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Tactical Exam Strategy: First 5 Minutes & Skip Discipline</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentExam.strategy_note}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <strong className="text-amber-300 block mb-1">0:00 - 6:00 min</strong>
              <span className="text-slate-300 text-[11px]">Clear all Syllogisms, Inequalities & Alphanumeric series (Target: 15 marks).</span>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <strong className="text-amber-300 block mb-1">6:00 - 15:00 min</strong>
              <span className="text-slate-300 text-[11px]">Solve the 2 easiest fixed puzzles (Floor/Flat or Month/Date).</span>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <strong className="text-amber-300 block mb-1">15:00 - 20:00 min</strong>
              <span className="text-slate-300 text-[11px]">Attempt Seating Arrangement or remaining puzzles. Skip uncertain rows if time &lt; 3 mins.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
