import React, { useState } from 'react';
import { Cpu, Play, SkipForward, RotateCcw, CheckCircle2, HelpCircle, Eye } from 'lucide-react';

export default function InputOutputSimulator({ isHindi }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [predictVisible, setPredictVisible] = useState(false);

  const machineData = {
    input: ["orange", "48", "19", "apple", "83", "zebra", "62", "kite"],
    rule: "Alternate arrangement: Smallest alphabetical word on the left, Highest number on the right.",
    ruleHi: "एकांतर व्यवस्था: सबसे छोटा शब्द बाएँ सिरे पर, सबसे बड़ी संख्या दाएँ सिरे पर।",
    steps: [
      { step: "Input", row: ["orange", "48", "19", "apple", "83", "zebra", "62", "kite"], note: "Original unsorted sequence." },
      { step: "Step I", row: ["apple", "orange", "48", "19", "83", "zebra", "62", "kite"], moved: "apple", note: "'apple' (smallest word) moves to extreme left." },
      { step: "Step II", row: ["apple", "83", "orange", "48", "19", "zebra", "62", "kite"], moved: "83", note: "'83' (highest number) moves next to 'apple'." },
      { step: "Step III", row: ["apple", "83", "kite", "orange", "48", "19", "zebra", "62"], moved: "kite", note: "'kite' (2nd smallest word) moves next." },
      { step: "Step IV", row: ["apple", "83", "kite", "62", "orange", "48", "19", "zebra"], moved: "62", note: "'62' (2nd highest number) moves next." },
      { step: "Step V", row: ["apple", "83", "kite", "62", "orange", "48", "zebra", "19"], moved: "orange", note: "'orange' and '48' sorted; 'zebra' and '19' auto-arranged. Final Step." }
    ]
  };

  const current = machineData.steps[currentStep];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
              {isHindi ? 'मशीन इनपुट सिमुलेटर' : 'Machine Step Simulator'}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isHindi ? 'इनपुट-आउटपुट चरण विश्लेषक' : 'Input-Output Step-by-Step Machine'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isHindi ? machineData.ruleHi : machineData.rule}
          </p>
        </div>

        {/* Step Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 rounded-lg text-xs font-bold"
          >
            ← Prev Step
          </button>
          <span className="text-xs font-mono font-bold px-2 py-1 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded">
            {current.step} ({currentStep}/{machineData.steps.length - 1})
          </span>
          <button
            onClick={() => setCurrentStep(prev => Math.min(machineData.steps.length - 1, prev + 1))}
            disabled={currentStep === machineData.steps.length - 1}
            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-40 rounded-lg text-xs font-bold flex items-center gap-1"
          >
            Next Step <SkipForward className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrentStep(0)}
            className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-xs"
            title="Reset to Input"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Machine Display */}
      <div className="my-6 p-6 bg-slate-900 rounded-2xl text-white">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-bold text-cyan-300 uppercase tracking-wider">{current.step}</span>
          </div>
          {current.moved && (
            <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-700 px-2.5 py-0.5 rounded-full">
              Moved this step: <strong className="text-amber-300">{current.moved}</strong>
            </span>
          )}
        </div>

        {/* Elements Row */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center py-4">
          {current.row.map((item, idx) => {
            const isNumber = !isNaN(item);
            const isJustMoved = item === current.moved;
            return (
              <div
                key={idx}
                className={`px-3 sm:px-4 py-2.5 rounded-xl border-2 font-mono font-bold text-sm transition-all duration-300 flex flex-col items-center ${
                  isJustMoved
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400 scale-105 shadow-lg'
                    : isNumber
                    ? 'bg-slate-800 border-sky-500/50 text-sky-300'
                    : 'bg-slate-800 border-indigo-500/50 text-indigo-300'
                }`}
              >
                <span>{item}</span>
                <span className="text-[9px] text-slate-500 font-normal">Idx {idx + 1}</span>
              </div>
            );
          })}
        </div>

        {/* Step Explanation Note */}
        <div className="mt-4 p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{current.note}</span>
        </div>
      </div>

      {/* Step Indexing Shortcut Card */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
        <h4 className="font-bold text-brand-600 dark:text-brand-400 mb-1">
          {isHindi ? '⚡ टॉपर शॉर्टकट: स्टेप-इंडेक्सिंग (Step-Indexing Method)' : '⚡ Topper Shortcut: Step-Indexing Method'}
        </h4>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Never write out all steps! Label each word and number with its required destination order directly on the question text:
          <br />Words: apple (W1), kite (W2), orange (W3), zebra (W4). Numbers: 83 (N1), 62 (N2), 48 (N3), 19 (N4).
          <br />When prior elements shift left, any element that naturally lands in its final slot is <strong>Auto-Arranged</strong> and does not take a new step.
        </p>
      </div>
    </div>
  );
}
