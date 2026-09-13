import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, XCircle, Trophy, Sparkles, Award, ArrowRight } from 'lucide-react';
import { dataManager } from '../../utils/dataManager';
import confetti from 'canvas-confetti';

export default function DailyChallenge({ isHindi }) {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes = 600s
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Generate today's balanced 10 questions
  useEffect(() => {
    const all = dataManager.getAllQuestions();
    const easy = all.filter(q => q.difficulty === 'EASY');
    const med = all.filter(q => q.difficulty === 'MEDIUM');
    const hard = all.filter(q => q.difficulty === 'HARD');

    // Deterministic daily pick using date
    const today = new Date().toISOString().split('T')[0];
    const dateNum = today.split('-').reduce((acc, part) => acc + parseInt(part), 0);

    const pick = (arr, count, offset) => {
      const result = [];
      for (let i = 0; i < count; i++) {
        if (arr.length > 0) {
          result.push(arr[(dateNum + offset + i) % arr.length]);
        }
      }
      return result;
    };

    const dailySet = [
      ...pick(easy, 3, 1),
      ...pick(med, 4, 10),
      ...pick(hard, 2, 25),
      ...pick(hard, 1, 50)
    ];

    setQuestions(dailySet);
  }, []);

  // Timer countdown
  useEffect(() => {
    let timer;
    if (hasStarted && !isCompleted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !isCompleted) {
      handleSubmitTest();
    }
    return () => clearInterval(timer);
  }, [hasStarted, isCompleted, timeLeft]);

  const handleSelectOption = (idx) => {
    if (isCompleted) return;
    const q = questions[currentIdx];
    setUserAnswers(prev => ({ ...prev, [q.id]: idx }));
  };

  const handleSubmitTest = () => {
    setIsCompleted(true);
    let correct = 0;
    const timeSpent = 600 - timeLeft;

    questions.forEach(q => {
      const isCorr = userAnswers[q.id] === q.correct_answer;
      if (isCorr) correct += 1;
      dataManager.saveAnswerResult({
        questionId: q.id,
        topicId: q.topic,
        isCorrect: isCorr,
        timeTakenSec: Math.round(timeSpent / questions.length)
      });
    });

    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const currentQ = questions[currentIdx];

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isHindi ? 'दैनिक रीज़निंग चैलेंज (Daily Challenge)' : 'Daily Reasoning Challenge'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isHindi
              ? '10 संतुलित प्रश्न (3 Easy • 4 Medium • 2 Hard • 1 Challenge) | 10 मिनट टाइमर'
              : '10 Hand-picked balanced questions: 3 Easy • 4 Medium • 2 Hard • 1 Challenge with 10-min countdown.'}
          </p>
        </div>

        {hasStarted && !isCompleted && (
          <div className="flex items-center gap-2 font-mono font-bold text-sm bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-brand-600 dark:text-brand-300">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Start Screen */}
      {!hasStarted && !isCompleted && (
        <div className="my-10 text-center max-w-md mx-auto p-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950/70 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isHindi ? 'आज का चैलेंज प्रारंभ करें' : 'Start Today’s Daily Challenge'}
          </h3>
          <div className="grid grid-cols-2 gap-2 my-4 text-xs font-semibold text-slate-600 dark:text-slate-300 text-left">
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              ✓ 10 Questions
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              ✓ 10-Minute Limit
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              ✓ Streak Multiplier
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              ✓ Mistake Log Sync
            </div>
          </div>
          <button
            onClick={() => setHasStarted(true)}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/30 transition"
          >
            {isHindi ? 'चैलेंज शुरू करें' : 'Begin 10-Minute Challenge'}
          </button>
        </div>
      )}

      {/* Test Questions Screen */}
      {hasStarted && !isCompleted && currentQ && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 my-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-brand-600 dark:text-brand-400">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-200 dark:bg-slate-700 font-bold">
                  {currentQ.topic.toUpperCase()} • {currentQ.difficulty}
                </span>
              </div>

              <p className="text-sm font-medium text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed mb-6">
                {isHindi ? (currentQ.question_hi || currentQ.question_en) : currentQ.question_en}
              </p>

              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = userAnswers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition flex items-center gap-3 ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 ring-2 ring-purple-400 text-purple-900 dark:text-purple-200 font-bold'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
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

              {/* Bottom Buttons */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 text-xs font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg disabled:opacity-40"
                >
                  Previous
                </button>
                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="px-4 py-2 text-xs font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-500"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitTest}
                    className="px-6 py-2 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
                  >
                    Submit Test ✓
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Palette */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase">Question Palette</h4>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isCurrent = idx === currentIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-8 rounded-lg text-xs font-mono font-bold transition ${
                      isCurrent
                        ? 'ring-2 ring-purple-500 bg-purple-600 text-white'
                        : isAnswered
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleSubmitTest}
              className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow"
            >
              Submit Challenge
            </button>
          </div>
        </div>
      )}

      {/* Completion Summary */}
      {isCompleted && (
        <div className="my-8 max-w-lg mx-auto text-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Trophy className="w-14 h-14 text-amber-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {isHindi ? 'दैनिक चैलेंज पूर्ण!' : 'Daily Challenge Completed!'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Your daily streak is updated in your profile!</p>

          <div className="grid grid-cols-3 gap-3 my-6 font-mono">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400">Score</div>
              <div className="text-lg font-bold text-brand-600 dark:text-brand-400">
                {questions.filter(q => userAnswers[q.id] === q.correct_answer).length} / {questions.length}
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400">Time Used</div>
              <div className="text-lg font-bold text-slate-800 dark:text-white">
                {formatTime(600 - timeLeft)}
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400">Accuracy</div>
              <div className="text-lg font-bold text-emerald-600">
                {Math.round((questions.filter(q => userAnswers[q.id] === q.correct_answer).length / questions.length) * 100)}%
              </div>
            </div>
          </div>

          <div className="space-y-2 text-left my-4 max-h-48 overflow-y-auto text-xs">
            {questions.map((q, idx) => {
              const isCorr = userAnswers[q.id] === q.correct_answer;
              return (
                <div key={q.id} className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span>Q{idx + 1}. {q.topic} ({q.difficulty})</span>
                  <span className={`font-bold font-mono ${isCorr ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isCorr ? '✓ Correct' : '✗ Wrong'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
