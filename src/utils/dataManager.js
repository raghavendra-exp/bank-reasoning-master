// Bank Reasoning Master - Central Data and Persistence Manager
import { generateQuestionBatch } from './questionGenerator';

const STORAGE_KEYS = {
  PROGRESS: 'brm_user_progress',
  BOOKMARKS: 'brm_bookmarks',
  NOTES: 'brm_notes',
  MISTAKES: 'brm_mistake_log',
  CUSTOM_QUESTIONS: 'brm_custom_questions',
  LANGUAGE: 'brm_lang',
  STUDY_PROGRESS: 'brm_study_plan_progress'
};

class DataManager {
  constructor() {
    this.examConfig = null;
    this.topics = [];
    this.pyqData = null;
    this.tricksData = null;
    this.studyPlans = null;
    this.baseQuestions = [];
    this.allQuestions = [];
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // 1. Fetch JSON datasets
      const [examRes, topicsRes, pyqRes, tricksRes, plansRes, qRes] = await Promise.all([
        fetch('./data/exam-config.json').then(r => r.json()).catch(() => ({ exams: [] })),
        fetch('./data/topics.json').then(r => r.json()).catch(() => []),
        fetch('./data/pyq.json').then(r => r.json()).catch(() => ({})),
        fetch('./data/tricks.json').then(r => r.json()).catch(() => ({})),
        fetch('./data/study-plans.json').then(r => r.json()).catch(() => ({})),
        fetch('./data/questions.json').then(r => r.json()).catch(() => [])
      ]);

      this.examConfig = examRes;
      this.topics = topicsRes;
      this.pyqData = pyqRes;
      this.tricksData = tricksRes;
      this.studyPlans = plansRes;
      this.baseQuestions = qRes;

      // 2. Deterministically generate 500+ practice questions
      const generatedQuestions = generateQuestionBatch(520, 101);

      // 3. Load any user custom/imported questions from localStorage
      const customQuestions = this.getCustomQuestions();

      // 4. Combine into complete 540+ question repository
      this.allQuestions = [...this.baseQuestions, ...customQuestions, ...generatedQuestions];

      this.initialized = true;
    } catch (err) {
      console.error("Error initializing DataManager:", err);
      // Fallback in case of fetch errors (e.g. offline first)
      const generated = generateQuestionBatch(200, 101);
      this.allQuestions = generated;
      this.initialized = true;
    }
  }

  // Getters
  getExams() {
    return this.examConfig?.exams || [];
  }

  getTopics() {
    return this.topics || [];
  }

  getPyqData() {
    return this.pyqData || {};
  }

  getTricksData() {
    return this.tricksData || {};
  }

  getStudyPlans() {
    return this.studyPlans?.plans || [];
  }

  getAllQuestions() {
    return this.allQuestions;
  }

  getQuestionsByTopic(topicId) {
    return this.allQuestions.filter(q => q.topic === topicId);
  }

  getQuestionsByDifficulty(diff) {
    return this.allQuestions.filter(q => q.difficulty.toUpperCase() === diff.toUpperCase());
  }

  getQuestionsByExam(examId) {
    return this.allQuestions.filter(q => q.exam && q.exam.includes(examId));
  }

  // LocalStorage Progress Tracking
  getProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    return {
      attemptedCount: 0,
      correctCount: 0,
      wrongCount: 0,
      totalTimeSec: 0,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      topicStats: {}, // { [topicId]: { attempted, correct, timeSec } }
      history: [] // [{ qId, isCorrect, timeTaken, date }]
    };
  }

  saveAnswerResult({ questionId, topicId, isCorrect, timeTakenSec, mistakeReason = null }) {
    const progress = this.getProgress();
    const today = new Date().toISOString().split('T')[0];

    // Streak logic
    if (progress.lastActiveDate !== today) {
      const lastDate = new Date(progress.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        progress.streakDays += 1;
      } else if (diffDays > 1) {
        progress.streakDays = 1;
      }
      progress.lastActiveDate = today;
    }

    progress.attemptedCount += 1;
    if (isCorrect) {
      progress.correctCount += 1;
    } else {
      progress.wrongCount += 1;
    }
    progress.totalTimeSec += timeTakenSec;

    // Topic stats
    if (!progress.topicStats[topicId]) {
      progress.topicStats[topicId] = { attempted: 0, correct: 0, totalTimeSec: 0 };
    }
    progress.topicStats[topicId].attempted += 1;
    if (isCorrect) progress.topicStats[topicId].correct += 1;
    progress.topicStats[topicId].totalTimeSec += timeTakenSec;

    // History limit to 200 items
    progress.history.unshift({
      questionId,
      topicId,
      isCorrect,
      timeTakenSec,
      timestamp: Date.now()
    });
    if (progress.history.length > 200) progress.history.pop();

    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));

    // If mistake, log to mistake log
    if (!isCorrect) {
      this.logMistake({
        questionId,
        topicId,
        timeTakenSec,
        reason: mistakeReason || "Unspecified",
        timestamp: Date.now()
      });
    }

    return progress;
  }

  // Mistake Log
  getMistakes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MISTAKES);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }

  logMistake(entry) {
    const mistakes = this.getMistakes();
    // avoid duplicates for same question if already present
    const filtered = mistakes.filter(m => m.questionId !== entry.questionId);
    filtered.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(filtered.slice(0, 100)));
  }

  removeMistake(questionId) {
    const mistakes = this.getMistakes().filter(m => m.questionId !== questionId);
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
  }

  // Bookmarks
  getBookmarks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }

  toggleBookmark(questionId) {
    const bms = this.getBookmarks();
    const idx = bms.indexOf(questionId);
    if (idx >= 0) {
      bms.splice(idx, 1);
    } else {
      bms.push(questionId);
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bms));
    return bms.includes(questionId);
  }

  isBookmarked(questionId) {
    return this.getBookmarks().includes(questionId);
  }

  // Topic Notes
  getNotes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {};
  }

  saveNote(topicId, noteText) {
    const notes = this.getNotes();
    notes[topicId] = noteText;
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }

  // Language setting
  getLanguage() {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
  }

  setLanguage(lang) {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }

  // Custom / Imported questions
  getCustomQuestions() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }

  addCustomQuestions(newQuestions) {
    const existing = this.getCustomQuestions();
    const existingIds = new Set(existing.map(q => q.id));
    const toAdd = newQuestions.filter(q => !existingIds.has(q.id));
    const merged = [...existing, ...toAdd];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(merged));
    this.allQuestions = [...this.allQuestions, ...toAdd];
    return toAdd.length;
  }

  // Weakness Detection & Readiness Score
  getReadinessScore() {
    const progress = this.getProgress();
    if (progress.attemptedCount === 0) {
      return { score: 0, status: "Not Started", label: "Begin your initial practice test", details: {} };
    }

    const accuracy = (progress.correctCount / progress.attemptedCount) * 100;
    const avgTime = progress.totalTimeSec / progress.attemptedCount;

    // Accuracy Score (max 40)
    let accScore = (accuracy / 100) * 40;

    // Speed Score (max 30): Target average 40s per question
    let speedScore = 0;
    if (avgTime <= 25) speedScore = 30;
    else if (avgTime <= 40) speedScore = 25;
    else if (avgTime <= 60) speedScore = 18;
    else if (avgTime <= 90) speedScore = 10;
    else speedScore = 5;

    // Coverage & Volume Score (max 20): Target 100+ questions attempted
    const volumeScore = Math.min(20, (progress.attemptedCount / 100) * 20);

    // Consistency / Streak Score (max 10): 7 day streak = 10
    const streakScore = Math.min(10, progress.streakDays * 1.5);

    const totalScore = Math.round(accScore + speedScore + volumeScore + streakScore);

    let status = "Needs Practice";
    let label = "Keep building foundational concepts";
    if (totalScore >= 80) {
      status = "Exam Ready";
      label = "High probability of clearing Clerk Prelims with distinction!";
    } else if (totalScore >= 60) {
      status = "Competitive";
      label = "Good progress; focus on puzzle speed and negative mark reduction.";
    } else if (totalScore >= 40) {
      status = "Improving";
      label = "Accuracy is developing; increase daily mock drills.";
    }

    return {
      score: Math.min(100, totalScore),
      accuracy: Math.round(accuracy),
      avgTime: Math.round(avgTime),
      status,
      label,
      details: { accScore, speedScore, volumeScore, streakScore }
    };
  }

  getWeaknessMatrix() {
    const progress = this.getProgress();
    const topics = this.getTopics();

    return topics.map(t => {
      const stat = progress.topicStats[t.id];
      if (!stat || stat.attempted === 0) {
        return {
          ...t,
          status: 'UNTESTED',
          color: 'gray',
          accuracy: 0,
          attempted: 0,
          avgTime: 0
        };
      }

      const acc = Math.round((stat.correct / stat.attempted) * 100);
      const avgTime = Math.round(stat.totalTimeSec / stat.attempted);

      // Status calibration: Red (< 60% or > 80s for speed topic), Yellow (60-80%), Green (> 80% with good speed)
      let status = 'GREEN';
      let color = 'emerald';
      if (acc < 60) {
        status = 'RED';
        color = 'rose';
      } else if (acc < 80 || (['inequality', 'syllogism', 'alphanumeric'].includes(t.id) && avgTime > 35)) {
        status = 'YELLOW';
        color = 'amber';
      }

      return {
        ...t,
        status,
        color,
        accuracy: acc,
        attempted: stat.attempted,
        avgTime
      };
    });
  }

  // Backup / Export
  exportAllData() {
    return JSON.stringify({
      version: "1.0",
      exportDate: new Date().toISOString(),
      progress: this.getProgress(),
      bookmarks: this.getBookmarks(),
      notes: this.getNotes(),
      mistakes: this.getMistakes(),
      customQuestions: this.getCustomQuestions()
    }, null, 2);
  }

  importAllData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.progress) localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data.progress));
      if (data.bookmarks) localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(data.bookmarks));
      if (data.notes) localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(data.notes));
      if (data.mistakes) localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(data.mistakes));
      if (data.customQuestions) {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(data.customQuestions));
        this.allQuestions = [...this.allQuestions, ...data.customQuestions];
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  resetAllProgress() {
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.MISTAKES);
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
  }
}

export const dataManager = new DataManager();
