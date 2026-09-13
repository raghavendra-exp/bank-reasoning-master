import React, { useState } from 'react';
import { Target, CheckCircle2, XCircle, ArrowRight, HelpCircle, ShieldCheck, AlertTriangle, Sparkles } from 'lucide-react';

export default function QuestionSelectionTrainer({ isHindi }) {
  const [selectedPuzzleId, setSelectedPuzzleId] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const scenario = {
    title: "Clerk Prelims 20-Minute Time Crisis: Which Puzzle to Attempt First?",
    titleHi: "क्लर्क प्रीलिम्स 20-मिनट का समय संकट: किस पहेली को पहले हल करें?",
    situation: "You have completed standalone speed questions (Syllogisms, Inequalities, Alphanumeric) in 6 minutes, scoring 15 marks. You now have 14 minutes remaining to attempt 4 puzzle sets (20 marks). Inspect the 5 available puzzle descriptions below and pick the one you MUST attempt FIRST.",
    situationHi: "आपने 6 मिनट में 15 अंक के मिसलेनियस प्रश्न (सिलोगिज़्म, इनइक्वालिटी, सीरीज) हल कर लिए हैं। अब आपके पास 14 मिनट शेष हैं और 4 पहेलियाँ हल करनी हैं। नीचे दिए गए 5 पहेलियों के विवरण देखें और चुनें कि आपको सबसे पहले कौन सी पहेली हल करनी चाहिए।",
    puzzles: [
      {
        id: "puz_1",
        title: "Puzzle A: 7 Floors (Single Variable)",
        titleHi: "पहेली A: 7 मंजिल (एकल चर - केवल व्यक्ति)",
        description: "Seven persons (A to G) live on seven different floors (1 to 7). First clue states: 'A lives on floor 3, and three persons live between A and B.'",
        variables: 1,
        fixedClues: "Definite anchor (Floor 3 explicitly given)",
        casesRequired: 1,
        expectedTime: "1.5 - 2.0 min",
        idealRank: 1,
        isBestChoice: true,
        verdict: "TOP PRIORITY ATTEMPT! Single variable with an explicit fixed floor anchor reduces permutations to virtually 1 case. Solvable in under 2 minutes with guaranteed 5 marks.",
        verdictHi: "सर्वोच्च प्राथमिकता! एकल चर और निश्चित मंजिल (फ्लोर 3) दिए जाने से यह मात्र 1 केस में हल हो जाती है। 2 मिनट में 5 अंक पक्के।"
      },
      {
        id: "puz_2",
        title: "Puzzle B: 8 Persons Circular Table (Facing Inside & Outside)",
        titleHi: "पहेली B: 8 व्यक्ति वृत्ताकार मेज (कुछ अंदर, कुछ बाहर मुख)",
        description: "Eight persons sit around circle. Clue states: 'P sits second to the left of Q, who faces outside. Two persons sit between P and R who faces inside.'",
        variables: 2,
        fixedClues: "Facing direction mixed; requires parallel left/right tracking",
        casesRequired: 3,
        expectedTime: "3.5 - 4.0 min",
        idealRank: 4,
        isBestChoice: false,
        verdict: "DO NOT ATTEMPT FIRST. Mixed facing directions with 3 branch cases can cause left-right inversion traps under clock panic. Keep for 3rd or 4th slot.",
        verdictHi: "पहले हल न करें। अंदर-बाहर मिश्रित मुख वाले प्रश्नों में कम से कम 3 केस बनते हैं और दाएँ-बाएँ में गलती की संभावना रहती है।"
      },
      {
        id: "puz_3",
        title: "Puzzle C: 4 Months x 2 Dates (8 Persons Scheduling)",
        titleHi: "पहेली C: 4 महीने x 2 तिथियाँ (8 व्यक्ति सेमिनार)",
        description: "Eight persons attend seminar on 13th and 28th of March, April, May, and June. Clue: 'P attends in a month having 30 days.'",
        variables: 2,
        fixedClues: "Calendar grid gives rigid structure (30 vs 31 days)",
        casesRequired: 2,
        expectedTime: "2.5 - 3.0 min",
        idealRank: 2,
        isBestChoice: false,
        verdict: "EXCELLENT SECOND CHOICE. Month-date puzzles have fixed chronological boxes. April and June are 30-day months, creating only 2 initial parallel cases.",
        verdictHi: "उत्कृष्ट दूसरा विकल्प। 30 दिनों वाले महीनों (अप्रैल, जून) के कारण केवल 2 समानांतर केस बनते हैं।"
      },
      {
        id: "puz_4",
        title: "Puzzle D: Uncertain Number of Persons in a Linear Row",
        titleHi: "पहेली D: एक सीधी पंक्ति में व्यक्तियों की अनिश्चित संख्या",
        description: "An unknown number of persons sit in a row facing North. No total count given. 'Three persons between M and N; Q sits 4th from an extreme end.'",
        variables: "Uncertain length",
        fixedClues: "Open-ended ends; boundary undetermined",
        casesRequired: "3 to 4",
        expectedTime: "4.0 - 5.0 min",
        idealRank: 5,
        isBestChoice: false,
        verdict: "DANGER ZONE / SKIP INITIALLY! Uncertain rows have no fixed boundaries. If you get stuck at person count 19 vs 21, you lose 5 precious minutes.",
        verdictHi: "खतरे की घंटी / शुरुआत में छोड़ें! अनिश्चित संख्या वाली पंक्तियों में छोर तय न होने से समय बर्बाद हो सकता है।"
      },
      {
        id: "puz_5",
        title: "Puzzle E: Parallel Rows (10 Persons Facing North & South)",
        titleHi: "पहेली E: समानांतर पंक्तियाँ (10 व्यक्ति आमने-सामने)",
        description: "Row 1 (A-E facing South), Row 2 (P-T facing North). 'P sits in middle of row facing the one who sits 2nd to right of B.'",
        variables: 2,
        fixedClues: "Middle position anchor fixes initial column alignment",
        casesRequired: 2,
        expectedTime: "2.8 - 3.2 min",
        idealRank: 3,
        isBestChoice: false,
        verdict: "SOLID THIRD CHOICE. Middle position in a 5-person row is unique (Position 3). Parallel mapping is standard once facing pairs align.",
        verdictHi: "तीसरा ठोस विकल्प। 5-व्यक्ति पंक्ति में मध्य स्थान (सीट 3) अद्वितीय होता है।"
      }
    ]
  };

  const handleSelect = (id) => {
    setSelectedPuzzleId(id);
    setRevealed(true);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              {isHindi ? 'रणनीति ट्रेनर' : 'Tactical Strategy Trainer'}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isHindi ? 'प्रश्न चयन ट्रेनर (Question Selection Trainer)' : 'Question Selection Trainer'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isHindi
              ? 'टॉपर हर पहेली को अंधाधुंध नहीं हल करते। सबसे आसान सेट पहले पहचानना सीखें!'
              : 'Toppers never solve puzzles blindly in sequence. Train your eye to spot the highest ROI puzzle in 15 seconds.'}
          </p>
        </div>
      </div>

      {/* Scenario Context */}
      <div className="my-6 p-4 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs">
        <h3 className="font-bold text-amber-900 dark:text-amber-200 text-sm mb-1 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{isHindi ? scenario.titleHi : scenario.title}</span>
        </h3>
        <p className="text-amber-950 dark:text-amber-300 leading-relaxed">
          {isHindi ? scenario.situationHi : scenario.situation}
        </p>
      </div>

      {/* 5 Puzzle Cards */}
      <div className="space-y-4">
        {scenario.puzzles.map((puz, idx) => {
          const isSelected = selectedPuzzleId === puz.id;
          return (
            <div
              key={puz.id}
              className={`p-5 rounded-2xl border transition-all ${
                isSelected
                  ? puz.isBestChoice
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-400'
                    : 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 ring-2 ring-rose-400'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-brand-400'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isHindi ? puz.titleHi : puz.title}
                </h4>

                {revealed && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                    puz.idealRank === 1
                      ? 'bg-emerald-600 text-white'
                      : puz.idealRank === 5
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                  }`}>
                    Ideal Attempt Order: #{puz.idealRank}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                {puz.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-3">
                <div>Variables: <strong className="text-slate-800 dark:text-slate-200">{puz.variables}</strong></div>
                <div>Anchor Clues: <strong className="text-slate-800 dark:text-slate-200">{puz.fixedClues}</strong></div>
                <div>Cases: <strong className="text-slate-800 dark:text-slate-200">{puz.casesRequired}</strong></div>
                <div>Expected Time: <strong className="text-slate-800 dark:text-slate-200">{puz.expectedTime}</strong></div>
              </div>

              {!revealed ? (
                <button
                  onClick={() => handleSelect(puz.id)}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg shadow-sm transition"
                >
                  {isHindi ? 'मैं इस पहेली को पहले हल करूँगा' : 'I will attempt this puzzle first'}
                </button>
              ) : (
                <div className={`mt-3 p-3 rounded-xl text-xs font-medium ${
                  puz.isBestChoice
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}>
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {puz.isBestChoice ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                    <span>Faculty Strategic Verdict:</span>
                  </div>
                  <p>{isHindi ? puz.verdictHi : puz.verdict}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Strategic Rule Box */}
      {revealed && (
        <div className="mt-6 p-4 bg-slate-900 text-white rounded-xl text-xs space-y-2 font-mono">
          <div className="text-amber-400 font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>EXAM HIERARCHY OF ATTEMPTS:</span>
          </div>
          <p className="text-slate-300">
            Priority 1: Single-variable Floor/Box with definite number anchor (Floor 3).
            <br />Priority 2: Rigid calendar date matrix (March/April dates).
            <br />Priority 3: Parallel rows with middle seat anchor.
            <br />Priority 4: Mixed-facing circle (requires caution).
            <br />Priority 5: Uncertain length linear row (Never touch first!).
          </p>
        </div>
      )}
    </div>
  );
}
