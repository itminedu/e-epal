"use strict";
function deimmutifySectorCourses(state) {
    let fetchedSectors = new Array();
    let i = 0;
    state.forEach(sector => {
        fetchedSectors.push({ sector_id: sector.sector_id, sector_name: sector.sector_name, sector_selected: sector.sector_selected, courses: Array() });
        sector.courses.forEach(course => {
            fetchedSectors[i].courses.push({ course_id: course.course_id, course_name: course.course_name, globalIndex: course.globalIndex, selected: course.selected });
        });
        i++;
    });
    return fetchedSectors;
}
exports.deimmutifySectorCourses = deimmutifySectorCourses;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdG9yY291cnNlcy50cmFuc2Zvcm1lcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZWN0b3Jjb3Vyc2VzLnRyYW5zZm9ybWVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsaUNBQXdDLEtBQWU7SUFDbkQsSUFBSSxjQUFjLEdBQUksSUFBSSxLQUFLLEVBQVcsQ0FBQztJQUMzQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDVixLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU07UUFDaEIsY0FBYyxDQUFDLElBQUksQ0FBVSxFQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLENBQUMsZUFBZSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQWlCLEVBQUMsQ0FBQyxDQUFDO1FBQ3ZLLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU07WUFDekIsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQWdCLEVBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUMsQ0FBQyxDQUFBO1FBQzdLLENBQUMsQ0FBQyxDQUFDO1FBQ0gsQ0FBQyxFQUFFLENBQUM7SUFDUixDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxjQUFjLENBQUM7QUFDMUIsQ0FBQztBQVhELDBEQVdDO0FBQUEsQ0FBQyJ9