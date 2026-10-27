/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ATSCompatibilityReport, KeywordCategory, KeywordImportance, KeywordItem, RecommendationItem } from '../types';

// Curated comprehensive dictionaries of high-value ATS terms
const TECHNICAL_TERMS = new Set([
  'react', 'react.js', 'vue', 'vue.js', 'angular', 'svelte', 'next.js', 'nuxt',
  'node.js', 'nodejs', 'express', 'nestjs', 'fastapi', 'flask', 'django', 'spring boot',
  'typescript', 'javascript', 'python', 'java', 'c++', 'c#', '.net', 'golang', 'go', 'rust', 'ruby', 'php', 'scala', 'kotlin', 'swift',
  'sql', 'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'snowflake', 'bigquery', 'dynamodb', 'elasticsearch', 'cassandra',
  'graphql', 'rest api', 'restful', 'grpc', 'microservices', 'distributed systems', 'system design',
  'aws', 'amazon web services', 'gcp', 'google cloud', 'azure', 'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'helm',
  'ci/cd', 'github actions', 'gitlab ci', 'jenkins', 'argo cd', 'argocd',
  'linux', 'unix', 'bash', 'powershell', 'git',
  'machine learning', 'deep learning', 'nlp', 'llm', 'large language models', 'generative ai', 'pytorch', 'tensorflow', 'scikit-learn', 'rag', 'vector database', 'pandas', 'numpy',
  'cybersecurity', 'iam', 'soc2', 'penetration testing', 'zero trust', 'oauth', 'jwt',
  'tdd', 'unit testing', 'jest', 'cypress', 'playwright', 'selenium', 'mocking',
  'data pipelines', 'etl', 'spark', 'kafka', 'airflow', 'dbt', 'hadoop'
]);

const TOOLS_TERMS = new Set([
  'jira', 'confluence', 'trello', 'asana', 'notion', 'linear',
  'figma', 'sketch', 'adobe xd', 'miro', 'invision',
  'datadog', 'prometheus', 'grafana', 'splunk', 'sentry', 'new relic', 'cloudwatch',
  'postman', 'swagger', 'insomnia', 'docker desktop',
  'mixpanel', 'amplitude', 'google analytics', 'segment', 'optimizely',
  'tableau', 'power bi', 'looker', 'excel'
]);

const SOFT_SKILLS_TERMS = new Set([
  'leadership', 'mentoring', 'team management', 'cross-functional collaboration',
  'stakeholder management', 'communication', 'problem-solving', 'strategic planning',
  'agile', 'scrum', 'kanban', 'sprint planning', 'backlog grooming',
  'ownership', 'negotiation', 'critical thinking', 'conflict resolution',
  'roadmapping', 'prioritization', 'customer empathy', 'analytical skills'
]);

const CERTIFICATIONS_TERMS = new Set([
  'aws certified', 'solutions architect', 'cka', 'ckad', 'pmp', 'scrum master',
  'cissp', 'cisa', 'comptia', 'azure fundamentals', 'gcp certified', 'prince2',
  'itil', 'six sigma', 'cpa', 'cfa'
]);

const ACTION_VERBS = new Set([
  'spearheaded', 'architected', 'engineered', 'optimized', 'accelerated', 'deployed',
  'formulated', 'streamlined', 'delivered', 'generated', 'automated', 'orchestrated',
  'championed', 'revamped', 'scaled', 'increased', 'decreased', 'reduced', 'mentored',
  'directed', 'executed', 'established', 'negotiated', 'transformed', 'pioneered',
  'designed', 'implemented', 'launched', 'expanded', 'consolidated'
]);

// Common English stopwords to ignore in phrase extraction
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
  'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
  'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t',
  'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves',
  'job', 'title', 'role', 'responsibilities', 'qualifications', 'requirements', 'years', 'experience', 'company', 'work', 'working',
  'team', 'candidate', 'apply', 'equal', 'opportunity', 'benefits', 'salary', 'position', 'location', 'preferred', 'must', 'plus',
  'ability', 'skills', 'ideal', 'looking', 'join', 'offer', 'provide', 'include', 'including'
]);

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[\r\n]+/g, ' ');
}

function countOccurrences(text: string, term: string): number {
  if (!term || term.length < 2) return 0;
  // Escape regex special chars
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match word boundary or boundary-like transitions
  const regex = new RegExp(`(^|[^a-zA-Z0-9+#.-])${escaped}([^a-zA-Z0-9+#.-]|$)`, 'gi');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

function extractSnippets(text: string, term: string): string {
  const normalized = text.toLowerCase();
  const idx = normalized.indexOf(term.toLowerCase());
  if (idx === -1) return '';
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + term.length + 50);
  let snippet = text.slice(start, end).replace(/[\r\n]+/g, ' ').trim();
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';
  return snippet;
}

export function analyzeAtsCompatibility(resumeText: string, jobText: string): ATSCompatibilityReport {
  const normResume = normalizeText(resumeText);
  const normJob = normalizeText(jobText);

  const wordCountResume = (resumeText.match(/\b[a-zA-Z0-9_-]+\b/g) || []).length;
  const wordCountJob = (jobText.match(/\b[a-zA-Z0-9_-]+\b/g) || []).length;
  const readingTimeMinutes = Math.max(1, Math.round(wordCountResume / 200));

  // 1. Detect candidate keywords from Job Description
  const candidateMap = new Map<string, { category: KeywordCategory; count: number }>();

  // Check known dictionaries first
  TECHNICAL_TERMS.forEach(term => {
    const count = countOccurrences(normJob, term);
    if (count > 0) candidateMap.set(term, { category: 'technical', count });
  });

  TOOLS_TERMS.forEach(term => {
    const count = countOccurrences(normJob, term);
    if (count > 0 && !candidateMap.has(term)) candidateMap.set(term, { category: 'tools', count });
  });

  SOFT_SKILLS_TERMS.forEach(term => {
    const count = countOccurrences(normJob, term);
    if (count > 0 && !candidateMap.has(term)) candidateMap.set(term, { category: 'soft_skills', count });
  });

  CERTIFICATIONS_TERMS.forEach(term => {
    const count = countOccurrences(normJob, term);
    if (count > 0 && !candidateMap.has(term)) candidateMap.set(term, { category: 'certifications', count });
  });

  ACTION_VERBS.forEach(term => {
    const count = countOccurrences(normJob, term);
    if (count > 0 && !candidateMap.has(term)) candidateMap.set(term, { category: 'action_verbs', count });
  });

  // Dynamic n-gram extraction (2-word and 3-word technical/domain noun phrases)
  const cleanJobWords = normJob.replace(/[^a-zA-Z0-9\s-]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  for (let i = 0; i < cleanJobWords.length - 1; i++) {
    const w1 = cleanJobWords[i];
    const w2 = cleanJobWords[i + 1];
    if (STOP_WORDS.has(w1) || STOP_WORDS.has(w2)) continue;
    const bigram = `${w1} ${w2}`;
    if (!candidateMap.has(bigram)) {
      const count = countOccurrences(normJob, bigram);
      if (count >= 2) {
        candidateMap.set(bigram, { category: 'domain', count });
      }
    }
  }

  // Also check high-frequency single words that look like technical skills or credentials
  const singleWordFreq = new Map<string, number>();
  cleanJobWords.forEach(w => {
    if (w.length >= 3 && !STOP_WORDS.has(w) && !/^\d+$/.test(w)) {
      singleWordFreq.set(w, (singleWordFreq.get(w) || 0) + 1);
    }
  });

  singleWordFreq.forEach((freq, word) => {
    if (freq >= 3 && !candidateMap.has(word)) {
      candidateMap.set(word, { category: 'domain', count: freq });
    }
  });

  // 2. Evaluate each keyword against Resume
  const allKeywords: KeywordItem[] = [];
  const matchedKeywords: KeywordItem[] = [];
  const missingKeywords: KeywordItem[] = [];

  candidateMap.forEach((meta, term) => {
    const resumeCount = countOccurrences(normResume, term);
    const isMatched = resumeCount > 0;
    
    let importance: KeywordImportance = 'optional';
    if (meta.count >= 3 || meta.category === 'technical' || meta.category === 'certifications') {
      importance = 'critical';
    } else if (meta.count >= 2 || meta.category === 'tools' || meta.category === 'soft_skills') {
      importance = 'recommended';
    }

    const item: KeywordItem = {
      term,
      category: meta.category,
      countInJob: meta.count,
      countInResume: resumeCount,
      isMatched,
      importance,
      contextSnippet: extractSnippets(jobText, term)
    };

    allKeywords.push(item);
    if (isMatched) {
      matchedKeywords.push(item);
    } else {
      missingKeywords.push(item);
    }
  });

  // Sort keywords: critical first, then countInJob desc
  const sortFn = (a: KeywordItem, b: KeywordItem) => {
    const impOrder = { critical: 3, recommended: 2, optional: 1 };
    if (impOrder[a.importance] !== impOrder[b.importance]) {
      return impOrder[b.importance] - impOrder[a.importance];
    }
    return b.countInJob - a.countInJob;
  };

  matchedKeywords.sort(sortFn);
  missingKeywords.sort(sortFn);
  allKeywords.sort(sortFn);

  // 3. Section Presence Detection
  const detectedSections = {
    contactInfo: /(@|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b|linkedin\.com|github\.com)/i.test(resumeText),
    summary: /(summary|profile|about me|objective|professional overview)/i.test(resumeText),
    experience: /(experience|work history|employment|career history|professional background)/i.test(resumeText),
    skills: /(skills|technical competencies|core competencies|technologies|proficiencies)/i.test(resumeText),
    education: /(education|degree|university|college|bachelor|master|phd|diploma)/i.test(resumeText)
  };

  const sectionsCount = Object.values(detectedSections).filter(Boolean).length;
  const sectionsScore = Math.round((sectionsCount / 5) * 100);

  // 4. Metrics & Quantifiable Achievements Detection
  // Check for numbers followed by %, $, +, k, M, or metrics words
  const metricMatches = resumeText.match(/(\d+[\d,.]*(\s*(%|\$|k|m|million|billion|\+))|\$\s*\d+[\d,.]*|\b\d+\s+(team members|engineers|users|clients|projects|features|services)\b)/gi) || [];
  const metricsScore = Math.min(100, Math.round((metricMatches.length / 5) * 100));

  // 5. Action Verbs Detection in Resume
  let actionVerbHits = 0;
  ACTION_VERBS.forEach(verb => {
    if (countOccurrences(normResume, verb) > 0) {
      actionVerbHits++;
    }
  });
  const actionVerbsScore = Math.min(100, Math.round((actionVerbHits / 6) * 100));

  // 6. Keyword Match Score Calculation
  // Weighted: critical = 3x, recommended = 2x, optional = 1x
  let totalWeight = 0;
  let matchedWeight = 0;
  allKeywords.forEach(k => {
    const w = k.importance === 'critical' ? 3 : k.importance === 'recommended' ? 2 : 1;
    totalWeight += w;
    if (k.isMatched) matchedWeight += w;
  });
  const keywordScore = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 50;

  // 7. Readability / Formatting Score
  let readabilityScore = 85;
  if (wordCountResume < 200) readabilityScore -= 30; // too short
  if (wordCountResume > 1200) readabilityScore -= 15; // too long for 1-2 pages
  // Check for bullet points
  const bulletCount = (resumeText.match(/^[\s]*[-•*]/gm) || []).length;
  if (bulletCount >= 6) readabilityScore += 10;
  else if (bulletCount === 0) readabilityScore -= 20;
  readabilityScore = Math.max(20, Math.min(100, readabilityScore));

  // 8. Overall ATS Score
  // Keyword score 50%, Sections 15%, Metrics 15%, Action Verbs 10%, Readability 10%
  const overallScore = Math.min(
    100,
    Math.max(
      15,
      Math.round(
        keywordScore * 0.50 +
        sectionsScore * 0.15 +
        metricsScore * 0.15 +
        actionVerbsScore * 0.10 +
        readabilityScore * 0.10
      )
    )
  );

  // 9. Strengths, Weaknesses, and Actionable Recommendations
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: RecommendationItem[] = [];

  // Keywords analysis
  if (keywordScore >= 75) {
    strengths.push(`Strong keyword alignment: Matched ${matchedKeywords.length} key terms from the job posting.`);
  } else {
    weaknesses.push(`Low keyword density: Missing ${missingKeywords.length} relevant keywords that ATS scanners prioritize.`);
    recommendations.push({
      id: 'rec-keywords',
      category: 'keyword',
      title: 'Incorporate Missing ATS Keywords',
      detail: `Add high-frequency terms such as ${missingKeywords.slice(0, 4).map(k => `"${k.term}"`).join(', ')} directly into your summary and skills section.`,
      impact: 'high',
      type: 'weakness'
    });
  }

  // Critical missing keywords
  const criticalMissing = missingKeywords.filter(k => k.importance === 'critical');
  if (criticalMissing.length > 0) {
    weaknesses.push(`Missing ${criticalMissing.length} critical requirements: ${criticalMissing.slice(0, 3).map(k => k.term).join(', ')}.`);
  } else if (allKeywords.length > 0) {
    strengths.push('All critical core technical competencies detected in your profile.');
  }

  // Metrics analysis
  if (metricMatches.length >= 4) {
    strengths.push(`High quantifiable impact: Detected ${metricMatches.length} measurable metrics (%, $, scale).`);
  } else {
    weaknesses.push(`Few quantifiable achievements: Only detected ${metricMatches.length} metric statements.`);
    recommendations.push({
      id: 'rec-metrics',
      category: 'metric',
      title: 'Quantify Bullet Points with Data',
      detail: 'ATS algorithms and recruiters favor bullet points with concrete percentages, dollars saved/generated, latency reductions, or team scale.',
      impact: 'high',
      type: 'weakness'
    });
  }

  // Action verbs analysis
  if (actionVerbHits >= 5) {
    strengths.push(`Strong ATS action verbs: Used ${actionVerbHits} high-impact leadership and technical verbs.`);
  } else {
    weaknesses.push('Weak action verbs: Work history relies on passive phrases ("responsible for", "assisted with").');
    recommendations.push({
      id: 'rec-action-verbs',
      category: 'action_verb',
      title: 'Replace Passive Duties with Power Verbs',
      detail: 'Begin bullet points with verbs like "Spearheaded", "Architected", "Accelerated", "Streamlined", or "Engineered".',
      impact: 'medium',
      type: 'weakness'
    });
  }

  // Sections analysis
  const missingSectionNames = [];
  if (!detectedSections.contactInfo) missingSectionNames.push('Contact Information');
  if (!detectedSections.summary) missingSectionNames.push('Professional Summary');
  if (!detectedSections.experience) missingSectionNames.push('Work Experience');
  if (!detectedSections.skills) missingSectionNames.push('Skills Matrix');
  if (!detectedSections.education) missingSectionNames.push('Education');

  if (missingSectionNames.length === 0) {
    strengths.push('Standard ATS section headers present (Contact, Summary, Experience, Skills, Education).');
  } else {
    weaknesses.push(`Missing standard section headers: ${missingSectionNames.join(', ')}.`);
    recommendations.push({
      id: 'rec-sections',
      category: 'section',
      title: 'Add Standard ATS Section Headers',
      detail: `Include clear headers for ${missingSectionNames.join(' and ')} so automated parsers can index your background properly.`,
      impact: 'high',
      type: 'weakness'
    });
  }

  // Length and formatting
  if (wordCountResume >= 350 && wordCountResume <= 900) {
    strengths.push(`Optimal resume length: ${wordCountResume} words (~1-2 pages standard).`);
  } else if (wordCountResume < 300) {
    weaknesses.push(`Resume may be too brief (${wordCountResume} words), limiting keyword indexing opportunity.`);
  }

  return {
    overallScore,
    keywordScore,
    sectionsScore,
    metricsScore,
    actionVerbsScore,
    readabilityScore,
    matchedKeywords,
    missingKeywords,
    allExtractedKeywords: allKeywords,
    strengths,
    weaknesses,
    recommendations,
    wordCountResume,
    wordCountJob,
    readingTimeMinutes,
    detectedSections
  };
}
