/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KeywordItem, ParsedResume, TemplateType } from '../types';

export function parseResumeText(rawText: string): ParsedResume {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  let fullName = 'Candidate Name';
  let headline = 'Professional';
  let contact = {
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: ''
  };

  let summary = '';
  const skills: { category: string; items: string[] }[] = [];
  const experience: { title: string; company: string; period: string; location?: string; bullets: string[] }[] = [];
  const education: { degree: string; school: string; year: string; honors?: string }[] = [];
  const certifications: string[] = [];
  const projects: { name: string; description: string; bullets: string[] }[] = [];

  // 1. Extract contact info & name from top lines
  if (lines.length > 0) {
    fullName = lines[0].replace(/^[#\s*]+/, '').trim();
  }

  // Find email, phone, links in first 4 lines
  const topText = lines.slice(0, 5).join(' ');
  const emailMatch = topText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) contact.email = emailMatch[0];

  const phoneMatch = topText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) contact.phone = phoneMatch[0];

  const linkedinMatch = topText.match(/(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) contact.linkedin = linkedinMatch[0];

  const githubMatch = topText.match(/(github\.com\/[a-zA-Z0-9_-]+)/i);
  if (githubMatch) contact.github = githubMatch[0];

  const locationMatch = topText.match(/([A-Z][a-zA-Z\s]+,\s*[A-Z]{2})/);
  if (locationMatch) contact.location = locationMatch[0];

  // 2. Identify sections by common headers
  let currentSection = 'header';
  let currentExpItem: { title: string; company: string; period: string; location?: string; bullets: string[] } | null = null;
  let currentEduItem: { degree: string; school: string; year: string; honors?: string } | null = null;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    // Check for section transitions
    if (/^(professional\s+)?summary|profile|about\s+me|objective/i.test(line) && line.length < 35) {
      currentSection = 'summary';
      continue;
    } else if (/^(technical\s+)?skills|core\s+competencies|technologies|proficiencies/i.test(line) && line.length < 35) {
      currentSection = 'skills';
      continue;
    } else if (/^(work\s+)?experience|employment|career\s+history|professional\s+background/i.test(line) && line.length < 35) {
      currentSection = 'experience';
      continue;
    } else if (/^education|academic\s+background/i.test(line) && line.length < 35) {
      currentSection = 'education';
      continue;
    } else if (/^certifications?|licenses?|credentials?/i.test(line) && line.length < 35) {
      currentSection = 'certifications';
      continue;
    } else if (/^projects?|notable\s+projects?/i.test(line) && line.length < 35) {
      currentSection = 'projects';
      continue;
    }

    // Process content based on current section
    if (currentSection === 'header') {
      if (!line.includes('@') && !line.includes('(') && !line.includes('|') && line.length < 50) {
        headline = line;
      }
    } else if (currentSection === 'summary') {
      summary += (summary ? ' ' : '') + line;
    } else if (currentSection === 'skills') {
      // Look for format like "- Languages: Python, JS" or bullet points
      if (line.includes(':')) {
        const [cat, val] = line.split(':');
        const items = val.split(/[,|•]/).map(s => s.trim()).filter(Boolean);
        skills.push({ category: cat.replace(/^[-*•\s]+/, '').trim(), items });
      } else {
        const items = line.split(/[,|•]/).map(s => s.trim().replace(/^[-*•\s]+/, '')).filter(Boolean);
        if (items.length > 0) {
          skills.push({ category: 'Key Skills', items });
        }
      }
    } else if (currentSection === 'experience') {
      // Check if it's a role/company line: e.g. "Software Engineer | NexaTech | 2022 - Present"
      if (line.includes('|') || /(19|20)\d{2}/.test(line) && !line.startsWith('-') && !line.startsWith('•')) {
        const parts = line.split('|').map(s => s.trim());
        currentExpItem = {
          title: parts[0] || 'Role',
          company: parts[1] || 'Company',
          period: parts[2] || 'Period',
          bullets: []
        };
        experience.push(currentExpItem);
      } else if (currentExpItem) {
        // Bullet point
        const cleanBullet = line.replace(/^[-*•\s]+/, '').trim();
        if (cleanBullet) currentExpItem.bullets.push(cleanBullet);
      }
    } else if (currentSection === 'education') {
      if (line.includes('|') || /(19|20)\d{2}/.test(line) && !line.startsWith('-')) {
        const parts = line.split('|').map(s => s.trim());
        currentEduItem = {
          degree: parts[0] || 'Degree',
          school: parts[1] || 'University',
          year: parts[2] || 'Year'
        };
        education.push(currentEduItem);
      } else if (currentEduItem && !currentEduItem.school) {
        currentEduItem.school = line;
      }
    } else if (currentSection === 'certifications') {
      const cleanCert = line.replace(/^[-*•\s]+/, '').trim();
      if (cleanCert) certifications.push(cleanCert);
    }
  }

  // Fallbacks if parse missed sections
  if (!summary) {
    summary = 'Accomplished professional with a proven track record of driving technical innovation, operational excellence, and cross-functional success.';
  }

  if (skills.length === 0) {
    skills.push({
      category: 'Core Competencies',
      items: ['Problem Solving', 'Strategic Planning', 'Agile Methodology', 'Team Leadership']
    });
  }

  return {
    fullName,
    headline,
    contact,
    summary,
    skills,
    experience,
    education,
    certifications,
    projects,
    rawText
  };
}

/**
 * Intelligent in-memory rewriter that injects missing ATS keywords organically
 * and formats the resume into Chronological, Functional, or Combination templates.
 */
export function rewriteResumeWithKeywords(
  originalResume: string,
  missingKeywords: KeywordItem[],
  jobDescriptionText: string,
  targetTemplate: TemplateType = 'chronological'
): { rewrittenText: string; parsed: ParsedResume; addedTerms: string[] } {
  const parsed = parseResumeText(originalResume);
  const addedTerms: string[] = [];

  // Group missing keywords by category
  const missingTech = missingKeywords.filter(k => k.category === 'technical').map(k => k.term);
  const missingTools = missingKeywords.filter(k => k.category === 'tools').map(k => k.term);
  const missingSoft = missingKeywords.filter(k => k.category === 'soft_skills').map(k => k.term);
  const missingCerts = missingKeywords.filter(k => k.category === 'certifications').map(k => k.term);
  const missingActionVerbs = missingKeywords.filter(k => k.category === 'action_verbs').map(k => k.term);
  const missingDomain = missingKeywords.filter(k => k.category === 'domain').map(k => k.term);

  // Extract desired job title from job description if available
  const jobTitleMatch = jobDescriptionText.match(/(?:job title|position|role):\s*([^\n\r,]+)/i);
  const targetRole = jobTitleMatch ? jobTitleMatch[1].trim() : parsed.headline || 'Senior Specialist';

  // 1. Rewrite Professional Summary
  // Integrate high-priority keywords into a compelling ATS narrative
  const topTech = [...missingTech, ...missingDomain].slice(0, 4);
  const topSoft = missingSoft.slice(0, 2);
  topTech.forEach(t => addedTerms.push(t));
  topSoft.forEach(s => addedTerms.push(s));

  let enhancedSummary = parsed.summary;
  if (!enhancedSummary.toLowerCase().includes(targetRole.toLowerCase())) {
    enhancedSummary = `Results-oriented ${targetRole} with proven expertise in ${topTech.join(', ') || 'end-to-end delivery'}. ` +
      `${enhancedSummary} Recognized for driving operational efficiency, ${topSoft.join(' and ') || 'cross-functional collaboration'}, and delivering high-impact solutions in fast-paced production environments.`;
  } else {
    enhancedSummary += ` Key competencies include ${[...topTech, ...topSoft].join(', ')}.`;
  }
  parsed.summary = enhancedSummary;
  parsed.headline = targetRole;

  // 2. Enrich Skills Section
  // Insert missing tech and tools into existing categories or create targeted ones
  if (missingTech.length > 0) {
    let techGroup = parsed.skills.find(s => /technical|languages|core/i.test(s.category));
    if (!techGroup) {
      techGroup = { category: 'Technical Proficiencies', items: [] };
      parsed.skills.unshift(techGroup);
    }
    missingTech.slice(0, 6).forEach(term => {
      if (!techGroup!.items.some(i => i.toLowerCase() === term.toLowerCase())) {
        techGroup!.items.push(term);
        addedTerms.push(term);
      }
    });
  }

  if (missingTools.length > 0) {
    let toolsGroup = parsed.skills.find(s => /tools|platforms|devops/i.test(s.category));
    if (!toolsGroup) {
      toolsGroup = { category: 'Tools & Infrastructure', items: [] };
      parsed.skills.push(toolsGroup);
    }
    missingTools.slice(0, 5).forEach(term => {
      if (!toolsGroup!.items.some(i => i.toLowerCase() === term.toLowerCase())) {
        toolsGroup!.items.push(term);
        addedTerms.push(term);
      }
    });
  }

  if (missingSoft.length > 0) {
    let softGroup = parsed.skills.find(s => /methodolog|practices|leadership|soft/i.test(s.category));
    if (!softGroup) {
      softGroup = { category: 'Leadership & Methodologies', items: [] };
      parsed.skills.push(softGroup);
    }
    missingSoft.slice(0, 4).forEach(term => {
      if (!softGroup!.items.some(i => i.toLowerCase() === term.toLowerCase())) {
        softGroup!.items.push(term);
        addedTerms.push(term);
      }
    });
  }

  // 3. Inject Missing Keywords into Work Experience Bullets
  // Enhance experience bullets with ATS action verbs, metrics, and technical keywords
  const candidateKeywordsToInject = [...missingTech, ...missingTools, ...missingDomain];
  let kwIdx = 0;

  parsed.experience.forEach((job, jobIdx) => {
    // Inject at least 1-2 missing keywords per job if available
    if (jobIdx === 0 && candidateKeywordsToInject.length > 0) {
      // Most recent job: add an impactful keyword-rich bullet point
      const kw1 = candidateKeywordsToInject[kwIdx++] || 'microservices';
      const kw2 = candidateKeywordsToInject[kwIdx++] || 'CI/CD';
      const powerVerb = missingActionVerbs[0] || 'Spearheaded';

      job.bullets.unshift(
        `${powerVerb} modern architecture adopting ${kw1} and automated ${kw2} workflows, reducing deployment cycle times by 42% and enhancing system resilience.`
      );
      addedTerms.push(kw1);
      addedTerms.push(kw2);
    }

    // Enhance existing bullets to include missing action verbs or terms
    job.bullets = job.bullets.map((bullet, bIdx) => {
      if (bIdx === 1 && kwIdx < candidateKeywordsToInject.length) {
        const kw = candidateKeywordsToInject[kwIdx++];
        addedTerms.push(kw);
        return bullet.replace(/\.$/, '') + `, optimizing performance using ${kw} for high-availability production workloads.`;
      }
      return bullet;
    });
  });

  // 4. Update Certifications if relevant
  if (missingCerts.length > 0) {
    missingCerts.slice(0, 2).forEach(cert => {
      if (!parsed.certifications.some(c => c.toLowerCase().includes(cert.toLowerCase()))) {
        parsed.certifications.push(`${cert} (In Progress / Completed)`);
        addedTerms.push(cert);
      }
    });
  }

  // 5. Build Functional Competency Blocks (for Functional & Combination templates)
  parsed.functionalCompetencies = [
    {
      competency: 'System Architecture & Technical Excellence',
      bullets: [
        `Architected scalable enterprise systems incorporating ${topTech.slice(0, 2).join(' and ') || 'cloud-native frameworks'}, processing high-throughput production transactions.`,
        `Led automated testing and continuous integration pipelines to achieve over 85% test coverage across core microservices.`
      ]
    },
    {
      competency: 'Cross-Functional Leadership & Agile Delivery',
      bullets: [
        `Spearheaded agile sprint planning and stakeholder alignment to ship strategic initiatives 2 weeks ahead of scheduled deadlines.`,
        `Mentored and coached junior team members, conducting architectural RFC reviews and standardizing development best practices.`
      ]
    },
    {
      competency: 'Optimization, Monitoring & Resilience',
      bullets: [
        `Implemented robust observability and performance monitoring reducing mean-time-to-detection (MTTD) by 35%.`,
        `Streamlined data pipelines and cloud infrastructure costs, generating $40,000+ in annual operational savings.`
      ]
    }
  ];

  // 6. Generate formatted text based on Template Type
  const rewrittenText = formatResumeToString(parsed, targetTemplate);

  return {
    rewrittenText,
    parsed,
    addedTerms: Array.from(new Set(addedTerms))
  };
}

export function formatResumeToString(resume: ParsedResume, template: TemplateType): string {
  const contactParts = [
    resume.contact.location,
    resume.contact.phone,
    resume.contact.email,
    resume.contact.linkedin,
    resume.contact.github,
    resume.contact.website
  ].filter(Boolean);

  let output = '';

  // Header
  output += `${resume.fullName.toUpperCase()}\n`;
  if (resume.headline) output += `${resume.headline}\n`;
  output += `${contactParts.join(' | ')}\n\n`;

  // Professional Summary
  output += `PROFESSIONAL SUMMARY\n`;
  output += `${resume.summary}\n\n`;

  if (template === 'chronological') {
    // Chronological: Summary -> Skills -> Experience -> Education -> Certifications
    output += `CORE COMPETENCIES & TECHNICAL SKILLS\n`;
    resume.skills.forEach(skillGroup => {
      output += `- ${skillGroup.category}: ${skillGroup.items.join(', ')}\n`;
    });
    output += `\n`;

    output += `PROFESSIONAL EXPERIENCE\n`;
    resume.experience.forEach(exp => {
      output += `${exp.title} | ${exp.company} | ${exp.period}\n`;
      exp.bullets.forEach(b => {
        output += `• ${b}\n`;
      });
      output += `\n`;
    });

    if (resume.education.length > 0) {
      output += `EDUCATION\n`;
      resume.education.forEach(edu => {
        output += `${edu.degree} | ${edu.school} | ${edu.year}\n`;
      });
      output += `\n`;
    }

    if (resume.certifications.length > 0) {
      output += `CERTIFICATIONS & CREDENTIALS\n`;
      resume.certifications.forEach(cert => {
        output += `• ${cert}\n`;
      });
      output += `\n`;
    }
  } else if (template === 'functional') {
    // Functional: Summary -> Core Functional Competencies (with bullet points) -> Skills Grid -> Concise Work History -> Education
    output += `AREAS OF EXPERTISE & MAJOR ACHIEVEMENTS\n`;
    if (resume.functionalCompetencies && resume.functionalCompetencies.length > 0) {
      resume.functionalCompetencies.forEach(comp => {
        output += `${comp.competency.toUpperCase()}\n`;
        comp.bullets.forEach(b => {
          output += `• ${b}\n`;
        });
        output += `\n`;
      });
    }

    output += `TECHNICAL & PROFESSIONAL SKILLS\n`;
    resume.skills.forEach(skillGroup => {
      output += `- ${skillGroup.category}: ${skillGroup.items.join(', ')}\n`;
    });
    output += `\n`;

    output += `EMPLOYMENT HISTORY\n`;
    resume.experience.forEach(exp => {
      output += `${exp.title} - ${exp.company} (${exp.period})\n`;
    });
    output += `\n`;

    if (resume.education.length > 0) {
      output += `EDUCATION\n`;
      resume.education.forEach(edu => {
        output += `${edu.degree} | ${edu.school} | ${edu.year}\n`;
      });
      output += `\n`;
    }
  } else {
    // Combination / Hybrid: Summary -> Categorized Skills Matrix -> Chronological Work Experience with Key Achievements -> Education & Certifications
    output += `EXECUTIVE SKILLS & COMPETENCY MATRIX\n`;
    resume.skills.forEach(skillGroup => {
      output += `[${skillGroup.category}]\n${skillGroup.items.join(' • ')}\n\n`;
    });

    output += `PROFESSIONAL EXPERIENCE & ACHIEVEMENTS\n`;
    resume.experience.forEach(exp => {
      output += `${exp.title} | ${exp.company} (${exp.period})\n`;
      exp.bullets.forEach(b => {
        output += `• ${b}\n`;
      });
      output += `\n`;
    });

    if (resume.education.length > 0) {
      output += `EDUCATION\n`;
      resume.education.forEach(edu => {
        output += `${edu.degree} | ${edu.school} | ${edu.year}\n`;
      });
      output += `\n`;
    }

    if (resume.certifications.length > 0) {
      output += `CERTIFICATIONS\n`;
      resume.certifications.forEach(cert => {
        output += `• ${cert}\n`;
      });
      output += `\n`;
    }
  }

  return output.trim();
}
