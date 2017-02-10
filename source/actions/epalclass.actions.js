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
let EpalClassesActions = class EpalClassesActions {
    constructor(_ngRedux) {
        this._ngRedux = _ngRedux;
        this.saveEpalClassesSelected = (epalClasses) => {
            return this._ngRedux.dispatch({
                type: constants_1.EPALCLASSES_SAVE,
                payload: {
                    epalClasses
                }
            });
        };
    }
};
EpalClassesActions = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [ng2_redux_1.NgRedux])
], EpalClassesActions);
exports.EpalClassesActions = EpalClassesActions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXBhbGNsYXNzLmFjdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlcGFsY2xhc3MuYWN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsNENBQXNFO0FBQ3RFLHdDQUEyQztBQUMzQyx5Q0FBb0M7QUFLcEMsSUFBYSxrQkFBa0IsR0FBL0I7SUFDRSxZQUNVLFFBQTRCO1FBQTVCLGFBQVEsR0FBUixRQUFRLENBQW9CO1FBR3RDLDRCQUF1QixHQUFHLENBQUMsV0FBVztZQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7Z0JBQzVCLElBQUksRUFBRSw0QkFBZ0I7Z0JBQ3RCLE9BQU8sRUFBRTtvQkFDUCxXQUFXO2lCQUNaO2FBQ0YsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDO0lBVnVDLENBQUM7Q0FZM0MsQ0FBQTtBQWRZLGtCQUFrQjtJQUQ5QixpQkFBVSxFQUFFO3FDQUdTLG1CQUFPO0dBRmhCLGtCQUFrQixDQWM5QjtBQWRZLGdEQUFrQiJ9