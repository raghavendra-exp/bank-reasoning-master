import React, { useState } from 'react';
import { Binary, Calculator, Search, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AlphabetCodeCalculator({ isHindi }) {
  const [testWord, setTestWord] = useState('BANKING');
  const [selectedLetter, setSelectedLetter] = useState('B');

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const oppositePairs = [
    { f: 'A', r: 'Z', mnemonic: 'AZad', pos: 1 },
    { f: 'B', r: 'Y', mnemonic: 'BoY', pos: 2 },
    { f: 'C', r: 'X', mnemonic: 'CruX', pos: 3 },
    { f: 'D', r: 'W', mnemonic: 'DeW', pos: 4 },
    { f: 'E', r: 'V', mnemonic: 'EVen', pos: 5 },
    { f: 'F', r: 'U', mnemonic: 'FUll', pos: 6 },
    { f: 'G', r: 'T', mnemonic: 'GT Road', pos: 7 },
    { f: 'H', r: 'S', mnemonic: 'High School', pos: 8 },
    { f: 'I', r: 'R', mnemonic: 'Indian Railway', pos: 9 },
    { f: 'J', r: 'Q', mnemonic: 'Jungle Queen', pos: 10 },
    { f: 'K', r: 'P', mnemonic: 'Kurta Pyjama', pos: 11 },
    { f: 'L', r: 'O', mnemonic: 'LOve', pos: 12 },
    { f: 'M', r: 'N', mnemonic: 'MaN', pos: 13 }
  ];

  // Letter pairs analyzer for testWord
  const findLetterPairs = (word) => {
    const clean = word.toUpperCase().replace(/[^A-Z]/g, '');
    const pairs = [];
    const n = clean.length;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const char1 = clean[i];
        const char2 = clean[j];
        const wordDist = j - i;
        const alphaDist = Math.abs(char1.charCodeAt(0) - char2.charCodeAt(0));

        if (wordDist === alphaDist) {
          const dir = char1.charCodeAt(0) < char2.charCodeAt(0) ? 'Forward' : 'Backward';
          pairs.push({
            pair: `${char1} - ${char2}`,
            indices: `${i + 1} and ${j + 1}`,
            lettersBetween: wordDist - 1,
            direction: dir
          });
        }
      }
    }
    return pairs;
  };

  const detectedPairs = findLetterPairs(testWord);

  const selCode = selectedLetter.charCodeAt(0) - 64;
  const selReverse = 27 - selCode;
  const selOpposite = String.fromCharCode(65 + 26 - selCode);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              {isHindi ? 'अक्षर कैलकुलेटर' : 'Alphabet Helper'}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isHindi ? 'कोडिंग-डिकोडिंग एवं वर्णमाला कैलकुलेटर' : 'Coding & Alphabet Position Calculator'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isHindi
              ? 'अक्षरों के स्थान, विपरीत जोड़े (योग = 27) और शब्दों में अक्षरों के युग्म तुरंत खोजें।'
              : 'Forward & reverse letter values, opposite letter mnemonics (Sum = 27), and instant letter-pair counter.'}
          </p>
        </div>

        {/* EJOTY Anchor */}
        <div className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 font-mono">
          Anchors (EJOTY): E=5 • J=10 • O=15 • T=20 • Y=25
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Alphabet Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {isHindi ? '26 वर्णमाला तालिका (विवरण देखने के लिए किसी भी अक्षर पर क्लिक करें)' : 'Alphabet 26 Reference (Click letter to inspect)'}
            </h3>
            <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-1.5 font-mono text-center">
              {alphabet.map((letter, idx) => {
                const fwd = idx + 1;
                const rev = 27 - fwd;
                const isSelected = selectedLetter === letter;
                return (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(letter)}
                    className={`p-2 rounded-lg border transition flex flex-col items-center ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-500 ring-2 ring-brand-400'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-brand-400'
                    }`}
                  >
                    <span className="font-bold text-sm">{letter}</span>
                    <span className="text-[9px] opacity-80">{fwd}</span>
                    <span className="text-[8px] opacity-60">({rev})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Letter Inspector Box */}
          <div className="p-4 bg-slate-900 rounded-xl text-white flex flex-wrap items-center justify-between gap-4 font-mono">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center font-bold text-2xl">
                {selectedLetter}
              </div>
              <div>
                <div className="text-xs text-slate-400">Selected Letter</div>
                <div className="text-sm font-bold text-brand-300">Letter #{selCode} of 26</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              <div className="p-2 bg-slate-800 rounded">
                <div className="text-[10px] text-slate-400">Forward (A=1)</div>
                <div className="text-base font-bold text-emerald-400">{selCode}</div>
              </div>
              <div className="p-2 bg-slate-800 rounded">
                <div className="text-[10px] text-slate-400">Reverse (Z=1)</div>
                <div className="text-base font-bold text-sky-400">{selReverse}</div>
              </div>
              <div className="p-2 bg-slate-800 rounded">
                <div className="text-[10px] text-slate-400">Opposite (Sum 27)</div>
                <div className="text-base font-bold text-amber-400">{selOpposite}</div>
              </div>
            </div>
          </div>

          {/* 13 Opposite Letter Pairs */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {isHindi ? '13 विपरीत अक्षर जोड़े एवं याद रखने के सूत्र (Mnemonics)' : '13 Opposite Pairs & Mnemonics (Sum = 27)'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
              {oppositePairs.map(p => (
                <div key={p.f} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center font-mono">
                  <span className="font-bold text-brand-600 dark:text-brand-400">{p.f} ↔ {p.r}</span>
                  <span className="text-[10px] text-slate-500 italic">{p.mnemonic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Word Letter-Pair Finder */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {isHindi ? 'शब्द युग्म विश्लेषक (Letter Pair Solver)' : 'Word Letter-Pair Solver'}
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              {isHindi
                ? 'कोई भी शब्द टाइप करें। यह टूल स्वतः बैंक परीक्षा के प्रारूप में अक्षरों के सभी युग्म ज्ञात करेगा।'
                : 'Type any word to test the classic bank question: "How many pairs have as many letters between them as in the English alphabet?"'}
            </p>

            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Enter Word:</label>
              <input
                type="text"
                value={testWord}
                onChange={e => setTestWord(e.target.value.toUpperCase())}
                className="w-full p-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg font-mono font-bold text-slate-800 dark:text-white uppercase text-sm tracking-wider"
              />
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mb-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                <span>Total Valid Pairs:</span>
                <span className="text-brand-600 dark:text-brand-400 font-extrabold text-sm">{detectedPairs.length}</span>
              </div>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto text-xs">
              {detectedPairs.length === 0 ? (
                <p className="text-slate-400 italic text-[11px] p-2">No matching letter pairs in this word.</p>
              ) : (
                detectedPairs.map((pair, idx) => (
                  <div key={idx} className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 flex justify-between items-center font-mono">
                    <div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{pair.pair}</span>
                      <span className="text-[10px] text-slate-400 ml-2">({pair.direction})</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Between: {pair.lettersBetween}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
            <strong>Exam Hack:</strong> Always convert letters to numerical positions first. Sequential number counting is 3x faster than chanting alphabet letters!
          </div>
        </div>
      </div>
    </div>
  );
}
