// import * as persistState from 'redux-localstorage';
import * as createLogger from 'redux-logger';
import { IAppState, rootReducer, deimmutify } from './store';
import { ICourseField, ICourseFields } from './coursefields/coursefields.types';
import { IStudentDataField, IStudentDataFields } from './studentdatafields/studentdatafields.types';

export {
  IAppState,
  rootReducer,
  ICourseField,
  ICourseFields,
  IStudentDataField,
  IStudentDataFields,
};

export const middleware = [
  createLogger({
    level: 'info',
    collapsed: true,
    stateTransformer: deimmutify
  })
];

/* export const enhancers = [
  persistState(
    '', {
      key: 'e-epal',
      serialize: s => JSON.stringify(deimmutify(s)),
      deserialize: s => reimmutify(JSON.parse(s)),
  })
]; */
