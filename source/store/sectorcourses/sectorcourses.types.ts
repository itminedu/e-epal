import { List } from "immutable";
import {TypedRecord} from "typed-immutable-record";

export interface ISector {
    sector_id: string;
    sector_name: string;
    sector_selected: boolean;
    courses: List<ISectorCourse>;
}

export interface ISectorCourse {
    course_id: string;
    course_name: string;
    globalIndex: number;
    selected: boolean;
}

export interface ISectorRecord extends TypedRecord<ISectorRecord>, ISector { };
export type ISectorRecords = List<ISectorRecord>;
export interface ISectorCourseRecord extends TypedRecord<ISectorCourseRecord>, ISectorCourse { };
export type ISectorCourseRecords = List<ISectorCourseRecord>;
