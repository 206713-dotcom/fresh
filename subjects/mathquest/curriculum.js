import {number} from './content/number.js';
import {algebra} from './content/algebra.js';
import {space} from './content/space.js';
import {data} from './content/data.js';
import {additional} from './content/additional.js';
import {extra} from './content/extra.js';
import {pure1} from './content/alevel-pure1.js';
import {pure3} from './content/alevel-pure3.js';
import {mechanics} from './content/alevel-mechanics.js';
import {statistics1, statistics2} from './content/alevel-statistics.js';

export const LEVELS = {igcse:'IGCSE', alevel:'A Level'};
export const ASSESSMENT_VERSION = 2;

export const UNITS = {
  number: {name:'Number', icon:'hash', tone:'violet'},
  algebra: {name:'Algebra & graphs', icon:'function', tone:'indigo'},
  'function-graphs': {name:'Functions & their graphs', icon:'function', tone:'indigo'},
  coordinates: {name:'Coordinate geometry', icon:'axis', tone:'sky'},
  geometry: {name:'Geometry', icon:'shapes', tone:'mint'},
  mensuration: {name:'Mensuration', icon:'ruler', tone:'amber'},
  trigonometry: {name:'Trigonometry', icon:'triangle', tone:'rose'},
  vectors: {name:'Transformations & vectors', coreName:'Transformations', icon:'move', tone:'violet'},
  probability: {name:'Probability', icon:'dice', tone:'mint'},
  statistics: {name:'Statistics', icon:'chart', tone:'sky'},
  modelling: {name:'Investigation & modelling', icon:'compass', tone:'amber'},
  functions: {name:'Functions', icon:'function', tone:'violet'},
  quadratic: {name:'Quadratic functions', icon:'axis', tone:'sky'},
  polynomials: {name:'Factors of polynomials', icon:'function', tone:'indigo'},
  equations: {name:'Equations, inequalities & graphs', icon:'axis', tone:'violet'},
  systems: {name:'Simultaneous equations', icon:'layers', tone:'mint'},
  logarithms: {name:'Logarithmic & exponential functions', icon:'function', tone:'rose'},
  'line-model': {name:'Straight-line graphs', icon:'axis', tone:'sky'},
  'circle-coordinate': {name:'Coordinate geometry of the circle', icon:'shapes', tone:'mint'},
  circular: {name:'Circular measure', icon:'ruler', tone:'amber'},
  'add-trig': {name:'Advanced trigonometry', icon:'triangle', tone:'rose'},
  counting: {name:'Permutations & combinations', icon:'dice', tone:'amber'},
  series: {name:'Series', icon:'hash', tone:'mint'},
  'add-vectors': {name:'Vectors in two dimensions', icon:'move', tone:'sky'},
  calculus: {name:'Calculus', icon:'function', tone:'violet'},
  'al-p1': {name:'Pure Mathematics 1', icon:'function', tone:'violet'},
  'al-p3': {name:'Pure Mathematics 3', icon:'axis', tone:'indigo'},
  'al-mechanics': {name:'Mechanics', icon:'move', tone:'amber'},
  'al-stat1': {name:'Probability & Statistics 1', icon:'dice', tone:'mint'},
  'al-stat2': {name:'Probability & Statistics 2', icon:'chart', tone:'sky'}
};

export const TRACKS = {
  nurture: {name:'Nurture', tag:'Core', description:'Build confidence with the core syllabus and step-by-step practice.', icon:'sprout', tone:'mint'},
  standard: {name:'Standard', tag:'Extended', description:'Study core and extended maths, with a wider range of exam skills.', icon:'book', tone:'violet'},
  fast: {name:'Fast Track', tag:'Extended + Additional', description:'Work through Extended Mathematics and stretch into Additional Maths.', icon:'zap', tone:'amber'}
};

export const EXAMS = {
  '0580': {title:'Cambridge IGCSE Mathematics', source:'https://www.cambridgeinternational.org/Images/662466-2025-2027-syllabus.pdf'},
  '0980': {title:'Cambridge IGCSE (9–1) Mathematics', source:'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-9-1-0980/'},
  '0607': {title:'Cambridge IGCSE International Mathematics', source:'https://www.cambridgeinternational.org/Images/662472-2025-2027-syllabus.pdf'},
  '0606': {title:'Cambridge IGCSE Additional Mathematics', source:'https://www.cambridgeinternational.org/Images/662470-2025-2027-syllabus.pdf'},
  '9709': {title:'Cambridge International A Level Mathematics', source:'https://www.cambridgeinternational.org/Images/697427-2026-2027-syllabus.pdf'}
};

const examCourses = ['0580','0980','0607'].flatMap(code =>
  ['nurture','standard',...(code === '0607' ? [] : ['fast'])].map(track => ({
    id: code + '-' + track,
    code,
    track,
    label: TRACKS[track].name,
    tier: TRACKS[track].tag,
    exams: track === 'fast' ? [code, '0606'] : [code]
  }))
);

export const aLevelCourses = [
  {id:'9709-mechanics',code:'9709',track:'mechanics',label:'Mechanics route',tier:'A Level · Mechanics route',exams:['9709'],papers:'1, 3, 4 and 5'},
  {id:'9709-statistics',code:'9709',track:'statistics',label:'Statistics route',tier:'A Level · Statistics route',exams:['9709'],papers:'1, 3, 5 and 6'}
];

export const COURSES = Object.fromEntries([...examCourses, {
  id:'0606-only', code:'0606', track:'additional', label:'Additional Maths', tier:'Additional', exams:['0606']
}, ...aLevelCourses].map(course => [course.id, course]));

const ordinary = [...number, ...algebra, ...space, ...data, ...extra];
const aLevelLessons = [...pure1,...pure3,...mechanics,...statistics1,...statistics2];
const aLevelUnits = ['al-p1','al-p3','al-mechanics','al-stat1','al-stat2'];
const intlExclude = new Set(['curve-graphs','motion-graphs','histograms']);
const supplementalCore = new Set(['calculator','power-patterns','circle-right']);
const addOrder = [...new Set(additional.map(lesson=>lesson.unit))];
const regularOrder = ['number','algebra','function-graphs','coordinates','geometry','mensuration','trigonometry','vectors','probability','statistics','modelling'];
const curriculumOrder = [...regularOrder, ...addOrder, ...aLevelUnits];
export const ALL_LESSONS = [...ordinary, ...additional, ...aLevelLessons].sort((a, b) => curriculumOrder.indexOf(a.unit) - curriculumOrder.indexOf(b.unit));
const igcseLessons = ALL_LESSONS.filter(lesson=>!aLevelUnits.includes(lesson.unit));
export const LESSONS = Object.fromEntries(ALL_LESSONS.map(item => [item.id, item]));
export const courseLevel = course => course?.code === '9709' ? 'alevel' : 'igcse';
export const unitLevel = id => aLevelUnits.includes(id) ? 'alevel' : Object.hasOwn(UNITS,id) ? 'igcse' : undefined;
export const selectedCourse = ({code,track}) => COURSES[code === '0606' ? '0606-only' : code + '-' + track];
export const tierLabel = tier => ({core:'Core',extended:'Extended',additional:'Additional Maths','intl-core':'0607 Core','intl-extended':'0607 Extended',pure1:'Pure 1',pure3:'Pure 3',mechanics:'Mechanics',stat1:'Statistics 1',stat2:'Statistics 2'})[tier];
export const courseLabel = course => course ? course.exams.join(' + ') + ' · ' + course.tier : 'Choose a curriculum';

export function courseUnit(course, lesson) {
  if (course?.code === '0607' && ['graphs','functions'].includes(lesson.id)) return 'function-graphs';
  return lesson.unit;
}

export const unitName = (course, unit) => unit === 'vectors' && course?.track === 'nurture'
  ? UNITS[unit].coreName : UNITS[unit].name;

export function courseLessons(course, level='igcse') {
  if (!course) return level === 'alevel' ? aLevelLessons : igcseLessons;
  if (course.code === '9709') return aLevelLessons.filter(item => item.tier !== (course.track === 'mechanics' ? 'stat2' : 'mechanics'));
  if (course.track === 'additional') return additional;
  const isCore = course.track === 'nurture';
  const isInternational = course.code === '0607';
  const main = ordinary.filter(item => {
    if (isInternational && intlExclude.has(item.id)) return false;
    if (item.tier === 'core') return true;
    if (item.tier === 'extended') return !isCore;
    return isInternational && (item.tier === 'intl-core' || !isCore);
  });
  if (course.track === 'fast') main.push(...additional);
  return main.sort((a,b) => curriculumOrder.indexOf(courseUnit(course,a)) - curriculumOrder.indexOf(courseUnit(course,b)));
}

export function courseUnits(course,level) {
  const topics = new Set(courseLessons(course,level).map(lesson => courseUnit(course, lesson)));
  return curriculumOrder.filter(id => topics.has(id));
}

const tierOrder = {core:0,'intl-core':0,extended:1,'intl-extended':1,additional:2,pure1:0,pure3:0,mechanics:0,stat1:0,stat2:0};

export function assessmentItems(course,version=ASSESSMENT_VERSION) {
  if (!course) return [];
  const lessons = courseLessons(course);
  const items = courseUnits(course).flatMap(unit => lessons
    .filter(lesson => courseUnit(course,lesson) === unit)
    .sort((a,b) => tierOrder[a.tier] - tierOrder[b.tier] || Number(supplementalCore.has(a.id)) - Number(supplementalCore.has(b.id))));
  // 0580 and 0980 share objectives. Use alternate questions for new 0980 attempts.
  return course.code === '0980' && version === ASSESSMENT_VERSION
    ? items.map(lesson=>({...lesson,diagnostic:lesson.practice[1]}))
    : items;
}

export const allQuestionRefs = lesson => [
  {key:lesson.id + ':d', lesson, question:lesson.diagnostic},
  ...lesson.practice.map((question,i) => ({key:lesson.id + ':' + i, lesson, question}))
];

export function questionByKey(key) {
  if (typeof key !== 'string') return undefined;
  const id = key.split(':')[0];
  const lesson = Object.hasOwn(LESSONS,id) ? LESSONS[id] : null;
  return lesson ? allQuestionRefs(lesson).find(item => item.key === key) : undefined;
}
