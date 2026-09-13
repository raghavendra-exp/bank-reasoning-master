import React, { useState } from 'react';
import { BookOpen, AlertTriangle, Zap, CheckCircle2, ChevronRight, Bookmark, Edit3, ShieldAlert, Sparkles } from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function ConceptLearner({ isHindi, onStartPractice }) {
  const topics = dataManager.getTopics();
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0]?.id || 'puzzles');
  const [topicNotes, setTopicNotes] = useState(dataManager.getNotes());
  const [currentNote, setCurrentNote] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);

  const currentTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

  const handleSaveNote = () => {
    dataManager.saveNote(currentTopic.id, currentNote);
    setTopicNotes(dataManager.getNotes());
    setIsEditingNote(false);
  };

  const startEditNote = () => {
    setCurrentNote(topicNotes[currentTopic.id] || '');
    setIsEditingNote(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                Comprehensive 22-Topic Syllabus
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isHindi ? 'रीज़निंग संकल्पना एवं पाठ्यक्रम कोष' : 'Reasoning Concepts & Syllabus Repository'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isHindi
                ? 'प्रत्येक विषय की संकल्पना, उपविषय, शॉर्टकट ट्रिक्स, आम गलतियाँ और व्यक्तिगत नोट्स।'
                : 'Exhaustive syllabus guide covering concepts, 8-step puzzle framework, pitfalls, and topper shortcuts.'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Topic Sidebar + Deep-dive Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Topics List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 space-y-1.5 max-h-[700px] overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
            22 Reasoning Topics
          </div>
          {topics.map(t => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTopicId(t.id);
                setIsEditingNote(false);
              }}
              className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                selectedTopicId === t.id
                  ? 'bg-brand-600 text-white font-bold shadow'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="truncate">{isHindi ? t.name_hi : t.name}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
            </button>
          ))}
        </div>

        {/* Topic Deep Dive Details */}
        {currentTopic && (
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              {/* Top Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {currentTopic.category}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {isHindi ? currentTopic.name_hi : currentTopic.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                    currentTopic.priority === 'MUST_DO'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {currentTopic.priority_label}
                  </span>
                  {onStartPractice && (
                    <button
                      onClick={() => onStartPractice(currentTopic.id)}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow transition"
                    >
                      Practice Questions →
                    </button>
                  )}
                </div>
              </div>

              {/* Weightage & Duration KPI Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase">Prelims Weightage</div>
                  <div className="text-sm font-bold text-brand-600 dark:text-brand-400 mt-0.5">{currentTopic.prelims_weightage}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase">Mains Weightage</div>
                  <div className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-0.5">{currentTopic.mains_weightage}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase">Difficulty Tier</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{currentTopic.difficulty}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase">Target Solving Time</div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{currentTopic.expected_time_per_set}</div>
                </div>
              </div>

              {/* Core Concept Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Concept & Theoretical Foundations
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  {isHindi ? currentTopic.concept_hi : currentTopic.concept}
                </p>
              </div>

              {/* Subtopics Checklist */}
              {currentTopic.subtopics && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Key Subtopics & Variations
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {currentTopic.subtopics.map((sub, idx) => (
                      <div key={idx} className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special 8-Step Framework (If available, e.g. Puzzles) */}
              {currentTopic.eight_step_framework && (
                <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>The 8-Step Exam Hall Puzzle Framework</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {currentTopic.eight_step_framework.map((step, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-800 rounded-lg border border-slate-700 font-mono">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Traps Alert */}
              {currentTopic.common_traps && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 space-y-2">
                  <div className="font-bold flex items-center gap-2 text-rose-700 dark:text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>How Examiners Lay Traps in This Topic:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    {currentTopic.common_traps.map((trap, idx) => (
                      <li key={idx}>{trap}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Shortcuts & Mental Tricks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/60">
                  <div className="font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600 fill-current" />
                    <span>Shortcut Method:</span>
                  </div>
                  <p className="text-amber-950 dark:text-amber-200 leading-relaxed">
                    {currentTopic.shortcut_method}
                  </p>
                </div>

                <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800/60">
                  <div className="font-bold text-purple-900 dark:text-purple-300 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Mental Trick:</span>
                  </div>
                  <p className="text-purple-950 dark:text-purple-200 leading-relaxed">
                    {currentTopic.mental_trick}
                  </p>
                </div>
              </div>

              {/* Personal Topic Note Box (Section 45) */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Edit3 className="w-3.5 h-3.5 text-brand-600" />
                    <span>{isHindi ? 'मेरे व्यक्तिगत नोट्स (Personal Topic Notes)' : 'My Personal Topic Notes'}</span>
                  </div>
                  {!isEditingNote && (
                    <button
                      onClick={startEditNote}
                      className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-semibold"
                    >
                      {topicNotes[currentTopic.id] ? 'Edit Note' : '+ Add Note'}
                    </button>
                  )}
                </div>

                {isEditingNote ? (
                  <div className="space-y-2">
                    <textarea
                      rows="3"
                      value={currentNote}
                      onChange={e => setCurrentNote(e.target.value)}
                      placeholder="e.g., Remember: In circular arrangements, start with the person who has the most connecting clues..."
                      className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                    ></textarea>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditingNote(false)}
                        className="px-3 py-1.5 text-xs text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveNote}
                        className="px-4 py-1.5 bg-brand-600 text-white text-xs font-bold rounded-lg"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                    {topicNotes[currentTopic.id] || "No personal notes added for this topic yet. Click '+ Add Note' to jot down your personal memory hooks."}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
