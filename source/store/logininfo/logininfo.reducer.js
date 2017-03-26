"use strict";
const logininfo_initial_state_1 = require("./logininfo.initial-state");
const immutable_1 = require("immutable");
const constants_1 = require("../../constants");
function loginInfoReducer(state = logininfo_initial_state_1.LOGININFO_INITIAL_STATE, action) {
    switch (action.type) {
        case constants_1.LOGININFO_SAVE:
            let loginInfoTokens = Array();
            let i = 0;
            action.payload.loginInfos.forEach(loginInfo => {
                loginInfoTokens.push({ auth_token: loginInfo.auth_token, auth_role: loginInfo.auth_role, cu_name: loginInfo.cu_name });
                i++;
            });
            return immutable_1.Seq(loginInfoTokens).map(n => n).toList();
        case constants_1.LOGININFO_INIT:
            return logininfo_initial_state_1.LOGININFO_INITIAL_STATE;
        default:
            return state;
    }
}
exports.loginInfoReducer = loginInfoReducer;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW5pbmZvLnJlZHVjZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsb2dpbmluZm8ucmVkdWNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsdUVBQW9FO0FBQ3BFLHlDQUFnQztBQUVoQywrQ0FHeUI7QUFFekIsMEJBQWlDLFFBQW9CLGlEQUF1QixFQUFFLE1BQU07SUFDbEYsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEIsS0FBSywwQkFBYztZQUNyQixJQUFJLGVBQWUsR0FBRyxLQUFLLEVBQW1CLENBQUM7WUFDekMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxDQUFDO1lBQ1IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVM7Z0JBQ3ZDLGVBQWUsQ0FBQyxJQUFJLENBQWtCLEVBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDO2dCQUN0SSxDQUFDLEVBQUUsQ0FBQztZQUNSLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLGVBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRXJELEtBQUssMEJBQWM7WUFDZixNQUFNLENBQUMsaURBQXVCLENBQUM7UUFDbkM7WUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ25CLENBQUM7QUFDSCxDQUFDO0FBaEJELDRDQWdCQztBQUFBLENBQUMifQ==