import React, { useState, useEffect } from 'react';
import {
  Brain,
  Target,
  Zap,
  Trophy,
  BarChart2,
  Sparkles,
  BookOpen,
  Calendar,
  Bookmark,
  ShieldCheck,
  AlertCircle,
  Database,
  Search,
  Moon,
  Sun,
  Globe,
  Flame,
  Menu,
  X
} from 'lucide-react';

import { dataManager } from './utils/dataManager';
import Dashboard from './components/dashboard/Dashboard';
import ConceptLearner from './components/learn/ConceptLearner';
import PracticeArena from './components/practice/PracticeArena';
import SpeedLab from './components/practice/SpeedLab';
import DailyChallenge from './components/practice/DailyChallenge';
import QuestionSelectionTrainer from './components/practice/QuestionSelectionTrainer';
import VisualizersHub from './components/visualizers/VisualizersHub';
import ExamSimulator from './components/mock/ExamSimulator';
import PyqAnalytics from './components/analytics/PyqAnalytics';
import MindTricksLibrary from './components/tools/MindTricksLibrary';
import RevisionMistakes from './components/tools/RevisionMistakes';
import StudyPlans from './components/tools/StudyPlans';
import ExamPatternDashboard from './components/tools/ExamPatternDashboard';
import BookmarksViewer from './components/tools/BookmarksViewer';
import QuestionImporter from './components/tools/QuestionImporter';
import GlobalSearchModal from './components/common/GlobalSearchModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isHindi, setIsHindi] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data manager
  useEffect(() => {
    async function init() {
      await dataManager.initialize();
      const savedLang = dataManager.getLanguage();
      setIsHindi(savedLang === 'hi');
      setIsLoading(false);
    }
    init();

    // Check system or saved dark mode
    const isDark = localStorage.getItem('brm_dark_mode') === 'true';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Ctrl+K search shortcut
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleLanguage = () => {
    const next = !isHindi;
    setIsHindi(next);
    dataManager.setLanguage(next ? 'hi' : 'en');
  };

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('brm_dark_mode', String(next));
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navItems = [
    { id: 'dashboard', label: isHindi ? 'डैशबोर्ड' : 'Dashboard', icon: Brain },
    { id: 'learn', label: isHindi ? 'पाठ्यक्रम व अवधारणा' : 'Learn & Syllabus', icon: BookOpen },
    { id: 'practice', label: isHindi ? 'प्रैक्टिस एरीना' : 'Practice Arena', icon: Target },
    { id: 'speed_lab', label: isHindi ? 'स्पीड लैब' : 'Speed Lab', icon: Zap },
    { id: 'daily', label: isHindi ? 'दैनिक चैलेंज' : 'Daily Challenge', icon: Calendar },
    { id: 'visualizers', label: isHindi ? 'इंटरएक्टिव लैब्स' : 'Interactive Labs', icon: Sparkles },
    { id: 'mocks', label: isHindi ? 'मॉक टेस्ट सिमुलेटर' : 'Mock Simulator', icon: Trophy },
    { id: 'pyq', label: isHindi ? 'PYQ रुझान (2020-26)' : 'PYQ Trends', icon: BarChart2 },
    { id: 'tricks', label: isHindi ? 'माइंड ट्रिक्स व टॉपर' : 'Mind Tricks', icon: Flame },
    { id: 'trainer', label: isHindi ? 'प्रश्न चयन ट्रेनर' : 'Selection Trainer', icon: ShieldCheck },
    { id: 'mistakes', label: isHindi ? 'गलतियों का पुनरीक्षण' : 'Revise Mistakes', icon: AlertCircle },
    { id: 'plans', label: isHindi ? 'अध्ययन योजना' : 'Study Plans', icon: BookOpen },
    { id: 'patterns', label: isHindi ? 'परीक्षा संरचना' : 'Exam Patterns', icon: ShieldCheck },
    { id: 'bookmarks', label: isHindi ? 'बुकमार्क' : 'Bookmarks', icon: Bookmark },
    { id: 'importer', label: isHindi ? 'आयातक एवं बैकअप' : 'Import & Backup', icon: Database },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-sm font-bold tracking-wide font-mono">Loading Bank Reasoning Master...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white flex items-center justify-center font-bold shadow-md">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-tight">
                Bank Reasoning Master
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                SBI Clerk • IBPS Clerk/CSA • RRB OA
              </div>
            </div>
          </div>

          {/* Search Trigger Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center gap-3 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 text-slate-500 dark:text-slate-400 rounded-xl text-xs transition border border-slate-200 dark:border-slate-700 max-w-xs w-full"
          >
            <Search className="w-4 h-4" />
            <span className="truncate">Search topics, tricks, questions...</span>
            <kbd className="ml-auto font-mono text-[10px] bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
              Ctrl K
            </kbd>
          </button>

          {/* Right Action Icons: Language Switcher, Dark Mode, Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5 transition"
              title="Toggle English / हिंदी"
            >
              <Globe className="w-3.5 h-3.5 text-brand-600" />
              <span>{isHindi ? 'हिंदी' : 'EN'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Secondary Navigation Ribbon (Desktop) */}
        <div className="hidden lg:block bg-slate-50 dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 py-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-1">
            <button
              onClick={() => { setIsSearchOpen(true); setMobileMenuOpen(false); }}
              className="w-full mb-3 flex items-center gap-2 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-500 font-medium"
            >
              <Search className="w-4 h-4" />
              <span>Search everything...</span>
            </button>

            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map(item => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 text-left ${
                      isSelected
                        ? 'bg-brand-600 text-white font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} isHindi={isHindi} />}
        {activeTab === 'learn' && <ConceptLearner isHindi={isHindi} onStartPractice={(tId) => setActiveTab('practice')} />}
        {activeTab === 'practice' && <PracticeArena isHindi={isHindi} />}
        {activeTab === 'speed_lab' && <SpeedLab isHindi={isHindi} />}
        {activeTab === 'daily' && <DailyChallenge isHindi={isHindi} />}
        {activeTab === 'visualizers' && <VisualizersHub isHindi={isHindi} />}
        {activeTab === 'mocks' && <ExamSimulator isHindi={isHindi} />}
        {activeTab === 'pyq' && <PyqAnalytics isHindi={isHindi} />}
        {activeTab === 'tricks' && <MindTricksLibrary isHindi={isHindi} />}
        {activeTab === 'trainer' && <QuestionSelectionTrainer isHindi={isHindi} />}
        {activeTab === 'mistakes' && <RevisionMistakes isHindi={isHindi} />}
        {activeTab === 'plans' && <StudyPlans isHindi={isHindi} />}
        {activeTab === 'patterns' && <ExamPatternDashboard isHindi={isHindi} />}
        {activeTab === 'bookmarks' && <BookmarksViewer isHindi={isHindi} />}
        {activeTab === 'importer' && <QuestionImporter isHindi={isHindi} />}
      </main>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTopic={(tId) => {
          setActiveTab('learn');
        }}
        onSelectTrick={(trId) => {
          setActiveTab('tricks');
        }}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Bank Reasoning Master</span>
            <span>• SBI Clerk • IBPS Clerk/CSA • IBPS RRB Office Assistant</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Last Updated: <strong>September 2026</strong></span>
            <span>•</span>
            <span>Client-Side Architecture (GitHub Pages Ready)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
