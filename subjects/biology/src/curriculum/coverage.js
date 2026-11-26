import {topics,lessons,questions,cards} from '../content.js';

// The Enzymes inventory is the only individual-objective inventory drafted so far.
// Do not infer completeness from topic summaries or count an unverified objective as covered.
const enzymeObjectives = [
 [1,'core','Catalysts and their effect on reaction rate'],
 [2,'core','Enzymes as protein catalysts in metabolism'],
 [3,'core','Why enzymes are essential for life'],
 [4,'core','Enzyme action: substrate, active site and products'],
 [5,'core','Temperature and pH effects, including investigations'],
 [6,'supplement','Enzyme–substrate complexes'],
 [7,'supplement','Specificity and complementary shape'],
 [8,'supplement','Temperature effects explained by molecular motion and denaturation'],
 [9,'supplement','pH effects explained by changes in enzyme shape']
];
export function coverageFor(topicId){
 if(topicId!=='t05')return [];
 return enzymeObjectives.map(([number,tier,label])=>{
  const ref='5.1.'+number;
  const linked=lessons.filter(l=>l.topicId===topicId&&l.tier===tier&&l.id.startsWith('lesson-t05-')&&l.refs?.includes(ref)&&l.sections?.length);
  const ids=new Set(linked.map(l=>l.id));
  const assessments=questions.filter(q=>ids.has(q.lessonId)&&q.refs?.includes(ref));
  const reviews=cards.filter(c=>ids.has(c.lessonId));
  const hasMaterial=linked.length>0&&assessments.some(q=>q.type==='mcq')&&assessments.some(q=>q.type==='written')&&reviews.length>0;
  return {ref,tier,label,lessonIds:[...ids],questionIds:assessments.map(q=>q.id),cardIds:reviews.map(c=>c.id),status:hasMaterial?'Learning material and assessments available; latest syllabus version and editorial review pending':'Incomplete — learning material or assessment missing',hasMaterial,complete:false};
 });
}
export function coverageSummary(){
 const rows=topics.flatMap(t=>coverageFor(t.id));
 const mapped=rows.filter(o=>o.hasMaterial).length;
 const inventoried=topics.filter(t=>coverageFor(t.id).length).length;
 return mapped+' of '+rows.length+' inventoried objectives have linked learning material and assessments. Individual objective inventories exist for '+inventoried+' of '+topics.length+' topics. Other inventories and final verification are outstanding; no topic is certified complete.';
}
