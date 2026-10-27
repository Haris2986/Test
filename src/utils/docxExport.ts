/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import { AccentColor, FontFamily, FontSize, ParsedResume, TemplateType } from '../types';

const COLOR_MAP: Record<AccentColor, string> = {
  slate: '334155',
  navy: '1e3a8a',
  emerald: '065f46',
  indigo: '4338ca',
  charcoal: '18181b'
};

const FONT_MAP: Record<FontFamily, string> = {
  sans: 'Arial',
  serif: 'Georgia',
  modern: 'Calibri',
  mono: 'Consolas'
};

const FONT_SIZE_MAP: Record<FontSize, { body: number; heading1: number; heading2: number; name: number }> = {
  compact: { body: 19, heading1: 22, heading2: 20, name: 30 }, // in half-points (10pt = 20)
  standard: { body: 21, heading1: 24, heading2: 22, name: 34 },
  spacious: { body: 23, heading1: 26, heading2: 24, name: 38 }
};

export async function generateDocxBlob(
  resume: ParsedResume,
  template: TemplateType,
  fontFamily: FontFamily,
  fontSize: FontSize,
  accentColor: AccentColor
): Promise<Blob> {
  const font = FONT_MAP[fontFamily];
  const sizes = FONT_SIZE_MAP[fontSize];
  const accentHex = COLOR_MAP[accentColor];

  const paragraphs: Paragraph[] = [];

  // Header: Candidate Name
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: resume.fullName.toUpperCase(),
          bold: true,
          font,
          size: sizes.name,
          color: accentHex
        })
      ]
    })
  );

  // Headline
  if (resume.headline) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: resume.headline,
            bold: true,
            font,
            size: sizes.heading2,
            color: '475569'
          })
        ]
      })
    );
  }

  // Contact line
  const contactItems = [
    resume.contact.location,
    resume.contact.phone,
    resume.contact.email,
    resume.contact.linkedin,
    resume.contact.github
  ].filter(Boolean);

  if (contactItems.length > 0) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contactItems.join('  •  '),
            font,
            size: sizes.body - 2,
            color: '64748b'
          })
        ]
      })
    );
  }

  // Helper for Section Headings
  const addSectionHeading = (title: string) => {
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            font,
            size: sizes.heading1,
            color: accentHex
          })
        ]
      })
    );
  };

  // 1. Professional Summary
  if (resume.summary) {
    addSectionHeading('Professional Summary');
    paragraphs.push(
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({
            text: resume.summary,
            font,
            size: sizes.body,
            color: '1e293b'
          })
        ]
      })
    );
  }

  if (template === 'chronological') {
    // Skills
    if (resume.skills.length > 0) {
      addSectionHeading('Core Competencies & Technical Skills');
      resume.skills.forEach(skillGroup => {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 60 },
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: `${skillGroup.category}: `,
                bold: true,
                font,
                size: sizes.body,
                color: '334155'
              }),
              new TextRun({
                text: skillGroup.items.join(', '),
                font,
                size: sizes.body,
                color: '1e293b'
              })
            ]
          })
        );
      });
    }

    // Experience
    if (resume.experience.length > 0) {
      addSectionHeading('Professional Experience');
      resume.experience.forEach(exp => {
        paragraphs.push(
          new Paragraph({
            spacing: { before: 120, after: 60 },
            children: [
              new TextRun({
                text: exp.title,
                bold: true,
                font,
                size: sizes.heading2,
                color: '0f172a'
              }),
              new TextRun({
                text: `  |  ${exp.company}  |  ${exp.period}`,
                font,
                size: sizes.body,
                color: '475569'
              })
            ]
          })
        );

        exp.bullets.forEach(bullet => {
          paragraphs.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 60 },
              children: [
                new TextRun({
                  text: bullet,
                  font,
                  size: sizes.body,
                  color: '334155'
                })
              ]
            })
          );
        });
      });
    }
  } else if (template === 'functional') {
    // Functional Achievements
    addSectionHeading('Areas of Expertise & Major Achievements');
    if (resume.functionalCompetencies && resume.functionalCompetencies.length > 0) {
      resume.functionalCompetencies.forEach(comp => {
        paragraphs.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({
                text: comp.competency,
                bold: true,
                font,
                size: sizes.heading2,
                color: '0f172a'
              })
            ]
          })
        );
        comp.bullets.forEach(bullet => {
          paragraphs.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 60 },
              children: [
                new TextRun({
                  text: bullet,
                  font,
                  size: sizes.body,
                  color: '334155'
                })
              ]
            })
          );
        });
      });
    }

    // Skills
    if (resume.skills.length > 0) {
      addSectionHeading('Technical & Professional Skills');
      resume.skills.forEach(skillGroup => {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 60 },
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: `${skillGroup.category}: `,
                bold: true,
                font,
                size: sizes.body
              }),
              new TextRun({
                text: skillGroup.items.join(', '),
                font,
                size: sizes.body
              })
            ]
          })
        );
      });
    }

    // Brief Experience
    if (resume.experience.length > 0) {
      addSectionHeading('Employment History');
      resume.experience.forEach(exp => {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 60 },
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: `${exp.title} – ${exp.company} (${exp.period})`,
                font,
                size: sizes.body
              })
            ]
          })
        );
      });
    }
  } else {
    // Combination
    if (resume.skills.length > 0) {
      addSectionHeading('Executive Skills Matrix');
      resume.skills.forEach(skillGroup => {
        paragraphs.push(
          new Paragraph({
            spacing: { before: 80, after: 40 },
            children: [
              new TextRun({
                text: `[${skillGroup.category}]`,
                bold: true,
                font,
                size: sizes.body,
                color: accentHex
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: skillGroup.items.join('  •  '),
                font,
                size: sizes.body
              })
            ]
          })
        );
      });
    }

    if (resume.experience.length > 0) {
      addSectionHeading('Professional Experience & Achievements');
      resume.experience.forEach(exp => {
        paragraphs.push(
          new Paragraph({
            spacing: { before: 120, after: 60 },
            children: [
              new TextRun({
                text: exp.title,
                bold: true,
                font,
                size: sizes.heading2
              }),
              new TextRun({
                text: `  |  ${exp.company} (${exp.period})`,
                font,
                size: sizes.body,
                color: '475569'
              })
            ]
          })
        );

        exp.bullets.forEach(bullet => {
          paragraphs.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 60 },
              children: [
                new TextRun({
                  text: bullet,
                  font,
                  size: sizes.body
                })
              ]
            })
          );
        });
      });
    }
  }

  // Education
  if (resume.education.length > 0) {
    addSectionHeading('Education');
    resume.education.forEach(edu => {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: `${edu.degree}  |  ${edu.school}  |  ${edu.year}`,
              font,
              size: sizes.body,
              color: '1e293b'
            })
          ]
        })
      );
    });
  }

  // Certifications
  if (resume.certifications.length > 0) {
    addSectionHeading('Certifications & Licenses');
    resume.certifications.forEach(cert => {
      paragraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: cert,
              font,
              size: sizes.body,
              color: '1e293b'
            })
          ]
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children: paragraphs
      }
    ]
  });

  return await Packer.toBlob(doc);
}
