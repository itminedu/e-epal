// import * as persistState from 'redux-localstorage';
import * as createLogger from 'redux-logger';
import { IAppState, rootReducer, deimmutify } from './store';
import { ICourseField, ICourseFields } from './coursefields/coursefields.types';
import { ISectorField, ISectorFields } from './sectorfields/sectorfields.types';
import { IRegions, IRegion, IRegionSchool } from './regionschools/regionschools.types';
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
  IRegions,
  IRegion,
  IRegionSchool,
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

export const middleware = [
  createLogger({
    level: 'info',
    collapsed: true,
    stateTransformer: deimmutify
  })
];
