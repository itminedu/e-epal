"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const constants_1 = require("../constants");
const core_1 = require("@angular/core");
const ng2_redux_1 = require("ng2-redux");
const helper_data_service_1 = require("../services/helper-data-service");
let CourseFieldsActions = class CourseFieldsActions {
    constructor(_ngRedux, _hds) {
        this._ngRedux = _ngRedux;
        this._hds = _hds;
        this.getCourseFields = () => {
            const { courseFields } = this._ngRedux.getState();
            if (courseFields.size === 0) {
                return this._hds.getCourseFields().then(courseFields => {
                    return this._ngRedux.dispatch({
                        type: constants_1.COURSEFIELDS_RECEIVED,
                        payload: {
                            courseFields
                        }
                    });
                });
            }
        };
        this.saveCourseFieldsSelected = (courseFieldsSelected) => {
            return this._ngRedux.dispatch({
                type: constants_1.COURSEFIELDS_SELECTED_SAVE,
                payload: {
                    courseFieldsSelected
                }
            });
        };
    }
};
CourseFieldsActions = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [ng2_redux_1.NgRedux,
        helper_data_service_1.HelperDataService])
], CourseFieldsActions);
exports.CourseFieldsActions = CourseFieldsActions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291cnNlZmllbGRzLmFjdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb3Vyc2VmaWVsZHMuYWN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsNENBQWlGO0FBQ2pGLHdDQUEyQztBQUMzQyx5Q0FBb0M7QUFFcEMseUVBQW9FO0FBR3BFLElBQWEsbUJBQW1CLEdBQWhDO0lBQ0UsWUFDVSxRQUE0QixFQUM1QixJQUF1QjtRQUR2QixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixTQUFJLEdBQUosSUFBSSxDQUFtQjtRQUVqQyxvQkFBZSxHQUFHO1lBQ2hCLE1BQU0sRUFBRSxZQUFZLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2xELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVk7b0JBQ2hELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQzt3QkFDMUIsSUFBSSxFQUFFLGlDQUFxQjt3QkFDM0IsT0FBTyxFQUFFOzRCQUNMLFlBQVk7eUJBQ2Y7cUJBQ0osQ0FBQyxDQUFDO2dCQUNQLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztRQUNILENBQUMsQ0FBQztRQUVGLDZCQUF3QixHQUFHLENBQUMsb0JBQW9CO1lBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztnQkFDNUIsSUFBSSxFQUFFLHNDQUEwQjtnQkFDaEMsT0FBTyxFQUFFO29CQUNQLG9CQUFvQjtpQkFDckI7YUFDRixDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7SUF2QmtDLENBQUM7Q0F5QnRDLENBQUE7QUE1QlksbUJBQW1CO0lBRC9CLGlCQUFVLEVBQUU7cUNBR1MsbUJBQU87UUFDWCx1Q0FBaUI7R0FIdEIsbUJBQW1CLENBNEIvQjtBQTVCWSxrREFBbUIifQ==