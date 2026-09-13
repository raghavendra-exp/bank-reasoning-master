import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, XCircle, Trash2, AlertCircle, Sparkles, Filter } from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function RevisionMistakes({ isHindi }) {
  const [mistakes, setMistakes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [practicingQuestion, setPracticingQuestion] = useState(null);
  const [userSelection, setUserSelection] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const loadMistakes = () => {
    setMistakes(dataManager.getMistakes());
  };

  useEffect(() => {
    loadMistakes();
  }, []);

  const allQuestions = dataManager.getAllQuestions();
  const mistakeQuestions = mistakes.map(m => {
    const q = allQuestions.find(item => item.id === m.questionId);
    return q ? { ...q, mistakeMeta: m } : null;
  }).filter(Boolean);

  const filtered = selectedCategory === 'ALL'
    ? mistakeQuestions
    : mistakeQuestions.filter(q => q.mistakeMeta.reason === selectedCategory);

  const handleResolve = (qId) => {
    dataManager.removeMistake(qId);
    loadMistakes();
    if (practicingQuestion?.id === qId) {
      setPracticingQuestion(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Error Log Liquidation
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isHindi ? 'मेरी गलतियों का पुनरीक्षण (Revise My Mistakes)' : 'Revise My Mistakes'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isHindi
                ? 'उन सभी प्रश्नों का पुनरभ्यास करें जो अभ्यास या मॉक टेस्ट के दौरान गलत हुए थे।'
                : 'Target your highest leverage learning loop: re-solve every question you ever missed until mastered.'}
            </p>
          </div>

          <div className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900">
            {mistakeQuestions.length} Active Mistakes in Log
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap gap-2 mt-4 text-xs font-semibold">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg border transition ${selectedCategory === 'ALL' ? 'bg-brand-600 text-white border-brand-500' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
          >
            All Mistakes ({mistakeQuestions.length})
          </button>
          {['Concept error', 'Calculation error', 'Misread', 'Time pressure', 'Forgot trick', 'Guess'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border transition ${selectedCategory === cat ? 'bg-brand-600 text-white border-brand-500' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Mistakes List */}
      {filtered.length === 0 ? (
        <div className="p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isHindi ? 'कोई गलती दर्ज नहीं है!' : 'No Mistakes Logged in this Category!'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Keep taking tests in the Practice Arena or Mock Simulator. Any incorrect questions will be automatically routed here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(q => (
            <div
              key={q.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    Reason: {q.mistakeMeta.reason}
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {q.topic.toUpperCase()} ({q.difficulty})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResolve(q.id)}
                    className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 hover:bg-emerald-100"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as Mastered</span>
                  </button>
                </div>
              </div>

              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed mb-4">
                {isHindi ? (q.question_hi || q.question_en) : q.question_en}
              </p>

              {/* Solution Toggle Box */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="font-bold text-emerald-700 dark:text-emerald-400">
                  Correct Answer: Option {String.fromCharCode(65 + q.correct_answer)} — {q.options[q.correct_answer]}
                </div>
                <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isHindi ? q.solution_hi : q.solution_en}
                </div>
                {q.shortcut && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-amber-800 dark:text-amber-300 font-medium">
                    ⚡ Shortcut to remember: {q.shortcut}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
