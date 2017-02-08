"use strict";
const camelcase_1 = require("../pipes/camelcase");
const form3_1 = require("../components/form-controls/form3");
const application_form_main_1 = require("../components/student-application-form/application.form.main");
const students_list_1 = require("../components/students/students-list");
const home_1 = require("../components/home");
const course_fields_select_1 = require("../components/student-application-form/course.fields.select");
const sector_fields_select_1 = require("../components/student-application-form/sector.fields.select");
const region_schools_select_1 = require("../components/student-application-form/region.schools.select");
const sector_courses_select_1 = require("../components/student-application-form/sector.courses.select");
const application_preview_1 = require("../components/student-application-form/application.preview");
exports.MainRoutes = [
    { path: '', component: home_1.default },
    { path: 'form3', component: form3_1.default },
    { path: 'student-application-form-main', component: application_form_main_1.default },
    { path: 'students-list', component: students_list_1.default },
    { path: 'course-fields-select', component: course_fields_select_1.default },
    { path: 'class-fields-select', component: ClassFieldsSelect },
    { path: 'sector-fields-select', component: sector_fields_select_1.default },
    { path: 'region-schools-select', component: region_schools_select_1.default },
    { path: 'sectorcourses-fields-select', component: sector_courses_select_1.default },
    { path: 'application-preview', component: application_preview_1.default }
];
exports.MainDeclarations = [
    camelcase_1.CamelCasePipe,
    form3_1.default,
    students_list_1.default,
    home_1.default,
    course_fields_select_1.default,
    ClassFieldsSelect,
    sector_fields_select_1.default,
    region_schools_select_1.default,
    sector_courses_select_1.default,
    application_form_main_1.default,
    application_preview_1.default
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5yb3V0ZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYWluLnJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBS0Esa0RBQWlEO0FBQ2pELDZEQUFzRDtBQUN0RCx3R0FBa0c7QUFDbEcsd0VBQWdFO0FBQ2hFLDZDQUFzQztBQUN0QyxzR0FBNkY7QUFFN0Ysc0dBQTZGO0FBQzdGLHdHQUErRjtBQUMvRix3R0FBK0Y7QUFDL0Ysb0dBQTRGO0FBRS9FLFFBQUEsVUFBVSxHQUFXO0lBQ2hDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsY0FBSSxFQUFFO0lBQzdCLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsZUFBSyxFQUFFO0lBQ25DLEVBQUUsSUFBSSxFQUFFLCtCQUErQixFQUFFLFNBQVMsRUFBRSwrQkFBc0IsRUFBRTtJQUM1RSxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLHVCQUFZLEVBQUU7SUFDbEQsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLEVBQUUsU0FBUyxFQUFFLDhCQUFrQixFQUFFO0lBQy9ELEVBQUUsSUFBSSxFQUFFLHFCQUFxQixFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRTtJQUM3RCxFQUFFLElBQUksRUFBRSxzQkFBc0IsRUFBRSxTQUFTLEVBQUUsOEJBQWtCLEVBQUU7SUFDL0QsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLCtCQUFtQixFQUFFO0lBQ2pFLEVBQUUsSUFBSSxFQUFFLDZCQUE2QixFQUFFLFNBQVMsRUFBRSwrQkFBbUIsRUFBRTtJQUN2RSxFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBRSxTQUFTLEVBQUUsNkJBQWtCLEVBQUU7Q0FDL0QsQ0FBQztBQUVXLFFBQUEsZ0JBQWdCLEdBQUc7SUFDOUIseUJBQWE7SUFDYixlQUFLO0lBQ0wsdUJBQVk7SUFDWixjQUFJO0lBQ0osOEJBQWtCO0lBQ2xCLGlCQUFpQjtJQUNqQiw4QkFBa0I7SUFDbEIsK0JBQW1CO0lBQ25CLCtCQUFtQjtJQUNuQiwrQkFBc0I7SUFDdEIsNkJBQWtCO0NBQ25CLENBQUMifQ==