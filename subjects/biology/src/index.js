// Public integration entry point for Fresh's Biology section.
export {mountBiology,biologyNavigation} from './app.js';
export {createBiologyStore,KEY as BIOLOGY_STORAGE_KEY} from './state.js';
export {topics,lessons,questions,cards,papers,glossary} from './content.js';
