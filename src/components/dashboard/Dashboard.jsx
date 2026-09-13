import React, { useState, useEffect } from 'react';
import { Award, Flame, Target, Clock, Zap, BookOpen, Brain, Trophy, ChevronRight, AlertCircle, CheckCircle2, ArrowUpRight, BarChart2, ShieldAlert } from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function Dashboard({ setActiveTab, isHindi }) {
  const [readiness, setReadiness] = useState({ score: 0, status: 'Not Started', label: '', accuracy: 0, avgTime: 0, details: {} });
  const [progress, setProgress] = useState({ attemptedCount: 0, correctCount: 0, wrongCount: 0, streakDays: 1 });
  const [weaknessMatrix, setWeaknessMatrix] = useState([]);

  useEffect(() => {
    setReadiness(dataManager.getReadinessScore());
    setProgress(dataManager.getProgress());
    setWeaknessMatrix(dataManager.getWeaknessMatrix());
  }, []);

  // Smart recommendation calculation
  const getSmartRecommendation = () => {
    const tested = weaknessMatrix.filter(w => w.status !== 'UNTESTED');
    if (tested.length === 0) {
      return {
        topicId: 'inequality',
        topicName: isHindi ? 'असमानता (Inequality)' : 'Inequality',
        reasonEn: 'Start with high-speed fundamental topics to build your baseline accuracy.',
        reasonHi: 'बुनियादी सटीकता विकसित करने के लिए हाई-स्पीड टॉपिक से शुरुआत करें।',
        targetCount: 15
      };
    }

    // Find red or lowest accuracy
    const redTopics = tested.filter(w => w.status === 'RED');
    if (redTopics.length > 0) {
      const worst = redTopics.sort((a, b) => a.accuracy - b.accuracy)[0];
      return {
        topicId: worst.id,
        topicName: isHindi ? worst.name_hi : worst.name,
        reasonEn: `Your accuracy in ${worst.name} is ${worst.accuracy}% (below 60% threshold). Practice 10 questions to eliminate mistakes.`,
        reasonHi: `${worst.name} में आपकी सटीकता ${worst.accuracy}% है (60% से कम)। गलतियाँ सुधारने के लिए 10 प्रश्नों का अभ्यास करें।`,
        targetCount: 10
      };
    }

    // Otherwise find slowest topic
    const slowest = [...tested].sort((a, b) => b.avgTime - a.avgTime)[0];
    return {
      topicId: slowest.id,
      topicName: isHindi ? slowest.name_hi : slowest.name,
      reasonEn: `Your accuracy is good, but average solving time in ${slowest.name} is ${slowest.avgTime}s. Focus on Speed Lab drills.`,
      reasonHi: `सटीकता अच्छी है, लेकिन ${slowest.name} में औसत समय ${slowest.avgTime}s है। स्पीड लैब में गति बढ़ाएँ।`,
      targetCount: 15
    };
  };

  const rec = getSmartRecommendation();

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Readiness Header */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SBI Clerk • IBPS Clerk/CSA • RRB OA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bank Reasoning Master
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isHindi
                ? 'शून्य से चयन तक: संकल्पना स्पष्टता • गति निर्माण • विगत वर्षों के रुझान • टॉपर शॉर्टकट्स • फुल मॉक टेस्ट'
                : 'Zero to Selection: Concept Clear • Basic Practice • Speed Building • 2020-2026 PYQ Trends • Mock Simulator.'}
            </p>
          </div>

          {/* Reasoning Readiness Score Circle */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center gap-5 shrink-0">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-400"
                  strokeDasharray={`${readiness.score}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black font-mono leading-none">{readiness.score}</span>
                <span className="text-[10px] text-slate-300 block">/100</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300">Readiness Score</div>
              <div className="text-sm font-bold text-amber-300">{readiness.status}</div>
              <div className="text-[11px] text-slate-300 max-w-[140px] truncate">{readiness.label}</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{isHindi ? 'वर्तमान स्ट्रीक' : 'Current Streak'}</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">{progress.streakDays} Days</div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{isHindi ? 'प्रश्न हल किए' : 'Questions Solved'}</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">{progress.attemptedCount}</div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{isHindi ? 'सटीकता' : 'Overall Accuracy'}</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
              {progress.attemptedCount > 0 ? Math.round((progress.correctCount / progress.attemptedCount) * 100) : 0}%
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{isHindi ? 'औसत समय / प्रश्न' : 'Avg Time / Q'}</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
              {progress.attemptedCount > 0 ? Math.round(progress.totalTimeSec / progress.attemptedCount) : 0}s
            </div>
          </div>
        </div>
      </div>

      {/* Smart Daily Practice Recommendation (Section 65) */}
      <div className="p-5 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                {isHindi ? 'आज का स्मार्ट सुझाव' : 'Smart Daily Recommendation'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold">
                Target: {rec.topicName}
              </span>
            </div>
            <p className="text-xs text-amber-900 dark:text-amber-200 mt-1 leading-relaxed">
              {isHindi ? rec.reasonHi : rec.reasonEn}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('practice')}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow shrink-0 flex items-center gap-1.5 transition"
        >
          <span>{isHindi ? 'अनुशंसित अभ्यास शुरू करें' : 'Start Practice'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 'practice', title: isHindi ? 'प्रैक्टिस एरीना' : 'Practice Arena', desc: '500+ Questions • Dual Topper Solutions', icon: Target, color: 'text-brand-600 bg-brand-50 dark:bg-brand-950' },
          { id: 'speed_lab', title: isHindi ? 'स्पीड लैब' : 'Speed Lab', desc: '20s/30s/45s/60s/90s Speed Drills', icon: Zap, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950' },
          { id: 'visualizers', title: isHindi ? 'इंटरएक्टिव लैब्स' : 'Interactive Labs', desc: 'Seating • Syllogism • Blood • Compass', icon: Brain, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950' },
          { id: 'mocks', title: isHindi ? 'मॉक टेस्ट सिमुलेटर' : 'Mock Simulator', desc: 'Full SBI, IBPS, RRB Tests with Timer', icon: Trophy, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950' },
          { id: 'pyq', title: isHindi ? 'PYQ रुझान (2020-2026)' : 'PYQ Trends & Bank', desc: 'Exam Frequency • Shifts • Priority Matrix', icon: BarChart2, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950' },
          { id: 'tricks', title: isHindi ? 'माइंड ट्रिक्स एवं शॉर्टकट' : 'Mind Tricks & Shortcuts', desc: '10 Core Tricks • Normal vs Topper Methods', icon: Sparkles, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950' },
          { id: 'trainer', title: isHindi ? 'प्रश्न चयन ट्रेनर' : 'Selection Trainer', desc: 'Master Which Puzzle to Attempt First', icon: ShieldAlert, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950' },
          { id: 'plans', title: isHindi ? '30/60/90 दिवसीय योजना' : 'Study Plans & Roadmap', desc: 'Step-by-Step Daily Schedules & Checklists', icon: BookOpen, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => setActiveTab(card.id)}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500 hover:shadow-md transition text-left flex flex-col justify-between group"
            >
              <div>
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3 transition group-hover:scale-105`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 transition">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {card.desc}
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-brand-600 dark:text-brand-400">
                <span>Explore</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Weakness Detector Matrix (Section 31) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isHindi ? 'कमजोरी संसूचक (Weakness Detector Matrix)' : 'Weakness Detector Matrix'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isHindi
                ? 'सटीकता और गति दोनों के आधार पर 22 रीज़निंग विषयों का स्वतः वर्गीकरण'
                : 'Automatic performance calibration across all 22 reasoning topics based on accuracy and solving speed.'}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Red (&lt;60% Weak)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Yellow (60-80% Moderate)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Green (&gt;80% Strong)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
          {weaknessMatrix.slice(0, 12).map(item => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border flex flex-col justify-between ${
                item.status === 'RED'
                  ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                  : item.status === 'YELLOW'
                  ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
                  : item.status === 'GREEN'
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span className="truncate">{isHindi ? item.name_hi : item.name}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    item.status === 'RED' ? 'bg-rose-200 text-rose-800' : item.status === 'YELLOW' ? 'bg-amber-200 text-amber-800' : item.status === 'GREEN' ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>Acc: {item.accuracy}%</span>
                  <span>Avg: {item.avgTime}s</span>
                  <span>Att: {item.attempted}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sparkles({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
