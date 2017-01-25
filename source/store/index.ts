// import * as persistState from 'redux-localstorage';
import * as createLogger from 'redux-logger';
import { IAppState, rootReducer, deimmutify } from './store';
import { ICourseField, ICourseFields } from './coursefields/coursefields.types';
import { IRegions, IRegion, IRegionSchool } from './regionschools/regionschools.types';
import { IStudentDataField, IStudentDataFields } from './studentdatafields/studentdatafields.types';

export {
  IAppState,
  rootReducer,
  ICourseField,
  ICourseFields,
  IRegions,
  IRegion,
  IRegionSchool,
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
