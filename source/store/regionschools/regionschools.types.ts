import { List, Map } from "immutable";
import {TypedRecord} from "typed-immutable-record";

export interface IRRegion {
    region_id: string;
    region_name: string;
    epals: List<IRRegionSchool>;
}

export interface IRRegionSchool {
    epal_id: string;
    epal_name: string;
    epal_special_case: string;
    globalIndex: number;
    selected: boolean;
    order_id: number;
}

export interface IRegionRecord extends TypedRecord<IRegionRecord>, IRRegion { };
export type IRegionRecords = List<IRegionRecord>;
export interface IRegionSchoolRecord extends TypedRecord<IRegionSchoolRecord>, IRRegionSchool { };
export type IRegionSchoolRecords = List<IRegionSchoolRecord>;
