import * as persistState from 'redux-localstorage';
import * as createLogger from 'redux-logger';
import { IAppState, rootReducer, deimmutify, reimmutify } from './store';
import { ICourseField, ICourseFields } from './coursefields/coursefields.types';

export {
  IAppState,
  rootReducer,
  ICourseField,
  ICourseFields,
  reimmutify,
};

export const middleware = [
  createLogger({
    level: 'info',
    collapsed: true,
    stateTransformer: deimmutify
  })
];

export const enhancers = [
  persistState(
    '', {
      key: 'e-epal',
//      serialize: s => JSON.stringify(deimmutify(s)),
      serialize: s => JSON.stringify(s),
      deserialize: s => reimmutify(JSON.parse(s)),
  })
];
