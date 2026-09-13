import React, { useState, useEffect } from 'react';
import { Bookmark, Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight, HelpCircle, Zap, ShieldAlert, Award, RefreshCw, Filter, Sparkles } from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function PracticeArena({ isHindi }) {
  const [questions, setQuestions] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [selectedExam, setSelectedExam] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Question solving state
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: optionIndex }
  const [submittedQuestions, setSubmittedQuestions] = useState({}); // { [qId]: boolean }
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [bookmarked, setBookmarked] = useState(new Set());
  const [mistakeReasons, setMistakeReasons] = useState({}); // { [qId]: reason }
  const [showMistakeModal, setShowMistakeModal] = useState(false);

  // Timer per question
  const [questionTimer, setQuestionTimer] = useState(0);

  // Load questions based on filters
  useEffect(() => {
    let qList = dataManager.getAllQuestions();
    if (selectedTopic !== 'ALL') {
      qList = qList.filter(q => q.topic === selectedTopic);
    }
    if (selectedExam !== 'ALL') {
      qList = qList.filter(q => q.exam && q.exam.includes(selectedExam));
    }
    if (selectedDifficulty !== 'ALL') {
      qList = qList.filter(q => q.difficulty.toUpperCase() === selectedDifficulty.toUpperCase());
    }

    setQuestions(qList);
    setCurrentIndex(0);
    setQuestionTimer(0);
  }, [selectedTopic, selectedExam, selectedDifficulty]);

  // Timer interval
  useEffect(() => {
    const interval = setInterval(() => {
      setQuestionTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const currentQ = questions[currentIndex];

  if (!currentQ) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">No questions found matching criteria</h3>
        <p className="text-sm text-slate-500 mt-1">Try broadening your filters to explore other practice sets.</p>
        <button
          onClick={() => { setSelectedTopic('ALL'); setSelectedExam('ALL'); setSelectedDifficulty('ALL'); }}
          className="mt-4 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-lg"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  const isSubmitted = !!submittedQuestions[currentQ.id];
  const userChoice = userAnswers[currentQ.id];
  const isCorrect = userChoice === currentQ.correct_answer;
  const isMarked = markedForReview.has(currentQ.id);
  const isBookmarked = dataManager.isBookmarked(currentQ.id);

  const handleSelectOption = (idx) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: idx }));
  };

  const handleSubmitAnswer = () => {
    if (userChoice === undefined) return;
    setSubmittedQuestions(prev => ({ ...prev, [currentQ.id]: true }));

    const correct = userChoice === currentQ.correct_answer;
    dataManager.saveAnswerResult({
      questionId: currentQ.id,
      topicId: currentQ.topic,
      isCorrect: correct,
      timeTakenSec: questionTimer
    });

    if (!correct) {
      setShowMistakeModal(true);
    }
  };

  const handleMistakeReason = (reason) => {
    setMistakeReasons(prev => ({ ...prev, [currentQ.id]: reason }));
    dataManager.logMistake({
      questionId: currentQ.id,
      topicId: currentQ.topic,
      timeTakenSec: questionTimer,
      reason,
      timestamp: Date.now()
    });
    setShowMistakeModal(false);
  };

  const toggleBookmark = () => {
    const updated = dataManager.toggleBookmark(currentQ.id);
    setBookmarked(new Set(dataManager.getBookmarks()));
  };

  const toggleMarkForReview = () => {
    setMarkedForReview(prev => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) next.delete(currentQ.id);
      else next.add(currentQ.id);
      return next;
    });
  };

  const topics = dataManager.getTopics();

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </span>

            {/* Exam Select */}
            <select
              value={selectedExam}
              onChange={e => setSelectedExam(e.target.value)}
              className="p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-300"
            >
              <option value="ALL">All Exams (SBI, IBPS, RRB)</option>
              <option value="SBI_CLERK">SBI Clerk</option>
              <option value="IBPS_CLERK">IBPS Clerk / CSA</option>
              <option value="IBPS_RRB_OA">IBPS RRB Office Assistant</option>
            </select>

            {/* Topic Select */}
            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-300"
            >
              <option value="ALL">All 22 Reasoning Topics</option>
              {topics.map(t => (
                <option key={t.id} value={t.id}>{isHindi ? t.name_hi : t.name}</option>
              ))}
            </select>

            {/* Difficulty Select */}
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-300"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-mono font-bold">
            Showing {questions.length} Solvable Questions
          </div>
        </div>
      </div>

      {/* Main Practice Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Columns: Active Question Card */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            {/* Question Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-mono">
                  Q {currentIndex + 1} / {questions.length}
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {currentQ.topic.toUpperCase()}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  currentQ.difficulty === 'EASY' ? 'bg-emerald-100 text-emerald-800' : currentQ.difficulty === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {currentQ.difficulty}
                </span>
                {currentQ.type && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-medium">
                    {currentQ.type.replace('_', ' ')}
                  </span>
                )}
              </div>

              {/* Timer & Controls */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 font-bold">
                  <Clock className="w-3.5 h-3.5 text-brand-500" />
                  <span>{questionTimer}s</span>
                  <span className="text-[10px] text-slate-400">/ {currentQ.expected_time}s exp</span>
                </div>
                <button
                  onClick={toggleBookmark}
                  className={`p-1.5 rounded-lg border transition ${
                    isBookmarked ? 'bg-amber-50 text-amber-600 border-amber-300' : 'text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                  title="Bookmark Question"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="my-6">
              <div className="text-base font-medium text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                {isHindi ? (currentQ.question_hi || currentQ.question_en) : currentQ.question_en}
              </div>
            </div>

            {/* Options List */}
            <div className="space-y-3 my-6">
              {currentQ.options.map((opt, idx) => {
                const isSelected = userChoice === idx;
                const isCorrectOption = idx === currentQ.correct_answer;

                let optionStyles = 'border-slate-200 dark:border-slate-800 hover:border-brand-400 bg-white dark:bg-slate-800/60 text-slate-800 dark:text-slate-200';
                if (isSelected && !isSubmitted) {
                  optionStyles = 'border-brand-600 bg-brand-50/70 dark:bg-slate-800 ring-2 ring-brand-400 text-brand-900 dark:text-white font-bold';
                }
                if (isSubmitted) {
                  if (isCorrectOption) {
                    optionStyles = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-400';
                  } else if (isSelected && !isCorrectOption) {
                    optionStyles = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 font-bold ring-2 ring-rose-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between text-sm ${optionStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold text-xs shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isSubmitted && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isSubmitted && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-slate-200 dark:border-slate-800">
              <div className="flex gap-2">
                <button
                  onClick={toggleMarkForReview}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                    isMarked
                      ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {isMarked ? '★ Marked for Review' : 'Mark for Review'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={userChoice === undefined}
                    className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-sm transition"
                  >
                    {isHindi ? 'उत्तर जमा करें' : 'Submit Answer'}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (currentIndex < questions.length - 1) {
                        setCurrentIndex(prev => prev + 1);
                        setQuestionTimer(0);
                      }
                    }}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
                  >
                    <span>{isHindi ? 'अगला प्रश्न' : 'Next Question'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Dual Solution: Solve Like Topper (Revealed on Submit) */}
          {isSubmitted && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isHindi ? 'टॉपर की तरह हल करें (Solve Like Topper)' : 'Dual Solution: Normal vs Topper Method'}
                  </h3>
                </div>
                <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  ⚡ Expected Time: {currentQ.expected_time}s | Your Time: {questionTimer}s
                </div>
              </div>

              {/* Method Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Method 1: Normal Method */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span>Method 1: Standard Textbook Method</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {isHindi ? currentQ.solution_hi : currentQ.solution_en}
                  </div>
                </div>

                {/* Method 2: Fast Exam / Topper Shortcut */}
                <div className="p-4 bg-amber-50/50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs">
                  <div className="font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Method 2: Fast Topper Exam Trick</span>
                  </div>
                  <div className="text-amber-950 dark:text-amber-200 leading-relaxed">
                    <p className="font-semibold mb-1">Shortcut:</p>
                    <p>{currentQ.shortcut}</p>
                    {currentQ.exam_trick && (
                      <div className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-800">
                        <span className="font-semibold text-brand-600 dark:text-brand-400">Exam Trick: </span>
                        <span>{currentQ.exam_trick}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Trap Alert */}
              {currentQ.trap && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <strong className="font-bold">Common Trap: </strong>
                    <span>{currentQ.trap}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Question Palette & Navigation */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              {isHindi ? 'प्रश्न पैलेट' : 'Question Palette'}
            </h4>
            <div className="grid grid-cols-5 gap-1.5 max-h-64 overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const ans = userAnswers[q.id];
                const sub = submittedQuestions[q.id];
                const mrk = markedForReview.has(q.id);
                const isCur = idx === currentIndex;

                let paletteColor = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
                if (mrk) {
                  paletteColor = 'bg-purple-600 text-white font-bold';
                } else if (sub) {
                  paletteColor = ans === q.correct_answer ? 'bg-emerald-600 text-white font-bold' : 'bg-rose-600 text-white font-bold';
                } else if (ans !== undefined) {
                  paletteColor = 'bg-brand-600 text-white font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setQuestionTimer(0);
                    }}
                    className={`h-8 rounded-lg text-xs font-mono transition flex items-center justify-center relative ${paletteColor} ${
                      isCur ? 'ring-2 ring-brand-400 ring-offset-2 scale-105' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Correct</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>Wrong</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-600"></span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                <span>Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mistake Classifier Modal (Section 66) */}
      {showMistakeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <XCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold">
                {isHindi ? 'यह प्रश्न गलत क्यों हुआ?' : 'Why did you miss this question?'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {isHindi
                ? 'अपनी गलती को वर्गीकृत करें ताकि आपका पर्सनल ट्यूटर आपको सही अभ्यास सुझा सके।'
                : 'Categorize your mistake to help our Weakness Detector optimize your revision roadmap.'}
            </p>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "Concept error", label: isHindi ? "संकल्पना त्रुटि (Concept)" : "Concept Error" },
                { id: "Calculation error", label: isHindi ? "गणना गलती (Calculation)" : "Calculation Error" },
                { id: "Misread", label: isHindi ? "प्रश्न गलत पढ़ा (Misread)" : "Misread Question" },
                { id: "Time pressure", label: isHindi ? "समय का दबाव (Time Rush)" : "Time Rush / Panic" },
                { id: "Forgot trick", label: isHindi ? "ट्रिक भूल गए (Forgot Trick)" : "Forgot Shortcut Trick" },
                { id: "Guess", label: isHindi ? "तुक्का लगाया (Guess)" : "Blind Guess" }
              ].map(reason => (
                <button
                  key={reason.id}
                  onClick={() => handleMistakeReason(reason.id)}
                  className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
                >
                  {reason.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowMistakeModal(false)}
              className="mt-4 w-full py-2 text-center text-xs text-slate-400 hover:text-slate-600"
            >
              Skip Categorization
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
