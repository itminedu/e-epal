// import * as persistState from 'redux-localstorage';
// import {createLogger} from 'redux-logger';
import createLogger = require("redux-logger");
// import {applyMiddleware} from 'redux';
import { IAppState, rootReducer, deimmutify } from './store';
import { ICourseField, ICourseFields } from './coursefields/coursefields.types';
import { ISectorField, ISectorFields } from './sectorfields/sectorfields.types';
import { IRRegion, IRRegionSchool, IRegionRecord, IRegionRecords, IRegionSchoolRecord, IRegionSchoolRecords } from './regionschools/regionschools.types';
import { ISectors, ISector, ISectorCourse } from './sectorcourses/sectorcourses.types';
import { IStudentDataField, IStudentDataFields } from './studentdatafields/studentdatafields.types';
import { IEpalClass, IEpalClasses } from './epalclasses/epalclasses.types';
import { ILoginInfoToken, ILoginInfo } from './logininfo/logininfo.types';
import { ICriter, ICriteria } from './criteria/criteria.types';

export {
  IAppState,
  rootReducer,
  ICourseField,
  ICourseFields,
  ISectorField,
  ISectorFields,
  IRRegion,
  IRegionRecord,
  IRegionRecords,
  IRegionSchoolRecord,
  IRegionSchoolRecords,
  IRRegionSchool,
  ISectors,
  ISector,
  ISectorCourse,
  IStudentDataField,
  IStudentDataFields,
  IEpalClass,
  IEpalClasses,
  ILoginInfo,
  ICriter,
  ICriteria
};


const logger = createLogger({
    level: 'info',
    collapsed: true,
    stateTransformer: deimmutify
})
export const middleware = [
  logger
];

/* export const middleware = [
  Logger({
    level: 'info',
    collapsed: true,
    stateTransformer: deimmutify
  })
]; */
