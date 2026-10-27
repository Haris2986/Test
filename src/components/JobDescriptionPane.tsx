/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Globe, Trash2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface JobDescriptionPaneProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  onLoadSample: () => void;
}

export const JobDescriptionPane: React.FC<JobDescriptionPaneProps> = ({
  value,
  onChange,
  onClear,
  onLoadSample
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const wordCount = (value.match(/\b[a-zA-Z0-9_-]+\b/g) || []).length;
  const charCount = value.length;

  const handleFetchUrl = async () => {
    const trimmedUrl = urlInput.trim();
    if (!trimmedUrl) return;

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      setUrlError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setUrlError(null);
    setIsFetchingUrl(true);

    try {
      // Try fetching directly first
      const res = await fetch(trimmedUrl, { mode: 'cors' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const text = await res.text();
      
      // Basic HTML text extraction
      const doc = new DOMParser().parseFromString(text, 'text/html');
      // Remove scripts, styles, nav, footer
      doc.querySelectorAll('script, style, nav, footer, header').forEach(el => el.remove());
      const cleanText = doc.body.innerText.replace(/\s+/g, ' ').trim();
      
      if (cleanText.length > 100) {
        onChange(cleanText);
        setUrlInput('');
      } else {
        throw new Error('Not enough text content found');
      }
    } catch (err) {
      console.warn('Direct fetch failed due to CORS or network:', err);
      // Helpful explanation for CORS
      setUrlError('Job sites (LinkedIn, Indeed, Workday) enforce browser CORS protections. Please copy & paste the job posting directly into the box below.');
    } finally {
      setIsFetchingUrl(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Pane Header */}
      <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-semibold">
            2
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 leading-tight">
              Target Job Description
            </h2>
            <p className="text-xs text-slate-500">
              Paste job text or extract from a job posting URL
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onLoadSample}
            className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
            title="Load sample target job"
          >
            Sample
          </button>

          {value && (
            <button
              onClick={onClear}
              className="text-xs text-rose-600 hover:text-rose-700 p-1.5 rounded-md hover:bg-rose-50 transition-colors"
              title="Clear job description"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* URL Extractor Bar */}
      <div className="px-3.5 py-2.5 bg-slate-100/70 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                if (urlError) setUrlError(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchUrl()}
              placeholder="Paste job posting URL (e.g., https://company.com/careers/role)..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
          <button
            onClick={handleFetchUrl}
            disabled={isFetchingUrl || !urlInput.trim()}
            className="flex items-center gap-1 text-xs font-medium bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-slate-800 disabled:opacity-40 transition-colors shrink-0"
          >
            {isFetchingUrl ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Fetching...</span>
              </>
            ) : (
              <>
                <span>Fetch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {urlError && (
          <div className="mt-2 flex items-start gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200/80 p-2 rounded-md">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>{urlError}</span>
          </div>
        )}
      </div>

      {/* Textarea */}
      <div className="flex-1 relative min-h-[300px] flex flex-col">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Paste the full job posting requirements, responsibilities, and required qualifications here...

Example:
Role: Senior Cloud Infrastructure Engineer
Company: CloudScale
Requirements:
- 5+ years with Kubernetes, Docker, and AWS (EKS, EC2, S3)
- Proven experience with Terraform (Infrastructure as Code)
- Expertise building automated CI/CD pipelines with GitHub Actions
- Strong background in microservices and distributed systems`}
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
        {wordCount > 0 && (
          <span className="text-slate-600">
            ATS Scanner Ready
          </span>
        )}
      </div>
    </div>
  );
};
