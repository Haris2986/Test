/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, RotateCcw, FileText } from 'lucide-react';
import { SAMPLE_DATA } from '../data/samples';

interface HeaderProps {
  onLoadSample: (sampleId: string) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoadSample, onReset }) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
              ATS Resume Studio
            </span>
            <span className="text-xs text-slate-500 hidden sm:block">
              In-Memory Keyword Matcher & Optimizer
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation & Preset Samples */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <div className="hidden lg:flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% In-Memory Processing · No Cloud Storage</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 hidden md:inline">Sample:</span>
            <select
              aria-label="Load Sample Role"
              onChange={(e) => {
                if (e.target.value) {
                  onLoadSample(e.target.value);
                  e.target.value = '';
                }
              }}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-md py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>Load Demo Role...</option>
              {SAMPLE_DATA.map(s => (
                <option key={s.id} value={s.id}>{s.role}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Zone 3: Primary Utility Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded-md hover:bg-slate-100 transition-colors"
            title="Reset all inputs and clear memory"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        </div>
      </div>
    </header>
  );
};
