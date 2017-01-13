import { List } from 'immutable';

export interface ICourseField {
    id: number;
    name: string;
    selected: boolean;
}

export type ICourseFields = List<ICourseField>;

/* export const CourseFieldRecord = Record({
  id: 0,
  name: '---',
  selected: 0
}); */
