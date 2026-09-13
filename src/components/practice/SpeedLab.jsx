import React, { useState, useEffect } from 'react';
import { Zap, Timer, Flame, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Award } from 'lucide-react';
import { dataManager } from '../../utils/dataManager';
import confetti from 'canvas-confetti';

export default function SpeedLab({ isHindi }) {
  const [targetTime, setTargetTime] = useState(20); // 20, 30, 45, 60, 90
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [sessionResults, setSessionResults] = useState([]);
  const [speedQuestions, setSpeedQuestions] = useState([]);

  // Load questions suitable for target speed
  const prepareSpeedQuestions = (seconds) => {
    let pool = dataManager.getAllQuestions();
    if (seconds <= 20) {
      pool = pool.filter(q => ['inequality', 'syllogism', 'ranking_order'].includes(q.topic));
    } else if (seconds <= 30) {
      pool = pool.filter(q => ['alphanumeric_series', 'coding_decoding', 'ranking_order'].includes(q.topic));
    } else if (seconds <= 45) {
      pool = pool.filter(q => ['direction_distance', 'blood_relations', 'syllogism'].includes(q.topic));
    } else if (seconds <= 60) {
      pool = pool.filter(q => ['logical_reasoning', 'coding_decoding', 'ranking_order'].includes(q.topic));
    } else {
      pool = pool.filter(q => ['puzzles', 'seating', 'input_output'].includes(q.topic));
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setSpeedQuestions(shuffled.slice(0, 15));
  };

  const startSession = (sec) => {
    setTargetTime(sec);
    setTimeLeft(sec);
    setIsActive(true);
    setCurrentIdx(0);
    setStreak(0);
    setSessionResults([]);
    prepareSpeedQuestions(sec);
  };

  // Live countdown timer
  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleAnswer(-1, true); // Time out
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const handleAnswer = (optionIdx, isTimeOut = false) => {
    const q = speedQuestions[currentIdx];
    if (!q) return;

    const isCorrect = !isTimeOut && optionIdx === q.correct_answer;
    const timeSpent = targetTime - timeLeft;

    const result = {
      qId: q.id,
      topic: q.topic,
      isCorrect,
      isTimeOut,
      timeSpent: isTimeOut ? targetTime : timeSpent
    };

    setSessionResults(prev => [...prev, result]);

    dataManager.saveAnswerResult({
      questionId: q.id,
      topicId: q.topic,
      isCorrect,
      timeTakenSec: result.timeSpent
    });

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      if (newStreak % 5 === 0) {
        try { confetti({ particleCount: 50, spread: 60 }); } catch (e) {}
      }
    } else {
      setStreak(0);
    }

    if (currentIdx < speedQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setTimeLeft(targetTime);
    } else {
      setIsActive(false);
      try { confetti({ particleCount: 100, spread: 80 }); } catch (e) {}
    }
  };

  const currentQ = speedQuestions[currentIdx];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              {isHindi ? 'हाई-स्पीड लैब' : 'High-Intensity Speed Lab'}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isHindi ? 'स्पीड ट्रेनिंग लैब (Speed Lab)' : 'Speed Training Lab'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isHindi
              ? 'समय सीमा के साथ प्रश्नों को हल करें और अपनी प्रतिक्रिया गति में सुधार करें।'
              : 'Condition your cognitive reflexes under strict time pressure to hit sub-20s Clerk exam standards.'}
          </p>
        </div>

        {/* Modes Bar */}
        {!isActive && (
          <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {[
              { sec: 20, label: '20s Sprint', tag: 'Inequality/Syllogism' },
              { sec: 30, label: '30s Drill', tag: 'Alphanumeric/Ranking' },
              { sec: 45, label: '45s Challenge', tag: 'Blood/Direction' },
              { sec: 60, label: '60s Logic', tag: 'Critical Reasoning' },
              { sec: 90, label: '90s Puzzle Sprint', tag: 'Fast Puzzles' }
            ].map(m => (
              <button
                key={m.sec}
                onClick={() => startSession(m.sec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  targetTime === m.sec
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Workspace */}
      {!isActive && sessionResults.length === 0 && (
        <div className="my-10 text-center max-w-lg mx-auto p-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/70 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Timer className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isHindi ? 'स्पीड स्प्रिंट चुनें और प्रारंभ करें' : 'Select a Speed Sprint to Begin'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Targeting 35/35 in 20 minutes requires solving individual standalone questions in under 20-30 seconds. Choose a speed tier above to build rapid pattern recognition.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => startSession(20)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {isHindi ? '20-सेकंड स्प्रिंट प्रारंभ करें' : 'Start 20s Sprint Now'}
            </button>
          </div>
        </div>
      )}

      {/* Active Question Session */}
      {isActive && currentQ && (
        <div className="my-6 max-w-2xl mx-auto bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-2xl">
          {/* Top Progress & Live Countdown */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">
                Question {currentIdx + 1} / {speedQuestions.length}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800">
                <Flame className="w-3.5 h-3.5" />
                <span>Streak: {streak}</span>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className={`flex items-center gap-1.5 font-mono text-base font-extrabold px-4 py-1.5 rounded-xl transition-all ${
              timeLeft <= 5
                ? 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse scale-105'
                : 'bg-slate-800 text-amber-400 border border-slate-700'
            }`}>
              <Timer className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="my-6">
            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-400 bg-slate-800 px-2 py-0.5 rounded">
              {currentQ.topic.replace('_', ' ')}
            </span>
            <p className="mt-3 text-sm font-medium text-slate-100 whitespace-pre-line leading-relaxed">
              {isHindi ? (currentQ.question_hi || currentQ.question_en) : currentQ.question_en}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-brand-600 border border-slate-700 hover:border-brand-500 font-medium text-xs text-slate-200 hover:text-white transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-700 group-hover:bg-white text-white flex items-center justify-center font-mono font-bold text-[10px]">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Post Session Summary */}
      {!isActive && sessionResults.length > 0 && (
        <div className="my-6 max-w-xl mx-auto p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
          <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-2" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {isHindi ? 'स्प्रिंट पूर्ण हुआ!' : 'Speed Sprint Completed!'}
          </h3>
          <p className="text-xs text-slate-500 mb-6">Target: {targetTime}s per question</p>

          <div className="grid grid-cols-3 gap-3 font-mono mb-6">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400">Score</div>
              <div className="text-lg font-bold text-brand-600 dark:text-brand-400">
                {sessionResults.filter(r => r.isCorrect).length} / {sessionResults.length}
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400">Accuracy</div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round((sessionResults.filter(r => r.isCorrect).length / sessionResults.length) * 100)}%
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400">Best Streak</div>
              <div className="text-lg font-bold text-amber-500 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-current" />
                <span>{bestStreak}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => startSession(targetTime)}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow transition"
          >
            {isHindi ? 'पुनः स्प्रिंट करें' : 'Sprint Again'}
          </button>
        </div>
      )}
    </div>
  );
}
