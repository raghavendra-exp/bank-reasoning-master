import React, { useState } from 'react';
import { BarChart3, TrendingUp, Filter, ShieldCheck, Award, Layers, Sparkles, BookOpen } from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function PyqAnalytics({ isHindi }) {
  const [selectedExamFilter, setSelectedExamFilter] = useState('ALL');
  const pyqData = dataManager.getPyqData();
  const yearlyTrends = pyqData.yearly_trends || [];
  const topicMatrix = pyqData.topic_matrix || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                2020-2026 Data Engine
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isHindi ? 'विगत वर्षों के प्रश्न रुझान एवं विश्लेषण' : 'PYQ Trend Analytics & Exam Intelligence'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isHindi
                ? '96+ परीक्षा पालियों के वास्तविक आंकड़ों पर आधारित विषय-वार वेटेज, पहेली हिस्सेदारी (~58%) और प्राथमिकता मैट्रिक्स।'
                : 'Rigorous empirical analysis across 96+ shifts: topic frequencies, puzzle dominance (57.8%), and verified priority matrix.'}
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
            Last Verified: <strong className="text-slate-900 dark:text-white">September 2026</strong>
          </div>
        </div>

        {/* Big Insight Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 font-mono text-center">
          <div className="p-4 bg-brand-50 dark:bg-brand-950/40 rounded-2xl border border-brand-200 dark:border-brand-800">
            <div className="text-xs text-brand-700 dark:text-brand-300 font-sans font-bold">Puzzles & Seating Share</div>
            <div className="text-2xl font-black text-brand-900 dark:text-brand-100 my-1">57.8%</div>
            <div className="text-[11px] text-brand-600 dark:text-brand-400 font-sans">18-22 Qs in every Prelims shift</div>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <div className="text-xs text-emerald-700 dark:text-emerald-300 font-sans font-bold">Speed Scoring Topics</div>
            <div className="text-2xl font-black text-emerald-900 dark:text-emerald-100 my-1">34.2%</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans">Inequality, Syllogism, Series (15 Marks in 6 mins)</div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800">
            <div className="text-xs text-purple-700 dark:text-purple-300 font-sans font-bold">Miscellaneous & Concepts</div>
            <div className="text-2xl font-black text-purple-900 dark:text-purple-100 my-1">8.0%</div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 font-sans">Blood Relations, Direction, Letter Pairs</div>
          </div>
        </div>
      </div>

      {/* Cross-Exam Comparison: SBI vs IBPS vs RRB (Section 18) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          {isHindi ? 'एसबीआई बनाम आईबीपीएस बनाम आरआरबी रीज़निंग तुलना' : 'Cross-Exam Comparison: SBI Clerk vs IBPS Clerk vs RRB Office Assistant'}
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Key structural nuances that separate the three examinations:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 font-mono text-slate-600 dark:text-slate-300">
                <th className="p-3">Examination</th>
                <th className="p-3">Prelims Qs / Marks</th>
                <th className="p-3">Prelims Timing</th>
                <th className="p-3">Mains Qs / Marks</th>
                <th className="p-3">Mains Timing</th>
                <th className="p-3">Best Tactical Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="p-3 font-bold text-brand-600 dark:text-brand-400">SBI Clerk (JA)</td>
                <td className="p-3 font-mono">35 Qs / 35 Marks</td>
                <td className="p-3 font-mono text-amber-600 dark:text-amber-400 font-bold">20 min (Strict)</td>
                <td className="p-3 font-mono">50 Qs / 50 Marks</td>
                <td className="p-3 font-mono">45 min (Strict)</td>
                <td className="p-3 text-slate-600 dark:text-slate-300">Speed first. Clear 15 standalone Qs in 6 mins, then 3 puzzles. Target 32+ in Prelims.</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="p-3 font-bold text-rose-600 dark:text-rose-400">IBPS Clerk / CSA</td>
                <td className="p-3 font-mono">35 Qs / 35 Marks</td>
                <td className="p-3 font-mono text-amber-600 dark:text-amber-400 font-bold">20 min (Strict)</td>
                <td className="p-3 font-mono text-brand-600 font-bold">50 Qs / 60 Marks!</td>
                <td className="p-3 font-mono">45 min (Strict)</td>
                <td className="p-3 text-slate-600 dark:text-slate-300">Note: Mains has 60 MARKS for 50 Qs! High-mark questions (1.5 - 2 marks) must be prioritized.</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">IBPS RRB OA</td>
                <td className="p-3 font-mono">40 Qs / 40 Marks</td>
                <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">Composite 45 min</td>
                <td className="p-3 font-mono">40 Qs / 50 Marks</td>
                <td className="p-3 font-mono">Composite 2 hrs</td>
                <td className="p-3 text-slate-600 dark:text-slate-300">NO sectional timer! Self-discipline required. Allocate exactly 22-23 minutes for Reasoning.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Priority Topic Matrix (2020-2026 Trend) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          {isHindi ? 'विषय-वार प्राथमिकता एवं 5-वर्षीय आवृत्ति मैट्रिक्स' : 'Topic Priority Matrix & 5-Year Frequency Table (2022-2026)'}
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Priority Score = Frequency × Recency × Exam Weightage
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 font-mono text-slate-600 dark:text-slate-300">
                <th className="p-3">Topic</th>
                <th className="p-3">Priority Tag</th>
                <th className="p-3 text-center">2022</th>
                <th className="p-3 text-center">2023</th>
                <th className="p-3 text-center">2024</th>
                <th className="p-3 text-center">2025</th>
                <th className="p-3 text-center">2026</th>
                <th className="p-3">Trend Direction</th>
                <th className="p-3">Clerk Prelims Relevance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {topicMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{row.topic}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      row.priority === 'MUST_DO'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                        : row.priority === 'HIGH'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                    }`}>
                      {row.tag}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono text-slate-600 dark:text-slate-400">{row.y2022}</td>
                  <td className="p-3 text-center font-mono text-slate-600 dark:text-slate-400">{row.y2023}</td>
                  <td className="p-3 text-center font-mono text-slate-600 dark:text-slate-400">{row.y2024}</td>
                  <td className="p-3 text-center font-mono text-slate-600 dark:text-slate-400">{row.y2025}</td>
                  <td className="p-3 text-center font-mono font-bold text-brand-600 dark:text-brand-400">{row.y2026}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{row.trend}</td>
                  <td className="p-3 text-[11px] text-slate-500">{row.clerk_relevance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
