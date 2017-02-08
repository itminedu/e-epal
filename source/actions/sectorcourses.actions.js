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
let SectorCoursesActions = class SectorCoursesActions {
    constructor(_ngRedux, _hds) {
        this._ngRedux = _ngRedux;
        this._hds = _hds;
        this.getSectorCourses = () => {
            const { sectors } = this._ngRedux.getState();
            if (sectors.size === 0) {
                return this._hds.getSectorsWithCourses().then(sectors => {
                    return this._ngRedux.dispatch({
                        type: constants_1.SECTORCOURSES_RECEIVED,
                        payload: {
                            sectors
                        }
                    });
                });
            }
        };
        this.saveSectorCoursesSelected = (sectorCoursesSelected) => {
            return this._ngRedux.dispatch({
                type: constants_1.SECTORCOURSES_SELECTED_SAVE,
                payload: {
                    sectorCoursesSelected
                }
            });
        };
    }
};
SectorCoursesActions = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [ng2_redux_1.NgRedux,
        helper_data_service_1.HelperDataService])
], SectorCoursesActions);
exports.SectorCoursesActions = SectorCoursesActions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdG9yY291cnNlcy5hY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VjdG9yY291cnNlcy5hY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSw0Q0FBbUY7QUFDbkYsd0NBQTJDO0FBQzNDLHlDQUFvQztBQUVwQyx5RUFBb0U7QUFHcEUsSUFBYSxvQkFBb0IsR0FBakM7SUFDRSxZQUNVLFFBQTRCLEVBQzVCLElBQXVCO1FBRHZCLGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQzVCLFNBQUksR0FBSixJQUFJLENBQW1CO1FBRWpDLHFCQUFnQixHQUFHO1lBQ2pCLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzdDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTztvQkFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO3dCQUMxQixJQUFJLEVBQUUsa0NBQXNCO3dCQUM1QixPQUFPLEVBQUU7NEJBQ0wsT0FBTzt5QkFDVjtxQkFDSixDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsOEJBQXlCLEdBQUcsQ0FBQyxxQkFBcUI7WUFDOUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO2dCQUM1QixJQUFJLEVBQUUsdUNBQTJCO2dCQUNqQyxPQUFPLEVBQUU7b0JBQ1AscUJBQXFCO2lCQUN0QjthQUNGLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQztJQXZCa0MsQ0FBQztDQXlCdEMsQ0FBQTtBQTVCWSxvQkFBb0I7SUFEaEMsaUJBQVUsRUFBRTtxQ0FHUyxtQkFBTztRQUNYLHVDQUFpQjtHQUh0QixvQkFBb0IsQ0E0QmhDO0FBNUJZLG9EQUFvQiJ9