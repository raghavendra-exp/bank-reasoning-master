import React, { useState, useEffect } from 'react';
import { CircleDot, Zap, CheckCircle, XCircle, HelpCircle, Timer, Award } from 'lucide-react';

export default function SyllogismEngine({ isHindi }) {
  const [activeTab, setActiveTab] = useState('venn'); // 'venn', 'challenge', 'rules'
  const [selectedPattern, setSelectedPattern] = useState('only_a_few');

  // Challenge Mode State
  const [challengeActive, setChallengeActive] = useState(false);
  const [challengeTimeLeft, setChallengeTimeLeft] = useState(10);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [challengeScore, setChallengeScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const challengeQuestions = [
    {
      statement: "Statements: Only a few Cups are Mugs. All Mugs are Plates.",
      statementHi: "कथन: केवल कुछ Cups, Mugs हैं। सभी Mugs, Plates हैं।",
      conclusion: "Conclusion: All Cups being Mugs is a possibility.",
      conclusionHi: "निष्कर्ष: सभी Cups के Mugs होने की संभावना है।",
      isFollows: false,
      reason: "'Only a few Cups are Mugs' guarantees Some Cups are NOT Mugs. Hence All Cups can never be inside Mugs. Possibility is FALSE.",
      reasonHi: "'केवल कुछ Cups, Mugs हैं' का अर्थ है कि कुछ Cups कभी Mugs नहीं हो सकते। अतः सभी Cups के Mugs होने की संभावना गलत है।"
    },
    {
      statement: "Statements: All Keys are Locks. No Lock is Door.",
      statementHi: "कथन: सभी Keys, Locks हैं। कोई Lock, Door नहीं है।",
      conclusion: "Conclusion: No Key is Door.",
      conclusionHi: "निष्कर्ष: कोई Key, Door नहीं है।",
      isFollows: true,
      reason: "Keys are completely enclosed inside Locks, and Locks has a 100% negative cross with Door. Hence No Key is Door is TRUE.",
      reasonHi: "Keys पूर्ण रूप से Locks के अंदर हैं, और कोई Lock, Door नहीं हो सकता। अतः कोई Key, Door नहीं है (सत्य)।"
    },
    {
      statement: "Statements: Only a few Pens are Pencils. No Pencil is Eraser.",
      statementHi: "कथन: केवल कुछ Pens, Pencils हैं। कोई Pencil, Eraser नहीं है।",
      conclusion: "Conclusion: Some Pens are definitely not Eraser.",
      conclusionHi: "निष्कर्ष: कुछ Pens निश्चित रूप से Eraser नहीं हैं।",
      isFollows: true,
      reason: "The Pens that are inside Pencil can never enter Eraser. Therefore, Some Pens are definitely not Eraser is 100% TRUE.",
      reasonHi: "Pens का वह भाग जो Pencil में है, कभी Eraser नहीं हो सकता। अतः कुछ Pens निश्चित रूप से Eraser नहीं हैं (सत्य)।"
    },
    {
      statement: "Statements: Some Cats are Dogs. Some Dogs are Birds.",
      statementHi: "कथन: कुछ Cats, Dogs हैं। कुछ Dogs, Birds हैं।",
      conclusion: "Conclusion: Some Cats are Birds.",
      conclusionHi: "निष्कर्ष: कुछ Cats, Birds हैं।",
      isFollows: false,
      reason: "There is no direct link or restriction between Cats and Birds. It is only an unconfirmed possibility, not a definite conclusion!",
      reasonHi: "Cats और Birds के बीच कोई निश्चित संबंध नहीं है। निश्चित निष्कर्ष असत्य है।"
    }
  ];

  // Timer for challenge
  useEffect(() => {
    let timer;
    if (challengeActive && challengeTimeLeft > 0 && selectedAnswer === null) {
      timer = setInterval(() => setChallengeTimeLeft(prev => prev - 1), 1000);
    } else if (challengeTimeLeft === 0 && selectedAnswer === null) {
      handleChallengeAnswer(null); // Time out
    }
    return () => clearInterval(timer);
  }, [challengeActive, challengeTimeLeft, selectedAnswer]);

  const startChallenge = () => {
    setChallengeActive(true);
    setCurrentChallengeIndex(0);
    setChallengeScore(0);
    setChallengeTimeLeft(10);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  const handleChallengeAnswer = (userChoice) => {
    const q = challengeQuestions[currentChallengeIndex];
    setSelectedAnswer(userChoice);
    const isCorrect = userChoice === q.isFollows;
    if (isCorrect) setChallengeScore(prev => prev + 1);

    setFeedback({
      isCorrect,
      reason: isHindi ? q.reasonHi : q.reason
    });
  };

  const nextChallenge = () => {
    if (currentChallengeIndex < challengeQuestions.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
      setChallengeTimeLeft(10);
      setSelectedAnswer(null);
      setFeedback(null);
    } else {
      setChallengeActive(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {isHindi ? 'तर्क सिमुलेटर' : 'Logic Simulator'}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isHindi ? 'न्याय निगमन (Syllogism) इंजन' : 'Interactive Syllogism Engine'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isHindi
              ? 'वेन आरेख देखें, "Only a few" की बारीकियों को समझें और 10-सेकंड चैलेंज खेलें।'
              : 'Visualize Venn interactions, grasp "Only a few" nuances, and take the 10-Second Syllogism Challenge.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('venn')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === 'venn' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            {isHindi ? 'वेन आरेख मोड' : 'Venn Visualizer'}
          </button>
          <button
            onClick={() => setActiveTab('challenge')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1 ${activeTab === 'challenge' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            {isHindi ? '10-सेकंड चैलेंज' : '10s Challenge'}
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === 'rules' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            {isHindi ? 'गोल्डन रूल्स' : 'Golden Rules'}
          </button>
        </div>
      </div>

      {/* Tab 1: Venn Visualizer */}
      {activeTab === 'venn' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Pattern Selector */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {isHindi ? 'कथन प्रकार चुनें' : 'Select Statement Pattern'}
            </h3>
            {[
              { id: 'only_a_few', title: 'Only a few A are B', badge: '🔥 Bank Exam Special', color: 'border-brand-500' },
              { id: 'only', title: 'Only A are B (All B are A)', badge: 'Exclusive Restriction', color: 'border-indigo-500' },
              { id: 'all', title: 'All A are B', badge: 'Universal Positive', color: 'border-emerald-500' },
              { id: 'no', title: 'No A is B', badge: 'Universal Negative', color: 'border-rose-500' },
              { id: 'some_not', title: 'Some A are not B', badge: 'Particular Negative', color: 'border-amber-500' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedPattern(item.id)}
                className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                  selectedPattern === item.id
                    ? `${item.color} bg-brand-50/70 dark:bg-slate-800 border-2 text-slate-900 dark:text-white font-bold`
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold">{item.title}</div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.badge}</span>
                </div>
                <CircleDot className={`w-4 h-4 ${selectedPattern === item.id ? 'text-brand-600' : 'text-slate-400'}`} />
              </button>
            ))}
          </div>

          {/* Center: Interactive SVG Venn Diagram */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl relative min-h-[380px]">
            {selectedPattern === 'only_a_few' && (
              <div className="flex flex-col items-center">
                <svg width="340" height="200" viewBox="0 0 340 200" className="drop-shadow-lg">
                  <defs>
                    <linearGradient id="gradA" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="gradB" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#047857" stopOpacity="0.7" />
                    </linearGradient>
                  </defs>

                  {/* Circle A */}
                  <circle cx="120" cy="100" r="75" fill="url(#gradA)" stroke="#60a5fa" strokeWidth="3" />
                  <text x="75" y="105" fill="#ffffff" fontWeight="bold" fontSize="18">Circle A</text>

                  {/* Circle B */}
                  <circle cx="220" cy="100" r="75" fill="url(#gradB)" stroke="#34d399" strokeWidth="3" />
                  <text x="245" y="105" fill="#ffffff" fontWeight="bold" fontSize="18">Circle B</text>

                  {/* Overlap indicator: Some A are B */}
                  <text x="160" y="95" fill="#fef08a" fontWeight="bold" fontSize="11" textAnchor="middle">Some A are B</text>

                  {/* Non-overlap restriction: Some A are NOT B */}
                  <path d="M 100 65 L 140 135" stroke="#ef4444" strokeWidth="3" strokeDasharray="4" />
                  <circle cx="95" cy="135" r="5" fill="#ef4444" />
                  <text x="70" y="155" fill="#fca5a5" fontSize="10" fontWeight="bold">Some A NOT B (Definite!)</text>
                </svg>

                <div className="mt-4 max-w-md bg-slate-800/90 p-4 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1.5">
                  <div className="font-bold text-amber-300">
                    {isHindi ? '⚡ "Only a few A are B" के दो अनिवार्य अर्थ:' : '⚡ "Only a few A are B" means TWO things simultaneously:'}
                  </div>
                  <p>1. <strong className="text-emerald-400">Some A are B</strong> (Positive truth)</p>
                  <p>2. <strong className="text-rose-400">Some A are NOT B</strong> (Negative truth)</p>
                  <div className="p-2 bg-slate-900 rounded text-[11px] text-slate-400 mt-2 border border-slate-800">
                    <span className="text-brand-400 font-bold">Rule: </span>
                    All A being B is a possibility? <strong className="text-rose-400">FALSE (100% Impossible)</strong>.
                    <br />
                    All B being A is a possibility? <strong className="text-emerald-400">TRUE (Permitted)</strong>.
                  </div>
                </div>
              </div>
            )}

            {selectedPattern === 'only' && (
              <div className="flex flex-col items-center">
                <svg width="340" height="200" viewBox="0 0 340 200">
                  <circle cx="170" cy="100" r="85" fill="#1e293b" stroke="#6366f1" strokeWidth="3" />
                  <text x="170" y="45" fill="#a5b4fc" fontWeight="bold" fontSize="14" textAnchor="middle">Outer Circle: A</text>

                  <circle cx="170" cy="115" r="45" fill="#312e81" stroke="#f59e0b" strokeWidth="3" />
                  <text x="170" y="120" fill="#fde68a" fontWeight="bold" fontSize="14" textAnchor="middle">B (Exclusive)</text>
                </svg>

                <div className="mt-4 max-w-md bg-slate-800/90 p-4 rounded-xl border border-slate-700 text-xs text-slate-300">
                  <div className="font-bold text-amber-300 mb-1">
                    {isHindi ? 'विशेष नियम: "Only A are B"' : 'Special Rule: "Only A are B"'}
                  </div>
                  <p>Translates into: <strong className="text-indigo-300">All B are A</strong>.</p>
                  <p className="text-amber-200 mt-1">
                    Crucial: B is strictly locked with A. No other element (C, D, E) can ever have any relationship or overlap with B!
                  </p>
                </div>
              </div>
            )}

            {selectedPattern === 'all' && (
              <div className="flex flex-col items-center">
                <svg width="340" height="200" viewBox="0 0 340 200">
                  <circle cx="170" cy="100" r="80" fill="#064e3b" stroke="#10b981" strokeWidth="3" opacity="0.6" />
                  <text x="170" y="45" fill="#6ee7b7" fontWeight="bold" fontSize="14" textAnchor="middle">Outer: B</text>

                  <circle cx="170" cy="115" r="40" fill="#047857" stroke="#34d399" strokeWidth="3" />
                  <text x="170" y="120" fill="#ffffff" fontWeight="bold" fontSize="14" textAnchor="middle">Inner: A</text>
                </svg>
                <div className="mt-4 max-w-md bg-slate-800/90 p-3 rounded-xl border border-slate-700 text-xs text-slate-300">
                  <p>Every element of A is inside B. Hence <strong className="text-emerald-400">All A are B</strong> and <strong className="text-emerald-400">Some B are A</strong> are definite truths.</p>
                </div>
              </div>
            )}

            {selectedPattern === 'no' && (
              <div className="flex flex-col items-center">
                <svg width="340" height="200" viewBox="0 0 340 200">
                  <circle cx="95" cy="100" r="60" fill="#1e293b" stroke="#ef4444" strokeWidth="3" />
                  <text x="95" y="105" fill="#fca5a5" fontWeight="bold" fontSize="16" textAnchor="middle">Circle A</text>

                  <circle cx="245" cy="100" r="60" fill="#1e293b" stroke="#ef4444" strokeWidth="3" />
                  <text x="245" y="105" fill="#fca5a5" fontWeight="bold" fontSize="16" textAnchor="middle">Circle B</text>

                  {/* Red Cross connecting them */}
                  <line x1="155" y1="100" x2="185" y2="100" stroke="#ef4444" strokeWidth="4" />
                  <line x1="165" y1="90" x2="175" y2="110" stroke="#ef4444" strokeWidth="3" />
                  <line x1="175" y1="90" x2="165" y2="110" stroke="#ef4444" strokeWidth="3" />
                </svg>
                <div className="mt-4 max-w-md bg-slate-800/90 p-3 rounded-xl border border-slate-700 text-xs text-slate-300">
                  <p>100% Disjoint. No part of A can ever touch B, and no part of B can ever touch A.</p>
                </div>
              </div>
            )}

            {selectedPattern === 'some_not' && (
              <div className="flex flex-col items-center">
                <svg width="340" height="200" viewBox="0 0 340 200">
                  <circle cx="120" cy="100" r="70" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
                  <text x="100" y="105" fill="#fde68a" fontWeight="bold" fontSize="16" textAnchor="middle">A</text>

                  <circle cx="220" cy="100" r="70" fill="#1e293b" stroke="#64748b" strokeWidth="2" strokeDasharray="4" />
                  <text x="240" y="105" fill="#cbd5e1" fontWeight="bold" fontSize="16" textAnchor="middle">B</text>

                  <path d="M 80 80 L 170 120" stroke="#ef4444" strokeWidth="2" />
                  <circle cx="80" cy="80" r="6" fill="#ef4444" />
                </svg>
                <div className="mt-4 max-w-md bg-slate-800/90 p-3 rounded-xl border border-slate-700 text-xs text-slate-300">
                  <p>At least some specific part of A is definitively barred from entering B.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: 10-Second Syllogism Challenge */}
      {activeTab === 'challenge' && (
        <div className="mt-6">
          {!challengeActive ? (
            <div className="text-center py-12 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Timer className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {isHindi ? '10-सेकंड सिलोगिज़्म ड्रिल' : '10-Second Syllogism Speed Drill'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2">
                {isHindi
                  ? 'बैंक क्लर्क परीक्षा में प्रत्येक प्रश्न 15-20 सेकंड में हल होना चाहिए। 10 सेकंड में निर्णय लेने की अपनी गति परखें!'
                  : 'In Bank Clerk exams, syllogisms must be cleared in 15-20s. Test your instinct with a strict 10s per question timer!'}
              </p>
              <button
                onClick={startChallenge}
                className="mt-6 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/30 transition flex items-center gap-2 mx-auto"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                {isHindi ? 'चैलेंज प्रारंभ करें' : 'Start 10s Challenge'}
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 max-w-2xl mx-auto">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <span className="text-xs font-bold text-brand-400">
                  Question {currentChallengeIndex + 1} of {challengeQuestions.length}
                </span>
                <div className={`flex items-center gap-1 font-mono font-bold text-sm px-3 py-1 rounded-full ${
                  challengeTimeLeft <= 3 ? 'bg-rose-900 text-rose-300 animate-pulse' : 'bg-slate-800 text-amber-400'
                }`}>
                  <Timer className="w-4 h-4" />
                  <span>{challengeTimeLeft}s</span>
                </div>
              </div>

              {/* Question Body */}
              <div className="my-6 space-y-3">
                <div className="p-3 bg-slate-800/70 rounded-lg text-xs font-mono text-slate-300 whitespace-pre-line">
                  {isHindi
                    ? challengeQuestions[currentChallengeIndex].statementHi
                    : challengeQuestions[currentChallengeIndex].statement}
                </div>
                <div className="p-3 bg-slate-800 rounded-lg text-sm font-bold text-white border-l-4 border-brand-500">
                  {isHindi
                    ? challengeQuestions[currentChallengeIndex].conclusionHi
                    : challengeQuestions[currentChallengeIndex].conclusion}
                </div>
              </div>

              {/* True or False options */}
              {selectedAnswer === null ? (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleChallengeAnswer(true)}
                    className="py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base rounded-xl transition shadow flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {isHindi ? 'अनुसरण करता है (Follows)' : 'Follows (True)'}
                  </button>
                  <button
                    onClick={() => handleChallengeAnswer(false)}
                    className="py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-base rounded-xl transition shadow flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    {isHindi ? 'अनुसरण नहीं करता (Does Not Follow)' : 'Does Not Follow (False)'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border ${feedback.isCorrect ? 'bg-emerald-950/80 border-emerald-700 text-emerald-200' : 'bg-rose-950/80 border-rose-700 text-rose-200'}`}>
                    <div className="font-bold flex items-center gap-2">
                      {feedback.isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
                      <span>{feedback.isCorrect ? (isHindi ? 'बिल्कुल सही!' : 'Correct Answer!') : (isHindi ? 'गलत उत्तर!' : 'Incorrect / Time Out!')}</span>
                    </div>
                    <p className="text-xs mt-2 text-slate-300 leading-relaxed">{feedback.reason}</p>
                  </div>

                  <button
                    onClick={nextChallenge}
                    className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-xl transition"
                  >
                    {currentChallengeIndex < challengeQuestions.length - 1 ? (isHindi ? 'अगला प्रश्न →' : 'Next Question →') : (isHindi ? 'परिणाम देखें' : 'View Results')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Golden Rules */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-brand-600 dark:text-brand-400 mb-1">
              {isHindi ? '1. कॉम्प्लिमेंट्री पेयर (Either-Or) के नियम' : '1. Either-Or Complementary Pairs'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Both conclusions must independently be FALSE. Subjects and Predicates must be identical.
              <br /><strong>Valid Pairs:</strong> (1) Some + No, (2) Some + Some Not.
              <br /><span className="text-rose-600 dark:text-rose-400 font-semibold">Caution:</span> 'All + No' is NEVER an Either-Or pair!
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-brand-600 dark:text-brand-400 mb-1">
              {isHindi ? '2. संभावना (Possibility) का नियम' : '2. Possibility Universal Rule'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If there is NO negative restriction or definite contradiction between two circles, any possibility between them is ALWAYS TRUE. If a relation is already definitely true, its possibility is FALSE.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-brand-600 dark:text-brand-400 mb-1">
              {isHindi ? '3. "Few" बनाम "Only a few"' : '3. "Few" vs "Only a few"'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Few / A few:</strong> Simple 'Some' (affirmative only).
              <br /><strong>Only a few:</strong> 'Some' AND 'Some not' together.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-brand-600 dark:text-brand-400 mb-1">
              {isHindi ? '4. सकारात्मक कथनों का 5-सेकंड टेस्ट' : '4. 5-Second Positive Statement Test'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If all given statements are affirmative (All / Some), NO definite negative conclusion (No / Some not) can ever follow!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
