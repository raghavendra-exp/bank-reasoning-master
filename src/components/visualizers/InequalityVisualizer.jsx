import React, { useState } from 'react';
import { GitCommit, CheckCircle2, XCircle, ArrowRight, Zap, HelpCircle } from 'lucide-react';

export default function InequalityVisualizer({ isHindi }) {
  const [chain, setChain] = useState([
    { var: 'A', op: '>' },
    { var: 'B', op: '≥' },
    { var: 'C', op: '=' },
    { var: 'D', op: '<' },
    { var: 'E', op: null }
  ]);

  const [fromVar, setFromVar] = useState('A');
  const [toVar, setToVar] = useState('C');
  const [checkOp, setCheckOp] = useState('>');

  // Door method evaluator
  const evaluateRelation = (start, end, targetOp) => {
    const startIdx = chain.findIndex(c => c.var === start);
    const endIdx = chain.findIndex(c => c.var === end);

    if (startIdx === -1 || endIdx === -1) return { valid: false, reason: "Variables not found" };

    if (startIdx === endIdx) {
      return { valid: targetOp === '=', reason: "Identical variables" };
    }

    const isForward = startIdx < endIdx;
    const minIdx = Math.min(startIdx, endIdx);
    const maxIdx = Math.max(startIdx, endIdx);

    const subChain = [];
    for (let i = minIdx; i < maxIdx; i++) {
      subChain.push({ from: chain[i].var, op: chain[i].op, to: chain[i + 1].var });
    }

    // Check for opposite signs
    let hasGreater = false;
    let hasLesser = false;
    let hasStrictGreater = false;
    let hasStrictLesser = false;

    for (let link of subChain) {
      if (link.op === '>' || link.op === '≥') {
        hasGreater = true;
        if (link.op === '>') hasStrictGreater = true;
      }
      if (link.op === '<' || link.op === '≤') {
        hasLesser = true;
        if (link.op === '<') hasStrictLesser = true;
      }
    }

    // Opposite signs conflict
    if (hasGreater && hasLesser) {
      return {
        valid: false,
        reasonEn: `Opposite signs encountered between ${start} and ${end} (Both > and < exist). The door is BLOCKED! Direct conclusion is FALSE.`,
        reasonHi: `${start} और ${end} के बीच विपरीत चिह्न (> और <) आ गए हैं। दरवाजा बंद है! निश्चित निष्कर्ष असत्य है।`
      };
    }

    // Definite relations
    let actualRelation = '=';
    if (isForward) {
      if (hasStrictGreater) actualRelation = '>';
      else if (hasGreater) actualRelation = '≥';
      else if (hasStrictLesser) actualRelation = '<';
      else if (hasLesser) actualRelation = '≤';
    } else {
      // Reversed direction
      if (hasStrictGreater) actualRelation = '<';
      else if (hasGreater) actualRelation = '≤';
      else if (hasStrictLesser) actualRelation = '>';
      else if (hasLesser) actualRelation = '≥';
    }

    const isMatch = (targetOp === actualRelation) ||
      (targetOp === '≥' && actualRelation === '>') ? false :
      (targetOp === actualRelation);

    return {
      valid: isMatch,
      actualRelation,
      reasonEn: `Definite established relation between ${start} and ${end} is '${actualRelation}'. Tested '${start} ${targetOp} ${end}' is ${isMatch ? 'TRUE' : 'FALSE'}.`,
      reasonHi: `${start} और ${end} के बीच वास्तविक संबंध '${actualRelation}' है। अतः '${start} ${targetOp} ${end}' ${isMatch ? 'सत्य' : 'असत्य'} है।`
    };
  };

  const evalResult = evaluateRelation(fromVar, toVar, checkOp);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {isHindi ? 'दरवाजा विधि सिमुलेटर' : 'Open Gate Simulator'}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isHindi ? 'असमानता शृंखला विश्लेषक' : 'Inequality Relationship Chain Visualizer'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isHindi
              ? 'चिह्नों को बदलें, खुला दरवाजा (Open Gate) देखें और निष्कर्षों की सत्यता 5 सेकंड में जाँचें।'
              : 'Modify relationship signs, watch the Open Gate rule in real-time, and verify conclusions instantaneously.'}
          </p>
        </div>

        {/* Priority Badge */}
        <div className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 font-mono">
          Priority: <strong className="text-emerald-600 dark:text-emerald-400">&gt;</strong> &gt; <strong className="text-blue-600 dark:text-blue-400">&ge;</strong> &gt; <strong className="text-slate-500">=</strong>
        </div>
      </div>

      {/* Interactive Chain Display */}
      <div className="my-6 p-6 bg-slate-900 rounded-2xl text-center">
        <div className="text-xs text-slate-400 font-semibold mb-4 uppercase tracking-wider">
          {isHindi ? 'वर्तमान असमानता शृंखला (चिह्न बदलने के लिए ऑपरेटर पर क्लिक करें)' : 'Active Inequality Chain (Click operator to cycle sign)'}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {chain.map((item, idx) => (
            <React.Fragment key={idx}>
              <div className="w-12 h-12 rounded-xl bg-slate-800 border-2 border-brand-500/50 flex items-center justify-center font-bold text-lg text-white shadow">
                {item.var}
              </div>
              {item.op && (
                <button
                  onClick={() => {
                    const ops = ['>', '≥', '=', '<', '≤'];
                    const nextOp = ops[(ops.indexOf(item.op) + 1) % ops.length];
                    const newChain = [...chain];
                    newChain[idx].op = nextOp;
                    setChain(newChain);
                  }}
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-brand-600 text-amber-300 hover:text-white border border-slate-700 font-mono text-xl font-bold transition flex items-center justify-center"
                  title="Click to cycle operator"
                >
                  {item.op}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Test Conclusion Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            {isHindi ? 'प्रारंभिक चर (Start Variable)' : 'Start Variable'}
          </label>
          <select
            value={fromVar}
            onChange={e => setFromVar(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-slate-200"
          >
            {chain.map(c => <option key={c.var} value={c.var}>{c.var}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            {isHindi ? 'परीक्षण ऑपरेटर (Operator)' : 'Test Operator'}
          </label>
          <select
            value={checkOp}
            onChange={e => setCheckOp(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono font-bold text-slate-800 dark:text-slate-200"
          >
            <option value=">">&gt; (Strictly Greater)</option>
            <option value="≥">&ge; (Greater or Equal)</option>
            <option value="=">= (Equal)</option>
            <option value="<">&lt; (Strictly Less)</option>
            <option value="≤">&le; (Less or Equal)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            {isHindi ? 'अंतिम चर (End Variable)' : 'End Variable'}
          </label>
          <select
            value={toVar}
            onChange={e => setToVar(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-slate-200"
          >
            {chain.map(c => <option key={c.var} value={c.var}>{c.var}</option>)}
          </select>
        </div>
      </div>

      {/* Result Card */}
      <div className={`mt-4 p-4 rounded-xl border flex items-start gap-3 ${
        evalResult.valid
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
          : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
      }`}>
        {evalResult.valid ? <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" /> : <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />}
        <div>
          <div className="font-bold text-sm">
            Conclusion: {fromVar} {checkOp} {toVar} is {evalResult.valid ? (isHindi ? 'सत्य (TRUE)' : 'TRUE (Follows)') : (isHindi ? 'असत्य (FALSE)' : 'FALSE (Does Not Follow)')}
          </div>
          <p className="text-xs mt-1 opacity-90">
            {isHindi ? evalResult.reasonHi : evalResult.reasonEn}
          </p>
        </div>
      </div>
    </div>
  );
}
