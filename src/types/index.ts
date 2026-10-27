/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type KeywordCategory = 
  | 'technical'
  | 'tools'
  | 'soft_skills'
  | 'certifications'
  | 'action_verbs'
  | 'domain';

export type KeywordImportance = 'critical' | 'recommended' | 'optional';

export interface KeywordItem {
  term: string;
  category: KeywordCategory;
  countInJob: number;
  countInResume: number;
  isMatched: boolean;
  importance: KeywordImportance;
  contextSnippet?: string;
}

export interface RecommendationItem {
  id: string;
  category: 'keyword' | 'metric' | 'action_verb' | 'formatting' | 'section';
  title: string;
  detail: string;
  impact: 'high' | 'medium' | 'low';
  type: 'strength' | 'weakness';
}

export interface ATSCompatibilityReport {
  overallScore: number;
  keywordScore: number;
  sectionsScore: number;
  metricsScore: number;
  actionVerbsScore: number;
  readabilityScore: number;
  matchedKeywords: KeywordItem[];
  missingKeywords: KeywordItem[];
  allExtractedKeywords: KeywordItem[];
  strengths: string[];
  weaknesses: string[];
  recommendations: RecommendationItem[];
  wordCountResume: number;
  wordCountJob: number;
  readingTimeMinutes: number;
  detectedSections: {
    contactInfo: boolean;
    summary: boolean;
    experience: boolean;
    skills: boolean;
    education: boolean;
  };
}

export type TemplateType = 'chronological' | 'functional' | 'combination';

export type FontFamily = 'sans' | 'serif' | 'modern' | 'mono';
export type FontSize = 'compact' | 'standard' | 'spacious';
export type AccentColor = 'slate' | 'navy' | 'emerald' | 'indigo' | 'charcoal';

export interface FormattingOptions {
  fontFamily: FontFamily;
  fontSize: FontSize;
  accentColor: AccentColor;
  showBulletIcons: boolean;
  highlightAddedKeywords: boolean;
}

export interface ParsedResume {
  fullName: string;
  headline: string;
  contact: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary: string;
  skills: {
    category: string;
    items: string[];
  }[];
  experience: {
    title: string;
    company: string;
    period: string;
    location?: string;
    bullets: string[];
  }[];
  functionalCompetencies?: {
    competency: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
    honors?: string;
  }[];
  certifications: string[];
  projects?: {
    name: string;
    description: string;
    bullets: string[];
  }[];
  rawText: string;
}
