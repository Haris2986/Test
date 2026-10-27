/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ResumePane } from './components/ResumePane';
import { JobDescriptionPane } from './components/JobDescriptionPane';
import { AtsScoreCard } from './components/AtsScoreCard';
import { KeywordsList } from './components/KeywordsList';
import { ResumeEditor } from './components/ResumeEditor';
import { SAMPLE_DATA } from './data/samples';
import { analyzeAtsCompatibility } from './utils/atsAnalyzer';
import { parseResumeText, rewriteResumeWithKeywords } from './utils/resumeRewriter';
import { ATSCompatibilityReport, ParsedResume, TemplateType } from './types';
import { ArrowDown, Cpu, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

export default function App() {
  // Preload with the first realistic sample for an instant delightful experience
  const defaultSample = SAMPLE_DATA[0];
  const [resumeText, setResumeText] = useState(defaultSample.resume);
  const [jobText, setJobText] = useState(defaultSample.jobDescription);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [report, setReport] = useState<ATSCompatibilityReport | null>(null);

  // Rewriting state
  const [isRewritten, setIsRewritten] = useState(false);
  const [rewrittenResumeText, setRewrittenResumeText] = useState('');
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [addedKeywords, setAddedKeywords] = useState<string[]>([]);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Run in-memory analysis
  const handleAnalyze = () => {
    if (!resumeText.trim() || !jobText.trim()) {
      showToast('Please provide both your resume and a target job description', 'info');
      return;
    }

    setIsAnalyzing(true);
    // Micro-delay gives instantaneous perceptual feedback without freezing thread
    setTimeout(() => {
      const atsReport = analyzeAtsCompatibility(resumeText, jobText);
      const parsed = parseResumeText(resumeText);

      setReport(atsReport);
      setParsedResume(parsed);
      setRewrittenResumeText(resumeText);
      setHasAnalyzed(true);
      setIsRewritten(false);
      setAddedKeywords([]);
      setIsAnalyzing(false);

      showToast(`Analysis complete: ${atsReport.overallScore}% ATS Compatibility Score`);

      // Scroll smoothly to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 150);
  };

  // Automatically rewrite resume with missing keywords
  const handleRewrite = (template: TemplateType = 'chronological') => {
    if (!report || !parsedResume) return;

    const result = rewriteResumeWithKeywords(
      resumeText,
      report.missingKeywords,
      jobText,
      template
    );

    setRewrittenResumeText(result.rewrittenText);
    setParsedResume(result.parsed);
    setAddedKeywords(result.addedTerms);
    setIsRewritten(true);

    // Recalculate ATS report with the newly tailored resume
    const updatedReport = analyzeAtsCompatibility(result.rewrittenText, jobText);
    setReport(updatedReport);

    showToast(`Resume tailored: score increased to ${updatedReport.overallScore}% with ${result.addedTerms.length} keywords!`);
  };

  // 1-Click Insert a specific keyword from Result Window 1 into Resume
  const handleInsertKeyword = (keyword: string) => {
    let currentText = isRewritten ? rewrittenResumeText : resumeText;

    // Check if there is a skills or technical section to cleanly append
    if (/skills|competencies|technologies/i.test(currentText)) {
      currentText = currentText.replace(/(skills|competencies|technologies)[^\n]*\n/i, (match) => {
        return `${match}- ${keyword}\n`;
      });
    } else {
      currentText += `\n\nCORE SKILLS\n- ${keyword}`;
    }

    if (isRewritten) {
      setRewrittenResumeText(currentText);
    } else {
      setResumeText(currentText);
    }

    const updatedParsed = parseResumeText(currentText);
    setParsedResume(updatedParsed);
    setAddedKeywords(prev => Array.from(new Set([...prev, keyword])));

    // Recalculate ATS compatibility immediately in memory
    const updatedReport = analyzeAtsCompatibility(currentText, jobText);
    setReport(updatedReport);

    showToast(`Added "${keyword}" to skills matrix`);
  };

  // Load a preset sample pair
  const handleLoadSample = (sampleId: string) => {
    const found = SAMPLE_DATA.find(s => s.id === sampleId);
    if (found) {
      setResumeText(found.resume);
      setJobText(found.jobDescription);
      setHasAnalyzed(false);
      setReport(null);
      setIsRewritten(false);
      showToast(`Loaded ${found.role} sample pair`);
    }
  };

  // Reset all
  const handleReset = () => {
    setResumeText('');
    setJobText('');
    setHasAnalyzed(false);
    setReport(null);
    setIsRewritten(false);
    setRewrittenResumeText('');
    setParsedResume(null);
    setAddedKeywords([]);
    showToast('Cleared all inputs and in-memory cache', 'info');
  };

  // Keyboard shortcut: Cmd/Ctrl + Enter to trigger Analyze
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleAnalyze();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resumeText, jobText]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <Header
        onLoadSample={handleLoadSample}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Intro Banner */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              In-Memory ATS Resume Optimizer & Keyword Matcher
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Private, client-side algorithm that scans job descriptions for missing ATS keywords, calculates match compatibility, and rewrites your resume into Chronological, Functional, or Combination templates.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg shrink-0">
            <Cpu className="w-4 h-4 text-slate-700" />
            <div>
              <span className="font-semibold text-slate-800 block">Local Memory Engine</span>
              <span>Zero server latency · Data stays in your browser</span>
            </div>
          </div>
        </section>

        {/* SECTION 1: TWO INPUT PANES */}
        <section id="input-panes-section" className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          {/* Pane 1: Resume */}
          <ResumePane
            value={resumeText}
            onChange={(val) => {
              setResumeText(val);
              if (hasAnalyzed) setHasAnalyzed(false);
            }}
            onClear={() => setResumeText('')}
            onLoadSample={() => handleLoadSample('software-engineer')}
          />

          {/* Pane 2: Job Description */}
          <JobDescriptionPane
            value={jobText}
            onChange={(val) => {
              setJobText(val);
              if (hasAnalyzed) setHasAnalyzed(false);
            }}
            onClear={() => setJobText('')}
            onLoadSample={() => handleLoadSample('software-engineer')}
          />
        </section>

        {/* SECTION 2: ANALYZE ACTION BAR */}
        <section id="action-bar-section" className="flex flex-col items-center justify-center pt-2 pb-4">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !resumeText.trim() || !jobText.trim()}
            className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Scanning In-Memory...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Analyze Both Panes</span>
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </>
            )}
          </button>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
            <span>Press <kbd className="px-1.5 py-0.5 text-[11px] font-mono bg-white border border-slate-200 rounded shadow-xs text-slate-700">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 text-[11px] font-mono bg-white border border-slate-200 rounded shadow-xs text-slate-700">Enter</kbd> to analyze</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safe & Private</span>
            </span>
          </div>
        </section>

        {/* SECTION 3: RESULTS SECTION (APPEARS WHEN ANALYZED) */}
        {hasAnalyzed && report && parsedResume && (
          <div ref={resultsRef} className="space-y-6 pt-4 animate-in fade-in duration-300">
            {/* ATS Score Card & Audit Breakdown */}
            <AtsScoreCard report={report} />

            {/* TWO RESULTS WINDOWS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Result Window 1: Missing Keywords List & Filter (4 cols on large screen) */}
              <div id="results-pane-1" className="lg:col-span-4 h-full">
                <KeywordsList
                  missingKeywords={report.missingKeywords}
                  matchedKeywords={report.matchedKeywords}
                  onInsertKeyword={handleInsertKeyword}
                />
              </div>

              {/* Result Window 2: Tailored Resume Editor & Exporter (8 cols on large screen) */}
              <div id="results-pane-2" className="lg:col-span-8 h-full">
                <ResumeEditor
                  initialText={isRewritten ? rewrittenResumeText : resumeText}
                  parsedResume={parsedResume}
                  addedKeywords={addedKeywords}
                  isRewritten={isRewritten}
                  onRewrite={handleRewrite}
                  onUpdateText={(newText) => {
                    setRewrittenResumeText(newText);
                    const parsed = parseResumeText(newText);
                    setParsedResume(parsed);
                  }}
                  onReanalyze={() => {
                    const updated = analyzeAtsCompatibility(
                      isRewritten ? rewrittenResumeText : resumeText,
                      jobText
                    );
                    setReport(updated);
                    showToast(`Updated ATS compatibility score: ${updated.overallScore}%`);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Toast Feedback */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>ATS Resume Studio · In-Memory Document Processing Engine</span>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Runs locally in browser</span>
            <span aria-hidden="true">·</span>
            <span>Exports to Word (.docx) & PDF</span>
            <span aria-hidden="true">·</span>
            <span>Zero tracking</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
