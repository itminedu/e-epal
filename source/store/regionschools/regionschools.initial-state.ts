import { List } from "immutable";
import { IRegionRecord, IRRegion, IRRegionSchool, IRegionSchoolRecord, IRegionSchoolRecords } from "./regionschools.types";
import {recordify} from "typed-immutable-record";

export const REGION_SCHOOLS_INITIAL_STATE = List<IRegionRecord>();
