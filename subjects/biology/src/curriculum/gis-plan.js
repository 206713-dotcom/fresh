// The GIS Biology year plan (sites.google.com/gardenschool.edu.my/gisbiology, read November 2026),
// joined to Fresh lesson notes. Year 11 has no published term split; the split at the January
// mocks is used, and Term 3 is revision for the IGCSE exams.
import {y9} from './gis-y9.js';
import {y10} from './gis-y10.js';
import {y11} from './gis-y11.js';
const years = [['Year 9', 'Y9', y9], ['Year 10', 'Y10', y10], ['Year 11', 'Y11', y11]];
export const gisLessons = [];
export const schoolPlan = years.map(([year, code, units]) => ({
  year, code,
  terms: [...new Set(units.map(u => u.term))].map(term => ({
    term,
    units: units.filter(u => u.term === term).map(u => ({
      unit: u.unit,
      lessonIds: u.lessons.map(l => {
        const id = 'lesson-gis-' + code.toLowerCase() + '-' + l.slug;
        const core = l.sections.filter(sec => sec[2] !== 'S');
        gisLessons.push({
          id, topicId: l.topicId, tier: l.tier, refs: l.refs, title: l.title, body: l.body,
          sections: l.sections.map(([h, b, t]) => [h, b, t === 'S' ? 'supplement' : 'core']),
          tips: l.markScheme, mistakes: l.mistakes || [], visual: l.visual,
          summary: [l.body.split('. ')[0].replace(/\.?$/, '.'), ...core.slice(0, 2).map(sec => sec[0] + ': ' + sec[1].split('. ')[0].replace(/\.?$/, '.'))],
          minutes: Math.max(4, Math.round(l.sections.reduce((n, sec) => n + sec[1].split(' ').length, l.body.split(' ').length) / 120) + 2),
          review: 'syllabus-mapped', school: {year, term, unit: u.unit}
        });
        return id;
      })
    }))
  }))
}));
// Year 11 Term 3: revision, past papers and the IGCSE examinations (May–June).
schoolPlan[2].terms.push({term: 'Term 3', units: [{unit: 'Revision and IGCSE examinations', lessonIds: [], note: 'Revise every unit above, use Practice, Flashcards and Exams, and work through past papers.'}]});
