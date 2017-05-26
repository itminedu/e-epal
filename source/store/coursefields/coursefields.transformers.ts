import { ICourseFields, ICourseField } from './coursefields.types';

export function deimmutifyCourseFields(state: ICourseFields): ICourseField[] {
    let fetchedCourseFields = new Array();
    state.forEach(courseField => {
        fetchedCourseFields.push(<ICourseField>{id: courseField.id, name: courseField.name, selected: courseField.selected});
    });
    return fetchedCourseFields;
};

/* export function reimmutifyCourseFields(plain): ICourseFields {
  return List<ICourseField>(plain ? plain.map(CourseFieldRecord) : []);
} */
