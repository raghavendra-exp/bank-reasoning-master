import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, BookOpen, Layers, Award, Target, Flame } from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function StudyPlans({ isHindi }) {
  const [selectedPlanId, setSelectedPlanId] = useState('plan-30');
  const [dailyPaceHours, setDailyPaceHours] = useState(2); // 1, 2, or 3 hours/day
  const [completedDays, setCompletedDays] = useState(new Set());

  const studyPlans = dataManager.getStudyPlans();
  const currentPlan = studyPlans.find(p => p.id === selectedPlanId) || studyPlans[0];

  // Load saved checked days
  useEffect(() => {
    try {
      const saved = localStorage.getItem('brm_completed_days');
      if (saved) setCompletedDays(new Set(JSON.parse(saved)));
    } catch (e) {}
  }, []);

  const toggleDay = (dayNum) => {
    setCompletedDays(prev => {
      const next = new Set(prev);
      if (next.has(dayNum)) next.delete(dayNum);
      else next.add(dayNum);
      localStorage.setItem('brm_completed_days', JSON.stringify([...next]));
      return next;
    });
  };

  const completionPct = currentPlan?.daily_breakdown
    ? Math.round((completedDays.size / currentPlan.daily_breakdown.length) * 100)
    : 0;

  // 9-Level Roadmap Tiers
  const roadmapLevels = [
    { lvl: 1, title: "Reasoning Basics", desc: "Inequality, Series & Direction fundamentals", targetPct: 10 },
    { lvl: 2, title: "Speed Foundations", desc: "Substitutional coding & Syllogism basics", targetPct: 20 },
    { lvl: 3, title: "Prelims Linear Seating", desc: "Single row North/South arrangements", targetPct: 35 },
    { lvl: 4, title: "Floor & Box Puzzles", desc: "Multi-floor single variable cases", targetPct: 50 },
    { lvl: 5, title: "Speed Lab Sprinting", desc: "Consistent sub-25s on standalone Qs", targetPct: 65 },
    { lvl: 6, title: "PYQ Shift Mastery", desc: "Solving 2020-2026 actual shift papers", targetPct: 75 },
    { lvl: 7, title: "Mains Special Topics", desc: "Input-Output & Critical Reasoning", targetPct: 85 },
    { lvl: 8, title: "Full Mock Engine", desc: "Scoring 32+ in 20 minutes consistently", targetPct: 95 },
    { lvl: 9, title: "Bank Exam Ready", desc: "Top 1% percentile across SBI/IBPS/RRB", targetPct: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Structured Roadmaps
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isHindi ? 'अध्ययन योजना एवं 9-स्तरीय प्रगति रोडमैप' : 'Study Plans & 9-Level Mastery Roadmap'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isHindi
                ? '30-दिवसीय, 60-दिवसीय और 90-दिवसीय योजनाएँ। अपने दैनिक अध्ययन समय (1h/2h/3h) के अनुसार अनुसूची समायोजित करें।'
                : 'Interactive 30, 60, and 90-day schedules with custom daily pace adjustments (1h, 2h, 3h/day).'}
            </p>
          </div>

          {/* Daily Pace Selector */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <span className="text-slate-500 font-bold px-2">Daily Pace:</span>
            {[1, 2, 3].map(h => (
              <button
                key={h}
                onClick={() => setDailyPaceHours(h)}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  dailyPaceHours === h
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                {h} hr / day
              </button>
            ))}
          </div>
        </div>

        {/* Plan Switcher */}
        <div className="flex flex-wrap gap-2 mt-4">
          {studyPlans.map(plan => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                selectedPlanId === plan.id
                  ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {plan.name}
            </button>
          ))}
        </div>
      </div>

      {/* 9-Level Mastery Roadmap Horizontal Visualizer (Section 46) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>9-Level Bank Reasoning Mastery Roadmap</span>
          </h3>
          <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
            Progress: {completionPct}%
          </span>
        </div>

        {/* Roadmap Progress Stepper */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {roadmapLevels.map(lvl => {
            const isUnlocked = completionPct >= (lvl.targetPct - 15);
            const isCompleted = completionPct >= lvl.targetPct;
            return (
              <div
                key={lvl.lvl}
                className={`p-3 rounded-xl border text-center flex flex-col justify-between transition ${
                  isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                    : isUnlocked
                    ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-300 text-brand-900 dark:text-brand-200 ring-1 ring-brand-400'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                }`}
              >
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                    Level {lvl.lvl}
                  </div>
                  <div className="text-xs font-bold leading-tight line-clamp-2">{lvl.title}</div>
                </div>
                <div className="text-[10px] mt-2 font-mono">
                  {isCompleted ? '✓ Done' : `${lvl.targetPct}%`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Breakdown Schedule */}
      {currentPlan?.daily_breakdown && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Daily Syllabus Breakdown ({currentPlan.duration_days} Days)
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Completed: {completedDays.size} / {currentPlan.daily_breakdown.length} Days
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentPlan.daily_breakdown.map(day => {
              const isChecked = completedDays.has(day.day);
              return (
                <div
                  key={day.day}
                  onClick={() => toggleDay(day.day)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                    isChecked
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-slate-900 dark:text-slate-100'
                      : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-brand-400'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                        Day {day.day}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {day.topic}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {day.task}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                      <span>Practice: {day.questions * (dailyPaceHours === 1 ? 0.7 : dailyPaceHours === 3 ? 1.5 : 1)} Qs</span>
                      <span>Speed Drill: {day.speed_drill}</span>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-1 ${
                    isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {isChecked && '✓'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
