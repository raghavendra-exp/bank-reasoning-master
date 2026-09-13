import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, CheckCircle2, HelpCircle } from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function BookmarksViewer({ isHindi }) {
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const bms = dataManager.getBookmarks();
    setBookmarkedIds(bms);
    const all = dataManager.getAllQuestions();
    setQuestions(all.filter(q => bms.includes(q.id)));
  }, []);

  const removeBookmark = (id) => {
    dataManager.toggleBookmark(id);
    const updated = dataManager.getBookmarks();
    setBookmarkedIds(updated);
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                Saved Repository
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isHindi ? 'मेरे बुकमार्क (My Bookmarks)' : 'My Bookmarks'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isHindi
                ? 'अभ्यास के दौरान सहेजे गए महत्वपूर्ण और चुनौतीपूर्ण प्रश्नों का संग्रह।'
                : 'Your personal collection of bookmarked high-difficulty and tricky reasoning questions.'}
            </p>
          </div>

          <div className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-3 py-1.5 rounded-xl">
            {questions.length} Saved Questions
          </div>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No Bookmarks Saved Yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            While practicing questions in the Practice Arena, tap the bookmark icon on the top right to save questions for later review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-brand-600">Q#{idx + 1}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{q.topic.toUpperCase()}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">{q.difficulty}</span>
                </div>

                <button
                  onClick={() => removeBookmark(q.id)}
                  className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed mb-4">
                {isHindi ? (q.question_hi || q.question_en) : q.question_en}
              </p>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <div className="font-bold text-emerald-600">
                  Answer: Option {String.fromCharCode(65 + q.correct_answer)} — {q.options[q.correct_answer]}
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {isHindi ? q.solution_hi : q.solution_en}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
