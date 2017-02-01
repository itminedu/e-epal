import { List } from 'immutable';

export interface ISector {
    sector_id: string;
    sector_name: string;
    sector_selected: boolean;
    courses: ISectorCourse[];
}

export interface ISectorCourse {
    course_id: string;
    course_name: string;
    globalIndex: number;
    selected: boolean;
}

export type ISectors = List<ISector>;
