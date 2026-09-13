import React, { useState } from 'react';
import { Compass, Move, RotateCcw, Plus, Trash2, ArrowUpRight } from 'lucide-react';

export default function DirectionCompassVisualizer({ isHindi }) {
  const [steps, setSteps] = useState([
    { dir: 'NORTH', dist: 12 },
    { dir: 'EAST', dist: 16 },
    { dir: 'SOUTH', dist: 4 }
  ]);

  const [customDir, setCustomDir] = useState('EAST');
  const [customDist, setCustomDist] = useState(10);

  // Compute Cartesian coordinates
  let curX = 0;
  let curY = 0;
  const pathPoints = [{ x: 0, y: 0, label: 'Start (0,0)' }];

  steps.forEach((s, idx) => {
    if (s.dir === 'NORTH') curY += s.dist;
    else if (s.dir === 'SOUTH') curY -= s.dist;
    else if (s.dir === 'EAST') curX += s.dist;
    else if (s.dir === 'WEST') curX -= s.dist;
    pathPoints.push({ x: curX, y: curY, label: `P${idx + 1} (${curX}, ${curY})` });
  });

  const netX = curX;
  const netY = curY;
  const shortestDist = Math.round(Math.sqrt(netX * netX + netY * netY) * 100) / 100;

  let finalDirection = "Origin";
  if (netX > 0 && netY > 0) finalDirection = "North-East (उत्तर-पूर्व)";
  else if (netX > 0 && netY < 0) finalDirection = "South-East (दक्षिण-पूर्व)";
  else if (netX < 0 && netY > 0) finalDirection = "North-West (उत्तर-पश्चिम)";
  else if (netX < 0 && netY < 0) finalDirection = "South-West (दक्षिण-पश्चिम)";
  else if (netX > 0 && netY === 0) finalDirection = "East (पूर्व)";
  else if (netX < 0 && netY === 0) finalDirection = "West (पश्चिम)";
  else if (netX === 0 && netY > 0) finalDirection = "North (उत्तर)";
  else if (netX === 0 && netY < 0) finalDirection = "South (दक्षिण)";

  const addStep = () => {
    setSteps(prev => [...prev, { dir: customDir, dist: Number(customDist) }]);
  };

  const resetSteps = () => {
    setSteps([]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              {isHindi ? 'कार्तीय सिमुलेटर' : 'Cartesian Simulator'}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isHindi ? 'दिशा एवं दूरी कम्पास विश्लेषक' : 'Direction & Distance Compass Visualizer'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isHindi
              ? 'East = +X, West = -X, North = +Y, South = -Y द्वारा पाइथागोरस दूरी स्वतः ज्ञात करें।'
              : 'Vector displacement solver: North = +Y, South = -Y, East = +X, West = -X with automatic Pythagorean distance.'}
          </p>
        </div>

        {/* 8-Point Compass Points */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
          <Compass className="w-4 h-4 text-sky-500" />
          <span>N • NE • E • SE • S • SW • W • NW</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Step Manager */}
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              {isHindi ? 'नया कदम जोड़ें (Add Movement)' : 'Add Movement Step'}
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Direction</label>
                <select
                  value={customDir}
                  onChange={e => setCustomDir(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  <option value="NORTH">North ↑ (+Y)</option>
                  <option value="EAST">East → (+X)</option>
                  <option value="SOUTH">South ↓ (-Y)</option>
                  <option value="WEST">West ← (-X)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Distance (m)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={customDist}
                  onChange={e => setCustomDist(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
            <button
              onClick={addStep}
              className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              {isHindi ? 'कदम जोड़ें' : 'Add Step to Path'}
            </button>
          </div>

          {/* Active Steps List */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isHindi ? 'यात्रा मार्ग (Path Steps)' : 'Path Sequence'}
              </h3>
              <button
                onClick={resetSteps}
                className="text-[10px] text-rose-500 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto text-xs">
              {steps.length === 0 ? (
                <p className="text-slate-400 italic text-[11px]">No steps. Add steps above.</p>
              ) : (
                steps.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono">
                    <span>{idx + 1}. Walk {s.dist}m {s.dir}</span>
                    <span className="text-[10px] text-slate-400">
                      {s.dir === 'NORTH' && `+${s.dist}Y`}
                      {s.dir === 'SOUTH' && `-${s.dist}Y`}
                      {s.dir === 'EAST' && `+${s.dist}X`}
                      {s.dir === 'WEST' && `-${s.dist}X`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Center/Right: Visual Canvas & Calculations */}
        <div className="lg:col-span-2 flex flex-col justify-between p-6 bg-slate-900 rounded-2xl text-white">
          {/* Top Info Bar */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-800 rounded-xl border border-slate-700 text-center font-mono">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Net X (East-West)</div>
              <div className="text-base font-bold text-sky-400">{netX >= 0 ? `+${netX}m (East)` : `${netX}m (West)`}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Net Y (North-South)</div>
              <div className="text-base font-bold text-sky-400">{netY >= 0 ? `+${netY}m (North)` : `${netY}m (South)`}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Shortest Distance</div>
              <div className="text-base font-bold text-amber-400">{shortestDist} meters</div>
            </div>
          </div>

          {/* SVG Vector Path Visualizer */}
          <div className="my-6 flex items-center justify-center min-h-[220px]">
            <svg width="320" height="220" viewBox="-160 -110 320 220" className="border border-slate-800 rounded-xl bg-slate-950/60 shadow-inner">
              {/* Axes */}
              <line x1="-150" y1="0" x2="150" y2="0" stroke="#334155" strokeWidth="1" strokeDasharray="2" />
              <line x1="0" y1="-100" x2="0" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="2" />
              <text x="140" y="-5" fill="#64748b" fontSize="10" textAnchor="end">E (+X)</text>
              <text x="-140" y="-5" fill="#64748b" fontSize="10">W (-X)</text>
              <text x="5" y="-90" fill="#64748b" fontSize="10">N (+Y)</text>
              <text x="5" y="95" fill="#64748b" fontSize="10">S (-Y)</text>

              {/* Path polyline */}
              {pathPoints.length > 1 && (
                <polyline
                  points={pathPoints.map(p => `${p.x * 4},${-p.y * 4}`).join(' ')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Start Point */}
              <circle cx="0" cy="0" r="5" fill="#10b981" />
              <text x="5" y="15" fill="#a7f3d0" fontSize="9" fontWeight="bold">Origin (0,0)</text>

              {/* Current Final Point */}
              {pathPoints.length > 1 && (
                <>
                  <circle cx={netX * 4} cy={-netY * 4} r="6" fill="#f59e0b" />
                  {/* Shortest direct line */}
                  <line x1="0" y1="0" x2={netX * 4} y2={-netY * 4} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4" />
                </>
              )}
            </svg>
          </div>

          {/* Bottom Summary Result */}
          <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700 text-xs flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-slate-400">Final Relative Direction: </span>
              <strong className="text-brand-300 text-sm">{finalDirection}</strong>
            </div>
            <div className="text-[11px] text-amber-300 font-mono">
              Formula: √({netX}² + {netY}²) = √({netX * netX} + {netY * netY}) = {shortestDist}m
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
