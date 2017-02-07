import { ISectors, ISector, ISectorCourse } from './sectorcourses.types';

export function deimmutifySectorCourses(state: ISectors): ISector[] {
    let fetchedSectors =  new Array<ISector>();
    let i = 0;
    state.forEach(sector => {
        fetchedSectors.push(<ISector>{sector_id: sector.sector_id, sector_name: sector.sector_name, sector_selected: sector.sector_selected, courses: Array<ISectorCourse>()});
        sector.courses.forEach(course => {
            fetchedSectors[i].courses.push(<ISectorCourse>{course_id: course.course_id, course_name: course.course_name, globalIndex: course.globalIndex, selected: course.selected})
        });
        i++;
    });
    return fetchedSectors;
};
