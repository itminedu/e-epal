import { List, Map } from 'immutable';
import {TypedRecord} from 'typed-immutable-record';

export interface IRRegion {
    region_id: string;
    region_name: string;
    epals: IRRegionSchool[];
}

export interface IRRegionSchool {
    epal_id: string;
    epal_name: string;
    epal_special_case: string;
    globalIndex: number;
    selected: boolean;
    order_id: number;
}

export interface IRegionRecord extends TypedRecord<IRegionRecord>, IRRegion {};
export interface IRegionSchoolRecord extends TypedRecord<IRegionSchoolRecord>, IRRegionSchool {};
export type IRegionSchoolRecords = IRegionSchoolRecord[];


export interface Region {
    region_id: string;
    region_name: string;
    epals: RegionSchool[];
}

export interface RegionSchool {
    epal_id: string;
    epal_name: string;
    epal_special_case: string;
    globalIndex: number;
    selected: boolean;
    order_id: number;
}

export interface IRegion {
    region_id: string;
    region_name: string;
    epals: IRegionSchools;
}

export type IRegions = List<IRegionM>;
// export type IRegionM = Map<IRegion>;
export type IRegionM = Map<string, IRegion>;
export type IRegionSchoolM = Map<string, RegionSchool>;
export type IRegionSchools = List<RegionSchool>;
