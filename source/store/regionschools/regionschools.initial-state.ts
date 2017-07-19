import { List } from 'immutable';
import { IRegion, IRegionM, IRegionRecord, IRRegion, IRRegionSchool, IRegionSchoolRecord } from './regionschools.types';
import {recordify} from 'typed-immutable-record';

// export const INITIAL_STATE = List<ICourseField>([new CourseFieldRecord({})]);
// export const REGION_SCHOOLS_INITIAL_STATE = List<IRegionM>();
export const REGION_SCHOOLS_INITIAL_STATE = new Array(recordify<IRRegion, IRegionRecord>({region_id: null, region_name: null, epals: new Array(recordify<IRRegionSchool, IRegionSchoolRecord>({epal_id: null, epal_name: null, epal_special_case: null, globalIndex: -1, selected: false, order_id: -1 })) }));
