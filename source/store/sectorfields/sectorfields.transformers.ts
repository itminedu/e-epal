import { ISectorFields, ISectorField } from './sectorfields.types';

export function deimmutifySectorFields(state: ISectorFields): ISectorField[] {
    let fetchedSectorFields = new Array();
    state.forEach(sectorField => {
        fetchedSectorFields.push(<ISectorField>{id: sectorField.id, name: sectorField.name, selected: sectorField.selected});
    });
    return fetchedSectorFields;
};

/* export function reimmutifyCourseFields(plain): ICourseFields {
  return List<ICourseField>(plain ? plain.map(CourseFieldRecord) : []);
} */
