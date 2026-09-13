import React, { useState } from 'react';
import { Users, CircleDot, GitCommit, Heart, Compass, Binary, Cpu } from 'lucide-react';
import SeatingVisualizer from './SeatingVisualizer';
import SyllogismEngine from './SyllogismEngine';
import InequalityVisualizer from './InequalityVisualizer';
import BloodRelationVisualizer from './BloodRelationVisualizer';
import DirectionCompassVisualizer from './DirectionCompassVisualizer';
import AlphabetCodeCalculator from './AlphabetCodeCalculator';
import InputOutputSimulator from './InputOutputSimulator';

export default function VisualizersHub({ isHindi }) {
  const [activeSubTab, setActiveSubTab] = useState('seating');

  const tools = [
    { id: 'seating', name: isHindi ? 'बैठक व्यवस्था' : 'Seating Visualizer', icon: Users, desc: 'Circular, Linear & Square Tables' },
    { id: 'syllogism', name: isHindi ? 'न्याय निगमन (Syllogism)' : 'Syllogism Engine', icon: CircleDot, desc: 'Venn Diagrams & 10s Challenge' },
    { id: 'inequality', name: isHindi ? 'असमानता (Inequality)' : 'Inequality Chain', icon: GitCommit, desc: 'Open Gate Door Method' },
    { id: 'blood', name: isHindi ? 'रक्त संबंध (Blood Relations)' : 'Blood Relations Tree', icon: Heart, desc: 'Generational Integer Method' },
    { id: 'direction', name: isHindi ? 'दिशा एवं दूरी' : 'Direction & Compass', icon: Compass, desc: '8-Point Vector Cartesian Solver' },
    { id: 'alphabet', name: isHindi ? 'वर्णमाला कैलकुलेटर' : 'Alphabet & Coding', icon: Binary, desc: 'Letter Values, Pairs & Opposites' },
    { id: 'input_output', name: isHindi ? 'मशीन इनपुट-आउटपुट' : 'Input-Output Simulator', icon: Cpu, desc: 'Step Machine & Auto-Arrangement' },
  ];

  return (
    <div className="space-y-6">
      {/* Visualizers Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tools.map(tool => {
            const Icon = tool.icon;
            const isSelected = activeSubTab === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveSubTab(tool.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tool.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Component */}
      {activeSubTab === 'seating' && <SeatingVisualizer isHindi={isHindi} />}
      {activeSubTab === 'syllogism' && <SyllogismEngine isHindi={isHindi} />}
      {activeSubTab === 'inequality' && <InequalityVisualizer isHindi={isHindi} />}
      {activeSubTab === 'blood' && <BloodRelationVisualizer isHindi={isHindi} />}
      {activeSubTab === 'direction' && <DirectionCompassVisualizer isHindi={isHindi} />}
      {activeSubTab === 'alphabet' && <AlphabetCodeCalculator isHindi={isHindi} />}
      {activeSubTab === 'input_output' && <InputOutputSimulator isHindi={isHindi} />}
    </div>
  );
}
