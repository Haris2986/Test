/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { KeywordItem, KeywordCategory } from '../types';
import { Search, Plus, Check, Filter } from 'lucide-react';

interface KeywordsListProps {
  missingKeywords: KeywordItem[];
  matchedKeywords: KeywordItem[];
  onInsertKeyword: (keyword: string) => void;
}

export const KeywordsList: React.FC<KeywordsListProps> = ({
  missingKeywords,
  matchedKeywords,
  onInsertKeyword
}) => {
  const [activeTab, setActiveTab] = useState<'missing' | 'matched' | 'critical' | 'technical' | 'soft_skills'>('missing');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyAdded, setRecentlyAdded] = useState<Record<string, boolean>>({});

  const handleAdd = (term: string) => {
    onInsertKeyword(term);
    setRecentlyAdded(prev => ({ ...prev, [term]: true }));
    setTimeout(() => {
      setRecentlyAdded(prev => ({ ...prev, [term]: false }));
    }, 2000);
  };

  // Filter items
  let displayList: KeywordItem[] = [];
  if (activeTab === 'missing') {
    displayList = missingKeywords;
  } else if (activeTab === 'matched') {
    displayList = matchedKeywords;
  } else if (activeTab === 'critical') {
    displayList = missingKeywords.filter(k => k.importance === 'critical');
  } else if (activeTab === 'technical') {
    displayList = missingKeywords.filter(k => k.category === 'technical' || k.category === 'tools');
  } else if (activeTab === 'soft_skills') {
    displayList = missingKeywords.filter(k => k.category === 'soft_skills');
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayList = displayList.filter(k => k.term.toLowerCase().includes(q));
  }

  const getCategoryLabel = (cat: KeywordCategory) => {
    switch (cat) {
      case 'technical': return 'Hard Skill';
      case 'tools': return 'Tool/Platform';
      case 'soft_skills': return 'Leadership/Soft';
      case 'certifications': return 'Certification';
      case 'action_verbs': return 'Action Verb';
      default: return 'Domain Keyword';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">
              !
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Missing Keywords & ATS Scan
              </h3>
              <p className="text-xs text-slate-500">
                {missingKeywords.length} missing keywords found in job posting
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs (Interactive segmented control) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('missing')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'missing'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Missing ({missingKeywords.length})
          </button>
          <button
            onClick={() => setActiveTab('critical')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'critical'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Critical Gaps ({missingKeywords.filter(k => k.importance === 'critical').length})
          </button>
          <button
            onClick={() => setActiveTab('technical')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'technical'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tech & Tools
          </button>
          <button
            onClick={() => setActiveTab('soft_skills')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'soft_skills'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Soft Skills
          </button>
          <button
            onClick={() => setActiveTab('matched')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'matched'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Matched ({matchedKeywords.length})
          </button>
        </div>

        {/* Search */}
        <div className="mt-2.5 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords or tools..."
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Keywords List Body */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[460px]">
        {displayList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No keywords found matching this filter.
          </div>
        ) : (
          displayList.map((item) => {
            const isAdded = recentlyAdded[item.term];
            return (
              <div
                key={item.term}
                className="p-3 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 truncate">
                      {item.term}
                    </span>
                    <span className="text-[11px] text-slate-400">·</span>
                    <span className="text-[11px] text-slate-500">
                      {getCategoryLabel(item.category)}
                    </span>
                    {item.importance === 'critical' && (
                      <>
                        <span className="text-[11px] text-slate-400">·</span>
                        <span className="text-[11px] font-semibold text-rose-600">
                          High Priority
                        </span>
                      </>
                    )}
                  </div>

                  {item.contextSnippet && (
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      JD Context: {item.contextSnippet}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 tabular-nums font-mono">
                    <span>Job mentions: {item.countInJob}</span>
                    <span>·</span>
                    <span>Resume: {item.countInResume}</span>
                  </div>
                </div>

                {!item.isMatched && (
                  <button
                    onClick={() => handleAdd(item.term)}
                    disabled={isAdded}
                    className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-md border transition-all shrink-0 ${
                      isAdded
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                    title="Insert this keyword directly into the Resume Editor"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Insert</span>
                      </>
                    )}
                  </button>
                )}

                {item.isMatched && (
                  <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-medium shrink-0">
                    <Check className="w-3.5 h-3.5" />
                    <span>Included</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Click "Insert" to add any keyword to your active resume</span>
        <span className="font-mono tabular-nums">{displayList.length} items</span>
      </div>
    </div>
  );
};
