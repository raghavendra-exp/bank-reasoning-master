import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Sparkles, HelpCircle, ArrowRight, Zap } from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function GlobalSearchModal({ isOpen, onClose, onSelectTopic, onSelectTrick }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ topics: [], tricks: [], questions: [] });

  useEffect(() => {
    if (!query.trim()) {
      setResults({ topics: [], tricks: [], questions: [] });
      return;
    }

    const q = query.toLowerCase();

    // 1. Search topics
    const topics = dataManager.getTopics().filter(t =>
      t.name.toLowerCase().includes(q) ||
      (t.name_hi && t.name_hi.includes(q)) ||
      t.concept.toLowerCase().includes(q) ||
      (t.subtopics && t.subtopics.some(s => s.toLowerCase().includes(q)))
    );

    // 2. Search tricks
    const tricksData = dataManager.getTricksData();
    const tricks = (tricksData.mind_tricks || []).filter(tr =>
      tr.title.toLowerCase().includes(q) ||
      (tr.title_hi && tr.title_hi.includes(q)) ||
      tr.why_it_works.toLowerCase().includes(q) ||
      tr.method.toLowerCase().includes(q)
    );

    // 3. Search questions
    const questions = dataManager.getAllQuestions().filter(qu =>
      qu.question_en.toLowerCase().includes(q) ||
      (qu.question_hi && qu.question_hi.includes(q)) ||
      (qu.tags && qu.tags.some(tag => tag.toLowerCase().includes(q)))
    ).slice(0, 8);

    setResults({ topics: topics.slice(0, 6), tricks: tricks.slice(0, 4), questions });
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search topics, questions, tricks, 'only a few', 'floor puzzle'..."
            className="w-full bg-transparent border-0 focus:outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {!query.trim() && (
            <div className="py-8 text-center text-slate-400">
              Type keywords like <strong className="text-brand-600 font-mono">"only a few"</strong>, <strong className="text-brand-600 font-mono">"circular"</strong>, or <strong className="text-brand-600 font-mono">"inequality"</strong> to search across all modules.
            </div>
          )}

          {query.trim() && results.topics.length === 0 && results.tricks.length === 0 && results.questions.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              No direct matches found for "{query}". Try a broader term.
            </div>
          )}

          {/* Matching Topics */}
          {results.topics.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Topics & Syllabus ({results.topics.length})
              </div>
              <div className="space-y-1.5">
                {results.topics.map(t => (
                  <div
                    key={t.id}
                    onClick={() => { onSelectTopic(t.id); onClose(); }}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/60 rounded-xl cursor-pointer transition flex items-center justify-between border border-slate-200 dark:border-slate-700"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{t.name}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{t.concept}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matching Mind Tricks */}
          {results.tricks.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Mind Tricks & Hacks ({results.tricks.length})
              </div>
              <div className="space-y-1.5">
                {results.tricks.map(tr => (
                  <div
                    key={tr.id}
                    onClick={() => { onSelectTrick(tr.id); onClose(); }}
                    className="p-3 bg-amber-50/50 dark:bg-amber-950/30 hover:bg-amber-100 rounded-xl cursor-pointer transition border border-amber-200 dark:border-amber-900/60"
                  >
                    <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-600 fill-current" />
                      <span>{tr.title}</span>
                    </div>
                    <div className="text-[11px] text-amber-950/80 dark:text-amber-300 line-clamp-1 mt-0.5">{tr.why_it_works}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matching Questions */}
          {results.questions.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Practice Questions ({results.questions.length})
              </div>
              <div className="space-y-1.5">
                {results.questions.map(q => (
                  <div
                    key={q.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex justify-between font-mono text-[10px] text-slate-400 mb-1">
                      <span>{q.topic.toUpperCase()}</span>
                      <span className="font-bold text-emerald-600">{q.difficulty}</span>
                    </div>
                    <div className="text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed font-medium">
                      {q.question_en}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
