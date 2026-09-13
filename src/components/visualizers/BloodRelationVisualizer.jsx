import React, { useState } from 'react';
import { Users, Plus, ShieldCheck, Heart, User, Sparkles } from 'lucide-react';

export default function BloodRelationVisualizer({ isHindi }) {
  const [selectedRelation, setSelectedRelation] = useState('paternal_uncle');

  const relationData = {
    paternal_uncle: {
      title: "Paternal Uncle (Chacha / Tau)",
      titleHi: "चाचा / ताऊ (Paternal Uncle)",
      generation: "+1",
      path: "Father → Brother",
      pathHi: "पिता → भाई",
      gender: "Male (Square □)",
      formula: "Generational Step: 0 (Brother) of +1 (Father) = +1",
      example: "A is brother of B. B is father of C. => A is Paternal Uncle of C."
    },
    maternal_uncle: {
      title: "Maternal Uncle (Mama)",
      titleHi: "मामा (Maternal Uncle)",
      generation: "+1",
      path: "Mother → Brother",
      pathHi: "माता → भाई",
      gender: "Male (Square □)",
      formula: "Generational Step: 0 (Brother) of +1 (Mother) = +1",
      example: "P is brother of Q. Q is mother of R. => P is Maternal Uncle of R."
    },
    nephew: {
      title: "Nephew (Bhatija / Bhanja)",
      titleHi: "भतीजा / भांजा (Nephew)",
      generation: "-1",
      path: "Brother/Sister → Son",
      pathHi: "भाई/बहन → पुत्र",
      gender: "Male (Square □)",
      formula: "Generational Step: 0 (Sibling) + (-1) (Son) = -1",
      example: "K is son of M. M is sister of N. => K is Nephew of N."
    },
    maternal_grandfather: {
      title: "Maternal Grandfather (Nana)",
      titleHi: "नाना (Maternal Grandfather)",
      generation: "+2",
      path: "Mother → Father",
      pathHi: "माता → पिता",
      gender: "Male (Square □)",
      formula: "Generational Step: +1 (Mother) + (+1) (Father) = +2",
      example: "X is father of Y. Y is mother of Z. => X is Maternal Grandfather of Z."
    },
    sister_in_law: {
      title: "Sister-in-law (Bhabhi / Nanad / Saali)",
      titleHi: "भाभी / ननद / साली (Sister-in-law)",
      generation: "0",
      path: "Brother → Wife OR Spouse → Sister",
      pathHi: "भाई → पत्नी अथवा जीवनसाथी → बहन",
      gender: "Female (Circle ○)",
      formula: "Generational Step: 0 (Same Generation)",
      example: "D is wife of E. E is brother of F. => D is Sister-in-law of F."
    }
  };

  const current = relationData[selectedRelation];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
              {isHindi ? 'वंशवृक्ष सिमुलेटर' : 'Family Tree Solver'}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isHindi ? 'रक्त संबंध पीढ़ी विधि (Generation Method)' : 'Blood Relation Generation Method'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isHindi
              ? '+2, +1, 0, -1, -2 पीढ़ी विधि द्वारा 10 सेकंड में विकल्पों को छाँटें।'
              : 'Master the generational integer shortcut to eliminate 3 out of 5 options in 10 seconds.'}
          </p>
        </div>

        {/* Generation Matrix Badge */}
        <div className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 font-mono">
          Grandparent: <strong className="text-brand-600">+2</strong> | Parent: <strong className="text-brand-600">+1</strong> | Sibling: <strong className="text-emerald-600">0</strong> | Child: <strong className="text-amber-600">-1</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Relation selector */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            {isHindi ? 'संबंध का प्रकार चुनें' : 'Select Relationship to Trace'}
          </h3>
          {Object.entries(relationData).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelectedRelation(key)}
              className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                selectedRelation === key
                  ? 'border-brand-500 bg-brand-50/70 dark:bg-slate-800 border-2 font-bold text-slate-900 dark:text-white'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div>
                <div className="text-sm">{isHindi ? val.titleHi : val.title}</div>
                <span className="text-[10px] text-slate-500">Gen: {val.generation}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                val.generation.includes('+') ? 'bg-blue-100 text-blue-800' : val.generation === '0' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {val.generation}
              </span>
            </button>
          ))}
        </div>

        {/* Visual Family Tree Stage */}
        <div className="lg:col-span-2 flex flex-col justify-between p-6 bg-slate-900 rounded-2xl text-white">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-400">
                {isHindi ? current.titleHi : current.title}
              </h3>
              <span className="px-3 py-1 bg-brand-600 text-white font-mono text-xs font-bold rounded-full">
                Generation Level: {current.generation}
              </span>
            </div>

            {/* Tree Graphical Representation */}
            <div className="my-8 flex flex-col items-center justify-center space-y-4">
              {selectedRelation === 'paternal_uncle' && (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-8">
                    <div className="p-3 bg-blue-900/60 border-2 border-blue-400 rounded-lg text-center">
                      <div className="text-xs text-blue-300">Generation +1</div>
                      <div className="font-bold text-sm">Uncle (A) [□ Male]</div>
                    </div>
                    <div className="text-slate-400 font-mono text-sm">── Brother ──</div>
                    <div className="p-3 bg-blue-900/60 border-2 border-blue-400 rounded-lg text-center">
                      <div className="text-xs text-blue-300">Generation +1</div>
                      <div className="font-bold text-sm">Father (B) [□ Male]</div>
                    </div>
                  </div>
                  <div className="h-6 w-0.5 bg-slate-500 my-1"></div>
                  <div className="p-3 bg-slate-800 border-2 border-emerald-400 rounded-lg text-center">
                    <div className="text-xs text-emerald-300">Generation 0 (Reference)</div>
                    <div className="font-bold text-sm">Target Person (C)</div>
                  </div>
                </div>
              )}

              {selectedRelation === 'maternal_grandfather' && (
                <div className="flex flex-col items-center">
                  <div className="p-3 bg-purple-900/60 border-2 border-purple-400 rounded-lg text-center">
                    <div className="text-xs text-purple-300">Generation +2</div>
                    <div className="font-bold text-sm">Grandfather (X) [□ Male]</div>
                  </div>
                  <div className="h-6 w-0.5 bg-slate-500 my-1"></div>
                  <div className="p-3 bg-rose-900/60 border-2 border-rose-400 rounded-lg text-center">
                    <div className="text-xs text-rose-300">Generation +1</div>
                    <div className="font-bold text-sm">Mother (Y) [○ Female]</div>
                  </div>
                  <div className="h-6 w-0.5 bg-slate-500 my-1"></div>
                  <div className="p-3 bg-slate-800 border-2 border-emerald-400 rounded-lg text-center">
                    <div className="text-xs text-emerald-300">Generation 0 (Reference)</div>
                    <div className="font-bold text-sm">Target Person (Z)</div>
                  </div>
                </div>
              )}

              {selectedRelation !== 'paternal_uncle' && selectedRelation !== 'maternal_grandfather' && (
                <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 text-center max-w-sm">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Path</div>
                  <div className="text-base font-bold text-brand-300 my-2">{isHindi ? current.pathHi : current.path}</div>
                  <div className="text-xs text-slate-300">{current.formula}</div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Card */}
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>{isHindi ? 'परीक्षण में उपयोग (Exam Application):' : 'Exam Application Shortcut:'}</span>
            </div>
            <p className="text-slate-300">{current.example}</p>
            <p className="text-[11px] text-slate-400">
              <strong>Rule:</strong> Square (□) for Male, Circle (○) for Female, Double line (=) for Married Couple, Single line (—) for Siblings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
