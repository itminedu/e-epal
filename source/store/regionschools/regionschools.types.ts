import { List, Map } from 'immutable';


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
export type IRegionSchools = Map<string, List<IRegionSchoolM>>;
