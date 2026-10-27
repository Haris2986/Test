/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AccentColor, FontFamily, FontSize, ParsedResume, TemplateType } from '../types';
import { TemplateViews } from './TemplateViews';
import { generateDocxBlob } from '../utils/docxExport';
import { 
  Download, 
  Copy, 
  Sparkles, 
  Eye, 
  Edit3, 
  Check, 
  Printer, 
  Type, 
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

interface ResumeEditorProps {
  initialText: string;
  parsedResume: ParsedResume;
  addedKeywords: string[];
  isRewritten: boolean;
  onRewrite: (template: TemplateType) => void;
  onUpdateText: (newText: string) => void;
  onReanalyze: () => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  initialText,
  parsedResume,
  addedKeywords,
  isRewritten,
  onRewrite,
  onUpdateText,
  onReanalyze
}) => {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('chronological');
  const [viewMode, setViewMode] = useState<'preview' | 'editor'>('preview');
  const [fontFamily, setFontFamily] = useState<FontFamily>('sans');
  const [fontSize, setFontSize] = useState<FontSize>('standard');
  const [accentColor, setAccentColor] = useState<AccentColor>('navy');
  const [highlightAdded, setHighlightAdded] = useState(true);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFormatBar, setShowFormatBar] = useState(false);

  // Template switch handler
  const handleTemplateChange = (tpl: TemplateType) => {
    setActiveTemplate(tpl);
    if (isRewritten) {
      onRewrite(tpl);
    }
  };

  // Export to Word (.docx)
  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      const blob = await generateDocxBlob(
        parsedResume,
        activeTemplate,
        fontFamily,
        fontSize,
        accentColor
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${parsedResume.fullName.replace(/\s+/g, '_')}_Resume_ATS_Optimized.docx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate docx:', err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  // Export to PDF via native print
  const handlePrintPdf = () => {
    window.print();
  };

  // Export as Plain Text
  const handleDownloadTxt = () => {
    const blob = new Blob([initialText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${parsedResume.fullName.replace(/\s+/g, '_')}_Resume_ATS.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(initialText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col h-full">
      {/* Top Action & Rewrite Banner */}
      <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">
              {isRewritten ? 'ATS-Optimized Resume Ready' : 'Ready to Optimize'}
            </h3>
            <p className="text-xs text-slate-300">
              {isRewritten 
                ? `Injected ${addedKeywords.length} missing keywords and power verbs into your profile`
                : 'Click rewrite to automatically infuse all missing ATS terms'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onRewrite(activeTemplate)}
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-xs shadow-sm transition-all shrink-0 active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isRewritten ? 'Re-Rewrite Resume' : 'Rewrite Resume with Keywords'}</span>
        </button>
      </div>

      {/* Control Bar: Templates, Formatting, Views & Exports */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Template Switcher (3 templates) */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium hidden md:inline">Template:</span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-200/80 rounded-lg">
            <button
              onClick={() => handleTemplateChange('chronological')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTemplate === 'chronological'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chronological
            </button>
            <button
              onClick={() => handleTemplateChange('functional')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTemplate === 'functional'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Functional
            </button>
            <button
              onClick={() => handleTemplateChange('combination')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTemplate === 'combination'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Combination
            </button>
          </div>
        </div>

        {/* View mode toggle (Preview vs Text Editor) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-0.5 bg-slate-200/80 rounded-lg">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'preview'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'editor'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Text</span>
            </button>
          </div>

          <button
            onClick={() => setShowFormatBar(!showFormatBar)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-slate-700 hover:text-slate-900 transition-colors ${
              showFormatBar ? 'bg-slate-200 border-slate-300 font-medium' : 'bg-white border-slate-200'
            }`}
            title="Toggle typography and formatting options"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Format</span>
          </button>
        </div>

        {/* Export / Download Buttons */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1.5 rounded-md transition-colors font-medium"
            title="Download formatted Microsoft Word document (.docx)"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Word (.docx)</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1.5 rounded-md transition-colors font-medium"
            title="Print or Save to PDF"
          >
            <Printer className="w-3.5 h-3.5 text-rose-600" />
            <span>PDF</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1.5 rounded-md transition-colors"
            title="Copy entire resume text to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Format Bar: Font, Size, Color, Keyword Highlighter */}
      {showFormatBar && (
        <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center gap-4 text-xs animate-in fade-in duration-150">
          {/* Font Selection */}
          <div className="flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-600">Font:</span>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value as FontFamily)}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none"
            >
              <option value="sans">Clean Sans (Jakarta)</option>
              <option value="serif">Classic Serif (Merriweather)</option>
              <option value="modern">Modern Sans (Outfit)</option>
              <option value="mono">Tech Monospace (JetBrains)</option>
            </select>
          </div>

          {/* Font Size Adjustment */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600">Size:</span>
            <div className="flex items-center gap-1 bg-white p-0.5 border border-slate-300 rounded">
              <button
                onClick={() => setFontSize('compact')}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  fontSize === 'compact' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                10pt (Compact)
              </button>
              <button
                onClick={() => setFontSize('standard')}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  fontSize === 'standard' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                11pt (Standard)
              </button>
              <button
                onClick={() => setFontSize('spacious')}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  fontSize === 'spacious' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                12pt (Spacious)
              </button>
            </div>
          </div>

          {/* Accent Color Selection */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600">Accent:</span>
            <div className="flex items-center gap-1">
              {(['navy', 'slate', 'emerald', 'indigo', 'charcoal'] as AccentColor[]).map((col) => {
                const bgMap: Record<AccentColor, string> = {
                  navy: 'bg-blue-900',
                  slate: 'bg-slate-800',
                  emerald: 'bg-emerald-800',
                  indigo: 'bg-indigo-800',
                  charcoal: 'bg-zinc-800'
                };
                return (
                  <button
                    key={col}
                    onClick={() => setAccentColor(col)}
                    className={`w-4 h-4 rounded-full ${bgMap[col]} transition-transform ${
                      accentColor === col ? 'ring-2 ring-offset-1 ring-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={`Accent: ${col}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Highlight Added Keywords Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer ml-auto text-slate-700">
            <input
              type="checkbox"
              checked={highlightAdded}
              onChange={(e) => setHighlightAdded(e.target.checked)}
              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-3.5 h-3.5"
            />
            <span>Highlight Added Keywords</span>
          </label>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-100/50 p-4 sm:p-6 min-h-[460px]">
        {viewMode === 'preview' ? (
          <div>
            <TemplateViews
              resume={parsedResume}
              template={activeTemplate}
              fontFamily={fontFamily}
              fontSize={fontSize}
              accentColor={accentColor}
              highlightAddedKeywords={highlightAdded}
              addedKeywords={addedKeywords}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs text-slate-500">
              <span>Interactive Text / Markdown Editor · Edit any section directly</span>
              <button
                onClick={onReanalyze}
                className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-medium px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                title="Recalculate ATS compatibility score with your edits"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Update ATS Score</span>
              </button>
            </div>
            <textarea
              value={initialText}
              onChange={(e) => onUpdateText(e.target.value)}
              className="flex-1 w-full min-h-[400px] text-xs font-mono text-slate-800 placeholder:text-slate-400 bg-white focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="font-mono tabular-nums">
            {(initialText.match(/\b[a-zA-Z0-9_-]+\b/g) || []).length} words
          </span>
          <span aria-hidden="true">·</span>
          <span>Template: <strong className="text-slate-800 capitalize">{activeTemplate}</strong></span>
          {isRewritten && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">✓ Keywords Tailored</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadTxt}
            className="text-slate-600 hover:text-slate-900 underline"
          >
            Download .txt
          </button>
        </div>
      </div>
    </div>
  );
};
