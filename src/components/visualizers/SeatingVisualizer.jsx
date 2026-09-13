import React, { useState } from 'react';
import { RotateCw, Users, ShieldAlert, CheckCircle2, ArrowRight, RefreshCw, Layers, Plus, Trash2 } from 'lucide-react';

export default function SeatingVisualizer({ isHindi }) {
  const [layoutType, setLayoutType] = useState('circular'); // 'circular', 'linear', 'square'
  const [persons, setPersons] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);

  // Active cases: Case 1 and Case 2
  const [activeCase, setActiveCase] = useState(1);
  const [cases, setCases] = useState({
    1: {
      seats: Array(8).fill(null),
      facing: Array(8).fill('IN'), // 'IN' (Centre/North) or 'OUT' (Outside/South)
      locked: Array(8).fill(false)
    },
    2: {
      seats: Array(8).fill(null),
      facing: Array(8).fill('IN'),
      locked: Array(8).fill(false)
    }
  });

  const currentSeats = cases[activeCase].seats;
  const currentFacing = cases[activeCase].facing;

  // Handle seat click
  const handleSeatClick = (index) => {
    const newSeats = [...currentSeats];
    if (selectedPerson) {
      // If selected person already placed elsewhere, clear that seat
      const existingIdx = newSeats.indexOf(selectedPerson);
      if (existingIdx !== -1) newSeats[existingIdx] = null;
      newSeats[index] = selectedPerson;
      setSelectedPerson(null);
    } else {
      // If clicking already placed person, remove
      if (newSeats[index] && !cases[activeCase].locked[index]) {
        newSeats[index] = null;
      }
    }
    updateCaseData({ seats: newSeats });
  };

  const toggleFacing = (index, e) => {
    e.stopPropagation();
    const newFacing = [...currentFacing];
    newFacing[index] = newFacing[index] === 'IN' ? 'OUT' : 'IN';
    updateCaseData({ facing: newFacing });
  };

  const updateCaseData = (updates) => {
    setCases(prev => ({
      ...prev,
      [activeCase]: {
        ...prev[activeCase],
        ...updates
      }
    }));
  };

  const resetCurrentCase = () => {
    updateCaseData({
      seats: Array(8).fill(null),
      facing: Array(8).fill('IN'),
      locked: Array(8).fill(false)
    });
  };

  const copyCase1ToCase2 = () => {
    setCases(prev => ({
      ...prev,
      2: JSON.parse(JSON.stringify(prev[1]))
    }));
    setActiveCase(2);
  };

  // Rule verification helper: calculate right/left of a person
  const getPersonNeighbors = (person) => {
    const idx = currentSeats.indexOf(person);
    if (idx === -1) return null;
    const isFacingIn = currentFacing[idx] === 'IN';
    const total = 8;
    // Circular: Facing IN -> Left is clockwise (idx + 1), Right is anti-clockwise (idx - 1 + 8) % 8
    const rightIdx = isFacingIn ? (idx - 1 + total) % total : (idx + 1) % total;
    const leftIdx = isFacingIn ? (idx + 1) % total : (idx - 1 + total) % total;
    const oppositeIdx = (idx + 4) % total;

    return {
      seat: idx + 1,
      facing: currentFacing[idx],
      immediateRight: currentSeats[rightIdx] || 'Empty',
      immediateLeft: currentSeats[leftIdx] || 'Empty',
      opposite: currentSeats[oppositeIdx] || 'Empty'
    };
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              {isHindi ? 'इंटरएक्टिव लैब' : 'Interactive Lab'}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isHindi ? 'बैठक व्यवस्था सिमुलेटर' : 'Seating Arrangement Visualizer'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isHindi
              ? 'व्यक्तियों को रखें, दिशा बदलें, वृत्त को घुमाएँ और केस 1 व केस 2 की तुलना करें।'
              : 'Place persons, toggle facing directions, rotate table, and manage parallel branches (Case 1 & 2).'}
          </p>
        </div>

        {/* Layout Selectors & Case Switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex gap-1">
            <button
              onClick={() => setLayoutType('circular')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${layoutType === 'circular' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              {isHindi ? 'वृत्ताकार (Circle)' : 'Circular Table'}
            </button>
            <button
              onClick={() => setLayoutType('linear')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${layoutType === 'linear' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              {isHindi ? 'पंक्ति (Linear)' : 'Linear Row'}
            </button>
            <button
              onClick={() => setLayoutType('square')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${layoutType === 'square' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              {isHindi ? 'वर्गाकार (Square)' : 'Square Table'}
            </button>
          </div>

          <div className="border-l border-slate-300 dark:border-slate-700 h-6 mx-1"></div>

          {/* Case 1 vs Case 2 */}
          <div className="flex items-center gap-1 bg-brand-50 dark:bg-brand-950/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveCase(1)}
              className={`px-2.5 py-1 rounded text-xs font-bold transition ${activeCase === 1 ? 'bg-brand-600 text-white shadow-sm' : 'text-brand-800 dark:text-brand-300'}`}
            >
              Case 1
            </button>
            <button
              onClick={() => setActiveCase(2)}
              className={`px-2.5 py-1 rounded text-xs font-bold transition ${activeCase === 2 ? 'bg-brand-600 text-white shadow-sm' : 'text-brand-800 dark:text-brand-300'}`}
            >
              Case 2
            </button>
            <button
              onClick={copyCase1ToCase2}
              title="Copy Case 1 to Case 2"
              className="p-1 text-slate-500 hover:text-brand-600 text-xs"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column: Palette of Persons */}
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {isHindi ? 'व्यक्तियों का चयन करें (क्लिक करें फिर सीट चुनें)' : 'Select Person to Place'}
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {persons.map(p => {
                const isPlaced = currentSeats.includes(p);
                const isSelected = selectedPerson === p;
                return (
                  <button
                    key={p}
                    onClick={() => setSelectedPerson(isSelected ? null : p)}
                    className={`py-2 px-3 rounded-lg font-bold text-sm transition flex flex-col items-center justify-center relative ${
                      isSelected
                        ? 'bg-brand-600 text-white ring-2 ring-brand-400'
                        : isPlaced
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-brand-500'
                    }`}
                  >
                    <span>{p}</span>
                    {isPlaced && (
                      <span className="text-[10px] font-normal text-emerald-700 dark:text-emerald-400">
                        Seat {currentSeats.indexOf(p) + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedPerson && (
              <p className="mt-3 text-xs text-brand-600 dark:text-brand-400 font-medium animate-pulse">
                {isHindi ? `अब ${selectedPerson} को किसी भी खाली सीट पर क्लिक करके बैठाएँ` : `Now click on any seat to place ${selectedPerson}`}
              </p>
            )}
          </div>

          {/* Quick Info / Inspector */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {isHindi ? 'स्थिति एवं दिशा विश्लेषक' : 'Relational Inspector'}
            </h3>
            <div className="space-y-2 text-xs">
              {currentSeats.filter(Boolean).length === 0 ? (
                <p className="text-slate-400 italic">
                  {isHindi ? 'सीटों पर व्यक्ति बैठाकर उनके दाएँ-बाएँ संबंध देखें।' : 'Place people on seats to verify immediate left, right, and opposite relations.'}
                </p>
              ) : (
                currentSeats.map((p, idx) => {
                  if (!p) return null;
                  const rel = getPersonNeighbors(p);
                  return (
                    <div key={p} className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                        <span>Person {p} (Seat {rel.seat})</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] ${rel.facing === 'IN' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                          {rel.facing === 'IN' ? (layoutType === 'linear' ? 'North ↑' : 'Facing In ⊙') : (layoutType === 'linear' ? 'South ↓' : 'Facing Out ⊗')}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                        <div>Right: <strong className="text-slate-900 dark:text-white">{rel.immediateRight}</strong></div>
                        <div>Left: <strong className="text-slate-900 dark:text-white">{rel.immediateLeft}</strong></div>
                        <div>Opposite: <strong className="text-slate-900 dark:text-white">{rel.opposite}</strong></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={resetCurrentCase}
              className="flex-1 py-2 px-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-900 hover:bg-rose-100 flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isHindi ? 'केस रीसेट करें' : `Reset Case ${activeCase}`}
            </button>
            {layoutType === 'circular' && (
              <button
                onClick={() => setRotationAngle(prev => (prev + 45) % 360)}
                className="py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                {isHindi ? 'घुमाएँ 45°' : 'Rotate Table'}
              </button>
            )}
          </div>
        </div>

        {/* Center & Right Columns: Visual Stage Canvas */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl relative min-h-[420px] overflow-hidden">
          {/* Exam Hack Badge */}
          <div className="absolute top-4 left-4 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
            <span>⚡ EXAM HACK:</span>
            <span>{isHindi ? 'केंद्र की ओर मुख: दाएँ = Anti-Clockwise, बाएँ = Clockwise' : 'Facing Centre: Right = Anti-Clockwise, Left = Clockwise'}</span>
          </div>

          {/* Layout Rendering */}
          {layoutType === 'circular' && (
            <div
              className="relative w-72 h-72 rounded-full border-4 border-dashed border-slate-700 flex items-center justify-center transition-transform duration-500"
              style={{ transform: `rotate(${rotationAngle}deg)` }}
            >
              {/* Center Table Hub */}
              <div className="w-36 h-36 rounded-full bg-slate-800 border-2 border-brand-500/50 shadow-inner flex flex-col items-center justify-center text-center p-2">
                <span className="text-xs font-bold text-brand-400">TABLE</span>
                <span className="text-[10px] text-slate-400">8 Persons</span>
                <span className="text-[9px] text-slate-500 mt-1">Case {activeCase}</span>
              </div>

              {/* 8 Perimeter Seats */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map(idx => {
                const angle = (idx * 45) * (Math.PI / 180);
                const radius = 135; // px from center
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const person = currentSeats[idx];
                const facing = currentFacing[idx];

                return (
                  <div
                    key={idx}
                    onClick={() => handleSeatClick(idx)}
                    className="absolute cursor-pointer group"
                    style={{
                      left: `calc(50% + ${x}px - 22px)`,
                      top: `calc(50% + ${y}px - 22px)`,
                      transform: `rotate(${-rotationAngle}deg)`
                    }}
                  >
                    <div className={`w-11 h-11 rounded-full border-2 flex flex-col items-center justify-center transition-all ${
                      person
                        ? 'bg-brand-600 border-white text-white font-bold shadow-lg ring-2 ring-brand-400 scale-105'
                        : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-brand-400 hover:bg-slate-700'
                    }`}>
                      <span className="text-xs">{person || idx + 1}</span>
                      <button
                        onClick={(e) => toggleFacing(idx, e)}
                        className={`text-[8px] font-bold px-1 rounded transition ${
                          facing === 'IN' ? 'bg-blue-950 text-blue-300' : 'bg-amber-950 text-amber-300'
                        }`}
                        title="Click to toggle Facing In / Facing Out"
                      >
                        {facing === 'IN' ? 'IN' : 'OUT'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {layoutType === 'linear' && (
            <div className="w-full max-w-lg bg-slate-800/80 p-6 rounded-xl border border-slate-700">
              <div className="flex justify-between items-center mb-4 text-xs font-semibold text-slate-400">
                <span>← LEFT END (बायाँ छोर)</span>
                <span className="text-brand-400 font-bold">Linear Row (8 Seats) - Case {activeCase}</span>
                <span>RIGHT END (दायाँ छोर) →</span>
              </div>
              <div className="grid grid-cols-8 gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(idx => {
                  const person = currentSeats[idx];
                  const facing = currentFacing[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSeatClick(idx)}
                      className="cursor-pointer group flex flex-col items-center"
                    >
                      <button
                        onClick={(e) => toggleFacing(idx, e)}
                        className={`text-[10px] font-bold mb-1 transition ${
                          facing === 'IN' ? 'text-blue-400' : 'text-amber-400'
                        }`}
                      >
                        {facing === 'IN' ? '↑ North' : '↓ South'}
                      </button>
                      <div className={`w-11 h-12 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                        person
                          ? 'bg-brand-600 border-white text-white font-bold shadow-md'
                          : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-brand-400'
                      }`}>
                        <span className="text-sm font-bold">{person || '-'}</span>
                        <span className="text-[9px] text-slate-400">S{idx + 1}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {layoutType === 'square' && (
            <div className="relative w-72 h-72 border-4 border-dashed border-slate-700 flex items-center justify-center rounded-2xl bg-slate-800/40">
              <div className="w-36 h-36 bg-slate-800 border-2 border-brand-500/50 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-brand-400">SQUARE TABLE</span>
                <span className="text-[10px] text-slate-400">4 Corners + 4 Sides</span>
                <span className="text-[9px] text-slate-500">Case {activeCase}</span>
              </div>

              {/* 8 Seats around square perimeter */}
              {[
                { pos: 'top-left', top: '10px', left: '10px', label: 'C1' },
                { pos: 'top-mid', top: '10px', left: 'calc(50% - 20px)', label: 'S1' },
                { pos: 'top-right', top: '10px', right: '10px', label: 'C2' },
                { pos: 'right-mid', top: 'calc(50% - 20px)', right: '10px', label: 'S2' },
                { pos: 'bot-right', bottom: '10px', right: '10px', label: 'C3' },
                { pos: 'bot-mid', bottom: '10px', left: 'calc(50% - 20px)', label: 'S3' },
                { pos: 'bot-left', bottom: '10px', left: '10px', label: 'C4' },
                { pos: 'left-mid', top: 'calc(50% - 20px)', left: '10px', label: 'S4' },
              ].map((cfg, idx) => {
                const person = currentSeats[idx];
                const facing = currentFacing[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => handleSeatClick(idx)}
                    className="absolute cursor-pointer"
                    style={{ top: cfg.top, bottom: cfg.bottom, left: cfg.left, right: cfg.right }}
                  >
                    <div className={`w-10 h-10 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                      person
                        ? 'bg-brand-600 border-white text-white font-bold shadow'
                        : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-brand-400'
                    }`}>
                      <span className="text-xs">{person || cfg.label}</span>
                      <button
                        onClick={(e) => toggleFacing(idx, e)}
                        className={`text-[7px] font-bold ${facing === 'IN' ? 'text-blue-300' : 'text-amber-300'}`}
                      >
                        {facing === 'IN' ? 'IN' : 'OUT'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Instruction Bar */}
          <div className="mt-4 text-xs text-slate-400 text-center">
            {isHindi
              ? 'टिप: सीट पर क्लिक करके व्यक्ति रखें | IN/OUT पर क्लिक करके दिशा बदलें'
              : 'Tip: Click seat to place selected person | Click IN/OUT tag to toggle facing direction'}
          </div>
        </div>
      </div>
    </div>
  );
}
