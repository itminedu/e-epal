import { List, Record } from 'immutable';

export interface ICourseField {
    id: number;
    name: string;
}

export type ICourseFields = List<ICourseField>;

export const CourseFieldRecord = Record({
  id: 1,
  name: '-',
});
