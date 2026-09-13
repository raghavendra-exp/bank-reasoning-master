import React, { useState, useEffect } from 'react';
import { Timer, ShieldAlert, Award, CheckCircle2, XCircle, BarChart2, RotateCcw, AlertTriangle, Sparkles, Trophy } from 'lucide-react';
import { dataManager } from '../../utils/dataManager';
import confetti from 'canvas-confetti';

export default function ExamSimulator({ isHindi }) {
  const [selectedMock, setSelectedMock] = useState('SBI_PRELIMS');
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);

  // Test setup
  const [mockQuestions, setMockQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(1200); // in seconds
  const [totalDuration, setTotalDuration] = useState(1200);

  // Mock Configurations (from Official exam structures)
  const mockConfigs = {
    SBI_PRELIMS: {
      name: "SBI Clerk Prelims Reasoning Mock",
      nameHi: "एसबीआई क्लर्क प्रीलिम्स रीज़निंग मॉक",
      questionsCount: 35,
      durationMin: 20,
      marksPerQ: 1,
      negativeMark: 0.25,
      timingType: "Sectional Timer (20 Minutes Strict)"
    },
    IBPS_PRELIMS: {
      name: "IBPS Clerk Prelims Reasoning Mock",
      nameHi: "आईबीपीएस क्लर्क प्रीलिम्स रीज़निंग मॉक",
      questionsCount: 35,
      durationMin: 20,
      marksPerQ: 1,
      negativeMark: 0.25,
      timingType: "Sectional Timer (20 Minutes Strict)"
    },
    RRB_PRELIMS: {
      name: "IBPS RRB Office Assistant Prelims Mock",
      nameHi: "आरआरबी ऑफिस असिस्टेंट प्रीलिम्स मॉक",
      questionsCount: 40,
      durationMin: 22,
      marksPerQ: 1,
      negativeMark: 0.25,
      timingType: "Recommended Allocation from 45 min Composite Time"
    },
    MINI_MOCK: {
      name: "Reasoning Speed Mini Mock (20 Qs)",
      nameHi: "रीज़निंग स्पीड मिनी मॉक (20 प्रश्न)",
      questionsCount: 20,
      durationMin: 10,
      marksPerQ: 1,
      negativeMark: 0.25,
      timingType: "High Speed 10-Minute Drill"
    }
  };

  const startMock = (mockKey) => {
    const cfg = mockConfigs[mockKey];
    setSelectedMock(mockKey);
    setTotalDuration(cfg.durationMin * 60);
    setTimeLeft(cfg.durationMin * 60);

    // Pick questions balanced across topics
    const all = dataManager.getAllQuestions();
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, cfg.questionsCount);

    setMockQuestions(picked);
    setUserAnswers({});
    setMarkedForReview(new Set());
    setVisitedQuestions(new Set([0]));
    setCurrentIndex(0);
    setIsTestActive(true);
    setIsTestSubmitted(false);
  };

  // Timer
  useEffect(() => {
    let timer;
    if (isTestActive && !isTestSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isTestActive && !isTestSubmitted && timeLeft === 0) {
      handleSubmitMock();
    }
    return () => clearInterval(timer);
  }, [isTestActive, isTestSubmitted, timeLeft]);

  const handleSelectOption = (idx) => {
    if (isTestSubmitted) return;
    const q = mockQuestions[currentIndex];
    setUserAnswers(prev => ({ ...prev, [q.id]: idx }));
  };

  const clearResponse = () => {
    const q = mockQuestions[currentIndex];
    setUserAnswers(prev => {
      const next = { ...prev };
      delete next[q.id];
      return next;
    });
  };

  const toggleReview = () => {
    const q = mockQuestions[currentIndex];
    setMarkedForReview(prev => {
      const next = new Set(prev);
      if (next.has(q.id)) next.delete(q.id);
      else next.add(q.id);
      return next;
    });
  };

  const goToQuestion = (idx) => {
    setCurrentIndex(idx);
    setVisitedQuestions(prev => new Set(prev).add(idx));
  };

  const handleSubmitMock = () => {
    setIsTestSubmitted(true);
    setIsTestActive(false);

    // Save each answer in progress
    const cfg = mockConfigs[selectedMock];
    const timePerQ = Math.round((totalDuration - timeLeft) / mockQuestions.length);

    mockQuestions.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans !== undefined) {
        dataManager.saveAnswerResult({
          questionId: q.id,
          topicId: q.topic,
          isCorrect: ans === q.correct_answer,
          timeTakenSec: timePerQ
        });
      }
    });

    try { confetti({ particleCount: 120, spread: 80 }); } catch (e) {}
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Mock Result Calculations
  const calculateResults = () => {
    const cfg = mockConfigs[selectedMock];
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;
    const topicLoss = {};

    mockQuestions.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans === undefined) {
        unattempted += 1;
      } else if (ans === q.correct_answer) {
        correct += 1;
      } else {
        wrong += 1;
        topicLoss[q.topic] = (topicLoss[q.topic] || 0) + 1;
      }
    });

    const marksObtained = Math.max(0, correct * cfg.marksPerQ - wrong * cfg.negativeMark);
    const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
    const attemptRate = Math.round(((correct + wrong) / mockQuestions.length) * 100);

    return {
      correct,
      wrong,
      unattempted,
      marksObtained: Math.round(marksObtained * 100) / 100,
      maxMarks: mockQuestions.length * cfg.marksPerQ,
      accuracy,
      attemptRate,
      topicLoss
    };
  };

  const currentQ = mockQuestions[currentIndex];

  return (
    <div className="space-y-6">
      {/* Mock Selection Hub (When not active & not submitted) */}
      {!isTestActive && !isTestSubmitted && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {isHindi ? 'परीक्षा सिम्युलेटर' : 'Official Exam Engine'}
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isHindi ? 'फुल मॉक टेस्ट सिमुलेटर' : 'Full Mock Test Simulator'}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isHindi
                  ? 'असली परीक्षा इंटरफेस, -0.25 नेगेटिव मार्किंग और विस्तृत प्रदर्शन विश्लेषण के साथ मॉक टेस्ट दें।'
                  : 'Real exam simulator: strict sectional timing, 0.25 negative marking, question palette, and mark-loss diagnostic.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {Object.entries(mockConfigs).map(([key, cfg]) => (
              <div
                key={key}
                className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:border-brand-500 transition"
              >
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                    {isHindi ? cfg.nameHi : cfg.name}
                  </h3>
                  <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 font-mono mb-4">
                    <div>Questions: <strong className="text-slate-800 dark:text-slate-200">{cfg.questionsCount}</strong></div>
                    <div>Duration: <strong className="text-slate-800 dark:text-slate-200">{cfg.durationMin} Mins</strong></div>
                    <div>Marking: <strong className="text-slate-800 dark:text-slate-200">+1 / -0.25</strong></div>
                    <div className="text-[10px] text-brand-600 dark:text-brand-400 font-sans mt-2">{cfg.timingType}</div>
                  </div>
                </div>

                <button
                  onClick={() => startMock(key)}
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  {isHindi ? 'मॉक टेस्ट शुरू करें' : 'Start Mock Test'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Exam Interface */}
      {isTestActive && currentQ && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          {/* Top Exam Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isHindi ? mockConfigs[selectedMock].nameHi : mockConfigs[selectedMock].name}
              </h3>
              <span className="text-xs text-slate-500">Section: Reasoning Ability</span>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 font-mono font-extrabold text-sm px-4 py-1.5 rounded-xl border ${
                timeLeft <= 180
                  ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-300 border-slate-200 dark:border-slate-700'
              }`}>
                <Timer className="w-4 h-4 text-amber-500" />
                <span>Time Left: {formatTime(timeLeft)}</span>
              </div>

              <button
                onClick={handleSubmitMock}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow"
              >
                Submit Mock
              </button>
            </div>
          </div>

          {/* Test Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
            {/* Question Screen */}
            <div className="lg:col-span-3 space-y-4">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700 text-xs">
                  <span className="font-bold text-brand-600 dark:text-brand-400">
                    Question {currentIndex + 1} of {mockQuestions.length}
                  </span>
                  <span className="font-mono text-slate-500">
                    Marks: +1.00 | Negative: -0.25
                  </span>
                </div>

                <div className="my-6 text-sm font-medium text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                  {isHindi ? (currentQ.question_hi || currentQ.question_en) : currentQ.question_en}
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = userAnswers[currentQ.id] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition flex items-center gap-3 ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50/80 dark:bg-brand-950/60 ring-2 ring-brand-400 text-brand-900 dark:text-white font-bold'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-bold text-[10px] shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex gap-2">
                    <button
                      onClick={toggleReview}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                        markedForReview.has(currentQ.id)
                          ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {markedForReview.has(currentQ.id) ? '★ Marked' : 'Mark for Review'}
                    </button>
                    <button
                      onClick={clearResponse}
                      className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Clear Response
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToQuestion(Math.max(0, currentIndex - 1))}
                      disabled={currentIndex === 0}
                      className="px-4 py-2 text-xs font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => goToQuestion(Math.min(mockQuestions.length - 1, currentIndex + 1))}
                      disabled={currentIndex === mockQuestions.length - 1}
                      className="px-5 py-2 text-xs font-bold bg-brand-600 text-white rounded-lg hover:bg-brand-500 disabled:opacity-40"
                    >
                      Save & Next →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Exam Question Palette */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase">Question Status</h4>
                <div className="grid grid-cols-5 gap-1.5 max-h-72 overflow-y-auto p-1">
                  {mockQuestions.map((q, idx) => {
                    const isAns = userAnswers[q.id] !== undefined;
                    const isMrk = markedForReview.has(q.id);
                    const isVis = visitedQuestions.has(idx);
                    const isCur = idx === currentIndex;

                    let bg = 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
                    if (isMrk) bg = 'bg-purple-600 text-white font-bold';
                    else if (isAns) bg = 'bg-emerald-600 text-white font-bold';
                    else if (isVis) bg = 'bg-rose-500 text-white font-bold';

                    return (
                      <button
                        key={q.id}
                        onClick={() => goToQuestion(idx)}
                        className={`h-8 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center ${bg} ${
                          isCur ? 'ring-2 ring-brand-400 ring-offset-1 scale-105' : ''
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span>Not Answered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                    <span>Review</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span>Not Visited</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Mock Diagnostic Report (Section 35) */}
      {isTestSubmitted && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          {(() => {
            const res = calculateResults();
            return (
              <>
                <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-800">
                  <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {isHindi ? 'मॉक टेस्ट स्कोरकार्ड एवं विश्लेषण' : 'Mock Scorecard & Diagnostic Analysis'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {mockConfigs[selectedMock].name}
                  </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-center">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-400">Net Score</div>
                    <div className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">
                      {res.marksObtained} <span className="text-xs font-normal text-slate-400">/ {res.maxMarks}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-400">Accuracy</div>
                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      {res.accuracy}%
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-400">Attempt Rate</div>
                    <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                      {res.attemptRate}%
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-400">Correct / Wrong</div>
                    <div className="text-2xl font-extrabold text-slate-800 dark:text-white">
                      <span className="text-emerald-500">{res.correct}</span> / <span className="text-rose-500">{res.wrong}</span>
                    </div>
                  </div>
                </div>

                {/* Where did you lose marks? */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>{isHindi ? 'आपने अंक कहाँ खोए? (Where did you lose marks?)' : 'Where Did You Lose Marks?'}</span>
                  </h4>
                  {Object.keys(res.topicLoss).length === 0 ? (
                    <p className="text-xs text-emerald-600 font-semibold">
                      Excellent! Zero negative marks incurred across all attempted topics.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(res.topicLoss).map(([top, count]) => (
                        <div key={top} className="flex justify-between items-center p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{top.toUpperCase()}</span>
                          <span className="text-rose-600 font-mono font-bold">
                            -{count * 0.25} marks ({count} wrong)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI / Faculty Recommendation */}
                <div className="p-4 bg-brand-50 dark:bg-brand-950/40 rounded-xl border border-brand-200 dark:border-brand-800 text-xs text-brand-900 dark:text-brand-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-brand-700 dark:text-brand-300">
                    <Sparkles className="w-4 h-4" />
                    <span>Faculty Strategic Recommendation:</span>
                  </div>
                  <p>
                    {res.marksObtained >= 30
                      ? "Outstanding performance! You are on track for top 1% cutoff in Clerk Prelims. Maintain consistency and focus on reducing time on multi-case floor puzzles."
                      : res.marksObtained >= 22
                      ? "Solid attempt rate, but negative marks reduced your aggregate. Before attempting uncertain linear puzzles, secure 100% accuracy on Syllogism and Inequality."
                      : "Action required: Shift focus to foundational Speed Lab drills. Do not begin with 4-variable puzzles under time pressure."}
                  </p>
                </div>

                <button
                  onClick={() => setIsTestSubmitted(false)}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  {isHindi ? 'दूसरा मॉक टेस्ट चुनें' : 'Choose Another Mock Test'}
                </button>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
