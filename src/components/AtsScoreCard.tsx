/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ATSCompatibilityReport } from '../types';
import { CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, Layers, TrendingUp, Zap, FileCheck } from 'lucide-react';

interface AtsScoreCardProps {
  report: ATSCompatibilityReport;
}

export const AtsScoreCard: React.FC<AtsScoreCardProps> = ({ report }) => {
  const [showDetails, setShowDetails] = useState(true);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Exceptional ATS Match';
    if (score >= 70) return 'Strong ATS Alignment';
    if (score >= 50) return 'Moderate ATS Match';
    return 'Low ATS Compatibility';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* Top Score Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            {/* Circular progress representation */}
            <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border ${getScoreColor(report.overallScore)}`}>
              <span className="text-2xl font-bold font-mono tabular-nums leading-none">
                {report.overallScore}%
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider mt-1 opacity-80">
                ATS Score
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {getScoreLabel(report.overallScore)}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Matched {report.matchedKeywords.length} of {report.allExtractedKeywords.length} target job terms · {report.missingKeywords.length} keywords missing
            </p>
          </div>
        </div>

        {/* Micro Score Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Keywords</span>
            </div>
            <span className="text-sm font-bold font-mono tabular-nums text-slate-900 mt-1 block">
              {report.keywordScore}%
            </span>
          </div>

          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
              <span>Metrics & $</span>
            </div>
            <span className="text-sm font-bold font-mono tabular-nums text-slate-900 mt-1 block">
              {report.metricsScore}%
            </span>
          </div>

          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <Zap className="w-3.5 h-3.5 text-slate-400" />
              <span>Action Verbs</span>
            </div>
            <span className="text-sm font-bold font-mono tabular-nums text-slate-900 mt-1 block">
              {report.actionVerbsScore}%
            </span>
          </div>

          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <FileCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Sections</span>
            </div>
            <span className="text-sm font-bold font-mono tabular-nums text-slate-900 mt-1 block">
              {report.sectionsScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses Breakdown */}
      <div className="pt-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-900 py-1"
        >
          <span>ATS Optimization Audit: Strengths & Weaknesses</span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {/* Strengths Column */}
            <div className="bg-emerald-50/40 border border-emerald-100 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-semibold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Strong Areas ({report.strengths.length})</span>
              </div>
              <ul className="space-y-1.5">
                {report.strengths.length > 0 ? (
                  report.strengths.map((str, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      <span>{str}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-500 italic">No major strengths detected.</li>
                )}
              </ul>
            </div>

            {/* Weaknesses Column */}
            <div className="bg-amber-50/40 border border-amber-100 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-amber-800 text-xs font-semibold mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Areas to Improve ({report.weaknesses.length})</span>
              </div>
              <ul className="space-y-1.5">
                {report.weaknesses.length > 0 ? (
                  report.weaknesses.map((weak, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold mt-0.5">•</span>
                      <span>{weak}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-emerald-700">All key ATS criteria are satisfied!</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
