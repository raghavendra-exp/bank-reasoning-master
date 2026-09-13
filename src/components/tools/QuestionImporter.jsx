import React, { useState } from 'react';
import { Upload, Download, CheckCircle2, AlertCircle, RefreshCw, FileText, Database, Trash2 } from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function QuestionImporter({ isHindi }) {
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [backupStatus, setBackupStatus] = useState(null);

  // Validate pasted JSON
  const handleValidate = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      const errors = [];
      const validQuestions = [];
      const existingIds = new Set(dataManager.getAllQuestions().map(q => q.id));

      items.forEach((item, idx) => {
        const missing = [];
        if (!item.id) missing.push('id');
        if (!item.topic) missing.push('topic');
        if (!item.difficulty) missing.push('difficulty');
        if (!item.question_en && !item.question) missing.push('question_en');
        if (!item.options || !Array.isArray(item.options)) missing.push('options');
        if (item.correct_answer === undefined && item.answer === undefined) missing.push('correct_answer');

        if (missing.length > 0) {
          errors.push(`Item #${idx + 1} is missing required fields: ${missing.join(', ')}`);
        } else if (existingIds.has(item.id)) {
          errors.push(`Duplicate ID detected: "${item.id}" already exists in the question bank.`);
        } else {
          validQuestions.push({
            ...item,
            question_en: item.question_en || item.question,
            correct_answer: item.correct_answer !== undefined ? item.correct_answer : item.answer,
            type: item.type || 'ORIGINAL'
          });
        }
      });

      setValidationResult({
        total: items.length,
        validCount: validQuestions.length,
        errors,
        validQuestions
      });
    } catch (e) {
      setValidationResult({
        total: 0,
        validCount: 0,
        errors: [`Invalid JSON Syntax: ${e.message}`],
        validQuestions: []
      });
    }
  };

  const handleImport = () => {
    if (!validationResult || validationResult.validQuestions.length === 0) return;
    const added = dataManager.addCustomQuestions(validationResult.validQuestions);
    setValidationResult(null);
    setJsonInput('');
    alert(`Successfully imported ${added} questions into your browser question repository!`);
  };

  const handleExportBackup = () => {
    const json = dataManager.exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bank_reasoning_master_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    setBackupStatus('Backup exported successfully!');
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const res = dataManager.importAllData(ev.target.result);
      if (res.success) {
        alert('User progress, bookmarks, notes, and custom questions restored successfully!');
        window.location.reload();
      } else {
        alert(`Failed to restore backup: ${res.error}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 flex items-center gap-1">
                <Database className="w-3.5 h-3.5" />
                Browser Content Manager
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isHindi ? 'प्रश्न आयातक एवं डेटा बैकअप' : 'Question Importer & Local Backup Hub'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isHindi
                ? 'बिना किसी सर्वर के नए प्रश्न जोड़ें (JSON), सत्यापन करें और अपनी अध्ययन प्रगति को एक्सपोर्ट/इम्पोर्ट करें।'
                : 'Serverless question bank extension: paste/upload JSON, validate fields, and backup local study data.'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Question Importer & Backup Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: JSON Question Importer */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-brand-600" />
            <span>{isHindi ? 'नया प्रश्न JSON आयात करें' : 'Import New Questions (Paste JSON)'}</span>
          </h3>

          <textarea
            rows="8"
            value={jsonInput}
            onChange={e => setJsonInput(e.target.value)}
            placeholder={`[
  {
    "id": "REA-SBI-2026-PUZ-9001",
    "exam": ["SBI_CLERK"],
    "topic": "puzzles",
    "difficulty": "MEDIUM",
    "question_en": "Seven persons live on floors...",
    "options": ["Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5"],
    "correct_answer": 2,
    "solution_en": "Step 1: Fix anchor..."
  }
]`}
            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200"
          ></textarea>

          <div className="flex gap-3">
            <button
              onClick={handleValidate}
              disabled={!jsonInput.trim()}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Validate JSON
            </button>
            {validationResult && validationResult.validCount > 0 && (
              <button
                onClick={handleImport}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Import {validationResult.validCount} Valid Questions ✓
              </button>
            )}
          </div>

          {/* Validation Feedback */}
          {validationResult && (
            <div className={`p-4 rounded-xl border text-xs ${
              validationResult.errors.length === 0
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-200'
            }`}>
              <div className="font-bold mb-1">
                Validated {validationResult.total} item(s): {validationResult.validCount} Valid, {validationResult.errors.length} Issue(s).
              </div>
              {validationResult.errors.length > 0 && (
                <ul className="list-disc list-inside space-y-1 mt-2 text-rose-700 dark:text-rose-300">
                  {validationResult.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Progress Backup / Restore */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Progress Backup & Restore</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Move your test progress, bookmarks, mistakes, and readiness scores across browsers or devices.
          </p>

          <button
            onClick={handleExportBackup}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Progress to JSON</span>
          </button>

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Restore from Backup File:
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all local progress? This cannot be undone.')) {
                  dataManager.resetAllProgress();
                  window.location.reload();
                }
              }}
              className="w-full py-2 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition"
            >
              Reset All Progress Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
