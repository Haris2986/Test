/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AccentColor, FontFamily, FontSize, ParsedResume, TemplateType } from '../types';

interface TemplateViewsProps {
  resume: ParsedResume;
  template: TemplateType;
  fontFamily: FontFamily;
  fontSize: FontSize;
  accentColor: AccentColor;
  highlightAddedKeywords: boolean;
  addedKeywords: string[];
}

export const TemplateViews: React.FC<TemplateViewsProps> = ({
  resume,
  template,
  fontFamily,
  fontSize,
  accentColor,
  highlightAddedKeywords,
  addedKeywords
}) => {
  // Font family class
  const getFontFamilyClass = (f: FontFamily) => {
    switch (f) {
      case 'serif': return 'font-serif-resume';
      case 'modern': return 'font-modern-resume';
      case 'mono': return 'font-mono-resume';
      default: return 'font-sans-resume';
    }
  };

  // Font size classes
  const getSizeStyles = (s: FontSize) => {
    switch (s) {
      case 'compact':
        return {
          container: 'text-[12px] leading-relaxed',
          name: 'text-2xl',
          heading: 'text-xs tracking-wider',
          subheading: 'text-[13px]',
          body: 'text-[12px]',
          gap: 'space-y-4'
        };
      case 'spacious':
        return {
          container: 'text-[15px] leading-relaxed',
          name: 'text-3xl',
          heading: 'text-sm tracking-wider',
          subheading: 'text-[15px]',
          body: 'text-[14px]',
          gap: 'space-y-6'
        };
      default: // standard
        return {
          container: 'text-[13px] leading-relaxed',
          name: 'text-2xl',
          heading: 'text-xs tracking-wider',
          subheading: 'text-[14px]',
          body: 'text-[13px]',
          gap: 'space-y-5'
        };
    }
  };

  // Accent color styles
  const getAccentColors = (c: AccentColor) => {
    switch (c) {
      case 'navy':
        return {
          heading: 'text-blue-900 border-blue-900',
          title: 'text-blue-950',
          badge: 'text-blue-800'
        };
      case 'emerald':
        return {
          heading: 'text-emerald-800 border-emerald-800',
          title: 'text-emerald-950',
          badge: 'text-emerald-800'
        };
      case 'indigo':
        return {
          heading: 'text-indigo-800 border-indigo-800',
          title: 'text-indigo-950',
          badge: 'text-indigo-800'
        };
      case 'charcoal':
        return {
          heading: 'text-zinc-800 border-zinc-800',
          title: 'text-zinc-950',
          badge: 'text-zinc-800'
        };
      default: // slate
        return {
          heading: 'text-slate-900 border-slate-900',
          title: 'text-slate-950',
          badge: 'text-slate-800'
        };
    }
  };

  const sizes = getSizeStyles(fontSize);
  const colors = getAccentColors(accentColor);
  const fontClass = getFontFamilyClass(fontFamily);

  // Helper to highlight added keywords if enabled
  const renderHighlightedText = (text: string) => {
    if (!highlightAddedKeywords || !addedKeywords || addedKeywords.length === 0) {
      return text;
    }

    const regex = new RegExp(`\\b(${addedKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const isMatch = addedKeywords.some(k => k.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <mark key={i} className="bg-amber-100/90 text-amber-900 px-1 py-0.5 rounded font-medium">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  const contactItems = [
    resume.contact.location,
    resume.contact.phone,
    resume.contact.email,
    resume.contact.linkedin,
    resume.contact.github,
    resume.contact.website
  ].filter(Boolean);

  return (
    <div
      id="printable-resume-container"
      className={`bg-white text-slate-800 p-8 sm:p-10 shadow-xs border border-slate-200 rounded-lg max-w-[850px] mx-auto ${fontClass} ${sizes.container}`}
    >
      {/* 1. Header Area */}
      <header className="border-b border-slate-200 pb-5 mb-5 text-center">
        <h1 className={`${sizes.name} font-bold tracking-tight ${colors.title}`}>
          {resume.fullName}
        </h1>
        {resume.headline && (
          <p className="text-slate-600 font-medium mt-1">
            {renderHighlightedText(resume.headline)}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-slate-500 mt-2 text-xs">
          {contactItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <span>{item}</span>
              {idx < contactItems.length - 1 && <span aria-hidden="true">·</span>}
            </React.Fragment>
          ))}
        </div>
      </header>

      <div className={sizes.gap}>
        {/* 2. Professional Summary */}
        {resume.summary && (
          <section>
            <h2 className={`${sizes.heading} font-bold uppercase pb-1 border-b ${colors.heading} mb-2.5`}>
              Professional Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify">
              {renderHighlightedText(resume.summary)}
            </p>
          </section>
        )}

        {/* 3. Main Sections Depending on Template */}
        {template === 'chronological' && (
          <>
            {/* Skills */}
            {resume.skills.length > 0 && (
              <section>
                <h2 className={`${sizes.heading} font-bold uppercase pb-1 border-b ${colors.heading} mb-2.5`}>
                  Technical Proficiencies & Core Competencies
                </h2>
                <div className="space-y-1.5">
                  {resume.skills.map((grp, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-semibold text-slate-900 shrink-0 min-w-[140px]">
                        {grp.category}:
                      </span>
                      <span className="text-slate-700">
                        {renderHighlightedText(grp.items.join(', '))}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experience */}
            {resume.experience.length > 0 && (
              <section>
                <h2 className={`${sizes.heading} font-bold uppercase pb-1 border-b ${colors.heading} mb-3`}>
                  Professional Experience
                </h2>
                <div className="space-y-4">
                  {resume.experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-slate-900 mb-1">
                        <span className={sizes.subheading}>{exp.title} · <span className="text-slate-600 font-normal">{exp.company}</span></span>
                        <span className="text-xs text-slate-500 font-normal font-mono">{exp.period}</span>
                      </div>
                      <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="leading-relaxed">
                            {renderHighlightedText(b)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {template === 'functional' && (
          <>
            {/* Functional Competencies Pillars */}
            <section>
              <h2 className={`${sizes.heading} font-bold uppercase pb-1 border-b ${colors.heading} mb-3`}>
                Areas of Expertise & Major Achievements
              </h2>
              <div className="space-y-4">
                {(resume.functionalCompetencies || []).map((comp, idx) => (
                  <div key={idx}>
                    <h3 className="font-bold text-slate-900 mb-1">
                      {comp.competency}
                    </h3>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700">
                      {comp.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {renderHighlightedText(b)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            {resume.skills.length > 0 && (
              <section>
                <h2 className={`${sizes.heading} font-bold uppercase pb-1 border-b ${colors.heading} mb-2.5`}>
                  Technical Skills & Tooling
                </h2>
                <div className="space-y-1.5">
                  {resume.skills.map((grp, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-semibold text-slate-900 shrink-0 min-w-[140px]">
                        {grp.category}:
                      </span>
                      <span className="text-slate-700">
                        {renderHighlightedText(grp.items.join(', '))}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Concise Work History */}
            {resume.experience.length > 0 && (
              <section>
                <h2 className={`${sizes.heading} font-bold uppercase pb-1 border-b ${colors.heading} mb-2.5`}>
                  Employment History
                </h2>
                <div className="space-y-1.5">
                  {resume.experience.map((exp, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-700">
                      <span><strong className="text-slate-900">{exp.title}</strong> — {exp.company}</span>
                      <span className="text-xs text-slate-500 font-mono">{exp.period}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {template === 'combination' && (
          <>
            {/* Categorized Skills Matrix */}
            {resume.skills.length > 0 && (
              <section>
                <h2 className={`${sizes.heading} font-bold uppercase pb-1 border-b ${colors.heading} mb-3`}>
                  Core Skills & Leadership Matrix
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {resume.skills.map((grp, idx) => (
                    <div key={idx} className="p-3 bg-slate-50/70 border border-slate-100 rounded-md">
                      <span className="text-xs font-bold text-slate-900 block mb-1">
                        {grp.category}
                      </span>
                      <p className="text-slate-700 text-xs leading-relaxed">
                        {renderHighlightedText(grp.items.join(' · '))}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experience with Key Outcomes */}
            {resume.experience.length > 0 && (
              <section>
                <h2 className={`${sizes.heading} font-bold uppercase pb-1 border-b ${colors.heading} mb-3`}>
                  Professional Experience & Key Deliverables
                </h2>
                <div className="space-y-4">
                  {resume.experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-slate-900 mb-1">
                        <span className={sizes.subheading}>{exp.title} · <span className="text-slate-600 font-normal">{exp.company}</span></span>
                        <span className="text-xs text-slate-500 font-normal font-mono">{exp.period}</span>
                      </div>
                      <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="leading-relaxed">
                            {renderHighlightedText(b)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* 4. Education */}
        {resume.education.length > 0 && (
          <section>
            <h2 className={`${sizes.heading} font-bold uppercase pb-1 border-b ${colors.heading} mb-2.5`}>
              Education
            </h2>
            <div className="space-y-1.5">
              {resume.education.map((edu, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-700">
                  <span><strong className="text-slate-900">{edu.degree}</strong> · {edu.school}</span>
                  <span className="text-xs text-slate-500 font-mono">{edu.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Certifications */}
        {resume.certifications.length > 0 && (
          <section>
            <h2 className={`${sizes.heading} font-bold uppercase pb-1 border-b ${colors.heading} mb-2.5`}>
              Certifications & Credentials
            </h2>
            <div className="flex flex-wrap gap-2 text-slate-700">
              {resume.certifications.map((cert, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded text-xs font-medium">
                  {renderHighlightedText(cert)}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
