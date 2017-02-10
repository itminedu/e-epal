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
let StudentDataFieldsActions = class StudentDataFieldsActions {
    constructor(_ngRedux) {
        this._ngRedux = _ngRedux;
        this.saveStudentDataFields = (studentDataFields) => {
            return this._ngRedux.dispatch({
                type: constants_1.STUDENTDATAFIELDS_SAVE,
                payload: {
                    studentDataFields
                }
            });
        };
    }
};
StudentDataFieldsActions = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [ng2_redux_1.NgRedux])
], StudentDataFieldsActions);
exports.StudentDataFieldsActions = StudentDataFieldsActions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R1ZGVudGRhdGFmaWVsZHMuYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0dWRlbnRkYXRhZmllbGRzLmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDRDQUFrRjtBQUNsRix3Q0FBMkM7QUFDM0MseUNBQW9DO0FBT3BDLElBQWEsd0JBQXdCLEdBQXJDO0lBQ0UsWUFDVSxRQUE0QjtRQUE1QixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUV0QywwQkFBcUIsR0FBRyxDQUFDLGlCQUFpQjtZQUV0QyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7Z0JBQzVCLElBQUksRUFBRSxrQ0FBc0I7Z0JBQzVCLE9BQU8sRUFBRTtvQkFDUCxpQkFBaUI7aUJBQ2xCO2FBRUYsQ0FBQyxDQUFDO1FBRVAsQ0FBQyxDQUFDO0lBWnVDLENBQUM7Q0FjM0MsQ0FBQTtBQWhCWSx3QkFBd0I7SUFEcEMsaUJBQVUsRUFBRTtxQ0FHUyxtQkFBTztHQUZoQix3QkFBd0IsQ0FnQnBDO0FBaEJZLDREQUF3QiJ9