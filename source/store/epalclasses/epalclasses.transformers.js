"use strict";
function deimmutifyEpalClasses(state) {
    let fetchedEpalClasses = new Array();
    state.forEach(epalclass => {
        fetchedEpalClasses.push({ name: epalclass.name });
    });
    return fetchedEpalClasses;
}
exports.deimmutifyEpalClasses = deimmutifyEpalClasses;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXBhbGNsYXNzZXMudHJhbnNmb3JtZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXBhbGNsYXNzZXMudHJhbnNmb3JtZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSwrQkFBc0MsS0FBbUI7SUFDckQsSUFBSSxrQkFBa0IsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0lBQ3JDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUztRQUNuQixrQkFBa0IsQ0FBQyxJQUFJLENBQWEsRUFBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBQyxDQUFDLENBQUM7SUFDaEUsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsa0JBQWtCLENBQUM7QUFDOUIsQ0FBQztBQU5ELHNEQU1DO0FBQUEsQ0FBQyJ9