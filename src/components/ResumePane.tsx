/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Upload, Trash2, FileText, Download } from 'lucide-react';

interface ResumePaneProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  onLoadSample: () => void;
}

export const ResumePane: React.FC<ResumePaneProps> = ({
  value,
  onChange,
  onClear,
  onLoadSample
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wordCount = (value.match(/\b[a-zA-Z0-9_-]+\b/g) || []).length;
  const charCount = value.length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onChange(content);
      }
    };

    // Read as text
    reader.readAsText(file);
    // Reset file input so same file can be uploaded again if needed
    e.target.value = '';
  };

  const handleDownloadCurrent = () => {
    if (!value) return;
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Pane Header */}
      <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-semibold">
            1
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 leading-tight">
              Your Resume
            </h2>
            <p className="text-xs text-slate-500">
              Paste text or upload file (.txt, .md, .docx text)
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.md,.rtf,.doc,.docx,.pdf"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-md transition-colors"
            title="Upload resume file from device"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {value && (
            <button
              onClick={handleDownloadCurrent}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-md transition-colors"
              title="Download current resume as text"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Download</span>
            </button>
          )}

          <button
            onClick={onLoadSample}
            className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
            title="Load sample resume"
          >
            Sample
          </button>

          {value && (
            <button
              onClick={onClear}
              className="text-xs text-rose-600 hover:text-rose-700 p-1.5 rounded-md hover:bg-rose-50 transition-colors"
              title="Clear resume"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Pane Content / Textarea */}
      <div className="flex-1 relative min-h-[300px] flex flex-col">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Paste your existing resume here or click "Upload"...

Example:
Alex Chen
San Francisco, CA | alex@example.com | (555) 019-2834

PROFESSIONAL SUMMARY
Full-Stack Engineer with 5+ years building scalable web services and cloud applications.

TECHNICAL SKILLS
- JavaScript, TypeScript, React, Node.js, SQL

EXPERIENCE
Software Engineer | TechCorp | 2021 - Present
- Built customer-facing dashboard increasing engagement by 25%.`}
          className="w-full flex-1 p-4 text-xs font-mono text-slate-800 placeholder:text-slate-400 bg-white focus:outline-none focus:bg-slate-50/30 resize-none leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Pane Footer Stats */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="tabular-nums font-mono">
            {wordCount} words
          </span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums font-mono">
            {charCount} chars
          </span>
        </div>
        {wordCount > 0 && wordCount < 150 && (
          <span className="text-amber-600 text-[11px]">
            Tip: 300+ words recommended for ATS parsing
          </span>
        )}
      </div>
    </div>
  );
};
