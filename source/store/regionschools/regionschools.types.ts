import { List } from 'immutable';

export interface IRegion {
    region_id: string;
    region_name: string;
    epals: IRegionSchool[];
}

export interface IRegionSchool {
    epal_id: string;
    epal_name: string;
    globalIndex: number;
    selected: boolean;
    order_id: number;
}

export type IRegions = List<IRegion>;
